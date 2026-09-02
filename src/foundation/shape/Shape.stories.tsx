import type { CSSProperties, ReactNode } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  getMaterialShape,
  MATERIAL_EXPRESSIVE_SHAPE_NAMES,
  MATERIAL_SHAPE_CORNERS,
  MATERIAL_SHAPE_CORNER_ROLES,
  materialShapeCornerToCssVariable,
  toMaterialShapeCssVariables,
  toMaterialShapeSvgPath,
  type MaterialExpressiveShapeName,
  type MaterialShapeDirection,
} from './index.js';
import './Shape.stories.css';

function shapeVariables(direction: MaterialShapeDirection = 'ltr'): CSSProperties {
  return toMaterialShapeCssVariables({ direction }) as CSSProperties;
}

function StoryFrame({
  children,
  description,
  direction = 'ltr',
  title,
}: {
  children: ReactNode;
  description: string;
  direction?: MaterialShapeDirection;
  title: string;
}) {
  return (
    <main
      className="shape-story"
      dir={direction}
      style={shapeVariables(direction)}
    >
      <header className="shape-story__header">
        <p className="shape-story__eyebrow">Material 3 foundation</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      {children}
    </main>
  );
}

function NamedShape({
  name,
  size,
}: {
  name: MaterialExpressiveShapeName;
  size?: string;
}) {
  const shape = getMaterialShape(name);
  return (
    <figure className="named-shape">
      <svg
        aria-hidden="true"
        style={size ? { width: size, height: size } : undefined}
        viewBox="0 0 1 1"
      >
        <path d={toMaterialShapeSvgPath(shape)} />
      </svg>
      <figcaption>
        <code>{name}</code>
      </figcaption>
    </figure>
  );
}

function SemanticCornerScale() {
  return (
    <StoryFrame
      title="Semantic corner scale"
      description="Canonical Material Web corner roles serialize directly to border-radius; expanded Expressive roles remain part of the same semantic scale."
    >
      <section className="corner-grid" aria-label="Material corner roles">
        {MATERIAL_SHAPE_CORNER_ROLES.map((role) => (
          <article className="corner-specimen" key={role}>
            <div
              className="corner-specimen__shape"
              style={{
                borderRadius: `var(${materialShapeCornerToCssVariable(role)})`,
              }}
            />
            <p><code>{role}</code></p>
            <p>{MATERIAL_SHAPE_CORNERS[role].generation} ·{' '}
              {toMaterialShapeCssVariables()[materialShapeCornerToCssVariable(role)]}
            </p>
          </article>
        ))}
      </section>
    </StoryFrame>
  );
}

function DirectionalCorners() {
  return (
    <StoryFrame
      title="Logical directional corners"
      description="Start and end roles preserve their logical meaning when the document direction changes. Top-only roles remain invariant."
    >
      <div className="direction-comparison">
        {(['ltr', 'rtl'] as const).map((direction) => (
          <section
            className="direction-panel"
            dir={direction}
            key={direction}
            style={shapeVariables(direction)}
          >
            <h2>{direction.toUpperCase()}</h2>
            <div className="direction-row">
              {(['largeStart', 'largeEnd', 'largeTop'] as const).map((role) => (
                <figure key={role}>
                  <div style={{ borderRadius: `var(${materialShapeCornerToCssVariable(role)})` }} />
                  <figcaption><code>{role}</code></figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}
      </div>
    </StoryFrame>
  );
}

function ExpressiveVocabulary() {
  return (
    <StoryFrame
      title="Expressive named shapes"
      description="All 35 names come from the pinned experimental AndroidX MaterialShapes source and render from normalized cubic geometry."
    >
      <section className="named-shape-grid" aria-label="Material Expressive named shapes">
        {MATERIAL_EXPRESSIVE_SHAPE_NAMES.map((name) => (
          <NamedShape key={name} name={name} />
        ))}
      </section>
    </StoryFrame>
  );
}

function ResizingGeometry() {
  return (
    <StoryFrame
      title="Normalized shape resizing"
      description="One unit-square path scales without changing its source geometry. SVG preserves the outline at browser zoom and different rendered sizes."
    >
      <section className="resize-row" aria-label="Cookie shape rendered at three sizes">
        {['4rem', '7rem', '11rem'].map((size) => (
          <NamedShape key={size} name="cookie4Sided" size={size} />
        ))}
      </section>
    </StoryFrame>
  );
}

function HitAreaComparison() {
  const cookiePath = toMaterialShapeSvgPath(getMaterialShape('cookie6Sided'));
  return (
    <StoryFrame
      title="Visual geometry and hit area"
      description="Clipping paint does not guarantee a usable target or focus indicator. This native button keeps a visible rectangular hit area around the expressive visual."
    >
      <section className="hit-area-demo">
        <button type="button">
          <svg aria-hidden="true" viewBox="0 0 1 1">
            <path d={cookiePath} />
          </svg>
          <span>Focus the rectangular hit area</span>
        </button>
        <p>
          The dashed box is the pointer and keyboard target. The SVG path is only
          the visual shape; consumers must preserve focus and forced-color boundaries.
        </p>
      </section>
    </StoryFrame>
  );
}

const meta = {
  title: 'Foundation/Shape',
  component: SemanticCornerScale,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof SemanticCornerScale>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CornerScale: Story = {};

export const DirectionalAndRtl: Story = {
  render: () => <DirectionalCorners />,
};

export const NamedShapes: Story = {
  render: () => <ExpressiveVocabulary />,
};

export const ResponsiveResizing: Story = {
  render: () => <ResizingGeometry />,
};

export const VisualShapeVersusHitArea: Story = {
  render: () => <HitAreaComparison />,
};
