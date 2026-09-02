import type { CSSProperties, ReactNode } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  MATERIAL_ADAPTIVE_LAYOUT_WEB_POLICY,
  MATERIAL_HEIGHT_CLASS_NAMES,
  MATERIAL_WIDTH_CLASS_NAMES,
  materialCanonicalLayouts,
  materialContainerQueries,
  materialMediaQueries,
  materialWindowSizeClasses,
  toMaterialAdaptiveLayoutCssVariables,
  type MaterialHeightClassName,
  type MaterialWidthClassName,
} from './index.js';
import './AdaptiveLayout.stories.css';

function layoutVariables(): CSSProperties {
  return toMaterialAdaptiveLayoutCssVariables() as CSSProperties;
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
    <main className="adaptive-story" style={layoutVariables()}>
      <header className="adaptive-story__header">
        <p className="adaptive-story__eyebrow">Material 3 foundation</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      {children}
    </main>
  );
}

function readableName(name: MaterialWidthClassName | MaterialHeightClassName): string {
  return name === 'extraLarge' ? 'extra-large' : name;
}

function rangeLabel({
  minDp,
  maxExclusiveDp,
}: {
  minDp: number;
  maxExclusiveDp: number | null;
}): string {
  if (minDp === 0) return `< ${maxExclusiveDp}dp`;
  if (maxExclusiveDp === null) return `≥ ${minDp}dp`;
  return `${minDp}–<${maxExclusiveDp}dp`;
}

function WidthClasses() {
  return (
    <StoryFrame
      title="Window width classes"
      description="Five current classes describe available width, not a phone, tablet, or desktop identity. The lower-bound markers are exact."
    >
      <section className="width-scale" aria-label="Material window width classes">
        {MATERIAL_WIDTH_CLASS_NAMES.map((name) => {
          const definition = materialWindowSizeClasses.width[name];
          return (
            <article className={`width-class width-class--${readableName(name)}`} key={name}>
              <strong>{readableName(name)}</strong>
              <span>{rangeLabel(definition)}</span>
              <code>{materialMediaQueries.width[name]}</code>
            </article>
          );
        })}
      </section>
    </StoryFrame>
  );
}

function ExactThresholds() {
  return (
    <StoryFrame
      title="Exact width and height thresholds"
      description="Width and height resolve independently. Compact height is meaningful even when width is medium or larger."
    >
      <div className="threshold-tables">
        <table>
          <caption>Width classes</caption>
          <thead><tr><th>Class</th><th>Canonical dp</th><th>Translated CSS condition</th></tr></thead>
          <tbody>
            {MATERIAL_WIDTH_CLASS_NAMES.map((name) => (
              <tr key={name}>
                <th scope="row">{readableName(name)}</th>
                <td>{rangeLabel(materialWindowSizeClasses.width[name])}</td>
                <td><code>{materialMediaQueries.width[name]}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
        <table>
          <caption>Height classes</caption>
          <thead><tr><th>Class</th><th>Canonical dp</th><th>Translated CSS condition</th></tr></thead>
          <tbody>
            {MATERIAL_HEIGHT_CLASS_NAMES.map((name) => (
              <tr key={name}>
                <th scope="row">{name}</th>
                <td>{rangeLabel(materialWindowSizeClasses.height[name])}</td>
                <td><code>{materialMediaQueries.height[name]}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </StoryFrame>
  );
}

function ResizableBoundaryDemo() {
  return (
    <StoryFrame
      title="Resize across boundaries"
      description="Drag the lower-right edge. The preview is selected entirely by an inline-size container query using the same five thresholds."
    >
      <section className="resize-stage" aria-label="Resizable container query demonstration">
        <div className="resize-stage__container">
          <div className="resize-stage__preview" aria-hidden="true">
            <span className="resize-stage__pane" />
            <span className="resize-stage__pane" />
            <span className="resize-stage__pane" />
          </div>
        </div>
        <code>compact 600 · medium 840 · expanded 1200 · large 1600</code>
      </section>
    </StoryFrame>
  );
}

function ViewportAndContainer() {
  return (
    <StoryFrame
      title="Viewport versus container adaptation"
      description="Both regions share one viewport. Each composition responds to its own available inline size, which prevents reusable layouts from inheriting an unrelated page breakpoint."
    >
      <section className="container-comparison">
        <article className="container-example container-example--narrow">
          <div className="container-example__content" aria-label="Narrow embedded composition">
            <span>List</span><span>Detail</span>
          </div>
          <code>{materialContainerQueries.width.compact}</code>
        </article>
        <article className="container-example container-example--wide">
          <div className="container-example__content" aria-label="Wide embedded composition">
            <span>List</span><span>Detail</span>
          </div>
          <code>{materialContainerQueries.width.expanded}</code>
        </article>
      </section>
    </StoryFrame>
  );
}

function CanonicalLayouts() {
  return (
    <StoryFrame
      title="Canonical layout intent"
      description="Canonical layouts specify content relationships and adaptation intent. They do not prescribe reusable React components or one universal grid."
    >
      <section className="canonical-grid">
        <article>
          <div className="canonical-visual canonical-visual--feed" aria-hidden="true">
            <i /><i /><i /><i /><i /><i />
          </div>
          <h2>Feed</h2>
          <p>{materialCanonicalLayouts.feed.expandedAndAbove}</p>
        </article>
        <article>
          <div className="canonical-visual canonical-visual--list-detail" aria-hidden="true">
            <i /><i />
          </div>
          <h2>List-detail</h2>
          <p>{materialCanonicalLayouts.listDetail.expandedAndAbove}</p>
        </article>
        <article>
          <div className="canonical-visual canonical-visual--supporting" aria-hidden="true">
            <i /><i />
          </div>
          <h2>Supporting pane</h2>
          <p>{materialCanonicalLayouts.supportingPane.expandedAndAbove}</p>
        </article>
      </section>
    </StoryFrame>
  );
}

function NavigationPolicy() {
  return (
    <StoryFrame
      title="Adaptive navigation is policy"
      description="Current adaptive defaults favor bottom navigation when width or height is compact, and side navigation otherwise. A drawer remains an application decision."
    >
      <section className="navigation-policy">
        <article>
          <strong>Compact width</strong>
          <div className="navigation-frame navigation-frame--bar" aria-hidden="true"><i /><span /></div>
          <span>Bottom navigation</span>
        </article>
        <article>
          <strong>Compact height or tabletop</strong>
          <div className="navigation-frame navigation-frame--bar" aria-hidden="true"><i /><span /></div>
          <span>Bottom navigation</span>
        </article>
        <article>
          <strong>Otherwise</strong>
          <div className="navigation-frame navigation-frame--rail" aria-hidden="true"><i /><span /></div>
          <span>Side navigation</span>
        </article>
        <aside>
          <strong>Drawer?</strong>
          <p>Decide from destination count, hierarchy, and remaining content width—not width class alone.</p>
        </aside>
      </section>
    </StoryFrame>
  );
}

function BrowserConsiderations() {
  return (
    <StoryFrame
      title="Web adaptation contract"
      description="CSS-driven composition avoids hydration mismatch and keeps zoom, resizing, embedded contexts, writing direction, and print under browser control."
    >
      <ul className="web-policy-list">
        {MATERIAL_ADAPTIVE_LAYOUT_WEB_POLICY.requirements.map((requirement) => (
          <li key={requirement}>{requirement}</li>
        ))}
      </ul>
    </StoryFrame>
  );
}

const meta = {
  title: 'Foundation/Adaptive Layout',
  component: WidthClasses,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof WidthClasses>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WindowWidthClasses: Story = {};
export const WidthAndHeightThresholds: Story = { render: () => <ExactThresholds /> };
export const ResizingAcrossBoundaries: Story = { render: () => <ResizableBoundaryDemo /> };
export const ViewportVersusContainer: Story = { render: () => <ViewportAndContainer /> };
export const CanonicalLayoutIntent: Story = { render: () => <CanonicalLayouts /> };
export const AdaptiveNavigationPolicy: Story = { render: () => <NavigationPolicy /> };
export const BrowserAndZoomPolicy: Story = { render: () => <BrowserConsiderations /> };
