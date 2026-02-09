/**
 * SVG Patterns Extension
 *
 * Adds repeatable SVG background patterns to sections and groups.
 * Users can choose from a curated library of patterns, customize the color,
 * opacity, and scale. Patterns are rendered as CSS background-image data URIs
 * for zero-JS, instant rendering on the frontend.
 *
 * @package
 */

// Import styles
import './editor.scss';

// Import extension modules
import './attributes';
import './editor';

// Note: No frontend.js needed — patterns are pure CSS (inline SVG data URIs)
