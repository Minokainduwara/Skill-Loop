import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { requireRole } from "./lib/roles";

const STATUS = v.union(v.literal("active"), v.literal("fulfilled"), v.literal("expired"));

/** Discoverable opportunities, optionally filtered by category/status, by demand. */
export const list = query({
  args: {
    category: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("active"), v.literal("fulfilled"), v.literal("expired")),
    ),
  },
  handler: async (ctx, { category, status }) => {
    let rows: Doc<"opportunities">[];
    if (status) {
      rows = await ctx.db
        .query("opportunities")
        .withIndex("byStatus", (q) => q.eq("status", status))
        .collect();
      if (category) rows = rows.filter((o) => o.category === category);
    } else if (category) {
      rows = await ctx.db
        .query("opportunities")
        .withIndex("byCategory", (q) => q.eq("category", category))
        .collect();
    } else {
      rows = await ctx.db.query("opportunities").collect();
    }
    return rows.sort((a, b) => b.demandScore - a.demandScore);
  },
});

export const get = query({
  args: { opportunityId: v.id("opportunities") },
  handler: async (ctx, { opportunityId }) => {
    return await ctx.db.get("opportunities", opportunityId);
  },
});

/** Admin: create an opportunity (e.g. community-demand or curated). */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    requiredSkills: v.array(v.id("skills")),
    estimatedBudgetMin: v.optional(v.number()),
    estimatedBudgetMax: v.optional(v.number()),
    demandScore: v.number(),
    source: v.union(
      v.literal("job_requests"),
      v.literal("community_demand"),
      v.literal("admin"),
    ),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, "admin");
    return await ctx.db.insert("opportunities", {
      ...args,
      status: "active",
      createdAt: Date.now(),
    });
  },
});

/** Admin: mark an opportunity fulfilled or expired. */
export const setStatus = mutation({
  args: {
    opportunityId: v.id("opportunities"),
    status: STATUS,
  },
  handler: async (ctx, { opportunityId, status }) => {
    await requireRole(ctx, "admin");
    const opportunity = await ctx.db.get("opportunities", opportunityId);
    if (!opportunity) throw new Error("Opportunity not found");
    await ctx.db.patch("opportunities", opportunityId, { status });
    return await ctx.db.get("opportunities", opportunityId);
  },
});