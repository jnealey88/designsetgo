/**
 * Container Block - Visibility Panel Component
 *
 * Provides responsive visibility controls (hide on desktop/tablet/mobile).
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl } from '@wordpress/components';

/**
 * Visibility Panel - Controls for responsive visibility.
 *
 * Allows hiding the container on specific devices using CSS media queries.
 *
 * @param {Object}   props               - Component props
 * @param {boolean}  props.hideOnDesktop - Hide on desktop (>1024px)
 * @param {boolean}  props.hideOnTablet  - Hide on tablet (768px-1023px)
 * @param {boolean}  props.hideOnMobile  - Hide on mobile (<768px)
 * @param {Function} props.setAttributes - Function to update block attributes
 * @return {JSX.Element} Visibility Panel component
 */
export const VisibilityPanel = ({
	hideOnDesktop,
	hideOnTablet,
	hideOnMobile,
	setAttributes,
}) => {
	return (
		<PanelBody
			title={__('Responsive Visibility', 'designsetgo')}
			initialOpen={false}
		>
			<ToggleControl
				label={__('Hide on Desktop', 'designsetgo')}
				checked={hideOnDesktop}
				onChange={(value) => setAttributes({ hideOnDesktop: value })}
				help={__(
					'Hide this container on desktop screens (>1024px)',
					'designsetgo'
				)}
				__nextHasNoMarginBottom
			/>

			<ToggleControl
				label={__('Hide on Tablet', 'designsetgo')}
				checked={hideOnTablet}
				onChange={(value) => setAttributes({ hideOnTablet: value })}
				help={__(
					'Hide this container on tablet screens (768px-1023px)',
					'designsetgo'
				)}
				__nextHasNoMarginBottom
			/>

			<ToggleControl
				label={__('Hide on Mobile', 'designsetgo')}
				checked={hideOnMobile}
				onChange={(value) => setAttributes({ hideOnMobile: value })}
				help={__(
					'Hide this container on mobile screens (<768px)',
					'designsetgo'
				)}
				__nextHasNoMarginBottom
			/>
		</PanelBody>
	);
};
