import { defineTable } from "convex/server";
import { v } from "convex/values";

export const channels = defineTable({
  jobRequestId: v.id("jobRequests"),
  studentId: v.id("users"),
  requesterId: v.id("users"),
  updatedAt: v.number(),
  createdAt: v.number(),
})
  .index("byJob", ["jobRequestId"])
  .index("byStudent", ["studentId"])
  .index("byRequester", ["requesterId"]);
