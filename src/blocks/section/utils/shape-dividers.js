/**
 * Shape Divider SVG Library
 *
 * Modern SVG shapes for section dividers.
 * All shapes use viewBox="0 0 1200 120" for consistent proportions.
 * Shapes fill width and scale height based on user settings.
 *
 * @since 1.4.2
 */

import { __ } from '@wordpress/i18n';

/**
 * Shape divider definitions
 * Each shape returns an SVG path element
 */
export const SHAPE_DIVIDERS = {
	// Smooth single wave
	wave: <path d="M0,0 C300,120 900,0 1200,80 L1200,120 L0,120 Z" />,

	// Gentle double wave
	'wave-double': (
		<path d="M0,40 C150,100 350,0 600,40 C850,80 1050,0 1200,60 L1200,120 L0,120 Z" />
	),

	// Triple layered waves
	'wave-layered': (
		<>
			<path
				d="M0,60 C300,20 600,100 900,40 C1050,10 1150,30 1200,50 L1200,120 L0,120 Z"
				opacity="0.5"
			/>
			<path
				d="M0,80 C200,40 400,100 600,60 C800,20 1000,80 1200,60 L1200,120 L0,120 Z"
				opacity="0.7"
			/>
			<path d="M0,100 C150,70 350,110 600,80 C850,50 1000,90 1200,70 L1200,120 L0,120 Z" />
		</>
	),

	// Asymmetric wave
	'wave-asymmetric': (
		<path d="M0,20 C400,120 800,0 1200,60 L1200,120 L0,120 Z" />
	),

	// Simple diagonal tilt
	tilt: <path d="M0,0 L1200,120 L1200,120 L0,120 Z" />,

	// Opposite diagonal
	'tilt-reverse': <path d="M0,120 L1200,0 L1200,120 L0,120 Z" />,

	// Smooth curved arc
	curve: <path d="M0,120 Q600,0 1200,120 L1200,120 L0,120 Z" />,

	// Inverted curve (bulge up)
	'curve-asymmetric': (
		<path d="M0,80 Q300,0 600,60 Q900,120 1200,40 L1200,120 L0,120 Z" />
	),

	// Center triangle/arrow pointing up
	triangle: <path d="M0,120 L600,0 L1200,120 L0,120 Z" />,

	// Asymmetric triangle
	'triangle-asymmetric': <path d="M0,120 L400,0 L1200,120 L0,120 Z" />,

	// Center arrow pointing down into section
	arrow: <path d="M0,0 L500,0 L600,80 L700,0 L1200,0 L1200,120 L0,120 Z" />,

	// Wide arrow
	'arrow-wide': (
		<path d="M0,0 L400,0 L600,100 L800,0 L1200,0 L1200,120 L0,120 Z" />
	),

	// Mountain peaks
	peaks: (
		<path d="M0,120 L200,40 L400,100 L600,20 L800,80 L1000,10 L1200,90 L1200,120 Z" />
	),

	// Soft mountain peaks
	'peaks-soft': (
		<path d="M0,120 Q100,40 200,80 Q300,20 400,60 Q500,10 600,50 Q700,0 800,40 Q900,20 1000,60 Q1100,40 1200,80 L1200,120 Z" />
	),

	// Zigzag pattern
	zigzag: (
		<path d="M0,120 L100,60 L200,120 L300,60 L400,120 L500,60 L600,120 L700,60 L800,120 L900,60 L1000,120 L1100,60 L1200,120 Z" />
	),

	// Book page effect
	book: (
		<path d="M0,120 Q300,100 600,40 Q900,100 1200,120 L1200,120 L0,120 Z" />
	),

	// Fluffy clouds
	clouds: (
		<path d="M0,120 L0,80 Q100,40 200,80 Q300,20 450,70 Q550,30 650,80 Q750,20 850,70 Q950,40 1050,80 Q1150,50 1200,80 L1200,120 Z" />
	),

	// Oval drops pattern
	drops: (
		<>
			<ellipse cx="100" cy="90" rx="100" ry="50" />
			<ellipse cx="350" cy="100" rx="120" ry="40" />
			<ellipse cx="580" cy="85" rx="90" ry="55" />
			<ellipse cx="800" cy="95" rx="110" ry="45" />
			<ellipse cx="1030" cy="90" rx="100" ry="50" />
			<rect x="0" y="100" width="1200" height="20" />
		</>
	),

	// Split center
	split: (
		<path d="M0,0 L550,0 L550,80 L0,80 Z M650,0 L1200,0 L1200,80 L650,80 Z M0,80 L0,120 L1200,120 L1200,80 L650,80 L650,40 L600,80 L550,40 L550,80 L0,80 Z" />
	),

	// Fan/rays effect
	fan: (
		<>
			<path d="M600,120 L0,120 L600,0 Z" opacity="0.3" />
			<path d="M600,120 L200,120 L600,20 Z" opacity="0.5" />
			<path d="M600,120 L400,120 L600,40 Z" opacity="0.7" />
			<path d="M600,120 L1200,120 L600,0 Z" opacity="0.3" />
			<path d="M600,120 L1000,120 L600,20 Z" opacity="0.5" />
			<path d="M600,120 L800,120 L600,40 Z" opacity="0.7" />
		</>
	),

	// Rounded steps
	steps: (
		<path d="M0,120 L0,80 Q100,80 100,60 L400,60 Q400,40 500,40 L700,40 Q700,60 800,60 L1100,60 Q1100,80 1200,80 L1200,120 Z" />
	),

	// Paper tear effect
	torn: (
		<path d="M0,60 L40,80 L80,50 L140,90 L180,55 L240,85 L300,45 L360,75 L420,55 L480,95 L540,50 L600,80 L660,40 L720,70 L780,50 L840,90 L900,55 L960,85 L1020,45 L1080,75 L1140,60 L1200,80 L1200,120 L0,120 Z" />
	),

	// Slime/drip effect
	slime: (
		<path d="M0,0 L0,40 Q50,40 50,80 Q50,120 100,120 L100,60 Q100,40 150,40 L150,100 Q150,120 200,120 L1000,120 Q1050,120 1050,100 L1050,40 Q1050,40 1100,40 L1100,80 Q1100,120 1150,120 Q1200,120 1200,80 L1200,0 Z" />
	),
};

/**
 * Get shape divider options for SelectControl
 *
 * @return {Array} Array of shape options with translated labels
 */
export function getShapeDividerOptions() {
	return [
		{ label: __('None', 'designsetgo'), value: '' },
		{ label: __('Wave', 'designsetgo'), value: 'wave' },
		{ label: __('Wave Double', 'designsetgo'), value: 'wave-double' },
		{ label: __('Wave Layered', 'designsetgo'), value: 'wave-layered' },
		{
			label: __('Wave Asymmetric', 'designsetgo'),
			value: 'wave-asymmetric',
		},
		{ label: __('Tilt', 'designsetgo'), value: 'tilt' },
		{ label: __('Tilt Reverse', 'designsetgo'), value: 'tilt-reverse' },
		{ label: __('Curve', 'designsetgo'), value: 'curve' },
		{
			label: __('Curve Asymmetric', 'designsetgo'),
			value: 'curve-asymmetric',
		},
		{ label: __('Triangle', 'designsetgo'), value: 'triangle' },
		{
			label: __('Triangle Asymmetric', 'designsetgo'),
			value: 'triangle-asymmetric',
		},
		{ label: __('Arrow', 'designsetgo'), value: 'arrow' },
		{ label: __('Arrow Wide', 'designsetgo'), value: 'arrow-wide' },
		{ label: __('Peaks', 'designsetgo'), value: 'peaks' },
		{ label: __('Peaks Soft', 'designsetgo'), value: 'peaks-soft' },
		{ label: __('Zigzag', 'designsetgo'), value: 'zigzag' },
		{ label: __('Book', 'designsetgo'), value: 'book' },
		{ label: __('Clouds', 'designsetgo'), value: 'clouds' },
		{ label: __('Drops', 'designsetgo'), value: 'drops' },
		{ label: __('Split', 'designsetgo'), value: 'split' },
		{ label: __('Fan', 'designsetgo'), value: 'fan' },
		{ label: __('Steps', 'designsetgo'), value: 'steps' },
		{ label: __('Torn Paper', 'designsetgo'), value: 'torn' },
		{ label: __('Slime', 'designsetgo'), value: 'slime' },
	];
}

/**
 * Get a shape divider SVG element
 *
 * @param {string} shapeName - Name of the shape
 * @return {JSX.Element|null} SVG element or null if not found
 */
export function getShapeDivider(shapeName) {
	return SHAPE_DIVIDERS[shapeName] || null;
}

/**
 * Get all shape divider names
 *
 * @return {string[]} Array of shape names
 */
export function getShapeDividerNames() {
	return Object.keys(SHAPE_DIVIDERS);
}
