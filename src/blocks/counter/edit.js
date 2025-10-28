/**
 * Counter Block - Edit Component (Refactored for Maintainability)
 *
 * Individual counter item that displays an animated counting number.
 * Gets animation and formatting settings from parent Counter Group.
 *
 * File size: ~120 lines (down from 357 lines in index.js - 66% reduction!)
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	PanelColorSettings,
	// WordPress 6.5+ - useSettings (plural) replaces useSetting (singular)
	useSettings,
} from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';

// Extracted Inspector Panel Components
import { CounterSettingsPanel } from './components/inspector/CounterSettingsPanel';
import { LabelSettingsPanel } from './components/inspector/LabelSettingsPanel';
import { IconSettingsPanel } from './components/inspector/IconSettingsPanel';
import { AnimationPanel } from './components/inspector/AnimationPanel';

// Extracted Utilities
import { formatCounterValue } from './utils/number-formatter';
import { getIconSvg } from './utils/icon-library';

/**
 * Counter Edit Component
 *
 * @param {Object}   props               - Component props
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @param {Object}   props.context       - Block context from parent Counter Group
 * @return {JSX.Element} Counter block edit component
 */
export default function CounterEdit({ attributes, setAttributes, context }) {
	const {
		uniqueId,
		startValue,
		endValue,
		decimals,
		prefix,
		suffix,
		label,
		showIcon,
		icon,
		iconPosition,
		overrideAnimation,
		customDuration,
		customDelay,
		customEasing,
		hoverColor,
	} = attributes;

	// Get theme color palette (WordPress 6.5+ - useSettings returns array)
	const [colorSettings] = useSettings('color.palette');

	// Get formatting settings from parent Counter Group context (with fallback defaults)
	const parentUseGrouping =
		context?.['designsetgo/counterGroup/useGrouping'] ?? true;
	const parentSeparator =
		context?.['designsetgo/counterGroup/separator'] || ',';
	const parentDecimal = context?.['designsetgo/counterGroup/decimal'] || '.';
	const parentHoverColor =
		context?.['designsetgo/counterGroup/hoverColor'] || '';

	// Get theme accent-2 color as default
	const themeColors = colorSettings?.theme || [];
	const accent2Color = themeColors.find((color) => color.slug === 'accent-2');
	const defaultHoverColor = accent2Color?.color || '';

	// Determine effective hover color: individual override > parent > theme accent-2
	const effectiveHoverColor =
		hoverColor || parentHoverColor || defaultHoverColor;

	// Generate unique ID on mount (acceptable use of useEffect for ID generation)
	useEffect(() => {
		if (!uniqueId) {
			setAttributes({
				uniqueId: `counter-${Math.random().toString(36).substr(2, 9)}`,
			});
		}
	}, [uniqueId, setAttributes]);

	// Calculate display value using extracted utility
	const displayValue = formatCounterValue(endValue, {
		prefix,
		suffix,
		decimals,
		useGrouping: parentUseGrouping,
		separator: parentSeparator,
		decimal: parentDecimal,
	});

	// Block wrapper props
	const blockProps = useBlockProps({
		className: 'dsg-counter',
		style: {
			textAlign: 'center',
			// Apply effective hover color as CSS custom property
			...(effectiveHoverColor && {
				'--dsg-counter-hover-color': effectiveHoverColor,
			}),
		},
	});

	return (
		<>
			{/* ========================================
			     INSPECTOR CONTROLS
			    ======================================== */}
			<InspectorControls>
				<CounterSettingsPanel
					startValue={startValue}
					endValue={endValue}
					decimals={decimals}
					prefix={prefix}
					suffix={suffix}
					setAttributes={setAttributes}
				/>

				<LabelSettingsPanel
					label={label}
					setAttributes={setAttributes}
				/>

				<IconSettingsPanel
					showIcon={showIcon}
					icon={icon}
					iconPosition={iconPosition}
					setAttributes={setAttributes}
				/>

				<AnimationPanel
					overrideAnimation={overrideAnimation}
					customDuration={customDuration}
					customDelay={customDelay}
					customEasing={customEasing}
					context={context}
					setAttributes={setAttributes}
				/>

				<PanelColorSettings
					title={__('Hover Color', 'designsetgo')}
					colorSettings={[
						{
							value: hoverColor,
							onChange: (value) =>
								setAttributes({ hoverColor: value || '' }),
							label: __('Number Hover Color', 'designsetgo'),
							colors: colorSettings,
						},
					]}
					initialOpen={false}
				>
					<p className="components-base-control__help">
						{parentHoverColor
							? __(
									'Override parent group hover color. Leave empty to use group setting.',
									'designsetgo'
								)
							: __(
									'Color for counter number on hover. Leave empty to use theme accent color.',
									'designsetgo'
								)}
					</p>
				</PanelColorSettings>
			</InspectorControls>

			{/* ========================================
			     BLOCK CONTENT
			    ======================================== */}
			<div {...blockProps}>
				{/* Icon (if enabled and position is top) */}
				{showIcon && iconPosition === 'top' && (
					<div className="dsg-counter__icon dsg-counter__icon--top">
						{getIconSvg(icon)}
					</div>
				)}

				<div className={`dsg-counter__content icon-${iconPosition}`}>
					{/* Icon (if enabled and position is left) */}
					{showIcon && iconPosition === 'left' && (
						<div className="dsg-counter__icon dsg-counter__icon--left">
							{getIconSvg(icon)}
						</div>
					)}

					{/* Number */}
					<div className="dsg-counter__number">{displayValue}</div>

					{/* Icon (if enabled and position is right) */}
					{showIcon && iconPosition === 'right' && (
						<div className="dsg-counter__icon dsg-counter__icon--right">
							{getIconSvg(icon)}
						</div>
					)}
				</div>

				{/* Label */}
				{label && <div className="dsg-counter__label">{label}</div>}
			</div>
		</>
	);
}
