import { createRef } from 'react';
import { renderToString } from 'react-dom/server';

import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ICON_BUTTON_SHAPES,
  ICON_BUTTON_SIZES,
  ICON_BUTTON_VARIANTS,
  IconButton,
  type IconButtonProps,
} from './IconButton.js';

afterEach(cleanup);

function SettingsIcon() {
  return (
    <svg data-testid="settings-icon" viewBox="0 0 24 24">
      <title>Competing icon title</title>
      <path d="M12 3v18M3 12h18" />
    </svg>
  );
}

describe('IconButton', () => {
  it('renders a native button with stable defaults', () => {
    render(
      <IconButton aria-label="Settings">
        <SettingsIcon />
      </IconButton>,
    );

    const button = screen.getByRole('button', { name: 'Settings' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-variant', 'standard');
    expect(button).toHaveAttribute('data-size', 'small');
    expect(button).toHaveAttribute('data-shape', 'round');
  });

  it.each(ICON_BUTTON_VARIANTS)('renders the %s variant', (variant) => {
    render(
      <IconButton aria-label={variant} variant={variant}>
        <SettingsIcon />
      </IconButton>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', variant);
  });

  it.each(ICON_BUTTON_SIZES)('renders the %s size', (size) => {
    render(
      <IconButton aria-label={size} size={size}>
        <SettingsIcon />
      </IconButton>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('data-size', size);
  });

  it.each(ICON_BUTTON_SHAPES)('renders the %s shape', (shape) => {
    render(
      <IconButton aria-label={shape} shape={shape}>
        <SettingsIcon />
      </IconButton>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('data-shape', shape);
  });

  it('supports aria-labelledby without exposing descendant icon semantics', () => {
    render(
      <>
        <span id="settings-label">Open settings</span>
        <IconButton aria-labelledby="settings-label">
          <SettingsIcon />
        </IconButton>
      </>,
    );

    const button = screen.getByRole('button', { name: 'Open settings' });
    const visual = screen.getByTestId('settings-icon').closest(
      '.md-icon-button__visual',
    );
    expect(button).toHaveAttribute('aria-labelledby', 'settings-label');
    expect(visual).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img', { name: 'Competing icon title' })).toBeNull();
  });

  it('rejects a missing accessible name', () => {
    const invalidProps = {} as IconButtonProps;
    expect(() =>
      render(
        <IconButton {...invalidProps}>
          <SettingsIcon />
        </IconButton>,
      ),
    ).toThrow(/requires a non-empty aria-label or aria-labelledby/);
  });

  it('rejects a blank accessible name', () => {
    const invalidProps = { 'aria-label': '   ' } as IconButtonProps;
    expect(() =>
      render(
        <IconButton {...invalidProps}>
          <SettingsIcon />
        </IconButton>,
      ),
    ).toThrow(/requires a non-empty aria-label or aria-labelledby/);
  });

  it('does not allow title to substitute for an accessible name', () => {
    const invalidProps = { title: 'Settings' } as IconButtonProps;
    expect(() =>
      render(
        <IconButton {...invalidProps}>
          <SettingsIcon />
        </IconButton>,
      ),
    ).toThrow(/title is not an accessible-name substitute/);
  });

  it('forwards safe native props, className, style, and ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <IconButton
        aria-describedby="settings-help"
        aria-label="Settings"
        className="custom-icon-button"
        data-testid="settings-button"
        name="settings"
        ref={ref}
        style={{ marginInlineStart: '1rem' }}
        value="open"
      >
        <SettingsIcon />
      </IconButton>,
    );

    const button = screen.getByTestId('settings-button');
    expect(button).toHaveClass('md-icon-button', 'custom-icon-button');
    expect(button).toHaveAttribute('aria-describedby', 'settings-help');
    expect(button).toHaveAttribute('name', 'settings');
    expect(button).toHaveAttribute('value', 'open');
    expect(button.style.marginInlineStart).toBe('1rem');
    expect(ref.current).toBe(button);
  });

  it('forwards explicit submit and reset types', () => {
    render(
      <>
        <IconButton aria-label="Submit" type="submit">
          <SettingsIcon />
        </IconButton>
        <IconButton aria-label="Reset" type="reset">
          <SettingsIcon />
        </IconButton>
      </>,
    );

    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute(
      'type',
      'submit',
    );
    expect(screen.getByRole('button', { name: 'Reset' })).toHaveAttribute(
      'type',
      'reset',
    );
  });

  it('supports native keyboard activation and disabled behavior', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <>
        <IconButton aria-label="Enabled" onClick={onClick}>
          <SettingsIcon />
        </IconButton>
        <IconButton aria-label="Disabled" disabled onClick={onClick}>
          <SettingsIcon />
        </IconButton>
      </>,
    );

    const enabled = screen.getByRole('button', { name: 'Enabled' });
    enabled.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    await user.click(screen.getByRole('button', { name: 'Disabled' }));
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
  });

  it('renders on the server without client-only markup', () => {
    const html = renderToString(
      <IconButton aria-label="Server settings" variant="outlined">
        <SettingsIcon />
      </IconButton>,
    );
    expect(html).toContain('<button');
    expect(html).toContain('aria-label="Server settings"');
    expect(html).toContain('data-variant="outlined"');
    expect(html).not.toContain('use client');
  });
});
