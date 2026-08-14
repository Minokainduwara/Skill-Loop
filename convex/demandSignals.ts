import { query } from "./_generated/server";
import { v } from "convex/values";

/** All demand signals, optionally restricted to a category. */
export const list = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, { category }) => {
    if (category) {
      const rows = await ctx.db
        .query("demandSignals")
        .withIndex("byCategory", (q) => q.eq("category", category))
        .collect();
      return rows.sort((a, b) => b.requestCount - a.requestCount);
    }
    const rows = await ctx.db.query("demandSignals").collect();
    return rows.sort((a, b) => b.requestCount - a.requestCount);
  },
});

/** Demand signals for a skill (if linked). */
export const listBySkill = query({
  args: { skillId: v.optional(v.id("skills")) },
  handler: async (ctx, { skillId }) => {
    if (!skillId) return [];
    return await ctx.db
      .query("demandSignals")
      .withIndex("bySkill", (q) => q.eq("skillId", skillId))
      .collect();
  },
});