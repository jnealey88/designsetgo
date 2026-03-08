/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const { navHeading } = attributes;

	const blockProps = useBlockProps({
		className: 'dsgo-scroll-slide',
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: [
			['core/image'],
			[
				'core/heading',
				{
					level: 3,
					placeholder: __('Slide title…', 'designsetgo'),
				},
			],
			[
				'core/paragraph',
				{
					placeholder: __('Slide description…', 'designsetgo'),
				},
			],
		],
		templateLock: false,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Slide Settings', 'designsetgo')}
					initialOpen={true}
				>
					<TextControl
						label={__('Navigation Heading', 'designsetgo')}
						value={navHeading}
						onChange={(value) =>
							setAttributes({ navHeading: value })
						}
						help={__(
							'Displayed in the slide navigation on the frontend',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<div {...innerBlocksProps} />
		</>
	);
}
