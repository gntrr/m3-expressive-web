# v0 architecture and integration audit

Audit date: 2026-10-10. This is a source/build audit, not a claim that the
library has been published or exercised in a production consumer.

## Current health

The library is a strict, ESM-only React 19 package built by tsup. It has
explicit root, component, foundation, generator, and stylesheet export-map
entries; React and ReactDOM are peers. The `sideEffects` declaration preserves
CSS, and the MCU-backed color generator is isolated at
`foundation/color/generator`. Normal root/component imports do not reference
MCU. Components are native HTML primitives with no package-level client
directive, browser-global access, hooks, or runtime animation dependency.

Storybook discovers colocated stories and runs Chromium-backed browser tests
with a11y failures configured as errors. Unit tests run in jsdom. The build
emits declarations, source maps, unbundled ESM modules, and CSS. Declaration
generation is the slow build phase; keep the current 4 GiB Node heap allowance
until a measured replacement is validated.

## What this audit added

- `bun run test:package` packs the built `dist/`, extracts it into a temporary
  consumer, validates every export target and declaration, imports every public
  ESM subpath, rejects an internal path, and checks ordinary entries for MCU.
- `bun run check:bundle-size` uses raw, unminified tsup-entry budgets recorded
  in `bundle-size-baseline.json`. It is a regression guard, not a substitute
  for consumer-bundler tree-shaking analysis.
- `material-provenance.json` inventories the pinned source record; individual
  source files and `SPEC.md` documents remain authoritative for details.
- `API_STABILITY.md` distinguishes supported v0 contracts from provisional
  web translations and intentionally absent runtime features.

## Package, SSR, and integration findings

| Area | Finding | Status |
| --- | --- | --- |
| Export map | Public subpaths are explicit; internal paths are blocked. | Healthy |
| Packed artifact | Archive contains `dist` plus package metadata and README. | Automated smoke coverage |
| Peer dependencies | React and ReactDOM use `^19.0.0`; no component runtime dependency is bundled. | Healthy |
| SSR | Source inspection found no browser-global or client-only package runtime. | Source-level only |
| Next.js | No real consumer fixture exists. Installing Next solely for this audit would add a new dependency. | P1 gated recommendation |
| CSS | A single opt-in `styles.css` export exists; component CSS is emitted as side-effectful files. | Healthy |
| CSS duplication | Similar visual-shell patterns are intentionally private and component-specific where semantics differ. | P2 review, no refactor |

Use a real Next.js fixture before publishing: install the packed tarball into an
isolated app, server-render a foundation/component page, hydrate controlled
examples from a consumer client boundary, and verify CSS import order. Do not
add that dependency implicitly to this private library.

## Performance and artifact findings

`dist/` is approximately 1.7 MB including source maps. Raw JS is roughly
338 KB; the explicit color-generator entry is about 200 KB and dominates it.
It is correctly opt-in. Current raw budgets are intentionally permissive for
v0: root 1 KB, ordinary component entries 3–20 KB, and generator 256 KB.
Budgets should be recalibrated from minified consumer artifacts before a public
performance promise is made.

No snapshot visual-regression system or cross-browser matrix exists. Chromium
is the configured browser. Add opt-in Firefox/WebKit smoke coverage for
representative semantic stories after a CI browser-cache plan is approved;
forced-colors needs a separately supported environment.

## Accessibility and API findings

Storybook's a11y addon is enabled and browser stories currently provide the
automation surface. Component specs require native buttons, links, radios, or
checkboxes as appropriate; icon-only controls require an accessible name;
controlled selection does not use a generic `selected` abstraction. Current
terminology differences are intentional: `pressed` for toggle buttons,
`selected` for FilterChip, and `value` for native form groups.

Audit components at each release with manual keyboard, focus-visible,
forced-colors, zoom/reflow, RTL, and reduced-motion passes. Automated a11y
does not prove those behaviors. `AGENTS.md` still describes a11y checks as
TODOs; that contributor text should be reconciled with the current
`a11y.test: 'error'` configuration in a dedicated documentation change.

## Prioritized backlog

### P0

None found in source/build inspection.

### P1

- Add a real packed-tarball Next.js SSR/hydration consumer fixture once adding
  and maintaining Next as test infrastructure is approved.
- Add CI to run typecheck, build, package smoke, bundle budget, unit tests,
  Chromium Storybook tests, Storybook build, and `git diff --check`.
- Update contributor documentation to describe the current a11y enforcement.

### P2

- Add selected visual-regression stories and a snapshot policy after browser
  artifact storage/baselines are approved.
- Add Firefox/WebKit smoke coverage with explicit CI provisioning; retain
  Chromium for interaction coverage.
- Measure declaration-build peak RSS and evaluate a declaration-only build
  split only if it materially improves memory without changing emitted types.
- Reassess repeated private CSS visual-shell rules only after a concrete bug or
  shared test proves a safe semantic boundary.

### P3

- Generate API/reference documentation from public declarations.
- Add an import-size report based on a real consumer bundler and minification.
- Establish a formal release/changelog workflow when `private` is removed.

## Release gate

Before a public release, require a clean worktree, full verification, a packed
consumer install (including Next.js), declaration compatibility review, bundle
budget review from minified consumer builds, representative visual/a11y browser
coverage, source-provenance review, and explicit documentation of every
provisional web translation.
