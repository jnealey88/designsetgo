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
			blocks: ['designsetgo/section'],
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
			blocks: ['designsetgo/row'],
			transform: (attributes, innerBlocks) => {
				return wp.blocks.createBlock(
					'designsetgo/grid',
					{
						// Preserve all attributes including layout
						...attributes,
						// Remove Row-specific attributes
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
			blocks: ['designsetgo/section'],
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
		{
			type: 'block',
			blocks: ['designsetgo/row'],
			transform: (attributes, innerBlocks) => {
				return wp.blocks.createBlock(
					'designsetgo/row',
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
						// Set Row-specific defaults
						mobileStack: false,
					},
					innerBlocks
				);
			},
		},
		{
			type: 'block',
			blocks: ['core/group'],
			transform: (attributes, innerBlocks) => {
				const {
					align,
					tagName,
					desktopColumns,
					style,
					anchor,
					backgroundColor,
					textColor,
					fontSize,
				} = attributes;

				// Map DSG grid to core/group grid layout (WP 6.5+)
				// On WP < 6.5, core/group will ignore the grid layout
				// type and fall back to default (flow) layout
				const layout = {
					type: 'grid',
					columnCount: desktopColumns || 3,
				};

				return wp.blocks.createBlock(
					'core/group',
					{
						align,
						tagName: tagName || 'div',
						layout,
						style,
						...(anchor && { anchor }),
						...(backgroundColor && { backgroundColor }),
						...(textColor && { textColor }),
						...(fontSize && { fontSize }),
					},
					innerBlocks
				);
			},
		},
	],
};

export default transforms;
