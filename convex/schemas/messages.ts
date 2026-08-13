import { defineTable } from "convex/server";
import { v } from "convex/values";

export const messages = defineTable({
  senderId: v.id("users"),
  receiverId: v.id("users"),
  jobId: v.optional(v.id("jobs")),
  text: v.string(),
  createdAt: v.number(),
})
  .index("bySender", ["senderId"])
  .index("byReceiver", ["receiverId"])
  .index("byJob", ["jobId"]);
