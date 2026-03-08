/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import './editor.scss';

const ALLOWED_BLOCKS = ['designsetgo/scroll-slide'];

const TEMPLATE = [
	[
		'designsetgo/scroll-slide',
		{
			navHeading: __('Slide 1', 'designsetgo'),
		},
		[
			['core/image'],
			[
				'core/heading',
				{
					level: 3,
					content: __('Slide 1', 'designsetgo'),
				},
			],
			[
				'core/paragraph',
				{
					content: __(
						'Add your slide content here.',
						'designsetgo'
					),
				},
			],
		],
	],
	[
		'designsetgo/scroll-slide',
		{
			navHeading: __('Slide 2', 'designsetgo'),
		},
		[
			['core/image'],
			[
				'core/heading',
				{
					level: 3,
					content: __('Slide 2', 'designsetgo'),
				},
			],
			[
				'core/paragraph',
				{
					content: __(
						'Add your slide content here.',
						'designsetgo'
					),
				},
			],
		],
	],
	[
		'designsetgo/scroll-slide',
		{
			navHeading: __('Slide 3', 'designsetgo'),
		},
		[
			['core/image'],
			[
				'core/heading',
				{
					level: 3,
					content: __('Slide 3', 'designsetgo'),
				},
			],
			[
				'core/paragraph',
				{
					content: __(
						'Add your slide content here.',
						'designsetgo'
					),
				},
			],
		],
	],
];

export default function Edit({ attributes, setAttributes, clientId }) {
	const { minHeight } = attributes;

	// Read inner blocks to build nav preview
	const { innerBlocks } = useSelect(
		(select) => {
			const { getBlock } = select(blockEditorStore);
			return {
				innerBlocks: getBlock(clientId)?.innerBlocks || [],
			};
		},
		[clientId]
	);

	const blockProps = useBlockProps({
		className: 'dsgo-scroll-slides',
	});

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsgo-scroll-slides__editor-panels',
		},
		{
			allowedBlocks: ALLOWED_BLOCKS,
			template: TEMPLATE,
			orientation: 'vertical',
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Scroll Slides Settings', 'designsetgo')}
					initialOpen={true}
				>
					<TextControl
						label={__('Minimum Height', 'designsetgo')}
						value={minHeight}
						onChange={(value) =>
							setAttributes({ minHeight: value })
						}
						help={__(
							'Height of the pinned section (e.g., 100vh, 80vh, 600px)',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{/* Nav preview */}
				{innerBlocks.length > 0 && (
					<div className="dsgo-scroll-slides__nav-preview">
						{innerBlocks.map((block, index) => (
							<span
								key={block.clientId}
								className={`dsgo-scroll-slides__nav-preview-item${
									index === 0 ? ' is-active' : ''
								}`}
							>
								{block.attributes.navHeading ||
									`Slide ${index + 1}`}
							</span>
						))}
					</div>
				)}

				{/* Slide panels */}
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}
