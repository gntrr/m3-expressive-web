import { MATERIAL_ELEVATION_SOURCE } from './source.js';
import { materialElevation, materialElevationShadows } from './tokens.js';
import {
  MATERIAL_ELEVATION_LEVEL_NAMES,
  type MaterialElevationCssOptions,
  type MaterialElevationCssVariable,
  type MaterialElevationCssVariables,
  type MaterialElevationLevelName,
  type MaterialElevationShadowCssOptions,
  type MaterialElevationShadowCssVariable,
  type MaterialElevationShadowCssVariables,
  type MaterialElevationShadowLayer,
} from './types.js';

const DEFAULT_SHADOW_COLOR = 'var(--md-sys-color-shadow, #000)';

export function materialElevationLevelToCssVariable(
  level: MaterialElevationLevelName,
): MaterialElevationCssVariable {
  return `--md-sys-elevation-${level}`;
}

export function materialElevationShadowToCssVariable(
  level: MaterialElevationLevelName,
): MaterialElevationShadowCssVariable {
  return `--md-web-elevation-shadow-${level}`;
}

export function toMaterialElevationCssVariables(): MaterialElevationCssVariables {
  return Object.freeze(
    Object.fromEntries(
      MATERIAL_ELEVATION_LEVEL_NAMES.map((level) => [
        materialElevationLevelToCssVariable(level),
        materialElevation[level].webLevel,
      ]),
    ) as Record<MaterialElevationCssVariable, 0 | 1 | 2 | 3 | 4 | 5>,
  );
}

function assertCssColor(value: string): string {
  const trimmed = value.trim();
  if (
    trimmed.length === 0 ||
    trimmed.includes(';') ||
    trimmed.includes('{') ||
    trimmed.includes('}')
  ) {
    throw new TypeError('shadowColor must be a non-empty CSS color without declarations.');
  }
  return trimmed;
}

function layerToCss(layer: MaterialElevationShadowLayer, color: string): string {
  const percentage = layer.opacity * 100;
  return [
    layer.x,
    layer.y,
    layer.blur,
    layer.spread,
    `color-mix(in srgb, ${color} ${percentage}%, transparent)`,
  ].join(' ');
}

/**
 * Combines Material Web's separate key and ambient layers into one CSS
 * box-shadow value. The layer geometry is canonical; this combination is a
 * documented web translation.
 */
export function materialElevationShadowToCssValue(
  level: MaterialElevationLevelName,
  options: MaterialElevationShadowCssOptions = {},
): string {
  if (level === 'level0') return 'none';
  const color = assertCssColor(options.shadowColor ?? DEFAULT_SHADOW_COLOR);
  const shadow = materialElevationShadows[level];
  return `${layerToCss(shadow.key, color)}, ${layerToCss(shadow.ambient, color)}`;
}

export function toMaterialElevationShadowCssVariables(
  options: MaterialElevationShadowCssOptions = {},
): MaterialElevationShadowCssVariables {
  return Object.freeze(
    Object.fromEntries(
      MATERIAL_ELEVATION_LEVEL_NAMES.map((level) => [
        materialElevationShadowToCssVariable(level),
        materialElevationShadowToCssValue(level, options),
      ]),
    ) as Record<MaterialElevationShadowCssVariable, string>,
  );
}

function assertSelector(selector: string): string {
  const trimmed = selector.trim();
  if (trimmed.length === 0 || trimmed.includes('{') || trimmed.includes('}')) {
    throw new TypeError('selector must be a non-empty CSS selector without braces.');
  }
  return trimmed;
}

function declarations(variables: Readonly<Record<string, string | number>>): string {
  return Object.entries(variables)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');
}

/** Creates canonical level variables and optional translated shadow variables. */
export function toMaterialElevationCss(
  options: MaterialElevationCssOptions = {},
): string {
  const selector = assertSelector(options.selector ?? ':root');
  const variables = {
    ...toMaterialElevationCssVariables(),
    ...(options.includeShadows ?? true
      ? toMaterialElevationShadowCssVariables(options)
      : {}),
  };

  return [
    `/* Material 3 elevation ${MATERIAL_ELEVATION_SOURCE.materialWebTokenVersion}; source ${MATERIAL_ELEVATION_SOURCE.materialWebSourceRevision}. */`,
    `${selector} {`,
    declarations(variables),
    '}',
  ].join('\n');
}
