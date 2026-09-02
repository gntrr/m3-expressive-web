export const MATERIAL_SHAPE_CORNER_ROLES = [
  'none',
  'extraSmall',
  'extraSmallTop',
  'small',
  'medium',
  'large',
  'largeIncreased',
  'largeStart',
  'largeEnd',
  'largeTop',
  'extraLarge',
  'extraLargeIncreased',
  'extraLargeTop',
  'extraExtraLarge',
  'full',
] as const;

export type MaterialShapeCornerRole =
  (typeof MATERIAL_SHAPE_CORNER_ROLES)[number];

export const MATERIAL_EXPRESSIVE_SHAPE_NAMES = [
  'circle',
  'square',
  'slanted',
  'arch',
  'fan',
  'arrow',
  'semiCircle',
  'oval',
  'pill',
  'triangle',
  'diamond',
  'clamShell',
  'pentagon',
  'gem',
  'sunny',
  'verySunny',
  'cookie4Sided',
  'cookie6Sided',
  'cookie7Sided',
  'cookie9Sided',
  'cookie12Sided',
  'ghostish',
  'clover4Leaf',
  'clover8Leaf',
  'burst',
  'softBurst',
  'boom',
  'softBoom',
  'flower',
  'puffy',
  'puffyDiamond',
  'pixelCircle',
  'pixelTriangle',
  'bun',
  'heart',
] as const;

export type MaterialExpressiveShapeName =
  (typeof MATERIAL_EXPRESSIVE_SHAPE_NAMES)[number];

export type MaterialShapeClassification =
  | 'canonical'
  | 'translated'
  | 'provisional'
  | 'web-decision';

export type MaterialShapeGeneration = 'baseline' | 'expressive';
export type MaterialShapeDirection = 'ltr' | 'rtl';
export type MaterialShapeCssLength = `${number}px`;
export type MaterialShapeCssVariable = `--md-sys-shape-corner-${string}`;

export interface MaterialLogicalCorners {
  readonly topStart: MaterialShapeCssLength;
  readonly topEnd: MaterialShapeCssLength;
  readonly bottomEnd: MaterialShapeCssLength;
  readonly bottomStart: MaterialShapeCssLength;
}

export interface MaterialShapeCornerDefinition {
  readonly role: MaterialShapeCornerRole;
  readonly corners: MaterialLogicalCorners;
  readonly generation: MaterialShapeGeneration;
  readonly classification: 'canonical';
}

export type MaterialShapeCornerDefinitions = Readonly<
  Record<MaterialShapeCornerRole, MaterialShapeCornerDefinition>
>;

export interface MaterialShapePoint {
  readonly x: number;
  readonly y: number;
}

export interface MaterialShapeCubicSegment {
  readonly start: MaterialShapePoint;
  readonly control1: MaterialShapePoint;
  readonly control2: MaterialShapePoint;
  readonly end: MaterialShapePoint;
}

export interface MaterialNormalizedShapeGeometry {
  readonly kind: 'cubic-path';
  readonly viewBox: readonly [0, 0, 1, 1];
  readonly center: MaterialShapePoint;
  readonly closed: true;
  readonly segments: readonly MaterialShapeCubicSegment[];
  readonly classification: 'translated';
}

export interface MaterialExpressiveShape {
  readonly name: MaterialExpressiveShapeName;
  readonly androidName: string;
  readonly geometry: MaterialNormalizedShapeGeometry;
  readonly stability: 'experimental';
  readonly classification: Readonly<{
    definition: 'canonical';
    geometry: 'translated';
  }>;
}

export type MaterialExpressiveShapes = Readonly<
  Record<MaterialExpressiveShapeName, MaterialExpressiveShape>
>;

export interface MaterialShapeSource {
  readonly designSystem: 'Google Material 3';
  readonly webTokenVersion: '34.0.21';
  readonly webSourceRevision: string;
  readonly webShapeTokenSource: string;
  readonly androidXSourceRevision: string;
  readonly androidXShapeTokenVersion: '14_1_0';
  readonly androidXShapeTokenSource: string;
  readonly androidXMaterialShapesSource: string;
  readonly androidXGeometrySource: string;
  readonly expressiveApiStability: 'experimental';
  readonly normalizationPolicy: string;
  readonly classifications: Readonly<{
    cornerRoles: 'canonical';
    expressiveDefinitions: 'canonical';
    normalizedGeometry: 'translated';
    cssSerialization: 'translated';
    svgSerialization: 'translated';
    rtlSerialization: 'web-decision';
  }>;
}

export type MaterialShapeCssVariables = Readonly<
  Record<MaterialShapeCssVariable, string>
>;

export interface MaterialShapeCornerCssOptions {
  direction?: MaterialShapeDirection;
}

export interface MaterialShapeCssOptions {
  /** CSS selector receiving the custom properties. Defaults to :root. */
  selector?: string;
  /** Emit logical start/end overrides for :dir(rtl). Defaults to true. */
  includeRtlOverrides?: boolean;
}

export interface MaterialShapeSvgOptions {
  /** Decimal places in serialized coordinates. Defaults to 6. */
  precision?: number;
}
