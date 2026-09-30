import {
  Children,
  isValidElement,
  type ReactNode,
} from 'react';

export const CHIP_TREATMENTS = ['flat', 'elevated'] as const;
export type ChipTreatment = (typeof CHIP_TREATMENTS)[number];

type ChipLabelChildProps = {
  children?: ReactNode;
  contentEditable?: boolean | 'true' | 'false';
  tabIndex?: number | string;
};

const INTERACTIVE_HOST_ELEMENTS = new Set([
  'a', 'area', 'audio', 'button', 'details', 'embed', 'iframe', 'input',
  'label', 'select', 'summary', 'textarea', 'video',
]);

const PHRASING_LABEL_HOST_ELEMENTS = new Set([
  'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'del', 'em', 'i',
  'ins', 'kbd', 'mark', 'q', 's', 'samp', 'small', 'span', 'strong', 'sub',
  'sup', 'time', 'u', 'var',
]);

/** Shared baseline treatments for concrete Chip-family components. */
export function isChipDevelopmentBuild(): boolean {
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

function hasNonEmptyValue(value: string | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function inspectLabel(children: ReactNode): {
  hasOpaqueContent: boolean;
  hasText: boolean;
  invalidContent: Set<string>;
} {
  let hasOpaqueContent = false;
  let hasText = false;
  const invalidContent = new Set<string>();

  function inspect(node: ReactNode): void {
    if (typeof node === 'string') {
      hasText ||= node.trim().length > 0;
      return;
    }
    if (typeof node === 'number') {
      hasText = true;
      return;
    }
    if (!isValidElement<ChipLabelChildProps>(node)) return;
    if (typeof node.type !== 'string') {
      hasOpaqueContent = true;
      return;
    }

    const { children: nestedChildren, contentEditable, tabIndex } = node.props;
    if (INTERACTIVE_HOST_ELEMENTS.has(node.type)) {
      invalidContent.add(node.type);
    } else if (!PHRASING_LABEL_HOST_ELEMENTS.has(node.type)) {
      invalidContent.add(node.type);
    }
    if (tabIndex !== undefined) invalidContent.add('[tabIndex]');
    if (contentEditable === true || contentEditable === 'true') {
      invalidContent.add('[contentEditable]');
    }
    Children.forEach(nestedChildren, inspect);
  }

  Children.forEach(children, inspect);
  return { hasOpaqueContent, hasText, invalidContent };
}

export function validateAssistChipLabel(
  ariaLabel: string | undefined,
  ariaLabelledby: string | undefined,
  children: ReactNode,
): void {
  if (!isChipDevelopmentBuild()) return;
  const hasAriaLabel = ariaLabel !== undefined;
  const hasAriaLabelledby = ariaLabelledby !== undefined;

  if (hasAriaLabel && hasAriaLabelledby) {
    throw new Error('AssistChip accepts either aria-label or aria-labelledby, not both.');
  }
  if (hasAriaLabel && !hasNonEmptyValue(ariaLabel)) {
    throw new Error('AssistChip aria-label must not be blank or whitespace-only.');
  }
  if (hasAriaLabelledby && !hasNonEmptyValue(ariaLabelledby)) {
    throw new Error('AssistChip aria-labelledby must not be blank or whitespace-only.');
  }

  const { hasOpaqueContent, hasText, invalidContent } = inspectLabel(children);
  if (invalidContent.size > 0) {
    console.warn(
      'AssistChip labels must be non-interactive phrasing content. Detected unsupported host content: ' +
        [...invalidContent].join(', ') +
        '. Custom components cannot be verified at runtime.',
    );
  }
  if (!hasAriaLabel && !hasAriaLabelledby && !hasText) {
    if (hasOpaqueContent) {
      console.warn(
        'AssistChip could not verify a textual label from a custom component. Provide visible text or aria-label/aria-labelledby; title is not an accessible-name substitute.',
      );
      return;
    }
    throw new Error(
      'AssistChip requires a non-empty visible textual label or aria-label/aria-labelledby. title is not an accessible-name substitute.',
    );
  }
}
