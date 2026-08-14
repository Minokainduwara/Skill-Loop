import { mutation, query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";

/*
 * Real, database-backed read models for the demo dashboard pages
 * (AI Match, Demand Cluster, Skill Demand).
 *
 * These used to be backed by hard-coded mock arrays in `dashboardMock.ts`.
 * Every value below is computed from live records (jobRequests, matches,
 * studentProfiles, studentSkills, aiRequirements, demandSignals, ...).
 */
export const getClusters = query({
  args: {},
  handler: async (ctx) => {
    const open = await ctx.db.query("jobRequests").collect();
    const rows = open.filter((r) => r.status === "open" || r.status === "matching");

    const byCat = new Map<string, Doc<"jobRequests">[]>();
    for (const r of rows) {
      const cat = r.category || "General";
      const arr = byCat.get(cat) ?? [];
      arr.push(r);
      byCat.set(cat, arr);
    }

    const clusters: {
      key: string;
      name: string;
      emoji: string;
      requests: number;
      value: number;
      students: number;
      x: number;
      y: number;
      level: "HIGH" | "MEDIUM" | "LOW";
      area: string;
      skills: string[];
    }[] = [];

    for (const [cat, arr] of byCat) {
      const requests = arr.length;
      const value = arr.reduce((sum, r) => sum + (r.budgetMax ?? r.budgetMin ?? 0), 0);
      clusters.push({
        key: slug(cat),
        name: cat,
        emoji: emojiForCategory(cat),
        requests,
        value,
        students: await countStudentsForSkills(ctx, await skillsForRequests(ctx, arr)),
        x: 20 + (hash(cat) % 60),
        y: 20 + ((hash(cat) >> 4) % 60),
        level: requests >= 5 ? "HIGH" : requests >= 2 ? "MEDIUM" : "LOW",
        area: "Peradeniya",
        skills: await skillNamesForRequests(ctx, arr),
      });
    }

    clusters.sort((a, b) => b.requests - a.requests);
    if (clusters.length === 0) {
      return [{
        key: "general", name: "General", emoji: "✨", requests: 0, value: 0,
        students: 0, x: 50, y: 50, level: "LOW" as const, area: "Peradeniya", skills: [],
      }];
    }
    return clusters;
  },
});

/** Live anonymous request feed (used by the radar page). */
export const getRequests = query({
  args: {},
  handler: async (ctx) => {
    const requests = await ctx.db.query("jobRequests").collect();
    requests.sort((a, b) => b.createdAt - a.createdAt);
    const open = requests
      .filter((r) => r.status === "open" || r.status === "matching")
      .slice(0, 6);
    return open.map((r) => ({
      text: r.description,
      hint: r.category || "General Need",
      area: r.location || (r.isRemote ? "Remote" : "Nearby"),
      time: relativeTime(r.createdAt),
    }));
  },
});

/** Request-level context for the AI Match header. */
export const getRequestDetails = query({
  args: { jobId: v.optional(v.id("jobRequests")) },
  handler: async (ctx, { jobId }) => {
    const target = await resolveJobRequestId(ctx, jobId);
    if (!target) return null;
    const request = await ctx.db.get("jobRequests", target);
    if (!request) return null;
    const requester = await ctx.db.get("users", request.requesterId);
    const mins = Math.max(1, Math.round((Date.now() - request.createdAt) / 60000));
    return {
      id: request._id,
      title: request.title,
      description: request.description,
      requester: requester?.username ?? "Requester",
      area: request.location || (request.isRemote ? "Remote" : "Peradeniya"),
      budget: request.budgetMax ?? request.budgetMin ?? 0,
      deadlineDays: request.deadline ? Math.max(0, Math.round((request.deadline - Date.now()) / 86400000)) : null,
      postedLabel: mins < 60 ? `${mins} min ago` : `${Math.round(mins / 60)}h ago`,
    };
  },
});

/** Skill names required by a request (from the AI requirement analysis). */
export const getJobRequirements = query({
  args: { jobId: v.optional(v.id("jobRequests")) },
  handler: async (ctx, { jobId }) => {
    const target = await resolveJobRequestId(ctx, jobId);
    if (!target) return [];
    const ai = await ctx.db
      .query("aiRequirements")
      .withIndex("byJob", (q) => q.eq("jobRequestId", target))
      .first();
    const names: string[] = [];
    for (const id of ai?.requiredSkills ?? []) {
      const n = await skillName(ctx, id);
      if (n && !names.includes(n)) names.push(n);
    }
    if (names.length) return names;
    const request = await ctx.db.get("jobRequests", target);
    if (request?.category) return [request.category];
    return [];
  },
});

/** Ranked candidates for a request, built from stored match rows + student data. */
export const getBestCandidates = query({
  args: { jobId: v.optional(v.id("jobRequests")) },
  handler: async (ctx, { jobId }) => {
    const target = await resolveJobRequestId(ctx, jobId);
    if (!target) return [];

    const matches = await ctx.db
      .query("matches")
      .withIndex("byJob", (q) => q.eq("jobRequestId", target))
      .collect();
    matches.sort((a, b) => b.totalScore - a.totalScore);

    const out: {
      id: string;
      name: string;
      program: string;
      rank: number;
      match: number;
      skills: string[];
      rating: number;
      earned: number;
      jobs: number;
      note: string;
    }[] = [];

    for (let i = 0; i < Math.min(matches.length, 5); i++) {
      const m = matches[i];
      const student = await ctx.db.get("users", m.studentId);
      if (!student) continue;
      const profile = await ctx.db
        .query("studentProfiles")
        .withIndex("byUser", (q) => q.eq("userId", student._id))
        .unique();
      const links = await ctx.db
        .query("studentSkills")
        .withIndex("byStudent", (q) => q.eq("studentId", student._id))
        .collect();
      const skills: string[] = [];
      for (const link of links.slice(0, 5)) {
        const n = await skillName(ctx, link.skillId);
        if (n) skills.push(n);
      }
      out.push({
        id: student._id,
        name: student.username,
        program: profile?.degree || profile?.faculty || profile?.university || "SkillLoop Student",
        rank: i + 1,
        match: Math.max(0, Math.min(100, Math.round(m.totalScore * 100))),
        skills,
        rating: profile?.averageRating ?? 0,
        earned: profile?.totalEarnings ?? 0,
        jobs: profile?.completedJobs ?? 0,
        note: m.matchReason ?? "Ranked by SkillLoop's weighted matching engine.",
      });
    }
    return out;
  },
});

/** Grouped open requests (one demand cluster) with its skills and student pool. */
export const getClusterDetails = query({
  args: { clusterId: v.optional(v.string()) },
  handler: async (ctx, { clusterId }) => {
    const open = await ctx.db.query("jobRequests").collect();
    const counts = open.filter((r) => r.status === "open" || r.status === "matching");
    const byCat = new Map<string, Doc<"jobRequests">[]>();
    for (const r of counts) {
      const cat = r.category || "General";
      const arr = byCat.get(cat) ?? [];
      arr.push(r);
      byCat.set(cat, arr);
    }
    const entries = Array.from(byCat.entries());
    if (!entries.length) return { requests: [], skills: [], students: 0 };

    let cat = entries[0][0];
    if (clusterId) {
      const match = entries.find(([c]) => slug(c) === clusterId);
      if (match) cat = match[0];
    }

    const cluster = (byCat.get(cat) ?? []).sort((a, b) => b.createdAt - a.createdAt).slice(0, 8);

    const requests: {
      id: Id<"jobRequests">;
      title: string;
      budget: number;
      requester: string;
      distance: string;
      deadline: string;
    }[] = [];
    const skillIds = new Set<Id<"skills">>();
    for (const r of cluster) {
      const requester = await ctx.db.get("users", r.requesterId);
      const ai = await ctx.db
        .query("aiRequirements")
        .withIndex("byJob", (q) => q.eq("jobRequestId", r._id))
        .first();
      for (const sid of ai?.requiredSkills ?? []) skillIds.add(sid);
      requests.push({
        id: r._id,
        title: r.title,
        budget: r.budgetMax ?? r.budgetMin ?? 0,
        requester: requester?.username ?? "Requester",
        distance: r.location || (r.isRemote ? "Remote" : "Nearby"),
        deadline: r.deadline ? `${Math.max(0, Math.round((r.deadline - Date.now()) / 86400000))} days` : "Flexible",
      });
    }

    const skills: string[] = [];
    for (const sid of skillIds) {
      const n = await skillName(ctx, sid);
      if (n && !skills.includes(n)) skills.push(n);
    }
    if (!skills.length) skills.push(cat);

    return { requests, skills, students: await countStudentsForSkills(ctx, Array.from(skillIds)) };
  },
});

/** Whether the current student already expressed interest (applied) in a cluster. */
export const getInterestState = query({
  args: { clusterId: v.optional(v.string()) },
  handler: async (ctx, { clusterId }) => {
    const requestIds = await clusterRequestIds(ctx, clusterId);
    if (!requestIds.length) return false;
    const user = await getCurrentUserOrThrow(ctx);
    const apps = await ctx.db
      .query("applications")
      .withIndex("byStudent", (q) => q.eq("studentId", user._id))
      .collect();
    return apps.some((a) => requestIds.includes(a.jobRequestId));
  },
});

/** Records interest by applying to the open requests in a cluster. */
export const expressInterest = mutation({
  args: { clusterId: v.optional(v.string()) },
  handler: async (ctx, { clusterId }) => {
    const requestIds = await clusterRequestIds(ctx, clusterId);
    if (!requestIds.length) return false;
    const user = await getCurrentUserOrThrow(ctx);
    const mine = await ctx.db
      .query("applications")
      .withIndex("byStudent", (q) => q.eq("studentId", user._id))
      .collect();
    const appliedIds = new Set(mine.map((a) => a.jobRequestId));
    const now = Date.now();
    for (const rid of requestIds) {
      if (appliedIds.has(rid)) continue;
      const req = await ctx.db.get("jobRequests", rid);
      if (!req || (req.status !== "open" && req.status !== "matching")) continue;
      await ctx.db.insert("applications", {
        jobRequestId: rid,
        studentId: user._id,
        proposal: "Interested in this opportunity cluster.",
        status: "pending",
        createdAt: now,
        updatedAt: now,
      });
    }
    return true;
  },
});

/** Demand ranking from the live `demandSignals` table. */
export const getSkillDemand = query({
  args: {},
  handler: async (ctx) => {
    const signals = await ctx.db.query("demandSignals").collect();
    signals.sort((a, b) => b.requestCount - a.requestCount);

    const userSkillNames = new Set<string>();
    try {
      const user = await getCurrentUserOrThrow(ctx);
      const links = await ctx.db
        .query("studentSkills")
        .withIndex("byStudent", (q) => q.eq("studentId", user._id))
        .collect();
      for (const link of links) {
        const n = await skillName(ctx, link.skillId);
        if (n) userSkillNames.add(n);
      }
    } catch {
      // Unauthenticated or empty DB -> no personal-skill markers.
    }

    const rows: {
      rank: number;
      skill: string;
      category: string;
      requests: number;
      growth: number;
      budget: number;
      students: number;
      level: "High" | "Medium" | "Low";
      spark: number[];
    }[] = [];

    for (let i = 0; i < signals.length; i++) {
      const s = signals[i];
      const skillId = s.skillId;
      const skill = skillId ? await ctx.db.get("skills", skillId) : null;
      const name = skill?.name ?? s.category;
      const students = skillId
        ? (await ctx.db.query("studentSkills").withIndex("bySkill", (q) => q.eq("skillId", skillId)).collect()).length
        : 0;
      rows.push({
        rank: i + 1,
        skill: name,
        category: s.category,
        requests: s.requestCount,
        growth: s.requestCount > 0 ? Math.min(100, Math.round((s.unfulfilledCount / s.requestCount) * 100)) : 0,
        budget: s.requestCount > 0 ? Math.round(s.totalPotentialValue / s.requestCount) : 0,
        students,
        level: s.demandLevel === "very_high" || s.demandLevel === "high" ? "High" : s.demandLevel === "medium" ? "Medium" : "Low",
        spark: sparkSeries(s.requestCount),
      });
    }

    const gap = rows.slice(0, 6).map((r) => ({ skill: r.skill, you: userSkillNames.has(r.skill) }));
    const categories = ["All", ...Array.from(new Set(signals.map((s) => s.category)))];
    return { rows, gap, categories };
  },
});

/* ---------------------------------------------------------------- helpers */

interface Dbish {
  db: QueryCtx["db"];
}

const slug = (s: string): string => s.trim().toLowerCase().replace(/\s+/g, "-");

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function emojiForCategory(cat: string): string {
  const lc = cat.toLowerCase();
  if (lc.includes("design")) return "🎨";
  if (lc.includes("video") || lc.includes("edit")) return "🎬";
  if (lc.includes("web") || lc.includes("dev") || lc.includes("code")) return "💻";
  if (lc.includes("tutor") || lc.includes("edu")) return "📚";
  if (lc.includes("photo")) return "📷";
  if (lc.includes("social") || lc.includes("market")) return "📱";
  if (lc.includes("writing") || lc.includes("content")) return "✍️";
  return "✨";
}

function relativeTime(ts: number): string {
  const mins = Math.max(1, Math.round((Date.now() - ts) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  return `${Math.round(hrs / 24)} day${hrs >= 48 ? "s" : ""} ago`;
}

async function skillName(ctx: Dbish, id: Id<"skills">): Promise<string> {
  const skill = await ctx.db.get("skills", id);
  return skill?.name ?? "";
}

async function resolveJobRequestId(ctx: Dbish, jobId?: Id<"jobRequests">): Promise<Id<"jobRequests"> | undefined> {
  if (jobId) return jobId;
  const all = await ctx.db.query("jobRequests").collect();
  const open = all.filter((r) => r.status === "open" || r.status === "matching").sort((a, b) => b.createdAt - a.createdAt);
  if (open.length) return open[0]._id;
  all.sort((a, b) => b.createdAt - a.createdAt);
  return all[0]?._id;
}

async function clusterRequestIds(ctx: Dbish, clusterId?: string): Promise<Id<"jobRequests">[]> {
  const all = await ctx.db.query("jobRequests").collect();
  const rows = all.filter((r) => r.status === "open" || r.status === "matching");
  if (!clusterId) return rows.map((r) => r._id);
  const cats = Array.from(new Set(rows.map((r) => r.category || "General")));
  const target = cats.find((c) => slug(c) === clusterId);
  if (!target) return rows.map((r) => r._id);
  return rows.filter((r) => (r.category || "General") === target).map((r) => r._id);
}

async function skillsForRequests(ctx: Dbish, requests: Doc<"jobRequests">[]): Promise<Id<"skills">[]> {
  const ids = new Set<Id<"skills">>();
  for (const r of requests) {
    const ai = await ctx.db.query("aiRequirements").withIndex("byJob", (q) => q.eq("jobRequestId", r._id)).first();
    for (const sid of ai?.requiredSkills ?? []) ids.add(sid);
  }
  return Array.from(ids);
}

async function skillNamesForRequests(ctx: Dbish, requests: Doc<"jobRequests">[]): Promise<string[]> {
  const ids = await skillsForRequests(ctx, requests);
  const names: string[] = [];
  for (const sid of ids) {
    const n = await skillName(ctx, sid);
    if (n && !names.includes(n)) names.push(n);
  }
  return names;
}

async function countStudentsForSkills(ctx: Dbish, skillIds: Id<"skills">[]): Promise<number> {
  const seen = new Set<Doc<"studentSkills">["studentId"]>();
  for (const sid of skillIds) {
    const links = await ctx.db.query("studentSkills").withIndex("bySkill", (q) => q.eq("skillId", sid)).collect();
    for (const link of links) seen.add(link.studentId);
  }
  return seen.size;
}

function sparkSeries(value: number): number[] {
  // Demand signals only store a single aggregate snapshot (no weekly history),
  // so render a 9-point series that rises toward the live request count.
  const out: number[] = [];
  for (let i = 0; i < 9; i++) out.push(Math.round(value * (0.4 + 0.6 * (i / 8))));
  return out;
}
