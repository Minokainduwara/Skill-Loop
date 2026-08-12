import { defineTable } from "convex/server";
import { v } from "convex/values";

export const opportunities = defineTable({
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
    v.literal("admin")
  ),

  status: v.union(
    v.literal("active"),
    v.literal("fulfilled"),
    v.literal("expired")
  ),

  createdAt: v.number(),
  expiresAt: v.optional(v.number()),
})
  .index("byCategory", ["category"])
  .index("byStatus", ["status"]);