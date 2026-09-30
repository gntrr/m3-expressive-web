import { useState, type CSSProperties, type ReactNode } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import {
  toMaterialColorCssVariables,
  toMaterialElevationCssVariables,
  toMaterialElevationShadowCssVariables,
  toMaterialShapeCssVariables,
  toMaterialStateCssVariables,
} from '../../foundation/index.js';
import { createMaterialColorScheme } from '../../foundation/color/generator.js';
import { CARD_ACTION_VARIANTS, CardAction } from './CardAction.js';
import './card-action.css';
import './CardAction.stories.css';

const sharedVariables = {
  ...toMaterialElevationCssVariables(),
  ...toMaterialElevationShadowCssVariables(),
  ...toMaterialShapeCssVariables(),
  ...toMaterialStateCssVariables(),
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
      className="card-action-story"
      data-mode={mode}
      style={mode === 'dark' ? darkVariables : lightVariables}
    >
      <div className="card-action-story__header">
        <p className="card-action-story__eyebrow">Material 3 whole-card command</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}

function ActionContent({ children }: { children: ReactNode }) {
  return <span className="card-action-story__content">{children}</span>;
}

function VariantGallery() {
  return (
    <StoryFrame
      title="CardAction variants"
      description="Each native command uses the reconciled Material roles: filled surface-container-highest, elevated surface-container-low, and outlined surface with an outline-variant boundary."
    >
      <div className="card-action-story__grid">
        {CARD_ACTION_VARIANTS.map((variant) => (
          <CardAction key={variant} variant={variant}>
            <ActionContent>
              <strong>{variant}</strong>
              <span>Open details for this one command.</span>
            </ActionContent>
          </CardAction>
        ))}
      </div>
    </StoryFrame>
  );
}

function StateGallery() {
  const [activations, setActivations] = useState(0);
  return (
    <StoryFrame
      title="State layers, focus, and elevation"
      description="Fine-pointer hover adds the foundation hover layer. Focus-visible and active use their own layer without stacking; filled changes from level 0 to 1 on hover, elevated from level 1 to 2, and outlined stays level 0."
    >
      <div className="card-action-story__row">
        <CardAction
          data-testid="state-target"
          onClick={() => setActivations((value) => value + 1)}
          variant="elevated"
        >
          <ActionContent>
            <strong>State target</strong>
            <span>Focus, hover, or press this command.</span>
          </ActionContent>
        </CardAction>
        <CardAction disabled variant="outlined">
          <ActionContent>
            <strong>Disabled command</strong>
            <span>Native disabled suppresses interaction layers.</span>
          </ActionContent>
        </CardAction>
        <output>Activations: {activations}</output>
      </div>
    </StoryFrame>
  );
}

function PlatformGallery() {
  return (
    <StoryFrame
      title="Names, platform behavior, and clipping"
      description="Visible text names a command by default. The inner visual layer clips only the state layer; the native root keeps its focus indicator and shadow outside. Forced-colors uses system colors, while reduced motion has no animation runtime to suppress."
    >
      <div className="card-action-story__grid">
        <section>
          <h2>aria-label</h2>
          <CardAction aria-label="Open account details">
            <ActionContent>
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1-5 4-7 8-7s7 2 8 7" />
              </svg>
            </ActionContent>
          </CardAction>
        </section>
        <section>
          <h2>aria-labelledby</h2>
          <span id="card-action-story-label">Review account details</span>
          <CardAction aria-labelledby="card-action-story-label">
            <ActionContent><span aria-hidden="true">→</span></ActionContent>
          </CardAction>
        </section>
        <section dir="rtl">
          <h2>RTL</h2>
          <CardAction variant="outlined">
            <ActionContent><span>فتح التفاصيل</span></ActionContent>
          </CardAction>
        </section>
        <section className="card-action-story__forced-preview">
          <h2>Forced colors / reduced motion</h2>
          <CardAction variant="outlined">
            <ActionContent><span>System command</span></ActionContent>
          </CardAction>
        </section>
      </div>
    </StoryFrame>
  );
}

const meta = {
  title: 'Components/CardAction',
  component: CardAction,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    children: 'Open details',
    variant: 'filled',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: CARD_ACTION_VARIANTS },
  },
} satisfies Meta<typeof CardAction>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <StoryFrame
      title="CardAction playground"
      description="A single native button for one whole-card command. Keep children to non-interactive phrasing content; static Card remains the choice for rich content with independent actions."
    >
      <CardAction {...args} />
    </StoryFrame>
  ),
};

export const Variants: Story = { render: () => <VariantGallery /> };

export const LightAndDark: Story = {
  render: () => (
    <div className="card-action-story__theme-pair">
      <StoryFrame
        title="Light scheme"
        description="Filled and elevated consume their current semantic surface-container roles."
      >
        <CardAction variant="filled"><ActionContent>Light command</ActionContent></CardAction>
      </StoryFrame>
      <StoryFrame
        mode="dark"
        title="Dark scheme"
        description="The same named roles resolve through a dark scheme without a provider."
      >
        <CardAction variant="elevated"><ActionContent>Dark command</ActionContent></CardAction>
      </StoryFrame>
    </div>
  ),
};

export const LongContentAndReflow: Story = {
  render: () => (
    <StoryFrame
      title="Phrasing content and natural reflow"
      description="CardAction adds no content padding, fixed dimensions, aspect ratio, or typography role. Its parent determines available space, including under browser zoom."
    >
      <CardAction className="card-action-story__reflow" variant="outlined">
        <ActionContent>
          <strong>A deliberately long whole-card command</strong>
          <span>
            The semantic button remains intrinsic and wraps ordinary phrasing content
            naturally when its containing layout becomes narrow.
          </span>
        </ActionContent>
      </CardAction>
    </StoryFrame>
  ),
};

export const StatesAndKeyboard: Story = {
  render: () => <StateGallery />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const target = canvas.getByTestId('state-target');
    await userEvent.hover(target);
    target.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(canvas.getByText('Activations: 2')).toBeVisible();
  },
};

export const PlatformBehavior: Story = { render: () => <PlatformGallery /> };

export const InvalidContentGuidance: Story = {
  render: () => (
    <StoryFrame
      title="Invalid nested-content guidance"
      description="These examples are documentation only and are intentionally not rendered as CardAction content, because nested controls and flow-sectioning elements make invalid native button markup."
    >
      <pre className="card-action-story__invalid-code">{`<CardAction>\n  <div>Invalid layout child</div>\n  <a href="/details">Invalid nested link</a>\n</CardAction>`}</pre>
    </StoryFrame>
  ),
};
