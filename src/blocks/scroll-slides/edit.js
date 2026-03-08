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
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

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
					content: __('Add your slide content here.', 'designsetgo'),
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
					content: __('Add your slide content here.', 'designsetgo'),
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
					content: __('Add your slide content here.', 'designsetgo'),
				},
			],
		],
	],
];

export default function Edit({ attributes, setAttributes, clientId }) {
	const { minHeight } = attributes;
	const [activeSlide, setActiveSlide] = useState(0);

	// Read inner blocks to build nav and show/hide panels
	const { innerBlocks } = useSelect(
		(select) => {
			const { getBlock } = select(blockEditorStore);
			return {
				innerBlocks: getBlock(clientId)?.innerBlocks || [],
			};
		},
		[clientId]
	);

	const { updateBlockAttributes, selectBlock } =
		useDispatch(blockEditorStore);

	// Clamp active slide to valid range when slides are removed
	const clampedActive =
		innerBlocks.length > 0
			? Math.min(activeSlide, innerBlocks.length - 1)
			: 0;

	const blockProps = useBlockProps({
		className: 'dsgo-scroll-slides',
		'data-dsgo-active-slide': clampedActive,
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

	/**
	 * Handle nav heading click — switch active slide and select child block
	 *
	 * @param {number} index Slide index
	 */
	const handleNavClick = (index) => {
		setActiveSlide(index);
		if (innerBlocks[index]) {
			selectBlock(innerBlocks[index].clientId);
		}
	};

	/**
	 * Handle inline editing of nav heading text
	 *
	 * @param {number} index Slide index
	 * @param {string} value New heading text
	 */
	const handleNavHeadingChange = (index, value) => {
		if (innerBlocks[index]) {
			updateBlockAttributes(innerBlocks[index].clientId, {
				navHeading: value,
			});
		}
	};

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
				{/* Navigation — editable headings, click to switch slide */}
				{innerBlocks.length > 0 && (
					<div className="dsgo-scroll-slides__editor-nav">
						{innerBlocks.map((block, index) => (
							<button
								key={block.clientId}
								type="button"
								className={`dsgo-scroll-slides__editor-nav-item${
									index === clampedActive ? ' is-active' : ''
								}`}
								onClick={() => handleNavClick(index)}
							>
								<input
									type="text"
									className="dsgo-scroll-slides__editor-nav-input"
									value={block.attributes.navHeading || ''}
									placeholder={`Slide ${index + 1}`}
									onChange={(e) =>
										handleNavHeadingChange(
											index,
											e.target.value
										)
									}
									onClick={(e) => e.stopPropagation()}
								/>
							</button>
						))}
					</div>
				)}

				{/* Slide panels — all rendered, CSS shows only active */}
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}
