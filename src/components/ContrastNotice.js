/**
 * Contrast Notice Component
 *
 * Displays WCAG contrast validation warnings in the block editor.
 *
 * @package
 * @since 1.0.0
 */

import { Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { validateContrast } from '../utils/contrast-checker';

/**
 * Contrast Notice Component
 *
 * Shows a warning when text and background colors don't meet WCAG AA standards.
 *
 * @param {Object}  props                 Component props
 * @param {string}  props.textColor       - Text/foreground color (CSS color value)
 * @param {string}  props.backgroundColor - Background color (CSS color value)
 * @param {boolean} props.isLargeText     - Whether text is large (≥18pt or ≥14pt bold)
 * @param {boolean} props.isDismissible   - Whether notice can be dismissed
 * @return {JSX.Element|null} Notice component or null if contrast is adequate
 */
export default function ContrastNotice({
	textColor,
	backgroundColor,
	isLargeText = false,
	isDismissible = false,
}) {
	// Don't show notice if either color is missing
	if (!textColor || !backgroundColor) {
		return null;
	}

	const result = validateContrast(textColor, backgroundColor, isLargeText);

	// Don't show notice if contrast is adequate or invalid
	if (!result || result.level === 'invalid' || result.isValid) {
		return null;
	}

	// Determine notice status based on how far off we are
	const status = result.ratio < 3 ? 'error' : 'warning';

	return (
		<Notice status={status} isDismissible={isDismissible}>
			<strong>{__('Accessibility Warning:', 'designsetgo')}</strong>{' '}
			{result.message}
			<br />
			<span style={{ fontSize: '0.9em' }}>
				{__(
					'Users with low vision may have difficulty reading this content.',
					'designsetgo'
				)}
				{result.ratio < 3
					? __('This severely fails WCAG standards.', 'designsetgo')
					: __(
							'Consider adjusting colors for better accessibility.',
							'designsetgo'
						)}
			</span>
		</Notice>
	);
}

/**
 * Compact Contrast Indicator
 *
 * Shows a small inline contrast ratio indicator.
 * Useful for showing in color picker panels.
 *
 * @param {Object}  props                 Component props
 * @param {string}  props.textColor       - Text color
 * @param {string}  props.backgroundColor - Background color
 * @param {boolean} props.isLargeText     - Whether text is large
 * @return {JSX.Element|null} Indicator or null
 */
export function ContrastIndicator({
	textColor,
	backgroundColor,
	isLargeText = false,
}) {
	if (!textColor || !backgroundColor) {
		return null;
	}

	const result = validateContrast(textColor, backgroundColor, isLargeText);

	if (!result || result.level === 'invalid') {
		return null;
	}

	const getIndicatorColor = () => {
		if (result.meetsAAA) {
			return '#00a32a';
		} // Green
		if (result.meetsAA) {
			return '#dba617';
		} // Yellow/Orange
		return '#d63638'; // Red
	};

	const getIndicatorIcon = () => {
		if (result.meetsAAA) {
			return '✓';
		} // Check
		if (result.meetsAA) {
			return '✓';
		} // Check
		return '✗'; // X
	};

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: '0.5rem',
				padding: '0.5rem',
				backgroundColor: '#f0f0f0',
				borderRadius: '4px',
				fontSize: '0.85em',
				marginTop: '0.5rem',
			}}
		>
			<span
				style={{
					fontWeight: 'bold',
					color: getIndicatorColor(),
					fontSize: '1.2em',
				}}
			>
				{getIndicatorIcon()}
			</span>
			<div style={{ flex: 1 }}>
				<div style={{ fontWeight: '500' }}>
					{__('Contrast Ratio:', 'designsetgo')} {result.ratio}:1
				</div>
				<div style={{ fontSize: '0.9em', color: '#757575' }}>
					{result.meetsAAA && __('WCAG AAA', 'designsetgo')}
					{result.meetsAA &&
						!result.meetsAAA &&
						__('WCAG AA', 'designsetgo')}
					{!result.meetsAA && __('Below WCAG AA', 'designsetgo')}
				</div>
			</div>
		</div>
	);
}
