import { MATERIAL_TYPOGRAPHY_SOURCE } from './source.js';
import {
  MATERIAL_EMPHASIZED_TYPE_SCALE,
  MATERIAL_STANDARD_TYPE_SCALE,
} from './tokens.js';
import type {
  MaterialTypography,
  MaterialTypographyDefinition,
  MaterialTypographyFontFamilies,
  MaterialTypographyOptions,
  MaterialTypographyRoleName,
  MaterialTypographyToken,
  MaterialTypographyTokens,
} from './types.js';

export const MATERIAL_RECOMMENDED_FONT_FAMILIES = Object.freeze({
  brand: 'Roboto, system-ui, sans-serif',
  plain: 'Roboto, system-ui, sans-serif',
} satisfies MaterialTypographyFontFamilies);

const VALUE_CLASSIFICATION = Object.freeze({
  role: 'canonical',
  fontFamily: 'web-decision',
  fontSize: 'canonical',
  lineHeight: 'canonical',
  fontWeight: 'canonical',
  letterSpacing: 'canonical',
} as const);

function resolveFontFamily(value: string | undefined, fallback: string): string {
  const resolved = value?.trim() ?? fallback;
  if (resolved.length === 0) {
    throw new TypeError('font family values must not be empty.');
  }
  return resolved;
}

function resolveToken(
  definition: MaterialTypographyDefinition,
  fontFamilies: MaterialTypographyFontFamilies,
): MaterialTypographyToken {
  return Object.freeze({
    ...definition,
    fontFamily: fontFamilies[definition.fontFamilyRole],
    valueClassification: VALUE_CLASSIFICATION,
  });
}

function resolveTokens(
  fontFamilies: MaterialTypographyFontFamilies,
): MaterialTypographyTokens {
  const definitions: Readonly<
    Record<MaterialTypographyRoleName, MaterialTypographyDefinition>
  > = {
    ...MATERIAL_STANDARD_TYPE_SCALE,
    ...MATERIAL_EMPHASIZED_TYPE_SCALE,
  };

  return Object.freeze(
    Object.fromEntries(
      Object.entries(definitions).map(([role, definition]) => [
        role,
        resolveToken(definition, fontFamilies),
      ]),
    ),
  ) as MaterialTypographyTokens;
}

/** Creates a framework-neutral Material type scale without loading fonts. */
export function createMaterialTypography(
  options: MaterialTypographyOptions = {},
): MaterialTypography {
  const fontFamilies = Object.freeze({
    brand: resolveFontFamily(
      options.fontFamilies?.brand,
      MATERIAL_RECOMMENDED_FONT_FAMILIES.brand,
    ),
    plain: resolveFontFamily(
      options.fontFamilies?.plain,
      MATERIAL_RECOMMENDED_FONT_FAMILIES.plain,
    ),
  });

  return Object.freeze({
    roles: resolveTokens(fontFamilies),
    fontFamilies,
    provenance: MATERIAL_TYPOGRAPHY_SOURCE,
  });
}
