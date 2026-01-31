/**
 * Header Container Hook
 *
 * Custom hook for finding the WordPress editor header settings container.
 * Used to portal draft mode controls into the editor header.
 *
 * @package
 * @since 1.4.0
 */

import { useState, useEffect } from '@wordpress/element';
import { findHeaderSettingsContainer } from '../utils/dom-helpers';

/**
 * Timeout delay for retrying header container detection
 *
 * @constant {number}
 */
const HEADER_CONTAINER_RETRY_DELAY = 500;

/**
 * Custom hook for finding the WordPress editor header container
 *
 * Attempts to find the header settings container immediately,
 * then retries after a delay if not found (to handle delayed DOM rendering).
 *
 * @return {Element|null} The header container element or null
 */
export function useHeaderContainer() {
	const [headerContainer, setHeaderContainer] = useState(null);

	useEffect(() => {
		// Try to find container immediately.
		let container = findHeaderSettingsContainer();
		if (container) {
			setHeaderContainer(container);
			return;
		}

		// If not found, retry after delay (DOM may not be ready yet).
		const timer = setTimeout(() => {
			container = findHeaderSettingsContainer();
			if (container) {
				setHeaderContainer(container);
			}
		}, HEADER_CONTAINER_RETRY_DELAY);

		return () => clearTimeout(timer);
	}, []);

	return headerContainer;
}
