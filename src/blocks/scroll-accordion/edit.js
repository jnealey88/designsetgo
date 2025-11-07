/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	BlockControls,
} from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { alignLeft, alignCenter, alignRight } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './editor.scss';

/**
 * Edit component for the Scroll Accordion block.
 * Container for sticky stacking accordion items.
 *
 * @param {Object}   props               Component props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to update attributes
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const { alignItems } = attributes;

	// Calculate inner styles declaratively
	const innerStyles = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: alignItems || 'flex-start',
	};

	const blockProps = useBlockProps({
		className: 'dsg-scroll-accordion',
		style: {
			width: '100%',
			alignSelf: 'stretch',
		},
	});

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsg-scroll-accordion__items',
			style: innerStyles,
		},
		{
			allowedBlocks: ['designsetgo/scroll-accordion-item'],
			template: [
				[
					'designsetgo/scroll-accordion-item',
					{
						style: {
							spacing: {
								padding: {
									top: 'var(--wp--preset--spacing--60)',
									right: 'var(--wp--preset--spacing--60)',
									bottom: 'var(--wp--preset--spacing--60)',
									left: 'var(--wp--preset--spacing--60)',
								},
							},
							color: {
								background: '#1e293b',
								text: '#ffffff',
							},
							border: {
								radius: '16px',
							},
						},
						shadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
					},
					[
						[
							'core/heading',
							{
								level: 2,
								content: 'Design Systems',
								style: {
									typography: {
										fontSize: '2.5rem',
										fontWeight: '700',
									},
								},
							},
						],
						[
							'core/paragraph',
							{
								content:
									'Build consistent, scalable interfaces with reusable components and design tokens.',
								style: {
									typography: {
										fontSize: '1.125rem',
									},
									color: {
										text: '#cbd5e1',
									},
								},
							},
						],
					],
				],
				[
					'designsetgo/scroll-accordion-item',
					{
						style: {
							spacing: {
								padding: {
									top: 'var(--wp--preset--spacing--60)',
									right: 'var(--wp--preset--spacing--60)',
									bottom: 'var(--wp--preset--spacing--60)',
									left: 'var(--wp--preset--spacing--60)',
								},
							},
							color: {
								background: '#0f172a',
								text: '#ffffff',
							},
							border: {
								radius: '16px',
							},
						},
						shadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
					},
					[
						[
							'core/heading',
							{
								level: 2,
								content: 'Component Library',
								style: {
									typography: {
										fontSize: '2.5rem',
										fontWeight: '700',
									},
								},
							},
						],
						[
							'core/paragraph',
							{
								content:
									'Pre-built, accessible components that work seamlessly together for rapid development.',
								style: {
									typography: {
										fontSize: '1.125rem',
									},
									color: {
										text: '#cbd5e1',
									},
								},
							},
						],
					],
				],
				[
					'designsetgo/scroll-accordion-item',
					{
						style: {
							spacing: {
								padding: {
									top: 'var(--wp--preset--spacing--60)',
									right: 'var(--wp--preset--spacing--60)',
									bottom: 'var(--wp--preset--spacing--60)',
									left: 'var(--wp--preset--spacing--60)',
								},
							},
							color: {
								background: '#7c3aed',
								text: '#ffffff',
							},
							border: {
								radius: '16px',
							},
						},
						shadow: '0 10px 40px rgba(124, 58, 237, 0.3)',
					},
					[
						[
							'core/heading',
							{
								level: 2,
								content: 'Launch & Scale',
								style: {
									typography: {
										fontSize: '2.5rem',
										fontWeight: '700',
									},
								},
							},
						],
						[
							'core/paragraph',
							{
								content:
									'Deploy with confidence and scale effortlessly with performance-optimized architecture.',
								style: {
									typography: {
										fontSize: '1.125rem',
									},
									color: {
										text: '#ede9fe',
									},
								},
							},
						],
					],
				],
			],
			orientation: 'vertical',
			renderAppender: false,
		}
	);

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={alignLeft}
						label={__('Align items left', 'designsetgo')}
						isPressed={alignItems === 'flex-start'}
						onClick={() =>
							setAttributes({ alignItems: 'flex-start' })
						}
					/>
					<ToolbarButton
						icon={alignCenter}
						label={__('Align items center', 'designsetgo')}
						isPressed={alignItems === 'center'}
						onClick={() => setAttributes({ alignItems: 'center' })}
					/>
					<ToolbarButton
						icon={alignRight}
						label={__('Align items right', 'designsetgo')}
						isPressed={alignItems === 'flex-end'}
						onClick={() =>
							setAttributes({ alignItems: 'flex-end' })
						}
					/>
				</ToolbarGroup>
			</BlockControls>

			<div {...blockProps}>
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}
