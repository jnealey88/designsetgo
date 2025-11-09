/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
// formatTimeUnit not used in deprecated - kept for potential future deprecations
// import { formatTimeUnit } from './utils/time-calculator';

/**
 * Deprecated version 2: Pre-BorderControl migration
 *
 * This deprecation handles blocks created before we migrated to WordPress BorderControl.
 *
 * Changes in current version:
 * - Replaced unitBorderColor and unitBorderWidth with unitBorder object
 * - Unit border now uses WordPress core BorderControl component
 */
const v2 = {
	attributes: {
		targetDateTime: {
			type: 'string',
			default: '',
		},
		timezone: {
			type: 'string',
			default: '',
		},
		showDays: {
			type: 'boolean',
			default: true,
		},
		showHours: {
			type: 'boolean',
			default: true,
		},
		showMinutes: {
			type: 'boolean',
			default: true,
		},
		showSeconds: {
			type: 'boolean',
			default: true,
		},
		layout: {
			type: 'string',
			default: 'boxed',
			enum: ['boxed', 'inline', 'compact'],
		},
		completionAction: {
			type: 'string',
			default: 'message',
			enum: ['message', 'hide'],
		},
		completionMessage: {
			type: 'string',
			default: 'The countdown has ended!',
		},
		numberColor: {
			type: 'string',
			default: '',
		},
		labelColor: {
			type: 'string',
			default: '',
		},
		unitBackgroundColor: {
			type: 'string',
			default: '',
		},
		unitBorderColor: {
			type: 'string',
			default: '',
		},
		unitBorderWidth: {
			type: 'number',
			default: 2,
		},
		unitBorderRadius: {
			type: 'number',
			default: 12,
		},
		unitGap: {
			type: 'string',
			default: '1rem',
		},
		unitPadding: {
			type: 'string',
			default: '1.5rem',
		},
	},

	migrate(attributes) {
		const { unitBorderColor, unitBorderWidth, ...otherAttributes } =
			attributes;

		// Convert old attributes to new unitBorder object
		return {
			...otherAttributes,
			unitBorder: {
				color: unitBorderColor || '',
				style: 'solid',
				width: unitBorderWidth ? `${unitBorderWidth}px` : '2px',
			},
		};
	},

	save({ attributes }) {
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
			unitBorderColor,
			unitBorderWidth,
			unitBorderRadius,
			unitGap,
			unitPadding,
		} = attributes;

		// Build unit styles - use CSS variable for accent-2 fallback
		const unitStyle = {
			backgroundColor: unitBackgroundColor || 'transparent',
			borderColor:
				unitBorderColor ||
				'var(--wp--preset--color--accent-2, currentColor)',
			borderWidth: `${unitBorderWidth}px`,
			borderStyle: 'solid',
			borderRadius: `${unitBorderRadius}px`,
			padding: unitPadding || '1.5rem',
		};

		const numberStyle = {
			color:
				numberColor ||
				'var(--wp--preset--color--accent-2, currentColor)',
		};

		const labelStyle = {
			color: labelColor || 'currentColor',
		};

		const containerStyle = {
			gap: unitGap || '1rem',
		};

		// Create data attributes for frontend JavaScript
		const blockProps = useBlockProps.save({
			className: `dsg-countdown-timer dsg-countdown-timer--${layout}`,
			style: containerStyle,
			'data-target-datetime': targetDateTime,
			'data-timezone': timezone,
			'data-show-days': showDays,
			'data-show-hours': showHours,
			'data-show-minutes': showMinutes,
			'data-show-seconds': showSeconds,
			'data-completion-action': completionAction,
			'data-completion-message': completionMessage,
		});

		// Build initial display (will be updated by frontend JS)
		const units = [];

		if (showDays) {
			units.push({
				type: 'days',
				label: 'Days',
				value: '00',
			});
		}

		if (showHours) {
			units.push({
				type: 'hours',
				label: 'Hours',
				value: '00',
			});
		}

		if (showMinutes) {
			units.push({
				type: 'minutes',
				label: 'Min',
				value: '00',
			});
		}

		if (showSeconds) {
			units.push({
				type: 'seconds',
				label: 'Sec',
				value: '00',
			});
		}

		return (
			<div {...blockProps}>
				<div className="dsg-countdown-timer__units">
					{units.map((unit) => (
						<div
							key={unit.type}
							className="dsg-countdown-timer__unit"
							data-unit-type={unit.type}
							style={unitStyle}
						>
							<div
								className="dsg-countdown-timer__number"
								style={numberStyle}
							>
								{unit.value}
							</div>
							<div
								className="dsg-countdown-timer__label"
								style={labelStyle}
							>
								{unit.label}
							</div>
						</div>
					))}
				</div>
				<div
					className="dsg-countdown-timer__completion-message"
					style={{ display: 'none' }}
				>
					{completionMessage}
				</div>
			</div>
		);
	},
};

/**
 * Deprecated version 1: Pre-Block Supports refactoring
 *
 * This deprecation handles blocks created before we migrated to WordPress Block Supports.
 *
 * Changes in current version:
 * - Removed textAlign attribute (now uses typography.__experimentalTextAlign support)
 * - Removed numberFontSize attribute (now uses em units relative to parent fontSize)
 * - Removed labelFontSize attribute (now uses em units relative to parent fontSize)
 * - Removed unitBorderWidth attribute (now uses __experimentalBorder support)
 * - Removed unitBorderRadius attribute (now uses __experimentalBorder support)
 */
const v1 = {
	attributes: {
		targetDateTime: {
			type: 'string',
			default: '',
		},
		timezone: {
			type: 'string',
			default: '',
		},
		showDays: {
			type: 'boolean',
			default: true,
		},
		showHours: {
			type: 'boolean',
			default: true,
		},
		showMinutes: {
			type: 'boolean',
			default: true,
		},
		showSeconds: {
			type: 'boolean',
			default: true,
		},
		layout: {
			type: 'string',
			default: 'boxed',
			enum: ['boxed', 'inline', 'compact'],
		},
		textAlign: {
			type: 'string',
			default: 'center',
		},
		completionAction: {
			type: 'string',
			default: 'message',
			enum: ['message', 'hide'],
		},
		completionMessage: {
			type: 'string',
			default: 'The countdown has ended!',
		},
		numberColor: {
			type: 'string',
			default: '',
		},
		labelColor: {
			type: 'string',
			default: '',
		},
		unitBackgroundColor: {
			type: 'string',
			default: '',
		},
		unitBorderColor: {
			type: 'string',
			default: '',
		},
		unitBorderWidth: {
			type: 'number',
			default: 2,
		},
		unitBorderRadius: {
			type: 'number',
			default: 12,
		},
		unitGap: {
			type: 'string',
			default: '1rem',
		},
		unitPadding: {
			type: 'string',
			default: '1.5rem',
		},
		numberFontSize: {
			type: 'string',
			default: '3rem',
		},
		labelFontSize: {
			type: 'string',
			default: '1rem',
		},
	},

	save({ attributes }) {
		const {
			targetDateTime,
			timezone,
			showDays,
			showHours,
			showMinutes,
			showSeconds,
			layout,
			textAlign,
			completionAction,
			completionMessage,
			numberColor,
			labelColor,
			unitBackgroundColor,
			unitBorderColor,
			unitBorderWidth,
			unitBorderRadius,
			unitGap,
			unitPadding,
			numberFontSize,
			labelFontSize,
		} = attributes;

		// Build unit styles - use CSS variable for accent-2 fallback
		const unitStyle = {
			backgroundColor: unitBackgroundColor || 'transparent',
			borderColor:
				unitBorderColor ||
				'var(--wp--preset--color--accent-2, currentColor)',
			borderWidth: `${unitBorderWidth}px`,
			borderStyle: 'solid',
			borderRadius: `${unitBorderRadius}px`,
			padding: unitPadding || '1.5rem',
		};

		const numberStyle = {
			color:
				numberColor ||
				'var(--wp--preset--color--accent-2, currentColor)',
			fontSize: numberFontSize || '3rem',
		};

		const labelStyle = {
			color: labelColor || 'currentColor',
			fontSize: labelFontSize || '1rem',
		};

		// Calculate text alignment
		let justifyValue = 'center';
		if (textAlign === 'left') {
			justifyValue = 'flex-start';
		} else if (textAlign === 'right') {
			justifyValue = 'flex-end';
		}

		const containerStyle = {
			gap: unitGap || '1rem',
			justifyContent: justifyValue,
		};

		// Create data attributes for frontend JavaScript
		const blockProps = useBlockProps.save({
			className: `dsg-countdown-timer dsg-countdown-timer--${layout}`,
			style: containerStyle,
			'data-target-datetime': targetDateTime,
			'data-timezone': timezone,
			'data-show-days': showDays,
			'data-show-hours': showHours,
			'data-show-minutes': showMinutes,
			'data-show-seconds': showSeconds,
			'data-completion-action': completionAction,
			'data-completion-message': completionMessage,
		});

		// Build initial display (will be updated by frontend JS)
		const units = [];

		if (showDays) {
			units.push({
				type: 'days',
				label: 'Days',
				value: '00',
			});
		}

		if (showHours) {
			units.push({
				type: 'hours',
				label: 'Hours',
				value: '00',
			});
		}

		if (showMinutes) {
			units.push({
				type: 'minutes',
				label: 'Min',
				value: '00',
			});
		}

		if (showSeconds) {
			units.push({
				type: 'seconds',
				label: 'Sec',
				value: '00',
			});
		}

		return (
			<div {...blockProps}>
				<div className="dsg-countdown-timer__units">
					{units.map((unit) => (
						<div
							key={unit.type}
							className="dsg-countdown-timer__unit"
							data-unit-type={unit.type}
							style={unitStyle}
						>
							<div
								className="dsg-countdown-timer__number"
								style={numberStyle}
							>
								{unit.value}
							</div>
							<div
								className="dsg-countdown-timer__label"
								style={labelStyle}
							>
								{unit.label}
							</div>
						</div>
					))}
				</div>
				<div
					className="dsg-countdown-timer__completion-message"
					style={{ display: 'none' }}
				>
					{completionMessage}
				</div>
			</div>
		);
	},
};

export default [v2, v1];
