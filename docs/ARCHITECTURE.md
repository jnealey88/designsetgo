# DesignSetGo Architecture

Complete guide to DesignSetGo's architecture, code organization, and how everything works together.

## 📋 Table of Contents

- [High-Level Overview](#high-level-overview)
- [Directory Structure](#directory-structure)
- [Block Architecture](#block-architecture)
- [Build System](#build-system)
- [Data Flow](#data-flow)
- [Extension System](#extension-system)
- [PHP Backend](#php-backend)
- [Asset Loading](#asset-loading)
- [Testing Infrastructure](#testing-infrastructure)
- [AI Integration](#ai-integration)

## High-Level Overview

### Technology Stack

```
┌─────────────────────────────────────────┐
│         WordPress 6.4+                  │
│  ┌───────────────────────────────────┐  │
│  │   Block Editor (Gutenberg)        │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  DesignSetGo Blocks         │  │  │
│  │  │  (React Components)         │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘

Frontend:                Backend:
- React 18              - PHP 7.4+
- WordPress Packages    - WordPress APIs
- SCSS/CSS             - MySQL
```

### Core Components

1. **Blocks** (`src/blocks/`) - Individual block implementations
2. **Extensions** (`src/extensions/`) - Features added to existing blocks
3. **Components** (`src/components/`) - Shared React components
4. **Utilities** (`src/utils/`) - Helper functions
5. **Styles** (`src/styles/`) - Global styles and variables
6. **PHP Classes** (`includes/`) - Server-side functionality

### Request Flow

```
User creates content in editor
         ↓
React components render in browser
         ↓
User saves post
         ↓
Block attributes sent to WordPress
         ↓
Stored in database as HTML + block comments
         ↓
Frontend request
         ↓
WordPress renders saved HTML
         ↓
CSS/JS assets loaded
         ↓
Interactive features initialize
```

## Directory Structure

### Complete File Tree

```
designsetgo/
│
├── .claude/                    # AI development context
│   └── CLAUDE.md              # Development patterns for Claude Code
│
├── .github/                   # GitHub configuration
│   └── workflows/            # CI/CD pipelines
│
├── build/                     # Compiled output (auto-generated)
│   ├── blocks/               # Compiled block assets
│   │   └── {block-name}/
│   │       ├── index.js      # Compiled JavaScript
│   │       ├── style-index.css  # Frontend styles
│   │       └── *.asset.php   # Dependency manifest
│   ├── admin.css             # Admin styles
│   ├── frontend.js           # Frontend scripts
│   └── style-index.css       # Global styles
│
├── docs/                      # Developer documentation
│   ├── ARCHITECTURE.md       # This file
│   ├── GETTING-STARTED.md    # Setup guide
│   ├── BEST-PRACTICES-SUMMARY.md
│   ├── BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md
│   ├── FSE-COMPATIBILITY-GUIDE.md
│   ├── TESTING.md
│   └── ...
│
├── includes/                  # PHP source code
│   ├── admin/                # Admin interface
│   │   ├── class-admin-menu.php
│   │   └── class-settings.php
│   ├── blocks/               # Block registration
│   │   ├── class-block-registry.php
│   │   └── class-block-styles.php
│   ├── patterns/             # Pattern registration
│   │   └── class-pattern-registry.php
│   ├── abilities/            # WordPress Abilities API
│   │   └── class-abilities-provider.php
│   ├── class-plugin.php      # Main plugin class
│   ├── class-assets.php      # Asset management
│   └── class-i18n.php        # Internationalization
│
├── languages/                 # Translation files
│   ├── designsetgo.pot       # Template
│   └── designsetgo-{locale}.po/mo  # Translations
│
├── patterns/                  # Block patterns (PHP)
│   ├── hero-section.php
│   ├── three-column-grid.php
│   └── ...
│
├── src/                       # JavaScript source code
│   ├── blocks/               # Block implementations
│   │   ├── accordion/        # Example: Accordion block
│   │   │   ├── block.json    # Block configuration
│   │   │   ├── index.js      # Registration
│   │   │   ├── edit.js       # Editor component
│   │   │   ├── save.js       # Frontend output
│   │   │   ├── style.scss    # Frontend styles
│   │   │   ├── editor.scss   # Editor styles
│   │   │   ├── view.js       # Frontend JavaScript (if needed)
│   │   │   ├── components/   # Block-specific components
│   │   │   │   └── inspector/
│   │   │   │       └── LayoutPanel.js
│   │   │   └── utils/        # Block-specific utilities
│   │   │       └── helpers.js
│   │   └── ...
│   │
│   ├── components/           # Shared React components
│   │   ├── IconPicker/       # Reusable icon picker
│   │   ├── GradientPicker/   # Gradient selection
│   │   └── ResponsiveControl/ # Responsive toggles
│   │
│   ├── extensions/           # Block extensions
│   │   ├── animations/       # Animation system
│   │   │   ├── index.js
│   │   │   ├── animations.scss
│   │   │   └── panel.js
│   │   └── responsive/       # Responsive visibility
│   │
│   ├── styles/               # Global styles
│   │   ├── style.scss        # Frontend global styles
│   │   ├── editor.scss       # Editor global styles
│   │   ├── admin.scss        # Admin interface styles
│   │   ├── variables/        # SCSS variables
│   │   │   ├── _colors.scss
│   │   │   ├── _spacing.scss
│   │   │   └── _typography.scss
│   │   └── utilities/        # Utility classes
│   │       ├── _animations.scss
│   │       └── _responsive.scss
│   │
│   ├── utils/                # Shared utilities
│   │   ├── block-helpers.js  # Block utility functions
│   │   ├── color-utils.js    # Color manipulation
│   │   └── animation-utils.js # Animation helpers
│   │
│   ├── admin.js              # Admin interface entry
│   ├── index.js              # Main entry point
│   └── frontend.js           # Frontend scripts entry
│
├── tests/                     # Test files
│   ├── e2e/                  # End-to-end tests (Playwright)
│   │   ├── accordion.spec.js
│   │   ├── tabs.spec.js
│   │   └── ...
│   ├── unit/                 # Unit tests (Jest)
│   │   └── blocks/
│   │       └── icon/
│   │           └── edit.test.js
│   └── php/                  # PHP tests (PHPUnit)
│       └── test-plugin.php
│
├── .editorconfig             # Editor configuration
├── .eslintrc.js             # JavaScript linting rules
├── .prettierrc              # Code formatting rules
├── .wp-env.json             # WordPress environment config
├── composer.json            # PHP dependencies
├── designsetgo.php          # Main plugin file
├── package.json             # Node.js dependencies
├── phpcs.xml                # PHP coding standards
├── playwright.config.js     # E2E test configuration
├── README.md                # Project overview
└── webpack.config.js        # Build configuration
```

## Block Architecture

### Anatomy of a Block

Every block consists of these core files:

#### 1. block.json - Block Configuration

**Purpose:** Defines block metadata, attributes, and supports.

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "designsetgo/my-block",
  "title": "My Block",
  "category": "design",
  "icon": "star-filled",
  "description": "Description of what the block does",
  "keywords": ["keyword1", "keyword2"],

  "attributes": {
    "content": {
      "type": "string",
      "default": ""
    },
    "alignment": {
      "type": "string",
      "default": "center"
    }
  },

  "supports": {
    "color": {
      "text": true,
      "background": true
    },
    "spacing": {
      "padding": true,
      "margin": true
    }
  },

  "editorScript": "file:./index.js",
  "editorStyle": "file:./editor.scss",
  "style": "file:./style.scss",
  "viewScript": "file:./view.js"
}
```

**Key Sections:**
- **Metadata** - Name, title, icon, description
- **Attributes** - Block data/settings
- **Supports** - WordPress Block Supports integration
- **Assets** - Script and style references

#### 2. index.js - Registration

**Purpose:** Registers the block with WordPress.

```javascript
import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save,
});
```

**What happens:**
1. Imports metadata from `block.json`
2. Imports Edit and save components
3. Imports styles
4. Registers with WordPress Block API

#### 3. edit.js - Editor Component

**Purpose:** React component that renders in the block editor.

```javascript
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const { content } = attributes;
  const blockProps = useBlockProps();

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Settings', 'designsetgo')}>
          <TextControl
            label={__('Content', 'designsetgo')}
            value={content}
            onChange={(value) => setAttributes({ content: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        {content || __('Enter content...', 'designsetgo')}
      </div>
    </>
  );
}
```

**Key Patterns:**
- **useBlockProps()** - Required for all blocks
- **InspectorControls** - Sidebar settings
- **setAttributes()** - Update block data
- **i18n** - All strings must be translatable

#### 4. save.js - Frontend Output

**Purpose:** Generates HTML saved to database.

```javascript
import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
  const { content } = attributes;
  const blockProps = useBlockProps.save();

  return (
    <div {...blockProps}>
      {content}
    </div>
  );
}
```

**Critical Rules:**
- Must return static HTML (no React components)
- Must use `useBlockProps.save()`
- Structure must match `edit.js` output
- Changes require deprecation strategy

#### 5. view.js - Frontend JavaScript (Optional)

**Purpose:** Interactive functionality on frontend.

```javascript
// Frontend initialization
document.addEventListener('DOMContentLoaded', () => {
  const blocks = document.querySelectorAll('[data-dsgo-my-block]');

  blocks.forEach((block) => {
    const button = block.querySelector('[data-dsgo-button]');

    button?.addEventListener('click', () => {
      // Handle interaction
    });
  });
});
```

**When to use:**
- Interactive blocks (accordions, tabs, sliders)
- Animations triggered on scroll
- Dynamic content loading

**Best practices:**
- Use data attributes for selection
- Event delegation when possible
- Clean up event listeners

### Block Types

#### Container Blocks (Parent-Child)

**Examples:** Accordion, Tabs, Grid

```javascript
// Parent block
{
  "supports": {
    "html": false
  },
  "providesContext": {
    "designsetgo/accordion/variant": "variant"
  }
}

// Child block
{
  "parent": ["designsetgo/accordion"],
  "usesContext": ["designsetgo/accordion/variant"]
}
```

**Pattern:**
1. Parent provides context to children
2. Children use context for inherited settings
3. InnerBlocks for child management

#### Dynamic Blocks (PHP Rendering)

**Examples:** Form Builder, Dynamic Content

```php
// includes/blocks/class-form-builder.php
class Form_Builder_Block {
  public static function render_callback($attributes, $content) {
    // Generate HTML server-side
    return '<form>' . $content . '</form>';
  }
}

// Register with callback
register_block_type('designsetgo/form-builder', [
  'render_callback' => ['Form_Builder_Block', 'render_callback'],
]);
```

**When to use:**
- Need server-side data
- Form submissions
- Security-sensitive operations

#### Static Blocks (Pure Frontend)

**Examples:** Icon, Pill, Divider

No `view.js` needed - all styling via CSS.

## Build System

### Webpack Configuration

**Location:** `webpack.config.js`

```javascript
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
  ...defaultConfig,
  entry: {
    // Main entry points
    index: './src/index.js',
    frontend: './src/frontend.js',
    admin: './src/admin.js',

    // Individual blocks
    'blocks/accordion/index': './src/blocks/accordion/index.js',
    'blocks/tabs/index': './src/blocks/tabs/index.js',
    // ...
  },
};
```

### Build Process

```
1. Source Files (src/)
   ├── JavaScript (.js)
   ├── SCSS (.scss)
   └── Assets (images, fonts)
        ↓
2. Webpack Processing
   ├── Babel (transpile JS)
   ├── Sass (compile SCSS)
   ├── PostCSS (autoprefixer, minify)
   └── Dependency Extraction
        ↓
3. Output (build/)
   ├── Compiled JS
   ├── Compiled CSS
   ├── Source maps
   └── Asset manifests (.asset.php)
        ↓
4. WordPress Registration
   └── PHP loads assets with dependencies
```

### Asset Dependencies

**Generated:** `build/blocks/*/index.asset.php`

```php
<?php
return [
  'dependencies' => [
    'wp-block-editor',
    'wp-blocks',
    'wp-components',
    'wp-element',
    'wp-i18n'
  ],
  'version' => 'abc123def456'
];
```

**Purpose:**
- Ensures WordPress packages load first
- Cache busting via version hash
- Correct load order

## Data Flow

### Editor to Database

```
1. User edits block
   ↓
2. React setState updates attributes
   ↓
3. WordPress serializes block to HTML comment
   <!-- wp:designsetgo/icon {"iconSize":32} -->
   <div class="wp-block-designsetgo-icon">...</div>
   <!-- /wp:designsetgo/icon -->
   ↓
4. Saved to post_content in database
```

### Database to Frontend

```
1. WordPress retrieves post_content
   ↓
2. Block parser reads HTML comments
   ↓
3. For static blocks:
   └── HTML rendered directly

4. For dynamic blocks:
   └── render_callback() generates HTML
   ↓
5. CSS/JS assets enqueued
   ↓
6. view.js initializes (if exists)
```

### Block Context Flow

```
Parent Block
  ├── Provides context via providesContext
  │
  ├── Child Block 1
  │   └── Receives via usesContext
  │
  └── Child Block 2
      └── Receives via usesContext
```

**Example:**
```javascript
// Parent (Accordion)
"providesContext": {
  "designsetgo/accordion/variant": "variant",
  "designsetgo/accordion/iconPosition": "iconPosition"
}

// Child (Accordion Item)
"usesContext": [
  "designsetgo/accordion/variant",
  "designsetgo/accordion/iconPosition"
]

// In child edit.js
export default function Edit({ attributes, context }) {
  const variant = context['designsetgo/accordion/variant'];
  // Use parent's variant
}
```

## Extension System

### How Extensions Work

Extensions use WordPress filter hooks to modify block registration:

```javascript
import { addFilter } from '@wordpress/hooks';

// Add custom attribute to specific blocks
addFilter(
  'blocks.registerBlockType',
  'designsetgo/add-animation',
  (settings, name) => {
    // Only apply to specific blocks
    const allowedBlocks = ['core/group', 'core/paragraph'];
    if (!allowedBlocks.includes(name)) {
      return settings;
    }

    return {
      ...settings,
      attributes: {
        ...settings.attributes,
        dsgoAnimation: {
          type: 'string',
          default: '',
        },
      },
    };
  }
);
```

### Extension Structure

```
src/extensions/animations/
├── index.js          # Registration and filters
├── panel.js          # Inspector controls
├── attributes.js     # Attribute definitions
├── animations.scss   # Animation styles
└── apply.js          # Apply to blocks
```

### Available Extensions

1. **Block Animations** - Entrance/exit animations
2. **Responsive Controls** - Hide on devices
3. **Custom CSS** - Per-block custom styles

## PHP Backend

### Main Plugin Class

**Location:** `includes/class-plugin.php`

```php
class Plugin {
  private static $instance = null;

  public static function get_instance() {
    if (null === self::$instance) {
      self::$instance = new self();
    }
    return self::$instance;
  }

  private function __construct() {
    $this->load_dependencies();
    $this->register_hooks();
  }

  private function load_dependencies() {
    require_once DESIGNSETGO_PATH . 'includes/class-assets.php';
    require_once DESIGNSETGO_PATH . 'includes/class-i18n.php';
    // ...
  }

  private function register_hooks() {
    add_action('init', [$this, 'register_blocks']);
    add_action('enqueue_block_assets', [$this, 'enqueue_assets']);
    // ...
  }
}
```

### Block Registration

**Location:** `includes/blocks/class-block-registry.php`

```php
class Block_Registry {
  public function register_all_blocks() {
    $blocks = [
      'accordion',
      'tabs',
      'icon',
      // ...
    ];

    foreach ($blocks as $block) {
      $this->register_block($block);
    }
  }

  private function register_block($name) {
    register_block_type(
      DESIGNSETGO_PATH . "build/blocks/{$name}"
    );
  }
}
```

### Asset Management

**Location:** `includes/class-assets.php`

```php
class Assets {
  public function enqueue_editor_assets() {
    $asset_file = include DESIGNSETGO_PATH . 'build/index.asset.php';

    wp_enqueue_script(
      'designsetgo-editor',
      DESIGNSETGO_URL . 'build/index.js',
      $asset_file['dependencies'],
      $asset_file['version'],
      true
    );

    wp_enqueue_style(
      'designsetgo-editor',
      DESIGNSETGO_URL . 'build/index.css',
      [],
      $asset_file['version']
    );
  }
}
```

## Testing Infrastructure

### E2E Tests (Playwright)

**Location:** `tests/e2e/`

```javascript
import { test, expect } from '@playwright/test';

test.describe('Accordion Block', () => {
  test.beforeEach(async ({ page, admin }) => {
    await admin.createNewPost();
  });

  test('should insert accordion block', async ({ page, editor }) => {
    await editor.insertBlock({ name: 'designsetgo/accordion' });

    const accordion = await editor.getBlock({
      name: 'designsetgo/accordion'
    });

    await expect(accordion).toBeVisible();
  });

  test('should toggle accordion item', async ({ page }) => {
    // Test frontend behavior
    await page.goto('/test-page');

    const trigger = page.locator('[data-dsgo-accordion-trigger]').first();
    const content = page.locator('[data-dsgo-accordion-content]').first();

    await expect(content).toBeHidden();
    await trigger.click();
    await expect(content).toBeVisible();
  });
});
```

### Unit Tests (Jest)

**Location:** `tests/unit/`

```javascript
import { render } from '@testing-library/react';
import Edit from '../../../src/blocks/icon/edit';

describe('Icon Block Edit', () => {
  const defaultProps = {
    attributes: {
      icon: 'star',
      iconSize: 24,
    },
    setAttributes: jest.fn(),
    clientId: 'test-client-id',
  };

  it('renders without crashing', () => {
    const { container } = render(<Edit {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('displays selected icon', () => {
    const { getByText } = render(<Edit {...defaultProps} />);
    expect(getByText('star')).toBeInTheDocument();
  });
});
```

## AI Integration

### WordPress Abilities API

**Location:** `includes/abilities/`

The Abilities API allows AI agents to programmatically interact with blocks.

```php
// includes/abilities/class-abilities-provider.php
class Abilities_Provider {
  public function register_abilities() {
    register_ability('designsetgo/list-blocks', [
      'callback' => [$this, 'list_blocks'],
      'schema' => [...],
    ]);

    register_ability('designsetgo/insert-flex-container', [
      'callback' => [$this, 'insert_flex_container'],
      'schema' => [...],
    ]);
  }

  public function list_blocks($params) {
    // Return block information
    return [
      'blocks' => $this->get_all_blocks(),
    ];
  }
}
```

**Usage by AI:**
```bash
curl -X POST http://site.com/wp-json/wp-abilities/v1/abilities/designsetgo/list-blocks/execute \
  -u "user:pass" \
  -d '{"category": "all"}'
```

See [ABILITIES-API.md](ABILITIES-API.md) for complete documentation.

## Key Architectural Decisions

### 1. WordPress-First Approach

**Decision:** Use WordPress built-in features before custom solutions.

**Benefits:**
- Better theme compatibility
- Automatic updates with WordPress
- Reduced bundle sizes
- Familiar to WordPress developers

**Examples:**
- Block Supports instead of custom controls
- theme.json integration for colors/spacing
- useBlockProps instead of manual className

### 2. File Size Limit (300 lines)

**Decision:** Maximum 300 lines per file.

**Benefits:**
- Easier to understand
- Faster code reviews
- Better testability
- Encourages modular design

**Implementation:**
- Extract components to `components/`
- Extract utilities to `utils/`
- One concern per file

### 3. Prefix Convention (dsgo-)

**Decision:** All custom identifiers use `dsgo-` prefix.

**Benefits:**
- Prevents naming conflicts
- Easy to identify plugin code
- Consistent across codebase

**Applied to:**
- CSS classes
- Data attributes
- JavaScript variables (camelCase: dsgoAnimation)
- PHP functions (snake_case: designsetgo_*)

### 4. No jQuery Dependency

**Decision:** Pure vanilla JavaScript for frontend interactions.

**Benefits:**
- Smaller bundle sizes (~30KB saved)
- Better performance
- Modern browser APIs
- Easier to maintain

### 5. Declarative Styling

**Decision:** No DOM manipulation in React components.

**Benefits:**
- Matches WordPress patterns
- Better editor/frontend parity
- Easier to maintain
- Better performance

**Pattern:**
```javascript
// ✅ CORRECT - Declarative
const blockProps = useBlockProps({
  style: { color: textColor }
});

// ❌ WRONG - Imperative
useEffect(() => {
  element.style.color = textColor;
}, [textColor]);
```

## Common Patterns

### Adding a New Block

1. Create directory: `src/blocks/my-block/`
2. Copy template from `docs/BLOCK-TEMPLATE-EDIT.js`
3. Create `block.json` with metadata
4. Implement `edit.js` and `save.js`
5. Add styles in `style.scss`
6. Register in `src/index.js`
7. Add PHP registration if needed
8. Write tests

### Adding a New Extension

1. Create directory: `src/extensions/my-extension/`
2. Add filter to modify `registerBlockType`
3. Create inspector panel component
4. Add styles
5. Apply to blocks via `addFilter`

### Adding Global Styles

1. Add to `src/styles/style.scss` for frontend
2. Add to `src/styles/editor.scss` for editor
3. Use SCSS variables from `src/styles/variables/`
4. Scope to plugin blocks when possible

## Performance Considerations

### Code Splitting

Each block is compiled separately:
- Users only load blocks they use
- Faster page loads
- Better caching

### CSS Optimization

```scss
// Use :where() for low specificity
:where(.wp-block-designsetgo-icon) {
  display: inline-flex;
}

// Scope to plugin blocks
.wp-block[class*="wp-block-designsetgo-"] {
  /* Styles */
}
```

### Asset Loading

- `editorScript` - Only loads in editor
- `viewScript` - Only loads on frontend (when block present)
- Conditional loading based on block usage

## Further Reading

- [GETTING-STARTED.md](GETTING-STARTED.md) - Setup guide
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution workflow
- [../.claude/CLAUDE.md](../.claude/CLAUDE.md) - Development patterns
- [TESTING.md](TESTING.md) - Testing guide
- [Block Editor Handbook](https://developer.wordpress.org/block-editor/) - Official docs

---

**Last Updated:** 2025-11-15 | **Version:** 1.0.0 | **WordPress:** 6.4+
