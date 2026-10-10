import { useState, type CSSProperties, type ReactNode } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import {
  createMaterialTypography,
  toMaterialColorCssVariables,
  toMaterialElevationCssVariables,
  toMaterialElevationShadowCssVariables,
  toMaterialShapeCssVariables,
  toMaterialStateCssVariables,
  toMaterialTypographyCssVariables,
} from '../../foundation/index.js';
import { createMaterialColorScheme } from '../../foundation/color/generator.js';
import { InputChip } from './InputChip.js';
import './input-chip.css';
import './InputChip.stories.css';

const sharedVariables = {
  ...toMaterialTypographyCssVariables(createMaterialTypography()),
  ...toMaterialShapeCssVariables(),
  ...toMaterialElevationCssVariables(),
  ...toMaterialElevationShadowCssVariables(),
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

function CloseIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24">
      <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M5 20c.8-3.1 3.1-5 7-5s6.2 1.9 7 5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

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
      className="input-chip-story"
      data-mode={mode}
      style={mode === 'dark' ? darkVariables : lightVariables}
    >
      <div className="input-chip-story__header">
        <p className="input-chip-story__eyebrow">Material 3 InputChip</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}

function CallbackExample() {
  const [bodyCalls, setBodyCalls] = useState(0);
  const [removeCalls, setRemoveCalls] = useState(0);
  return (
    <StoryFrame
      title="Independent body and removal actions"
      description="The optional body command and required remove action are sibling native buttons. Their callbacks and hover, focus, and pressed layers remain region-local."
    >
      <div className="input-chip-story__row">
        <InputChip
          label="Mina Chen"
          onClick={() => setBodyCalls((value) => value + 1)}
          onRemove={() => setRemoveCalls((value) => value + 1)}
          removeIcon={<CloseIcon />}
          rootProps={{ 'data-testid': 'interactive-chip' }}
        />
        <output>Body: {bodyCalls} · Remove: {removeCalls}</output>
      </div>
    </StoryFrame>
  );
}

function FormExample() {
  const [submissions, setSubmissions] = useState(0);
  const [removals, setRemovals] = useState(0);
  return (
    <StoryFrame
      title="Form behavior stays local to the body action"
      description="The body defaults to type=button but can explicitly submit or reset. The remove button is always type=button."
    >
      <form
        className="input-chip-story__form"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmissions((value) => value + 1);
        }}
      >
        <div className="input-chip-story__row">
          <InputChip label="Neutral" onRemove={() => setRemovals((value) => value + 1)} removeIcon={<CloseIcon />} />
          <InputChip
            bodyButtonProps={{ type: 'submit' }}
            label="Submit recipient"
            onClick={() => undefined}
            onRemove={() => setRemovals((value) => value + 1)}
            removeIcon={<CloseIcon />}
          />
        </div>
        <output>Submissions: {submissions} · Removals: {removals}</output>
      </form>
    </StoryFrame>
  );
}

const meta = {
  title: 'Components/Chip/InputChip',
  component: InputChip,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    label: 'Mina Chen',
    onRemove: () => undefined,
    removeIcon: <CloseIcon />,
  },
} satisfies Meta<typeof InputChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RemoveOnly: Story = {
  render: () => (
    <StoryFrame
      title="Remove-only InputChip"
      description="Without a body callback, the visible label is a static decorative body and only the explicitly named remove button is tabbable."
    >
      <InputChip label="Mina Chen" onRemove={() => undefined} removeIcon={<CloseIcon />} />
    </StoryFrame>
  ),
};

export const BodyAndRemove: Story = {
  render: () => <CallbackExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = canvas.getByRole('button', { name: 'Mina Chen' });
    const remove = canvas.getByRole('button', { name: 'Remove Mina Chen' });
    await userEvent.click(body);
    await expect(canvas.getByText('Body: 1 · Remove: 0')).toBeVisible();
    await userEvent.click(remove);
    await expect(canvas.getByText('Body: 1 · Remove: 1')).toBeVisible();
  },
};

export const LeadingVisuals: Story = {
  render: () => (
    <StoryFrame
      title="Avatar or decorative leading icon"
      description="Avatar and leadingIcon are mutually exclusive. Both stay decorative so they cannot compete with the body or remove accessible name."
    >
      <div className="input-chip-story__row">
        <InputChip
          avatar={<PersonIcon />}
          label="Mina Chen"
          onClick={() => undefined}
          onRemove={() => undefined}
          removeIcon={<CloseIcon />}
        />
        <InputChip
          label="Project Aurora"
          leadingIcon={<PersonIcon />}
          onRemove={() => undefined}
          removeIcon={<CloseIcon />}
        />
      </div>
    </StoryFrame>
  ),
};

export const CustomRemoval: Story = {
  render: () => (
    <StoryFrame
      title="Required custom remove visual and label"
      description="The consumer supplies the visual icon. removeLabel is a complete localized accessible-name replacement rather than an automatic prefix."
    >
      <InputChip
        label="Mina Chen"
        onRemove={() => undefined}
        removeIcon={<PersonIcon />}
        removeLabel="Delete Mina Chen from recipients"
      />
    </StoryFrame>
  ),
};

export const BodyDisabled: Story = {
  render: () => (
    <StoryFrame
      title="Only the body command is unavailable"
      description="Native disabled state applies only to the optional body button. The removal action remains enabled and the chip does not receive whole-control opacity."
    >
      <InputChip
        bodyDisabled
        label="Mina Chen"
        onClick={() => undefined}
        onRemove={() => undefined}
        removeIcon={<CloseIcon />}
      />
    </StoryFrame>
  ),
};

export const KeyboardAndForms: Story = { render: () => <FormExample /> };

export const LightAndDark: Story = {
  render: () => (
    <div className="input-chip-story__theme-pair">
      <StoryFrame title="Light scheme" description="The transparent container consumes semantic foundation roles.">
        <InputChip label="Mina Chen" onRemove={() => undefined} removeIcon={<CloseIcon />} />
      </StoryFrame>
      <StoryFrame mode="dark" title="Dark scheme" description="The same InputChip renderer inherits the dark generated scheme.">
        <InputChip label="Mina Chen" onRemove={() => undefined} removeIcon={<CloseIcon />} />
      </StoryFrame>
    </div>
  ),
};

export const PlatformBehavior: Story = {
  render: () => (
    <StoryFrame
      title="Reflow, RTL, target guidance, and forced colors"
      description="The baseline visual block is 32px, including an approximately 32px remove target with an 18px icon. Parent layout owns non-overlapping touch-target spacing; reduced motion has no animation to suppress."
    >
      <div className="input-chip-story__platform-grid">
        <section>
          <h2>Long label / zoom</h2>
          <InputChip
            label="Mina Chen, product design and accessibility reviewer"
            onClick={() => undefined}
            onRemove={() => undefined}
            removeIcon={<CloseIcon />}
            rootProps={{ className: 'input-chip-story__long-label' }}
          />
        </section>
        <section dir="rtl">
          <h2>RTL</h2>
          <InputChip label="مينا تشين" onRemove={() => undefined} removeIcon={<CloseIcon />} />
        </section>
        <section className="input-chip-story__forced-preview">
          <h2>Forced colors</h2>
          <InputChip label="System recipient" onRemove={() => undefined} removeIcon={<CloseIcon />} />
        </section>
      </div>
    </StoryFrame>
  ),
};

export const AccessibilityGuidance: Story = {
  render: () => (
    <StoryFrame
      title="No selection or nested-control contract"
      description="InputChip has no selected state, aria-pressed, elevated variant, remove-disabled mode, or nested controls. Invalid blank-label, avatar-plus-icon, body-name-without-action, and nested-button examples are documentation-only."
    >
      <InputChip
        aria-label="Open Mina's profile"
        label="Mina Chen"
        onClick={() => undefined}
        onRemove={() => undefined}
        removeIcon={<CloseIcon />}
      />
    </StoryFrame>
  ),
};
