import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notifications = defineTable({
  userId: v.id("users"),

  type: v.union(
    v.literal("new_match"),
    v.literal("job_application"),
    v.literal("application_accepted"),
    v.literal("job_completed"),
    v.literal("payment"),
    v.literal("opportunity"),
    v.literal("review"),
    v.literal("system")
  ),

  title: v.string(),
  message: v.string(),

  relatedJobId: v.optional(v.id("jobs")),
  relatedJobRequestId: v.optional(v.id("jobRequests")),

  isRead: v.boolean(),
  createdAt: v.number(),
}).index("byUser", ["userId"]);