import { defineTable } from "convex/server";
import { v } from "convex/values";

export const demandSignals = defineTable({
  category: v.string(),
  skillId: v.optional(v.id("skills")),

  requestCount: v.number(),
  totalPotentialValue: v.number(),

  fulfilledCount: v.number(),
  unfulfilledCount: v.number(),

  demandLevel: v.union(
    v.literal("low"),
    v.literal("medium"),
    v.literal("high"),
    v.literal("very_high")
  ),

  periodStart: v.number(),
  periodEnd: v.number(),

  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("byCategory", ["category"])
  .index("bySkill", ["skillId"]);