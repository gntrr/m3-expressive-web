# M3 Expressive Web

An experimental React 19 component library exploring Material 3 Expressive for modern web and Next.js applications.

The repository provides framework-agnostic Material 3 foundations and its first
React component, Button. It remains experimental and intentionally private.

## Button

Import the React component separately from the opt-in aggregate stylesheet:

```tsx
import { Button } from 'm3-expressive-web/components/button';
import 'm3-expressive-web/styles.css';

<Button variant="filled" size="small" leadingIcon={<SaveIcon />}>
  Save
</Button>
```

Button renders a native `<button>` and supports the five ordinary variants,
five Expressive size tiers, round or square geometry, decorative leading and
trailing icons, native props, and a React 19 ref. Consumers must provide the
semantic foundation CSS variables; the package does not install a default
theme. See [`src/components/button/SPEC.md`](src/components/button/SPEC.md).

## Color foundation

Generate semantic light or dark roles from explicit Material inputs:

```ts
import {
  toMaterialColorCss,
} from 'm3-expressive-web/foundation';
import { createMaterialColorScheme } from 'm3-expressive-web/foundation/color/generator';

const colors = createMaterialColorScheme({
  seed: '#6750A4',
  variant: 'expressive',
  contrastLevel: 0,
  mode: 'light',
});

const css = toMaterialColorCss(colors);
```

Generation is pinned to `@material/material-color-utilities@0.4.0`, source revision `eeaf82b8e11bf20f6d8da7c76336575b69e79e01`, and the 2025 `phone` color model. See [`src/foundation/color/README.md`](src/foundation/color/README.md) for provenance and web-specific decisions.

The MCU-backed generator has an explicit `foundation/color/generator` entry.
Root, component, and lightweight foundation imports do not load it.

## Typography foundation

Create all standard and emphasized semantic roles, optionally replacing the
font-family stacks without changing the Material scale:

```ts
import {
  createMaterialTypography,
  toMaterialTypographyCss,
} from 'm3-expressive-web/foundation/typography';

const typography = createMaterialTypography({
  fontFamilies: { brand: 'Roboto Flex, Roboto, system-ui, sans-serif' },
});

const css = toMaterialTypographyCss(typography);
```

Values are pinned to the official Material Web token snapshot `34.0.21` at
revision `c05b4b23485c803f68ff31cde52506cea5cc555a`. The package uses scalable
`rem` metrics and does not bundle or load fonts. See
[`src/foundation/typography/README.md`](src/foundation/typography/README.md).

## Shape foundation

Use semantic corner variables independently from normalized Material
Expressive geometry:

```ts
import {
  getMaterialShape,
  toMaterialShapeCss,
  toMaterialShapeSvgPath,
} from 'm3-expressive-web/foundation/shape';

const cookie = getMaterialShape('cookie4Sided');
const path = toMaterialShapeSvgPath(cookie);
const cornerCss = toMaterialShapeCss();
```

The module includes the complete current generated corner vocabulary and all
35 named shapes from the pinned experimental AndroidX `MaterialShapes` source.
It does not include a clipping or morphing runtime. See
[`src/foundation/shape/README.md`](src/foundation/shape/README.md).

## Elevation foundation

Use canonical semantic levels independently from translated web shadows:

```ts
import {
  materialElevation,
  toMaterialElevationCss,
} from 'm3-expressive-web/foundation/elevation';

materialElevation.level3; // web level 3; cross-platform reference 6 dp
const css = toMaterialElevationCss();
```

The module preserves the official Material Web key and ambient shadow layers,
does not infer `z-index`, and leaves tonal surface treatment to the color
system. See
[`src/foundation/elevation/README.md`](src/foundation/elevation/README.md).

## Motion foundation

Select canonical Standard or Expressive spring schemes independently from the
baseline web curve tokens:

```ts
import {
  materialMotion,
  toMaterialMotionCss,
} from 'm3-expressive-web/foundation/motion';

const spring = materialMotion.expressive.tokens.fastSpatial;
const curveCss = toMaterialMotionCss();
```

Spring physics remain framework-neutral data and are not approximated as CSS
Bézier curves. The module also exports an explicit reduced-motion policy and
documents future shape-morph integration. See
[`src/foundation/motion/README.md`](src/foundation/motion/README.md).

## Development

Install dependencies with Bun:

```sh
bun install
```

Common commands:

```sh
bun run storybook       # Start Storybook on port 6006
bun run typecheck       # Check TypeScript without emitting files
bun run test            # Run unit and Storybook browser tests
bun run build           # Build ESM, declarations, source maps, and CSS
bun run build-storybook # Produce a static Storybook build
```

Library source belongs under `src/`. Components, tests, and stories should be colocated within component or foundation directories.

See `AGENTS.md` for contributor and implementation requirements.
