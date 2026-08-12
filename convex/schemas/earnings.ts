import { defineTable } from "convex/server";
import { v } from "convex/values";

export const earnings = defineTable({
  studentId: v.id("users"),
  jobId: v.id("jobs"),

  amount: v.number(),
  platformFee: v.optional(v.number()),
  netAmount: v.number(),

  currency: v.string(),

  status: v.union(
    v.literal("pending"),
    v.literal("available"),
    v.literal("paid")
  ),

  createdAt: v.number(),
  paidAt: v.optional(v.number()),
})
  .index("byStudent", ["studentId"])
  .index("byJob", ["jobId"]);