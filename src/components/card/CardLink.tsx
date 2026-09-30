import {
  Children,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
} from 'react';

import { isCardDevelopmentBuild } from './card-development.js';

export const CARD_LINK_VARIANTS = ['filled', 'elevated', 'outlined'] as const;

export type CardLinkVariant = (typeof CARD_LINK_VARIANTS)[number];

type CardLinkAccessibleName =
  | { 'aria-label'?: never; 'aria-labelledby'?: never }
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

export type CardLinkProps = CardLinkAccessibleName &
  Omit<
    ComponentPropsWithoutRef<'a'>,
    | 'aria-checked'
    | 'aria-disabled'
    | 'aria-label'
    | 'aria-labelledby'
    | 'aria-pressed'
    | 'aria-selected'
    | 'children'
    | 'disabled'
    | 'href'
  > & {
    children: ReactNode;
    href: string;
    ref?: Ref<HTMLAnchorElement>;
    variant?: CardLinkVariant;
  };

const INTERACTIVE_HOST_ELEMENTS = new Set([
  'a',
  'area',
  'audio',
  'button',
  'details',
  'embed',
  'iframe',
  'input',
  'label',
  'object',
  'select',
  'summary',
  'textarea',
  'video',
]);

const INTERACTIVE_ROLES = new Set([
  'button',
  'checkbox',
  'combobox',
  'link',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'radio',
  'searchbox',
  'slider',
  'spinbutton',
  'switch',
  'tab',
  'textbox',
  'treeitem',
]);

type CardLinkChildProps = {
  children?: ReactNode;
  contentEditable?: boolean | 'true' | 'false';
  controls?: boolean;
  role?: string;
  tabIndex?: number | string;
};

function hasNonEmptyValue(value: string | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function inspectChildren(children: ReactNode, invalidContent: Set<string>): void {
  function inspect(node: ReactNode): void {
    if (!isValidElement<CardLinkChildProps>(node)) return;

    if (typeof node.type !== 'string') return;

    const {
      children: nestedChildren,
      contentEditable,
      controls,
      role,
      tabIndex,
    } = node.props;

    if (INTERACTIVE_HOST_ELEMENTS.has(node.type)) {
      if (
        node.type !== 'audio' &&
        node.type !== 'video'
      ) {
        invalidContent.add(node.type);
      } else if (controls) {
        invalidContent.add(`${node.type}[controls]`);
      }
    }
    if (tabIndex !== undefined) invalidContent.add('[tabIndex]');
    if (contentEditable === true || contentEditable === 'true') {
      invalidContent.add('[contentEditable]');
    }
    if (role !== undefined && INTERACTIVE_ROLES.has(role.trim().toLowerCase())) {
      invalidContent.add(`[role=${role}]`);
    }

    Children.forEach(nestedChildren, inspect);
  }

  Children.forEach(children, inspect);
}

function validateCardLink(
  href: string,
  ariaLabel: string | undefined,
  ariaLabelledby: string | undefined,
  children: ReactNode,
): void {
  if (!isCardDevelopmentBuild()) return;

  if (!hasNonEmptyValue(href)) {
    throw new Error('CardLink href must not be blank or whitespace-only.');
  }

  const hasAriaLabel = ariaLabel !== undefined;
  const hasAriaLabelledby = ariaLabelledby !== undefined;
  if (hasAriaLabel && hasAriaLabelledby) {
    throw new Error(
      'CardLink accepts either aria-label or aria-labelledby, not both.',
    );
  }
  if (hasAriaLabel && !hasNonEmptyValue(ariaLabel)) {
    throw new Error('CardLink aria-label must not be blank or whitespace-only.');
  }
  if (hasAriaLabelledby && !hasNonEmptyValue(ariaLabelledby)) {
    throw new Error('CardLink aria-labelledby must not be blank or whitespace-only.');
  }

  const invalidContent = new Set<string>();
  inspectChildren(children, invalidContent);
  if (invalidContent.size > 0) {
    console.warn(
      `CardLink cannot contain interactive or tabindex descendants. Detected unsupported host content: ${[...invalidContent].join(', ')}. Custom components cannot be verified at runtime.`,
    );
  }
}

/** A native whole-card hyperlink for one navigation destination. */
export function CardLink({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children,
  className,
  href,
  ref,
  variant = 'filled',
  ...anchorProps
}: CardLinkProps) {
  validateCardLink(href, ariaLabel, ariaLabelledby, children);
  const cardLinkClassName = className
    ? `md-card-link ${className}`
    : 'md-card-link';

  return (
    <a
      {...anchorProps}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      className={cardLinkClassName}
      data-variant={variant}
      href={href}
      ref={ref}
    >
      <div className="md-card-link__visual">
        <div className="md-card-link__content">{children}</div>
      </div>
    </a>
  );
}
