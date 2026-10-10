# Segmented Button Specification

## Status and scope

This is the implementation contract for a future web-native Material 3
Segmented Button family. It defines separate single-select and multi-select
group contracts. It does **not** authorize React, CSS, context, uncontrolled
state, a generic standalone segment, responsive layout, links, ripple, or an
animation runtime.

Classifications:

- **canonical**: directly established by a pinned Material source, generated
  token, AndroidX API, or web platform standard;
- **translated**: canonical source data deliberately expressed for the web;
- **provisional**: authoritative evidence is incomplete or inconsistent; and
- **web-decision**: an explicit API or accessibility choice where Material is
  silent.

## Source hierarchy and pinned provenance

Resolve disagreement in this order:

1. Live Material [overview][M3-overview], [specifications][M3-specs],
   [guidance][M3-guidelines], and [accessibility][M3-accessibility] establish
   purpose and anatomy. They were checked on 2026-10-09 and are not
   revision-addressable.
2. AndroidX Material3 revision
   [`c73a560c5c9ba4ed53a4f6dd5df36dfd16a837e7`][AX-revision] is the numeric
   and behavior source. [SegmentedButton.kt][AX-segmented] (blob
   `320653dd901f0f218b0d09f1ef8aebc4011843ef`) defines mutually exclusive
   and non-exclusive rows; its generated
   [OutlinedSegmentedButtonTokens][AX-tokens] is the token source.
3. Material Web revision
   [`c05b4b23485c803f68ff31cde52506cea5cc555a`][MW-revision] is secondary
   baseline web evidence only. It has no current Material 3 Segmented Button
   implementation or Expressive counterpart; archived MDC controls are not a
   visual or token authority.
4. Native [radio][HTML-radio] and [checkbox][HTML-checkbox] controls, WAI
   [radio-group][WAI-radio] and [checkbox][WAI-checkbox] patterns, [WCAG
   target size][WCAG-target], [focus-visible][focus-visible], [interaction
   media features][media], [forced colors][forced-colors], and [reduced
   motion][reduced-motion] govern web behavior Material does not define.

The existing Color, Typography, Shape, Elevation, Motion, and Interaction
State foundations are the implementation-facing contract. A renderer must use
them rather than duplicate their values.

## Taxonomy and component boundaries

AndroidX exposes `SingleChoiceSegmentedButtonRow` for mutually exclusive
choices and `MultiChoiceSegmentedButtonRow` for independent toggles. This is
**canonical**. The initial public web surface should preserve it:

| Contract | Purpose | Native child | Persistent value | Status |
| --- | --- | --- | --- | --- |
| `SingleSelectSegmentedButtonGroup` | Choose one view, sort, or mode | radio | one value | translated |
| `MultiSelectSegmentedButtonGroup` | Independently enable options | checkbox | set of values | translated |

Do not expose one `selectionMode` discriminant or a public standalone
`SegmentedButton`. The modes differ in native semantics, form behavior,
keyboard operation, and invalid-state prevention. A segment cannot be used
outside its group: logical start/middle/end shape, overlapping border, name,
and selection control depend on the collection. This is a **web-decision**.

The group accepts a typed `segments` collection rather than JSX child
registration. It can render and name real inputs without cloning children or
requiring React context. A future compositional API may add a private
registration/context layer only after it proves a need for custom layout;
context alone must never create a client boundary.

## Web semantics, group naming, and controlled values

### Single select

Each segment is a native `<input type="radio">` with a common required `name`;
the root is a native `<fieldset>` with a visible `<legend>` or one explicit
ARIA group name. This is a **translated** web model. It retains browser radio
semantics, form submission, Arrow-key selection, and mutual exclusion instead
of imitating a radio group with toggle buttons or `aria-pressed`.

```tsx
<SingleSelectSegmentedButtonGroup
  name="calendar-view"
  value="week"
  onValueChange={setView}
  legend="Calendar view"
  segments={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ]}
/>
```

`value` is a required member of supplied segment values; activation cannot
deselect the selected radio. This narrow contract is a **web-decision** that
matches single-choice use and avoids an unnamed “no selection” state.

### Multi select

Each segment is a native `<input type="checkbox">` inside the same named
fieldset. This is a **translated** web model: AndroidX uses a Compose toggle
role, but a checkbox exposes independent persistent values and form semantics
more faithfully than a pressed command button.

```tsx
<MultiSelectSegmentedButtonGroup
  name="report-columns"
  value={['revenue', 'orders']}
  onValueChange={setColumns}
  aria-label="Report columns"
  segments={[
    { value: 'revenue', label: 'Revenue' },
    { value: 'orders', label: 'Orders' },
    { value: 'customers', label: 'Customers' },
  ]}
/>
```

`value` is a controlled readonly value collection. On native input change,
`onValueChange` receives a deduplicated collection in segment declaration
order; empty is valid. Neither group has `defaultValue`, local selection
state, `selected`, `checked`, `aria-pressed`, `href`, `as`, or `asChild` APIs.
Deterministic ordering is a **web-decision**.

### Naming and disabled rules

A group must have exactly one non-empty accessible-name source:

- `legend` (preferred visible group label);
- `aria-label`; or
- `aria-labelledby`.

`title` is supplemental and never supplies the required name. Development
diagnostics must reject blank/conflicting sources. A fieldset/legend is
canonical HTML; the prop union is a **web-decision**.

`disabled` on the group disables every native input. Individual segment
`disabled` disables only that input. A controlled selected/checked disabled
segment remains selected/checked until its owner changes `value`; it cannot
request a change. Native `disabled` is required, not `aria-disabled` alone.

## Segment anatomy and icon rules

Each rendered segment comprises, in paint order:

1. a visually hidden but natively focusable radio or checkbox input;
2. a label-associated visual container with boundary and clipped state layer;
3. an optional decorative leading icon or selected/check icon;
4. a required visible text label; and
5. an external focus-visible indicator on the focused segment.

AndroidX accepts one icon slot. Its default selected icon is a check; an absent
inactive icon lets the label shift for the check, while distinct inactive and
active icons crossfade. The initial API uses `icon` and `selectedIcon` as
alternative visual sources in the same logical start slot: `selectedIcon` wins
when selected, then `icon`, then none. This is a **translated, provisional**
simplification. Do not render them side by side or let either be the only
selection signal.

Labels are required non-empty text. Icon-only segments are not in the first
contract: current source has no dedicated icon-only segmented variant, and a
40px segment needs an unambiguous label. This is a **web-decision**.
Consumer icons are wrapped `aria-hidden="true"` and must be non-interactive;
the label remains the native control name.

## Geometry, size, typography, and shape

Current AndroidX has one baseline outlined segmented-button size; no current
Material 3 Expressive size tier, new icon scale, pressed/selected shape target,
or component-specific Expressive token is published. Do not add `size`,
`shape`, orientation, or viewport-driven APIs.

| Item | Value/rule | Classification |
| --- | --- | --- |
| Visual minimum block size | 40dp -> 40 CSS px | canonical value; translated unit |
| Segment minimum inline size | `ButtonDefaults.MinWidth`: 58dp -> 58 CSS px | canonical Android default; translated unit |
| Icon box | 18dp -> 18 CSS px | canonical value; translated unit |
| Icon/label gap | 8dp -> 8 CSS px | canonical value; translated unit |
| Padding | `TextButtonContentPadding`: 12dp inline, 8dp block | confirmed inherited AndroidX default; provisional because no dedicated segment token |
| Label | `labelLarge` | canonical |
| Boundary | 1dp -> 1 CSS px | canonical value; translated unit |
| Rest elevation | level0 in every mode/state | canonical source intent; translated renderer |

CSS reference pixels preserve browser zoom. Typography resolves all five
properties from repository `labelLarge` variables rather than copying `sp` or
bundling a font. Text must naturally reflow rather than clip or transform. The
40px visual box is not a 48px target guarantee; target spacing remains a group
composition concern and the primitive must not add overlapping invisible area.

The generated base shape is `CornerFull`. One item uses `full`; logical first
uses `start()` geometry, logical last uses `end()`, and intermediate segments
are rectangular. This is **canonical** geometry translated through
`MATERIAL_SHAPE_CORNERS.full` and logical CSS radii. It reverses in RTL without
changing DOM order. No official selected, pressed, or Expressive shape morph
exists.

Adjacent 1px boundaries overlap by one border width so no double divider is
visible. Local paint priority may lift a selected, focused, or actively pressed
segment above neighbours solely to keep its outline continuous; this is a
**translated** border-paint detail, not elevation, global stacking, or a
public z-index contract.

## Color, elevation, and interaction state

Use Color foundation semantic roles. “Transparent” means no component fill,
not a new color token. Alpha affects the relevant layer/boundary, never the
whole control.

| Mode | Container | Label/icon and state-layer source | Boundary | Status |
| --- | --- | --- | --- | --- |
| Enabled unselected | transparent | `onSurface` | `outline` | canonical roles; translated CSS |
| Enabled selected | `secondaryContainer` | `onSecondaryContainer` | `outline` | canonical roles; translated CSS |
| Disabled selected | `secondaryContainer` | `onSurface` x 0.38 | `outline` x 0.12 | canonical Android default; translated compositing |
| Disabled unselected | transparent | `onSurface` at 1.0 | `outline` at 1.0 | canonical AndroidX runtime; provisional web translation |

`SegmentedButton.kt` applies `DisabledLabelTextColor` without the generated
`DisabledLabelTextOpacity`, and `OutlineColor` without
`DisabledOutlineOpacity`, for inactive disabled segments; it applies both
opacities for active disabled segments. The token file names disabled label
0.38 and outline 0.12. This is a source contradiction. The initial renderer
follows the pinned AndroidX runtime—opaque `onSurface`/`outline` for disabled
unselected—because it is the code that actually renders at the pinned revision.
That CSS mapping remains **provisional translated** behavior, not a new
canonical token. Forced colors instead uses `GrayText` for disabled visuals.

Persistent selected/checked state composes with transient interaction state;
it is not CSS `:active`. Resolve hover, focus, and pressed opacity from
`materialStates` once, using the active mode’s content role. Precedence is
disabled, pressed, focus-visible, hover, rest. Hover is gated by
`(hover: hover) and (pointer: fine)`; touch and pen retain native active
feedback without sticky hover. There is no drag state.

Every state remains elevation level0. No shadow, tonal overlay beyond the
selected semantic container, z-index scale, stacking context, or DOM order is
inferred from elevation.

Focus belongs to each native input/labelled segment, never the fieldset. The
focus-visible ring must sit outside the clipped state layer and joined border.
AndroidX supplies interaction visuals but no reviewed browser focus-ring
recipe. The initial external 2 CSS-pixel `secondary` ring is a **provisional
web-decision**. Using the repository's representative generated tonal-spot
scheme (seed `#6750A4`, contrast 0), its contrast is 6.05:1 on light
unselected `surface`, 4.94:1 on light `secondaryContainer`, 11.30:1 on dark
`surface`, and 6.55:1 on dark `secondaryContainer`. It cannot be replaced by
the translucent focus layer. In `forced-colors: active`, preserve native disablement
and a system-color boundary/focus outline, suppress translucent layers as
needed, and do not set `forced-color-adjust: none`.

## Keyboard, layout, RTL, motion, and SSR

Native controls set the keyboard model; no roving tabindex or duplicate key
handlers are needed:

| Model | Tab | Arrow keys | Space | Enter / Home / End |
| --- | --- | --- | --- | --- |
| Radio group | Browser enters/exits group; selected radio is usual tab stop | Native radio navigation moves selection/focus | Native radio selects | Rely on browser; no toolbar/Home/End handlers |
| Checkbox group | Tab reaches enabled checkboxes in DOM order | No custom group navigation | Native checkbox toggles | Do not invent behavior |

Native controls retain form participation. Group/segment renderers must not
call `preventDefault`, intercept modifiers, or convert controls into buttons.

AndroidX rows equalize children with `weight(1f)` and use intrinsic width. The
web group should use equal inline tracks, natural/intrinsic inline sizing, and
`max-inline-size: 100%`, without internal wrap, fixed width, or viewport
breakpoints. Long labels may wrap and increase block size; the parent owns
scrolling, outer width, and responsive layout. Horizontal is the only initial
orientation, matching AndroidX rows. Vertical needs separate authoritative
geometry and keyboard review.

The eventual renderer is SSR/Next.js-safe: controlled props, native inputs,
and labels need neither hooks nor layout measurement or `"use client"`. `dir`
is inherited, all geometry uses logical start/end, and consumer icons are not
automatically mirrored.

AndroidX animates icon/content displacement and icon crossfades with internal
`FastSpatial` motion while noting a TODO for component motion tokens. It has no
public Expressive selection-motion or shape contract. Associate future reviewed
effects with `materialMotion.standard.tokens.fastSpatial`, but initial web
output switches selected icon, color, and geometry immediately. Do not add
ripple, a CSS spring/cubic-bezier substitute, or animation runtime. Reduced
motion preserves final feedback and suppresses future non-essential effects.

## Intended React API

The data-driven API lets the group own native controls, positions, form name,
and geometry without context:

```ts
type SegmentedButtonValue = string;

type SegmentedButtonSegment<T extends SegmentedButtonValue> = {
  value: T;
  label: string;
  disabled?: boolean;
  icon?: ReactElement;
  selectedIcon?: ReactElement;
};

type SegmentedButtonGroupName =
  | { legend: ReactNode; 'aria-label'?: never; 'aria-labelledby'?: never }
  | { legend?: never; 'aria-label': string; 'aria-labelledby'?: never }
  | { legend?: never; 'aria-label'?: never; 'aria-labelledby': string };

type SingleSelectSegmentedButtonGroupProps<T extends string> =
  SegmentedButtonGroupName &
  Omit<ComponentPropsWithoutRef<'fieldset'>, 'children' | 'name' | 'onChange'> & {
    name: string;
    value: T;
    onValueChange: (value: T) => void;
    segments: readonly SegmentedButtonSegment<T>[];
  };

type MultiSelectSegmentedButtonGroupProps<T extends string> =
  SegmentedButtonGroupName &
  Omit<ComponentPropsWithoutRef<'fieldset'>, 'children' | 'name' | 'onChange'> & {
    name: string;
    value: readonly T[];
    onValueChange: (value: readonly T[]) => void;
    segments: readonly SegmentedButtonSegment<T>[];
  };
```

Both groups forward safe fieldset props and an `HTMLFieldSetElement` ref.
Internal radios/checkboxes receive only component-owned `name`, `value`,
`checked`, `disabled`, and change handling. Future `inputProps` need separate
design rather than an ambiguous spread over many controls. Segments require
unique nonblank values and labels; development validation rejects duplicates
and blank names. These routing/validation rules are **web-decisions**.

## Safe internal sharing

Both renderers may share private immutable position geometry, color/elevation
aliases, input/label visual shell, icon slot, state-layer wrapper,
forced-colors treatment, and source provenance. They must retain separate
selection resolution, input type, controlled-value algorithm, callback type,
and keyboard contract. Do not share a faux generic “pressed” state merely to
reduce code.

## Future Storybook and test plan

Create stories only with implementation:

1. named single-select and multi-select groups; selected/unselected,
   all-disabled, and individually disabled selected segments;
2. one/two/many segments, check/leading icons, long labels, equal-width
   geometry, and joined-border inspection;
3. controlled interaction, keyboard radio/checkbox behavior, form
   participation, and group/segment naming;
4. hover-capable, focus-visible, pressed, disabled, light/dark, RTL,
   forced-colors, reduced-motion, and zoom/reflow cases; and
5. documentation-only invalid cases: unnamed group, blank/duplicate value,
   icon-only segment, unsupported vertical group, and button roles.

Deterministic and Playwright-backed tests must cover native fieldset/radio/
checkbox semantics; controlled callback values/order; one selected radio;
keyboard behavior; disabled group/segment behavior; names; icon presentation;
label/type/RTL position; overlapping borders; semantic colors/state layers;
focus-visible; forced colors; reduced motion; SSR markup; ref/fieldset-prop
forwarding; and absence of a client boundary, animation runtime, or standalone
segment export.

## Implementation order and open gates

1. Create private shared geometry/token mapping and native-input visual-shell
   tests.
2. Implement `SingleSelectSegmentedButtonGroup` first: radios establish group
   naming, controlled selection, and joined boundaries.
3. Implement `MultiSelectSegmentedButtonGroup` using only approved shared
   visual internals and its separate checkbox algorithm.
4. Add stories/browser checks after both exist; do not implement a segment
   primitive first.

Open gates:

1. Re-audit the disabled-inactive runtime/token discrepancy on every AndroidX
   revision update; the renderer currently follows runtime behavior.
2. Revalidate inherited `TextButtonContentPadding` when AndroidX changes; it
   is not a dedicated segment token.
3. Recheck the provisional focus-ring contrast for any new default color
   scheme; forced-colors uses the system `Highlight` color.
4. No official Expressive Segmented Button size, shape, or web-motion contract
   is pinned. Do not borrow Button/IconButton tiers or motion.
5. Confirm visible fieldset-legend placement with product use cases; use an
   ARIA group name only when a visible group label is unavailable.

[M3-overview]: https://m3.material.io/components/segmented-buttons/overview
[M3-specs]: https://m3.material.io/components/segmented-buttons/specs
[M3-guidelines]: https://m3.material.io/components/segmented-buttons/guidelines
[M3-accessibility]: https://m3.material.io/components/segmented-buttons/accessibility
[AX-revision]: https://android.googlesource.com/platform/frameworks/support/+/c73a560c5c9ba4ed53a4f6dd5df36dfd16a837e7
[AX-segmented]: https://android.googlesource.com/platform/frameworks/support/+/c73a560c5c9ba4ed53a4f6dd5df36dfd16a837e7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/SegmentedButton.kt
[AX-tokens]: https://android.googlesource.com/platform/frameworks/support/+/c73a560c5c9ba4ed53a4f6dd5df36dfd16a837e7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/OutlinedSegmentedButtonTokens.kt
[MW-revision]: https://github.com/material-components/material-web/tree/c05b4b23485c803f68ff31cde52506cea5cc555a
[HTML-radio]: https://html.spec.whatwg.org/multipage/input.html#radio-button-group
[HTML-checkbox]: https://html.spec.whatwg.org/multipage/input.html#checkbox-state-(type=checkbox)
[WAI-radio]: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
[WAI-checkbox]: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
[WCAG-target]: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
[focus-visible]: https://www.w3.org/TR/selectors-4/#the-focus-visible-pseudo
[media]: https://www.w3.org/TR/mediaqueries-4/#mf-interaction
[forced-colors]: https://www.w3.org/TR/css-color-adjust-1/#forced-colors
[reduced-motion]: https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion
