# API stability policy

This library is private and pre-1.0. The labels below describe implementation
confidence and source traceability; they do not override semantic-versioning
decisions made for a future published package.

## Stable within v0

Exports documented in component indexes, foundation indexes, and their tests
are the supported v0 surface. Keep their names, native semantic elements, and
controlled-state contracts compatible unless a release note calls out a
breaking change. This includes Color CSS contracts; the MCU generator remains
an explicit `foundation/color/generator` import.

## Provisional

An API or visual translation is provisional when official Material evidence is
incomplete for the web. It is usable, but may change after source review.

- Expressive geometry uses AndroidX experimental MaterialShapes data.
- Component focus rings, disabled alpha compositing, and selected-icon details
  that require browser translations retain the caveats in each `SPEC.md`.
- `IconButton` square geometry and several Expressive motion targets are
  explicitly provisional. No CSS spring approximation is implied.
- Adaptive-layout CSS policy is a web translation, not a component mandate.

## Experimental and intentionally absent

No public animation runtime, ThemeProvider, ripple runtime, generic
polymorphic `as` API, or component-level responsive resizing is supported.
Non-rectangular shape rendering and morphing remain framework-neutral
foundation data, not a rendering promise.

## Change policy

Before changing a public token or component: re-audit the pinned source,
record provenance in the relevant source file/SPEC and
`material-provenance.json`, update deterministic tests and Storybook coverage,
and state the compatibility impact in release notes. Do not silently replace a
canonical source value with a web approximation.
