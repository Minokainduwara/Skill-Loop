import { defineTable } from "convex/server";
import { v } from "convex/values";

export const studentProfiles = defineTable({
  userId: v.id("users"),

  university: v.optional(v.string()),
  faculty: v.optional(v.string()),
  degree: v.optional(v.string()),
  yearOfStudy: v.optional(v.number()),

  experienceLevel: v.union(
    v.literal("beginner"),
    v.literal("intermediate"),
    v.literal("advanced")
  ),

  availability: v.union(
    v.literal("available"),
    v.literal("busy"),
    v.literal("unavailable")
  ),

  hourlyRate: v.optional(v.number()),

  totalEarnings: v.number(),
  completedJobs: v.number(),
  averageRating: v.number(),
  totalReviews: v.number(),
  profileCompletion: v.number(),

  createdAt: v.number(),
  updatedAt: v.number(),
}).index("byUser", ["userId"]);