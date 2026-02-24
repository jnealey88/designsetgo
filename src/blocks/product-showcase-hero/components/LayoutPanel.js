/**
 * Layout Inspector Panel
 *
 * Controls for media position, content alignment, min height, and focal point.
 *
 * @since 2.1.0
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	SelectControl,
	FocalPointPicker,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

/**
 * Layout Panel Component
 *
 * @param {Object}   props               Component props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to set attributes
 * @param {Array}    props.units         Available CSS units
 * @param {string}   props.imageUrl      Product image URL for focal point picker
 * @return {JSX.Element} Layout panel
 */
export default function LayoutPanel({
	attributes,
	setAttributes,
	units,
	imageUrl,
}) {
	const { layout, contentVerticalAlignment, minHeight, mediaFocalPoint } =
		attributes;

	return (
		<PanelBody title={__('Layout', 'designsetgo')} initialOpen={false}>
			<SelectControl
				label={__('Media Position', 'designsetgo')}
				value={layout}
				options={[
					{
						label: __('Left', 'designsetgo'),
						value: 'media-left',
					},
					{
						label: __('Right', 'designsetgo'),
						value: 'media-right',
					},
				]}
				onChange={(value) => setAttributes({ layout: value })}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
			<SelectControl
				label={__('Content Vertical Alignment', 'designsetgo')}
				value={contentVerticalAlignment}
				options={[
					{
						label: __('Top', 'designsetgo'),
						value: 'top',
					},
					{
						label: __('Center', 'designsetgo'),
						value: 'center',
					},
					{
						label: __('Bottom', 'designsetgo'),
						value: 'bottom',
					},
				]}
				onChange={(value) =>
					setAttributes({ contentVerticalAlignment: value })
				}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
			<UnitControl
				label={__('Min Height', 'designsetgo')}
				value={minHeight}
				onChange={(value) => setAttributes({ minHeight: value })}
				units={units}
				__next40pxDefaultSize
			/>
			{imageUrl && (
				<FocalPointPicker
					label={__('Focal Point', 'designsetgo')}
					url={imageUrl}
					value={mediaFocalPoint}
					onChange={(value) =>
						setAttributes({ mediaFocalPoint: value })
					}
				/>
			)}
		</PanelBody>
	);
}
