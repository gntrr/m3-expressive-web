import type { ComponentPropsWithoutRef, Ref } from 'react';

export const CARD_VARIANTS = ['filled', 'elevated', 'outlined'] as const;

export type CardVariant = (typeof CARD_VARIANTS)[number];

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>;
  variant?: CardVariant;
}

/** A static Material 3 content container with no built-in interaction behavior. */
export function Card({
  className,
  ref,
  variant = 'filled',
  ...divProps
}: CardProps) {
  const cardClassName = className ? `md-card ${className}` : 'md-card';

  return (
    <div
      {...divProps}
      className={cardClassName}
      data-variant={variant}
      ref={ref}
    />
  );
}
