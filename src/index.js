/**
 * DesignSetGo - Block Extensions & Enhancements
 *
 * Extends WordPress core blocks with additional features
 * rather than creating custom blocks from scratch.
 *
 * Architecture:
 * - Extensions: Enhance core blocks with new functionality
 * - Variations: Pre-configured layouts using core blocks
 * - Styles: Global styles and utilities
 *
 * @package DesignSetGo
 */

// Global styles (variables, mixins, utilities)
import './styles/editor.scss';
import './styles/style.scss';

// Block Extensions - Each extension is self-contained
import './extensions/group-enhancements';
import './extensions/animation';

// Block Variations - Pre-configured layouts
import './variations/group-variations';
