import { mutation, query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { getCurrentUserOrThrow } from "./users";

const PROFICIENCY = v.union(
  v.literal("beginner"),
  v.literal("intermediate"),
  v.literal("advanced"),
  v.literal("expert"),
);

async function joinSkills(
  ctx: QueryCtx,
  links: Doc<"studentSkills">[],
): Promise<(Doc<"studentSkills"> & { skill: Doc<"skills"> | null })[]> {
  return await Promise.all(
    links.map(async (link) => {
      const skill = await ctx.db.get("skills", link.skillId);
      return { ...link, skill };
    }),
  );
}

/** Public skill list for any student. */
export const listForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const links = await ctx.db
      .query("studentSkills")
      .withIndex("byStudent", (q) => q.eq("studentId", userId))
      .collect();
    return await joinSkills(ctx, links);
  },
});

/** Current student's own skills. */
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    const links = await ctx.db
      .query("studentSkills")
      .withIndex("byStudent", (q) => q.eq("studentId", user._id))
      .collect();
    return await joinSkills(ctx, links);
  },
});

/** Add a skill to the current student's profile. */
export const add = mutation({
  args: {
    skillId: v.id("skills"),
    proficiencyLevel: PROFICIENCY,
    yearsOfExperience: v.optional(v.number()),
    isPrimary: v.optional(v.boolean()),
  },
  handler: async (ctx, { skillId, proficiencyLevel, yearsOfExperience, isPrimary }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const existing = await ctx.db
      .query("studentSkills")
      .withIndex("byStudentSkill", (q) => q.eq("studentId", user._id).eq("skillId", skillId))
      .unique();
    if (existing) throw new Error("Skill already on profile");
    return await ctx.db.insert("studentSkills", {
      studentId: user._id,
      skillId,
      proficiencyLevel,
      yearsOfExperience,
      isPrimary: isPrimary ?? false,
      createdAt: Date.now(),
    });
  },
});

/** Update proficiency/experience for one of the student's skills. */
export const update = mutation({
  args: {
    skillId: v.id("skills"),
    proficiencyLevel: v.optional(PROFICIENCY),
    yearsOfExperience: v.optional(v.number()),
    isPrimary: v.optional(v.boolean()),
  },
  handler: async (ctx, { skillId, proficiencyLevel, yearsOfExperience, isPrimary }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const link = await ctx.db
      .query("studentSkills")
      .withIndex("byStudentSkill", (q) => q.eq("studentId", user._id).eq("skillId", skillId))
      .unique();
    if (!link) throw new Error("Skill not on profile");
    await ctx.db.patch("studentSkills", link._id, {
      ...(proficiencyLevel !== undefined ? { proficiencyLevel } : {}),
      ...(yearsOfExperience !== undefined ? { yearsOfExperience } : {}),
      ...(isPrimary !== undefined ? { isPrimary } : {}),
    });
    return await ctx.db.get("studentSkills", link._id);
  },
});

/** Remove a skill from the current student's profile. */
export const remove = mutation({
  args: { skillId: v.id("skills") },
  handler: async (ctx, { skillId }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const link = await ctx.db
      .query("studentSkills")
      .withIndex("byStudentSkill", (q) => q.eq("studentId", user._id).eq("skillId", skillId))
      .unique();
    if (!link) throw new Error("Skill not on profile");
    await ctx.db.delete("studentSkills", link._id);
  },
});
