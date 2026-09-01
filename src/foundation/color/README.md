# Color foundation

The color engine generates Material semantic roles and tonal palettes without a
React or DOM dependency.

```ts
import {
  createMaterialColorScheme,
  toMaterialColorCss,
} from 'm3-expressive-web/foundation';

const colors = createMaterialColorScheme({
  seed: '#6750A4',
  variant: 'expressive',
  contrastLevel: 0,
  mode: 'light',
});

const css = toMaterialColorCss(colors);
```

## Canonical sources

- Generator: `@material/material-color-utilities@0.4.0`
- npm integrity: `sha512-dlq6VExJReb8dhjj3a/yTigr3ncNwoFmL5Iy2ENtbDX03EmNeOEdZ+vsaGrj7RTuO+mB7L58II4LCsl4NpM8uw==`
- Source revision: `eeaf82b8e11bf20f6d8da7c76336575b69e79e01`
- Material color specification: `2025`
- Official source: <https://github.com/material-foundation/material-color-utilities>

`MATERIAL_COLOR_ROLES`, the official scheme variants, and the 13 sampled tones
are the canonical Material vocabulary used by this module. Hex values are
generated from the four recorded inputs and are never maintained as a brand
palette.

## Web decisions

Material Color Utilities 0.4.0 exposes `phone` and `watch`, but no `web`
platform. The engine fixes the generator to the 2025 `phone` model as the
non-Wear semantic role model and records that choice in every result. Seeds are
restricted to opaque `#RGB` or `#RRGGBB` sRGB values and normalized to lowercase.
The official continuous contrast range of `-1` through `1` is preserved.

CSS serialization is a separate translation layer. It maps `onPrimary` to
`--md-sys-color-on-primary`, for example, but does not mutate the DOM or assume
`:root`; callers may select any theme scope. Future components should consume
semantic roles or CSS properties rather than tonal palette values.
