import type {
  ComponentPropsWithoutRef,
  ReactNode,
  Ref,
} from 'react';

import {
  type ChipTreatment,
  validateCommandChipLabel,
} from './chip-shared.js';

export type SuggestionChipAccessibleNameOverride =
  | { 'aria-label'?: never; 'aria-labelledby'?: never }
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

export type SuggestionChipProps = SuggestionChipAccessibleNameOverride &
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
    leadingIcon?: ReactNode;
    ref?: Ref<HTMLButtonElement>;
    treatment?: ChipTreatment;
  };

/** A native Material 3 command that presents a contextual suggestion. */
export function SuggestionChip({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children,
  className,
  leadingIcon,
  ref,
  treatment = 'flat',
  type = 'button',
  ...buttonProps
}: SuggestionChipProps) {
  validateCommandChipLabel('SuggestionChip', ariaLabel, ariaLabelledby, children);
  const buttonClassName = className
    ? 'md-suggestion-chip ' + className
    : 'md-suggestion-chip';

  return (
    <button
      {...buttonProps}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      className={buttonClassName}
      data-treatment={treatment}
      ref={ref}
      type={type}
    >
      <span className="md-suggestion-chip__visual">
        {leadingIcon != null ? (
          <span
            aria-hidden="true"
            className="md-suggestion-chip__icon"
          >
            {leadingIcon}
          </span>
        ) : null}
        <span className="md-suggestion-chip__label">{children}</span>
      </span>
    </button>
  );
}
