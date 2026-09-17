import { Children, type ReactElement } from 'react';

export const ICON_BUTTON_VARIANTS = [
  'standard',
  'filled',
  'tonal',
  'outlined',
] as const;

export const ICON_BUTTON_SIZES = [
  'extra-small',
  'small',
  'medium',
  'large',
  'extra-large',
] as const;

export const ICON_BUTTON_SHAPES = ['round', 'square'] as const;

export type IconButtonVariant = (typeof ICON_BUTTON_VARIANTS)[number];
export type IconButtonSize = (typeof ICON_BUTTON_SIZES)[number];
/** `square` is provisional while Material's web shape API remains unspecified. */
export type IconButtonShape = (typeof ICON_BUTTON_SHAPES)[number];

export type IconButtonAccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

function hasAccessibleName(value: string | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateIconButtonAccessibleName(
  ariaLabel: string | undefined,
  ariaLabelledby: string | undefined,
): void {
  const hasAriaLabel = hasAccessibleName(ariaLabel);
  const hasAriaLabelledby = hasAccessibleName(ariaLabelledby);

  if (hasAriaLabel && hasAriaLabelledby) {
    throw new Error(
      'IconButton requires exactly one accessible name: aria-label or aria-labelledby.',
    );
  }

  if (!hasAriaLabel && !hasAriaLabelledby) {
    throw new Error(
      'IconButton requires a non-empty aria-label or aria-labelledby. title is not an accessible-name substitute.',
    );
  }
}

export function IconButtonVisual({ children }: { children: ReactElement }) {
  const icon = Children.only(children);
  return (
    <span aria-hidden="true" className="md-icon-button__visual">
      <span className="md-icon-button__icon">{icon}</span>
    </span>
  );
}
