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
  ToggleIconButton,
  type IconButtonSize,
} from './index.js';
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

function MuteIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24">
      <path
        d="M4 9v6h4l5 4V5L8 9H4Zm12 1 4 4m0-4-4 4"
        stroke="currentColor"
        strokeLinecap="round"
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

function ToggleRow({
  disabled = false,
  pressed = false,
  shape = 'round',
  size = 'small',
}: {
  disabled?: boolean;
  pressed?: boolean;
  shape?: 'round' | 'square';
  size?: IconButtonSize;
}) {
  return (
    <div className="icon-button-story__row">
      {ICON_BUTTON_VARIANTS.map((variant) => (
        <ToggleIconButton
          aria-label={`${variant} mute`}
          disabled={disabled}
          key={variant}
          pressed={pressed}
          shape={shape}
          size={size}
          variant={variant}
        >
          <MuteIcon />
        </ToggleIconButton>
      ))}
    </div>
  );
}

function VariantGallery() {
  return (
    <StoryFrame
      title="ToggleIconButton variants"
      description="Persistent pressed mode is separate from transient hover, focus-visible, and active states. Each variant has its own canonical pressed and unpressed color treatment."
    >
      <div className="icon-button-story__stack">
        <section>
          <h2>Unpressed</h2>
          <ToggleRow />
        </section>
        <section>
          <h2>Pressed</h2>
          <ToggleRow pressed />
        </section>
      </div>
    </StoryFrame>
  );
}

function SizeGallery() {
  return (
    <StoryFrame
      title="Expressive sizes and selected shapes"
      description="All sizes use only their uniform visual width. Persistent pressed shape follows the documented selected role; active state temporarily takes precedence without animation."
    >
      <div className="icon-button-story__stack">
        {ICON_BUTTON_SIZES.map((size) => (
          <section className="icon-button-story__size-row" key={size}>
            <code>{size}</code>
            <ToggleIconButton
              aria-label={`${size} unpressed mute`}
              data-testid={`unpressed-${size}`}
              pressed={false}
              size={size}
            >
              <MuteIcon />
            </ToggleIconButton>
            <ToggleIconButton
              aria-label={`${size} pressed mute`}
              data-testid={`pressed-${size}`}
              pressed
              shape="square"
              size={size}
            >
              <MuteIcon />
            </ToggleIconButton>
          </section>
        ))}
      </div>
    </StoryFrame>
  );
}

function ControlledExample() {
  const [pressed, setPressed] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  return (
    <StoryFrame
      title="Controlled interaction and native keyboard activation"
      description="The component has no internal state. Native click, Enter, and Space call onClick first, then request the next value through onPressedChange."
    >
      <div className="icon-button-story__row">
        <ToggleIconButton
          aria-label="Mute audio"
          data-testid="controlled-toggle"
          onClick={() => setEvents((values) => [...values, 'click'])}
          onPressedChange={(next) => {
            setEvents((values) => [...values, `change:${next}`]);
            setPressed(next);
          }}
          pressed={pressed}
        >
          <MuteIcon />
        </ToggleIconButton>
        <output aria-live="polite">
          {pressed ? 'Muted' : 'Unmuted'} · {events.join(', ') || 'No activation'}
        </output>
      </div>
    </StoryFrame>
  );
}

function PlatformGallery() {
  return (
    <StoryFrame
      title="Disabled, names, RTL, forced colors, and reduced motion"
      description="Disabled controls preserve their persistent aria-pressed value but make no state-change request. Icons remain decorative; the name comes from aria-label or aria-labelledby. Forced colors and reduced motion use the shared static fallbacks."
    >
      <div className="icon-button-story__platform-grid">
        <section>
          <h2>Disabled mode values</h2>
          <div className="icon-button-story__row">
            <ToggleIconButton aria-label="Disabled unpressed" disabled pressed={false}>
              <MuteIcon />
            </ToggleIconButton>
            <ToggleIconButton aria-label="Disabled pressed" disabled pressed>
              <MuteIcon />
            </ToggleIconButton>
          </div>
        </section>
        <section>
          <h2>Labelled by text</h2>
          <span id="toggle-story-label">Mute audio</span>
          <ToggleIconButton aria-labelledby="toggle-story-label" pressed={false}>
            <MuteIcon />
          </ToggleIconButton>
        </section>
        <section dir="rtl">
          <h2>RTL</h2>
          <ToggleIconButton aria-label="كتم الصوت" pressed variant="outlined">
            <MuteIcon />
          </ToggleIconButton>
        </section>
        <section className="icon-button-story__forced-preview">
          <h2>Forced colors / reduced motion</h2>
          <ToggleIconButton aria-label="System mute" pressed variant="filled">
            <MuteIcon />
          </ToggleIconButton>
        </section>
      </div>
    </StoryFrame>
  );
}

const meta = {
  title: 'Components/ToggleIconButton',
  component: ToggleIconButton,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    'aria-label': 'Mute audio',
    children: <MuteIcon />,
    pressed: false,
    shape: 'round',
    size: 'small',
    variant: 'standard',
  },
  argTypes: {
    variant: { control: 'select', options: ICON_BUTTON_VARIANTS },
    size: { control: 'select', options: ICON_BUTTON_SIZES },
    shape: { control: 'inline-radio', options: ['round', 'square'] },
  },
} satisfies Meta<typeof ToggleIconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <StoryFrame
      title="ToggleIconButton playground"
      description="Controlled pressed state, native button semantics, and the same uniform geometry as IconButton."
    >
      <ToggleIconButton {...args} />
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
      expect(canvas.getByTestId(`unpressed-${size}`).getBoundingClientRect().width).toBe(
        expectedSizes[index],
      );
      expect(canvas.getByTestId(`pressed-${size}`).getBoundingClientRect().height).toBe(
        expectedSizes[index],
      );
    });
  },
};
export const ControlledInteraction: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('controlled-toggle');
    await userEvent.click(button);
    await expect(canvas.getByText(/Muted · click, change:true/)).toBeVisible();
    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByText(/Unmuted/)).toBeVisible();
  },
};
export const PlatformBehavior: Story = { render: () => <PlatformGallery /> };
