import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

type Level = 'HIGH' | 'MEDIUM' | 'LOW';

export const getClusters = query({
  args: {},
  handler: async () => {
    return [
      { key: 'design', name: 'Graphic Design', emoji: '🎨', requests: 12, value: 18500, students: 8, level: 'HIGH' as Level, x: 36, y: 32, area: 'Peradeniya campus' },
      { key: 'video', name: 'Video Editing', emoji: '🎬', requests: 8, value: 11200, students: 6, level: 'MEDIUM' as Level, x: 63, y: 26, area: 'Kandy town' },
      { key: 'web', name: 'Web Development', emoji: '💻', requests: 6, value: 14800, students: 5, level: 'MEDIUM' as Level, x: 71, y: 60, area: 'Colombo Road' },
      { key: 'tutor', name: 'Tutoring', emoji: '📚', requests: 5, value: 9000, students: 11, level: 'LOW' as Level, x: 46, y: 70, area: 'Gatambe' },
      { key: 'photo', name: 'Photography', emoji: '📷', requests: 4, value: 7600, students: 4, level: 'LOW' as Level, x: 24, y: 58, area: 'Kandy Lake' },
      { key: 'social', name: 'Social Media', emoji: '📱', requests: 3, value: 5400, students: 7, level: 'LOW' as Level, x: 55, y: 46, area: 'Peradeniya' },
    ];
  },
});

export const getRequests = query({
  args: {},
  handler: async () => {
    return [
      { text: 'I need someone to design an event flyer for our robotics exhibition.', time: '12 min ago', area: 'Peradeniya', hint: 'Rs. 2,000' },
      { text: 'Looking for an affordable social media poster set for my small bakery.', time: '48 min ago', area: 'Kandy', hint: 'Rs. 1,200' },
      { text: 'Need a birthday invitation designed by this weekend, something playful.', time: '2 hours ago', area: 'Gatambe', hint: 'Rs. 800' },
      { text: 'Can anyone redesign our restaurant menu? Print ready please.', time: '5 hours ago', area: 'Kandy town', hint: 'Rs. 1,500' },
      { text: 'Want a clean CV design for a job application next week.', time: 'Yesterday', area: 'Peradeniya', hint: 'Rs. 1,000' },
      { text: 'Our club needs t-shirt artwork for 60 members before the trip.', time: 'Yesterday', area: 'Campus', hint: 'Rs. 2,500' },
    ];
  },
});

export const getClusterDetails = query({
  args: { clusterId: v.optional(v.string()) },
  handler: async () => {
    return {
      requests: [
        { title: 'Robotics exhibition flyer', budget: 2000, requester: 'Eng Faculty', distance: '1.2 km', deadline: '2 days' },
        { title: 'Startup logo & branding', budget: 5000, requester: 'Local Cafe', distance: '3 km', deadline: '1 week' },
        { title: 'Social media poster set', budget: 3500, requester: 'Tech Club', distance: 'Campus', deadline: '3 days' },
        { title: 'T-shirt vector artwork', budget: 1500, requester: 'Batch 21', distance: 'Hostel', deadline: 'Tomorrow' },
        { title: 'Restaurant menu layout', budget: 4000, requester: 'Food Truck', distance: '5 km', deadline: '4 days' },
        { title: 'Clean CV design', budget: 1000, requester: 'Student', distance: 'Campus', deadline: 'Next week' },
        { title: 'Birthday invitation', budget: 1500, requester: 'Anon', distance: '2.5 km', deadline: 'Weekend' },
      ],
      skills: ['Graphic Design', 'Canva', 'Illustrator', 'Branding', 'Layout'],
    };
  }
});

export const getInterestState = query({
  args: { clusterId: v.optional(v.string()) },
  handler: async () => {
    return false;
  }
});

export const expressInterest = mutation({
  args: { clusterId: v.optional(v.string()) },
  handler: async () => {
    return true;
  }
});

export const getSkillDemand = query({
  args: {},
  handler: async () => {
    return {
      rows: [
        { skill: 'React / Next.js', requests: 42, growth: 12, avgBudget: 'Rs. 12k', students: 8, level: 'High', spark: [1, 2, 4, 3, 5, 8, 12, 10, 15] },
        { skill: 'Video Editing', requests: 38, growth: 8, avgBudget: 'Rs. 8k', students: 12, level: 'High', spark: [2, 3, 3, 5, 4, 7, 6, 8, 8] },
        { skill: 'UI/UX Design', requests: 25, growth: -2, avgBudget: 'Rs. 15k', students: 14, level: 'Medium', spark: [5, 4, 6, 5, 4, 3, 4, 3, 2] },
        { skill: 'Copywriting', requests: 18, growth: 24, avgBudget: 'Rs. 5k', students: 3, level: 'Medium', spark: [1, 1, 2, 1, 3, 4, 5, 7, 9] },
        { skill: '3D Modeling', requests: 6, growth: 5, avgBudget: 'Rs. 25k', students: 2, level: 'Low', spark: [0, 0, 1, 0, 1, 2, 1, 1, 2] },
      ],
      gap: [
        { skill: 'React', needed: 45, you: true },
        { skill: 'TypeScript', needed: 38, you: false },
        { skill: 'Node.js', needed: 22, you: true },
        { skill: 'Tailwind CSS', needed: 18, you: true },
        { skill: 'Framer Motion', needed: 12, you: false },
      ],
      categories: ['All', 'Design', 'Development', 'Content', 'Video']
    };
  }
});

export const getBestCandidates = query({
  args: { jobId: v.optional(v.string()) },
  handler: async () => {
    return [
      {
        id: '1',
        name: 'Sanduni K.',
        program: 'BSc Design',
        rank: 1,
        match: 96,
        skills: ['Graphic Design', 'Canva', 'Illustrator'],
        rating: 4.9,
        earned: 42500,
        jobs: 14,
        note: "Perfect match. Has completed 5 similar design tasks this month with glowing reviews. Uses required tools."
      },
      {
        id: '2',
        name: 'Kavindu M.',
        program: 'BSc Computer Science',
        rank: 2,
        match: 88,
        skills: ['Canva', 'Photoshop', 'Web Design'],
        rating: 4.7,
        earned: 18000,
        jobs: 6,
        note: "Strong alternative. Missing Illustrator, but high rating in overall design tasks."
      },
      {
        id: '3',
        name: 'Devni R.',
        program: 'BA Arts',
        rank: 3,
        match: 74,
        skills: ['Illustration', 'Sketching'],
        rating: 4.5,
        earned: 5000,
        jobs: 2,
        note: "Creative potential, but lacks specific software skills listed in requirements."
      }
    ];
  }
});

export const getJobRequirements = query({
  args: { jobId: v.optional(v.string()) },
  handler: async () => {
    return ['Graphic Design', 'Canva', 'Social Media', 'Poster Design'];
  }
});
