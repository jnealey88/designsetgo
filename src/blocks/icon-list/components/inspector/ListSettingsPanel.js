/**
 * Icon List - List Settings Panel Component
 *
 * Provides controls for layout, icon size, gap, and columns.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

/**
 * List Settings Panel Component
 *
 * @param {Object}   props               - Component props
 * @param {string}   props.layout        - Current layout type
 * @param {number}   props.iconSize      - Icon size in pixels
 * @param {string}   props.gap           - Gap between items
 * @param {string}   props.iconPosition  - Icon position relative to text
 * @param {number}   props.columns       - Number of columns for grid layout
 * @param {string}   props.alignment     - Alignment for vertical layout
 * @param {Function} props.setAttributes - Function to update attributes
 * @return {JSX.Element} List Settings Panel component
 */
export const ListSettingsPanel = ({
	layout,
	iconSize,
	gap,
	iconPosition,
	columns,
	alignment,
	setAttributes,
}) => {
	return (
		<>
			<PanelBody
				title={__('List Settings', 'designsetgo')}
				initialOpen={true}
			>
				<SelectControl
					label={__('Layout', 'designsetgo')}
					value={layout}
					options={[
						{
							label: __('Vertical', 'designsetgo'),
							value: 'vertical',
						},
						{
							label: __('Horizontal', 'designsetgo'),
							value: 'horizontal',
						},
						{ label: __('Grid', 'designsetgo'), value: 'grid' },
					]}
					onChange={(value) => setAttributes({ layout: value })}
					help={__(
						'Choose how list items are arranged',
						'designsetgo'
					)}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>

				{(layout === 'vertical' || layout === 'horizontal') && (
					<SelectControl
						label={__('Alignment', 'designsetgo')}
						value={alignment}
						options={[
							{ label: __('Left', 'designsetgo'), value: 'left' },
							{
								label: __('Center', 'designsetgo'),
								value: 'center',
							},
							{
								label: __('Right', 'designsetgo'),
								value: 'right',
							},
						]}
						onChange={(value) =>
							setAttributes({ alignment: value })
						}
						help={
							layout === 'vertical'
								? __(
										'Align list items horizontally',
										'designsetgo'
									)
								: __(
										'Distribute items horizontally',
										'designsetgo'
									)
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				)}

				{layout === 'grid' && (
					<RangeControl
						label={__('Columns', 'designsetgo')}
						value={columns}
						onChange={(value) => setAttributes({ columns: value })}
						min={1}
						max={4}
						help={__(
							'Number of columns in grid layout',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				)}

				<SelectControl
					label={__('Icon Position', 'designsetgo')}
					value={iconPosition}
					options={[
						{ label: __('Left', 'designsetgo'), value: 'left' },
						{ label: __('Right', 'designsetgo'), value: 'right' },
						{ label: __('Top', 'designsetgo'), value: 'top' },
					]}
					onChange={(value) => setAttributes({ iconPosition: value })}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Icon Size', 'designsetgo')}
					value={iconSize}
					onChange={(value) => setAttributes({ iconSize: value })}
					min={16}
					max={128}
					help={__('Default icon size for all items', 'designsetgo')}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>

				<UnitControl
					label={__('Gap', 'designsetgo')}
					value={gap}
					onChange={(value) => setAttributes({ gap: value })}
					units={[
						{ value: 'px', label: 'px' },
						{ value: 'em', label: 'em' },
						{ value: 'rem', label: 'rem' },
					]}
					help={__('Space between list items', 'designsetgo')}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</>
	);
};
