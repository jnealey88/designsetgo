# Overlay Header Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add per-page overlay header support — a transparent header that overlays the hero section, transitioning to opaque sticky on scroll.

**Architecture:** Per-page post meta (`dsgo_overlay_header`) controls a body class (`dsgo-page-overlay-header`). CSS positions the header absolutely when the class is present. The existing sticky header JS handles the scroll transition from transparent/absolute to opaque/sticky. A `PluginDocumentSettingPanel` provides the editor toggle.

**Tech Stack:** PHP (post meta, body_class filter), JS (React sidebar panel, sticky-header scroll handler), SCSS (overlay positioning rules), WordPress Block Editor APIs (`useEntityProp`, `registerPlugin`)

---

## Task 1: Create PHP Overlay Header Class

**Files:**
- Create: `includes/class-overlay-header.php`

**Step 1: Create the overlay header PHP class**

This class registers post meta and outputs the body class. Follow the pattern from `includes/llms-txt/class-controller.php:283-309` for meta registration and `includes/class-sticky-header.php:37-52` for body class.

```php
<?php
/**
 * Overlay Header Class
 *
 * Handles per-page overlay header functionality via post meta.
 *
 * @package DesignSetGo
 * @since 2.1.0
 */

namespace DesignSetGo;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Overlay Header Class
 */
class Overlay_Header {
	/**
	 * Post meta key for overlay header toggle.
	 */
	const META_KEY = 'dsgo_overlay_header';

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_post_meta' ) );
		add_filter( 'body_class', array( $this, 'add_body_class' ) );
	}

	/**
	 * Register post meta for overlay header toggle.
	 */
	public function register_post_meta(): void {
		$post_types = get_post_types( array( 'public' => true ), 'names' );

		foreach ( $post_types as $post_type ) {
			if ( 'attachment' === $post_type ) {
				continue;
			}

			register_post_meta(
				$post_type,
				self::META_KEY,
				array(
					'type'              => 'boolean',
					'description'       => __( 'Enable overlay header on this page', 'designsetgo' ),
					'single'            => true,
					'default'           => false,
					'show_in_rest'      => true,
					'sanitize_callback' => 'rest_sanitize_boolean',
					'auth_callback'     => function ( $allowed, $meta_key, $post_id ) {
						if ( ! $post_id || ! is_numeric( $post_id ) ) {
							return false;
						}
						return current_user_can( 'edit_post', (int) $post_id );
					},
				)
			);
		}
	}

	/**
	 * Add body class when overlay header is enabled for the current post.
	 *
	 * @param string[] $classes Body classes.
	 * @return string[] Modified body classes.
	 */
	public function add_body_class( $classes ) {
		if ( ! is_singular() ) {
			return $classes;
		}

		$post_id = get_the_ID();
		if ( ! $post_id ) {
			return $classes;
		}

		if ( get_post_meta( $post_id, self::META_KEY, true ) ) {
			$classes[] = 'dsgo-page-overlay-header';
		}

		return $classes;
	}
}
```

**Step 2: Verify the file was created correctly**

Run: `php -l includes/class-overlay-header.php`
Expected: `No syntax errors detected`

**Step 3: Commit**

```bash
git add includes/class-overlay-header.php
git commit -m "feat(overlay-header): add PHP class for post meta and body class"
```

---

## Task 2: Wire Overlay Header Class into Plugin

**Files:**
- Modify: `includes/class-plugin.php:390` (add require_once after class-sticky-header.php)
- Modify: `includes/class-plugin.php:450` (add instantiation after sticky_header)

**Step 1: Add require_once to load_dependencies()**

In `includes/class-plugin.php`, after line 390 (`require_once DESIGNSETGO_PATH . 'includes/class-sticky-header.php';`), add:

```php
require_once DESIGNSETGO_PATH . 'includes/class-overlay-header.php';
```

**Step 2: Add property declaration**

After the `$sticky_header` property (line 300), add:

```php
/**
 * Overlay Header instance.
 *
 * @var Overlay_Header
 */
public $overlay_header;
```

**Step 3: Add instantiation to init()**

After line 450 (`$this->sticky_header = new Sticky_Header();`), add:

```php
$this->overlay_header = new Overlay_Header();
```

**Step 4: Verify PHP syntax**

Run: `php -l includes/class-plugin.php`
Expected: `No syntax errors detected`

**Step 5: Commit**

```bash
git add includes/class-plugin.php
git commit -m "feat(overlay-header): wire Overlay_Header class into plugin init"
```

---

## Task 3: Create Editor Sidebar Panel (JS)

**Files:**
- Create: `src/overlay-header/index.js`

**Step 1: Create the overlay header editor panel**

Follow the pattern from `src/llms-txt/index.js` which uses `PluginDocumentSettingPanel` + `useEntityProp`. This is a standalone entry point (not an extension), matching how llms-txt works.

```js
/**
 * Overlay Header Panel
 *
 * Adds a sidebar panel to posts/pages for enabling overlay header.
 *
 * @package
 * @since 2.1.0
 */

import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { ToggleControl, Notice } from '@wordpress/components';

/**
 * Overlay Header Panel Component
 */
const OverlayHeaderPanel = () => {
	const postType = useSelect(
		(select) => select('core/editor').getCurrentPostType(),
		[]
	);

	const [meta, setMeta] = useEntityProp('postType', postType, 'meta');

	const overlayEnabled = meta?.dsgo_overlay_header || false;

	const updateOverlay = (value) => {
		setMeta({ ...meta, dsgo_overlay_header: value });
	};

	// Only show for content post types.
	if (!postType || postType === 'attachment') {
		return null;
	}

	return (
		<PluginDocumentSettingPanel
			name="dsgo-overlay-header"
			title={__('Header Display', 'designsetgo')}
			className="dsgo-overlay-header-panel"
		>
			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Overlay Header', 'designsetgo')}
				help={__(
					'Makes the header transparent and positions it over the page content. Best used with hero sections that have a background image or color.',
					'designsetgo'
				)}
				checked={overlayEnabled}
				onChange={updateOverlay}
			/>
			{overlayEnabled && (
				<Notice status="info" isDismissible={false}>
					{__(
						'Preview this page on the frontend to see the overlay effect.',
						'designsetgo'
					)}
				</Notice>
			)}
		</PluginDocumentSettingPanel>
	);
};

registerPlugin('dsgo-overlay-header', {
	render: OverlayHeaderPanel,
});
```

**Step 2: Commit**

```bash
git add src/overlay-header/index.js
git commit -m "feat(overlay-header): add editor sidebar panel with toggle"
```

---

## Task 4: Add Webpack Entry Point and PHP Enqueue

**Files:**
- Modify: `webpack.config.js:102` (add entry after llms-txt)
- Modify: `includes/class-plugin.php` (add enqueue in editor_assets)

**Step 1: Add webpack entry point**

In `webpack.config.js`, after line 102 (`'llms-txt': path.resolve(...)`), add:

```js
'overlay-header': path.resolve(process.cwd(), 'src', 'overlay-header', 'index.js'),
```

**Step 2: Add PHP enqueue in editor_assets()**

In `includes/class-plugin.php`, inside `editor_assets()` method (after the llms-txt enqueue block ending around line 562), add:

```php
// Enqueue overlay header editor panel.
$overlay_asset_file = DESIGNSETGO_PATH . 'build/overlay-header.asset.php';

if ( file_exists( $overlay_asset_file ) ) {
	$overlay_asset = include $overlay_asset_file;

	wp_enqueue_script(
		'dsgo-overlay-header-panel',
		DESIGNSETGO_URL . 'build/overlay-header.js',
		$overlay_asset['dependencies'],
		$overlay_asset['version'],
		true
	);
}
```

**Step 3: Verify syntax**

Run: `php -l includes/class-plugin.php`
Expected: `No syntax errors detected`

**Step 4: Build and verify the JS compiles**

Run: `npm run build`
Expected: Build succeeds, `build/overlay-header.js` and `build/overlay-header.asset.php` are created

**Step 5: Commit**

```bash
git add webpack.config.js includes/class-plugin.php src/overlay-header/index.js
git commit -m "feat(overlay-header): add webpack entry and PHP enqueue for editor panel"
```

---

## Task 5: Add CSS Overlay Positioning Rules

**Files:**
- Modify: `src/styles/utilities/_sticky-header.scss` (append after line 220)

**Step 1: Add overlay header CSS rules**

Append to the end of `src/styles/utilities/_sticky-header.scss` (after the print styles block at line 220):

```scss

/**
 * Overlay Header
 * Positions the header absolutely over page content when enabled via post meta.
 * The page must have the `dsgo-page-overlay-header` body class.
 */

/* stylelint-disable selector-class-pattern */
body:not(.block-editor-page).dsgo-page-overlay-header .wp-block-template-part:not(footer):first-of-type,
body:not(.block-editor-page).dsgo-page-overlay-header header.wp-block-template-part {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: var(--dsgo-sticky-header-z-index, 100);
	background-color: transparent !important;
	transition: background-color var(--dsgo-sticky-header-transition-speed, 300ms) ease-in-out,
		box-shadow var(--dsgo-sticky-header-transition-speed, 300ms) ease-in-out;
}

/**
 * Overlay Header + Admin Bar Offset
 */
body:not(.block-editor-page).admin-bar.dsgo-page-overlay-header .wp-block-template-part:not(footer):first-of-type,
body:not(.block-editor-page).admin-bar.dsgo-page-overlay-header header.wp-block-template-part {
	top: 32px;
}

@media screen and (max-width: 782px) {

	body:not(.block-editor-page).admin-bar.dsgo-page-overlay-header .wp-block-template-part:not(footer):first-of-type,
	body:not(.block-editor-page).admin-bar.dsgo-page-overlay-header header.wp-block-template-part {
		top: 46px;
	}
}

/**
 * Overlay Header Scroll Transition
 * When both overlay and sticky are active, transition from absolute to sticky on scroll.
 * The `dsgo-scrolled` class is added by sticky-header.js when past the scroll threshold.
 */
body:not(.block-editor-page).dsgo-page-overlay-header .dsgo-sticky-header-enabled.dsgo-scrolled,
body:not(.block-editor-page).dsgo-page-overlay-header .wp-block-template-part.dsgo-sticky-header-enabled.dsgo-scrolled {
	position: sticky;
	background-color: var(--dsgo-sticky-scroll-bg-color, rgba(255, 255, 255, 0.95)) !important;
}

/**
 * Overlay Header Print Styles
 */
@media print {

	body.dsgo-page-overlay-header .wp-block-template-part {
		position: relative !important;
		background-color: transparent !important;
	}
}
/* stylelint-enable selector-class-pattern */
```

**Step 2: Build and verify CSS compiles**

Run: `npm run build`
Expected: Build succeeds. Verify the overlay rules appear in the output:
Run: `grep -c "dsgo-page-overlay-header" build/style-index.css`
Expected: Multiple matches (at least 4)

**Step 3: Commit**

```bash
git add src/styles/utilities/_sticky-header.scss
git commit -m "feat(overlay-header): add CSS positioning rules for overlay mode"
```

---

## Task 6: Modify Sticky Header JS for Overlay Awareness

**Files:**
- Modify: `src/utils/sticky-header.js:169-198` (handleScroll function)

**Step 1: Add overlay detection at module scope**

In `src/utils/sticky-header.js`, after the `let ticking = false;` line (line 57), add:

```js
// Detect if overlay header mode is active for this page
const isOverlayPage = document.body.classList.contains('dsgo-page-overlay-header');
```

**Step 2: Update handleScroll to swap position on scroll**

In the `handleScroll` function (line 169), add overlay logic after the `dsgo-scrolled` class toggle (after line 182). The updated function should be:

```js
function handleScroll(header) {
	const scrollY = window.scrollY;

	// Check if we should disable on mobile
	if (!settings.mobileEnabled && isMobile()) {
		return;
	}

	// Add/remove scrolled class based on threshold
	if (scrollY > settings.scrollThreshold) {
		header.classList.add('dsgo-scrolled');
	} else {
		header.classList.remove('dsgo-scrolled');
	}

	// Overlay header: swap between absolute (at top) and sticky (scrolled)
	if (isOverlayPage) {
		if (scrollY > settings.scrollThreshold) {
			header.style.position = 'sticky';
		} else {
			header.style.position = '';
		}
	}

	// Handle hide on scroll down
	if (settings.hideOnScrollDown && scrollY > settings.scrollThreshold) {
		if (scrollY > lastScrollY) {
			// Scrolling down
			header.classList.add('dsgo-scroll-down');
			header.classList.remove('dsgo-scroll-up');
		} else {
			// Scrolling up
			header.classList.add('dsgo-scroll-up');
			header.classList.remove('dsgo-scroll-down');
		}
	}

	lastScrollY = scrollY;
}
```

The key addition is the `isOverlayPage` block (~6 lines). When the user scrolls past the threshold, the header switches from `position: absolute` (set by CSS) to `position: sticky` (set inline by JS). When scrolling back to top, the inline style is cleared and CSS takes over again.

**Step 3: Build and verify**

Run: `npm run build`
Expected: Build succeeds, `build/utils/sticky-header.js` is updated

**Step 4: Commit**

```bash
git add src/utils/sticky-header.js
git commit -m "feat(overlay-header): add overlay awareness to sticky header scroll handler"
```

---

## Task 7: Create Overlay Header Patterns

**Files:**
- Create: `patterns/header/header-classic-overlay.php`
- Create: `patterns/header/header-dark-overlay.php`
- Create: `patterns/header/header-cta-overlay.php`

These patterns are on the `claude/header-footer-patterns` branch. Base them on the existing header patterns but with: no background color, light (base) text colors, no borders. The existing patterns are at `patterns/header/header-classic.php`, `patterns/header/header-dark.php`, and `patterns/header/header-cta.php` on that branch.

**Step 1: Create header-classic-overlay.php**

Based on `header-classic.php` from the feature branch. Key changes:
- No bottom border on the inner section
- No background color
- Light text color (`textColor: base`) for visibility over dark heroes
- Link colors set to base

```php
<?php
/**
 * Title: Header Classic Overlay
 * Slug: designsetgo/header/header-classic-overlay
 * Categories: dsgo-header
 * Description: A transparent header designed to overlay hero sections with dark backgrounds
 * Keywords: header, overlay, transparent, navigation, classic
 * Block Types: core/template-part/header
 */

defined( 'ABSPATH' ) || exit;

return array(
	'title'      => __( 'Header Classic Overlay', 'designsetgo' ),
	'categories' => array( 'dsgo-header' ),
	'blockTypes' => array( 'core/template-part/header' ),
	'viewportWidth' => 1200,
	'content'    => '<!-- wp:designsetgo/section {"tagName":"header","constrainWidth":false,"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"},"blockGap":"0"}}} -->
<header class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-no-width-constraint" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-stack__inner"><!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}},"elements":{"link":{"color":{"text":"var:preset|color|base"}}}},"textColor":"base","metadata":{"categories":["dsgo-header"],"patternName":"designsetgo/header/header-classic-overlay","name":"Header Classic Overlay"}} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-base-color has-text-color has-link-color" style="padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--30)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/row {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"0","right":"0"},"blockGap":"var(\u002d\u002dwp\u002d\u002dpreset\u002d\u002dspacing\u002d\u002d30)"}},"layout":{"type":"flex","justifyContent":"space-between","verticalAlignment":"center","flexWrap":"nowrap"}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="padding-top:var(--wp--preset--spacing--30);padding-right:0;padding-bottom:var(--wp--preset--spacing--30);padding-left:0"><div class="dsgo-flex__inner" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:nowrap;gap:var(--wp--preset--spacing--30)"><!-- wp:site-logo /-->

<!-- wp:navigation {"overlayBackgroundColor":"contrast","overlayTextColor":"base","style":{"typography":{"fontStyle":"normal","fontWeight":"500"}},"layout":{"type":"flex","justifyContent":"right","flexWrap":"wrap"}} /--></div></div>
<!-- /wp:designsetgo/row --></div></div>
<!-- /wp:designsetgo/section --></div></header>
<!-- /wp:designsetgo/section -->',
);
```

**Step 2: Create header-dark-overlay.php**

Based on `header-dark.php`. Key changes: remove `backgroundColor: contrast`, add transparent base text, ghost-outline CTA.

```php
<?php
/**
 * Title: Header Dark Overlay
 * Slug: designsetgo/header/header-dark-overlay
 * Categories: dsgo-header
 * Description: A transparent overlay header with light text and ghost CTA button for dark hero backgrounds
 * Keywords: header, overlay, transparent, dark, cta, ghost
 * Block Types: core/template-part/header
 */

defined( 'ABSPATH' ) || exit;

return array(
	'title'      => __( 'Header Dark Overlay', 'designsetgo' ),
	'categories' => array( 'dsgo-header' ),
	'blockTypes' => array( 'core/template-part/header' ),
	'viewportWidth' => 1200,
	'content'    => '<!-- wp:designsetgo/section {"tagName":"header","constrainWidth":false,"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"},"blockGap":"0"}}} -->
<header class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-no-width-constraint" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-stack__inner"><!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}},"elements":{"link":{"color":{"text":"var:preset|color|base"}}}},"textColor":"base","metadata":{"categories":["dsgo-header"],"patternName":"designsetgo/header/header-dark-overlay","name":"Header Dark Overlay"}} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-base-color has-text-color has-link-color" style="padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--30)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/row {"style":{"spacing":{"padding":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","justifyContent":"space-between","verticalAlignment":"center","flexWrap":"nowrap"}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="padding-top:0;padding-bottom:0"><div class="dsgo-flex__inner" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:nowrap"><!-- wp:site-logo /-->

<!-- wp:designsetgo/row {"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"},"blockGap":"var(\u002d\u002dwp\u002d\u002dpreset\u002d\u002dspacing\u002d\u002d30)"}},"layout":{"type":"flex","justifyContent":"right","verticalAlignment":"center","flexWrap":"nowrap"}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-flex__inner" style="display:flex;justify-content:right;align-items:center;flex-wrap:nowrap;gap:var(--wp--preset--spacing--30)"><!-- wp:navigation {"overlayBackgroundColor":"contrast","overlayTextColor":"base","style":{"typography":{"fontStyle":"normal","fontWeight":"500"}},"layout":{"type":"flex","justifyContent":"right","flexWrap":"wrap"}} /-->

<!-- wp:designsetgo/icon-button {"text":"Get Started","url":"#","icon":"arrow-right","iconPosition":"end","backgroundColor":"transparent","textColor":"base","fontSize":"small","style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}},"border":{"width":"2px","color":"var:preset|color|base"}}} -->
<a class="wp-block-designsetgo-icon-button dsgo-icon-button wp-block-button wp-block-button__link wp-element-button has-border-color has-small-font-size" style="border-color:var(--wp--preset--color--base);border-width:2px;display:inline-flex;align-items:center;justify-content:center;gap:8px;width:auto;flex-direction:row-reverse;background-color:var(--wp--preset--color--transparent);color:var(--wp--preset--color--base);font-size:var(--wp--preset--font-size--small);padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--30)" href="#" target="_self"><span class="dsgo-icon-button__icon dsgo-lazy-icon" style="display:flex;align-items:center;justify-content:center;width:20px;height:20px;flex-shrink:0" data-icon-name="arrow-right" data-icon-size="20"></span><span class="dsgo-icon-button__text">Get Started</span></a>
<!-- /wp:designsetgo/icon-button --></div></div>
<!-- /wp:designsetgo/row --></div></div>
<!-- /wp:designsetgo/row --></div></div>
<!-- /wp:designsetgo/section --></div></header>
<!-- /wp:designsetgo/section -->',
);
```

**Step 3: Create header-cta-overlay.php**

Based on `header-cta.php`. Key changes: remove `backgroundColor: base`, add light text, ghost CTA button.

```php
<?php
/**
 * Title: Header CTA Overlay
 * Slug: designsetgo/header/header-cta-overlay
 * Categories: dsgo-header
 * Description: A transparent overlay header with navigation and a ghost-style CTA button
 * Keywords: header, overlay, transparent, cta, button, ghost
 * Block Types: core/template-part/header
 */

defined( 'ABSPATH' ) || exit;

return array(
	'title'      => __( 'Header CTA Overlay', 'designsetgo' ),
	'categories' => array( 'dsgo-header' ),
	'blockTypes' => array( 'core/template-part/header' ),
	'viewportWidth' => 1200,
	'content'    => '<!-- wp:designsetgo/section {"tagName":"header","constrainWidth":false,"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"},"blockGap":"0"}}} -->
<header class="wp-block-designsetgo-section alignfull dsgo-stack dsgo-no-width-constraint" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-stack__inner"><!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}},"elements":{"link":{"color":{"text":"var:preset|color|base"}}}},"textColor":"base","metadata":{"categories":["dsgo-header"],"patternName":"designsetgo/header/header-cta-overlay","name":"Header CTA Overlay"}} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack has-base-color has-text-color has-link-color" style="padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--30)"><div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto"><!-- wp:designsetgo/row {"style":{"spacing":{"padding":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","justifyContent":"space-between","verticalAlignment":"center","flexWrap":"nowrap"}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="padding-top:0;padding-bottom:0"><div class="dsgo-flex__inner" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:nowrap"><!-- wp:site-logo /-->

<!-- wp:designsetgo/row {"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"},"blockGap":"var(\u002d\u002dwp\u002d\u002dpreset\u002d\u002dspacing\u002d\u002d30)"}},"layout":{"type":"flex","justifyContent":"right","verticalAlignment":"center","flexWrap":"nowrap"}} -->
<div class="wp-block-designsetgo-row alignfull dsgo-flex dsgo-no-width-constraint" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div class="dsgo-flex__inner" style="display:flex;justify-content:right;align-items:center;flex-wrap:nowrap;gap:var(--wp--preset--spacing--30)"><!-- wp:navigation {"overlayBackgroundColor":"contrast","overlayTextColor":"base","style":{"typography":{"fontStyle":"normal","fontWeight":"500"}},"layout":{"type":"flex","justifyContent":"right","flexWrap":"wrap"}} /-->

<!-- wp:designsetgo/icon-button {"text":"Get a Quote","url":"#","icon":"arrow-right","iconPosition":"end","hoverBackgroundColor":"var:preset|color|base","hoverTextColor":"var:preset|color|contrast","backgroundColor":"transparent","textColor":"base","fontSize":"small","style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}},"border":{"width":"2px","color":"var:preset|color|base"}}} -->
<a class="wp-block-designsetgo-icon-button dsgo-icon-button wp-block-button wp-block-button__link wp-element-button has-border-color has-small-font-size" style="border-color:var(--wp--preset--color--base);border-width:2px;display:inline-flex;align-items:center;justify-content:center;gap:8px;width:auto;flex-direction:row-reverse;background-color:var(--wp--preset--color--transparent);color:var(--wp--preset--color--base);font-size:var(--wp--preset--font-size--small);padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--30);--dsgo-button-hover-bg:var(--wp--preset--color--base);--dsgo-button-hover-color:var(--wp--preset--color--contrast)" href="#" target="_self"><span class="dsgo-icon-button__icon dsgo-lazy-icon" style="display:flex;align-items:center;justify-content:center;width:20px;height:20px;flex-shrink:0" data-icon-name="arrow-right" data-icon-size="20"></span><span class="dsgo-icon-button__text">Get a Quote</span></a>
<!-- /wp:designsetgo/icon-button --></div></div>
<!-- /wp:designsetgo/row --></div></div>
<!-- /wp:designsetgo/row --></div></div>
<!-- /wp:designsetgo/section --></div></header>
<!-- /wp:designsetgo/section -->',
);
```

**Step 4: Commit**

```bash
git add patterns/header/header-classic-overlay.php patterns/header/header-dark-overlay.php patterns/header/header-cta-overlay.php
git commit -m "feat(overlay-header): add 3 overlay header pattern variants"
```

---

## Task 8: Update Hero Patterns with Overlay-Compatible Padding

**Files:**
- Modify: `patterns/hero/hero-agency-dark.php` (add top padding)
- Modify: `patterns/hero/hero-centered.php` (add top padding)
- Modify: `patterns/hero/hero-split.php` (add top padding)

**Step 1: Update hero patterns**

For each hero pattern that has a background color or image, increase the top padding from `var:preset|spacing|80` to include extra clearance for the overlay header. Change `padding-top` from `var(--wp--preset--spacing--80)` to `8rem` (or keep the preset but ensure there's enough room).

In each pattern file, find the outermost section's padding-top and change it:
- `hero-agency-dark.php`: Has `backgroundColor: contrast` — change `spacing|80` top padding to `calc(var(--wp--preset--spacing--80) + 5rem)` or simply use `12rem`
- `hero-centered.php`: Check if it has a background — if yes, update similarly
- `hero-split.php`: Check if it has a background — if yes, update similarly

**Note to implementer:** Read each hero pattern first to determine current padding. Only modify heroes that have background colors or images. The goal is that hero content doesn't hide behind the overlaid header (~80-120px clearance at the top). Avoid breaking non-overlay layouts — the extra padding should look reasonable even without an overlay header.

**Step 2: Commit**

```bash
git add patterns/hero/
git commit -m "feat(overlay-header): add extra top padding to overlay-compatible hero patterns"
```

---

## Task 9: Build, Lint, and Verify

**Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 2: Run linters**

Run: `npm run lint:js`
Expected: No errors

Run: `npm run lint:css`
Expected: No errors

Run: `npm run lint:php`
Expected: No errors

**Step 3: Verify built assets**

Run: `ls -la build/overlay-header.js build/overlay-header.asset.php`
Expected: Both files exist

Run: `grep -c "dsgo-page-overlay-header" build/style-index.css`
Expected: Multiple matches

Run: `grep -c "isOverlayPage" build/utils/sticky-header.js`
Expected: At least 1 match

**Step 4: Final commit if any lint fixes were needed**

```bash
git add -A
git commit -m "fix: address lint issues from overlay header implementation"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | PHP class for post meta + body class | `includes/class-overlay-header.php` (new) |
| 2 | Wire class into plugin | `includes/class-plugin.php` (modify) |
| 3 | Editor sidebar panel JS | `src/overlay-header/index.js` (new) |
| 4 | Webpack entry + PHP enqueue | `webpack.config.js`, `includes/class-plugin.php` (modify) |
| 5 | CSS overlay positioning | `src/styles/utilities/_sticky-header.scss` (modify) |
| 6 | Sticky header JS overlay awareness | `src/utils/sticky-header.js` (modify) |
| 7 | 3 overlay header patterns | `patterns/header/` (3 new) |
| 8 | Hero pattern padding updates | `patterns/hero/` (modify) |
| 9 | Build, lint, verify | — |
