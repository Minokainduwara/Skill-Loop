import { mutation, query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";

const EXPERIENCE = v.union(
  v.literal("beginner"),
  v.literal("intermediate"),
  v.literal("advanced"),
);
const AVAILABILITY = v.union(
  v.literal("available"),
  v.literal("busy"),
  v.literal("unavailable"),
);

const PROFILE_FIELDS = {
  university: v.optional(v.string()),
  faculty: v.optional(v.string()),
  degree: v.optional(v.string()),
  yearOfStudy: v.optional(v.number()),
  experienceLevel: v.optional(EXPERIENCE),
  availability: v.optional(AVAILABILITY),
  hourlyRate: v.optional(v.number()),
};

async function profileByUser(ctx: QueryCtx, userId: Id<"users">) {
  return await ctx.db
    .query("studentProfiles")
    .withIndex("byUser", (q) => q.eq("userId", userId))
    .unique();
}

/** Current user's own profile (owner-only). */
export const getMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    return await profileByUser(ctx, user._id);
  },
});

/** Public profile of any student (for requesters browsing talent). */
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await profileByUser(ctx, userId);
  },
});

/** Owner (or admin) updates their profile; creates it if missing. */
export const update = mutation({
  args: PROFILE_FIELDS,
  handler: async (ctx, fields) => {
    const user = await getCurrentUserOrThrow(ctx);
    const now = Date.now();
    const existing = await profileByUser(ctx, user._id);
    if (!existing) {
      await ctx.db.insert("studentProfiles", {
        userId: user._id,
        university: fields.university,
        faculty: fields.faculty,
        degree: fields.degree,
        yearOfStudy: fields.yearOfStudy,
        experienceLevel: fields.experienceLevel ?? "beginner",
        availability: fields.availability ?? "available",
        hourlyRate: fields.hourlyRate,
        totalEarnings: 0,
        completedJobs: 0,
        averageRating: 0,
        totalReviews: 0,
        profileCompletion: 0,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      // Keep existing values for any field the caller did not provide.
      await ctx.db.patch("studentProfiles", existing._id, {
        university: fields.university ?? existing.university,
        faculty: fields.faculty ?? existing.faculty,
        degree: fields.degree ?? existing.degree,
        yearOfStudy: fields.yearOfStudy ?? existing.yearOfStudy,
        experienceLevel: fields.experienceLevel ?? existing.experienceLevel,
        availability: fields.availability ?? existing.availability,
        hourlyRate: fields.hourlyRate ?? existing.hourlyRate,
        updatedAt: now,
      });
    }
    return await profileByUser(ctx, user._id);
  },
});
