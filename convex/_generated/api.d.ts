/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as http from "../http.js";
import type * as schemas_aiRequirements from "../schemas/aiRequirements.js";
import type * as schemas_applications from "../schemas/applications.js";
import type * as schemas_demandSignals from "../schemas/demandSignals.js";
import type * as schemas_earnings from "../schemas/earnings.js";
import type * as schemas_impactMetrics from "../schemas/impactMetrics.js";
import type * as schemas_jobDeliverables from "../schemas/jobDeliverables.js";
import type * as schemas_jobRequests from "../schemas/jobRequests.js";
import type * as schemas_jobs from "../schemas/jobs.js";
import type * as schemas_matches from "../schemas/matches.js";
import type * as schemas_notifications from "../schemas/notifications.js";
import type * as schemas_opportunities from "../schemas/opportunities.js";
import type * as schemas_portfolios from "../schemas/portfolios.js";
import type * as schemas_reviews from "../schemas/reviews.js";
import type * as schemas_skills from "../schemas/skills.js";
import type * as schemas_studentProfiles from "../schemas/studentProfiles.js";
import type * as schemas_studentSkills from "../schemas/studentSkills.js";
import type * as schemas_users from "../schemas/users.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  http: typeof http;
  "schemas/aiRequirements": typeof schemas_aiRequirements;
  "schemas/applications": typeof schemas_applications;
  "schemas/demandSignals": typeof schemas_demandSignals;
  "schemas/earnings": typeof schemas_earnings;
  "schemas/impactMetrics": typeof schemas_impactMetrics;
  "schemas/jobDeliverables": typeof schemas_jobDeliverables;
  "schemas/jobRequests": typeof schemas_jobRequests;
  "schemas/jobs": typeof schemas_jobs;
  "schemas/matches": typeof schemas_matches;
  "schemas/notifications": typeof schemas_notifications;
  "schemas/opportunities": typeof schemas_opportunities;
  "schemas/portfolios": typeof schemas_portfolios;
  "schemas/reviews": typeof schemas_reviews;
  "schemas/skills": typeof schemas_skills;
  "schemas/studentProfiles": typeof schemas_studentProfiles;
  "schemas/studentSkills": typeof schemas_studentSkills;
  "schemas/users": typeof schemas_users;
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
