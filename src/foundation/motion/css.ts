import { MATERIAL_MOTION_SOURCE } from './source.js';
import { materialMotionDurations, materialMotionEasings } from './tokens.js';
import {
  MATERIAL_MOTION_DURATION_NAMES,
  MATERIAL_MOTION_EASING_NAMES,
  type MaterialMotionCssOptions,
  type MaterialMotionCssVariables,
  type MaterialMotionDurationCssVariable,
  type MaterialMotionDurationName,
  type MaterialMotionEasingCssVariable,
  type MaterialMotionEasingName,
} from './types.js';

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function materialMotionDurationToCssVariable(
  name: MaterialMotionDurationName,
): MaterialMotionDurationCssVariable {
  return `--md-sys-motion-duration-${toKebabCase(name)}`;
}

export function materialMotionEasingToCssVariable(
  name: MaterialMotionEasingName,
): MaterialMotionEasingCssVariable {
  return `--md-sys-motion-easing-${toKebabCase(name)}`;
}

/** Serializes only motion values with meaningful static CSS representations. */
export function toMaterialMotionCssVariables(): MaterialMotionCssVariables {
  const entries: Array<readonly [string, string]> = [];
  for (const name of MATERIAL_MOTION_DURATION_NAMES) {
    entries.push([
      materialMotionDurationToCssVariable(name),
      materialMotionDurations[name].cssValue,
    ]);
  }
  for (const name of MATERIAL_MOTION_EASING_NAMES) {
    entries.push([
      materialMotionEasingToCssVariable(name),
      materialMotionEasings[name].css.value,
    ]);
  }
  return Object.freeze(Object.fromEntries(entries)) as MaterialMotionCssVariables;
}

function assertSelector(selector: string): string {
  const trimmed = selector.trim();
  if (trimmed.length === 0 || trimmed.includes('{') || trimmed.includes('}')) {
    throw new TypeError('selector must be a non-empty CSS selector without braces.');
  }
  return trimmed;
}

/** Creates baseline duration/easing CSS variables; spring data stays in TypeScript. */
export function toMaterialMotionCss(
  options: MaterialMotionCssOptions = {},
): string {
  const selector = assertSelector(options.selector ?? ':root');
  const declarations = Object.entries(toMaterialMotionCssVariables())
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');

  return [
    `/* Material 3 motion ${MATERIAL_MOTION_SOURCE.materialWebTokenVersion}; source ${MATERIAL_MOTION_SOURCE.materialWebSourceRevision}. Spring schemes are not serialized to CSS. */`,
    `${selector} {`,
    declarations,
    '}',
  ].join('\n');
}
