/** Whether development-only Card-family diagnostics should run. */
export function isCardDevelopmentBuild(): boolean {
  const viteEnvironment = (
    import.meta as ImportMeta & { env?: { DEV?: boolean } }
  ).env;
  const runtimeProcess = (
    globalThis as typeof globalThis & {
      process?: { env?: Record<string, string | undefined> };
    }
  ).process;
  const nodeEnvironment = runtimeProcess?.env?.['NODE_ENV'];

  return (
    viteEnvironment?.DEV === true ||
    nodeEnvironment === 'development' ||
    nodeEnvironment === 'test'
  );
}
