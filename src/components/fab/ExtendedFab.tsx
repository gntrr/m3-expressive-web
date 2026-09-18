import type { ComponentPropsWithoutRef, ReactElement, Ref } from 'react';

import {
  FabIcon,
  type FabSize,
  type FabVariant,
} from './fab-shared.js';

export type ExtendedFabAccessibleNameOverride =
  | { 'aria-label'?: never; 'aria-labelledby'?: never }
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

export type ExtendedFabProps = ExtendedFabAccessibleNameOverride &
  Omit<
    ComponentPropsWithoutRef<'button'>,
    'aria-label' | 'aria-labelledby' | 'aria-pressed' | 'children'
  > & {
    children: string;
    leadingIcon?: ReactElement;
    ref?: Ref<HTMLButtonElement>;
    size?: FabSize;
    variant?: FabVariant;
  };

function hasText(value: string | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateExtendedFabContent(
  label: string,
  ariaLabel: string | undefined,
  ariaLabelledby: string | undefined,
): void {
  if (!hasText(label)) {
    throw new Error('ExtendedFab requires a non-empty visible text label.');
  }

  const hasAriaLabel = ariaLabel !== undefined;
  const hasAriaLabelledby = ariaLabelledby !== undefined;
  if (hasAriaLabel && hasAriaLabelledby) {
    throw new Error(
      'ExtendedFab accepts at most one accessible-name override: aria-label or aria-labelledby.',
    );
  }

  if (hasAriaLabel && !hasText(ariaLabel)) {
    throw new Error('ExtendedFab aria-label override must be non-empty.');
  }

  if (hasAriaLabelledby && !hasText(ariaLabelledby)) {
    throw new Error('ExtendedFab aria-labelledby override must be non-empty.');
  }
}

/** A native labeled primary action styled with Material 3 system tokens. */
export function ExtendedFab({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children,
  className,
  leadingIcon,
  ref,
  size = 'regular',
  type = 'button',
  variant = 'primary',
  ...buttonProps
}: ExtendedFabProps) {
  validateExtendedFabContent(children, ariaLabel, ariaLabelledby);
  const buttonClassName = className
    ? `md-extended-fab ${className}`
    : 'md-extended-fab';

  return (
    <button
      {...buttonProps}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-pressed={undefined}
      className={buttonClassName}
      data-has-leading-icon={leadingIcon != null ? 'true' : 'false'}
      data-size={size}
      data-variant={variant}
      ref={ref}
      type={type}
    >
      <span className="md-extended-fab__visual">
        {leadingIcon != null ? (
          <FabIcon className="md-extended-fab__icon">{leadingIcon}</FabIcon>
        ) : null}
        <span className="md-extended-fab__label">{children}</span>
      </span>
    </button>
  );
}
