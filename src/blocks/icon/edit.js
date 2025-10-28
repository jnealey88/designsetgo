/**
 * Icon Block - Edit Component
 *
 * Display inline SVG icons with customizable styling.
 * No external dependencies - works everywhere!
 *
 * @since 1.0.0
 */

import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	ToggleControl,
	TextControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalToggleGroupControl as ToggleGroupControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { getIcon } from './utils/svg-icons';
import { IconPicker } from './components/IconPicker';

/**
 * Edit component
 *
 * @param {Object}   props               - Component props
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @return {JSX.Element} Edit component
 */
export default function IconEdit({ attributes, setAttributes }) {
	const { icon, iconSize, rotation, linkUrl, linkTarget } = attributes;

	const blockProps = useBlockProps({
		className: 'dsg-icon',
		style: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
	});

	// Icon wrapper styles
	const iconWrapperStyle = {
		width: `${iconSize}px`,
		height: `${iconSize}px`,
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Icon', 'designsetgo')} initialOpen={true}>
					<IconPicker
						value={icon}
						onChange={(value) => setAttributes({ icon: value })}
					/>
					<RangeControl
						label={__('Icon Size', 'designsetgo')}
						value={iconSize}
						onChange={(value) => setAttributes({ iconSize: value })}
						min={16}
						max={200}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<ToggleGroupControl
						label={__('Rotation', 'designsetgo')}
						value={rotation}
						onChange={(value) =>
							setAttributes({ rotation: Number(value) })
						}
						isBlock
					>
						<ToggleGroupControlOption value="0" label="0°" />
						<ToggleGroupControlOption value="90" label="90°" />
						<ToggleGroupControlOption value="180" label="180°" />
						<ToggleGroupControlOption value="270" label="270°" />
					</ToggleGroupControl>
				</PanelBody>

				<PanelBody
					title={__('Link', 'designsetgo')}
					initialOpen={false}
				>
					<TextControl
						label={__('URL', 'designsetgo')}
						value={linkUrl}
						onChange={(value) => setAttributes({ linkUrl: value })}
						placeholder="https://example.com"
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					{linkUrl && (
						<ToggleControl
							label={__('Open in new tab', 'designsetgo')}
							checked={linkTarget === '_blank'}
							onChange={(value) =>
								setAttributes({
									linkTarget: value ? '_blank' : '_self',
									linkRel: value ? 'noopener noreferrer' : '',
								})
							}
							__nextHasNoMarginBottom
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div style={iconWrapperStyle}>{getIcon(icon)}</div>
			</div>
		</>
	);
}
