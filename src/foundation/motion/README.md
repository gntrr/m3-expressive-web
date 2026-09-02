# Material 3 Motion Foundation

This framework-neutral module separates the current physics-based Material
motion schemes from the baseline duration/easing scale. It has no React,
animation-library, Web Animations API, or spring-solver dependency.

```ts
import {
  getMaterialMotionScheme,
  materialMotion,
  toMaterialMotionCss,
} from 'm3-expressive-web/foundation/motion';

const fastShapeMotion = materialMotion.expressive.tokens.fastSpatial;
const standard = getMaterialMotionScheme('standard');
const curveCss = toMaterialMotionCss();
```

## Standard and Expressive schemes

Both schemes expose the official `fast`, `default`, and `slow` categories for
`spatial` and `effects` intent. Spatial motion changes bounds, position, scale,
or shape. Effects motion changes values such as color or opacity and is
critically damped to avoid overshooting invalid ranges.

Each semantic token contains a normalized spring record with damping ratio and
stiffness. These are authoritative AndroidX parameters, but their numeric
behavior depends on the solver. They have no fixed duration. The public API
does not expose Compose `AnimationSpec`, `FiniteAnimationSpec`, converters, or
platform types.

Use Standard for recurring, utilitarian interactions. Use Expressive for
prominent elements and hero interactions. Do not select Expressive merely to
make every transition bouncy; effects slots are intentionally identical across
the current schemes.

## Baseline curve tokens and CSS

The official 16 durations and seven current easing roles remain available for
transitions that have a meaningful duration/easing representation. CSS output
uses `--md-sys-motion-duration-*` and `--md-sys-motion-easing-*` variables.

Material's canonical emphasized easing is a multi-segment path. The pinned
Material Web token translates it to `cubic-bezier(0.2, 0, 0, 1)`; both forms
are preserved and the CSS value is classified `translated`. Other cubic Bézier
values serialize directly.

Spring stiffness and damping are deliberately not CSS custom properties. A
faithful `linear()` or Web Animations translation needs explicit mass, initial
velocity, settling thresholds, sampling precision, and interruption policy.
This foundation does not guess those values or convert springs to arbitrary
Bézier curves.

## Reduced motion

`MATERIAL_REDUCED_MOTION_POLICY` is a first-class, immutable web policy for
`@media (prefers-reduced-motion: reduce)`:

- remove decorative and looping motion;
- replace large translation, scaling, and morphing with non-spatial feedback;
- preserve brief state feedback through color, opacity, or visible boundaries;
- retain only essential motion needed for progress, causality, or orientation.

The destination state must remain identical. Do not apply a global `0ms`
override: it can break transition events, hide feedback, and remove essential
communication. Re-read the media query when it changes during a session.

## Web execution guidance

- CSS transitions work for canonical curve tokens and interrupt/reverse from
  the browser's current interpolated value.
- Web Animations can coordinate cancellation and commit final styles, but
  callers must define ownership when concurrent state changes occur.
- A future spring solver should preserve current value and velocity when an
  animation is interrupted; restarting from an endpoint causes discontinuity.
- Prefer `transform` and `opacity` when they preserve semantics. Animating
  layout, large filters, or complex clipping may trigger costly paint/layout.
- Background tabs and throttled frames invalidate frame-count timing; use
  elapsed time or solver state. High-refresh displays must not alter physics.
- Emit final SSR markup without depending on animation. Start enhancement only
  after hydration and avoid animating from an unknown server layout.
- In forced colors, retain a non-motion state cue such as text, an outline, or
  a native control state.

## Shape morphing contract

The Shape foundation's normalized cubic paths do not share topology. A future
morpher must align winding and starting features, match convex/concave features,
and subdivide curves to compatible segment counts before interpolation. Once
normalized, shape progress should consume a semantic spatial token selected by
scope (`fast`, `default`, or `slow`). Interruption must continue from current
geometry and velocity. Reduced motion should replace non-essential morphing
with a direct state change or effects transition.

## Provenance

- AndroidX `MotionScheme`, `StandardMotionTokens`, and
  `ExpressiveMotionTokens` v0.14.0 at revision
  `9df4d001962d58aabca222967b8ceb1789acb960`.
- Material Web generated motion tokens v0.192 at revision
  `c05b4b23485c803f68ff31cde52506cea5cc555a`.
- Material Components Android motion documentation at revision
  `ac7e18efeefb331850c561faf9ab8bf81d27ba68`.

Material Web currently generates the curve token data but explicitly states
that its components do not support `--md-sys-motion` theming. Exact source URLs
and classifications are exported as `MATERIAL_MOTION_SOURCE`.
