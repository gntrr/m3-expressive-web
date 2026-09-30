import { useState, type CSSProperties, type ReactNode } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import {
  toMaterialColorCssVariables,
  toMaterialElevationCssVariables,
  toMaterialElevationShadowCssVariables,
  toMaterialShapeCssVariables,
  toMaterialStateCssVariables,
} from '../../foundation/index.js';
import { createMaterialColorScheme } from '../../foundation/color/generator.js';
import { CARD_LINK_VARIANTS, CardLink } from './CardLink.js';
import './card-link.css';
import './CardLink.stories.css';

const sharedVariables = {
  ...toMaterialElevationCssVariables(),
  ...toMaterialElevationShadowCssVariables(),
  ...toMaterialShapeCssVariables(),
  ...toMaterialStateCssVariables(),
};

function schemeVariables(mode: 'light' | 'dark'): CSSProperties {
  return {
    ...sharedVariables,
    ...toMaterialColorCssVariables(
      createMaterialColorScheme({
        seed: '#6750A4',
        variant: 'tonalSpot',
        contrastLevel: 0,
        mode,
      }),
    ),
  } as CSSProperties;
}

const lightVariables = schemeVariables('light');
const darkVariables = schemeVariables('dark');

function StoryFrame({
  children,
  description,
  mode = 'light',
  title,
}: {
  children: ReactNode;
  description: string;
  mode?: 'light' | 'dark';
  title: string;
}) {
  return (
    <div
      className="card-link-story"
      data-mode={mode}
      style={mode === 'dark' ? darkVariables : lightVariables}
    >
      <div className="card-link-story__header">
        <p className="card-link-story__eyebrow">Material 3 whole-card navigation</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}

function LinkContent({ children }: { children: ReactNode }) {
  return <section className="card-link-story__content">{children}</section>;
}

function VariantGallery() {
  return (
    <StoryFrame
      title="CardLink variants"
      description="Filled uses surface-container-highest, elevated uses surface-container-low, and outlined uses surface plus outline-variant. Each remains a native navigation link."
    >
      <div className="card-link-story__grid">
        {CARD_LINK_VARIANTS.map((variant) => (
          <CardLink href={`#${variant}-destination`} key={variant} variant={variant}>
            <LinkContent>
              <h2>{variant}</h2>
              <p>Navigate to one destination.</p>
            </LinkContent>
          </CardLink>
        ))}
      </div>
    </StoryFrame>
  );
}

function InteractionGallery() {
  const [activations, setActivations] = useState(0);
  return (
    <StoryFrame
      title="Hover, focus, active, and native keyboard behavior"
      description="Fine-pointer hover applies the H state layer. Focus-visible and active apply F/P without stacking. Enter follows native anchor activation; Space intentionally has no button-style activation."
    >
      <div className="card-link-story__row">
        <CardLink
          data-testid="state-target"
          href="#card-link-activation"
          onClick={() => setActivations((value) => value + 1)}
          variant="elevated"
        >
          <LinkContent>
            <h2>Interaction target</h2>
            <p>Focus, hover, or press this native link.</p>
          </LinkContent>
        </CardLink>
        <output>Activations: {activations}</output>
      </div>
    </StoryFrame>
  );
}

function PlatformGallery() {
  return (
    <StoryFrame
      title="Native destinations and platform behavior"
      description="Modifier-click, middle-click, context menu, copy-link-address, new-tab, and download behavior stay native and are intentionally not intercepted. Forced colors uses system colors; reduced motion has no runtime animation."
    >
      <div className="card-link-story__grid">
        <CardLink href="#internal-destination">
          <LinkContent><h2>Internal destination</h2><p>Normal same-document link.</p></LinkContent>
        </CardLink>
        <CardLink href="https://example.com/products" rel="noopener" target="_blank">
          <LinkContent><h2>External destination</h2><p>Opens with the authored target and rel.</p></LinkContent>
        </CardLink>
        <CardLink download="product-guide.pdf" href="/product-guide.pdf" variant="outlined">
          <LinkContent><h2>Download guide</h2><p>Uses the native download attribute.</p></LinkContent>
        </CardLink>
        <CardLink dir="rtl" href="#rtl" variant="outlined">
          <LinkContent><h2>وجهة عربية</h2><p>يتبع الرابط اتجاه المستند.</p></LinkContent>
        </CardLink>
        <CardLink className="card-link-story__forced-preview" href="#forced" variant="outlined">
          <LinkContent><h2>Forced colors</h2><p>System boundary and focus remain visible.</p></LinkContent>
        </CardLink>
      </div>
    </StoryFrame>
  );
}

const meta = {
  title: 'Components/CardLink',
  component: CardLink,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    children: 'Open details',
    href: '#details',
    variant: 'filled',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: CARD_LINK_VARIANTS },
  },
} satisfies Meta<typeof CardLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <StoryFrame
      title="CardLink playground"
      description="A single native anchor for whole-card navigation. It has no disabled or button-style state API."
    >
      <CardLink {...args} />
    </StoryFrame>
  ),
};

export const Variants: Story = { render: () => <VariantGallery /> };

export const LightAndDark: Story = {
  render: () => (
    <div className="card-link-story__theme-pair">
      <StoryFrame title="Light scheme" description="Semantic Card roles resolve in light mode.">
        <CardLink href="#light"><LinkContent><h2>Light destination</h2></LinkContent></CardLink>
      </StoryFrame>
      <StoryFrame mode="dark" title="Dark scheme" description="The same roles resolve in dark mode.">
        <CardLink href="#dark" variant="elevated"><LinkContent><h2>Dark destination</h2></LinkContent></CardLink>
      </StoryFrame>
    </div>
  ),
};

export const RichContentAndReflow: Story = {
  render: () => (
    <StoryFrame
      title="Rich flow content and natural reflow"
      description="Unlike a button, a native anchor may contain valid headings, paragraphs, lists, images, and sections. The component adds no padding, fixed dimensions, or breakpoints."
    >
      <CardLink className="card-link-story__reflow" href="#product-detail" variant="outlined">
        <img alt="Abstract violet color field" className="card-link-story__media" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 280'%3E%3C/svg%3E" />
        <LinkContent>
          <h2>Product detail destination</h2>
          <p>This deliberately long description wraps naturally under browser zoom or in a narrow parent layout.</p>
          <ul><li>Semantic heading</li><li>Ordinary paragraph</li><li>Valid list content</li></ul>
        </LinkContent>
      </CardLink>
    </StoryFrame>
  ),
};

export const StatesAndKeyboard: Story = {
  render: () => <InteractionGallery />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const target = canvas.getByTestId('state-target');
    target.focus();
    await expect(target).toHaveFocus();
  },
};

export const PlatformBehavior: Story = { render: () => <PlatformGallery /> };

export const InvalidContentGuidance: Story = {
  render: () => (
    <StoryFrame
      title="Invalid nested-content guidance"
      description="These are documentation only. Nested links, controls, and tabindex descendants are invalid inside an href anchor."
    >
      <pre className="card-link-story__invalid-code">{`<CardLink href="/products/42">\n  <button>Invalid nested control</button>\n  <a href="/other">Invalid nested link</a>\n</CardLink>`}</pre>
    </StoryFrame>
  ),
};
