/**
 * Section Block - Transforms
 *
 * Allows transforming to/from Row, Grid, and legacy Stack/Flex blocks.
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
					'designsetgo/section',
					{
						// Transfer all attributes from legacy Stack block
						...attributes,
					},
					innerBlocks
				);
			},
		},
		{
			type: 'block',
			blocks: ['designsetgo/flex', 'designsetgo/row'],
			transform: (attributes, innerBlocks) => {
				return wp.blocks.createBlock(
					'designsetgo/section',
					{
						// Preserve all attributes including layout
						...attributes,
						// Remove mobileStack (Flex/Row-specific)
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
					'designsetgo/section',
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
	],
	to: [
		{
			type: 'block',
			blocks: ['designsetgo/row'],
			transform: (attributes, innerBlocks) => {
				return wp.blocks.createBlock(
					'designsetgo/row',
					{
						// Preserve all attributes including layout
						...attributes,
						// mobileStack defaults to false
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
					'designsetgo/grid',
					{
						// Preserve all attributes including layout
						...attributes,
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
