/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';

/**
 * Layout Settings Panel Component
 *
 * @param {Object}   props               - Component props
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to set attributes
 * @return {Element} Layout settings panel
 */
export default function LayoutSettingsPanel({ attributes, setAttributes }) {
	const { layoutPreset, overlayOpacity, contentAlignment, visualStyle } =
		attributes;

	const layoutOptions = [
		{
			label: __('Standard (Image Top)', 'designsetgo'),
			value: 'standard',
		},
		{
			label: __('Horizontal (Image Left)', 'designsetgo'),
			value: 'horizontal-left',
		},
		{
			label: __('Horizontal (Image Right)', 'designsetgo'),
			value: 'horizontal-right',
		},
		{
			label: __('Background (Image Behind)', 'designsetgo'),
			value: 'background',
		},
		{
			label: __('Minimal (No Image)', 'designsetgo'),
			value: 'minimal',
		},
		{
			label: __('Featured (Large Image)', 'designsetgo'),
			value: 'featured',
		},
	];

	const alignmentOptions = [
		{ label: __('Left', 'designsetgo'), value: 'left' },
		{ label: __('Center', 'designsetgo'), value: 'center' },
		{ label: __('Right', 'designsetgo'), value: 'right' },
	];

	const visualStyleOptions = [
		{ label: __('Default', 'designsetgo'), value: 'default' },
		{ label: __('Outlined', 'designsetgo'), value: 'outlined' },
		{ label: __('Filled', 'designsetgo'), value: 'filled' },
		{ label: __('Shadow', 'designsetgo'), value: 'shadow' },
		{ label: __('Minimal', 'designsetgo'), value: 'minimal' },
	];

	return (
		<PanelBody title={__('Layout', 'designsetgo')} initialOpen={true}>
			<SelectControl
				label={__('Layout Preset', 'designsetgo')}
				value={layoutPreset}
				options={layoutOptions}
				onChange={(value) => setAttributes({ layoutPreset: value })}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>

			<SelectControl
				label={__('Visual Style', 'designsetgo')}
				value={visualStyle}
				options={visualStyleOptions}
				onChange={(value) => setAttributes({ visualStyle: value })}
				help={__(
					'Choose a visual style for the card appearance.',
					'designsetgo'
				)}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>

			{layoutPreset === 'background' && (
				<>
					<RangeControl
						label={__('Overlay Opacity', 'designsetgo')}
						value={overlayOpacity}
						onChange={(value) =>
							setAttributes({ overlayOpacity: value })
						}
						min={0}
						max={100}
						step={5}
						help={__(
							'Darkens the background image to improve text readability.',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Content Alignment', 'designsetgo')}
						value={contentAlignment}
						options={alignmentOptions}
						onChange={(value) =>
							setAttributes({ contentAlignment: value })
						}
						help={__(
							'Horizontal alignment for content over background image.',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</>
			)}
		</PanelBody>
	);
}
