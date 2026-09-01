import {
  Hct,
  SchemeContent,
  SchemeExpressive,
  SchemeFidelity,
  SchemeFruitSalad,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeRainbow,
  SchemeTonalSpot,
  SchemeVibrant,
  argbFromHex,
  hexFromArgb,
} from '@material/material-color-utilities';
import type {
  DynamicScheme,
  TonalPalette,
} from '@material/material-color-utilities';

import { MATERIAL_COLOR_SOURCE } from './source.js';
import {
  MATERIAL_COLOR_ROLES,
  MATERIAL_TONAL_PALETTE_NAMES,
  MATERIAL_TONES,
} from './types.js';
import type {
  HexColor,
  MaterialColorProvenance,
  MaterialColorRoles,
  MaterialColorScheme,
  MaterialColorSchemeOptions,
  MaterialSchemeVariant,
  MaterialTonalPalette,
  MaterialTonalPaletteName,
  MaterialTonalPalettes,
} from './types.js';

const HEX_SEED_PATTERN = /^#(?:[\da-f]{3}|[\da-f]{6})$/i;

type SchemeFactory = (
  sourceColor: Hct,
  isDark: boolean,
  contrastLevel: number,
) => DynamicScheme;

const createScheme = <TScheme extends DynamicScheme>(
  Scheme: new (
    sourceColor: Hct,
    isDark: boolean,
    contrastLevel: number,
    specVersion: '2025',
    platform: 'phone',
  ) => TScheme,
): SchemeFactory => {
  return (sourceColor, isDark, contrastLevel) =>
    new Scheme(sourceColor, isDark, contrastLevel, '2025', 'phone');
};

const SCHEME_FACTORIES = {
  monochrome: createScheme(SchemeMonochrome),
  neutral: createScheme(SchemeNeutral),
  tonalSpot: createScheme(SchemeTonalSpot),
  vibrant: createScheme(SchemeVibrant),
  expressive: createScheme(SchemeExpressive),
  fidelity: createScheme(SchemeFidelity),
  content: createScheme(SchemeContent),
  rainbow: createScheme(SchemeRainbow),
  fruitSalad: createScheme(SchemeFruitSalad),
} satisfies Record<MaterialSchemeVariant, SchemeFactory>;

function normalizeSeed(seed: string): HexColor {
  if (!HEX_SEED_PATTERN.test(seed)) {
    throw new TypeError('seed must be an opaque sRGB color in #RGB or #RRGGBB notation.');
  }

  const normalized = seed.toLowerCase();
  if (normalized.length === 7) {
    return normalized as HexColor;
  }

  const [, red, green, blue] = normalized;
  return `#${red}${red}${green}${green}${blue}${blue}` as HexColor;
}

function validateContrastLevel(contrastLevel: number): void {
  if (!Number.isFinite(contrastLevel) || contrastLevel < -1 || contrastLevel > 1) {
    throw new RangeError('contrastLevel must be a finite number from -1 to 1.');
  }
}

function toHex(argb: number): HexColor {
  return hexFromArgb(argb) as HexColor;
}

function generateRoles(scheme: DynamicScheme): MaterialColorRoles {
  return Object.freeze(
    Object.fromEntries(
      MATERIAL_COLOR_ROLES.map((role) => [role, toHex(scheme[role])]),
    ),
  ) as MaterialColorRoles;
}

function generatePalette(palette: TonalPalette): MaterialTonalPalette {
  return Object.freeze(
    Object.fromEntries(
      MATERIAL_TONES.map((tone) => [tone, toHex(palette.tone(tone))]),
    ),
  ) as MaterialTonalPalette;
}

function getPalette(
  scheme: DynamicScheme,
  paletteName: MaterialTonalPaletteName,
): TonalPalette {
  if (paletteName === 'neutralVariant') {
    return scheme.neutralVariantPalette;
  }

  return scheme[`${paletteName}Palette`];
}

function generatePalettes(scheme: DynamicScheme): MaterialTonalPalettes {
  return Object.freeze(
    Object.fromEntries(
      MATERIAL_TONAL_PALETTE_NAMES.map((paletteName) => [
        paletteName,
        generatePalette(getPalette(scheme, paletteName)),
      ]),
    ),
  ) as MaterialTonalPalettes;
}

/**
 * Generates a deterministic Material 3 color scheme and its source palettes.
 * This function has no DOM or React dependency.
 */
export function createMaterialColorScheme(
  options: MaterialColorSchemeOptions,
): MaterialColorScheme {
  const seed = normalizeSeed(options.seed);
  validateContrastLevel(options.contrastLevel);

  const sourceColor = Hct.fromInt(argbFromHex(seed));
  const scheme = SCHEME_FACTORIES[options.variant](
    sourceColor,
    options.mode === 'dark',
    options.contrastLevel,
  );
  const provenance = Object.freeze({
    ...MATERIAL_COLOR_SOURCE,
    seed,
    variant: options.variant,
    contrastLevel: options.contrastLevel,
    mode: options.mode,
  } satisfies MaterialColorProvenance);

  return Object.freeze({
    roles: generateRoles(scheme),
    palettes: generatePalettes(scheme),
    provenance,
  });
}
