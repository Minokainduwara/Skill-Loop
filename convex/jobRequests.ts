import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";
import { requireRole } from "./lib/roles";

const OPEN = "open";

/** The current requester's own job requests. */
export const listByRequester = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    return await ctx.db
      .query("jobRequests")
      .withIndex("byRequester", (q) => q.eq("requesterId", user._id))
      .collect();
  },
});

/** Open job requests for students to browse, optionally filtered by category. */
export const listOpen = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, { category }) => {
    const rows = category
      ? (await ctx.db
          .query("jobRequests")
          .withIndex("byCategory", (q) => q.eq("category", category))
          .collect()).filter((r) => r.status === OPEN)
      : await ctx.db
          .query("jobRequests")
          .withIndex("byStatus", (q) => q.eq("status", OPEN))
          .collect();
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const get = query({
  args: { jobRequestId: v.id("jobRequests") },
  handler: async (ctx, { jobRequestId }) => {
    return await ctx.db.get("jobRequests", jobRequestId);
  },
});

/** Requester posts a new need. */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.optional(v.string()),
    budgetMin: v.optional(v.number()),
    budgetMax: v.optional(v.number()),
    deadline: v.optional(v.number()),
    location: v.optional(v.string()),
    isRemote: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await requireRole(ctx, "requester");
    const now = Date.now();
    return await ctx.db.insert("jobRequests", {
      requesterId: user._id,
      title: args.title,
      description: args.description,
      category: args.category,
      budgetMin: args.budgetMin,
      budgetMax: args.budgetMax,
      deadline: args.deadline,
      location: args.location,
      isRemote: args.isRemote,
      status: OPEN,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/** Owner (or admin) updates an open request. */
export const update = mutation({
  args: {
    jobRequestId: v.id("jobRequests"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    budgetMin: v.optional(v.number()),
    budgetMax: v.optional(v.number()),
    deadline: v.optional(v.number()),
    location: v.optional(v.string()),
    isRemote: v.optional(v.boolean()),
  },
  handler: async (ctx, { jobRequestId, ...fields }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const request = await ctx.db.get("jobRequests", jobRequestId);
    if (!request) throw new Error("Job request not found");
    if (request.requesterId !== user._id && user.role !== "admin") {
      throw new Error("Not authorized");
    }
    if (request.status === "completed" || request.status === "cancelled") {
      throw new Error("Request is closed");
    }
    await ctx.db.patch("jobRequests", jobRequestId, {
      ...fields,
      updatedAt: Date.now(),
    });
    return await ctx.db.get("jobRequests", jobRequestId);
  },
});

/** Owner (or admin) cancels an open request. */
export const cancel = mutation({
  args: { jobRequestId: v.id("jobRequests") },
  handler: async (ctx, { jobRequestId }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const request = await ctx.db.get("jobRequests", jobRequestId);
    if (!request) throw new Error("Job request not found");
    if (request.requesterId !== user._id && user.role !== "admin") {
      throw new Error("Not authorized");
    }
    if (request.status === "completed") {
      throw new Error("Cannot cancel a completed request");
    }
    await ctx.db.patch("jobRequests", jobRequestId, {
      status: "cancelled",
      updatedAt: Date.now(),
    });
    return await ctx.db.get("jobRequests", jobRequestId);
  },
});