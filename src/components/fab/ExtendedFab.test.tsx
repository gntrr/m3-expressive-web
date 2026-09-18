import { readFileSync } from 'node:fs';
import path from 'node:path';

import { createRef } from 'react';
import { renderToString } from 'react-dom/server';

import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ExtendedFab, type ExtendedFabProps } from './ExtendedFab.js';
import { FAB_SIZES, FAB_VARIANTS } from './Fab.js';

const fabCss = readFileSync(
  path.join(process.cwd(), 'src/components/fab/fab.css'),
  'utf8',
);
const extendedFabSource = readFileSync(
  path.join(process.cwd(), 'src/components/fab/ExtendedFab.tsx'),
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

describe('ExtendedFab', () => {
  it('renders a native button with visible-label defaults', () => {
    render(<ExtendedFab>Create item</ExtendedFab>);

    const button = screen.getByRole('button', { name: 'Create item' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'regular');
    expect(button).toHaveAttribute('data-has-leading-icon', 'false');
    expect(button).not.toHaveAttribute('aria-label');
    expect(button).not.toHaveAttribute('aria-pressed');
  });

  it.each(FAB_VARIANTS)('renders the %s variant', (variant) => {
    render(<ExtendedFab variant={variant}>Create item</ExtendedFab>);
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', variant);
  });

  it.each(FAB_SIZES)('renders the %s size', (size) => {
    render(<ExtendedFab size={size}>Create item</ExtendedFab>);
    expect(screen.getByRole('button')).toHaveAttribute('data-size', size);
  });

  it('supports an optional decorative leading icon', () => {
    render(
      <ExtendedFab leadingIcon={<AddIcon />}>Create item</ExtendedFab>,
    );

    const button = screen.getByRole('button', { name: 'Create item' });
    const icon = screen.getByTestId('add-icon');
    expect(button).toHaveAttribute('data-has-leading-icon', 'true');
    expect(icon.closest('.md-extended-fab__icon')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.queryByRole('img', { name: 'Competing icon title' })).toBeNull();
  });

  it('uses the visible label by default and supports one intentional name override', () => {
    render(
      <>
        <ExtendedFab>Create item</ExtendedFab>
        <ExtendedFab aria-label="Create a new item">Create item</ExtendedFab>
        <span id="create-item-label">Create a draft item</span>
        <ExtendedFab aria-labelledby="create-item-label">Create item</ExtendedFab>
      </>,
    );

    expect(screen.getByRole('button', { name: 'Create item' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create a new item' }),
    ).toHaveAttribute('aria-label', 'Create a new item');
    expect(
      screen.getByRole('button', { name: 'Create a draft item' }),
    ).toHaveAttribute('aria-labelledby', 'create-item-label');
  });

  it('rejects empty labels and invalid accessible-name overrides', () => {
    const cases: readonly ExtendedFabProps[] = [
      { children: '   ' } as ExtendedFabProps,
      { children: '', title: 'Create item' } as ExtendedFabProps,
      { children: 'Create item', 'aria-label': '   ' } as ExtendedFabProps,
      { children: 'Create item', 'aria-labelledby': '   ' } as ExtendedFabProps,
      {
        children: 'Create item',
        'aria-label': 'Create item',
        'aria-labelledby': 'create-item-label',
      } as ExtendedFabProps,
    ];

    const messages = [
      /requires a non-empty visible text label/,
      /requires a non-empty visible text label/,
      /aria-label override must be non-empty/,
      /aria-labelledby override must be non-empty/,
      /accepts at most one accessible-name override/,
    ];

    for (const [index, invalidProps] of cases.entries()) {
      expect(() => render(<ExtendedFab {...invalidProps} />)).toThrow(messages[index]);
    }
  });

  it('forwards safe native props, className, style, and ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <ExtendedFab
        aria-describedby="create-help"
        className="custom-extended-fab"
        data-testid="extended-fab"
        leadingIcon={<AddIcon />}
        name="create"
        ref={ref}
        style={{ marginInlineStart: '1rem' }}
        value="new"
      >
        Create item
      </ExtendedFab>,
    );

    const button = screen.getByTestId('extended-fab');
    expect(button).toHaveClass('md-extended-fab', 'custom-extended-fab');
    expect(button).toHaveAttribute('aria-describedby', 'create-help');
    expect(button).toHaveAttribute('name', 'create');
    expect(button).toHaveAttribute('value', 'new');
    expect(button.style.marginInlineStart).toBe('1rem');
    expect(ref.current).toBe(button);
  });

  it('forwards explicit submit and reset types', () => {
    render(
      <>
        <ExtendedFab type="submit">Submit</ExtendedFab>
        <ExtendedFab type="reset">Reset</ExtendedFab>
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
        <ExtendedFab onClick={onClick}>Enabled</ExtendedFab>
        <ExtendedFab disabled onClick={onClick}>Disabled</ExtendedFab>
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

  it('keeps typography, geometry, shape, state, and elevation mappings in CSS', () => {
    expect(fabCss).toContain('--md-regular-extended-fab-container-height,\n    56px');
    expect(fabCss).toContain('--md-small-extended-fab-container-height,\n    56px');
    expect(fabCss).toContain('--md-medium-extended-fab-container-height,\n    80px');
    expect(fabCss).toContain('--md-large-extended-fab-container-height,\n    96px');
    expect(fabCss).toContain('--md-regular-extended-fab-leading-space,\n    16px');
    expect(fabCss).toContain('--md-medium-extended-fab-icon-label-space,\n    12px');
    expect(fabCss).toContain('--md-large-extended-fab-icon-label-space,\n    16px');
    expect(fabCss).toContain('--md-sys-typescale-label-large-font');
    expect(fabCss).toContain('--md-sys-typescale-title-medium-font');
    expect(fabCss).toContain('--md-sys-typescale-title-large-font');
    expect(fabCss).toContain('--md-sys-typescale-headline-small-font');
    expect(fabCss).toContain('--md-sys-shape-corner-large-increased');
    expect(fabCss).toContain('--_fab-rest-shadow: var(--md-web-elevation-shadow-level3, none);');
    expect(fabCss).toContain('--_fab-hover-shadow: var(--md-web-elevation-shadow-level4, none);');
    expect(fabCss).toContain('box-shadow: var(--md-web-elevation-shadow-level0, none);');
    expect(fabCss).toContain('overflow-wrap: anywhere;');
    expect(fabCss).toContain('white-space: normal;');
  });

  it('has no collapsed or expanded runtime API', () => {
    expect(extendedFabSource).not.toMatch(
      /\b(?:expanded|defaultExpanded|collapse|hideLabel)\b/,
    );
  });

  it('renders on the server without client-only markup', () => {
    const html = renderToString(
      <ExtendedFab leadingIcon={<AddIcon />} size="large" variant="tertiary">
        Create item
      </ExtendedFab>,
    );

    expect(html).toContain('<button');
    expect(html).toContain('Create item');
    expect(html).toContain('data-size="large"');
    expect(html).toContain('data-variant="tertiary"');
    expect(html).not.toContain('use client');
  });
});
