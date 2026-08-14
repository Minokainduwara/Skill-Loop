import { defineTable } from "convex/server";
import { v } from "convex/values";

export const studentSkills = defineTable({
  studentId: v.id("users"),
  skillId: v.id("skills"),

  proficiencyLevel: v.union(
    v.literal("beginner"),
    v.literal("intermediate"),
    v.literal("advanced"),
    v.literal("expert")
  ),

  yearsOfExperience: v.optional(v.number()),
  isPrimary: v.boolean(),
  createdAt: v.number(),
})
  .index("byStudent", ["studentId"])
  .index("bySkill", ["skillId"])
  .index("byStudentSkill", ["studentId", "skillId"]);