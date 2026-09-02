import {
  MATERIAL_EMPHASIZED_TYPOGRAPHY_ROLES,
  MATERIAL_TYPOGRAPHY_CSS_PROPERTIES,
  MATERIAL_TYPOGRAPHY_ROLES,
  type MaterialTypography,
  type MaterialTypographyCssOptions,
  type MaterialTypographyCssProperty,
  type MaterialTypographyCssVariable,
  type MaterialTypographyCssVariables,
  type MaterialTypographyRoleName,
} from './types.js';

const CSS_PROPERTY_SUFFIX = Object.freeze({
  font: 'font',
  size: 'size',
  lineHeight: 'line-height',
  weight: 'weight',
  tracking: 'tracking',
} satisfies Record<MaterialTypographyCssProperty, string>);

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function roleCssName(role: MaterialTypographyRoleName): string {
  if (role.endsWith('Emphasized')) {
    return `emphasized-${toKebabCase(role.slice(0, -'Emphasized'.length))}`;
  }

  return toKebabCase(role);
}

/** Returns the semantic Material custom-property name for one role value. */
export function materialTypographyRoleToCssVariable(
  role: MaterialTypographyRoleName,
  property: MaterialTypographyCssProperty,
): MaterialTypographyCssVariable {
  return `--md-sys-typescale-${roleCssName(role)}-${CSS_PROPERTY_SUFFIX[property]}`;
}

/** Serializes resolved typography into a framework-neutral custom-property map. */
export function toMaterialTypographyCssVariables(
  typography: MaterialTypography,
): MaterialTypographyCssVariables {
  const variables: Record<MaterialTypographyCssVariable, string | number> = {
    '--md-ref-typeface-brand': typography.fontFamilies.brand,
    '--md-ref-typeface-plain': typography.fontFamilies.plain,
  };

  const roles = [
    ...MATERIAL_TYPOGRAPHY_ROLES,
    ...MATERIAL_EMPHASIZED_TYPOGRAPHY_ROLES,
  ] as const;

  for (const role of roles) {
    const token = typography.roles[role];
    const values = {
      font: `var(--md-ref-typeface-${token.fontFamilyRole})`,
      size: token.fontSize,
      lineHeight: token.lineHeight,
      weight: token.fontWeight,
      tracking: token.letterSpacing,
    } satisfies Record<MaterialTypographyCssProperty, string | number>;

    for (const property of MATERIAL_TYPOGRAPHY_CSS_PROPERTIES) {
      variables[materialTypographyRoleToCssVariable(role, property)] =
        values[property];
    }
  }

  return Object.freeze(variables);
}

function assertSelector(selector: string): string {
  const trimmed = selector.trim();
  if (trimmed.length === 0 || trimmed.includes('{') || trimmed.includes('}')) {
    throw new TypeError('selector must be a non-empty CSS selector without braces.');
  }
  return trimmed;
}

/** Creates a CSS rule containing Material typography custom properties. */
export function toMaterialTypographyCss(
  typography: MaterialTypography,
  options: MaterialTypographyCssOptions = {},
): string {
  const selector = assertSelector(options.selector ?? ':root');
  const variables = toMaterialTypographyCssVariables(typography);
  const declarations = Object.entries(variables)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');

  return [
    `/* Material 3 typography ${typography.provenance.tokenVersion}; source ${typography.provenance.sourceRevision}. */`,
    `${selector} {`,
    declarations,
    '}',
  ].join('\n');
}
