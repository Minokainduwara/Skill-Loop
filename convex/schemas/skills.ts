import { defineTable } from "convex/server";
import { v } from "convex/values";

export const skills = defineTable({
  name: v.string(),
  category: v.string(),
  description: v.optional(v.string()),
  isActive: v.boolean(),
  createdAt: v.number(),
})
  .index("byName", ["name"])
  .index("byCategory", ["category"]);