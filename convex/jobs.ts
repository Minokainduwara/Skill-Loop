import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";
import { requireRole } from "./lib/roles";
import { notify } from "./lib/notify";
import { completeJob } from "./lib/payments";

const STATUS = v.union(
  v.literal("assigned"),
  v.literal("in_progress"),
  v.literal("submitted"),
  v.literal("revision"),
  v.literal("completed"),
  v.literal("cancelled"),
);

/** The current user's jobs as the hired student. */
export const listByStudent = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    return await ctx.db
      .query("jobs")
      .withIndex("byStudent", (q) => q.eq("studentId", user._id))
      .collect();
  },
});

/** The current user's jobs as the requester. */
export const listByRequester = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    return await ctx.db
      .query("jobs")
      .withIndex("byRequester", (q) => q.eq("requesterId", user._id))
      .collect();
  },
});

export const get = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, { jobId }) => {
    return await ctx.db.get("jobs", jobId);
  },
});

/** Student starts work on an assigned job. */
export const start = mutation({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, { jobId }) => {
    const user = await requireRole(ctx, "student");
    const job = await ctx.db.get("jobs", jobId);
    if (!job) throw new Error("Job not found");
    if (job.studentId !== user._id) throw new Error("Not authorized");
    if (job.status !== "assigned") throw new Error("Job already started");
    await ctx.db.patch("jobs", jobId, {
      status: "in_progress",
      startedAt: Date.now(),
      updatedAt: Date.now(),
    });
    return await ctx.db.get("jobs", jobId);
  },
});

/**
 * Advances a job along its allowed status transitions. Only participants
 * (student or requester) or admins may move a job; `completed` additionally
 * triggers earnings + profile bookkeeping.
 */
export const updateStatus = mutation({
  args: {
    jobId: v.id("jobs"),
    status: STATUS,
  },
  handler: async (ctx, { jobId, status }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const job = await ctx.db.get("jobs", jobId);
    if (!job) throw new Error("Job not found");
    const isStudent = job.studentId === user._id;
    const isRequester = job.requesterId === user._id;
    if (!isStudent && !isRequester && user.role !== "admin") {
      throw new Error("Not authorized");
    }

    const allowed: Record<string, string[]> = {
      assigned: ["in_progress", "cancelled"],
      in_progress: ["submitted", "cancelled"],
      submitted: ["revision", "completed"],
      revision: ["in_progress", "cancelled"],
      cancelled: [],
      completed: [],
    };
    if (!allowed[job.status]?.includes(status)) {
      throw new Error(`Cannot transition job from ${job.status} to ${status}`);
    }

    const now = Date.now();
    const patch: {
      status: "assigned" | "in_progress" | "submitted" | "revision" | "completed" | "cancelled";
      updatedAt: number;
      submittedAt?: number;
      completedAt?: number;
    } = { status, updatedAt: now };
    if (status === "submitted") patch.submittedAt = now;
    if (status === "completed") patch.completedAt = now;

    await ctx.db.patch("jobs", jobId, patch);

    if (status === "completed") {
      await ctx.db.patch("jobRequests", job.jobRequestId, {
        status: "completed",
        updatedAt: now,
      });
      await completeJob(ctx, job);
      await notify(ctx, {
        userId: job.studentId,
        type: "job_completed",
        title: "Job completed 🎉",
        message: "Your submitted work was approved.",
        relatedJobId: job._id,
      });
      await notify(ctx, {
        userId: job.requesterId,
        type: "payment",
        title: "Payment released",
        message: `Payment of Rs. ${job.agreedPrice} released to the student.`,
        relatedJobId: job._id,
      });
    }
    return await ctx.db.get("jobs", jobId);
  },
});

/** Cancels a job (student/requester/admin); notifies the other party. */
export const cancel = mutation({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, { jobId }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const job = await ctx.db.get("jobs", jobId);
    if (!job) throw new Error("Job not found");
    const isStudent = job.studentId === user._id;
    const isRequester = job.requesterId === user._id;
    if (!isStudent && !isRequester && user.role !== "admin") {
      throw new Error("Not authorized");
    }
    if (job.status === "completed" || job.status === "cancelled") {
      throw new Error("Job is already closed");
    }
    await ctx.db.patch("jobs", jobId, {
      status: "cancelled",
      updatedAt: Date.now(),
    });
    const otherParty = isRequester ? job.studentId : job.requesterId;
    await notify(ctx, {
      userId: otherParty,
      type: "system",
      title: "Job cancelled",
      message: "A job engagement was cancelled.",
      relatedJobId: job._id,
    });
    return await ctx.db.get("jobs", jobId);
  },
});