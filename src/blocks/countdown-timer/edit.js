/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	useSettings,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { Placeholder } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import DateTimePanel from './components/inspector/DateTimePanel';
import DisplayPanel from './components/inspector/DisplayPanel';
import StylingPanel from './components/inspector/StylingPanel';
import UnitBorderPanel from './components/inspector/UnitBorderPanel';
import CompletionPanel from './components/inspector/CompletionPanel';
import {
	calculateTimeRemaining,
	formatTimeUnit,
} from './utils/time-calculator';
import { formatCountdownDisplay } from './utils/format-time';

/**
 * Edit component for Countdown Timer block
 *
 * @param {Object} props - Block properties
 * @return {JSX.Element} Edit component
 */
export default function Edit(props) {
	const { attributes, setAttributes, clientId } = props;
	const {
		targetDateTime,
		timezone,
		showDays,
		showHours,
		showMinutes,
		showSeconds,
		layout,
		completionAction,
		completionMessage,
		numberColor,
		labelColor,
		unitBackgroundColor,
		unitBorder,
		unitBorderRadius,
		unitGap,
		unitPadding,
	} = attributes;

	// Get theme color palette and gradient settings
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	// Get theme color palette (WordPress 6.5+ - useSettings returns array)
	const [colorSettings] = useSettings('color.palette');

	// Get theme accent-2 color as default (no hardcoded fallback)
	const themeColors = colorSettings?.theme || [];
	const accent2Color = themeColors.find((color) => color.slug === 'accent-2');
	const defaultAccentColor = accent2Color?.color || '';

	// State for live countdown preview in editor
	const [currentTime, setCurrentTime] = useState(
		calculateTimeRemaining(targetDateTime, timezone)
	);

	// Set default date to 7 days from now on first load
	useEffect(() => {
		if (!targetDateTime) {
			const sevenDaysFromNow = new Date();
			sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
			setAttributes({ targetDateTime: sevenDaysFromNow.toISOString() });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Empty dependency array = run only once on mount

	// Update countdown every second in editor
	useEffect(() => {
		if (!targetDateTime) {
			return;
		}

		const interval = setInterval(() => {
			setCurrentTime(calculateTimeRemaining(targetDateTime, timezone));
		}, 1000);

		return () => clearInterval(interval);
	}, [targetDateTime, timezone]);

	// Build unit styles - use accent-2 if available, otherwise currentColor
	const unitStyle = {
		backgroundColor: unitBackgroundColor || 'transparent',
		borderColor: unitBorder?.color || defaultAccentColor || 'currentColor',
		borderWidth: unitBorder?.width || '2px',
		borderStyle: unitBorder?.style || 'solid',
		borderRadius: `${unitBorderRadius}px`,
		padding: unitPadding || '1.5rem',
	};

	const numberStyle = {
		color: numberColor || defaultAccentColor || 'currentColor',
	};

	const labelStyle = {
		color: labelColor || 'currentColor',
	};

	const containerStyle = {
		gap: unitGap || '1rem',
	};

	const blockProps = useBlockProps({
		className: `dsgo-countdown-timer dsgo-countdown-timer--${layout}`,
		style: containerStyle,
	});

	// Format units for display
	const visibleUnits = formatCountdownDisplay(currentTime, {
		showDays,
		showHours,
		showMinutes,
		showSeconds,
	});

	// Show placeholder if no target date is set
	if (!targetDateTime) {
		return (
			<div {...blockProps}>
				<InspectorControls group="color">
					<ColorGradientSettingsDropdown
						panelId={clientId}
						title={__('Colors', 'designsetgo')}
						settings={[
							{
								label: __('Number Color', 'designsetgo'),
								colorValue: numberColor,
								onColorChange: (color) =>
									setAttributes({ numberColor: color || '' }),
								clearable: true,
							},
							{
								label: __('Label Color', 'designsetgo'),
								colorValue: labelColor,
								onColorChange: (color) =>
									setAttributes({ labelColor: color || '' }),
								clearable: true,
							},
							{
								label: __('Unit Background', 'designsetgo'),
								colorValue: unitBackgroundColor,
								onColorChange: (color) =>
									setAttributes({
										unitBackgroundColor: color || '',
									}),
								clearable: true,
							},
						]}
						{...colorGradientSettings}
					/>
				</InspectorControls>
				<UnitBorderPanel
					attributes={attributes}
					setAttributes={setAttributes}
				/>
				<InspectorControls>
					<DateTimePanel
						attributes={attributes}
						setAttributes={setAttributes}
					/>
					<DisplayPanel
						attributes={attributes}
						setAttributes={setAttributes}
					/>
					<StylingPanel
						attributes={attributes}
						setAttributes={setAttributes}
					/>
					<CompletionPanel
						attributes={attributes}
						setAttributes={setAttributes}
					/>
				</InspectorControls>
				<Placeholder
					icon="clock"
					label={__('Countdown Timer', 'designsetgo')}
					instructions={__(
						'Set a target date and time in the block settings to start your countdown.',
						'designsetgo'
					)}
				/>
			</div>
		);
	}

	// Show completion state
	if (currentTime.isComplete) {
		if (completionAction === 'hide') {
			return (
				<div {...blockProps}>
					<InspectorControls group="color">
						<ColorGradientSettingsDropdown
							panelId={clientId}
							title={__('Colors', 'designsetgo')}
							settings={[
								{
									label: __('Number Color', 'designsetgo'),
									colorValue: numberColor,
									onColorChange: (color) =>
										setAttributes({
											numberColor: color || '',
										}),
									clearable: true,
								},
								{
									label: __('Label Color', 'designsetgo'),
									colorValue: labelColor,
									onColorChange: (color) =>
										setAttributes({
											labelColor: color || '',
										}),
									clearable: true,
								},
								{
									label: __('Unit Background', 'designsetgo'),
									colorValue: unitBackgroundColor,
									onColorChange: (color) =>
										setAttributes({
											unitBackgroundColor: color || '',
										}),
									clearable: true,
								},
							]}
							{...colorGradientSettings}
						/>
					</InspectorControls>
					<UnitBorderPanel
						attributes={attributes}
						setAttributes={setAttributes}
					/>
					<InspectorControls>
						<DateTimePanel
							attributes={attributes}
							setAttributes={setAttributes}
						/>
						<DisplayPanel
							attributes={attributes}
							setAttributes={setAttributes}
						/>
						<StylingPanel
							attributes={attributes}
							setAttributes={setAttributes}
						/>
						<CompletionPanel
							attributes={attributes}
							setAttributes={setAttributes}
						/>
					</InspectorControls>
					<div className="dsgo-countdown-timer__completion">
						<p style={{ opacity: 0.5 }}>
							{__(
								'Timer hidden (countdown complete)',
								'designsetgo'
							)}
						</p>
					</div>
				</div>
			);
		}

		return (
			<div {...blockProps}>
				<InspectorControls group="color">
					<ColorGradientSettingsDropdown
						panelId={clientId}
						title={__('Colors', 'designsetgo')}
						settings={[
							{
								label: __('Number Color', 'designsetgo'),
								colorValue: numberColor,
								onColorChange: (color) =>
									setAttributes({ numberColor: color || '' }),
								clearable: true,
							},
							{
								label: __('Label Color', 'designsetgo'),
								colorValue: labelColor,
								onColorChange: (color) =>
									setAttributes({ labelColor: color || '' }),
								clearable: true,
							},
							{
								label: __('Unit Background', 'designsetgo'),
								colorValue: unitBackgroundColor,
								onColorChange: (color) =>
									setAttributes({
										unitBackgroundColor: color || '',
									}),
								clearable: true,
							},
						]}
						{...colorGradientSettings}
					/>
				</InspectorControls>
				<UnitBorderPanel
					attributes={attributes}
					setAttributes={setAttributes}
				/>
				<InspectorControls>
					<DateTimePanel
						attributes={attributes}
						setAttributes={setAttributes}
					/>
					<DisplayPanel
						attributes={attributes}
						setAttributes={setAttributes}
					/>
					<StylingPanel
						attributes={attributes}
						setAttributes={setAttributes}
					/>
					<CompletionPanel
						attributes={attributes}
						setAttributes={setAttributes}
					/>
				</InspectorControls>
				<div className="dsgo-countdown-timer__completion-message">
					{completionMessage}
				</div>
			</div>
		);
	}

	// Show countdown timer
	return (
		<div {...blockProps}>
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					panelId={clientId}
					title={__('Colors', 'designsetgo')}
					settings={[
						{
							label: __('Number Color', 'designsetgo'),
							colorValue: numberColor,
							onColorChange: (color) =>
								setAttributes({ numberColor: color || '' }),
							clearable: true,
						},
						{
							label: __('Label Color', 'designsetgo'),
							colorValue: labelColor,
							onColorChange: (color) =>
								setAttributes({ labelColor: color || '' }),
							clearable: true,
						},
						{
							label: __('Unit Background', 'designsetgo'),
							colorValue: unitBackgroundColor,
							onColorChange: (color) =>
								setAttributes({
									unitBackgroundColor: color || '',
								}),
							clearable: true,
						},
					]}
					{...colorGradientSettings}
				/>
			</InspectorControls>
			<UnitBorderPanel
				attributes={attributes}
				setAttributes={setAttributes}
			/>
			<InspectorControls>
				<DateTimePanel
					attributes={attributes}
					setAttributes={setAttributes}
				/>
				<DisplayPanel
					attributes={attributes}
					setAttributes={setAttributes}
				/>
				<StylingPanel
					attributes={attributes}
					setAttributes={setAttributes}
				/>
				<CompletionPanel
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>
			<div className="dsgo-countdown-timer__units">
				{visibleUnits.map((unit) => (
					<div
						key={unit.type}
						className="dsgo-countdown-timer__unit"
						style={unitStyle}
					>
						<div
							className="dsgo-countdown-timer__number"
							style={numberStyle}
						>
							{formatTimeUnit(unit.value)}
						</div>
						<div
							className="dsgo-countdown-timer__label"
							style={labelStyle}
						>
							{unit.label}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
