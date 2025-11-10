/**
 * DSG Row Block - Transforms
 *
 * Allows transforming to/from DSG Section, DSG Grid, and legacy Container blocks.
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
					'designsetgo/flex',
					{
						// Preserve all attributes including layout
						...attributes,
						// mobileStack doesn't exist in Stack, default to false
						mobileStack: false,
					},
					innerBlocks
				);
			},
		},
		{
			type: 'block',
			blocks: ['designsetgo/grid'],
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
						// mobileStack defaults to false
						mobileStack: false,
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
						// Remove mobileStack (Flex-specific)
						mobileStack: undefined,
					},
					innerBlocks
				);
			},
		},
		{
			type: 'block',
			blocks: ['designsetgo/grid'],
			transform: (attributes, innerBlocks) => {
				return wp.blocks.createBlock(
					'designsetgo/grid',
					{
						// Preserve all attributes including layout
						...attributes,
						// Remove mobileStack (Flex-specific)
						mobileStack: undefined,
						// Set Grid-specific defaults
						desktopColumns: 3,
						tabletColumns: 2,
						mobileColumns: 1,
						rowGap: '',
						columnGap: '',
						alignItems: 'start',
					},
					innerBlocks
				);
			},
		},
	],
};

export default transforms;
