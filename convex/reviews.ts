import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";
import { notify } from "./lib/notify";

/** Reviews received by a user (public profile view). */
export const listForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("reviews")
      .withIndex("byReviewee", (q) => q.eq("revieweeId", userId))
      .collect();
  },
});

/** Reviews attached to a job (participants/admin only). */
export const listByJob = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, { jobId }) => {
    return await ctx.db
      .query("reviews")
      .withIndex("byJob", (q) => q.eq("jobId", jobId))
      .collect();
  },
});

/**
 * Leaves a review from a completed job's participants. Updates the reviewee's
 * average rating and review count if they are a student.
 */
export const create = mutation({
  args: {
    jobId: v.id("jobs"),
    revieweeId: v.id("users"),
    rating: v.number(),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, { jobId, revieweeId, rating, comment }) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (rating < 0 || rating > 5) throw new Error("Rating must be between 0 and 5");
    const job = await ctx.db.get("jobs", jobId);
    if (!job) throw new Error("Job not found");
    if (job.status !== "completed") {
      throw new Error("Only completed jobs can be reviewed");
    }
    const isParticipant = job.studentId === user._id || job.requesterId === user._id;
    if (!isParticipant && user.role !== "admin") {
      throw new Error("Not authorized");
    }
    if (job.studentId === user._id && revieweeId === job.studentId) {
      throw new Error("You cannot review yourself");
    }

    const id = await ctx.db.insert("reviews", {
      jobId,
      reviewerId: user._id,
      revieweeId,
      rating,
      comment,
      createdAt: Date.now(),
    });

    const profile = await ctx.db
      .query("studentProfiles")
      .withIndex("byUser", (q) => q.eq("userId", revieweeId))
      .unique();
    if (profile) {
      const total = profile.averageRating * profile.totalReviews + rating;
      const count = profile.totalReviews + 1;
      await ctx.db.patch("studentProfiles", profile._id, {
        averageRating: Math.round((total / count) * 10) / 10,
        totalReviews: count,
        updatedAt: Date.now(),
      });
    }

    await notify(ctx, {
      userId: revieweeId,
      type: "review",
      title: "New review ⭐",
      message: `You received a ${rating}-star review`,
      relatedJobId: job._id,
    });
    return id;
  },
});