/**
 * Width Panel Component
 *
 * Shared panel for width constraint controls across container blocks.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	ToggleControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

/**
 * Width Panel Component
 *
 * @param {Object}   props                    Component props
 * @param {boolean}  props.constrainWidth     Whether width is constrained
 * @param {string}   props.contentWidth       Custom content width
 * @param {Function} props.setAttributes      Function to update attributes
 * @param {Array}    props.units              Available units for UnitControl
 * @param {string}   props.themeContentWidth  Theme default content width
 * @return {JSX.Element} Width Panel component
 */
export function WidthPanel({
	constrainWidth,
	contentWidth,
	setAttributes,
	units,
	themeContentWidth,
}) {
	return (
		<PanelBody title={__('Width', 'designsetgo')} initialOpen={false}>
			<ToggleControl
				label={__('Constrain Width', 'designsetgo')}
				checked={constrainWidth}
				onChange={(value) => setAttributes({ constrainWidth: value })}
				help={
					constrainWidth
						? __('Content is constrained to max width', 'designsetgo')
						: __('Content uses full container width', 'designsetgo')
				}
				__nextHasNoMarginBottom
			/>

			{constrainWidth && (
				<UnitControl
					label={__('Content Width', 'designsetgo')}
					value={contentWidth}
					onChange={(value) => setAttributes({ contentWidth: value })}
					units={units}
					placeholder={themeContentWidth || '1200px'}
					help={__(
						`Leave empty to use theme default (${themeContentWidth || '1200px'})`,
						'designsetgo'
					)}
					isResetValueOnUnitChange
					__unstableInputWidth="80px"
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			)}
		</PanelBody>
	);
}
