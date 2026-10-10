import type {
  ChangeEvent,
  ComponentPropsWithoutRef,
  CSSProperties,
  Ref,
} from 'react';

import {
  getSegmentedButtonPosition,
  getSegmentedButtonIcon,
  validateSingleSelectSegmentedButtonGroup,
  type SegmentedButtonGroupName,
  type SegmentedButtonSegment,
} from './segmented-button-shared.js';

export type SingleSelectSegmentedButtonGroupProps<T extends string> =
  SegmentedButtonGroupName &
  Omit<
    ComponentPropsWithoutRef<'fieldset'>,
    | 'aria-checked'
    | 'aria-label'
    | 'aria-labelledby'
    | 'aria-pressed'
    | 'aria-selected'
    | 'children'
    | 'defaultValue'
    | 'name'
    | 'onChange'
  > & {
    name: string;
    onValueChange: (value: T) => void;
    ref?: Ref<HTMLFieldSetElement>;
    segments: readonly SegmentedButtonSegment<T>[];
    value: T;
  };

/** A controlled native radio group rendered with Material 3 segmented-button geometry. */
export function SingleSelectSegmentedButtonGroup<T extends string>({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  className,
  disabled,
  legend,
  name,
  onValueChange,
  ref,
  segments,
  value,
  ...fieldsetProps
}: SingleSelectSegmentedButtonGroupProps<T>) {
  validateSingleSelectSegmentedButtonGroup({
    ariaLabel,
    ariaLabelledby,
    legend,
    name,
    segments,
    value,
  });

  const fieldsetClassName = className
    ? `md-segmented-button-group md-single-select-segmented-button-group ${className}`
    : 'md-segmented-button-group md-single-select-segmented-button-group';

  function handleChange(
    segment: SegmentedButtonSegment<T>,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    if (!event.currentTarget.checked || event.currentTarget.disabled) return;
    onValueChange(segment.value);
  }

  return (
    <fieldset
      {...fieldsetProps}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      className={fieldsetClassName}
      data-segment-count={segments.length}
      disabled={disabled}
      ref={ref}
    >
      {legend !== undefined ? (
        <legend className="md-segmented-button-group__legend">
          {legend}
        </legend>
      ) : null}
      <span
        className="md-segmented-button-group__items"
        style={{ '--md-segmented-button-count': segments.length } as CSSProperties}
      >
        {segments.map((segment, index) => {
          const selected = segment.value === value;
          const segmentDisabled = Boolean(disabled || segment.disabled);
          const icon = getSegmentedButtonIcon(segment, selected);
          const position = getSegmentedButtonPosition(index, segments.length);

          return (
            <label
              className="md-segmented-button-group__segment"
              data-disabled={segmentDisabled ? 'true' : 'false'}
              data-position={position}
              data-selected={selected ? 'true' : 'false'}
              key={segment.value}
            >
              <input
                checked={selected}
                className="md-segmented-button-group__input"
                disabled={segmentDisabled}
                name={name}
                onChange={(event) => handleChange(segment, event)}
                type="radio"
                value={segment.value}
              />
              <span className="md-segmented-button-group__visual">
                {icon ? (
                  <span
                    aria-hidden="true"
                    className="md-segmented-button-group__icon"
                  >
                    {icon}
                  </span>
                ) : null}
                <span className="md-segmented-button-group__label">
                  {segment.label}
                </span>
              </span>
            </label>
          );
        })}
      </span>
    </fieldset>
  );
}
