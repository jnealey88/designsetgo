/**
 * Geocoding Utilities
 *
 * Functions for converting addresses to coordinates using Nominatim API (OpenStreetMap).
 */

/**
 * Geocode an address to latitude/longitude using Nominatim API.
 *
 * @param {string} address - The address to geocode.
 * @return {Promise<Object|null>} Object with lat, lng, and display_name, or null if failed.
 */
export async function geocodeAddress(address) {
	if (!address || address.trim() === '') {
		return null;
	}

	try {
		const encodedAddress = encodeURIComponent(address.trim());
		const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`;

		const response = await fetch(url, {
			headers: {
				'User-Agent': 'DesignSetGo WordPress Plugin',
			},
		});

		if (!response.ok) {
			throw new Error('Geocoding request failed');
		}

		const data = await response.json();

		if (data && data.length > 0) {
			const result = data[0];
			return {
				lat: parseFloat(result.lat),
				lng: parseFloat(result.lon),
				display_name: result.display_name,
			};
		}

		return null;
	} catch (error) {
		console.error('Geocoding error:', error);
		return null;
	}
}

/**
 * Reverse geocode coordinates to an address using Nominatim API.
 *
 * @param {number} lat - Latitude.
 * @param {number} lng - Longitude.
 * @return {Promise<string|null>} Address string or null if failed.
 */
export async function reverseGeocode(lat, lng) {
	if (typeof lat !== 'number' || typeof lng !== 'number') {
		return null;
	}

	try {
		const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

		const response = await fetch(url, {
			headers: {
				'User-Agent': 'DesignSetGo WordPress Plugin',
			},
		});

		if (!response.ok) {
			throw new Error('Reverse geocoding request failed');
		}

		const data = await response.json();

		if (data && data.display_name) {
			return data.display_name;
		}

		return null;
	} catch (error) {
		console.error('Reverse geocoding error:', error);
		return null;
	}
}

/**
 * Validate latitude value.
 *
 * @param {number} lat - Latitude to validate.
 * @return {boolean} True if valid.
 */
export function isValidLatitude(lat) {
	return typeof lat === 'number' && lat >= -90 && lat <= 90;
}

/**
 * Validate longitude value.
 *
 * @param {number} lng - Longitude to validate.
 * @return {boolean} True if valid.
 */
export function isValidLongitude(lng) {
	return typeof lng === 'number' && lng >= -180 && lng <= 180;
}

/**
 * Validate zoom level.
 *
 * @param {number} zoom - Zoom level to validate.
 * @return {boolean} True if valid.
 */
export function isValidZoom(zoom) {
	return typeof zoom === 'number' && zoom >= 1 && zoom <= 20;
}
