import type { CSSProperties, ReactNode } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { Button } from '../button/Button.js';
import { IconButton } from '../icon-button/IconButton.js';
import {
  toMaterialColorCssVariables,
  toMaterialElevationCssVariables,
  toMaterialElevationShadowCssVariables,
  toMaterialShapeCssVariables,
} from '../../foundation/index.js';
import { createMaterialColorScheme } from '../../foundation/color/generator.js';
import { CARD_VARIANTS, Card } from './Card.js';
import './card.css';
import './Card.stories.css';

const sharedVariables = {
  ...toMaterialElevationCssVariables(),
  ...toMaterialElevationShadowCssVariables(),
  ...toMaterialShapeCssVariables(),
};

function schemeVariables(mode: 'light' | 'dark'): CSSProperties {
  return {
    ...sharedVariables,
    ...toMaterialColorCssVariables(
      createMaterialColorScheme({
        seed: '#6750A4',
        variant: 'tonalSpot',
        contrastLevel: 0,
        mode,
      }),
    ),
  } as CSSProperties;
}

const lightVariables = schemeVariables('light');
const darkVariables = schemeVariables('dark');

function MoreIcon() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

function StoryFrame({
  children,
  description,
  mode = 'light',
  title,
}: {
  children: ReactNode;
  description: string;
  mode?: 'light' | 'dark';
  title: string;
}) {
  return (
    <div
      className="card-story"
      data-mode={mode}
      style={mode === 'dark' ? darkVariables : lightVariables}
    >
      <div className="card-story__header">
        <p className="card-story__eyebrow">Material 3 containment</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}

function CardContent({ children }: { children: ReactNode }) {
  return <div className="card-story__content">{children}</div>;
}

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <StoryFrame
      title="Card variants"
      description="Filled uses surface-container-highest, elevated uses surface-container-low, and outlined uses surface. Boundary and resting elevation differ by variant; Card itself supplies no padding, typography, or interaction state."
    >
      <div className="card-story__variant-grid">
        {CARD_VARIANTS.map((variant) => (
          <Card key={variant} variant={variant}>
            <CardContent>
              <h2>{variant}</h2>
              <p>Semantic containment for related information.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </StoryFrame>
  ),
};

export const LightAndDark: Story = {
  render: () => (
    <div className="card-story__variant-grid">
      <StoryFrame
        title="Light scheme"
        description="The current Material roles are surface-container-highest for filled, surface-container-low for elevated, and surface for outlined."
      >
        <Card variant="elevated">
          <CardContent>
            <h2>Elevated surface</h2>
            <p>Level 1 is a visual elevation value, not a stacking instruction.</p>
          </CardContent>
        </Card>
      </StoryFrame>
      <StoryFrame
        mode="dark"
        title="Dark scheme"
        description="The same roles resolve through a dark color scheme without a provider."
      >
        <Card variant="outlined">
          <CardContent>
            <h2>Outlined surface</h2>
            <p>Outline uses the semantic outline-variant role.</p>
          </CardContent>
        </Card>
      </StoryFrame>
    </div>
  ),
};

export const RichContent: Story = {
  render: () => (
    <StoryFrame
      title="Consumer-owned rich content"
      description="Media, headings, supporting text, and nested controls remain normal HTML owned by the consuming composition."
    >
      <Card className="card-story__rich-card" variant="outlined">
        <img
          alt="Abstract violet and orange color field"
          className="card-story__media"
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 280'%3E%3C/svg%3E"
        />
        <CardContent>
          <h2>Project overview</h2>
          <p>
            This is intentionally ordinary flow content. The Card primitive has
            no fixed slots or built-in spacing rules.
          </p>
          <div className="card-story__actions">
            <Button size="extra-small" variant="tonal">
              Open
            </Button>
            <IconButton aria-label="More project actions" size="extra-small">
              <MoreIcon />
            </IconButton>
          </div>
        </CardContent>
      </Card>
    </StoryFrame>
  ),
};

export const LongContentAndReflow: Story = {
  render: () => (
    <StoryFrame
      title="Natural sizing and reflow"
      description="Card has no fixed dimensions, aspect ratio, responsive breakpoint, or internal typography rule."
    >
      <Card className="card-story__reflow-card" variant="filled">
        <CardContent>
          <h2>A deliberately long content example</h2>
          <p>
            The surrounding layout determines available inline space. At browser
            zoom or in a narrow column, this ordinary document flow wraps
            naturally rather than shrinking, clipping, or changing Card size.
          </p>
        </CardContent>
      </Card>
    </StoryFrame>
  ),
};

export const PlatformBehavior: Story = {
  render: () => (
    <StoryFrame
      title="Static web behavior"
      description="Card is not a command or navigation primitive. It retains logical direction, forced-colors, and regular flow behavior without adding an interactive target."
    >
      <div className="card-story__platform-grid">
        <Card dir="rtl" variant="filled">
          <CardContent>
            <h2>الاتجاه من اليمين إلى اليسار</h2>
            <p>تتبع البطاقة اتجاه محتواها دون تغيير شكلها أو حجمها.</p>
          </CardContent>
        </Card>
        <Card className="card-story__forced-preview" variant="outlined">
          <CardContent>
            <h2>Forced colors</h2>
            <p>The outlined boundary has a system-color fallback.</p>
          </CardContent>
        </Card>
      </div>
    </StoryFrame>
  ),
};

export const ElevationComparison: Story = {
  render: () => (
    <StoryFrame
      title="Resting elevation only"
      description="Filled and outlined use level 0. Elevated uses level 1. Neither implies z-index, stacking context, hover elevation, or motion."
    >
      <div className="card-story__elevation-row">
        <Card variant="filled">
          <CardContent>
            <h2>Filled / level 0</h2>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent>
            <h2>Elevated / level 1</h2>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <h2>Outlined / level 0</h2>
          </CardContent>
        </Card>
      </div>
    </StoryFrame>
  ),
};

export const StaticSemantics: Story = {
  render: () => (
    <StoryFrame
      title="No implicit interaction"
      description="A static Card is a neutral div. It does not enter the tab order or receive a role, name, pointer cursor, keyboard handler, or state layer."
    >
      <Card data-testid="static-card">
        <CardContent>
          <h2>Static content container</h2>
          <p>Use explicit nested controls for any actions.</p>
        </CardContent>
      </Card>
    </StoryFrame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByTestId('static-card');

    await expect(card.tagName).toBe('DIV');
    await expect(card).not.toHaveAttribute('role');
    await expect(card).not.toHaveAttribute('tabindex');
    await expect(card).not.toHaveAttribute('aria-label');
  },
};
