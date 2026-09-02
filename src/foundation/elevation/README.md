# Material 3 Elevation Foundation

This module keeps three related concepts separate:

- **Elevation level** is the semantic Material level. Material Web consumes
  ordinal values `0` through `5`; the cross-platform reference distances are
  `0`, `1`, `3`, `6`, `8`, and `12 dp`.
- **Shadow rendering** is a visual representation of a level. The exported
  layer geometry exactly follows the pinned Material Web renderer, while the
  single `box-shadow` string is classified as a web translation.
- **Tonal elevation** changes surface color. It is not a shadow and is not
  implemented here. Consumers should select or compute an appropriate semantic
  color treatment independently.

```ts
import {
  materialElevation,
  materialElevationShadowToCssValue,
  toMaterialElevationCss,
} from 'm3-expressive-web/foundation/elevation';

materialElevation.level3; // { webLevel: 3, referenceDp: 6, ... }
materialElevationShadowToCssValue('level3');
toMaterialElevationCss({ selector: ':root' });
```

The CSS serializer emits canonical level variables such as
`--md-sys-elevation-level3: 3` and translated shadow variables such as
`--md-web-elevation-shadow-level3`. The web-specific namespace prevents the
shadow string from being mistaken for a canonical Material system token.

## Provenance

- Material Web system tokens v0.192 and elevation renderer at revision
  `c05b4b23485c803f68ff31cde52506cea5cc555a`.
- AndroidX `ElevationTokens` v0.103 and `ColorScheme.surfaceColorAtElevation`
  at revision `9df4d001962d58aabca222967b8ceb1789acb960`.
- Material Web documentation was reviewed on 2026-07-31 and still describes
  levels 0–5. No separate Material 3 Expressive elevation scale is documented.

Exact source URLs and classifications are exported as
`MATERIAL_ELEVATION_SOURCE`.

## Web rendering policy

Material Web paints key and ambient shadows on separate pseudo-elements at 30%
and 15% opacity. This module combines those layers using `color-mix()` so static
CSS tokens are sufficient. Rendering can vary with browser compositing, device
pixel ratio, the chosen shadow color, and dark surfaces. Overflow may clip a
shadow; visual elevation does not create or describe a DOM stacking context.

Do not derive `z-index` from an elevation level. In forced-colors or high-
contrast modes, shadows may disappear or be inappropriate; retain a visible
border or other non-shadow boundary where separation is semantically needed.
