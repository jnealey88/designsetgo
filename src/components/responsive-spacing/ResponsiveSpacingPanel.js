/**
 * Responsive Spacing Panel Component
 *
 * Encapsulates the Responsive Spacing PanelBody with Padding and Margin
 * controls, eliminating duplication across block edit components.
 *
 * @package
 * @since 1.5.0
 */

import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';
import { useCallback } from '@wordpress/element';
import ResponsiveSpacingControl from './ResponsiveSpacingControl';

/**
 * Responsive Spacing Panel with Padding and Margin controls.
 *
 * @param {Object}           props                       Component props
 * @param {Object|undefined} props.style                 Block style attribute
 * @param {Object|undefined} props.dsgoResponsiveSpacing Responsive spacing overrides
 * @param {Function}         props.setAttributes         Block setAttributes function
 * @return {JSX.Element} Panel component
 */
export default function ResponsiveSpacingPanel({
	style,
	dsgoResponsiveSpacing,
	setAttributes,
}) {
	const handleDesktopChange = useCallback(
		(type, values) => {
			setAttributes({
				style: {
					...style,
					spacing: {
						...style?.spacing,
						[type]: values,
					},
				},
			});
		},
		[style, setAttributes]
	);

	const handleResponsiveChange = useCallback(
		(device, type, values) => {
			const updated = {
				...dsgoResponsiveSpacing,
				[device]: {
					...dsgoResponsiveSpacing?.[device],
					[type]: values,
				},
			};
			if (!values) {
				delete updated[device][type];
				if (Object.keys(updated[device]).length === 0) {
					delete updated[device];
				}
			}
			setAttributes({
				dsgoResponsiveSpacing: updated,
			});
		},
		[dsgoResponsiveSpacing, setAttributes]
	);

	return (
		<PanelBody
			title={__('Responsive Spacing', 'designsetgo')}
			initialOpen={false}
		>
			<ResponsiveSpacingControl
				label={__('Padding', 'designsetgo')}
				type="padding"
				desktopValues={style?.spacing?.padding}
				responsiveValues={dsgoResponsiveSpacing}
				onDesktopChange={(values) =>
					handleDesktopChange('padding', values)
				}
				onResponsiveChange={handleResponsiveChange}
			/>
			<ResponsiveSpacingControl
				label={__('Margin', 'designsetgo')}
				type="margin"
				desktopValues={style?.spacing?.margin}
				responsiveValues={dsgoResponsiveSpacing}
				onDesktopChange={(values) =>
					handleDesktopChange('margin', values)
				}
				onResponsiveChange={handleResponsiveChange}
			/>
		</PanelBody>
	);
}
