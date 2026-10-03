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
- Organizer dashboard with event create/edit, participant search/status filters and CSV export.
- A scroll-responsive, direction-sensitive 3D planning case built from lightweight procedural Three.js geometry.
- Responsive styles, semantic forms, visible keyboard focus and reduced-motion handling.
- Figma token reference and page/component handoff in `design/`.

Demo profiles, events and registrations are saved in this browser with local storage. Authentication is a front-end demo and does not validate an account on a server. Starter data is illustrative because the referenced project table was not present in the folder.

## Structure

- `src/App.tsx` — pages and user journeys.
- `src/PlanningCase.tsx` — independent 3D scene.
- `src/data.ts` — event, category, service, venue and registration models with starter data.
- `src/styles.css` — responsive UI and shared theme tokens.
- `design/figma-variables.json` — design tokens and event theme modes.
- `design/figma-handoff.md` — Figma pages, Auto Layout/component patterns and interaction notes.
