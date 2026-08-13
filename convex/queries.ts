import { query, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

const limitArg = v.optional(v.number());

async function currentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }

  return (
    (await userByExternalId(ctx, identity.tokenIdentifier)) ??
    (await userByExternalId(ctx, identity.subject))
  );
}

async function currentUserOrThrow(ctx: QueryCtx) {
  const user = await currentUser(ctx);
  if (user === null) {
    throw new Error("You must be signed in.");
  }
  if (!user.isActive) {
    throw new Error("This account is not active.");
  }
  return user;
}

async function requireAdmin(ctx: QueryCtx) {
  const user = await currentUserOrThrow(ctx);
  if (user.role !== "admin") {
    throw new Error("Admin access required.");
  }
  return user;
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
    .unique();
}

async function skillsForStudent(ctx: QueryCtx, studentId: Id<"users">, limit = 50) {
  const studentSkills = await ctx.db
    .query("studentSkills")
    .withIndex("byStudent", (q) => q.eq("studentId", studentId))
    .take(limit);

  return await Promise.all(
    studentSkills.map(async (studentSkill) => ({
      studentSkill,
      skill: await ctx.db.get(studentSkill.skillId),
    })),
  );
}

async function skillsByIds(ctx: QueryCtx, skillIds: Id<"skills">[]) {
  return await Promise.all(skillIds.map((skillId) => ctx.db.get(skillId)));
}

export const me = query({
  args: {},
  returns: v.union(v.any(), v.null()),
  handler: async (ctx) => {
    return await currentUser(ctx);
  },
});

export const myStudentProfile = query({
  args: {},
  returns: v.union(v.any(), v.null()),
  handler: async (ctx) => {
    const user = await currentUser(ctx);
    if (user === null) {
      return null;
    }

    const profile = await ctx.db
      .query("studentProfiles")
      .withIndex("byUser", (q) => q.eq("userId", user._id))
      .unique();

    const portfolios = await ctx.db
      .query("portfolios")
      .withIndex("byStudent", (q) => q.eq("studentId", user._id))
      .order("desc")
      .take(12);

    return {
      user,
      profile,
      skills: await skillsForStudent(ctx, user._id),
      portfolios,
    };
  },
});

export const studentProfile = query({
  args: { studentId: v.id("users") },
  returns: v.union(v.any(), v.null()),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.studentId);
    if (user === null || user.role !== "student" || !user.isActive) {
      return null;
    }

    const profile = await ctx.db
      .query("studentProfiles")
      .withIndex("byUser", (q) => q.eq("userId", args.studentId))
      .unique();
    const portfolios = await ctx.db
      .query("portfolios")
      .withIndex("byStudent", (q) => q.eq("studentId", args.studentId))
      .order("desc")
      .take(12);
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("byReviewee", (q) => q.eq("revieweeId", args.studentId))
      .order("desc")
      .take(10);

    return {
      user,
      profile,
      skills: await skillsForStudent(ctx, args.studentId),
      portfolios,
      reviews,
    };
  },
});

export const listSkills = query({
  args: { category: v.optional(v.string()), limit: limitArg },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const category = args.category;
    if (category !== undefined) {
      return await ctx.db
        .query("skills")
        .withIndex("byCategory", (q) => q.eq("category", category))
        .take(limit);
    }

    return await ctx.db.query("skills").order("desc").take(limit);
  },
});

export const listOpenJobRequests = query({
  args: { category: v.optional(v.string()), limit: limitArg },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const limit = args.limit ?? 25;
    const openRequests = await ctx.db
      .query("jobRequests")
      .withIndex("byStatus", (q) => q.eq("status", "open"))
      .order("desc")
      .take(limit);

    if (args.category === undefined) {
      return openRequests;
    }
    return openRequests.filter((request) => request.category === args.category);
  },
});

export const myJobRequests = query({
  args: { limit: limitArg },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const user = await currentUserOrThrow(ctx);
    return await ctx.db
      .query("jobRequests")
      .withIndex("byRequester", (q) => q.eq("requesterId", user._id))
      .order("desc")
      .take(args.limit ?? 25);
  },
});

export const jobRequestBundle = query({
  args: { jobRequestId: v.id("jobRequests") },
  returns: v.union(v.any(), v.null()),
  handler: async (ctx, args) => {
    const user = await currentUser(ctx);
    const jobRequest = await ctx.db.get(args.jobRequestId);
    if (jobRequest === null) {
      return null;
    }

    const aiRequirement = await ctx.db
      .query("aiRequirements")
      .withIndex("byJob", (q) => q.eq("jobRequestId", args.jobRequestId))
      .unique();
    const matches = await ctx.db
      .query("matches")
      .withIndex("byJob", (q) => q.eq("jobRequestId", args.jobRequestId))
      .order("desc")
      .take(20);

    const requesterView =
      user !== null && (user._id === jobRequest.requesterId || user.role === "admin");

    const applications = requesterView
      ? await ctx.db
          .query("applications")
          .withIndex("byJob", (q) => q.eq("jobRequestId", args.jobRequestId))
          .order("desc")
          .take(20)
      : [];

    return {
      jobRequest,
      requester: await ctx.db.get(jobRequest.requesterId),
      aiRequirement:
        aiRequirement === null
          ? null
          : {
              ...aiRequirement,
              skills: await skillsByIds(ctx, aiRequirement.requiredSkills),
            },
      matches: await Promise.all(
        matches.map(async (match) => ({
          match,
          student: await ctx.db.get(match.studentId),
          profile: await ctx.db
            .query("studentProfiles")
            .withIndex("byUser", (q) => q.eq("userId", match.studentId))
            .unique(),
          skills: await skillsForStudent(ctx, match.studentId, 12),
        })),
      ),
      applications,
    };
  },
});

export const myMatches = query({
  args: { limit: limitArg },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const user = await currentUserOrThrow(ctx);
    const matches = await ctx.db
      .query("matches")
      .withIndex("byStudent", (q) => q.eq("studentId", user._id))
      .order("desc")
      .take(args.limit ?? 25);

    return await Promise.all(
      matches.map(async (match) => ({
        match,
        jobRequest: await ctx.db.get(match.jobRequestId),
      })),
    );
  },
});

export const myApplications = query({
  args: { limit: limitArg },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const user = await currentUserOrThrow(ctx);
    const applications = await ctx.db
      .query("applications")
      .withIndex("byStudent", (q) => q.eq("studentId", user._id))
      .order("desc")
      .take(args.limit ?? 25);

    return await Promise.all(
      applications.map(async (application) => ({
        application,
        jobRequest: await ctx.db.get(application.jobRequestId),
      })),
    );
  },
});

export const myJobs = query({
  args: { limit: limitArg },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const user = await currentUserOrThrow(ctx);
    const limit = args.limit ?? 25;
    const byStudent = await ctx.db
      .query("jobs")
      .withIndex("byStudent", (q) => q.eq("studentId", user._id))
      .order("desc")
      .take(limit);
    const byRequester = await ctx.db
      .query("jobs")
      .withIndex("byRequester", (q) => q.eq("requesterId", user._id))
      .order("desc")
      .take(limit);

    const jobs = [...byStudent, ...byRequester].slice(0, limit);
    return await Promise.all(
      jobs.map(async (job) => ({
        job,
        jobRequest: await ctx.db.get(job.jobRequestId),
        requester: await ctx.db.get(job.requesterId),
        student: await ctx.db.get(job.studentId),
      })),
    );
  },
});

export const jobWorkspace = query({
  args: { jobId: v.id("jobs") },
  returns: v.union(v.any(), v.null()),
  handler: async (ctx, args) => {
    const user = await currentUserOrThrow(ctx);
    const job = await ctx.db.get(args.jobId);
    if (job === null || (job.studentId !== user._id && job.requesterId !== user._id && user.role !== "admin")) {
      return null;
    }

    const deliverables = await ctx.db
      .query("jobDeliverables")
      .withIndex("byJob", (q) => q.eq("jobId", args.jobId))
      .order("desc")
      .take(20);
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("byJob", (q) => q.eq("jobId", args.jobId))
      .take(5);

    return {
      job,
      jobRequest: await ctx.db.get(job.jobRequestId),
      application: await ctx.db.get(job.applicationId),
      requester: await ctx.db.get(job.requesterId),
      student: await ctx.db.get(job.studentId),
      deliverables,
      reviews,
    };
  },
});

export const myEarnings = query({
  args: { limit: limitArg },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const user = await currentUserOrThrow(ctx);
    const earnings = await ctx.db
      .query("earnings")
      .withIndex("byStudent", (q) => q.eq("studentId", user._id))
      .order("desc")
      .take(args.limit ?? 50);

    return await Promise.all(
      earnings.map(async (earning) => ({
        earning,
        job: await ctx.db.get(earning.jobId),
      })),
    );
  },
});

export const myNotifications = query({
  args: { limit: limitArg },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const user = await currentUserOrThrow(ctx);
    return await ctx.db
      .query("notifications")
      .withIndex("byUser", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.limit ?? 30);
  },
});

export const listOpportunities = query({
  args: { category: v.optional(v.string()), limit: limitArg },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const limit = args.limit ?? 30;
    const category = args.category;
    let list;
    if (category !== undefined) {
      list = await ctx.db
        .query("opportunities")
        .withIndex("byCategory", (q) => q.eq("category", category))
        .order("desc")
        .take(limit);
    } else {
      list = await ctx.db
        .query("opportunities")
        .withIndex("byStatus", (q) => q.eq("status", "active"))
        .order("desc")
        .take(limit);
    }

    return await Promise.all(
      list.map(async (opp) => {
        const skills = await Promise.all(
          opp.requiredSkills.map(async (skillId) => {
            const skill = await ctx.db.get(skillId);
            return skill ? skill.name : "";
          })
        );
        return {
          ...opp,
          skills: skills.filter(Boolean),
        };
      })
    );
  },
});

export const opportunityDetail = query({
  args: { opportunityId: v.id("opportunities") },
  returns: v.union(v.any(), v.null()),
  handler: async (ctx, args) => {
    const opportunity = await ctx.db.get(args.opportunityId);
    if (opportunity === null) {
      return null;
    }

    return {
      opportunity,
      skills: await skillsByIds(ctx, opportunity.requiredSkills),
    };
  },
});

export const demandSignals = query({
  args: { category: v.optional(v.string()), limit: limitArg },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const limit = args.limit ?? 30;
    const category = args.category;
    if (category !== undefined) {
      return await ctx.db
        .query("demandSignals")
        .withIndex("byCategory", (q) => q.eq("category", category))
        .order("desc")
        .take(limit);
    }

    return await ctx.db.query("demandSignals").order("desc").take(limit);
  },
});

export const impactMetrics = query({
  args: { limit: limitArg },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("impactMetrics")
      .withIndex("byDate")
      .order("desc")
      .take(args.limit ?? 12);
  },
});

export const adminOverview = query({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const recentUsers = await ctx.db.query("users").order("desc").take(20);
    const openRequests = await ctx.db
      .query("jobRequests")
      .withIndex("byStatus", (q) => q.eq("status", "open"))
      .order("desc")
      .take(50);
    const completedJobs = await ctx.db
      .query("jobs")
      .withIndex("byStatus", (q) => q.eq("status", "completed"))
      .order("desc")
      .take(50);
    const latestImpact = await ctx.db
      .query("impactMetrics")
      .withIndex("byDate")
      .order("desc")
      .take(1);

    return {
      recentUsers,
      openRequests,
      completedJobs,
      latestImpact: latestImpact[0] ?? null,
    };
  },
});

export const listMessages = query({
  args: { jobId: v.optional(v.id("jobs")) },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const user = await currentUserOrThrow(ctx);
    if (args.jobId !== undefined) {
      const msgs = await ctx.db
        .query("messages")
        .withIndex("byJob", (q) => q.eq("jobId", args.jobId))
        .collect();
      return await Promise.all(
        msgs.map(async (m) => {
          const sender = await ctx.db.get(m.senderId);
          return {
            ...m,
            senderName: sender?.username || "User",
          };
        })
      );
    }

    // Otherwise, list general user conversations
    const sent = await ctx.db
      .query("messages")
      .withIndex("bySender", (q) => q.eq("senderId", user._id))
      .collect();
    const received = await ctx.db
      .query("messages")
      .withIndex("byReceiver", (q) => q.eq("receiverId", user._id))
      .collect();

    const all = [...sent, ...received].sort((a, b) => a.createdAt - b.createdAt);
    return await Promise.all(
      all.map(async (m) => {
        const sender = await ctx.db.get(m.senderId);
        const receiver = await ctx.db.get(m.receiverId);
        return {
          ...m,
          senderName: sender?.username || "User",
          receiverName: receiver?.username || "User",
        };
      })
    );
  },
});
