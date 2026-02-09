/**
 * Heading Segment Block - Edit Component
 *
 * An inline text span within an Advanced Heading.
 * Each segment supports independent typography controls
 * via WordPress Block Supports, with quick-access font
 * controls in the block toolbar.
 *
 * @since 1.5.0
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	BlockControls,
	useSetting,
} from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarDropdownMenu } from '@wordpress/components';
import { formatBold, typography as typographyIcon } from '@wordpress/icons';

/**
 * Custom SVG icon for text transform control.
 */
const textTransformIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
	>
		<path d="M6.1 6L2 18h2l1.1-3h4.8L11 18h2L8.9 6H6.1zm-.4 7L7.5 8.5 9.3 13H5.7zM19 6h-2l-3 12h2l.7-3h2.6l.7 3h2L19 6zm-1.9 7l.9-4 .9 4h-1.8z" />
	</svg>
);

const FONT_WEIGHTS = [
	{ label: __('Thin (100)', 'designsetgo'), value: '100' },
	{ label: __('Extra Light (200)', 'designsetgo'), value: '200' },
	{ label: __('Light (300)', 'designsetgo'), value: '300' },
	{ label: __('Regular (400)', 'designsetgo'), value: '400' },
	{ label: __('Medium (500)', 'designsetgo'), value: '500' },
	{ label: __('Semi Bold (600)', 'designsetgo'), value: '600' },
	{ label: __('Bold (700)', 'designsetgo'), value: '700' },
	{ label: __('Extra Bold (800)', 'designsetgo'), value: '800' },
	{ label: __('Black (900)', 'designsetgo'), value: '900' },
];

const TEXT_TRANSFORMS = [
	{ label: __('None', 'designsetgo'), value: '' },
	{ label: __('Uppercase', 'designsetgo'), value: 'uppercase' },
	{ label: __('Lowercase', 'designsetgo'), value: 'lowercase' },
	{ label: __('Capitalize', 'designsetgo'), value: 'capitalize' },
];

/**
 * Heading Segment Edit Component
 *
 * @param {Object}   props               - Component props
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @return {JSX.Element} Heading segment edit component
 */
export default function HeadingSegmentEdit({ attributes, setAttributes }) {
	const { content, style, fontFamily } = attributes;

	const fontFamilies = useSetting('typography.fontFamilies');
	const availableFonts = Array.isArray(fontFamilies) ? fontFamilies : [];

	const currentWeight = style?.typography?.fontWeight;
	const currentTransform = style?.typography?.textTransform;

	/**
	 * Update a typography property within the style attribute.
	 *
	 * @param {string}           property - Typography property name
	 * @param {string|undefined} value    - New value, or undefined to remove
	 */
	const updateTypography = (property, value) => {
		const newTypography = { ...(style?.typography || {}) };

		if (value) {
			newTypography[property] = value;
		} else {
			delete newTypography[property];
		}

		setAttributes({
			style: {
				...style,
				typography: newTypography,
			},
		});
	};

	const blockProps = useBlockProps({
		className: 'dsgo-heading-segment',
	});

	return (
		<>
			<BlockControls>
				{availableFonts.length > 0 && (
					<ToolbarGroup>
						<ToolbarDropdownMenu
							icon={typographyIcon}
							label={__('Font Family', 'designsetgo')}
							controls={[
								{
									title: __('Default', 'designsetgo'),
									isActive: !fontFamily,
									onClick: () =>
										setAttributes({
											fontFamily: undefined,
										}),
								},
								...availableFonts.map((ff) => ({
									title: ff.name || ff.slug,
									isActive: fontFamily === ff.slug,
									onClick: () =>
										setAttributes({
											fontFamily:
												fontFamily === ff.slug
													? undefined
													: ff.slug,
										}),
								})),
							]}
						/>
					</ToolbarGroup>
				)}
				<ToolbarGroup>
					<ToolbarDropdownMenu
						icon={formatBold}
						label={__('Font Weight', 'designsetgo')}
						controls={FONT_WEIGHTS.map((w) => ({
							title: w.label,
							isActive: currentWeight === w.value,
							onClick: () =>
								updateTypography(
									'fontWeight',
									currentWeight === w.value
										? undefined
										: w.value
								),
						}))}
					/>
				</ToolbarGroup>
				<ToolbarGroup>
					<ToolbarDropdownMenu
						icon={textTransformIcon}
						label={__('Text Transform', 'designsetgo')}
						controls={TEXT_TRANSFORMS.map((t) => ({
							title: t.label,
							isActive:
								currentTransform === t.value ||
								(!currentTransform && !t.value),
							onClick: () =>
								updateTypography(
									'textTransform',
									t.value || undefined
								),
						}))}
					/>
				</ToolbarGroup>
			</BlockControls>

			<span {...blockProps}>
				<RichText
					tagName="span"
					className="dsgo-heading-segment__text"
					value={content}
					onChange={(newContent) =>
						setAttributes({ content: newContent })
					}
					placeholder={__('Heading text…', 'designsetgo')}
					allowedFormats={[
						'core/bold',
						'core/italic',
						'core/strikethrough',
						'core/superscript',
						'core/subscript',
					]}
				/>
			</span>
		</>
	);
}
