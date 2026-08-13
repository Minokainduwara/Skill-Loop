# Task Updates

- Modified `types.ts` to allow `Navigate` to take an optional `data` parameter and added `data` to `PageProps`.
- Updated `App.tsx` state to include `pageData` and passed it down via `navigate` and to the `requester-dashboard` and `requester-applications` pages.
- Modified `Nav.tsx` to redirect users with the `requester` role to `requester-dashboard` instead of `dashboard`.
- Implemented `RequesterDashboard.tsx` to display job requests using `api.jobRequests.listByRequester`. Clicking on a job request navigates to the applications view.
- Implemented `RequesterApplications.tsx` to view applications for a specific `jobRequestId` using `api.applications.listByJob`. Added functionality to accept or reject applications using the respective mutations.
