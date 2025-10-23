/**
 * DesignSetGo - Block Extensions & Enhancements
 *
 * Extends WordPress core blocks with additional features
 * rather than creating custom blocks from scratch.
 *
 * @package DesignSetGo
 */

import './styles/editor.scss';
import './styles/style.scss';

// Block Enhancements - Extend core blocks with new features
import './extensions/group-enhancements';
import './extensions/group-enhancements/styles.scss';

// Block Variations - Pre-configured layouts
import './variations/group-variations';

// Global Extensions
import './extensions/animation';
import './extensions/responsive';

// Keep custom Container block for now (will deprecate after migration)
// import './blocks/container';
