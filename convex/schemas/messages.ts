import { defineTable } from "convex/server";
import { v } from "convex/values";

export const messages = defineTable({
  channelId: v.id("channels"),
  senderId: v.id("users"),
  text: v.string(),
  createdAt: v.number(),
})
  .index("byChannel", ["channelId"]);
