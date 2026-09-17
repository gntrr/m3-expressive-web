import { readFileSync } from 'node:fs';
import path from 'node:path';

import { createRef } from 'react';
import { renderToString } from 'react-dom/server';

import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ICON_BUTTON_SHAPES,
  ICON_BUTTON_SIZES,
  ICON_BUTTON_VARIANTS,
  ToggleIconButton,
  type ToggleIconButtonProps,
} from './index.js';

afterEach(cleanup);

function MuteIcon() {
  return (
    <svg data-testid="mute-icon" viewBox="0 0 24 24">
      <title>Competing icon title</title>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
    </svg>
  );
}

describe('ToggleIconButton', () => {
  it('renders a native button with controlled aria-pressed defaults', () => {
    render(
      <ToggleIconButton aria-label="Mute" pressed={false}>
        <MuteIcon />
      </ToggleIconButton>,
    );

    const button = screen.getByRole('button', { name: 'Mute' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('data-pressed', 'false');
    expect(button).toHaveAttribute('data-variant', 'standard');
    expect(button).toHaveAttribute('data-size', 'small');
    expect(button).toHaveAttribute('data-shape', 'round');
  });

  it('derives aria-pressed rather than allowing a conflicting value', () => {
    const invalidProps = {
      'aria-label': 'Mute',
      'aria-pressed': true,
      children: <MuteIcon />,
      pressed: false,
    } as unknown as ToggleIconButtonProps;
    render(<ToggleIconButton {...invalidProps} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it.each(ICON_BUTTON_VARIANTS)('supports the %s variant in both modes', (variant) => {
    const { rerender } = render(
      <ToggleIconButton aria-label={variant} pressed={false} variant={variant}>
        <MuteIcon />
      </ToggleIconButton>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('data-pressed', 'false');

    rerender(
      <ToggleIconButton aria-label={variant} pressed variant={variant}>
        <MuteIcon />
      </ToggleIconButton>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('data-pressed', 'true');
  });

  it.each(ICON_BUTTON_SIZES)('supports the %s uniform size', (size) => {
    render(
      <ToggleIconButton aria-label={size} pressed size={size}>
        <MuteIcon />
      </ToggleIconButton>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('data-size', size);
  });

  it.each(ICON_BUTTON_SHAPES)('supports the %s shape', (shape) => {
    render(
      <ToggleIconButton aria-label={shape} pressed shape={shape}>
        <MuteIcon />
      </ToggleIconButton>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('data-shape', shape);
  });

  it('calls onClick before requesting the next controlled value', async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    render(
      <ToggleIconButton
        aria-label="Mute"
        onClick={() => calls.push('click')}
        onPressedChange={(next) => calls.push(`change:${next}`)}
        pressed={false}
      >
        <MuteIcon />
      </ToggleIconButton>,
    );

    await user.click(screen.getByRole('button', { name: 'Mute' }));
    expect(calls).toEqual(['click', 'change:true']);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('does not let preventDefault cancel the controlled-state request', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <ToggleIconButton
        aria-label="Mute"
        onClick={(event) => event.preventDefault()}
        onPressedChange={onPressedChange}
        pressed
      >
        <MuteIcon />
      </ToggleIconButton>,
    );

    await user.click(screen.getByRole('button', { name: 'Mute' }));
    expect(onPressedChange).toHaveBeenCalledWith(false);
  });

  it('does not call either callback while disabled in either persistent mode', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onPressedChange = vi.fn();
    render(
      <>
        <ToggleIconButton
          aria-label="Muted disabled"
          disabled
          onClick={onClick}
          onPressedChange={onPressedChange}
          pressed
        >
          <MuteIcon />
        </ToggleIconButton>
        <ToggleIconButton
          aria-label="Unmuted disabled"
          disabled
          onClick={onClick}
          onPressedChange={onPressedChange}
          pressed={false}
        >
          <MuteIcon />
        </ToggleIconButton>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Muted disabled' }));
    await user.click(screen.getByRole('button', { name: 'Unmuted disabled' }));
    expect(onClick).not.toHaveBeenCalled();
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it('uses native Enter and Space activation without custom key handlers', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <ToggleIconButton
        aria-label="Mute"
        onPressedChange={onPressedChange}
        pressed={false}
      >
        <MuteIcon />
      </ToggleIconButton>,
    );

    const button = screen.getByRole('button', { name: 'Mute' });
    button.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onPressedChange).toHaveBeenNthCalledWith(1, true);
    expect(onPressedChange).toHaveBeenNthCalledWith(2, true);
  });

  it('shares strict accessible-name and decorative-icon behavior', () => {
    render(
      <>
        <span id="mute-label">Mute audio</span>
        <ToggleIconButton aria-labelledby="mute-label" pressed={false}>
          <MuteIcon />
        </ToggleIconButton>
      </>,
    );
    const button = screen.getByRole('button', { name: 'Mute audio' });
    const visual = screen.getByTestId('mute-icon').closest(
      '.md-icon-button__visual',
    );
    expect(button).toHaveAttribute('aria-labelledby', 'mute-label');
    expect(visual).toHaveAttribute('aria-hidden', 'true');
  });

  it('rejects missing and blank accessible names', () => {
    const missingProps = { pressed: false } as ToggleIconButtonProps;
    const blankProps = {
      'aria-label': '  ',
      pressed: false,
    } as ToggleIconButtonProps;

    expect(() =>
      render(
        <ToggleIconButton {...missingProps}>
          <MuteIcon />
        </ToggleIconButton>,
      ),
    ).toThrow(/requires a non-empty aria-label or aria-labelledby/);
    expect(() =>
      render(
        <ToggleIconButton {...blankProps}>
          <MuteIcon />
        </ToggleIconButton>,
      ),
    ).toThrow(/requires a non-empty aria-label or aria-labelledby/);
  });

  it('forwards a native ref and explicit button type', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <ToggleIconButton aria-label="Reset mute" pressed ref={ref} type="reset">
        <MuteIcon />
      </ToggleIconButton>,
    );
    expect(ref.current).toBe(screen.getByRole('button'));
    expect(ref.current).toHaveAttribute('type', 'reset');
  });

  it('keeps canonical toggle color and shape mappings in shared CSS', () => {
    const css = readFileSync(
      path.join(process.cwd(), 'src/components/icon-button/icon-button.css'),
      'utf8',
    );
    expect(css).toContain('--md-sys-color-surface-container');
    expect(css).toContain('--md-sys-color-secondary');
    expect(css).toContain('--md-sys-color-inverse-surface');
    expect(css).toContain('--_icon-button-selected-round-shape');
    expect(css).toContain('--_icon-button-selected-square-shape');
    expect(css).toContain("[data-pressed='true'][data-shape='round']");
  });

  it('renders on the server without a client-only boundary', () => {
    const html = renderToString(
      <ToggleIconButton aria-label="Server mute" pressed variant="outlined">
        <MuteIcon />
      </ToggleIconButton>,
    );
    expect(html).toContain('<button');
    expect(html).toContain('aria-pressed="true"');
    expect(html).not.toContain('use client');
  });
});
