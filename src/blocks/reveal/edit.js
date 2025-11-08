/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';

/**
 * Edit component for Reveal block
 *
 * @param {Object}   root0               - Component props.
 * @param {Object}   root0.attributes    - Block attributes.
 * @param {Function} root0.setAttributes - Function to set block attributes.
 */
export default function Edit({ attributes, setAttributes }) {
	const { revealAnimation, revealDuration } = attributes;

	const blockProps = useBlockProps({
		className: 'dsg-reveal-container',
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		renderAppender: false,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Reveal Settings', 'designsetgo')}
					initialOpen={true}
				>
					<SelectControl
						label={__('Animation Type', 'designsetgo')}
						value={revealAnimation}
						options={[
							{
								label: __('Fade', 'designsetgo'),
								value: 'fade',
							},
							{
								label: __('Slide Up', 'designsetgo'),
								value: 'slide-up',
							},
							{
								label: __('Slide Down', 'designsetgo'),
								value: 'slide-down',
							},
							{
								label: __('Scale', 'designsetgo'),
								value: 'scale',
							},
						]}
						onChange={(value) =>
							setAttributes({ revealAnimation: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Animation Duration (ms)', 'designsetgo')}
						value={revealDuration}
						onChange={(value) =>
							setAttributes({ revealDuration: value })
						}
						min={100}
						max={1000}
						step={50}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<div {...innerBlocksProps} />
		</>
	);
}
