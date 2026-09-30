import { readFileSync } from 'node:fs';
import path from 'node:path';

import { createRef } from 'react';
import { renderToString } from 'react-dom/server';

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, expectTypeOf, it } from 'vitest';

import { Button } from '../button/Button.js';
import { CARD_VARIANTS, Card, type CardProps } from './Card.js';

const cardCss = readFileSync(
  path.join(process.cwd(), 'src/components/card/card.css'),
  'utf8',
);
const cardSource = readFileSync(
  path.join(process.cwd(), 'src/components/card/Card.tsx'),
  'utf8',
);

afterEach(cleanup);

describe('Card', () => {
  it('renders a neutral div with the stable filled default', () => {
    render(<Card data-testid="card">Content</Card>);

    const card = screen.getByTestId('card');
    expect(card.tagName).toBe('DIV');
    expect(card).toHaveClass('md-card');
    expect(card).toHaveAttribute('data-variant', 'filled');
    expect(card).not.toHaveAttribute('role');
    expect(card).not.toHaveAttribute('tabindex');

    card.focus();
    expect(document.activeElement).not.toBe(card);
  });

  it.each(CARD_VARIANTS)('renders the %s variant', (variant) => {
    render(<Card data-testid="card" variant={variant} />);

    expect(screen.getByTestId('card')).toHaveAttribute('data-variant', variant);
  });

  it('forwards safe div props, className, style, and ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card
        aria-describedby="card-description"
        className="custom-card"
        data-testid="card"
        id="account-card"
        ref={ref}
        style={{ marginInlineStart: '1rem' }}
      >
        Content
      </Card>,
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('md-card', 'custom-card');
    expect(card).toHaveAttribute('aria-describedby', 'card-description');
    expect(card).toHaveAttribute('id', 'account-card');
    expect(card.style.marginInlineStart).toBe('1rem');
    expect(ref.current).toBe(card);
  });

  it('allows arbitrary flow content and independent nested controls', () => {
    render(
      <Card data-testid="card">
        <img alt="Product preview" src="/preview.png" />
        <h2>Product title</h2>
        <p>Supporting text</p>
        <a href="/products/1">Details</a>
        <Button>Save</Button>
      </Card>,
    );

    const card = screen.getByTestId('card');
    expect(screen.getByRole('img', { name: 'Product preview' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Product title' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Details' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy();
    expect(card.querySelector('a')).toBeTruthy();
    expect(card.querySelector('button')).toBeTruthy();
  });

  it('keeps interaction and disabled APIs out of the Card contract', () => {
    expectTypeOf<CardProps>().not.toHaveProperty('disabled');
    expect(cardSource).not.toContain('onClick');
    expect(cardSource).not.toContain('tabIndex');
    expect(cardSource).not.toContain('role=');
    expect(cardCss).not.toContain('cursor:');
    expect(cardCss).not.toContain(':hover');
    expect(cardCss).not.toContain(':focus');
    expect(cardCss).not.toContain(':active');
  });

  it('uses the documented semantic shape, color, outline, and resting elevation', () => {
    expect(cardCss).toContain('border-radius: var(--md-sys-shape-corner-medium);');
    expect(cardCss).toContain('--md-sys-color-surface-container-highest');
    expect(cardCss).toContain('--md-sys-color-surface-container-low');
    expect(cardCss).toContain('--md-sys-color-surface');
    expect(cardCss).toContain('--md-sys-color-on-surface');
    expect(cardCss).toContain('--md-sys-color-outline-variant');
    expect(cardCss).not.toContain('--md-sys-color-surface-variant');
    expect(cardCss).not.toContain('--md-sys-color-on-surface-variant');
    expect(cardCss).toContain('--_card-outline-width: 1px;');
    expect(cardCss).toContain('--md-web-elevation-shadow-level0, none');
    expect(cardCss).toContain('--md-web-elevation-shadow-level1, none');
    expect(cardCss).not.toContain('level2');
    expect(cardCss).not.toContain('level3');
  });

  it('renders on the server without client-only markup', () => {
    const html = renderToString(
      <Card className="server-card" data-testid="card" variant="outlined">
        <h2>Server card</h2>
      </Card>,
    );

    expect(html).toContain('<div');
    expect(html).toContain('data-variant="outlined"');
    expect(html).toContain('class="md-card server-card"');
    expect(html).not.toContain('use client');
  });
});
