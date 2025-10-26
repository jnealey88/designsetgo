/**
 * Icon Block - Shape Settings Panel Component
 *
 * Provides controls for icon background shape and padding.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';

/**
 * Shape Settings Panel - Controls for icon background shape.
 *
 * Allows selecting a background shape (none, circle, square, rounded)
 * and adjusting padding when a shape is selected.
 *
 * @param {Object} props - Component props
 * @param {string} props.shape - Background shape
 * @param {number} props.shapePadding - Shape padding in pixels
 * @param {Function} props.setAttributes - Function to update block attributes
 * @return {JSX.Element} Shape Settings Panel component
 */
export const ShapeSettingsPanel = ({
	shape,
	shapePadding,
	setAttributes,
}) => {
	return (
		<PanelBody
			title={__('Shape Settings', 'designsetgo')}
			initialOpen={false}
		>
			<SelectControl
				label={__('Background Shape', 'designsetgo')}
				value={shape}
				options={[
					{ label: __('None', 'designsetgo'), value: 'none' },
					{ label: __('Circle', 'designsetgo'), value: 'circle' },
					{ label: __('Square', 'designsetgo'), value: 'square' },
					{ label: __('Rounded', 'designsetgo'), value: 'rounded' },
				]}
				onChange={(value) => setAttributes({ shape: value })}
			/>

			{shape !== 'none' && (
				<RangeControl
					label={__('Shape Padding', 'designsetgo')}
					value={shapePadding}
					onChange={(value) =>
						setAttributes({ shapePadding: value })
					}
					min={0}
					max={64}
					step={2}
				/>
			)}
		</PanelBody>
	);
};
