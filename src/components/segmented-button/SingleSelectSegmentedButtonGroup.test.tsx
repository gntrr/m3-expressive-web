import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';

import {
  SingleSelectSegmentedButtonGroup,
  type SegmentedButtonSegment,
  type SingleSelectSegmentedButtonGroupProps,
} from './index.js';

const segmentedButtonCss = readFileSync(
  path.join(
    process.cwd(),
    'src/components/segmented-button/single-select-segmented-button-group.css',
  ),
  'utf8',
);

const segments = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
] as const satisfies readonly SegmentedButtonSegment<'day' | 'week' | 'month'>[];

afterEach(cleanup);

describe('SingleSelectSegmentedButtonGroup', () => {
  it('renders one named native fieldset and controlled radios', () => {
    render(
      <SingleSelectSegmentedButtonGroup
        legend="Calendar view"
        name="calendar-view"
        onValueChange={() => undefined}
        segments={segments}
        value="week"
      />,
    );

    const group = screen.getByRole('group', { name: 'Calendar view' });
    const radios = screen.getAllByRole('radio');
    expect(group.tagName).toBe('FIELDSET');
    expect(group.querySelector('legend')?.textContent).toBe('Calendar view');
    expect(group).not.toHaveAttribute('role');
    expect(group).not.toHaveAttribute('tabindex');
    expect(radios).toHaveLength(3);
    expect(radios.map((radio) => radio.getAttribute('name'))).toEqual([
      'calendar-view',
      'calendar-view',
      'calendar-view',
    ]);
    expect(radios.map((radio) => radio.getAttribute('value'))).toEqual([
      'day',
      'week',
      'month',
    ]);
    expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Day' })).not.toBeChecked();
  });

  it('supports aria-label and aria-labelledby group names without adding a legend', () => {
    const { rerender } = render(
      <SingleSelectSegmentedButtonGroup
        aria-label="Calendar view"
        name="calendar-view"
        onValueChange={() => undefined}
        segments={segments}
        value="day"
      />,
    );
    expect(screen.getByRole('group', { name: 'Calendar view' }).querySelector('legend')).toBeNull();

    rerender(
      <>
        <span id="calendar-label">Referenced calendar view</span>
        <SingleSelectSegmentedButtonGroup
          aria-labelledby="calendar-label"
          name="calendar-view"
          onValueChange={() => undefined}
          segments={segments}
          value="day"
        />
      </>,
    );
    expect(screen.getByRole('group', { name: 'Referenced calendar view' })).toBeInTheDocument();
  });

  it('forwards safe fieldset props, class, style, and ref', () => {
    const ref = createRef<HTMLFieldSetElement>();
    render(
      <SingleSelectSegmentedButtonGroup
        aria-describedby="calendar-help"
        className="custom-group"
        data-testid="group"
        legend="Calendar view"
        name="calendar-view"
        onValueChange={() => undefined}
        ref={ref}
        segments={segments}
        style={{ inlineSize: '20rem' }}
        value="day"
      />,
    );

    const group = screen.getByTestId('group');
    expect(group).toHaveClass('md-single-select-segmented-button-group', 'custom-group');
    expect(group).toHaveAttribute('aria-describedby', 'calendar-help');
    expect(group.style.inlineSize).toBe('20rem');
    expect(ref.current).toBe(group);
  });

  it('requests the selected value only when a native radio becomes checked', () => {
    const onValueChange = vi.fn();
    render(
      <SingleSelectSegmentedButtonGroup
        legend="Calendar view"
        name="calendar-view"
        onValueChange={onValueChange}
        segments={segments}
        value="week"
      />,
    );

    fireEvent.click(screen.getByRole('radio', { name: 'Day' }));
    expect(onValueChange).toHaveBeenCalledWith('day');

    fireEvent.change(screen.getByRole('radio', { name: 'Week' }), { target: { checked: false } });
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it('retains controlled radio state and does not synthesize a deselection callback', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SingleSelectSegmentedButtonGroup
        legend="Calendar view"
        name="calendar-view"
        onValueChange={onValueChange}
        segments={segments}
        value="week"
      />,
    );

    await user.click(screen.getByRole('radio', { name: 'Week' }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked();
  });

  it('uses native group and segment disabled semantics while preserving selected state', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <SingleSelectSegmentedButtonGroup
        legend="Calendar view"
        name="calendar-view"
        onValueChange={onValueChange}
        segments={[...segments.slice(0, 2), { value: 'month', label: 'Month', disabled: true }]}
        value="month"
      />,
    );

    const selectedDisabled = screen.getByRole('radio', { name: 'Month' });
    expect(selectedDisabled).toBeDisabled();
    expect(selectedDisabled).toBeChecked();
    await user.click(selectedDisabled);
    expect(onValueChange).not.toHaveBeenCalled();

    rerender(
      <SingleSelectSegmentedButtonGroup
        disabled
        legend="Calendar view"
        name="calendar-view"
        onValueChange={onValueChange}
        segments={segments}
        value="week"
      />,
    );
    expect(screen.getByRole('group')).toBeDisabled();
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled();
    await user.click(screen.getByRole('radio', { name: 'Day' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('uses selectedIcon precedence and keeps all icons decorative', () => {
    const { rerender } = render(
      <SingleSelectSegmentedButtonGroup
        legend="Calendar view"
        name="calendar-view"
        onValueChange={() => undefined}
        segments={[
          {
            value: 'day',
            label: 'Day',
            icon: <svg data-testid="day"><title>Day icon</title></svg>,
            selectedIcon: <svg data-testid="day-selected"><title>Selected day</title></svg>,
          },
        ]}
        value="day"
      />,
    );
    expect(screen.getByTestId('day-selected').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByTestId('day')).not.toBeInTheDocument();
    expect(screen.getByRole('radio')).toHaveAccessibleName('Day');

    rerender(
      <SingleSelectSegmentedButtonGroup
        legend="Calendar view"
        name="calendar-view"
        onValueChange={() => undefined}
        segments={[
          { value: 'day', label: 'Day', icon: <svg data-testid="day"><title>Day icon</title></svg> },
          { value: 'week', label: 'Week' },
        ]}
        value="week"
      />,
    );
    expect(screen.getByTestId('day').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('computes only/start/middle/end positions without exposing a standalone segment', () => {
    const { rerender } = render(
      <SingleSelectSegmentedButtonGroup
        legend="One"
        name="one"
        onValueChange={() => undefined}
        segments={[{ value: 'one', label: 'One' }]}
        value="one"
      />,
    );
    expect(screen.getByRole('radio').closest('label')).toHaveAttribute('data-position', 'only');

    rerender(
      <SingleSelectSegmentedButtonGroup
        legend="Many"
        name="many"
        onValueChange={() => undefined}
        segments={segments}
        value="day"
      />,
    );
    expect(screen.getByRole('radio', { name: 'Day' }).closest('label')).toHaveAttribute('data-position', 'logical-start');
    expect(screen.getByRole('radio', { name: 'Week' }).closest('label')).toHaveAttribute('data-position', 'middle');
    expect(screen.getByRole('radio', { name: 'Month' }).closest('label')).toHaveAttribute('data-position', 'logical-end');
  });

  it('rejects invalid names, values, labels, and collections', () => {
    const base = {
      legend: 'Calendar',
      name: 'calendar',
      onValueChange: () => undefined,
      segments,
      value: 'day',
    } as const;

    const conflictingNames = {
      ...base,
      'aria-label': 'Conflict',
    } as unknown as SingleSelectSegmentedButtonGroupProps<'day' | 'week' | 'month'>;
    expect(() => render(<SingleSelectSegmentedButtonGroup {...conflictingNames} />)).toThrow('exactly one non-empty group name');
    expect(() => render(<SingleSelectSegmentedButtonGroup {...base} legend="  " />)).toThrow('exactly one non-empty group name');
    expect(() => render(<SingleSelectSegmentedButtonGroup {...base} name=" " />)).toThrow('name must not be blank');
    expect(() => render(<SingleSelectSegmentedButtonGroup {...base} segments={[]} />)).toThrow('requires at least one segment');
    expect(() => render(<SingleSelectSegmentedButtonGroup {...base} segments={[{ value: ' ', label: 'Day' }]} value={' ' as 'day'} />)).toThrow('segment values must not be blank');
    expect(() => render(<SingleSelectSegmentedButtonGroup {...base} segments={[{ value: 'day', label: 'Day' }, { value: 'day', label: 'Duplicate' }]} />)).toThrow('segment values must be unique');
    expect(() => render(<SingleSelectSegmentedButtonGroup {...base} segments={[{ value: 'day', label: ' ' }]} />)).toThrow('segment labels must not be blank');
    expect(() => render(<SingleSelectSegmentedButtonGroup {...base} value={'year' as 'day'} />)).toThrow('value must match one supplied segment value');
  });

  it('renders native radios on the server without a client-only boundary', () => {
    const html = renderToString(
      <SingleSelectSegmentedButtonGroup
        aria-label="Calendar view"
        name="calendar-view"
        onValueChange={() => undefined}
        segments={segments}
        value="week"
      />,
    );
    expect(html).toContain('<fieldset');
    expect(html).toContain('type="radio"');
    expect(html).toContain('name="calendar-view"');
    expect(html).toContain('checked=""');
  });

  it('keeps its public prop boundary narrow and controlled', () => {
    expectTypeOf<SingleSelectSegmentedButtonGroupProps<'day'>>().toHaveProperty('name');
    expectTypeOf<SingleSelectSegmentedButtonGroupProps<'day'>>().toHaveProperty('value');
    expectTypeOf<SingleSelectSegmentedButtonGroupProps<'day'>>().toHaveProperty('segments');
    expectTypeOf<SingleSelectSegmentedButtonGroupProps<'day'>>().not.toHaveProperty('defaultValue');
    expectTypeOf<SingleSelectSegmentedButtonGroupProps<'day'>>().not.toHaveProperty('selectionMode');
    expectTypeOf<SingleSelectSegmentedButtonGroupProps<'day'>>().not.toHaveProperty('aria-pressed');
    expectTypeOf<SingleSelectSegmentedButtonGroupProps<'day'>>().not.toHaveProperty('orientation');
    expectTypeOf<SingleSelectSegmentedButtonGroupProps<'day'>>().not.toHaveProperty('href');
    expectTypeOf<SingleSelectSegmentedButtonGroupProps<'day'>>().not.toHaveProperty('onChange');
  });

  it('uses documented geometry, foundation aliases, joined boundaries, and no motion runtime', () => {
    expect(segmentedButtonCss).toContain('min-block-size: 40px');
    expect(segmentedButtonCss).toContain('min-inline-size: 58px');
    expect(segmentedButtonCss).toContain('block-size: 18px');
    expect(segmentedButtonCss).toContain('gap: 8px');
    expect(segmentedButtonCss).toContain('padding-block: 8px');
    expect(segmentedButtonCss).toContain('padding-inline: 12px');
    expect(segmentedButtonCss).toContain('var(--md-sys-shape-corner-full)');
    expect(segmentedButtonCss).toContain('var(--md-sys-typescale-label-large-font)');
    expect(segmentedButtonCss).toContain('var(--md-sys-color-secondary-container)');
    expect(segmentedButtonCss).toContain('var(--md-sys-color-on-secondary-container)');
    expect(segmentedButtonCss).toContain('var(--md-sys-color-outline)');
    expect(segmentedButtonCss).toContain('var(--md-web-elevation-shadow-level0)');
    expect(segmentedButtonCss).toContain('margin-inline-start: -1px');
    expect(segmentedButtonCss).toContain('border-start-start-radius');
    expect(segmentedButtonCss).toContain('border-start-end-radius');
    expect(segmentedButtonCss).toContain('@media (hover: hover) and (pointer: fine)');
    expect(segmentedButtonCss).toContain('@media (forced-colors: active)');
    expect(segmentedButtonCss).toContain('var(--md-sys-color-secondary)');
    expect(segmentedButtonCss).toContain('GrayText');
    expect(segmentedButtonCss).not.toContain('transition:');
    expect(segmentedButtonCss).not.toContain('animation:');
  });
});
