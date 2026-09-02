# Typography Foundation

This module represents the Material 3 type scale without React, font files, or
runtime style injection. It includes the 15 standard roles and the 15
emphasized roles in Google's current static-font web token snapshot.

```ts
import {
  createMaterialTypography,
  toMaterialTypographyCss,
} from 'm3-expressive-web/foundation/typography';

const typography = createMaterialTypography({
  fontFamilies: {
    brand: 'Roboto Flex, Roboto, system-ui, sans-serif',
    plain: 'Inter, system-ui, sans-serif',
  },
});

const css = toMaterialTypographyCss(typography);
```

Consumers load their chosen fonts. This package neither bundles nor requests
Roboto. The recommended fallback is `Roboto, system-ui, sans-serif`; the stack
is a web decision, while role metrics remain canonical Material data.

## Provenance and classification

Standard and emphasized metrics come from the official Material Web generated
tokens, design-system version `34.0.21`, pinned at revision
`c05b4b23485c803f68ff31cde52506cea5cc555a`. Role metrics are classified
`canonical`. CSS serialization is `translated`, and default or consumer font
stacks are `web-decision`.

AndroidX `v0_103` is a cross-check, not the web data source. Its emphasized
token block still says generated tokens are pending, so those Android values
are classified `provisional` and excluded.

## Web unit policy

The official web tokens already express size, line height, and tracking in
`rem`. Their nominal conversion is Android `sp / 16`, but CSS does not emulate
`sp`. The library does not change the root font size, preserving browser zoom,
user defaults, text reflow, and scalable units. Roles do not change at viewport
breakpoints.

Normal `font-weight` values support static and variable fonts. The serializer
does not emit font-axis settings, optical sizing, `font-synthesis`, or font
loading rules because those depend on the consumer's selected typeface. Load
the required 400, 500, and 700 weights and decide whether fallback synthesis is
acceptable for the application.
