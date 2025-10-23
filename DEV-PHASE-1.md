# Airo Blocks - Phase 1 MVP Development Documentation

**Version:** 1.0
**Target Timeline:** 16 weeks (4 months)
**Release Version:** 1.0.0

---

## Table of Contents

1. [Overview](#overview)
2. [FSE Integration Philosophy](#fse-integration-philosophy)
3. [Technical Stack](#technical-stack)
4. [Project Structure](#project-structure)
5. [Development Environment Setup](#development-environment-setup)
6. [Architecture](#architecture)
7. [Block Specifications](#block-specifications)
8. [Shared Components](#shared-components)
9. [Global Styles System](#global-styles-system)
10. [Pattern Library](#pattern-library)
11. [Animation System](#animation-system)
12. [Responsive System](#responsive-system)
13. [Development Workflow](#development-workflow)
14. [Code Standards](#code-standards)
15. [Testing Strategy](#testing-strategy)
16. [Performance Budget](#performance-budget)
17. [Sprint Breakdown](#sprint-breakdown)
18. [Dependencies](#dependencies)
19. [Deployment](#deployment)

---

## Overview

### Phase 1 Goals

**Primary Objective:** Launch a production-ready, 100% free open-source MVP with 15 essential blocks that demonstrate clear value over core Gutenberg blocks and establish the foundation for future development.

**License:** GPL v2 or later (WordPress compatible)

**Success Criteria:**
- All 15 MVP blocks functional and polished
- FSE-compatible (leverages WordPress Block Supports API)
- theme.json integration for global styles
- 20+ patterns available
- Performance targets met (<100KB total)
- Accessibility compliance (WCAG 2.1 AA)
- Zero critical bugs
- WordPress.org ready

### Scope

**In Scope:**
- 15 core blocks (Container, Advanced Heading, Button, Hero, Feature Cards, Icon, Testimonial, Pricing Table, Team Member, CTA, Divider, Spacer, **Tabs, Accordion, Counter**)
- FSE-native global styles (theme.json integration)
- WordPress Block Supports API integration
- Basic animation system
- Responsive controls
- 20+ pre-built patterns
- Documentation site
- WordPress.org submission
- Open source community setup (GitHub, contributing guidelines)

**Out of Scope (Phase 2):**
- Advanced animation system (parallax, scroll-triggered) - **Will be free in Phase 2**
- Dynamic content - **Will be free in Phase 2**
- WooCommerce integration - **Will be free in Phase 2**
- Theme builder - **Will be free in Phase 3**
- Additional advanced blocks - **Will be free in Phase 2**

---

## FSE Integration Philosophy

### Why FSE-First Matters

Airo Blocks is built **FSE-first**, meaning we leverage WordPress's Full Site Editing capabilities wherever possible instead of building custom solutions.

**Benefits:**
1. **Theme Compatibility** - Blocks inherit theme styles automatically
2. **Reduced Code** - Less custom CSS and controls to maintain
3. **Better Performance** - WordPress optimizes CSS generation
4. **Future-Proof** - Aligned with WordPress core direction
5. **Consistent UX** - Familiar controls for WordPress users
6. **Accessibility** - WordPress handles contrast and accessibility

### Core FSE Features We Leverage

#### 1. **Block Supports API**

Use WordPress's native `supports` in `block.json` instead of custom attributes:

```json
{
  "supports": {
    "color": {
      "background": true,
      "text": true,
      "gradients": true,
      "link": true
    },
    "spacing": {
      "margin": true,
      "padding": true,
      "blockGap": true
    },
    "typography": {
      "fontSize": true,
      "lineHeight": true,
      "fontFamily": true,
      "fontWeight": true
    },
    "layout": {
      "default": { "type": "constrained" },
      "allowEditing": true
    },
    "__experimentalBorder": {
      "color": true,
      "radius": true,
      "style": true,
      "width": true
    }
  }
}
```

#### 2. **theme.json Integration**

Instead of custom global styles storage in `wp_options`, extend `theme.json`:

```php
// Extend theme.json settings
add_filter('wp_theme_json_data_theme', function($theme_json) {
    $new_data = [
        'settings' => [
            'blocks' => [
                'airo-blocks/container' => [
                    'color' => [
                        'palette' => [
                            ['slug' => 'primary', 'color' => '#2563eb', 'name' => 'Primary'],
                            // etc
                        ]
                    ]
                ]
            ]
        ]
    ];
    return $theme_json->update_with($new_data);
});
```

#### 3. **WordPress Color Palette & Presets**

Use preset slugs instead of hex values:

```html
<!-- Instead of custom colors -->
<div style="background-color: #2563eb;">

<!-- Use WordPress presets -->
<div class="has-primary-background-color has-background">
```

#### 4. **WordPress Spacing Scale**

Use WordPress spacing units:

```css
.wp-block-airo-blocks-container {
  padding: var(--wp--preset--spacing--50);
  margin: var(--wp--preset--spacing--60);
}
```

### What We Still Build Custom

While we leverage FSE, some features require custom implementation:

**Custom Features:**
- Advanced animations (WordPress doesn't have this yet)
- Shape dividers (visual enhancement)
- Advanced hover effects
- Icon library integration
- Pattern-specific features

**Rule of Thumb:** If WordPress core has it or is building it → use theirs. If it's a unique value-add → build custom.

### FSE-First Development Checklist

For every block, ask:

- [ ] Can we use Block Supports API instead of custom attributes?
- [ ] Can we use theme.json presets instead of custom values?
- [ ] Can we use WordPress Layout API instead of custom flex/grid?
- [ ] Can we use `<PanelColorSettings>` instead of custom color picker?
- [ ] Can we use `<FontSizePicker>` with theme presets?
- [ ] Are we following WordPress CSS custom property naming conventions?

---

## Technical Stack

### Core Technologies

**Frontend:**
- React 18.2+
- WordPress Block Editor API v2
- @wordpress/scripts ^26.0.0
- JavaScript ES6+ (ESNext)
- TypeScript (optional, recommended for shared utilities)

**Styling:**
- SCSS/Sass
- PostCSS
- CSS Custom Properties
- No CSS frameworks (custom implementation)

**Backend:**
- PHP 7.4+ (target 8.0+)
- WordPress 6.0+ minimum (test with 6.4+)
- No external PHP dependencies

**Build Tools:**
- @wordpress/scripts (Webpack 5, Babel)
- @wordpress/env (local development)
- npm/pnpm package manager

**Development Tools:**
- ESLint (WordPress config)
- Stylelint
- Prettier
- PHP_CodeSniffer (PHPCS)
- PHPStan
- Git hooks (Husky)

---

## Project Structure

```
airo-blocks/
├── .wordpress-org/           # WordPress.org assets
│   ├── banner-1544x500.png
│   ├── banner-772x250.png
│   ├── icon-128x128.png
│   ├── icon-256x256.png
│   └── screenshot-*.png
├── assets/
│   ├── images/
│   └── fonts/
├── build/                    # Compiled output (gitignored)
├── includes/                 # PHP files
│   ├── admin/
│   │   ├── class-settings.php
│   │   └── class-global-styles.php
│   ├── blocks/
│   │   └── class-blocks-loader.php
│   ├── patterns/
│   │   └── class-patterns-loader.php
│   ├── class-assets.php
│   ├── class-plugin.php
│   └── helpers.php
├── languages/               # Translation files
├── patterns/               # Block patterns
│   ├── hero/
│   ├── features/
│   ├── pricing/
│   └── ...
├── src/                    # Source files
│   ├── blocks/
│   │   ├── container/
│   │   │   ├── block.json
│   │   │   ├── index.js
│   │   │   ├── edit.js
│   │   │   ├── save.js
│   │   │   ├── style.scss
│   │   │   ├── editor.scss
│   │   │   ├── attributes.js
│   │   │   └── components/
│   │   ├── advanced-heading/
│   │   ├── button/
│   │   ├── hero/
│   │   ├── feature-cards/
│   │   ├── icon/
│   │   ├── testimonial/
│   │   ├── pricing-table/
│   │   ├── team-member/
│   │   ├── cta/
│   │   ├── divider/
│   │   └── spacer/
│   ├── components/          # Shared React components
│   │   ├── controls/
│   │   │   ├── BackgroundControl.js
│   │   │   ├── BorderControl.js
│   │   │   ├── BoxShadowControl.js
│   │   │   ├── ColorControl.js
│   │   │   ├── DimensionsControl.js
│   │   │   ├── GradientControl.js
│   │   │   ├── IconPicker.js
│   │   │   ├── ResponsiveControl.js
│   │   │   ├── SpacingControl.js
│   │   │   └── TypographyControl.js
│   │   ├── inspector/
│   │   │   ├── AnimationPanel.js
│   │   │   ├── ResponsivePanel.js
│   │   │   └── AdvancedPanel.js
│   │   ├── common/
│   │   │   ├── IconButton.js
│   │   │   ├── ResponsiveWrapper.js
│   │   │   └── BlockWrapper.js
│   │   └── index.js
│   ├── extensions/          # Block extensions/filters
│   │   ├── animation/
│   │   │   ├── index.js
│   │   │   └── style.scss
│   │   ├── responsive/
│   │   │   └── index.js
│   │   └── spacing/
│   │       └── index.js
│   ├── utils/              # Utility functions
│   │   ├── breakpoints.js
│   │   ├── colors.js
│   │   ├── css-generator.js
│   │   ├── icons.js
│   │   ├── typography.js
│   │   └── index.js
│   ├── store/              # WordPress data store
│   │   ├── index.js
│   │   ├── actions.js
│   │   ├── reducer.js
│   │   └── selectors.js
│   ├── styles/             # Global styles
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   ├── _animations.scss
│   │   ├── _utilities.scss
│   │   ├── editor.scss
│   │   └── style.scss
│   ├── admin/              # Admin UI
│   │   ├── settings/
│   │   │   ├── index.js
│   │   │   ├── GlobalStyles.js
│   │   │   ├── ColorPalette.js
│   │   │   ├── Typography.js
│   │   │   └── style.scss
│   │   └── index.js
│   └── index.js            # Main entry point
├── tests/
│   ├── e2e/
│   ├── unit/
│   └── phpunit/
├── .editorconfig
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── .stylelintrc.json
├── composer.json
├── package.json
├── phpcs.xml
├── phpstan.neon
├── README.md
├── airo-blocks.php         # Main plugin file
└── uninstall.php           # Uninstall cleanup
```

---

## Development Environment Setup

### Prerequisites

- Node.js 18+ and npm/pnpm
- PHP 8.0+
- WordPress 6.4+
- Composer
- Git

### Initial Setup

```bash
# Clone repository
git clone https://github.com/yourusername/airo-blocks.git
cd airo-blocks

# Install Node dependencies
npm install
# or
pnpm install

# Install Composer dependencies (dev tools)
composer install

# Start WordPress environment
npx @wordpress/env start

# Build for development
npm run start

# In another terminal, watch for changes
npm run build

# Run tests
npm run test:unit
npm run test:e2e
```

### Package.json Scripts

```json
{
  "scripts": {
    "start": "wp-scripts start",
    "build": "wp-scripts build",
    "check-engines": "wp-scripts check-engines",
    "check-licenses": "wp-scripts check-licenses",
    "format": "wp-scripts format",
    "lint:css": "wp-scripts lint-style",
    "lint:js": "wp-scripts lint-js",
    "lint:php": "composer run-script lint",
    "packages-update": "wp-scripts packages-update",
    "plugin-zip": "wp-scripts plugin-zip",
    "test:e2e": "wp-scripts test-e2e",
    "test:unit": "wp-scripts test-unit-js",
    "test:php": "composer run-script test"
  }
}
```

### .wp-env.json Configuration

```json
{
  "core": "WordPress/WordPress#6.4",
  "phpVersion": "8.0",
  "plugins": [".", "https://downloads.wordpress.org/plugin/gutenberg.latest-stable.zip"],
  "themes": ["https://downloads.wordpress.org/theme/twentytwentyfour.zip"],
  "port": 8888,
  "testsPort": 8889,
  "config": {
    "WP_DEBUG": true,
    "WP_DEBUG_LOG": true,
    "WP_DEBUG_DISPLAY": false,
    "SCRIPT_DEBUG": true
  }
}
```

---

## Architecture

### Plugin Bootstrap Flow

```
airo-blocks.php
    ↓
includes/class-plugin.php
    ↓
    ├── includes/class-assets.php (Register & enqueue)
    ├── includes/blocks/class-blocks-loader.php (Register blocks)
    ├── includes/patterns/class-patterns-loader.php (Register patterns)
    └── includes/admin/class-settings.php (Admin interface)
```

### Asset Loading Strategy

**Development Mode:**
- Load all block assets for editor
- Hot module replacement (HMR)
- Source maps enabled

**Production Mode:**
- Conditional loading (only blocks used on page)
- Minified and optimized
- Asset versioning based on file hash

**Implementation:**

```php
// includes/class-assets.php
class Assets {
    private $used_blocks = [];

    public function __construct() {
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_editor_assets']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_frontend_assets']);
        add_filter('render_block', [$this, 'track_block_usage'], 10, 2);
    }

    public function track_block_usage($block_content, $block) {
        if (strpos($block['blockName'], 'airo-blocks/') === 0) {
            $block_name = str_replace('airo-blocks/', '', $block['blockName']);
            $this->used_blocks[] = $block_name;
        }
        return $block_content;
    }

    public function enqueue_frontend_assets() {
        // Only enqueue assets for blocks used on this page
        $this->used_blocks = array_unique($this->used_blocks);

        foreach ($this->used_blocks as $block) {
            $this->enqueue_block_assets($block);
        }
    }
}
```

### Block Registration Pattern

Each block follows this registration pattern:

```javascript
// src/blocks/container/index.js
import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import './style.scss';
import './editor.scss';

registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: Save,
});
```

### Data Flow

```
User Interaction
    ↓
Edit Component (React)
    ↓
setAttributes() / useDispatch()
    ↓
Block Attributes (stored in post_content)
    ↓
Save Component (renders to HTML)
    ↓
Frontend Display
```

For dynamic blocks:
```
User Interaction
    ↓
Edit Component (React)
    ↓
setAttributes()
    ↓
Block Attributes
    ↓
PHP render_callback()
    ↓
Frontend Display
```

---

## Block Specifications

### 1. Container Block

**Purpose:** Advanced layout container with flex/grid controls, backgrounds, and visual effects.

**Block Name:** `airo-blocks/container`

**Supports:**
- align: wide, full
- anchor: true
- spacing: true
- color: background, text
- html: false (for security)

**Attributes:**

```json
{
  "uniqueId": {
    "type": "string",
    "default": ""
  },
  "layout": {
    "type": "string",
    "default": "flex",
    "enum": ["flex", "grid", "auto-grid"]
  },
  "flexDirection": {
    "type": "string",
    "default": "row",
    "enum": ["row", "row-reverse", "column", "column-reverse"]
  },
  "justifyContent": {
    "type": "string",
    "default": "flex-start",
    "enum": ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"]
  },
  "alignItems": {
    "type": "string",
    "default": "stretch",
    "enum": ["flex-start", "center", "flex-end", "stretch", "baseline"]
  },
  "gap": {
    "type": "object",
    "default": {
      "desktop": "20px",
      "tablet": "15px",
      "mobile": "10px"
    }
  },
  "gridColumns": {
    "type": "object",
    "default": {
      "desktop": 3,
      "tablet": 2,
      "mobile": 1
    }
  },
  "gridAutoFit": {
    "type": "boolean",
    "default": false
  },
  "gridMinWidth": {
    "type": "string",
    "default": "250px"
  },
  "background": {
    "type": "object",
    "default": {
      "type": "color",
      "color": "",
      "gradient": "",
      "image": {
        "url": "",
        "id": 0,
        "position": "center center",
        "size": "cover",
        "repeat": "no-repeat",
        "attachment": "scroll"
      },
      "video": {
        "url": "",
        "id": 0
      },
      "overlay": {
        "enabled": false,
        "color": "rgba(0,0,0,0.5)",
        "gradient": ""
      }
    }
  },
  "spacing": {
    "type": "object",
    "default": {
      "margin": {
        "top": "",
        "right": "",
        "bottom": "",
        "left": "",
        "unit": "px"
      },
      "padding": {
        "top": "",
        "right": "",
        "bottom": "",
        "left": "",
        "unit": "px"
      }
    }
  },
  "border": {
    "type": "object",
    "default": {
      "width": {
        "top": "",
        "right": "",
        "bottom": "",
        "left": ""
      },
      "style": "solid",
      "color": "",
      "radius": {
        "top": "",
        "right": "",
        "bottom": "",
        "left": ""
      }
    }
  },
  "boxShadow": {
    "type": "object",
    "default": {
      "enabled": false,
      "horizontal": "0px",
      "vertical": "4px",
      "blur": "6px",
      "spread": "0px",
      "color": "rgba(0,0,0,0.1)",
      "position": "outline"
    }
  },
  "shapeDivider": {
    "type": "object",
    "default": {
      "top": {
        "enabled": false,
        "shape": "waves",
        "color": "#ffffff",
        "height": "100px",
        "flip": false,
        "invert": false
      },
      "bottom": {
        "enabled": false,
        "shape": "waves",
        "color": "#ffffff",
        "height": "100px",
        "flip": false,
        "invert": false
      }
    }
  },
  "htmlTag": {
    "type": "string",
    "default": "div",
    "enum": ["div", "section", "article", "aside", "header", "footer", "main"]
  },
  "overflow": {
    "type": "string",
    "default": "visible",
    "enum": ["visible", "hidden", "scroll", "auto"]
  },
  "zIndex": {
    "type": "number",
    "default": 0
  },
  "minHeight": {
    "type": "object",
    "default": {
      "desktop": "",
      "tablet": "",
      "mobile": "",
      "unit": "px"
    }
  },
  "animation": {
    "type": "object",
    "default": {
      "type": "none",
      "duration": 500,
      "delay": 0,
      "easing": "ease-in-out"
    }
  },
  "responsive": {
    "type": "object",
    "default": {
      "hideOnDesktop": false,
      "hideOnTablet": false,
      "hideOnMobile": false
    }
  }
}
```

**Key Features:**
1. Flexible layout system (flex/grid/auto-grid)
2. Comprehensive background options
3. Shape dividers (10+ shapes)
4. Advanced spacing controls
5. Border and box shadow
6. Responsive per-device settings
7. Animation support
8. Semantic HTML tags

**File Structure:**
```
src/blocks/container/
├── block.json
├── index.js
├── edit.js
├── save.js
├── attributes.js
├── style.scss
├── editor.scss
└── components/
    ├── LayoutControls.js
    ├── BackgroundPanel.js
    ├── ShapeDividers.js
    └── ShapeDividerSVGs.js
```

**Priority:** CRITICAL (Week 1-2)

---

### 2. Advanced Heading

**Purpose:** Enhanced heading with gradient text, shadows, icons, and dividers.

**Block Name:** `airo-blocks/advanced-heading`

**Attributes:**

```json
{
  "uniqueId": {
    "type": "string",
    "default": ""
  },
  "content": {
    "type": "string",
    "default": "Advanced Heading"
  },
  "level": {
    "type": "number",
    "default": 2
  },
  "typography": {
    "type": "object",
    "default": {
      "fontFamily": "",
      "fontSize": {
        "desktop": "",
        "tablet": "",
        "mobile": "",
        "unit": "px"
      },
      "fontWeight": "",
      "lineHeight": {
        "desktop": "",
        "tablet": "",
        "mobile": ""
      },
      "letterSpacing": "",
      "textTransform": "none",
      "textDecoration": "none"
    }
  },
  "color": {
    "type": "object",
    "default": {
      "type": "solid",
      "color": "",
      "gradient": ""
    }
  },
  "textShadow": {
    "type": "object",
    "default": {
      "enabled": false,
      "horizontal": "0px",
      "vertical": "2px",
      "blur": "4px",
      "color": "rgba(0,0,0,0.3)"
    }
  },
  "textStroke": {
    "type": "object",
    "default": {
      "enabled": false,
      "width": "1px",
      "color": "#000000"
    }
  },
  "icon": {
    "type": "object",
    "default": {
      "enabled": false,
      "icon": "",
      "position": "before",
      "spacing": "10px",
      "color": ""
    }
  },
  "divider": {
    "type": "object",
    "default": {
      "enabled": false,
      "position": "after",
      "style": "solid",
      "width": "50px",
      "height": "3px",
      "color": "",
      "alignment": "center",
      "spacing": "15px"
    }
  },
  "highlight": {
    "type": "object",
    "default": {
      "enabled": false,
      "color": "",
      "padding": "2px 8px",
      "borderRadius": "4px"
    }
  },
  "alignment": {
    "type": "object",
    "default": {
      "desktop": "left",
      "tablet": "left",
      "mobile": "left"
    }
  },
  "animation": {
    "type": "object",
    "default": {
      "type": "none",
      "duration": 500,
      "delay": 0,
      "easing": "ease-in-out"
    }
  },
  "spacing": {
    "type": "object",
    "default": {
      "margin": {
        "top": "",
        "right": "",
        "bottom": "",
        "left": ""
      }
    }
  },
  "responsive": {
    "type": "object",
    "default": {
      "hideOnDesktop": false,
      "hideOnTablet": false,
      "hideOnMobile": false
    }
  }
}
```

**Key Features:**
1. H1-H6 level selection
2. Gradient text fills with CSS
3. Text shadow and stroke
4. Icon integration (before/after)
5. Divider lines (multiple styles)
6. Highlight background
7. Responsive typography
8. Animation effects

**Priority:** HIGH (Week 2-3)

---

### 3. Button / Button Group

**Purpose:** Advanced button with multiple styles, icons, and hover effects.

**Block Name:** `airo-blocks/button` and `airo-blocks/button-group`

**Button Attributes:**

```json
{
  "uniqueId": {
    "type": "string",
    "default": ""
  },
  "text": {
    "type": "string",
    "default": "Click Here"
  },
  "url": {
    "type": "string",
    "default": ""
  },
  "linkTarget": {
    "type": "string",
    "default": "_self"
  },
  "rel": {
    "type": "string",
    "default": ""
  },
  "style": {
    "type": "string",
    "default": "fill",
    "enum": ["fill", "outline", "ghost", "3d", "minimal"]
  },
  "size": {
    "type": "string",
    "default": "medium",
    "enum": ["small", "medium", "large", "xlarge"]
  },
  "color": {
    "type": "object",
    "default": {
      "background": "",
      "text": "",
      "gradient": "",
      "border": ""
    }
  },
  "hoverColor": {
    "type": "object",
    "default": {
      "background": "",
      "text": "",
      "gradient": "",
      "border": ""
    }
  },
  "icon": {
    "type": "object",
    "default": {
      "enabled": false,
      "icon": "",
      "position": "left",
      "spacing": "8px",
      "size": "16px"
    }
  },
  "iconAnimation": {
    "type": "string",
    "default": "none",
    "enum": ["none", "slide-right", "slide-left", "bounce", "rotate"]
  },
  "hoverEffect": {
    "type": "string",
    "default": "none",
    "enum": ["none", "lift", "scale", "shadow", "glow", "sweep-right", "sweep-left"]
  },
  "width": {
    "type": "object",
    "default": {
      "type": "auto",
      "custom": ""
    }
  },
  "border": {
    "type": "object",
    "default": {
      "width": "2px",
      "style": "solid",
      "radius": "4px"
    }
  },
  "padding": {
    "type": "object",
    "default": {
      "top": "12px",
      "right": "24px",
      "bottom": "12px",
      "left": "24px"
    }
  },
  "boxShadow": {
    "type": "object",
    "default": {
      "enabled": false,
      "horizontal": "0px",
      "vertical": "4px",
      "blur": "6px",
      "spread": "0px",
      "color": "rgba(0,0,0,0.1)"
    }
  },
  "animation": {
    "type": "object",
    "default": {
      "type": "none",
      "duration": 500,
      "delay": 0,
      "easing": "ease-in-out"
    }
  }
}
```

**Button Group Attributes:**

```json
{
  "uniqueId": {
    "type": "string",
    "default": ""
  },
  "layout": {
    "type": "string",
    "default": "horizontal",
    "enum": ["horizontal", "vertical"]
  },
  "alignment": {
    "type": "object",
    "default": {
      "desktop": "flex-start",
      "tablet": "flex-start",
      "mobile": "flex-start"
    }
  },
  "gap": {
    "type": "object",
    "default": {
      "desktop": "15px",
      "tablet": "12px",
      "mobile": "10px"
    }
  },
  "stackOnMobile": {
    "type": "boolean",
    "default": true
  }
}
```

**Key Features:**
1. Multiple button styles (fill, outline, ghost, 3D)
2. Icon support with animations
3. Hover effects library
4. Gradient backgrounds
5. Button groups with flexible layouts
6. Responsive sizing
7. Custom width controls
8. Shadow and border controls

**Priority:** HIGH (Week 3)

---

### 4. Hero Section

**Purpose:** Full-width hero with background media, content positioning, and CTAs.

**Block Name:** `airo-blocks/hero`

**Attributes:**

```json
{
  "uniqueId": {
    "type": "string",
    "default": ""
  },
  "layout": {
    "type": "string",
    "default": "centered",
    "enum": ["centered", "left", "right", "split"]
  },
  "fullWidth": {
    "type": "boolean",
    "default": true
  },
  "height": {
    "type": "object",
    "default": {
      "type": "viewport",
      "value": "70",
      "unit": "vh",
      "min": "400px"
    }
  },
  "background": {
    "type": "object",
    "default": {
      "type": "image",
      "color": "",
      "gradient": "",
      "image": {
        "url": "",
        "id": 0,
        "position": "center center",
        "size": "cover",
        "repeat": "no-repeat",
        "attachment": "scroll"
      },
      "video": {
        "enabled": false,
        "url": "",
        "id": 0,
        "muted": true,
        "loop": true,
        "autoplay": true
      },
      "overlay": {
        "enabled": true,
        "type": "solid",
        "color": "rgba(0,0,0,0.4)",
        "gradient": ""
      }
    }
  },
  "contentPosition": {
    "type": "object",
    "default": {
      "vertical": "center",
      "horizontal": "center"
    }
  },
  "contentWidth": {
    "type": "string",
    "default": "800px"
  },
  "shapeDivider": {
    "type": "object",
    "default": {
      "bottom": {
        "enabled": false,
        "shape": "waves",
        "color": "#ffffff",
        "height": "100px",
        "flip": false,
        "invert": false
      }
    }
  },
  "scrollIndicator": {
    "type": "object",
    "default": {
      "enabled": false,
      "style": "arrow",
      "color": "#ffffff",
      "animation": "bounce"
    }
  },
  "animation": {
    "type": "object",
    "default": {
      "type": "fadeIn",
      "duration": 800,
      "delay": 0,
      "easing": "ease-in-out"
    }
  }
}
```

**Uses InnerBlocks** for flexible content (headings, text, buttons)

**Key Features:**
1. Multiple layout options
2. Video/image backgrounds
3. Height controls (viewport/custom)
4. Content positioning
5. Overlay controls
6. Shape dividers
7. Scroll indicator
8. Flexible inner content

**Priority:** HIGH (Week 4)

---

### 5. Feature Cards / Feature Grid

**Purpose:** Flexible grid of feature cards with icons/images and hover effects.

**Block Name:** `airo-blocks/feature-grid` (parent) and `airo-blocks/feature-card` (child)

**Feature Grid Attributes:**

```json
{
  "uniqueId": {
    "type": "string",
    "default": ""
  },
  "columns": {
    "type": "object",
    "default": {
      "desktop": 3,
      "tablet": 2,
      "mobile": 1
    }
  },
  "gap": {
    "type": "object",
    "default": {
      "desktop": "30px",
      "tablet": "20px",
      "mobile": "15px"
    }
  },
  "equalHeight": {
    "type": "boolean",
    "default": true
  },
  "autoGrid": {
    "type": "boolean",
    "default": false
  },
  "minColumnWidth": {
    "type": "string",
    "default": "280px"
  }
}
```

**Feature Card Attributes:**

```json
{
  "uniqueId": {
    "type": "string",
    "default": ""
  },
  "cardStyle": {
    "type": "string",
    "default": "elevated",
    "enum": ["elevated", "flat", "bordered", "gradient", "minimal"]
  },
  "mediaType": {
    "type": "string",
    "default": "icon",
    "enum": ["icon", "image", "none"]
  },
  "icon": {
    "type": "object",
    "default": {
      "icon": "star",
      "size": "48px",
      "color": "",
      "backgroundColor": "",
      "borderRadius": "50%",
      "padding": "15px"
    }
  },
  "image": {
    "type": "object",
    "default": {
      "url": "",
      "id": 0,
      "alt": ""
    }
  },
  "title": {
    "type": "string",
    "default": "Feature Title"
  },
  "description": {
    "type": "string",
    "default": "Feature description goes here."
  },
  "link": {
    "type": "object",
    "default": {
      "enabled": false,
      "url": "",
      "linkEntireCard": true,
      "target": "_self"
    }
  },
  "badge": {
    "type": "object",
    "default": {
      "enabled": false,
      "text": "New",
      "position": "top-right",
      "color": "#ffffff",
      "backgroundColor": "#ef4444"
    }
  },
  "hoverEffect": {
    "type": "string",
    "default": "lift",
    "enum": ["none", "lift", "tilt", "glow", "scale"]
  },
  "background": {
    "type": "object",
    "default": {
      "type": "solid",
      "color": "#ffffff",
      "gradient": ""
    }
  },
  "padding": {
    "type": "object",
    "default": {
      "top": "30px",
      "right": "30px",
      "bottom": "30px",
      "left": "30px"
    }
  },
  "border": {
    "type": "object",
    "default": {
      "width": "0px",
      "style": "solid",
      "color": "",
      "radius": "8px"
    }
  },
  "boxShadow": {
    "type": "object",
    "default": {
      "enabled": true,
      "horizontal": "0px",
      "vertical": "4px",
      "blur": "10px",
      "spread": "0px",
      "color": "rgba(0,0,0,0.08)"
    }
  },
  "animation": {
    "type": "object",
    "default": {
      "type": "fadeInUp",
      "duration": 600,
      "delay": 0,
      "easing": "ease-in-out"
    }
  }
}
```

**Key Features:**
1. Auto-grid layout
2. Multiple card styles
3. Icon/image support
4. Hover effects
5. Equal height option
6. Badge/ribbon support
7. Link entire card
8. Animation stagger support

**Priority:** HIGH (Week 5)

---

### 6. Icon / Icon List

**Purpose:** Display icons with flexible styling and layouts.

**Block Name:** `airo-blocks/icon` and `airo-blocks/icon-list`

**Icon Block Attributes:**

```json
{
  "uniqueId": {
    "type": "string",
    "default": ""
  },
  "icon": {
    "type": "string",
    "default": "star"
  },
  "iconLibrary": {
    "type": "string",
    "default": "fontawesome",
    "enum": ["fontawesome", "custom"]
  },
  "customSVG": {
    "type": "string",
    "default": ""
  },
  "size": {
    "type": "object",
    "default": {
      "desktop": "48px",
      "tablet": "40px",
      "mobile": "32px"
    }
  },
  "color": {
    "type": "object",
    "default": {
      "type": "solid",
      "color": "",
      "gradient": ""
    }
  },
  "background": {
    "type": "object",
    "default": {
      "enabled": false,
      "type": "solid",
      "color": "",
      "gradient": "",
      "size": "80px",
      "borderRadius": "50%",
      "padding": "15px"
    }
  },
  "border": {
    "type": "object",
    "default": {
      "enabled": false,
      "width": "2px",
      "style": "solid",
      "color": ""
    }
  },
  "boxShadow": {
    "type": "object",
    "default": {
      "enabled": false,
      "horizontal": "0px",
      "vertical": "4px",
      "blur": "6px",
      "spread": "0px",
      "color": "rgba(0,0,0,0.1)"
    }
  },
  "link": {
    "type": "object",
    "default": {
      "enabled": false,
      "url": "",
      "target": "_self"
    }
  },
  "alignment": {
    "type": "object",
    "default": {
      "desktop": "center",
      "tablet": "center",
      "mobile": "center"
    }
  },
  "animation": {
    "type": "object",
    "default": {
      "type": "none",
      "duration": 500,
      "delay": 0,
      "easing": "ease-in-out",
      "hover": "none"
    }
  }
}
```

**Icon List Attributes:**

```json
{
  "uniqueId": {
    "type": "string",
    "default": ""
  },
  "layout": {
    "type": "string",
    "default": "vertical",
    "enum": ["vertical", "horizontal", "grid"]
  },
  "columns": {
    "type": "number",
    "default": 2
  },
  "gap": {
    "type": "string",
    "default": "15px"
  },
  "iconAlignment": {
    "type": "string",
    "default": "top",
    "enum": ["top", "center", "bottom"]
  }
}
```

**Uses InnerBlocks** for list items

**Key Features:**
1. Font Awesome integration (500+ icons)
2. Custom SVG support
3. Gradient icon fills
4. Background styles
5. Border and shadow
6. Icon lists with flexible layouts
7. Animation effects
8. Responsive sizing

**Priority:** MEDIUM (Week 6)

---

### 7-12. Additional Blocks (Abbreviated)

Due to space constraints, here are the key technical details for the remaining blocks:

**7. Testimonial** (`airo-blocks/testimonial`)
- Multiple layouts: card, quote, minimal
- Star rating component
- Avatar with custom size
- Schema.org markup for SEO
- Carousel option (uses InnerBlocks)
- Priority: MEDIUM (Week 7)

**8. Pricing Table** (`airo-blocks/pricing-table-group` + `airo-blocks/pricing-table`)
- Responsive columns
- Feature comparison list
- Highlight featured plan
- Icon support in features
- Badge/ribbon
- Annual/monthly toggle
- Priority: MEDIUM (Week 8)

**9. Team Member** (`airo-blocks/team-member`)
- Multiple layouts: card, overlay, minimal
- Social links array
- Hover overlay for bio
- Role/title styling
- Grid layout support
- Priority: MEDIUM (Week 9)

**10. Call-to-Action** (`airo-blocks/cta`)
- Split/centered/minimal layouts
- Background options (same as Container)
- Button integration (InnerBlocks)
- Responsive layouts
- Priority: LOW (Week 10)

**11. Divider** (`airo-blocks/divider`)
- 10+ styles (solid, dashed, gradient, wavy)
- Icon/text in divider
- Width controls (%, px)
- Spacing controls
- Priority: LOW (Week 11)

**12. Spacer** (`airo-blocks/spacer`)
- Visual height indicator in editor
- Responsive height
- Min/max constraints
- Preset spacing values
- Priority: LOW (Week 11)

---

## Shared Components

### Control Components

These reusable components should be built first as they're used across multiple blocks.

#### 1. BackgroundControl.js

```javascript
import { PanelBody, SelectControl, Button, TabPanel } from '@wordpress/components';
import { MediaUpload } from '@wordpress/block-editor';
import ColorControl from './ColorControl';
import GradientControl from './GradientControl';

export default function BackgroundControl({
    value = {},
    onChange,
    label = "Background",
    enableVideo = false
}) {
    const { type = 'color', color, gradient, image, video, overlay } = value;

    return (
        <PanelBody title={label} initialOpen={false}>
            <TabPanel
                tabs={[
                    { name: 'color', title: 'Color' },
                    { name: 'gradient', title: 'Gradient' },
                    { name: 'image', title: 'Image' },
                    ...(enableVideo ? [{ name: 'video', title: 'Video' }] : [])
                ]}
                onSelect={(tabName) => onChange({ ...value, type: tabName })}
            >
                {(tab) => {
                    if (tab.name === 'color') {
                        return <ColorControl
                            value={color}
                            onChange={(newColor) => onChange({ ...value, color: newColor })}
                        />;
                    }
                    // ... other tabs
                }}
            </TabPanel>

            {/* Overlay controls if image/video */}
            {(type === 'image' || type === 'video') && (
                <PanelBody title="Overlay" initialOpen={false}>
                    {/* Overlay controls */}
                </PanelBody>
            )}
        </PanelBody>
    );
}
```

#### 2. SpacingControl.js

```javascript
import { BaseControl, Button, ButtonGroup, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import ResponsiveControl from './ResponsiveControl';

export default function SpacingControl({
    value = {},
    onChange,
    label = "Spacing",
    sides = ['top', 'right', 'bottom', 'left'],
    responsive = false
}) {
    const [linked, setLinked] = useState(true);

    const handleChange = (side, newValue) => {
        if (linked) {
            const linkedValue = {};
            sides.forEach(s => linkedValue[s] = newValue);
            onChange(linkedValue);
        } else {
            onChange({ ...value, [side]: newValue });
        }
    };

    return (
        <BaseControl label={label}>
            <div className="ab-spacing-control">
                <Button
                    icon={linked ? 'admin-links' : 'editor-unlink'}
                    onClick={() => setLinked(!linked)}
                    isSmall
                />

                {sides.map(side => (
                    <UnitControl
                        key={side}
                        label={side}
                        value={value[side] || ''}
                        onChange={(newValue) => handleChange(side, newValue)}
                    />
                ))}
            </div>
        </BaseControl>
    );
}
```

#### 3. ResponsiveControl.js

```javascript
import { Button, ButtonGroup } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { desktop, tablet, mobile } from '@wordpress/icons';

export default function ResponsiveControl({
    children,
    value = {},
    onChange,
    label
}) {
    const [device, setDevice] = useState('desktop');

    return (
        <div className="ab-responsive-control">
            {label && <div className="ab-responsive-control__label">{label}</div>}

            <ButtonGroup className="ab-responsive-control__devices">
                <Button
                    icon={desktop}
                    isPressed={device === 'desktop'}
                    onClick={() => setDevice('desktop')}
                />
                <Button
                    icon={tablet}
                    isPressed={device === 'tablet'}
                    onClick={() => setDevice('tablet')}
                />
                <Button
                    icon={mobile}
                    isPressed={device === 'mobile'}
                    onClick={() => setDevice('mobile')}
                />
            </ButtonGroup>

            <div className="ab-responsive-control__content">
                {children(device, (newValue) => {
                    onChange({ ...value, [device]: newValue });
                })}
            </div>
        </div>
    );
}
```

#### 4. IconPicker.js

```javascript
import { useState } from '@wordpress/element';
import { Button, Modal, TextControl, TabPanel } from '@wordpress/components';
import { Icon } from '@wordpress/icons';
import { iconLibrary } from '../../utils/icons';

export default function IconPicker({ value = '', onChange, label = "Icon" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');

    const filteredIcons = Object.entries(iconLibrary)
        .filter(([name, icon]) => {
            const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = category === 'all' || icon.category === category;
            return matchesSearch && matchesCategory;
        });

    return (
        <>
            <BaseControl label={label}>
                <Button onClick={() => setIsOpen(true)} variant="secondary">
                    {value ? (
                        <><Icon icon={iconLibrary[value]?.svg} /> {value}</>
                    ) : (
                        'Select Icon'
                    )}
                </Button>
            </BaseControl>

            {isOpen && (
                <Modal
                    title="Select Icon"
                    onRequestClose={() => setIsOpen(false)}
                    className="ab-icon-picker-modal"
                >
                    <TextControl
                        placeholder="Search icons..."
                        value={search}
                        onChange={setSearch}
                    />

                    <TabPanel
                        tabs={[
                            { name: 'all', title: 'All' },
                            { name: 'popular', title: 'Popular' },
                            { name: 'arrows', title: 'Arrows' },
                            // ... more categories
                        ]}
                        onSelect={setCategory}
                    >
                        {() => (
                            <div className="ab-icon-picker-grid">
                                {filteredIcons.map(([name, icon]) => (
                                    <Button
                                        key={name}
                                        onClick={() => {
                                            onChange(name);
                                            setIsOpen(false);
                                        }}
                                        isPressed={value === name}
                                    >
                                        <Icon icon={icon.svg} />
                                    </Button>
                                ))}
                            </div>
                        )}
                    </TabPanel>
                </Modal>
            )}
        </>
    );
}
```

#### 5. BoxShadowControl.js
#### 6. BorderControl.js
#### 7. TypographyControl.js
#### 8. ColorControl.js
#### 9. GradientControl.js
#### 10. DimensionsControl.js

All these should follow similar patterns to the examples above.

---

## Global Styles System

### FSE-First Architecture

**IMPORTANT:** Airo Blocks leverages WordPress's native theme.json system instead of custom wp_options storage. This ensures:
- Better theme compatibility
- WordPress handles CSS generation
- Users familiar with FSE get consistent experience
- Future-proof as WordPress evolves

### theme.json Integration

Instead of storing in wp_options, we extend the active theme's theme.json:

```php
// includes/admin/class-global-styles.php
class Global_Styles {

    public function __construct() {
        add_filter('wp_theme_json_data_theme', [$this, 'extend_theme_json']);
    }

    /**
     * Extend theme.json with Airo Blocks presets
     */
    public function extend_theme_json($theme_json) {
        $airo_settings = [
            'version' => 2,
            'settings' => [
                'color' => [
                    'palette' => [
                        [
                            'slug' => 'airo-primary',
                            'color' => '#2563eb',
                            'name' => __('Airo Primary', 'airo-blocks')
                        ],
                        [
                            'slug' => 'airo-secondary',
                            'color' => '#7c3aed',
                            'name' => __('Airo Secondary', 'airo-blocks')
                        ],
                        [
                            'slug' => 'airo-accent',
                            'color' => '#f59e0b',
                            'name' => __('Airo Accent', 'airo-blocks')
                        ],
                    ],
                    'gradients' => [
                        [
                            'slug' => 'airo-primary-to-secondary',
                            'gradient' => 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                            'name' => __('Primary to Secondary', 'airo-blocks')
                        ],
                    ],
                ],
                'spacing' => [
                    'spacingScale' => [
                        'steps' => 0,
                    ],
                    'spacingSizes' => [
                        [
                            'slug' => 'xs',
                            'size' => '0.5rem',
                            'name' => __('Extra Small', 'airo-blocks')
                        ],
                        [
                            'slug' => 'sm',
                            'size' => '1rem',
                            'name' => __('Small', 'airo-blocks')
                        ],
                        [
                            'slug' => 'md',
                            'size' => '1.5rem',
                            'name' => __('Medium', 'airo-blocks')
                        ],
                        [
                            'slug' => 'lg',
                            'size' => '2rem',
                            'name' => __('Large', 'airo-blocks')
                        ],
                        [
                            'slug' => 'xl',
                            'size' => '3rem',
                            'name' => __('Extra Large', 'airo-blocks')
                        ],
                    ],
                ],
                'typography' => [
                    'fontFamilies' => [
                        [
                            'slug' => 'system',
                            'fontFamily' => '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
                            'name' => __('System Font', 'airo-blocks')
                        ],
                    ],
                    'fontSizes' => [
                        [
                            'slug' => 'small',
                            'size' => '14px',
                            'name' => __('Small', 'airo-blocks')
                        ],
                        [
                            'slug' => 'medium',
                            'size' => '16px',
                            'name' => __('Medium', 'airo-blocks')
                        ],
                        [
                            'slug' => 'large',
                            'size' => '24px',
                            'name' => __('Large', 'airo-blocks')
                        ],
                        [
                            'slug' => 'x-large',
                            'size' => '32px',
                            'name' => __('Extra Large', 'airo-blocks')
                        ],
                    ],
                ],
                // Block-specific settings
                'blocks' => [
                    'airo-blocks/container' => [
                        'color' => [
                            'palette' => [
                                // Block-specific colors if needed
                            ],
                        ],
                    ],
                ],
            ],
        ];

        return $theme_json->update_with($airo_settings);
    }
}
```

### CSS Output (WordPress Handles This)

WordPress automatically generates CSS custom properties:

```css
/* WordPress generates these automatically */
:root {
    --wp--preset--color--airo-primary: #2563eb;
    --wp--preset--color--airo-secondary: #7c3aed;
    --wp--preset--spacing--xs: 0.5rem;
    --wp--preset--spacing--sm: 1rem;
    --wp--preset--font-size--small: 14px;
    /* etc */
}

/* WordPress also generates utility classes */
.has-airo-primary-color {
    color: var(--wp--preset--color--airo-primary) !important;
}

.has-airo-primary-background-color {
    background-color: var(--wp--preset--color--airo-primary) !important;
}
```

### React Admin Interface

```javascript
// src/admin/settings/GlobalStyles.js
import { useState } from '@wordpress/element';
import { Panel, PanelBody, Button } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import ColorPalette from './ColorPalette';
import Typography from './Typography';
import Spacing from './Spacing';
import BorderRadius from './BorderRadius';
import Shadows from './Shadows';

export default function GlobalStyles() {
    const [settings, setSettings] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const saveSettings = async () => {
        setIsSaving(true);
        try {
            await apiFetch({
                path: '/airo-blocks/v1/global-styles',
                method: 'POST',
                data: settings,
            });
            // Success notice
        } catch (error) {
            // Error notice
        }
        setIsSaving(false);
    };

    return (
        <div className="ab-global-styles">
            <Panel>
                <PanelBody title="Color Palette" initialOpen={true}>
                    <ColorPalette
                        value={settings.colors}
                        onChange={(colors) => setSettings({...settings, colors})}
                    />
                </PanelBody>

                <PanelBody title="Typography">
                    <Typography
                        value={settings.typography}
                        onChange={(typography) => setSettings({...settings, typography})}
                    />
                </PanelBody>

                {/* ... other panels */}
            </Panel>

            <Button
                isPrimary
                isBusy={isSaving}
                onClick={saveSettings}
            >
                Save Global Styles
            </Button>
        </div>
    );
}
```

### Using Global Styles in Blocks

```javascript
// In block edit.js
import { useSelect } from '@wordpress/data';

export default function Edit({ attributes }) {
    const globalColors = useSelect((select) =>
        select('airo-blocks/global-styles').getColors()
    );

    // Use global colors in ColorControl
    return (
        <ColorControl
            value={attributes.color}
            colors={globalColors} // Pass global colors
            onChange={...}
        />
    );
}
```

---

## Pattern Library

### Pattern Structure

```php
// patterns/hero/hero-centered.php
<?php
return array(
    'title'       => __('Hero - Centered', 'airo-blocks'),
    'description' => __('Centered hero section with heading, text, and buttons', 'airo-blocks'),
    'categories'  => array('airo-hero', 'airo-featured'),
    'keywords'    => array('hero', 'banner', 'header', 'centered'),
    'content'     => '<!-- wp:airo-blocks/hero {...} -->
        <!-- wp:airo-blocks/advanced-heading {...} /-->
        <!-- wp:paragraph {...} /-->
        <!-- wp:airo-blocks/button-group {...} -->
            <!-- wp:airo-blocks/button {...} /-->
            <!-- wp:airo-blocks/button {...} /-->
        <!-- /wp:airo-blocks/button-group -->
    <!-- /wp:airo-blocks/hero -->',
    'viewportWidth' => 1400,
);
```

### Pattern Registration

```php
// includes/patterns/class-patterns-loader.php
class Patterns_Loader {
    public function register_patterns() {
        // Register categories
        register_block_pattern_category('airo-hero', [
            'label' => __('Airo Hero', 'airo-blocks'),
        ]);

        // Register patterns
        $patterns_dir = plugin_dir_path(__FILE__) . '../../patterns/';
        $pattern_files = glob($patterns_dir . '*/*.php');

        foreach ($pattern_files as $file) {
            $pattern = require $file;

            register_block_pattern(
                'airo-blocks/' . basename($file, '.php'),
                $pattern
            );
        }
    }
}
```

### Pattern List (MVP - 20 patterns)

**Hero Sections (5):**
1. Hero - Centered
2. Hero - Left Aligned
3. Hero - Split with Image
4. Hero - Video Background
5. Hero - Gradient Background

**Features (4):**
6. Features - 3 Column Cards
7. Features - 4 Column Minimal
8. Features - Alternating with Images
9. Features - Grid with Icons

**Pricing (3):**
10. Pricing - 3 Column
11. Pricing - Comparison Table
12. Pricing - Toggle Monthly/Annual

**Testimonials (2):**
13. Testimonials - Carousel
14. Testimonials - Grid

**Team (2):**
15. Team - Grid with Social
16. Team - Minimal

**CTA (2):**
17. CTA - Centered
18. CTA - Split with Image

**Content Sections (2):**
19. Content - Two Column
20. Content - Feature Showcase

---

## Animation System

### Basic Animation Implementation

**Frontend CSS (Phase 1):**

```scss
// src/styles/_animations.scss

// Entrance animations
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInLeft {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeInRight {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes zoomIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }
}

// Animation classes
.ab-animate {
    animation-fill-mode: both;

    &.ab-animate-fadeIn { animation-name: fadeIn; }
    &.ab-animate-fadeInUp { animation-name: fadeInUp; }
    &.ab-animate-fadeInDown { animation-name: fadeInDown; }
    &.ab-animate-fadeInLeft { animation-name: fadeInLeft; }
    &.ab-animate-fadeInRight { animation-name: fadeInRight; }
    &.ab-animate-zoomIn { animation-name: zoomIn; }
    &.ab-animate-slideUp { animation-name: slideUp; }
}
```

**Animation JavaScript (Simple - Phase 1):**

```javascript
// src/extensions/animation/index.js

// Simple load-based animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('[data-ab-animation]');

    animatedElements.forEach((element, index) => {
        const animation = element.dataset.abAnimation;
        const duration = element.dataset.abAnimationDuration || '500';
        const delay = element.dataset.abAnimationDelay || '0';
        const easing = element.dataset.abAnimationEasing || 'ease-in-out';

        // Apply styles
        element.style.animationDuration = `${duration}ms`;
        element.style.animationDelay = `${delay}ms`;
        element.style.animationTimingFunction = easing;

        // Add animation class
        element.classList.add('ab-animate', `ab-animate-${animation}`);
    });
});
```

**Animation Panel Component:**

```javascript
// src/components/inspector/AnimationPanel.js
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';

export default function AnimationPanel({ value = {}, onChange }) {
    const { type = 'none', duration = 500, delay = 0, easing = 'ease-in-out' } = value;

    return (
        <PanelBody title="Animation" initialOpen={false}>
            <SelectControl
                label="Animation Type"
                value={type}
                options={[
                    { label: 'None', value: 'none' },
                    { label: 'Fade In', value: 'fadeIn' },
                    { label: 'Fade In Up', value: 'fadeInUp' },
                    { label: 'Fade In Down', value: 'fadeInDown' },
                    { label: 'Fade In Left', value: 'fadeInLeft' },
                    { label: 'Fade In Right', value: 'fadeInRight' },
                    { label: 'Zoom In', value: 'zoomIn' },
                    { label: 'Slide Up', value: 'slideUp' },
                ]}
                onChange={(newType) => onChange({ ...value, type: newType })}
            />

            {type !== 'none' && (
                <>
                    <RangeControl
                        label="Duration (ms)"
                        value={duration}
                        onChange={(newDuration) => onChange({ ...value, duration: newDuration })}
                        min={100}
                        max={2000}
                        step={100}
                    />

                    <RangeControl
                        label="Delay (ms)"
                        value={delay}
                        onChange={(newDelay) => onChange({ ...value, delay: newDelay })}
                        min={0}
                        max={2000}
                        step={100}
                    />

                    <SelectControl
                        label="Easing"
                        value={easing}
                        options={[
                            { label: 'Ease In Out', value: 'ease-in-out' },
                            { label: 'Ease In', value: 'ease-in' },
                            { label: 'Ease Out', value: 'ease-out' },
                            { label: 'Linear', value: 'linear' },
                        ]}
                        onChange={(newEasing) => onChange({ ...value, easing: newEasing })}
                    />
                </>
            )}
        </PanelBody>
    );
}
```

---

## Responsive System

### Breakpoints

```javascript
// src/utils/breakpoints.js
export const breakpoints = {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
};

export const mediaQueries = {
    mobile: `@media (max-width: ${breakpoints.mobile - 1}px)`,
    tablet: `@media (min-width: ${breakpoints.mobile}px) and (max-width: ${breakpoints.tablet - 1}px)`,
    desktop: `@media (min-width: ${breakpoints.tablet}px)`,
};
```

### CSS Generation for Responsive Values

```javascript
// src/utils/css-generator.js
export function generateResponsiveCSS(selector, property, values) {
    let css = '';

    // Desktop (default)
    if (values.desktop) {
        css += `${selector} { ${property}: ${values.desktop}; }`;
    }

    // Tablet
    if (values.tablet) {
        css += `@media (max-width: 1023px) { ${selector} { ${property}: ${values.tablet}; } }`;
    }

    // Mobile
    if (values.mobile) {
        css += `@media (max-width: 767px) { ${selector} { ${property}: ${values.mobile}; } }`;
    }

    return css;
}

export function generateBlockCSS(blockId, attributes) {
    const selector = `.ab-block-${blockId}`;
    let css = '';

    // Generate CSS based on attributes
    if (attributes.spacing) {
        const { margin, padding } = attributes.spacing;

        if (margin) {
            css += generateResponsiveCSS(selector, 'margin-top', {
                desktop: margin.top,
                tablet: margin.topTablet,
                mobile: margin.topMobile
            });
            // ... repeat for other sides
        }
    }

    // ... more CSS generation

    return css;
}
```

### Responsive Visibility

```scss
// src/styles/_utilities.scss
.ab-hide-desktop {
    @media (min-width: 1024px) {
        display: none !important;
    }
}

.ab-hide-tablet {
    @media (min-width: 768px) and (max-width: 1023px) {
        display: none !important;
    }
}

.ab-hide-mobile {
    @media (max-width: 767px) {
        display: none !important;
    }
}
```

---

## Development Workflow

### Git Workflow

**Branch Strategy:**
- `main` - Production-ready code
- `develop` - Development branch
- `feature/block-name` - Feature branches
- `fix/issue-description` - Bug fixes

**Commit Convention:**
```
type(scope): subject

body (optional)

footer (optional)
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(container): add shape divider support

- Added 10 shape divider options
- Implemented flip and invert controls
- Added height control for dividers

Closes #42
```

### Code Review Process

1. Create feature branch
2. Implement feature
3. Write tests
4. Submit PR
5. Code review (1+ approvals required)
6. Automated checks pass
7. Merge to develop

### Release Process

```bash
# 1. Ensure all tests pass
npm run test:unit
npm run test:e2e
npm run lint:js
npm run lint:css
composer run-script lint

# 2. Update version
npm version patch|minor|major

# 3. Build production assets
npm run build

# 4. Generate changelog
# (manual or automated)

# 5. Create git tag
git tag -a v1.0.0 -m "Release 1.0.0"

# 6. Push to repository
git push origin main --tags

# 7. Create plugin zip
npm run plugin-zip

# 8. Test plugin zip in clean WordPress install

# 9. Submit to WordPress.org (SVN)
# or deploy via GitHub release
```

---

## Code Standards

### PHP Standards

**WordPress Coding Standards (WPCS):**

```xml
<!-- phpcs.xml -->
<?xml version="1.0"?>
<ruleset name="Airo Blocks">
    <description>Airo Blocks Coding Standards</description>

    <file>./airo-blocks.php</file>
    <file>./includes</file>

    <arg value="sp"/>
    <arg name="extensions" value="php"/>
    <arg name="colors"/>

    <rule ref="WordPress-Core">
        <exclude name="WordPress.Files.FileName"/>
    </rule>
    <rule ref="WordPress-Docs"/>
    <rule ref="WordPress.WP.I18n">
        <properties>
            <property name="text_domain" type="array">
                <element value="airo-blocks"/>
            </property>
        </properties>
    </rule>

    <rule ref="WordPress.Security"/>
</ruleset>
```

**PHPStan Configuration:**

```neon
# phpstan.neon
parameters:
    level: 5
    paths:
        - includes
        - airo-blocks.php
    excludePaths:
        - includes/vendor
```

**PHP Documentation:**

```php
/**
 * Register a custom block.
 *
 * @since 1.0.0
 *
 * @param string $block_name The block name.
 * @param array  $args       Block registration arguments.
 * @return WP_Block_Type|false The registered block type, or false on failure.
 */
function register_custom_block( $block_name, $args = [] ) {
    // Implementation
}
```

### JavaScript Standards

**ESLint Configuration:**

```javascript
// .eslintrc.js
module.exports = {
    extends: ['plugin:@wordpress/eslint-plugin/recommended'],
    rules: {
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': 'off',
        'jsdoc/require-param-description': 'off',
    },
};
```

**JSDoc Comments:**

```javascript
/**
 * Generate CSS for a block based on its attributes.
 *
 * @param {string} blockId    The unique block ID.
 * @param {Object} attributes The block attributes.
 * @return {string} The generated CSS string.
 */
export function generateBlockCSS(blockId, attributes) {
    // Implementation
}
```

### CSS/SCSS Standards

**Stylelint Configuration:**

```json
{
  "extends": "@wordpress/stylelint-config",
  "rules": {
    "no-descending-specificity": null,
    "selector-class-pattern": "^ab-[a-z0-9-]+$"
  }
}
```

**BEM Naming Convention:**

```scss
// Block
.ab-container {
    // Block styles

    // Element
    &__inner {
        // Element styles
    }

    // Modifier
    &--full-width {
        // Modifier styles
    }

    // Element + Modifier
    &__inner--padded {
        // Combined styles
    }
}
```

### File Naming

- PHP: `class-name.php` (lowercase, hyphenated)
- JavaScript: `ComponentName.js` (PascalCase for components), `utility-name.js` (camelCase for utilities)
- SCSS: `_partial.scss` (lowercase, hyphenated, underscore prefix for partials)

---

## Testing Strategy

### Unit Tests

**JavaScript (Jest):**

```javascript
// tests/unit/utils/css-generator.test.js
import { generateResponsiveCSS } from '../../../src/utils/css-generator';

describe('generateResponsiveCSS', () => {
    it('generates desktop CSS correctly', () => {
        const css = generateResponsiveCSS('.test', 'font-size', {
            desktop: '16px',
        });

        expect(css).toContain('.test { font-size: 16px; }');
    });

    it('generates responsive CSS for all devices', () => {
        const css = generateResponsiveCSS('.test', 'padding', {
            desktop: '20px',
            tablet: '15px',
            mobile: '10px',
        });

        expect(css).toContain('.test { padding: 20px; }');
        expect(css).toContain('@media (max-width: 1023px)');
        expect(css).toContain('padding: 15px');
        expect(css).toContain('@media (max-width: 767px)');
        expect(css).toContain('padding: 10px');
    });
});
```

**PHP (PHPUnit):**

```php
// tests/phpunit/test-blocks-loader.php
class Test_Blocks_Loader extends WP_UnitTestCase {
    public function test_blocks_registered() {
        $blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();

        $this->assertArrayHasKey('airo-blocks/container', $blocks);
        $this->assertArrayHasKey('airo-blocks/advanced-heading', $blocks);
        // ... test all blocks
    }

    public function test_container_render() {
        $content = '<!-- wp:airo-blocks/container -->
            <div class="ab-container">Test</div>
        <!-- /wp:airo-blocks/container -->';

        $output = do_blocks($content);

        $this->assertStringContainsString('ab-container', $output);
        $this->assertStringContainsString('Test', $output);
    }
}
```

### Integration Tests

```javascript
// tests/e2e/container-block.test.js
import {
    createNewPost,
    insertBlock,
    getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('Container Block', () => {
    beforeEach(async () => {
        await createNewPost();
    });

    it('can be inserted', async () => {
        await insertBlock('Container');

        const content = await getEditedPostContent();
        expect(content).toContain('wp:airo-blocks/container');
    });

    it('allows changing layout type', async () => {
        await insertBlock('Container');

        // Open inspector
        await page.click('.components-panel__body-toggle');

        // Change layout
        await page.select('select[aria-label="Layout Type"]', 'grid');

        const content = await getEditedPostContent();
        expect(content).toContain('"layout":"grid"');
    });
});
```

### Accessibility Tests

```javascript
// tests/e2e/accessibility.test.js
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
import { injectAxe, checkA11y } from 'axe-playwright';

describe('Accessibility', () => {
    beforeEach(async () => {
        await createNewPost();
        await injectAxe(page);
    });

    it('Container block has no accessibility violations', async () => {
        await insertBlock('Container');

        await checkA11y(page, '.ab-container', {
            detailedReport: true,
            detailedReportOptions: { html: true },
        });
    });
});
```

### Test Coverage Goals

- **Unit Tests:** 80% code coverage minimum
- **Integration Tests:** All critical user paths
- **E2E Tests:** Happy path for each block
- **Accessibility Tests:** All blocks WCAG 2.1 AA compliant

### Running Tests

```bash
# Unit tests
npm run test:unit

# Unit tests with coverage
npm run test:unit -- --coverage

# E2E tests
npm run test:e2e

# E2E tests in debug mode
npm run test:e2e -- --puppeteer-devtools

# PHP unit tests
composer run-script test

# PHP unit tests with coverage
composer run-script test -- --coverage-html coverage
```

---

## Performance Budget

### Asset Size Targets

**CSS:**
- Total (all blocks): < 100KB minified
- Individual block: < 5KB minified
- Editor styles: < 50KB minified

**JavaScript:**
- Total (all blocks): < 150KB minified
- Individual block: < 10KB minified
- Editor scripts: < 200KB minified

**Images/Assets:**
- Icons: Inline SVG (< 1KB each)
- Patterns: No images (text-based with placeholders)

### Performance Metrics

**Lighthouse Targets:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

**Core Web Vitals:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### Performance Testing

```bash
# Lighthouse CI
npm run lighthouse

# Bundle analysis
npm run build -- --analyze

# PHP performance profiling
composer run-script profile
```

### Optimization Techniques

1. **Code Splitting:** Load blocks conditionally
2. **Tree Shaking:** Remove unused code
3. **Minification:** Terser for JS, cssnano for CSS
4. **Lazy Loading:** Defer non-critical assets
5. **Image Optimization:** Use modern formats (WebP)
6. **Caching:** Proper cache headers and versioning
7. **CDN Ready:** Absolute URLs support

---

## Sprint Breakdown

### Sprint Structure

**Sprint Duration:** 2 weeks
**Total Sprints:** 8 (16 weeks)

### Sprint 1-2: Foundation (Weeks 1-4)

**Goals:**
- Project setup complete
- Shared components built
- Container block complete
- Global styles system operational

**Tasks:**
- Set up development environment
- Configure build tools
- Create project structure
- Build shared control components
  - BackgroundControl
  - SpacingControl
  - ResponsiveControl
  - BorderControl
  - BoxShadowControl
  - ColorControl
  - GradientControl
- Develop Container block
  - Layout controls (flex/grid)
  - Background options
  - Shape dividers implementation
  - Spacing and border
  - Animation support
- Build global styles admin interface
  - Color palette manager
  - Typography settings
  - Spacing scale
  - Border/shadow presets
- Write unit tests for utilities
- Documentation: Setup guide

**Deliverables:**
- ✅ Working Container block
- ✅ Shared component library
- ✅ Global styles system
- ✅ Development documentation

---

### Sprint 3: Core Content Blocks (Weeks 5-6)

**Goals:**
- Advanced Heading complete
- Button/Button Group complete
- Icon block complete

**Tasks:**
- Develop Advanced Heading
  - Typography controls
  - Gradient text implementation
  - Text shadow and stroke
  - Icon integration
  - Divider lines
  - Responsive controls
- Develop Button block
  - Multiple style variations
  - Icon support with animations
  - Hover effects
  - Link controls
  - Responsive sizing
- Develop Button Group
  - Flexible layouts
  - Gap controls
  - Stack on mobile option
- Build IconPicker component
  - Font Awesome integration (500+ icons)
  - Search functionality
  - Categories
- Develop Icon block
  - Icon styling options
  - Background styles
  - Link support
  - Animation on hover
- Write tests for all blocks
- Documentation: Block usage guides

**Deliverables:**
- ✅ Advanced Heading block
- ✅ Button & Button Group blocks
- ✅ Icon block
- ✅ IconPicker component
- ✅ Block documentation

---

### Sprint 4: Hero & Features (Weeks 7-8)

**Goals:**
- Hero section complete
- Feature Cards complete

**Tasks:**
- Develop Hero block
  - Layout options (centered, split, etc.)
  - Background image/video support
  - Height controls (viewport/custom)
  - Content positioning
  - Overlay controls
  - Shape dividers
  - Scroll indicator
  - InnerBlocks implementation
- Develop Feature Grid
  - Grid layout with auto-grid option
  - Responsive columns
  - Gap controls
  - Equal height option
- Develop Feature Card
  - Multiple card styles
  - Icon/image support
  - Hover effects (lift, tilt, glow, scale)
  - Badge/ribbon
  - Link entire card
  - Animation stagger
- Create 5 hero patterns
- Create 4 feature patterns
- Write tests
- Documentation updates

**Deliverables:**
- ✅ Hero block
- ✅ Feature Grid & Card blocks
- ✅ 9 patterns
- ✅ Tests and documentation

---

### Sprint 5: Social Proof Blocks (Weeks 9-10)

**Goals:**
- Testimonial block complete
- Team Member block complete

**Tasks:**
- Develop Testimonial block
  - Multiple layouts (card, quote, minimal)
  - Star rating component
  - Author information (avatar, name, company)
  - Schema.org markup
  - Optional carousel mode
- Develop Team Member block
  - Multiple layouts (card, overlay, minimal)
  - Social links array
  - Hover effects for images
  - Role/title styling
  - Bio/description support
- Build Rating component
- Build SocialLinks component
- Create 2 testimonial patterns
- Create 2 team patterns
- Write tests
- Documentation updates

**Deliverables:**
- ✅ Testimonial block
- ✅ Team Member block
- ✅ 4 patterns
- ✅ Tests and documentation

---

### Sprint 6: Pricing & CTA (Weeks 11-12)

**Goals:**
- Pricing Table complete
- CTA block complete

**Tasks:**
- Develop Pricing Table Group
  - Responsive column control
  - Highlight featured plan
  - Annual/monthly toggle
- Develop Pricing Table (single)
  - Header section (title, price)
  - Features list with icons
  - Button integration
  - Badge/ribbon for labels
  - Multiple style variations
- Develop CTA block
  - Multiple layouts (split, centered, minimal)
  - Background options
  - InnerBlocks for flexible content
  - Button integration
- Create 3 pricing patterns
- Create 2 CTA patterns
- Write tests
- Documentation updates

**Deliverables:**
- ✅ Pricing Table blocks
- ✅ CTA block
- ✅ 5 patterns
- ✅ Tests and documentation

---

### Sprint 7: Utility Blocks (Weeks 13-14)

**Goals:**
- Divider block complete
- Spacer block complete
- Pattern library complete (20 patterns)

**Tasks:**
- Develop Divider block
  - 10+ styles (solid, dashed, dotted, gradient, custom shapes)
  - Icon/text in divider
  - Width controls
  - Spacing controls
  - Color and gradient options
- Develop Spacer block
  - Visual height indicator in editor
  - Responsive height
  - Min/max constraints
  - Preset spacing values from global styles
- Complete remaining patterns
  - 2 additional content section patterns
- Pattern testing across themes
- Write tests
- Complete all block documentation

**Deliverables:**
- ✅ Divider block
- ✅ Spacer block
- ✅ 20 complete patterns
- ✅ Full block library documented

---

### Sprint 8: Polish & Launch Prep (Weeks 15-16)

**Goals:**
- Beta testing
- Bug fixes
- Performance optimization
- WordPress.org submission

**Tasks:**
- **Week 1: Testing & Optimization**
  - Comprehensive testing across themes
    - Twenty Twenty-Four
    - Kadence
    - GeneratePress
    - Astra
  - Performance optimization
    - Asset optimization
    - Code splitting refinement
    - Caching strategy
  - Accessibility audit
    - Automated testing (axe)
    - Manual keyboard testing
    - Screen reader testing (NVDA/JAWS)
  - Security audit
    - Code review
    - Input sanitization check
    - XSS prevention verification
  - Fix critical bugs
  - Performance testing
  - Cross-browser testing

- **Week 2: Launch Preparation**
  - WordPress.org assets
    - Plugin banner (1544x500, 772x250)
    - Plugin icon (256x256, 128x128)
    - Screenshots (1200x900)
  - readme.txt optimization
    - Compelling description
    - Feature highlights
    - Installation instructions
    - FAQ section
    - Changelog
  - Create demo site
  - Record tutorial videos
    - Overview video (5 min)
    - Quick start guide (3 min)
    - Top 5 blocks showcase (5 min)
  - Final documentation review
  - WordPress.org submission
  - Launch marketing materials

**Deliverables:**
- ✅ All bugs fixed
- ✅ Performance optimized
- ✅ Accessibility compliant
- ✅ WordPress.org ready
- ✅ Demo site live
- ✅ Tutorial videos published
- ✅ Launch marketing ready

---

## Dependencies

### npm Packages

**Core WordPress:**
```json
{
  "@wordpress/scripts": "^26.0.0",
  "@wordpress/block-editor": "^12.0.0",
  "@wordpress/blocks": "^12.0.0",
  "@wordpress/components": "^25.0.0",
  "@wordpress/data": "^9.0.0",
  "@wordpress/element": "^5.0.0",
  "@wordpress/i18n": "^4.0.0",
  "@wordpress/icons": "^9.0.0"
}
```

**Development:**
```json
{
  "@wordpress/env": "^8.0.0",
  "@wordpress/e2e-test-utils": "^10.0.0",
  "eslint": "^8.0.0",
  "stylelint": "^15.0.0",
  "prettier": "^3.0.0",
  "husky": "^8.0.0",
  "lint-staged": "^14.0.0"
}
```

**Utilities:**
```json
{
  "classnames": "^2.3.0",
  "lodash": "^4.17.0"
}
```

### Composer Packages (Dev)

```json
{
  "require-dev": {
    "phpunit/phpunit": "^9.0",
    "wp-coding-standards/wpcs": "^3.0",
    "phpstan/phpstan": "^1.0",
    "phpstan/extension-installer": "^1.0",
    "szepeviktor/phpstan-wordpress": "^1.0"
  }
}
```

### WordPress Dependencies

- WordPress 6.0+ (required)
- PHP 7.4+ (required)
- MySQL 5.7+ or MariaDB 10.3+ (required)

---

## Deployment

### Build Process

```bash
# Clean build
rm -rf build/

# Production build
npm run build

# Plugin package
npm run plugin-zip

# Output: airo-blocks.zip
```

### WordPress.org SVN Deployment

```bash
# Checkout SVN repo
svn co https://plugins.svn.wordpress.org/airo-blocks

# Copy files to trunk
cp -r build/* airo-blocks/trunk/
cp readme.txt airo-blocks/trunk/
cp -r assets/.wordpress-org/* airo-blocks/assets/

# Add new files
svn add airo-blocks/trunk/* --force

# Commit
svn ci -m "Version 1.0.0 release" --username your-username

# Tag release
svn cp trunk tags/1.0.0
svn ci -m "Tagging version 1.0.0" --username your-username
```

### Version Control

**Semantic Versioning:**
- MAJOR.MINOR.PATCH
- 1.0.0 - Initial release
- 1.0.1 - Bug fix
- 1.1.0 - New features (backward compatible)
- 2.0.0 - Breaking changes

**Update Files:**
1. `package.json` - version field
2. `airo-blocks.php` - Version header
3. `readme.txt` - Stable tag
4. `CHANGELOG.md` - Document changes

---

## Post-Launch Support

### Support Channels

1. **WordPress.org Forum**
   - Response time: 24-48 hours
   - Public support

2. **GitHub Issues**
   - Bug reports
   - Feature requests
   - Technical discussions

3. **Documentation Site**
   - Getting started guides
   - Block documentation
   - Video tutorials
   - FAQ

### Update Cadence

**Patch Releases (X.X.1):**
- As needed for critical bugs
- Security issues (immediate)

**Minor Releases (X.1.0):**
- Every 2-4 weeks
- New features
- Improvements
- Non-critical bug fixes

**Major Releases (2.0.0):**
- Phase 2 launch (6 months post-MVP)
- Breaking changes
- Major new features

---

## Resources & References

### WordPress Documentation
- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [Block API Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/)
- [@wordpress/scripts](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)

### Tools
- [Gutenberg GitHub](https://github.com/WordPress/gutenberg)
- [Block Development Examples](https://github.com/WordPress/block-development-examples)
- [Create Block](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/)

### Design Resources
- [WordPress Design Library](https://wordpress.org/design/)
- [Gutenberg Design Principles](https://developer.wordpress.org/block-editor/principles/)

---

## Team & Responsibilities

### Roles (To Be Assigned)

**Lead Developer:**
- Overall architecture
- Code review
- Technical decisions

**Frontend Developers (2):**
- Block development
- React components
- SCSS styling

**Backend Developer:**
- PHP implementation
- WordPress integration
- Performance optimization

**QA Engineer:**
- Testing
- Bug reporting
- Accessibility testing

**Designer:**
- Block designs
- Pattern library
- Marketing assets

**Documentation Writer:**
- User documentation
- Developer docs
- Tutorial content

---

## Conclusion

This development document provides a comprehensive roadmap for building the Airo Blocks MVP (Phase 1). The 16-week timeline is ambitious but achievable with a dedicated team and proper execution.

### Key Success Factors

1. **Stick to the MVP scope** - Resist feature creep
2. **Prioritize performance** - Test early and often
3. **Maintain quality** - Don't skip testing
4. **Document as you build** - Don't leave it for the end
5. **Get feedback early** - Beta test with real users
6. **Iterate quickly** - Fix bugs fast

### Next Steps

1. Review and approve this document
2. Assemble development team
3. Set up project management (GitHub Projects, Jira, etc.)
4. Begin Sprint 1
5. Schedule weekly standups
6. Plan beta testing program

---

**Document Version:** 1.0
**Last Updated:** October 2025
**Status:** Ready for Review
