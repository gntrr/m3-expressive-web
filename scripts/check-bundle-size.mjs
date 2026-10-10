import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const repositoryRoot = resolve(import.meta.dirname, '..');
const baseline = JSON.parse(
  readFileSync(join(repositoryRoot, 'docs', 'bundle-size-baseline.json'), 'utf8'),
);

let failed = false;
for (const [name, entry] of Object.entries(baseline.entries)) {
  const rawBytes = entry.files.reduce(
    (total, file) => total + readFileSync(join(repositoryRoot, file)).byteLength,
    0,
  );
  const status = rawBytes <= entry.budgetBytes ? 'ok' : 'over budget';
  console.log(`${name}: ${rawBytes} B / ${entry.budgetBytes} B (${status})`);
  failed ||= rawBytes > entry.budgetBytes;
}

if (failed) process.exitCode = 1;
