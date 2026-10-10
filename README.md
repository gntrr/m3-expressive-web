# M3 Expressive Web

An experimental, private React 19 library that translates Material 3 and
Material 3 Expressive foundations to native web components. It is ESM-only,
uses Bun for development, and is designed to render under React SSR and Next.js
without a package-level client boundary.

## Install and style setup

The package is private today. A future consumer will install it with its React
19 peers, then opt into the emitted stylesheet:

```tsx
import { Button, Card } from 'm3-expressive-web';
import 'm3-expressive-web/styles.css';
```

Components consume semantic foundation custom properties; the library does not
ship a default brand theme. Generate an explicit color scheme separately:

```ts
import { toMaterialColorCss } from 'm3-expressive-web/foundation/color';
import { createMaterialColorScheme } from 'm3-expressive-web/foundation/color/generator';

const scheme = createMaterialColorScheme({
  seed: '#6750A4',
  variant: 'expressive',
  contrastLevel: 0,
  mode: 'light',
});
const css = toMaterialColorCss(scheme);
```

`foundation/color/generator` is the only MCU-backed entry. Root, component,
and lightweight foundation imports do not load Material Color Utilities.

## Public modules

Use the root export or narrow ESM subpaths:

- `components/button`: `Button`
- `components/icon-button`: `IconButton`, controlled `ToggleIconButton`
- `components/fab`: `Fab`, `ExtendedFab`
- `components/card`: `Card`, `CardAction`, `CardLink`
- `components/chip`: Assist, Suggestion, Filter, and Input chips
- `components/segmented-button`: native single-select radio and multi-select
  checkbox groups
- `foundation`: Color contracts, Typography, Shape, Elevation, Motion, State,
  and Adaptive Layout data

Each component has a colocated `SPEC.md` describing Material provenance,
semantics, accessibility, and web translations. See
[the stability policy](docs/API_STABILITY.md) and
[the provenance inventory](docs/material-provenance.json) before relying on a
provisional Expressive behavior.

## SSR and accessibility

All library components render native HTML and are SSR-safe. Place consumer
event handlers and controlled state in a consumer client boundary when using
Next.js. Importing this package never adds `'use client'`.

Use visible labels for text controls. Icon-only `IconButton`, toggle, and
icon-only FAB usages require `aria-label` or `aria-labelledby`; `title` is not
an accessible-name substitute. The package does not add default focus, hover,
or responsive behavior outside each component contract.

## Development

```sh
bun install
bun run typecheck
bun run build
bun run test:unit
bun run test:stories
bun run build-storybook
bun run test:package
bun run check:bundle-size
```

Storybook browser coverage currently runs in Chromium. Firefox/WebKit,
visual-regression, and a real Next.js consumer fixture are planned release
gates; see [the v0 architecture audit](docs/V0_ARCHITECTURE_AUDIT.md).
