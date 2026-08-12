import { defineTable } from "convex/server";
import { v } from "convex/values";

export const impactMetrics = defineTable({
  date: v.number(),

  totalStudentsBenefited: v.number(),
  totalJobsCompleted: v.number(),
  totalIncomeGenerated: v.number(),
  totalRequesterSavings: v.number(),
  totalOpportunitiesCreated: v.number(),
  totalBusinessesServed: v.number(),

  totalRequests: v.number(),
  totalSuccessfulMatches: v.number(),

  averageStudentIncome: v.number(),
  averageJobValue: v.number(),

  createdAt: v.number(),
}).index("byDate", ["date"]);