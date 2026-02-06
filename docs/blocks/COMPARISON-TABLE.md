# Comparison Table Block - User Guide

**Version**: 1.0.0
**Category**: Widgets
**Keywords**: comparison, table, pricing, features, plans

## Overview

The **Comparison Table Block** displays a feature comparison table for products, services, or plans. It supports inline editing of column headers, row labels, and cell content with multiple cell types (text, check, cross) and full column/row management.

**Key Features:**
- Dynamic columns and rows with inline editing
- Three cell types: text, check icon, and cross icon
- Featured column highlighting with "Popular" badge
- Optional CTA buttons per column (filled or outlined styles)
- Alternating row colors for improved readability
- Row tooltips for additional context
- Two responsive modes (horizontal scroll or stack on mobile)
- Full WordPress Block Supports (color, typography, spacing, border)

## Quick Start

1. Insert the **Comparison Table** block into your page.
2. Edit column headers directly in the table (default: Basic, Pro, Enterprise).
3. Edit row labels and cell values inline.
4. Click a cell to toggle its type between text, check, or cross.
5. Configure responsive mode, CTA buttons, and colors in the sidebar settings.

## Settings & Configuration

### Table Settings

| Setting | Options | Default | Description |
|---|---|---|---|
| `alternatingRows` | `true` / `false` | `true` | Apply alternating background colors to rows |
| `responsiveMode` | `"scroll"` / `"stack"` | `"scroll"` | How the table adapts on small screens |
| `showCtaButtons` | `true` / `false` | `true` | Display call-to-action buttons in the header |
| `ctaStyle` | `"filled"` / `"outlined"` | `"filled"` | Visual style of CTA buttons |

### Color Settings

| Setting | Type | Default | Description |
|---|---|---|---|
| `headerBackgroundColor` | `string` | `""` | Background color for the table header row |
| `headerTextColor` | `string` | `""` | Text color for the table header row |
| `featuredColumnColor` | `string` | `""` | Highlight color for featured columns |

These color settings are available in the **Color** panel within the block sidebar inspector controls.

### Columns

Each column is an object in the `columns` array with the following properties:

| Property | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | Varies | Display name shown in the column header |
| `link` | `string` | `""` | URL for the CTA button |
| `linkText` | `string` | `"Get Started"` | Label text for the CTA button |
| `featured` | `boolean` | `false` | Whether the column is highlighted as featured |

**Default columns:**

| Column | Name | Featured |
|---|---|---|
| 1 | Basic | No |
| 2 | Pro | Yes |
| 3 | Enterprise | No |

- Minimum columns: **2**
- Maximum columns: **6**

Columns can be added or removed from the **Columns** panel in the sidebar. Setting a column as "featured" applies the featured highlight color and shows a "Popular" badge above the column name.

### Rows

Each row is an object in the `rows` array with the following properties:

| Property | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | Varies | Feature name displayed in the first column |
| `tooltip` | `string` | `""` | Optional tooltip text shown on hover |
| `cells` | `array` | `[]` | Array of cell objects, one per column |

Each cell object within `cells` has:

| Property | Type | Values | Description |
|---|---|---|---|
| `type` | `string` | `"text"`, `"check"`, `"cross"` | Determines how the cell renders |
| `value` | `string` | Any text | Text content (used when type is `"text"`) |

**Default rows:**

| Row | Label | Tooltip |
|---|---|---|
| 1 | Storage | -- |
| 2 | Users | -- |
| 3 | Priority Support | "Get faster response times from our team" |
| 4 | API Access | -- |

- Minimum rows: **1**
- No maximum row limit. New rows can be added using the "Add Feature Row" button below the table.
- Rows can be reordered using the up/down arrow controls on each row.
- Row tooltips are configured in the **Row Tooltips** panel in the sidebar.

### Cell Types

Click any cell in the editor to reveal the type toggle toolbar:

- **Text** (`"text"`): Freeform text content with bold and italic formatting support
- **Check** (`"check"`): Displays a green checkmark icon indicating availability
- **Cross** (`"cross"`): Displays a red cross icon indicating unavailability

## Block Supports

The Comparison Table block supports the following WordPress block features:

| Support | Options | Default Controls |
|---|---|---|
| **Anchor** | Custom HTML anchor | -- |
| **Align** | `wide`, `full` | -- |
| **Spacing** | Margin, Padding | Padding enabled |
| **Color** | Background, Text | Both enabled |
| **Typography** | Font Size, Line Height | Font Size enabled |
| **Border** | Color, Radius, Style, Width | Color and Radius enabled |

Direct HTML editing is disabled (`"html": false`).

## Common Use Cases

### 1. Pricing Plans
Use the default three-column setup. Set the middle column (Pro) as featured. Add rows for each feature with check/cross cells to indicate availability. Enable CTA buttons with links to signup pages.

### 2. Product Comparison
Add columns for each product. Use text cells for specifications (e.g., "5 GB", "Unlimited") and check/cross cells for boolean features. Add tooltips to explain technical terms.

### 3. Service Tiers
Configure columns for each service level. Use alternating rows for readability. Customize header colors to match your brand.

## Responsive Behavior

The block provides two responsive modes controlled by the `responsiveMode` attribute:

### Horizontal Scroll (`"scroll"`) - Default
The table maintains its full layout on all screen sizes. On smaller viewports, the table becomes horizontally scrollable within its container. This preserves the column alignment and is best for tables with many columns.

CSS class applied: `dsgo-comparison-table--responsive-scroll`

### Stack on Mobile (`"stack"`)
On smaller viewports, the table reflows into a stacked layout where each row's cells are displayed vertically. This is better for readability on narrow screens when columns contain longer text content.

CSS class applied: `dsgo-comparison-table--responsive-stack`

## Best Practices

**DO:**
- Keep column count reasonable (3-4 columns works best for most layouts)
- Use the featured column to draw attention to a recommended option
- Add tooltips for features that may need explanation
- Use check/cross icons for boolean features instead of "Yes"/"No" text
- Test both responsive modes to determine the best fit for your content

**DON'T:**
- Exceed 6 columns, as the table becomes difficult to read
- Leave CTA links empty when CTA buttons are enabled
- Mix too many text values with icon values in the same row
- Forget to verify color contrast for header and featured column colors

## Accessibility

- **Semantic HTML**: Renders as a proper `<table>` with `<thead>` and `<tbody>` elements
- **Keyboard Navigation**: All cells and controls are keyboard accessible with proper `tabIndex` and `role` attributes
- **ARIA Labels**: Cells include descriptive `aria-label` attributes combining the row label and column name
- **Tooltips**: Row tooltips use the WordPress `Tooltip` component for accessible hover information
- **Color Contrast**: Ensure header, featured column, and alternating row colors meet WCAG AA contrast ratios
