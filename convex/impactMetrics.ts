import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireRole } from "./lib/roles";

/** The most recent impact snapshot. */
export const getSummary = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("impactMetrics").collect();
    if (rows.length === 0) return null;
    return rows.sort((a, b) => b.date - a.date)[0];
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