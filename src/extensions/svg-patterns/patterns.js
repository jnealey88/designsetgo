/**
 * SVG Pattern Library
 *
 * A curated collection of repeatable SVG background patterns.
 * Pattern SVG data adapted from Hero Patterns (heropatterns.com) by Steve Schoger,
 * licensed under CC BY 4.0.
 *
 * @package
 */

/**
 * Validate a CSS color value to prevent SVG attribute injection.
 *
 * @param {string} color The color value to validate
 * @return {boolean} True if the color is safe
 */
function isValidColor(color) {
	if (!color || typeof color !== 'string') {
		return false;
	}
	const validFormats = [
		/^#[0-9A-Fa-f]{3,8}$/, // Hex (#fff, #ffffff, #ffffffff)
		/^rgb\([^)]+\)$/, // rgb()
		/^rgba\([^)]+\)$/, // rgba()
		/^hsl\([^)]+\)$/, // hsl()
		/^hsla\([^)]+\)$/, // hsla()
		/^[a-z]+$/i, // Named colors
	];
	return validFormats.some((format) => format.test(color.trim()));
}

/**
 * Generate a URL-encoded SVG data URI for use in CSS background-image.
 *
 * @param {string} svg Raw SVG markup
 * @return {string} Encoded data URI
 */
export function encodeSvg(svg) {
	return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * Build SVG markup for a given pattern definition.
 * Color is sanitized to prevent SVG attribute injection.
 *
 * @param {Object} pattern Pattern definition
 * @param {string} color   Fill color (hex including #)
 * @param {number} opacity Fill opacity (0–1)
 * @return {string} Complete SVG markup
 */
export function buildPatternSvg(pattern, color, opacity) {
	const { width, height, paths } = pattern;

	// Sanitize color — reject anything that isn't a valid CSS color format
	const safeColor = isValidColor(color) ? color : '#9c92ac';

	// Clamp opacity to valid range
	const safeOpacity = Math.max(0, Math.min(1, Number(opacity) || 0.4));

	const pathElements = paths
		.map((p) => {
			const attrs = [];
			attrs.push(`d="${p.d}"`);

			if (p.stroke) {
				// Stroke-based path (waves, rings, arcs)
				attrs.push('fill="none"');
				attrs.push(`stroke="${safeColor}"`);
				attrs.push(`stroke-opacity="${safeOpacity}"`);
				const sw = Math.max(
					0.5,
					Math.min(10, Number(p.strokeWidth) || 1)
				);
				attrs.push(`stroke-width="${sw}"`);
				if (p.strokeLinecap) {
					attrs.push(`stroke-linecap="${p.strokeLinecap}"`);
				}
			} else {
				// Fill-based path (default)
				attrs.push(`fill="${safeColor}"`);
				attrs.push(`fill-opacity="${safeOpacity}"`);
				if (p.fillRule) {
					attrs.push(`fill-rule="${p.fillRule}"`);
				}
			}

			return `<path ${attrs.join(' ')}/>`;
		})
		.join('');

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${pathElements}</svg>`;
}

/**
 * Get the CSS background-image value for a pattern.
 * Returns null for unrecognized pattern IDs.
 *
 * @param {string} patternId Pattern ID (must exist in PATTERNS)
 * @param {string} color     Fill color
 * @param {number} opacity   Fill opacity
 * @param {number} scale     Scale multiplier (1 = native size)
 * @return {Object|null} Object with backgroundImage and backgroundSize, or null
 */
export function getPatternBackground(patternId, color, opacity, scale = 1) {
	if (!patternId || typeof patternId !== 'string') {
		return null;
	}

	const pattern = PATTERNS[patternId];
	if (!pattern) {
		return null;
	}

	const safeScale = Math.max(0.25, Math.min(4, Number(scale) || 1));
	const svg = buildPatternSvg(pattern, color, opacity);
	const backgroundImage = encodeSvg(svg);
	const backgroundSize = `${pattern.width * safeScale}px ${pattern.height * safeScale}px`;

	return { backgroundImage, backgroundSize };
}

/**
 * Pattern definitions
 *
 * Each pattern has:
 * - label: Display name
 * - category: Category for grouping in the picker
 * - width/height: Tile dimensions
 * - paths: Array of path objects with { d, fillRule?, stroke?, strokeWidth?, strokeLinecap? }
 */
export const PATTERNS = {
	// ─────────────────────────────────────────────────
	// MINIMAL — Clean, understated backgrounds
	// ─────────────────────────────────────────────────

	'dot-grid': {
		label: 'Dot Grid',
		category: 'minimal',
		width: 24,
		height: 24,
		paths: [
			{
				d: 'M10.8 12a1.2 1.2 0 1 0 2.4 0 1.2 1.2 0 0 0-2.4 0z',
			},
		],
	},
	'cross-grid': {
		label: 'Cross Grid',
		category: 'minimal',
		width: 24,
		height: 24,
		paths: [
			{
				d: 'M9 11.5h6v1H9zM11.5 9h1v6h-1z',
			},
		],
	},
	'diagonal-lines': {
		label: 'Diagonal Lines',
		category: 'minimal',
		width: 6,
		height: 6,
		paths: [
			{
				d: 'M5 0h1L0 6V5zM6 5v1H5z',
			},
		],
	},
	'horizontal-lines': {
		label: 'Horizontal Lines',
		category: 'minimal',
		width: 24,
		height: 24,
		paths: [
			{
				d: 'M0 11h24v2H0z',
			},
		],
	},
	'diagonal-stripes': {
		label: 'Diagonal Stripes',
		category: 'minimal',
		width: 40,
		height: 40,
		paths: [
			{
				d: 'M0 40L40 0H20L0 20M40 40V20L20 40',
			},
		],
	},
	dashes: {
		label: 'Dashes',
		category: 'minimal',
		width: 20,
		height: 20,
		paths: [
			{
				d: 'M6 9.5h8v1H6z',
			},
		],
	},

	// ─────────────────────────────────────────────────
	// GEOMETRIC — Mathematical precision
	// ─────────────────────────────────────────────────

	hexagons: {
		label: 'Hexagons',
		category: 'geometric',
		width: 28,
		height: 49,
		paths: [
			{
				d: 'M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z',
			},
		],
	},
	'diamond-grid': {
		label: 'Diamond Grid',
		category: 'geometric',
		width: 20,
		height: 20,
		paths: [
			{
				d: 'M10 0l10 10-10 10L0 10zM10 2l8 8-8 8-8-8z',
				fillRule: 'evenodd',
			},
		],
	},
	moroccan: {
		label: 'Moroccan',
		category: 'geometric',
		width: 80,
		height: 46,
		paths: [
			{
				d: 'M24.902 12.042c-.31-.12-.479-.307-.479-.54 0-.376.39-.81 1.122-1.244a12.94 12.94 0 0 1 5.74-1.717c.254-.011.507-.017.757-.017h.003c.25 0 .503.006.757.017a12.94 12.94 0 0 1 5.74 1.717c.732.434 1.122.868 1.122 1.244 0 .233-.169.42-.479.54a12.98 12.98 0 0 1-3.625.938 15.95 15.95 0 0 1-3.515.26h-.003a15.95 15.95 0 0 1-3.515-.26 12.98 12.98 0 0 1-3.625-.938zM0 23l20-11.5V0h2v12.08l18.273 10.539a1.6 1.6 0 0 0 .114.063l.113.06-.113.06a1.6 1.6 0 0 0-.114.063L22 33.404V46h-2V33.922L0 23zm42 0l18.273-10.539a1.6 1.6 0 0 0 .114-.063l.113-.06-.113-.06a1.6 1.6 0 0 0-.114-.063L42 1.676V0h2v1.078l20 11.539v.766L44 24.922V46h-2V24.404L23.727 13.865a1.6 1.6 0 0 0-.114-.063l-.113-.06.113-.06a1.6 1.6 0 0 0 .114-.063L42 2.162V0',
				fillRule: 'evenodd',
			},
		],
	},
	chevrons: {
		label: 'Chevrons',
		category: 'geometric',
		width: 28,
		height: 12,
		paths: [
			{
				d: 'M0 12L14 0l14 12v-2L14 2 0 10z',
			},
		],
	},
	'flipped-diamonds': {
		label: 'Flipped Diamonds',
		category: 'geometric',
		width: 16,
		height: 32,
		paths: [
			{
				d: 'M8 0l8 16-8 16L0 16 8 0zm0 4L2 16l6 12 6-12L8 4z',
				fillRule: 'evenodd',
			},
		],
	},
	'triangle-grid': {
		label: 'Triangle Grid',
		category: 'geometric',
		width: 40,
		height: 40,
		paths: [
			{
				d: 'M0 40L20 0l20 40zM4 38L20 4l16 34z',
				fillRule: 'evenodd',
			},
		],
	},

	// ─────────────────────────────────────────────────
	// ORGANIC — Natural, flowing forms
	// ─────────────────────────────────────────────────

	topography: {
		label: 'Topography',
		category: 'organic',
		width: 600,
		height: 600,
		paths: [
			{
				d: 'M598.22 13.87c-1.08-.15-2.2.26-2.88 1.19-3.81 5.23-11.06 6.04-15.82 1.77a10.28 10.28 0 0 0-6.4-2.96c-4.05-.43-7.76 1.23-10.39 4.06a11.38 11.38 0 0 1-15.25 1.08 12.71 12.71 0 0 0-17.34.92c-3.57 3.88-4 9.62-1.52 14.01a8.47 8.47 0 0 1-1.02 9.73c-3.02 3.54-8.19 4.28-12.07 1.93a15.86 15.86 0 0 0-18.13.93 15.86 15.86 0 0 1-18.13.93c-3.88-2.35-9.05-1.61-12.07 1.93-2.56 3-3.02 7.14-1.54 10.57l.51 1.25c1.8 4.37.72 9.38-2.73 12.5-3.78 3.41-9.54 3.36-13.27-.1a9.82 9.82 0 0 0-6.38-2.74c-4.14-.2-7.84 1.92-10.12 5.15a11.06 11.06 0 0 1-15.7 2.77l-1.03-.78c-5.38-4.09-13.05-2.22-16 3.91a12.04 12.04 0 0 1-15.59 5.82 8.62 8.62 0 0 0-10.12 2.43 8.62 8.62 0 0 1-10.12 2.43 12.04 12.04 0 0 0-15.59 5.82c-2.96 6.12-10.63 8-16 3.91l-1.03-.78c-4.85-3.68-11.66-2.68-15.33 2.18l-.35.46c-3.06 4.05-8.5 5.46-13.11 3.48-4.94-2.13-10.76-.38-13.5 4.25a12.04 12.04 0 0 1-15.41 4.75 11.73 11.73 0 0 0-14.42 3.12c-3.93 4.85-3.66 11.75.22 16.34 2.79 3.3 2.98 7.97.72 11.6-3 4.81-9.37 6.09-14 2.82a9.1 9.1 0 0 0-12.38 1.58l-.28.33c-3.71 4.42-10.34 4.96-14.71 1.18l-.28-.24c-3.76-3.24-9.3-3.23-13.05.03-4.25 3.69-4.78 10.12-1.19 14.45 2.95 3.56 2.79 8.73-.37 12.1a10.04 10.04 0 0 1-12.39 2c-5.58-2.86-12.5-.75-15.28 4.87-2.23 4.49-7.13 6.94-11.94 6.18a10.82 10.82 0 0 0-11.03 5.39c-2.73 5.08-1.16 11.3 3.44 14.59 3.39 2.43 4.93 6.76 3.62 10.74a10.7 10.7 0 0 1-8.78 7.17c-5.08.66-9.1 4.44-10.05 9.45a10.05 10.05 0 0 1-8.14 8.1c-5.02.92-8.77 5.12-9.17 10.18-.5 6.3 4.2 11.8 10.48 12.34 4.17.36 7.6 3.35 8.52 7.4 1.36 5.99 7.39 9.67 13.34 8.16 4.33-1.1 8.86.86 10.82 4.84 2.69 5.46 9.29 7.58 14.63 4.65 3.98-2.18 8.93-1.28 11.85 2.16 3.91 4.6 10.88 4.99 15.3 1.09l.15-.14c4.6-4.07 11.7-3.72 15.82.73l.15.16c3.4 3.69 8.53 4.88 13.11 3.33 5.53-1.87 11.59.69 13.9 5.98 2.67 6.13 9.84 8.82 15.86 5.9a11.6 11.6 0 0 1 14.14 3.67c3.8 5.27 11.3 6.21 16.35 1.98a11.54 11.54 0 0 1 13.99-.46c5.16 3.76 12.24 2.79 16.18-2.08.05-.06.1-.13.14-.19 3.87-5.02 11.16-5.97 16.17-2.1 4.25 3.28 10.14 3.03 14.09-.43a12.5 12.5 0 0 1 16.22-.5c4.79 4 11.75 3.54 16.02-1.02.48-.51.92-1.07 1.3-1.66 3.41-5.34 10.6-6.95 16.08-3.78 5.04 2.91 11.48 1.37 14.69-3.47a11.06 11.06 0 0 1 15.42-3.2l.79.55c5.4 3.76 12.84 2.04 15.95-3.78a11.9 11.9 0 0 1 14.55-5.25c5.98 2.58 12.9-.33 15.35-6.38.34-.84.6-1.71.78-2.59 1.19-5.94 6.99-9.76 12.93-8.53 5.33 1.1 10.62-1.98 12.63-7.01a10.67 10.67 0 0 1 11.74-6.59c5.95 1.01 11.55-3.04 12.45-9.01.7-4.63 4.47-8.2 9.15-8.62 5.87-.53 10.34-5.53 10.03-11.43-.24-4.56 2.78-8.72 7.18-10.02 5.6-1.66 8.98-7.38 7.66-13.07-.48-2.08-.23-4.19.58-6.08 2.34-5.42-.16-11.72-5.56-14.1a10.2 10.2 0 0 1-5.73-10.05c.67-5.77-3.27-11.08-9.01-12.02-3.97-.65-7.09-3.72-7.82-7.67-.97-5.3-5.52-9.15-10.9-9.22h-.49c-5.54.14-10.34-3.87-10.95-9.37-.72-6.45-6.73-11.04-13.15-10.02-4.03.64-8-1.21-10.03-4.72a11.06 11.06 0 0 0-13.89-4.59 11.73 11.73 0 0 1-14.96-4.3c-3.14-4.9-9.4-6.74-14.72-4.36a10.82 10.82 0 0 1-13.38-3.17c-3.44-4.6-9.94-5.87-14.85-2.77-.03.01-.05.03-.07.05-4.76 3-11.01 1.72-14.12-2.95a10.82 10.82 0 0 0-14.63-3.01c-4.68 3.19-10.94 2.52-14.83-1.59-4.53-4.79-12.14-4.7-16.57.37a10.45 10.45 0 0 1-14.67.55 11.7 11.7 0 0 0-14.93-.37c-4.72 3.9-11.67 3.57-16.03-.75a11.22 11.22 0 0 0-14.06-1.02c-.47.33-.92.7-1.34 1.11-4.05 3.96-10.47 4.17-14.79.55a10.62 10.62 0 0 0-15.07.48c-4.04 4.5-10.94 5.01-15.57 1.18-4.17-3.45-10.2-3.56-14.5-.28-4.72 3.6-11.44 2.8-15.2-1.78a10.38 10.38 0 0 0-13.95-2.34c-5.35 3.3-12.27 2.04-16.04-2.81a9.69 9.69 0 0 0-5.62-3.78Zm0 0',
				fillRule: 'evenodd',
			},
		],
	},
	waves: {
		label: 'Waves',
		category: 'organic',
		width: 120,
		height: 40,
		paths: [
			{
				d: 'M0 20Q30 5 60 20T120 20',
				stroke: true,
				strokeWidth: 2,
			},
		],
	},
	grain: {
		label: 'Grain',
		category: 'organic',
		width: 4,
		height: 4,
		paths: [
			{
				d: 'M1 3h1v1H1V3zm2-2h1v1H3V1z',
			},
		],
	},
	ripples: {
		label: 'Ripples',
		category: 'organic',
		width: 48,
		height: 48,
		paths: [
			{
				d: 'M24 17a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM24 9a15 15 0 1 0 0 30 15 15 0 0 0 0-30zM24 1a23 23 0 1 0 0 46 23 23 0 0 0 0-46z',
				stroke: true,
				strokeWidth: 1.5,
			},
		],
	},

	// ─────────────────────────────────────────────────
	// TEXTURE — Surface and material feel
	// ─────────────────────────────────────────────────

	crosshatch: {
		label: 'Crosshatch',
		category: 'texture',
		width: 8,
		height: 8,
		paths: [
			{
				d: 'M7 0h1L0 8V7zM8 7v1H7zM0 0h1L8 7v1H7L0 1z',
			},
		],
	},
	noise: {
		label: 'Noise',
		category: 'texture',
		width: 16,
		height: 16,
		paths: [
			{
				d: 'M2 4h1v1H2zM7 1h1v1H7zM12 6h1v1h-1zM4 10h1v1H4zM9 13h1v1H9zM14 8h1v1h-1zM1 14h1v1H1zM6 11h1v1H6zM11 3h1v1h-1zM3 7h1v1H3zM8 15h1v1H8zM15 2h1v1h-1z',
			},
		],
	},
	stipple: {
		label: 'Stipple',
		category: 'texture',
		width: 60,
		height: 60,
		paths: [
			{
				d: 'M8 10a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM40.5 15a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zM25 45a1 1 0 1 0 2 0 1 1 0 0 0-2 0zM49.5 35a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0zM15 30a1 1 0 1 0 2 0 1 1 0 0 0-2 0zM44.5 55a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z',
			},
		],
	},
	linen: {
		label: 'Linen',
		category: 'texture',
		width: 4,
		height: 4,
		paths: [
			{
				d: 'M0 0h2v1H0zM3 2v2h1V2z',
			},
		],
	},

	// ─────────────────────────────────────────────────
	// DEPTH — Dimensional, layered patterns
	// ─────────────────────────────────────────────────

	'stacked-arcs': {
		label: 'Stacked Arcs',
		category: 'depth',
		width: 40,
		height: 40,
		paths: [
			{
				d: 'M36 0A36 36 0 0 1 0 36V40A40 40 0 0 0 40 0H36zM24 0A24 24 0 0 1 0 24V28A28 28 0 0 0 28 0H24zM12 0A12 12 0 0 1 0 12V16A16 16 0 0 0 16 0H12z',
			},
		],
	},
	scales: {
		label: 'Scales',
		category: 'depth',
		width: 48,
		height: 24,
		paths: [
			{
				d: 'M0 0c0 6.63 5.37 12 12 12s12-5.37 12-12M24 0c0 6.63 5.37 12 12 12s12-5.37 12-12M-12 12c0 6.63 5.37 12 12 12s12-5.37 12-12M12 12c0 6.63 5.37 12 12 12s12-5.37 12-12M36 12c0 6.63 5.37 12 12 12s12-5.37 12-12',
				stroke: true,
				strokeWidth: 1.5,
			},
		],
	},

	// ─────────────────────────────────────────────────
	// TECHNICAL — Precision and structure
	// ─────────────────────────────────────────────────

	'circuit-board': {
		label: 'Circuit Board',
		category: 'technical',
		width: 304,
		height: 304,
		paths: [
			{
				d: 'M44.1 224a5 5 0 1 1 0 2H0v-2h44.1zm160 48a5 5 0 1 1 0 2H82v-2h122.1zm57.8-46a5 5 0 1 1 0-2H304v2h-42.1zm0 16a5 5 0 1 1 0-2H304v2h-42.1zm6.2-114a5 5 0 1 1 0 2h-86.2a5 5 0 1 1 0-2h86.2zm-256-48a5 5 0 1 1 0 2H0v-2h12.1zm185.8 34a5 5 0 1 1 0-2h86.2a5 5 0 1 1 0 2h-86.2zM258 12.1a5 5 0 1 1-2 0V0h2v12.1zm-64 208a5 5 0 1 1-2 0v-54.2a5 5 0 1 1 2 0v54.2zm48-198.2V80h62v2h-64V21.9a5 5 0 1 1 2 0zm16 16V64h46v2h-48V37.9a5 5 0 1 1 2 0zm-128 96V208h16v12.1a5 5 0 1 1-2 0V210h-16v-76.1a5 5 0 1 1 2 0zm-5.9-21.9a5 5 0 1 1 0 2H114v48H85.9a5 5 0 1 1 0-2H112v-48h12.1zm-6.2 130a5 5 0 1 1 0-2H176v-74.1a5 5 0 1 1 2 0V242h-60.1zm-16-64a5 5 0 1 1 0-2H114v48h10.1a5 5 0 1 1 0 2H112v-48h-10.1zM66 284.1a5 5 0 1 1-2 0V274H50v30h-2v-32h18v12.1zM236.1 176a5 5 0 1 1 0 2H226v94h48v32h-2v-30h-48v-98h12.1zm25.8-30a5 5 0 1 1 0-2H274v44.1a5 5 0 1 1-2 0V146h-10.1zm-64 96a5 5 0 1 1 0-2H208v-80h16v-14h-42.1a5 5 0 1 1 0-2H226v18h-16v80h-12.1zm86.2-210a5 5 0 1 1 0 2H272V0h2v32h10.1zM98 101.9V146H53.9a5 5 0 1 1 0-2H96v-42.1a5 5 0 1 1 2 0zM53.9 34a5 5 0 1 1 0-2H80V0h2v34H53.9zm60.1 3.9V66H82v64H69.9a5 5 0 1 1 0-2H80V64h32V37.9a5 5 0 1 1 2 0zM101.9 82a5 5 0 1 1 0-2H128V37.9a5 5 0 1 1 2 0V82h-28.1zm16-64a5 5 0 1 1 0-2H146v44.1a5 5 0 1 1-2 0V18h-26.1zm102.2 270a5 5 0 1 1 0 2H98v14h-2v-16h124.1zM242 149.9V160h16v34h-16v62h48v48h-2v-46h-48v-66h16v-30h-16v-12.1a5 5 0 1 1 2 0zM53.9 18a5 5 0 1 1 0-2H64V2H48V0h18v18H53.9zm112 32a5 5 0 1 1 0-2H192V0h50v2h-48v48h-28.1zm-48-48a5 5 0 0 1-9.8-2h2.07a3 3 0 1 0 5.66 0H178v34h-18V21.9a5 5 0 1 1 2 0V32h14V2h-58.1zm0 96a5 5 0 1 1 0-2H137l32-32h39V21.9a5 5 0 1 1 2 0V66h-40.17l-32 32H117.9zm28.1 90.1a5 5 0 1 1-2 0v-76.51L175.59 80H224V21.9a5 5 0 1 1 2 0V82h-49.59L146 112.41v75.69zm16 32a5 5 0 1 1-2 0v-99.51L184.59 96H300.1a5 5 0 0 1 .1-2h-117.59l-32 32v99.51zM0 157.9V146h44.1a5 5 0 1 1 0 2H2v8H0v1.9zm0 16V162h46v46h-16v4a5 5 0 0 1-2 0v-6h18v-46H0zm256 32V222h-34.1a5 5 0 1 1 0-2H254v-28h2v14zm40 32v38h-2v-36h-48v36h-2v-38h52zM258 284.1a5 5 0 1 1-2 0V274h-44v-2h46v12.1zM130 228.1a5 5 0 1 1-2 0V210h-16v-24h-4v-2h6v26h16v18.1zM194 66V46h-18V0h2v44h18v24h62v2h-64zm0-32V2h62v2h-60v30h-2zm10 44a5 5 0 1 1 0-2h22V46h46v2h-44v28h-24zm-20-2h-2v-30h34v2h-32v28zM0 197.9V190h18v2H2v4h-2v1.9zm0 12V202h2v6h14v2H0v-.1zm0-12V200h2v-2H0zm52-56V130h-2v12h-48v2h50zm-2 18V162H0v2h50v-2zM0 195.9V190h2v4h-2v1.9zm0 0V196H2v-2H0v1.9z',
				fillRule: 'evenodd',
			},
		],
	},
	'graph-paper': {
		label: 'Graph Paper',
		category: 'technical',
		width: 40,
		height: 40,
		paths: [
			{
				d: 'M0 40h40V0H0v40zm1-1V1h38v38H1z',
			},
			{
				d: 'M0 20h40V0H0v20zm1-1V1h38v18H1z',
			},
		],
	},
};

/**
 * All pattern IDs sorted alphabetically
 */
export const PATTERN_IDS = Object.keys(PATTERNS).sort();

/**
 * Pattern categories for grouping in the picker
 */
export const CATEGORIES = {
	minimal: 'Minimal',
	geometric: 'Geometric',
	organic: 'Organic',
	texture: 'Texture',
	depth: 'Depth',
	technical: 'Technical',
};
