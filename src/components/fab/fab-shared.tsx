import { Children, type ReactElement } from 'react';

export const FAB_VARIANTS = [
  'surface',
  'primary',
  'secondary',
  'tertiary',
] as const;

export const FAB_SIZES = ['small', 'regular', 'medium', 'large'] as const;

export type FabVariant = (typeof FAB_VARIANTS)[number];
export type FabSize = (typeof FAB_SIZES)[number];

export type FabAccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

function hasAccessibleName(value: string | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateFabAccessibleName(
  ariaLabel: string | undefined,
  ariaLabelledby: string | undefined,
): void {
  const hasAriaLabel = hasAccessibleName(ariaLabel);
  const hasAriaLabelledby = hasAccessibleName(ariaLabelledby);

  if (hasAriaLabel && hasAriaLabelledby) {
    throw new Error(
      'Fab requires exactly one accessible name: aria-label or aria-labelledby.',
    );
  }

  if (!hasAriaLabel && !hasAriaLabelledby) {
    throw new Error(
      'Fab requires a non-empty aria-label or aria-labelledby. title is not an accessible-name substitute.',
    );
  }
}

export function FabVisual({ children }: { children: ReactElement }) {
  return (
    <span aria-hidden="true" className="md-fab__visual">
      <FabIcon className="md-fab__icon">{children}</FabIcon>
    </span>
  );
}

export function FabIcon({
  children,
  className,
}: {
  children: ReactElement;
  className: string;
}) {
  const icon = Children.only(children);
  return (
    <span aria-hidden="true" className={className}>
      {icon}
    </span>
  );
}
