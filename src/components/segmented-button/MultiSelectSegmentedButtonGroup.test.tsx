import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';

import {
  MultiSelectSegmentedButtonGroup,
  type MultiSelectSegmentedButtonGroupProps,
  type SegmentedButtonSegment,
} from './index.js';

const segmentedButtonCss = readFileSync(
  path.join(
    process.cwd(),
    'src/components/segmented-button/single-select-segmented-button-group.css',
  ),
  'utf8',
);

const segments = [
  { value: 'revenue', label: 'Revenue' },
  { value: 'orders', label: 'Orders' },
  { value: 'customers', label: 'Customers' },
] as const satisfies readonly SegmentedButtonSegment<'revenue' | 'orders' | 'customers'>[];

afterEach(cleanup);

describe('MultiSelectSegmentedButtonGroup', () => {
  it('renders a named fieldset with native controlled checkboxes', () => {
    render(
      <MultiSelectSegmentedButtonGroup
        legend="Report columns"
        name="report-columns"
        onValueChange={() => undefined}
        segments={segments}
        value={['revenue', 'customers']}
      />,
    );

    const group = screen.getByRole('group', { name: 'Report columns' });
    const checkboxes = screen.getAllByRole('checkbox');
    expect(group.tagName).toBe('FIELDSET');
    expect(group.querySelector('legend')?.textContent).toBe('Report columns');
    expect(group).not.toHaveAttribute('role');
    expect(group).not.toHaveAttribute('tabindex');
    expect(checkboxes.map((checkbox) => checkbox.getAttribute('name'))).toEqual([
      'report-columns',
      'report-columns',
      'report-columns',
    ]);
    expect(checkboxes.map((checkbox) => checkbox.getAttribute('value'))).toEqual([
      'revenue',
      'orders',
      'customers',
    ]);
    expect(screen.getByRole('checkbox', { name: 'Revenue' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Orders' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Customers' })).toBeChecked();
  });

  it('allows empty, one, multiple, and all controlled selections', () => {
    const { rerender } = render(
      <MultiSelectSegmentedButtonGroup
        aria-label="Report columns"
        name="report-columns"
        onValueChange={() => undefined}
        segments={segments}
        value={[]}
      />,
    );
    expect(screen.getAllByRole('checkbox').every((checkbox) => !(checkbox as HTMLInputElement).checked)).toBe(true);

    rerender(
      <MultiSelectSegmentedButtonGroup
        aria-label="Report columns"
        name="report-columns"
        onValueChange={() => undefined}
        segments={segments}
        value={['orders']}
      />,
    );
    expect(screen.getByRole('checkbox', { name: 'Orders' })).toBeChecked();

    rerender(
      <MultiSelectSegmentedButtonGroup
        aria-label="Report columns"
        name="report-columns"
        onValueChange={() => undefined}
        segments={segments}
        value={['revenue', 'customers']}
      />,
    );
    expect(screen.getByRole('checkbox', { name: 'Revenue' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Customers' })).toBeChecked();

    rerender(
      <MultiSelectSegmentedButtonGroup
        aria-label="Report columns"
        name="report-columns"
        onValueChange={() => undefined}
        segments={segments}
        value={['revenue', 'orders', 'customers']}
      />,
    );
    expect(screen.getAllByRole('checkbox').every((checkbox) => (checkbox as HTMLInputElement).checked)).toBe(true);
  });

  it('forwards safe fieldset props, class, style, and ref', () => {
    const ref = createRef<HTMLFieldSetElement>();
    render(
      <MultiSelectSegmentedButtonGroup
        aria-describedby="column-help"
        className="custom-group"
        data-testid="group"
        legend="Report columns"
        name="report-columns"
        onValueChange={() => undefined}
        ref={ref}
        segments={segments}
        style={{ inlineSize: '20rem' }}
        value={[]}
      />,
    );

    const group = screen.getByTestId('group');
    expect(group).toHaveClass(
      'md-segmented-button-group',
      'md-multi-select-segmented-button-group',
      'custom-group',
    );
    expect(group).toHaveAttribute('aria-describedby', 'column-help');
    expect(group.style.inlineSize).toBe('20rem');
    expect(ref.current).toBe(group);
  });

  it('supports aria-label and aria-labelledby names without a legend', () => {
    const { rerender } = render(
      <MultiSelectSegmentedButtonGroup
        aria-label="Report columns"
        name="report-columns"
        onValueChange={() => undefined}
        segments={segments}
        value={[]}
      />,
    );
    expect(screen.getByRole('group', { name: 'Report columns' }).querySelector('legend')).toBeNull();

    rerender(
      <>
        <span id="report-columns-label">Referenced report columns</span>
        <MultiSelectSegmentedButtonGroup
          aria-labelledby="report-columns-label"
          name="report-columns"
          onValueChange={() => undefined}
          segments={segments}
          value={[]}
        />
      </>,
    );
    expect(screen.getByRole('group', { name: 'Referenced report columns' })).toBeInTheDocument();
  });

  it('requests a declaration-ordered immutable next value exactly once', () => {
    const onValueChange = vi.fn();
    const value = Object.freeze(['customers'] as const);
    render(
      <MultiSelectSegmentedButtonGroup
        legend="Report columns"
        name="report-columns"
        onValueChange={onValueChange}
        segments={segments}
        value={value}
      />,
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'Revenue' }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenLastCalledWith(['revenue', 'customers']);
    expect(value).toEqual(['customers']);

    fireEvent.click(screen.getByRole('checkbox', { name: 'Customers' }));
    expect(onValueChange).toHaveBeenCalledTimes(2);
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it('uses native disabled behavior while preserving checked values', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <MultiSelectSegmentedButtonGroup
        legend="Report columns"
        name="report-columns"
        onValueChange={onValueChange}
        segments={[...segments.slice(0, 2), { value: 'customers', label: 'Customers', disabled: true }]}
        value={['customers']}
      />,
    );

    const disabledSelected = screen.getByRole('checkbox', { name: 'Customers' });
    expect(disabledSelected).toBeDisabled();
    expect(disabledSelected).toBeChecked();
    await user.click(disabledSelected);
    expect(onValueChange).not.toHaveBeenCalled();

    rerender(
      <MultiSelectSegmentedButtonGroup
        disabled
        legend="Report columns"
        name="report-columns"
        onValueChange={onValueChange}
        segments={segments}
        value={['revenue']}
      />,
    );
    expect(screen.getByRole('group')).toBeDisabled();
    for (const checkbox of screen.getAllByRole('checkbox')) expect(checkbox).toBeDisabled();
    await user.click(screen.getByRole('checkbox', { name: 'Revenue' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('uses selectedIcon precedence and keeps icons decorative', () => {
    render(
      <MultiSelectSegmentedButtonGroup
        legend="Report columns"
        name="report-columns"
        onValueChange={() => undefined}
        segments={[
          {
            value: 'revenue',
            label: 'Revenue',
            icon: <svg data-testid="icon"><title>Revenue icon</title></svg>,
            selectedIcon: <svg data-testid="selected-icon"><title>Selected revenue</title></svg>,
          },
        ]}
        value={['revenue']}
      />,
    );

    expect(screen.getByTestId('selected-icon').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toHaveAccessibleName('Revenue');
  });

  it('uses logical positions and rejects invalid controlled values', () => {
    render(
      <MultiSelectSegmentedButtonGroup
        legend="Report columns"
        name="report-columns"
        onValueChange={() => undefined}
        segments={segments}
        value={[]}
      />,
    );
    expect(screen.getByRole('checkbox', { name: 'Revenue' }).closest('label')).toHaveAttribute('data-position', 'logical-start');
    expect(screen.getByRole('checkbox', { name: 'Orders' }).closest('label')).toHaveAttribute('data-position', 'middle');
    expect(screen.getByRole('checkbox', { name: 'Customers' }).closest('label')).toHaveAttribute('data-position', 'logical-end');

    const base = {
      legend: 'Report columns',
      name: 'report-columns',
      onValueChange: () => undefined,
      segments,
      value: [] as const,
    };
    expect(() => render(<MultiSelectSegmentedButtonGroup {...base} value={['missing' as 'revenue']} />)).toThrow('only supplied segment values');
    expect(() => render(<MultiSelectSegmentedButtonGroup {...base} value={['revenue', 'revenue']} />)).toThrow('must not contain duplicate');
    expect(() => render(<MultiSelectSegmentedButtonGroup {...base} name=" " />)).toThrow('name must not be blank');
    expect(() => render(<MultiSelectSegmentedButtonGroup {...base} legend="  " />)).toThrow('exactly one non-empty group name');
  });

  it('renders native checkbox form controls on the server', () => {
    const html = renderToString(
      <MultiSelectSegmentedButtonGroup
        aria-label="Report columns"
        name="report-columns"
        onValueChange={() => undefined}
        segments={segments}
        value={['revenue', 'customers']}
      />,
    );
    expect(html).toContain('<fieldset');
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('name="report-columns"');
    expect(html).toContain('checked=""');
  });

  it('keeps the public boundary controlled and checkbox-specific', () => {
    expectTypeOf<MultiSelectSegmentedButtonGroupProps<'revenue'>>().toHaveProperty('name');
    expectTypeOf<MultiSelectSegmentedButtonGroupProps<'revenue'>>().toHaveProperty('value');
    expectTypeOf<MultiSelectSegmentedButtonGroupProps<'revenue'>>().toHaveProperty('segments');
    expectTypeOf<MultiSelectSegmentedButtonGroupProps<'revenue'>>().not.toHaveProperty('defaultValue');
    expectTypeOf<MultiSelectSegmentedButtonGroupProps<'revenue'>>().not.toHaveProperty('selectionMode');
    expectTypeOf<MultiSelectSegmentedButtonGroupProps<'revenue'>>().not.toHaveProperty('aria-pressed');
    expectTypeOf<MultiSelectSegmentedButtonGroupProps<'revenue'>>().not.toHaveProperty('orientation');
    expectTypeOf<MultiSelectSegmentedButtonGroupProps<'revenue'>>().not.toHaveProperty('href');
    expectTypeOf<MultiSelectSegmentedButtonGroupProps<'revenue'>>().not.toHaveProperty('onChange');
  });

  it('reuses the reviewed visual shell without motion or a checkbox color system', () => {
    expect(segmentedButtonCss).toContain('.md-segmented-button-group__input:checked');
    expect(segmentedButtonCss).toContain('min-block-size: 40px');
    expect(segmentedButtonCss).toContain('min-inline-size: 58px');
    expect(segmentedButtonCss).toContain('var(--md-sys-color-secondary-container)');
    expect(segmentedButtonCss).toContain('var(--md-sys-color-on-secondary-container)');
    expect(segmentedButtonCss).toContain('var(--md-web-elevation-shadow-level0)');
    expect(segmentedButtonCss).toContain('margin-inline-start: -1px');
    expect(segmentedButtonCss).toContain('@media (hover: hover) and (pointer: fine)');
    expect(segmentedButtonCss).toContain('@media (forced-colors: active)');
    expect(segmentedButtonCss).not.toContain('transition:');
    expect(segmentedButtonCss).not.toContain('animation:');
  });
});
