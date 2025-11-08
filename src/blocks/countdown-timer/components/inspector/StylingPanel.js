/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

/**
 * Styling Panel component
 *
 * Controls for spacing between countdown units.
 * Border controls have been moved to Styles tab → Border section.
 *
 * @param {Object}   props               - Component properties
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @return {JSX.Element} Panel component
 */
export default function StylingPanel({ attributes, setAttributes }) {
	const { unitGap, unitPadding } = attributes;

	return (
		<PanelBody title={__('Spacing', 'designsetgo')}>
			<UnitControl
				label={__('Gap Between Units', 'designsetgo')}
				value={unitGap}
				onChange={(value) => setAttributes({ unitGap: value })}
				units={[
					{ value: 'px', label: 'px' },
					{ value: 'rem', label: 'rem' },
					{ value: 'em', label: 'em' },
				]}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>

			<UnitControl
				label={__('Unit Padding', 'designsetgo')}
				value={unitPadding}
				onChange={(value) => setAttributes({ unitPadding: value })}
				units={[
					{ value: 'px', label: 'px' },
					{ value: 'rem', label: 'rem' },
					{ value: 'em', label: 'em' },
				]}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
		</PanelBody>
	);
}
