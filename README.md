# Gathered

A responsive event discovery, registration and organizer dashboard concept built with React, TypeScript, Vite, React Three Fiber, Drei, GSAP ScrollTrigger and Lenis.

## Start the app

```bash
npm install
npm run dev
```

Open the local address Vite prints. Build a production bundle with `npm run build`.

## What’s included

- Public home with about, event types, services, nearby events, venues, searchable event list and organizer introduction.
- Category themes, event previews, neighbourhood search and a user-initiated browser location request.
- Sign in / sign up demo that retains the selected event, service, venue, registration or organizer action.
- Event detail and attendee registration flow.
- Simulated Standard / VIP ticket booking with capacity checks and a printable e-ticket confirmation. No payment is taken; demo entry codes are not scannable.
- Organizer dashboard with event create/edit, participant search/status filters and CSV export.
- Past-event attendance, check-in, rating, repeat-guest and feedback snapshots for organizers (illustrative sample data).
- Local, rule-based Gathered Copilot for event and planning help. It asks before using the current page context, keeps that permission scoped to the current page, and requires a user click before opening event details. It makes no external AI/API calls.
- A scroll-responsive, direction-sensitive 3D planning case built from lightweight procedural Three.js geometry.
- Responsive styles, semantic forms, visible keyboard focus and reduced-motion handling.
- Figma token reference and page/component handoff in `design/`.

Without Supabase settings, demo profiles, events and registrations are saved in this browser with local storage. Ticket booking is simulated and does not process payments. Copilot answers are rule-based and run locally. Organizer stats are calculated from that organizer’s past events and their check-in/rating records; the app does not invent sample reviews. Starter event data is illustrative because the referenced project table was not present in the folder.

## Cloud database and deployment

The app can use Supabase Auth and Postgres for real accounts, event records, registrations, check-ins and guest ratings. Without environment variables, it keeps the local demo behavior.

1. Create a Supabase project.
2. In PowerShell opened at this project folder, run `npx --yes supabase@latest login` and follow the sign-in instructions. Then run `npx --yes supabase@latest link --project-ref YOUR_PROJECT_REF` (replace with the part before `.supabase.co` in your project URL; the command prompts for the database password).
3. Run `npx --yes supabase@latest db push`. This applies the versioned migration in `supabase/migrations/` to the linked database. Confirm the project reference is the one you intended before proceeding. The same SQL is also available at [`supabase/schema.sql`](supabase/schema.sql) if you prefer the SQL Editor.
4. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from the Supabase project API settings. A publishable key is intended for browser use; row-level security limits guests to their registrations and organizers to records for events they own.
5. Restart `npm run dev`, create an account through the app, then create an event. New events and registrations will be stored in Supabase. If Supabase email confirmation is enabled, confirm the signup email before logging in.
6. To deploy the frontend, import this GitHub repository into Vercel, set the same two variables for the Production (and Preview, if desired) environment, then deploy. Vite’s `build` command and `dist` output are already configured by the project defaults.

The client stores the Supabase access token in browser local storage for this prototype. For a production ticketing system, add server-side booking validation and payment processing, use short-lived secure session handling, and move capacity checks into a database transaction to prevent overbooking. Historical check-ins and ratings are entered by the organizer in the participant list; no sample reviews are presented as real results.

## Structure

- `src/App.tsx` — pages and user journeys.
- `src/PlanningCase.tsx` — independent 3D scene.
- `src/data.ts` — event, category, service, venue and registration models with starter data.
- `src/styles.css` — responsive UI and shared theme tokens.
- `design/figma-variables.json` — design tokens and event theme modes.
- `design/figma-handoff.md` — Figma pages, Auto Layout/component patterns and interaction notes.
