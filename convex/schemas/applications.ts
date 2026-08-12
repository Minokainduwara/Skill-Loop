import { defineTable } from "convex/server";
import { v } from "convex/values";

export const applications = defineTable({
  jobRequestId: v.id("jobRequests"),
  studentId: v.id("users"),

  matchId: v.optional(v.id("matches")),

  proposal: v.optional(v.string()),
  proposedPrice: v.optional(v.number()),
  estimatedDeliveryDays: v.optional(v.number()),

  status: v.union(
    v.literal("pending"),
    v.literal("shortlisted"),
    v.literal("accepted"),
    v.literal("rejected"),
    v.literal("withdrawn")
  ),

  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("byJob", ["jobRequestId"])
  .index("byStudent", ["studentId"]);