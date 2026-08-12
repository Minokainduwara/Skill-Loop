import type { QueryCtx } from "../_generated/server";
import { getCurrentUserOrThrow } from "../users";

export type Role = "student" | "requester" | "admin";

/**
 * Returns the current authenticated user after verifying they hold `role`.
 * Throws if unauthenticated or the role does not match.
 */
export async function requireRole(ctx: QueryCtx, role: Role) {
  const user = await getCurrentUserOrThrow(ctx);
  if (user.role !== role) {
    throw new Error(`Requires '${role}' role, got '${user.role}'`);
  }
  return user;
}

/**
 * Returns the current authenticated user after verifying they hold at least one
 * of the given roles.
 */
export async function requireAnyRole(ctx: QueryCtx, roles: Role[]) {
  const user = await getCurrentUserOrThrow(ctx);
  if (!roles.includes(user.role)) {
    throw new Error(`Requires one of roles: ${roles.join(", ")}`);
  }
  return user;
}
