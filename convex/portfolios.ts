import { mutation, query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { getCurrentUserOrThrow } from "./users";

async function listFor(ctx: QueryCtx, studentId: Id<"users">): Promise<Doc<"portfolios">[]> {
  return await ctx.db
    .query("portfolios")
    .withIndex("byStudent", (q) => q.eq("studentId", studentId))
    .collect();
}

/** Public portfolio items for any student. */
export const listForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await listFor(ctx, userId);
  },
});

/** The current student's own portfolio items. */
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    return await listFor(ctx, user._id);
  },
});

/** Current student adds a portfolio item. */
export const create = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    projectUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    skills: v.array(v.id("skills")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const now = Date.now();
    return await ctx.db.insert("portfolios", {
      studentId: user._id,
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/** Owner updates a portfolio item. */
export const update = mutation({
  args: {
    portfolioId: v.id("portfolios"),
    title: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    projectUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    skills: v.optional(v.array(v.id("skills"))),
  },
  handler: async (ctx, { portfolioId, ...fields }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const portfolio = await ctx.db.get("portfolios", portfolioId);
    if (!portfolio) throw new Error("Portfolio item not found");
    if (portfolio.studentId !== user._id && user.role !== "admin") {
      throw new Error("Not authorized");
    }
    await ctx.db.patch("portfolios", portfolioId, {
      ...fields,
      updatedAt: Date.now(),
    });
    return await ctx.db.get("portfolios", portfolioId);
  },
});

/** Owner removes a portfolio item. */
export const remove = mutation({
  args: { portfolioId: v.id("portfolios") },
  handler: async (ctx, { portfolioId }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const portfolio = await ctx.db.get("portfolios", portfolioId);
    if (!portfolio) throw new Error("Portfolio item not found");
    if (portfolio.studentId !== user._id && user.role !== "admin") {
      throw new Error("Not authorized");
    }
    await ctx.db.delete("portfolios", portfolioId);
  },
});