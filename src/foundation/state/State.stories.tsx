import type { CSSProperties, ReactNode } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  MATERIAL_INTERACTION_STATE_NAMES,
  materialStates,
  resolveMaterialStateComposition,
  toMaterialStateCssVariables,
  type MaterialInteractionStateName,
} from './index.js';
import './State.stories.css';

function stateVariables(): CSSProperties {
  return toMaterialStateCssVariables() as CSSProperties;
}

function StoryFrame({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <main className="state-story" style={stateVariables()}>
      <header className="state-story__header">
        <p className="state-story__eyebrow">Material 3 foundation</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      {children}
    </main>
  );
}

function StateSample({ state }: { state: MaterialInteractionStateName }) {
  const token = materialStates[state];
  return (
    <article className={`state-sample state-sample--${state}`}>
      <div className="state-sample__control" aria-hidden="true">
        <span>Action</span>
      </div>
      <strong>{state === 'enabled' ? 'enabled / default' : state}</strong>
      <code>
        {token.stateLayerOpacity === null
          ? 'no state layer'
          : `opacity ${token.stateLayerOpacity}`}
      </code>
      <small>{token.category}</small>
    </article>
  );
}

function IndividualStates() {
  return (
    <StoryFrame
      title="Interaction states"
      description="Enabled is the baseline; hover, focus, pressed, and dragged use one component-colored layer. Disabled suppresses all interaction layers."
    >
      <section className="state-grid" aria-label="Material interaction states">
        {MATERIAL_INTERACTION_STATE_NAMES.map((state) => (
          <StateSample key={state} state={state} />
        ))}
      </section>
    </StoryFrame>
  );
}

const overlapCases = [
  {
    label: 'Hover + focus-visible',
    result: resolveMaterialStateComposition({
      interactionStates: ['hover'],
      focusVisible: true,
    }),
  },
  {
    label: 'Pressed + focus-visible',
    result: resolveMaterialStateComposition({
      interactionStates: ['pressed'],
      focusVisible: true,
    }),
  },
  {
    label: 'Selected + hover',
    result: resolveMaterialStateComposition({
      interactionStates: ['hover'],
      semanticStates: ['selected'],
    }),
  },
  {
    label: 'Checked + pressed',
    result: resolveMaterialStateComposition({
      interactionStates: ['pressed'],
      semanticStates: ['checked'],
    }),
  },
  {
    label: 'Error + focus-visible',
    result: resolveMaterialStateComposition({
      semanticStates: ['error'],
      focusVisible: true,
    }),
  },
] as const;

function OverlappingStates() {
  return (
    <StoryFrame
      title="Explicit composition"
      description="Semantic meaning is retained, one interaction layer wins, and a visible focus outline remains an independent channel. Opacities are never added."
    >
      <section className="composition-grid" aria-label="State overlap examples">
        {overlapCases.map(({ label, result }) => (
          <article className="composition-card" key={label}>
            <div
              className={`composition-card__visual composition-card__visual--${result.interactionState}`}
            >
              <span>{result.semanticStates.join(' + ') || 'no semantic state'}</span>
              {result.showFocusIndicator && <i aria-hidden="true" />}
            </div>
            <strong>{label}</strong>
            <code>
              layer: {result.interactionState} · {result.stateLayerOpacity ?? 'none'}
            </code>
          </article>
        ))}
      </section>
    </StoryFrame>
  );
}

function FocusChannels() {
  return (
    <StoryFrame
      title="DOM focus and visible focus"
      description="Clicking and keyboard-tabbing both move DOM focus. The user agent's :focus-visible heuristic controls the stronger keyboard-focus indicator."
    >
      <section className="focus-demo" aria-label="Focus behavior examples">
        <div className="focus-demo__row">
          <button className="interactive-demo" type="button">
            Click, then Tab back
          </button>
          <span className="focus-demo__status">Not focused</span>
        </div>
        <p>
          Pointer focus is still real DOM focus even when the keyboard indicator
          is not shown. Do not remove focus programmatically.
        </p>
      </section>
    </StoryFrame>
  );
}

function SemanticComposition() {
  return (
    <StoryFrame
      title="Semantic state stays independent"
      description="Selection and checked value choose component meaning and future color tokens; hover and press remain interaction feedback layered on top."
    >
      <section className="semantic-demo" aria-label="Semantic state examples">
        <button aria-pressed="true" className="interactive-demo is-selected" type="button">
          Selected · hover me
        </button>
        <label className="check-demo">
          <input defaultChecked type="checkbox" />
          <span>Checked · press me</span>
        </label>
      </section>
    </StoryFrame>
  );
}

function DisabledBehavior() {
  return (
    <StoryFrame
      title="Disabled behavior"
      description="Native disabled controls are inoperable and normally leave the tab order. aria-disabled is only semantic: authors must suppress activation and may intentionally retain discoverability."
    >
      <section className="disabled-demo" aria-label="Disabled state examples">
        <div>
          <button className="interactive-demo" disabled type="button">
            Native disabled
          </button>
          <small>No hover, press, or focus layer</small>
        </div>
        <div>
          <button aria-disabled="true" className="interactive-demo" type="button">
            aria-disabled, focusable
          </button>
          <small>Focus indication remains; activation must be suppressed</small>
        </div>
      </section>
    </StoryFrame>
  );
}

function ForcedColors() {
  return (
    <StoryFrame
      title="Forced-colors fallback"
      description="The simulated fallback removes translucent layers and communicates state with system-color boundaries and text. The same policy applies automatically in forced-colors mode."
    >
      <section className="forced-colors-demo is-forced-colors-simulation">
        <button aria-pressed="true" type="button">Selected</button>
        <button autoFocus type="button">Focused</button>
        <button disabled type="button">Disabled</button>
      </section>
    </StoryFrame>
  );
}

function PointerCapabilities() {
  return (
    <StoryFrame
      title="Coarse pointer and no hover"
      description="Hover adds information only when available. Coarse-pointer policy increases the practical target while leaving labels, selection, focus, and press understandable."
    >
      <section className="pointer-demo is-coarse-pointer-simulation">
        <button aria-pressed="true" type="button">Selected action</button>
        <span>48px demonstration target; no hover prerequisite</span>
      </section>
    </StoryFrame>
  );
}

const meta = {
  title: 'Foundation/Interaction State',
  component: IndividualStates,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof IndividualStates>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {};
export const OverlapAndPrecedence: Story = { render: () => <OverlappingStates /> };
export const FocusVisible: Story = { render: () => <FocusChannels /> };
export const SemanticStates: Story = { render: () => <SemanticComposition /> };
export const Disabled: Story = { render: () => <DisabledBehavior /> };
export const ForcedColorsFallback: Story = { render: () => <ForcedColors /> };
export const CoarsePointerAndNoHover: Story = { render: () => <PointerCapabilities /> };
