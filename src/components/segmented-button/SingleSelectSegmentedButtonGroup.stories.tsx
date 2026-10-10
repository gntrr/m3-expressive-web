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
  SingleSelectSegmentedButtonGroup,
} from './SingleSelectSegmentedButtonGroup.js';
import type { SegmentedButtonSegment } from './index.js';

import './single-select-segmented-button-group.css';
import './SingleSelectSegmentedButtonGroup.stories.css';

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

const calendarSegments = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
] as const satisfies readonly SegmentedButtonSegment<'day' | 'week' | 'month'>[];

function CalendarIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24">
      <rect height="14" rx="2" stroke="currentColor" width="16" x="4" y="6" />
      <path d="M8 3v6m8-6v6M4 11h16" stroke="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24">
      <path d="m5 12 4 4L19 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
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
      className="segmented-button-story"
      data-mode={mode}
      style={mode === 'dark' ? darkVariables : lightVariables}
    >
      <div className="segmented-button-story__header">
        <p className="segmented-button-story__eyebrow">Material 3 Segmented Button</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}

function ControlledCalendar() {
  const [value, setValue] = useState<'day' | 'week' | 'month'>('week');
  return (
    <StoryFrame
      title="Controlled native radio selection"
      description="One fieldset owns a visible legend and native radios. Arrow keys remain browser radio behavior; React controls the selected value."
    >
      <div className="segmented-button-story__row">
        <SingleSelectSegmentedButtonGroup
          data-testid="calendar-group"
          legend="Calendar view"
          name="calendar-view"
          onValueChange={setValue}
          segments={calendarSegments}
          value={value}
        />
        <output>value: {value}</output>
      </div>
    </StoryFrame>
  );
}

function FormExample() {
  const [submitted, setSubmitted] = useState('not submitted');
  const [value, setValue] = useState<'day' | 'week' | 'month'>('day');
  return (
    <StoryFrame
      title="Native form participation"
      description="Each native radio retains the supplied group name and segment value. No hidden mirror input or JavaScript navigation is involved."
    >
      <form
        className="segmented-button-story__form"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(new FormData(event.currentTarget).get('calendar-view')?.toString() ?? 'none');
        }}
      >
        <SingleSelectSegmentedButtonGroup
          legend="Calendar view"
          name="calendar-view"
          onValueChange={setValue}
          segments={calendarSegments}
          value={value}
        />
        <button type="submit">Submit native form</button>
        <output>submitted: {submitted}</output>
      </form>
    </StoryFrame>
  );
}

const meta = {
  title: 'Components/Segmented Button/SingleSelectSegmentedButtonGroup',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Controlled: Story = {
  render: () => <ControlledCalendar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const month = canvas.getByRole('radio', { name: 'Month' });
    await userEvent.click(month);
    await expect(canvas.getByText('value: month')).toBeInTheDocument();
    month.focus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(canvas.getByText('value: week')).toBeInTheDocument();
  },
};

export const LightAndDark: Story = {
  render: () => (
    <div className="segmented-button-story__schemes">
      <StoryFrame
        mode="light"
        title="Light scheme"
        description="The selected semantic container and enabled content roles resolve from the light Material color scheme."
      >
        <SingleSelectSegmentedButtonGroup
          legend="Calendar view"
          name="light-calendar"
          onValueChange={() => undefined}
          segments={calendarSegments}
          value="week"
        />
      </StoryFrame>
      <StoryFrame
        mode="dark"
        title="Dark scheme"
        description="The same component aliases consume the dark semantic scheme without a component-specific palette."
      >
        <SingleSelectSegmentedButtonGroup
          legend="Calendar view"
          name="dark-calendar"
          onValueChange={() => undefined}
          segments={calendarSegments}
          value="week"
        />
      </StoryFrame>
    </div>
  ),
};

export const SegmentCountsAndJoinedBorders: Story = {
  render: () => (
    <StoryFrame
      title="Only, two, and many segments"
      description="The group uses equal tracks, logical full/start/end geometry, rectangular middles, and one-pixel boundary overlap. The parent remains responsible for final width and overflow."
    >
      <div className="segmented-button-story__stack">
        <SingleSelectSegmentedButtonGroup
          legend="One segment"
          name="one"
          onValueChange={() => undefined}
          segments={[{ value: 'all', label: 'All' }]}
          value="all"
        />
        <SingleSelectSegmentedButtonGroup
          legend="Two segments"
          name="two"
          onValueChange={() => undefined}
          segments={[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }]}
          value="list"
        />
        <SingleSelectSegmentedButtonGroup
          legend="Three segments"
          name="three"
          onValueChange={() => undefined}
          segments={calendarSegments}
          value="week"
        />
      </div>
    </StoryFrame>
  ),
};

export const IconsAndSelectedIcon: Story = {
  render: () => (
    <StoryFrame
      title="Decorative icon slots"
      description="selectedIcon replaces icon in the same start slot. Icons are aria-hidden; native radio checked state and the visible label communicate selection."
    >
      <SingleSelectSegmentedButtonGroup
        legend="Calendar view"
        name="calendar-icons"
        onValueChange={() => undefined}
        segments={[
          { value: 'day', label: 'Day', icon: <CalendarIcon /> },
          { value: 'week', label: 'Week', icon: <CalendarIcon />, selectedIcon: <CheckIcon /> },
          { value: 'month', label: 'Month', selectedIcon: <CheckIcon /> },
        ]}
        value="week"
      />
    </StoryFrame>
  ),
};

export const Disabled: Story = {
  render: () => (
    <StoryFrame
      title="Disabled radios"
      description="A disabled selected value remains checked under controlled state. Group disabled uses native fieldset semantics; individual disablement affects one radio only."
    >
      <div className="segmented-button-story__stack">
        <SingleSelectSegmentedButtonGroup
          legend="Individual disabled segment"
          name="individual-disabled"
          onValueChange={() => undefined}
          segments={[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week', disabled: true },
            { value: 'month', label: 'Month' },
          ]}
          value="week"
        />
        <SingleSelectSegmentedButtonGroup
          disabled
          legend="Disabled group"
          name="group-disabled"
          onValueChange={() => undefined}
          segments={calendarSegments}
          value="month"
        />
      </div>
    </StoryFrame>
  ),
};

export const NamingKeyboardAndForm: Story = {
  render: () => (
    <StoryFrame
      title="Naming and native keyboard behavior"
      description="A visible legend is preferred. aria-label and aria-labelledby are available when a visible group name is inappropriate. Tab, Arrow keys, and Space remain native radio behavior."
    >
      <div className="segmented-button-story__stack">
        <SingleSelectSegmentedButtonGroup
          aria-label="Calendar view without visible legend"
          name="aria-label-calendar"
          onValueChange={() => undefined}
          segments={calendarSegments}
          value="day"
        />
        <div>
          <span id="referenced-calendar-label">Referenced calendar view</span>
          <SingleSelectSegmentedButtonGroup
            aria-labelledby="referenced-calendar-label"
            name="aria-labelledby-calendar"
            onValueChange={() => undefined}
            segments={calendarSegments}
            value="week"
          />
        </div>
      </div>
    </StoryFrame>
  ),
};

export const PlatformBehavior: Story = {
  render: () => (
    <StoryFrame
      title="Reflow, RTL, forced colors, and reduced motion"
      description="The visual minimum is 40px; no overlapping 48px target is added. Long labels reflow, logical corners reverse in RTL, forced colors use system boundaries, and no transition runs under reduced motion."
    >
      <div className="segmented-button-story__platform-grid">
        <section>
          <h2>Long labels / zoom</h2>
          <SingleSelectSegmentedButtonGroup
            className="segmented-button-story__long-group"
            legend="Delivery view"
            name="long-labels"
            onValueChange={() => undefined}
            segments={[
              { value: 'same-day', label: 'Same-day delivery and pickup availability' },
              { value: 'scheduled', label: 'Scheduled delivery' },
            ]}
            value="same-day"
          />
        </section>
        <section dir="rtl">
          <h2>RTL</h2>
          <SingleSelectSegmentedButtonGroup
            legend="عرض التقويم"
            name="rtl-calendar"
            onValueChange={() => undefined}
            segments={[
              { value: 'day', label: 'يوم' },
              { value: 'week', label: 'أسبوع' },
              { value: 'month', label: 'شهر' },
            ]}
            value="week"
          />
        </section>
        <section className="segmented-button-story__forced-preview">
          <h2>Forced colors preview</h2>
          <SingleSelectSegmentedButtonGroup
            legend="Forced-color selection"
            name="forced-colors"
            onValueChange={() => undefined}
            segments={calendarSegments}
            value="week"
          />
        </section>
      </div>
    </StoryFrame>
  ),
};

export const NativeForm: Story = {
  render: () => <FormExample />,
};
