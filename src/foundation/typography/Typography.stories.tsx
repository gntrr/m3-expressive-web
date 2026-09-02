import type { CSSProperties, ReactNode } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  createMaterialTypography,
  MATERIAL_EMPHASIZED_TYPOGRAPHY_ROLES,
  MATERIAL_TYPOGRAPHY_ROLES,
  materialTypographyRoleToCssVariable,
  toMaterialTypographyCssVariables,
  type MaterialTypography,
  type MaterialTypographyRoleName,
} from './index.js';
import './Typography.stories.css';

const standardTypography = createMaterialTypography();
const customizedTypography = createMaterialTypography({
  fontFamilies: {
    brand: 'Georgia, Times New Roman, serif',
    plain: 'system-ui, sans-serif',
  },
});

function typographyVariables(typography: MaterialTypography): CSSProperties {
  return toMaterialTypographyCssVariables(typography) as CSSProperties;
}

function roleStyle(role: MaterialTypographyRoleName): CSSProperties {
  return {
    fontFamily: `var(${materialTypographyRoleToCssVariable(role, 'font')})`,
    fontSize: `var(${materialTypographyRoleToCssVariable(role, 'size')})`,
    lineHeight: `var(${materialTypographyRoleToCssVariable(role, 'lineHeight')})`,
    fontWeight: `var(${materialTypographyRoleToCssVariable(role, 'weight')})`,
    letterSpacing: `var(${materialTypographyRoleToCssVariable(role, 'tracking')})`,
  };
}

function StoryFrame({
  children,
  description,
  title,
  typography = standardTypography,
}: {
  children: ReactNode;
  description: string;
  title: string;
  typography?: MaterialTypography;
}) {
  return (
    <main className="typography-story" style={typographyVariables(typography)}>
      <header className="typography-story__header">
        <p className="typography-story__eyebrow">Material 3 foundation</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      {children}
    </main>
  );
}

function TypeSpecimen({ role }: { role: MaterialTypographyRoleName }) {
  const token = standardTypography.roles[role];
  return (
    <article className="type-specimen">
      <p className="type-specimen__role">{role}</p>
      <p className="type-specimen__sample" style={roleStyle(role)}>
        Material makes hierarchy legible.
      </p>
      <p className="type-specimen__metrics">
        {token.fontSize} / {token.lineHeight} · {token.fontWeight} ·{' '}
        {token.letterSpacing}
      </p>
    </article>
  );
}

function StandardScale() {
  return (
    <StoryFrame
      title="Standard type scale"
      description="All 15 baseline Material 3 roles use canonical, scalable web metrics."
    >
      <section className="type-specimen-list" aria-label="Standard typography roles">
        {MATERIAL_TYPOGRAPHY_ROLES.map((role) => (
          <TypeSpecimen key={role} role={role} />
        ))}
      </section>
    </StoryFrame>
  );
}

function EmphasizedScale() {
  return (
    <StoryFrame
      title="Emphasized type scale"
      description="The official static-font web snapshot changes weight while retaining each corresponding role's size, line height, and tracking."
    >
      <section className="type-specimen-list" aria-label="Emphasized typography roles">
        {MATERIAL_EMPHASIZED_TYPOGRAPHY_ROLES.map((role) => (
          <TypeSpecimen key={role} role={role} />
        ))}
      </section>
    </StoryFrame>
  );
}

function HierarchyExample() {
  return (
    <StoryFrame
      title="Semantic hierarchy"
      description="Roles communicate hierarchy; they do not map automatically to HTML elements. Choose semantic markup first."
    >
      <article className="type-article">
        <p style={roleStyle('labelLargeEmphasized')}>FIELD NOTES · WEB TYPOGRAPHY</p>
        <h2 style={roleStyle('displayMedium')}>Type that respects its reader</h2>
        <p style={roleStyle('headlineSmall')}>
          A stable scale creates rhythm without relying on viewport-dependent type.
        </p>
        <p style={roleStyle('bodyLarge')}>
          Material roles describe visual intent while semantic HTML preserves the
          document outline. Browser zoom, user font preferences, and reflow remain
          intact because the scale is expressed in rem units and the library does
          not alter the root font size.
        </p>
      </article>
    </StoryFrame>
  );
}

function FontFamilyExample() {
  return (
    <StoryFrame
      title="Consumer font families"
      description="Custom brand and plain stacks replace only the typeface references; canonical metrics remain unchanged."
      typography={customizedTypography}
    >
      <section className="font-comparison" aria-label="Configured font families">
        <article>
          <p className="type-specimen__role">brand · Georgia fallback stack</p>
          <p style={roleStyle('headlineLarge')}>A distinct editorial voice</p>
        </article>
        <article>
          <p className="type-specimen__role">plain · system UI stack</p>
          <p style={roleStyle('bodyLarge')}>
            Clear supporting text uses the consumer-configured plain family.
          </p>
        </article>
      </section>
    </StoryFrame>
  );
}

function ReflowExample() {
  return (
    <StoryFrame
      title="Zoom and reflow"
      description="Resize this text region or use browser zoom. No role changes at arbitrary viewport breakpoints."
    >
      <article className="reflow-example">
        <h2 style={roleStyle('titleLargeEmphasized')}>A deliberately long heading can wrap naturally</h2>
        <p style={roleStyle('bodyLarge')}>
          Web typography must remain readable when text grows, translations expand,
          or a reader narrows the available line length. The fixed Material role
          retains its semantic scale while ordinary document flow determines the
          number of lines. No content is clipped, and line height remains an
          explicit scalable length.
        </p>
      </article>
    </StoryFrame>
  );
}

const meta = {
  title: 'Foundation/Typography',
  component: StandardScale,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StandardScale>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteStandardScale: Story = {};

export const EmphasizedRoles: Story = {
  render: () => <EmphasizedScale />,
};

export const Hierarchy: Story = {
  render: () => <HierarchyExample />,
};

export const ConfigurableFontFamily: Story = {
  render: () => <FontFamilyExample />,
};

export const ReflowingText: Story = {
  render: () => <ReflowExample />,
};
