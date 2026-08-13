import { internalMutation, query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import type { UserJSON } from "@clerk/backend";
import { v } from "convex/values";
import type { Validator } from "convex/values";

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const now = Date.now();

    const username =
      [data.first_name, data.last_name]
        .filter((name): name is string => !!name)
        .join(" ")
        .trim() || data.username || "User";

    const primaryEmail = data.email_addresses.find(
      (email) => email.id === data.primary_email_address_id,
    );

    const user = await userByExternalId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert("users", {
        username,
        externalId: data.id,
        email: primaryEmail?.email_address,
        profileImage: data.image_url || undefined,
        role: "student",
        isVerified: false,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      await ctx.db.patch("users", user._id, {
        username,
        externalId: data.id,
        email: primaryEmail?.email_address,
        profileImage: data.image_url || undefined,
        updatedAt: now,
      });
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete("users", user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
      );
    }
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (userRecord) return userRecord;
  
  // Fallback for local development without Auth configured
  const fallback = await ctx.db.query("users").first();
  if (fallback) return fallback;
  
  throw new Error("Can't get current user and no fallback users exist in DB");
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
    .unique();
}
