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
import { FilterChip } from './FilterChip.js';
import { CHIP_TREATMENTS } from './chip-shared.js';
import './filter-chip.css';
import './FilterChip.stories.css';

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

function CheckIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24">
      <path d="m5 12 4 4L19 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24">
      <path d="M19 4C11 4 5 8 5 15c0 2 1 4 3 5 7 0 11-6 11-16Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M5 20c2-4 5-7 10-10" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24">
      <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
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
      className="filter-chip-story"
      data-mode={mode}
      style={mode === 'dark' ? darkVariables : lightVariables}
    >
      <div className="filter-chip-story__header">
        <p className="filter-chip-story__eyebrow">Material 3 Chip</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}

function ControlledExample() {
  const [selected, setSelected] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  return (
    <StoryFrame
      title="Controlled independent filter"
      description="selected is a persistent button state exposed by aria-pressed, not a checkbox or radio role. Consumer onClick runs before the next selected value is requested."
    >
      <div className="filter-chip-story__row">
        <FilterChip
          data-testid="filter-target"
          leadingIcon={<LeafIcon />}
          onClick={() => setEvents((value) => [...value, 'click'])}
          onSelectedChange={(nextSelected) => {
            setEvents((value) => [...value, 'change:' + nextSelected]);
            setSelected(nextSelected);
          }}
          selected={selected}
          selectedIcon={<CheckIcon />}
          trailingIcon={<ArrowIcon />}
          treatment="elevated"
        >
          Vegetarian
        </FilterChip>
        <output>selected: {String(selected)} · {events.join(', ') || 'no activation'}</output>
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
      description="The default type is button. Explicit submit and reset retain native browser form behavior without changing controlled selection semantics."
    >
      <form
        className="filter-chip-story__form"
        onReset={() => setResets((value) => value + 1)}
        onSubmit={(event) => {
          event.preventDefault();
          setSubmissions((value) => value + 1);
        }}
      >
        <div className="filter-chip-story__row">
          <FilterChip selected={false}>Neutral filter</FilterChip>
          <FilterChip selected={false} type="submit" treatment="elevated">Submit</FilterChip>
          <FilterChip selected={false} type="reset">Reset</FilterChip>
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
      description="The visual chip is 32px. It does not create an overlapping invisible 48px target; parent layout or a future ChipGroup owns spacing. There is no transition, so reduced motion preserves direct state feedback."
    >
      <div className="filter-chip-story__platform-grid">
        <section>
          <h2>Long label / zoom</h2>
          <FilterChip className="filter-chip-story__long-label" selected treatment="elevated">
            Available for same-day delivery and pickup
          </FilterChip>
        </section>
        <section dir="rtl">
          <h2>RTL</h2>
          <FilterChip leadingIcon={<LeafIcon />} selected selectedIcon={<CheckIcon />}>
            نباتي
          </FilterChip>
        </section>
        <section className="filter-chip-story__forced-preview">
          <h2>Forced colors</h2>
          <FilterChip selected={false}>Unselected</FilterChip>
          <FilterChip selected>Selected</FilterChip>
          <FilterChip disabled selected>Disabled selected</FilterChip>
        </section>
      </div>
    </StoryFrame>
  );
}

const meta = {
  title: 'Components/Chip/FilterChip',
  component: FilterChip,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    children: 'Vegetarian',
    selected: false,
    treatment: 'flat',
  },
  argTypes: {
    treatment: { control: 'inline-radio', options: CHIP_TREATMENTS },
  },
} satisfies Meta<typeof FilterChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <StoryFrame
      title="FilterChip playground"
      description="A controlled, independent filter button. It is not a checkbox or radio control, is not removable, and has no ChipGroup implementation."
    >
      <FilterChip {...args} />
    </StoryFrame>
  ),
};
export const TreatmentsAndSelection: Story = {
  render: () => (
    <StoryFrame
      title="Treatment and selected modes"
      description="Selected uses secondary-container and on-secondary-container; unselected treatments retain their documented flat or elevated surfaces."
    >
      <div className="filter-chip-story__row">
        <FilterChip selected={false}>Flat unselected</FilterChip>
        <FilterChip selected>Flat selected</FilterChip>
        <FilterChip selected={false} treatment="elevated">Elevated unselected</FilterChip>
        <FilterChip selected treatment="elevated">Elevated selected</FilterChip>
      </div>
    </StoryFrame>
  ),
};
export const IconAnatomy: Story = {
  render: () => (
    <StoryFrame
      title="One start slot and one decorative trailing slot"
      description="A selectedIcon wins the start position in selected mode, preventing two competing leading visuals. The trailing icon is decorative, never a remove or secondary action."
    >
      <div className="filter-chip-story__row">
        <FilterChip leadingIcon={<LeafIcon />} selected={false}>Leading icon</FilterChip>
        <FilterChip selected selectedIcon={<CheckIcon />}>Selected icon</FilterChip>
        <FilterChip selected={false} trailingIcon={<ArrowIcon />}>Trailing icon</FilterChip>
        <FilterChip leadingIcon={<LeafIcon />} selected selectedIcon={<CheckIcon />} trailingIcon={<ArrowIcon />}>
          Selected + trailing
        </FilterChip>
      </div>
    </StoryFrame>
  ),
};
export const Disabled: Story = {
  render: () => (
    <StoryFrame
      title="Disabled state"
      description="Native disabled preserves aria-pressed while suppressing interaction layers and callback notification. Semantic role compositing avoids whole-control opacity."
    >
      <div className="filter-chip-story__row">
        <FilterChip disabled selected={false}>Flat unselected</FilterChip>
        <FilterChip disabled selected>Flat selected</FilterChip>
        <FilterChip disabled selected={false} treatment="elevated">Elevated unselected</FilterChip>
        <FilterChip disabled selected treatment="elevated">Elevated selected</FilterChip>
      </div>
    </StoryFrame>
  ),
};
export const LightAndDark: Story = {
  render: () => (
    <div className="filter-chip-story__theme-pair">
      <StoryFrame title="Light scheme" description="Selected and unselected chips consume semantic light roles.">
        <div className="filter-chip-story__row"><FilterChip selected={false}>Unselected</FilterChip><FilterChip selected>Selected</FilterChip></div>
      </StoryFrame>
      <StoryFrame mode="dark" title="Dark scheme" description="The same renderer consumes semantic dark roles.">
        <div className="filter-chip-story__row"><FilterChip selected={false}>Unselected</FilterChip><FilterChip selected>Selected</FilterChip></div>
      </StoryFrame>
    </div>
  ),
};
export const ControlledInteraction: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const target = canvas.getByTestId('filter-target');
    await userEvent.tab();
    expect(target).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByText(/selected: true/)).toBeVisible();
    await userEvent.keyboard(' ');
    await expect(canvas.getByText(/selected: false/)).toBeVisible();
  },
};
export const KeyboardAndForms: Story = { render: () => <FormExample /> };
export const PlatformBehavior: Story = { render: () => <PlatformGuidance /> };
