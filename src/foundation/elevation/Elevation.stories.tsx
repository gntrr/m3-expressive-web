import type { CSSProperties, ReactNode } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  MATERIAL_ELEVATION_LEVEL_NAMES,
  materialElevation,
  materialElevationShadowToCssVariable,
  toMaterialElevationCssVariables,
  toMaterialElevationShadowCssVariables,
  type MaterialElevationLevelName,
} from './index.js';
import './Elevation.stories.css';

function elevationVariables(): CSSProperties {
  return {
    ...toMaterialElevationCssVariables(),
    ...toMaterialElevationShadowCssVariables(),
  } as CSSProperties;
}

function StoryFrame({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <main className="elevation-story" style={elevationVariables()}>
      <header className="elevation-story__header">
        <p className="elevation-story__eyebrow">Material 3 foundation</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      {children}
    </main>
  );
}

function ElevationSurface({
  level,
  label,
}: {
  level: MaterialElevationLevelName;
  label?: string;
}) {
  const token = materialElevation[level];
  return (
    <article
      className="elevation-surface"
      style={{ boxShadow: `var(${materialElevationShadowToCssVariable(level)})` }}
    >
      <strong>{label ?? level}</strong>
      <span>
        web {token.webLevel} · reference {token.referenceDp} dp
      </span>
    </article>
  );
}

function CompleteScale() {
  return (
    <StoryFrame
      title="Elevation levels"
      description="Six semantic levels retain Material's reference distances while using the ordinal values expected by the official Material Web renderer."
    >
      <section className="elevation-grid" aria-label="Material elevation levels">
        {MATERIAL_ELEVATION_LEVEL_NAMES.map((level) => (
          <ElevationSurface key={level} level={level} />
        ))}
      </section>
    </StoryFrame>
  );
}

function LightAndDarkSurfaces() {
  return (
    <StoryFrame
      title="Light and dark surfaces"
      description="The same shadow geometry can render differently across surface colors and browsers. Dark themes still require deliberate surface-color separation."
    >
      <div className="elevation-theme-grid">
        <section className="elevation-theme elevation-theme--light">
          <h2>Light surface</h2>
          <ElevationSurface level="level3" />
        </section>
        <section className="elevation-theme elevation-theme--dark">
          <h2>Dark surface</h2>
          <ElevationSurface level="level3" />
        </section>
      </div>
    </StoryFrame>
  );
}

function StackingDistinction() {
  return (
    <StoryFrame
      title="Visual elevation is not DOM stacking"
      description="Both surfaces use level 3. Ordinary DOM order places the second surface above the first; the elevation token does not assign z-index or create a stacking policy."
    >
      <section className="stacking-demo" aria-label="DOM stacking comparison">
        <ElevationSurface level="level3" label="Earlier in DOM" />
        <ElevationSurface level="level3" label="Later in DOM" />
      </section>
    </StoryFrame>
  );
}

function TonalDistinction() {
  return (
    <StoryFrame
      title="Shadow and tonal elevation are separate"
      description="Shadow elevation changes rendered shadow geometry. Tonal treatment changes a semantic surface color and is intentionally not derived by this module."
    >
      <section className="treatment-comparison">
        <div>
          <h2>Shadow treatment</h2>
          <ElevationSurface level="level3" />
        </div>
        <div>
          <h2>Consumer surface treatment</h2>
          <article className="elevation-surface elevation-surface--tonal">
            <strong>Semantic surface color</strong>
            <span>No shadow level or z-index implied</span>
          </article>
        </div>
      </section>
    </StoryFrame>
  );
}

const meta = {
  title: 'Foundation/Elevation',
  component: CompleteScale,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof CompleteScale>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Levels: Story = {};

export const LightAndDark: Story = {
  render: () => <LightAndDarkSurfaces />,
};

export const VisualVersusStacking: Story = {
  render: () => <StackingDistinction />,
};

export const TonalVersusShadow: Story = {
  render: () => <TonalDistinction />,
};
