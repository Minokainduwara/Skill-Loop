import { mutation, type MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

const role = v.union(v.literal("student"), v.literal("requester"), v.literal("admin"));
const experienceLevel = v.union(
  v.literal("beginner"),
  v.literal("intermediate"),
  v.literal("advanced"),
);
const availability = v.union(
  v.literal("available"),
  v.literal("busy"),
  v.literal("unavailable"),
);
const proficiencyLevel = v.union(
  v.literal("beginner"),
  v.literal("intermediate"),
  v.literal("advanced"),
  v.literal("expert"),
);
const jobStatus = v.union(
  v.literal("assigned"),
  v.literal("in_progress"),
  v.literal("submitted"),
  v.literal("revision"),
  v.literal("completed"),
  v.literal("cancelled"),
);

async function currentUserOrThrow(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    throw new Error("You must be signed in.");
  }

  const user =
    (await userByExternalId(ctx, identity.tokenIdentifier)) ??
    (await userByExternalId(ctx, identity.subject));

  if (user === null) {
    throw new Error("No SkillLoop user record found for this account.");
  }
  if (!user.isActive) {
    throw new Error("This account is not active.");
  }
  return user;
}

async function userByExternalId(ctx: MutationCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
    .unique();
}

async function requireAdmin(ctx: MutationCtx) {
  const user = await currentUserOrThrow(ctx);
  if (user.role !== "admin") {
    throw new Error("Admin access required.");
  }
  return user;
}

async function ensureSkill(ctx: MutationCtx, name: string, category: string) {
  const cleanName = name.trim();
  if (cleanName.length === 0) {
    throw new Error("Skill name is required.");
  }

  const existing = await ctx.db
    .query("skills")
    .withIndex("byName", (q) => q.eq("name", cleanName))
    .unique();

  if (existing !== null) {
    return existing._id;
  }

  return await ctx.db.insert("skills", {
    name: cleanName,
    category,
    isActive: true,
    createdAt: Date.now(),
  });
}

async function notify(
  ctx: MutationCtx,
  args: {
    userId: Id<"users">;
    type:
      | "new_match"
      | "job_application"
      | "application_accepted"
      | "job_completed"
      | "payment"
      | "opportunity"
      | "review"
      | "system";
    title: string;
    message: string;
    relatedJobId?: Id<"jobs">;
    relatedJobRequestId?: Id<"jobRequests">;
  },
) {
  return await ctx.db.insert("notifications", {
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

export const updateMyUser = mutation({
  args: {
    username: v.optional(v.string()),
    email: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    bio: v.optional(v.string()),
    role: v.optional(role),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    const user = await currentUserOrThrow(ctx);
    await ctx.db.patch("users", user._id, {
      ...args,
      updatedAt: Date.now(),
    });
    return user._id;
  },
});

export const upsertMyStudentProfile = mutation({
  args: {
    university: v.optional(v.string()),
    faculty: v.optional(v.string()),
    degree: v.optional(v.string()),
    yearOfStudy: v.optional(v.number()),
    experienceLevel,
    availability,
    hourlyRate: v.optional(v.number()),
    profileCompletion: v.optional(v.number()),
  },
  returns: v.id("studentProfiles"),
  handler: async (ctx, args) => {
    const user = await currentUserOrThrow(ctx);
    const now = Date.now();
    const existing = await ctx.db
      .query("studentProfiles")
      .withIndex("byUser", (q) => q.eq("userId", user._id))
      .unique();

    if (existing !== null) {
      await ctx.db.patch("studentProfiles", existing._id, {
        ...args,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("studentProfiles", {
      userId: user._id,
      university: args.university,
      faculty: args.faculty,
      degree: args.degree,
      yearOfStudy: args.yearOfStudy,
      experienceLevel: args.experienceLevel,
      availability: args.availability,
      hourlyRate: args.hourlyRate,
      totalEarnings: 0,
      completedJobs: 0,
      averageRating: 0,
      totalReviews: 0,
      profileCompletion: args.profileCompletion ?? 35,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const addMySkill = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    proficiencyLevel,
    yearsOfExperience: v.optional(v.number()),
    isPrimary: v.boolean(),
  },
  returns: v.id("studentSkills"),
  handler: async (ctx, args) => {
    const user = await currentUserOrThrow(ctx);
    const skillId = await ensureSkill(ctx, args.name, args.category);
    const existing = await ctx.db
      .query("studentSkills")
      .withIndex("byStudentSkill", (q) => q.eq("studentId", user._id).eq("skillId", skillId))
      .unique();

    if (existing !== null) {
      await ctx.db.patch("studentSkills", existing._id, {
        proficiencyLevel: args.proficiencyLevel,
        yearsOfExperience: args.yearsOfExperience,
        isPrimary: args.isPrimary,
      });
      return existing._id;
    }

    return await ctx.db.insert("studentSkills", {
      studentId: user._id,
      skillId,
      proficiencyLevel: args.proficiencyLevel,
      yearsOfExperience: args.yearsOfExperience,
      isPrimary: args.isPrimary,
      createdAt: Date.now(),
    });
  },
});

export const addPortfolioProject = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    projectUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    skillNames: v.array(v.string()),
  },
  returns: v.id("portfolios"),
  handler: async (ctx, args) => {
    const user = await currentUserOrThrow(ctx);
    const skills: Id<"skills">[] = [];
    for (const skillName of args.skillNames) {
      skills.push(await ensureSkill(ctx, skillName, args.category));
    }

    const now = Date.now();
    return await ctx.db.insert("portfolios", {
      studentId: user._id,
      title: args.title,
      description: args.description,
      category: args.category,
      projectUrl: args.projectUrl,
      imageUrl: args.imageUrl,
      skills,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const createJobRequest = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    budgetMin: v.optional(v.number()),
    budgetMax: v.optional(v.number()),
    deadline: v.optional(v.number()),
    location: v.optional(v.string()),
    isRemote: v.boolean(),
    requiredSkillNames: v.array(v.string()),
    experienceLevel: v.optional(experienceLevel),
    aiConfidence: v.optional(v.number()),
    rawAiResponse: v.optional(v.string()),
  },
  returns: v.object({
    jobRequestId: v.id("jobRequests"),
    aiRequirementId: v.id("aiRequirements"),
  }),
  handler: async (ctx, args) => {
    const requester = await currentUserOrThrow(ctx);
    const now = Date.now();
    const requiredSkills: Id<"skills">[] = [];
    for (const skillName of args.requiredSkillNames) {
      requiredSkills.push(await ensureSkill(ctx, skillName, args.category));
    }

    const jobRequestId = await ctx.db.insert("jobRequests", {
      requesterId: requester._id,
      title: args.title,
      description: args.description,
      category: args.category,
      budgetMin: args.budgetMin,
      budgetMax: args.budgetMax,
      deadline: args.deadline,
      location: args.location,
      isRemote: args.isRemote,
      status: "matching",
      createdAt: now,
      updatedAt: now,
    });

    const aiRequirementId = await ctx.db.insert("aiRequirements", {
      jobRequestId,
      category: args.category,
      requiredSkills,
      extractedBudget: args.budgetMax ?? args.budgetMin,
      extractedDeadline: args.deadline,
      experienceLevel: args.experienceLevel,
      locationRequirement: args.location,
      isRemote: args.isRemote,
      aiConfidence: args.aiConfidence,
      rawResponse: args.rawAiResponse,
      createdAt: now,
    });

    return { jobRequestId, aiRequirementId };
  },
});

export const createMatch = mutation({
  args: {
    jobRequestId: v.id("jobRequests"),
    studentId: v.id("users"),
    skillScore: v.number(),
    availabilityScore: v.number(),
    experienceScore: v.number(),
    ratingScore: v.number(),
    locationScore: v.number(),
    budgetScore: v.optional(v.number()),
    matchReason: v.optional(v.string()),
  },
  returns: v.id("matches"),
  handler: async (ctx, args) => {
    const requester = await currentUserOrThrow(ctx);
    const jobRequest = await ctx.db.get(args.jobRequestId);
    if (jobRequest === null || jobRequest.requesterId !== requester._id) {
      throw new Error("You can only create matches for your own request.");
    }

    const totalScore =
      args.skillScore * 0.5 +
      args.availabilityScore * 0.15 +
      args.experienceScore * 0.15 +
      args.ratingScore * 0.1 +
      args.locationScore * 0.1 +
      (args.budgetScore ?? 0) * 0.0;

    const matchId = await ctx.db.insert("matches", {
      jobRequestId: args.jobRequestId,
      studentId: args.studentId,
      skillScore: args.skillScore,
      availabilityScore: args.availabilityScore,
      experienceScore: args.experienceScore,
      ratingScore: args.ratingScore,
      locationScore: args.locationScore,
      budgetScore: args.budgetScore,
      totalScore,
      matchReason: args.matchReason,
      status: "suggested",
      createdAt: Date.now(),
    });

    await notify(ctx, {
      userId: args.studentId,
      type: "new_match",
      title: "New matched opportunity",
      message: jobRequest.title,
      relatedJobRequestId: args.jobRequestId,
    });

    return matchId;
  },
});

export const applyToJobRequest = mutation({
  args: {
    jobRequestId: v.id("jobRequests"),
    matchId: v.optional(v.id("matches")),
    proposal: v.optional(v.string()),
    proposedPrice: v.optional(v.number()),
    estimatedDeliveryDays: v.optional(v.number()),
  },
  returns: v.id("applications"),
  handler: async (ctx, args) => {
    const student = await currentUserOrThrow(ctx);
    const jobRequest = await ctx.db.get(args.jobRequestId);
    if (jobRequest === null) {
      throw new Error("Job request not found.");
    }
    if (jobRequest.status !== "open" && jobRequest.status !== "matching") {
      throw new Error("This request is not accepting applications.");
    }

    const existing = (await ctx.db
      .query("applications")
      .withIndex("byStudent", (q) => q.eq("studentId", student._id))
      .take(50)).find((application) => application.jobRequestId === args.jobRequestId);

    if (existing !== undefined) {
      return existing._id;
    }

    const now = Date.now();
    const applicationId = await ctx.db.insert("applications", {
      jobRequestId: args.jobRequestId,
      studentId: student._id,
      matchId: args.matchId,
      proposal: args.proposal,
      proposedPrice: args.proposedPrice,
      estimatedDeliveryDays: args.estimatedDeliveryDays,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    await notify(ctx, {
      userId: jobRequest.requesterId,
      type: "job_application",
      title: "New application received",
      message: jobRequest.title,
      relatedJobRequestId: args.jobRequestId,
    });

    return applicationId;
  },
});

export const acceptApplication = mutation({
  args: {
    applicationId: v.id("applications"),
    agreedPrice: v.number(),
    deadline: v.optional(v.number()),
  },
  returns: v.id("jobs"),
  handler: async (ctx, args) => {
    const requester = await currentUserOrThrow(ctx);
    const application = await ctx.db.get(args.applicationId);
    if (application === null) {
      throw new Error("Application not found.");
    }

    const jobRequest = await ctx.db.get(application.jobRequestId);
    if (jobRequest === null || jobRequest.requesterId !== requester._id) {
      throw new Error("You can only accept applications for your own request.");
    }

    const now = Date.now();
    const jobId = await ctx.db.insert("jobs", {
      jobRequestId: application.jobRequestId,
      requesterId: requester._id,
      studentId: application.studentId,
      applicationId: application._id,
      agreedPrice: args.agreedPrice,
      deadline: args.deadline,
      status: "assigned",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch("applications", application._id, {
      status: "accepted",
      updatedAt: now,
    });
    await ctx.db.patch("jobRequests", jobRequest._id, {
      status: "assigned",
      updatedAt: now,
    });
    if (application.matchId !== undefined) {
      await ctx.db.patch("matches", application.matchId, { status: "accepted" });
    }

    await notify(ctx, {
      userId: application.studentId,
      type: "application_accepted",
      title: "Application accepted",
      message: jobRequest.title,
      relatedJobId: jobId,
      relatedJobRequestId: jobRequest._id,
    });

    return jobId;
  },
});

export const updateJobStatus = mutation({
  args: {
    jobId: v.id("jobs"),
    status: jobStatus,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await currentUserOrThrow(ctx);
    const job = await ctx.db.get(args.jobId);
    if (job === null || (job.requesterId !== user._id && job.studentId !== user._id)) {
      throw new Error("You can only update your own jobs.");
    }

    const now = Date.now();
    await ctx.db.patch("jobs", args.jobId, {
      status: args.status,
      startedAt: args.status === "in_progress" ? now : job.startedAt,
      completedAt: args.status === "completed" ? now : job.completedAt,
      updatedAt: now,
    });
    return null;
  },
});

export const submitDeliverable = mutation({
  args: {
    jobId: v.id("jobs"),
    description: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    externalUrl: v.optional(v.string()),
  },
  returns: v.id("jobDeliverables"),
  handler: async (ctx, args) => {
    const student = await currentUserOrThrow(ctx);
    const job = await ctx.db.get(args.jobId);
    if (job === null || job.studentId !== student._id) {
      throw new Error("You can only submit work for your own job.");
    }

    const now = Date.now();
    const deliverableId = await ctx.db.insert("jobDeliverables", {
      jobId: args.jobId,
      description: args.description,
      fileUrl: args.fileUrl,
      externalUrl: args.externalUrl,
      submittedAt: now,
      status: "submitted",
      createdAt: now,
    });

    await ctx.db.patch("jobs", args.jobId, {
      status: "submitted",
      submittedAt: now,
      updatedAt: now,
    });

    await notify(ctx, {
      userId: job.requesterId,
      type: "system",
      title: "Work submitted",
      message: "A deliverable is ready for review.",
      relatedJobId: args.jobId,
      relatedJobRequestId: job.jobRequestId,
    });

    return deliverableId;
  },
});

export const approveDeliverable = mutation({
  args: {
    deliverableId: v.id("jobDeliverables"),
    rating: v.optional(v.number()),
    comment: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const requester = await currentUserOrThrow(ctx);
    const deliverable = await ctx.db.get(args.deliverableId);
    if (deliverable === null) {
      throw new Error("Deliverable not found.");
    }

    const job = await ctx.db.get(deliverable.jobId);
    if (job === null || job.requesterId !== requester._id) {
      throw new Error("You can only approve work for your own job.");
    }

    const now = Date.now();
    await ctx.db.patch("jobDeliverables", deliverable._id, { status: "approved" });
    await ctx.db.patch("jobs", job._id, {
      status: "completed",
      completedAt: now,
      updatedAt: now,
    });
    await ctx.db.patch("jobRequests", job.jobRequestId, {
      status: "completed",
      updatedAt: now,
    });

    await ctx.db.insert("earnings", {
      studentId: job.studentId,
      jobId: job._id,
      amount: job.agreedPrice,
      platformFee: 0,
      netAmount: job.agreedPrice,
      currency: "LKR",
      status: "available",
      createdAt: now,
    });

    const profile = await ctx.db
      .query("studentProfiles")
      .withIndex("byUser", (q) => q.eq("userId", job.studentId))
      .unique();
    if (profile !== null) {
      const nextReviews = args.rating === undefined ? profile.totalReviews : profile.totalReviews + 1;
      const nextRating =
        args.rating === undefined
          ? profile.averageRating
          : (profile.averageRating * profile.totalReviews + args.rating) / nextReviews;

      await ctx.db.patch("studentProfiles", profile._id, {
        totalEarnings: profile.totalEarnings + job.agreedPrice,
        completedJobs: profile.completedJobs + 1,
        averageRating: nextRating,
        totalReviews: nextReviews,
        updatedAt: now,
      });
    }

    if (args.rating !== undefined) {
      await ctx.db.insert("reviews", {
        jobId: job._id,
        reviewerId: requester._id,
        revieweeId: job.studentId,
        rating: args.rating,
        comment: args.comment,
        createdAt: now,
      });
    }

    await notify(ctx, {
      userId: job.studentId,
      type: "payment",
      title: "Job completed",
      message: `Rs. ${job.agreedPrice} is now available.`,
      relatedJobId: job._id,
      relatedJobRequestId: job.jobRequestId,
    });

    return null;
  },
});

export const requestRevision = mutation({
  args: {
    deliverableId: v.id("jobDeliverables"),
    message: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const requester = await currentUserOrThrow(ctx);
    const deliverable = await ctx.db.get(args.deliverableId);
    if (deliverable === null) {
      throw new Error("Deliverable not found.");
    }

    const job = await ctx.db.get(deliverable.jobId);
    if (job === null || job.requesterId !== requester._id) {
      throw new Error("You can only request revisions for your own job.");
    }

    const now = Date.now();
    await ctx.db.patch("jobDeliverables", deliverable._id, { status: "revision_requested" });
    await ctx.db.patch("jobs", job._id, { status: "revision", updatedAt: now });
    await notify(ctx, {
      userId: job.studentId,
      type: "system",
      title: "Revision requested",
      message: args.message,
      relatedJobId: job._id,
      relatedJobRequestId: job.jobRequestId,
    });

    return null;
  },
});

export const markNotificationRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await currentUserOrThrow(ctx);
    const notification = await ctx.db.get(args.notificationId);
    if (notification === null || notification.userId !== user._id) {
      throw new Error("Notification not found.");
    }
    await ctx.db.patch(notification._id, { isRead: true });
    return null;
  },
});

export const createOpportunity = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    requiredSkillNames: v.array(v.string()),
    estimatedBudgetMin: v.optional(v.number()),
    estimatedBudgetMax: v.optional(v.number()),
    demandScore: v.number(),
    expiresAt: v.optional(v.number()),
  },
  returns: v.id("opportunities"),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const requiredSkills: Id<"skills">[] = [];
    for (const skillName of args.requiredSkillNames) {
      requiredSkills.push(await ensureSkill(ctx, skillName, args.category));
    }

    return await ctx.db.insert("opportunities", {
      title: args.title,
      description: args.description,
      category: args.category,
      requiredSkills,
      estimatedBudgetMin: args.estimatedBudgetMin,
      estimatedBudgetMax: args.estimatedBudgetMax,
      demandScore: args.demandScore,
      source: "admin",
      status: "active",
      createdAt: Date.now(),
      expiresAt: args.expiresAt,
    });
  },
});

export const recordDemandSignal = mutation({
  args: {
    category: v.string(),
    skillName: v.optional(v.string()),
    requestCount: v.number(),
    totalPotentialValue: v.number(),
    fulfilledCount: v.number(),
    unfulfilledCount: v.number(),
    demandLevel: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("very_high"),
    ),
    periodStart: v.number(),
    periodEnd: v.number(),
  },
  returns: v.id("demandSignals"),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const skillId =
      args.skillName === undefined
        ? undefined
        : await ensureSkill(ctx, args.skillName, args.category);

    const now = Date.now();
    return await ctx.db.insert("demandSignals", {
      category: args.category,
      skillId,
      requestCount: args.requestCount,
      totalPotentialValue: args.totalPotentialValue,
      fulfilledCount: args.fulfilledCount,
      unfulfilledCount: args.unfulfilledCount,
      demandLevel: args.demandLevel,
      periodStart: args.periodStart,
      periodEnd: args.periodEnd,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const recordImpactMetric = mutation({
  args: {
    date: v.number(),
    totalStudentsBenefited: v.number(),
    totalJobsCompleted: v.number(),
    totalIncomeGenerated: v.number(),
    totalRequesterSavings: v.number(),
    totalOpportunitiesCreated: v.number(),
    totalBusinessesServed: v.number(),
    totalRequests: v.number(),
    totalSuccessfulMatches: v.number(),
    averageStudentIncome: v.number(),
    averageJobValue: v.number(),
  },
  returns: v.id("impactMetrics"),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("impactMetrics", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const sendMessage = mutation({
  args: {
    receiverId: v.id("users"),
    jobId: v.optional(v.id("jobs")),
    text: v.string(),
  },
  returns: v.id("messages"),
  handler: async (ctx, args) => {
    const user = await currentUserOrThrow(ctx);
    return await ctx.db.insert("messages", {
      senderId: user._id,
      receiverId: args.receiverId,
      jobId: args.jobId,
      text: args.text,
      createdAt: Date.now(),
    });
  },
});

