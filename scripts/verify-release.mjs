import { execFileSync } from 'node:child_process';

const repositoryRoot = new URL('..', import.meta.url);

const steps = [
  ['Typecheck', ['run', 'typecheck']],
  ['Library build', ['run', 'build']],
  ['Unit tests', ['run', 'test:unit']],
  ['Storybook browser tests', ['run', 'test:stories']],
  ['Storybook production build', ['run', 'build-storybook']],
  ['Packed export smoke test', ['run', 'test:package']],
  ['Bundle-size budget', ['run', 'check:bundle-size']],
  ['Packed Next.js consumer', ['run', 'test:next-fixture']],
];

for (const [name, args] of steps) {
  console.log(`\n==> ${name}`);
  execFileSync('bun', args, {
    cwd: repositoryRoot,
    stdio: 'inherit',
  });
}

console.log('\n==> Diff check');
execFileSync('git', ['diff', '--check'], {
  cwd: repositoryRoot,
  stdio: 'inherit',
});

console.log('\nRelease verification passed.');
