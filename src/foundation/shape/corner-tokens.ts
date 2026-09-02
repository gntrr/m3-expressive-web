import type {
  MaterialLogicalCorners,
  MaterialShapeCornerDefinition,
  MaterialShapeCornerDefinitions,
  MaterialShapeCornerRole,
  MaterialShapeCssLength,
  MaterialShapeGeneration,
} from './types.js';

function freezeCorners(corners: MaterialLogicalCorners): MaterialLogicalCorners {
  return Object.freeze(corners);
}

function uniformCorners(value: MaterialShapeCssLength): MaterialLogicalCorners {
  return freezeCorners({
    topStart: value,
    topEnd: value,
    bottomEnd: value,
    bottomStart: value,
  });
}

function corner(
  role: MaterialShapeCornerRole,
  corners: MaterialLogicalCorners,
  generation: MaterialShapeGeneration = 'baseline',
): MaterialShapeCornerDefinition {
  return Object.freeze({ role, corners, generation, classification: 'canonical' });
}

export const MATERIAL_SHAPE_CORNERS = Object.freeze({
  none: corner('none', uniformCorners('0px')),
  extraSmall: corner('extraSmall', uniformCorners('4px')),
  extraSmallTop: corner(
    'extraSmallTop',
    freezeCorners({
      topStart: '4px',
      topEnd: '4px',
      bottomEnd: '0px',
      bottomStart: '0px',
    }),
  ),
  small: corner('small', uniformCorners('8px')),
  medium: corner('medium', uniformCorners('12px')),
  large: corner('large', uniformCorners('16px')),
  largeIncreased: corner(
    'largeIncreased',
    uniformCorners('20px'),
    'expressive',
  ),
  largeStart: corner(
    'largeStart',
    freezeCorners({
      topStart: '16px',
      topEnd: '0px',
      bottomEnd: '0px',
      bottomStart: '16px',
    }),
    'expressive',
  ),
  largeEnd: corner(
    'largeEnd',
    freezeCorners({
      topStart: '0px',
      topEnd: '16px',
      bottomEnd: '16px',
      bottomStart: '0px',
    }),
  ),
  largeTop: corner(
    'largeTop',
    freezeCorners({
      topStart: '16px',
      topEnd: '16px',
      bottomEnd: '0px',
      bottomStart: '0px',
    }),
  ),
  extraLarge: corner('extraLarge', uniformCorners('28px')),
  extraLargeIncreased: corner(
    'extraLargeIncreased',
    uniformCorners('32px'),
    'expressive',
  ),
  extraLargeTop: corner(
    'extraLargeTop',
    freezeCorners({
      topStart: '28px',
      topEnd: '28px',
      bottomEnd: '0px',
      bottomStart: '0px',
    }),
  ),
  extraExtraLarge: corner(
    'extraExtraLarge',
    uniformCorners('48px'),
    'expressive',
  ),
  full: corner('full', uniformCorners('9999px')),
} satisfies MaterialShapeCornerDefinitions);
