/**
 * Container Block - Content Width Panel Component
 *
 * Provides controls for constraining content width (centering with max-width).
 *
 * @since 1.0.0
 */

import { __, sprintf } from '@wordpress/i18n';
import { PanelBody, ToggleControl, TextControl } from '@wordpress/components';

/**
 * Content Width Panel - Controls for width constraints.
 *
 * When enabled, centers content with a maximum width. Works with all layout types.
 *
 * @param {Object}   props                 - Component props
 * @param {boolean}  props.constrainWidth  - Whether to constrain content width
 * @param {string}   props.contentWidth    - Maximum content width (e.g., '1200px', '60rem')
 * @param {string}   props.themeContentSize - Theme's content size from theme.json
 * @param {Function} props.setAttributes   - Function to update block attributes
 * @return {JSX.Element} Content Width Panel component
 */
export const ContentWidthPanel = ({
	constrainWidth,
	contentWidth,
	themeContentSize,
	setAttributes,
}) => {
	return (
		<PanelBody
			title={__('Content Width', 'designsetgo')}
			initialOpen={false}
		>
			<ToggleControl
				label={__('Constrain Width', 'designsetgo')}
				checked={constrainWidth}
				onChange={(value) => setAttributes({ constrainWidth: value })}
				help={
					constrainWidth
						? __(
								'Content is centered with max-width',
								'designsetgo'
							)
						: __('Content uses full width', 'designsetgo')
				}
				__nextHasNoMarginBottom
			/>

			{constrainWidth && (
				<TextControl
					label={__('Max Width', 'designsetgo')}
					value={contentWidth}
					onChange={(value) => setAttributes({ contentWidth: value })}
					placeholder={
						themeContentSize ||
						__('e.g., 800px, 60rem', 'designsetgo')
					}
					help={
						themeContentSize
							? sprintf(
									/* translators: %s: theme's content width */
									__(
										'Leave empty to use theme default (%s)',
										'designsetgo'
									),
									themeContentSize
								)
							: __(
									'Maximum content width (e.g., 800px, 60rem)',
									'designsetgo'
								)
					}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			)}
		</PanelBody>
	);
};
