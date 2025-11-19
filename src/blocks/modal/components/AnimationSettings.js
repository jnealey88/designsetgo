/**
 * Animation Settings Panel Component
 *
 * @package DesignSetGo
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl, SelectControl } from '@wordpress/components';

export default function AnimationSettings({ attributes, setAttributes }) {
	const { animationType, animationDuration } = attributes;

	return (
		<PanelBody title={__('Animation', 'designsetgo')} initialOpen={false}>
			<SelectControl
				label={__('Animation Type', 'designsetgo')}
				value={animationType}
				onChange={(value) => setAttributes({ animationType: value })}
				options={[
					{ label: __('Fade', 'designsetgo'), value: 'fade' },
					{ label: __('Slide Up', 'designsetgo'), value: 'slide-up' },
					{
						label: __('Slide Down', 'designsetgo'),
						value: 'slide-down',
					},
					{ label: __('Zoom In', 'designsetgo'), value: 'zoom' },
					{ label: __('None', 'designsetgo'), value: 'none' },
				]}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>

			<RangeControl
				label={__('Animation Duration (ms)', 'designsetgo')}
				value={animationDuration}
				onChange={(value) => setAttributes({ animationDuration: value })}
				min={0}
				max={1000}
				step={50}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
		</PanelBody>
	);
}
