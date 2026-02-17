# Markup Conventions

How block markup works in DesignSetGo patterns. All markup goes in the `'content'` key as a single-line string.

## Block Comment Syntax

Every block is wrapped in paired HTML comments:

```
<!-- wp:namespace/block-name {"attr1":"value","attr2":123} -->
<div class="...">content</div>
<!-- /wp:namespace/block-name -->
```

- Attributes are JSON (double-quoted keys and string values)
- Self-closing blocks omit the closing comment and HTML element
- Nested blocks go inside the parent's HTML element

## Attribute Format: Preset vs Inline

WordPress uses two different formats for the same values:

**In JSON attributes** (inside `<!-- wp:... {here} -->`):
```
"style":{"spacing":{"padding":{"top":"var:preset|spacing|50"}}}
"backgroundColor":"contrast"
"textColor":"base"
"fontSize":"large"
```

**In HTML** (inside `style="..."` on elements):
```
padding-top:var(--wp--preset--spacing--50)
background-color:var(--wp--preset--color--contrast)
font-size:var(--wp--preset--font-size--large)
```

Note: `backgroundColor` and `textColor` generate CSS classes, not inline styles:
- `"backgroundColor":"contrast"` → `class="has-contrast-background-color has-background"`
- `"textColor":"base"` → `class="has-base-color has-text-color"`

## Available Preset Values

### Spacing (10-80)
Used for padding, margin, gap, and blockGap.

| Value | Usage |
|-------|-------|
| 10 | Tight (between related items) |
| 15 | Compact |
| 20 | Small (between heading and paragraph) |
| 25 | Small-medium |
| 30 | Medium (standard gap, button groups) |
| 40 | Large (between content blocks) |
| 50 | Section internal padding |
| 60 | Between major subsections |
| 70 | Section top/bottom padding |
| 80 | Large section padding (heroes, CTAs) |

**Common patterns:**
- Section padding: `top:80, bottom:80, left:30, right:30`
- Inner section (zero padding): `top:0, bottom:0, left:0, right:0`
- Heading-to-paragraph gap: `margin-top: spacing|20`
- Grid/card gap: `blockGap: spacing|30`

### Colors

**Named presets** (use in `backgroundColor`/`textColor` attributes):

| Name | Usage |
|------|-------|
| `base` | Primary background (usually white/light) |
| `base-2` | Secondary background (slightly different shade) |
| `contrast` | Primary text / dark sections |
| `contrast-2` | Muted text |
| `contrast-3` | Borders, subtle elements |
| `accent-3` | Brand accent color |
| `accent-5` | Secondary accent |
| `accent-6` | Tertiary accent |
| `transparent` | No background |

**Typical section color alternation:**
1. Hero: `contrast` bg + `base` text (dark)
2. Features: no bg or `base-2` (light)
3. Testimonials: `base-2` bg (light alternate)
4. CTA: `contrast` bg + `base` text (dark)

### Gradients

**In JSON attributes:**

```
"style":{"color":{"gradient":"linear-gradient(135deg,rgb(99,102,241) 0%,rgb(168,85,247) 50%,rgb(236,72,153) 100%)"}}
```

**In HTML** — renders as inline `background`:

```
style="background:linear-gradient(135deg,rgb(99,102,241) 0%,rgb(168,85,247) 50%,rgb(236,72,153) 100%)"
```

Gradients add `has-background` class but NOT a named background class.

**Using preset colors in gradients:**

```
"style":{"color":{"gradient":"linear-gradient(135deg,var(--wp--preset--color--accent-3) 0%,var(--wp--preset--color--contrast) 100%)"}}
```

**Named WordPress gradient preset** (if available in theme):

```
"gradient":"vivid-cyan-blue-to-vivid-purple"
```

**Common gradient angles:** `135deg` (diagonal) is the most common in existing patterns.

You can combine `"textColor":"base"` with a gradient for text on gradient background.

### Font Sizes

| Preset | Common Use |
|--------|-----------|
| `small` | Labels, captions, subtitles, eyebrow text |
| `medium` | Body text, descriptions |
| `large` | Subheadings, quotes, emphasis |
| `x-large` | Section headings (h2) |
| `xx-large` | Hero headings (h1), large prices |

### Border Radius

Common values used across patterns:
- `0` — Sharp/geometric (agency/professional styles)
- `4px` — Subtle rounding (buttons)
- `8px` — Standard rounding (cards, inputs)
- `12px` — Medium rounding (feature cards)
- `16px` — Prominent rounding (pricing cards)
- `50%` — Circular (avatars)

## Pattern Root Block

Every pattern starts with `designsetgo/section` as the outermost block. Include `metadata` for the pattern editor:

```
<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}},"backgroundColor":"base-2","metadata":{"categories":["dsgo-hero"],"patternName":"designsetgo/hero/hero-example","name":"Hero Example"}} -->
```

The `metadata` object must include:
- `categories` — array matching the pattern's `dsgo-{category}` slug
- `patternName` — the full pattern slug: `designsetgo/{category}/{name}`
- `name` — human-readable pattern title

## Section HTML Structure

The `designsetgo/section` block produces a two-div structure:

```html
<div class="wp-block-designsetgo-section alignfull dsgo-stack {color-classes}" style="{padding}">
  <div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto">
    <!-- inner blocks here -->
  </div>
</div>
```

**Zero-padding inner sections** (used as wrappers inside grids):
```
<!-- wp:designsetgo/section {"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0">
  <div class="dsgo-stack__inner" style="max-width:var(--wp--style--global--content-size, 1140px);margin-left:auto;margin-right:auto">
    ...
  </div>
</div>
<!-- /wp:designsetgo/section -->
```

## Common Layout Patterns

### Eyebrow + Heading + Paragraph (Section Header)
```
<!-- wp:paragraph {"style":{"typography":{"textTransform":"uppercase","letterSpacing":"3px"}},"fontSize":"small"} -->
<p class="has-small-font-size" style="letter-spacing:3px;text-transform:uppercase">Section Label</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"style":{"typography":{"fontStyle":"normal","fontWeight":"700"},"spacing":{"margin":{"top":"var:preset|spacing|20"}}},"fontSize":"x-large"} -->
<h2 class="wp-block-heading has-x-large-font-size" style="margin-top:var(--wp--preset--spacing--20);font-style:normal;font-weight:700">Heading Text</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20"}}},"fontSize":"medium"} -->
<p class="has-medium-font-size" style="margin-top:var(--wp--preset--spacing--20)">Description text goes here.</p>
<!-- /wp:paragraph -->
```

### Centered Section Header
Same as above but with `"textAlign":"center"` on heading and `"align":"center"` on paragraph.

### Button Group (Row with Icon Buttons)

```
<!-- wp:designsetgo/row {"style":{"spacing":{"margin":{"top":"var:preset|spacing|40"},"blockGap":"var:preset|spacing|30","padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"layout":{"type":"flex","flexWrap":"wrap"}} -->
  <!-- wp:designsetgo/icon-button {"text":"Primary CTA","url":"#","icon":"arrow-right","iconPosition":"end","backgroundColor":"contrast","textColor":"base","style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"4px"}}} -->
  ...
  <!-- /wp:designsetgo/icon-button -->
  <!-- wp:designsetgo/icon-button {"text":"Secondary CTA","url":"#","icon":"","iconPosition":"none","backgroundColor":"transparent","textColor":"contrast","style":{"border":{"width":"2px","radius":"4px"}}} -->
  ...
  <!-- /wp:designsetgo/icon-button -->
<!-- /wp:designsetgo/row -->
```

**Centered button group** — add `"justifyContent":"center"` to `layout`:

```
"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"center"}
```

**Icon button notes:**

- When `"iconPosition":"none"`, omit the `<span class="dsgo-icon-button__icon ...">` element entirely AND use `gap:0` instead of `gap:8px` in the inline style
- On dark backgrounds, set border color explicitly for outlined buttons: `"border":{"width":"2px","color":"var:preset|color|base","radius":"4px"}` (use preset reference syntax, NOT CSS variable syntax)
- When border width/color is set, add `has-border-color` to the element's class list
- In the inline style, `border-color` must come BEFORE `border-width` (e.g., `border-color:var(--wp--preset--color--base);border-width:2px`)
- When `iconPosition` is `"end"`, the HTML uses `flex-direction:row-reverse` — the icon span comes first in markup but displays after text

### 3-Column Feature Grid
```
<!-- wp:designsetgo/grid {"style":{"spacing":{"blockGap":"var:preset|spacing|30","padding":{"top":"0","bottom":"0","left":"0","right":"0"}}}} -->
  <!-- wp:designsetgo/card {...} -->...<!-- /wp:designsetgo/card -->
  <!-- wp:designsetgo/card {...} -->...<!-- /wp:designsetgo/card -->
  <!-- wp:designsetgo/card {...} -->...<!-- /wp:designsetgo/card -->
<!-- /wp:designsetgo/grid -->
```

### Icon + Text Row (Contact Info)
```
<!-- wp:designsetgo/row {"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
  <!-- wp:designsetgo/icon {"icon":"envelope"} -->...<!-- /wp:designsetgo/icon -->
  <!-- wp:paragraph {"fontSize":"medium"} --><p class="has-medium-font-size">info@example.com</p><!-- /wp:paragraph -->
<!-- /wp:designsetgo/row -->
```

## Escaping in Content Strings

Since content is a PHP single-quoted string:
- Escape single quotes: `\'`
- Use `\u002d\u002d` for `--` in CSS class modifiers (e.g., `dsgo-counter\u002d\u002dalign-center`)
- HTML entities work normally: `&amp;`, `&lt;`
- No need to escape double quotes (they're used freely in block markup)

## Images in Patterns

Use placeholder images from Unsplash with specific dimensions:
```
https://images.unsplash.com/photo-{id}?w={width}&h={height}&fit=crop
```

Or generic avatar placeholders:
```
https://i.pravatar.cc/{size}?img={number}
```

Always include meaningful `alt` text on images.
