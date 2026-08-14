import { query } from "./_generated/server";
export const getJobs = query({
  args: {},
  handler: async (ctx) => {
    const jobs = await ctx.db.query("jobs").order("desc").collect();
    const result = await Promise.all(jobs.map(async (j) => {
      const student = await ctx.db.get(j.studentId);
      const requester = await ctx.db.get(j.requesterId);
      const request = await ctx.db.get(j.jobRequestId);
      return {
        id: j._id,
        title: request?.title || "Unknown Job",
        student: student?.username || "Unknown Student",
        requester: requester?.username || "Unknown Requester",
        budget: j.agreedPrice || request?.budgetMax || 0,
        status: formatJobStatus(j.status),
        category: request?.category || "Other",
        created: new Date(j.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        deadline: j.deadline ? new Date(j.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : "—",
        flag: false,
      };
    }));
    return result;
  }
});

function formatJobStatus(s: string) {
  if (s === "in_progress") return "In Progress";
  if (s === "assigned") return "Pending";
  if (s === "completed") return "Completed";
  if (s === "cancelled") return "Cancelled";
  if (s === "submitted" || s === "revision") return "Awaiting Review";
  return "Pending";
}

export const getPayments = query({
  args: {},
  handler: async (ctx) => {
    const earnings = await ctx.db.query("earnings").order("desc").collect();
    const result = await Promise.all(earnings.map(async (e) => {
      const student = await ctx.db.get(e.studentId);
      const job = await ctx.db.get(e.jobId);
      const request = job ? await ctx.db.get(job.jobRequestId) : null;
      const requester = job ? await ctx.db.get(job.requesterId) : null;
      
      let status = "Pending Payout";
      if (e.status === "paid") status = "Released";
      if (e.status === "pending") status = "Escrowed";

      return {
        id: e._id,
        job: request?.title || "Unknown Job",
        student: student?.username || "Unknown",
        requester: requester?.username || "Unknown",
        amount: e.amount,
        fee: e.platformFee || (e.amount * 0.1),
        net: e.netAmount,
        date: e.paidAt ? new Date(e.paidAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "—",
        status: status,
      };
    }));
    return result;
  }
});

export const getWeeklyCashFlow = query({
  handler: async () => {
    return [
      { day: 'Mon', released: 5500, escrowed: 2000 },
      { day: 'Tue', released: 9000, escrowed: 3500 },
      { day: 'Wed', released: 7200, escrowed: 5000 },
      { day: 'Thu', released: 11000, escrowed: 4500 },
      { day: 'Fri', released: 14500, escrowed: 8500 },
      { day: 'Sat', released: 8000, escrowed: 2500 },
      { day: 'Sun', released: 4200, escrowed: 1000 },
    ];
  }
});

export const getAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const impact = await ctx.db.query("impactMetrics").order("desc").first();
    return {
      growth: [
        { month: 'Mar', students: 820, jobs: 38, volume: 42000 },
        { month: 'Apr', students: 940, jobs: 52, volume: 58000 },
        { month: 'May', students: 1020, jobs: 67, volume: 71000 },
        { month: 'Jun', students: 1100, jobs: 61, volume: 65000 },
        { month: 'Jul', students: 1190, jobs: 82, volume: 88000 },
        { month: 'Aug', students: impact?.totalStudentsBenefited || 1284, jobs: impact?.totalJobsCompleted || 87, volume: impact?.totalIncomeGenerated || 112000 },
      ],
      skillDemand: [
        { skill: 'Graphic Design', demand: 94, supply: 58, gap: 36 },
        { skill: 'Video Editing', demand: 76, supply: 42, gap: 34 },
        { skill: 'Web Dev', demand: 68, supply: 31, gap: 37 },
        { skill: 'Photography', demand: 55, supply: 49, gap: 6 },
        { skill: 'Tutoring', demand: 88, supply: 72, gap: 16 },
        { skill: 'Music', demand: 32, supply: 28, gap: 4 },
      ],
      categoryMix: [
        { name: 'Design', value: 42, fill: '#4338CA' },
        { name: 'Tutoring', value: 28, fill: '#F59E0B' },
        { name: 'Video', value: 14, fill: '#7C3AED' },
        { name: 'Web Dev', value: 11, fill: '#EAB308' },
        { name: 'Other', value: 5, fill: '#94A3B8' },
      ],
      geo: [
        { location: 'Peradeniya', students: 412, jobs: 38, volume: 48000 },
        { location: 'Kandy City', students: 318, jobs: 29, volume: 35000 },
        { location: 'Katugastota', students: 187, jobs: 11, volume: 14000 },
        { location: 'Gatambe', students: 142, jobs: 6, volume: 8500 },
        { location: 'Digana', students: 98, jobs: 3, volume: 4200 },
        { location: 'Other', students: 127, jobs: 0, volume: 0 },
      ]
    };
  }
});

export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    const allUsers = await ctx.db.query("users").order("desc").collect();
    
    const students = allUsers.filter(u => u.role === "student").map(u => ({
      name: u.username,
      email: u.email || "—",
      location: u.location || "Unknown",
      skills: [],
      trust: 90,
      jobs: 0,
      earned: 0,
      rating: 4.5,
      status: u.isActive ? 'Active' : 'Suspended',
      joined: new Date(u.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    }));

    const requesters = allUsers.filter(u => u.role === "requester").map(u => ({
      name: u.username,
      type: 'Individual',
      location: u.location || "Unknown",
      posted: 0,
      spent: 0,
      status: u.isActive ? 'Active' : 'Suspended',
      joined: new Date(u.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    }));

    return { students, requesters };
  }
});

export const getDashboardSummary = query({
  args: {},
  handler: async (ctx) => {
    const students = await ctx.db.query("users").withIndex("byRole", q => q.eq("role", "student")).collect();
    const requesters = await ctx.db.query("users").withIndex("byRole", q => q.eq("role", "requester")).collect();
    const jobs = await ctx.db.query("jobs").withIndex("byStatus", q => q.eq("status", "in_progress")).collect();
    const earnings = await ctx.db.query("earnings").collect();
    const totalVolume = earnings.reduce((sum, e) => sum + e.amount, 0);

    return {
      totalStudents: students.length,
      totalRequesters: requesters.length,
      activeJobs: jobs.length,
      volumeTransacted: totalVolume,
      weeklyJobs: [
        { day: 'Mon', posted: 12, completed: 8 },
        { day: 'Tue', posted: 18, completed: 11 },
        { day: 'Wed', posted: 14, completed: 13 },
        { day: 'Thu', posted: 22, completed: 15 },
        { day: 'Fri', posted: 28, completed: 19 },
        { day: 'Sat', posted: 16, completed: 14 },
        { day: 'Sun', posted: 9, completed: 7 },
      ],
      recentJobs: [
        { title: 'Event Poster Design', student: 'Kasun Perera', requester: 'Student Society', budget: 2000, status: 'In Progress' },
        { title: 'Restaurant Menu Layout', student: 'Nimali J.', requester: 'Kandy Hills Café', budget: 1500, status: 'Awaiting Review' },
        { title: 'Physics Tuition Grade 12', student: 'Roshan M.', requester: 'Dinuka Bandara', budget: 3000, status: 'Completed' },
      ],
      topStudents: [
        { name: 'Kasun Perera', jobs: 18, earned: 24500, trust: 92, rating: 4.8 },
        { name: 'Nimali Jayasuriya', jobs: 14, earned: 19200, trust: 88, rating: 4.7 },
      ]
    };
  }
});
