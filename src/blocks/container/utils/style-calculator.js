/**
 * Container Block - Style Calculator Utility
 *
 * Pure functions for calculating container styles.
 * Separated from UI components for better testability and maintainability.
 *
 * @since 1.0.0
 */

import classnames from 'classnames';

/**
 * Calculate inner container styles based on layout and responsive settings.
 *
 * WordPress best practice: Declarative style calculation (no useEffect or DOM manipulation).
 * All styles are calculated from attributes and applied via React props.
 *
 * @param {Object} attributes - Block attributes
 * @param {string} attributes.layoutType - Layout type ('stack', 'grid', 'flex')
 * @param {boolean} attributes.constrainWidth - Whether to constrain content width
 * @param {string} attributes.contentWidth - Maximum content width (e.g., '1200px')
 * @param {number} attributes.gridColumns - Number of grid columns (desktop)
 * @param {string} attributes.gap - Gap between items
 * @return {Object} React style object for inner container
 */
export const calculateInnerStyles = (attributes) => {
	const { layoutType, constrainWidth, contentWidth, gridColumns, gap } = attributes;

	const styles = {
		position: 'relative',
		zIndex: 2,
	};

	// Apply layout based on type
	if (layoutType === 'grid') {
		styles.display = 'grid';
		styles.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;
		styles.gap = gap;
	} else if (layoutType === 'flex') {
		styles.display = 'flex';
		styles.flexDirection = 'row';
		styles.flexWrap = 'wrap';
		styles.gap = gap;
	} else {
		// Stack (default)
		styles.display = 'flex';
		styles.flexDirection = 'column';
		styles.gap = gap;
	}

	// Apply width constraint if enabled (works for ALL layouts)
	if (constrainWidth) {
		styles.maxWidth = contentWidth;
		styles.marginLeft = 'auto';
		styles.marginRight = 'auto';
	}

	return styles;
};

/**
 * Calculate container wrapper classes.
 *
 * @param {Object} attributes - Block attributes
 * @param {string} attributes.videoUrl - Video background URL
 * @param {boolean} attributes.enableOverlay - Whether overlay is enabled
 * @param {boolean} attributes.hideOnDesktop - Hide on desktop
 * @param {boolean} attributes.hideOnTablet - Hide on tablet
 * @param {boolean} attributes.hideOnMobile - Hide on mobile
 * @param {string} attributes.linkUrl - Link URL for clickable container
 * @param {string} attributes.textAlign - Text alignment
 * @return {string} className string for container wrapper
 */
export const calculateContainerClasses = (attributes) => {
	const {
		videoUrl,
		enableOverlay,
		hideOnDesktop,
		hideOnTablet,
		hideOnMobile,
		linkUrl,
		textAlign,
	} = attributes;

	return classnames('dsg-container', {
		'has-video-background': videoUrl,
		'has-dsg-overlay': enableOverlay,
		'dsg-hide-desktop': hideOnDesktop,
		'dsg-hide-tablet': hideOnTablet,
		'dsg-hide-mobile': hideOnMobile,
		'is-clickable': linkUrl,
		[`has-text-align-${textAlign}`]: textAlign,
	});
};

/**
 * Calculate container wrapper styles.
 *
 * @param {Object} attributes - Block attributes
 * @param {string} attributes.textAlign - Text alignment
 * @return {Object} React style object for container wrapper
 */
export const calculateContainerStyles = (attributes) => {
	const { textAlign } = attributes;

	return {
		position: 'relative',
		...(textAlign && { textAlign }),
	};
};
