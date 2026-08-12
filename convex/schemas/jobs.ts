import { defineTable } from "convex/server";
import { v } from "convex/values";

export const jobs = defineTable({
  jobRequestId: v.id("jobRequests"),

  requesterId: v.id("users"),
  studentId: v.id("users"),

  applicationId: v.id("applications"),

  agreedPrice: v.number(),
  deadline: v.optional(v.number()),

  status: v.union(
    v.literal("assigned"),
    v.literal("in_progress"),
    v.literal("submitted"),
    v.literal("revision"),
    v.literal("completed"),
    v.literal("cancelled")
  ),

  startedAt: v.optional(v.number()),
  submittedAt: v.optional(v.number()),
  completedAt: v.optional(v.number()),

  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("byStudent", ["studentId"])
  .index("byRequester", ["requesterId"])
  .index("byStatus", ["status"])
  .index("byRequest", ["jobRequestId"]);