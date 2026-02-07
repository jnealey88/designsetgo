/**
 * Responsive Visibility Extension - Editor Controls
 *
 * Inspector panel for device visibility toggles.
 * Lazy-loaded to reduce initial bundle size.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

/**
 * Responsive visibility inspector controls
 *
 * @param {Object} props Block props
 */
export default function ResponsiveVisibilityPanel( props ) {
	const { attributes, setAttributes } = props;
	const { dsgoHideOnDesktop, dsgoHideOnTablet, dsgoHideOnMobile } = attributes;

	return (
		<InspectorControls>
			<PanelBody
				title={ __( 'Responsive Visibility', 'designsetgo' ) }
				initialOpen={ false }
			>
				<ToggleControl
					label={ __( 'Hide on Desktop', 'designsetgo' ) }
					help={ __(
						'Hide this block on desktop devices (≥1024px)',
						'designsetgo'
					) }
					checked={ dsgoHideOnDesktop }
					onChange={ ( value ) =>
						setAttributes( { dsgoHideOnDesktop: value } )
					}
					__nextHasNoMarginBottom
				/>
				<ToggleControl
					label={ __( 'Hide on Tablet', 'designsetgo' ) }
					help={ __(
						'Hide this block on tablet devices (768px-1023px)',
						'designsetgo'
					) }
					checked={ dsgoHideOnTablet }
					onChange={ ( value ) =>
						setAttributes( { dsgoHideOnTablet: value } )
					}
					__nextHasNoMarginBottom
				/>
				<ToggleControl
					label={ __( 'Hide on Mobile', 'designsetgo' ) }
					help={ __(
						'Hide this block on mobile devices (<768px)',
						'designsetgo'
					) }
					checked={ dsgoHideOnMobile }
					onChange={ ( value ) =>
						setAttributes( { dsgoHideOnMobile: value } )
					}
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);
}
