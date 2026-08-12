import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";
import { requireRole } from "./lib/roles";
import { notify } from "./lib/notify";
import { completeJob } from "./lib/payments";

/** Deliverables for a job (participants/admin only). */
export const listByJob = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, { jobId }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const job = await ctx.db.get("jobs", jobId);
    if (!job) throw new Error("Job not found");
    const isParticipant =
      job.studentId === user._id || job.requesterId === user._id;
    if (!isParticipant && user.role !== "admin") {
      throw new Error("Not authorized");
    }
    return await ctx.db
      .query("jobDeliverables")
      .withIndex("byJob", (q) => q.eq("jobId", jobId))
      .collect();
  },
});

/**
 * Student submits a deliverable for a job. Marks the job `submitted` and
 * notifies the requester. A fresh submission supersedes a revision request.
 */
export const submit = mutation({
  args: {
    jobId: v.id("jobs"),
    description: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    externalUrl: v.optional(v.string()),
  },
  handler: async (ctx, { jobId, description, fileUrl, externalUrl }) => {
    const user = await requireRole(ctx, "student");
    const job = await ctx.db.get("jobs", jobId);
    if (!job) throw new Error("Job not found");
    if (job.studentId !== user._id) throw new Error("Not authorized");
    if (job.status === "completed" || job.status === "cancelled") {
      throw new Error("Job is closed");
    }
    const now = Date.now();
    const id = await ctx.db.insert("jobDeliverables", {
      jobId,
      description,
      fileUrl,
      externalUrl,
      submittedAt: now,
      status: "submitted",
      createdAt: now,
    });
    if (job.status !== "submitted") {
      await ctx.db.patch("jobs", jobId, {
        status: "submitted",
        submittedAt: now,
        updatedAt: now,
      });
    }
    await notify(ctx, {
      userId: job.requesterId,
      type: "job_application",
      title: "Work submitted",
      message: "New work has been submitted for review.",
      relatedJobId: job._id,
    });
    return id;
  },
});

/** Requester requests a revision; flips the job back to `revision`. */
export const requestRevision = mutation({
  args: {
    deliverableId: v.id("jobDeliverables"),
  },
  handler: async (ctx, { deliverableId }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const d = await ctx.db.get("jobDeliverables", deliverableId);
    if (!d) throw new Error("Deliverable not found");
    const job = await ctx.db.get("jobs", d.jobId);
    if (!job) throw new Error("Job not found");
    if (job.requesterId !== user._id && user.role !== "admin") {
      throw new Error("Not authorized");
    }
    if (job.status !== "submitted") throw new Error("Job is not in review");
    await ctx.db.patch("jobDeliverables", deliverableId, {
      status: "revision_requested",
    });
    await ctx.db.patch("jobs", d.jobId, {
      status: "revision",
      updatedAt: Date.now(),
    });
    await notify(ctx, {
      userId: job.studentId,
      type: "system",
      title: "Revision requested",
      message: "Work was sent back for revision.",
      relatedJobId: job._id,
    });
    return true;
  },
});

/**
 * Requester approves a deliverable: completes the job, records earnings, and
 * notifies the student. Idempotent for already-completed jobs.
 */
export const approve = mutation({
  args: { deliverableId: v.id("jobDeliverables") },
  handler: async (ctx, { deliverableId }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const d = await ctx.db.get("jobDeliverables", deliverableId);
    if (!d) throw new Error("Deliverable not found");
    const job = await ctx.db.get("jobs", d.jobId);
    if (!job) throw new Error("Job not found");
    if (job.requesterId !== user._id && user.role !== "admin") {
      throw new Error("Not authorized");
    }
    if (job.status === "completed") {
      throw new Error("Job already completed");
    }
    await ctx.db.patch("jobDeliverables", deliverableId, { status: "approved" });
    const now = Date.now();
    await ctx.db.patch("jobs", job._id, {
      status: "completed",
      completedAt: now,
      updatedAt: now,
    });
    await ctx.db.patch("jobRequests", job.jobRequestId, {
      status: "completed",
      updatedAt: now,
    });
    await completeJob(ctx, job);
    await notify(ctx, {
      userId: job.studentId,
      type: "job_completed",
      title: "Work approved 🎉",
      message: "Your deliverable was approved and payment was recorded.",
      relatedJobId: job._id,
    });
    return true;
  },
});