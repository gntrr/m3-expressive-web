import { useState, type CSSProperties, type ReactNode } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import {
  createMaterialTypography,
  toMaterialColorCssVariables,
  toMaterialElevationCssVariables,
  toMaterialElevationShadowCssVariables,
  toMaterialMotionCssVariables,
  toMaterialShapeCssVariables,
  toMaterialStateCssVariables,
  toMaterialTypographyCssVariables,
} from '../../foundation/index.js';
import { createMaterialColorScheme } from '../../foundation/color/generator.js';
import {
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  Button,
  type ButtonSize,
} from './Button.js';
import './button.css';
import './Button.stories.css';

const sharedVariables = {
  ...toMaterialTypographyCssVariables(createMaterialTypography()),
  ...toMaterialShapeCssVariables(),
  ...toMaterialElevationCssVariables(),
  ...toMaterialElevationShadowCssVariables(),
  ...toMaterialMotionCssVariables(),
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

function ArrowIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 12h14m-5-5 5 5-5 5"
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
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
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
      className="button-story"
      data-mode={mode}
      style={mode === 'dark' ? darkVariables : lightVariables}
    >
      <div className="button-story__header">
        <p className="button-story__eyebrow">Material 3 component</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}

function ButtonRow({
  disabled = false,
  shape = 'round',
  size = 'small',
}: {
  disabled?: boolean;
  shape?: 'round' | 'square';
  size?: ButtonSize;
}) {
  return (
    <div className="button-story__row">
      {BUTTON_VARIANTS.map((variant) => (
        <Button
          disabled={disabled}
          key={variant}
          shape={shape}
          size={size}
          variant={variant}
        >
          {variant}
        </Button>
      ))}
    </div>
  );
}

function VariantGallery() {
  return (
    <StoryFrame
      title="Button variants"
      description="Five ordinary action variants share native semantics while expressing different levels of emphasis."
    >
      <ButtonRow />
    </StoryFrame>
  );
}

function SizeGallery() {
  return (
    <StoryFrame
      title="Expressive size scale"
      description="The five explicit size tiers preserve their documented visual heights, padding, icon sizes, typography roles, and outline widths."
    >
      <div className="button-story__stack">
        {BUTTON_SIZES.map((size) => (
          <section className="button-story__size-row" key={size}>
            <code>{size}</code>
            <Button data-testid={`size-${size}`} size={size}>
              {size}
            </Button>
          </section>
        ))}
      </div>
    </StoryFrame>
  );
}

function VariantSizeMatrix() {
  return (
    <StoryFrame
      title="Variant and size matrix"
      description="Every ordinary variant is available at every documented Expressive size. Primitive sizing does not change with the viewport."
    >
      <div className="button-story__matrix">
        {BUTTON_SIZES.map((size) => (
          <section key={size}>
            <h2>{size}</h2>
            <ButtonRow size={size} />
          </section>
        ))}
      </div>
    </StoryFrame>
  );
}

function ShapeGallery() {
  return (
    <StoryFrame
      title="Round and square shapes"
      description="Round resolves to a size-relative pill. Square resolves to the official per-size semantic corner role; hold a button to see its exact pressed target shape."
    >
      <div className="button-story__stack">
        {BUTTON_SIZES.map((size) => (
          <section className="button-story__shape-row" key={size}>
            <code>{size}</code>
            <Button shape="round" size={size}>Round</Button>
            <Button shape="square" size={size}>Square</Button>
          </section>
        ))}
      </div>
    </StoryFrame>
  );
}

function IconGallery() {
  return (
    <StoryFrame
      title="Icon placement"
      description="Optional icon slots are decorative and follow logical inline order, so the same DOM adapts naturally to RTL."
    >
      <div className="button-story__row">
        <Button leadingIcon={<AddIcon />}>Create</Button>
        <Button trailingIcon={<ArrowIcon />} variant="tonal">Continue</Button>
        <Button leadingIcon={<AddIcon />} trailingIcon={<ArrowIcon />} variant="outlined">
          Both icons
        </Button>
      </div>
    </StoryFrame>
  );
}

function DisabledGallery() {
  return (
    <StoryFrame
      title="Disabled states"
      description="Disabled colors are composited once from semantic roles. No opacity is placed on the whole control, and native disabled behavior remains intact."
    >
      <ButtonRow disabled />
    </StoryFrame>
  );
}

function ThemeGallery() {
  return (
    <div className="button-story__theme-pair">
      <StoryFrame
        title="Light scheme"
        description="Generated semantic roles from the same seed drive every variant."
      >
        <ButtonRow />
      </StoryFrame>
      <StoryFrame
        mode="dark"
        title="Dark scheme"
        description="The renderer consumes dark semantic roles without component-specific theme logic."
      >
        <ButtonRow />
      </StoryFrame>
    </div>
  );
}

function ContentStressGallery() {
  return (
    <StoryFrame
      title="Reflow, RTL, and zoom-safe content"
      description="Labels can reflow; logical padding, gap, and icon order work without physical left/right overrides. CSS pixels and rem typography remain browser-zoomable."
    >
      <div className="button-story__stress-grid">
        <section>
          <h2>Constrained long label</h2>
          <Button className="button-story__constrained" variant="filled">
            Save this unusually long preference and continue to the next step
          </Button>
        </section>
        <section dir="rtl">
          <h2>Right-to-left</h2>
          <Button leadingIcon={<AddIcon />} trailingIcon={<ArrowIcon />} variant="outlined">
            متابعة
          </Button>
        </section>
      </div>
    </StoryFrame>
  );
}

function InputModeGuidance() {
  return (
    <StoryFrame
      title="Input modes and target policy"
      description="Hover activates only for a fine hover-capable pointer. Focus-visible remains browser-native. The 32px minimum visual target exceeds WCAG 2.2's 24px minimum; layouts should still provide 48px target spacing where practical."
    >
      <div className="button-story__target-grid" aria-label="Target size comparison">
        <Button size="extra-small">32px visual target</Button>
        <Button size="small">40px visual target</Button>
        <span className="button-story__target-reference">48px spacing reference</span>
      </div>
    </StoryFrame>
  );
}

function MotionAndColorModeGuidance() {
  return (
    <StoryFrame
      title="Platform preference fallbacks"
      description="The implementation adds no CSS transition or animation: state-layer feedback and the exact pressed corner role apply immediately, including under reduced motion. Enable your operating system's forced-colors mode to exercise the native system-color overrides shown by this story."
    >
      <div className="button-story__stack">
        <section>
          <h2>Rest and immediate pressed geometry</h2>
          <div className="button-story__row">
            <Button>Resting small</Button>
            <Button className="button-story__pressed-preview">
              Pressed fallback
            </Button>
          </div>
        </section>
        <section>
          <h2>System-color boundary check</h2>
          <div className="button-story__forced-preview">
            <Button variant="filled">Enabled</Button>
            <Button disabled variant="outlined">Disabled</Button>
          </div>
        </section>
      </div>
    </StoryFrame>
  );
}

function ElevationGuidance() {
  return (
    <StoryFrame
      title="Elevation is visual, not structural"
      description="Filled and tonal buttons rise from level 0 to level 1 on supported hover input; elevated moves from level 1 to level 2. No variant assigns z-index or changes DOM stacking order."
    >
      <div className="button-story__elevation-surface">
        <Button variant="filled">Filled · level 0</Button>
        <Button variant="tonal">Tonal · level 0</Button>
        <Button variant="elevated">Elevated · level 1</Button>
        <Button variant="outlined">Outlined · level 0</Button>
      </div>
    </StoryFrame>
  );
}

function StateContractExample() {
  const [clicks, setClicks] = useState(0);
  return (
    <StoryFrame
      title="Interaction state contract"
      description="Pointer hover, keyboard focus, press, and native disabled behavior use the shared state tokens and documented precedence."
    >
      <div className="button-story__row">
        <Button
          data-testid="state-button"
          onClick={() => setClicks((value) => value + 1)}
        >
          State target
        </Button>
        <Button data-testid="disabled-button" disabled onClick={() => setClicks(99)}>
          Disabled
        </Button>
        <output>Clicks: {clicks}</output>
      </div>
    </StoryFrame>
  );
}

function InteractiveExample() {
  const [activations, setActivations] = useState(0);
  const [resets, setResets] = useState(0);
  const [submissions, setSubmissions] = useState(0);
  return (
    <StoryFrame
      title="Native keyboard and form behavior"
      description="Tab to the control and activate it with Enter or Space. The default type is button, so it does not accidentally submit a containing form."
    >
      <form
        className="button-story__form"
        onReset={() => setResets((value) => value + 1)}
        onSubmit={(event) => {
          event.preventDefault();
          setSubmissions((value) => value + 1);
        }}
      >
        <label>
          Draft name
          <input defaultValue="Material draft" name="draft" />
        </label>
        <div className="button-story__row">
          <Button onClick={() => setActivations((value) => value + 1)}>
            Activate
          </Button>
          <Button type="submit" variant="tonal">Submit</Button>
          <Button type="reset" variant="outlined">Reset</Button>
        </div>
        <output aria-live="polite">
          Activations: {activations} · Submissions: {submissions} · Resets: {resets}
        </output>
      </form>
    </StoryFrame>
  );
}

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    children: 'Continue',
    shape: 'round',
    size: 'small',
    variant: 'filled',
  },
  argTypes: {
    variant: { control: 'select', options: BUTTON_VARIANTS },
    size: { control: 'select', options: BUTTON_SIZES },
    shape: { control: 'inline-radio', options: ['round', 'square'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <StoryFrame
      title="Button playground"
      description="Adjust the ordinary Button's supported variant, size, shape, native, and content props."
    >
      <Button {...args} />
    </StoryFrame>
  ),
};

export const Variants: Story = { render: () => <VariantGallery /> };
export const Sizes: Story = {
  render: () => <SizeGallery />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const expectedHeights = [32, 40, 56, 96, 136];
    BUTTON_SIZES.forEach((size, index) => {
      expect(canvas.getByTestId(`size-${size}`).getBoundingClientRect().height).toBe(
        expectedHeights[index],
      );
    });
  },
};
export const AllVariantsAndSizes: Story = {
  render: () => <VariantSizeMatrix />,
};
export const Shapes: Story = { render: () => <ShapeGallery /> };
export const Icons: Story = { render: () => <IconGallery /> };
export const Disabled: Story = { render: () => <DisabledGallery /> };
export const LightAndDark: Story = { render: () => <ThemeGallery /> };
export const ContentStress: Story = { render: () => <ContentStressGallery /> };
export const InputModesAndTargets: Story = {
  render: () => <InputModeGuidance />,
};
export const ReducedMotionAndForcedColors: Story = {
  render: () => <MotionAndColorModeGuidance />,
};
export const Elevation: Story = { render: () => <ElevationGuidance /> };
export const InteractionStates: Story = {
  render: () => <StateContractExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('state-button');
    const disabled = canvas.getByTestId('disabled-button');
    const ownerWindow = canvasElement.ownerDocument.defaultView!;

    await userEvent.hover(button);

    button.blur();
    await userEvent.tab();
    expect(button).toHaveFocus();
    expect(ownerWindow.getComputedStyle(button, '::before').opacity).toBe('0.1');

    await userEvent.click(button);
    expect(canvas.getByText('Clicks: 1')).toBeVisible();

    await userEvent.click(disabled);
    expect(canvas.getByText('Clicks: 1')).toBeVisible();
    expect(ownerWindow.getComputedStyle(disabled, '::before').opacity).toBe('0');
  },
};
export const KeyboardInteraction: Story = {
  render: () => <InteractiveExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Activate' });
    await userEvent.tab();
    expect(canvas.getByRole('textbox', { name: 'Draft name' })).toHaveFocus();
    await userEvent.tab();
    expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByText(/Activations: 1 · Submissions: 0/)).toBeVisible();
    await userEvent.keyboard(' ');
    await expect(canvas.getByText(/Activations: 2 · Submissions: 0/)).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
    await expect(canvas.getByText(/Submissions: 1/)).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
    await expect(canvas.getByText(/Resets: 1/)).toBeVisible();
  },
};
