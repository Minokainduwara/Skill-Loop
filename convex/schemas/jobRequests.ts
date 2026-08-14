import { defineTable } from "convex/server";
import { v } from "convex/values";

export const jobRequests = defineTable({
  requesterId: v.id("users"),

  title: v.string(),
  description: v.string(),

  category: v.optional(v.string()),

  budgetMin: v.optional(v.number()),
  budgetMax: v.optional(v.number()),

  deadline: v.optional(v.number()),

  location: v.optional(v.string()),
  isRemote: v.boolean(),

  status: v.union(
    v.literal("open"),
    v.literal("matching"),
    v.literal("assigned"),
    v.literal("completed"),
    v.literal("cancelled")
  ),

  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("byRequester", ["requesterId"])
  .index("byStatus", ["status"])
  .index("byCategory", ["category"]);