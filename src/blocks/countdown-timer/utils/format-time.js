/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Format countdown time for display
 *
 * @param {Object} timeData           - Object with days, hours, minutes, seconds
 * @param {Object} visibilitySettings - Object with showDays, showHours, showMinutes, showSeconds
 * @return {Array} Array of visible time units with labels
 */
export function formatCountdownDisplay(timeData, visibilitySettings) {
	const units = [];

	if (visibilitySettings.showDays) {
		units.push({
			value: timeData.days,
			label:
				timeData.days === 1
					? __('Day', 'designsetgo')
					: __('Days', 'designsetgo'),
			type: 'days',
		});
	}

	if (visibilitySettings.showHours) {
		units.push({
			value: timeData.hours,
			label:
				timeData.hours === 1
					? __('Hour', 'designsetgo')
					: __('Hours', 'designsetgo'),
			type: 'hours',
		});
	}

	if (visibilitySettings.showMinutes) {
		units.push({
			value: timeData.minutes,
			label: __('Min', 'designsetgo'),
			type: 'minutes',
		});
	}

	if (visibilitySettings.showSeconds) {
		units.push({
			value: timeData.seconds,
			label: __('Sec', 'designsetgo'),
			type: 'seconds',
		});
	}

	return units;
}

/**
 * Get unit label (singular or plural)
 *
 * @param {string} unitType - Type of unit (days, hours, minutes, seconds)
 * @param {number} value    - Value of the unit
 * @return {string} Label for the unit
 */
export function getUnitLabel(unitType, value) {
	const labels = {
		days:
			value === 1 ? __('Day', 'designsetgo') : __('Days', 'designsetgo'),
		hours:
			value === 1
				? __('Hour', 'designsetgo')
				: __('Hours', 'designsetgo'),
		minutes: __('Min', 'designsetgo'),
		seconds: __('Sec', 'designsetgo'),
	};

	return labels[unitType] || '';
}
