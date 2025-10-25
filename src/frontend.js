/**
 * Frontend JavaScript Entry Point
 *
 * This file bundles all frontend scripts for the DesignSetGo plugin.
 * It will be compiled to build/frontend.js by @wordpress/scripts.
 *
 * @package
 */

// ===== CUSTOM BLOCKS FRONTEND =====
// Container block - video backgrounds, clickable containers
import './blocks/container/frontend.js';

// Tabs block - tab switching, keyboard navigation, deep linking
import './blocks/tabs/frontend.js';

// Accordion block - panel interactions, smooth animations
import './blocks/accordion/frontend.js';

// Counter Group block - animated counting with CountUp.js
import './blocks/counter-group/frontend.js';

// ===== EXTENSIONS FRONTEND =====
// Import animation scripts
import './extensions/animation/index.js';

// Additional frontend scripts can be imported here
