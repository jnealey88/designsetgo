/**
 * Close Button Settings Panel Component
 *
 * @package DesignSetGo
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';

export default function CloseButtonSettings({ attributes, setAttributes }) {
	const { showCloseButton, closeButtonPosition, closeButtonSize } =
		attributes;

	return (
		<PanelBody
			title={__('Close Button', 'designsetgo')}
			initialOpen={false}
		>
			<ToggleControl
				label={__('Show Close Button', 'designsetgo')}
				checked={showCloseButton}
				onChange={(value) => setAttributes({ showCloseButton: value })}
				__nextHasNoMarginBottom
			/>

			{showCloseButton && (
				<>
					<SelectControl
						label={__('Position', 'designsetgo')}
						value={closeButtonPosition}
						onChange={(value) =>
							setAttributes({ closeButtonPosition: value })
						}
						options={[
							{
								label: __('Top Right', 'designsetgo'),
								value: 'top-right',
							},
							{
								label: __('Top Left', 'designsetgo'),
								value: 'top-left',
							},
							{
								label: __('Inside Top Right', 'designsetgo'),
								value: 'inside-top-right',
							},
							{
								label: __('Inside Top Left', 'designsetgo'),
								value: 'inside-top-left',
							},
						]}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Button Size (px)', 'designsetgo')}
						value={closeButtonSize}
						onChange={(value) =>
							setAttributes({ closeButtonSize: value })
						}
						min={16}
						max={48}
						step={2}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</>
			)}
		</PanelBody>
	);
}
