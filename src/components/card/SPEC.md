# Card Specification

## Status and scope

This is the implementation contract for a future Material 3 Card foundation
and any separately reviewed whole-card action contract. It records baseline
Material 3 behavior and the current, traceable Material 3 Expressive evidence.
It does **not** authorize React, CSS, runtime interaction handling, a link
variant, selection, drag and drop, or animation.

Source classifications used below:

- **canonical**: directly represented by a current Material specification,
  generated token, or public AndroidX API;
- **translated**: authoritative Material data deliberately expressed for the
  web platform;
- **provisional**: official evidence exists but is incomplete, stale, or
  conflicts with another official source; and
- **web-decision**: a library decision required for a safe web API.

## Source hierarchy and pinned provenance

Resolve disagreements in this order:

1. Live Material [Cards overview][M3-overview], [specs][M3-specs],
   [guidelines][M3-guidelines], and [accessibility guidance][M3-accessibility]
   establish purpose and design intent. They were checked on 2026-09-21 and
   are not revision-addressable.
2. AndroidX Material3 revision
   [`b0e5f9fe34e7ad2e8e8619ba3bc010dc4fd45a6b`][AX-revision] is the numeric
   and behavioral source of truth. [Card.kt][AX-card] defines static and
   clickable filled, elevated, and outlined cards. Its generated
   [filled][AX-filled] and [elevated][AX-elevated] token files are `v0_210`;
   [outlined][AX-outlined] is `v0_192`.
3. Material Web revision
   [`c05b4b23485c803f68ff31cde52506cea5cc555a`][MW-revision] is secondary
   baseline web evidence only. Its Card work is a Labs/experimental surface,
   not a current Expressive specification or a public API to copy.
4. The [HTML button definition][HTML-button], [HTML anchor definition][HTML-a],
   [WAI-ARIA Button Pattern][WAI-button], [WAI-ARIA Link Pattern][WAI-link],
   [WCAG 2.2 target-size guidance][WCAG-target], [focus-visible][focus-visible],
   [interaction media features][interaction-media], [forced colors][forced-colors],
   and [reduced motion][reduced-motion] govern web behavior where Material is
   silent.

The repository Color, Typography, Shape, Elevation, Motion, Interaction State,
and Adaptive Layout foundations are the implementation-facing sources. A
component must consume them rather than duplicate their values.

## Purpose, variants, and component boundaries

A card groups related content and actions about one subject. It is a container,
not a generic click target, navigation primitive, selection control, grid
layout, or drag-and-drop handle. Prefer an ordinary Card with explicit inner
buttons and links when a card contains more than one action.

| Public value | Material term | Separation treatment | Status |
| --- | --- | --- | --- |
| `filled` | Filled card | `surfaceContainerHighest`, no shadow | canonical |
| `elevated` | Elevated card | `surfaceContainerLow` with shadow elevation | canonical |
| `outlined` | Outlined card | `surface` with `outlineVariant` boundary | canonical |

There is no `standard`, `tonal`, `primary`, `secondary`, or selected Card
variant in the pinned Material sources. The public default should be `filled`,
which follows AndroidX `Card`; this default is a **web-decision**.

AndroidX provides static and `onClick` overloads, but its `ColumnScope` content
model does not translate to valid arbitrary HTML inside a native button. The
first future web primitive should therefore be static only:

| Future contract | Root | Content model | Interaction |
| --- | --- | --- | --- |
| `Card` | neutral `<div>` | arbitrary flow content, including explicit actions | none |
| `CardAction` | native `<button>` | separately specified constrained content; no nested controls | command only |
| `CardLink` | native `<a>` | separately specified constrained content | navigation only |

`CardAction` and `CardLink` are **not** authorized by this document. They must
not be folded into `Card` through `onClick`, `href`, `as`, `asChild`, or a
generic polymorphic prop. A future action card must decide its valid HTML
content model, name source, target geometry, and prohibition of nested
interactive descendants before implementation. Navigation is a link contract,
not a button action with an `href` convenience prop.

## Anatomy and content rules

A future static Card has only the visual anatomy needed by its variant:

1. a container surface with a semantic shape;
2. an optional outlined-card boundary or elevation shadow outside the shape;
3. consumer-provided content regions (for example media, heading, supporting
   text, and action row); and
4. explicit, independently semantic controls when actions are needed.

Material describes common content regions but does not prescribe a mandatory
header, media slot, icon, title, supporting text, padding value, fixed width,
or fixed height in the pinned token files. They are composition decisions, not
Card component props. Do not make a bare Card an `article`, `section`, or ARIA
`group`: consumers choose those landmarks only when their content warrants
them. A heading remains a real heading chosen by the consumer, rather than a
Card-specific typography prop.

## Size, shape, and Expressive evidence

All three generated variants use `ShapeKeyTokens.CornerMedium`, which maps to
the repository Shape foundation's `MATERIAL_SHAPE_CORNERS.medium` role (12 CSS
reference pixels). This is **canonical** baseline geometry, serialized on the
web with logical corner radii as a **translated** implementation.

The current AndroidX Card API and its generated token files define no regular,
small, medium, or large Card size tiers; no Card-specific padding scale; no
Expressive size-specific shape; no pressed shape; and no non-rectangular
Expressive geometry. Consequently, Card has no `size` or `shape` prop in its
initial proposed API. The repository's expanded Expressive shape vocabulary is
available for later, separately sourced composite patterns, but must not be
presented as a canonical Card feature.

No current authoritative source establishes Card shape morphing. A static card
does not change shape. A future action card must not inherit Button or
IconButton pressed-shape behavior merely because it is clickable.

## Foundation mappings

### Color

Use the Color foundation semantic roles in both light and dark schemes. Android
`contentColorFor` is deliberately translated to the following explicit web
content role, not copied as a Compose API.

| Variant | Enabled container | Enabled content | Disabled container / content | Boundary |
| --- | --- | --- | --- | --- |
| Filled | `surfaceContainerHighest` | `onSurface` | `surfaceVariant` × 0.38 composited over `surfaceContainerHighest` / `onSurface` × 0.38 | none |
| Elevated | `surfaceContainerLow` | `onSurface` | `surface` × 0.38 composited over `surface` / `onSurface` × 0.38 | none |
| Outlined | `surface` | `onSurface` | `surface` / `onSurface` × 0.38 | `outlineVariant`; disabled `outline` × 0.12 composited over `surfaceContainerLow` |

The enabled container roles, generated disabled container roles/opacity, and
outlined boundary roles are **canonical** at the pinned revision. AndroidX
`contentColorFor` resolves both revised container roles to `onSurface`; naming
that role and serializing Android compositing in CSS are **translated**. The
outlined disabled-boundary backdrop is the current AndroidX
`ElevatedCardTokens.ContainerColor` (`surfaceContainerLow`), an implementation
detail retained as provenance rather than a static Card behavior. The disabled
rows remain provenance only: static Card has no disabled state. Do not apply
whole-card opacity, and do not replace semantic roles with a brand palette.

### Elevation and tonal treatment

The generated elevation mapping is below. `dragged` is canonical AndroidX
token data, but no Card drag behavior is authorized; it is retained only as
future provenance.

| Variant | Rest | Hover | Focus | Pressed | Disabled | Dragged* |
| --- | --- | --- | --- | --- | --- |
| Filled | `level0` | `level1` | `level0` | `level0` | `level0` | `level3` |
| Elevated | `level1` | `level2` | `level1` | `level1` | `level1` | `level4` |
| Outlined | `level0` | `level0` | `level0` | `level0` | `level0` | `level3` |

Resolve the visual shadow through `materialElevation`; its CSS `box-shadow`
serialization is an existing **translated** web renderer. Elevation never
implies `z-index`, positioning, DOM stacking, or a portal. AndroidX applies
tonal elevation only when callers customize a surface color and its own Surface
rules allow it. The initial semantic role mappings above must not add an
unreviewed tonal overlay; tonal color treatment and shadow elevation remain
separate concerns.

### Typography

Card has no canonical type role. Consumer text uses the Typography foundation
according to content hierarchy (for example a title and supporting text), not
an invented Card default. Card must not bundle, load, or select fonts.

### Interaction State and motion

A static Card has no hover, focus-visible, pressed, disabled, or state-layer
behavior. For a future native action Card, use `materialStates` with the
existing precedence: disabled, dragged, pressed, focus-visible, hover,
enabled. State layers use the current content role and foundation opacity;
hover is gated to hover-capable fine pointers. The accessible focus indication
is external to any clipped visual layer.

AndroidX animates elevation between interaction targets internally, but the
pinned Card sources do not expose a component-specific Expressive motion token
or a web-ready timing definition. Map intent to `materialMotion` only after a
reviewed renderer exists. Until then, future web state changes use immediate
elevation/visual updates; they must not invent a spring, cubic-bezier, ripple
runtime, or shape transition. Reduced motion removes non-essential effects
while retaining the final state.

### Adaptive Layout

Material supplies no Card-internal viewport breakpoint, responsive size tier,
or automatic layout transformation in the pinned sources. A parent layout may
use the Adaptive Layout foundation to choose columns, span, visibility, and
content arrangement. Card itself must remain size- and viewport-agnostic, and
must reflow naturally at browser zoom rather than use transforms to preserve a
fixed silhouette.

## Interaction and state matrix

This table describes a possible future `CardAction`, not the static `Card`
contract. It preserves AndroidX elevation targets without importing Android
interaction types or treating `:active` as a persistent selection state.

| State | Filled | Elevated | Outlined | State layer / focus | Motion |
| --- | --- | --- | --- | --- | --- |
| Enabled | level0 | level1 | level0 | none | none |
| Hover | level1 | level2 | level0 | content × hover | immediate fallback |
| Focus-visible | level0 | level1 | level0 | content × focus + external ring | immediate fallback |
| Pressed | level0 | level1 | level0 | content × pressed | immediate fallback |
| Disabled | level0 | level1 | level0 | none; native disabled | snap |
| Dragged* | level3 | level4 | level3 | separate DnD contract only | unspecified |

There is no canonical checked, selected, toggle, expanded, or error Card
state. A selectable collection must use an actual checkbox, radio, listbox, or
other separately specified selection control and semantics; do not place
`aria-pressed`, `aria-selected`, or `aria-checked` on Card by default.

## Intended future React contracts

The initial implementation should be deliberately small and SSR-safe:

```tsx
<Card variant="filled" className="product-card">
  <img alt="" src={imageUrl} />
  <h2>Product name</h2>
  <p>Supporting information.</p>
  <Button>View details</Button>
</Card>
```

```ts
type CardVariant = 'filled' | 'elevated' | 'outlined';

type CardProps = ComponentPropsWithoutRef<'div'> & {
  variant?: CardVariant;
};
```

`Card` defaults to `variant="filled"`, forwards safe `<div>` props and a
`HTMLDivElement` ref, and has no `disabled`, `onClick`, `href`, `size`,
`selected`, or `elevation` override. A `div` permits the Card's intended rich
content and inner explicit controls without producing invalid nested native
interactive elements. The `div` root, default, and deliberately absent props
are **web-decisions**.

If whole-card actions are later needed, separate contracts are required:

```tsx
<CardAction variant="elevated" type="button" onClick={openDetails}>
  {/* constrained, non-interactive content only */}
</CardAction>
```

```tsx
<CardLink variant="outlined" href="/products/42">
  {/* constrained, non-interactive content only */}
</CardLink>
```

These examples are architecture proposals, not implementation authorization.
`CardAction` would default `type="button"`, use native Enter and Space
activation, and use native `disabled`; `CardLink` would use an anchor and never
fake disabled navigation. Neither should be polymorphic or use `asChild`.

## Accessibility and web-platform contract

- A static Card adds no interactive role, focusability, accessible name, or
  keyboard handler. Its content owns its semantics. Use a suitable container
  landmark only when the content independently warrants it.
- An action Card is a single native `<button>` for a command, not a `div` with
  `role="button"`. Its accessible name may come from valid text content or an
  explicit `aria-label`/`aria-labelledby`; implementation must reject an empty
  name. It may not contain links, buttons, inputs, or other interactive
  descendants.
- A navigation Card is a native `<a href>`, not a button with `href`. It also
  may not contain nested interactive controls. If a card has multiple actions,
  retain static Card and expose each action separately.
- Native buttons provide Tab focus, Enter/Space activation, and disabled
  semantics. Do not duplicate them with custom keyboard handlers. Native
  `disabled`, not `aria-disabled` alone, is required for a disabled command.
- WCAG 2.2 AA's 24 by 24 CSS-pixel target is the baseline for an action card;
  Material's touch-facing 48dp expectation is a layout decision that must be
  met without overlapping adjacent targets. Static Card has no target.
- Use `:focus-visible` for an obvious indicator outside clipped visual
  surfaces. Do not remove the user-agent outline without a replacement.
- Use logical properties and inherited `dir`; content direction and image/icon
  mirroring remain consumer decisions. Do not resize Card at zoom or at an RTL
  boundary.
- In `forced-colors: active`, permit user-agent color adjustment, preserve a
  discernible boundary and focus indicator with system colors, and suppress
  translucent state layers where needed. Do not force brand colors.
- Mouse, touch, pen, and keyboard must work. Hover is supplemental and gated
  by capability; touch and pen rely on native active feedback. Reduced-motion
  preferences do not remove focus or state feedback.

## Future Storybook plan

Create colocated stories only when implementation begins:

1. filled, elevated, and outlined Cards in light and dark semantic schemes;
2. a content-composition story with media, heading, supporting text, and
   explicit inner actions, showing that Card has no fixed anatomy;
3. shape, boundary, and elevation comparison, including an annotation that
   elevation does not establish DOM stacking;
4. zoom/reflow and RTL examples using logical layout properties;
5. a static-card accessibility story proving it is not in the tab order;
6. forced-colors and reduced-motion media-emulation stories; and
7. only after separately specifying it, an action-card story for enabled,
   hover-capable, focus-visible, pressed, disabled, keyboard, and minimum
   target behavior.

## Future test plan

Deterministic unit and Playwright-backed Storybook interaction tests must
cover:

- the three variant mappings, `medium` shape role, outlined boundary, and each
  canonical elevation target; source-derived definitions stay immutable;
- `<div>` root, ref forwarding, safe prop/className/style forwarding, no
  interactive role, no focusability, no automatic heading/landmark, and SSR
  rendering for static Card;
- light/dark semantic color consumption, browser zoom/reflow, RTL logical
  layout, forced-colors fallback, and reduced-motion policy;
- proof that Card does not expose selected/toggle/disabled/action semantics;
  and
- if and only if CardAction/CardLink is separately approved: native element
  semantics, valid accessible name, disabled behavior, Enter/Space activation,
  pointer states, focus indicator, nested-interactive-content rejection,
  target size, elevation transitions, and SSR/hydration.

Pseudo-class, keyboard, forced-colors, zoom, and media-query behavior belong
in browser-backed tests. Token mapping, public prop contracts, provenance, and
immutability belong in deterministic unit tests.

## Open questions and implementation gates

1. The live Material site is visual and revisionless; it currently offers no
   pinned web token source that supersedes AndroidX for Card.
2. AndroidX documentation mentions a selectable Card while the current public
   Card overloads are static/clickable. Do not infer a web selectable Card API
   from that wording; require a source and semantic contract first.
3. AndroidX's clickable `ColumnScope` allows content composition that native
   HTML buttons cannot safely carry. A whole-card action needs a constrained
   content model or another reviewed markup architecture.
4. No authoritative Card-specific Expressive size, shape transition, motion,
   CSS token, or adaptive-breakpoint guidance was found at the pinned sources.
   Treat its absence as a constraint, not permission to copy other components.
5. AndroidX's `dragged` elevation is token data, not a drag-and-drop
   specification. Any web DnD contract needs pointer/keyboard/ARIA and drop
   semantics before it can use that value.

[M3-overview]: https://m3.material.io/components/cards/overview
[M3-specs]: https://m3.material.io/components/cards/specs
[M3-guidelines]: https://m3.material.io/components/cards/guidelines
[M3-accessibility]: https://m3.material.io/components/cards/accessibility
[AX-revision]: https://android.googlesource.com/platform/frameworks/support/+/b0e5f9fe34e7ad2e8e8619ba3bc010dc4fd45a6b
[AX-card]: https://android.googlesource.com/platform/frameworks/support/+/b0e5f9fe34e7ad2e8e8619ba3bc010dc4fd45a6b/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Card.kt
[AX-filled]: https://android.googlesource.com/platform/frameworks/support/+/b0e5f9fe34e7ad2e8e8619ba3bc010dc4fd45a6b/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledCardTokens.kt
[AX-elevated]: https://android.googlesource.com/platform/frameworks/support/+/b0e5f9fe34e7ad2e8e8619ba3bc010dc4fd45a6b/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ElevatedCardTokens.kt
[AX-outlined]: https://android.googlesource.com/platform/frameworks/support/+/b0e5f9fe34e7ad2e8e8619ba3bc010dc4fd45a6b/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/OutlinedCardTokens.kt
[MW-revision]: https://github.com/material-components/material-web/tree/c05b4b23485c803f68ff31cde52506cea5cc555a/labs/card
[HTML-button]: https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element
[HTML-a]: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element
[WAI-button]: https://www.w3.org/WAI/ARIA/apg/patterns/button/
[WAI-link]: https://www.w3.org/WAI/ARIA/apg/patterns/link/
[WCAG-target]: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
[focus-visible]: https://www.w3.org/TR/selectors-4/#the-focus-visible-pseudo
[interaction-media]: https://www.w3.org/TR/mediaqueries-4/#mf-interaction
[forced-colors]: https://www.w3.org/TR/css-color-adjust-1/#forced-colors
[reduced-motion]: https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion
