import type {
  ComponentPropsWithoutRef,
  MouseEvent,
  ReactNode,
  Ref,
} from 'react';

import {
  type ChipTreatment,
  validateCommandChipLabel,
} from './chip-shared.js';

export type FilterChipAccessibleNameOverride =
  | { 'aria-label'?: never; 'aria-labelledby'?: never }
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

export type FilterChipProps = FilterChipAccessibleNameOverride &
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
    onSelectedChange?: (selected: boolean) => void;
    ref?: Ref<HTMLButtonElement>;
    selected: boolean;
    selectedIcon?: ReactNode;
    trailingIcon?: ReactNode;
    treatment?: ChipTreatment;
  };

/** A controlled native toggle button for applying one independent content filter. */
export function FilterChip({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children,
  className,
  disabled,
  leadingIcon,
  onClick,
  onSelectedChange,
  ref,
  selected,
  selectedIcon,
  trailingIcon,
  treatment = 'flat',
  type = 'button',
  ...buttonProps
}: FilterChipProps) {
  validateCommandChipLabel('FilterChip', ariaLabel, ariaLabelledby, children);
  const buttonClassName = className
    ? 'md-filter-chip ' + className
    : 'md-filter-chip';
  // Web decision: selectedIcon takes the one visual start slot; otherwise the
  // consumer's leadingIcon remains visible in selected mode.
  const startIcon = selected ? selectedIcon ?? leadingIcon : leadingIcon;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (disabled) return;
    onClick?.(event);
    onSelectedChange?.(!selected);
  }

  return (
    <button
      {...buttonProps}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-pressed={selected}
      className={buttonClassName}
      data-selected={selected ? 'true' : 'false'}
      data-treatment={treatment}
      disabled={disabled}
      onClick={handleClick}
      ref={ref}
      type={type}
    >
      <span className="md-filter-chip__visual">
        {startIcon != null ? (
          <span aria-hidden="true" className="md-filter-chip__icon md-filter-chip__icon--start">
            {startIcon}
          </span>
        ) : null}
        <span className="md-filter-chip__label">{children}</span>
        {trailingIcon != null ? (
          <span aria-hidden="true" className="md-filter-chip__icon md-filter-chip__icon--trailing">
            {trailingIcon}
          </span>
        ) : null}
      </span>
    </button>
  );
}
