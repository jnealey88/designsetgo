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
import './blocks/container/view.js';

// Tabs block - tab switching, keyboard navigation, deep linking
import './blocks/tabs/view.js';

// Accordion block - panel interactions, smooth animations
import './blocks/accordion/view.js';

// Counter Group block - animated counting with CountUp.js
import './blocks/counter-group/view.js';

// Progress Bar block - scroll-triggered animations
import './blocks/progress-bar/view.js';

// ===== EXTENSIONS FRONTEND =====
// Block animations - scroll-triggered, hover, click animations
import './extensions/block-animations/frontend.js';

// Additional frontend scripts can be imported here
