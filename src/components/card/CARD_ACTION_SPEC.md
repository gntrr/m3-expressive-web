# CardAction Specification

## Status and scope

This is the implementation contract for a future Material 3 whole-card
**command** surface. It translates AndroidX clickable Card behavior to an
accessible native web button without altering the static `Card` contract. It
does **not** authorize React, CSS, `CardLink`, selection, drag and drop,
polymorphism, ripple, or an animation runtime.

Source classifications used below:

- **canonical**: directly represented by a current Material specification,
  generated token, or public AndroidX API;
- **translated**: authoritative Material data deliberately expressed for the
  web platform;
- **provisional**: official evidence exists but is incomplete or internally
  inconsistent; and
- **web-decision**: a library choice required for a safe web API.

## Source hierarchy and current provenance

Resolve disagreements in this order:

1. Live Material [Cards overview][M3-overview], [specs][M3-specs],
   [guidelines][M3-guidelines], and [accessibility guidance][M3-accessibility]
   establish component purpose. They were checked on 2026-09-21 and are not
   revision-addressable.
2. AndroidX Material3 mainline revision
   [`b0e5f9fe34e7ad2e8e8619ba3bc010dc4fd45a6b`][AX-revision] is the current
   numeric and behavioral source. [Card.kt][AX-card] supplies static and
   clickable `Card`, `ElevatedCard`, and `OutlinedCard` overloads. Generated
   [filled][AX-filled] and [elevated][AX-elevated] files are `v0_210`; the
   [outlined][AX-outlined] file is `v0_192`.
3. Material Web revision
   [`c05b4b23485c803f68ff31cde52506cea5cc555a`][MW-revision] is secondary
   baseline web translation evidence only. Its Card work is Labs/experimental,
   not a current Expressive public API to copy.
4. The [HTML button definition][HTML-button], [accessible-name computation][ACC-name],
   [WAI-ARIA Button Pattern][WAI-button], [WCAG 2.2 target-size guidance][WCAG-target],
   [focus-visible][focus-visible], [interaction media features][interaction-media],
   [forced colors][forced-colors], and [reduced motion][reduced-motion] govern
   web behavior where Material is silent.

The repository Color, Shape, Elevation, Motion, and Interaction State
foundations are the implementation-facing source. Future code must consume
them rather than copy their values.

### Shared provenance and implementation boundary

The static [Card specification](./SPEC.md) is reconciled to this same AndroidX
revision: filled uses `surfaceContainerHighest`, elevated uses
`surfaceContainerLow`, and outlined uses `surface`. Card and future CardAction
therefore share one semantic color and token provenance revision.

That does not justify shared root CSS. Static Card is a non-interactive `<div>`
while CardAction is a native `<button>` with disabled, state-layer, focus, and
elevation-state behavior. A future shared semantic mapping may reduce repeated
provenance data, but each component must retain a separate renderer and private
CSS aliases so interaction behavior cannot leak into static Card.

## Purpose and separate component boundary

`CardAction` represents one whole-card command about one subject. It is not a
container with several actions, a navigation link, a selectable item, or a
generic clickable `Card`.

| Contract | Root | Use | Status |
| --- | --- | --- | --- |
| `Card` | `<div>` | rich static content and independently semantic actions | existing |
| `CardAction` | `<button>` | one command | future, specified here |
| `CardLink` | `<a href>` | navigation | future, out of scope |

Do not add `onClick`, `href`, `as`, `asChild`, or generic polymorphism to
`Card`. Do not add `href` to CardAction. If a subject needs a favorite button,
overflow menu, link, checkbox, or secondary command, compose static `Card`
with explicit controls instead of nesting them inside CardAction.

## Native semantics and content model

The future root is one native `<button>`, with `type="button"` by default. It
may forward explicit `type="submit"` or `type="reset"`, standard safe native
button props, `disabled`, and an `HTMLButtonElement` ref. It needs no
`"use client"` directive and must render and hydrate under React SSR / Next.js
without layout measurement or browser-only state.

Native `<button>` permits **phrasing content**, but prohibits interactive
content. Material's Compose `ColumnScope` is Android-specific and cannot be
ported as arbitrary HTML children.

| Allowed child content | Not permitted child content |
| --- | --- |
| text nodes; `<span>`, `<strong>`, `<em>` and other phrasing text; `<img>`; SVG/decorative icons; `<br>` | `<button>`, `<a>`, `<input>`, `<select>`, `<textarea>`, `<label>`, `<details>`, content with a positive `tabindex`, custom interactive widgets, or any nested tabbable control |
| visually block-like spans styled by the consumer | `<div>`, `<p>`, headings (`<h1>`–`<h6>`), lists, sections, articles, tables, or other non-phrasing flow content |

The right-hand column is invalid inside a native button even if a browser
renders it. “Heading-like” text must be a styled `<span>`, not a heading;
supporting text must likewise be phrasing content. This is a **web-decision**
that preserves valid HTML and native keyboard semantics, at the cost of the
rich document structure static Card supports.

`children` must remain `ReactNode` because TypeScript cannot reliably prove the
HTML category of arbitrary React elements. The public documentation, tests,
and future development diagnostics must enforce this contract. A development
warning may catch direct host-element violations, but cannot certify fragments
or opaque custom components and must never claim otherwise.

## Accessible name and icon policy

CardAction obtains its name in standard accessible-name precedence:

1. non-empty `aria-labelledby` references, if provided;
2. non-empty `aria-label`, if provided; then
3. accessible descendant text and non-decorative image alternative text.

The future prop contract should prohibit supplying both ARIA sources, a
**web-decision** that avoids author ambiguity despite the platform precedence.
Visible descendant text is the preferred name source and does **not** require
an ARIA prop. `title` is supplementary only and never satisfies a missing-name
contract. Consumers must supply an explicit name for an image-only CardAction;
do not rely on a decorative image, filename, or SVG `<title>` as its command
name. Use `alt=""` or `aria-hidden="true"` for decorative media/icons so they
do not duplicate the command's name.

Do not wrap all children in `aria-hidden`: unlike IconButton, CardAction often
derives its accessible name from visible text. A future implementation should
not require `aria-label` when valid visible text names the command, and should
provide a development diagnostic only when an explicit blank ARIA name is
supplied or when a known image-only child lacks an explicit name.

## Variants, color, and disabled treatment

Current AndroidX exposes the same three clickable variants as static Card.

| Public value | Enabled container | Enabled content | Status |
| --- | --- | --- | --- |
| `filled` | `surfaceContainerHighest` | `onSurface` | canonical container; content is translated from Android `contentColorFor` |
| `elevated` | `surfaceContainerLow` | `onSurface` | canonical container; content is translated from Android `contentColorFor` |
| `outlined` | `surface` | `onSurface` | canonical container; content is translated from Android `contentColorFor` |

The React default should be `filled`, following AndroidX `Card`; the public
default spelling is a **web-decision**. There is no primary, tonal, selected,
or Expressive-only CardAction variant.

Disabled applies only to CardAction and must use native `disabled`, never
`aria-disabled` alone or whole-control opacity. Current AndroidX resolves its
disabled colors as follows; source color/opacity inputs are **canonical** and
CSS compositing is **translated**.

| Variant | Disabled container | Disabled content | Disabled boundary |
| --- | --- | --- | --- |
| Filled | `surfaceVariant` × 0.38 composited over `surfaceContainerHighest` | `onSurface` × 0.38 | none |
| Elevated | `surface` × 0.38 composited over `surface` | `onSurface` × 0.38 | none |
| Outlined | `surface` | `onSurface` × 0.38 | `outline` × 0.12 composited over `surfaceContainerLow` |

The outlined disabled compositing backdrop is an AndroidX implementation
detail that currently references the elevated-card container rather than the
outlined container. Preserve this fact in provenance, but treat the exact web
compositing result as **provisional** until it receives a focused accessibility
review in light, dark, and forced-color modes.

## Shape, state layers, focus, and elevation

All variants use the canonical `MATERIAL_SHAPE_CORNERS.medium` rest shape.
AndroidX defines no Card pressed, hover, focus, selected, or Expressive
shape-morph target. Shape is constant in every state; do not import Button or
IconButton shape behavior.

Use `materialStates` and `resolveMaterialStateComposition`; persistent
selection is not an axis. State layers use the active content color once, with
the foundation's hover (H), focus (F), and pressed (P) opacity. Do not stack
opacities. Hover is available only under `(hover: hover) and (pointer: fine)`;
touch and pen retain native active feedback without sticky hover.

| Interaction state | Filled | Elevated | Outlined | Boundary / state layer |
| --- | --- | --- | --- | --- |
| Enabled | level0 | level1 | level0 | default outline `outlineVariant`; no layer |
| Hover | level1 | level2 | level0 | H; outlined boundary remains `outlineVariant` |
| Focus-visible | level0 | level1 | level0 | F + external focus indicator; outlined boundary `onSurface` |
| Pressed | level0 | level1 | level0 | P; outlined boundary remains `outlineVariant` |
| Disabled | level0 | level1 | level0 | no state layer; disabled boundary mapping above |

Filled and elevated values are generated public defaults. For outlined Card,
the raw generated `HoverContainerElevation` is level1, but public
`CardDefaults.outlinedCardElevation()` passes its level0 default for hover,
focus, and pressed. The table follows the public default behavior, while the
raw-token disagreement remains **provisional** source evidence. `dragged`
(filled/outlined level3, elevated level4) is not part of CardAction.

Elevation controls visual shadow and Android tonal treatment, not `z-index`,
stacking context, DOM order, positioning, or portals. When the semantic
container already names a surface-container role, do not add an unreviewed
tonal overlay on the web.

`:focus-visible` must produce an obvious indicator outside any clipped visual
state-layer wrapper. AndroidX's filled/elevated token files contain a
`FocusIndicatorColor` of `secondary`; outlined contains `FocusOutlineColor` of
`onSurface`. The public AndroidX Card renderer does not expose an equivalent
web focus-ring recipe. A future 2 CSS-pixel external ring using these roles is
a **translated, provisional** mapping and must be contrast-tested before code
lands; it must never rely on the translucent focus state layer alone.

## Motion and platform behavior

AndroidX animates its elevation internally, but no current Card-specific
Expressive motion token or reviewed spring-to-web renderer exists. Associate
the intended effects with `materialMotion`, then use immediate state/elevation
changes until a renderer is reviewed. Do not invent springs, cubic-bezier
curves, ripple, or shape animation. Reduced motion retains final state feedback
and suppresses any future non-essential transition.

The future root needs a focused native-button reset (`appearance`, inherited
font, normal casing, `text-align: start`) but no default typography role,
content padding, fixed size, aspect ratio, or automatic full-width treatment.
It may use `inline-size: fit-content` / normal intrinsic sizing plus
`max-inline-size: 100%`; consumers choose layout width. Phrasing descendants
may wrap naturally, and consumer styling may make them block-like. Use logical
properties, inherit `dir`, and do not mirror arbitrary consumer icons. Browser
zoom must reflow text rather than transform the CardAction.

Use an inner visual wrapper, if needed, to clip the state layer to the medium
shape. Keep the root's elevation shadow and external focus indicator outside
that clip. In `forced-colors: active`, retain native disabled behavior and a
discernible system-color boundary/focus indicator, permit user-agent color
adjustment, and suppress translucent state layers where necessary. Do not use
`forced-color-adjust: none` without an approved equivalent.

## Intended future React API

The first component must remain a narrow, SSR-safe native-button contract:

```tsx
<CardAction variant="elevated" onClick={openDetails}>
  <img alt="" src={productImage} />
  <span className="product-title">Product name</span>
  <span className="product-supporting">Supporting text</span>
</CardAction>
```

```ts
type CardActionVariant = 'filled' | 'elevated' | 'outlined';

type CardActionProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'aria-checked' | 'aria-pressed' | 'aria-selected' | 'children'
> & {
  children: ReactNode;
  ref?: Ref<HTMLButtonElement>;
  variant?: CardActionVariant;
};
```

It defaults `variant="filled"` and `type="button"`, and forwards safe native
button props. It exposes no `href`, `as`, `asChild`, `selected`, `checked`,
`pressed`, `size`, `shape`, or slot API. A consumer may use a visible text
child, `aria-label`, or `aria-labelledby` to name the command under the policy
above. Native Enter and Space activation, form submit/reset behavior, and
disabled behavior come from `<button>`; no duplicate key handlers are needed.

## Future Storybook plan

Create colocated stories only after implementation begins:

1. filled, elevated, and outlined variants in light and dark schemes;
2. valid rich phrasing-only composition with decorative image/icon, text spans,
   long wrapping text, and no built-in CardAction padding claim;
3. enabled, hover-capable, keyboard focus-visible, pressed, and disabled
   states with current elevation annotations;
4. explicit submit/reset and native keyboard activation examples;
5. RTL, browser zoom/reflow, forced-colors, and reduced-motion emulation;
6. focus-indicator and state-layer clipping demonstrations; and
7. documentation-only invalid examples—nested controls, headings, paragraphs,
   and image-only content without an explicit name—rather than rendering them
   as approved interactive stories.

## Future test plan

Unit and browser interaction tests must cover:

- one native button; `type="button"` default; explicit submit/reset; ref and
  safe native-prop forwarding; no link/polymorphic/selected APIs; and SSR
  rendering without a client boundary;
- native Enter and Space activation, disabled suppression, Tab focus, and a
  visible `:focus-visible` indicator;
- accessible name from valid visible text, `aria-label`, and `aria-labelledby`;
  ARIA precedence/mutual-exclusion policy; blank label diagnostics; decorative
  image/icon handling; and image-only explicit-name requirement;
- all three variants; medium rest shape; current semantic colors, disabled
  compositing, outlined state boundary, H/F/P state layers, and elevation
  targets; definitions remain immutable;
- hover capability gating, no opacity stacking, no shape morph, no implied
  z-index, RTL logical CSS, zoom/reflow, forced-colors, and reduced-motion;
  and
- valid phrasing-child examples plus documented/reviewable invalid nested
  control and non-phrasing-content cases. Any development validator must prove
  only what it can inspect and never replace the public content contract.

Pseudo-classes, native keyboard behavior, forced-colors, and focus indication
belong in Playwright-backed Storybook tests. Token mapping, prop boundaries,
SSR markup, accessible-name policy, and diagnostics belong in deterministic
unit tests.

## Open questions and implementation gates

1. Current AndroidX contains a raw outlined hover elevation token of level1
   while its public default factory uses level0. This document follows the
   public factory; re-check it when implementation begins.
2. Native buttons cannot carry the rich heading/paragraph/action anatomy often
   shown in visual Card examples. A future API must not relax valid HTML merely
   to reproduce that layout. Use static Card for rich semantic content.
3. No reliable React type can verify descendant HTML categories across custom
   components. Decide the scope of a development-only warning without claiming
   complete runtime enforcement.
4. The current AndroidX focus token evidence lacks a reviewed web focus-ring
   recipe. Contrast-test a concrete external ring before implementation.
5. The outlined disabled border's elevated-surface compositing backdrop is an
   AndroidX detail requiring browser/forced-color review before CSS translation.
6. No official Card-specific Expressive shape, motion, responsive-size, or
   adaptive-layout behavior is present in the pinned source. Its absence is a
   constraint, not permission to borrow behavior from other components.

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
[ACC-name]: https://www.w3.org/TR/accname-1.2/
[WAI-button]: https://www.w3.org/WAI/ARIA/apg/patterns/button/
[WCAG-target]: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
[focus-visible]: https://www.w3.org/TR/selectors-4/#the-focus-visible-pseudo
[interaction-media]: https://www.w3.org/TR/mediaqueries-4/#mf-interaction
[forced-colors]: https://www.w3.org/TR/css-color-adjust-1/#forced-colors
[reduced-motion]: https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion
