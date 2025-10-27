/**
 * Container Block - Layout Panel Component
 *
 * Provides controls for selecting layout type.
 * Block spacing is handled by WordPress's native blockGap control.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, Tooltip } from '@wordpress/components';
import { __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

/**
 * Layout Panel - Controls for layout type selection.
 *
 * @param {Object} props - Component props
 * @param {string} props.layoutType - Current layout type ('stack', 'grid', 'flex')
 * @param {Function} props.setAttributes - Function to update block attributes
 * @return {JSX.Element} Layout Panel component
 */
export const LayoutPanel = ({ layoutType, setAttributes }) => {
	return (
		<PanelBody title={__('Layout', 'designsetgo')} initialOpen={true}>
			<ToggleGroupControl
				label={__('Layout Type', 'designsetgo')}
				value={layoutType}
				onChange={(value) => setAttributes({ layoutType: value })}
				isBlock
			>
				<Tooltip text={__('Stack (Vertical)', 'designsetgo')}>
					<ToggleGroupControlOption
						value="stack"
						label={
							<svg
								width="20"
								height="20"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<rect x="3" y="3" width="14" height="2" />
								<rect x="3" y="9" width="14" height="2" />
								<rect x="3" y="15" width="14" height="2" />
							</svg>
						}
						aria-label={__('Stack (Vertical)', 'designsetgo')}
					/>
				</Tooltip>
				<Tooltip text={__('Grid', 'designsetgo')}>
					<ToggleGroupControlOption
						value="grid"
						label={
							<svg
								width="20"
								height="20"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<rect x="2" y="2" width="7" height="7" />
								<rect x="11" y="2" width="7" height="7" />
								<rect x="2" y="11" width="7" height="7" />
								<rect x="11" y="11" width="7" height="7" />
							</svg>
						}
						aria-label={__('Grid', 'designsetgo')}
					/>
				</Tooltip>
				<Tooltip text={__('Flex (Horizontal)', 'designsetgo')}>
					<ToggleGroupControlOption
						value="flex"
						label={
							<svg
								width="20"
								height="20"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<rect x="2" y="3" width="5" height="14" />
								<rect x="8" y="3" width="5" height="14" />
								<rect x="14" y="3" width="4" height="14" />
							</svg>
						}
						aria-label={__('Flex (Horizontal)', 'designsetgo')}
					/>
				</Tooltip>
			</ToggleGroupControl>
		</PanelBody>
	);
};
