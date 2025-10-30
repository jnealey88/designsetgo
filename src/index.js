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
 * @package
 * @version 2.0
 */

// Global styles (variables, mixins, utilities)
import './styles/editor.scss';
// Note: Frontend styles are in src/style.scss (auto-compiled to build/style-index.css)

// ===== EXTENSIONS (Must load BEFORE blocks) =====
// Block animations - adds entrance/exit animations to all blocks
import './extensions/block-animations';

// Max width - adds max-width control to all blocks
import './extensions/max-width';

// Custom CSS - adds custom CSS control to all blocks
import './extensions/custom-css';

// Background Video - adds background video to all blocks
import './extensions/background-video';

// Overlay - adds color overlay to all blocks
import './extensions/overlay';

// ===== CUSTOM BLOCKS (Primary Architecture) =====
// Full React control, proper video backgrounds, state management

// Container blocks (new specialized blocks)
import './blocks/stack';
import './blocks/flex';
import './blocks/grid';

// Legacy container block (deprecated, use Stack/Flex/Grid instead)
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

// Icon List block (parent/child relationship)
import './blocks/icon-list';
import './blocks/icon-list/style.scss';
import './blocks/icon-list/editor.scss';
import './blocks/icon-list-item';
import './blocks/icon-list-item/style.scss';
import './blocks/icon-list-item/editor.scss';

// Progress Bar block (standalone)
import './blocks/progress-bar';
import './blocks/progress-bar/style.scss';
import './blocks/progress-bar/editor.scss';

// Pill block (standalone)
import './blocks/pill';
import './blocks/pill/style.scss';
import './blocks/pill/editor.scss';

// Icon Button block (standalone)
import './blocks/icon-button';
import './blocks/icon-button/style.scss';
import './blocks/icon-button/editor.scss';
