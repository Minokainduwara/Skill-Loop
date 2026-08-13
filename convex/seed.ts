import { mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

export const defaultSeed = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // 1. Clear all existing records
    const tables = [
      "users",
      "studentProfiles",
      "skills",
      "studentSkills",
      "portfolios",
      "jobRequests",
      "aiRequirements",
      "matches",
      "applications",
      "jobs",
      "jobDeliverables",
      "earnings",
      "reviews",
      "demandSignals",
      "opportunities",
      "notifications",
      "impactMetrics",
      "messages",
    ] as const;

    for (const table of tables) {
      const records = await ctx.db.query(table).collect();
      for (const record of records) {
        await ctx.db.delete(record._id);
      }
    }

    const now = Date.now();

    // 2. Insert Skills
    const skillList = [
      { name: "Graphic Design", category: "Design" },
      { name: "Canva", category: "Design" },
      { name: "Poster Design", category: "Design" },
      { name: "Social Media", category: "Design" },
      { name: "Typography", category: "Design" },
      { name: "Illustrator", category: "Design" },
      { name: "Python", category: "Development" },
      { name: "React", category: "Development" },
      { name: "Web Development", category: "Development" },
      { name: "Data Structures", category: "Development" },
      { name: "Video Editing", category: "Video" },
      { name: "Premiere Pro", category: "Video" },
      { name: "Tutoring", category: "Tutoring" },
      { name: "IT Support", category: "IT Support" },
      { name: "Translation", category: "Writing" },
      { name: "Content Writing", category: "Writing" },
    ];

    const skillIds: Record<string, Id<"skills">> = {};
    for (const sk of skillList) {
      const id = await ctx.db.insert("skills", {
        name: sk.name,
        category: sk.category,
        isActive: true,
        createdAt: now,
      });
      skillIds[sk.name] = id;
    }

    // 3. Insert Users (Clerk Sync simulation & seed users)
    // Student User (Kasun Perera)
    const studentUser = await ctx.db.insert("users", {
      username: "Kasun Perera",
      externalId: "user_kasun",
      email: "kasun.perera@pdn.ac.lk",
      profileImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&h=120&q=80",
      phone: "+94771234567",
      location: "Peradeniya, Kandy",
      bio: "ICT Undergraduate at University of Peradeniya. Enthusiastic graphic designer and Python tutor.",
      role: "student",
      isVerified: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    // Requesters
    const requester1 = await ctx.db.insert("users", {
      username: "University Robotics Society",
      externalId: "user_robotics",
      email: "robotics@pdn.ac.lk",
      phone: "+94819998888",
      location: "Faculty of Engineering, Peradeniya",
      role: "requester",
      isVerified: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    const requester2 = await ctx.db.insert("users", {
      username: "Nimali Jayasuriya",
      externalId: "user_nimali",
      email: "nimali.j@gmail.com",
      role: "requester",
      isVerified: false,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("users", {
      username: "Kandy Spice Kitchen",
      externalId: "user_spices",
      email: "info@kandyspicekitchen.lk",
      role: "requester",
      isVerified: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    const requester4 = await ctx.db.insert("users", {
      username: "Dr. Anura Rajapaksa",
      externalId: "user_anura",
      email: "anura.r@pdn.ac.lk",
      role: "requester",
      isVerified: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    // Admin User
    await ctx.db.insert("users", {
      username: "System Admin",
      externalId: "user_admin",
      email: "admin@skillloop.lk",
      role: "admin",
      isVerified: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    // 4. Student Profiles
    await ctx.db.insert("studentProfiles", {
      userId: studentUser,
      university: "University of Peradeniya",
      faculty: "Faculty of Science",
      degree: "BSc in Information and Communication Technology",
      yearOfStudy: 2,
      experienceLevel: "intermediate",
      availability: "available",
      hourlyRate: 1000,
      totalEarnings: 24500,
      completedJobs: 18,
      averageRating: 4.8,
      totalReviews: 8,
      profileCompletion: 92,
      createdAt: now,
      updatedAt: now,
    });

    // 5. Student Skills
    const primarySkills = ["Graphic Design", "Canva", "Poster Design", "Social Media"];
    for (const name of primarySkills) {
      await ctx.db.insert("studentSkills", {
        studentId: studentUser,
        skillId: skillIds[name],
        proficiencyLevel: "expert",
        yearsOfExperience: 2,
        isPrimary: true,
        createdAt: now,
      });
    }

    const secondarySkills = ["Python", "Tutoring", "Web Development"];
    for (const name of secondarySkills) {
      await ctx.db.insert("studentSkills", {
        studentId: studentUser,
        skillId: skillIds[name],
        proficiencyLevel: "intermediate",
        yearsOfExperience: 1,
        isPrimary: false,
        createdAt: now,
      });
    }

    // 6. Portfolios
    await ctx.db.insert("portfolios", {
      studentId: studentUser,
      title: "Heritage Walk Map Illustration",
      description: "Custom illustrated tourism map of Kandy heritage spots.",
      category: "Design",
      skills: [skillIds["Graphic Design"], skillIds["Illustrator"]],
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("portfolios", {
      studentId: studentUser,
      title: "Robotics Society Logo Pack",
      description: "Complete branding guidelines and typography sheet.",
      category: "Design",
      skills: [skillIds["Graphic Design"], skillIds["Canva"]],
      createdAt: now,
      updatedAt: now,
    });

    // 7. Opportunities
    await ctx.db.insert("opportunities", {
      title: "Event Poster Design",
      description: "Modern promotional poster for the annual Robotics Exhibition — print plus social.",
      category: "Design",
      requiredSkills: [skillIds["Graphic Design"], skillIds["Canva"], skillIds["Poster Design"]],
      estimatedBudgetMin: 1500,
      estimatedBudgetMax: 2500,
      demandScore: 96,
      source: "job_requests",
      status: "active",
      createdAt: now - 120000,
    });

    await ctx.db.insert("opportunities", {
      title: "Python Tutoring (A/L Revision)",
      description: "Six one-hour sessions covering loops, functions and basic OOP for a Grade 13 student.",
      category: "Tutoring",
      requiredSkills: [skillIds["Python"], skillIds["Tutoring"], skillIds["Data Structures"]],
      estimatedBudgetMin: 3500,
      estimatedBudgetMax: 5000,
      demandScore: 91,
      source: "job_requests",
      status: "active",
      createdAt: now - 2100000,
    });

    await ctx.db.insert("opportunities", {
      title: "Video Editing for Cafe Promo",
      description: "Cut a 45-second reel from 20 minutes of phone footage. Music and subtitles included.",
      category: "Video",
      requiredSkills: [skillIds["Video Editing"], skillIds["Premiere Pro"]],
      estimatedBudgetMin: 5000,
      estimatedBudgetMax: 8000,
      demandScore: 87,
      source: "community_demand",
      status: "active",
      createdAt: now - 7200000,
    });

    // 8. Job Requests
    const jobReq1 = await ctx.db.insert("jobRequests", {
      requesterId: requester1,
      title: "Event Poster Design",
      description: "Modern promotional poster for the annual Robotics Exhibition — print plus social.",
      category: "Design",
      budgetMin: 2000,
      budgetMax: 2000,
      deadline: now + 3 * 24 * 60 * 60 * 1000,
      location: "Peradeniya, Kandy",
      isRemote: false,
      status: "assigned",
      createdAt: now - 3600 * 1000 * 24 * 3,
      updatedAt: now,
    });

    await ctx.db.insert("jobRequests", {
      requesterId: requester2,
      title: "Instagram Reel Edit",
      description: "Cut an engaging 45-second food tour video for cafe branding.",
      category: "Video",
      budgetMin: 2500,
      budgetMax: 2500,
      deadline: now + 5 * 24 * 60 * 60 * 1000,
      isRemote: true,
      status: "open",
      createdAt: now - 3600 * 1000 * 4,
      updatedAt: now,
    });

    // 9. Matches
    const match1 = await ctx.db.insert("matches", {
      jobRequestId: jobReq1,
      studentId: studentUser,
      skillScore: 100,
      availabilityScore: 95,
      experienceScore: 90,
      ratingScore: 96,
      locationScore: 98,
      totalScore: 96,
      matchReason: "Perfect skill matches and high ratings.",
      status: "accepted",
      createdAt: now - 3600 * 1000 * 24 * 2,
    });

    // 10. Applications
    const app1 = await ctx.db.insert("applications", {
      jobRequestId: jobReq1,
      studentId: studentUser,
      matchId: match1,
      proposal: "I have extensive experience designing event posters for university clubs.",
      proposedPrice: 2000,
      estimatedDeliveryDays: 2,
      status: "accepted",
      createdAt: now - 3600 * 1000 * 24 * 2,
      updatedAt: now,
    });

    // 11. Jobs
    const job1 = await ctx.db.insert("jobs", {
      jobRequestId: jobReq1,
      requesterId: requester1,
      studentId: studentUser,
      applicationId: app1,
      agreedPrice: 2000,
      deadline: now + 3 * 24 * 60 * 60 * 1000,
      status: "in_progress",
      startedAt: now - 3600 * 1000 * 24 * 2,
      createdAt: now - 3600 * 1000 * 24 * 2,
      updatedAt: now,
    });

    // 12. Job Deliverables
    await ctx.db.insert("jobDeliverables", {
      jobId: job1,
      description: "First draft of the exhibition poster.",
      fileUrl: "https://example.com/draft-v1.png",
      status: "submitted",
      submittedAt: now - 3600 * 1000 * 12,
      createdAt: now - 3600 * 1000 * 12,
    });

    // 13. Completed Jobs Seeding (simulate Dr. Anura job)
    const oldJobReq = await ctx.db.insert("jobRequests", {
      requesterId: requester4,
      title: "Chemistry Tutorial Slide Deck",
      description: "Modern slide template for Semester 2 lessons.",
      category: "Presentation Design",
      budgetMin: 2200,
      budgetMax: 2200,
      isRemote: true,
      status: "completed",
      createdAt: now - 30 * 24 * 3600 * 1000,
      updatedAt: now - 28 * 24 * 3600 * 1000,
    });

    const oldApp = await ctx.db.insert("applications", {
      jobRequestId: oldJobReq,
      studentId: studentUser,
      proposedPrice: 2200,
      status: "accepted",
      createdAt: now - 30 * 24 * 3600 * 1000,
      updatedAt: now - 30 * 24 * 3600 * 1000,
    });

    const oldJob = await ctx.db.insert("jobs", {
      jobRequestId: oldJobReq,
      requesterId: requester4,
      studentId: studentUser,
      applicationId: oldApp,
      agreedPrice: 2200,
      status: "completed",
      completedAt: now - 28 * 24 * 3600 * 1000,
      createdAt: now - 30 * 24 * 3600 * 1000,
      updatedAt: now - 28 * 24 * 3600 * 1000,
    });

    // 14. Earnings
    await ctx.db.insert("earnings", {
      studentId: studentUser,
      jobId: oldJob,
      amount: 2200,
      platformFee: 200,
      netAmount: 2000,
      currency: "LKR",
      status: "available",
      createdAt: now - 28 * 24 * 3600 * 1000,
    });

    // 15. Reviews
    await ctx.db.insert("reviews", {
      jobId: oldJob,
      reviewerId: requester4,
      revieweeId: studentUser,
      rating: 5,
      comment: "Excellent slide designs, delivered early.",
      createdAt: now - 28 * 24 * 3600 * 1000,
    });

    // 16. Messages
    await ctx.db.insert("messages", {
      senderId: requester1,
      receiverId: studentUser,
      jobId: job1,
      text: "Hi Kasun! Thanks for accepting the poster job. Deadline is the 14th.",
      createdAt: now - 3600 * 1000 * 24 * 2,
    });

    await ctx.db.insert("messages", {
      senderId: studentUser,
      receiverId: requester1,
      jobId: job1,
      text: "Noted. I will share a first direction on Wednesday.",
      createdAt: now - 3600 * 1000 * 24 * 2 + 10 * 60 * 1000,
    });

    // 17. Notifications
    await ctx.db.insert("notifications", {
      userId: studentUser,
      type: "new_match",
      title: "New 96% match opportunity",
      message: "Robotics Exhibition Poster · Rs. 2,000",
      relatedJobRequestId: jobReq1,
      isRead: false,
      createdAt: now - 120000,
    });

    await ctx.db.insert("notifications", {
      userId: studentUser,
      type: "payment",
      title: "Rs. 2,000 payment confirmed",
      message: "Released by University Robotics Society",
      relatedJobId: oldJob,
      isRead: false,
      createdAt: now - 3600 * 1000,
    });

    await ctx.db.insert("notifications", {
      userId: studentUser,
      type: "review",
      title: "You received a 5-star review",
      message: '"Excellent work and delivered early."',
      relatedJobId: oldJob,
      isRead: false,
      createdAt: now - 3 * 3600 * 1000,
    });

    // 18. Demand Signals
    await ctx.db.insert("demandSignals", {
      category: "Design",
      skillId: skillIds["Graphic Design"],
      requestCount: 12,
      totalPotentialValue: 18500,
      fulfilledCount: 10,
      unfulfilledCount: 2,
      demandLevel: "high",
      periodStart: now - 7 * 24 * 3600 * 1000,
      periodEnd: now,
      createdAt: now,
      updatedAt: now,
    });

    // 19. Impact Metrics
    await ctx.db.insert("impactMetrics", {
      date: now,
      totalStudentsBenefited: 47,
      totalJobsCompleted: 84,
      totalIncomeGenerated: 156500,
      totalRequesterSavings: 72000,
      totalOpportunitiesCreated: 110,
      totalBusinessesServed: 24,
      totalRequests: 95,
      totalSuccessfulMatches: 84,
      averageStudentIncome: 3300,
      averageJobValue: 1800,
      createdAt: now,
    });

    console.log("Database seeded successfully!");
    return null;
  },
});
