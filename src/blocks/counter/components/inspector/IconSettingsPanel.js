/**
 * Counter Block - Icon Settings Panel Component
 *
 * Provides controls for showing/hiding icon and selecting icon type and position.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, SelectControl } from '@wordpress/components';

/**
 * Icon Settings Panel - Controls for counter icon.
 *
 * @param {Object}   props               - Component props
 * @param {boolean}  props.showIcon      - Whether to show icon
 * @param {string}   props.icon          - Icon type (star, trophy, heart, etc.)
 * @param {string}   props.iconPosition  - Icon position (top, left, right)
 * @param {Function} props.setAttributes - Function to update block attributes
 * @return {JSX.Element} Icon Settings Panel component
 */
export const IconSettingsPanel = ({
	showIcon,
	icon,
	iconPosition,
	setAttributes,
}) => {
	return (
		<PanelBody
			title={__('Icon Settings', 'designsetgo')}
			initialOpen={false}
		>
			<ToggleControl
				label={__('Show Icon', 'designsetgo')}
				checked={showIcon}
				onChange={(value) => setAttributes({ showIcon: value })}
				help={
					showIcon
						? __('Icon is displayed', 'designsetgo')
						: __('No icon displayed', 'designsetgo')
				}
			/>

			{showIcon && (
				<>
					<SelectControl
						label={__('Icon', 'designsetgo')}
						value={icon}
						options={[
							{ label: __('Star', 'designsetgo'), value: 'star' },
							{
								label: __('Trophy', 'designsetgo'),
								value: 'trophy',
							},
							{
								label: __('Heart', 'designsetgo'),
								value: 'heart',
							},
							{
								label: __('Check', 'designsetgo'),
								value: 'check',
							},
							{
								label: __('Dollar', 'designsetgo'),
								value: 'dollar',
							},
							{
								label: __('Users', 'designsetgo'),
								value: 'users',
							},
							{
								label: __('Chart', 'designsetgo'),
								value: 'chart',
							},
							{
								label: __('Rocket', 'designsetgo'),
								value: 'rocket',
							},
						]}
						onChange={(value) => setAttributes({ icon: value })}
					/>

					<SelectControl
						label={__('Icon Position', 'designsetgo')}
						value={iconPosition}
						options={[
							{ label: __('Top', 'designsetgo'), value: 'top' },
							{ label: __('Left', 'designsetgo'), value: 'left' },
							{
								label: __('Right', 'designsetgo'),
								value: 'right',
							},
						]}
						onChange={(value) =>
							setAttributes({ iconPosition: value })
						}
					/>
				</>
			)}
		</PanelBody>
	);
};
