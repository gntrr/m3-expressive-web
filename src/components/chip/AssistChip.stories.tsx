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
import { AssistChip } from './AssistChip.js';
import { CHIP_TREATMENTS } from './chip-shared.js';
import './assist-chip.css';
import './AssistChip.stories.css';

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

function AddIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24">
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
      className="assist-chip-story"
      data-mode={mode}
      style={mode === 'dark' ? darkVariables : lightVariables}
    >
      <div className="assist-chip-story__header">
        <p className="assist-chip-story__eyebrow">Material 3 Chip</p>
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
      title="AssistChip treatments"
      description="Flat uses a transparent container and outline boundary. Elevated uses surface-container-low and resting level 1 elevation."
    >
      <div className="assist-chip-story__row">
        {CHIP_TREATMENTS.map((treatment) => (
          <AssistChip key={treatment} treatment={treatment}>
            {treatment} assist
          </AssistChip>
        ))}
      </div>
    </StoryFrame>
  );
}

function IconGallery() {
  return (
    <StoryFrame
      title="Decorative icon slots"
      description="Leading and trailing graphics are presentation-only. The visible label remains the command name and logical inline order naturally supports RTL."
    >
      <div className="assist-chip-story__row">
        <AssistChip leadingIcon={<AddIcon />}>Add event</AssistChip>
        <AssistChip trailingIcon={<ArrowIcon />} treatment="elevated">
          Continue
        </AssistChip>
        <AssistChip leadingIcon={<AddIcon />} trailingIcon={<ArrowIcon />}>
          Both icons
        </AssistChip>
      </div>
    </StoryFrame>
  );
}

function InteractionExample() {
  const [activations, setActivations] = useState(0);
  return (
    <StoryFrame
      title="Native states and keyboard activation"
      description="Hover is gated to fine hover-capable pointers. Focus-visible and active layers are separate, immediate feedback; no ripple or motion runtime is used."
    >
      <div className="assist-chip-story__row">
        <AssistChip
          data-testid="state-target"
          onClick={() => setActivations((value) => value + 1)}
          treatment="elevated"
        >
          State target
        </AssistChip>
        <AssistChip disabled onClick={() => setActivations(99)}>
          Disabled
        </AssistChip>
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
      description="The default type is button. Explicit submit and reset retain native browser form behavior."
    >
      <form
        className="assist-chip-story__form"
        onReset={() => setResets((value) => value + 1)}
        onSubmit={(event) => {
          event.preventDefault();
          setSubmissions((value) => value + 1);
        }}
      >
        <div className="assist-chip-story__row">
          <AssistChip>Neutral action</AssistChip>
          <AssistChip type="submit" treatment="elevated">Submit</AssistChip>
          <AssistChip type="reset">Reset</AssistChip>
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
      description="The visual box is 32px. This primitive deliberately does not create an overlapping invisible 48px touch target; parent layout owns touch-facing spacing. It has no transition, so reduced motion preserves the same direct result."
    >
      <div className="assist-chip-story__platform-grid">
        <section>
          <h2>Long label / zoom</h2>
          <AssistChip className="assist-chip-story__long-label" treatment="elevated">
            Add this detailed preference to a future calendar reminder
          </AssistChip>
        </section>
        <section dir="rtl">
          <h2>RTL</h2>
          <AssistChip leadingIcon={<AddIcon />} trailingIcon={<ArrowIcon />}>
            إضافة إلى التقويم
          </AssistChip>
        </section>
        <section className="assist-chip-story__forced-preview">
          <h2>Forced colors</h2>
          <AssistChip>System command</AssistChip>
          <AssistChip disabled treatment="elevated">Disabled</AssistChip>
        </section>
      </div>
    </StoryFrame>
  );
}

const meta = {
  title: 'Components/Chip/AssistChip',
  component: AssistChip,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    children: 'Add to calendar',
    treatment: 'flat',
  },
  argTypes: {
    treatment: { control: 'inline-radio', options: CHIP_TREATMENTS },
  },
} satisfies Meta<typeof AssistChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <StoryFrame
      title="AssistChip playground"
      description="A compact native contextual command with a visible label. Icons are decorative and all layout remains parent-owned."
    >
      <AssistChip {...args} />
    </StoryFrame>
  ),
};

export const Treatments: Story = { render: () => <TreatmentGallery /> };
export const Icons: Story = { render: () => <IconGallery /> };
export const Disabled: Story = {
  render: () => (
    <StoryFrame
      title="Disabled mappings"
      description="Native disabled behavior suppresses interaction feedback. Color compositing is per semantic role rather than whole-control opacity."
    >
      <div className="assist-chip-story__row">
        <AssistChip disabled>Flat disabled</AssistChip>
        <AssistChip disabled treatment="elevated">Elevated disabled</AssistChip>
      </div>
    </StoryFrame>
  ),
};
export const LightAndDark: Story = {
  render: () => (
    <div className="assist-chip-story__theme-pair">
      <StoryFrame
        title="Light scheme"
        description="The component consumes generated semantic roles."
      >
        <AssistChip treatment="elevated">Add to calendar</AssistChip>
      </StoryFrame>
      <StoryFrame
        mode="dark"
        title="Dark scheme"
        description="The same component CSS reads dark system variables."
      >
        <AssistChip treatment="elevated">Add to calendar</AssistChip>
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
      description="Visible label content is preferred. aria-label or aria-labelledby may provide one explicit override. Invalid icon-only, blank, conflicting-name, and interactive-label examples are documented but intentionally not rendered as approved controls."
    >
      <div className="assist-chip-story__row">
        <AssistChip aria-label="Add a calendar event"><span aria-hidden="true">+</span></AssistChip>
        <span id="assist-chip-story-reference">Open help centre</span>
        <AssistChip aria-labelledby="assist-chip-story-reference"><span aria-hidden="true">?</span></AssistChip>
      </div>
    </StoryFrame>
  ),
};
