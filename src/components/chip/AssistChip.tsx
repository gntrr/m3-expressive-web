import type {
  ComponentPropsWithoutRef,
  ReactNode,
  Ref,
} from 'react';

import {
  type ChipTreatment,
  validateAssistChipLabel,
} from './chip-shared.js';

export type AssistChipAccessibleNameOverride =
  | { 'aria-label'?: never; 'aria-labelledby'?: never }
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

export type AssistChipProps = AssistChipAccessibleNameOverride &
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
    trailingIcon?: ReactNode;
    treatment?: ChipTreatment;
  };

/** A native Material 3 contextual command with a compact visible label. */
export function AssistChip({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children,
  className,
  leadingIcon,
  ref,
  trailingIcon,
  treatment = 'flat',
  type = 'button',
  ...buttonProps
}: AssistChipProps) {
  validateAssistChipLabel(ariaLabel, ariaLabelledby, children);
  const buttonClassName = className
    ? 'md-assist-chip ' + className
    : 'md-assist-chip';

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
      <span className="md-assist-chip__visual">
        {leadingIcon != null ? (
          <span
            aria-hidden="true"
            className="md-assist-chip__icon md-assist-chip__icon--leading"
          >
            {leadingIcon}
          </span>
        ) : null}
        <span className="md-assist-chip__label">{children}</span>
        {trailingIcon != null ? (
          <span
            aria-hidden="true"
            className="md-assist-chip__icon md-assist-chip__icon--trailing"
          >
            {trailingIcon}
          </span>
        ) : null}
      </span>
    </button>
  );
}
