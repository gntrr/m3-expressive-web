# Button Specification

## Status and scope

This document is the implementation contract for the library's ordinary
Material 3 Button. It records baseline Material 3 behavior and the currently
traceable Material 3 Expressive additions. It does not specify IconButton,
ToggleButton, SplitButton, or ButtonGroup, and it does not authorize runtime or
CSS implementation by itself.

Source classifications used below:

- **canonical**: directly represented by a current Material specification,
  generated token, or public AndroidX API;
- **translated**: authoritative Material data deliberately expressed in web
  units or native-web behavior;
- **provisional**: official evidence exists, but the public source surface is
  incomplete or internally inconsistent;
- **web-decision**: a library choice required for a robust React/web API.

## Source hierarchy and pinned provenance

Use sources in this order when they disagree:

1. The live [Material 3 Button overview][M3-overview], [specs][M3-specs],
   [guidelines][M3-guidelines], and [accessibility guidance][M3-accessibility]
   establish purpose, anatomy, and design intent. These pages are not
   revision-addressable; this record was checked on 2026-09-03.
2. AndroidX Material3 revision
   [`caff944e3c964d90779c1e71d965ff755debc0ba`][AX-revision] is the numeric and
   behavioral source of truth. [Button.kt][AX-Button] defines the public
   implementation behavior. Generated Button token files identify themselves
   as `v0_11_0`, except `FilledTonalButtonTokens.kt`, which identifies itself as
   `v0_103`.
3. Material Web revision
   [`c05b4b23485c803f68ff31cde52506cea5cc555a`][MW-revision], generated token
   version `v0.192`, is secondary evidence for baseline web anatomy, form
   integration, CSS logical properties, wrapping, and target treatment. It is
   not an Expressive implementation and the project is in maintenance mode.
4. The [HTML Standard][HTML-button], [WAI-ARIA Button Pattern][WAI-button],
   [WCAG 2.2 target-size guidance][WCAG-target], CSS forced-colors, and
   reduced-motion specifications govern web behavior where Material is silent.

The repository's own Color, Typography, Shape, Elevation, Motion, and
Interaction State foundations are the implementation-facing system-token
sources. Component code must not copy their numeric values.

## Purpose and variants

Buttons initiate actions. The five ordinary variants remain unchanged by the
Expressive update:

| Public value | Material name | Purpose | Status |
| --- | --- | --- | --- |
| `filled` | Filled | Highest emphasis for an important final action | canonical |
| `tonal` | Filled tonal | Strong secondary action; between filled and outlined | canonical; shortened API name is a web-decision |
| `elevated` | Elevated | Tonal-like action requiring separation from a patterned surface | canonical |
| `outlined` | Outlined | Medium-emphasis alternative action | canonical |
| `text` | Text | Lowest-emphasis action, often in contained contexts | canonical |

Expressive adds size and shape behavior, not a sixth ordinary variant.
AndroidX now exposes [ToggleButton][AX-Toggle], [SplitButton][AX-Split], and
[ButtonGroup][AX-ButtonGroup] separately; their selected, checked, menu, and
group behaviors must not leak into Button.

## Anatomy

The DOM root is one native `<button>`. Its visual composition is:

1. visual container/background;
2. elevation shadow for variants that define one, or outline for `outlined`;
3. state layer, clipped to the current container shape;
4. required action label;
5. optional decorative leading icon at logical inline-start;
6. optional decorative trailing icon at logical inline-end;
7. a separate visible-focus indicator that is never substituted by the state
   layer;
8. an interactive target that may extend beyond the 32px or 40px visual
   container.

Material Web's pinned implementation independently renders background,
ripple, focus ring, elevation/outline, label, icon, and a 48px minimum touch
target ([Button source][MW-Button], [shared styles][MW-shared],
[touch-target styles][MW-touch]). AndroidX `contentPaddingFor` explicitly
supports both start and end icons. Material Web also documents trailing icons,
so both icon positions are supported. Interactive descendants inside the label
or icon slots are invalid.

## Expressive size and shape model

Android `dp` dimensions are translated one-for-one to CSS reference pixels,
matching Material Web's platform-web convention. This does not mean hardware
pixels: browser page zoom scales CSS pixels. Typography continues to use the
repository's scalable `rem` system.

| Size | Visual min block size | Inline / block padding | Icon | Gap | Label role | Round rest | Square rest | Pressed target | Outline |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- | ---: |
| `extra-small` | 32px | 12px / 6px | 20px | 4px | `labelLarge` | `full` | `medium` | `small` | 1px |
| `small` | 40px | 16px / 10px | 20px | 8px | `labelLarge` | `full` | `medium` | `small` | 1px |
| `medium` | 56px | 24px / 16px | 24px | 8px | `titleMedium` | `full` | `large` | `medium` | 1px |
| `large` | 96px | 48px / 32px | 32px | 12px | `headlineSmall` | `full` | `extraLarge` | `large` | 2px |
| `extra-large` | 136px | 64px / 48px | 40px | 16px | `headlineLarge` | `full` | `extraLarge` | `large` | 3px |

Provenance by row:

- Extra-small height, icon, shapes, and outline are from
  [ButtonXSmallTokens][AX-XSmall]. Padding and gap deliberately use the current
  public [ButtonDefaults][AX-Button] overrides. That source contains TODOs
  stating that the generated 16dp inline padding and 8dp gap need correction.
- Small metrics and shapes are from [ButtonSmallTokens][AX-Small] and current
  `ButtonDefaults`. The explicit Expressive size helper resolves a 20dp icon;
  the legacy `ButtonDefaults.IconSize` remains hard-coded to 18dp with a TODO.
- Medium, large, and extra-large generated metrics are from
  [ButtonMediumTokens][AX-Medium], [ButtonLargeTokens][AX-Large], and
  [ButtonXLargeTokens][AX-XLarge]. Block padding and typography selection are
  defined by current `ButtonDefaults.textStyleFor` and content-padding helpers.
- All semantic corner values resolve through `MATERIAL_SHAPE_CORNERS`; the
  numeric corner scale is not duplicated here.

The 58dp current AndroidX `MinWidth` translates to a 58px minimum inline size.
There is no authoritative maximum width or per-tier minimum width. Material
Web's older baseline implementation instead uses 64px; AndroidX takes
precedence. Natural content plus inline padding will make large tiers wider
than 58px. The component must expose no arbitrary maximum.

AndroidX also contains a platform flag that changes its default small control
to 36dp for a precision pointer. This is platform policy, not one of the five
Button size tokens. The web component must not silently change its `size`
because a mouse is present.

The `round` resting shape is fully authoritative. The per-tier `square`
shapes are present in generated tokens, but the ordinary AndroidX Button public
surface only exposes a general small `squareShape`; complete per-size square
selection is therefore classified provisional at the component API level.
It remains in the proposed API because the generated geometry is exact and is
part of the Expressive vocabulary. Review it again before implementation.

## Foundation mappings

### Color

Use semantic roles from the Color foundation. Current AndroidX generated
variant tokens take precedence over the older Material Web mappings:

| Variant | Container | Label, icon, and state-layer source | Disabled container | Disabled content | Outline |
| --- | --- | --- | --- | --- | --- |
| Filled | `primary` | `onPrimary` | `onSurface` at 0.10 | `onSurfaceVariant` at 0.38 | none |
| Tonal | `secondaryContainer` | `onSecondaryContainer` | `onSurface` at 0.12 | `onSurface` at 0.38 | none |
| Elevated | `surfaceContainerLow` | `primary` | `onSurface` at 0.10 | `onSurfaceVariant` at 0.38 | none |
| Outlined | transparent | `onSurfaceVariant` | transparent | `onSurfaceVariant` at 0.38 | `outlineVariant`; disabled at 0.10 |
| Text | transparent | `onSurfaceVariant` | transparent | `onSurfaceVariant` at 0.38 | none |

The values are from [FilledButtonTokens][AX-Filled],
[FilledTonalButtonTokens][AX-Tonal], [ElevatedButtonTokens][AX-Elevated],
[OutlinedButtonTokens][AX-Outlined], and [TextButtonTokens][AX-Text]. The token
files include selected values because they are also consumed by the separate
ToggleButton implementation; selected is not a static Button state.

### Typography

Resolve the role in the size table through `MATERIAL_STANDARD_TYPE_SCALE` or
the configured `MaterialTypography`. Use all five discrete CSS properties:
font family, size, line height, weight, and tracking. Do not hard-code a font or
bundle one. Emphasized type roles are not assigned to Button by current source.

### Shape

Resolve `full`, `medium`, `extraLarge`, `small`, and `large` through
`MATERIAL_SHAPE_CORNERS`. Rounded rectangles serialize to logical
`border-*-*-radius`. For a morphable full pill, the renderer may translate
`full` to half the resolved visual block size rather than animate from the
foundation's 9999px serialization; that is a web translation of the same role,
not a new corner value.

### Elevation

| Variant | Enabled | Hover | Focus-visible | Pressed | Disabled |
| --- | --- | --- | --- | --- | --- |
| Filled | `level0` | `level1` | `level0` | `level0` | `level0` |
| Tonal | `level0` | `level1` | `level0` | `level0` | `level0` |
| Elevated | `level1` | `level2` | `level1` | `level1` | `level0` |
| Outlined | `level0` | `level0` | `level0` | `level0` | `level0` |
| Text | `level0` | `level0` | `level0` | `level0` | `level0` |

Resolve these through `materialElevation` and the translated web shadow
variables. Elevation never implies `z-index`.

### Interaction State

Use `materialStates` and `resolveMaterialStateComposition`; do not create
Button-specific opacity constants. The relevant opacity references are
`materialStates.hover`, `materialStates.focus`, and `materialStates.pressed`.
The precedence is disabled, pressed, focus, hover, enabled. Visible focus is a
separate indication channel. `dragged` is excluded because current static
Button sources do not define drag behavior.

### Motion

The current Expressive AndroidX overload explicitly morphs its resting and
pressed corner shapes with `MotionSchemeKeyTokens.DefaultEffects`, with a source
comment saying this non-bouncy choice is intentional. Map that to
`materialMotion.expressive.tokens.defaultEffects`. The source also contains a
TODO to load a future component motion token, so the mapping must be reviewed
when that TODO changes.

State-layer opacity and shadow changes are effects, not spatial movement.
Their proposed web category is `fastEffects`; this category assignment is a
web-decision because current Button tokens do not provide component speeds.
Do not turn the AndroidX internal legacy elevation tweens into new canonical
tokens. The existing Motion foundation intentionally retains springs as
physics data until a documented CSS solver exists.

## State composition matrix

In the tables below, `H`, `F`, and `P` mean the existing hover, focus, and
pressed state-layer opacity tokens. `fastEffects*` marks the proposed
web-decision described above. “Rest” means the selected round or square shape
for the size. “Pressed” means the size-specific pressed target.

### Filled

| State | Container | Content / layer | Elevation | Shape | Motion |
| --- | --- | --- | --- | --- | --- |
| Enabled | `primary` | `onPrimary` / none | `level0` | rest | none |
| Hover | `primary` | `onPrimary` / `onPrimary` × H | `level1` | rest | `fastEffects*` |
| Focus-visible | `primary` | `onPrimary` / `onPrimary` × F | `level0` | rest | `fastEffects*`; separate focus indicator |
| Pressed | `primary` | `onPrimary` / `onPrimary` × P | `level0` | pressed | `defaultEffects` |
| Disabled | `onSurface` × 0.10 | `onSurfaceVariant` × 0.38 / none | `level0` | rest | snap |

### Tonal

| State | Container | Content / layer | Elevation | Shape | Motion |
| --- | --- | --- | --- | --- | --- |
| Enabled | `secondaryContainer` | `onSecondaryContainer` / none | `level0` | rest | none |
| Hover | `secondaryContainer` | `onSecondaryContainer` / same × H | `level1` | rest | `fastEffects*` |
| Focus-visible | `secondaryContainer` | `onSecondaryContainer` / same × F | `level0` | rest | `fastEffects*`; separate focus indicator |
| Pressed | `secondaryContainer` | `onSecondaryContainer` / same × P | `level0` | pressed | `defaultEffects` |
| Disabled | `onSurface` × 0.12 | `onSurface` × 0.38 / none | `level0` | rest | snap |

### Elevated

| State | Container | Content / layer | Elevation | Shape | Motion |
| --- | --- | --- | --- | --- | --- |
| Enabled | `surfaceContainerLow` | `primary` / none | `level1` | rest | none |
| Hover | `surfaceContainerLow` | `primary` / `primary` × H | `level2` | rest | `fastEffects*` |
| Focus-visible | `surfaceContainerLow` | `primary` / `primary` × F | `level1` | rest | `fastEffects*`; separate focus indicator |
| Pressed | `surfaceContainerLow` | `primary` / `primary` × P | `level1` | pressed | `defaultEffects` |
| Disabled | `onSurface` × 0.10 | `onSurfaceVariant` × 0.38 / none | `level0` | rest | snap |

### Outlined

| State | Container | Content / layer | Outline | Shape | Motion |
| --- | --- | --- | --- | --- | --- |
| Enabled | transparent | `onSurfaceVariant` / none | `outlineVariant` | rest | none |
| Hover | transparent | `onSurfaceVariant` / same × H | `outlineVariant` | rest | `fastEffects*` |
| Focus-visible | transparent | `onSurfaceVariant` / same × F | `outlineVariant` | rest | `fastEffects*`; separate focus indicator |
| Pressed | transparent | `onSurfaceVariant` / same × P | `outlineVariant` | pressed | `defaultEffects` |
| Disabled | transparent | `onSurfaceVariant` × 0.38 / none | `outlineVariant` × 0.10 | rest | snap |

### Text

| State | Container | Content / layer | Elevation | Shape | Motion |
| --- | --- | --- | --- | --- | --- |
| Enabled | transparent | `onSurfaceVariant` / none | `level0` | rest | none |
| Hover | transparent | `onSurfaceVariant` / same × H | `level0` | rest | `fastEffects*` |
| Focus-visible | transparent | `onSurfaceVariant` / same × F | `level0` | rest | `fastEffects*`; separate focus indicator |
| Pressed | transparent | `onSurfaceVariant` / same × P | `level0` | pressed | `defaultEffects` |
| Disabled | transparent | `onSurfaceVariant` × 0.38 / none | `level0` | rest | snap |

Native `disabled` suppresses hover, focus, pressed, activation, and state layers.
The focus indicator must remain visible above the state layer and cannot rely
on a color change alone.

## Expressive press shape behavior

Shape change applies to every ordinary variant and all five sizes. The source
shape is the selected resting `round` or `square` role. The target is the
size-specific pressed role in the size table. Only the pressed interaction
changes shape; hover and focus do not. Releasing or canceling returns to rest.

AndroidX animates only when both endpoints are compatible corner-based shapes;
otherwise it changes them without interpolation. This web implementation only
needs rounded-rectangle corner interpolation, which is topologically safe in
CSS. It must not substitute an expressive polygon or arbitrary radius. Under
`prefers-reduced-motion: reduce`, remove the interpolation while applying the
pressed shape and state layer immediately.

## Native web semantics and accessibility

- Render exactly one native `<button>`, without a redundant `role`.
- Default `type` to `button` as a documented web-decision that prevents an
  accidental submit. Forward explicit `submit` and `reset` unchanged. Native
  form ownership, `name`, `value`, `form`, `formAction`, `formMethod`,
  `formEncType`, `formNoValidate`, and `formTarget` must continue to work.
  Material Web defaults to native `submit`; this library intentionally differs.
- Use the native `disabled` attribute. It removes the control from sequential
  focus and prevents click and form submission. Do not add a general
  `aria-disabled` or “soft disabled” prop to this first contract.
- Preserve browser activation: Enter and Space activate the focused button;
  do not synthesize keyboard clicks in React.
- Require a meaningful label. Visible text supplies the accessible name;
  `aria-label` or `aria-labelledby` may refine it. Leading and trailing icon
  wrappers are decorative and hidden from accessibility APIs. Icon-only use is
  invalid and belongs to a future IconButton.
- Navigation is not an action button. `href`, `as`, `asChild`, and arbitrary
  polymorphism are absent. A later `ButtonLink` may share visual internals while
  rendering an anchor or router link, but it needs a separate semantic and type
  contract.
- Use `:focus-visible` for an authored focus enhancement, but retain the user
  agent outline until an authoritative, contrast-safe replacement is defined.
  Never remove focus indication.
- Keep the visual and pointer targets distinct. Extra-small and small visual
  containers are 32px and 40px, while Material Web provides a 48px target.
  Any hit-area expansion must not overlap adjacent controls. WCAG 2.2 AA's
  normative minimum is 24 CSS px subject to exceptions, and 44 CSS px is the
  enhanced AAA target; the implementation should retain Material's 48px target
  where layout permits.
- Apply hover only where hover is available. Touch, pen, mouse, coarse-pointer,
  and cancellation behavior remain native. Press feedback uses `:active` and
  must not require pointer-event JavaScript.
- In forced-colors mode, retain `forced-color-adjust: auto`, remove translucent
  state-layer dependence, permit system `ButtonFace`, `ButtonText`, `GrayText`,
  `ButtonBorder`, and `Highlight` colors, and preserve a visible boundary.
  Shadows may disappear without changing semantics.
- Use logical spacing. In RTL, leading remains inline-start and trailing remains
  inline-end; icon artwork decides independently whether it is directional.
- Use `min-block-size`, not a fixed height. Ordinary labels should be concise,
  but constrained widths, localization, browser zoom, and text-only zoom must
  be allowed to wrap and expand vertically without clipping or ellipsis-driven
  information loss. No component max width is imposed.
- Light and dark schemes use the same semantic mappings. Do not branch on
  literal colors inside Button.

## Proposed React 19 API

```ts
export type ButtonVariant =
  | 'filled'
  | 'tonal'
  | 'elevated'
  | 'outlined'
  | 'text';

export type ButtonSize =
  | 'extra-small'
  | 'small'
  | 'medium'
  | 'large'
  | 'extra-large';

export type ButtonShape = 'round' | 'square';

export interface ButtonProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}
```

Defaults are `variant="filled"`, `size="small"`, `shape="round"`, and
`type="button"`. The ref resolves to the native `HTMLButtonElement`. All valid
button, form, event, ARIA, `data-*`, `className`, and `style` props are
forwarded. The component must merge, not replace, the consumer's class name.

There is no loading prop in the initial contract. Current AndroidX has a
separate [LoadingIndicator][AX-Loading] but no `LoadingButton`, and the pinned
Button API has no loading state. Loading is therefore a possible library
extension, not canonical Material Button behavior. A future proposal must
decide whether the label remains exposed, whether repeated activation is
suppressed, how `aria-busy` is announced, and whether focus is retained before
it is added.

## Server Components and hydration

The proposed Button is deterministic native markup with CSS-driven interaction
and needs no hook, browser API, context, or `"use client"` directive. It may be
server-rendered when its props are serializable, including form buttons used
with server actions. In Next.js, an `onClick` function must originate below a
consumer Client Component boundary; the library does not need to force every
static Button into the client bundle for that use case.

Reconsider the boundary only if a future implementation adds internal state,
effects, browser APIs, JavaScript press tracking, or managed loading. A
controlled `loading` attribute alone would not automatically justify a client
boundary. Server and hydration markup must use the same variant, size, shape,
icon order, and default `type`.

## Planned CSS architecture

No CSS is implemented by this specification. The future stylesheet should:

1. resolve Color from `--md-sys-color-*` roles;
2. resolve all discrete type properties from
   `--md-sys-typescale-{role}-{font|size|line-height|weight|tracking}`;
3. resolve corner roles from `--md-sys-shape-corner-*`;
4. resolve shadows from `--md-web-elevation-shadow-level*` without deriving
   stacking order;
5. resolve `--md-sys-state-{hover|focus|pressed}-state-layer-opacity`;
6. consume a documented Motion adapter for the Expressive `defaultEffects`
   spring and the proposed `fastEffects` channels, rather than invent a
   component duration;
7. use `data-variant`, `data-size`, and `data-shape` only as styling hooks, not
   semantic state.

Official baseline public component token names use the pattern
`--md-{variant}-button-*`, for example container color, container elevation,
container shape, label text, icon, outline, and disabled/state channels. Mirror
those names only where the official token exists. Expressive size selection
may resolve into private aliases such as `--_button-container-height`,
`--_button-inline-padding`, `--_button-icon-size`, and
`--_button-pressed-shape`; do not expose invented public custom properties
until an official web component-token vocabulary or a separately reviewed
library extension requires them.

The state layer and visual background should be pseudo-elements or
non-semantic spans inside the button. They must inherit the current radius,
remain non-interactive, and never affect the accessibility tree. The focus
outline remains a separate paint channel. Component CSS must be static and
side-effect-free apart from the package's explicit stylesheet import.

## Storybook acceptance coverage

The implementation is not complete until Storybook covers:

- a 5 × 5 variant/size matrix in round shape;
- every size in square shape and every size's pressed target;
- label-only, leading-icon, trailing-icon, and both-icon composition;
- disabled variants and all enabled hover, focus-visible, and pressed states;
- keyboard tab order plus Enter and Space activation;
- concise labels, localized long labels, constrained wrapping, and browser
  zoom/reflow;
- LTR and RTL logical icon placement;
- light and dark semantic color schemes;
- forced-colors emulation with visible boundaries and focus;
- reduced-motion emulation showing an immediate pressed shape;
- extra-small and small visual bounds alongside their expanded pointer target;
- form `button`, `submit`, and `reset` examples;
- an explicit visual explanation that elevation is not DOM stacking order.

State stories should use Playwright interaction where possible rather than
hard-coded cosmetic “hover” classes. Documentation may expose token names and
provenance, but stories must not introduce default theme values into runtime.

## Automated acceptance tests

### Unit and DOM tests

- renders a native button with filled/small/round defaults and `type="button"`;
- validates every variant, size, and shape value and their data/style hooks;
- forwards native button, form, event, ARIA, data, class, and style props;
- merges class names and returns the native element through the React 19 ref;
- preserves label accessible naming and hides decorative icon wrappers;
- never renders nested interactive content as part of library-owned anatomy;
- native disabled prevents click and submission and is not focusable;
- explicit submit/reset behavior, name/value contribution, external form
  ownership, and submitter data remain native;
- server-rendered markup is deterministic and hydrates without warnings;
- package and component imports introduce no Material Color Utilities or
  routing dependency.

### Browser interaction and accessibility tests

- Tab exposes visible focus; Enter and Space activate exactly once;
- pointer hover is conditional, press applies the correct size target, release
  and cancellation restore rest, and disabled suppresses all feedback;
- computed colors, state layers, outlines, elevation, typography, sizes, icon
  metrics, and padding match every token matrix entry;
- long/localized text reflows without clipping at zoom;
- RTL placement changes visually without changing accessible reading order;
- forced-colors and reduced-motion media emulation preserve operation and
  focus indication;
- automated accessibility checks report no serious violations, followed by
  keyboard and screen-reader-oriented manual review.

## Unresolved questions and implementation gates

1. Re-check the public Material Button spec and AndroidX revision immediately
   before implementation because the live spec is not version-addressable.
2. Confirm whether the AndroidX extra-small padding/gap TODOs or legacy 18dp
   `IconSize` have changed. Until then, the current public size helpers win.
3. Confirm whether per-size square shapes graduate to a complete ordinary
   Button API. Generated tokens are authoritative geometry but incomplete
   public API evidence.
4. Reconcile the current AndroidX color/opacity mappings with any future
   regenerated Material Web tokens. This record intentionally does not use the
   older Web primary/outline mappings.
5. Define and test the non-overlapping web hit-area technique before shipping
   the 32px and 40px visual tiers.
6. The current shape code deliberately uses `DefaultEffects` but has a TODO for
   a component token. Do not freeze a CSS duration until the repository has a
   reviewed spring-to-CSS adapter or upstream publishes a web timing.
7. No exact authored focus-ring component token was found in the current
   Expressive sources. Preserve the browser outline until a reviewed,
   contrast-safe web decision is made.
8. Keep loading outside the contract unless a canonical Button loading state
   appears or a separate extension proposal defines its semantics.

## Implementation resolution

Implemented on 2026-09-03 by `Button.tsx` and `button.css` with no runtime
dependency additions. The public entry is `m3-expressive-web/components/button`;
styles remain an explicit `m3-expressive-web/styles.css` import. The component
does not import the Material Color Utilities generator or install a theme.

The following reviewed decisions resolve implementation gates without changing
canonical foundation data:

- **Pressed motion — translated fallback:** `:active` switches immediately to
  the size-specific semantic pressed corner role. No transition is authored.
  This preserves exact geometry and reduced-motion behavior without pretending
  that the Expressive spring is a CSS Bézier curve. A future reviewed spring
  renderer may replace this paint-only fallback.
- **Focus — web-decision:** `:focus-visible` retains the browser's native
  contrast-aware outline with a 2px offset. Forced-colors uses `Highlight` and
  keeps a system-color container boundary. The focus indicator is independent
  from the Material state layer.
- **Small targets — documented limitation:** no invisible 48px pseudo-target is
  emitted because overlapping sibling hit areas are unsafe without layout
  ownership. The 32px and 40px native targets exceed WCAG 2.2's 24px minimum;
  consuming layouts should provide 48px spacing where practical.
- **Component aliases — translated:** official baseline color alias names such
  as `--md-filled-button-container-color` are accepted as overrides. Expressive
  size plumbing remains private (`--_button-*`) while its defaults are the
  pinned values above; no new public size token vocabulary is claimed.
- **Outline geometry — web-decision:** the outlined stroke is painted with an
  inset pseudo-element so its width does not increase the canonical container
  height. Elevation remains a visual shadow only and never sets `z-index`.

[M3-overview]: https://m3.material.io/components/buttons/overview
[M3-specs]: https://m3.material.io/components/buttons/specs
[M3-guidelines]: https://m3.material.io/components/buttons/guidelines
[M3-accessibility]: https://m3.material.io/components/buttons/accessibility
[AX-revision]: https://android.googlesource.com/platform/frameworks/support/+/caff944e3c964d90779c1e71d965ff755debc0ba
[AX-Button]: https://android.googlesource.com/platform/frameworks/support/+/caff944e3c964d90779c1e71d965ff755debc0ba/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt
[AX-Toggle]: https://android.googlesource.com/platform/frameworks/support/+/caff944e3c964d90779c1e71d965ff755debc0ba/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/ToggleButton.kt
[AX-Split]: https://android.googlesource.com/platform/frameworks/support/+/caff944e3c964d90779c1e71d965ff755debc0ba/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/SplitButton.kt
[AX-ButtonGroup]: https://android.googlesource.com/platform/frameworks/support/+/caff944e3c964d90779c1e71d965ff755debc0ba/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/ButtonGroup.kt
[AX-Loading]: https://android.googlesource.com/platform/frameworks/support/+/caff944e3c964d90779c1e71d965ff755debc0ba/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/LoadingIndicator.kt
[AX-XSmall]: https://android.googlesource.com/platform/frameworks/support/+/caff944e3c964d90779c1e71d965ff755debc0ba/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ButtonXSmallTokens.kt
[AX-Small]: https://android.googlesource.com/platform/frameworks/support/+/caff944e3c964d90779c1e71d965ff755debc0ba/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ButtonSmallTokens.kt
[AX-Medium]: https://android.googlesource.com/platform/frameworks/support/+/caff944e3c964d90779c1e71d965ff755debc0ba/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ButtonMediumTokens.kt
[AX-Large]: https://android.googlesource.com/platform/frameworks/support/+/caff944e3c964d90779c1e71d965ff755debc0ba/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ButtonLargeTokens.kt
[AX-XLarge]: https://android.googlesource.com/platform/frameworks/support/+/caff944e3c964d90779c1e71d965ff755debc0ba/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ButtonXLargeTokens.kt
[AX-Filled]: https://android.googlesource.com/platform/frameworks/support/+/caff944e3c964d90779c1e71d965ff755debc0ba/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledButtonTokens.kt
[AX-Tonal]: https://android.googlesource.com/platform/frameworks/support/+/caff944e3c964d90779c1e71d965ff755debc0ba/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledTonalButtonTokens.kt
[AX-Elevated]: https://android.googlesource.com/platform/frameworks/support/+/caff944e3c964d90779c1e71d965ff755debc0ba/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ElevatedButtonTokens.kt
[AX-Outlined]: https://android.googlesource.com/platform/frameworks/support/+/caff944e3c964d90779c1e71d965ff755debc0ba/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/OutlinedButtonTokens.kt
[AX-Text]: https://android.googlesource.com/platform/frameworks/support/+/caff944e3c964d90779c1e71d965ff755debc0ba/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/TextButtonTokens.kt
[MW-revision]: https://github.com/material-components/material-web/tree/c05b4b23485c803f68ff31cde52506cea5cc555a
[MW-Button]: https://github.com/material-components/material-web/blob/c05b4b23485c803f68ff31cde52506cea5cc555a/button/internal/button.ts
[MW-shared]: https://github.com/material-components/material-web/blob/c05b4b23485c803f68ff31cde52506cea5cc555a/button/internal/_shared.scss
[MW-touch]: https://github.com/material-components/material-web/blob/c05b4b23485c803f68ff31cde52506cea5cc555a/button/internal/_touch-target.scss
[HTML-button]: https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element
[WAI-button]: https://www.w3.org/WAI/ARIA/apg/patterns/button/
[WCAG-target]: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
