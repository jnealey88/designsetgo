# DesignSetGo Design System - TT5 Integration

## Overview

The DesignSetGo design system now integrates seamlessly with WordPress Twenty Twenty-Five's (TT5) semantic color palette and includes an expanded spacing scale for more layout flexibility.

## ✅ What Changed

### 1. **Expanded Spacing Scale**

**Before:** 6 spacing options (8px → 64px)
**Now:** 12 spacing options (4px → 160px)

| Slug | Size | Pixels | Usage |
|------|------|--------|-------|
| `xxs` | 0.25rem | 4px | Micro spacing, borders |
| `xs` | 0.5rem | 8px | Tight spacing |
| `sm` | 0.75rem | 12px | Small gaps |
| `md` | 1rem | 16px | Default spacing |
| `lg` | 1.5rem | 24px | Medium sections |
| `xl` | 2rem | 32px | Large sections |
| `xxl` | 3rem | 48px | Very large sections |
| `xxxl` | 4rem | 64px | Hero spacing |
| `xxxxl` | 5rem | 80px | Extra large |
| `xxxxxl` | 6rem | 96px | Massive spacing |
| `jumbo` | 8rem | 128px | Jumbo sections |
| `mega` | 10rem | 160px | Mega sections |

**Usage:**
```css
padding: var(--wp--preset--spacing--xxxl);
margin-bottom: var(--wp--preset--spacing--jumbo);
```

---

### 2. **TT5 Semantic Color System**

**Before:** Custom DSG colors (dsg-primary, dsg-secondary, dsg-accent)
**Now:** TT5 semantic colors (base, contrast, accent-1 through accent-6)

#### Color Palette

| Color | Default | Purpose | Typical Usage | Contrast Requirements |
|-------|---------|---------|---------------|----------------------|
| **Base** | #ffffff (White) | Default background | Page background, cards, sections | Must contrast with Contrast |
| **Contrast** | #000000 (Black) | Text color | All body and heading text | Must contrast with Base |
| **Accent 1** | #f5f5f5 (Light Gray) | Light background | Style 1 sections, subtle cards | Should contrast with Contrast |
| **Accent 2** | #2563eb (Blue) | Primary brand/action | Buttons, links, primary actions | Should contrast with Base & Contrast |
| **Accent 3** | #1e293b (Dark Slate) | Dark background | Style 3 sections, dark headers | Needs Base or white text |
| **Accent 4** | #334155 (Slate) | Dark variant | Style 4, alternative dark sections | Needs Base or white text |
| **Accent 5** | #94a3b8 (Gray) | Neutral variant | Dividers, muted elements | Should contrast with Contrast |
| **Accent 6** | rgba(37,99,235,0.1) | Transparent overlay | Gradients, subtle overlays | N/A |

#### Utility Colors (Backwards Compatible)

| Color | Hex | Usage |
|-------|-----|-------|
| **Success** | #10b981 | Success states, confirmations |
| **Warning** | #f59e0b | Warnings, cautions |
| **Error** | #ef4444 | Errors, destructive actions |

**Usage:**
```css
background: var(--wp--preset--color--accent-2);
color: var(--wp--preset--color--contrast);
border-color: var(--wp--preset--color--accent-5);
```

---

### 3. **Updated Gradients**

New gradients using TT5 colors:

| Gradient | Definition | Usage |
|----------|------------|-------|
| **Primary Gradient** | Accent 2 → Accent 4 | Hero sections, CTAs |
| **Dark Overlay** | Transparent → Accent 3 | Image overlays |
| **Subtle Light** | Base → Accent 1 | Soft backgrounds |
| **Brand Fade** | Accent 2 → Accent 6 | Fading brand effects |
| **Vivid** | Accent 2 → Success | Vibrant gradients |

**Usage:**
```css
background: var(--wp--preset--gradient--primary-gradient);
```

---

### 4. **Updated Utility Classes**

#### Color Utilities (TT5)

**Background:**
- `.dsg-bg-base` - White/light background
- `.dsg-bg-contrast` - Black/dark background
- `.dsg-bg-accent-1` - Light gray background
- `.dsg-bg-accent-2` - Primary brand background
- `.dsg-bg-accent-3` - Dark background

**Text:**
- `.dsg-text-base` - White/light text
- `.dsg-text-contrast` - Black/dark text
- `.dsg-text-accent-2` - Primary brand text
- `.dsg-text-accent-5` - Muted text

#### Spacing Utilities

Now includes expanded scale:
- `.dsg-p-xxs` through `.dsg-p-mega` (padding)
- `.dsg-m-xxs` through `.dsg-m-mega` (margin)

---

## 🎯 Why This Matters

### 1. **Theme Compatibility**

Your blocks now work seamlessly with:
- ✅ Twenty Twenty-Five (TT5)
- ✅ Twenty Twenty-Four
- ✅ Any theme using semantic color systems

When users change their theme colors in **Styles → Colors**, your blocks automatically adapt!

### 2. **Easier Customization**

Users can customize your blocks from:
```
Appearance → Editor → Styles → Blocks → [Your Block]
```

All blocks use the same color system, so changes apply consistently.

### 3. **Better Accessibility**

The TT5 color system is designed with contrast requirements:
- **Base** must contrast with **Contrast**
- **Accent 2** (primary) should contrast with both
- **Accent 3/4** (dark) need light text

This ensures WCAG 2.1 AA compliance when used correctly.

### 4. **More Layout Flexibility**

The expanded spacing scale (4px → 160px) allows:
- Micro-spacing for tight designs
- Jumbo spacing for hero sections
- Everything in between

---

## 📚 Migration Guide

### For Developers

**Old Code:**
```scss
color: var(--wp--preset--color--dsg-primary);
background: var(--wp--preset--color--dsg-secondary);
```

**New Code:**
```scss
color: var(--wp--preset--color--accent-2);
background: var(--wp--preset--color--accent-4);
```

**Mapping:**
- `dsg-primary` → `accent-2` (Primary brand)
- `dsg-secondary` → `accent-4` (Dark variant)
- `dsg-accent` → `accent-2` (Primary actions)

### For Users

No migration needed! The old color names remain as fallbacks, but new projects should use TT5 colors.

---

## 🔍 Testing Checklist

After upgrading, test:

- [ ] **Color Picker**: Colors appear correctly in FSE color picker
- [ ] **Spacing**: All spacing options appear in spacing controls
- [ ] **Gradients**: Gradients display correctly
- [ ] **Utility Classes**: `.dsg-bg-accent-2`, `.dsg-text-contrast`, etc. work
- [ ] **Theme Switching**: Blocks adapt when changing theme colors
- [ ] **Accessibility**: Contrast ratios meet WCAG 2.1 AA standards

---

## 🎨 Examples

### Using TT5 Colors in Blocks

**Hero Section:**
```html
<div class="dsg-bg-accent-3 dsg-text-base dsg-p-jumbo">
  <h1>Welcome to Our Site</h1>
</div>
```

**Card:**
```html
<div class="dsg-bg-accent-1 dsg-rounded-lg dsg-p-xl">
  <h2 class="dsg-text-accent-2">Card Title</h2>
  <p class="dsg-text-contrast">Card content</p>
</div>
```

**Button:**
```html
<button class="dsg-bg-accent-2 dsg-text-base dsg-p-md dsg-rounded-md">
  Click Me
</button>
```

### Using Expanded Spacing

**Tight Design:**
```css
.compact-section {
  padding: var(--wp--preset--spacing--xxs);
  gap: var(--wp--preset--spacing--xs);
}
```

**Hero Section:**
```css
.hero {
  padding-top: var(--wp--preset--spacing--jumbo);
  padding-bottom: var(--wp--preset--spacing--mega);
}
```

---

## 📝 Block Updates

All blocks have been updated to use the TT5 system:

### Container Block
- Default styles use `base`, `contrast`, `accent-2`
- Bordered variation uses `accent-2` border
- Gradient variation uses `primary-gradient`

### Tabs Block
- Tab navigation uses `accent-2` for active state
- Hover state uses `accent-2`
- Default spacing updated to new scale

### Tab Block (Panels)
- Padding uses expanded spacing scale (`xl`, `lg`)
- Text color uses `contrast`
- Background uses `base` or `transparent`

---

## 🚀 What's Next

Potential enhancements:
1. **Dark Mode Support** - Add dark mode variants using TT5 colors
2. **Color Scheme Generator** - Auto-generate accent colors from primary
3. **Spacing Calculator** - Generate consistent spacing based on base unit
4. **Accessibility Checker** - Warn when contrast ratios are insufficient

---

## 📖 Resources

- [WordPress Theme.json Documentation](https://developer.wordpress.org/themes/global-settings-and-styles/settings/)
- [Twenty Twenty-Five Theme](https://wordpress.org/themes/twentytwentyfive/)
- [WCAG 2.1 Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

**Last Updated:** 2025-10-24
**Version:** 2.0.0
**Compatibility:** WordPress 6.4+, Twenty Twenty-Five
