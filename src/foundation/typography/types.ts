export const MATERIAL_TYPOGRAPHY_ROLES = [
  'displayLarge',
  'displayMedium',
  'displaySmall',
  'headlineLarge',
  'headlineMedium',
  'headlineSmall',
  'titleLarge',
  'titleMedium',
  'titleSmall',
  'bodyLarge',
  'bodyMedium',
  'bodySmall',
  'labelLarge',
  'labelMedium',
  'labelSmall',
] as const;

export type MaterialTypographyRole = (typeof MATERIAL_TYPOGRAPHY_ROLES)[number];

export const MATERIAL_EMPHASIZED_TYPOGRAPHY_ROLES = [
  'displayLargeEmphasized',
  'displayMediumEmphasized',
  'displaySmallEmphasized',
  'headlineLargeEmphasized',
  'headlineMediumEmphasized',
  'headlineSmallEmphasized',
  'titleLargeEmphasized',
  'titleMediumEmphasized',
  'titleSmallEmphasized',
  'bodyLargeEmphasized',
  'bodyMediumEmphasized',
  'bodySmallEmphasized',
  'labelLargeEmphasized',
  'labelMediumEmphasized',
  'labelSmallEmphasized',
] as const;

export type MaterialEmphasizedTypographyRole =
  (typeof MATERIAL_EMPHASIZED_TYPOGRAPHY_ROLES)[number];

export type MaterialTypographyRoleName =
  | MaterialTypographyRole
  | MaterialEmphasizedTypographyRole;

export type MaterialTypographyClassification =
  | 'canonical'
  | 'translated'
  | 'provisional'
  | 'web-decision';

export type MaterialTypefaceRole = 'brand' | 'plain';
export type MaterialFontWeight = 400 | 500 | 700;
export type RemValue = `${number}rem`;

export interface MaterialTypographyDefinition {
  readonly fontFamilyRole: MaterialTypefaceRole;
  readonly fontSize: RemValue;
  readonly lineHeight: RemValue;
  readonly fontWeight: MaterialFontWeight;
  readonly letterSpacing: RemValue;
  readonly classification: 'canonical';
}

export interface MaterialTypographyValueClassification {
  readonly role: 'canonical';
  readonly fontFamily: 'web-decision';
  readonly fontSize: 'canonical';
  readonly lineHeight: 'canonical';
  readonly fontWeight: 'canonical';
  readonly letterSpacing: 'canonical';
}

export interface MaterialTypographyToken extends MaterialTypographyDefinition {
  readonly fontFamily: string;
  readonly valueClassification: MaterialTypographyValueClassification;
}

export type MaterialTypographyDefinitions = Readonly<
  Record<MaterialTypographyRole, MaterialTypographyDefinition>
>;

export type MaterialEmphasizedTypographyDefinitions = Readonly<
  Record<MaterialEmphasizedTypographyRole, MaterialTypographyDefinition>
>;

export type MaterialTypographyTokens = Readonly<
  Record<MaterialTypographyRoleName, MaterialTypographyToken>
>;

export interface MaterialTypographyFontFamilies {
  readonly brand: string;
  readonly plain: string;
}

export interface MaterialTypographyOptions {
  /** Override either family stack without changing role metrics. */
  fontFamilies?: Partial<MaterialTypographyFontFamilies>;
}

export interface MaterialTypographySource {
  readonly designSystem: 'Google Material 3';
  readonly tokenVersion: '34.0.21';
  readonly sourceRepository: string;
  readonly sourceRevision: string;
  readonly standardSource: string;
  readonly emphasizedSource: string;
  readonly typefaceSource: string;
  readonly androidXCrossCheckRevision: string;
  readonly androidXTokenVersion: 'v0_103';
  readonly unitPolicy: string;
  readonly classifications: Readonly<{
    standardMetrics: 'canonical';
    emphasizedMetrics: 'canonical';
    cssSerialization: 'translated';
    fontFamilies: 'web-decision';
    excludedAndroidEmphasizedMetrics: 'provisional';
  }>;
}

export interface MaterialTypography {
  readonly roles: MaterialTypographyTokens;
  readonly fontFamilies: MaterialTypographyFontFamilies;
  readonly provenance: MaterialTypographySource;
}

export const MATERIAL_TYPOGRAPHY_CSS_PROPERTIES = [
  'font',
  'size',
  'lineHeight',
  'weight',
  'tracking',
] as const;

export type MaterialTypographyCssProperty =
  (typeof MATERIAL_TYPOGRAPHY_CSS_PROPERTIES)[number];

export type MaterialTypographyCssVariable = `--md-${string}`;
export type MaterialTypographyCssValue = string | number;
export type MaterialTypographyCssVariables = Readonly<
  Record<MaterialTypographyCssVariable, MaterialTypographyCssValue>
>;

export interface MaterialTypographyCssOptions {
  /** CSS selector receiving the generated custom properties. Defaults to :root. */
  selector?: string;
}
