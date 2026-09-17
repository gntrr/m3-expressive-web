import type { ComponentPropsWithoutRef, ReactElement, Ref } from 'react';

import {
  IconButtonVisual,
  validateIconButtonAccessibleName,
  type IconButtonAccessibleName,
  type IconButtonShape,
  type IconButtonSize,
  type IconButtonVariant,
} from './icon-button-shared.js';

export {
  ICON_BUTTON_SHAPES,
  ICON_BUTTON_SIZES,
  ICON_BUTTON_VARIANTS,
} from './icon-button-shared.js';
export type {
  IconButtonAccessibleName,
  IconButtonShape,
  IconButtonSize,
  IconButtonVariant,
} from './icon-button-shared.js';

export type IconButtonProps = IconButtonAccessibleName &
  Omit<
    ComponentPropsWithoutRef<'button'>,
    'aria-label' | 'aria-labelledby' | 'children'
  > & {
    children: ReactElement;
    ref?: Ref<HTMLButtonElement>;
    shape?: IconButtonShape;
    size?: IconButtonSize;
    variant?: IconButtonVariant;
  };

/** A native icon-only action button styled with Material 3 system tokens. */
export function IconButton({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children,
  className,
  ref,
  shape = 'round',
  size = 'small',
  type = 'button',
  variant = 'standard',
  ...buttonProps
}: IconButtonProps) {
  validateIconButtonAccessibleName(ariaLabel, ariaLabelledby);
  const buttonClassName = className
    ? `md-icon-button ${className}`
    : 'md-icon-button';

  return (
    <button
      {...buttonProps}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      className={buttonClassName}
      data-shape={shape}
      data-size={size}
      data-variant={variant}
      ref={ref}
      type={type}
    >
      <IconButtonVisual>{children}</IconButtonVisual>
    </button>
  );
}
