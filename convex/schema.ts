import { defineSchema } from "convex/server";
import { users } from "./schemas/users";
import { studentProfiles } from "./schemas/studentProfiles";
import { skills } from "./schemas/skills";
import { studentSkills } from "./schemas/studentSkills";
import { portfolios } from "./schemas/portfolios";
import { jobRequests } from "./schemas/jobRequests";
import { aiRequirements } from "./schemas/aiRequirements";
import { matches } from "./schemas/matches";
import { applications } from "./schemas/applications";
import { jobs } from "./schemas/jobs";
import { jobDeliverables } from "./schemas/jobDeliverables";
import { earnings } from "./schemas/earnings";
import { reviews } from "./schemas/reviews";
import { demandSignals } from "./schemas/demandSignals";
import { opportunities } from "./schemas/opportunities";
import { notifications } from "./schemas/notifications";
import { impactMetrics } from "./schemas/impactMetrics";
import { messages } from "./schemas/messages";

export default defineSchema({
  users,
  studentProfiles,
  skills,
  studentSkills,
  portfolios,
  jobRequests,
  aiRequirements,
  matches,
  applications,
  jobs,
  jobDeliverables,
  earnings,
  reviews,
  demandSignals,
  opportunities,
  notifications,
  impactMetrics,
  messages,
});