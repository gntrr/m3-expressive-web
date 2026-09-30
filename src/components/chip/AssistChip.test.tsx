import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';

import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';

import {
  AssistChip,
  CHIP_TREATMENTS,
  type AssistChipProps,
} from './index.js';

const assistChipCss = readFileSync(
  path.join(process.cwd(), 'src/components/chip/assist-chip.css'),
  'utf8',
);

afterEach(cleanup);

describe('AssistChip', () => {
  it('renders one native button with stable defaults', () => {
    render(<AssistChip>Add to calendar</AssistChip>);

    const chip = screen.getByRole('button', { name: 'Add to calendar' });
    expect(chip).toHaveAttribute('type', 'button');
    expect(chip).toHaveAttribute('data-treatment', 'flat');
    expect(chip).not.toHaveAttribute('aria-pressed');
    expect(chip).not.toHaveAttribute('aria-selected');
    expect(chip).not.toHaveAttribute('aria-checked');
  });

  it.each(CHIP_TREATMENTS)('renders the %s treatment', (treatment) => {
    render(<AssistChip treatment={treatment}>Assist</AssistChip>);
    expect(screen.getByRole('button')).toHaveAttribute(
      'data-treatment',
      treatment,
    );
  });

  it('forwards explicit submit and reset types', () => {
    const { rerender } = render(<AssistChip type="submit">Submit</AssistChip>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');

    rerender(<AssistChip type="reset">Reset</AssistChip>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
  });

  it('forwards safe native props, class, style, and ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <AssistChip
        aria-describedby="chip-help"
        className="custom-chip"
        data-testid="chip"
        ref={ref}
        style={{ inlineSize: '12rem' }}
      >
        Save for later
      </AssistChip>,
    );

    const chip = screen.getByTestId('chip');
    expect(chip).toHaveClass('md-assist-chip', 'custom-chip');
    expect(chip).toHaveAttribute('aria-describedby', 'chip-help');
    expect(chip.style.inlineSize).toBe('12rem');
    expect(ref.current).toBe(chip);
  });

  it('supports visible text, aria-label, and aria-labelledby naming', () => {
    const { rerender } = render(<AssistChip>Visible label</AssistChip>);
    expect(screen.getByRole('button')).toHaveAccessibleName('Visible label');

    rerender(<AssistChip aria-label="Explicit label"><span /></AssistChip>);
    expect(screen.getByRole('button')).toHaveAccessibleName('Explicit label');

    rerender(
      <>
        <span id="chip-label">Referenced label</span>
        <AssistChip aria-labelledby="chip-label"><span /></AssistChip>
      </>,
    );
    expect(screen.getByRole('button')).toHaveAccessibleName('Referenced label');
  });

  it('rejects conflicting, blank, and missing accessible names in development', () => {
    const conflictingNames = {
      'aria-label': 'One',
      'aria-labelledby': 'two',
      children: 'Visible',
    } as unknown as AssistChipProps;

    expect(() =>
      render(<AssistChip {...conflictingNames} />),
    ).toThrow('either aria-label or aria-labelledby');
    expect(() => render(<AssistChip aria-label="  ">Visible</AssistChip>)).toThrow(
      'must not be blank',
    );
    expect(() => render(<AssistChip title="Not a name"><span /></AssistChip>)).toThrow(
      'requires a non-empty visible textual label',
    );
  });

  it('warns for inspectable non-phrasing label content without claiming to validate custom components', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(<AssistChip><div>Invalid label structure</div></AssistChip>);

    expect(warning).toHaveBeenCalledWith(
      expect.stringContaining('non-interactive phrasing content'),
    );
    warning.mockRestore();
  });

  it('hides optional icon content from the accessible name', () => {
    render(
      <AssistChip
        leadingIcon={<svg data-testid="leading"><title>Leading icon</title></svg>}
        trailingIcon={<svg data-testid="trailing"><title>Trailing icon</title></svg>}
      >
        Share
      </AssistChip>,
    );

    expect(screen.getByRole('button')).toHaveAccessibleName('Share');
    expect(screen.getByTestId('leading').parentElement).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.getByTestId('trailing').parentElement).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('uses native keyboard activation and disabled behavior', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <>
        <AssistChip onClick={onClick}>Enabled</AssistChip>
        <AssistChip disabled onClick={onClick}>Disabled</AssistChip>
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
      <AssistChip treatment="elevated">Server action</AssistChip>,
    );
    expect(html).toContain('<button');
    expect(html).toContain('data-treatment="elevated"');
    expect(html).toContain('Server action');
  });

  it('keeps its public prop boundary narrow', () => {
    expectTypeOf<AssistChipProps>().not.toHaveProperty('aria-pressed');
    expectTypeOf<AssistChipProps>().not.toHaveProperty('aria-selected');
    expectTypeOf<AssistChipProps>().not.toHaveProperty('aria-checked');
    expectTypeOf<AssistChipProps>().not.toHaveProperty('href');
    expectTypeOf<AssistChipProps>().not.toHaveProperty('size');
    expectTypeOf<AssistChipProps>().not.toHaveProperty('shape');
    expectTypeOf<AssistChipProps>().not.toHaveProperty('avatar');
  });

  it('uses the documented geometry, semantic roles, and state boundaries', () => {
    const css = assistChipCss;

    expect(css).toContain('min-block-size: 32px');
    expect(css).toContain('block-size: 18px');
    expect(css).toContain('gap: 8px');
    expect(css).toContain('padding-inline: 8px');
    expect(css).toContain('var(--md-sys-shape-corner-small)');
    expect(css).toContain('var(--md-sys-typescale-label-large-font)');
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
