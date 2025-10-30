/**
 * Stack Container Block - Transforms
 *
 * Allows transforming to/from Flex, Grid, and legacy Container blocks.
 *
 * @since 1.0.0
 */

const transforms = {
	from: [
		{
			type: 'block',
			blocks: ['designsetgo/flex'],
			transform: (attributes, innerBlocks) => {
				return wp.blocks.createBlock(
					'designsetgo/stack',
					{
						alignItems: 'flex-start',
						constrainWidth: attributes.constrainWidth,
						contentWidth: attributes.contentWidth,
						// Note: gap is handled by WordPress blockGap (in style.spacing.blockGap)
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
					'designsetgo/stack',
					{
						alignItems: 'flex-start',
						constrainWidth: attributes.constrainWidth,
						contentWidth: attributes.contentWidth,
						// Note: gap is handled by WordPress blockGap (in style.spacing.blockGap)
					},
					innerBlocks
				);
			},
		},
		{
			type: 'block',
			blocks: ['designsetgo/container'],
			isMatch: (attributes) => {
				// Only allow transforming stack layout type
				return attributes.layoutType === 'stack';
			},
			transform: (attributes, innerBlocks) => {
				return wp.blocks.createBlock(
					'designsetgo/stack',
					{
						alignItems: 'flex-start',
						constrainWidth: attributes.constrainWidth,
						contentWidth: attributes.contentWidth,
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
			blocks: ['designsetgo/flex'],
			transform: (attributes, innerBlocks) => {
				return wp.blocks.createBlock(
					'designsetgo/flex',
					{
						constrainWidth: attributes.constrainWidth,
						contentWidth: attributes.contentWidth,
						direction: 'row',
						wrap: true,
						justifyContent: 'flex-start',
						alignItems: 'center',
						mobileStack: false,
						// Note: gap is handled by WordPress blockGap (in style.spacing.blockGap)
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
};

export default transforms;
