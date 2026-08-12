import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";

/** The current user's notifications, newest first. */
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    const rows = await ctx.db
      .query("notifications")
      .withIndex("byUser", (q) => q.eq("userId", user._id))
      .collect();
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/** Count of unread notifications for the current user. */
export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    const rows = await ctx.db
      .query("notifications")
      .withIndex("byUser", (q) => q.eq("userId", user._id))
      .collect();
    return rows.filter((r) => !r.isRead).length;
  },
});

/** Marks one notification as read (owner only). */
export const markRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, { notificationId }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const notification = await ctx.db.get("notifications", notificationId);
    if (!notification) throw new Error("Notification not found");
    if (notification.userId !== user._id && user.role !== "admin") {
      throw new Error("Not authorized");
    }
    await ctx.db.patch("notifications", notificationId, { isRead: true });
  },
});

/** Marks all of the current user's notifications as read. */
export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    const rows = await ctx.db
      .query("notifications")
      .withIndex("byUser", (q) => q.eq("userId", user._id))
      .collect();
    for (const row of rows) {
      if (!row.isRead) {
        await ctx.db.patch("notifications", row._id, { isRead: true });
      }
    }
  },
});