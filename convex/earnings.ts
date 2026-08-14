import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireRole } from "./lib/roles";

/** The current student's earnings history. */
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireRole(ctx, "student");
    return await ctx.db
      .query("earnings")
      .withIndex("byStudent", (q) => q.eq("studentId", user._id))
      .collect();
  },
});

/** Aggregated totals for the current student's earnings. */
export const summary = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireRole(ctx, "student");
    const rows = await ctx.db
      .query("earnings")
      .withIndex("byStudent", (q) => q.eq("studentId", user._id))
      .collect();
    const byStatus = (s: string) =>
      rows.filter((r) => r.status === s).reduce((sum, r) => sum + r.netAmount, 0);
    return {
      total: rows.reduce((sum, r) => sum + r.netAmount, 0),
      available: byStatus("available"),
      pending: byStatus("pending"),
      paid: byStatus("paid"),
      count: rows.length,
    };
  },
});

/** Earnings for a specific student (admin view). */
export const listByStudent = query({
  args: { studentId: v.id("users") },
  handler: async (ctx, { studentId }) => {
    await requireRole(ctx, "admin");
    return await ctx.db
      .query("earnings")
      .withIndex("byStudent", (q) => q.eq("studentId", studentId))
      .collect();
  },
});

/** All earnings (admin dashboard). */
export const all = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, "admin");
    return await ctx.db.query("earnings").collect();
  },
});

/** Admin marks an earning as paid. */
export const markPaid = mutation({
  args: { earningId: v.id("earnings") },
  handler: async (ctx, { earningId }) => {
    await requireRole(ctx, "admin");
    const earning = await ctx.db.get("earnings", earningId);
    if (!earning) throw new Error("Earning not found");
    await ctx.db.patch("earnings", earningId, {
      status: "paid",
      paidAt: Date.now(),
    });
    return await ctx.db.get("earnings", earningId);
  },
});