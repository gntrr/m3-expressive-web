# InputChip Specification

## Status and scope

This is the implementation contract for the first web-native Material 3
InputChip. It resolves the DOM, prop-routing, ref, and availability gates left
open by the [Chip family specification](./SPEC.md). It does **not** authorize
React, CSS, a ChipSet, selection, elevation variants, navigation, animation,
ripple, router integration, or a bundled icon set.

Classifications:

- **canonical**: directly established by a pinned Material source or the web
  platform;
- **translated**: canonical source data expressed deliberately for the web;
- **provisional**: official evidence is incomplete or internally inconsistent;
  and
- **web-decision**: an explicit accessibility/API decision where Material is
  silent.

## Pinned sources and source gap

Use sources in this order:

1. The live Material [Chips overview][M3-overview], [specification][M3-specs],
   [guidance][M3-guidelines], and [accessibility][M3-accessibility] pages,
   checked 2026-10-09, establish purpose.
2. AndroidX Material3 revision
   [`c305b06271d332bc53767113d6d9fadbd61c1ab7`][AX-revision] is the numeric
   source; [InputChip][AX-input-chip] and generated
   [InputChipTokens][AX-input-tokens] are version `7_0_1` evidence.
3. Material Web revision
   [`c05b4b23485c803f68ff31cde52506cea5cc555a`][MW-revision] is secondary
   baseline web evidence: it describes removable and remove-only InputChips.
4. The [HTML button][HTML-button], [accessible-name][ACC-name],
   [focus-visible][focus-visible], [forced-colors][forced-colors],
   [interaction media-feature][media], [WCAG target-size][WCAG-target], and
   [reduced-motion][reduced-motion] standards resolve web behavior Material
   does not define.

AndroidX defines one **selectable** InputChip with `leadingIcon`, `avatar`, and
`trailingIcon`; Material Web instead makes every InputChip removable. Neither
defines valid browser semantics for an optional command plus a removal action.
The two-button contract below is therefore a **web-decision** that preserves
valid HTML. Android selected colors/roles remain provenance only.

## DOM and interaction model

The root is one neutral `<span class="md-input-chip">`. A span is phrasing
content, so it works in inline compositions; list owners must still supply an
appropriate `<li>`. The root has no role, tab stop, click handler, or ARIA
button semantics.

```html
<span class="md-input-chip">
  <!-- only when onClick exists -->
  <button class="md-input-chip__body" type="button">…</button>
  <!-- otherwise: a noninteractive visual body span -->
  <span aria-hidden="true" class="md-input-chip__body-static">…</span>
  <button aria-label="Remove Mina Chen" class="md-input-chip__remove" type="button">…</button>
</span>
```

This is a **web-decision**. The controls are siblings, never nested. With a
body command, tab order is body then remove; without one, only remove is
tabbable. Native Enter and Space activate each button. No roving focus,
checkbox/radio semantics, selection, or wrapper keyboard handling exists.

The body is interactive only when `onClick` is supplied. Otherwise its visual
label/avatar/icon is static and hidden from the accessibility tree because the
remove button's explicit name represents the sole action. `title` is always
supplementary.

## Public API proposal

```ts
type InputChipDataAttributes = {
  [name: `data-${string}`]: string | undefined;
};

type InputChipRootProps = Pick<
  ComponentPropsWithoutRef<'span'>,
  'className' | 'dir' | 'id' | 'lang' | 'style' | 'title'
> &
  InputChipDataAttributes;

type InputChipBodyButtonProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  | 'aria-label' | 'aria-labelledby' | 'children' | 'disabled'
  | 'onClick' | 'ref' | 'type'
> & { type?: 'button' | 'reset' | 'submit' };

type InputChipRemoveButtonProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  | 'aria-label' | 'aria-labelledby' | 'children' | 'disabled'
  | 'onClick' | 'ref' | 'type'
>;

type InputChipBodyName =
  | { 'aria-label'?: never; 'aria-labelledby'?: never }
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

type InputChipLeadingVisual =
  | { avatar?: never; leadingIcon?: never }
  | { avatar: ReactElement; leadingIcon?: never }
  | { avatar?: never; leadingIcon: ReactElement };

type InputChipProps = InputChipBodyName & InputChipLeadingVisual & {
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onRemove: MouseEventHandler<HTMLButtonElement>;
  removeIcon: ReactElement;
  removeLabel?: string;
  bodyDisabled?: boolean;
  rootProps?: InputChipRootProps;
  bodyButtonProps?: InputChipBodyButtonProps;
  removeButtonProps?: InputChipRemoveButtonProps;
  rootRef?: Ref<HTMLSpanElement>;
  bodyButtonRef?: Ref<HTMLButtonElement>;
  removeButtonRef?: Ref<HTMLButtonElement>;
};
```

`rootProps`, `bodyButtonProps`, and `removeButtonProps` prevent ambiguous
spreading across two buttons. `id`, `className`, `style`, `dir`, `lang`, and
`data-*` belong to `rootProps`; body form/name/value/type and event props go in
`bodyButtonProps`; remove metadata/event props go in `removeButtonProps`.
`aria-label`/`aria-labelledby` are component-owned names and are not forwarded
through either group. Root ARIA, role, tabIndex, and click props are excluded.
These routing and ref rules are **web-decisions**. There is no ambiguous
top-level `ref`; all three exact targets are available.

`onRemove` receives the native mouse/click event, matching normal React button
handlers. It is required. A body callback receives only body activation; a
remove callback receives only remove activation. No handler stops propagation:
the root has no click handler, and normal bubbling to an application ancestor
remains native.

The body defaults to `type="button"` but may explicitly submit/reset through
its prop group. Removal is always `type="button"`: a destructive remove action
must never submit/reset a form accidentally. This is a **web-decision**.

## Availability and naming

There is no whole-chip `disabled`, `removeDisabled`, `selected`,
`defaultSelected`, `aria-pressed`, `href`, `as`, `asChild`, or elevated API.
When `onClick` exists, `bodyDisabled` may disable only that native body button;
removal remains available. `bodyDisabled` without `onClick` is invalid in
development. Disabling removal is out of scope: callers must omit the chip
until removal is available, preventing an impossible-to-remove token. This is
a **web-decision**.

`label` remains a required string (**web-decision**): it gives a predictable
visible label and deterministic default remove name. Development rejects an
empty or whitespace-only label. The body button's default accessible name is
the visible label. One nonblank `aria-label` or `aria-labelledby` may override
it; both are invalid. In a remove-only chip, those body-name overrides are
invalid because no body button exists.

The remove button always has an explicit accessible name. Its default is
`Remove ${label.trim()}`. `removeLabel` may provide a nonblank, localized full
replacement; it is not automatically prefixed. Interior punctuation and
whitespace in `label` are preserved, while surrounding whitespace is trimmed.
The visible remove icon never supplies this name.

`avatar` and `leadingIcon` are mutually exclusive at the type level and must
also fail development validation if runtime values violate that promise. Both
are decorative in v1—wrapped with `aria-hidden="true"`—because `label` names
the body and derives the remove name. `avatar` is a `ReactElement`, clipped to
the canonical full shape; its image alternative text cannot add a competing
name. `leadingIcon` and required `removeIcon` are `ReactElement`s in 18px
visual boxes. Avatar is 24px. Requiring `removeIcon` avoids bundling or
inventing an icon asset; it is a **web-decision**.

## Geometry, colors, and visual ownership

The canonical InputChip reference is 32px baseline block size, small shape,
`labelLarge`, 18px icon boxes, 24px avatar, 8px icon/label spacing, transparent
container, `onSurfaceVariant` label/leading/trailing roles, and a 1 CSS-pixel
`outlineVariant` boundary. Android `dp` maps one-to-one to CSS reference px
(**translated**); browser zoom remains effective.

The outer span owns one background, outline, small-shape boundary, and level-0
elevation. It must not create two visual pills. Android's `contentPadding`
uses 4px start with avatar/no leading icon, otherwise 8px, and 8px end with a
trailing icon, otherwise 4px (**canonical Android data**). The web remove
button is a 32px sibling with a centered 18px icon; it supplies about 7px of
visual end inset. Root start padding preserves Android's 4px/8px rule; ending
padding is absorbed by the remove target rather than mechanically copied.
This is a **translated web-decision**.

Each interactive region owns only its own clipped state layer. Body hover,
focus-visible, and pressed layers never paint the remove region; remove states
never paint the body. Both use their active content role once with the existing
Interaction State opacity tokens; fine hover is gated by
`(hover: hover) and (pointer: fine)`. There is no selected state, no
`secondaryContainer`, and no elevation change. Motion is immediate.

For a body-disabled chip, only body label/leading/avatar treatment uses the
translated disabled `onSurface × 0.38` treatment; the remove action remains
enabled and normal. The root boundary remains available because removal is
still actionable. No whole-control opacity is allowed.

Focus is region-local: the focused body or remove button receives an external,
2 CSS-pixel indicator in `secondary`, outside its own clipped state layer.
This is a **translated, provisional** browser recipe, not a canonical Android
renderer. The root must not clip it. In forced colors, translucent layers are
suppressed; system-color boundaries and a region-local `Highlight` outline
remain visible. Do not set `forced-color-adjust: none`.

Use logical properties, inherit `dir`, and never mirror arbitrary consumer
icons. The root has no fixed inline size; long labels reflow and may grow past
the 32px baseline instead of clipping. The primitive does not add an invisible
48px target, responsive sizing, or viewport behavior.

## SSR, Storybook, and test plan

The future renderer is SSR/Next.js-safe and has no `"use client"` directive,
hooks, layout measurement, or internal state. Event handlers may be provided
from a consumer client boundary.

Future stories must cover remove-only; body plus remove; avatar; leading icon;
avatar/icon rejection; custom remove label/icon; keyboard tab order; callback
isolation; independent body/remove hover/focus/pressed; long labels; light/dark;
RTL; forced colors; reduced motion; absent selected state; and 32px versus
parent-owned target guidance.

Unit and browser tests must verify wrapper neutrality; sibling-button DOM;
remove-only/body-plus-remove modes; no nested buttons; default/native types;
prop and ref routing; label/name validation; avatar/icon exclusivity;
decorative visual handling; body/remove names; callback isolation; tab order;
body-only disablement; independent state layers/focus; colors; geometry;
typography; shape; forced colors; RTL/reflow; SSR; and absence of selection,
client boundaries, navigation, or animation.

## Implementation gates

1. Confirm the required consumer `removeIcon` ergonomics with component users;
   no built-in icon will be added without a library icon policy.
2. Contrast-test the region-local focus ring against generated light/dark
   schemes and forced colors before CSS lands.
3. Test the translated 32px remove-target geometry with real dense chip rows;
   target expansion remains a future ChipSet/layout decision.
4. Re-audit this record if AndroidX publishes a browser-native two-action or
   Expressive InputChip contract.

[AX-revision]: https://android.googlesource.com/platform/frameworks/support/+/c305b06271d332bc53767113d6d9fadbd61c1ab7
[AX-input-chip]: https://android.googlesource.com/platform/frameworks/support/+/c305b06271d332bc53767113d6d9fadbd61c1ab7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Chip.kt
[AX-input-tokens]: https://android.googlesource.com/platform/frameworks/support/+/c305b06271d332bc53767113d6d9fadbd61c1ab7/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/InputChipTokens.kt
[M3-overview]: https://m3.material.io/components/chips/overview
[M3-specs]: https://m3.material.io/components/chips/specs
[M3-guidelines]: https://m3.material.io/components/chips/guidelines
[M3-accessibility]: https://m3.material.io/components/chips/accessibility
[MW-revision]: https://github.com/material-components/material-web/tree/c05b4b23485c803f68ff31cde52506cea5cc555a
[HTML-button]: https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element
[ACC-name]: https://www.w3.org/TR/accname-1.2/
[focus-visible]: https://www.w3.org/TR/selectors-4/#the-focus-visible-pseudo
[forced-colors]: https://www.w3.org/TR/css-color-adjust-1/#forced-colors
[media]: https://www.w3.org/TR/mediaqueries-4/#mf-interaction
[WCAG-target]: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
[reduced-motion]: https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion
