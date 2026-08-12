import { defineTable } from "convex/server";
import { v } from "convex/values";

export const users = defineTable({
  username: v.string(),
  externalId: v.string(),

  email: v.optional(v.string()),
  profileImage: v.optional(v.string()),
  phone: v.optional(v.string()),
  location: v.optional(v.string()),
  bio: v.optional(v.string()),

  role: v.union(
    v.literal("student"),
    v.literal("requester"),
    v.literal("admin")
  ),

  isVerified: v.boolean(),
  isActive: v.boolean(),

  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("byExternalId", ["externalId"])
  .index("byEmail", ["email"])
  .index("byRole", ["role"]);