# Repository Guidelines

## Project Intent

This repository is an experimental React component library implementing
Material 3 Expressive for modern web applications.

The goal is not merely to reproduce Material-inspired styling or design
tokens. Components should adopt the Material 3 Expressive design language,
component anatomy, variants, states, motion, shapes, color roles, typography,
and interaction principles as faithfully as practical while adapting them
appropriately for the web platform.

The library must remain suitable for use in React and Next.js applications.

Core principles:

- Material 3 Expressive is the primary design-system reference.
- Implement components natively for React and the web; do not port Android
  Compose APIs directly.
- Use a mobile-first approach for layout and sizing, with adaptive behavior
  for tablet and desktop viewports.
- Web-specific interaction states such as hover, focus-visible, keyboard
  navigation, pointer interaction, and accessibility are first-class
  requirements.
- Design foundations must be token-driven: color, typography, shape,
  elevation, motion, spacing, and adaptive layout.
- Do not depend on MUI or `@material/web`.
- Prefer native React/CSS implementations for simple components.
- Use Radix primitives only where they materially improve complex behavior
  or accessibility, such as dialogs, menus, selects, and popovers.
- Avoid unnecessary runtime dependencies.

## Project Structure & Module Organization

The current `stories/` directory contains Storybook-generated example
components and should be treated as temporary scaffolding.

New library code should move toward a dedicated `src/` structure:

src/
  components/
  foundation/
  styles/
  utilities/

Component implementation, styles, tests, and stories should remain colocated
within each component directory when practical.

Storybook configuration belongs in `.storybook/`.
Static documentation assets may remain in `stories/assets/` until the
repository structure is migrated.

## Component Design Rules

Each component should expose a small, predictable React API and should avoid
leaking internal implementation details.

Prefer APIs such as:

<Button variant="filled" size="large">
  Continue
</Button>

over APIs that require consumers to manually compose Material-specific CSS
classes.

Components must account for relevant states including:

- default
- hover
- focus-visible
- pressed
- disabled

Add selected, error, loading, expanded, or checked states where the component
semantics require them.

Do not make components responsive merely because the viewport changes.
Primitive components such as Button or Card should generally remain
viewport-agnostic. Adaptive components such as navigation and application
shells may change presentation based on Material compact, medium, and expanded
layout classes.

## Build, Test, and Development Commands

Use Bun because `bun.lock` is committed as the dependency lockfile.

- `bun install` installs dependencies exactly from the lockfile.
- `bun run storybook` starts the local component explorer on port 6006.
- `bun run build-storybook` creates a production Storybook build in `storybook-static/` and catches configuration or bundling errors.
- `bunx vitest run` runs Storybook-backed tests headlessly in Chromium. Install Playwright's Chromium binary first if the command reports it missing (`bunx playwright install chromium`).

## Coding Style & Naming Conventions

Write TypeScript and React function components with two-space indentation, single quotes, and semicolons, matching the existing files. Use PascalCase for components and exported story names (`Header`, `Primary`), camelCase for props and variables, and lowercase CSS filenames (`header.css`). Name stories `<Component>.stories.ts` and keep their default metadata typed with `satisfies Meta<typeof Component>`. Prefer explicit prop interfaces and narrow string unions for variants. No formatter or linter is configured, so preserve the surrounding style and keep imports grouped: external packages, then local modules.

## Testing Guidelines

Vitest uses `@storybook/addon-vitest` with Playwright Chromium. Treat every visual state as a story and add `play` interactions for behavior that requires user input. Accessibility checks are currently reported as TODOs rather than CI failures; still resolve violations before submitting. There is no configured coverage threshold. Run `bunx vitest run` and `bun run build-storybook` before opening a pull request.

## Commit & Pull Request Guidelines

The repository has no commit history yet, so no established message convention exists. Use concise, imperative subjects such as `Add disabled button story`; keep unrelated changes separate. Pull requests should explain the user-visible change, list verification commands, and link relevant issues. Include before/after screenshots or Storybook links for visual changes, and call out dependency or accessibility impacts.

## Implementation Discipline

Before implementing a Material component, inspect the relevant Material 3
Expressive specification and identify:

1. component anatomy
2. supported variants
3. size classes
4. design tokens
5. interaction states
6. motion behavior
7. accessibility semantics
8. web-specific adaptations

Do not invent arbitrary Material-looking values when a documented design token
or component specification is available.
