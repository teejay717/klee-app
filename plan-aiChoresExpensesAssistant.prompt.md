## Plan: AI Chores + Expenses Assistant

Build one shared summary pipeline over the existing chores and expenses data, then expose it through two outputs: an in-app chat assistant for immediate questions and an email notification path for digests/alerts. The key constraint is to keep the database as the source of truth and reuse the current Drizzle queries and server actions rather than inventing a parallel data model.

**Steps**

1. Define the first MVP scope and event triggers. Start with one assistant that can summarize apartment activity and answer simple questions about chores and expenses. Trigger it from the existing mutation points in [server/actions.ts](c:/Users/Admin/Documents/GitHub/klee-app/server/actions.ts) after successful writes, especially `createChore`, `createExpense`, `setChoreCompleted`, and `toggleExpensePaid`.
2. Create a shared data-summary layer, depends on step 1. Extract the dashboard-style data gathering logic from [app/dashboard/page.tsx](c:/Users/Admin/Documents/GitHub/klee-app/app/dashboard/page.tsx) into a server-only helper that returns structured apartment stats: recent chores, unpaid expenses, recent payments, member names, totals, and the event that triggered the summary.
3. Add the in-app chat surface, depends on step 2. Add a chat entry point in the shell UI, likely from [components/AppSidebar.tsx](c:/Users/Admin/Documents/GitHub/klee-app/components/AppSidebar.tsx), [components/HeaderComponent.tsx](c:/Users/Admin/Documents/GitHub/klee-app/components/HeaderComponent.tsx), or [app/layout.tsx](c:/Users/Admin/Documents/GitHub/klee-app/app/layout.tsx), and display responses in a sheet or dialog using [components/ui/sheet.tsx](c:/Users/Admin/Documents/GitHub/klee-app/components/ui/sheet.tsx) and [components/ui/dialog.tsx](c:/Users/Admin/Documents/GitHub/klee-app/components/ui/dialog.tsx).
4. Add persistence for assistant conversations, depends on step 3. If you want the chat history to survive refreshes, introduce Drizzle tables for conversations and messages in [db/schema.ts](c:/Users/Admin/Documents/GitHub/klee-app/db/schema.ts), then read/write them from server actions or route handlers.
5. Add email delivery, depends on step 2. Introduce an email provider dependency and a server-side sender helper. Use the same shared summary output to compose an email digest and send it to apartment members fetched from Clerk server APIs in [server/actions.ts](c:/Users/Admin/Documents/GitHub/klee-app/server/actions.ts).
6. Decide whether email runs inline or through a queue, depends on step 5. For a beginner-friendly first version, send immediately after the mutation completes. For a more reliable version, enqueue the work in [lib/redis.ts](c:/Users/Admin/Documents/GitHub/klee-app/lib/redis.ts) and process it with a scheduled job or worker later.
7. Refactor and harden, depends on steps 2 to 6. Remove duplicated summary logic from page files, add validation around the shared summary payload, and test the summary helper against realistic apartment data.

**Relevant files**

- [server/actions.ts](c:/Users/Admin/Documents/GitHub/klee-app/server/actions.ts) — main mutation hooks and the best place to emit assistant events after writes succeed.
- [app/dashboard/page.tsx](c:/Users/Admin/Documents/GitHub/klee-app/app/dashboard/page.tsx) — existing apartment aggregation logic to extract into a reusable summary helper.
- [app/layout.tsx](c:/Users/Admin/Documents/GitHub/klee-app/app/layout.tsx) — global place to mount chat entry UI or notification indicators.
- [components/AppSidebar.tsx](c:/Users/Admin/Documents/GitHub/klee-app/components/AppSidebar.tsx) — likely navigation entry point for the assistant.
- [components/HeaderComponent.tsx](c:/Users/Admin/Documents/GitHub/klee-app/components/HeaderComponent.tsx) — alternate entry point if you want assistant access in the top bar.
- [components/ui/sheet.tsx](c:/Users/Admin/Documents/GitHub/klee-app/components/ui/sheet.tsx) and [components/ui/dialog.tsx](c:/Users/Admin/Documents/GitHub/klee-app/components/ui/dialog.tsx) — existing UI patterns for the assistant panel.
- [db/schema.ts](c:/Users/Admin/Documents/GitHub/klee-app/db/schema.ts) — add assistant message tables only if you want chat history persistence.
- [lib/redis.ts](c:/Users/Admin/Documents/GitHub/klee-app/lib/redis.ts) — optional queue or dedupe storage for future notification delivery.
- [package.json](c:/Users/Admin/Documents/GitHub/klee-app/package.json) — add an email provider SDK when implementing email notifications.

**Verification**

1. Confirm the shared summary helper returns the same counts and recent items as the dashboard currently shows.
2. Trigger each mutation path once and confirm it produces a summary event without breaking the existing `revalidatePath` behavior.
3. Test the chat UI manually with one sample apartment and one sample summary response.
4. Send one real email to a test address and confirm the recipient list and content are correct.
5. Run `npm run lint` and `npm run typecheck` after implementation.

**Decisions**

- Use one shared summary service for both chat and email instead of building two separate pipelines.
- Start with immediate send and in-app display before introducing background jobs.
- Keep the current chore and expense schema as the source of truth; do not move the business data into the AI layer.

**Further Considerations**

1. If you want the smallest possible first release, skip persistence for chat history until the summary and email flow are working.
2. If you want notifications to feel more app-like, add an in-app notification inbox later and reuse the same email digest records.
3. If you want the AI to answer open-ended questions, you will eventually need a prompt/response endpoint separate from the one-time digest generator.
