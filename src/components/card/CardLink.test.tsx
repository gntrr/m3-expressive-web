import { readFileSync } from 'node:fs';
import path from 'node:path';

import { createRef } from 'react';
import { renderToString } from 'react-dom/server';

import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';

import {
  CARD_LINK_VARIANTS,
  CardLink,
  type CardLinkProps,
} from './CardLink.js';

const cardLinkCss = readFileSync(
  path.join(process.cwd(), 'src/components/card/card-link.css'),
  'utf8',
);
const cardLinkSource = readFileSync(
  path.join(process.cwd(), 'src/components/card/CardLink.tsx'),
  'utf8',
);
const cardLinkSpec = readFileSync(
  path.join(process.cwd(), 'src/components/card/CARD_LINK_SPEC.md'),
  'utf8',
);

afterEach(cleanup);

describe('CardLink', () => {
  it('renders one native anchor with a stable filled default', () => {
    render(<CardLink data-testid="card-link" href="/products/42">Product</CardLink>);

    const cardLink = screen.getByTestId('card-link');
    expect(cardLink.tagName).toBe('A');
    expect(cardLink).toHaveAttribute('href', '/products/42');
    expect(cardLink).toHaveAttribute('data-variant', 'filled');
    expect(cardLink).toHaveClass('md-card-link');
    expect(cardLink).not.toHaveAttribute('role');
    expect(cardLink).not.toHaveAttribute('aria-pressed');
    expect(cardLink).not.toHaveAttribute('aria-selected');
  });

  it.each(CARD_LINK_VARIANTS)('renders the %s variant', (variant) => {
    render(<CardLink href={`/${variant}`} variant={variant}>{variant}</CardLink>);

    expect(screen.getByRole('link', { name: variant })).toHaveAttribute(
      'data-variant',
      variant,
    );
  });

  it('forwards native anchor props, className, style, and ref', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <CardLink
        aria-describedby="card-link-help"
        className="custom-card-link"
        data-testid="card-link"
        download="product-guide.pdf"
        href="/guides/product"
        hrefLang="en"
        ref={ref}
        referrerPolicy="no-referrer"
        rel="noopener"
        style={{ marginInlineStart: '1rem' }}
        target="_blank"
        type="application/pdf"
      >
        Product guide
      </CardLink>,
    );

    const cardLink = screen.getByTestId('card-link');
    expect(cardLink).toHaveClass('md-card-link', 'custom-card-link');
    expect(cardLink).toHaveAttribute('aria-describedby', 'card-link-help');
    expect(cardLink).toHaveAttribute('download', 'product-guide.pdf');
    expect(cardLink).toHaveAttribute('hreflang', 'en');
    expect(cardLink).toHaveAttribute('referrerpolicy', 'no-referrer');
    expect(cardLink).toHaveAttribute('rel', 'noopener');
    expect(cardLink).toHaveAttribute('target', '_blank');
    expect(cardLink).toHaveAttribute('type', 'application/pdf');
    expect(cardLink.style.marginInlineStart).toBe('1rem');
    expect(ref.current).toBe(cardLink);
  });

  it('uses visible content, aria-label, or aria-labelledby for the link name', () => {
    render(
      <>
        <CardLink href="/visible"><h2>Visible destination</h2></CardLink>
        <CardLink aria-label="Explicit destination" href="/explicit">
          <img alt="" src="/preview.png" />
        </CardLink>
        <span id="link-label">Referenced destination</span>
        <CardLink aria-labelledby="link-label" href="/referenced">
          <img alt="" src="/preview.png" />
        </CardLink>
      </>,
    );

    expect(screen.getByRole('link', { name: 'Visible destination' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Explicit destination' })).toHaveAttribute(
      'aria-label',
      'Explicit destination',
    );
    expect(screen.getByRole('link', { name: 'Referenced destination' })).toHaveAttribute(
      'aria-labelledby',
      'link-label',
    );
  });

  it('rejects blank hrefs and conflicting or blank explicit ARIA names in development', () => {
    const blankHref = { href: '   ' } as CardLinkProps;
    const blankLabel = { href: '/products', 'aria-label': '   ' } as CardLinkProps;
    const conflicting = {
      href: '/products',
      'aria-label': 'Product',
      'aria-labelledby': 'product-label',
    } as unknown as CardLinkProps;

    expect(() => render(<CardLink {...blankHref}>Product</CardLink>)).toThrow(
      /href must not be blank/,
    );
    expect(() => render(<CardLink {...blankLabel}>Product</CardLink>)).toThrow(
      /aria-label must not be blank/,
    );
    expect(() => render(<CardLink {...conflicting}>Product</CardLink>)).toThrow(
      /either aria-label or aria-labelledby/,
    );
  });

  it('allows rich flow content and diagnoses only inspectable invalid descendants', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <>
        <CardLink href="/rich">
          <section>
            <h2>Rich destination</h2>
            <p>Supporting paragraph.</p>
            <ul><li>Included detail</li></ul>
          </section>
        </CardLink>
        <CardLink href="/invalid">
          <button type="button">Invalid nested control</button>
          <span contentEditable tabIndex={-1}>Invalid descendant</span>
        </CardLink>
      </>,
    );

    expect(screen.getByRole('heading', { name: 'Rich destination' })).toBeTruthy();
    expect(warning).toHaveBeenCalledWith(
      expect.stringContaining('unsupported host content: button, [tabIndex], [contentEditable]'),
    );
    warning.mockRestore();
  });

  it('uses native Enter activation without adding Space activation', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <CardLink href="#native-link" onClick={onClick}>
        Native link
      </CardLink>,
    );

    const link = screen.getByRole('link', { name: 'Native link' });
    link.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(cardLinkSource).not.toContain('onKeyDown');
    expect(cardLinkSource).not.toContain('preventDefault');
  });

  it('keeps disabled, selection, and polymorphic APIs out of the contract', () => {
    expectTypeOf<CardLinkProps>().not.toHaveProperty('disabled');
    expectTypeOf<CardLinkProps>().not.toHaveProperty('aria-disabled');
    expectTypeOf<CardLinkProps>().not.toHaveProperty('aria-pressed');
    expectTypeOf<CardLinkProps>().not.toHaveProperty('aria-selected');
    expectTypeOf<CardLinkProps>().not.toHaveProperty('pressed');
    expectTypeOf<CardLinkProps>().not.toHaveProperty('selected');
    expectTypeOf<CardLinkProps>().not.toHaveProperty('shape');
    expectTypeOf<CardLinkProps>().not.toHaveProperty('size');
    expectTypeOf<{ children: string }>().not.toMatchTypeOf<CardLinkProps>();
    expectTypeOf<{
      'aria-label': string;
      'aria-labelledby': string;
      children: string;
      href: string;
    }>().not.toMatchTypeOf<CardLinkProps>();
  });

  it('maps the documented shape, colors, layers, elevation, and focus recipe', () => {
    expect(cardLinkCss).toContain('var(--md-sys-shape-corner-medium)');
    expect(cardLinkCss).toContain('--md-sys-color-surface-container-highest');
    expect(cardLinkCss).toContain('--md-sys-color-surface-container-low');
    expect(cardLinkCss).toContain('--md-sys-color-surface');
    expect(cardLinkCss).toContain('--md-sys-color-on-surface');
    expect(cardLinkCss).toContain('--md-sys-color-outline-variant');
    expect(cardLinkCss).toContain('--md-sys-color-secondary');
    expect(cardLinkCss).toContain('--md-sys-state-hover-state-layer-opacity');
    expect(cardLinkCss).toContain('--md-sys-state-focus-state-layer-opacity');
    expect(cardLinkCss).toContain('--md-sys-state-pressed-state-layer-opacity');
    expect(cardLinkCss).toContain('--md-web-elevation-shadow-level0, none');
    expect(cardLinkCss).toContain('--md-web-elevation-shadow-level1, none');
    expect(cardLinkCss).toContain('--md-web-elevation-shadow-level2, none');
    expect(cardLinkCss).not.toContain('level3');
    expect(cardLinkCss).not.toContain(':visited');
    expect(cardLinkCss).toContain('@media (hover: hover) and (pointer: fine)');
    expect(cardLinkCss).toContain('.md-card-link:focus-visible');
    expect(cardLinkSpec).toContain('provisional translated recipe');
  });

  it('renders on the server without a client boundary', () => {
    const html = renderToString(
      <CardLink className="server-card-link" href="/server" variant="outlined">
        <h2>Server destination</h2>
      </CardLink>,
    );

    expect(html).toContain('<a');
    expect(html).toContain('href="/server"');
    expect(html).toContain('data-variant="outlined"');
    expect(html).toContain('class="md-card-link server-card-link"');
    expect(html).not.toContain('use client');
  });
});
