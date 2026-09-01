import type { CSSProperties, ReactNode } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  MATERIAL_COLOR_ROLES,
  MATERIAL_TONAL_PALETTE_NAMES,
  MATERIAL_TONES,
  createMaterialColorScheme,
  materialColorRoleToCssVariable,
  toMaterialColorCssVariables,
} from './index.js';
import type {
  HexColor,
  MaterialColorRole,
  MaterialColorScheme,
} from './index.js';

import './Color.stories.css';

const SEED = '#6750A4';
const VARIANT = 'expressive';

const lightScheme = createMaterialColorScheme({
  seed: SEED,
  variant: VARIANT,
  contrastLevel: 0,
  mode: 'light',
});

const darkScheme = createMaterialColorScheme({
  seed: SEED,
  variant: VARIANT,
  contrastLevel: 0,
  mode: 'dark',
});

const highContrastLightScheme = createMaterialColorScheme({
  seed: SEED,
  variant: VARIANT,
  contrastLevel: 1,
  mode: 'light',
});

const meta = {
  title: 'Foundation/Color',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Deterministic Material 3 semantic color roles and tonal palettes generated with the pinned 2025 Material Color Utilities model.',
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function schemeStyle(scheme: MaterialColorScheme): CSSProperties {
  return toMaterialColorCssVariables(scheme) as unknown as CSSProperties;
}

function formatName(value: string): string {
  return value.replace(/[A-Z]/g, (character) => ` ${character.toLowerCase()}`);
}

function StoryFrame({
  scheme,
  title,
  description,
  children,
}: {
  scheme: MaterialColorScheme;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const source = scheme.provenance;

  return (
    <main className="color-docs" style={schemeStyle(scheme)}>
      <h2>{title}</h2>
      <p className="color-docs__intro">{description}</p>
      <div className="color-docs__meta" aria-label="Color scheme provenance">
        <span>seed {source.seed}</span>
        <span>variant {source.variant}</span>
        <span>contrast {source.contrastLevel}</span>
        <span>mode {source.mode}</span>
        <span>MCU {source.packageVersion}</span>
        <span>spec {source.materialSpecVersion}</span>
      </div>
      {children}
    </main>
  );
}

function TonalPaletteDocumentation() {
  return (
    <StoryFrame
      scheme={lightScheme}
      title="Tonal palettes"
      description="Six source palettes are sampled at the 13 canonical Material tones. Components should consume semantic roles, not these palette values directly."
    >
      <div className="color-docs__palette-grid">
        {MATERIAL_TONAL_PALETTE_NAMES.map((paletteName) => (
          <section className="color-docs__palette" key={paletteName}>
            <h3>{formatName(paletteName)}</h3>
            <div className="color-docs__tone-list">
              {MATERIAL_TONES.map((tone) => {
                const value = lightScheme.palettes[paletteName][tone];
                return (
                  <div className="color-docs__tone-row" key={tone}>
                    <code>{tone}</code>
                    <span
                      aria-label={`${formatName(paletteName)} tone ${tone}: ${value}`}
                      className="color-docs__tone-chip"
                      role="img"
                      style={{ backgroundColor: value }}
                    />
                    <code>{value}</code>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </StoryFrame>
  );
}

function SemanticSchemeDocumentation({
  scheme,
  title,
}: {
  scheme: MaterialColorScheme;
  title: string;
}) {
  return (
    <StoryFrame
      scheme={scheme}
      title={title}
      description="Each swatch is a generated Material semantic role. The role name remains stable while its value changes with the scheme inputs."
    >
      <div className="color-docs__role-grid">
        {MATERIAL_COLOR_ROLES.map((role) => (
          <article className="color-docs__role-card" key={role}>
            <div
              aria-label={`${formatName(role)}: ${scheme.roles[role]}`}
              className="color-docs__role-swatch"
              role="img"
              style={{ backgroundColor: scheme.roles[role] }}
            />
            <div className="color-docs__role-label">
              <code>{formatName(role)}</code>
              <code>{scheme.roles[role]}</code>
            </div>
          </article>
        ))}
      </div>
    </StoryFrame>
  );
}

function RoleNameDocumentation() {
  return (
    <StoryFrame
      scheme={lightScheme}
      title="Role names and CSS custom properties"
      description="The JavaScript API uses camelCase Material role names. Web serialization maps them deterministically to the --md-sys-color-* namespace."
    >
      <div className="color-docs__table-wrap">
        <table className="color-docs__role-table">
          <thead>
            <tr>
              <th scope="col">Material role</th>
              <th scope="col">CSS custom property</th>
              <th scope="col">Generated value</th>
            </tr>
          </thead>
          <tbody>
            {MATERIAL_COLOR_ROLES.map((role) => (
              <tr key={role}>
                <th scope="row">
                  <code>{role}</code>
                </th>
                <td>
                  <code>{materialColorRoleToCssVariable(role)}</code>
                </td>
                <td>
                  <code>{lightScheme.roles[role]}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </StoryFrame>
  );
}

const CONTRAST_PAIRS = [
  ['primary', 'onPrimary'],
  ['primaryContainer', 'onPrimaryContainer'],
  ['secondary', 'onSecondary'],
  ['tertiary', 'onTertiary'],
  ['error', 'onError'],
  ['surface', 'onSurface'],
] as const satisfies ReadonlyArray<
  readonly [MaterialColorRole, MaterialColorRole]
>;

function linearize(channel: number): number {
  const normalized = channel / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(color: HexColor): number {
  const red = Number.parseInt(color.slice(1, 3), 16);
  const green = Number.parseInt(color.slice(3, 5), 16);
  const blue = Number.parseInt(color.slice(5, 7), 16);
  return 0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue);
}

function contrastRatio(background: HexColor, foreground: HexColor): string {
  const lighter = Math.max(luminance(background), luminance(foreground));
  const darker = Math.min(luminance(background), luminance(foreground));
  return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
}

function ContrastSection({
  scheme,
  title,
}: {
  scheme: MaterialColorScheme;
  title: string;
}) {
  return (
    <section className="color-docs__contrast-section" style={schemeStyle(scheme)}>
      <h3>{title}</h3>
      <div className="color-docs__contrast-list">
        {CONTRAST_PAIRS.map(([backgroundRole, foregroundRole]) => {
          const background = scheme.roles[backgroundRole];
          const foreground = scheme.roles[foregroundRole];
          return (
            <div
              className="color-docs__contrast-sample"
              key={`${backgroundRole}-${foregroundRole}`}
              style={{ backgroundColor: background, color: foreground }}
            >
              <strong>{formatName(foregroundRole)} on {formatName(backgroundRole)}</strong>
              <span>{foreground} / {background}</span>
              <span>WCAG contrast {contrastRatio(background, foreground)}:1</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ContrastDocumentation() {
  return (
    <StoryFrame
      scheme={lightScheme}
      title="Semantic contrast pairs"
      description="These examples preserve Material foreground/background pairings. Ratios are computed with the WCAG sRGB relative-luminance formula for documentation."
    >
      <div className="color-docs__contrast-grid">
        <ContrastSection scheme={lightScheme} title="Standard contrast · light" />
        <ContrastSection scheme={darkScheme} title="Standard contrast · dark" />
        <ContrastSection scheme={highContrastLightScheme} title="Maximum contrast · light" />
      </div>
    </StoryFrame>
  );
}

export const TonalPalettes: Story = {
  render: () => <TonalPaletteDocumentation />,
};

export const SemanticLightScheme: Story = {
  render: () => (
    <SemanticSchemeDocumentation scheme={lightScheme} title="Semantic light scheme" />
  ),
};

export const SemanticDarkScheme: Story = {
  render: () => (
    <SemanticSchemeDocumentation scheme={darkScheme} title="Semantic dark scheme" />
  ),
};

export const RoleNames: Story = {
  render: () => <RoleNameDocumentation />,
};

export const ContrastExamples: Story = {
  render: () => <ContrastDocumentation />,
};
