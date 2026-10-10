import { Children } from 'react';
import type { ReactElement, ReactNode } from 'react';

export type SegmentedButtonValue = string;

export type SegmentedButtonSegment<T extends SegmentedButtonValue> = Readonly<{
  value: T;
  label: string;
  disabled?: boolean;
  icon?: ReactElement;
  selectedIcon?: ReactElement;
}>;

export type SegmentedButtonGroupName =
  | {
      legend: ReactNode;
      'aria-label'?: never;
      'aria-labelledby'?: never;
    }
  | {
      legend?: never;
      'aria-label': string;
      'aria-labelledby'?: never;
    }
  | {
      legend?: never;
      'aria-label'?: never;
      'aria-labelledby': string;
    };

export const SEGMENTED_BUTTON_POSITIONS = [
  'only',
  'logical-start',
  'middle',
  'logical-end',
] as const;

export type SegmentedButtonPosition = (typeof SEGMENTED_BUTTON_POSITIONS)[number];

export const SEGMENTED_BUTTON_METRICS = Object.freeze({
  minimumBlockSize: '40px',
  minimumInlineSize: '58px',
  iconSize: '18px',
  iconGap: '8px',
  paddingInline: '12px',
  paddingBlock: '8px',
  outlineWidth: '1px',
} as const);

export function getSegmentedButtonIcon<T extends string>(
  segment: SegmentedButtonSegment<T>,
  selected: boolean,
): ReactElement | undefined {
  return selected ? segment.selectedIcon ?? segment.icon : segment.icon;
}

function isNonBlankString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasInspectableLegendContent(value: ReactNode | undefined): boolean {
  if (value == null || value === false) return false;
  const children = Children.toArray(value);
  if (children.length === 0) return false;

  return children.some((child) =>
    typeof child === 'string' ? child.trim().length > 0 : true,
  );
}

export function getSegmentedButtonPosition(
  index: number,
  count: number,
): SegmentedButtonPosition {
  if (count === 1) return 'only';
  if (index === 0) return 'logical-start';
  if (index === count - 1) return 'logical-end';
  return 'middle';
}

export function validateSegmentedButtonGroupDefinition<T extends string>(options: {
  ariaLabel: string | undefined;
  ariaLabelledby: string | undefined;
  legend: ReactNode | undefined;
  name: string;
  segments: readonly SegmentedButtonSegment<T>[];
}): void {
  const hasLegend = hasInspectableLegendContent(options.legend);
  const hasAriaLabel = isNonBlankString(options.ariaLabel);
  const hasAriaLabelledby = isNonBlankString(options.ariaLabelledby);
  const nameCount = Number(hasLegend) + Number(hasAriaLabel) + Number(hasAriaLabelledby);

  if (nameCount !== 1) {
    throw new Error(
      'SingleSelectSegmentedButtonGroup requires exactly one non-empty group name: legend, aria-label, or aria-labelledby.',
    );
  }

  if (!isNonBlankString(options.name)) {
    throw new Error('SingleSelectSegmentedButtonGroup name must not be blank.');
  }

  if (options.segments.length === 0) {
    throw new Error('SingleSelectSegmentedButtonGroup requires at least one segment.');
  }

  const values = new Set<string>();
  for (const segment of options.segments) {
    if (!isNonBlankString(segment.value)) {
      throw new Error('SingleSelectSegmentedButtonGroup segment values must not be blank.');
    }
    if (!isNonBlankString(segment.label)) {
      throw new Error('SingleSelectSegmentedButtonGroup segment labels must not be blank.');
    }
    if (values.has(segment.value)) {
      throw new Error('SingleSelectSegmentedButtonGroup segment values must be unique.');
    }
    values.add(segment.value);
  }

}

export function validateSingleSelectSegmentedButtonGroup<T extends string>(options: {
  ariaLabel: string | undefined;
  ariaLabelledby: string | undefined;
  legend: ReactNode | undefined;
  name: string;
  segments: readonly SegmentedButtonSegment<T>[];
  value: T;
}): void {
  validateSegmentedButtonGroupDefinition(options);

  if (!options.segments.some((segment) => segment.value === options.value)) {
    throw new Error(
      'SingleSelectSegmentedButtonGroup value must match one supplied segment value.',
    );
  }
}

export function validateMultiSelectSegmentedButtonGroup<T extends string>(options: {
  ariaLabel: string | undefined;
  ariaLabelledby: string | undefined;
  legend: ReactNode | undefined;
  name: string;
  segments: readonly SegmentedButtonSegment<T>[];
  value: readonly T[];
}): void {
  validateSegmentedButtonGroupDefinition(options);

  const controlledValues = new Set<string>();
  for (const value of options.value) {
    if (controlledValues.has(value)) {
      throw new Error('MultiSelectSegmentedButtonGroup value must not contain duplicate segment values.');
    }
    if (!options.segments.some((segment) => segment.value === value)) {
      throw new Error(
        'MultiSelectSegmentedButtonGroup value must contain only supplied segment values.',
      );
    }
    controlledValues.add(value);
  }
}

export function normalizeSegmentedButtonValues<T extends string>(
  segments: readonly SegmentedButtonSegment<T>[],
  values: readonly T[],
): readonly T[] {
  const selectedValues = new Set(values);
  return segments
    .filter((segment) => selectedValues.has(segment.value))
    .map((segment) => segment.value);
}
