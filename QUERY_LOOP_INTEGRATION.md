# Query Loop Integration for DesignSetGo Blocks

## Executive Summary

This document analyzes all 51 DesignSetGo blocks for opportunities to integrate WordPress Query Loop functionality, enabling blocks to display dynamic post content (blog posts, custom post types, WooCommerce products, etc.) rather than only static, manually-authored content.

Currently, 50 of 51 blocks are **static** (client-rendered via `save.js`). Only the Breadcrumbs block uses server-side rendering (`render.php`). To integrate query loops, candidate blocks need to be converted to **dynamic blocks** with server-side rendering that can iterate over `WP_Query` results and output child markup programmatically.

---

## Architecture: How WordPress Query Loop Works

The core Query Loop is a two-block system:

```
core/query                    (holds query parameters, provides context)
  core/post-template          (consumes context, loops over posts)
    core/post-title           (consumes postId/postType context)
    core/post-featured-image
    core/post-excerpt
    core/post-date
  core/query-pagination
  core/query-no-results
```

**Key mechanisms:**
- `providesContext` / `usesContext` pass query parameters and per-post data down the tree
- `render_block_context` filter injects `postId` and `postType` per iteration on the server
- `build_query_vars_from_query_block()` translates block attributes into `WP_Query` args
- `query_loop_block_query_vars` filter allows custom query modifications
- `skip_inner_blocks => true` in registration lets the block manually render its children per-post

---

## Integration Strategy Options

### Option A: Block Variations of `core/query` (Recommended for Layout Blocks)

Register variations of `core/query` that preset inner block templates using our blocks. This is the **lowest-effort, highest-compatibility** approach.

**Example: "Post Slider" variation**
```js
registerBlockVariation('core/query', {
  name: 'designsetgo/post-slider',
  title: 'Post Slider',
  scope: ['inserter'],
  attributes: {
    namespace: 'designsetgo/post-slider',
    query: { perPage: 6, postType: 'post', inherit: false },
  },
  innerBlocks: [
    ['core/post-template', { layout: { type: 'flex' } }, [
      ['core/post-featured-image'],
      ['core/post-title', { isLink: true }],
    ]],
    ['core/query-pagination'],
  ],
});
```

**Pros:** Uses WordPress's built-in query system, no server-side rendering needed for the query itself, automatic pagination support, editor preview works out of the box.

**Cons:** The inner template is limited to core post blocks unless we also create custom context-consuming blocks. The outer layout (slider, grid, etc.) must somehow wrap the `core/post-template` output.

### Option B: Dynamic Block Variants with `render.php` (Recommended for Complex Blocks)

Create new dynamic block variants (e.g., `designsetgo/query-slider`) that:
1. Accept query attributes (postType, perPage, orderBy, taxQuery, etc.)
2. Run `WP_Query` in `render.php`
3. Output the parent block's HTML structure with child items generated per-post

**Pros:** Full control over markup, can perfectly match existing block output, maintains all existing CSS/JS behavior.

**Cons:** More implementation work, need editor preview via REST API, duplicates some rendering logic.

### Option C: Hybrid Approach (Recommended Overall)

Combine both:
- **Option A** for simple layouts where core post blocks suffice
- **Option B** for blocks with complex markup requirements (Slider, Card, Image Accordion)

---

## Block-by-Block Analysis

### Tier 1: Highest Value / Strongest Fit

These blocks are the best candidates for query loop integration because they display **repeating content items** that map naturally to post data.

#### 1. Slider / Slide

**Current state:** Static inner blocks. Only `designsetgo/slide` children allowed. Swiper-based carousel with arrows, dots, autoplay, multiple effects. `view.js` reads configuration from `data-*` attributes.

**Integration opportunity:** A "Query Slider" that automatically creates slides from posts. Each slide would show the post's featured image as background, title as heading, excerpt as body text, and a "Read More" link.

**Implementation approach:** Option B (Dynamic block variant)
- Create `designsetgo/query-slider` with the same slider attributes PLUS query attributes
- `render.php` runs `WP_Query`, loops through posts, outputs `dsgo-slide` markup per post
- The same `view.js` and CSS work unchanged because the HTML structure and `data-*` attributes are identical
- Editor side: show a preview by fetching posts via REST API and rendering a static preview

**Query attributes to add:**
```json
{
  "queryEnabled": { "type": "boolean", "default": false },
  "postType": { "type": "string", "default": "post" },
  "postsPerPage": { "type": "number", "default": 6 },
  "orderBy": { "type": "string", "default": "date" },
  "order": { "type": "string", "default": "desc" },
  "taxQuery": { "type": "object", "default": {} },
  "slideTemplate": { "type": "string", "default": "featured-image-overlay" }
}
```

**Slide templates:**
- `featured-image-overlay`: Featured image as background + title + excerpt overlay
- `featured-image-card`: Featured image top + title + excerpt + read more button
- `minimal`: Title + date + excerpt on a solid/gradient background

**Complexity:** Medium-High
**Impact:** Very High — blog post sliders and portfolio carousels are extremely common use cases

---

#### 2. Grid + Card (Composite)

**Current state:** Grid is a pure CSS Grid layout container accepting any inner blocks. Card stores all content (title, image, body, badge, CTA) as static attributes with RichText editing.

**Integration opportunity:** A "Post Grid" where each grid cell is a Card automatically populated from a post's title, featured image, excerpt, categories, and permalink.

**Implementation approach:** Option B (Dynamic block variant)
- Create `designsetgo/query-grid` that combines Grid layout with query functionality
- `render.php` runs `WP_Query`, outputs Grid wrapper markup, then Card markup per post
- Map: `post_title` → Card title, `featured_image` → Card image, `excerpt` → Card body, primary category → Card badge, `permalink` → CTA link
- Card layout presets (standard, horizontal, background, minimal, featured) all work since they're CSS-driven

**Alternative approach:** Create a `designsetgo/query-card` that uses `usesContext: ['postId', 'postType']` and can be placed inside `core/post-template`. The Card would fetch its data from the current post context instead of static attributes. This is more composable but requires the Card to support dual modes (static attributes vs. dynamic post data).

**Complexity:** Medium-High
**Impact:** Very High — post grids/card layouts are the #1 use case for query loops

---

#### 3. Timeline / Timeline-Item

**Current state:** Vertical/horizontal timeline with alternating layout, scroll animations, marker styles. Only `designsetgo/timeline-item` children allowed.

**Integration opportunity:** A "Post Timeline" showing blog posts chronologically — the post date as the timeline marker date, post title as the timeline item title, and excerpt as content. Perfect for "company news" or "blog history" sections.

**Implementation approach:** Option B (Dynamic block variant)
- Create `designsetgo/query-timeline` with timeline styling attributes + query attributes
- `render.php` loops posts, outputs timeline-item markup with `post_date` formatted as the date label
- Scroll animation via the same `view.js` and `data-*` attributes

**Complexity:** Medium
**Impact:** Medium-High — compelling for news sites, company histories, changelogs

---

#### 4. Accordion / Accordion-Item

**Current state:** Expandable sections with icon styles, borders, hover effects. Only `designsetgo/accordion-item` allowed.

**Integration opportunity:** A "Post FAQ / Post Accordion" where each accordion item is a post. Title becomes the accordion header, content/excerpt becomes the body. Excellent for FAQ post types or knowledge base content.

**Implementation approach:** Option B (Dynamic block variant)
- Create `designsetgo/query-accordion` with accordion styling + query attributes
- `render.php` loops posts, outputs accordion-item markup
- The same `view.js` handles expand/collapse behavior

**Complexity:** Medium
**Impact:** Medium-High — FAQ sections pulling from a CPT is a very common pattern

---

#### 5. Scroll Marquee (Scrolling Gallery)

**Current state:** Attribute-only block storing an array of image rows. No InnerBlocks. Images duplicated 6x for infinite scroll effect. `view.js` handles scroll-based animation.

**Integration opportunity:** A "Post Marquee" or "Logo Marquee" that pulls featured images (or a custom image field) from posts/CPTs and scrolls them. Use cases: client logos, portfolio thumbnails, product images.

**Implementation approach:** Option B (Dynamic block variant)
- Create `designsetgo/query-scroll-marquee` with marquee styling + query attributes
- `render.php` runs query, collects featured image URLs, outputs the same marquee row/track/image HTML (with 6x repetition for seamless looping)
- Identical `view.js` behavior

**Complexity:** Low-Medium
**Impact:** Medium — logo marquees and portfolio scrollers are popular

---

### Tier 2: Good Fit / Moderate Value

#### 6. Image Accordion / Image Accordion-Item

**Current state:** Expandable image panels with overlays. Each item has a background image + inner block content.

**Integration opportunity:** A "Post Image Accordion" where each panel is a post, with the featured image as the panel background and post title/excerpt as overlay content. Excellent for portfolio showcases or featured articles.

**Implementation approach:** Option B
- `render.php` loops posts, outputs image-accordion-item markup with featured image as background
- Same `view.js` handles expansion behavior

**Complexity:** Medium
**Impact:** Medium — visually striking for portfolio/showcase sections

---

#### 7. Tabs / Tab

**Current state:** Tabbed content with styles, deep linking, mobile accordion mode. Tab navigation built from inner block attributes.

**Integration opportunity:** A "Category Tabs" or "Post Type Tabs" where each tab represents a category (or taxonomy term) and its content shows posts from that category. This requires a more complex query — one query per tab/term.

**Implementation approach:** Option B (more complex)
- Create `designsetgo/query-tabs` where tabs are generated from taxonomy terms
- Each tab panel runs its own sub-query for that term's posts
- Or: each tab panel contains a nested `core/query` variation

**Complexity:** High
**Impact:** Medium — useful but complex; the multi-query pattern is harder to get right

---

#### 8. Flip Card / Flip Card Front / Flip Card Back

**Current state:** 3D card flip with hover/click triggers. Front and back sides each accept any inner blocks.

**Integration opportunity:** A "Post Flip Card" — front side shows featured image + title, back side shows excerpt + "Read More" button. Placed inside a Grid + Query Loop.

**Implementation approach:** Create a `designsetgo/query-flip-card` that uses `usesContext: ['postId', 'postType']` and can be placed inside `core/post-template`. It would auto-populate front (image + title) and back (excerpt + CTA) from the current post.

**Complexity:** Medium
**Impact:** Medium — engaging interactive way to display posts

---

#### 9. Counter Group / Counter

**Current state:** Animated number counters with prefix/suffix.

**Integration opportunity:** "Dynamic Counters" that pull numeric values from post meta fields or aggregated data (e.g., total post count, total comments, etc.). More of a data-binding use case than a traditional query loop.

**Implementation approach:** Create a dynamic `designsetgo/dynamic-counter` that reads from post meta or runs a count query server-side.

**Complexity:** Low-Medium
**Impact:** Low-Medium — niche but useful for dashboards/stats sections

---

### Tier 3: Lower Priority / Limited Fit

#### 10. Comparison Table

**Current state:** Attribute-only table with columns, rows, and cells. All content stored in attribute arrays.

**Integration opportunity:** A "Post Comparison Table" where columns or rows are populated from posts (e.g., products to compare). Each column represents a product post, with rows showing meta field values.

**Implementation approach:** Option B — `render.php` runs a query, builds columns from posts and rows from meta keys.

**Complexity:** High
**Impact:** Low-Medium — very specific use case

---

#### 11. Divider / Icon / Icon Button / Icon List / Pill / Breadcrumbs

**No integration opportunity.** These are atomic UI elements, not content containers. They don't display repeating content.

---

#### 12. Form blocks (Form Builder, fields)

**No integration opportunity.** Forms are input mechanisms, not content display blocks.

---

#### 13. Modal / Map / Countdown Timer / Progress Bar / Blobs

**No integration opportunity.** These serve specific UI functions unrelated to post content display.

---

## Recommended Implementation Plan

### Phase 1: Foundation (Shared Query Infrastructure)

Before building individual blocks, create shared infrastructure:

1. **Query Attributes Schema** — A shared `block-query-attributes.json` defining the standard query attributes (postType, postsPerPage, orderBy, order, taxQuery, offset, exclude, sticky) reused across all query blocks.

2. **Query Inspector Controls Component** — A shared React component (`QueryControls`) providing the sidebar UI for configuring queries: post type selector, taxonomy term picker, order/orderBy controls, posts per page, offset, etc. This mirrors what `core/query` provides but scoped to our blocks.

3. **PHP Query Helper** — A shared `build_query_args_from_block($block)` function in PHP that translates our query attributes into `WP_Query` arguments, similar to WordPress core's `build_query_vars_from_query_block()`.

4. **Editor Preview Component** — A shared React hook (`useQueryPreview`) that fetches posts via the REST API based on the current query attributes, providing post data for editor-side previews.

5. **Template System** — Define "content templates" that map post data to block markup. Templates like `featured-image-overlay`, `card-standard`, `card-minimal` can be reused across slider slides, grid cards, etc.

### Phase 2: High-Impact Blocks

Build query variants for the highest-value blocks:

1. **`designsetgo/query-slider`** — Query-powered slider
   - Adds query panel to sidebar
   - Renders slides from posts server-side
   - Slide template selection (overlay, card, minimal)
   - Reuses existing Swiper `view.js`

2. **`designsetgo/query-grid`** — Query-powered grid with cards
   - Adds query panel to sidebar
   - Renders Card markup per post server-side
   - Card layout preset selection
   - Maps post data to card fields
   - Pagination support (load more / numbered)

3. **`designsetgo/query-card`** — Context-aware card for use inside `core/post-template`
   - Adds `usesContext: ['postId', 'postType']` to Card
   - When inside a query loop, auto-populates from post data
   - When standalone, uses static attributes (backward compatible)

### Phase 3: Additional Blocks

4. **`designsetgo/query-timeline`** — Post timeline
5. **`designsetgo/query-accordion`** — Post/FAQ accordion
6. **`designsetgo/query-scroll-marquee`** — Image marquee from post images

### Phase 4: Advanced Integrations

7. **`designsetgo/query-image-accordion`** — Post image accordion
8. **`designsetgo/query-tabs`** — Taxonomy-based tabs with per-tab queries
9. **`designsetgo/query-flip-card`** — Context-aware flip card
10. **`core/query` block variations** — Pre-built query variations using our blocks

---

## Technical Architecture for a Query Block

Taking the **Query Slider** as a reference implementation:

### File Structure

```
src/blocks/query-slider/
├── block.json              # Extends slider attributes + query attributes
├── index.js                # Block registration
├── edit.js                 # Editor: QueryControls + Slider preview
├── render.php              # Server-side: WP_Query + slide markup
├── style.scss              # Inherits from slider styles
├── editor.scss             # Editor-specific styles
└── templates/              # Slide content templates
    ├── featured-image-overlay.php
    ├── card.php
    └── minimal.php

src/shared/
├── query-attributes.json           # Shared query attribute definitions
├── components/
│   ├── QueryControls.js            # Sidebar query configuration UI
│   └── QueryPreview.js             # Editor preview component
└── php/
    ├── query-helpers.php            # build_query_args_from_block()
    └── template-renderer.php        # Render post data into templates
```

### block.json (Query Slider)

```json
{
  "name": "designsetgo/query-slider",
  "title": "Post Slider",
  "description": "A dynamic slider that displays posts, pages, or custom post types.",
  "category": "design",
  "keywords": ["slider", "carousel", "posts", "query", "dynamic"],
  "attributes": {
    // ... all existing slider attributes ...
    "query": {
      "type": "object",
      "default": {
        "postType": "post",
        "postsPerPage": 6,
        "orderBy": "date",
        "order": "desc",
        "taxQuery": {},
        "offset": 0,
        "exclude": [],
        "sticky": ""
      }
    },
    "slideTemplate": {
      "type": "string",
      "default": "featured-image-overlay",
      "enum": ["featured-image-overlay", "card", "minimal", "custom"]
    },
    "showTitle": { "type": "boolean", "default": true },
    "showExcerpt": { "type": "boolean", "default": true },
    "showDate": { "type": "boolean", "default": false },
    "showCategory": { "type": "boolean", "default": true },
    "showReadMore": { "type": "boolean", "default": true },
    "readMoreText": { "type": "string", "default": "Read More" },
    "titleTag": { "type": "string", "default": "h3" },
    "excerptLength": { "type": "number", "default": 20 }
  },
  "supports": {
    // ... same as slider supports ...
  },
  "render": "file:./render.php",
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css",
  "viewScript": ["file:./view.js"]
}
```

### render.php (Server-Side Rendering)

```php
<?php
/**
 * Server-side rendering for the Query Slider block.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content (unused for dynamic blocks).
 * @param WP_Block $block      Block instance.
 */

$query_args = designsetgo_build_query_args( $attributes['query'] ?? [] );
$query      = new WP_Query( $query_args );

if ( ! $query->have_posts() ) {
    return '<div ' . get_block_wrapper_attributes() . '><p>' .
           esc_html__( 'No posts found.', 'designsetgo' ) . '</p></div>';
}

// Build the same data-* attributes and CSS variables as save.js
$slider_attrs = designsetgo_get_slider_data_attributes( $attributes );
$slider_styles = designsetgo_get_slider_css_variables( $attributes );

$slides_html = '';
while ( $query->have_posts() ) {
    $query->the_post();
    $slides_html .= designsetgo_render_slide_template(
        $attributes['slideTemplate'],
        $attributes
    );
}
wp_reset_postdata();

printf(
    '<div %s><div class="dsgo-slider__viewport"><div class="dsgo-slider__track">%s</div></div></div>',
    get_block_wrapper_attributes( array_merge(
        [ 'class' => $slider_classes ],
        $slider_attrs,
        [ 'style' => $slider_styles ]
    ) ),
    $slides_html
);
```

### Editor Preview (edit.js concept)

```jsx
function QuerySliderEdit({ attributes, setAttributes }) {
  const { query, slideTemplate, ...sliderAttrs } = attributes;

  // Fetch posts for preview
  const posts = useQueryPreview(query);

  return (
    <>
      <InspectorControls>
        <QueryControls query={query} onChange={(q) => setAttributes({ query: q })} />
        <PanelBody title="Slide Template">
          <SelectControl value={slideTemplate} options={...} onChange={...} />
          {/* Content toggle controls: showTitle, showExcerpt, etc. */}
        </PanelBody>
        {/* Existing slider controls: arrows, dots, autoplay, effects */}
      </InspectorControls>

      <div className="dsgo-slider">
        <div className="dsgo-slider__viewport">
          <div className="dsgo-slider__track">
            {posts.map((post) => (
              <SlidePreview key={post.id} post={post} template={slideTemplate} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
```

---

## Compatibility Considerations

1. **Block Validation:** Dynamic blocks bypass save validation since they use `render.php`. The `save()` function should return `null` for dynamic blocks.

2. **Frontend JS:** The existing `view.js` scripts (Swiper for slider, expand/collapse for accordion, etc.) work unchanged as long as the server-rendered HTML matches the expected DOM structure and `data-*` attributes.

3. **CSS:** All styling is driven by CSS custom properties (`--dsgo-*`) set on wrapper elements. Server-rendered markup sets these identically to `save.js`.

4. **Backward Compatibility:** Original static blocks remain fully functional. Query variants are **new blocks**, not modifications to existing blocks.

5. **WordPress Version:** Query-related filters (`query_loop_block_query_vars`) require WP 6.1+. DesignSetGo already requires WP 6.7+, so this is not a constraint.

6. **Custom Post Types:** The query controls should support any public post type, including WooCommerce products, portfolio CPTs, testimonials, etc.

---

## Priority Matrix

| Block              | Impact | Complexity | Priority |
|--------------------|--------|------------|----------|
| Query Slider       | Very High | Medium-High | 1 |
| Query Grid + Card  | Very High | Medium-High | 2 |
| Query Card (context-aware) | High | Medium | 3 |
| Query Timeline     | Medium-High | Medium | 4 |
| Query Accordion    | Medium-High | Medium | 5 |
| Query Scroll Marquee | Medium | Low-Medium | 6 |
| Query Image Accordion | Medium | Medium | 7 |
| Query Tabs         | Medium | High | 8 |
| Query Flip Card    | Medium | Medium | 9 |
| core/query Variations | Medium | Low | 10 |
