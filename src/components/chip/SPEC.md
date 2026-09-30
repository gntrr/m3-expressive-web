# Chip Family Specification

## Status and scope

This is the implementation contract for a future Material 3 Chip family. It
defines separate Assist, Filter, Input, and Suggestion Chip contracts for the
web. It does **not** authorize React, CSS, a ChipSet, responsive layout,
navigation chips, router integration, uncontrolled state, ripple, or an
animation runtime.

Classifications used below:

- **canonical**: directly established by a current Material source, generated
  token, or public AndroidX API;
- **translated**: authoritative data deliberately expressed for the web;
- **provisional**: official evidence is incomplete or internally inconsistent;
  and
- **web-decision**: a necessary, explicit web-library choice where Material is
  silent.

## Source hierarchy and pinned provenance

Resolve conflicts in this order:

1. Live Material [Chips overview][M3-overview], [specs][M3-specs],
   [guidelines][M3-guidelines], and [accessibility][M3-accessibility] establish
   purpose and anatomy. They were checked on 2026-09-30 and are not
   revision-addressable.
2. AndroidX Material3 revision
   [c305b06271d332bc53767113d6d9fadbd61c1ab7][AX-revision] is the numeric and
   behavioral source. [Chip.kt][AX-chip] defines the public Compose APIs.
   Generated [Assist][AX-assist], [Filter][AX-filter], [Input][AX-input], and
   [Suggestion][AX-suggestion] token files are all version 7_0_1.
3. Material Web revision
   [c05b4b23485c803f68ff31cde52506cea5cc555a][MW-revision] is secondary
   baseline web evidence. Its [Chip documentation][MW-docs] describes the four
   types, chip sets, removable Input/Filter chips, and baseline CSS tokens; it
   is maintenance-mode and has no Expressive parity.
4. The [HTML button definition][HTML-button], [WAI-ARIA button pattern][WAI-button],
   [checkbox pattern][WAI-checkbox], [WCAG target-size guidance][WCAG-target],
   [focus-visible][focus-visible], [interaction media features][media],
   [forced-colors][forced-colors], and [reduced motion][reduced-motion] govern
   web behavior where Material is silent.

The Color, Typography, Shape, Elevation, Motion, and Interaction State
foundations are the implementation-facing sources. Components must consume
them rather than duplicate their values.

## Taxonomy, Expressive status, and component boundaries

Current Material names four canonical types. Expressive has not renamed them,
added a fifth type, introduced a published chip-size scale, or published
chip-specific shape morph targets in the pinned sources.

| Component | Material purpose | Persistent state | Initial native contract | Status |
| --- | --- | --- | --- | --- |
| AssistChip | Contextual smart/automated command | none | native button | canonical type; translated renderer |
| SuggestionChip | Dynamic suggestion that narrows intent | none | native button | canonical type; translated renderer |
| FilterChip | Independently enable/disable a content filter | selected | toggle button with aria-pressed | canonical type; web semantic decision |
| InputChip | Entered entity or text token, with removal | no initial public selection state | neutral wrapper plus sibling buttons | canonical type; web structure decision |

Do **not** expose a generic Chip type discriminator. The four types differ in
purpose, anatomy, available elevations, persistent state, and valid HTML. A
later private visual shell may share small-shape geometry, label rendering,
state layer, and foundation aliases. It must not merge public semantics or
leak a remove control into a command chip.

### Why FilterChip is a toggle button

AndroidX renders selectable chips with a Checkbox role; its public FilterChip
API takes selected and onClick, which establishes persistent boolean state but
does not establish a web role. Material says filters can be alternatives to
toggle buttons or checkboxes and does not define browser form semantics.

The initial web contract uses a controlled native button with
aria-pressed equal to selected. It communicates an independently toggled
filter, keeps native Enter and Space activation, and does not falsely make an
arbitrary filter set a form field. This is a **web-decision**. A product that
needs form submission or a labelled checkbox group should use native checkboxes
instead. Mutually exclusive choices require a separately specified radio/group
control; do not infer radio semantics from row layout.

### InputChip source gap and valid web structure

AndroidX exposes InputChip(selected, onClick, label, leadingIcon, avatar,
trailingIcon) as one selectable Compose surface. Material Web instead says all
Input Chips are removable and supports remove-only. Neither source defines how
a browser should expose both an optional body action and a remove action.

A native button cannot contain another button or other interactive descendant.
The first web InputChip must therefore use a non-interactive visual wrapper:

1. an optional body button for an explicit command; and
2. a required, separate remove button named Remove followed by the label by
   default.

When there is no body command, the remove button is the sole interactive
region; no removeOnly boolean is needed. The AndroidX selected input-chip
parameter and checkbox role are **canonical Android evidence**, but an initial
web InputChip does not expose selected or aria-pressed. Combining a selection
toggle, command, and removal action in one compact token has no reviewed web
contract. Revisit it only with a focused collection/selection specification.

## Anatomy and content rules

All chips are labelled, compact controls; rich or interactive content is not
valid inside their label/icon slots.

| Type | Required anatomy | Optional anatomy | Disallowed or deferred anatomy |
| --- | --- | --- | --- |
| Assist | label, container, state layer | decorative leading/trailing icons; outline or elevation treatment | selection, avatar, remove action |
| Suggestion | label, container, state layer | decorative leading icon; outline or elevation treatment | trailing icon, selection, avatar, remove action |
| Filter | label, container, state layer, selected visual | decorative leading icon, selected/check icon, trailing icon; outline or elevation treatment | avatar; remove action in initial API |
| Input | text label, container, remove action | avatar **or** decorative leading icon, optional body action | nested remove button; public selected state in first contract |

An AndroidX InputChip displays an avatar in preference to a leading icon when
both are passed. The future web API should reject both rather than silently
discard one; that is a **web-decision** that makes rendered anatomy explicit.
Icons are decorative inside command/toggle buttons and are wrapped with
aria-hidden true. An avatar image must have appropriate alternative text only
if it contributes to the control name; otherwise it is decorative.

The selected check icon of FilterChip is visual confirmation of the existing
aria-pressed state, never its only communication channel. A consumer-supplied
trailing icon is decorative in the initial API. Material Web's removable
FilterChip is secondary evidence only; adding a second action needs the same
two-control design and a separate specification, so it is deferred.

## Baseline metrics, Expressive findings, and target size

The Android token files define one baseline visual size. There are no current
Expressive extra-small through extra-large chip tokens, size-specific shape
tokens, or viewport-dependent chip rules.

| Metric | Assist | Filter | Input | Suggestion | Classification |
| --- | ---: | ---: | ---: | ---: | --- |
| Visual block size | 32px | 32px | 32px | 32px | canonical value, translated from dp |
| Icon box | 18px | 18px | 18px leading/trailing | 18px | canonical value, translated from dp |
| Avatar box | — | — | 24px, full corner | — | canonical value, translated from dp |
| Default icon/label gap | 8px | 8px | 8px | 8px | canonical value, translated from dp |
| Standard inline padding | 8px | 8px | conditional: start 4px with avatar/no leading icon, otherwise 8px; end 8px with trailing content, otherwise 4px | 8px | canonical AndroidX default, translated from dp |
| Label role | labelLarge | labelLarge | labelLarge | labelLarge | canonical |
| Container shape | small | small | small | small | canonical |

Android dp becomes CSS reference pixels one-for-one; browser zoom still scales
it. The 32px values describe the visual box, not a guarantee of a touch
target. Material commonly recommends 48dp touch targets and WCAG 2.2 AA sets a
24 by 24 CSS-pixel baseline. The primitive must not silently expand a 32px chip
into an overlapping hit area. A future ChipSet/layout contract owns spacing and
any non-overlapping touch-target strategy. This is a **web-decision**.

Chips remain viewport-independent. Wrapping, horizontal scrolling, row gaps,
and compact/medium/expanded arrangements belong to application composition or
a future ChipSet. AndroidX examples show horizontal scrolling and FlowRow, but
neither is a primitive size or breakpoint rule.

## Foundation mappings

### Color and outline

Use semantic roles from Color. Transparent means no component fill, not a new
palette token. Alpha values are composited by the future CSS renderer and must
not be implemented as whole-control opacity.

| Type / treatment | Enabled container | Label | Leading icon | Trailing icon | Boundary |
| --- | --- | --- | --- | --- | --- |
| Assist flat | transparent | onSurface | primary | primary | outlineVariant, 1px |
| Assist elevated | surfaceContainerLow | onSurface | primary | primary | none |
| Suggestion flat | transparent | onSurfaceVariant | primary | none | outlineVariant, 1px |
| Suggestion elevated | surfaceContainerLow | onSurfaceVariant | primary | none | none |
| Filter flat, unselected | transparent | onSurfaceVariant | primary | onSurfaceVariant | outlineVariant, 1px |
| Filter flat, selected | secondaryContainer | onSecondaryContainer | onSecondaryContainer | onSecondaryContainer | none |
| Filter elevated, unselected | surfaceContainerLow | onSurfaceVariant | primary | onSurfaceVariant | none |
| Filter elevated, selected | secondaryContainer | onSecondaryContainer | onSecondaryContainer | onSecondaryContainer | none |
| Input, unselected Android reference | transparent | onSurfaceVariant | onSurfaceVariant | onSurfaceVariant | outlineVariant, 1px |
| Input, selected Android reference | secondaryContainer | onSecondaryContainer | primary | onSecondaryContainer | none |

These mappings are **canonical** generated-token roles. The Input selected rows
are retained for provenance only while web selection is deferred. The AndroidX
generated Input token file has state-specific leading-icon exceptions; do not
flatten those into an invented web color table before an InputChip interaction
design is approved.

Disabled command/toggle chips use native disabled. Flat containers remain
transparent; disabled label/icons use onSurface at 0.38, and flat outlines use
onSurface at 0.12. Elevated Assist/Suggestion/Filter disabled containers use
onSurface at 0.12 with level0; selected disabled Filter/Input containers also
use onSurface at 0.12. These source inputs are **canonical**; cross-browser
alpha compositing and forced-colors fallback are **translated**. Disabled
suppresses interaction layers and motion. Input removal must be disabled
independently when its surrounding model disallows deletion.

### Typography and shape

Every label resolves all five Typography properties from labelLarge; no
Expressive emphasized label role is assigned by current chip tokens. Use the
repository Typography variables and consumer font-family configuration. Do not
bundle a font or directly copy Android sp.

Every container uses MATERIAL_SHAPE_CORNERS.small and its system variable. It
is a rounded rectangle that can serialize to logical CSS corner radii. Current
AndroidX Chip APIs allow a general Compose Shape, but no authoritative
Expressive rest/selected/pressed shape vocabulary exists for Chips. Do not add
a public shape prop, morph, or non-rectangular geometry.

### Elevation

Elevation describes visual separation only; it does not establish z-index,
stacking context, DOM order, or positioning.

| Treatment | Rest | Fine-pointer hover | Focus-visible | Pressed | Disabled | Dragged |
| --- | --- | --- | --- | --- | --- |
| Flat Assist / Suggestion | level0 | level0 | level0 | level0 | level0 | level4, not public |
| Elevated Assist / Suggestion | level1 | level2 | level1 | level1 | level0 | level4, not public |
| Flat Filter | level0 | level1 | level0 | level0 | level0 | level4, not public |
| Elevated Filter | level1 | level2 | level1 | level1 | level0 | level4, not public |
| Input | level0 | level0 | level0 | level0 | level0 | level4, not public |

The public FilterChipDefaults filterChipElevation factory uses selected-hover
level1 even though generated raw unselected-hover tokens name level0. Follow
the public AndroidX factory above; the disagreement is **provisional** and
must be rechecked when the revision changes. The repository materialElevation
shadow serialization may render these levels, but Android tonal overlay must
not be reproduced as an arbitrary extra CSS color overlay.

### Interaction state, focus, and motion

Resolve transient state through materialStates and
resolveMaterialStateComposition. Selected is a persistent Filter semantic axis
that composes with, rather than replaces, hover/focus/pressed. Do not confuse
aria-pressed with CSS active.

| State | Enabled chips | Filter selected mode | Disabled |
| --- | --- | --- | --- |
| Rest | no state layer | selected colors/check remain | disabled mappings; no layer |
| Hover | content-role source × hover opacity on fine hover pointers only | selected role × hover opacity | none |
| Focus-visible | content-role source × focus opacity plus external focus indicator | selected role × focus opacity plus indicator | none |
| Pressed | content-role source × pressed opacity | selected role × pressed opacity | none |

Focus is never conveyed by a translucent layer alone. Current token files name
secondary as the focus-indicator color, with several flat focus-outline roles.
They do not publish an equivalent browser focus-ring recipe. A future external
2 CSS-pixel ring is a **provisional translated** mapping and requires contrast
testing; the ring must sit outside a clipped visual layer.

Chip.kt contains internal elevation animation and an opt-in AnimatingChipContent
helper that references Material motion tokens for icon appearance/removal. It
does **not** publish a Chip-specific Expressive motion, spring, selection
animation, or shape-morph contract. Future web renderers must use immediate
elevation/icon/selection results until a reviewed adapter exists; they must not
invent CSS springs or cubic-bezier substitutes. Reduced motion preserves final
feedback and suppresses future non-essential effects.

## Per-component contracts

### AssistChip

AssistChip is a contextual command, such as adding a calendar item. The future
root is one native button, defaults type to button, forwards an
HTMLButtonElement ref and safe button props, and uses native Enter/Space and
disabled behavior. It has no selected, checked, aria-pressed, href, or remove
API. A visible non-empty label is its default accessible name; aria-label or
aria-labelledby may override it but may not conflict. Title is supplemental.

It supports flat and elevated treatments. Both leading and trailing decorative
icons are canonical AndroidX slots. There is no avatar. It is SSR/Next.js-safe
and needs no client directive.

### SuggestionChip

SuggestionChip is a dynamic one-shot command, such as a suggested reply or
query refinement. It remains separate from AssistChip because its intent,
label color, and supported anatomy differ even if their renderer shares code.
It is one native button with the same naming, ref, type, keyboard, disabled,
SSR, and no-navigation rules as AssistChip.

It supports flat and elevated treatments and one optional decorative leading
icon. Current AndroidX passes no trailing slot to its public SuggestionChip; do
not add one. It has no selected or toggle state.

### FilterChip

FilterChip is a controlled toggle:

~~~tsx
<FilterChip
  selected={hasVegetarianFilter}
  onSelectedChange={setHasVegetarianFilter}
>
  Vegetarian
</FilterChip>
~~~

It is a native button with type button and aria-pressed equal to selected. On
valid native activation it first calls consumer onClick, then calls
onSelectedChange with the inverse selected value; this explicit order is a
**web-decision** and must be tested. It has no internal/default selection
state, checked, aria-checked, aria-selected, href, or remove API. Disabled
prevents both callbacks through native button behavior.

Selected/unselected state controls the canonical color and outline rows above.
An optional selectedIcon is the visual check content shown in selected mode. A
consumer leadingIcon and selectedIcon cannot occupy the same visual start
position without reviewed precedence, so the first API should expose exactly
one leading visual source per mode. A trailing icon is decorative. The type
supports flat/elevated treatments, but no size or shape props.

### InputChip

InputChip represents an entered value such as a recipient, topic, or query
token. It is not a generic tag button. It always requires a removal callback,
while a body command is optional:

~~~tsx
<InputChip
  label="Mina Chen"
  avatar={<img alt="" src={avatarUrl} />}
  onRemove={removeMina}
/>

<InputChip label="Mina Chen" onClick={openMina} onRemove={removeMina} />
~~~

The body button, when present, receives the label name or one explicit ARIA
override. The independent remove button receives removeLabel or the derived
Remove label name. It defaults both buttons to type button and never nests
them. The outer visual wrapper has no role, tab stop, or click handler.

InputChip uses only the flat baseline treatment. Its avatar and leading icon
are mutually exclusive; a trailing AndroidX icon maps to the remove action in
this web contract and cannot be an arbitrary second command. It has no initial
selected, disabled-whole-chip, elevated, or removeOnly prop. A disabled body
and disabled remove action can be added only with a reviewed availability model
that does not leave an impossible-to-remove token.

## Proposed public API and shared types

These are design proposals, not implementation authorization. They avoid as,
asChild, generic polymorphism, href, router dependencies, and a Chip
discriminator.

~~~ts
type ChipTreatment = 'flat' | 'elevated';
type ChipAccessibleNameOverride =
  | { 'aria-label'?: never; 'aria-labelledby'?: never }
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

type AssistChipProps = ChipAccessibleNameOverride & ButtonProps & {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  treatment?: ChipTreatment;
};

type SuggestionChipProps = ChipAccessibleNameOverride & ButtonProps & {
  icon?: ReactNode;
  treatment?: ChipTreatment;
};

type FilterChipProps = ChipAccessibleNameOverride & ButtonProps & {
  selected: boolean;
  onSelectedChange?: (selected: boolean) => void;
  leadingIcon?: ReactNode;
  selectedIcon?: ReactNode;
  trailingIcon?: ReactNode;
  treatment?: ChipTreatment;
};

type InputChipProps = {
  label: string;
  avatar?: ReactNode;
  leadingIcon?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onRemove: () => void;
  removeLabel?: string;
};
~~~

The exact InputChip ref/prop-forwarding split and its disabled policy are open
implementation gates. Assist, Suggestion, and Filter use ordinary visible
label content, must reject blank explicit ARIA labels in development, and must
not permit two explicit ARIA naming sources. Icons do not contribute competing
names.

## Groups, platform behavior, and accessibility

Material Web calls chip sets toolbars and says chips commonly appear in sets;
AndroidX demonstrates scrolling and wrapping arrangements. Neither source
defines a one-size web selection manager. Do not create ChipGroup in the first
component phase. Individual FilterChips own controlled booleans; application
composition owns filtering state. A future layout-only ChipSet may provide
labelled grouping, wrapping, scrolling, and target spacing without assigning
checkbox/radio behavior. A future selection collection must specify its own
native controls and keyboard model.

- Command/toggle chips are native buttons: Enter and Space activate them;
  disabled means native disabled, not aria-disabled alone. Input removal uses
  its own native button with the same keyboard behavior.
- Filter aria-pressed makes persistent state available without relying on color
  or checkmark. Use visible labels or one non-conflicting ARIA override;
  icon-only chips are not part of this first contract.
- Focus uses focus-visible, never hover alone. Hover styling is gated by
  hover-capable fine pointers; touch and pen get active feedback but no sticky
  hover.
- Use logical inline properties and inherit dir; do not mirror arbitrary
  consumer icons. Natural text wrapping and CSS pixels preserve browser zoom.
- In forced colors, permit UA adjustment, suppress translucent layers as
  needed, retain a system-color boundary and focus ring, and do not disable
  forced-color adjustment without an approved equivalent.
- No component may infer z-index from elevation or become responsive based on
  viewport/pointer type. No runtime needs a client directive unless a future
  Storybook-only controlled example uses client state.

## Future Storybook plan

Create colocated stories only when each component is implemented:

1. Assist and Suggestion flat/elevated treatments, labels, approved icons, and
   disabled states in light/dark schemes;
2. controlled FilterChip selected/unselected values, check/leading/trailing
   anatomy, callback behavior, all treatment/state combinations, and an
   explicitly labelled independent-filter row;
3. InputChip remove-only and body-plus-remove structures, avatar/leading-icon
   exclusivity, remove naming, and no nested interactive markup;
4. long labels, natural wrapping, parent-owned wrapping/scroll examples, target
   geometry versus 48px guidance, RTL, and browser zoom;
5. keyboard focus-visible, fine-pointer hover, active/pressed, disabled,
   forced-colors, and reduced-motion emulation; and
6. documentation-only invalid examples: icon-only command chips, conflicting
   names, Filter aria-checked, Input nested buttons, and invented responsive
   size variants.

## Future test plan

Deterministic unit and Playwright-backed Storybook tests must cover:

- exact token provenance, immutable mappings, 32px baseline geometry,
  labelLarge, small-shape role, icons/avatar, boundaries, and elevation
  matrices;
- native button roots, default/explicit type, safe prop/class/style/ref
  forwarding, SSR markup, no client boundary, and no navigation/polymorphism;
- names from labels and allowed ARIA overrides, blank/conflicting-label
  diagnostics, decorative icon treatment, and title limitations;
- native Enter/Space activation, native disabled suppression, focus-visible,
  hover capability gating, state-layer precedence, forced colors, RTL,
  reflow/zoom, and reduced motion;
- controlled Filter callback next value and ordering, aria-pressed, selected
  visual state, no uncontrolled/default-selected API, and no checkbox/radio
  semantics; and
- Input valid sibling body/remove controls, callback isolation, remove name,
  avatar/icon exclusivity, remove-only behavior, and absence of nested
  interactive controls or an unintended selected state.

## Recommended implementation order and open questions

1. Implement AssistChip: the simplest command anatomy and both treatments.
2. Implement SuggestionChip: reuse only approved command-shell internals.
3. Implement controlled FilterChip: establish selection, state layer, and
   check-icon behavior without a group manager.
4. Implement InputChip: only after the two-button DOM, ref, disabled, and
   callback contracts receive focused review.
5. Specify a layout-only ChipSet, then consider single/multi-select collection
   primitives only if a real product requirement establishes their semantics.

Open implementation gates:

1. Current Material/AndroidX offers no published Expressive Chip size, shape,
   or web-motion contract. Its absence is a constraint, not permission to copy
   Button or IconButton behavior.
2. Raw Filter tokens name unselected hover level0 while the public factory
   resolves hover to level1. This record follows the public factory.
3. InputChip selection and trailing action are inconsistent between AndroidX's
   one selectable surface and Material Web's removable model. The first web
   InputChip defers selection rather than creating invalid nested controls.
4. Material has no canonical web ChipSet keyboard or exclusive-selection
   behavior. Keep grouping outside individual primitives.
5. Token focus-indicator roles do not provide a reviewed CSS focus ring; verify
   contrast in generated light/dark schemes and forced colors before CSS lands.
6. Material's 48dp touch guidance and a dense, non-overlapping web ChipSet need
   an explicit composition policy before invisible target expansion is added.

[M3-overview]: https://m3.material.io/components/chips/overview
[M3-specs]: https://m3.material.io/components/chips/specs
[M3-guidelines]: https://m3.material.io/components/chips/guidelines
[M3-accessibility]: https://m3.material.io/components/chips/accessibility
[AX-revision]: https://android.googlesource.com/platform/frameworks/support/+/c305b06271d332bc53767113d6d9fadbd61c1ab7
[AX-chip]: https://android.googlesource.com/platform/frameworks/support/+/c305b06271d332bc53767113d6d9fadbd61c1ab7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Chip.kt
[AX-assist]: https://android.googlesource.com/platform/frameworks/support/+/c305b06271d332bc53767113d6d9fadbd61c1ab7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/AssistChipTokens.kt
[AX-filter]: https://android.googlesource.com/platform/frameworks/support/+/c305b06271d332bc53767113d6d9fadbd61c1ab7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilterChipTokens.kt
[AX-input]: https://android.googlesource.com/platform/frameworks/support/+/c305b06271d332bc53767113d6d9fadbd61c1ab7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/InputChipTokens.kt
[AX-suggestion]: https://android.googlesource.com/platform/frameworks/support/+/c305b06271d332bc53767113d6d9fadbd61c1ab7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SuggestionChipTokens.kt
[MW-revision]: https://github.com/material-components/material-web/tree/c05b4b23485c803f68ff31cde52506cea5cc555a
[MW-docs]: https://github.com/material-components/material-web/blob/main/docs/components/chip.md
[HTML-button]: https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element
[WAI-button]: https://www.w3.org/WAI/ARIA/apg/patterns/button/
[WAI-checkbox]: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
[WCAG-target]: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
[focus-visible]: https://www.w3.org/TR/selectors-4/#the-focus-visible-pseudo
[media]: https://www.w3.org/TR/mediaqueries-4/#mf-interaction
[forced-colors]: https://www.w3.org/TR/css-color-adjust-1/#forced-colors
[reduced-motion]: https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion
