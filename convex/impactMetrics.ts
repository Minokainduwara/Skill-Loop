import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireRole } from "./lib/roles";
import { getCurrentUser } from "./users";
import type { Doc, Id } from "./_generated/dataModel";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** The most recent impact snapshot. */
export const getSummary = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("impactMetrics").collect();
    if (rows.length === 0) return null;
    return rows.sort((a, b) => b.date - a.date)[0];
  },
});

function monthKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}`;
}

function monthLabel(key: string): string {
  return MONTHS[Number(key.slice(5))] ?? key;
}

/** Group earnings into a monthly income/active-students series, ascending by date. */
function buildTrend(earnings: Doc<"earnings">[], myId: Id<"users"> | null) {
  const rows = myId ? earnings.filter((e) => e.studentId === myId) : earnings;
  const byMonth = new Map<string, { income: number; students: Set<string> }>();
  for (const e of rows) {
    const k = monthKey(e.createdAt);
    const m = byMonth.get(k) ?? { income: 0, students: new Set<string>() };
    m.income += e.netAmount ?? e.amount;
    m.students.add(e.studentId);
    byMonth.set(k, m);
  }
  return Array.from(byMonth.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, m]) => ({ month: monthLabel(k), income: m.income, students: m.students.size }));
}

/** Count completed/job docs by their request category. */
function countByCategory(requests: Doc<"jobRequests">[], jobRequestIds: Id<"jobRequests">[]) {
  const ids = new Set(jobRequestIds);
  const counts = new Map<string, number>();
  for (const r of requests) {
    if (!ids.has(r._id)) continue;
    const cat = r.category || "General";
    counts.set(cat, (counts.get(cat) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Economic impact, computed directly from live records (earnings, jobs,
 * opportunities, demandSignals, jobRequests) so every figure on the impact
 * dashboard reflects the real state of the database.
 */
export const economicImpact = query({
  args: {},
  handler: async (ctx) => {
    const [earnings, jobs, opportunities, demandSignals, jobRequests, skills] = await Promise.all([
      ctx.db.query("earnings").collect(),
      ctx.db.query("jobs").collect(),
      ctx.db.query("opportunities").collect(),
      ctx.db.query("demandSignals").collect(),
      ctx.db.query("jobRequests").collect(),
      ctx.db.query("skills").collect(),
    ]);
    const nameById = new Map(skills.map((s) => [s._id, s.name]));

    let myId: Id<"users"> | null = null;
    let myName = "";
    try {
      const user = await getCurrentUser(ctx);
      if (user) {
        myId = user._id;
        myName = user.username;
      }
    } catch {
      // Anonymous / no auth fallback -> report the community scope only.
    }

    /* ------------------------------- community scope */
    const recorded = earnings.filter((e) => (e.netAmount ?? e.amount) > 0);
    const income = recorded.reduce((s, e) => s + (e.netAmount ?? e.amount), 0);
    const students = new Set(recorded.map((e) => e.studentId)).size;
    const completedJobs = jobs.filter((j) => j.status === "completed");
    const businesses = new Set(jobs.map((j) => j.requesterId).filter(Boolean)).size;
    const totalJobsValue = jobs.reduce((s, j) => s + j.agreedPrice, 0);
    const signalSkills = demandSignals
      .slice()
      .sort((a, b) => b.requestCount - a.requestCount)
      .slice(0, 6)
      .map((s) => ({
        skill: (s.skillId ? nameById.get(s.skillId) : "") || s.category,
        requests: s.requestCount,
      }));

    /* ------------------------------- my scope */
    const myEarnings = myId ? recorded.filter((e) => e.studentId === myId) : [];
    const myJobs = myId ? jobs.filter((j) => j.studentId === myId) : [];
    const myCompleted = myJobs.filter((j) => j.status === "completed");
    const myActive = myJobs.filter((j) => !["completed", "cancelled"].includes(j.status));
    const myJobCategories = myJobs.map((j) => j.jobRequestId);

    return {
      community: {
        name: "Community",
        income,
        students,
        jobsCompleted: completedJobs.length,
        businesses,
        opportunities: opportunities.filter((o) => o.status === "active").length,
        totalJobsValue,
        averageJobValue: completedJobs.length ? Math.round(income / completedJobs.length) : 0,
        averageStudentIncome: students ? Math.round(income / students) : 0,
        trend: buildTrend(recorded, null),
        skills: signalSkills,
        cats: countByCategory(jobRequests, completedJobs.map((j) => j.jobRequestId)),
      },
      mine: {
        name: myName,
        income: myEarnings.reduce((s, e) => s + (e.netAmount ?? e.amount), 0),
        jobsCompleted: myCompleted.length,
        activeJobs: myActive.length,
        earningEvents: myEarnings.length,
        businesses: new Set(myJobs.map((j) => j.requesterId)).size,
        totalJobsValue: myJobs.reduce((s, j) => s + j.agreedPrice, 0),
        trend: buildTrend(recorded, myId),
        skills: countByCategory(jobRequests, myJobCategories).map((c) => ({ skill: c.name, requests: c.value })),
        cats: countByCategory(jobRequests, myCompleted.map((j) => j.jobRequestId)),
      },
    };
  },
});

/** Daily impact metrics, newest first (bounded). */
export const listDaily = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const rows = await ctx.db
      .query("impactMetrics")
      .withIndex("byDate")
      .collect();
    const sorted = rows.sort((a, b) => b.date - a.date);
    return limit ? sorted.slice(0, limit) : sorted;
  },
});

/** Admin: record/refresh today's impact snapshot (upsert by date bucket). */
export const upsertDaily = mutation({
  args: {
    date: v.number(),
    totalStudentsBenefited: v.number(),
    totalJobsCompleted: v.number(),
    totalIncomeGenerated: v.number(),
    totalRequesterSavings: v.number(),
    totalOpportunitiesCreated: v.number(),
    totalBusinessesServed: v.number(),
    totalRequests: v.number(),
    totalSuccessfulMatches: v.number(),
    averageStudentIncome: v.optional(v.number()),
    averageJobValue: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, "admin");
    const rows = await ctx.db
      .query("impactMetrics")
      .withIndex("byDate")
      .collect();
    const existing = rows.find((r) => r.date === args.date);
    const {
      averageStudentIncome,
      averageJobValue,
      ...rest
    } = args;
    if (existing) {
      await ctx.db.patch("impactMetrics", existing._id, {
        ...rest,
        averageStudentIncome: averageStudentIncome ?? existing.averageStudentIncome,
        averageJobValue: averageJobValue ?? existing.averageJobValue,
      });
      return await ctx.db.get("impactMetrics", existing._id);
    }
    const id = await ctx.db.insert("impactMetrics", {
      ...rest,
      averageStudentIncome: averageStudentIncome ?? 0,
      averageJobValue: averageJobValue ?? 0,
      createdAt: Date.now(),
    });
    return await ctx.db.get("impactMetrics", id);
  },
});