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
			title={__('Shape & Background', 'designsetgo')}
			initialOpen={false}
		>
			<SelectControl
				label={__('Background Shape', 'designsetgo')}
				value={shape}
				options={[
					{ label: __('None', 'designsetgo'), value: 'none' },
					{ label: __('Circle', 'designsetgo'), value: 'circle' },
					{ label: __('Square', 'designsetgo'), value: 'square' },
					{
						label: __('Rounded Square', 'designsetgo'),
						value: 'rounded',
					},
				]}
				onChange={(value) => setAttributes({ shape: value })}
				help={
					shape === 'none'
						? __(
								'Select a shape to add a background behind the icon.',
								'designsetgo'
							)
						: __(
								'The background color is set in the "Color" panel below.',
								'designsetgo'
							)
				}
			/>

			{shape !== 'none' && (
				<>
					<RangeControl
						label={__('Padding', 'designsetgo')}
						value={shapePadding}
						onChange={(value) =>
							setAttributes({ shapePadding: value })
						}
						min={0}
						max={64}
						step={2}
						help={__(
							'Space between the icon and the shape edge.',
							'designsetgo'
						)}
					/>
					<p className="components-base-control__help">
						{__(
							'💡 Tip: Set the background color using the "Color" panel, and adjust border radius using the "Border" panel.',
							'designsetgo'
						)}
					</p>
				</>
			)}
		</PanelBody>
	);
};
