import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';

import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';

import {
  CHIP_TREATMENTS,
  SuggestionChip,
  type SuggestionChipProps,
} from './index.js';

const suggestionChipCss = readFileSync(
  path.join(process.cwd(), 'src/components/chip/suggestion-chip.css'),
  'utf8',
);

afterEach(cleanup);

describe('SuggestionChip', () => {
  it('renders one native button with stable defaults', () => {
    render(<SuggestionChip>Reply yes</SuggestionChip>);

    const chip = screen.getByRole('button', { name: 'Reply yes' });
    expect(chip).toHaveAttribute('type', 'button');
    expect(chip).toHaveAttribute('data-treatment', 'flat');
    expect(chip).not.toHaveAttribute('aria-pressed');
    expect(chip).not.toHaveAttribute('aria-selected');
    expect(chip).not.toHaveAttribute('aria-checked');
  });

  it.each(CHIP_TREATMENTS)('renders the %s treatment', (treatment) => {
    render(<SuggestionChip treatment={treatment}>Suggestion</SuggestionChip>);
    expect(screen.getByRole('button')).toHaveAttribute(
      'data-treatment',
      treatment,
    );
  });

  it('forwards explicit submit and reset types', () => {
    const { rerender } = render(
      <SuggestionChip type="submit">Submit</SuggestionChip>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');

    rerender(<SuggestionChip type="reset">Reset</SuggestionChip>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
  });

  it('forwards safe native props, class, style, and ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <SuggestionChip
        aria-describedby="chip-help"
        className="custom-chip"
        data-testid="chip"
        ref={ref}
        style={{ inlineSize: '12rem' }}
      >
        Show more
      </SuggestionChip>,
    );

    const chip = screen.getByTestId('chip');
    expect(chip).toHaveClass('md-suggestion-chip', 'custom-chip');
    expect(chip).toHaveAttribute('aria-describedby', 'chip-help');
    expect(chip.style.inlineSize).toBe('12rem');
    expect(ref.current).toBe(chip);
  });

  it('supports visible text, aria-label, and aria-labelledby naming', () => {
    const { rerender } = render(<SuggestionChip>Visible label</SuggestionChip>);
    expect(screen.getByRole('button')).toHaveAccessibleName('Visible label');

    rerender(
      <SuggestionChip aria-label="Explicit label"><span /></SuggestionChip>,
    );
    expect(screen.getByRole('button')).toHaveAccessibleName('Explicit label');

    rerender(
      <>
        <span id="chip-label">Referenced label</span>
        <SuggestionChip aria-labelledby="chip-label"><span /></SuggestionChip>
      </>,
    );
    expect(screen.getByRole('button')).toHaveAccessibleName('Referenced label');
  });

  it('rejects conflicting, blank, and missing accessible names in development', () => {
    const conflictingNames = {
      'aria-label': 'One',
      'aria-labelledby': 'two',
      children: 'Visible',
    } as unknown as SuggestionChipProps;

    expect(() => render(<SuggestionChip {...conflictingNames} />)).toThrow(
      'either aria-label or aria-labelledby',
    );
    expect(() => render(<SuggestionChip aria-label="  ">Visible</SuggestionChip>)).toThrow(
      'must not be blank',
    );
    expect(() => render(<SuggestionChip title="Not a name"><span /></SuggestionChip>)).toThrow(
      'requires a non-empty visible textual label',
    );
  });

  it('warns for inspectable interactive or non-phrasing label content', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(<SuggestionChip><button>Invalid label</button></SuggestionChip>);

    expect(warning).toHaveBeenCalledWith(
      expect.stringContaining('non-interactive phrasing content'),
    );
    warning.mockRestore();
  });

  it('hides an optional leading icon from the accessible name', () => {
    render(
      <SuggestionChip
        leadingIcon={<svg data-testid="leading"><title>Leading icon</title></svg>}
      >
        Suggested reply
      </SuggestionChip>,
    );

    expect(screen.getByRole('button')).toHaveAccessibleName('Suggested reply');
    expect(screen.getByTestId('leading').parentElement).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('uses native keyboard activation and disabled behavior', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <>
        <SuggestionChip onClick={onClick}>Enabled</SuggestionChip>
        <SuggestionChip disabled onClick={onClick}>Disabled</SuggestionChip>
      </>,
    );

    const enabled = screen.getByRole('button', { name: 'Enabled' });
    enabled.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    await user.click(screen.getByRole('button', { name: 'Disabled' }));
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('renders on the server without a client-only boundary', () => {
    const html = renderToString(
      <SuggestionChip treatment="elevated">Server suggestion</SuggestionChip>,
    );
    expect(html).toContain('<button');
    expect(html).toContain('data-treatment="elevated"');
    expect(html).toContain('Server suggestion');
  });

  it('keeps its public prop boundary narrow', () => {
    expectTypeOf<SuggestionChipProps>().not.toHaveProperty('aria-pressed');
    expectTypeOf<SuggestionChipProps>().not.toHaveProperty('aria-selected');
    expectTypeOf<SuggestionChipProps>().not.toHaveProperty('aria-checked');
    expectTypeOf<SuggestionChipProps>().not.toHaveProperty('href');
    expectTypeOf<SuggestionChipProps>().not.toHaveProperty('size');
    expectTypeOf<SuggestionChipProps>().not.toHaveProperty('shape');
    expectTypeOf<SuggestionChipProps>().not.toHaveProperty('avatar');
    expectTypeOf<SuggestionChipProps>().not.toHaveProperty('trailingIcon');
    expectTypeOf<SuggestionChipProps>().not.toHaveProperty('selected');
    expectTypeOf<SuggestionChipProps>().not.toHaveProperty('remove');
  });

  it('uses the documented geometry, semantic roles, and state boundaries', () => {
    const css = suggestionChipCss;

    expect(css).toContain('min-block-size: 32px');
    expect(css).toContain('block-size: 18px');
    expect(css).toContain('gap: 8px');
    expect(css).toContain('padding-inline: 8px');
    expect(css).toContain('var(--md-sys-shape-corner-small)');
    expect(css).toContain('var(--md-sys-typescale-label-large-font)');
    expect(css).toContain('var(--md-sys-color-on-surface-variant)');
    expect(css).toContain('var(--md-sys-color-surface-container-low)');
    expect(css).toContain('var(--md-sys-color-outline-variant)');
    expect(css).toContain('var(--md-web-elevation-shadow-level2)');
    expect(css).toContain('var(--md-sys-state-hover-state-layer-opacity)');
    expect(css).toContain('@media (hover: hover) and (pointer: fine)');
    expect(css).toContain('@media (forced-colors: active)');
    expect(css).not.toContain('transition:');
    expect(css).not.toContain('animation:');
  });
});
