/**
 * Icon Button Block - Transforms
 *
 * Allows transforming to core/buttons + core/button for plugin deactivation.
 *
 * @since 1.0.0
 */

const transforms = {
	from: [],
	to: [
		{
			type: 'block',
			blocks: ['core/buttons'],
			transform: (attributes) => {
				const {
					text,
					url,
					linkTarget,
					rel,
					align,
					style,
					backgroundColor,
					textColor,
					fontSize,
					anchor,
				} = attributes;

				// Build core/button attributes
				const buttonAttributes = {
					text,
					...(url && { url }),
					...(linkTarget && linkTarget !== '_self' && { linkTarget }),
					...(rel && { rel }),
					...(backgroundColor && { backgroundColor }),
					...(textColor && { textColor }),
					...(fontSize && { fontSize }),
					...(anchor && { anchor }),
					...(style && { style }),
					// Map full-width alignment to core/button width
					...(align === 'full' && { width: 100 }),
				};

				// Map DSG align to core/buttons layout justifyContent
				const alignToJustify = {
					left: 'left',
					center: 'center',
					right: 'right',
				};
				const justifyContent = alignToJustify[align];

				// core/button must be wrapped in core/buttons
				const innerButton = wp.blocks.createBlock(
					'core/button',
					buttonAttributes
				);

				return wp.blocks.createBlock(
					'core/buttons',
					{
						layout: {
							type: 'flex',
							...(justifyContent && { justifyContent }),
						},
					},
					[innerButton]
				);
			},
		},
	],
};

export default transforms;
