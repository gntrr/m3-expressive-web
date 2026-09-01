export const MATERIAL_COLOR_MODES = ['light', 'dark'] as const;

export type MaterialColorMode = (typeof MATERIAL_COLOR_MODES)[number];

export const MATERIAL_SCHEME_VARIANTS = [
  'monochrome',
  'neutral',
  'tonalSpot',
  'vibrant',
  'expressive',
  'fidelity',
  'content',
  'rainbow',
  'fruitSalad',
] as const;

export type MaterialSchemeVariant = (typeof MATERIAL_SCHEME_VARIANTS)[number];

export const MATERIAL_TONAL_PALETTE_NAMES = [
  'primary',
  'secondary',
  'tertiary',
  'neutral',
  'neutralVariant',
  'error',
] as const;

export type MaterialTonalPaletteName =
  (typeof MATERIAL_TONAL_PALETTE_NAMES)[number];

export const MATERIAL_TONES = [
  0,
  10,
  20,
  30,
  40,
  50,
  60,
  70,
  80,
  90,
  95,
  99,
  100,
] as const;

export type MaterialTone = (typeof MATERIAL_TONES)[number];

/**
 * Semantic roles exposed by Material Color Utilities 0.4.0 using the 2025
 * phone color specification. Palette key colors are intentionally excluded.
 */
export const MATERIAL_COLOR_ROLES = [
  'background',
  'onBackground',
  'surface',
  'surfaceDim',
  'surfaceBright',
  'surfaceContainerLowest',
  'surfaceContainerLow',
  'surfaceContainer',
  'surfaceContainerHigh',
  'surfaceContainerHighest',
  'onSurface',
  'surfaceVariant',
  'onSurfaceVariant',
  'inverseSurface',
  'inverseOnSurface',
  'outline',
  'outlineVariant',
  'shadow',
  'scrim',
  'surfaceTint',
  'primary',
  'primaryDim',
  'onPrimary',
  'primaryContainer',
  'onPrimaryContainer',
  'primaryFixed',
  'primaryFixedDim',
  'onPrimaryFixed',
  'onPrimaryFixedVariant',
  'inversePrimary',
  'secondary',
  'secondaryDim',
  'onSecondary',
  'secondaryContainer',
  'onSecondaryContainer',
  'secondaryFixed',
  'secondaryFixedDim',
  'onSecondaryFixed',
  'onSecondaryFixedVariant',
  'tertiary',
  'tertiaryDim',
  'onTertiary',
  'tertiaryContainer',
  'onTertiaryContainer',
  'tertiaryFixed',
  'tertiaryFixedDim',
  'onTertiaryFixed',
  'onTertiaryFixedVariant',
  'error',
  'errorDim',
  'onError',
  'errorContainer',
  'onErrorContainer',
] as const;

export type MaterialColorRole = (typeof MATERIAL_COLOR_ROLES)[number];

export type HexColor = `#${string}`;

export type MaterialColorRoles = Readonly<
  Record<MaterialColorRole, HexColor>
>;

export type MaterialTonalPalette = Readonly<
  Record<MaterialTone, HexColor>
>;

export type MaterialTonalPalettes = Readonly<
  Record<MaterialTonalPaletteName, MaterialTonalPalette>
>;

export interface MaterialColorSchemeOptions {
  /** An opaque sRGB color in #RGB or #RRGGBB notation. */
  seed: string;
  /** An official Material Color Utilities dynamic-scheme variant. */
  variant: MaterialSchemeVariant;
  /** A continuous value from -1 (minimum) to 1 (maximum). */
  contrastLevel: number;
  mode: MaterialColorMode;
}

export interface MaterialColorSource {
  readonly packageName: '@material/material-color-utilities';
  readonly packageVersion: '0.4.0';
  readonly packageIntegrity: string;
  readonly sourceRepository: string;
  readonly sourceRevision: string;
  readonly materialSpecVersion: '2025';
  readonly materialPlatform: 'phone';
}

export interface MaterialColorProvenance extends MaterialColorSource {
  readonly seed: HexColor;
  readonly variant: MaterialSchemeVariant;
  readonly contrastLevel: number;
  readonly mode: MaterialColorMode;
}

export interface MaterialColorScheme {
  readonly roles: MaterialColorRoles;
  readonly palettes: MaterialTonalPalettes;
  readonly provenance: MaterialColorProvenance;
}

export type MaterialColorCssVariable = `--md-sys-color-${string}`;

export type MaterialColorCssVariables = Readonly<
  Record<MaterialColorCssVariable, HexColor>
>;

export interface MaterialColorCssOptions {
  /** CSS selector receiving the generated custom properties. Defaults to :root. */
  selector?: string;
}
