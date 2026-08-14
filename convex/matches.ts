import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";
import { requireAnyRole } from "./lib/roles";

const REQUEST_STATUS = v.union(
  v.literal("suggested"),
  v.literal("viewed"),
  v.literal("accepted"),
  v.literal("rejected"),
);

/** Matches for one request, best match first (requester/admin view). */
export const listByJob = query({
  args: { jobRequestId: v.id("jobRequests") },
  handler: async (ctx, { jobRequestId }) => {
    const rows = await ctx.db
      .query("matches")
      .withIndex("byJob", (q) => q.eq("jobRequestId", jobRequestId))
      .collect();
    return rows.sort((a, b) => b.totalScore - a.totalScore);
  },
});

/** The current student's recommended matches, best first. */
export const listForStudent = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    const rows = await ctx.db
      .query("matches")
      .withIndex("byStudent", (q) => q.eq("studentId", user._id))
      .collect();
    return rows.sort((a, b) => b.totalScore - a.totalScore);
  },
});

/** Requester/admin changes a match's status (viewed/accepted/rejected). */
export const updateStatus = mutation({
  args: {
    matchId: v.id("matches"),
    status: REQUEST_STATUS,
  },
  handler: async (ctx, { matchId, status }) => {
    const user = await requireAnyRole(ctx, ["requester", "admin"]);
    const match = await ctx.db.get("matches", matchId);
    if (!match) throw new Error("Match not found");
    const request = await ctx.db.get("jobRequests", match.jobRequestId);
    if (!request) throw new Error("Job request not found");
    if (request.requesterId !== user._id && user.role !== "admin") {
      throw new Error("Not authorized");
    }
    await ctx.db.patch("matches", matchId, { status });
    return await ctx.db.get("matches", matchId);
  },
});
/**
 * (Re)computes match rows for a job request against every student profile:
 * scores skill overlap, availability, experience, rating, location, and
 * optionally budget, then writes a weighted total with a reason string.
 * Owner or admin only.
 */
export const generate = mutation({
  args: { jobRequestId: v.id("jobRequests") },
  handler: async (ctx, { jobRequestId }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const request = await ctx.db.get("jobRequests", jobRequestId);
    if (!request) throw new Error("Job request not found");
    if (request.requesterId !== user._id && user.role !== "admin") {
      throw new Error("Not authorized");
    }

    const ai = await ctx.db
      .query("aiRequirements")
      .withIndex("byJob", (q) => q.eq("jobRequestId", jobRequestId))
      .first();
    const requiredSkillIds = new Set(ai?.requiredSkills ?? []);
    const category = ai?.category ?? request.category;
    const budgetMax = request.budgetMax ?? request.budgetMin;

    const profiles = await ctx.db.query("studentProfiles").collect();
    const skillLinks = await ctx.db.query("studentSkills").collect();
    const linksByStudent = new Map<string, typeof skillLinks[number][]>();
    for (const link of skillLinks) {
      const arr = linksByStudent.get(link.studentId) ?? [];
      arr.push(link);
      linksByStudent.set(link.studentId, arr);
    }

    const skillNames = new Map<string, string>();
    for (const id of requiredSkillIds) {
      const skill = await ctx.db.get("skills", id);
      if (skill) skillNames.set(id, skill.name);
    }

    const now = Date.now();
    const results: { studentId: string; totalScore: number }[] = [];

    for (const profile of profiles) {
      const linked = linksByStudent.get(profile.userId) ?? [];
      const linkedSkillIds = new Set(linked.map((l) => l.skillId));

      let skillScore = 0;
      let matchCount = 0;
      if (requiredSkillIds.size > 0) {
        matchCount = [...requiredSkillIds].filter((id) => linkedSkillIds.has(id)).length;
        skillScore = matchCount / requiredSkillIds.size;
      } else if (category) {
        // No explicit AI skills; weight every student equally on the category.
        skillScore = 0.5;
      }

      const availabilityScore =
        profile.availability === "available" ? 1 :
        profile.availability === "busy" ? 0.5 : 0;

      const experienceScore =
        profile.experienceLevel === "advanced" ? 1 :
        profile.experienceLevel === "intermediate" ? 0.7 : 0.4;

      const ratingScore =
        profile.averageRating > 0 ? Math.min(profile.averageRating / 5, 1) : 0.3;

      let locationScore = 0.5;
      if (request.isRemote) {
        locationScore = 1;
      } else if (request.location) {
        const student = await ctx.db.get("users", profile.userId);
        locationScore = student?.location === request.location ? 1 : 0.6;
      }

      let budgetScore: number | undefined;
      if (budgetMax !== undefined && profile.hourlyRate !== undefined) {
        budgetScore =
          profile.hourlyRate <= budgetMax
            ? 1
            : Math.max(0, 1 - (profile.hourlyRate - budgetMax) / budgetMax);
      }
      const total = totalScore({
        skillScore,
        availabilityScore,
        experienceScore,
        ratingScore,
        locationScore,
        budgetScore,
      });

      const matchedNames = [...requiredSkillIds]
        .filter((id) => linkedSkillIds.has(id))
        .map((id) => skillNames.get(id) ?? id);
      const reason = buildReason({
        matchCount,
        requiredCount: requiredSkillIds.size,
        matchedNames,
        category,
        availabilityScore,
        locationScore,
        budgetScore,
      });

      const existing = await ctx.db
        .query("matches")
        .withIndex("byJob", (q) => q.eq("jobRequestId", jobRequestId))
        .collect();

      const prior = existing.find((m) => m.studentId === profile.userId);
      if (prior) {
        await ctx.db.patch("matches", prior._id, {
          skillScore,
          availabilityScore,
          experienceScore,
          ratingScore,
          locationScore,
          budgetScore,
          totalScore: total,
          matchReason: reason,
        });
      } else {
        await ctx.db.insert("matches", {
          jobRequestId,
          studentId: profile.userId,
          skillScore,
          availabilityScore,
          experienceScore,
          ratingScore,
          locationScore,
          budgetScore,
          totalScore: total,
          matchReason: reason,
          status: "suggested",
          createdAt: now,
        });
      }
      results.push({ studentId: profile.userId, totalScore: total });
    }

    await ctx.db.patch("jobRequests", jobRequestId, {
      status: "matching",
      updatedAt: now,
    });
    return results.sort((a, b) => b.totalScore - a.totalScore);
  },
});

interface ScoreArgs {
  skillScore: number;
  availabilityScore: number;
  experienceScore: number;
  ratingScore: number;
  locationScore: number;
  budgetScore?: number;
}

function totalScore(s: ScoreArgs): number {
  if (s.budgetScore === undefined) {
    return Math.round(
      s.skillScore * 0.4 +
        s.availabilityScore * 0.2 +
        s.experienceScore * 0.15 +
        s.ratingScore * 0.1 +
        s.locationScore * 0.15,
    );
  }
  return Math.round(
    s.skillScore * 0.3 +
      s.availabilityScore * 0.2 +
      s.experienceScore * 0.15 +
      s.ratingScore * 0.1 +
      s.locationScore * 0.1 +
      s.budgetScore * 0.15,
  );
}

function buildReason(args: {
  matchCount: number;
  requiredCount: number;
  matchedNames: string[];
  category?: string;
  availabilityScore: number;
  locationScore: number;
  budgetScore?: number;
}): string {
  const parts: string[] = [];
  if (args.requiredCount > 0) {
    parts.push(
      args.matchCount > 0
        ? `Matches ${args.matchCount}/${args.requiredCount} required skill${args.matchCount > 1 ? "s" : ""}${args.matchedNames.length ? ` (${args.matchedNames.join(", ")})` : ""}`
        : "No required skill overlap",
    );
  } else if (args.category) {
    parts.push(`Open to ${args.category} work`);
  }
  if (args.availabilityScore >= 0.5) parts.push("Available");
  if (args.locationScore >= 0.6) parts.push("Good location fit");
  if (args.budgetScore !== undefined && args.budgetScore >= 0.8) parts.push("Within budget");
  return parts.join(" · ") || "General fit";
}