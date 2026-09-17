import type {
  ComponentPropsWithoutRef,
  MouseEvent,
  ReactElement,
  Ref,
} from 'react';

import {
  IconButtonVisual,
  validateIconButtonAccessibleName,
  type IconButtonAccessibleName,
  type IconButtonShape,
  type IconButtonSize,
  type IconButtonVariant,
} from './icon-button-shared.js';

export type ToggleIconButtonProps = IconButtonAccessibleName &
  Omit<
    ComponentPropsWithoutRef<'button'>,
    'aria-label' | 'aria-labelledby' | 'aria-pressed' | 'children'
  > & {
    children: ReactElement;
    onPressedChange?: (pressed: boolean) => void;
    pressed: boolean;
    ref?: Ref<HTMLButtonElement>;
    shape?: IconButtonShape;
    size?: IconButtonSize;
    variant?: IconButtonVariant;
  };

/** A controlled native toggle button styled with Material 3 system tokens. */
export function ToggleIconButton({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children,
  className,
  disabled,
  onClick,
  onPressedChange,
  pressed,
  ref,
  shape = 'round',
  size = 'small',
  type = 'button',
  variant = 'standard',
  ...buttonProps
}: ToggleIconButtonProps) {
  validateIconButtonAccessibleName(ariaLabel, ariaLabelledby);
  const buttonClassName = className
    ? `md-icon-button md-toggle-icon-button ${className}`
    : 'md-icon-button md-toggle-icon-button';

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (disabled) return;
    onClick?.(event);
    onPressedChange?.(!pressed);
  }

  return (
    <button
      {...buttonProps}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-pressed={pressed}
      className={buttonClassName}
      data-pressed={pressed ? 'true' : 'false'}
      data-shape={shape}
      data-size={size}
      data-variant={variant}
      disabled={disabled}
      onClick={handleClick}
      ref={ref}
      type={type}
    >
      <IconButtonVisual>{children}</IconButtonVisual>
    </button>
  );
}
