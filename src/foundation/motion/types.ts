export const MATERIAL_MOTION_SCHEME_NAMES = ['standard', 'expressive'] as const;
export type MaterialMotionSchemeName =
  (typeof MATERIAL_MOTION_SCHEME_NAMES)[number];

export const MATERIAL_MOTION_CATEGORIES = [
  'fastSpatial',
  'defaultSpatial',
  'slowSpatial',
  'fastEffects',
  'defaultEffects',
  'slowEffects',
] as const;
export type MaterialMotionCategory =
  (typeof MATERIAL_MOTION_CATEGORIES)[number];
export type MaterialMotionIntent = 'spatial' | 'effects';
export type MaterialMotionSpeed = 'fast' | 'default' | 'slow';
export type MaterialMotionClassification =
  | 'canonical'
  | 'translated'
  | 'provisional'
  | 'web-decision';

export interface MaterialMotionSpringModel {
  readonly kind: 'spring';
  readonly dampingRatio: number;
  readonly stiffness: number;
  readonly fixedDuration: false;
  readonly classification: 'canonical';
}

export interface MaterialMotionToken {
  readonly category: MaterialMotionCategory;
  readonly intent: MaterialMotionIntent;
  readonly speed: MaterialMotionSpeed;
  readonly model: MaterialMotionSpringModel;
  readonly classification: 'canonical';
}

export type MaterialMotionTokens = Readonly<
  Record<MaterialMotionCategory, MaterialMotionToken>
>;

export interface MaterialMotionScheme {
  readonly name: MaterialMotionSchemeName;
  readonly description: string;
  readonly tokens: MaterialMotionTokens;
  readonly classification: 'canonical';
}

export type MaterialMotionSchemes = Readonly<
  Record<MaterialMotionSchemeName, MaterialMotionScheme>
>;

export const MATERIAL_MOTION_DURATION_NAMES = [
  'short1',
  'short2',
  'short3',
  'short4',
  'medium1',
  'medium2',
  'medium3',
  'medium4',
  'long1',
  'long2',
  'long3',
  'long4',
  'extraLong1',
  'extraLong2',
  'extraLong3',
  'extraLong4',
] as const;
export type MaterialMotionDurationName =
  (typeof MATERIAL_MOTION_DURATION_NAMES)[number];

export interface MaterialMotionDurationToken {
  readonly kind: 'duration';
  readonly name: MaterialMotionDurationName;
  readonly milliseconds: number;
  readonly cssValue: `${number}ms`;
  readonly classification: 'canonical';
}

export type MaterialMotionDurations = Readonly<
  Record<MaterialMotionDurationName, MaterialMotionDurationToken>
>;

export const MATERIAL_MOTION_EASING_NAMES = [
  'standard',
  'standardAccelerate',
  'standardDecelerate',
  'emphasized',
  'emphasizedAccelerate',
  'emphasizedDecelerate',
  'linear',
] as const;
export type MaterialMotionEasingName =
  (typeof MATERIAL_MOTION_EASING_NAMES)[number];

export interface MaterialMotionCubicBezier {
  readonly kind: 'cubic-bezier';
  readonly controlPoints: readonly [number, number, number, number];
  readonly classification: 'canonical';
}

export interface MaterialMotionPathEasing {
  readonly kind: 'path';
  readonly path: string;
  readonly classification: 'canonical';
}

export type MaterialMotionCanonicalEasing =
  | MaterialMotionCubicBezier
  | MaterialMotionPathEasing;

export interface MaterialMotionCssEasing {
  readonly kind: 'css-easing';
  readonly value: string;
  readonly classification: 'canonical' | 'translated';
}

export interface MaterialMotionEasingToken {
  readonly name: MaterialMotionEasingName;
  readonly source: MaterialMotionCanonicalEasing;
  readonly css: MaterialMotionCssEasing;
}

export type MaterialMotionEasings = Readonly<
  Record<MaterialMotionEasingName, MaterialMotionEasingToken>
>;

export interface MaterialMotionTimingModel {
  readonly kind: 'timing';
  readonly duration: MaterialMotionDurationToken;
  readonly easing: MaterialMotionEasingToken;
  readonly classification: 'canonical' | 'translated';
}

export type MaterialMotionModel =
  | MaterialMotionSpringModel
  | MaterialMotionTimingModel;

export const MATERIAL_REDUCED_MOTION_CATEGORIES = [
  'decorative',
  'spatial',
  'stateFeedback',
  'essential',
] as const;
export type MaterialReducedMotionCategory =
  (typeof MATERIAL_REDUCED_MOTION_CATEGORIES)[number];

export type MaterialReducedMotionAction =
  | 'remove'
  | 'replace-with-effects'
  | 'preserve-feedback'
  | 'preserve-essential';

export interface MaterialReducedMotionRule {
  readonly category: MaterialReducedMotionCategory;
  readonly action: MaterialReducedMotionAction;
  readonly guidance: string;
  readonly classification: 'web-decision';
}

export interface MaterialReducedMotionPolicy {
  readonly mediaQuery: '(prefers-reduced-motion: reduce)';
  readonly globalZeroDurationReset: false;
  readonly finalStateMustMatch: true;
  readonly rules: Readonly<
    Record<MaterialReducedMotionCategory, MaterialReducedMotionRule>
  >;
  readonly requirements: readonly string[];
  readonly classification: 'web-decision';
}

export interface MaterialMotionSource {
  readonly designSystem: 'Google Material 3';
  readonly androidXSourceRevision: string;
  readonly androidXTokenVersion: 'v0_14_0';
  readonly androidXMotionSchemeSource: string;
  readonly androidXStandardTokenSource: string;
  readonly androidXExpressiveTokenSource: string;
  readonly materialWebSourceRevision: string;
  readonly materialWebTokenVersion: 'v0.192';
  readonly materialWebTokenSource: string;
  readonly materialWebSupportStatus: 'tokens-generated-components-unsupported';
  readonly materialComponentsAndroidRevision: string;
  readonly materialComponentsAndroidMotionSource: string;
  readonly webTranslationPolicy: string;
  readonly classifications: Readonly<{
    semanticCategories: 'canonical';
    springParameters: 'canonical';
    durationTokens: 'canonical';
    easingSources: 'canonical';
    emphasizedCssEasing: 'translated';
    cssSerialization: 'translated';
    reducedMotionPolicy: 'web-decision';
  }>;
}

export type MaterialMotionDurationCssVariable =
  `--md-sys-motion-duration-${string}`;
export type MaterialMotionEasingCssVariable =
  `--md-sys-motion-easing-${string}`;
export type MaterialMotionCssVariable =
  | MaterialMotionDurationCssVariable
  | MaterialMotionEasingCssVariable;
export type MaterialMotionCssVariables = Readonly<
  Record<MaterialMotionCssVariable, string>
>;

export interface MaterialMotionCssOptions {
  /** CSS selector receiving curve custom properties. Defaults to :root. */
  selector?: string;
}
