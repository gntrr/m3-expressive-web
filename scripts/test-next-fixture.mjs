import { spawn } from 'node:child_process';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const repositoryRoot = resolve(import.meta.dirname, '..');
const fixtureRoot = join(repositoryRoot, 'fixtures', 'next-app');
const artifactDirectory = join(fixtureRoot, '.artifacts');
const tarballPath = join(artifactDirectory, 'm3-expressive-web.tgz');
const packageDirectory = join(fixtureRoot, 'node_modules', 'm3-expressive-web');
const serverUrl = 'http://127.0.0.1:3105';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function run(command, args, cwd) {
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit',
  });
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
}

async function filesRecursively(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesRecursively(path) : [path];
  }));
  return nested.flat();
}

async function waitForServer(child) {
  let lastError;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(serverUrl);
      if (response.ok) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    if (child.exitCode !== null) {
      throw new Error(`Next fixture server exited early with code ${child.exitCode}.`);
    }
    await delay(250);
  }
  throw new Error(`Timed out waiting for Next fixture server: ${String(lastError)}`);
}

async function assertClientChunksExcludeMcu() {
  const chunksDirectory = join(fixtureRoot, '.next', 'static', 'chunks');
  const chunks = await filesRecursively(chunksDirectory);
  const mcuReference = '@material/material-color-utilities';

  for (const chunk of chunks) {
    if (!chunk.endsWith('.js')) continue;
    const contents = readFileSync(chunk, 'utf8');
    assert(
      !contents.includes(mcuReference),
      `Client chunk unexpectedly contains Material Color Utilities: ${chunk}`,
    );
  }
}

async function runBrowserSmoke() {
  const { chromium } = await import('playwright');
  const server = spawn('bun', ['run', 'start', '--', '--port', '3105'], {
    cwd: fixtureRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  server.stdout.on('data', (data) => { output += data.toString(); });
  server.stderr.on('data', (data) => { output += data.toString(); });

  try {
    const response = await waitForServer(server);
    const markup = await response.text();
    assert(markup.includes('Server button'), 'The production server did not render the Server Component page.');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const browserErrors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') browserErrors.push(message.text());
    });
    page.on('pageerror', (error) => browserErrors.push(error.message));

    await page.goto(serverUrl, { waitUntil: 'networkidle' });

    const toggle = page.getByRole('button', { name: 'Toggle favorite' });
    await toggle.click();
    assert(await toggle.getAttribute('aria-pressed') === 'true', 'ToggleIconButton did not hydrate its controlled state.');

    const filter = page.getByRole('button', { name: 'Vegetarian' });
    await filter.click();
    assert(await filter.getAttribute('aria-pressed') === 'true', 'FilterChip did not hydrate its controlled state.');

    const day = page.getByRole('radio', { name: 'Day' });
    await day.check({ force: true });
    assert(await day.isChecked(), 'SingleSelectSegmentedButtonGroup did not update its selected value.');

    const orders = page.getByRole('checkbox', { name: 'Orders' });
    await orders.check({ force: true });
    assert(await orders.isChecked(), 'MultiSelectSegmentedButtonGroup did not update its selected value.');

    await page.getByRole('button', { name: 'Remove Mina Chen' }).click();
    assert(await page.getByTestId('mina-chip').count() === 0, 'InputChip remove action did not update the consumer state.');

    await delay(100);
    await browser.close();
    assert(browserErrors.length === 0, `Browser reported hydration/runtime errors:\n${browserErrors.join('\n')}`);
  } catch (error) {
    throw new Error(`${error instanceof Error ? error.message : String(error)}\nNext server output:\n${output}`);
  } finally {
    server.kill('SIGTERM');
    await Promise.race([
      new Promise((resolveExit) => server.once('exit', resolveExit)),
      delay(5_000),
    ]);
    if (server.exitCode === null) server.kill('SIGKILL');
  }
}

assert(existsSync(join(repositoryRoot, 'dist', 'index.js')), 'Build the library before testing the Next.js fixture.');
mkdirSync(artifactDirectory, { recursive: true });
rmSync(tarballPath, { force: true });
console.log('==> Pack library artifact');
run('bun', ['pm', 'pack', '--filename', tarballPath, '--quiet'], repositoryRoot);
console.log('==> Install fixture from packed artifact');
run('bun', ['install', '--frozen-lockfile'], fixtureRoot);

assert(existsSync(join(packageDirectory, 'dist', 'index.js')), 'The fixture did not install the packed library runtime.');
assert(!existsSync(join(packageDirectory, 'src')), 'The fixture package unexpectedly contains source files.');
assert(statSync(tarballPath).size > 0, 'The packed tarball is empty.');

console.log('==> Build Next.js fixture');
run('bun', ['run', 'build'], fixtureRoot);
console.log('==> Inspect client chunks for MCU isolation');
await assertClientChunksExcludeMcu();
console.log('==> Run production hydration smoke');
await runBrowserSmoke();
console.log('Next.js packed consumer build and hydration smoke check passed.');
