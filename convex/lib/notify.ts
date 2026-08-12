import type { MutationCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";

export type NotificationType = Doc<"notifications">["type"];

/**
 * Inserts a notification row for `userId`. Reused across modules so every
 * domain function pushes the same-shaped notification.
 */
export async function notify(
  ctx: MutationCtx,
  args: {
    userId: Id<"users">;
    type: NotificationType;
    title: string;
    message: string;
    relatedJobId?: Id<"jobs">;
    relatedJobRequestId?: Id<"jobRequests">;
  },
) {
  await ctx.db.insert("notifications", {
    userId: args.userId,
    type: args.type,
    title: args.title,
    message: args.message,
    relatedJobId: args.relatedJobId,
    relatedJobRequestId: args.relatedJobRequestId,
    isRead: false,
    createdAt: Date.now(),
  });
}
