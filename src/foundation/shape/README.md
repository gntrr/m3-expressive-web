# Shape Foundation

This framework-neutral module separates Material semantic corner roles from
Material 3 Expressive named geometry. It has no React, rendering, animation, or
shape-morph dependency.

```ts
import {
  getMaterialShape,
  materialShapes,
  toMaterialShapeCss,
  toMaterialShapeSvgPath,
} from 'm3-expressive-web/foundation/shape';

const cookie = getMaterialShape('cookie4Sided');
const path = toMaterialShapeSvgPath(materialShapes.cookie4Sided);
const cornerCss = toMaterialShapeCss();
```

## Semantic corners

Corner values come from the official Material Web `34.0.21` generated tokens.
The baseline scale includes none, extra-small, small, medium, large,
extra-large, and full plus documented top/end variants. The current expanded
vocabulary adds large-increased, large-start, extra-large-increased, and
extra-extra-large.

Definitions store logical `topStart`, `topEnd`, `bottomEnd`, and `bottomStart`
corners. CSS serialization emits physical `border-radius` shorthand and, by
default, `:dir(rtl)` overrides for directional roles. `full` remains the
official web value `9999px`, which clamps naturally to a pill.

## Expressive geometry

All 35 names in the pinned experimental AndroidX `MaterialShapes` API are
available. Canonical source vertices and rounding parameters are translated
into closed cubic Bézier paths and normalized into a centered `0 0 1 1`
coordinate space. The exported model is ordinary readonly TypeScript data; it
does not expose Android `RoundedPolygon`, `CornerRounding`, `Path`, density, or
dp concepts.

Source definitions are classified `canonical`. Generated cubic geometry, CSS,
and SVG strings are `translated`. RTL policy is a `web-decision`. No
provisional or design-kit-only decorative shapes are exported.

## Morphing contract

The official shapes do not share segment counts or compatible starting
features. Do not interpolate corresponding exported segment indices. A future
web morph implementation must align winding and starting features, map convex
and concave features, subdivide curves to equal topology, and preserve closure
before interpolation. AndroidX performs that work in its separate `Morph`
implementation; no animation engine is included here.

## Web rendering guidance

SVG is the reliable baseline for named geometry. Consumers may adapt the cubic
data for Canvas or supported CSS `path()`/`clip-path`, but browser support and
coordinate-box behavior must be tested before clipping interactive content.
Responsive SVG sizing and browser zoom preserve the normalized outline.

Clipping changes only visual paint: pointer hit testing, focus outlines, and
minimum target size remain consumer responsibilities. Keep hit areas large
enough, avoid clipping focus indicators, retain a visible boundary in forced
colors, and decide overflow intentionally for concave shapes.

## Provenance

- Material Web shape tokens: `34.0.21`, revision
  `c05b4b23485c803f68ff31cde52506cea5cc555a`.
- AndroidX generated Shape tokens: `14_1_0`, revision
  `9df4d001962d58aabca222967b8ceb1789acb960`.
- Named definitions and rounding/normalization algorithms: AndroidX
  `MaterialShapes.kt` and `graphics-shapes` at the same revision.

The named-shape API is officially experimental and may change at a future
AndroidX revision; provenance is pinned so changes can be audited deliberately.
