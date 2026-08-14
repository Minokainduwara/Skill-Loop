/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as aiRequirements from "../aiRequirements.js";
import type * as applications from "../applications.js";
import type * as dashboard from "../dashboard.js";
import type * as demandSignals from "../demandSignals.js";
import type * as earnings from "../earnings.js";
import type * as frontend from "../frontend.js";
import type * as http from "../http.js";
import type * as impactMetrics from "../impactMetrics.js";
import type * as jobDeliverables from "../jobDeliverables.js";
import type * as jobRequests from "../jobRequests.js";
import type * as jobs from "../jobs.js";
import type * as lib_notify from "../lib/notify.js";
import type * as lib_payments from "../lib/payments.js";
import type * as lib_roles from "../lib/roles.js";
import type * as matches from "../matches.js";
import type * as messages from "../messages.js";
import type * as notifications from "../notifications.js";
import type * as opportunities from "../opportunities.js";
import type * as portfolios from "../portfolios.js";
import type * as reviews from "../reviews.js";
import type * as schemas_aiRequirements from "../schemas/aiRequirements.js";
import type * as schemas_applications from "../schemas/applications.js";
import type * as schemas_channels from "../schemas/channels.js";
import type * as schemas_demandSignals from "../schemas/demandSignals.js";
import type * as schemas_earnings from "../schemas/earnings.js";
import type * as schemas_impactMetrics from "../schemas/impactMetrics.js";
import type * as schemas_jobDeliverables from "../schemas/jobDeliverables.js";
import type * as schemas_jobRequests from "../schemas/jobRequests.js";
import type * as schemas_jobs from "../schemas/jobs.js";
import type * as schemas_matches from "../schemas/matches.js";
import type * as schemas_messages from "../schemas/messages.js";
import type * as schemas_notifications from "../schemas/notifications.js";
import type * as schemas_opportunities from "../schemas/opportunities.js";
import type * as schemas_portfolios from "../schemas/portfolios.js";
import type * as schemas_reviews from "../schemas/reviews.js";
import type * as schemas_skills from "../schemas/skills.js";
import type * as schemas_studentProfiles from "../schemas/studentProfiles.js";
import type * as schemas_studentSkills from "../schemas/studentSkills.js";
import type * as schemas_users from "../schemas/users.js";
import type * as skills from "../skills.js";
import type * as studentProfiles from "../studentProfiles.js";
import type * as studentSkills from "../studentSkills.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  aiRequirements: typeof aiRequirements;
  applications: typeof applications;
  dashboard: typeof dashboard;
  demandSignals: typeof demandSignals;
  earnings: typeof earnings;
  frontend: typeof frontend;
  http: typeof http;
  impactMetrics: typeof impactMetrics;
  jobDeliverables: typeof jobDeliverables;
  jobRequests: typeof jobRequests;
  jobs: typeof jobs;
  "lib/notify": typeof lib_notify;
  "lib/payments": typeof lib_payments;
  "lib/roles": typeof lib_roles;
  matches: typeof matches;
  messages: typeof messages;
  notifications: typeof notifications;
  opportunities: typeof opportunities;
  portfolios: typeof portfolios;
  reviews: typeof reviews;
  "schemas/aiRequirements": typeof schemas_aiRequirements;
  "schemas/applications": typeof schemas_applications;
  "schemas/channels": typeof schemas_channels;
  "schemas/demandSignals": typeof schemas_demandSignals;
  "schemas/earnings": typeof schemas_earnings;
  "schemas/impactMetrics": typeof schemas_impactMetrics;
  "schemas/jobDeliverables": typeof schemas_jobDeliverables;
  "schemas/jobRequests": typeof schemas_jobRequests;
  "schemas/jobs": typeof schemas_jobs;
  "schemas/matches": typeof schemas_matches;
  "schemas/messages": typeof schemas_messages;
  "schemas/notifications": typeof schemas_notifications;
  "schemas/opportunities": typeof schemas_opportunities;
  "schemas/portfolios": typeof schemas_portfolios;
  "schemas/reviews": typeof schemas_reviews;
  "schemas/skills": typeof schemas_skills;
  "schemas/studentProfiles": typeof schemas_studentProfiles;
  "schemas/studentSkills": typeof schemas_studentSkills;
  "schemas/users": typeof schemas_users;
  skills: typeof skills;
  studentProfiles: typeof studentProfiles;
  studentSkills: typeof studentSkills;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
