/**
 * DesignSetGo Blocks - Modern Gutenberg Block Library
 *
 * Primary Architecture: Custom blocks with full React control
 * Secondary: Minimal extensions for simple enhancements
 *
 * Architecture:
 * - Blocks: Custom blocks (95% of codebase)
 * - Extensions: Light enhancements to core blocks (5%)
 * - Variations: Pre-configured layouts
 * - Styles: Global styles and utilities
 *
 * @package DesignSetGo Blocks
 * @version 2.0
 */

// Global styles (variables, mixins, utilities)
import './styles/editor.scss';
// Note: Frontend styles are in src/style.scss (auto-compiled to build/style-index.css)

// ===== CUSTOM BLOCKS (Primary Architecture) =====
// Full React control, proper video backgrounds, state management
import './blocks/container';
import './blocks/container/style.scss';
import './blocks/container/editor.scss';

// Tabs block (parent/child relationship)
import './blocks/tabs';
import './blocks/tab';

// Accordion block (parent/child relationship)
import './blocks/accordion';
import './blocks/accordion/style.scss';
import './blocks/accordion/editor.scss';
import './blocks/accordion-item';
import './blocks/accordion-item/style.scss';
import './blocks/accordion-item/editor.scss';

// Counter Group block (parent/child relationship)
import './blocks/counter-group';
import './blocks/counter-group/style.scss';
import './blocks/counter-group/editor.scss';
import './blocks/counter';
import './blocks/counter/style.scss';
import './blocks/counter/editor.scss';

// Icon block (standalone)
import './blocks/icon';
import './blocks/icon/style.scss';
import './blocks/icon/editor.scss';

// Progress Bar block (standalone)
import './blocks/progress-bar';
import './blocks/progress-bar/style.scss';
import './blocks/progress-bar/editor.scss';

// ===== EXTENSIONS =====
// Block animations - adds entrance/exit animations to all blocks
import './extensions/block-animations';
