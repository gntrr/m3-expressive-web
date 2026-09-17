import { useState, type CSSProperties, type ReactNode } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import {
  createMaterialTypography,
  toMaterialColorCssVariables,
  toMaterialElevationCssVariables,
  toMaterialElevationShadowCssVariables,
  toMaterialShapeCssVariables,
  toMaterialStateCssVariables,
  toMaterialTypographyCssVariables,
} from '../../foundation/index.js';
import { createMaterialColorScheme } from '../../foundation/color/generator.js';
import {
  ICON_BUTTON_SIZES,
  ICON_BUTTON_VARIANTS,
  IconButton,
  type IconButtonSize,
} from './IconButton.js';
import './icon-button.css';
import './IconButton.stories.css';

const sharedVariables = {
  ...toMaterialTypographyCssVariables(createMaterialTypography()),
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

function SettingsIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24">
      <path
        d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.36-6.36-1.42 1.42M7.05 16.95l-1.41 1.41m12.73 0-1.42-1.41M7.05 7.05 5.64 5.64M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function AddIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" />
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
      className="icon-button-story"
      data-mode={mode}
      style={mode === 'dark' ? darkVariables : lightVariables}
    >
      <div className="icon-button-story__header">
        <p className="icon-button-story__eyebrow">Material 3 component</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}

function VariantRow({
  disabled = false,
  shape = 'round',
  size = 'small',
}: {
  disabled?: boolean;
  shape?: 'round' | 'square';
  size?: IconButtonSize;
}) {
  return (
    <div className="icon-button-story__row">
      {ICON_BUTTON_VARIANTS.map((variant) => (
        <IconButton
          aria-label={`${variant} settings`}
          disabled={disabled}
          key={variant}
          shape={shape}
          size={size}
          variant={variant}
        >
          <SettingsIcon />
        </IconButton>
      ))}
    </div>
  );
}

function VariantGallery() {
  return (
    <StoryFrame
      title="IconButton variants"
      description="Four ordinary action variants use semantic colors, native button semantics, and level-zero elevation. Toggle behavior is intentionally separate and not implemented here."
    >
      <VariantRow />
    </StoryFrame>
  );
}

function SizeGallery() {
  return (
    <StoryFrame
      title="Expressive uniform size scale"
      description="Only the canonical uniform visual widths are implemented. The button box is the actual interactive target; no invisible 48px expansion is added."
    >
      <div className="icon-button-story__stack">
        {ICON_BUTTON_SIZES.map((size) => (
          <section className="icon-button-story__size-row" key={size}>
            <code>{size}</code>
            <IconButton
              aria-label={`${size} settings`}
              data-testid={`size-${size}`}
              size={size}
            >
              <SettingsIcon />
            </IconButton>
          </section>
        ))}
      </div>
    </StoryFrame>
  );
}

function ShapeGallery() {
  return (
    <StoryFrame
      title="Round, provisional square, and pressed shapes"
      description="Round is the canonical default. Square is a documented provisional web API. Pressing applies the canonical pressed corner role immediately because no reviewed CSS spring renderer exists."
    >
      <div className="icon-button-story__stack">
        {ICON_BUTTON_SIZES.map((size) => (
          <section className="icon-button-story__shape-row" key={size}>
            <code>{size}</code>
            <IconButton aria-label={`${size} round`} shape="round" size={size}>
              <SettingsIcon />
            </IconButton>
            <IconButton aria-label={`${size} square`} shape="square" size={size}>
              <SettingsIcon />
            </IconButton>
            <IconButton
              aria-label={`${size} pressed preview`}
              className="icon-button-story__pressed-preview"
              size={size}
            >
              <SettingsIcon />
            </IconButton>
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
      description="An icon-only action always requires exactly one accessible name. The SVG is wrapped as presentation, so its descendants do not compete with the button name. title alone is intentionally invalid."
    >
      <div className="icon-button-story__row">
        <IconButton aria-label="Add item">
          <AddIcon />
        </IconButton>
        <span id="story-settings-label">Open settings</span>
        <IconButton aria-labelledby="story-settings-label">
          <SettingsIcon />
        </IconButton>
      </div>
    </StoryFrame>
  );
}

function ThemeGallery() {
  return (
    <div className="icon-button-story__theme-pair">
      <StoryFrame
        title="Light scheme"
        description="Generated semantic Color roles drive every variant."
      >
        <VariantRow />
      </StoryFrame>
      <StoryFrame
        mode="dark"
        title="Dark scheme"
        description="The component has no theme runtime and consumes the same semantic roles."
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
      title="Pointer, focus, press, and disabled states"
      description="Hover is limited to fine hover-capable pointers. Focus-visible is outside the clipped visual layer. Press applies the state layer and immediate pressed shape; disabled remains native."
    >
      <div className="icon-button-story__row">
        <IconButton
          aria-label="State target"
          data-testid="state-target"
          onClick={() => setClicks((value) => value + 1)}
        >
          <SettingsIcon />
        </IconButton>
        <IconButton aria-label="Disabled target" data-testid="disabled-target" disabled>
          <SettingsIcon />
        </IconButton>
        <output>Clicks: {clicks}</output>
      </div>
    </StoryFrame>
  );
}

function PlatformGallery() {
  return (
    <StoryFrame
      title="RTL, forced colors, reduced motion, and hit area"
      description="Logical geometry inherits RTL without mirroring arbitrary icons. Forced-colors uses system colors and a visible boundary. There is no animation runtime, so reduced motion preserves immediate feedback."
    >
      <div className="icon-button-story__platform-grid">
        <section dir="rtl">
          <h2>RTL</h2>
          <IconButton aria-label="الإعدادات" variant="outlined">
            <SettingsIcon />
          </IconButton>
        </section>
        <section>
          <h2>Actual visual / hit size</h2>
          <div className="icon-button-story__target-reference">
            <IconButton aria-label="Extra-small settings" size="extra-small">
              <SettingsIcon />
            </IconButton>
          </div>
          <p>32px actual button box; layouts provide any 48px touch spacing.</p>
        </section>
        <section className="icon-button-story__forced-preview">
          <h2>Forced colors</h2>
          <IconButton aria-label="System enabled" variant="filled">
            <SettingsIcon />
          </IconButton>
          <IconButton aria-label="System disabled" disabled variant="outlined">
            <SettingsIcon />
          </IconButton>
        </section>
      </div>
    </StoryFrame>
  );
}

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    'aria-label': 'Settings',
    children: <SettingsIcon />,
    shape: 'round',
    size: 'small',
    variant: 'standard',
  },
  argTypes: {
    variant: { control: 'select', options: ICON_BUTTON_VARIANTS },
    size: { control: 'select', options: ICON_BUTTON_SIZES },
    shape: { control: 'inline-radio', options: ['round', 'square'] },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <StoryFrame
      title="IconButton playground"
      description="Adjust the ordinary IconButton's supported variant, uniform size, provisional shape, and native button props."
    >
      <IconButton {...args} />
    </StoryFrame>
  ),
};

export const Variants: Story = { render: () => <VariantGallery /> };
export const Sizes: Story = {
  render: () => <SizeGallery />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const expectedSizes = [32, 40, 56, 96, 136];
    ICON_BUTTON_SIZES.forEach((size, index) => {
      const button = canvas.getByTestId(`size-${size}`);
      expect(button.getBoundingClientRect().width).toBe(expectedSizes[index]);
      expect(button.getBoundingClientRect().height).toBe(expectedSizes[index]);
    });
  },
};
export const Shapes: Story = { render: () => <ShapeGallery /> };
export const AccessibleNames: Story = { render: () => <NamingGallery /> };
export const Disabled: Story = {
  render: () => (
    <StoryFrame
      title="Disabled variants"
      description="Disabled colors are semantic per variant. The whole control is never faded with opacity."
    >
      <VariantRow disabled />
    </StoryFrame>
  ),
};
export const LightAndDark: Story = { render: () => <ThemeGallery /> };
export const InteractionStates: Story = {
  render: () => <StateGallery />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('state-target');
    const disabled = canvas.getByTestId('disabled-target');
    await userEvent.hover(button);
    await userEvent.click(button);
    expect(canvas.getByText('Clicks: 1')).toBeVisible();
    await userEvent.click(disabled);
    expect(canvas.getByText('Clicks: 1')).toBeVisible();
  },
};
export const PlatformBehavior: Story = { render: () => <PlatformGallery /> };
