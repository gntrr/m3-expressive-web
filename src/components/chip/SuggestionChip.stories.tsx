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
import { SuggestionChip } from './SuggestionChip.js';
import { CHIP_TREATMENTS } from './chip-shared.js';
import './suggestion-chip.css';
import './SuggestionChip.stories.css';

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

function ReplyIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24">
      <path
        d="M10 8 5 12l5 4m-4-4h13"
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
      className="suggestion-chip-story"
      data-mode={mode}
      style={mode === 'dark' ? darkVariables : lightVariables}
    >
      <div className="suggestion-chip-story__header">
        <p className="suggestion-chip-story__eyebrow">Material 3 Chip</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}

function TreatmentGallery() {
  return (
    <StoryFrame
      title="SuggestionChip treatments"
      description="A suggestion is a one-shot command that narrows intent. Flat has a transparent outlined container; elevated uses surface-container-low and resting elevation level 1."
    >
      <div className="suggestion-chip-story__row">
        {CHIP_TREATMENTS.map((treatment) => (
          <SuggestionChip key={treatment} treatment={treatment}>
            {treatment} suggestion
          </SuggestionChip>
        ))}
      </div>
    </StoryFrame>
  );
}

function InteractionExample() {
  const [activations, setActivations] = useState(0);
  return (
    <StoryFrame
      title="Native states and keyboard activation"
      description="Hover is available only on fine hover-capable pointers. Focus-visible and active layers are immediate feedback; no ripple or motion runtime is used."
    >
      <div className="suggestion-chip-story__row">
        <SuggestionChip
          data-testid="state-target"
          leadingIcon={<ReplyIcon />}
          onClick={() => setActivations((value) => value + 1)}
          treatment="elevated"
        >
          Suggested reply
        </SuggestionChip>
        <SuggestionChip disabled>Disabled</SuggestionChip>
        <output>Activations: {activations}</output>
      </div>
    </StoryFrame>
  );
}

function FormExample() {
  const [submissions, setSubmissions] = useState(0);
  const [resets, setResets] = useState(0);
  return (
    <StoryFrame
      title="Native form types"
      description="The default type is button. Explicit submit and reset retain native browser behavior."
    >
      <form
        className="suggestion-chip-story__form"
        onReset={() => setResets((value) => value + 1)}
        onSubmit={(event) => {
          event.preventDefault();
          setSubmissions((value) => value + 1);
        }}
      >
        <div className="suggestion-chip-story__row">
          <SuggestionChip>Neutral suggestion</SuggestionChip>
          <SuggestionChip type="submit" treatment="elevated">Submit</SuggestionChip>
          <SuggestionChip type="reset">Reset</SuggestionChip>
        </div>
        <output>Submissions: {submissions} · Resets: {resets}</output>
      </form>
    </StoryFrame>
  );
}

function PlatformGuidance() {
  return (
    <StoryFrame
      title="Reflow, target, RTL, and preferences"
      description="The visual box is 32px. The primitive deliberately does not make an overlapping invisible 48px touch target; parent layout owns touch-facing spacing. No transition means reduced motion preserves the direct final state."
    >
      <div className="suggestion-chip-story__platform-grid">
        <section>
          <h2>Long label / zoom</h2>
          <SuggestionChip
            className="suggestion-chip-story__long-label"
            treatment="elevated"
          >
            Suggest an alternate response with more detailed information
          </SuggestionChip>
        </section>
        <section dir="rtl">
          <h2>RTL</h2>
          <SuggestionChip leadingIcon={<ReplyIcon />}>رد مقترح</SuggestionChip>
        </section>
        <section className="suggestion-chip-story__forced-preview">
          <h2>Forced colors</h2>
          <SuggestionChip>System suggestion</SuggestionChip>
          <SuggestionChip disabled treatment="elevated">Disabled</SuggestionChip>
        </section>
      </div>
    </StoryFrame>
  );
}

const meta = {
  title: 'Components/Chip/SuggestionChip',
  component: SuggestionChip,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    children: 'Suggested reply',
    treatment: 'flat',
  },
  argTypes: {
    treatment: { control: 'inline-radio', options: CHIP_TREATMENTS },
  },
} satisfies Meta<typeof SuggestionChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <StoryFrame
      title="SuggestionChip playground"
      description="A compact native suggestion command with a visible label. The optional leading graphic is decorative; no trailing, selection, or removal API is supported."
    >
      <SuggestionChip {...args} />
    </StoryFrame>
  ),
};

export const Treatments: Story = { render: () => <TreatmentGallery /> };
export const LeadingIcon: Story = {
  render: () => (
    <StoryFrame
      title="One optional decorative leading icon"
      description="The icon is presentational and cannot become a competing accessible name. SuggestionChip deliberately has no trailing icon slot."
    >
      <div className="suggestion-chip-story__row">
        <SuggestionChip leadingIcon={<ReplyIcon />}>Reply yes</SuggestionChip>
        <SuggestionChip>No icon</SuggestionChip>
      </div>
    </StoryFrame>
  ),
};
export const Disabled: Story = {
  render: () => (
    <StoryFrame
      title="Disabled mappings"
      description="Native disabled behavior removes state layers. Semantic role compositing replaces whole-control opacity."
    >
      <div className="suggestion-chip-story__row">
        <SuggestionChip disabled>Flat disabled</SuggestionChip>
        <SuggestionChip disabled treatment="elevated">Elevated disabled</SuggestionChip>
      </div>
    </StoryFrame>
  ),
};
export const LightAndDark: Story = {
  render: () => (
    <div className="suggestion-chip-story__theme-pair">
      <StoryFrame
        title="Light scheme"
        description="The chip consumes generated semantic roles."
      >
        <SuggestionChip treatment="elevated">Suggested reply</SuggestionChip>
      </StoryFrame>
      <StoryFrame
        mode="dark"
        title="Dark scheme"
        description="The same CSS consumes a dark system scheme."
      >
        <SuggestionChip treatment="elevated">Suggested reply</SuggestionChip>
      </StoryFrame>
    </div>
  ),
};
export const InteractionStates: Story = {
  render: () => <InteractionExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const target = canvas.getByTestId('state-target');
    await userEvent.tab();
    expect(target).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByText('Activations: 1')).toBeVisible();
    await userEvent.keyboard(' ');
    await expect(canvas.getByText('Activations: 2')).toBeVisible();
  },
};
export const KeyboardAndForms: Story = { render: () => <FormExample /> };
export const PlatformBehavior: Story = { render: () => <PlatformGuidance /> };
export const AccessibilityGuidance: Story = {
  render: () => (
    <StoryFrame
      title="Accessible naming contract"
      description="Visible label content is preferred. aria-label or aria-labelledby may provide one explicit override. Invalid icon-only, blank, conflicting-name, and interactive-label examples are documented but not rendered as approved controls."
    >
      <div className="suggestion-chip-story__row">
        <SuggestionChip aria-label="Open suggested response"><span aria-hidden="true">+</span></SuggestionChip>
        <span id="suggestion-chip-story-reference">Open help</span>
        <SuggestionChip aria-labelledby="suggestion-chip-story-reference"><span aria-hidden="true">?</span></SuggestionChip>
      </div>
    </StoryFrame>
  ),
};
