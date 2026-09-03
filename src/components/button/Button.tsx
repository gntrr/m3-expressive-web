import type {
  ComponentPropsWithoutRef,
  ReactNode,
  Ref,
} from 'react';

export const BUTTON_VARIANTS = [
  'filled',
  'tonal',
  'elevated',
  'outlined',
  'text',
] as const;

export const BUTTON_SIZES = [
  'extra-small',
  'small',
  'medium',
  'large',
  'extra-large',
] as const;

export const BUTTON_SHAPES = ['round', 'square'] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export type ButtonSize = (typeof BUTTON_SIZES)[number];
export type ButtonShape = (typeof BUTTON_SHAPES)[number];

export interface ButtonProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  children: ReactNode;
  leadingIcon?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
  shape?: ButtonShape;
  size?: ButtonSize;
  trailingIcon?: ReactNode;
  variant?: ButtonVariant;
}

/** A native action button styled with Material 3 system tokens. */
export function Button({
  children,
  className,
  leadingIcon,
  ref,
  shape = 'round',
  size = 'small',
  trailingIcon,
  type = 'button',
  variant = 'filled',
  ...buttonProps
}: ButtonProps) {
  const buttonClassName = className
    ? `md-button ${className}`
    : 'md-button';

  return (
    <button
      {...buttonProps}
      className={buttonClassName}
      data-shape={shape}
      data-size={size}
      data-variant={variant}
      ref={ref}
      type={type}
    >
      {leadingIcon != null ? (
        <span
          aria-hidden="true"
          className="md-button__icon md-button__icon--leading"
        >
          {leadingIcon}
        </span>
      ) : null}
      <span className="md-button__label">{children}</span>
      {trailingIcon != null ? (
        <span
          aria-hidden="true"
          className="md-button__icon md-button__icon--trailing"
        >
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
}
