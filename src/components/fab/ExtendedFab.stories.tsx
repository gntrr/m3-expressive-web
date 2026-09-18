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
import { ExtendedFab } from './ExtendedFab.js';
import { FAB_SIZES, FAB_VARIANTS } from './Fab.js';
import './fab.css';
import './ExtendedFab.stories.css';

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
      className="fab-story extended-fab-story"
      data-mode={mode}
      style={mode === 'dark' ? darkVariables : lightVariables}
    >
      <div className="fab-story__header">
        <p className="fab-story__eyebrow">Material 3 labeled primary action</p>
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
        <ExtendedFab
          disabled={disabled}
          key={variant}
          leadingIcon={<AddIcon />}
          variant={variant}
        >
          {`${variant} action`}
        </ExtendedFab>
      ))}
    </div>
  );
}

function VariantGallery() {
  return (
    <StoryFrame
      title="Extended FAB variants"
      description="All four semantic variants use the same color and elevation mapping as the ordinary FAB. Primary is the documented web-default decision."
    >
      <VariantRow />
    </StoryFrame>
  );
}

function SizeGallery() {
  return (
    <StoryFrame
      title="Baseline and Expressive sizes"
      description="Each size has its own minimum geometry, typography, padding, icon size, and shape role. Medium’s shape and medium/large gaps remain visibly marked provisional in the component specification."
    >
      <div className="extended-fab-story__sizes">
        {FAB_SIZES.map((size) => (
          <section className="extended-fab-story__size-row" key={size}>
            <code>{size}</code>
            <ExtendedFab leadingIcon={<AddIcon />} size={size}>
              Create item
            </ExtendedFab>
          </section>
        ))}
      </div>
    </StoryFrame>
  );
}

function ContentGallery() {
  return (
    <StoryFrame
      title="Visible label with or without a leading icon"
      description="The required visible text is the ordinary accessible name. A supplied leading icon is decorative and cannot compete with the label."
    >
      <div className="fab-story__row">
        <ExtendedFab leadingIcon={<AddIcon />}>Create item</ExtendedFab>
        <ExtendedFab variant="secondary">Save draft</ExtendedFab>
      </div>
    </StoryFrame>
  );
}

function ReflowGallery() {
  return (
    <StoryFrame
      title="Long-label reflow and browser zoom"
      description="Labels use normal whitespace and overflow wrapping. The primitive has no unsupported maximum width: parents may constrain it, while the native focus outline stays outside the clipped visual layer."
    >
      <div className="extended-fab-story__reflow-boundary">
        <ExtendedFab leadingIcon={<EditIcon />} size="medium">
          Create a detailed item with a deliberately long label that can wrap safely
        </ExtendedFab>
      </div>
    </StoryFrame>
  );
}

function StateGallery() {
  const [clicks, setClicks] = useState(0);
  return (
    <StoryFrame
      title="Elevation and interaction states"
      description="Enabled, focus-visible, and pressed resolve level 3; fine-pointer hover resolves level 4. The component stays expanded and uses no spring or collapse runtime."
    >
      <div className="fab-story__row">
        <ExtendedFab
          data-testid="state-target"
          leadingIcon={<AddIcon />}
          onClick={() => setClicks((value) => value + 1)}
        >
          Create item
        </ExtendedFab>
        <ExtendedFab disabled leadingIcon={<EditIcon />} variant="secondary">
          Disabled action
        </ExtendedFab>
        <output>Activations: {clicks}</output>
      </div>
    </StoryFrame>
  );
}

function PlatformGallery() {
  return (
    <StoryFrame
      title="RTL, forced colors, reduced motion, and zoom"
      description="Logical layout follows direction. Forced-colors preserves a system-color boundary and focus indicator; reduced motion keeps immediate feedback because no animation runtime is present."
    >
      <div className="fab-story__platform-grid">
        <section dir="rtl">
          <h2>RTL</h2>
          <ExtendedFab leadingIcon={<AddIcon />} variant="tertiary">
            إنشاء عنصر
          </ExtendedFab>
        </section>
        <section>
          <h2>Zoom / reflow</h2>
          <ExtendedFab size="small">Save draft</ExtendedFab>
          <p>Use browser zoom normally; labels retain normal wrapping.</p>
        </section>
        <section className="fab-story__forced-preview">
          <h2>Forced colors</h2>
          <ExtendedFab leadingIcon={<AddIcon />} variant="surface">
            System action
          </ExtendedFab>
          <ExtendedFab disabled>Disabled action</ExtendedFab>
        </section>
      </div>
    </StoryFrame>
  );
}

const meta = {
  title: 'Components/ExtendedFab',
  component: ExtendedFab,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    children: 'Create item',
    leadingIcon: <AddIcon />,
    size: 'regular',
    variant: 'primary',
  },
  argTypes: {
    variant: { control: 'select', options: FAB_VARIANTS },
    size: { control: 'select', options: FAB_SIZES },
  },
} satisfies Meta<typeof ExtendedFab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <StoryFrame
      title="Extended FAB playground"
      description="Adjust only the supported label, leading icon, size, variant, and native button props. This component is always expanded; no collapse API exists."
    >
      <ExtendedFab {...args} />
    </StoryFrame>
  ),
};

export const Variants: Story = { render: () => <VariantGallery /> };
export const Sizes: Story = { render: () => <SizeGallery /> };
export const WithAndWithoutIcon: Story = { render: () => <ContentGallery /> };
export const LongLabelAndReflow: Story = { render: () => <ReflowGallery /> };
export const Disabled: Story = {
  render: () => (
    <StoryFrame
      title="Native disabled Extended FAB"
      description="Disabled uses native semantics, level-zero elevation, and documented semantic disabled colors—not whole-control opacity."
    >
      <VariantRow disabled />
    </StoryFrame>
  ),
};
export const LightAndDark: Story = {
  render: () => (
    <div className="fab-story__theme-pair">
      <StoryFrame
        title="Light scheme"
        description="Generated semantic color roles drive the labeled action."
      >
        <VariantRow />
      </StoryFrame>
      <StoryFrame
        mode="dark"
        title="Dark scheme"
        description="No provider or client runtime is needed for the same role mapping."
      >
        <VariantRow />
      </StoryFrame>
    </div>
  ),
};
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
