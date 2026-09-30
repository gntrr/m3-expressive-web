import {
  Children,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
} from 'react';

import { isCardDevelopmentBuild } from './card-development.js';

export const CARD_ACTION_VARIANTS = ['filled', 'elevated', 'outlined'] as const;

export type CardActionVariant = (typeof CARD_ACTION_VARIANTS)[number];

type CardActionAccessibleName =
  | { 'aria-label'?: never; 'aria-labelledby'?: never }
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

export type CardActionProps = CardActionAccessibleName &
  Omit<
    ComponentPropsWithoutRef<'button'>,
    | 'aria-checked'
    | 'aria-label'
    | 'aria-labelledby'
    | 'aria-pressed'
    | 'aria-selected'
    | 'children'
  > & {
    children: ReactNode;
    ref?: Ref<HTMLButtonElement>;
    variant?: CardActionVariant;
  };

const INVALID_HOST_ELEMENTS = new Set([
  'a',
  'article',
  'button',
  'details',
  'div',
  'fieldset',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'input',
  'label',
  'li',
  'ol',
  'p',
  'section',
  'select',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'tr',
  'ul',
]);

type CardActionChildProps = {
  children?: ReactNode;
  contentEditable?: boolean | 'true' | 'false';
  tabIndex?: number | string;
};

function hasNonEmptyValue(value: string | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function isNonNegativeTabIndex(value: number | string | undefined): boolean {
  return value !== undefined && Number(value) >= 0;
}

function inspectChildren(
  children: ReactNode,
  invalidElements: Set<string>,
): { hasMediaOnlyContent: boolean; hasOpaqueContent: boolean; hasText: boolean } {
  let hasMediaOnlyContent = false;
  let hasOpaqueContent = false;
  let hasText = false;

  function inspect(node: ReactNode): void {
    if (typeof node === 'string') {
      hasText ||= node.trim().length > 0;
      return;
    }

    if (typeof node === 'number') {
      hasText = true;
      return;
    }

    if (!isValidElement<CardActionChildProps>(node)) return;

    if (typeof node.type !== 'string') {
      hasOpaqueContent = true;
      return;
    }

    const { children: nestedChildren, contentEditable, tabIndex } = node.props;
    if (INVALID_HOST_ELEMENTS.has(node.type)) invalidElements.add(node.type);
    if (isNonNegativeTabIndex(tabIndex)) invalidElements.add('[tabIndex]');
    if (contentEditable === true || contentEditable === 'true') {
      invalidElements.add('[contentEditable]');
    }

    if (node.type === 'img' || node.type === 'svg') {
      hasMediaOnlyContent = true;
    }

    Children.forEach(nestedChildren, inspect);
  }

  Children.forEach(children, inspect);
  return { hasMediaOnlyContent, hasOpaqueContent, hasText };
}

function validateCardAction(
  ariaLabel: string | undefined,
  ariaLabelledby: string | undefined,
  children: ReactNode,
): void {
  if (!isCardDevelopmentBuild()) return;

  const hasAriaLabel = ariaLabel !== undefined;
  const hasAriaLabelledby = ariaLabelledby !== undefined;

  if (hasAriaLabel && hasAriaLabelledby) {
    throw new Error(
      'CardAction accepts either aria-label or aria-labelledby, not both.',
    );
  }

  if (hasAriaLabel && !hasNonEmptyValue(ariaLabel)) {
    throw new Error('CardAction aria-label must not be blank or whitespace-only.');
  }

  if (hasAriaLabelledby && !hasNonEmptyValue(ariaLabelledby)) {
    throw new Error('CardAction aria-labelledby must not be blank or whitespace-only.');
  }

  const invalidElements = new Set<string>();
  const { hasMediaOnlyContent, hasOpaqueContent, hasText } = inspectChildren(
    children,
    invalidElements,
  );

  if (invalidElements.size > 0) {
    console.warn(
      `CardAction children must be non-interactive phrasing content. Detected unsupported host content: ${[...invalidElements].join(', ')}. Custom components cannot be verified at runtime.`,
    );
  }

  if (
    !hasAriaLabel &&
    !hasAriaLabelledby &&
    !hasText &&
    hasMediaOnlyContent &&
    !hasOpaqueContent
  ) {
    console.warn(
      'CardAction with image-only or icon-only content needs aria-label or aria-labelledby; do not rely on image alt text or an SVG title for its command name.',
    );
  }
}

/** A native whole-card command for non-interactive phrasing content. */
export function CardAction({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children,
  className,
  ref,
  type = 'button',
  variant = 'filled',
  ...buttonProps
}: CardActionProps) {
  validateCardAction(ariaLabel, ariaLabelledby, children);
  const cardActionClassName = className
    ? `md-card-action ${className}`
    : 'md-card-action';

  return (
    <button
      {...buttonProps}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      className={cardActionClassName}
      data-variant={variant}
      ref={ref}
      type={type}
    >
      <span className="md-card-action__visual">
        <span className="md-card-action__content">{children}</span>
      </span>
    </button>
  );
}
