# Adaptive Layout Foundation

This module translates Material window-size and canonical-layout intent for the
web without React, device detection, resize hooks, or layout components.

## Window classes

The current AndroidX `BREAKPOINTS_V2` width model is:

| Class | Canonical range |
| --- | --- |
| Compact | `<600dp` |
| Medium | `600–<840dp` |
| Expanded | `840–<1200dp` |
| Large | `1200–<1600dp` |
| Extra-large | `≥1600dp` |

Height is independent: compact `<480dp`, medium `480–<900dp`, and expanded
`≥900dp`. `BREAKPOINTS_V1` contains only compact, medium, and expanded width;
the current model adds large and extra-large without changing the earlier
boundaries. Both models remain available through
`MATERIAL_WINDOW_SIZE_CLASS_MODELS`.

```ts
import {
  materialMediaQueries,
  materialWindowSizeClasses,
  resolveMaterialWindowSizeClass,
} from 'm3-expressive-web/foundation/adaptive-layout';

resolveMaterialWindowSizeClass(1280, 720);
// { width: 'large', height: 'medium', ... }

materialWindowSizeClasses.width.expanded.minDp; // 840
materialMediaQueries.width.expanded; // (840px <= width < 1200px)
```

Classes describe available space, never devices. A resizable desktop window,
split-screen region, foldable window, and iframe can all resolve to the same
class.

## Web translation and queries

Canonical values remain recorded as `dp`. Query helpers map them numerically to
CSS `px`, classified as a translation rather than physical equivalence. CSS
pixels participate in browser zoom; `devicePixelRatio` must not drive layout.

Use viewport media queries for application-level composition and navigation.
Use `container-type: inline-size` plus the exported `inline-size` conditions for
embedded adaptive regions, panes, and reusable layouts. Primitive components
should remain viewport-independent. The CSS custom properties are reference
values only: CSS custom properties cannot be interpolated into media-query
conditions, so query helpers intentionally serialize literal thresholds.

Prefer CSS selection so server-rendered markup is stable through hydration.
Use logical inline/block properties for RTL, apply safe-area environment values
only at viewport-bound edges, account for scrollbars near thresholds, prefer
dynamic/s viewport units where full-height layouts need them, and define print
composition independently from screen navigation.

## Canonical layout and navigation intent

- Feed is a content-driven adaptive grid rather than a fixed device-column map.
- List-detail shows one pane at a time below expanded width, then list and detail
  together; an extra pane is optional.
- Supporting-pane keeps dependent supporting content below/overlaid at compact,
  conditionally beside primary content at medium, and beside it at expanded.

Current adaptive navigation defaults use bottom navigation for compact width,
compact height, or tabletop posture, and side navigation otherwise. A drawer is
not an automatic expanded-width result; destination count, hierarchy, and
remaining content width decide it. The older compact bar → medium rail →
expanded drawer/rail rule is retained only as provisional historical guidance.

Provenance is pinned in `MATERIAL_ADAPTIVE_LAYOUT_SOURCE`, including AndroidX
revision `c39790fae05be897dc522b3710db07d44d54f4d0` and the 2026-08-04 Android
window-size guidance. Material's linked standalone window-class page was
unavailable during this audit, so the conflict is documented rather than hidden.
