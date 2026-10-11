'use client';

import { useRef, useState } from 'react';

import { FilterChip, InputChip } from 'm3-expressive-web/components/chip';
import { ToggleIconButton } from 'm3-expressive-web/components/icon-button';
import {
  MultiSelectSegmentedButtonGroup,
  SingleSelectSegmentedButtonGroup,
} from 'm3-expressive-web/components/segmented-button';

function CheckIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <path d="M5 12.5 9.5 17 19 7.5" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <path d="m7 7 10 10M17 7 7 17" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

const viewSegments = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
] as const;

const columnSegments = [
  { value: 'revenue', label: 'Revenue' },
  { value: 'orders', label: 'Orders' },
  { value: 'customers', label: 'Customers' },
] as const;

/** The fixture owns all interactivity; the package remains SSR-safe. */
export function ClientExamples() {
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [pressed, setPressed] = useState(false);
  const [selected, setSelected] = useState(false);
  const [view, setView] = useState<(typeof viewSegments)[number]['value']>('week');
  const [columns, setColumns] = useState<readonly (typeof columnSegments)[number]['value'][]>([
    'revenue',
  ]);
  const [showMina, setShowMina] = useState(true);

  return (
    <section aria-label="Client component integration checks">
      <ToggleIconButton
        aria-label="Toggle favorite"
        onPressedChange={setPressed}
        pressed={pressed}
        ref={toggleRef}
      >
        <CheckIcon />
      </ToggleIconButton>

      <FilterChip onSelectedChange={setSelected} selected={selected}>
        Vegetarian
      </FilterChip>

      <SingleSelectSegmentedButtonGroup
        legend="Calendar view"
        name="calendar-view"
        onValueChange={setView}
        segments={viewSegments}
        value={view}
      />

      <MultiSelectSegmentedButtonGroup
        aria-label="Report columns"
        name="report-columns"
        onValueChange={setColumns}
        segments={columnSegments}
        value={columns}
      />

      {showMina ? (
        <InputChip
          label="Mina Chen"
          onClick={() => undefined}
          onRemove={() => setShowMina(false)}
          removeIcon={<CloseIcon />}
          rootProps={{ 'data-testid': 'mina-chip' }}
        />
      ) : null}
    </section>
  );
}
