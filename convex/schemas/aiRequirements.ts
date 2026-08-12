import { defineTable } from "convex/server";
import { v } from "convex/values";

export const aiRequirements = defineTable({
  jobRequestId: v.id("jobRequests"),

  category: v.string(),
  requiredSkills: v.array(v.id("skills")),
  suggestedSkills: v.optional(v.array(v.id("skills"))),

  extractedBudget: v.optional(v.number()),
  extractedDeadline: v.optional(v.number()),

  experienceLevel: v.optional(
    v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced")
    )
  ),

  locationRequirement: v.optional(v.string()),
  isRemote: v.optional(v.boolean()),

  aiConfidence: v.optional(v.number()),
  rawResponse: v.optional(v.string()),

  createdAt: v.number(),
}).index("byJob", ["jobRequestId"]);