# Packed package consumer fixture

`bun run test:package` creates this fixture in a temporary directory. It packs
the current `dist/`, extracts it as `m3-expressive-web`, provides the locally
installed React peers, and imports every documented ESM export. It also checks
that internal paths stay blocked by the export map and that ordinary imports do
not reference Material Color Utilities.

It is intentionally dependency-free. It does not replace a package-manager
installation test or a real Next.js application fixture; both require an
isolated consumer dependency install and are tracked in the architecture audit.
