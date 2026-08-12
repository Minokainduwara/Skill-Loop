import { defineTable } from "convex/server";
import { v } from "convex/values";

export const jobDeliverables = defineTable({
  jobId: v.id("jobs"),

  description: v.optional(v.string()),
  fileUrl: v.optional(v.string()),
  externalUrl: v.optional(v.string()),

  submittedAt: v.number(),

  status: v.union(
    v.literal("submitted"),
    v.literal("approved"),
    v.literal("revision_requested")
  ),

  createdAt: v.number(),
}).index("byJob", ["jobId"]);