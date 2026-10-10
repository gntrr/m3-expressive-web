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
import { MultiSelectSegmentedButtonGroup } from './MultiSelectSegmentedButtonGroup.js';
import type { SegmentedButtonSegment } from './index.js';

import './single-select-segmented-button-group.css';
import './MultiSelectSegmentedButtonGroup.stories.css';

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

const segments = [
  { value: 'revenue', label: 'Revenue' },
  { value: 'orders', label: 'Orders' },
  { value: 'customers', label: 'Customers' },
] as const satisfies readonly SegmentedButtonSegment<'revenue' | 'orders' | 'customers'>[];

function CheckIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24">
      <path d="m5 12 4 4L19 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24">
      <path d="M5 19V9m7 10V5m7 14v-7" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
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
      className="multi-select-segmented-button-story"
      data-mode={mode}
      style={mode === 'dark' ? darkVariables : lightVariables}
    >
      <div className="multi-select-segmented-button-story__header">
        <p className="multi-select-segmented-button-story__eyebrow">Material 3 Segmented Button</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}

function ControlledExample() {
  const [value, setValue] = useState<readonly ('revenue' | 'orders' | 'customers')[]>(['revenue']);
  return (
    <StoryFrame
      title="Controlled native checkbox selection"
      description="Empty selection is valid. Tab reaches each enabled checkbox; Space toggles the focused checkbox. Arrow keys are not group navigation."
    >
      <div className="multi-select-segmented-button-story__row">
        <MultiSelectSegmentedButtonGroup
          data-testid="columns-group"
          legend="Report columns"
          name="report-columns"
          onValueChange={setValue}
          segments={segments}
          value={value}
        />
        <output>value: {value.join(', ') || 'none'}</output>
      </div>
    </StoryFrame>
  );
}

function FormExample() {
  const [submitted, setSubmitted] = useState('not submitted');
  const [value, setValue] = useState<readonly ('revenue' | 'orders' | 'customers')[]>(['revenue', 'orders']);
  return (
    <StoryFrame
      title="Native repeated form values"
      description="Selected native checkboxes submit one value per segment under the shared name. There are no hidden mirror inputs."
    >
      <form
        className="multi-select-segmented-button-story__form"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(new FormData(event.currentTarget).getAll('report-columns').join(', ') || 'none');
        }}
      >
        <MultiSelectSegmentedButtonGroup
          legend="Report columns"
          name="report-columns"
          onValueChange={setValue}
          segments={segments}
          value={value}
        />
        <button type="submit">Submit native form</button>
        <output>submitted: {submitted}</output>
      </form>
    </StoryFrame>
  );
}

const meta = {
  title: 'Components/Segmented Button/MultiSelectSegmentedButtonGroup',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const orders = canvas.getByRole('checkbox', { name: 'Orders' });
    await userEvent.click(orders);
    await expect(canvas.getByText('value: revenue, orders')).toBeInTheDocument();

    orders.focus();
    await userEvent.keyboard(' ');
    await expect(canvas.getByText('value: revenue')).toBeInTheDocument();

    const revenue = canvas.getByRole('checkbox', { name: 'Revenue' });
    revenue.focus();
    await userEvent.tab();
    await expect(orders).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByText('value: revenue')).toBeInTheDocument();
  },
};

export const SelectionStates: Story = {
  render: () => (
    <StoryFrame
      title="None, one, multiple, and all selected"
      description="Checkbox selection is independent and controlled. Empty selection is valid; checked is never represented by aria-pressed."
    >
      <div className="multi-select-segmented-button-story__stack">
        <MultiSelectSegmentedButtonGroup aria-label="None selected" name="none" onValueChange={() => undefined} segments={segments} value={[]} />
        <MultiSelectSegmentedButtonGroup aria-label="One selected" name="one" onValueChange={() => undefined} segments={segments} value={['orders']} />
        <MultiSelectSegmentedButtonGroup aria-label="Multiple selected" name="multiple" onValueChange={() => undefined} segments={segments} value={['revenue', 'customers']} />
        <MultiSelectSegmentedButtonGroup aria-label="All selected" name="all" onValueChange={() => undefined} segments={segments} value={['revenue', 'orders', 'customers']} />
      </div>
    </StoryFrame>
  ),
};

export const IconsAndSelectedIcon: Story = {
  render: () => (
    <StoryFrame
      title="Decorative icon slots"
      description="The selected icon replaces the ordinary icon in one start slot. Visible text and native checkbox state remain the accessible selection signal."
    >
      <MultiSelectSegmentedButtonGroup
        legend="Report columns"
        name="icons"
        onValueChange={() => undefined}
        segments={[
          { value: 'revenue', label: 'Revenue', icon: <ChartIcon />, selectedIcon: <CheckIcon /> },
          { value: 'orders', label: 'Orders', icon: <ChartIcon /> },
          { value: 'customers', label: 'Customers', selectedIcon: <CheckIcon /> },
        ]}
        value={['revenue', 'customers']}
      />
    </StoryFrame>
  ),
};

export const Disabled: Story = {
  render: () => (
    <StoryFrame
      title="Disabled selections"
      description="A disabled checked segment remains checked under controlled state. Group and individual disablement use native checkbox behavior."
    >
      <div className="multi-select-segmented-button-story__stack">
        <MultiSelectSegmentedButtonGroup
          legend="Individual disabled"
          name="individual-disabled"
          onValueChange={() => undefined}
          segments={[...segments.slice(0, 2), { value: 'customers', label: 'Customers', disabled: true }]}
          value={['customers']}
        />
        <MultiSelectSegmentedButtonGroup
          disabled
          legend="Disabled group"
          name="disabled-group"
          onValueChange={() => undefined}
          segments={segments}
          value={['revenue', 'orders']}
        />
      </div>
    </StoryFrame>
  ),
};

export const NamingAndForm: Story = {
  render: () => (
    <StoryFrame
      title="Group naming and form participation"
      description="A visible legend is preferred; aria-label and aria-labelledby are alternatives when visible text is not appropriate."
    >
      <div className="multi-select-segmented-button-story__stack">
        <MultiSelectSegmentedButtonGroup aria-label="Report columns without visible legend" name="aria-label" onValueChange={() => undefined} segments={segments} value={[]} />
        <div>
          <span id="referenced-report-columns">Referenced report columns</span>
          <MultiSelectSegmentedButtonGroup aria-labelledby="referenced-report-columns" name="aria-labelledby" onValueChange={() => undefined} segments={segments} value={['orders']} />
        </div>
      </div>
    </StoryFrame>
  ),
};

export const NativeForm: Story = { render: () => <FormExample /> };

export const LightAndDark: Story = {
  render: () => (
    <div className="multi-select-segmented-button-story__schemes">
      <StoryFrame mode="light" title="Light scheme" description="Selected and unselected roles resolve from the light semantic color scheme.">
        <MultiSelectSegmentedButtonGroup legend="Report columns" name="light-columns" onValueChange={() => undefined} segments={segments} value={['revenue', 'customers']} />
      </StoryFrame>
      <StoryFrame mode="dark" title="Dark scheme" description="The same visual shell consumes dark semantic roles without a checkbox-specific palette.">
        <MultiSelectSegmentedButtonGroup legend="Report columns" name="dark-columns" onValueChange={() => undefined} segments={segments} value={['revenue', 'customers']} />
      </StoryFrame>
    </div>
  ),
};

export const PlatformBehavior: Story = {
  render: () => (
    <StoryFrame
      title="Joined borders, reflow, RTL, forced colors, and reduced motion"
      description="Only horizontal logical geometry is provided. Long labels reflow, translucent layers suppress in forced colors, and immediate state changes require no reduced-motion animation override."
    >
      <div className="multi-select-segmented-button-story__platform-grid">
        <section>
          <h2>One / two / many</h2>
          <div className="multi-select-segmented-button-story__stack">
            <MultiSelectSegmentedButtonGroup legend="One" name="one" onValueChange={() => undefined} segments={[{ value: 'all', label: 'All' }]} value={[]} />
            <MultiSelectSegmentedButtonGroup legend="Two" name="two" onValueChange={() => undefined} segments={[{ value: 'table', label: 'Table' }, { value: 'chart', label: 'Chart' }]} value={['table']} />
          </div>
        </section>
        <section>
          <h2>Long labels / zoom</h2>
          <MultiSelectSegmentedButtonGroup className="multi-select-segmented-button-story__long-group" legend="Visible columns" name="long-labels" onValueChange={() => undefined} segments={[{ value: 'revenue', label: 'Net revenue by acquisition channel' }, { value: 'customers', label: 'Returning customers' }]} value={['revenue']} />
        </section>
        <section dir="rtl">
          <h2>RTL</h2>
          <MultiSelectSegmentedButtonGroup legend="أعمدة التقرير" name="rtl-columns" onValueChange={() => undefined} segments={[{ value: 'revenue', label: 'الإيرادات' }, { value: 'orders', label: 'الطلبات' }, { value: 'customers', label: 'العملاء' }]} value={['orders']} />
        </section>
        <section className="multi-select-segmented-button-story__forced-preview">
          <h2>Forced colors preview</h2>
          <MultiSelectSegmentedButtonGroup legend="Forced colors" name="forced-colors" onValueChange={() => undefined} segments={segments} value={['orders']} />
        </section>
      </div>
    </StoryFrame>
  ),
};
