# CardLink Specification

## Status and scope

This is the implementation contract for a future Material 3 whole-card
navigation surface. It translates reconciled AndroidX clickable Card visual
treatment to a native web hyperlink without changing static Card or
command-oriented CardAction. It does not authorize React, CSS, disabled links,
selection, drag and drop, polymorphism, router interception, ripple, or an
animation runtime.

Classifications:

- canonical: a current Material specification, generated token, AndroidX API,
  or web-platform standard directly establishes the rule;
- translated: authoritative source data deliberately expressed for the web;
- provisional: official evidence is incomplete or inconsistent; and
- web-decision: an accessible library choice where Material is silent.

## Source hierarchy and provenance

Resolve disagreements in this order:

1. Live Material [Cards overview][M3-overview], [specs][M3-specs],
   [guidelines][M3-guidelines], and [accessibility guidance][M3-accessibility]
   establish Card intent. They were checked on 2026-09-21 and are not
   revision-addressable.
2. AndroidX Material3 revision
   [b0e5f9fe34e7ad2e8e8619ba3bc010dc4fd45a6b][AX-revision] is the pinned
   visual-token source. [Card.kt][AX-card] supplies static and clickable Card
   overloads; filled/elevated generated files are v0_210, outlined v0_192.
3. The [HTML a element][HTML-anchor], [HTML link navigation][HTML-links],
   [accessible-name algorithm][ACC-name], [WCAG link purpose][WCAG-link],
   [focus-visible][focus-visible], [forced colors][forced-colors],
   [reduced motion][reduced-motion], and [visited privacy guidance][visited]
   govern platform behavior where Material is silent.
4. Material Web revision
   [c05b4b23485c803f68ff31cde52506cea5cc555a][MW-revision] is secondary
   baseline evidence only; its Labs Card does not establish an Expressive
   anchor API.

The existing Color, Shape, Elevation, Motion, and Interaction State foundations
are implementation-facing sources. Component code must consume them rather than
copy values.

### Material boundary and source gap

Material and AndroidX provide visual Cards and clickable command Cards, but no
navigation-specific CardLink, href, anchor content model, or visited token.
Android click semantics cannot establish browser link behavior. CardLink is
therefore a web-decision using reconciled Card provenance: filled
surfaceContainerHighest, elevated surfaceContainerLow, and outlined surface.
It is not a canonical standalone Material or Expressive component.

## Separate component boundary

| Contract | Root | Purpose | Status |
| --- | --- | --- | --- |
| Card | <div> | Rich static container; can contain independent actions | existing |
| CardAction | <button> | One whole-card command | existing |
| CardLink | <a href> | One whole-card destination | future |

Do not add href to Card or CardAction, an onClick-only navigation mode, as,
asChild, router primitives, or generic polymorphism. Cards with multiple
destinations or controls must compose static Card with explicit descendants.

## Native semantics and browser behavior

The future root is exactly one native <a href>. href is required in the
TypeScript contract and must be non-empty in a development diagnostic. It
forwards an HTMLAnchorElement ref and safe native anchor props such as target,
rel, download, hreflang, type, referrerPolicy, and native event props. It is
SSR/Next.js-safe and needs no client directive, measurement, router, or
browser-only state.

| Behavior | Contract | Classification |
| --- | --- | --- |
| Enter | Native activation follows href. | canonical web |
| Space | Do not add a handler: a link is not a button. | canonical web |
| Ctrl/Cmd-click, Shift-click, middle-click | Preserve browser-selected navigation context. | canonical web |
| Context menu / copy address | Preserve native browser behavior. | canonical web |
| target / rel | Forward unchanged. For target=_blank, recommend explicit rel=noopener; do not rewrite author policy. | canonical attributes; web-decision guidance |
| download | Forward unchanged; browser eligibility stays native. | canonical web |
| onClick | May forward normally, but navigation must never depend on it or be intercepted. | web-decision |

No disabled, aria-disabled, pressed, selected, checked, or aria-pressed prop
exists. Anchors have no native disabled state. If a destination is unavailable,
omit CardLink, render static Card, or choose a separate reviewed composition.
Do not emulate disablement with pointer-events, preventDefault, tabIndex, or
custom keyboard code.

## Content model and accessible name

An anchor with href is interactive and has a transparent content model. It may
wrap flow content valid in its parent context: headings, paragraphs, images,
lists, tables, sections, and layout wrappers are all valid. It must have no
interactive descendant, no nested anchor, and no descendant with a tabindex
attribute. tabindex=-1 is invalid too. These are canonical web constraints.

| Allowed, subject to parent context | Invalid descendants |
| --- | --- |
| Text, headings, paragraphs, div/section, images, SVG, lists, tables, ordinary flow content | anchors, buttons, form controls, labels, details/summary, audio/video with controls, embedded/custom widgets, or any tabindex, contenteditable, tabbable, or interactive descendant |

Unlike CardAction, rich document structure remains valid and must retain its
native semantics. children must remain ReactNode, as Types cannot prove HTML
categories through fragments or custom components. A future development warning
may flag reliably inspectable host descendants but cannot certify opaque custom
components.

The native hyperlink is labeled by its contents. Visible, descriptive content
is the preferred name source and should identify the destination or result,
supporting WCAG link purpose. aria-label and aria-labelledby are intentional
overrides. The type should allow zero or one explicit ARIA source, never both
(web-decision); implementation should reject two sources and blank supplied
values in development. title is supplemental, never the sole name strategy.

An image-only CardLink needs meaningful image alt or an explicit ARIA name.
Explicit aria-label or aria-labelledby is recommended where media alone does
not fully convey destination. Decorative media/icons need alt="" or
aria-hidden=true. Do not automatically append an external-link icon or
screen-reader announcement; visible text is preferred when a new context or
external destination needs notice.

## Variants, color, shape, and elevation

The initial API has the same reconciled variants as Card and CardAction. No
primary, tonal, selected, or Expressive-only link variant exists.

| Value | Enabled container | Enabled content | Boundary | Classification |
| --- | --- | --- | --- | --- |
| filled | surfaceContainerHighest | onSurface | none | canonical roles; translated renderer |
| elevated | surfaceContainerLow | onSurface | none | canonical roles; translated renderer |
| outlined | surface | onSurface | outlineVariant, 1 CSS px | canonical color/width; translated renderer |

variant=filled is the future default after AndroidX Card; its public prop
spelling is a web-decision. Every variant uses MATERIAL_SHAPE_CORNERS.medium;
there is no size, shape, pressed-shape, or morph API. Consume the Shape
foundation semantic variable, not a raw value.

The anchor translation follows public AndroidX clickable-Card defaults, not the
raw outlined hover-token disagreement:

| State | Filled | Elevated | Outlined | Classification |
| --- | --- | --- | --- | --- |
| Rest | level0 | level1 | level0 | translated |
| Fine-pointer hover | level1 | level2 | level0 | translated |
| Focus-visible | level0 | level1 | level0 | translated |
| Active / pressed | level0 | level1 | level0 | translated |

Elevation controls visual shadow/source tonal treatment only. It never implies
z-index, stacking context, DOM order, portals, position, or disablement.

## Interaction, focus, and visited state

There is no selected/toggle mode. Use materialStates and
resolveMaterialStateComposition; active content is the state-layer source and
H/F/P opacities never stack.

| State | Layer / boundary | Shape / elevation | Classification |
| --- | --- | --- | --- |
| Rest | none; outlined outlineVariant | medium; rest level | translated |
| Hover | content × H only at (hover: hover) and (pointer: fine) | unchanged; hover level | translated |
| Focus-visible | content × F plus external 2 CSS-px ring; filled/elevated use secondary, outlined onSurface | unchanged; focus level | translated/provisional ring |
| Active | content × P | unchanged; active level | translated |
| Visited | no component override | unchanged | web-decision |

:visited is a browser history state, but Material has no Card visited token. The
first renderer must not declare a CardLink :visited mapping, derive state from
history, or test history. This avoids invented semantics and browser privacy
restrictions. A later reviewed treatment may use only browser-permitted
properties; it must not change geometry, state layers, or elevation.

The focus ring is on the anchor root, outside an inner clipped visual/state
layer. The CardAction mapping is a provisional translated recipe, not an
Android renderer: 2 CSS pixels, secondary for filled/elevated and onSurface for
outlined. Contrast needs review in light, dark, zoomed, and forced-color
conditions before implementation.

## Motion, layout, and platform translation

No Card-specific Expressive motion token or reviewed spring-to-web renderer
exists. Associate intended effects with materialMotion, then make layer and
elevation changes immediate. Do not add ripple, spring/cubic-bezier substitute,
transition, or shape animation. Reduced motion preserves direct final-state
feedback and suppresses any future non-essential effect.

The future renderer has inherited typography, normal casing, text-align:start,
logical properties, and natural wrapping. It has no default content padding,
fixed width/height, full-width mode, aspect ratio, typography role, breakpoint,
or Adaptive Layout behavior. inline-size:fit-content plus max-inline-size:100%
is a web-decision that preserves intrinsic sizing and browser-zoom reflow while
leaving layout to the parent.

Do not mirror arbitrary consumer icons in RTL. Preserve native anchor semantics:
never apply role=button, remove href, or replace navigation with JavaScript. A
future visual text-decoration reset is not authorized until it preserves clear
link affordance through semantics, focus, interaction feedback, and non-color
cues. In forced colors, permit UA adjustment, suppress translucent layers as
needed, retain system-color boundary/focus indication, and never set
forced-color-adjust:none.

## Intended future React API

    <CardLink href="/products/42" variant="elevated">
      <img alt="Copper travel mug" src={productImage} />
      <section>
        <h2>Copper travel mug</h2>
        <p>View product details.</p>
      </section>
    </CardLink>

    type CardLinkVariant = 'filled' | 'elevated' | 'outlined';

    type CardLinkExplicitName =
      | { 'aria-label'?: never; 'aria-labelledby'?: never }
      | { 'aria-label': string; 'aria-labelledby'?: never }
      | { 'aria-label'?: never; 'aria-labelledby': string };

    type CardLinkProps = CardLinkExplicitName & Omit<
      ComponentPropsWithoutRef<'a'>,
      | 'aria-label'
      | 'aria-labelledby'
      | 'aria-pressed'
      | 'aria-selected'
      | 'children'
      | 'href'
    > & {
      children: ReactNode;
      href: string;
      ref?: Ref<HTMLAnchorElement>;
      variant?: CardLinkVariant;
    };

No disabled, selected/pressed props, size, shape, as, asChild, or router
adapter is exposed. Parent content models still apply: an anchor cannot be a
direct child of ul without the required li.

## Future Storybook plan

Create colocated stories only when implementation begins:

1. filled, elevated, and outlined internal links in light/dark schemes;
2. native external target/rel and download links, with modifier-click,
   middle-click, context-menu, and new-tab behavior documented, not intercepted;
3. valid rich flow content: image, heading, paragraph, list, and section;
4. fine-pointer hover, keyboard focus-visible, and active states with elevation
   annotations; native Enter, plus proof that Space is not button behavior;
5. RTL, long-content/browser-zoom reflow, forced-colors, and reduced-motion;
   and
6. documentation-only invalid nested anchor/control/tabindex examples.

## Future test plan

Unit and Playwright-backed Storybook coverage must include:

- native anchor and required href; anchor ref, class/style, target, rel,
  download, referrerPolicy, and SSR forwarding;
- visible descendant, aria-label, and aria-labelledby names; conflict and blank
  diagnostics; descriptive purpose; image-only and decorative content;
- native Enter behavior and absence of a Space handler, prevented default, or
  modifier/middle-click interception;
- all variants; medium shape; semantic colors/boundary; H/F/P layers; and the
  rest/hover/focus/active elevation matrix;
- no disabled, selected, pressed, aria-pressed, aria-selected, or component
  :visited behavior; and
- valid rich flow content, inspectable invalid-descendant diagnostics, focus,
  forced-colors, RTL, zoom/reflow, and reduced motion.

Visited history must not be asserted in automated component tests because
browser privacy protections make it non-deterministic.

## Open questions and implementation gates

1. Material has no CardLink, visited treatment, or external-destination cue.
   Keep these absent until a primary source or reviewed web decision establishes
   them.
2. The CardAction-derived focus ring is provisional; contrast-test it before
   CSS implementation.
3. HTML permits broad flow content inside a link, but parent contexts still
   constrain complete markup trees; documentation must show valid trees.
4. Runtime cannot prove custom-component descendants; diagnostics must remain
   narrow and never replace the public content contract.
5. target=_blank security defaults evolve. Recommend explicit noopener, but
   forward author rel values unchanged.
6. Raw outlined hover tokens say level1 while public AndroidX defaults resolve
   hover/focus/active to level0. Follow the public default and recheck on a
   source-revision change.

[M3-overview]: https://m3.material.io/components/cards/overview
[M3-specs]: https://m3.material.io/components/cards/specs
[M3-guidelines]: https://m3.material.io/components/cards/guidelines
[M3-accessibility]: https://m3.material.io/components/cards/accessibility
[AX-revision]: https://android.googlesource.com/platform/frameworks/support/+/b0e5f9fe34e7ad2e8e8619ba3bc010dc4fd45a6b
[AX-card]: https://android.googlesource.com/platform/frameworks/support/+/b0e5f9fe34e7ad2e8e8619ba3bc010dc4fd45a6b/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Card.kt
[HTML-anchor]: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element
[HTML-links]: https://html.spec.whatwg.org/multipage/links.html
[ACC-name]: https://www.w3.org/TR/accname-1.2/
[WCAG-link]: https://www.w3.org/TR/WCAG22/#link-purpose-in-context
[focus-visible]: https://www.w3.org/TR/selectors-4/#the-focus-visible-pseudo
[forced-colors]: https://www.w3.org/TR/css-color-adjust-1/#forced-colors
[reduced-motion]: https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion
[visited]: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Selectors/Privacy_and_:visited
[MW-revision]: https://github.com/material-components/material-web/tree/c05b4b23485c803f68ff31cde52506cea5cc555a/labs/card

