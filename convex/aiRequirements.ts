import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";

const EXPERIENCE = v.union(
  v.literal("beginner"),
  v.literal("intermediate"),
  v.literal("advanced"),
);

/** The stored AI analysis for a job request (participants/admin only). */
export const get = query({
  args: { jobRequestId: v.id("jobRequests") },
  handler: async (ctx, { jobRequestId }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const request = await ctx.db.get("jobRequests", jobRequestId);
    if (!request) throw new Error("Job request not found");
    if (request.requesterId !== user._id && user.role !== "admin") {
      throw new Error("Not authorized");
    }
    return await ctx.db
      .query("aiRequirements")
      .withIndex("byJob", (q) => q.eq("jobRequestId", jobRequestId))
      .first();
  },
});

/**
 * Persists AI-extracted requirements for a request. A future model analysis
 * action (e.g. an Ollama action) can call this per-request; for now admins and
 * requesters can seed it while the action is being wired.
 */
export const setFromAnalysis = mutation({
  args: {
    jobRequestId: v.id("jobRequests"),
    category: v.optional(v.string()),
    requiredSkills: v.optional(v.array(v.id("skills"))),
    suggestedSkills: v.optional(v.array(v.id("skills"))),
    extractedBudget: v.optional(v.number()),
    extractedDeadline: v.optional(v.number()),
    experienceLevel: v.optional(EXPERIENCE),
    locationRequirement: v.optional(v.string()),
    isRemote: v.optional(v.boolean()),
    aiConfidence: v.optional(v.number()),
    rawResponse: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const request = await ctx.db.get("jobRequests", args.jobRequestId);
    if (!request) throw new Error("Job request not found");
    if (request.requesterId !== user._id && user.role !== "admin") {
      throw new Error("Not authorized");
    }
    const { jobRequestId, ...fields } = args;
    const existing = await ctx.db
      .query("aiRequirements")
      .withIndex("byJob", (q) => q.eq("jobRequestId", jobRequestId))
      .first();
    if (existing) {
      await ctx.db.patch("aiRequirements", existing._id, {
        category: fields.category ?? existing.category,
        requiredSkills: fields.requiredSkills ?? existing.requiredSkills,
        suggestedSkills: fields.suggestedSkills,
        extractedBudget: fields.extractedBudget,
        extractedDeadline: fields.extractedDeadline,
        experienceLevel: fields.experienceLevel,
        locationRequirement: fields.locationRequirement,
        isRemote: fields.isRemote,
        aiConfidence: fields.aiConfidence,
        rawResponse: fields.rawResponse,
      });
      return await ctx.db.get("aiRequirements", existing._id);
    }
    const id = await ctx.db.insert("aiRequirements", {
      jobRequestId,
      category: fields.category ?? "",
      requiredSkills: fields.requiredSkills ?? [],
      suggestedSkills: fields.suggestedSkills,
      extractedBudget: fields.extractedBudget,
      extractedDeadline: fields.extractedDeadline,
      experienceLevel: fields.experienceLevel,
      locationRequirement: fields.locationRequirement,
      isRemote: fields.isRemote,
      aiConfidence: fields.aiConfidence,
      rawResponse: fields.rawResponse,
      createdAt: Date.now(),
    });

    await ctx.db.insert("opportunities", {
      title: request.title,
      description: request.description,
      category: fields.category ?? request.category ?? "General",
      requiredSkills: fields.requiredSkills ?? [],
      estimatedBudgetMin: request.budgetMin,
      estimatedBudgetMax: request.budgetMax,
      demandScore: 10,
      source: "job_requests",
      status: "active",
      jobRequestId: jobRequestId,
      createdAt: Date.now(),
    });

    return await ctx.db.get("aiRequirements", id);
  },
});