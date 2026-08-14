import { mutation, query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";
import { requireAnyRole, requireRole } from "./lib/roles";
import { notify } from "./lib/notify";

/** All applications for a request (requester/admin view). */
export const listByJob = query({
  args: { jobRequestId: v.id("jobRequests") },
  handler: async (ctx, { jobRequestId }) => {
    return await ctx.db
      .query("applications")
      .withIndex("byJob", (q) => q.eq("jobRequestId", jobRequestId))
      .collect();
  },
});

/** The current student's own applications. */
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    return await ctx.db
      .query("applications")
      .withIndex("byStudent", (q) => q.eq("studentId", user._id))
      .collect();
  },
});

export const get = query({
  args: { applicationId: v.id("applications") },
  handler: async (ctx, { applicationId }) => {
    return await ctx.db.get("applications", applicationId);
  },
});

/** Student applies to an open request. Dedupes; notifies the requester. */
export const apply = mutation({
  args: {
    jobRequestId: v.id("jobRequests"),
    proposal: v.optional(v.string()),
    proposedPrice: v.optional(v.number()),
    estimatedDeliveryDays: v.optional(v.number()),
  },
  handler: async (ctx, { jobRequestId, proposal, proposedPrice, estimatedDeliveryDays }) => {
    const user = await requireRole(ctx, "student");
    const request = await ctx.db.get("jobRequests", jobRequestId);
    if (!request) throw new Error("Job request not found");
    if (request.status !== "open" && request.status !== "matching") {
      throw new Error("This request is not accepting applications");
    }
    const rows = await ctx.db
      .query("applications")
      .withIndex("byJob", (q) => q.eq("jobRequestId", jobRequestId))
      .collect();
    if (rows.some((a) => a.studentId === user._id)) {
      throw new Error("You already applied to this request");
    }
    const id = await ctx.db.insert("applications", {
      jobRequestId,
      studentId: user._id,
      proposal,
      proposedPrice,
      estimatedDeliveryDays,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    await notify(ctx, {
      userId: request.requesterId,
      type: "job_application",
      title: "New application",
      message: `${user.username} applied to "${request.title}"`,
      relatedJobRequestId: request._id,
    });
    return id;
  },
});

/** Requester/admin shortlists an application. */
export const shortlist = mutation({
  args: { applicationId: v.id("applications") },
  handler: async (ctx, { applicationId }) => {
    const app = await ownedByRequester(ctx, applicationId);
    await ctx.db.patch("applications", app._id, {
      status: "shortlisted",
      updatedAt: Date.now(),
    });
    return await ctx.db.get("applications", app._id);
  },
});

/** Requester/admin rejects an application. */
export const reject = mutation({
  args: { applicationId: v.id("applications") },
  handler: async (ctx, { applicationId }) => {
    const app = await ownedByRequester(ctx, applicationId);
    await ctx.db.patch("applications", app._id, {
      status: "rejected",
      updatedAt: Date.now(),
    });
    return await ctx.db.get("applications", app._id);
  },
});

/** Student withdraws their own pending application. */
export const withdraw = mutation({
  args: { applicationId: v.id("applications") },
  handler: async (ctx, { applicationId }) => {
    const user = await requireRole(ctx, "student");
    const app = await ctx.db.get("applications", applicationId);
    if (!app) throw new Error("Application not found");
    if (app.studentId !== user._id) throw new Error("Not authorized");
    await ctx.db.patch("applications", app._id, {
      status: "withdrawn",
      updatedAt: Date.now(),
    });
    return await ctx.db.get("applications", app._id);
  },
});

/**
 * Requester/admin accepts an application: creates the `jobs` row, marks the
 * request assigned, rejects other pending applications, and notifies the
 * student.
 */
export const accept = mutation({
  args: {
    applicationId: v.id("applications"),
    agreedPrice: v.optional(v.number()),
  },
  handler: async (ctx, { applicationId, agreedPrice }) => {
    const user = await requireAnyRole(ctx, ["requester", "admin"]);
    const app = await ctx.db.get("applications", applicationId);
    if (!app) throw new Error("Application not found");
    const request = await ctx.db.get("jobRequests", app.jobRequestId);
    if (!request) throw new Error("Job request not found");
    if (request.requesterId !== user._id && user.role !== "admin") {
      throw new Error("Not authorized");
    }
    if (app.status !== "pending" && app.status !== "shortlisted") {
      throw new Error("Application is not in an accept-able state");
    }

    const agreed = agreedPrice ?? app.proposedPrice ?? request.budgetMin ?? request.budgetMax ?? 0;

    const siblings = await ctx.db
      .query("applications")
      .withIndex("byJob", (q) => q.eq("jobRequestId", request._id))
      .collect();
    const now = Date.now();
    for (const other of siblings) {
      if (other._id !== app._id && other.status === "pending") {
        await ctx.db.patch("applications", other._id, {
          status: "rejected",
          updatedAt: now,
        });
      }
    }

    await ctx.db.patch("applications", app._id, {
      status: "accepted",
      updatedAt: now,
    });
    await ctx.db.patch("jobRequests", request._id, {
      status: "assigned",
      updatedAt: now,
    });

    const jobId = await ctx.db.insert("jobs", {
      jobRequestId: request._id,
      requesterId: request.requesterId,
      studentId: app.studentId,
      applicationId: app._id,
      agreedPrice: agreed,
      deadline: request.deadline ?? undefined,
      status: "assigned",
      startedAt: undefined,
      submittedAt: undefined,
      completedAt: undefined,
      createdAt: now,
      updatedAt: now,
    });

    await notify(ctx, {
      userId: app.studentId,
      type: "application_accepted",
      title: "Application accepted 🎉",
      message: `You were hired for "${request.title}"`,
      relatedJobId: jobId,
      relatedJobRequestId: request._id,
    });
    return jobId;
  },
});

async function ownedByRequester(ctx: MutationCtx, applicationId: Id<"applications">) {
  const user = await requireAnyRole(ctx, ["requester", "admin"]);
  const app = await ctx.db.get("applications", applicationId);
  if (!app) throw new Error("Application not found");
  const request = await ctx.db.get("jobRequests", app.jobRequestId);
  if (!request) throw new Error("Job request not found");
  if (request.requesterId !== user._id && user.role !== "admin") {
    throw new Error("Not authorized");
  }
  return app;
}
