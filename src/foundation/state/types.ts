export const MATERIAL_INTERACTION_STATE_NAMES = [
  'enabled',
  'hover',
  'focus',
  'pressed',
  'dragged',
  'disabled',
] as const;

export type MaterialInteractionStateName =
  (typeof MATERIAL_INTERACTION_STATE_NAMES)[number];

export const MATERIAL_STATE_LAYER_NAMES = [
  'hover',
  'focus',
  'pressed',
  'dragged',
] as const;

export type MaterialStateLayerName =
  (typeof MATERIAL_STATE_LAYER_NAMES)[number];

export type MaterialStateLayerOpacity = 0.08 | 0.1 | 0.16;
export type MaterialStateClassification =
  | 'canonical'
  | 'translated'
  | 'provisional'
  | 'web-decision';

export interface MaterialInteractionState {
  readonly name: MaterialInteractionStateName;
  readonly category: 'baseline' | 'state-layer' | 'availability';
  readonly visualState: 'default' | MaterialInteractionStateName;
  readonly interactive: boolean;
  readonly stateLayerOpacity: MaterialStateLayerOpacity | null;
  readonly classification: 'canonical';
}

export type MaterialInteractionStates = Readonly<
  Record<MaterialInteractionStateName, MaterialInteractionState>
>;

export const MATERIAL_COMPONENT_SEMANTIC_STATE_NAMES = [
  'selected',
  'checked',
  'activated',
  'expanded',
  'error',
] as const;

export type MaterialComponentSemanticStateName =
  (typeof MATERIAL_COMPONENT_SEMANTIC_STATE_NAMES)[number];

export interface MaterialComponentSemanticState {
  readonly name: MaterialComponentSemanticStateName;
  readonly axis: 'selection' | 'value' | 'activation' | 'disclosure' | 'validity';
  readonly composesWithInteraction: true;
  readonly suppliesStateLayerOpacity: false;
  readonly classification: 'canonical';
}

export type MaterialComponentSemanticStates = Readonly<
  Record<MaterialComponentSemanticStateName, MaterialComponentSemanticState>
>;

export interface MaterialStateCompositionInput {
  /** Concurrent interaction states. Omit for the enabled/default baseline. */
  readonly interactionStates?: readonly MaterialInteractionStateName[];
  /** Orthogonal component meaning retained independently of interaction. */
  readonly semanticStates?: readonly MaterialComponentSemanticStateName[];
  /** Whether the element currently has DOM focus, regardless of indication. */
  readonly domFocused?: boolean;
  /** Whether the UA indicates focus, normally represented by :focus-visible. */
  readonly focusVisible?: boolean;
}

export interface MaterialResolvedStateComposition {
  readonly interactionState: MaterialInteractionStateName;
  readonly activeInteractionStates: readonly MaterialInteractionStateName[];
  readonly semanticStates: readonly MaterialComponentSemanticStateName[];
  readonly stateLayerOpacity: MaterialStateLayerOpacity | null;
  readonly stateLayerColor: 'component-defined' | null;
  readonly interactive: boolean;
  readonly domFocused: boolean;
  readonly showFocusIndicator: boolean;
  readonly classification: 'web-decision';
}

export interface MaterialDisabledStatePolicy {
  readonly stateLayerOpacity: null;
  readonly suppressesInteractionStateLayers: true;
  readonly containerOpacity: 'component-specific';
  readonly contentOpacityReference: Readonly<{
    readonly value: 0.38;
    readonly scope: 'common-component-token-reference';
    readonly universalSystemToken: false;
    readonly classification: 'canonical';
  }>;
  readonly nativeDisabledPreferredWhenAvailable: true;
  readonly ariaDisabledRequiresManualSuppression: true;
  readonly classification: 'translated';
}

export interface MaterialFocusPolicy {
  readonly domFocusSelector: ':focus';
  readonly visibleFocusSelector: ':focus-visible';
  readonly visibleIndicatorIsSeparateFromStateLayer: true;
  readonly removeUserAgentOutlineWithoutReplacement: false;
  readonly classification: 'web-decision';
}

export interface MaterialPointerPolicy {
  readonly hoverCapabilityQuery: '(hover: hover)';
  readonly coarsePointerQuery: '(pointer: coarse)';
  readonly anyCoarsePointerQuery: '(any-pointer: coarse)';
  readonly hoverIsSupplemental: true;
  readonly classification: 'web-decision';
}

export interface MaterialForcedColorsPolicy {
  readonly mediaQuery: '(forced-colors: active)';
  readonly suppressTranslucentStateLayers: true;
  readonly preserveUserAgentAdjustment: true;
  readonly fallbackChannels: readonly [
    'native-boundary',
    'system-color-outline',
    'text-or-symbol',
  ];
  readonly classification: 'web-decision';
}

export interface MaterialStateSource {
  readonly designSystem: 'Google Material 3';
  readonly expressiveStateScale: 'none-documented';
  readonly materialGuidanceSource: string;
  readonly androidXSourceRevision: string;
  readonly androidXTokenVersion: 'v0_210';
  readonly androidXTokenSource: string;
  readonly materialWebSourceRevision: string;
  readonly materialWebTokenVersion: 'v0.192';
  readonly materialWebTokenSource: string;
  readonly materialWebRippleSource: string;
  readonly materialWebDisabledTokenSource: string;
  readonly legacyWebOpacityDifference: Readonly<{
    readonly focus: 0.12;
    readonly pressed: 0.12;
    readonly resolution: 'current-androidx-system-tokens-take-precedence';
  }>;
  readonly webStandards: Readonly<{
    readonly focusVisible: string;
    readonly pointerCapabilities: string;
    readonly forcedColors: string;
    readonly wcag22: string;
    readonly ariaDisabled: string;
  }>;
  readonly classifications: Readonly<{
    readonly stateSemantics: 'canonical';
    readonly stateLayerOpacities: 'canonical';
    readonly componentSemanticAxes: 'canonical';
    readonly precedence: 'web-decision';
    readonly cssSerialization: 'translated';
    readonly accessibilityPolicies: 'web-decision';
  }>;
}

export type MaterialStateCssVariable =
  `--md-sys-state-${MaterialStateLayerName}-state-layer-opacity`;

export type MaterialStateCssVariables = Readonly<
  Record<MaterialStateCssVariable, MaterialStateLayerOpacity>
>;

export interface MaterialStateCssOptions {
  /** CSS selector receiving the custom properties. Defaults to :root. */
  readonly selector?: string;
}
