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
import { FAB_SIZES, FAB_VARIANTS, Fab } from './Fab.js';
import './fab.css';
import './Fab.stories.css';

const sharedVariables = {
  ...toMaterialShapeCssVariables(),
  ...toMaterialElevationCssVariables(),
  ...toMaterialElevationShadowCssVariables(),
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

function AddIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24">
      <path
        d="m4 16.5-.5 4 4-.5L19 8.5 15.5 5 4 16.5ZM14 6.5l3.5 3.5"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
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
      className="fab-story"
      data-mode={mode}
      style={mode === 'dark' ? darkVariables : lightVariables}
    >
      <div className="fab-story__header">
        <p className="fab-story__eyebrow">Material 3 primary action</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}

function VariantRow({ disabled = false }: { disabled?: boolean }) {
  return (
    <div className="fab-story__row">
      {FAB_VARIANTS.map((variant) => (
        <Fab
          aria-label={`${variant} create item`}
          disabled={disabled}
          key={variant}
          variant={variant}
        >
          <AddIcon />
        </Fab>
      ))}
    </div>
  );
}

function VariantGallery() {
  return (
    <StoryFrame
      title="FAB variants"
      description="Surface, primary, secondary, and tertiary variants consume semantic system colors. Primary is this library's deliberate default; it is a documented web decision."
    >
      <VariantRow />
    </StoryFrame>
  );
}

function SizeGallery() {
  return (
    <StoryFrame
      title="Baseline and Expressive size tiers"
      description="The actual button box is the visual box. Small remains 40px, with no invisible target expansion; application layout owns Material’s 48px touch-facing recommendation."
    >
      <div className="fab-story__sizes">
        {FAB_SIZES.map((size) => (
          <section className="fab-story__size-row" key={size}>
            <code>{size}</code>
            <Fab aria-label={`${size} create item`} size={size}>
              <AddIcon />
            </Fab>
            <span>
              {size === 'small'
                ? '40px / 24px'
                : size === 'regular'
                  ? '56px / 24px'
                  : size === 'medium'
                    ? '80px / 28px'
                    : '96px / 36px'}
            </span>
          </section>
        ))}
      </div>
    </StoryFrame>
  );
}

function NamingGallery() {
  return (
    <StoryFrame
      title="Accessible icon names"
      description="An icon-only FAB requires exactly one accessible name. Its icon is decorative, so SVG titles cannot compete with the native button name. title alone is intentionally invalid."
    >
      <div className="fab-story__row">
        <Fab aria-label="Create item">
          <AddIcon />
        </Fab>
        <span id="story-create-label">Edit item</span>
        <Fab aria-labelledby="story-create-label">
          <EditIcon />
        </Fab>
      </div>
    </StoryFrame>
  );
}

function ThemeGallery() {
  return (
    <div className="fab-story__theme-pair">
      <StoryFrame
        title="Light scheme"
        description="Generated semantic color roles drive the four variants."
      >
        <VariantRow />
      </StoryFrame>
      <StoryFrame
        mode="dark"
        title="Dark scheme"
        description="The component remains provider-free and consumes the same role names."
      >
        <VariantRow />
      </StoryFrame>
    </div>
  );
}

function StateGallery() {
  const [clicks, setClicks] = useState(0);
  return (
    <StoryFrame
      title="Elevation and interaction states"
      description="Enabled, focus-visible, and pressed use level 3; fine-pointer hover uses level 4. The state layer is clipped inside the visual layer, while the focus indicator and shadow remain outside it."
    >
      <div className="fab-story__row">
        <Fab
          aria-label="State target"
          data-testid="state-target"
          onClick={() => setClicks((value) => value + 1)}
        >
          <AddIcon />
        </Fab>
        <Fab aria-label="Disabled target" disabled variant="secondary">
          <EditIcon />
        </Fab>
        <output>Activations: {clicks}</output>
      </div>
    </StoryFrame>
  );
}

function PlatformGallery() {
  return (
    <StoryFrame
      title="Platform behavior and actual hit area"
      description="FAB has no viewport-driven resizing or placement. It uses logical CSS, system colors in forced-colors, immediate state changes under reduced motion, and no animation runtime."
    >
      <div className="fab-story__platform-grid">
        <section dir="rtl">
          <h2>RTL</h2>
          <Fab aria-label="إنشاء عنصر" variant="tertiary">
            <AddIcon />
          </Fab>
        </section>
        <section>
          <h2>Small actual target</h2>
          <Fab aria-label="Small create item" size="small">
            <AddIcon />
          </Fab>
          <p>40px button box; layout owns any 48px touch spacing.</p>
        </section>
        <section className="fab-story__forced-preview">
          <h2>Forced colors and reduced motion</h2>
          <Fab aria-label="System create item" variant="surface">
            <AddIcon />
          </Fab>
          <Fab aria-label="Disabled system action" disabled>
            <EditIcon />
          </Fab>
        </section>
      </div>
    </StoryFrame>
  );
}

const meta = {
  title: 'Components/Fab',
  component: Fab,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    'aria-label': 'Create item',
    children: <AddIcon />,
    size: 'regular',
    variant: 'primary',
  },
  argTypes: {
    variant: { control: 'select', options: FAB_VARIANTS },
    size: { control: 'select', options: FAB_SIZES },
  },
} satisfies Meta<typeof Fab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <StoryFrame
      title="FAB playground"
      description="Adjust the icon-only FAB’s supported variant, size, and native button props. Extended FAB remains a separate, unimplemented contract."
    >
      <Fab {...args} />
    </StoryFrame>
  ),
};

export const Variants: Story = { render: () => <VariantGallery /> };
export const Sizes: Story = { render: () => <SizeGallery /> };
export const AccessibleNames: Story = { render: () => <NamingGallery /> };
export const Disabled: Story = {
  render: () => (
    <StoryFrame
      title="Native disabled FAB"
      description="Disabled uses native button semantics, documented disabled colors, and level-zero elevation—not whole-control opacity."
    >
      <VariantRow disabled />
    </StoryFrame>
  ),
};
export const LightAndDark: Story = { render: () => <ThemeGallery /> };
export const ElevationAndStates: Story = {
  render: () => <StateGallery />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const target = canvas.getByTestId('state-target');
    target.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(canvas.getByText('Activations: 2')).toBeInTheDocument();
  },
};
export const PlatformBehavior: Story = { render: () => <PlatformGallery /> };
