/**
 * Divider Block - Edit Component
 *
 * Visual separator with multiple style options including
 * solid, dashed, gradient, and decorative patterns.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';
import { getIcon } from '../icon/utils/svg-icons';
import { IconPicker } from '../icon/components/IconPicker';

/**
 * Divider Edit Component
 *
 * @param {Object}   props               - Component props
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @param {string}   props.clientId      - Block client ID
 * @return {JSX.Element} Divider block edit component
 */
export default function DividerEdit({ attributes, setAttributes, clientId }) {
	const { dividerStyle, width, thickness, iconName } = attributes;

	// Block wrapper props - Block Supports automatically applies color styles
	const blockProps = useBlockProps({
		className: `dsg-divider dsg-divider--${dividerStyle}`,
	});

	// Divider container styles
	const containerStyle = {
		width: `${width}%`,
		margin: '0 auto',
	};

	// Divider line styles
	const lineStyle = {
		height: `${thickness}px`,
	};

	return (
		<>
			{/* ========================================
			     INSPECTOR CONTROLS - SETTINGS TAB
			    ======================================== */}
			<InspectorControls>
				<PanelBody
					title={__('Divider Settings', 'designsetgo')}
					initialOpen={true}
				>
					<SelectControl
						label={__('Style', 'designsetgo')}
						value={dividerStyle}
						options={[
							{
								label: __('Solid', 'designsetgo'),
								value: 'solid',
							},
							{
								label: __('Dashed', 'designsetgo'),
								value: 'dashed',
							},
							{
								label: __('Dotted', 'designsetgo'),
								value: 'dotted',
							},
							{
								label: __('Double', 'designsetgo'),
								value: 'double',
							},
							{
								label: __('Gradient Fade', 'designsetgo'),
								value: 'gradient',
							},
							{
								label: __('Dots Pattern', 'designsetgo'),
								value: 'dots',
							},
							{
								label: __('Wave Pattern', 'designsetgo'),
								value: 'wave',
							},
							{
								label: __('Icon Centered', 'designsetgo'),
								value: 'icon',
							},
						]}
						onChange={(value) =>
							setAttributes({ dividerStyle: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					{dividerStyle === 'icon' && (
						<IconPicker
							label={__('Icon', 'designsetgo')}
							value={iconName}
							onChange={(value) =>
								setAttributes({ iconName: value })
							}
						/>
					)}

					<RangeControl
						label={__('Width (%)', 'designsetgo')}
						value={width}
						onChange={(value) => setAttributes({ width: value })}
						min={10}
						max={100}
						step={5}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					{dividerStyle !== 'icon' && (
						<RangeControl
							label={__('Thickness (px)', 'designsetgo')}
							value={thickness}
							onChange={(value) =>
								setAttributes({ thickness: value })
							}
							min={1}
							max={20}
							step={1}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					)}
				</PanelBody>
			</InspectorControls>

			{/* ========================================
			     BLOCK CONTENT
			    ======================================== */}
			<div {...blockProps}>
				<div className="dsg-divider__container" style={containerStyle}>
					{dividerStyle === 'icon' ? (
						<div className="dsg-divider__icon-wrapper">
							<span
								className="dsg-divider__line dsg-divider__line--left"
								style={lineStyle}
							/>
							<span className="dsg-divider__icon">
								{getIcon(iconName)}
							</span>
							<span
								className="dsg-divider__line dsg-divider__line--right"
								style={lineStyle}
							/>
						</div>
					) : (
						<div className="dsg-divider__line" style={lineStyle} />
					)}
				</div>
			</div>
		</>
	);
}
