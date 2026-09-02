import {
  type MaterialHeightClass,
  type MaterialHeightClassName,
  type MaterialWidthClass,
  type MaterialWidthClassName,
  type MaterialWindowSizeClasses,
  type MaterialWindowSizeClassDefinition,
  type MaterialWindowSizeClassModel,
} from './types.js';

function sizeClass<Name extends string, Axis extends 'width' | 'height'>(
  name: Name,
  axis: Axis,
  minDp: number,
  maxExclusiveDp: number | null,
): MaterialWindowSizeClassDefinition<Name, Axis> {
  return Object.freeze({
    name,
    axis,
    minDp,
    maxExclusiveDp,
    classification: 'canonical',
  });
}

const width = Object.freeze({
  compact: sizeClass('compact', 'width', 0, 600),
  medium: sizeClass('medium', 'width', 600, 840),
  expanded: sizeClass('expanded', 'width', 840, 1200),
  large: sizeClass('large', 'width', 1200, 1600),
  extraLarge: sizeClass('extraLarge', 'width', 1600, null),
} satisfies Readonly<Record<MaterialWidthClassName, MaterialWidthClass>>);

const height = Object.freeze({
  compact: sizeClass('compact', 'height', 0, 480),
  medium: sizeClass('medium', 'height', 480, 900),
  expanded: sizeClass('expanded', 'height', 900, null),
} satisfies Readonly<Record<MaterialHeightClassName, MaterialHeightClass>>);

export const materialWindowSizeClasses = Object.freeze({
  width,
  height,
} satisfies MaterialWindowSizeClasses);

export const MATERIAL_WINDOW_SIZE_CLASS_MODELS = Object.freeze({
  legacy: Object.freeze({
    name: 'v1-three-width-classes',
    status: 'legacy',
    androidXField: 'BREAKPOINTS_V1',
    widthClasses: Object.freeze(['compact', 'medium', 'expanded']),
    heightClasses: Object.freeze(['compact', 'medium', 'expanded']),
    classification: 'canonical',
  } satisfies MaterialWindowSizeClassModel),
  current: Object.freeze({
    name: 'v2-five-width-classes',
    status: 'current',
    androidXField: 'BREAKPOINTS_V2',
    widthClasses: Object.freeze([
      'compact',
      'medium',
      'expanded',
      'large',
      'extraLarge',
    ]),
    heightClasses: Object.freeze(['compact', 'medium', 'expanded']),
    classification: 'canonical',
  } satisfies MaterialWindowSizeClassModel),
});
