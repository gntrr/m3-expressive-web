import { MATERIAL_SHAPE_CORNERS } from './corner-tokens.js';
import { MATERIAL_SHAPE_SOURCE } from './source.js';
import {
  MATERIAL_SHAPE_CORNER_ROLES,
  type MaterialLogicalCorners,
  type MaterialShapeCornerCssOptions,
  type MaterialShapeCornerRole,
  type MaterialShapeCssOptions,
  type MaterialShapeCssVariable,
  type MaterialShapeCssVariables,
  type MaterialShapeDirection,
} from './types.js';

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function materialShapeCornerToCssVariable(
  role: MaterialShapeCornerRole,
): MaterialShapeCssVariable {
  return `--md-sys-shape-corner-${toKebabCase(role)}`;
}

function physicalCorners(
  corners: MaterialLogicalCorners,
  direction: MaterialShapeDirection,
): readonly string[] {
  return direction === 'ltr'
    ? [corners.topStart, corners.topEnd, corners.bottomEnd, corners.bottomStart]
    : [corners.topEnd, corners.topStart, corners.bottomStart, corners.bottomEnd];
}

function compactBorderRadius(values: readonly string[]): string {
  return values.every((value) => value === values[0]) ? values[0]! : values.join(' ');
}

/** Resolves a semantic logical corner role to a CSS border-radius value. */
export function materialShapeCornerToCssValue(
  role: MaterialShapeCornerRole,
  options: MaterialShapeCornerCssOptions = {},
): string {
  return compactBorderRadius(
    physicalCorners(MATERIAL_SHAPE_CORNERS[role].corners, options.direction ?? 'ltr'),
  );
}

export function toMaterialShapeCssVariables(
  options: MaterialShapeCornerCssOptions = {},
): MaterialShapeCssVariables {
  const variables = Object.fromEntries(
    MATERIAL_SHAPE_CORNER_ROLES.map((role) => [
      materialShapeCornerToCssVariable(role),
      materialShapeCornerToCssValue(role, options),
    ]),
  ) as Record<MaterialShapeCssVariable, string>;

  return Object.freeze(variables);
}

function assertSelector(selector: string): string {
  const trimmed = selector.trim();
  if (trimmed.length === 0 || trimmed.includes('{') || trimmed.includes('}')) {
    throw new TypeError('selector must be a non-empty CSS selector without braces.');
  }
  return trimmed;
}

function declarations(variables: MaterialShapeCssVariables): string {
  return Object.entries(variables)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');
}

/** Creates semantic corner variables and optional logical RTL overrides. */
export function toMaterialShapeCss(options: MaterialShapeCssOptions = {}): string {
  const selector = assertSelector(options.selector ?? ':root');
  const ltr = toMaterialShapeCssVariables({ direction: 'ltr' });
  const lines = [
    `/* Material 3 shape ${MATERIAL_SHAPE_SOURCE.webTokenVersion}; source ${MATERIAL_SHAPE_SOURCE.webSourceRevision}. */`,
    `${selector} {`,
    declarations(ltr),
    '}',
  ];

  if (options.includeRtlOverrides ?? true) {
    const rtl = toMaterialShapeCssVariables({ direction: 'rtl' });
    const changed = Object.freeze(
      Object.fromEntries(
        Object.entries(rtl).filter(([name, value]) => ltr[name as MaterialShapeCssVariable] !== value),
      ),
    ) as MaterialShapeCssVariables;
    lines.push(`${selector}:dir(rtl) {`, declarations(changed), '}');
  }

  return lines.join('\n');
}
