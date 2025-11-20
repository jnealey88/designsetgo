# Text Alignment Inheritance Extension - User Guide

**Compatible With**: Core text blocks (Paragraph, Heading, List, Quote, etc.)
**Since**: 1.0.0

## Overview

The **Text Alignment Inheritance Extension** automatically sets the initial text alignment of newly inserted text blocks based on their parent container's alignment. This creates a consistent, streamlined editing experience when working with aligned containers.

**Key Features:**
- One-time inheritance on block insertion
- Works with core text blocks (paragraphs, headings, lists, quotes)
- Reads parent container's text alignment setting
- Non-intrusive (user can freely change after insertion)
- No database attributes (uses context API)

## 🚀 Quick Start

1. Create a **Section**, **Row**, or **Group** block
2. Set container's **Text Alignment** to Center (or Left/Right)
3. Insert a **Paragraph** or **Heading** block inside
4. New block automatically inherits center alignment
5. Change alignment freely afterward (inheritance is one-time only)

## ⚙️ How It Works

### Parent Context
Container blocks (Section, Row, Grid, Group) provide `textAlign` context to children.

### Child Inheritance
When text blocks are inserted:
1. Check if parent has `textAlign` set
2. If yes, and child has no alignment yet → inherit parent's alignment
3. Mark as initialized (won't inherit again)
4. User can change alignment afterward without interference

### Supported Text Blocks
- `core/paragraph`
- `core/heading`
- `core/list`
- `core/quote`
- `core/pullquote`
- `core/verse`
- `core/preformatted`
- `core/code`

## 💡 Common Use Cases

### 1. Centered Hero Sections
Set Section to center-aligned, all new headings/paragraphs auto-center.

### 2. Right-Aligned Testimonials
Container aligned right, quotes and attributions inherit right alignment.

### 3. Consistent Card Layouts
Grid of cards all center-aligned, text blocks auto-center on insertion.

### 4. Sidebar Widgets
Left-aligned sidebar, all text blocks start left-aligned.

## ✅ Best Practices

**DO:**
- Set container alignment before adding text blocks
- Use for consistent, aligned sections
- Change child alignment freely after insertion
- Combine with container alignment presets

**DON'T:**
- Expect re-inheritance after initial insertion
- Use on non-text blocks (images, buttons, etc.)
- Rely on inheritance for complex layouts (set manually)

## 💡 Tips & Tricks

- **One-Time Only**: Inheritance happens once on insertion, not continuously
- **Override Anytime**: Change child alignment without affecting parent
- **Context API**: Uses WordPress context (no custom attributes, no validation issues)
- **Performance**: WeakMap tracking (no database bloat)
- **Debugging**: If not inheriting, check parent has `textAlign` set and child is a text block

## Technical Notes

- Uses `providesContext` (parent) and `usesContext` (child)
- WeakMap tracks initialized blocks (no persistence to database)
- Runs once on component mount (empty dependency array)
- Only applies to supported text blocks
- No filter priority conflicts (lightweight implementation)
