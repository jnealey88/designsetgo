/**
 * DSG Grid Block - Transforms
 *
 * Allows transforming to/from DSG Section, DSG Row, and legacy Container blocks.
 *
 * @since 1.0.0
 */

const transforms = {
	from: [
		{
			type: 'block',
			blocks: ['designsetgo/stack'],
			transform: (attributes, innerBlocks) => {
				return wp.blocks.createBlock(
					'designsetgo/grid',
					{
						// Preserve all attributes including layout
						...attributes,
						// Set Grid-specific defaults
						rowGap: '',
						columnGap: '',
						desktopColumns: 3,
						tabletColumns: 2,
						mobileColumns: 1,
						alignItems: 'start',
					},
					innerBlocks
				);
			},
		},
		{
			type: 'block',
			blocks: ['designsetgo/flex'],
			transform: (attributes, innerBlocks) => {
				return wp.blocks.createBlock(
					'designsetgo/grid',
					{
						// Preserve all attributes including layout
						...attributes,
						// Remove Flex-specific attributes
						mobileStack: undefined,
						// Set Grid-specific defaults
						rowGap: '',
						columnGap: '',
						desktopColumns: 3,
						tabletColumns: 2,
						mobileColumns: 1,
						alignItems: 'start',
					},
					innerBlocks
				);
			},
		},
		{
			type: 'block',
			blocks: ['designsetgo/container'],
			isMatch: (attributes) => {
				// Only allow transforming grid layout type
				return attributes.layoutType === 'grid';
			},
			transform: (attributes, innerBlocks) => {
				return wp.blocks.createBlock(
					'designsetgo/grid',
					{
						rowGap: '',
						columnGap: '',
						constrainWidth: attributes.constrainWidth,
						contentWidth: attributes.contentWidth,
						desktopColumns: 3,
						tabletColumns: 2,
						mobileColumns: 1,
						alignItems: 'start',
						// Note: gap is handled by WordPress blockGap (in style.spacing.blockGap)
					},
					innerBlocks
				);
			},
		},
	],
	to: [
		{
			type: 'block',
			blocks: ['designsetgo/stack'],
			transform: (attributes, innerBlocks) => {
				return wp.blocks.createBlock(
					'designsetgo/stack',
					{
						// Preserve all attributes including layout
						...attributes,
						// Remove Grid-specific attributes
						desktopColumns: undefined,
						tabletColumns: undefined,
						mobileColumns: undefined,
						rowGap: undefined,
						columnGap: undefined,
						alignItems: undefined,
						textAlign: undefined,
					},
					innerBlocks
				);
			},
		},
		{
			type: 'block',
			blocks: ['designsetgo/flex'],
			transform: (attributes, innerBlocks) => {
				return wp.blocks.createBlock(
					'designsetgo/flex',
					{
						// Preserve all attributes including layout
						...attributes,
						// Remove Grid-specific attributes
						desktopColumns: undefined,
						tabletColumns: undefined,
						mobileColumns: undefined,
						rowGap: undefined,
						columnGap: undefined,
						alignItems: undefined,
						textAlign: undefined,
						// Set Flex-specific defaults
						mobileStack: false,
					},
					innerBlocks
				);
			},
		},
	],
};

export default transforms;
