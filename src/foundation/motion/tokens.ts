import {
  type MaterialMotionCategory,
  type MaterialMotionCubicBezier,
  type MaterialMotionDurationName,
  type MaterialMotionDurations,
  type MaterialMotionEasingName,
  type MaterialMotionEasings,
  type MaterialMotionIntent,
  type MaterialMotionPathEasing,
  type MaterialMotionScheme,
  type MaterialMotionSchemeName,
  type MaterialMotionSchemes,
  type MaterialMotionSpeed,
  type MaterialMotionSpringModel,
  type MaterialMotionTimingModel,
  type MaterialMotionToken,
  type MaterialMotionTokens,
  type MaterialReducedMotionPolicy,
} from './types.js';

function spring(
  dampingRatio: number,
  stiffness: number,
): MaterialMotionSpringModel {
  return Object.freeze({
    kind: 'spring',
    dampingRatio,
    stiffness,
    fixedDuration: false,
    classification: 'canonical',
  });
}

function motionToken(
  category: MaterialMotionCategory,
  intent: MaterialMotionIntent,
  speed: MaterialMotionSpeed,
  dampingRatio: number,
  stiffness: number,
): MaterialMotionToken {
  return Object.freeze({
    category,
    intent,
    speed,
    model: spring(dampingRatio, stiffness),
    classification: 'canonical',
  });
}

function scheme(
  name: MaterialMotionSchemeName,
  description: string,
  values: Readonly<
    Record<MaterialMotionCategory, readonly [dampingRatio: number, stiffness: number]>
  >,
): MaterialMotionScheme {
  const tokens = Object.freeze({
    fastSpatial: motionToken('fastSpatial', 'spatial', 'fast', ...values.fastSpatial),
    defaultSpatial: motionToken(
      'defaultSpatial',
      'spatial',
      'default',
      ...values.defaultSpatial,
    ),
    slowSpatial: motionToken('slowSpatial', 'spatial', 'slow', ...values.slowSpatial),
    fastEffects: motionToken('fastEffects', 'effects', 'fast', ...values.fastEffects),
    defaultEffects: motionToken(
      'defaultEffects',
      'effects',
      'default',
      ...values.defaultEffects,
    ),
    slowEffects: motionToken('slowEffects', 'effects', 'slow', ...values.slowEffects),
  } satisfies MaterialMotionTokens);

  return Object.freeze({
    name,
    description,
    tokens,
    classification: 'canonical',
  });
}

export const materialMotion = Object.freeze({
  standard: scheme(
    'standard',
    'Utilitarian motion for recurring interactions and basic UI elements.',
    {
      fastSpatial: [0.9, 1400],
      defaultSpatial: [0.9, 700],
      slowSpatial: [0.9, 300],
      fastEffects: [1, 3800],
      defaultEffects: [1, 1600],
      slowEffects: [1, 800],
    },
  ),
  expressive: scheme(
    'expressive',
    'Engaging motion for prominent elements and hero interactions.',
    {
      fastSpatial: [0.6, 800],
      defaultSpatial: [0.8, 380],
      slowSpatial: [0.8, 200],
      fastEffects: [1, 3800],
      defaultEffects: [1, 1600],
      slowEffects: [1, 800],
    },
  ),
} satisfies MaterialMotionSchemes);

export function getMaterialMotionScheme(
  name: MaterialMotionSchemeName,
): MaterialMotionScheme {
  const selected = materialMotion[name];
  if (!selected) throw new RangeError(`Unknown Material motion scheme: ${name}`);
  return selected;
}

function duration(
  name: MaterialMotionDurationName,
  milliseconds: number,
) {
  return Object.freeze({
    kind: 'duration' as const,
    name,
    milliseconds,
    cssValue: `${milliseconds}ms` as const,
    classification: 'canonical' as const,
  });
}

export const materialMotionDurations = Object.freeze({
  short1: duration('short1', 50),
  short2: duration('short2', 100),
  short3: duration('short3', 150),
  short4: duration('short4', 200),
  medium1: duration('medium1', 250),
  medium2: duration('medium2', 300),
  medium3: duration('medium3', 350),
  medium4: duration('medium4', 400),
  long1: duration('long1', 450),
  long2: duration('long2', 500),
  long3: duration('long3', 550),
  long4: duration('long4', 600),
  extraLong1: duration('extraLong1', 700),
  extraLong2: duration('extraLong2', 800),
  extraLong3: duration('extraLong3', 900),
  extraLong4: duration('extraLong4', 1000),
} satisfies MaterialMotionDurations);

function cubicBezier(
  controlPoints: readonly [number, number, number, number],
): MaterialMotionCubicBezier {
  return Object.freeze({
    kind: 'cubic-bezier',
    controlPoints: Object.freeze(controlPoints),
    classification: 'canonical',
  });
}

function path(pathValue: string): MaterialMotionPathEasing {
  return Object.freeze({
    kind: 'path',
    path: pathValue,
    classification: 'canonical',
  });
}

function easing(
  name: MaterialMotionEasingName,
  source: MaterialMotionCubicBezier | MaterialMotionPathEasing,
  cssValue: string,
  cssClassification: 'canonical' | 'translated' = 'canonical',
) {
  return Object.freeze({
    name,
    source,
    css: Object.freeze({
      kind: 'css-easing' as const,
      value: cssValue,
      classification: cssClassification,
    }),
  });
}

export const materialMotionEasings = Object.freeze({
  standard: easing(
    'standard',
    cubicBezier([0.2, 0, 0, 1]),
    'cubic-bezier(0.2, 0, 0, 1)',
  ),
  standardAccelerate: easing(
    'standardAccelerate',
    cubicBezier([0.3, 0, 1, 1]),
    'cubic-bezier(0.3, 0, 1, 1)',
  ),
  standardDecelerate: easing(
    'standardDecelerate',
    cubicBezier([0, 0, 0, 1]),
    'cubic-bezier(0, 0, 0, 1)',
  ),
  emphasized: easing(
    'emphasized',
    path(
      'M 0,0 C 0.05,0 0.133333,0.06 0.166666,0.4 C 0.208333,0.82 0.25,1 1,1',
    ),
    'cubic-bezier(0.2, 0, 0, 1)',
    'translated',
  ),
  emphasizedAccelerate: easing(
    'emphasizedAccelerate',
    cubicBezier([0.3, 0, 0.8, 0.15]),
    'cubic-bezier(0.3, 0, 0.8, 0.15)',
  ),
  emphasizedDecelerate: easing(
    'emphasizedDecelerate',
    cubicBezier([0.05, 0.7, 0.1, 1]),
    'cubic-bezier(0.05, 0.7, 0.1, 1)',
  ),
  linear: easing(
    'linear',
    cubicBezier([0, 0, 1, 1]),
    'cubic-bezier(0, 0, 1, 1)',
  ),
} satisfies MaterialMotionEasings);

/** Resolves semantic curve tokens into a normalized timing representation. */
export function createMaterialMotionTiming(
  durationName: MaterialMotionDurationName,
  easingName: MaterialMotionEasingName,
): MaterialMotionTimingModel {
  const durationToken = materialMotionDurations[durationName];
  const easingToken = materialMotionEasings[easingName];
  if (!durationToken) throw new RangeError(`Unknown Material duration: ${durationName}`);
  if (!easingToken) throw new RangeError(`Unknown Material easing: ${easingName}`);

  return Object.freeze({
    kind: 'timing',
    duration: durationToken,
    easing: easingToken,
    classification:
      easingToken.css.classification === 'translated'
        ? 'translated'
        : 'canonical',
  });
}

function reducedRule(
  category: 'decorative' | 'spatial' | 'stateFeedback' | 'essential',
  action:
    | 'remove'
    | 'replace-with-effects'
    | 'preserve-feedback'
    | 'preserve-essential',
  guidance: string,
) {
  return Object.freeze({
    category,
    action,
    guidance,
    classification: 'web-decision' as const,
  });
}

export const MATERIAL_REDUCED_MOTION_POLICY = Object.freeze({
  mediaQuery: '(prefers-reduced-motion: reduce)',
  globalZeroDurationReset: false,
  finalStateMustMatch: true,
  rules: Object.freeze({
    decorative: reducedRule(
      'decorative',
      'remove',
      'Remove looping, ambient, parallax, and ornamental motion without delaying the final state.',
    ),
    spatial: reducedRule(
      'spatial',
      'replace-with-effects',
      'Replace large translation, scale, and morphing with concise opacity, color, or instant state changes.',
    ),
    stateFeedback: reducedRule(
      'stateFeedback',
      'preserve-feedback',
      'Retain perceivable feedback using low-motion effects, outlines, or brief non-spatial transitions.',
    ),
    essential: reducedRule(
      'essential',
      'preserve-essential',
      'Retain only motion required to understand progress, causality, or orientation and minimize its magnitude and repetition.',
    ),
  }),
  requirements: Object.freeze([
    'Do not hide or delay the destination state.',
    'Do not rely on motion as the only indication of state, including in forced colors.',
    'Re-evaluate the preference when the media query changes during a session.',
    'Pause or cancel non-essential work when the document is not visible.',
  ]),
  classification: 'web-decision',
} satisfies MaterialReducedMotionPolicy);
