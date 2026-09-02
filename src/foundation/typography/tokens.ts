import type {
  MaterialEmphasizedTypographyDefinitions,
  MaterialFontWeight,
  MaterialTypographyDefinition,
  MaterialTypographyDefinitions,
} from './types.js';

function token(
  definition: Omit<MaterialTypographyDefinition, 'classification'>,
): MaterialTypographyDefinition {
  return Object.freeze({ ...definition, classification: 'canonical' });
}

export const MATERIAL_STANDARD_TYPE_SCALE = Object.freeze({
  displayLarge: token({
    fontFamilyRole: 'brand', fontSize: '3.5625rem', lineHeight: '4rem',
    fontWeight: 400, letterSpacing: '-0.015625rem',
  }),
  displayMedium: token({
    fontFamilyRole: 'brand', fontSize: '2.8125rem', lineHeight: '3.25rem',
    fontWeight: 400, letterSpacing: '0rem',
  }),
  displaySmall: token({
    fontFamilyRole: 'brand', fontSize: '2.25rem', lineHeight: '2.75rem',
    fontWeight: 400, letterSpacing: '0rem',
  }),
  headlineLarge: token({
    fontFamilyRole: 'brand', fontSize: '2rem', lineHeight: '2.5rem',
    fontWeight: 400, letterSpacing: '0rem',
  }),
  headlineMedium: token({
    fontFamilyRole: 'brand', fontSize: '1.75rem', lineHeight: '2.25rem',
    fontWeight: 400, letterSpacing: '0rem',
  }),
  headlineSmall: token({
    fontFamilyRole: 'brand', fontSize: '1.5rem', lineHeight: '2rem',
    fontWeight: 400, letterSpacing: '0rem',
  }),
  titleLarge: token({
    fontFamilyRole: 'brand', fontSize: '1.375rem', lineHeight: '1.75rem',
    fontWeight: 400, letterSpacing: '0rem',
  }),
  titleMedium: token({
    fontFamilyRole: 'plain', fontSize: '1rem', lineHeight: '1.5rem',
    fontWeight: 500, letterSpacing: '0.009375rem',
  }),
  titleSmall: token({
    fontFamilyRole: 'plain', fontSize: '0.875rem', lineHeight: '1.25rem',
    fontWeight: 500, letterSpacing: '0.00625rem',
  }),
  bodyLarge: token({
    fontFamilyRole: 'plain', fontSize: '1rem', lineHeight: '1.5rem',
    fontWeight: 400, letterSpacing: '0.03125rem',
  }),
  bodyMedium: token({
    fontFamilyRole: 'plain', fontSize: '0.875rem', lineHeight: '1.25rem',
    fontWeight: 400, letterSpacing: '0.015625rem',
  }),
  bodySmall: token({
    fontFamilyRole: 'plain', fontSize: '0.75rem', lineHeight: '1rem',
    fontWeight: 400, letterSpacing: '0.025rem',
  }),
  labelLarge: token({
    fontFamilyRole: 'plain', fontSize: '0.875rem', lineHeight: '1.25rem',
    fontWeight: 500, letterSpacing: '0.00625rem',
  }),
  labelMedium: token({
    fontFamilyRole: 'plain', fontSize: '0.75rem', lineHeight: '1rem',
    fontWeight: 500, letterSpacing: '0.03125rem',
  }),
  labelSmall: token({
    fontFamilyRole: 'plain', fontSize: '0.6875rem', lineHeight: '1rem',
    fontWeight: 500, letterSpacing: '0.03125rem',
  }),
} satisfies MaterialTypographyDefinitions);

function emphasized(
  definition: MaterialTypographyDefinition,
  fontWeight: MaterialFontWeight,
): MaterialTypographyDefinition {
  return token({ ...definition, fontWeight });
}

/**
 * Official static-font, platform-web emphasized tokens from Material 3
 * design-system version 34.0.21. AndroidX's provisional emphasized block is
 * intentionally not used.
 */
export const MATERIAL_EMPHASIZED_TYPE_SCALE = Object.freeze({
  displayLargeEmphasized: emphasized(MATERIAL_STANDARD_TYPE_SCALE.displayLarge, 500),
  displayMediumEmphasized: emphasized(MATERIAL_STANDARD_TYPE_SCALE.displayMedium, 500),
  displaySmallEmphasized: emphasized(MATERIAL_STANDARD_TYPE_SCALE.displaySmall, 500),
  headlineLargeEmphasized: emphasized(MATERIAL_STANDARD_TYPE_SCALE.headlineLarge, 500),
  headlineMediumEmphasized: emphasized(MATERIAL_STANDARD_TYPE_SCALE.headlineMedium, 500),
  headlineSmallEmphasized: emphasized(MATERIAL_STANDARD_TYPE_SCALE.headlineSmall, 500),
  titleLargeEmphasized: emphasized(MATERIAL_STANDARD_TYPE_SCALE.titleLarge, 500),
  titleMediumEmphasized: emphasized(MATERIAL_STANDARD_TYPE_SCALE.titleMedium, 700),
  titleSmallEmphasized: emphasized(MATERIAL_STANDARD_TYPE_SCALE.titleSmall, 700),
  bodyLargeEmphasized: emphasized(MATERIAL_STANDARD_TYPE_SCALE.bodyLarge, 500),
  bodyMediumEmphasized: emphasized(MATERIAL_STANDARD_TYPE_SCALE.bodyMedium, 500),
  bodySmallEmphasized: emphasized(MATERIAL_STANDARD_TYPE_SCALE.bodySmall, 500),
  labelLargeEmphasized: emphasized(MATERIAL_STANDARD_TYPE_SCALE.labelLarge, 700),
  labelMediumEmphasized: emphasized(MATERIAL_STANDARD_TYPE_SCALE.labelMedium, 700),
  labelSmallEmphasized: emphasized(MATERIAL_STANDARD_TYPE_SCALE.labelSmall, 700),
} satisfies MaterialEmphasizedTypographyDefinitions);
