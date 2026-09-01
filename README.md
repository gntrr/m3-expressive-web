# M3 Expressive Web

An experimental React 19 component library exploring Material 3 Expressive for modern web and Next.js applications.

The repository is currently implementing its design foundations. The first public foundation is a deterministic, framework-agnostic Material 3 color engine. UI components, typography, shape, elevation, motion, layout, and production releases have not been implemented. The package remains intentionally private.

## Color foundation

Generate semantic light or dark roles from explicit Material inputs:

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

Generation is pinned to `@material/material-color-utilities@0.4.0`, source revision `eeaf82b8e11bf20f6d8da7c76336575b69e79e01`, and the 2025 `phone` color model. See [`src/foundation/color/README.md`](src/foundation/color/README.md) for provenance and web-specific decisions.

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
