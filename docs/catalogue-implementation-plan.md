# 3D catalogue implementation plan

> Archived on 28 October 2026: the redesign was reverted at the user's request. The original stacked-card entrance and floating 3D gallery are active again. This document records the superseded design.

## Objective

Make `/catalogue` feel like a compact architectural exhibition, with four distinct projects, visible spatial depth, readable information, and reliable navigation. Retain the site's navy and ice-blue palette and the existing CSS 3D / Framer Motion stack.

Implementation completed on 27 October 2026. See `catalogue-verification.md` for checks and remaining environment limitations.

## Findings from the current implementation

- The gallery renders floating screenshots and background gradients, but no floor, walls, or ceiling geometry. The declared hallway depth is not used to build a room.
- Four projects are duplicated into eight entries. Category, year, description, and technology data exist but are not presented alongside the exhibits.
- The corridor uses a minimum half-width of 900px. A selected view moves to just 27 world-space pixels from its artwork plane; this is not derived from the available screen space or CSS perspective.
- Artwork sizing has a 540px minimum width, and the intro stack starts at 380px wide. Both can exceed phone viewports.
- The start button handles both pointer-down and click. Intro timers can change the phase after entry has started, and several timers have no cleanup.
- Navigation unlocks after 900ms while the camera transition lasts 1.05 seconds. Quick input can interrupt movement inconsistently.
- Global keyboard shortcuts do not distinguish the gallery from focused links, buttons, or the open navbar. The fixed scene also sits above a normally scrollable page and footer.

## Design decisions

### Desktop: a compact gallery with a guided camera

Use two exhibits on each side of a shorter corridor. Add matte navy wall planes, a slightly lighter floor, a visible end wall, subtle baseboard lines, and restrained ceiling light strips. Give each exhibit a soft static light pool and a small physical-looking frame shadow.

Use `#091522` for deep recesses, `#0b1c2e` and `#132f4c` for surfaces, `#a4cff0` for soft light, `#38bdf8` for the active accent, and `#e2edf8` for text. Screenshots retain their original brightness.

The entrance view must show a recognisable room and at least two exhibits. In a selected view, the artwork should occupy roughly 60–70% of the usable desktop width, with enough surrounding wall or floor to retain a sense of place. Treat this as a visual target, not a fixed pixel size.

Project details belong in an untransformed overlay panel: project number, title, category/year, short description, a few technology labels, and a clear “View project” link. Keep only a small number/name plaque in the 3D scene. This avoids perspective-distorted body text and tiny wall-mounted controls.

### Mobile: a shallow gallery stage

Below 768px, use one front-facing exhibit at a time with a restrained depth backdrop. Swipe horizontally or use previous/next buttons; transition with a short slide and fade rather than a 90-degree camera turn.

Place details beneath the image in a scrollable panel. Use a compact `01 / 04` indicator and an optional project picker instead of a permanently visible thumbnail strip. Fit to the actual viewport, including landscape orientation and safe-area insets. Keep touch targets at least 44px.

### Entry and navigation

- Show an immediately usable entrance with “Explore projects.” Retain a brief decorative stack reveal only if it does not delay interaction; reduced-motion users enter without the sequence.
- Desktop controls: previous/next, four labelled thumbnail buttons, and “Gallery overview.” Navigation stops at the first/last exhibit instead of wrapping unexpectedly.
- A project image selects the exhibit. Only the explicit “View project” link opens the external site, avoiding accidental launches when a user taps an already selected image.
- Reuse `RollingButtonLabel` for matching text-and-arrow CTAs.
- Provide a readable list-view option for users who prefer direct access or cannot use the 3D scene.

## Implementation order

### 1. Establish data and state foundations

Create `src/data/projects.ts` with four stable project IDs and the existing project content. Keep spatial placement separate from project data. Use this source for the catalogue and homepage without changing the homepage's visual design.

Review existing public URLs before exposing actions. Do not label the generic GitHub profile as a project's source repository. Do not invent additional screenshots, project outcomes, or technology claims.

Replace overlapping phase timers with explicit entrance, overview, and selected-project states plus a transition status. Use one entry event, clean up asynchronous work on unmount, and derive transition completion from the animation itself. During camera travel, retain only the most recent requested destination so rapid input cannot build an animation queue.

Deliverable: four projects with stable selection, safe repeated entry, and predictable navigation before adding the new environment.

### 2. Prove the room and camera composition

Build a simple room prototype using the current CSS perspective. Model two walls, floor, ceiling accents, and an end wall. Calculate room length from the four exhibit positions instead of a magic hallway-depth constant.

Calculate camera distance from perspective, artwork dimensions, and the space reserved for navigation and details. When moving between opposite walls, use an intermediate corridor position before approaching the next exhibit. Avoid interpolating directly through wall geometry.

Verify that `preserve-3d`, clipping, opacity, and stacking contexts do not flatten the scene. Keep viewport clipping outside the 3D hierarchy. Check desktop Chrome and Safari/WebKit before adding more visual effects; simplify surface layering if compositing differs.

Deliverable: an entrance and all four selected views that fit the screen and clearly show spatial structure.

### 3. Add useful exhibit content and controls

Create focused components under `src/components/catalogue/` for the room, exhibit, details, and navigation. Keep `CatalogueGallery.tsx` as the coordinator.

Add small scene plaques and the readable details panel. Reveal new details after the camera settles, with a short fade. The title, selected thumbnail, counter, and CTA must always refer to the same project.

Use semantic buttons and anchors, visible focus indicators, `aria-current` on the selected project control, and a polite announcement of the selected title. Scope arrow-key shortcuts to the gallery interaction area; do not intercept native activation on focused controls or input while the navbar is being used.

Deliverable: visitors can identify each project, understand it, and open its live site without guessing which surface is clickable.

### 4. Implement mobile and fallback views

Build the mobile stage and details flow from the same data and selection model. Detect horizontal intent before changing projects; preserve vertical scrolling in the details panel. One swipe changes at most one project. Ignore swipes starting on interactive controls.

Remove fixed minimum widths that exceed the viewport. Preserve the selected project when resizing across the breakpoint. Provide the list view and reduced-motion behavior without requiring animated camera travel.

Deliverable: the complete catalogue remains usable at 320px width, in phone landscape, with touch, and with keyboard navigation.

### 5. Integrate the route and apply visual polish

Coordinate `/catalogue` with the existing navbar, page transition, preloader, and Lenis provider. Prevent hidden background scrolling while the scene is active; restore scrolling on exit. Ensure the underlying footer cannot receive focus while covered by the scene. Nested details and navigation panels must retain native scrolling.

Avoid stacking an unskippable catalogue intro after the global preloader. Use soft static gradients and limited shadows for lighting; keep continuous animation and large animated blur filters out of the room. Load the first exhibit promptly and prepare the next image before navigation. Show a useful placeholder if an image fails.

Add the `/catalogue` canonical and route-specific social metadata. Keep the first release to the existing assets; additional demo footage can be added later if supplied.

Deliverable: the gallery behaves correctly within the whole site and feels visually complete.

### 6. Verify and review

Run TypeScript and an optimized production build. If the existing `.next/trace` lock recurs, use an isolated build output rather than deleting or disrupting the active development output. Do not treat the unconfigured lint prompt as a passing check.

Exercise these scenarios in a browser:

| Area | Acceptance criteria |
| --- | --- |
| Entrance | Room structure and at least two exhibits are visible; entry works immediately and cannot start twice. |
| Selected views | All four artworks fit the available area; details and controls remain readable without overlap. |
| Input | Arrows, thumbnails, keyboard, and touch select the expected project; rapid input cannot leave the camera locked or details out of sync. |
| Responsive | Check 320, 390, 768, 1114, and 1440px widths, short landscape screens, and resizing while a project is selected. |
| Navigation | Navbar opens above the scene; contact/home navigation and browser Back work; scrolling is restored after leaving. |
| Accessibility | Keyboard reaches only visible controls; focus is visible; reduced motion removes travel; list view offers every project link. |
| Rendering | No black surfaces, wall clipping, flattened 3D layers, or image flashes in Chrome and Safari/WebKit. |
| Performance | Profile camera travel and mobile swipes on a representative device; reduce shadows/layers if frames consistently exceed the display's frame budget. |

Capture entrance, selected-project, and mobile screenshots for visual review. Add focused regression coverage for selection boundaries, repeated start, transition interruption, and viewport fitting if a test harness is available; avoid introducing a large test setup solely for decorative styling.

## First-release boundary

Include room structure, four distinct exhibits, readable details, reliable navigation, mobile presentation, accessibility, and route integration. Defer free-roaming controls, sound, particles, real-time reflections, and a WebGL rewrite until the core experience is reviewed. The existing CSS 3D approach is sufficient to prototype and validate this direction.
