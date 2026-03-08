# Product Categories Grid — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a WooCommerce Product Categories Grid block that displays categories in a responsive grid with image, name, and product count.

**Architecture:** Server-side rendered dynamic block (`render.php`) using WC Store API for editor previews and `get_terms('product_cat')` for frontend rendering. Two selection modes: "all top-level" (default) and manual picker. Same patterns as the existing Product Showcase Hero block.

**Tech Stack:** WordPress Block Editor (Gutenberg), WooCommerce Store API, PHP `get_terms()`, CSS Grid

**Design doc:** `docs/plans/2026-02-27-product-categories-grid-design.md`

---

### Task 1: Scaffold block files

**Files:**
- Create: `src/blocks/product-categories-grid/block.json`
- Create: `src/blocks/product-categories-grid/index.js`
- Create: `src/blocks/product-categories-grid/save.js`

**Step 1: Create block.json**

Create `src/blocks/product-categories-grid/block.json`:

```json
{
	"$schema": "https://schemas.wp.org/trunk/block.json",
	"apiVersion": 3,
	"name": "designsetgo/product-categories-grid",
	"version": "1.0.0",
	"title": "Product Categories Grid",
	"category": "design",
	"description": "Display WooCommerce product categories in a visual grid with images, names, and product counts. Requires WooCommerce.",
	"keywords": [
		"product",
		"categories",
		"grid",
		"woocommerce",
		"shop",
		"store",
		"ecommerce",
		"dsg"
	],
	"textdomain": "designsetgo",
	"supports": {
		"anchor": true,
		"align": ["wide", "full"],
		"html": false,
		"inserter": true,
		"color": {
			"background": true,
			"text": true,
			"gradients": true,
			"link": true,
			"__experimentalDefaultControls": {
				"background": true,
				"text": true
			}
		},
		"spacing": {
			"margin": true,
			"padding": true,
			"blockGap": true,
			"__experimentalDefaultControls": {
				"blockGap": true
			}
		},
		"typography": {
			"fontSize": true,
			"lineHeight": true,
			"__experimentalDefaultControls": {
				"fontSize": true
			}
		},
		"__experimentalBorder": {
			"color": true,
			"radius": true,
			"style": true,
			"width": true,
			"__experimentalDefaultControls": {
				"radius": true
			}
		},
		"shadow": true
	},
	"attributes": {
		"categorySource": {
			"type": "string",
			"default": "all",
			"enum": ["all", "manual"]
		},
		"selectedCategories": {
			"type": "array",
			"default": [],
			"items": {
				"type": "object"
			}
		},
		"excludeCategories": {
			"type": "array",
			"default": [],
			"items": {
				"type": "number"
			}
		},
		"columns": {
			"type": "number",
			"default": 3
		},
		"showProductCount": {
			"type": "boolean",
			"default": true
		},
		"showEmpty": {
			"type": "boolean",
			"default": false
		},
		"imageAspectRatio": {
			"type": "string",
			"default": "3/4"
		}
	},
	"example": {
		"attributes": {
			"columns": 3
		}
	},
	"editorScript": "file:./index.js",
	"editorStyle": "file:./index.css",
	"style": "file:./style-index.css",
	"render": "file:./render.php"
}
```

**Step 2: Create save.js**

Create `src/blocks/product-categories-grid/save.js`:

```javascript
/**
 * Product Categories Grid Block - Save Component
 *
 * Returns null because this is a dynamic block rendered server-side.
 *
 * @since 2.1.0
 */
export default function save() {
	return null;
}
```

**Step 3: Create index.js**

Create `src/blocks/product-categories-grid/index.js`:

```javascript
/**
 * Product Categories Grid Block Registration
 *
 * Displays WooCommerce product categories in a visual grid.
 *
 * @since 2.1.0
 */

import { registerBlockType } from '@wordpress/blocks';

import edit from './edit';
import save from './save';
import metadata from './block.json';
import { ICON_COLOR } from '../shared/constants';

import './editor.scss';
import './style.scss';

/**
 * Register Product Categories Grid Block
 */
registerBlockType(metadata.name, {
	...metadata,
	icon: {
		src: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				{/* 2x2 grid of category cards */}
				<rect
					x="3"
					y="3"
					width="8"
					height="8"
					rx="1"
					stroke="currentColor"
					strokeWidth="1.5"
					fill="none"
				/>
				<rect
					x="13"
					y="3"
					width="8"
					height="8"
					rx="1"
					stroke="currentColor"
					strokeWidth="1.5"
					fill="none"
				/>
				<rect
					x="3"
					y="13"
					width="8"
					height="8"
					rx="1"
					stroke="currentColor"
					strokeWidth="1.5"
					fill="none"
				/>
				<rect
					x="13"
					y="13"
					width="8"
					height="8"
					rx="1"
					stroke="currentColor"
					strokeWidth="1.5"
					fill="none"
				/>
				{/* Image area indicators */}
				<rect x="4" y="4" width="6" height="4" rx="0.5" fill="currentColor" opacity="0.3" />
				<rect x="14" y="4" width="6" height="4" rx="0.5" fill="currentColor" opacity="0.3" />
				<rect x="4" y="14" width="6" height="4" rx="0.5" fill="currentColor" opacity="0.3" />
				<rect x="14" y="14" width="6" height="4" rx="0.5" fill="currentColor" opacity="0.3" />
				{/* Text line indicators */}
				<line x1="4.5" y1="9.5" x2="9.5" y2="9.5" stroke="currentColor" strokeWidth="1" />
				<line x1="14.5" y1="9.5" x2="19.5" y2="9.5" stroke="currentColor" strokeWidth="1" />
				<line x1="4.5" y1="19.5" x2="9.5" y2="19.5" stroke="currentColor" strokeWidth="1" />
				<line x1="14.5" y1="19.5" x2="19.5" y2="19.5" stroke="currentColor" strokeWidth="1" />
			</svg>
		),
		foreground: ICON_COLOR,
	},
	edit,
	save,
});
```

**Step 4: Create placeholder edit.js**

Create `src/blocks/product-categories-grid/edit.js` with a minimal placeholder so the block compiles:

```javascript
/**
 * Product Categories Grid Block - Edit Component
 *
 * @since 2.1.0
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Placeholder } from '@wordpress/components';

export default function ProductCategoriesGridEdit() {
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<Placeholder
				icon="category"
				label={__('Product Categories Grid', 'designsetgo')}
				instructions={__(
					'Display your WooCommerce product categories in a visual grid.',
					'designsetgo'
				)}
			/>
		</div>
	);
}
```

**Step 5: Create placeholder style.scss and editor.scss**

Create `src/blocks/product-categories-grid/style.scss`:

```scss
/**
 * Product Categories Grid Block - Frontend Styles
 *
 * @package DesignSetGo
 * @since 2.1.0
 */
```

Create `src/blocks/product-categories-grid/editor.scss`:

```scss
/**
 * Product Categories Grid Block - Editor Styles
 *
 * @package DesignSetGo
 * @since 2.1.0
 */
```

**Step 6: Build and verify block registers**

Run: `cd /Users/jnealey/GitHub\ Local/designsetgo && npm run build`

Expected: Build succeeds, block appears in the editor inserter.

**Step 7: Register block in WooCommerce gate**

Modify `includes/class-plugin.php` — add `'designsetgo/product-categories-grid'` to the `$wc_blocks` array in `gate_woocommerce_blocks()` (around line 759-761):

```php
$wc_blocks = array(
    'designsetgo/product-showcase-hero',
    'designsetgo/product-categories-grid',
);
```

**Step 8: Commit**

```bash
git add src/blocks/product-categories-grid/ includes/class-plugin.php
git commit -m "feat: scaffold product categories grid block"
```

---

### Task 2: Build server-side rendering (render.php)

**Files:**
- Create: `src/blocks/product-categories-grid/render.php`

**Step 1: Create render.php**

Create `src/blocks/product-categories-grid/render.php`:

```php
<?php
/**
 * Product Categories Grid Block - Server-side Rendering
 *
 * Renders WooCommerce product categories in a responsive grid.
 *
 * @package DesignSetGo
 * @since 2.1.0
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content (unused for dynamic blocks).
 * @param WP_Block $block      Block instance.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Bail if WooCommerce is not active.
if ( ! function_exists( 'wc_get_product' ) ) {
	return '';
}

// Extract attributes with defaults.
$category_source    = isset( $attributes['categorySource'] ) ? $attributes['categorySource'] : 'all';
$selected_cats      = isset( $attributes['selectedCategories'] ) ? $attributes['selectedCategories'] : array();
$exclude_cats       = isset( $attributes['excludeCategories'] ) ? $attributes['excludeCategories'] : array();
$columns            = isset( $attributes['columns'] ) ? absint( $attributes['columns'] ) : 3;
$show_product_count = ! isset( $attributes['showProductCount'] ) || $attributes['showProductCount'];
$show_empty         = ! empty( $attributes['showEmpty'] );
$aspect_ratio       = isset( $attributes['imageAspectRatio'] ) ? $attributes['imageAspectRatio'] : '3/4';

// Validate columns (2-5).
$columns = max( 2, min( 5, $columns ) );

// Validate aspect ratio.
$allowed_ratios = array( '1/1', '3/4', '4/3', '16/9' );
if ( ! in_array( $aspect_ratio, $allowed_ratios, true ) ) {
	$aspect_ratio = '3/4';
}

// Query categories based on source mode.
if ( 'manual' === $category_source ) {
	// Manual mode: fetch selected categories in user-defined order.
	$selected_ids = array_map( function ( $cat ) {
		return isset( $cat['id'] ) ? absint( $cat['id'] ) : 0;
	}, $selected_cats );
	$selected_ids = array_filter( $selected_ids );

	if ( empty( $selected_ids ) ) {
		return '';
	}

	$categories = get_terms(
		array(
			'taxonomy'   => 'product_cat',
			'include'    => $selected_ids,
			'hide_empty' => false,
			'orderby'    => 'include',
		)
	);

	// Build a lookup of featured state by category ID.
	$featured_map = array();
	foreach ( $selected_cats as $cat ) {
		if ( isset( $cat['id'] ) && ! empty( $cat['featured'] ) ) {
			$featured_map[ absint( $cat['id'] ) ] = true;
		}
	}
} else {
	// All mode: fetch top-level categories.
	$exclude_ids = array_map( 'absint', $exclude_cats );

	// Always exclude the "uncategorized" default category.
	$uncategorized_id = absint( get_option( 'default_product_cat', 0 ) );
	if ( $uncategorized_id && ! in_array( $uncategorized_id, $exclude_ids, true ) ) {
		$exclude_ids[] = $uncategorized_id;
	}

	$categories = get_terms(
		array(
			'taxonomy'   => 'product_cat',
			'parent'     => 0,
			'hide_empty' => ! $show_empty,
			'exclude'    => $exclude_ids,
			'orderby'    => 'menu_order',
			'order'      => 'ASC',
		)
	);

	$featured_map = array();
}

// Bail if no categories found.
if ( is_wp_error( $categories ) || empty( $categories ) ) {
	return '';
}

// Build wrapper attributes.
$wrapper_class = 'dsgo-product-categories-grid dsgo-product-categories-grid--cols-' . $columns;
$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => $wrapper_class,
		'style' => '--dsgo-pcg-aspect-ratio: ' . esc_attr( $aspect_ratio ) . ';',
		'role'  => 'navigation',
		'aria-label' => esc_attr__( 'Product categories', 'designsetgo' ),
	)
);

// Placeholder SVG for categories without images.
$placeholder_svg = '<svg class="dsgo-product-categories-grid__placeholder-svg" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="8" y="8" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><rect x="27" y="8" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><rect x="8" y="27" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><rect x="27" y="27" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/></svg>';
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() output. ?>>
	<?php foreach ( $categories as $category ) :
		$term_id      = $category->term_id;
		$cat_name     = $category->name;
		$cat_link     = get_term_link( $category );
		$cat_count    = $category->count;
		$thumbnail_id = get_term_meta( $term_id, 'thumbnail_id', true );
		$is_featured  = ! empty( $featured_map[ $term_id ] );

		// Skip if get_term_link returned an error.
		if ( is_wp_error( $cat_link ) ) {
			continue;
		}

		$card_class = 'dsgo-product-categories-grid__card';
		if ( $is_featured ) {
			$card_class .= ' dsgo-product-categories-grid__card--featured';
		}
	?>
		<a href="<?php echo esc_url( $cat_link ); ?>" class="<?php echo esc_attr( $card_class ); ?>">
			<div class="dsgo-product-categories-grid__image-wrapper">
				<?php if ( $thumbnail_id ) : ?>
					<?php
					echo wp_get_attachment_image(
						$thumbnail_id,
						'medium_large',
						false,
						array(
							'class'   => 'dsgo-product-categories-grid__image',
							'alt'     => '',
							'loading' => 'lazy',
						)
					);
					?>
				<?php else : ?>
					<div class="dsgo-product-categories-grid__placeholder-icon">
						<?php echo $placeholder_svg; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Static SVG markup. ?>
					</div>
				<?php endif; ?>
			</div>
			<div class="dsgo-product-categories-grid__info">
				<h3 class="dsgo-product-categories-grid__name">
					<?php echo esc_html( $cat_name ); ?>
				</h3>
				<?php if ( $show_product_count ) : ?>
					<span class="dsgo-product-categories-grid__count" aria-hidden="true">
						<?php
						echo esc_html(
							sprintf(
								/* translators: %d: number of products */
								_n( '%d product', '%d products', $cat_count, 'designsetgo' ),
								$cat_count
							)
						);
						?>
					</span>
					<span class="screen-reader-text">
						<?php
						echo esc_html(
							sprintf(
								/* translators: 1: number of products, 2: category name */
								_n( '%1$d product in %2$s', '%1$d products in %2$s', $cat_count, 'designsetgo' ),
								$cat_count,
								$cat_name
							)
						);
						?>
					</span>
				<?php endif; ?>
			</div>
		</a>
	<?php endforeach; ?>
</div>
```

**Step 2: Build and verify**

Run: `npm run build`

Expected: Build succeeds. Block renders server-side when WooCommerce categories exist.

**Step 3: Commit**

```bash
git add src/blocks/product-categories-grid/render.php
git commit -m "feat: add server-side rendering for product categories grid"
```

---

### Task 3: Build frontend styles

**Files:**
- Modify: `src/blocks/product-categories-grid/style.scss`

**Step 1: Write frontend styles**

Replace `src/blocks/product-categories-grid/style.scss` with the full grid layout, responsive breakpoints, hover effect, and placeholder styles. Reference design doc CSS section.

Key selectors:
- `.dsgo-product-categories-grid` — CSS Grid container with column variants (`--cols-2` through `--cols-5`)
- `.dsgo-product-categories-grid__card` — `<a>` tag, `display: block`, `text-decoration: none`, `color: inherit`, `overflow: hidden`
- `.dsgo-product-categories-grid__card--featured` — `grid-column: span 2`
- `.dsgo-product-categories-grid__card:hover .dsgo-product-categories-grid__image` — `transform: scale(1.05)`
- `.dsgo-product-categories-grid__image-wrapper` — `overflow: hidden`, `aspect-ratio: var(--dsgo-pcg-aspect-ratio, 3/4)`
- `.dsgo-product-categories-grid__image` — `width: 100%`, `height: 100%`, `object-fit: cover`, `transition: transform 0.3s ease`
- `.dsgo-product-categories-grid__placeholder-icon` — centered SVG, background color fallback
- `.dsgo-product-categories-grid__info` — `padding: 1rem`
- `.dsgo-product-categories-grid__name` — `margin: 0`, `font-size: inherit`
- `.dsgo-product-categories-grid__count` — `opacity: 0.7`, `font-size: 0.875em`
- Responsive: `@media (max-width: 781px)` collapse cols 3-5 to 2; `@media (max-width: 480px)` collapse all to 1, reset featured span

**Step 2: Build and verify CSS is in output**

Run: `npm run build`

Verify: `grep "dsgo-product-categories-grid" build/style-index.css` returns matches.

**Step 3: Commit**

```bash
git add src/blocks/product-categories-grid/style.scss
git commit -m "style: add frontend grid layout and responsive styles"
```

---

### Task 4: Build editor preview (GridPreview component)

**Files:**
- Create: `src/blocks/product-categories-grid/components/GridPreview.js`

**Step 1: Create GridPreview component**

This component renders the category grid in the editor, matching the frontend HTML structure. It receives `categories` (array of category objects from Store API), `attributes`, and renders the grid.

Each category object from `/wc/store/v1/products/categories` has: `id`, `name`, `slug`, `description`, `parent`, `count`, `image` (object with `src`, `thumbnail`, `srcset`, or null), `permalink`.

The component should:
- Render the same BEM class structure as render.php
- Show placeholder SVG for categories without images
- Show product count if `showProductCount` is true
- Apply `--featured` class for featured categories (manual mode)
- Set the `--dsgo-pcg-aspect-ratio` CSS variable
- Apply the columns class (`dsgo-product-categories-grid--cols-{N}`)
- Show an editor-only "Add images to your categories for best results" notice if any category has no image

**Step 2: Build and verify**

Run: `npm run build`

Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/blocks/product-categories-grid/components/GridPreview.js
git commit -m "feat: add editor grid preview component"
```

---

### Task 5: Build edit.js with "all categories" mode

**Files:**
- Modify: `src/blocks/product-categories-grid/edit.js`

**Step 1: Implement edit.js with "all" mode**

Replace the placeholder edit.js. The full edit component should:

1. Use `useBlockProps()` with className `dsgo-product-categories-grid-wrapper`
2. Fetch all categories from `/wc/store/v1/products/categories?per_page=100` on mount
3. Filter to top-level (`parent === 0`), exclude `excludeCategories`, exclude default uncategorized category
4. Filter out empty if `showEmpty` is false
5. Pass filtered categories to `GridPreview`
6. **InspectorControls:**
   - Panel "Categories": `ButtonGroup` toggle for `categorySource` ("All" / "Manual"), `showEmpty` toggle (visible only in "all" mode)
   - Panel "Display": `showProductCount` toggle
   - Panel "Layout": `RangeControl` for columns (2-5), `ButtonGroup` for `imageAspectRatio` (1:1, 3:4, 4:3, 16:9)
7. **BlockControls (toolbar):** Column count quick buttons (2, 3, 4)
8. Loading state: `Spinner` in `Placeholder`
9. Empty state: `Placeholder` with "No product categories found" message
10. No-WooCommerce state: `Placeholder` with notice (Store API will 404, catch the error)

Do NOT implement manual mode yet — just show a placeholder message when `categorySource === 'manual'`.

**Step 2: Build and test in editor**

Run: `npm run build`

Expected: Block shows a live grid of product categories in the editor with working sidebar controls.

**Step 3: Commit**

```bash
git add src/blocks/product-categories-grid/edit.js
git commit -m "feat: implement editor with all-categories mode and sidebar controls"
```

---

### Task 6: Build CategoryPicker component

**Files:**
- Create: `src/blocks/product-categories-grid/components/CategoryPicker.js`

**Step 1: Create CategoryPicker component**

Same pattern as `src/blocks/product-showcase-hero/components/ProductPicker.js` but for categories:

- Uses `ComboboxControl` with `__next40pxDefaultSize` and `__nextHasNoMarginBottom`
- Searches `/wc/store/v1/products/categories?search={query}&per_page=20` with debounced input (300ms)
- Uses `AbortController` to cancel in-flight requests
- Minimum 2 characters to trigger search
- Options: `{ value: category.id, label: category.name }`
- Props: `onSelect(categoryId, categoryData)`, `excludeIds` (array of IDs to filter from results)

**Step 2: Build and verify**

Run: `npm run build`

Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/blocks/product-categories-grid/components/CategoryPicker.js
git commit -m "feat: add category picker component with debounced search"
```

---

### Task 7: Build CategoryList component

**Files:**
- Create: `src/blocks/product-categories-grid/components/CategoryList.js`

**Step 1: Create CategoryList component**

A sortable list of selected categories for manual mode. Each item shows:
- Category name (fetched from Store API or passed as prop)
- Featured toggle (star icon button)
- Remove button (X icon)
- Drag handle for reordering

Use the `@wordpress/components` `Button` for actions. For reordering, use simple up/down arrow buttons (avoids drag-and-drop library dependency — YAGNI for v1).

Props:
- `selectedCategories` — array of `{ id, featured }` objects
- `categoryNames` — map of `id -> name` for display
- `onChange(newSelectedCategories)` — callback when list changes
- `onRemove(categoryId)` — callback when removing

Renders nothing if `selectedCategories` is empty.

**Step 2: Build and verify**

Run: `npm run build`

Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/blocks/product-categories-grid/components/CategoryList.js
git commit -m "feat: add sortable category list component for manual mode"
```

---

### Task 8: Wire up manual mode in edit.js

**Files:**
- Modify: `src/blocks/product-categories-grid/edit.js`

**Step 1: Integrate CategoryPicker and CategoryList**

Update edit.js to handle manual mode:

1. When `categorySource === 'manual'`:
   - Show `CategoryPicker` to add categories (exclude already-selected IDs)
   - Show `CategoryList` below picker with selected categories
   - On picker select: append to `selectedCategories` with `featured: false`
   - On list change: update `selectedCategories` attribute
   - On remove: filter from `selectedCategories`
2. Fetch category data for selected IDs from Store API to get names and images for preview
3. Pass selected categories (with featured flags) to `GridPreview`
4. In "Categories" sidebar panel:
   - "All" mode: show `excludeCategories` exclude picker (simplified — just list all categories as checkboxes or use a multi-select)
   - "Manual" mode: show `CategoryPicker` + `CategoryList`

**Step 2: Build and test**

Run: `npm run build`

Expected: Both "all" and "manual" modes work in the editor. Manual mode allows picking, reordering, featuring, and removing categories.

**Step 3: Commit**

```bash
git add src/blocks/product-categories-grid/edit.js
git commit -m "feat: wire up manual category selection mode"
```

---

### Task 9: Build editor styles

**Files:**
- Modify: `src/blocks/product-categories-grid/editor.scss`

**Step 1: Add editor-specific styles**

```scss
/**
 * Product Categories Grid Block - Editor Styles
 *
 * @package DesignSetGo
 * @since 2.1.0
 */

.dsgo-product-categories-grid-wrapper {
	// Placeholder styling.
	.components-placeholder {
		min-height: 200px;
	}
}

// No-image nudge notice (editor only).
.dsgo-product-categories-grid__no-image-notice {
	margin-top: 12px;
	font-size: 12px;
	color: #757575;
}

// Category list in sidebar.
.dsgo-product-categories-grid__category-list-item {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 6px 0;
	border-bottom: 1px solid #ddd;

	&:last-child {
		border-bottom: none;
	}
}

.dsgo-product-categories-grid__category-list-name {
	flex: 1;
	font-size: 13px;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

// Disable link navigation in editor preview.
.dsgo-product-categories-grid__card {
	pointer-events: none;
}
```

**Step 2: Build and verify**

Run: `npm run build`

Expected: Editor styles apply correctly.

**Step 3: Commit**

```bash
git add src/blocks/product-categories-grid/editor.scss
git commit -m "style: add editor-specific styles for category grid"
```

---

### Task 10: Lint, build, and final verification

**Files:**
- All files in `src/blocks/product-categories-grid/`
- `includes/class-plugin.php`

**Step 1: Run linters**

```bash
npm run lint:js
npm run lint:css
```

Fix any issues.

**Step 2: Full build**

```bash
npm run build
```

Expected: Clean build, no warnings.

**Step 3: Manual verification checklist**

Test in the block editor:
- [ ] Block appears in inserter under "Design" category
- [ ] "All categories" mode shows all top-level WooCommerce categories in a grid
- [ ] Column control (2-5) changes grid columns
- [ ] Aspect ratio control changes image proportions
- [ ] Product count toggle shows/hides counts
- [ ] Show empty toggle includes/excludes empty categories
- [ ] Switching to "Manual" mode shows category picker
- [ ] Adding categories via picker populates the grid preview
- [ ] Featured toggle makes category span 2 columns
- [ ] Reordering categories updates preview order
- [ ] Removing a category updates the grid

Test on frontend:
- [ ] Block renders correct HTML structure
- [ ] Category cards link to correct archive pages
- [ ] Images display with correct aspect ratio
- [ ] Hover zoom effect works on images
- [ ] Featured cards span 2 columns
- [ ] Responsive: 2 columns on tablet, 1 on mobile
- [ ] Categories without images show placeholder icon
- [ ] Product count text displays correctly with pluralization

Test edge cases:
- [ ] Block renders nothing when WooCommerce is not active
- [ ] Empty store (no categories) shows appropriate placeholder in editor
- [ ] Categories with no products hidden when showEmpty is false

**Step 4: Commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: lint and verification fixes for product categories grid"
```
