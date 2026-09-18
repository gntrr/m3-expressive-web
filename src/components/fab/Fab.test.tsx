import { readFileSync } from 'node:fs';
import path from 'node:path';

import { createRef } from 'react';
import { renderToString } from 'react-dom/server';

import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  FAB_SIZES,
  FAB_VARIANTS,
  Fab,
  type FabProps,
} from './Fab.js';

const fabCss = readFileSync(
  path.join(process.cwd(), 'src/components/fab/fab.css'),
  'utf8',
);

afterEach(cleanup);

function AddIcon() {
  return (
    <svg data-testid="add-icon" viewBox="0 0 24 24">
      <title>Competing icon title</title>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

describe('Fab', () => {
  it('renders a native button with stable defaults', () => {
    render(
      <Fab aria-label="Create item">
        <AddIcon />
      </Fab>,
    );

    const button = screen.getByRole('button', { name: 'Create item' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'regular');
    expect(button).not.toHaveAttribute('aria-pressed');
  });

  it.each(FAB_VARIANTS)('renders the %s variant', (variant) => {
    render(
      <Fab aria-label={variant} variant={variant}>
        <AddIcon />
      </Fab>,
    );

    expect(screen.getByRole('button')).toHaveAttribute('data-variant', variant);
  });

  it.each(FAB_SIZES)('renders the %s size', (size) => {
    render(
      <Fab aria-label={size} size={size}>
        <AddIcon />
      </Fab>,
    );

    expect(screen.getByRole('button')).toHaveAttribute('data-size', size);
  });

  it('supports aria-labelledby without exposing descendant icon semantics', () => {
    render(
      <>
        <span id="fab-label">Create item</span>
        <Fab aria-labelledby="fab-label">
          <AddIcon />
        </Fab>
      </>,
    );

    const button = screen.getByRole('button', { name: 'Create item' });
    const visual = screen.getByTestId('add-icon').closest('.md-fab__visual');
    expect(button).toHaveAttribute('aria-labelledby', 'fab-label');
    expect(visual).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img', { name: 'Competing icon title' })).toBeNull();
  });

  it('rejects missing or blank accessible names, including title alone', () => {
    const cases: readonly FabProps[] = [
      {} as FabProps,
      { 'aria-label': '   ' } as FabProps,
      { title: 'Create item' } as FabProps,
    ];

    for (const invalidProps of cases) {
      expect(() =>
        render(
          <Fab {...invalidProps}>
            <AddIcon />
          </Fab>,
        ),
      ).toThrow(/requires a non-empty aria-label or aria-labelledby/);
    }
  });

  it('rejects multiple accessible-name sources', () => {
    const invalidProps = {
      'aria-label': 'Create item',
      'aria-labelledby': 'fab-label',
    } as FabProps;

    expect(() =>
      render(
        <Fab {...invalidProps}>
          <AddIcon />
        </Fab>,
      ),
    ).toThrow(/requires exactly one accessible name/);
  });

  it('forwards safe native props, className, style, and ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Fab
        aria-describedby="fab-help"
        aria-label="Create item"
        className="custom-fab"
        data-testid="fab"
        name="create"
        ref={ref}
        style={{ marginInlineStart: '1rem' }}
        value="new"
      >
        <AddIcon />
      </Fab>,
    );

    const button = screen.getByTestId('fab');
    expect(button).toHaveClass('md-fab', 'custom-fab');
    expect(button).toHaveAttribute('aria-describedby', 'fab-help');
    expect(button).toHaveAttribute('name', 'create');
    expect(button).toHaveAttribute('value', 'new');
    expect(button.style.marginInlineStart).toBe('1rem');
    expect(ref.current).toBe(button);
  });

  it('forwards explicit submit and reset types', () => {
    render(
      <>
        <Fab aria-label="Submit" type="submit">
          <AddIcon />
        </Fab>
        <Fab aria-label="Reset" type="reset">
          <AddIcon />
        </Fab>
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
        <Fab aria-label="Enabled" onClick={onClick}>
          <AddIcon />
        </Fab>
        <Fab aria-label="Disabled" disabled onClick={onClick}>
          <AddIcon />
        </Fab>
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

  it('does not expose toggle semantics, even from unsafe runtime props', () => {
    const unsafeProps = {
      'aria-label': 'Create item',
      'aria-pressed': true,
    } as unknown as FabProps;
    render(
      <Fab {...unsafeProps}>
        <AddIcon />
      </Fab>,
    );

    expect(screen.getByRole('button')).not.toHaveAttribute('aria-pressed');
  });

  it('keeps the documented geometry, shape, colors, and elevation in CSS', () => {
    expect(fabCss).toContain('--_fab-rest-shadow: var(--md-web-elevation-shadow-level3, none);');
    expect(fabCss).toContain('--_fab-hover-shadow: var(--md-web-elevation-shadow-level4, none);');
    expect(fabCss).toContain('box-shadow: var(--md-web-elevation-shadow-level0, none);');
    expect(fabCss).toContain('--md-sys-color-primary-container');
    expect(fabCss).toContain('--md-sys-color-secondary-container');
    expect(fabCss).toContain('--md-sys-color-tertiary-container');
    expect(fabCss).toContain('--md-sys-color-surface-container-high');
    expect(fabCss).toContain('--md-small-fab-container-size, 40px');
    expect(fabCss).toContain('--md-regular-fab-container-size, 56px');
    expect(fabCss).toContain('--md-medium-fab-container-size, 80px');
    expect(fabCss).toContain('--md-large-fab-container-size, 96px');
    expect(fabCss).toContain('--md-large-fab-icon-size, 36px');
    expect(fabCss).toContain('--md-sys-shape-corner-large-increased');
  });

  it('renders on the server without client-only markup', () => {
    const html = renderToString(
      <Fab aria-label="Create item" size="large" variant="tertiary">
        <AddIcon />
      </Fab>,
    );

    expect(html).toContain('<button');
    expect(html).toContain('aria-label="Create item"');
    expect(html).toContain('data-size="large"');
    expect(html).toContain('data-variant="tertiary"');
    expect(html).not.toContain('use client');
  });
});
