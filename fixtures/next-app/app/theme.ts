import {
  toMaterialColorCss,
} from 'm3-expressive-web/foundation/color';
import {
  createMaterialColorScheme,
} from 'm3-expressive-web/foundation/color/generator';
import {
  createMaterialTypography,
  toMaterialTypographyCss,
} from 'm3-expressive-web/foundation/typography';
import { toMaterialShapeCss } from 'm3-expressive-web/foundation/shape';
import { toMaterialElevationCss } from 'm3-expressive-web/foundation/elevation';
import { toMaterialStateCss } from 'm3-expressive-web/foundation/state';

const themeSelector = '[data-m3-theme]';

const light = createMaterialColorScheme({
  seed: '#6750A4',
  variant: 'expressive',
  contrastLevel: 0,
  mode: 'light',
});

const dark = createMaterialColorScheme({
  seed: '#6750A4',
  variant: 'expressive',
  contrastLevel: 0,
  mode: 'dark',
});

export const themeCss = [
  toMaterialColorCss(light, { selector: '[data-m3-theme="light"]' }),
  toMaterialColorCss(dark, { selector: '[data-m3-theme="dark"]' }),
  toMaterialTypographyCss(createMaterialTypography(), { selector: themeSelector }),
  toMaterialShapeCss({ selector: themeSelector }),
  toMaterialElevationCss({ selector: themeSelector }),
  toMaterialStateCss({ selector: themeSelector }),
].join('\n');
