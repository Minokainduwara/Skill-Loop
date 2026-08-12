import { defineTable } from "convex/server";
import { v } from "convex/values";

export const reviews = defineTable({
  jobId: v.id("jobs"),

  reviewerId: v.id("users"),
  revieweeId: v.id("users"),

  rating: v.number(),
  comment: v.optional(v.string()),

  createdAt: v.number(),
})
  .index("byReviewee", ["revieweeId"])
  .index("byJob", ["jobId"]);