import { MATERIAL_ADAPTIVE_LAYOUT_SOURCE } from './source.js';
import { materialWindowSizeClasses } from './tokens.js';
import {
  MATERIAL_HEIGHT_CLASS_NAMES,
  MATERIAL_WIDTH_CLASS_NAMES,
  type MaterialAdaptiveLayoutCssOptions,
  type MaterialHeightClassName,
  type MaterialLayoutAxis,
  type MaterialLayoutBreakpointCssVariable,
  type MaterialLayoutBreakpointCssVariables,
  type MaterialWidthClassName,
} from './types.js';

function cssClassName(name: MaterialWidthClassName | MaterialHeightClassName): string {
  return name === 'extraLarge' ? 'extra-large' : name;
}

export function materialLayoutBreakpointToCssVariable(
  axis: 'width',
  name: MaterialWidthClassName,
): MaterialLayoutBreakpointCssVariable;
export function materialLayoutBreakpointToCssVariable(
  axis: 'height',
  name: MaterialHeightClassName,
): MaterialLayoutBreakpointCssVariable;
export function materialLayoutBreakpointToCssVariable(
  axis: MaterialLayoutAxis,
  name: MaterialWidthClassName | MaterialHeightClassName,
): MaterialLayoutBreakpointCssVariable {
  return `--md-web-layout-breakpoint-${axis}-${cssClassName(name)}` as MaterialLayoutBreakpointCssVariable;
}

export function toMaterialAdaptiveLayoutCssVariables(): MaterialLayoutBreakpointCssVariables {
  const entries: Array<[MaterialLayoutBreakpointCssVariable, `${number}px`]> = [
    ...MATERIAL_WIDTH_CLASS_NAMES.map((name) => [
      materialLayoutBreakpointToCssVariable('width', name),
      `${materialWindowSizeClasses.width[name].minDp}px` as const,
    ] as [MaterialLayoutBreakpointCssVariable, `${number}px`]),
    ...MATERIAL_HEIGHT_CLASS_NAMES.map((name) => [
      materialLayoutBreakpointToCssVariable('height', name),
      `${materialWindowSizeClasses.height[name].minDp}px` as const,
    ] as [MaterialLayoutBreakpointCssVariable, `${number}px`]),
  ];

  return Object.freeze(
    Object.fromEntries(entries) as Record<
      MaterialLayoutBreakpointCssVariable,
      `${number}px`
    >,
  );
}

function assertSelector(selector: string): string {
  const trimmed = selector.trim();
  if (trimmed.length === 0 || trimmed.includes('{') || trimmed.includes('}')) {
    throw new TypeError('selector must be a non-empty CSS selector without braces.');
  }
  return trimmed;
}

export function toMaterialAdaptiveLayoutCss(
  options: MaterialAdaptiveLayoutCssOptions = {},
): string {
  const selector = assertSelector(options.selector ?? ':root');
  const declarations = Object.entries(toMaterialAdaptiveLayoutCssVariables())
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');

  return [
    `/* Material adaptive layout; AndroidX source ${MATERIAL_ADAPTIVE_LAYOUT_SOURCE.androidXSourceRevision}. dp thresholds translated numerically to CSS px. */`,
    `${selector} {`,
    declarations,
    '}',
  ].join('\n');
}
