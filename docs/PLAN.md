2. Recommended architecture for Airo Site Designer

Hybrid control (your Option 3) is right, but it needs clear boundaries between layout, content, and theme.

a. Container Block = Layout Engine

Disable layout and spacing supports entirely.

Manage everything through data attributes.

Render InnerBlocks with no styling interference.

Apply layout via JS + CSS Grid/Flex.

Handle breakpoints in JS, not theme.json.

This gives you predictable output no matter which theme is active.

b. Block Extensions = Styling Enhancements

Add attributes and controls for animations, visibility, and spacing.

Inject those via a custom blockEditor.BlockEdit filter.

Use CSS variables or utility classes (e.g., .dsg-hidden-mobile).

This lets you layer advanced features without breaking core blocks.

c. Canvas Template = Isolation Mode

For full freedom, include a canvas.php template. It provides:

Zero theme interference.

Real-time preview that matches your design system.

Seamless export to live site (Airo → MWP).

This mirrors how Elementor and Bricks handle visual editing.

3. Key technical practices

Use consistent namespaces

register_block_type( 'dsg/container', [
  'render_callback' => 'dsg_render_container_block',
  'supports' => [ 'layout' => false, 'spacing' => false ],
]);


Apply CSS resets globally

.dsg-container * {
  all: unset;
  display: revert;
}


Store responsive settings cleanly

const blockProps = useBlockProps({
  'data-cols-desktop': attrs.cols.desktop,
  'data-cols-tablet': attrs.cols.tablet,
  'data-cols-mobile': attrs.cols.mobile,
});


Frontend + Editor parity

Enqueue a single frontend.js for both environments.

Apply layouts dynamically via ResizeObserver.

4. Why this wins long term

You bypass the biggest Gutenberg constraint: inconsistent layout rendering between editor and frontend.

You remain compatible with WordPress core (Gutenberg is still the editor).

You can progressively enhance without waiting on WP updates.

You can move faster on design patterns, grids, and responsive behaviors.

5. Next step

Start by rewriting your Container block:

No useInnerBlocksProps.

No supports.layout.

Add JS-driven responsive layout and aggressive CSS reset.
Once stable, layer in your extension system for spacing, motion, and visibility.

Would you like me to outline a file structure and implementation plan for this hybrid layout engine (Option 3)? It’ll include folder setup, hooks, block registration, CSS/JS structure, and responsive logic.

You said:
yes
ChatGPT said:

Perfect. Here’s a clear plan for implementing the Hybrid Layout Engine (Option 3) for Airo Site Designer. This will let you fully control layout and responsiveness without fighting Gutenberg, while still keeping compatibility for content editing.

1. Folder Structure
airo-site-designer/
│
├── includes/
│   ├── register-blocks.php
│   └── render-container.php
│
├── src/
│   ├── blocks/
│   │   └── container/
│   │       ├── block.json
│   │       ├── edit.js
│   │       ├── save.js
│   │       ├── style.scss
│   │       └── editor.scss
│   └── extensions/
│       ├── visibility/
│       ├── animation/
│       └── spacing/
│
├── build/                       (compiled assets)
│
├── templates/
│   └── canvas.php               (blank page template)
│
├── frontend.js
├── frontend.css
├── plugin.php
├── package.json
└── webpack.config.js

2. plugin.php
<?php
/**
 * Plugin Name: Airo Site Designer
 * Description: Layout and design system for Airo Site Designer.
 */

if ( ! defined( 'ABSPATH' ) ) exit;

require_once __DIR__ . '/includes/register-blocks.php';

3. includes/register-blocks.php
<?php
function airo_register_blocks() {
    register_block_type( __DIR__ . '/../src/blocks/container', [
        'render_callback' => 'airo_render_container_block',
    ]);
}
add_action( 'init', 'airo_register_blocks' );

function airo_enqueue_assets() {
    wp_enqueue_style( 'airo-frontend', plugins_url( '../frontend.css', __FILE__ ), [], '1.0' );
    wp_enqueue_script( 'airo-frontend', plugins_url( '../frontend.js', __FILE__ ), [], '1.0', true );
}
add_action( 'enqueue_block_assets', 'airo_enqueue_assets' );

4. src/blocks/container/block.json
{
  "apiVersion": 3,
  "name": "airo/container",
  "title": "Airo Container",
  "category": "layout",
  "icon": "layout",
  "supports": {
    "html": false,
    "align": ["full", "wide"],
    "spacing": false,
    "layout": false
  },
  "attributes": {
    "layout": { "type": "string", "default": "grid" },
    "columnsDesktop": { "type": "number", "default": 3 },
    "columnsTablet": { "type": "number", "default": 2 },
    "columnsMobile": { "type": "number", "default": 1 },
    "gap": { "type": "string", "default": "24px" }
  },
  "editorScript": "file:./edit.js",
  "editorStyle": "file:./editor.css",
  "style": "file:./style.css"
}

5. src/blocks/container/edit.js
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const { layout, columnsDesktop, columnsTablet, columnsMobile, gap } = attributes;

  const blockProps = useBlockProps({
    className: 'airo-container',
    'data-layout': layout,
    'data-cols-desktop': columnsDesktop,
    'data-cols-tablet': columnsTablet,
    'data-cols-mobile': columnsMobile,
    'data-gap': gap
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title="Layout Settings">
          <SelectControl
            label="Layout Type"
            value={layout}
            options={[
              { label: 'Grid', value: 'grid' },
              { label: 'Flex', value: 'flex' }
            ]}
            onChange={(value) => setAttributes({ layout: value })}
          />
          <RangeControl
            label="Desktop Columns"
            value={columnsDesktop}
            onChange={(value) => setAttributes({ columnsDesktop: value })}
            min={1}
            max={6}
          />
          <RangeControl
            label="Tablet Columns"
            value={columnsTablet}
            onChange={(value) => setAttributes({ columnsTablet: value })}
            min={1}
            max={6}
          />
          <RangeControl
            label="Mobile Columns"
            value={columnsMobile}
            onChange={(value) => setAttributes({ columnsMobile: value })}
            min={1}
            max={6}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div className="airo-container__inner">
          <InnerBlocks />
        </div>
      </div>
    </>
  );
}

6. src/blocks/container/save.js
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
  const { layout, columnsDesktop, columnsTablet, columnsMobile, gap } = attributes;

  const blockProps = useBlockProps.save({
    className: 'airo-container',
    'data-layout': layout,
    'data-cols-desktop': columnsDesktop,
    'data-cols-tablet': columnsTablet,
    'data-cols-mobile': columnsMobile,
    'data-gap': gap
  });

  return (
    <div {...blockProps}>
      <div className="airo-container__inner">
        <InnerBlocks.Content />
      </div>
    </div>
  );
}

7. frontend.js
document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('.airo-container');

  const updateLayout = (container) => {
    const layout = container.dataset.layout;
    const gap = container.dataset.gap || '24px';
    const inner = container.querySelector('.airo-container__inner');

    const width = window.innerWidth;
    let cols = container.dataset.colsDesktop;

    if (width < 768) cols = container.dataset.colsMobile;
    else if (width < 1024) cols = container.dataset.colsTablet;

    if (layout === 'grid') {
      inner.style.display = 'grid';
      inner.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      inner.style.gap = gap;
    } else {
      inner.style.display = 'flex';
      inner.style.flexWrap = 'wrap';
      inner.style.gap = gap;
    }
  };

  containers.forEach(updateLayout);
  window.addEventListener('resize', () => containers.forEach(updateLayout));
});

8. frontend.css
.airo-container {
  width: 100%;
  margin: 0 auto;
}

.airo-container__inner {
  box-sizing: border-box;
  width: 100%;
}

.airo-container.alignfull {
  width: 100vw !important;
  margin-left: calc(50% - 50vw) !important;
  margin-right: calc(50% - 50vw) !important;
}

9. templates/canvas.php
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <?php wp_head(); ?>
  <style>
    body { margin: 0; padding: 0; }
    .editor-styles-wrapper { padding: 0 !important; }
  </style>
</head>
<body <?php body_class('airo-canvas'); ?>>
  <?php the_content(); ?>
  <?php wp_footer(); ?>
</body>
</html>

10. Next Steps

Add extensions (visibility, animation, spacing) under /src/extensions.

Register them through wp.hooks.addFilter( 'blocks.registerBlockType' … ).

Test responsiveness and editor preview parity.

Integrate the container system into Airo Site Designer’s refinement stage.

Would you like me to show how to add one simple extension module (for example, visibility control by device) that integrates cleanly into this structure?

You said:
yes
ChatGPT said:

Good. Let’s add a Visibility Extension — the simplest and most useful enhancement for this architecture. It lets users hide any block on mobile, tablet, or desktop.

This will show you how to structure all future extensions (animation, spacing, etc.) the same way.

1. Folder Structure

Add this under your existing /src/extensions folder:

src/
└── extensions/
    └── visibility/
        ├── index.js
        └── style.scss


You’ll also include a central loader file later (src/extensions/index.js) to register all extensions at once.

2. src/extensions/visibility/index.js
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import './style.scss';

// Extend block attributes
addFilter(
  'blocks.registerBlockType',
  'airo/visibility/attributes',
  (settings) => {
    if (!settings.attributes) return settings;

    settings.attributes = {
      ...settings.attributes,
      hideDesktop: { type: 'boolean', default: false },
      hideTablet: { type: 'boolean', default: false },
      hideMobile: { type: 'boolean', default: false },
    };

    return settings;
  }
);

// Add controls in sidebar
addFilter(
  'editor.BlockEdit',
  'airo/visibility/controls',
  createHigherOrderComponent((BlockEdit) => {
    return (props) => {
      const { attributes, setAttributes, name } = props;
      const { hideDesktop, hideTablet, hideMobile } = attributes;

      // Only apply to our container or supported blocks if desired
      if (name.startsWith('core/') || name.startsWith('airo/')) {
        return (
          <Fragment>
            <BlockEdit {...props} />
            <InspectorControls>
              <PanelBody title="Visibility" initialOpen={false}>
                <ToggleControl
                  label="Hide on Desktop"
                  checked={hideDesktop}
                  onChange={(value) => setAttributes({ hideDesktop: value })}
                />
                <ToggleControl
                  label="Hide on Tablet"
                  checked={hideTablet}
                  onChange={(value) => setAttributes({ hideTablet: value })}
                />
                <ToggleControl
                  label="Hide on Mobile"
                  checked={hideMobile}
                  onChange={(value) => setAttributes({ hideMobile: value })}
                />
              </PanelBody>
            </InspectorControls>
          </Fragment>
        );
      }

      return <BlockEdit {...props} />;
    };
  }, 'withVisibilityControls')
);

// Add CSS classes to the saved markup
addFilter(
  'blocks.getSaveContent.extraProps',
  'airo/visibility/save-props',
  (extraProps, blockType, attributes) => {
    const classes = [];
    if (attributes.hideDesktop) classes.push('dsg-hide-desktop');
    if (attributes.hideTablet) classes.push('dsg-hide-tablet');
    if (attributes.hideMobile) classes.push('dsg-hide-mobile');

    if (classes.length) {
      extraProps.className = [
        extraProps.className,
        ...classes,
      ].filter(Boolean).join(' ');
    }

    return extraProps;
  }
);

3. src/extensions/visibility/style.scss
/* Visibility utility classes */
.dsg-hide-desktop {
  @media (min-width: 1025px) {
    display: none !important;
  }
}

.dsg-hide-tablet {
  @media (min-width: 768px) and (max-width: 1024px) {
    display: none !important;
  }
}

.dsg-hide-mobile {
  @media (max-width: 767px) {
    display: none !important;
  }
}

4. src/extensions/index.js

Register all extensions here (add more later like animation, spacing, etc.):

import './visibility';

5. Update your block registration or main JS entry

Make sure your Webpack entry (for example in index.js or plugin.js) imports this:

import './blocks/container';
import './extensions';


This ensures the visibility controls appear for every block in the editor.

6. How it works

When the block editor loads, the extension adds three attributes (hideDesktop, hideTablet, hideMobile).

In the editor sidebar, users toggle visibility per device.

When saved, the plugin adds utility classes like .dsg-hide-mobile.

The CSS hides elements on the right breakpoints.

You get full responsive visibility control that works on any block, without touching its markup or core logic.

7. Next step ideas

Now that this pattern is in place, you can repeat it to add:

Animations: Fade, slide, delay (via data-aos or CSS transitions).

Spacing: Custom padding/margin overrides.

Motion on Scroll: Lightweight scroll observer to trigger animations.

Per-device alignment or flex direction.