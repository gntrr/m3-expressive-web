import {
  AssistChip,
  Button,
  Card,
  ExtendedFab,
} from 'm3-expressive-web';

import { ClientExamples } from './client-examples';

function AddIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/** Intentionally a Server Component: no client directive or browser APIs. */
export default function HomePage() {
  return (
    <main>
      <h1>Packed package integration fixture</h1>
      <section aria-label="Server component integration checks">
        <Button>Server button</Button>
        <ExtendedFab leadingIcon={<AddIcon />}>Create</ExtendedFab>
        <Card>
          <p>Server-rendered card content.</p>
        </Card>
        <AssistChip>Server assist chip</AssistChip>
      </section>
      <ClientExamples />
      <section data-m3-theme="dark">
        <Button variant="tonal">Dark semantic scheme</Button>
      </section>
    </main>
  );
}
