/**
 * Counter Block - Edit Component
 *
 * Individual counter item that displays an animated counting number
 * Gets animation and formatting settings from parent Counter Group
 */

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	TextControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';

import metadata from './block.json';
import save from './save';
import './editor.scss';
import './style.scss';

/**
 * Edit component
 */
function CounterEdit({ attributes, setAttributes, context }) {
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
	} = attributes;

	// Get settings from parent Counter Group context (with fallback defaults)
	const parentDuration = context?.['designsetgo/counterGroup/animationDuration'] || 2;
	const parentDelay = context?.['designsetgo/counterGroup/animationDelay'] || 0;
	const parentEasing = context?.['designsetgo/counterGroup/animationEasing'] || 'easeOutQuad';
	const parentUseGrouping = context?.['designsetgo/counterGroup/useGrouping'] ?? true;
	const parentSeparator = context?.['designsetgo/counterGroup/separator'] || ',';
	const parentDecimal = context?.['designsetgo/counterGroup/decimal'] || '.';

	// Generate unique ID on mount
	useEffect(() => {
		if (!uniqueId) {
			setAttributes({
				uniqueId: `counter-${Math.random().toString(36).substr(2, 9)}`,
			});
		}
	}, []);

	// Format number for display (mimics frontend formatting)
	const formatNumber = (value) => {
		const formatted = value.toFixed(decimals);
		const parts = formatted.split('.');

		// Add thousands separator if enabled
		if (parentUseGrouping) {
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, parentSeparator || ',');
		}

		// Join with decimal point
		return parts.join(parentDecimal || '.');
	};

	// Calculate display value
	const displayValue = `${prefix || ''}${formatNumber(endValue)}${suffix || ''}`;

	// Block wrapper props
	const blockProps = useBlockProps({
		className: 'dsg-counter',
		style: {
			textAlign: 'center',
		},
	});

	return (
		<>
			<InspectorControls>
				{/* Counter Settings */}
				<PanelBody title={__('Counter Settings', 'designsetgo')} initialOpen={true}>
					<RangeControl
						label={__('Start Value', 'designsetgo')}
						value={startValue}
						onChange={(value) => setAttributes({ startValue: value })}
						min={0}
						max={endValue}
						help={__('Number to count from', 'designsetgo')}
					/>

					<TextControl
						label={__('End Value', 'designsetgo')}
						type="number"
						value={endValue}
						onChange={(value) => setAttributes({ endValue: parseFloat(value) || 0 })}
						help={__('Final number to display', 'designsetgo')}
					/>

					<RangeControl
						label={__('Decimal Places', 'designsetgo')}
						value={decimals}
						onChange={(value) => setAttributes({ decimals: value })}
						min={0}
						max={3}
						help={__('Number of decimal places', 'designsetgo')}
					/>

					<TextControl
						label={__('Prefix', 'designsetgo')}
						value={prefix}
						onChange={(value) => setAttributes({ prefix: value })}
						placeholder="$"
						help={__('Text before number (e.g., "$", "€")', 'designsetgo')}
					/>

					<TextControl
						label={__('Suffix', 'designsetgo')}
						value={suffix}
						onChange={(value) => setAttributes({ suffix: value })}
						placeholder="+"
						help={__('Text after number (e.g., "+", "%", "K")', 'designsetgo')}
					/>
				</PanelBody>

				{/* Label Settings */}
				<PanelBody title={__('Label Settings', 'designsetgo')} initialOpen={true}>
					<TextControl
						label={__('Label', 'designsetgo')}
						value={label}
						onChange={(value) => setAttributes({ label: value })}
						placeholder={__('Enter label...', 'designsetgo')}
						help={__('Description text below counter', 'designsetgo')}
					/>
				</PanelBody>

				{/* Icon Settings */}
				<PanelBody title={__('Icon Settings', 'designsetgo')} initialOpen={false}>
					<ToggleControl
						label={__('Show Icon', 'designsetgo')}
						checked={showIcon}
						onChange={(value) => setAttributes({ showIcon: value })}
					/>

					{showIcon && (
						<>
							<SelectControl
								label={__('Icon', 'designsetgo')}
								value={icon}
								options={[
									{ label: __('Star', 'designsetgo'), value: 'star' },
									{ label: __('Trophy', 'designsetgo'), value: 'trophy' },
									{ label: __('Heart', 'designsetgo'), value: 'heart' },
									{ label: __('Check', 'designsetgo'), value: 'check' },
									{ label: __('Dollar', 'designsetgo'), value: 'dollar' },
									{ label: __('Users', 'designsetgo'), value: 'users' },
									{ label: __('Chart', 'designsetgo'), value: 'chart' },
									{ label: __('Rocket', 'designsetgo'), value: 'rocket' },
								]}
								onChange={(value) => setAttributes({ icon: value })}
							/>

							<SelectControl
								label={__('Icon Position', 'designsetgo')}
								value={iconPosition}
								options={[
									{ label: __('Top', 'designsetgo'), value: 'top' },
									{ label: __('Left', 'designsetgo'), value: 'left' },
									{ label: __('Right', 'designsetgo'), value: 'right' },
								]}
								onChange={(value) => setAttributes({ iconPosition: value })}
							/>
						</>
					)}
				</PanelBody>

				{/* Animation Override */}
				<PanelBody title={__('Animation Override', 'designsetgo')} initialOpen={false}>
					<ToggleControl
						label={__('Override Parent Animation', 'designsetgo')}
						checked={overrideAnimation}
						onChange={(value) => setAttributes({ overrideAnimation: value })}
						help={__(
							'Use custom animation settings instead of parent settings',
							'designsetgo'
						)}
					/>

					{overrideAnimation && (
						<>
							<RangeControl
								label={__('Animation Duration (seconds)', 'designsetgo')}
								value={customDuration}
								onChange={(value) => setAttributes({ customDuration: value })}
								min={0.5}
								max={5}
								step={0.1}
							/>

							<RangeControl
								label={__('Animation Delay (seconds)', 'designsetgo')}
								value={customDelay}
								onChange={(value) => setAttributes({ customDelay: value })}
								min={0}
								max={2}
								step={0.1}
							/>

							<SelectControl
								label={__('Easing Function', 'designsetgo')}
								value={customEasing}
								options={[
									{ label: __('Ease Out Quad', 'designsetgo'), value: 'easeOutQuad' },
									{ label: __('Ease Out Cubic', 'designsetgo'), value: 'easeOutCubic' },
									{ label: __('Ease In Out', 'designsetgo'), value: 'easeInOutQuad' },
									{ label: __('Linear', 'designsetgo'), value: 'linear' },
								]}
								onChange={(value) => setAttributes({ customEasing: value })}
							/>
						</>
					)}

					{!overrideAnimation && (
						<div style={{ padding: '12px', background: '#f0f0f0', borderRadius: '4px' }}>
							<p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
								<strong>{__('Using parent settings:', 'designsetgo')}</strong>
								<br />
								{__('Duration:', 'designsetgo')} {parentDuration}s
								<br />
								{__('Delay:', 'designsetgo')} {parentDelay}s
								<br />
								{__('Easing:', 'designsetgo')} {parentEasing}
							</p>
						</div>
					)}
				</PanelBody>
			</InspectorControls>

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
					<div
						className="dsg-counter__number"
					>
						{displayValue}
					</div>

					{/* Icon (if enabled and position is right) */}
					{showIcon && iconPosition === 'right' && (
						<div className="dsg-counter__icon dsg-counter__icon--right">
							{getIconSvg(icon)}
						</div>
					)}
				</div>

				{/* Label */}
				{label && (
					<div className="dsg-counter__label">
						{label}
					</div>
				)}
			</div>
		</>
	);
}

/**
 * Get SVG for icon
 */
function getIconSvg(iconName) {
	const icons = {
		star: (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
				<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
			</svg>
		),
		trophy: (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
				<path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 00-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z" />
			</svg>
		),
		heart: (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
				<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
			</svg>
		),
		check: (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
				<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
			</svg>
		),
		dollar: (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
				<path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
			</svg>
		),
		users: (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
				<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
			</svg>
		),
		chart: (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
				<path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />
			</svg>
		),
		rocket: (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
				<path d="M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 10.69l4.05-4.05c.47-.47 1.15-.68 1.81-.55l1.33 1.33zM11.17 17s3.74-1.55 5.89-3.7c5.4-5.4 4.5-9.62 4.21-10.57-.95-.3-5.17-1.19-10.57 4.21C8.55 9.09 7 12.83 7 12.83L11.17 17zM9.5 12c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5.22-.5.5-.5m0-2C8.12 10 7 11.12 7 12.5S8.12 15 9.5 15s2.5-1.12 2.5-2.5S10.88 10 9.5 10zm7.55 2.92c.21.21.21.56 0 .78-.21.21-.56.21-.78 0l-5.66-5.66c-.21-.21-.21-.56 0-.78s.56-.21.78 0l5.66 5.66zM14 21.5c0-1.1-.9-2-2-2s-2 .9-2 2h4z" />
			</svg>
		),
	};

	return icons[iconName] || icons.star;
}

/**
 * Register block
 */
registerBlockType(metadata.name, {
	...metadata,
	icon: {
		src: (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
				<rect x="6" y="4" width="12" height="16" rx="1" />
				<text x="12" y="14" fontSize="10" fontWeight="bold" textAnchor="middle" stroke="none" fill="currentColor">123</text>
			</svg>
		),
		foreground: '#2563eb',
	},
	edit: CounterEdit,
	save,
});
