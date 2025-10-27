/**
 * Counter Group Block - Edit Component
 *
 * Parent block that contains individual Counter blocks
 * Provides layout controls and global animation settings
 */

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	TextControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

import metadata from './block.json';
import save from './save';
import { ICON_COLOR } from '../shared/constants';
import './editor.scss';
import './style.scss';

/**
 * Edit component
 *
 * @param {Object}   props               - Component props
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @return {JSX.Element} Counter Group edit component
 */
function CounterGroupEdit({ attributes, setAttributes }) {
	const {
		columns,
		columnsTablet,
		columnsMobile,
		gap,
		alignContent,
		animationDuration,
		animationDelay,
		animationEasing,
		useGrouping,
		separator,
		decimal,
	} = attributes;

	// Block wrapper props
	const blockProps = useBlockProps({
		className: 'dsg-counter-group',
		style: {
			// Cast to string to prevent React from adding "px" suffix
			'--dsg-counter-columns-desktop': String(columns),
			'--dsg-counter-columns-tablet': String(columnsTablet),
			'--dsg-counter-columns-mobile': String(columnsMobile),
			'--dsg-counter-gap': gap,
		},
	});

	// Inner blocks configuration
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: `dsg-counter-group__inner align-${alignContent}`,
		},
		{
			allowedBlocks: ['designsetgo/counter'],
			template: [
				[
					'designsetgo/counter',
					{
						endValue: 500,
						suffix: '+',
						label: __('Happy Customers', 'designsetgo'),
					},
				],
				[
					'designsetgo/counter',
					{
						prefix: '$',
						endValue: 1000,
						suffix: 'K+',
						label: __('Revenue Generated', 'designsetgo'),
					},
				],
				[
					'designsetgo/counter',
					{
						endValue: 99.9,
						decimals: 1,
						suffix: '%',
						label: __('Uptime', 'designsetgo'),
					},
				],
			],
			orientation: 'horizontal',
		}
	);

	return (
		<>
			<InspectorControls>
				{/* Layout Settings */}
				<PanelBody
					title={__('Layout Settings', 'designsetgo')}
					initialOpen={true}
				>
					<RangeControl
						label={__('Columns (Desktop)', 'designsetgo')}
						value={columns}
						onChange={(value) => setAttributes({ columns: value })}
						min={1}
						max={6}
						help={__('>1024px', 'designsetgo')}
					/>

					<RangeControl
						label={__('Columns (Tablet)', 'designsetgo')}
						value={columnsTablet}
						onChange={(value) =>
							setAttributes({ columnsTablet: value })
						}
						min={1}
						max={columns}
						help={__('768px - 1023px', 'designsetgo')}
					/>

					<RangeControl
						label={__('Columns (Mobile)', 'designsetgo')}
						value={columnsMobile}
						onChange={(value) =>
							setAttributes({ columnsMobile: value })
						}
						min={1}
						max={columnsTablet}
						help={__('<768px', 'designsetgo')}
					/>

					<UnitControl
						label={__('Gap', 'designsetgo')}
						value={gap}
						onChange={(value) => setAttributes({ gap: value })}
						units={[
							{ value: 'px', label: 'px' },
							{ value: 'rem', label: 'rem' },
							{ value: 'em', label: 'em' },
						]}
					/>

					<SelectControl
						label={__('Content Alignment', 'designsetgo')}
						value={alignContent}
						options={[
							{ label: __('Left', 'designsetgo'), value: 'left' },
							{
								label: __('Center', 'designsetgo'),
								value: 'center',
							},
							{
								label: __('Right', 'designsetgo'),
								value: 'right',
							},
						]}
						onChange={(value) =>
							setAttributes({ alignContent: value })
						}
					/>
				</PanelBody>

				{/* Animation Settings */}
				<PanelBody
					title={__('Animation Settings', 'designsetgo')}
					initialOpen={false}
				>
					<RangeControl
						label={__(
							'Animation Duration (seconds)',
							'designsetgo'
						)}
						value={animationDuration}
						onChange={(value) =>
							setAttributes({ animationDuration: value })
						}
						min={0.5}
						max={5}
						step={0.1}
						help={__(
							'How long the count animation takes',
							'designsetgo'
						)}
					/>

					<RangeControl
						label={__('Animation Delay (seconds)', 'designsetgo')}
						value={animationDelay}
						onChange={(value) =>
							setAttributes({ animationDelay: value })
						}
						min={0}
						max={2}
						step={0.1}
						help={__(
							'Delay before animation starts',
							'designsetgo'
						)}
					/>

					<SelectControl
						label={__('Easing Function', 'designsetgo')}
						value={animationEasing}
						options={[
							{
								label: __('Ease Out Quad', 'designsetgo'),
								value: 'easeOutQuad',
							},
							{
								label: __('Ease Out Cubic', 'designsetgo'),
								value: 'easeOutCubic',
							},
							{
								label: __('Ease In Out', 'designsetgo'),
								value: 'easeInOutQuad',
							},
							{
								label: __('Linear', 'designsetgo'),
								value: 'linear',
							},
						]}
						onChange={(value) =>
							setAttributes({ animationEasing: value })
						}
						help={__('Animation timing curve', 'designsetgo')}
					/>
				</PanelBody>

				{/* Number Formatting */}
				<PanelBody
					title={__('Number Formatting', 'designsetgo')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Use Thousands Separator', 'designsetgo')}
						checked={useGrouping}
						onChange={(value) =>
							setAttributes({ useGrouping: value })
						}
						help={__(
							'Format numbers like "1,000" or "1000"',
							'designsetgo'
						)}
					/>

					{useGrouping && (
						<TextControl
							label={__('Thousands Separator', 'designsetgo')}
							value={separator}
							onChange={(value) =>
								setAttributes({ separator: value })
							}
							help={__(
								'Character for thousands (e.g., "," or ".")',
								'designsetgo'
							)}
						/>
					)}

					<TextControl
						label={__('Decimal Point', 'designsetgo')}
						value={decimal}
						onChange={(value) => setAttributes({ decimal: value })}
						help={__(
							'Character for decimals (e.g., "." or ",")',
							'designsetgo'
						)}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}

/**
 * Register block
 */
registerBlockType(metadata.name, {
	...metadata,
	icon: {
		src: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
			</svg>
		),
		foreground: ICON_COLOR,
	},
	edit: CounterGroupEdit,
	save,
});
