export const MATERIAL_ELEVATION_LEVEL_NAMES = [
  'level0',
  'level1',
  'level2',
  'level3',
  'level4',
  'level5',
] as const;

export type MaterialElevationLevelName =
  (typeof MATERIAL_ELEVATION_LEVEL_NAMES)[number];

export type MaterialElevationWebLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type MaterialElevationReferenceDp = 0 | 1 | 3 | 6 | 8 | 12;
export type MaterialElevationClassification =
  | 'canonical'
  | 'translated'
  | 'web-decision';

export interface MaterialElevationLevel {
  readonly name: MaterialElevationLevelName;
  /** Ordinal input consumed by the official Material Web renderer. */
  readonly webLevel: MaterialElevationWebLevel;
  /** Cross-platform reference distance. This is provenance, not a CSS length. */
  readonly referenceDp: MaterialElevationReferenceDp;
  readonly classification: 'canonical';
}

export type MaterialElevationLevels = Readonly<
  Record<MaterialElevationLevelName, MaterialElevationLevel>
>;

export interface MaterialElevationShadowLayer {
  readonly x: `${number}px`;
  readonly y: `${number}px`;
  readonly blur: `${number}px`;
  readonly spread: `${number}px`;
  readonly opacity: 0.3 | 0.15;
  readonly classification: 'canonical';
}

export interface MaterialElevationShadow {
  readonly level: MaterialElevationLevelName;
  readonly key: MaterialElevationShadowLayer;
  readonly ambient: MaterialElevationShadowLayer;
  readonly classification: Readonly<{
    layers: 'canonical';
    boxShadowSerialization: 'translated';
  }>;
}

export type MaterialElevationShadows = Readonly<
  Record<MaterialElevationLevelName, MaterialElevationShadow>
>;

export interface MaterialElevationSource {
  readonly designSystem: 'Google Material 3';
  readonly expressiveScale: 'none-documented';
  readonly materialWebSourceRevision: string;
  readonly materialWebTokenVersion: 'v0.192';
  readonly materialWebSystemTokenSource: string;
  readonly materialWebShadowSource: string;
  readonly materialWebDocumentationSource: string;
  readonly androidXSourceRevision: string;
  readonly androidXTokenVersion: 'v0_103';
  readonly androidXTokenSource: string;
  readonly androidXTonalElevationSource: string;
  readonly tonalElevationPolicy: Readonly<{
    implemented: false;
    classification: 'web-decision';
    treatment: 'separate-color-treatment';
    rationale: string;
  }>;
  readonly classifications: Readonly<{
    levelNames: 'canonical';
    webLevels: 'canonical';
    referenceDp: 'canonical';
    shadowLayers: 'canonical';
    cssLevelSerialization: 'translated';
    cssShadowSerialization: 'translated';
  }>;
}

export type MaterialElevationCssVariable =
  `--md-sys-elevation-${MaterialElevationLevelName}`;
export type MaterialElevationShadowCssVariable =
  `--md-web-elevation-shadow-${MaterialElevationLevelName}`;

export type MaterialElevationCssVariables = Readonly<
  Record<MaterialElevationCssVariable, MaterialElevationWebLevel>
>;

export type MaterialElevationShadowCssVariables = Readonly<
  Record<MaterialElevationShadowCssVariable, string>
>;

export interface MaterialElevationShadowCssOptions {
  /** CSS color used by both official shadow layers. */
  shadowColor?: string;
}

export interface MaterialElevationCssOptions
  extends MaterialElevationShadowCssOptions {
  /** CSS selector receiving the custom properties. Defaults to :root. */
  selector?: string;
  /** Include translated, web-specific shadow strings. Defaults to true. */
  includeShadows?: boolean;
}
