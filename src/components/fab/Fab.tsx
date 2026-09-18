import type { ComponentPropsWithoutRef, ReactElement, Ref } from 'react';

import {
  FabVisual,
  validateFabAccessibleName,
  type FabAccessibleName,
  type FabSize,
  type FabVariant,
} from './fab-shared.js';

export { FAB_SIZES, FAB_VARIANTS } from './fab-shared.js';
export type { FabSize, FabVariant } from './fab-shared.js';

export type FabProps = FabAccessibleName &
  Omit<
    ComponentPropsWithoutRef<'button'>,
    'aria-label' | 'aria-labelledby' | 'aria-pressed' | 'children'
  > & {
    children: ReactElement;
    ref?: Ref<HTMLButtonElement>;
    size?: FabSize;
    variant?: FabVariant;
  };

/** A native icon-only primary action styled with Material 3 system tokens. */
export function Fab({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children,
  className,
  ref,
  size = 'regular',
  type = 'button',
  variant = 'primary',
  ...buttonProps
}: FabProps) {
  validateFabAccessibleName(ariaLabel, ariaLabelledby);
  const buttonClassName = className ? `md-fab ${className}` : 'md-fab';

  return (
    <button
      {...buttonProps}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-pressed={undefined}
      className={buttonClassName}
      data-size={size}
      data-variant={variant}
      ref={ref}
      type={type}
    >
      <FabVisual>{children}</FabVisual>
    </button>
  );
}
