export const MATERIAL_WIDTH_CLASS_NAMES = [
  'compact',
  'medium',
  'expanded',
  'large',
  'extraLarge',
] as const;

export type MaterialWidthClassName =
  (typeof MATERIAL_WIDTH_CLASS_NAMES)[number];

export const MATERIAL_HEIGHT_CLASS_NAMES = [
  'compact',
  'medium',
  'expanded',
] as const;

export type MaterialHeightClassName =
  (typeof MATERIAL_HEIGHT_CLASS_NAMES)[number];
export type MaterialLayoutAxis = 'width' | 'height';
export type MaterialLayoutClassification =
  | 'canonical'
  | 'translated'
  | 'provisional'
  | 'web-decision';

export interface MaterialWindowSizeClassDefinition<
  Name extends string,
  Axis extends MaterialLayoutAxis,
> {
  readonly name: Name;
  readonly axis: Axis;
  /** Canonical Android/Material lower bound. This is not a CSS length. */
  readonly minDp: number;
  /** Exclusive canonical upper bound; null means unbounded. */
  readonly maxExclusiveDp: number | null;
  readonly classification: 'canonical';
}

export type MaterialWidthClass = MaterialWindowSizeClassDefinition<
  MaterialWidthClassName,
  'width'
>;
export type MaterialHeightClass = MaterialWindowSizeClassDefinition<
  MaterialHeightClassName,
  'height'
>;

export interface MaterialWindowSizeClasses {
  readonly width: Readonly<Record<MaterialWidthClassName, MaterialWidthClass>>;
  readonly height: Readonly<Record<MaterialHeightClassName, MaterialHeightClass>>;
}

export interface MaterialWindowSizeClassModel {
  readonly name: 'v1-three-width-classes' | 'v2-five-width-classes';
  readonly status: 'legacy' | 'current';
  readonly androidXField: 'BREAKPOINTS_V1' | 'BREAKPOINTS_V2';
  readonly widthClasses: readonly MaterialWidthClassName[];
  readonly heightClasses: readonly MaterialHeightClassName[];
  readonly classification: 'canonical';
}

export interface MaterialResolvedWindowSizeClass {
  readonly width: MaterialWidthClassName;
  readonly height: MaterialHeightClassName;
  readonly availableCssPx: Readonly<{
    readonly width: number;
    readonly height: number;
  }>;
  readonly classification: 'translated';
}

export const MATERIAL_CANONICAL_LAYOUT_NAMES = [
  'feed',
  'listDetail',
  'supportingPane',
] as const;

export type MaterialCanonicalLayoutName =
  (typeof MATERIAL_CANONICAL_LAYOUT_NAMES)[number];

export interface MaterialCanonicalLayoutPolicy {
  readonly name: MaterialCanonicalLayoutName;
  readonly relationship:
    | 'peer-collection'
    | 'list-to-independent-detail'
    | 'primary-to-dependent-support';
  readonly compact: string;
  readonly medium: string;
  readonly expandedAndAbove: string;
  readonly classification: 'canonical';
}

export type MaterialCanonicalLayoutPolicies = Readonly<
  Record<MaterialCanonicalLayoutName, MaterialCanonicalLayoutPolicy>
>;

export interface MaterialAdaptiveNavigationPolicy {
  readonly currentDefault: Readonly<{
    readonly compactWidth: 'bottom-navigation';
    readonly compactHeightOrTabletop: 'bottom-navigation';
    readonly otherwise: 'side-navigation';
    readonly classification: 'translated';
  }>;
  readonly drawer: Readonly<{
    readonly automaticAtExpandedWidth: false;
    readonly decisionFactors: readonly [
      'destination-count',
      'hierarchy',
      'available-content-width',
    ];
    readonly classification: 'web-decision';
  }>;
  readonly legacySimplifiedMapping: Readonly<{
    readonly compact: 'navigation-bar';
    readonly medium: 'navigation-rail';
    readonly expandedAndAbove: 'navigation-drawer-or-rail';
    readonly classification: 'provisional';
  }>;
}

export interface MaterialLayoutQueryPolicy {
  readonly viewport: Readonly<{
    readonly useFor: readonly [
      'top-level-application-composition',
      'viewport-bound-navigation',
      'safe-area-coordination',
    ];
    readonly feature: 'width';
  }>;
  readonly container: Readonly<{
    readonly useFor: readonly [
      'embedded-adaptive-composition',
      'pane-or-region',
      'reusable-layout',
    ];
    readonly type: 'inline-size';
    readonly feature: 'inline-size';
  }>;
  readonly primitiveComponentsAreViewportIndependent: true;
  readonly cssPreferredOverRuntimeMeasurement: true;
  readonly classification: 'web-decision';
}

export interface MaterialAdaptiveLayoutWebPolicy {
  readonly browserZoomPreserved: true;
  readonly devicePixelRatioBreakpointLogic: false;
  readonly logicalPropertiesPreferred: true;
  readonly runtimeResizeHooksRequired: false;
  readonly serverWidthBranchingRecommended: false;
  readonly requirements: readonly string[];
  readonly classification: 'web-decision';
}

export interface MaterialLayoutWebTranslationPolicy {
  readonly sourceUnit: 'dp';
  readonly cssUnit: 'px';
  readonly numericMapping: 'same-number';
  readonly physicalEquivalenceClaimed: false;
  readonly devicePixelRatioUsed: false;
  readonly classification: 'translated';
}

export interface MaterialAdaptiveLayoutSource {
  readonly designSystem: 'Google Material 3';
  readonly androidXSourceRevision: string;
  readonly androidXWindowSizeClassSource: string;
  readonly androidWindowSizeGuidanceSource: string;
  readonly androidWindowSizeGuidanceUpdated: '2026-08-04';
  readonly materialWindowClassRelationship:
    'three-material-classes-plus-two-android-large-width-extensions';
  readonly materialWindowClassLinkedPageStatus:
    'unavailable-during-2026-09-02-audit';
  readonly materialCanonicalLayoutSource: string;
  readonly androidCanonicalLayoutSource: string;
  readonly androidAdaptiveNavigationSource: string;
  readonly androidXAdaptiveNavigationSource: string;
  readonly cssContainerQuerySource: string;
  readonly classifications: Readonly<{
    readonly thresholdsDp: 'canonical';
    readonly cssPxMapping: 'translated';
    readonly querySerialization: 'translated';
    readonly canonicalLayoutRelationships: 'canonical';
    readonly navigationWebPolicy: 'web-decision';
  }>;
}

export type MaterialLayoutBreakpointCssVariable =
  | `--md-web-layout-breakpoint-width-${'compact' | 'medium' | 'expanded' | 'large' | 'extra-large'}`
  | `--md-web-layout-breakpoint-height-${MaterialHeightClassName}`;

export type MaterialLayoutBreakpointCssVariables = Readonly<
  Record<MaterialLayoutBreakpointCssVariable, `${number}px`>
>;

export interface MaterialAdaptiveLayoutCssOptions {
  /** CSS selector receiving translated breakpoint references. Defaults to :root. */
  readonly selector?: string;
}
