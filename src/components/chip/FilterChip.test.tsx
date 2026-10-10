import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';

import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';

import {
  CHIP_TREATMENTS,
  FilterChip,
  type FilterChipProps,
} from './index.js';

const filterChipCss = readFileSync(
  path.join(process.cwd(), 'src/components/chip/filter-chip.css'),
  'utf8',
);

afterEach(cleanup);

describe('FilterChip', () => {
  it('renders one native controlled toggle button with stable defaults', () => {
    render(<FilterChip selected={false}>Vegetarian</FilterChip>);

    const chip = screen.getByRole('button', { name: 'Vegetarian' });
    expect(chip).toHaveAttribute('type', 'button');
    expect(chip).toHaveAttribute('data-treatment', 'flat');
    expect(chip).toHaveAttribute('data-selected', 'false');
    expect(chip).toHaveAttribute('aria-pressed', 'false');
    expect(chip).not.toHaveAttribute('aria-selected');
    expect(chip).not.toHaveAttribute('aria-checked');
  });

  it.each(CHIP_TREATMENTS)('renders the %s treatment in both modes', (treatment) => {
    const { rerender } = render(
      <FilterChip selected={false} treatment={treatment}>Filter</FilterChip>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('data-treatment', treatment);

    rerender(<FilterChip selected treatment={treatment}>Filter</FilterChip>);
    expect(screen.getByRole('button')).toHaveAttribute('data-selected', 'true');
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('forwards explicit submit and reset types', () => {
    const { rerender } = render(
      <FilterChip selected={false} type="submit">Submit</FilterChip>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');

    rerender(<FilterChip selected={false} type="reset">Reset</FilterChip>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
  });

  it('forwards safe native props, class, style, and ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <FilterChip
        aria-describedby="chip-help"
        className="custom-chip"
        data-testid="chip"
        ref={ref}
        selected={false}
        style={{ inlineSize: '12rem' }}
      >
        Available now
      </FilterChip>,
    );

    const chip = screen.getByTestId('chip');
    expect(chip).toHaveClass('md-filter-chip', 'custom-chip');
    expect(chip).toHaveAttribute('aria-describedby', 'chip-help');
    expect(chip.style.inlineSize).toBe('12rem');
    expect(ref.current).toBe(chip);
  });

  it('supports visible text, aria-label, and aria-labelledby naming', () => {
    const { rerender } = render(<FilterChip selected={false}>Visible label</FilterChip>);
    expect(screen.getByRole('button')).toHaveAccessibleName('Visible label');

    rerender(
      <FilterChip aria-label="Explicit label" selected={false}><span /></FilterChip>,
    );
    expect(screen.getByRole('button')).toHaveAccessibleName('Explicit label');

    rerender(
      <>
        <span id="chip-label">Referenced label</span>
        <FilterChip aria-labelledby="chip-label" selected={false}><span /></FilterChip>
      </>,
    );
    expect(screen.getByRole('button')).toHaveAccessibleName('Referenced label');
  });

  it('rejects conflicting, blank, and missing accessible names in development', () => {
    const conflictingNames = {
      'aria-label': 'One',
      'aria-labelledby': 'two',
      children: 'Visible',
      selected: false,
    } as unknown as FilterChipProps;

    expect(() => render(<FilterChip {...conflictingNames} />)).toThrow(
      'either aria-label or aria-labelledby',
    );
    expect(() => render(<FilterChip aria-label="  " selected={false}>Visible</FilterChip>)).toThrow(
      'must not be blank',
    );
    expect(() => render(<FilterChip selected={false} title="Not a name"><span /></FilterChip>)).toThrow(
      'requires a non-empty visible textual label',
    );
  });

  it('calls onClick before requesting the next controlled selected value', async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    render(
      <FilterChip
        onClick={() => calls.push('click')}
        onSelectedChange={(selected) => calls.push('selected:' + selected)}
        selected={false}
      >
        Vegetarian
      </FilterChip>,
    );

    await user.click(screen.getByRole('button'));
    expect(calls).toEqual(['click', 'selected:true']);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('uses native keyboard activation and suppresses both callbacks when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onSelectedChange = vi.fn();
    render(
      <>
        <FilterChip
          onClick={onClick}
          onSelectedChange={onSelectedChange}
          selected={false}
        >
          Enabled
        </FilterChip>
        <FilterChip
          disabled
          onClick={onClick}
          onSelectedChange={onSelectedChange}
          selected
        >
          Disabled
        </FilterChip>
      </>,
    );

    const enabled = screen.getByRole('button', { name: 'Enabled' });
    enabled.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    await user.click(screen.getByRole('button', { name: 'Disabled' }));
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(onSelectedChange).toHaveBeenNthCalledWith(1, true);
    expect(onSelectedChange).toHaveBeenNthCalledWith(2, true);
    expect(screen.getByRole('button', { name: 'Disabled' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('uses one decorative start slot with selectedIcon precedence and a decorative trailing icon', () => {
    const { rerender } = render(
      <FilterChip
        leadingIcon={<svg data-testid="leading"><title>Leading icon</title></svg>}
        selected={false}
        selectedIcon={<svg data-testid="selected"><title>Selected icon</title></svg>}
        trailingIcon={<svg data-testid="trailing"><title>Trailing icon</title></svg>}
      >
        Vegetarian
      </FilterChip>,
    );

    expect(screen.getByTestId('leading')).toBeInTheDocument();
    expect(screen.queryByTestId('selected')).not.toBeInTheDocument();
    expect(screen.getByTestId('leading').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('trailing').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('button')).toHaveAccessibleName('Vegetarian');

    rerender(
      <FilterChip
        leadingIcon={<svg data-testid="leading"><title>Leading icon</title></svg>}
        selected
        selectedIcon={<svg data-testid="selected"><title>Selected icon</title></svg>}
        trailingIcon={<svg data-testid="trailing"><title>Trailing icon</title></svg>}
      >
        Vegetarian
      </FilterChip>,
    );
    expect(screen.getByTestId('selected')).toBeInTheDocument();
    expect(screen.queryByTestId('leading')).not.toBeInTheDocument();
    expect(screen.getByTestId('selected').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps a leading icon in selected mode when selectedIcon is absent', () => {
    render(
      <FilterChip
        leadingIcon={<svg data-testid="leading" />}
        selected
      >
        Vegetarian
      </FilterChip>,
    );
    expect(screen.getByTestId('leading')).toBeInTheDocument();
  });

  it('renders on the server without a client-only boundary', () => {
    const html = renderToString(
      <FilterChip selected treatment="elevated">Server filter</FilterChip>,
    );
    expect(html).toContain('<button');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('data-treatment="elevated"');
  });

  it('keeps its public prop boundary narrow and controlled', () => {
    expectTypeOf<FilterChipProps>().toHaveProperty('selected');
    expectTypeOf<FilterChipProps>().not.toHaveProperty('aria-pressed');
    expectTypeOf<FilterChipProps>().not.toHaveProperty('aria-selected');
    expectTypeOf<FilterChipProps>().not.toHaveProperty('aria-checked');
    expectTypeOf<FilterChipProps>().not.toHaveProperty('checked');
    expectTypeOf<FilterChipProps>().not.toHaveProperty('defaultSelected');
    expectTypeOf<FilterChipProps>().not.toHaveProperty('href');
    expectTypeOf<FilterChipProps>().not.toHaveProperty('size');
    expectTypeOf<FilterChipProps>().not.toHaveProperty('shape');
    expectTypeOf<FilterChipProps>().not.toHaveProperty('avatar');
    expectTypeOf<FilterChipProps>().not.toHaveProperty('remove');
  });

  it('uses the documented geometry, selected mappings, and public factory elevation matrix', () => {
    const css = filterChipCss;

    expect(css).toContain('min-block-size: 32px');
    expect(css).toContain('block-size: 18px');
    expect(css).toContain('gap: 8px');
    expect(css).toContain('padding-inline: 8px');
    expect(css).toContain('var(--md-sys-shape-corner-small)');
    expect(css).toContain('var(--md-sys-typescale-label-large-font)');
    expect(css).toContain('var(--md-sys-color-secondary-container)');
    expect(css).toContain('var(--md-sys-color-on-secondary-container)');
    expect(css).toContain('var(--md-sys-color-surface-container-low)');
    expect(css).toContain('var(--md-sys-color-outline-variant)');
    expect(css).toContain('var(--md-web-elevation-shadow-level1)');
    expect(css).toContain('var(--md-web-elevation-shadow-level2)');
    expect(css).toContain('var(--md-sys-state-hover-state-layer-opacity)');
    expect(css).toContain("[data-selected='true']");
    expect(css).toContain('@media (hover: hover) and (pointer: fine)');
    expect(css).toContain('@media (forced-colors: active)');
    expect(css).not.toContain('transition:');
    expect(css).not.toContain('animation:');
  });
});
