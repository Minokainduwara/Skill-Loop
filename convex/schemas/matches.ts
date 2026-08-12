import { defineTable } from "convex/server";
import { v } from "convex/values";

export const matches = defineTable({
  jobRequestId: v.id("jobRequests"),
  studentId: v.id("users"),

  skillScore: v.number(),
  availabilityScore: v.number(),
  experienceScore: v.number(),
  ratingScore: v.number(),
  locationScore: v.number(),
  budgetScore: v.optional(v.number()),

  totalScore: v.number(),

  matchReason: v.optional(v.string()),

  status: v.union(
    v.literal("suggested"),
    v.literal("viewed"),
    v.literal("accepted"),
    v.literal("rejected")
  ),

  createdAt: v.number(),
})
  .index("byJob", ["jobRequestId"])
  .index("byStudent", ["studentId"]);