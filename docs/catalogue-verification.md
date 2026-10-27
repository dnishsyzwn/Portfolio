# Catalogue implementation verification

> Historical report: this describes the redesign that was reverted on 28 October 2026. The original catalogue design is active again.

Implemented the four-project catalogue with shared project data, an architectural CSS 3D room, camera fitting, interruption-safe navigation, readable project details, thumbnails, mobile swipes, reduced-motion support, list view, and route-specific scroll/metadata integration.

## Checks performed

- TypeScript: passed (`npx tsc --noEmit --incremental false`).
- Optimized production build: passed using `NEXT_BUILD_DIR=.next-catalogue-check` to preserve the active development output.
- Chromium/Edge automated browser checks: artwork fit at 1440×1000, 1114×902, 768×800, and 1440×500; mobile layout and swipe navigation at 320×740, 390×844, and 667×375.
- All four selected exhibits use matching, fitted front-facing camera compositions.
- Rapid navigation, list/gallery switching, navbar interaction, selection preservation across responsive breakpoints, keyboard arrows/Escape, reduced motion, and scrolling restoration after returning home passed.
- Broken-image handling displays a named placeholder and leaves project details available.
- No page JavaScript errors in the Chromium scenario suite or WebKit fallback checks.
- Windows WebKit accepts CSS perspective syntax but does not project even a minimal standalone test. Runtime capability detection therefore opens the list automatically; switching to the flat gallery and navigating projects passed. Native Safari 3D rendering still needs a macOS/iOS device check.
- Visual screenshots were inspected for the desktop entrance, selected exhibits, mobile layout, and WebKit list fallback. Physical-device performance has not been measured; the scene uses static lighting and animates only camera movement.

## Project link review

- Syncuid's public site is available.
- `1tusk.com` did not resolve during verification.
- `gocarry.com` redirected through a domain landing-page script.
- `stu.org.my` identified itself as Sarawak Teachers' Union, while the portfolio project is Sabah Teachers Union.

The three unavailable or mismatched links were removed from shared data. Their CTA now opens a prefilled contact inquiry labelled “Discuss project.” Supply verified live URLs to restore external project links. The generic GitHub profile is not presented as project source code.

## Maintenance

Project content now lives in `src/data/projects.ts`; room geometry remains separate under `src/components/catalogue/`. The homepage consumes the same content and preserves its existing layouts and animations. Matching CTA labels reuse `RollingButtonLabel`.

The repository's standalone lint command still needs initial ESLint configuration; it was not counted as a separate passing lint run. Changes made earlier in this chat were retained.
