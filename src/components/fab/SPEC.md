# Floating Action Button Specification

## Status and scope

This is the implementation contract for future Material 3 Floating Action
Button (FAB) and Extended FAB components. It records the baseline system and
the current, traceable Material 3 Expressive additions. It does **not**
authorize React, CSS, positioning, a menu, a toggle FAB, or an animation
runtime.

Source classifications used below:

- **canonical**: directly represented by a current Material specification,
  generated token, or public AndroidX API;
- **translated**: authoritative Material data deliberately expressed for the
  web platform;
- **provisional**: official evidence exists but is incomplete or conflicts
  with another official source; and
- **web-decision**: a library decision required for a safe web API.

## Source hierarchy and pinned provenance

Resolve disagreements in this order:

1. Live Material [FAB overview][M3-overview], [specs][M3-specs],
   [guidelines][M3-guidelines], and [accessibility][M3-accessibility], plus
   the corresponding [Extended FAB pages][M3-extended], establish purpose and
   design intent. They were checked on 2026-09-17 and are not
   revision-addressable.
2. AndroidX Material3 revision
   [`160825094a81825468a95b115bfb1b541e549856`][AX-revision] is the numeric and
   behavioral source of truth. [FloatingActionButton.kt][AX-FAB] defines
   baseline, small, medium, large, and Extended FAB APIs. Generated baseline,
   small, medium, large, primary, and secondary files are `v0_14_0`; the
   legacy extended-primary file is `v0_103`.
3. Material Web revision
   [`c05b4b23485c803f68ff31cde52506cea5cc555a`][MW-revision], generated token
   version `v0.192`, is secondary baseline web evidence for the four color
   variants, icon-only/extended anatomy, and native-button integration. It is
   in maintenance mode and has no equivalent Expressive four-tier size model.
4. The [HTML button definition][HTML-button], [WAI-ARIA Button Pattern][WAI-button],
   [WCAG 2.2 target-size guidance][WCAG-target], [focus-visible][focus-visible],
   [interaction media features][interaction-media], [forced colors][forced-colors],
   and [reduced motion][reduced-motion] control web behavior where Material is
   silent.

The repository's Color, Typography, Shape, Elevation, Motion, Interaction
State, and Adaptive Layout foundations are the implementation-facing sources.
Component code must consume them, not duplicate their values.

## Purpose, variants, and component boundaries

A FAB represents one primary, contextual action. It is not a generic floating
container, a navigation link, a fixed-position layout primitive, a menu, or a
toggle. A component consumer decides where it sits in an application shell.

| Public value | Material terminology | Container / content roles | Status |
| --- | --- | --- | --- |
| `surface` | Surface FAB | `surfaceContainerHigh` / `primary` | canonical variant; role mapping is translated from Material Web |
| `primary` | Primary FAB | `primaryContainer` / `onPrimaryContainer` | canonical |
| `secondary` | Secondary FAB | `secondaryContainer` / `onSecondaryContainer` | canonical |
| `tertiary` | Tertiary FAB | `tertiaryContainer` / `onTertiaryContainer` | canonical Material variant; AndroidX exposes it through colors rather than a dedicated generated FAB file |

Material Web calls `surface` its default. AndroidX's default FAB is primary.
The future React default must be `primary`, following current AndroidX and the
design-system call-to-action intent; that default is a **web-decision**.
`lowered` is a Material Web-only convenience and must not become a public
variant: AndroidX exposes it as an alternate elevation factory, not a canonical
FAB type.

Regular icon-only FAB and Extended FAB have meaningfully different anatomy and
accessible-name rules. Implement them as separate future contracts:

| Future component | Content | Name source | Expansion |
| --- | --- | --- | --- |
| `Fab` | Exactly one decorative icon | Required `aria-label` **or** `aria-labelledby` | Never |
| `ExtendedFab` | Required visible text, optional decorative leading icon | Visible text by default | Future explicit, controlled `expanded` contract only |

`Fab` must not accept a text label. `ExtendedFab` may omit its icon, as
Material Web documents; it must not accept arbitrary interactive children.
The current AndroidX `ToggleFloatingActionButton` and FAB menu are separate
components with different state, geometry, and disclosure semantics. They are
out of scope and must not be smuggled into `Fab` with `selected`, `checked`, or
`aria-pressed` props.

## Anatomy and content rules

Both future components use one native `<button>` whose visual structure is:

1. visual container and state layer, clipped to the container shape;
2. elevation shadow outside that clipping boundary;
3. an icon for `Fab`, or an optional leading icon and required label for
   `ExtendedFab`;
4. a focus-visible indicator outside the visual clipping layer; and
5. the actual interactive target.

An icon is decorative: the component wraps it in a presentational,
`aria-hidden="true"` visual slot. SVG titles, nested links, text, and
interactive descendants are invalid because they can conflict with the native
button's name and activation. A FAB needs an explicit accessible name;
Extended FAB's visible label supplies its name unless the author gives an
intentional, more specific accessible-name override.

## Size, geometry, and typography

Android `dp` is translated one-for-one to CSS reference pixels. This is a
**translated** unit policy, not a hardware-pixel claim; browser zoom continues
to scale CSS pixels. Dimensions below describe visual geometry, not an
invisible touch-target expansion.

### Icon-only FAB

| Public size | AndroidX name | Visual box | Icon | Rest shape | Status |
| --- | --- | ---: | ---: | --- | --- |
| `small` | Small FAB | 40 × 40px | 24px | `medium` | canonical |
| `regular` | baseline `FloatingActionButton` | 56 × 56px | 24px | `large` | canonical; public name is a web-decision |
| `medium` | Medium FAB | 80 × 80px | 28px | `largeIncreased` | canonical dimensions; shape provisional |
| `large` | Large FAB | 96 × 96px | 36px* | `extraLarge` | canonical current API; icon discrepancy is provisional |

The generated large FAB token says 32dp, but current public AndroidX
`FloatingActionButtonDefaults.LargeIconSize` deliberately returns 36dp and
marks the token incorrect. The future web component must use 36px if built
against this revision, while preserving both facts in provenance. The medium
token has no active shape and AndroidX uses `ShapeDefaults.LargeIncreased`
behind a TODO; use the existing `MATERIAL_SHAPE_CORNERS.largeIncreased` only
with its **provisional** classification.

`regular` intentionally identifies the 56px tier. Material Web's older API
calls that geometry `medium`, while AndroidX calls its 80px Expressive tier
`MediumFloatingActionButton`; exposing both as `medium` would be ambiguous.
No FAB size may change because of viewport width, pointer type, or orientation.

### Extended FAB

| Public size | AndroidX name | Minimum height/width | Icon | Leading / gap / trailing | Label role | Rest shape | Status |
| --- | --- | ---: | ---: | --- | --- | --- | --- |
| `regular` | Extended FAB | 56 × 80px | 24px | 16 / 12 / 20px | `labelLarge` | `large` | canonical current API; direct constants are translated |
| `small` | Small Extended FAB | 56 × 56px | 24px | 16 / 8 / 16px | `titleMedium` | `large` | canonical |
| `medium` | Medium Extended FAB | 80 × 80px | 28px | 26 / 12* / 26px | `titleLarge` | `largeIncreased` | provisional gap and shape |
| `large` | Large Extended FAB | 96 × 96px | 32px | 28 / 16* / 28px | `headlineSmall` | `extraLarge` | provisional gap |

Natural label width extends an Extended FAB beyond its listed minimum. Apply
Typography foundation roles rather than copying font metrics or bundling a
font. The 12px medium and 16px large gaps are current AndroidX implementation
overrides: their generated token values are marked incorrect. They are
**provisional** until generated tokens agree. No official maximum width is
available; text must wrap or reflow only under a separately reviewed layout
policy, never be clipped to preserve a floating silhouette.

## Foundation mappings

### Color

Use semantic Color foundation roles, in both light and dark schemes. Generated
AndroidX files establish primary and secondary container mappings; Material Web
is the secondary authoritative evidence for surface and tertiary variants.

| Variant | Enabled container | Icon / label and state-layer source | Disabled container | Disabled content |
| --- | --- | --- | --- | --- |
| Surface | `surfaceContainerHigh` | `primary` | `onSurface` × 0.10 | `onSurface` × 0.38 |
| Primary | `primaryContainer` | `onPrimaryContainer` | `onSurface` × 0.10 | `onSurface` × 0.38 |
| Secondary | `secondaryContainer` | `onSecondaryContainer` | `onSurface` × 0.10 | `onSurface` × 0.38 |
| Tertiary | `tertiaryContainer` | `onTertiaryContainer` | `onSurface` × 0.10 | `onSurface` × 0.38 |

Enabled primary and secondary roles are **canonical**; surface and tertiary are
**translated** Material Web mappings. AndroidX FAB currently has no `enabled`
parameter or generated disabled-color tokens. Its disabled rows are therefore
a **web-decision**, following the repository's common disabled-state policy;
they must not be relabeled as FAB canonical tokens. The state layer uses the
current content role and `materialStates`, never a copied FAB opacity.

### Shape

All defined FAB containers are rounded rectangles. Resolve named roles through
`MATERIAL_SHAPE_CORNERS` and serialize with logical corner radii. There is no
authoritative FAB-specific non-rectangular Expressive geometry, directional
corner variant, selected shape, or pressed-shape target in the pinned source.
Keep the same resting shape in enabled, hover, focus, pressed, and disabled
states. Do not import IconButton's pressed morphing behavior.

### Elevation and tonal treatment

The normal FAB elevation is the same for every size and color variant:

| State | Elevation | Status |
| --- | --- | --- |
| Enabled | `level3` | canonical |
| Hover | `level4` | canonical |
| Focus-visible | `level3` | canonical |
| Pressed | `level3` | canonical |
| Disabled | `level0` | web-decision |

Resolve shadows through `materialElevation` and the foundation's translated
web shadow serialization. Elevation is visual separation, not a `z-index`, DOM
stacking order, or placement policy. AndroidX notes that elevation can apply a
primary tonal overlay when a caller customizes the container to `surface`;
this library's `surface` variant already names `surfaceContainerHigh`, so it
must not add tonal elevation on top of its semantic color. Disabled elevation
is not defined by AndroidX because its FAB API has no native disabled state;
this document assigns `level0` as the deliberate web policy.

### Typography, state, motion, and layout

Only Extended FAB consumes Typography: resolve the named role from the
repository type scale, including configured font stacks and scalable `rem`
serialization. A regular FAB's icon dimension is geometry, not typography.

Use `materialStates` and `resolveMaterialStateComposition` with precedence
disabled, pressed, focus-visible, hover, enabled. Hover is limited to
hover-capable fine pointers; focus-visible is an independent visible indicator,
not merely a translucent state layer. Disabled suppresses pointer state layers
and non-essential effects. FAB has no canonical selected/toggle state.

AndroidX animates elevation internally and uses `FastEffects` plus
`DefaultSpatial` for Extended FAB label collapse/expansion. Its source also
contains TODOs for component motion tokens. Map this intent to the existing
Motion foundation only: no CSS spring approximation, bespoke easing, ripple
runtime, or automatic width animation is approved. Until a reviewed renderer
exists, use immediate state geometry and elevation changes; reduced motion
also removes non-essential expansion effects while retaining the final state.

Adaptive Layout may advise an application shell when to show, position, hide,
or transform a FAB, but it does not resize this primitive. AndroidX's animated
show/hide helper and `FabPosition` are scaffold-level APIs, not evidence for
viewport logic inside `Fab` or `ExtendedFab`.

## Interaction-state matrix

`H`, `F`, and `P` below mean the existing hover, focus, and pressed state-layer
tokens. “Content” is the active variant's icon/label color. All rows use the
resting size shape and have no implied stacking level.

| State | Container / content | State layer | Elevation | Motion |
| --- | --- | --- | --- | --- |
| Enabled | active variant roles | none | `level3` | none |
| Hover | unchanged | Content × H | `level4` | effects only; no new curve |
| Focus-visible | unchanged + external focus indicator | Content × F | `level3` | effects only; no new curve |
| Pressed | unchanged | Content × P | `level3` | immediate fallback |
| Disabled | disabled roles | none | `level0` | snap |

## Intended future React contracts

The initial components should be narrow, SSR-safe native buttons:

```tsx
<Fab
  variant="primary"
  size="regular"
  aria-label="Create item"
  onClick={createItem}
>
  <AddIcon />
</Fab>
```

```tsx
<ExtendedFab variant="primary" leadingIcon={<AddIcon />} onClick={createItem}>
  Create item
</ExtendedFab>
```

```ts
type FabVariant = 'surface' | 'primary' | 'secondary' | 'tertiary';
type FabSize = 'small' | 'regular' | 'medium' | 'large';

type FabAccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };
```

`FabProps` should combine `FabAccessibleName` with
`ComponentPropsWithoutRef<'button'>`, omitting `children`, `aria-label`, and
`aria-labelledby` first. It requires exactly one icon `ReactElement`, forwards
a ref and safe native button props, and defaults `type` to `button`. It does
not offer `href`, `asChild`, `as`, a position prop, a `shape` override, a
`lowered` prop, or toggle behavior.

`ExtendedFabProps` should require a non-empty textual label and optionally a
single `leadingIcon`. Its visible label is its ordinary accessible name;
`aria-label` or `aria-labelledby` is optional only for an intentional naming
override. Its initial implementation should remain expanded. A future
controlled `expanded` API needs its own reviewed type, layout, accessibility,
and motion contract before it is exposed. Neither component needs a React
provider or a `'use client'` directive.

## Accessibility and web-platform contract

- Use native `<button>` without a redundant role. Native Enter and Space
  activation, tab order, and form semantics apply. Default `type="button"`
  prevents accidental form submission; explicit `submit` and `reset` remain
  valid native choices.
- `Fab` requires one non-empty, trimmed `aria-label` or `aria-labelledby`.
  `title` is supplementary only and never satisfies the contract. Development
  code must reject blank labels. Its decorative icon cannot provide a second
  name.
- Extended FAB's visible text is exposed as the button name. Do not hide that
  text or replace it with an icon-only compact FAB without supplying the
  required icon-only name.
- `disabled` must be native, not `aria-disabled` alone. It prevents native
  activation and focus, and it does not use whole-control opacity.
- Material's common touch expectation is 48 × 48 CSS px; WCAG 2.2 AA's
  baseline is 24 × 24 CSS px. Small FAB's 40px visual box needs an
  application/layout decision for a non-overlapping 48px target. Do not claim
  that visual geometry automatically satisfies it.
- Use `:focus-visible` for a perceivable ring outside the clipped state layer.
  Gate hover with `(hover: hover) and (pointer: fine)`; touch, pen, and coarse
  pointers retain native pressed feedback without sticky hover.
- Use logical CSS properties and inherit `dir`. Do not mirror arbitrary
  consumer icons; icon directionality belongs to the glyph author. Zoom must
  scale geometry and reflow Extended FAB labels without clipping focus rings.
- In `forced-colors: active`, preserve native disabled behavior, a visible
  system-color focus indicator, and a discernible boundary. Suppress
  translucent state layers where necessary; do not disable user color
  adjustment without a reviewed equivalent. Reduced motion retains feedback
  and final state but removes non-essential expansion/elevation effects.

## Future Storybook plan

When implementation begins, create colocated stories for:

1. all four variants in light and dark semantic schemes;
2. small, regular, medium, and large icon-only FABs, with visual dimensions and
   the 32px-versus-36px large-icon provenance annotation;
3. Extended FAB sizes, optional leading icon, long labels, and text reflow;
4. enabled, hover-capable, focus-visible, pressed, and disabled states,
   including elevation versus DOM stacking explanation;
5. icon-only `aria-label` and `aria-labelledby` examples, and a
   documentation-only invalid-name example;
6. keyboard activation, RTL logical layout, forced colors, and reduced motion;
   and
7. visual size versus actual hit-area documentation, especially the small FAB.

## Future test plan

Unit and Playwright-backed Storybook tests must cover:

- one native button, default and explicit `type`, ref forwarding, safe native
  prop forwarding, class/style forwarding, SSR rendering, and hydration;
- icon-only accessible-name union, blank/missing-name rejection, decorative
  icon treatment, Extended FAB visible-label naming, and `title` insufficiency;
- native Enter and Space activation, disabled behavior, focus-visible, and
  hover capability gating;
- all variant color mappings, all size geometry, shape mapping, typography,
  padding, and immutable source token records;
- elevation mapping with proof that no `z-index` is inferred; state-layer
  precedence; forced-colors; reduced-motion; RTL; browser zoom; and Extended
  text reflow; and
- proof that no selected, checked, `aria-pressed`, link, automatic breakpoint,
  animation-runtime, or hidden-touch-target behavior is accidentally added.

## Open questions and implementation gates

1. The AndroidX large FAB icon token is 32dp while its public default is 36dp
   with a TODO declaring the token wrong. Reconfirm the authoritative value at
   implementation time.
2. The medium FAB and medium Extended FAB shape token is missing; AndroidX
   substitutes `largeIncreased` behind a TODO. Preserve that provisional
   provenance until a generated token appears.
3. AndroidX's medium and large Extended FAB icon-gap tokens are explicitly
   overridden as incorrect. Do not freeze those web values as final tokens.
4. Surface and tertiary variants are canonical Material/Web vocabulary, but
   AndroidX exposes only primary and secondary generated container token files.
   Recheck their component-token provenance before code makes the web mapping
   immutable.
5. No official CSS rendering or component-specific web timing exists for FAB
   elevation or Extended expansion. Do not add animated interpolation until
   Motion has a reviewed web renderer.
6. FAB placement, visibility, collision avoidance, and any conversion between
   extended and compact form remain application-shell responsibilities.

[M3-overview]: https://m3.material.io/components/floating-action-button/overview
[M3-specs]: https://m3.material.io/components/floating-action-button/specs
[M3-guidelines]: https://m3.material.io/components/floating-action-button/guidelines
[M3-accessibility]: https://m3.material.io/components/floating-action-button/accessibility
[M3-extended]: https://m3.material.io/components/extended-fab/overview
[AX-revision]: https://android.googlesource.com/platform/frameworks/support/+/160825094a81825468a95b115bfb1b541e549856
[AX-FAB]: https://android.googlesource.com/platform/frameworks/support/+/160825094a81825468a95b115bfb1b541e549856/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/FloatingActionButton.kt
[AX-baseline]: https://android.googlesource.com/platform/frameworks/support/+/160825094a81825468a95b115bfb1b541e549856/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FabBaselineTokens.kt
[AX-small]: https://android.googlesource.com/platform/frameworks/support/+/160825094a81825468a95b115bfb1b541e549856/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FabSmallTokens.kt
[AX-medium]: https://android.googlesource.com/platform/frameworks/support/+/160825094a81825468a95b115bfb1b541e549856/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FabMediumTokens.kt
[AX-large]: https://android.googlesource.com/platform/frameworks/support/+/160825094a81825468a95b115bfb1b541e549856/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FabLargeTokens.kt
[AX-primary]: https://android.googlesource.com/platform/frameworks/support/+/160825094a81825468a95b115bfb1b541e549856/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FabPrimaryContainerTokens.kt
[AX-secondary]: https://android.googlesource.com/platform/frameworks/support/+/160825094a81825468a95b115bfb1b541e549856/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FabSecondaryContainerTokens.kt
[AX-extended-primary]: https://android.googlesource.com/platform/frameworks/support/+/160825094a81825468a95b115bfb1b541e549856/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExtendedFabPrimaryTokens.kt
[AX-extended-small]: https://android.googlesource.com/platform/frameworks/support/+/160825094a81825468a95b115bfb1b541e549856/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExtendedFabSmallTokens.kt
[AX-extended-medium]: https://android.googlesource.com/platform/frameworks/support/+/160825094a81825468a95b115bfb1b541e549856/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExtendedFabMediumTokens.kt
[AX-extended-large]: https://android.googlesource.com/platform/frameworks/support/+/160825094a81825468a95b115bfb1b541e549856/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExtendedFabLargeTokens.kt
[MW-revision]: https://github.com/material-components/material-web/tree/c05b4b23485c803f68ff31cde52506cea5cc555a
[MW-docs]: https://github.com/material-components/material-web/blob/main/docs/components/fab.md
[HTML-button]: https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element
[WAI-button]: https://www.w3.org/WAI/ARIA/apg/patterns/button/
[WCAG-target]: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
[focus-visible]: https://www.w3.org/TR/selectors-4/#the-focus-visible-pseudo
[interaction-media]: https://www.w3.org/TR/mediaqueries-4/#mf-interaction
[forced-colors]: https://www.w3.org/TR/css-color-adjust-1/#forced-colors
[reduced-motion]: https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion
