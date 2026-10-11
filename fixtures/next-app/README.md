# Packed Next.js consumer fixture

This is a permanent, minimal Next.js 16.4.0 App Router integration fixture. It
consumes `m3-expressive-web` only through a tarball made by `bun pm pack`.
There are no workspace links, source aliases, or `../src` imports.

Run the fixture from the repository root after building the library:

```sh
bun run test:next-fixture
```

The check recreates `.artifacts/m3-expressive-web.tgz`, installs it using this
fixture's frozen lockfile, runs `next build --webpack`, verifies the package has
no source directory, checks client chunks for MCU, starts `next start`, and
uses the repository's Playwright Chromium dependency for controlled hydration
smoke tests. The fixture's Next.js dependencies are isolated and never enter
the library's published package.
