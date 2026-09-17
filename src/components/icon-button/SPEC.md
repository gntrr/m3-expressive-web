# IconButton Specification

## Status and scope

This is the implementation contract for a future Material 3 IconButton and its
separate toggle contract. It records baseline Material 3 behavior and the
currently traceable Material 3 Expressive additions. It does **not** authorize
a React component, CSS, runtime state, ThemeProvider, or an icon set.

Source classifications used below:

- **canonical**: directly represented by a current Material specification,
  generated token, or public AndroidX API;
- **translated**: authoritative Material data deliberately expressed for the
  web platform;
- **provisional**: official evidence exists but the public specification is
  incomplete, experimental, or internally inconsistent;
- **web-decision**: a library choice needed for an accessible React/web API.

## Source hierarchy and pinned provenance

Use these sources in order when they disagree:

1. The live Material 3 [Icon buttons overview][M3-overview], [specs][M3-specs],
   [guidelines][M3-guidelines], and [accessibility guidance][M3-accessibility]
   establish purpose and design intent. They were checked on 2026-09-17; live
   pages are not revision-addressable.
2. AndroidX Material3 revision
   [`dd97834aa54671ee1f56d65fa46668b4ffeb57e8`][AX-revision] is the numeric and
   behavioral source of truth. [IconButton.kt][AX-IconButton] contains the
   current ordinary, toggle, and Expressive shape APIs. Generated size tokens
   are [extra-small][AX-XSmall], [small][AX-Small], [medium][AX-Medium],
   [large][AX-Large], and [extra-large][AX-XLarge] (`14_1_0` except large,
   which is `v0_11_0`). Generated [standard][AX-standard], [filled][AX-filled],
   [filled tonal][AX-tonal], and [outlined][AX-outlined] color tokens are
   `14_1_0`.
3. [IconButtonDefaults.kt][AX-defaults] at the same revision is authoritative
   for the public size-width helpers, default colors, and outline treatment.
   Its `IconButtonWidthOption` documentation still contains a TODO to update
   its specification guidance, so width-selection policy is provisional.
4. Material Web revision
   [`c05b4b23485c803f68ff31cde52506cea5cc555a`][MW-revision] and its live
   [Icon Button documentation][MW-docs] are secondary baseline web evidence.
   It documents the four variants and 40px / 24px baseline anatomy, but is in
   maintenance mode and has no equivalent Expressive five-size model.
5. The [HTML button definition][HTML-button], [WAI-ARIA Button Pattern][WAI-button],
   [WCAG 2.2 target-size guidance][WCAG-target], [focus-visible][focus-visible],
   [interaction media features][interaction-media], [forced colors][forced-colors],
   and [reduced motion][reduced-motion] govern web behavior where Material is
   silent.

The repository Color, Typography, Shape, Elevation, Motion, and Interaction
State foundations are the implementation-facing sources. Component code must
not duplicate their values.

## Purpose, boundaries, and variants

An IconButton is a compact, supplementary action represented by one icon. It
is not a generic icon container, an icon link, a menu trigger, or a button with
a visually hidden text label. It must have an accessible name supplied by its
author.

| Public value | Material name | Ordinary action use | Toggle use | Status |
| --- | --- | --- | --- | --- |
| `standard` | Standard | Low-emphasis action on a transparent container | Distinguishes pressed by icon color | canonical; API spelling is a web-decision |
| `filled` | Filled | High-emphasis compact action | Distinguishes pressed with a filled primary container | canonical |
| `tonal` | Filled tonal | Medium-emphasis compact action | Distinguishes pressed with secondary colors | canonical; shortened API spelling is a web-decision |
| `outlined` | Outlined | Medium-emphasis action requiring a boundary | Pressed state replaces the outline with an inverse-surface container | canonical |

Expressive does not add a fifth variant. It adds size-specific measurements and
shape states. Material Web calls its stateful form `toggle` / `selected`;
AndroidX calls it `IconToggleButton` / `checked`. Neither state belongs on an
ordinary action IconButton.

### Ordinary action versus toggle

| Contract | Does activation persist a state? | ARIA state | Future public surface |
| --- | --- | --- | --- |
| `IconButton` | No. It invokes an action. | No `aria-pressed`. | `onClick` and normal native button props. |
| `ToggleIconButton` | Yes. The application controls whether its action is active. | `aria-pressed={pressed}`. | `pressed` and `onPressedChange`. |

This library should implement these as **separate components/contracts**. A
boolean `selected` prop on `IconButton` conflates command buttons with toggle
buttons, permits incorrect ARIA, and makes the required controlled state
unclear. AndroidX's `checked` terminology and Compose `Role.Checkbox` are
Android-specific implementation choices; they must not be copied to a web
toggle button. `aria-pressed` on a native `<button>` is the web translation.

## Anatomy and content rules

The future DOM root is one native `<button>`, composed of:

1. visual container/background;
2. optional outline for `outlined`;
3. state layer clipped to the current visual shape;
4. exactly one non-interactive, decorative icon graphic;
5. a focus-visible indicator outside the clipped state layer; and
6. an interactive target, which can be larger than the visual container.

The icon is decorative because the button's accessible name comes from the
button, not the icon. Consumers must pass a non-interactive graphic such as an
SVG whose accessible content is hidden by the component. Interactive children,
text labels, nested links, and an icon that supplies a competing accessible
name are invalid. The component owns sizing of the icon's visual box; consumers
own its glyph/path and any font or asset loading.

## Expressive size, width, and shape model

Android `dp` values are translated one-for-one to CSS reference pixels. This
is a **translated** unit policy, not a claim about hardware pixels: browser
zoom scales CSS pixels. The table gives visual geometry, not the touch target.

| Size | Visual height | Narrow / uniform / wide widths | Icon | Rest `round` | Rest `square` | Pressed | Toggle selected from round / square | Outline |
| --- | ---: | ---: | ---: | --- | --- | --- | --- | ---: |
| `extra-small` | 32px | 28 / 32 / 40px | 20px | `full` | `medium` | `small` | `medium` / `full` | 1px |
| `small` | 40px | 32 / 40 / 52px | 24px | `full` | `medium` | `small` | `medium` / `full` | 1px |
| `medium` | 56px | 48 / 56 / 72px | 24px | `full` | `large` | `medium` | `large` / `full` | 1px |
| `large` | 96px | 64 / 96 / 128px | 32px | `full` | `extraLarge` | `large` | `extraLarge` / `full` | 2px |
| `extra-large` | 136px | 104 / 136 / 184px | 40px | `full` | `extraLarge` | `large` | `extraLarge` / `full` | 3px |

All values in the table are **canonical** generated AndroidX tokens. The
shape names resolve through `MATERIAL_SHAPE_CORNERS`; their raw corner values
must not be copied into component code. `square` is the Material name for a
less-round alternative, not necessarily a literal 0-radius square.

AndroidX exposes `Narrow`, `Uniform`, and `Wide` helpers and says they are
respectively recommended for small, medium, and wide screens, but its own TODO
acknowledges the specification guidance is unfinished. Therefore a future web
`IconButton` should expose the **uniform** visual width for each `size` only.
It must not change size or width from viewport width or pointer type. A later
explicit `width` option may be introduced only after its responsive selection,
target geometry, and accessibility effects have a reviewed specification.

`round` is the default future shape. Exposing a `shape="square"` choice is a
**provisional** public API: the generated per-size geometry is authoritative,
but current AndroidX ordinary IconButton's public API accepts general shapes
rather than this exact web enum. It is suitable for documentation and test
planning, but must be re-reviewed before implementation.

### Shape transformation and motion

Current AndroidX provides `IconButtonShapes(shape, pressedShape)` and
`IconToggleButtonShapes(shape, pressedShape, checkedShape)`. It morphs only
between compatible corner-based shapes. Toggle precedence is `pressed`, then
`checked`, then rest. These are **canonical** state targets, not a license to
interpolate arbitrary SVG shapes.

The AndroidX implementation uses `MotionSchemeKeyTokens.DefaultEffects` and
explicitly avoids bounce; it also has a TODO for a future component motion
token. Map it to `materialMotion.expressive.tokens.defaultEffects`. The web
Motion foundation has no reviewed spring-to-CSS adapter, so a future web
implementation must either use a compatible, explicitly reviewed animator or
change the corner role discretely. It must not invent a cubic-bezier curve or
silently animate incompatible geometry. Reduced motion skips non-essential
shape transitions while preserving the resulting state.

## Foundation mappings

### Color

Use Color foundation semantic roles. The ordinary action mappings are:

| Variant | Enabled container | Icon and state-layer source | Disabled container | Disabled icon | Outline |
| --- | --- | --- | --- | --- | --- |
| Standard | transparent | `onSurfaceVariant` | transparent | `onSurface` × 0.38 | none |
| Filled | `primary` | `onPrimary` | `onSurface` × 0.10 | `onSurface` × 0.38 | none |
| Tonal | `secondaryContainer` | `onSecondaryContainer` | `onSurface` × 0.10 | `onSurface` × 0.38 | none |
| Outlined | transparent | `onSurfaceVariant` | transparent | `onSurface` × 0.38 | `outlineVariant`, × 0.38 when disabled |

The token-defined toggle mappings are deliberately separate:

| Variant | Unpressed container / icon | Pressed container / icon | Unpressed outline | Pressed outline |
| --- | --- | --- | --- | --- |
| Standard | transparent / `onSurfaceVariant` | transparent / `primary` | none | none |
| Filled | `surfaceContainer` / `onSurfaceVariant` | `primary` / `onPrimary` | none | none |
| Tonal | `secondaryContainer` / `onSecondaryContainer` | `secondary` / `onSecondary` | none | none |
| Outlined | transparent / `onSurfaceVariant` | `inverseSurface` / `inverseOnSurface` | `outlineVariant` | none |

These are **canonical** mappings from current generated tokens. For every
enabled state, the Interaction State layer uses the current icon/content role,
not a hard-coded component color. Disabled wins over pressed/unpressed visual
selection: it suppresses state layers and motion. AndroidX's alternate
`LocalContentColor` color overloads are platform customization APIs, not a
web system-token contract; this library uses the vibrant semantic mappings.

### Interaction State

Use `materialStates` and `resolveMaterialStateComposition`; do not duplicate
opacity values. State precedence is disabled, pressed, focus-visible, hover,
enabled. For a toggle, pressed/unpressed is a persistent mode axis; the
transient interaction state applies within that mode. Hover is available only
when the device supports it, focus-visible always has an independent visible
indicator, and disabled has no hover, focus, pressed, state layer, or motion.

### Shape

Use the size table and `MATERIAL_SHAPE_CORNERS`. Rounded rectangular visual
containers may serialize to CSS logical border radii. There are no
non-rectangular Material Expressive named shapes in the current IconButton
tokens, so IconButton does not consume the Shape foundation's SVG geometry API.
The state layer clips to the visual shape; the focus indicator and hit target
must not be accidentally clipped with it.

### Elevation and typography

All four variants use `materialElevation.level0` in every state. Material's
filled and tonal treatments are color treatments, not shadow elevation; no
IconButton elevation implies a `z-index`. Icon-only controls have no assigned
Typography role. Icon dimensions are geometry, not font sizes. Tooltip text,
if an application adds it separately, must use that application's typography
contract and cannot become the control's sole accessible name.

## State matrix

`H`, `F`, and `P` mean the existing hover, focus, and pressed state-layer
tokens. “Content” means the enabled ordinary or toggle-mode icon color shown
in the color tables. “Rest” means the selected round/square shape for the
size. All rows are **canonical** except the web focus-ring treatment and CSS
serialization, which are **web-decisions**.

| Interaction state | Container / icon | State layer | Shape: ordinary | Shape: toggle | Elevation | Motion |
| --- | --- | --- | --- | --- | --- | --- |
| Enabled | active variant/mode values | none | rest | rest or selected | level 0 | none |
| Hover | unchanged | content × H | rest | rest or selected | level 0 | effects only; no undocumented timing |
| Focus-visible | unchanged | content × F; separate focus indicator | rest | rest or selected | level 0 | effects only; no undocumented timing |
| Pressed | unchanged | content × P | pressed target | pressed target | level 0 | `defaultEffects` only when compatible |
| Disabled | disabled values | none | rest | rest; persistent state remains semantic but is not an enabled visual state | level 0 | snap/no non-essential motion |

No Material source establishes a separate selected-hover color, selected-focus
color, or selected-pressed color for web. Reuse the selected mode colors and
the foundation state layer; do not fabricate new tokens.

## Intended future React API

The initial ordinary component should be deliberately narrow:

```tsx
<IconButton
  variant="standard"
  size="small"
  aria-label="Settings"
  onClick={openSettings}
>
  <SettingsIcon />
</IconButton>
```

```ts
type IconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outlined';
type IconButtonSize =
  | 'extra-small'
  | 'small'
  | 'medium'
  | 'large'
  | 'extra-large';
type IconButtonShape = 'round' | 'square'; // square remains provisional

type IconButtonAccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };
```

`IconButtonProps` should combine that discriminated accessible-name contract
with `ComponentPropsWithoutRef<'button'>`, omitting `children`, `aria-label`,
and `aria-labelledby` before reintroducing them above. It defaults to
`variant="standard"`, `size="small"`, `shape="round"`, and native
`type="button"`; a consumer may explicitly request `submit` or `reset`.
It forwards a ref and safe native button props.

Future `ToggleIconButton` must be a separate controlled API, conceptually:

```tsx
<ToggleIconButton
  pressed={isMuted}
  onPressedChange={setMuted}
  aria-label="Mute"
>
  <VolumeIcon />
</ToggleIconButton>
```

It derives `aria-pressed` from `pressed` and does not expose a competing
`aria-pressed`, `selected`, or `checked` prop. It shares variant, size, shape,
name, child, ref, and native disabled constraints with IconButton. The precise
event/callback ordering and uncontrolled behavior are intentionally deferred;
the first implementation must remain controlled unless a separately reviewed
need for uncontrolled state exists.

Do not add `asChild`, `as`, `href`, or Radix dependencies. A native button is
the correct element for a command, preserves keyboard and disabled semantics,
and requires no client-only primitive. Link/navigation behavior belongs to a
separate future component if needed.

## Accessibility contract

An interactive IconButton without an accessible name is invalid in this
library's public contract. The future component must require exactly one of:

- a non-empty, trimmed `aria-label`; or
- an `aria-labelledby` reference to existing visible or otherwise appropriate
  text.

Types enforce the either/or shape; the implementation must also reject an
empty `aria-label` during development because TypeScript cannot prove a string
has content. `title` may provide supplemental browser tooltip text but never
satisfies this contract: it is unreliable for keyboard and touch users and is
not a durable accessible-name strategy. The decorative icon must not duplicate
the supplied name.

Use the native `<button>` element without a redundant ARIA role. Native Enter
and Space activation, keyboard focus order, and disabled behavior are required.
`disabled` must be the native attribute (not `aria-disabled` alone): disabled
controls are not focusable or activatable. `:focus-visible`, not hover or the
state layer, provides a perceivable focus indication. A toggle remains a native
button and uses `aria-pressed`; it does not use checkbox semantics unless a
future, separately specified control is actually a checkbox.

AndroidX documents a 48dp minimum touch target even where visual Expressive
size is 32px or 40px. For the web, WCAG 2.2 AA's 24 by 24 CSS px target minimum
is a baseline and Material's 48px expectation is the target for touch-facing
usage. Enlarging a hit area invisibly can overlap adjacent controls, so the
future implementation must document and test its chosen, non-overlapping
target strategy before code lands. It must not pretend the 32px visual box is
automatically a 48px target.

The initial ordinary implementation uses the actual visual button box as its
interactive target and does not invisibly expand extra-small or small targets.
This is a **web-decision** that preserves non-overlapping controls; layouts for
touch-facing use remain responsible for providing Material's 48px target space.

## Web, SSR, and platform translation

- A pure native button can render during React SSR and Next.js server rendering;
  it needs no `"use client"` directive unless future behavior introduces hooks
  or browser-only effects. It must hydrate without relying on layout
  measurement.
- Hover styling is gated with `(hover: hover) and (pointer: fine)`. Touch and
  pen receive active/pressed feedback but never acquire a sticky hover state.
  Native keyboard activation handles Enter and Space.
- The container is direction-neutral. Use CSS logical properties, inherit
  `dir`, and do not automatically mirror arbitrary consumer icons in RTL;
  glyph directionality belongs to the icon author. No visual state may change
  solely because the document is RTL.
- CSS reference pixels scale under browser zoom. Do not use transforms or
  viewport breakpoints to resize an IconButton, and avoid clipping a zoomed
  focus indicator.
- In `forced-colors: active`, preserve the native disabled state, a visible
  focus indicator, and a discernible boundary using system colors. State-layer
  translucency and brand color mappings may be suppressed; do not force custom
  colors with `forced-color-adjust: none` without a reviewed equivalent.
- The visual shape may clip the state layer, but never an external focus ring.
  `overflow: hidden` can clip shadows, focus, and expanded target regions; use
  it only on an inner visual layer. Non-rectangular clipping is not required.
- With `prefers-reduced-motion: reduce`, keep direct feedback and state changes
  but remove or shorten non-essential shape/effect transitions. Do not globally
  set every duration to zero.

## Future Storybook plan

Create colocated stories only when implementation begins:

1. four ordinary variants in light and dark schemes;
2. all five uniform sizes, with the icon-size and visual-container annotations;
3. round and provisional square resting shapes, plus pressed shape comparison;
4. a separate controlled ToggleIconButton story showing unpressed and pressed
   values for each variant;
5. enabled, hover-capable, keyboard focus-visible, pressed, and disabled
   states (state pseudo-classes should be exercised, not merely illustrated);
6. accessible-name examples for `aria-label` and `aria-labelledby`, alongside a
   documentation-only invalid unlabeled example;
7. interactive target versus smaller visual geometry, without overlapping
   neighboring targets;
8. RTL, forced-colors, and reduced-motion media-emulation stories; and
9. a motion/shape story that shows only the implementation actually approved
   against compatible corner geometry.

## Future test plan

Unit and browser interaction tests must cover:

- one native button, default `type="button"`, safe button-prop forwarding, and
  React 19 ref forwarding;
- accessible name from both allowed sources; rejection of absent or blank
  names; decorative icon treatment; and proof that `title` alone is rejected;
- Tab focus plus native Enter and Space activation; native disabled controls
  cannot receive focus or invoke the action;
- every variant/size default, icon size, uniform visual geometry, outline
  width, and shape-role mapping; all generated token values remain immutable;
- hover gating, focus-visible indicator, pressed layer, disabled precedence,
  light/dark semantic-color consumption, RTL logical layout, forced-colors,
  zoom/reflow, and reduced-motion behavior;
- a separate ToggleIconButton's controlled `pressed` callback and derived
  `aria-pressed`; pressed/unpressed colors and shapes; and disabled toggle
  behavior; and
- SSR rendering/hydration without an implicit client boundary.

Pseudo-class, forced-colors, reduced-motion, keyboard, and hit-target checks
belong in Playwright-backed Storybook interaction tests where browser behavior
is observable. Token resolution and prop contracts belong in deterministic
unit tests.

## Open questions and implementation gates

1. AndroidX's narrow/uniform/wide selection guidance is incomplete. Keep width
   out of the initial web API until Material publishes enough adaptive guidance
   to specify it without arbitrary viewport behavior.
2. The public `shape="square"` enum is useful but provisional because AndroidX
   exposes general shape objects rather than this exact ordinary-component API.
3. AndroidX names the toggle state `checked` and assigns checkbox semantics;
   the web contract intentionally uses a pressed button. Validate this choice
   with accessibility review when implementation begins.
4. No current component-specific web timing or CSS spring translation exists
   for Expressive IconButton shape morphing. Do not implement a substitute
   until the Motion foundation has a reviewed renderer.
5. A non-overlapping 48px web hit-target strategy for visual sizes below 48px
   needs a concrete layout contract before implementation.

[M3-overview]: https://m3.material.io/components/icon-buttons/overview
[M3-specs]: https://m3.material.io/components/icon-buttons/specs
[M3-guidelines]: https://m3.material.io/components/icon-buttons/guidelines
[M3-accessibility]: https://m3.material.io/components/icon-buttons/accessibility
[AX-revision]: https://android.googlesource.com/platform/frameworks/support/+/dd97834aa54671ee1f56d65fa46668b4ffeb57e8
[AX-IconButton]: https://android.googlesource.com/platform/frameworks/support/+/dd97834aa54671ee1f56d65fa46668b4ffeb57e8/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/IconButton.kt
[AX-defaults]: https://android.googlesource.com/platform/frameworks/support/+/dd97834aa54671ee1f56d65fa46668b4ffeb57e8/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/IconButtonDefaults.kt
[AX-XSmall]: https://android.googlesource.com/platform/frameworks/support/+/dd97834aa54671ee1f56d65fa46668b4ffeb57e8/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/XSmallIconButtonTokens.kt
[AX-Small]: https://android.googlesource.com/platform/frameworks/support/+/dd97834aa54671ee1f56d65fa46668b4ffeb57e8/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SmallIconButtonTokens.kt
[AX-Medium]: https://android.googlesource.com/platform/frameworks/support/+/dd97834aa54671ee1f56d65fa46668b4ffeb57e8/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/MediumIconButtonTokens.kt
[AX-Large]: https://android.googlesource.com/platform/frameworks/support/+/dd97834aa54671ee1f56d65fa46668b4ffeb57e8/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/LargeIconButtonTokens.kt
[AX-XLarge]: https://android.googlesource.com/platform/frameworks/support/+/dd97834aa54671ee1f56d65fa46668b4ffeb57e8/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/XLargeIconButtonTokens.kt
[AX-standard]: https://android.googlesource.com/platform/frameworks/support/+/dd97834aa54671ee1f56d65fa46668b4ffeb57e8/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/IconButtonTokens.kt
[AX-filled]: https://android.googlesource.com/platform/frameworks/support/+/dd97834aa54671ee1f56d65fa46668b4ffeb57e8/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledIconButtonTokens.kt
[AX-tonal]: https://android.googlesource.com/platform/frameworks/support/+/dd97834aa54671ee1f56d65fa46668b4ffeb57e8/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledTonalIconButtonTokens.kt
[AX-outlined]: https://android.googlesource.com/platform/frameworks/support/+/dd97834aa54671ee1f56d65fa46668b4ffeb57e8/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/OutlinedIconButtonTokens.kt
[MW-revision]: https://github.com/material-components/material-web/tree/c05b4b23485c803f68ff31cde52506cea5cc555a
[MW-docs]: https://github.com/material-components/material-web/blob/main/docs/components/icon-button.md
[HTML-button]: https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element
[WAI-button]: https://www.w3.org/WAI/ARIA/apg/patterns/button/
[WCAG-target]: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
[focus-visible]: https://www.w3.org/TR/selectors-4/#the-focus-visible-pseudo
[interaction-media]: https://www.w3.org/TR/mediaqueries-4/#mf-interaction
[forced-colors]: https://www.w3.org/TR/css-color-adjust-1/#forced-colors
[reduced-motion]: https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion
