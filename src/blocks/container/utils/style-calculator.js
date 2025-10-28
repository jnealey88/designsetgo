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
 * Convert WordPress spacing preset notation to CSS custom property
 *
 * @param {string} value - WordPress preset value (e.g., "var:preset|spacing|50")
 * @return {string} CSS custom property (e.g., "var(--wp--preset--spacing--50)")
 */
const convertPresetToCSSVar = (value) => {
	if (!value || typeof value !== 'string') {
		return value;
	}

	// Check if it's a WordPress preset notation
	if (value.startsWith('var:preset|')) {
		// Convert "var:preset|spacing|50" to "var(--wp--preset--spacing--50)"
		const parts = value.replace('var:preset|', '').split('|');
		if (parts.length === 2) {
			return `var(--wp--preset--${parts[0]}--${parts[1]})`;
		}
	}

	return value;
};

/**
 * Calculate inner container styles based on layout and responsive settings.
 *
 * WordPress best practice: Declarative style calculation (no useEffect or DOM manipulation).
 * All styles are calculated from attributes and applied via React props.
 *
 * Responsive Grid Approach:
 * - Uses CSS custom properties for responsive column counts
 * - Media queries in CSS apply the appropriate column count
 * - Allows responsive grids without JavaScript
 *
 * Block Spacing (Gap):
 * - Reads blockGap from attributes.style.spacing.blockGap
 * - Applies to flex and grid layouts via CSS gap property
 * - Converts WordPress preset notation to CSS custom properties
 *
 * Content Width:
 * - Uses user's custom contentWidth if specified
 * - Falls back to theme's contentSize from theme.json if available
 * - Defaults to '800px' if neither is specified
 *
 * @param {Object}  attributes                   - Block attributes
 * @param {string}  attributes.layoutType        - Layout type ('stack', 'grid', 'flex')
 * @param {boolean} attributes.constrainWidth    - Whether to constrain content width
 * @param {string}  attributes.contentWidth      - Maximum content width (e.g., '1200px')
 * @param {number}  attributes.gridColumns       - Number of grid columns (desktop)
 * @param {number}  attributes.gridColumnsTablet - Number of grid columns (tablet)
 * @param {number}  attributes.gridColumnsMobile - Number of grid columns (mobile)
 * @param {Object}  attributes.style             - WordPress-managed styles
 * @param {string}  themeContentSize             - Theme's content size from theme.json (optional)
 * @return {Object} React style object for inner container
 */
export const calculateInnerStyles = (attributes, themeContentSize = null) => {
	const {
		layoutType,
		constrainWidth,
		contentWidth,
		gridColumns,
		gridColumnsTablet,
		gridColumnsMobile,
		gridStretchItems,
		style,
	} = attributes;

	const styles = {
		position: 'relative',
		zIndex: 2,
	};

	// Get blockGap from WordPress style attribute
	const blockGap = style?.spacing?.blockGap;
	const gapValue = convertPresetToCSSVar(blockGap);

	// Apply layout based on type
	if (layoutType === 'grid') {
		styles.display = 'grid';
		// Use CSS custom properties for responsive columns
		// IMPORTANT: Convert to strings to prevent React from adding "px"
		styles['--dsg-grid-cols-desktop'] = String(gridColumns);
		styles['--dsg-grid-cols-tablet'] = String(gridColumnsTablet);
		styles['--dsg-grid-cols-mobile'] = String(gridColumnsMobile);
		// Default to desktop columns, overridden by media queries
		styles.gridTemplateColumns = `repeat(var(--dsg-grid-cols-desktop), 1fr)`;
		// Apply align-items: stretch for equal height grid items (default: true)
		if (gridStretchItems !== false) {
			styles.alignItems = 'stretch';
		}
		// Apply gap for grid layout
		if (gapValue) {
			styles.gap = gapValue;
		}
	} else if (layoutType === 'flex') {
		styles.display = 'flex';
		styles.flexDirection = 'row';
		styles.flexWrap = 'wrap';

		// Apply flex justification (horizontal alignment)
		const { flexJustify = 'flex-start', flexAlign = 'flex-start' } =
			attributes;
		if (flexJustify === 'stretch') {
			// For stretch, we don't use justify-content
			// Instead, child items will grow to fill space
			// But only if vertical alignment isn't also stretch
			if (flexAlign !== 'stretch') {
				// Apply horizontal stretch via CSS (handled in style.scss)
				styles.alignItems = flexAlign; // Apply vertical alignment
			} else {
				// Both horizontal and vertical stretch
				styles.alignItems = 'stretch';
			}
		} else {
			styles.justifyContent = flexJustify;
			styles.alignItems = flexAlign; // Apply vertical alignment
		}

		// Apply gap for flex layout
		if (gapValue) {
			styles.gap = gapValue;
		}
	} else {
		// Stack (default) - uses flexbox column
		styles.display = 'flex';
		styles.flexDirection = 'column';
		// Apply gap for stack layout
		if (gapValue) {
			styles.gap = gapValue;
		}
	}

	// Apply width constraint if enabled (works for ALL layouts)
	if (constrainWidth) {
		// Use user's custom width, or theme's contentSize, or fallback to 800px
		const effectiveWidth = contentWidth || themeContentSize || '800px';
		styles.maxWidth = effectiveWidth;
		styles.marginLeft = 'auto';
		styles.marginRight = 'auto';
	}

	return styles;
};

/**
 * Calculate container wrapper classes.
 *
 * @param {Object}  attributes               - Block attributes
 * @param {string}  attributes.videoUrl      - Video background URL
 * @param {boolean} attributes.enableOverlay - Whether overlay is enabled
 * @param {boolean} attributes.hideOnDesktop - Hide on desktop
 * @param {boolean} attributes.hideOnTablet  - Hide on tablet
 * @param {boolean} attributes.hideOnMobile  - Hide on mobile
 * @param {string}  attributes.linkUrl       - Link URL for clickable container
 * @param {string}  attributes.textAlign     - Text alignment
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
 * @param {Object}  attributes                - Block attributes
 * @param {string}  attributes.textAlign      - Text alignment
 * @param {number}  attributes.gridColumnSpan - Grid column span for nested containers
 * @param {string}  attributes.flexItemWidth  - Width when inside flex parent
 * @param {boolean} hasParentFlex             - Whether parent is a flex container (optional)
 * @return {Object} React style object for container wrapper
 */
export const calculateContainerStyles = (attributes, hasParentFlex = false) => {
	const { textAlign, gridColumnSpan, flexItemWidth } = attributes;

	const styles = {
		position: 'relative',
		...(textAlign && { textAlign }),
	};

	// Apply grid column span when set (browsers ignore if parent isn't grid)
	if (gridColumnSpan && gridColumnSpan > 1) {
		styles.gridColumn = `span ${gridColumnSpan}`;
	}

	// Apply flex item width when inside a flex parent
	if (hasParentFlex && flexItemWidth) {
		styles.width = flexItemWidth;
		// Prevent flex item from growing/shrinking
		styles.flexShrink = 0;
		styles.flexGrow = 0;
	}

	return styles;
};
