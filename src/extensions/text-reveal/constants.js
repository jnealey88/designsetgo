/**
 * Text Reveal Extension - Constants
 *
 * Default settings and supported blocks for the text reveal effect
 *
 * @package
 * @since 1.0.0
 */

/**
 * Default text reveal settings
 */
export const DEFAULT_TEXT_REVEAL_SETTINGS = {
	enabled: false,
	revealColor: '#2563eb', // Blue (blue-600) - color text transitions to
	splitMode: 'word', // 'word' or 'character'
	transitionDuration: 150, // ms per word/char transition
};

/**
 * Blocks that support the text reveal effect
 */
export const SUPPORTED_BLOCKS = ['core/paragraph', 'core/heading'];

/**
 * Split mode options for the inspector control
 */
export const SPLIT_MODE_OPTIONS = [
	{ label: 'Word', value: 'word' },
	{ label: 'Character', value: 'character' },
];

/**
 * Transition duration presets
 */
export const TRANSITION_DURATION_OPTIONS = [
	{ label: 'Fast (100ms)', value: 100 },
	{ label: 'Normal (150ms)', value: 150 },
	{ label: 'Slow (250ms)', value: 250 },
	{ label: 'Very Slow (400ms)', value: 400 },
];
