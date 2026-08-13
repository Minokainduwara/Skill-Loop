import { query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { requireRole } from "./lib/roles";

/** Read model used by the student-facing dashboard and job list screens. */
export const studentHome = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    const [profile, jobs, matches, notifications, earnings] = await Promise.all([
      ctx.db.query("studentProfiles").withIndex("byUser", (q) => q.eq("userId", user._id)).unique(),
      ctx.db.query("jobs").withIndex("byStudent", (q) => q.eq("studentId", user._id)).collect(),
      ctx.db.query("matches").withIndex("byStudent", (q) => q.eq("studentId", user._id)).collect(),
      ctx.db.query("notifications").withIndex("byUser", (q) => q.eq("userId", user._id)).collect(),
      ctx.db.query("earnings").withIndex("byStudent", (q) => q.eq("studentId", user._id)).collect(),
    ]);
    const requests = await Promise.all(matches.map((match) => ctx.db.get("jobRequests", match.jobRequestId)));
    const jobsWithRequests = await Promise.all(jobs.map(async (job) => ({
      ...job,
      request: await ctx.db.get("jobRequests", job.jobRequestId),
      requester: await ctx.db.get("users", job.requesterId),
    })));
    return {
      user,
      profile,
      jobs: jobsWithRequests.sort((a, b) => b.updatedAt - a.updatedAt),
      matches: matches.map((match, index) => ({ ...match, request: requests[index] })).filter((match) => match.request !== null),
      notifications: notifications.sort((a, b) => b.createdAt - a.createdAt),
      earnings,
    };
  },
});

/** Discoverable requests with their requester and extracted requirements. */
export const opportunityFeed = query({
  args: {},
  handler: async (ctx) => {
    const requests = await ctx.db.query("jobRequests").withIndex("byStatus", (q) => q.eq("status", "open")).collect();
    return await Promise.all(requests.map(async (request) => {
      const [requester, requirements] = await Promise.all([
        ctx.db.get("users", request.requesterId),
        ctx.db.query("aiRequirements").withIndex("byJob", (q) => q.eq("jobRequestId", request._id)).first(),
      ]);
      const skills = await Promise.all((requirements?.requiredSkills ?? []).map((id) => ctx.db.get("skills", id)));
      return { ...request, requester, skills: skills.filter((skill) => skill !== null), requirements };
    }));
  },
});

/** Current student's profile page data. */
export const profile = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    const [profile, links, portfolios, reviews] = await Promise.all([
      ctx.db.query("studentProfiles").withIndex("byUser", (q) => q.eq("userId", user._id)).unique(),
      ctx.db.query("studentSkills").withIndex("byStudent", (q) => q.eq("studentId", user._id)).collect(),
      ctx.db.query("portfolios").withIndex("byStudent", (q) => q.eq("studentId", user._id)).collect(),
      ctx.db.query("reviews").withIndex("byReviewee", (q) => q.eq("revieweeId", user._id)).collect(),
    ]);
    const skills = await Promise.all(links.map(async (link) => ({ ...link, skill: await ctx.db.get("skills", link.skillId) })));
    return { user, profile, skills, portfolios, reviews };
  },
});

/** Live demand data for radar and skills-demand pages. */
export const demand = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("demandSignals").collect();
    return await Promise.all(rows.map(async (row) => ({ ...row, skill: row.skillId ? await ctx.db.get("skills", row.skillId) : null })));
  },
});

/** Admin-only operational data for all admin views. */
export const admin = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, "admin");
    const [users, jobs, requests, earnings, signals, impact] = await Promise.all([
      ctx.db.query("users").collect(), ctx.db.query("jobs").collect(), ctx.db.query("jobRequests").collect(),
      ctx.db.query("earnings").collect(), ctx.db.query("demandSignals").collect(), ctx.db.query("impactMetrics").collect(),
    ]);
    return { users, jobs, requests, earnings, signals, impact: impact.sort((a, b) => b.date - a.date) };
  },
});
