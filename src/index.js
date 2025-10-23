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
// v2: Works WITH WordPress native layout controls instead of against them
import './extensions/group-enhancements/index-v2';
import './extensions/group-enhancements/styles-v2.scss';
import './extensions/group-enhancements/editor.scss';

// Block Variations - Pre-configured layouts
// v2: Uses WordPress layout attribute (type: flex/grid)
import './variations/group-variations/index-v2';

// Global Extensions
import './extensions/animation';
import './extensions/responsive';

// Keep custom Container block for now (will deprecate after migration)
// import './blocks/container';
