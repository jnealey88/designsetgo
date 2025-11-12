/**
 * Frontend JavaScript Entry Point
 *
 * This file bundles all frontend scripts for the DesignSetGo plugin.
 * It will be compiled to build/frontend.js by @wordpress/scripts.
 *
 * @package
 */

// ===== CUSTOM BLOCKS FRONTEND =====
import './utils/focus-outline.js';

// Tabs block - tab switching, keyboard navigation, deep linking
import './blocks/tabs/view.js';

// Accordion block - panel interactions, smooth animations
import './blocks/accordion/view.js';

// Counter Group block - animated counting with CountUp.js
import './blocks/counter-group/view.js';

// Progress Bar block - scroll-triggered animations
import './blocks/progress-bar/view.js';

// Flip Card block - interactive flip animations
import './blocks/flip-card/frontend.js';

// ===== EXTENSIONS FRONTEND =====
// Block animations - scroll-triggered, hover, click animations
import './extensions/block-animations/frontend.js';

// Clickable group - makes containers clickable with link functionality
import './extensions/clickable-group/frontend.js';

// Background video - video background initialization
import './extensions/background-video/frontend.js';

// Additional frontend scripts can be imported here
