import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";
import { notify } from "./lib/notify";

export const listChannels = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    
    let channels;
    if (user.role === "student") {
      channels = await ctx.db
        .query("channels")
        .withIndex("byStudent", (q) => q.eq("studentId", user._id))
        .collect();
    } else {
      channels = await ctx.db
        .query("channels")
        .withIndex("byRequester", (q) => q.eq("requesterId", user._id))
        .collect();
    }
    
    channels.sort((a, b) => b.updatedAt - a.updatedAt);
    
    return await Promise.all(channels.map(async (ch) => {
      const otherUserId = user.role === "student" ? ch.requesterId : ch.studentId;
      const otherUser = await ctx.db.get("users", otherUserId);
      const jobRequest = await ctx.db.get("jobRequests", ch.jobRequestId);
      return { ...ch, otherUser, jobRequest };
    }));
  },
});

export const listMessages = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, { channelId }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const channel = await ctx.db.get("channels", channelId);
    if (!channel) throw new Error("Channel not found");
    if (channel.studentId !== user._id && channel.requesterId !== user._id) {
      throw new Error("Not authorized");
    }
    
    return await ctx.db
      .query("messages")
      .withIndex("byChannel", (q) => q.eq("channelId", channelId))
      .collect();
  },
});

export const sendMessage = mutation({
  args: { channelId: v.id("channels"), text: v.string() },
  handler: async (ctx, { channelId, text }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const channel = await ctx.db.get("channels", channelId);
    if (!channel) throw new Error("Channel not found");
    if (channel.studentId !== user._id && channel.requesterId !== user._id) {
      throw new Error("Not authorized");
    }
    
    const now = Date.now();
    await ctx.db.patch("channels", channelId, { updatedAt: now });
    
    const messageId = await ctx.db.insert("messages", {
      channelId,
      senderId: user._id,
      text,
      createdAt: now,
    });
    
    const otherUserId = user.role === "student" ? channel.requesterId : channel.studentId;
    await notify(ctx, {
      userId: otherUserId,
      type: "system",
      title: `New message from ${user.username}`,
      message: text,
      relatedJobRequestId: channel.jobRequestId,
    });
    
    return messageId;
  },
});

export const getOrCreateChannel = mutation({
  args: { jobRequestId: v.id("jobRequests"), studentId: v.id("users") },
  handler: async (ctx, { jobRequestId, studentId }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const request = await ctx.db.get("jobRequests", jobRequestId);
    if (!request) throw new Error("Job request not found");
    
    // Authorization: User must be either the student or the requester
    if (user._id !== studentId && user._id !== request.requesterId) {
      throw new Error("Not authorized to create channel");
    }
    
    const existing = await ctx.db
      .query("channels")
      .withIndex("byJob", (q) => q.eq("jobRequestId", jobRequestId))
      .filter((q) => q.eq(q.field("studentId"), studentId))
      .first();
      
    if (existing) return existing._id;
    
    return await ctx.db.insert("channels", {
      jobRequestId,
      studentId,
      requesterId: request.requesterId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
