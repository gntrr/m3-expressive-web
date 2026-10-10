import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';

import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';

import {
  InputChip,
  type InputChipProps,
  type InputChipRemoveButtonProps,
  type InputChipRootProps,
} from './index.js';

const inputChipCss = readFileSync(
  path.join(process.cwd(), 'src/components/chip/input-chip.css'),
  'utf8',
);

function RemoveIcon() {
  return <svg data-testid="remove-icon"><title>Remove visual</title></svg>;
}

afterEach(cleanup);

describe('InputChip', () => {
  it('renders a neutral root with a remove-only static body by default', () => {
    render(
      <InputChip
        label="Mina Chen"
        onRemove={() => undefined}
        removeIcon={<RemoveIcon />}
        rootProps={{ 'data-testid': 'chip' }}
      />,
    );

    const root = screen.getByTestId('chip');
    const remove = screen.getByRole('button', { name: 'Remove Mina Chen' });
    expect(root.tagName).toBe('SPAN');
    expect(root).toHaveClass('md-input-chip');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('tabindex');
    expect(root).not.toHaveAttribute('onclick');
    expect(remove).toHaveAttribute('type', 'button');
    expect(root.querySelector('.md-input-chip__body')).toBeNull();
    expect(root.querySelector('.md-input-chip__body-static')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('renders sibling body and remove buttons only when a body action exists', () => {
    render(
      <InputChip
        label="Mina Chen"
        onClick={() => undefined}
        onRemove={() => undefined}
        removeIcon={<RemoveIcon />}
        rootProps={{ 'data-testid': 'chip' }}
      />,
    );

    const root = screen.getByTestId('chip');
    const body = screen.getByRole('button', { name: 'Mina Chen' });
    const remove = screen.getByRole('button', { name: 'Remove Mina Chen' });
    expect(body.parentElement).toBe(root);
    expect(remove.parentElement).toBe(root);
    expect(body.contains(remove)).toBe(false);
    expect(remove.contains(body)).toBe(false);
    expect(root.querySelectorAll('button')).toHaveLength(2);
  });

  it('uses native button types while keeping removal permanently non-submitting', () => {
    const { rerender } = render(
      <InputChip
        bodyButtonProps={{ type: 'submit' }}
        label="Save recipient"
        onClick={() => undefined}
        onRemove={() => undefined}
        removeIcon={<RemoveIcon />}
      />,
    );
    expect(screen.getByRole('button', { name: 'Save recipient' })).toHaveAttribute(
      'type',
      'submit',
    );

    rerender(
      <InputChip
        bodyButtonProps={{ type: 'reset' }}
        label="Save recipient"
        onClick={() => undefined}
        onRemove={() => undefined}
        removeButtonProps={{ type: 'submit' } as unknown as InputChipRemoveButtonProps}
        removeIcon={<RemoveIcon />}
      />,
    );
    expect(screen.getByRole('button', { name: 'Save recipient' })).toHaveAttribute(
      'type',
      'reset',
    );
    expect(screen.getByRole('button', { name: 'Remove Save recipient' })).toHaveAttribute(
      'type',
      'button',
    );
  });

  it('routes root, body, and remove props and refs to their exact targets', () => {
    const rootRef = createRef<HTMLSpanElement>();
    const bodyRef = createRef<HTMLButtonElement>();
    const removeRef = createRef<HTMLButtonElement>();
    render(
      <InputChip
        bodyButtonProps={{
          className: 'custom-body',
          'data-testid': 'body',
          name: 'recipient',
          value: 'mina',
        }}
        bodyButtonRef={bodyRef}
        label="Mina Chen"
        onClick={() => undefined}
        onRemove={() => undefined}
        removeButtonProps={{ className: 'custom-remove', 'data-testid': 'remove' }}
        removeButtonRef={removeRef}
        removeIcon={<RemoveIcon />}
        rootProps={{
          className: 'custom-root',
          'data-testid': 'root',
          dir: 'rtl',
          id: 'recipient-chip',
          lang: 'id',
          style: { inlineSize: '12rem' },
          title: 'Supplemental',
        }}
        rootRef={rootRef}
      />,
    );

    const root = screen.getByTestId('root');
    const body = screen.getByTestId('body');
    const remove = screen.getByTestId('remove');
    expect(root).toHaveClass('md-input-chip', 'custom-root');
    expect(root).toHaveAttribute('dir', 'rtl');
    expect(root).toHaveAttribute('id', 'recipient-chip');
    expect(root).toHaveAttribute('lang', 'id');
    expect(root).toHaveAttribute('title', 'Supplemental');
    expect(root.style.inlineSize).toBe('12rem');
    expect(body).toHaveClass('md-input-chip__body', 'custom-body');
    expect(body).toHaveAttribute('name', 'recipient');
    expect(body).toHaveAttribute('value', 'mina');
    expect(remove).toHaveClass('md-input-chip__remove', 'custom-remove');
    expect(rootRef.current).toBe(root);
    expect(bodyRef.current).toBe(body);
    expect(removeRef.current).toBe(remove);
  });

  it('uses visible and allowed explicit body accessible names', () => {
    const { rerender } = render(
      <InputChip
        label="Mina Chen"
        onClick={() => undefined}
        onRemove={() => undefined}
        removeIcon={<RemoveIcon />}
      />,
    );
    expect(screen.getByRole('button', { name: 'Mina Chen' })).toBeVisible();

    rerender(
      <InputChip
        aria-label="Open recipient details"
        label="Mina Chen"
        onClick={() => undefined}
        onRemove={() => undefined}
        removeIcon={<RemoveIcon />}
      />,
    );
    expect(screen.getByRole('button', { name: 'Open recipient details' })).toBeVisible();

    rerender(
      <>
        <span id="recipient-label">Open recipient</span>
        <InputChip
          aria-labelledby="recipient-label"
          label="Mina Chen"
          onClick={() => undefined}
          onRemove={() => undefined}
          removeIcon={<RemoveIcon />}
        />
      </>,
    );
    expect(screen.getByRole('button', { name: 'Open recipient' })).toBeVisible();
  });

  it('validates labels, naming, availability, and leading visual exclusivity in development', () => {
    const defaults = { onRemove: () => undefined, removeIcon: <RemoveIcon /> };
    const conflictingNames = {
      'aria-label': 'One',
      'aria-labelledby': 'two',
      label: 'Mina',
      onClick: () => undefined,
      ...defaults,
    } as unknown as InputChipProps;

    expect(() => render(<InputChip {...conflictingNames} />)).toThrow(
      'either aria-label or aria-labelledby',
    );
    expect(() => render(<InputChip label="  " {...defaults} />)).toThrow('label must not be blank');
    expect(() => render(<InputChip label="Mina" removeLabel="  " {...defaults} />)).toThrow(
      'removeLabel must not be blank',
    );
    expect(() => render(<InputChip bodyDisabled label="Mina" {...defaults} />)).toThrow(
      'bodyDisabled requires an onClick',
    );
    expect(() => render(<InputChip aria-label="Open" label="Mina" {...defaults} />)).toThrow(
      'require an onClick body action',
    );
    expect(() => render(<InputChip aria-label=" " label="Mina" onClick={() => undefined} {...defaults} />)).toThrow(
      'aria-label must not be blank',
    );
    const conflictingVisuals = {
      avatar: <img alt="Mina" src="avatar.png" />,
      label: 'Mina',
      leadingIcon: <svg />,
      onClick: () => undefined,
      ...defaults,
    } as unknown as InputChipProps;
    expect(() => render(<InputChip {...conflictingVisuals} />)).toThrow(
      'either avatar or leadingIcon',
    );
  });

  it('keeps supplied visuals decorative and names removal deterministically', () => {
    const { rerender } = render(
      <InputChip
        avatar={<img alt="Competing avatar name" data-testid="avatar" src="avatar.png" />}
        label="  Mina  Chen "
        onClick={() => undefined}
        onRemove={() => undefined}
        removeIcon={<RemoveIcon />}
      />,
    );
    expect(screen.getByRole('button', { name: 'Mina Chen' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Remove Mina Chen' })).toHaveAttribute(
      'aria-label',
      'Remove Mina  Chen',
    );
    expect(screen.getByTestId('avatar').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('remove-icon').parentElement).toHaveAttribute(
      'aria-hidden',
      'true',
    );

    rerender(
      <InputChip
        label="Mina Chen"
        onRemove={() => undefined}
        removeIcon={<RemoveIcon />}
        removeLabel="Delete recipient"
      />,
    );
    expect(screen.getByRole('button', { name: 'Delete recipient' })).toBeVisible();
  });

  it('isolates callbacks while preserving normal bubbling and native keyboard activation', async () => {
    const user = userEvent.setup();
    const onBody = vi.fn();
    const onRemove = vi.fn();
    const onAncestor = vi.fn();
    render(
      <div onClick={onAncestor}>
        <InputChip
          label="Mina Chen"
          onClick={onBody}
          onRemove={onRemove}
          removeIcon={<RemoveIcon />}
        />
      </div>,
    );

    const body = screen.getByRole('button', { name: 'Mina Chen' });
    const remove = screen.getByRole('button', { name: 'Remove Mina Chen' });
    await user.click(body);
    expect(onBody).toHaveBeenCalledTimes(1);
    expect(onRemove).not.toHaveBeenCalled();
    await user.click(remove);
    expect(onBody).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onAncestor).toHaveBeenCalledTimes(2);

    body.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onBody).toHaveBeenCalledTimes(3);
  });

  it('keeps removal available when only the body command is disabled', async () => {
    const user = userEvent.setup();
    const onBody = vi.fn();
    const onRemove = vi.fn();
    render(
      <InputChip
        bodyDisabled
        label="Mina Chen"
        onClick={onBody}
        onRemove={onRemove}
        removeIcon={<RemoveIcon />}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Mina Chen' }));
    await user.click(screen.getByRole('button', { name: 'Remove Mina Chen' }));
    expect(onBody).not.toHaveBeenCalled();
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Mina Chen' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Remove Mina Chen' })).not.toBeDisabled();
  });

  it('retains native body then remove tab order and has no persistent selection API', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button>Before</button>
        <InputChip
          label="Mina Chen"
          onClick={() => undefined}
          onRemove={() => undefined}
          removeIcon={<RemoveIcon />}
        />
      </>,
    );
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Mina Chen' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Remove Mina Chen' })).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Mina Chen' })).not.toHaveAttribute(
      'aria-pressed',
    );
  });

  it('renders on the server without client-only runtime behavior', () => {
    const html = renderToString(
      <InputChip
        label="Mina Chen"
        onRemove={() => undefined}
        removeIcon={<RemoveIcon />}
      />,
    );
    expect(html).toContain('<span');
    expect(html).toContain('md-input-chip__body-static');
    expect(html).toContain('aria-label="Remove Mina Chen"');
  });

  it('keeps the public boundary intentionally narrow', () => {
    expectTypeOf<InputChipProps>().not.toHaveProperty('selected');
    expectTypeOf<InputChipProps>().not.toHaveProperty('aria-pressed');
    expectTypeOf<InputChipProps>().not.toHaveProperty('treatment');
    expectTypeOf<InputChipProps>().not.toHaveProperty('href');
    expectTypeOf<InputChipProps>().not.toHaveProperty('ref');
    expectTypeOf<InputChipRootProps>().not.toHaveProperty('role');
    expectTypeOf<InputChipRootProps>().not.toHaveProperty('tabIndex');
  });

  it('uses documented foundation geometry, region-local states, and forced-color fallbacks', () => {
    expect(inputChipCss).toContain('min-block-size: 32px');
    expect(inputChipCss).toContain('flex: 0 0 32px');
    expect(inputChipCss).toContain('block-size: 18px');
    expect(inputChipCss).toContain('block-size: 24px');
    expect(inputChipCss).toContain('gap: 8px');
    expect(inputChipCss).toContain('var(--md-sys-shape-corner-small)');
    expect(inputChipCss).toContain('var(--md-sys-typescale-label-large-font)');
    expect(inputChipCss).toContain('var(--md-web-elevation-shadow-level0)');
    expect(inputChipCss).toContain('var(--md-sys-color-on-surface-variant)');
    expect(inputChipCss).toContain('var(--md-sys-color-outline-variant)');
    expect(inputChipCss).toContain('var(--md-sys-state-hover-state-layer-opacity)');
    expect(inputChipCss).toContain('@media (hover: hover) and (pointer: fine)');
    expect(inputChipCss).toContain('outline: 2px solid var(--md-sys-color-secondary)');
    expect(inputChipCss).toContain('@media (forced-colors: active)');
    expect(inputChipCss).not.toContain('transition:');
    expect(inputChipCss).not.toContain('animation:');
  });
});
