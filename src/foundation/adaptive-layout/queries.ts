import { materialWindowSizeClasses } from './tokens.js';
import {
  MATERIAL_HEIGHT_CLASS_NAMES,
  MATERIAL_WIDTH_CLASS_NAMES,
  type MaterialHeightClassName,
  type MaterialWidthClassName,
  type MaterialWindowSizeClassDefinition,
} from './types.js';

function serializeRange(
  feature: 'width' | 'height' | 'inline-size',
  definition: MaterialWindowSizeClassDefinition<string, 'width' | 'height'>,
): string {
  const { minDp, maxExclusiveDp } = definition;
  if (minDp === 0 && maxExclusiveDp !== null) {
    return `(${feature} < ${maxExclusiveDp}px)`;
  }
  if (maxExclusiveDp === null) {
    return `(${feature} >= ${minDp}px)`;
  }
  return `(${minDp}px <= ${feature} < ${maxExclusiveDp}px)`;
}

export function getMaterialWidthClassMediaQuery(
  name: MaterialWidthClassName,
): string {
  return serializeRange('width', materialWindowSizeClasses.width[name]);
}

export function getMaterialHeightClassMediaQuery(
  name: MaterialHeightClassName,
): string {
  return serializeRange('height', materialWindowSizeClasses.height[name]);
}

export function getMaterialWidthClassContainerQuery(
  name: MaterialWidthClassName,
): string {
  return serializeRange('inline-size', materialWindowSizeClasses.width[name]);
}

export const materialMediaQueries = Object.freeze({
  width: Object.freeze(
    Object.fromEntries(
      MATERIAL_WIDTH_CLASS_NAMES.map((name) => [
        name,
        getMaterialWidthClassMediaQuery(name),
      ]),
    ) as Record<MaterialWidthClassName, string>,
  ),
  height: Object.freeze(
    Object.fromEntries(
      MATERIAL_HEIGHT_CLASS_NAMES.map((name) => [
        name,
        getMaterialHeightClassMediaQuery(name),
      ]),
    ) as Record<MaterialHeightClassName, string>,
  ),
});

export const materialContainerQueries = Object.freeze({
  width: Object.freeze(
    Object.fromEntries(
      MATERIAL_WIDTH_CLASS_NAMES.map((name) => [
        name,
        getMaterialWidthClassContainerQuery(name),
      ]),
    ) as Record<MaterialWidthClassName, string>,
  ),
});
