import { createRef } from 'react';
import { renderToString } from 'react-dom/server';

import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  BUTTON_SHAPES,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  Button,
} from './Button.js';

afterEach(cleanup);

describe('Button', () => {
  it('renders a native button with stable defaults', () => {
    render(<Button>Continue</Button>);

    const button = screen.getByRole('button', { name: 'Continue' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-variant', 'filled');
    expect(button).toHaveAttribute('data-size', 'small');
    expect(button).toHaveAttribute('data-shape', 'round');
  });

  it.each(BUTTON_VARIANTS)('renders the %s variant', (variant) => {
    render(<Button variant={variant}>{variant}</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', variant);
  });

  it.each(BUTTON_SIZES)('renders the %s size', (size) => {
    render(<Button size={size}>{size}</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-size', size);
  });

  it.each(BUTTON_SHAPES)('renders the %s shape', (shape) => {
    render(<Button shape={shape}>{shape}</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-shape', shape);
  });

  it('orders decorative icons around the accessible label', () => {
    const { container } = render(
      <Button
        leadingIcon={<svg data-testid="leading" />}
        trailingIcon={<svg data-testid="trailing" />}
      >
        Send
      </Button>,
    );

    expect(screen.getByRole('button')).toHaveAccessibleName('Send');
    expect(screen.getByTestId('leading').parentElement).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.getByTestId('trailing').parentElement).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(
      Array.from(container.querySelector('button')!.children).map(
        (element) => element.className,
      ),
    ).toEqual([
      'md-button__icon md-button__icon--leading',
      'md-button__label',
      'md-button__icon md-button__icon--trailing',
    ]);
  });

  it('forwards native attributes, class, style, and ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button
        aria-describedby="button-help"
        className="custom-button"
        data-testid="button"
        ref={ref}
        style={{ inlineSize: '12rem' }}
      >
        Save
      </Button>,
    );

    const button = screen.getByTestId('button');
    expect(button).toHaveClass('md-button', 'custom-button');
    expect(button).toHaveAttribute('aria-describedby', 'button-help');
    expect(button.style.inlineSize).toBe('12rem');
    expect(ref.current).toBe(button);
  });

  it('supports native keyboard activation and disabled behavior', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <>
        <Button onClick={onClick}>Enabled</Button>
        <Button disabled onClick={onClick}>
          Disabled
        </Button>
      </>,
    );

    const enabled = screen.getByRole('button', { name: 'Enabled' });
    enabled.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    await user.click(screen.getByRole('button', { name: 'Disabled' }));
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('does not submit a form unless the consumer opts into submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button>Neutral action</Button>
        <Button type="submit">Submit action</Button>
      </form>,
    );

    await user.click(screen.getByRole('button', { name: 'Neutral action' }));
    expect(onSubmit).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Submit action' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders on the server without client-only markup', () => {
    const html = renderToString(<Button variant="outlined">Server action</Button>);
    expect(html).toContain('<button');
    expect(html).toContain('Server action');
    expect(html).toContain('data-variant="outlined"');
  });
});
