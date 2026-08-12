import { defineTable } from "convex/server";
import { v } from "convex/values";

export const portfolios = defineTable({
  studentId: v.id("users"),

  title: v.string(),
  description: v.optional(v.string()),
  category: v.string(),

  projectUrl: v.optional(v.string()),
  imageUrl: v.optional(v.string()),

  skills: v.array(v.id("skills")),

  createdAt: v.number(),
  updatedAt: v.number(),
}).index("byStudent", ["studentId"]);