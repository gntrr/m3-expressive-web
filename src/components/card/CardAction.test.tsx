import { readFileSync } from 'node:fs';
import path from 'node:path';

import { createRef } from 'react';
import { renderToString } from 'react-dom/server';

import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';

import {
  CARD_ACTION_VARIANTS,
  CardAction,
  type CardActionProps,
} from './CardAction.js';

const cardActionCss = readFileSync(
  path.join(process.cwd(), 'src/components/card/card-action.css'),
  'utf8',
);
const cardActionSource = readFileSync(
  path.join(process.cwd(), 'src/components/card/CardAction.tsx'),
  'utf8',
);

afterEach(cleanup);

describe('CardAction', () => {
  it('renders one native button with a stable filled default', () => {
    render(<CardAction data-testid="card-action">Open details</CardAction>);

    const cardAction = screen.getByTestId('card-action');
    expect(cardAction.tagName).toBe('BUTTON');
    expect(cardAction).toHaveAttribute('type', 'button');
    expect(cardAction).toHaveAttribute('data-variant', 'filled');
    expect(cardAction).toHaveClass('md-card-action');
    expect(cardAction).not.toHaveAttribute('aria-pressed');
    expect(cardAction).not.toHaveAttribute('aria-selected');
  });

  it.each(CARD_ACTION_VARIANTS)('renders the %s variant', (variant) => {
    render(<CardAction variant={variant}>{variant}</CardAction>);

    expect(screen.getByRole('button', { name: variant })).toHaveAttribute(
      'data-variant',
      variant,
    );
  });

  it('forwards explicit submit and reset types', () => {
    render(
      <>
        <CardAction type="submit">Submit</CardAction>
        <CardAction type="reset">Reset</CardAction>
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

  it('forwards safe native props, className, style, and ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <CardAction
        aria-describedby="card-action-help"
        className="custom-card-action"
        data-testid="card-action"
        id="account-action"
        name="account"
        ref={ref}
        style={{ marginInlineStart: '1rem' }}
        value="open"
      >
        Open account
      </CardAction>,
    );

    const cardAction = screen.getByTestId('card-action');
    expect(cardAction).toHaveClass('md-card-action', 'custom-card-action');
    expect(cardAction).toHaveAttribute('aria-describedby', 'card-action-help');
    expect(cardAction).toHaveAttribute('id', 'account-action');
    expect(cardAction).toHaveAttribute('name', 'account');
    expect(cardAction).toHaveAttribute('value', 'open');
    expect(cardAction.style.marginInlineStart).toBe('1rem');
    expect(ref.current).toBe(cardAction);
  });

  it('uses visible text, aria-label, or aria-labelledby for its accessible name', () => {
    render(
      <>
        <CardAction>Visible command</CardAction>
        <CardAction aria-label="Explicit command">
          <svg aria-hidden="true" />
        </CardAction>
        <span id="labelled-command">Referenced command</span>
        <CardAction aria-labelledby="labelled-command">
          <svg aria-hidden="true" />
        </CardAction>
      </>,
    );

    expect(screen.getByRole('button', { name: 'Visible command' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Explicit command' })).toHaveAttribute(
      'aria-label',
      'Explicit command',
    );
    expect(screen.getByRole('button', { name: 'Referenced command' })).toHaveAttribute(
      'aria-labelledby',
      'labelled-command',
    );
  });

  it('rejects conflicting or blank explicit ARIA names in development', () => {
    const conflicting = {
      'aria-label': 'Open account',
      'aria-labelledby': 'account-label',
    } as unknown as CardActionProps;
    const blank = { 'aria-label': '   ' } as CardActionProps;

    expect(() => render(<CardAction {...conflicting}>Open account</CardAction>)).toThrow(
      /either aria-label or aria-labelledby/,
    );
    expect(() => render(<CardAction {...blank}>Open account</CardAction>)).toThrow(
      /must not be blank/,
    );
  });

  it('diagnoses only directly inspectable invalid host content and image-only names', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <>
        <CardAction>
          <div>Invalid layout child</div>
          <span tabIndex={0}>Invalid tabbable child</span>
        </CardAction>
        <CardAction>
          <img alt="Account preview" src="/preview.png" />
        </CardAction>
      </>,
    );

    expect(warning).toHaveBeenCalledWith(
      expect.stringContaining('unsupported host content: div, [tabIndex]'),
    );
    expect(warning).toHaveBeenCalledWith(
      expect.stringContaining('image-only or icon-only content needs aria-label'),
    );
    warning.mockRestore();
  });

  it('uses native keyboard activation and native disabled suppression', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <>
        <CardAction onClick={onClick}>Enabled</CardAction>
        <CardAction disabled onClick={onClick}>Disabled</CardAction>
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

  it('keeps non-card-action APIs out of the public contract', () => {
    expectTypeOf<CardActionProps>().not.toHaveProperty('aria-pressed');
    expectTypeOf<CardActionProps>().not.toHaveProperty('aria-selected');
    expectTypeOf<CardActionProps>().not.toHaveProperty('href');
    expectTypeOf<CardActionProps>().not.toHaveProperty('shape');
    expectTypeOf<CardActionProps>().not.toHaveProperty('size');
    expectTypeOf<{
      'aria-label': string;
      'aria-labelledby': string;
      children: string;
    }>().not.toMatchTypeOf<CardActionProps>();
    expect(cardActionSource).not.toContain("'use client'");
    expect(cardActionSource).not.toContain('onKeyDown');
  });

  it('maps the documented shape, colors, state layers, elevation, and boundaries', () => {
    expect(cardActionCss).toContain('var(--md-sys-shape-corner-medium)');
    expect(cardActionCss).toContain('--md-sys-color-surface-container-highest');
    expect(cardActionCss).toContain('--md-sys-color-surface-container-low');
    expect(cardActionCss).toContain('--md-sys-color-surface');
    expect(cardActionCss).toContain('--md-sys-color-on-surface');
    expect(cardActionCss).toContain('--md-sys-color-outline-variant');
    expect(cardActionCss).toContain('--md-sys-color-outline) 12%');
    expect(cardActionCss).toContain('--md-sys-color-secondary');
    expect(cardActionCss).toContain('--md-sys-color-on-surface);\n}');
    expect(cardActionCss).toContain('--md-sys-state-hover-state-layer-opacity');
    expect(cardActionCss).toContain('--md-sys-state-focus-state-layer-opacity');
    expect(cardActionCss).toContain('--md-sys-state-pressed-state-layer-opacity');
    expect(cardActionCss).toContain('--md-web-elevation-shadow-level0, none');
    expect(cardActionCss).toContain('--md-web-elevation-shadow-level1, none');
    expect(cardActionCss).toContain('--md-web-elevation-shadow-level2, none');
    expect(cardActionCss).not.toContain('level3');
    expect(cardActionCss).toContain('@media (hover: hover) and (pointer: fine)');
    expect(cardActionCss).toContain('.md-card-action:not(:disabled):focus-visible');
    expect(cardActionCss).toContain('.md-card-action:disabled .md-card-action__visual::before');
  });

  it('renders on the server without a client boundary', () => {
    const html = renderToString(
      <CardAction className="server-card-action" variant="outlined">
        Server command
      </CardAction>,
    );

    expect(html).toContain('<button');
    expect(html).toContain('type="button"');
    expect(html).toContain('data-variant="outlined"');
    expect(html).toContain('class="md-card-action server-card-action"');
    expect(html).not.toContain('use client');
  });
});
