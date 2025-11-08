/**
 * Calculate the time remaining until a target date/time
 *
 * @param {string} targetDateTime - ISO 8601 datetime string
 * @param {string} timezone       - IANA timezone string (reserved for future use)
 * @return {Object} Object containing days, hours, minutes, seconds, and isComplete flag
 */
export function calculateTimeRemaining(targetDateTime, timezone = '') {
	// Note: timezone parameter reserved for future timezone-aware calculations
	// eslint-disable-next-line no-unused-vars
	const _ = timezone;
	if (!targetDateTime) {
		return {
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
			isComplete: true,
		};
	}

	try {
		// Parse the target datetime
		const targetDate = new Date(targetDateTime);

		// Get current time
		const now = new Date();

		// Calculate the difference in milliseconds
		const difference = targetDate.getTime() - now.getTime();

		// Check if countdown is complete
		if (difference <= 0) {
			return {
				days: 0,
				hours: 0,
				minutes: 0,
				seconds: 0,
				isComplete: true,
			};
		}

		// Calculate time units
		const days = Math.floor(difference / (1000 * 60 * 60 * 24));
		const hours = Math.floor(
			(difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		const minutes = Math.floor(
			(difference % (1000 * 60 * 60)) / (1000 * 60)
		);
		const seconds = Math.floor((difference % (1000 * 60)) / 1000);

		return {
			days,
			hours,
			minutes,
			seconds,
			isComplete: false,
		};
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('Error calculating time remaining:', error);
		return {
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
			isComplete: true,
		};
	}
}

/**
 * Format a time unit value with leading zero if needed
 *
 * @param {number} value - The time unit value
 * @return {string} Formatted value with leading zero
 */
export function formatTimeUnit(value) {
	return value < 10 ? `0${value}` : `${value}`;
}

/**
 * Get a human-readable timezone offset
 *
 * @param {string} timezone - IANA timezone string
 * @return {string} Timezone offset (e.g., 'UTC-5')
 */
export function getTimezoneOffset(timezone) {
	try {
		const date = new Date();
		const options = {
			timeZone: timezone,
			timeZoneName: 'short',
		};
		const formatter = new Intl.DateTimeFormat('en-US', options);
		const parts = formatter.formatToParts(date);
		const timeZonePart = parts.find((part) => part.type === 'timeZoneName');
		return timeZonePart ? timeZonePart.value : '';
	} catch (error) {
		return '';
	}
}
