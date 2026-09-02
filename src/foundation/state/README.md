# Interaction State Foundation

This module models Material 3 interaction semantics without React, component
styles, gesture recognition, or animation. Material 3 Expressive currently has
no separate system state scale, so the baseline Material 3 state model remains
authoritative.

## State model

`enabled` is the default baseline. `hover`, `focus`, `pressed`, and `dragged`
select one translucent state layer; `disabled` suppresses state layers and
interaction. `selected`, `checked`, `activated`, `expanded`, and `error` are
independent component meanings. A selected item can therefore also be hovered,
and an error field can also have visible focus.

```ts
import {
  materialStates,
  resolveMaterialStateComposition,
} from 'm3-expressive-web/foundation/state';

materialStates.hover.stateLayerOpacity; // 0.08

resolveMaterialStateComposition({
  interactionStates: ['pressed'],
  semanticStates: ['checked'],
  focusVisible: true,
});
```

Precedence is `disabled > dragged > pressed > focus > hover > enabled`.
Opacity values never add together. Semantic state first selects the future
component's base/color tokens, then the dominant interaction layer is applied.
A visible focus indicator is a separate channel and remains present during
hover or press.

## Web policy

- Keep DOM focus intact. Use `:focus-visible` for the primary visible keyboard
  focus treatment, and never remove the user-agent outline without an equally
  visible replacement.
- Treat hover as supplemental. Gate hover-only polish with `(hover: hover)`;
  use `(pointer: coarse)` and `(any-pointer: coarse)` as capability hints, not
  as device or input identity tests.
- Prefer native `disabled` on supporting HTML controls. `aria-disabled="true"`
  exposes semantics only; authors must suppress activation and style the state.
  It can intentionally remain focusable, in which case its focus indicator
  remains visible even though state layers are suppressed.
- In `(forced-colors: active)`, remove translucent state-layer visuals and rely
  on native boundaries, system-color outlines, text, or symbols. Preserve the
  user agent's forced-color adjustment by default.
- WCAG 2.2 requires keyboard operation and visible focus. Its AA target-size
  criterion is 24 by 24 CSS pixels with exceptions; Material's 48dp Android
  recommendation is useful design guidance, not a direct CSS-unit conversion.

State-layer color always comes from a future component token. A state layer is
not a ripple: the latter has press-origin geometry and motion and remains a
component-level option. Likewise, Motion may animate a component's response and
Shape may transform expressive geometry, but neither changes state semantics.

## Disabled values and provenance

Generated Material component tokens commonly use `0.38` for disabled content,
while container opacity varies by component and token generation. The module
therefore retains `0.38` only as a scoped reference and emits no disabled system
opacity variable.

Current AndroidX `StateTokens` `v0_210` at revision
`2d82078ac06ce59eac8b21a877283b046bf66e3e` is the canonical opacity source:
hover `0.08`, focus `0.10`, pressed `0.10`, dragged `0.16`. Material Web's
archived `v0.192` source at `c05b4b23485c803f68ff31cde52506cea5cc555a`
still contains focus/pressed `0.12`; this discrepancy is retained in
`MATERIAL_STATE_SOURCE` rather than silently normalized.
