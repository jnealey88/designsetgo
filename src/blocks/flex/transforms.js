/**
 * Flex Container Block - Transforms
 *
 * Allows transforming to/from Stack and Grid containers.
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
						gap: attributes.gap,
						constrainWidth: attributes.constrainWidth,
						contentWidth: attributes.contentWidth,
						direction: 'row',
						wrap: true,
						justifyContent: 'flex-start',
						alignItems: 'center',
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
						gap: attributes.gap,
						constrainWidth: attributes.constrainWidth,
						contentWidth: attributes.contentWidth,
						direction: 'row',
						wrap: true,
						justifyContent: 'flex-start',
						alignItems: 'center',
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
						gap: attributes.gap,
						constrainWidth: attributes.constrainWidth,
						contentWidth: attributes.contentWidth,
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
						gap: attributes.gap,
						rowGap: '',
						columnGap: '',
						constrainWidth: attributes.constrainWidth,
						contentWidth: attributes.contentWidth,
						desktopColumns: 3,
						tabletColumns: 2,
						mobileColumns: 1,
						alignItems: 'start',
					},
					innerBlocks
				);
			},
		},
	],
};

export default transforms;
