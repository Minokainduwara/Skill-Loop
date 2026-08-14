import type { MutationCtx } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";

/** Platform commission applied to every completed job. */
export const PLATFORM_FEE_RATE = 0.1;

/**
 * Runs the financial + reputation bookkeeping for a completed job:
 * creates the earnings row and bumps the student profile's aggregates.
 * Call once per job, exactly when the job transitions to `completed`.
 */
export async function completeJob(ctx: MutationCtx, job: Doc<"jobs">) {
  const now = Date.now();
  const platformFee = Math.round(job.agreedPrice * PLATFORM_FEE_RATE);
  const netAmount = job.agreedPrice - platformFee;

  await ctx.db.insert("earnings", {
    studentId: job.studentId,
    jobId: job._id,
    amount: job.agreedPrice,
    platformFee,
    netAmount,
    currency: "LKR",
    status: "available",
    createdAt: now,
  });

  const profile = await ctx.db
    .query("studentProfiles")
    .withIndex("byUser", (q) => q.eq("userId", job.studentId))
    .unique();
  if (profile) {
    await ctx.db.patch("studentProfiles", profile._id, {
      totalEarnings: profile.totalEarnings + netAmount,
      completedJobs: profile.completedJobs + 1,
      updatedAt: now,
    });
  }
}
