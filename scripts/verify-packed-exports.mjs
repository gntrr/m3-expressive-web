import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';

const repositoryRoot = resolve(import.meta.dirname, '..');
const packageJson = JSON.parse(readFileSync(join(repositoryRoot, 'package.json'), 'utf8'));
const temporaryRoot = mkdtempSync(join(tmpdir(), 'm3-expressive-web-packed-'));
const archiveDirectory = join(temporaryRoot, 'archive');
const fixtureDirectory = join(temporaryRoot, 'fixture');
const packageDirectory = join(fixtureDirectory, 'node_modules', packageJson.name);

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: repositoryRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

try {
  assert(existsSync(join(repositoryRoot, 'dist', 'index.js')), 'Build dist/ before verifying packed exports.');
  mkdirSync(archiveDirectory, { recursive: true });
  mkdirSync(packageDirectory, { recursive: true });

  run('bun', [
    'pm',
    'pack',
    '--filename',
    join(archiveDirectory, 'm3-expressive-web.tgz'),
    '--quiet',
  ]);

  const archivePath = join(archiveDirectory, 'm3-expressive-web.tgz');
  assert(existsSync(archivePath), 'bun pm pack did not create the expected archive.');
  run('tar', ['-xzf', archivePath, '-C', packageDirectory, '--strip-components=1']);

  for (const peer of ['react', 'react-dom']) {
    const source = join(repositoryRoot, 'node_modules', peer);
    assert(existsSync(source), `Missing installed ${peer} peer dependency for packed export verification.`);
    symlinkSync(source, join(fixtureDirectory, 'node_modules', peer), 'dir');
  }

  for (const [subpath, target] of Object.entries(packageJson.exports)) {
    const relativeTarget = typeof target === 'string' ? target : target.import;
    const typesTarget = typeof target === 'string' ? undefined : target.types;
    assert(
      typeof relativeTarget === 'string' && existsSync(join(packageDirectory, relativeTarget)),
      `Packed export ${subpath} is missing runtime target ${relativeTarget}.`,
    );
    if (typesTarget !== undefined) {
      assert(existsSync(join(packageDirectory, typesTarget)), `Packed export ${subpath} is missing types.`);
    }
  }

  const fixtureScript = join(fixtureDirectory, 'verify.mjs');
  writeFileSync(
    fixtureScript,
    `
const imports = [
  'm3-expressive-web',
  'm3-expressive-web/foundation/color',
  'm3-expressive-web/foundation/color/generator',
  'm3-expressive-web/foundation/typography',
  'm3-expressive-web/foundation/shape',
  'm3-expressive-web/foundation/elevation',
  'm3-expressive-web/foundation/motion',
  'm3-expressive-web/foundation/state',
  'm3-expressive-web/foundation/adaptive-layout',
  'm3-expressive-web/components/button',
  'm3-expressive-web/components/icon-button',
  'm3-expressive-web/components/fab',
  'm3-expressive-web/components/card',
  'm3-expressive-web/components/chip',
  'm3-expressive-web/components/segmented-button',
];

for (const specifier of imports) await import(specifier);

try {
  await import('m3-expressive-web/components/button/Button');
  throw new Error('An internal component path was unexpectedly public.');
} catch (error) {
  if (error?.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED') throw error;
}
`,
  );
  run(process.execPath, [fixtureScript], { cwd: fixtureDirectory });

  const generatorEntry = readFileSync(
    join(packageDirectory, 'dist', 'foundation', 'color', 'generator.js'),
    'utf8',
  );
  const ordinaryEntries = [
    'dist/index.js',
    'dist/components/index.js',
    'dist/foundation/index.js',
    'dist/components/button/index.js',
  ].map((entry) => readFileSync(join(packageDirectory, entry), 'utf8'));
  assert(generatorEntry.length > 100_000, 'The packed color generator is unexpectedly absent or incomplete.');
  assert(
    ordinaryEntries.every((entry) => !entry.includes('@material/material-color-utilities')),
    'An ordinary package entry references Material Color Utilities.',
  );

  console.log(`Packed export smoke check passed: ${basename(archivePath)}`);
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}
