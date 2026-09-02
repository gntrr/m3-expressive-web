import { useState, type CSSProperties, type ReactNode } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  MATERIAL_MOTION_CATEGORIES,
  MATERIAL_REDUCED_MOTION_POLICY,
  materialMotion,
  toMaterialMotionCssVariables,
  type MaterialMotionScheme,
} from './index.js';
import './Motion.stories.css';

function motionVariables(): CSSProperties {
  return toMaterialMotionCssVariables() as CSSProperties;
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
    <main className="motion-story" style={motionVariables()}>
      <header className="motion-story__header">
        <p className="motion-story__eyebrow">Material 3 foundation</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      {children}
    </main>
  );
}

function SchemePanel({ scheme }: { scheme: MaterialMotionScheme }) {
  return (
    <section className="scheme-panel">
      <header>
        <h2>{scheme.name}</h2>
        <p>{scheme.description}</p>
      </header>
      <div className="scheme-token-grid">
        {MATERIAL_MOTION_CATEGORIES.map((category) => {
          const token = scheme.tokens[category];
          const width = `${Math.max(12, (token.model.stiffness / 3800) * 100)}%`;
          return (
            <article className="motion-token" key={category}>
              <div className="motion-token__heading">
                <code>{category}</code>
                <span>{token.intent}</span>
              </div>
              <div className="motion-token__meter" aria-hidden="true">
                <span style={{ width }} />
              </div>
              <p>
                stiffness {token.model.stiffness} · damping{' '}
                {token.model.dampingRatio}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SchemeComparison() {
  return (
    <StoryFrame
      title="Standard and Expressive schemes"
      description="Both schemes expose the same six semantic spring slots. Expressive changes spatial physics; current effects physics remains identical. Bars compare stiffness only and are not duration estimates."
    >
      <div className="scheme-comparison">
        <SchemePanel scheme={materialMotion.standard} />
        <SchemePanel scheme={materialMotion.expressive} />
      </div>
    </StoryFrame>
  );
}

function SpatialCurveDemo() {
  const [active, setActive] = useState(false);
  return (
    <StoryFrame
      title="Spatial curve representation"
      description="This documentation-only transition demonstrates transform with baseline duration/easing tokens. It is not presented as a spring approximation."
    >
      <section className="motion-demo">
        <div className={`motion-track ${active ? 'is-active' : ''}`}>
          <div className="motion-track__object" aria-hidden="true" />
        </div>
        <button
          aria-pressed={active}
          onClick={() => setActive((value) => !value)}
          type="button"
        >
          {active ? 'Reverse spatial transition' : 'Start spatial transition'}
        </button>
        <p>
          Toggle again before completion to inspect interruption and reversal from
          the browser&apos;s current interpolated value.
        </p>
      </section>
    </StoryFrame>
  );
}

function EffectsCurveDemo() {
  const [active, setActive] = useState(false);
  return (
    <StoryFrame
      title="Effects motion"
      description="Effects tokens are intended for non-spatial values such as opacity and color, where overshoot may produce invalid or distracting output."
    >
      <section className="motion-demo">
        <div className={`effects-stage ${active ? 'is-active' : ''}`}>
          <div className="effects-stage__object" aria-hidden="true" />
          <p>Decorative opacity layer; this text remains fully legible.</p>
        </div>
        <button
          aria-pressed={active}
          onClick={() => setActive((value) => !value)}
          type="button"
        >
          Toggle effects transition
        </button>
      </section>
    </StoryFrame>
  );
}

function ReducedMotionDemo() {
  const rules = Object.values(MATERIAL_REDUCED_MOTION_POLICY.rules);
  return (
    <StoryFrame
      title="Reduced-motion policy"
      description="Enable reduced motion in the operating system to remove the decorative loop and replace the spatial demonstration without globally zeroing every duration."
    >
      <section className="reduced-motion-demo">
        <div className="reduced-motion-demo__visual" aria-hidden="true">
          <span />
        </div>
        <div className="reduced-motion-rules">
          {rules.map((rule) => (
            <article key={rule.category}>
              <h2>{rule.category}</h2>
              <p><code>{rule.action}</code></p>
              <p>{rule.guidance}</p>
            </article>
          ))}
        </div>
      </section>
    </StoryFrame>
  );
}

const meta = {
  title: 'Foundation/Motion',
  component: SchemeComparison,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof SchemeComparison>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SchemesAndCategories: Story = {};

export const SpatialMotionAndInterruption: Story = {
  render: () => <SpatialCurveDemo />,
};

export const EffectsMotion: Story = {
  render: () => <EffectsCurveDemo />,
};

export const ReducedMotion: Story = {
  render: () => <ReducedMotionDemo />,
};
