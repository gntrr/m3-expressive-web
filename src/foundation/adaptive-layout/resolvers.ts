import { materialWindowSizeClasses } from './tokens.js';
import {
  MATERIAL_HEIGHT_CLASS_NAMES,
  MATERIAL_WIDTH_CLASS_NAMES,
  type MaterialHeightClassName,
  type MaterialResolvedWindowSizeClass,
  type MaterialWidthClassName,
} from './types.js';

function assertAvailableCssPixels(value: number, axis: 'width' | 'height'): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${axis} must be a finite, non-negative CSS pixel value.`);
  }
}

export function resolveMaterialWidthClass(
  availableCssPx: number,
): MaterialWidthClassName {
  assertAvailableCssPixels(availableCssPx, 'width');
  for (const name of [...MATERIAL_WIDTH_CLASS_NAMES].reverse()) {
    if (availableCssPx >= materialWindowSizeClasses.width[name].minDp) return name;
  }
  return 'compact';
}

export function resolveMaterialHeightClass(
  availableCssPx: number,
): MaterialHeightClassName {
  assertAvailableCssPixels(availableCssPx, 'height');
  for (const name of [...MATERIAL_HEIGHT_CLASS_NAMES].reverse()) {
    if (availableCssPx >= materialWindowSizeClasses.height[name].minDp) return name;
  }
  return 'compact';
}

export function resolveMaterialWindowSizeClass(
  widthCssPx: number,
  heightCssPx: number,
): MaterialResolvedWindowSizeClass {
  const availableCssPx = Object.freeze({
    width: widthCssPx,
    height: heightCssPx,
  });

  return Object.freeze({
    width: resolveMaterialWidthClass(widthCssPx),
    height: resolveMaterialHeightClass(heightCssPx),
    availableCssPx,
    classification: 'translated',
  });
}
