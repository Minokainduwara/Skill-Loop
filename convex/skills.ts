import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { requireRole } from "./lib/roles";

const categoryOf = (s: Doc<"skills">) => s.category;

/** All visible skills, sorted by name. `includeInactive` is admin-facing. */
export const list = query({
  args: { includeInactive: v.optional(v.boolean()) },
  handler: async (ctx, { includeInactive }) => {
    const skills = await ctx.db.query("skills").collect();
    const visible = includeInactive ? skills : skills.filter((s) => s.isActive);
    return visible.sort((a, b) => a.name.localeCompare(b.name));
  },
});

/** Active skills grouped by category (for forms, onboarding, and pickers). */
export const listByCategory = query({
  args: {},
  handler: async (ctx) => {
    const skills = await ctx.db.query("skills").collect();
    const active = skills.filter((s) => s.isActive);
    const buckets = new Map<string, Doc<"skills">[]>();
    for (const s of active) {
      const arr = buckets.get(categoryOf(s)) ?? [];
      arr.push(s);
      buckets.set(categoryOf(s), arr);
    }
    const result: { category: string; skills: Doc<"skills">[] }[] = [];
    for (const [category, arr] of buckets) {
      result.push({
        category,
        skills: arr.sort((a, b) => a.name.localeCompare(b.name)),
      });
    }
    return result.sort((a, b) => a.category.localeCompare(b.category));
  },
});

export const get = query({
  args: { skillId: v.id("skills") },
  handler: async (ctx, { skillId }) => {
    return await ctx.db.get("skills", skillId);
  },
});

/** Admin: create a skill in the taxonomy. */
export const create = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { name, category, description }) => {
    await requireRole(ctx, "admin");
    return await ctx.db.insert("skills", {
      name,
      category,
      description,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

/** Admin: update skill metadata. */
export const update = mutation({
  args: {
    skillId: v.id("skills"),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { skillId, name, category, description }) => {
    await requireRole(ctx, "admin");
    const skill = await ctx.db.get("skills", skillId);
    if (!skill) throw new Error("Skill not found");
    await ctx.db.patch("skills", skillId, {
      ...(name !== undefined ? { name } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(description !== undefined ? { description } : {}),
    });
    return await ctx.db.get("skills", skillId);
  },
});

/** Admin: flip a skill's active flag. */
export const toggleActive = mutation({
  args: { skillId: v.id("skills") },
  handler: async (ctx, { skillId }) => {
    await requireRole(ctx, "admin");
    const skill = await ctx.db.get("skills", skillId);
    if (!skill) throw new Error("Skill not found");
    await ctx.db.patch("skills", skillId, { isActive: !skill.isActive });
    return await ctx.db.get("skills", skillId);
  },
});
