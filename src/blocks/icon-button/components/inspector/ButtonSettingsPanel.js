/**
 * Icon Button - Button Settings Panel Component
 *
 * Provides controls for button text, link, and icon settings.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	TextControl,
	SelectControl,
	RangeControl,
	ToggleControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { IconPicker } from '../../../icon/components/IconPicker';

/**
 * Button Settings Panel Component
 *
 * @param {Object}   props                - Component props
 * @param {string}   props.url            - Button URL
 * @param {string}   props.linkTarget     - Link target (_self, _blank)
 * @param {string}   props.rel            - Link rel attribute
 * @param {string}   props.icon           - Selected icon name
 * @param {string}   props.iconPosition   - Icon position (start, end, none)
 * @param {number}   props.iconSize       - Icon size in pixels
 * @param {string}   props.iconGap        - Gap between icon and text
 * @param {string}   props.hoverAnimation - Hover animation style
 * @param {string}   props.modalCloseId   - Modal ID to close (or "true" for parent modal)
 * @param {boolean}  props.isInsideModal  - Whether button is inside a modal
 * @param {Function} props.setAttributes  - Function to update attributes
 * @return {JSX.Element} Button Settings Panel component
 */
export const ButtonSettingsPanel = ({
	url,
	linkTarget,
	rel,
	icon,
	iconPosition,
	iconSize,
	iconGap,
	hoverAnimation,
	modalCloseId,
	isInsideModal,
	setAttributes,
}) => {
	return (
		<>
			<PanelBody
				title={__('Link Settings', 'designsetgo')}
				initialOpen={true}
			>
				<TextControl
					label={__('URL', 'designsetgo')}
					value={url}
					onChange={(value) => setAttributes({ url: value })}
					placeholder="https://"
					help={__('Enter the link URL', 'designsetgo')}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					label={__('Open in new tab', 'designsetgo')}
					checked={linkTarget === '_blank'}
					onChange={(value) =>
						setAttributes({
							linkTarget: value ? '_blank' : '_self',
							rel: value ? 'noopener noreferrer' : '',
						})
					}
					__nextHasNoMarginBottom
				/>

				{linkTarget === '_blank' && (
					<TextControl
						label={__('Link Rel', 'designsetgo')}
						value={rel}
						onChange={(value) => setAttributes({ rel: value })}
						help={__(
							'Rel attribute for security (default: noopener noreferrer)',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				)}
			</PanelBody>

			<PanelBody
				title={__('Button & Icon Settings', 'designsetgo')}
				initialOpen={true}
			>
				<SelectControl
					label={__('Hover Animation', 'designsetgo')}
					value={hoverAnimation}
					options={[
						{ label: __('None', 'designsetgo'), value: 'none' },
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
						setAttributes({ hoverAnimation: value })
					}
					help={__(
						'Choose a hover animation effect for the button',
						'designsetgo'
					)}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>

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
