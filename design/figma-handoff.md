# Gathered · Figma handoff

This app is organized around a token system and reusable patterns. The local Figma connector was not available in this session, so this handoff gives a designer a concrete page plan and a token reference to reproduce in a Figma file.

## Suggested Figma pages

1. **01 Foundations** — color, type, spacing, radii, responsive breakpoints, elevation, and event-theme modes.
2. **02 Components** — navigation, button variants, event card, venue card, service tile, section heading, form field, status, tabs, organizer table, and mobile menu.
3. **03 Desktop** — home hero, about, event types, services, nearby events, venues, event list, event detail, auth, registration, dashboard, create/edit, and participant list.
4. **04 Mobile** — the same essential journeys at 390 px width, including the stacked hero notes and compact cards.
5. **05 Prototype flows** — browse → event details → sign up → event details → registration; organizer intent → sign up → create event → dashboard → guest list.

Use the Auto Layout properties below as the starting point. Keep component names and layer names aligned to these tokens and the React components.

## Variable collections

Import or recreate the variables in [`figma-variables.json`](./figma-variables.json):

- `Color / Core` — shared platform palette.
- `Color / Event theme` — switchable modes for birthday, wedding, naming ceremony, get-together, and workshop.
- `Space / Radius / Type` — spacing scale, radii, typeface names and key sizes.

For the event themes, use the mode variable on event category cards and on hero accents. Keep the ink, paper, and component geometry shared across all modes.

## Components and Auto Layout

| Component | Suggested structure | Key behavior |
| --- | --- | --- |
| `Navigation / Desktop` | Horizontal Auto Layout, 32 gap, 76 height | Sticky; current page and organizer action remain distinct |
| `Navigation / Mobile` | Vertical Auto Layout, 12 gap | Menu button exposes all top-level links |
| `Button / Primary` | Horizontal Auto Layout, 13 gap, 48 height | Hover, focus, pressed; clear verb-first label |
| `Card / Event` | Vertical Auto Layout; image aspect ~1.65; 16 inset | Category, date, title, venue, status, price; image is an action |
| `Card / Venue` | Image plus vertical content | Rating, venue type, location and capacity |
| `Card / Service` | Vertical Auto Layout; 22 inset | Number, icon, name, short accessible summary |
| `Form / Field` | Vertical Auto Layout; 7 gap | Label above input; helper/error is a separate text layer |
| `Header / Section` | Vertical title group plus optional action | Eyebrow, display title, short supporting copy |
| `Table / Organizer event` | 5-column row pattern | Edit and guest list actions stay in the row |

## Responsive and interaction notes

- Desktop hero: case centered, four explanatory blocks in separate corners, heading above. Keep the case canvas inside its own frame.
- Mobile hero: case first, four descriptions in a two-column sequence below, then both primary actions. Never overlay text on the case.
- Event type cards use their own softly blended photo (about 22% opacity) over the theme color. Category selection applies the selected event-theme mode and filters the public event list.
- The public home and preview cards do not require an account. Opening an event/service/venue, registering, and organizer tools preserve the requested destination through the auth screen.
- Use visible keyboard focus, real text labels and semantic buttons. Reduced motion turns off the smooth-scroll and scroll-reveal treatment.
- The case is an accessible-hidden decorative canvas; all product information is normal page text.

## Layer naming

Use names such as `Home / Hero / Case canvas`, `Home / Hero / Benefit 01`, `Event card / Status`, `Auth / Organizer intent`, `Registration / Event summary`, and `Dashboard / Event row / Actions`. Name component variants with properties, for example `Button / Primary / Dark`, `Button / Primary / Light`, `Event card / Compact / Nearby`.
