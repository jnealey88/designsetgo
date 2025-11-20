# Custom CSS Extension - User Guide

**Compatible With**: All blocks except HTML and Code blocks
**Since**: 1.0.0

## Overview

The **Custom CSS Extension** allows you to add custom CSS styles directly to any block in the editor. Perfect for advanced styling, complex layouts, hover effects, and design tweaks that go beyond standard controls.

**Key Features:**
- Write CSS directly in block sidebar
- Use `selector` keyword (replaced with block class)
- Supports nested selectors (e.g., `selector h3`)
- Pseudo-classes (`:hover`, `:before`, `:after`)
- Live preview in editor
- Scoped to individual block (doesn't affect others)

## 🚀 Quick Start

1. Select any block (container, image, heading, etc.)
2. Open **Custom CSS** panel in sidebar
3. Write CSS using `selector` keyword:
   ```css
   selector {
     background: linear-gradient(45deg, #f00, #00f);
     padding: 2rem;
   }
   ```
4. Preview updates live in editor

## ⚙️ Settings & Configuration

### Custom CSS Panel
- **CSS Code**: Textarea for writing CSS (15 rows)
- **selector Keyword**: Represents the current block
- **Nested Selectors**: Target elements inside block

### Selector Keyword
The `selector` keyword is replaced with the block's unique class:
- `selector` → `.dsgo-custom-css-abc123`
- `selector h3` → `.dsgo-custom-css-abc123 h3`
- `selector:hover` → `.dsgo-custom-css-abc123:hover`

## 💡 Common Use Cases

### 1. Gradient Backgrounds
```css
selector {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### 2. Hover Effects
```css
selector:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
```

### 3. Complex Layouts
```css
selector {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}
```

### 4. Custom Typography
```css
selector h2 {
  font-family: 'Georgia', serif;
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.2;
}
```

### 5. Pseudo-elements
```css
selector:before {
  content: '→';
  margin-right: 0.5em;
  color: var(--wp--preset--color--primary);
}
```

## ✅ Best Practices

**DO:**
- Use `selector` keyword consistently
- Test on frontend (editor may differ slightly)
- Add comments for complex CSS
- Use CSS variables for theme consistency
- Keep styles scoped to current block

**DON'T:**
- Write global styles (affects only current block)
- Forget to use `selector` (will break)
- Use `!important` unless necessary
- Write inline styles (defeats purpose)
- Copy-paste without adjusting selectors

## 💡 Tips & Tricks

- **Theme Variables**: Use `var(--wp--preset--color--primary)` for theme colors
- **Responsive**: Use media queries inside selector
  ```css
  selector {
    padding: 2rem;
  }
  @media (max-width: 768px) {
    selector {
      padding: 1rem;
    }
  }
  ```
- **Transitions**: Add smooth animations
  ```css
  selector {
    transition: all 0.3s ease;
  }
  ```
- **Debugging**: Inspect element to see generated class name
- **Editor vs Frontend**: Some styles may differ (test both)

## Examples

### Card with Hover Effect
```css
selector {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

selector:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}
```

### Custom Border
```css
selector {
  border-left: 4px solid var(--wp--preset--color--primary);
  padding-left: 1.5rem;
}
```

### Clip Path Shape
```css
selector {
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
}
```

## Technical Notes

- CSS injected via `<style>` tag in editor
- Frontend uses hashed class (same CSS, different class name)
- Uses `replaceSelector()` function to swap `selector` keyword
- Scoped to block via unique class (no global pollution)
- Excluded from HTML/Code blocks (they have native CSS capability)
