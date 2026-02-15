/**
 * Row Block - Transforms
 *
 * Allows transforming to/from Section, Grid, and legacy Stack/Flex blocks.
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
					'designsetgo/row',
					{
						// Transfer all attributes from legacy Flex block
						...attributes,
					},
					innerBlocks
				);
			},
		},
		{
			type: 'block',
			blocks: ['designsetgo/stack', 'designsetgo/section'],
			transform: (attributes, innerBlocks) => {
				return wp.blocks.createBlock(
					'designsetgo/row',
					{
						// Preserve all attributes including layout
						...attributes,
						// mobileStack doesn't exist in Stack/Section, default to false
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
			blocks: ['designsetgo/section'],
			transform: (attributes, innerBlocks) => {
				return wp.blocks.createBlock(
					'designsetgo/section',
					{
						// Preserve all attributes including layout
						...attributes,
						// Remove mobileStack (Row-specific)
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
						// Remove mobileStack (Row-specific)
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
		{
			type: 'block',
			blocks: ['core/group'],
			transform: (attributes, innerBlocks) => {
				const {
					align,
					tagName,
					style,
					layout: dsgLayout,
					anchor,
					backgroundColor,
					textColor,
					fontSize,
				} = attributes;

				// Map DSG row layout to core/group flex layout
				const layout = {
					type: 'flex',
					flexWrap: dsgLayout?.flexWrap || 'wrap',
					...(dsgLayout?.justifyContent && {
						justifyContent: dsgLayout.justifyContent,
					}),
					...(dsgLayout?.verticalAlignment && {
						verticalAlignment: dsgLayout.verticalAlignment,
					}),
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
