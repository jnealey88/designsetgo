/**
 * Icon Button - Button Settings Panel Component
 *
 * Provides controls for icon and animation settings.
 * Link settings are managed via the inline toolbar (core Button pattern).
 *
 * @since 1.0.0
 */

import { __, sprintf } from '@wordpress/i18n';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
	TextControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { IconPicker } from '../../../icon/components/IconPicker';

/**
 * Button Settings Panel Component
 *
 * @param {Object}   props                   - Component props
 * @param {string}   props.icon              - Selected icon name
 * @param {string}   props.iconPosition      - Icon position (start, end, none)
 * @param {number}   props.iconSize          - Icon size in pixels
 * @param {string}   props.iconGap           - Gap between icon and text
 * @param {string}   props.hoverAnimation    - Hover animation style
 * @param {string}   props.adminDefaultHover - Site-wide default hover animation from admin settings
 * @param {string}   props.modalCloseId      - Modal ID to close (or "true" for parent modal)
 * @param {boolean}  props.isInsideModal     - Whether button is inside a modal
 * @param {Function} props.setAttributes     - Function to update attributes
 * @return {JSX.Element} Button Settings Panel component
 */
export const ButtonSettingsPanel = ({
	icon,
	iconPosition,
	iconSize,
	iconGap,
	hoverAnimation,
	adminDefaultHover,
	modalCloseId,
	isInsideModal,
	setAttributes,
}) => {
	return (
		<>
			<PanelBody
				title={__('Button & Icon Settings', 'designsetgo')}
				initialOpen={true}
			>
				{(() => {
					const adminDefault = adminDefaultHover || 'none';
					const animationLabels = {
						none: __('None', 'designsetgo'),
						'fill-diagonal': __('Fill Diagonal', 'designsetgo'),
						'zoom-in': __('Zoom In', 'designsetgo'),
						'slide-left': __('Slide Left', 'designsetgo'),
						'slide-right': __('Slide Right', 'designsetgo'),
						'slide-down': __('Slide Down', 'designsetgo'),
						'slide-up': __('Slide Up', 'designsetgo'),
						'border-pulse': __('Border Pulse', 'designsetgo'),
						'border-glow': __('Border Glow', 'designsetgo'),
						lift: __('Lift', 'designsetgo'),
						shrink: __('Shrink', 'designsetgo'),
					};
					const defaultLabel =
						adminDefault !== 'none'
							? sprintf(
									/* translators: %s: animation name */
									__('Default (%s)', 'designsetgo'),
									animationLabels[adminDefault] ||
										adminDefault
								)
							: __('Default (None)', 'designsetgo');

					return (
						<SelectControl
							label={__('Hover Animation', 'designsetgo')}
							value={hoverAnimation}
							options={[
								{
									label: defaultLabel,
									value: 'none',
								},
								{
									label: __(
										'None (No Animation)',
										'designsetgo'
									),
									value: 'explicit-none',
								},
								{
									label: __('Fill Diagonal', 'designsetgo'),
									value: 'fill-diagonal',
								},
								{
									label: __('Zoom In', 'designsetgo'),
									value: 'zoom-in',
								},
								{
									label: __('Slide Left', 'designsetgo'),
									value: 'slide-left',
								},
								{
									label: __('Slide Right', 'designsetgo'),
									value: 'slide-right',
								},
								{
									label: __('Slide Down', 'designsetgo'),
									value: 'slide-down',
								},
								{
									label: __('Slide Up', 'designsetgo'),
									value: 'slide-up',
								},
								{
									label: __('Border Pulse', 'designsetgo'),
									value: 'border-pulse',
								},
								{
									label: __('Border Glow', 'designsetgo'),
									value: 'border-glow',
								},
								{
									label: __('Lift', 'designsetgo'),
									value: 'lift',
								},
								{
									label: __('Shrink', 'designsetgo'),
									value: 'shrink',
								},
							]}
							onChange={(value) =>
								setAttributes({
									hoverAnimation: value,
								})
							}
							help={__(
								'Choose a hover animation. "Default" uses the site-wide setting from Settings > Animations.',
								'designsetgo'
							)}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					);
				})()}

				<SelectControl
					label={__('Icon Position', 'designsetgo')}
					value={iconPosition}
					options={[
						{ label: __('Start', 'designsetgo'), value: 'start' },
						{ label: __('End', 'designsetgo'), value: 'end' },
						{ label: __('None', 'designsetgo'), value: 'none' },
					]}
					onChange={(value) => setAttributes({ iconPosition: value })}
					help={__(
						'Position of icon relative to text',
						'designsetgo'
					)}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>

				{iconPosition !== 'none' && (
					<>
						<IconPicker
							value={icon}
							onChange={(value) => setAttributes({ icon: value })}
						/>

						<RangeControl
							label={__('Icon Size', 'designsetgo')}
							value={iconSize}
							onChange={(value) =>
								setAttributes({ iconSize: value })
							}
							min={12}
							max={48}
							help={__('Icon size in pixels', 'designsetgo')}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>

						<UnitControl
							label={__('Icon Gap', 'designsetgo')}
							value={iconGap}
							onChange={(value) =>
								setAttributes({ iconGap: value })
							}
							units={[
								{ value: 'px', label: 'px' },
								{ value: 'em', label: 'em' },
								{ value: 'rem', label: 'rem' },
							]}
							help={__(
								'Space between icon and text',
								'designsetgo'
							)}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					</>
				)}
			</PanelBody>

			<PanelBody
				title={__('Modal Close', 'designsetgo')}
				initialOpen={false}
			>
				<ToggleControl
					label={__('Close modal on click', 'designsetgo')}
					checked={!!modalCloseId}
					onChange={(value) =>
						setAttributes({
							modalCloseId: value ? 'true' : '',
						})
					}
					help={
						isInsideModal
							? __(
									'Close the parent modal when this button is clicked',
									'designsetgo'
								)
							: __(
									'Close a modal when this button is clicked (enter modal ID below)',
									'designsetgo'
								)
					}
					__nextHasNoMarginBottom
				/>

				{modalCloseId && !isInsideModal && (
					<TextControl
						label={__('Modal ID', 'designsetgo')}
						value={modalCloseId === 'true' ? '' : modalCloseId}
						onChange={(value) =>
							setAttributes({
								modalCloseId: value || 'true',
							})
						}
						placeholder={__('Enter modal ID', 'designsetgo')}
						help={__(
							'Enter the ID of the modal to close',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				)}
			</PanelBody>
		</>
	);
};
