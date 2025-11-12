# Performance Optimizations - Implementation Guide

This document explains the performance optimizations made to the DesignSetGo plugin and how to maintain them going forward.

---

## Quick Reference

| Optimization | Impact | Files Modified |
|--------------|--------|----------------|
| CSS Bundle Splitting | -49% global CSS | `src/style.scss`, `src/styles/editor.scss` |
| Grid CSS Optimization | -84% Grid CSS | `src/blocks/grid/*` |
| Dashicons Conditional | -40KB (conditional) | `includes/class-assets.php` |
| Memory Leak Fixes | Zero leaks | `src/blocks/slider/view.js` |
| Event Delegation | -90% listeners | `src/blocks/tabs/view.js` |
| Bundle Analyzer | Future monitoring | `webpack.config.js`, `package.json` |

---

## 1. CSS Bundle Splitting

### What Changed

Individual blocks now load their own CSS instead of one global bundle.

**Before:**
```scss
// src/style.scss - Everything in one file
@use './blocks/grid/style';
@use './blocks/tabs/style';
@use './blocks/accordion/style';
// ... 20 blocks total = 162KB
```

**After:**
```scss
// src/style.scss - Only shared utilities
@use './styles/variables';
@use './styles/animations';
@use './extensions/background-video/style';
// Individual blocks removed
```

```json
// src/blocks/grid/block.json - Per-block loading
{
  "style": "file:./style.scss"
}
```

### Benefits

- Only loads CSS for blocks actually used on the page
- Better browser caching (block changes don't invalidate entire bundle)
- Reduced initial CSS parse time

### Maintenance

When creating new blocks:
1. ✅ **DO:** Add `"style": "file:./style.scss"` to `block.json`
2. ❌ **DON'T:** Import block styles into global `src/style.scss`

---

## 2. Grid CSS Optimization (JavaScript Runtime)

### What Changed

Replaced 396 CSS rules with 120-line JavaScript for responsive grid-column constraints.

**Before: CSS Approach (74KB)**
```scss
@for $cols from 1 through 12 {
  @for $span from ($cols + 1) through 12 {
    // 6 selector variations = 396 rules
    .dsg-grid-cols-tablet-#{$cols} .dsg-grid__inner {
      > *[style*="grid-column: span #{$span}"] {
        grid-column: span #{$cols} !important;
      }
    }
  }
}
```

**After: JavaScript Approach (1.3KB)**
```javascript
// src/blocks/grid/view.js
applyConstraints(maxColumns) {
  const children = Array.from(this.inner.children);
  children.forEach(child => {
    const spanValue = parseInt(child.style.gridColumn);
    if (spanValue > maxColumns) {
      child.style.gridColumn = `span ${maxColumns}`;
    }
  });
}
```

### How It Works

1. **Desktop (>1024px):** Grid items use inline `grid-column: span X` styles as configured
2. **Tablet (768-1024px):** JavaScript detects tablet breakpoint and constrains spans to tablet column count
3. **Mobile (≤767px):** JavaScript forces all items to `span 1` (stack)

### Benefits

- 97% fewer CSS rules (298 → 7)
- 84% smaller CSS bundle (74KB → 12KB)
- Only 1.3KB JavaScript added (0.6KB gzipped)
- Net savings: ~60KB raw, ~6KB gzipped

### Maintenance

**Critical:** Do NOT add tablet/mobile span constraint CSS rules to `style.scss` or `editor.scss`. The JavaScript handles this automatically.

**Testing Checklist:**
```bash
# After modifying grid/view.js
npm run build
node -c build/blocks/grid/view.js  # Validate syntax
```

In browser:
1. Create Grid block with 4 desktop columns, 2 tablet columns
2. Add items with various spans (1, 2, 3, 4)
3. Resize browser window 1200px → 900px → 600px
4. Verify spans constrain appropriately
5. Check console for errors

---

## 3. Memory Leak Fixes (Slider Block)

### What Changed

Added proper cleanup for document-level event listeners.

**Problem:**
```javascript
// Listeners added but never removed
document.addEventListener('mousemove', handleMouseMove);
window.addEventListener('resize', handleResize);
// Memory grows +2MB/minute
```

**Solution:**
```javascript
class DSGSlider {
  initDrag() {
    // Store references
    this.handleMouseMove = (e) => { /* ... */ };
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  destroy() {
    // Clean up everything
    document.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.handleResize);
    this.stopAutoplay();
    this.isDestroyed = true;
  }
}

// Global cleanup on page unload
window.addEventListener('beforeunload', () => {
  sliders.forEach(slider => slider.destroy());
});
```

### Testing for Memory Leaks

1. Open Chrome DevTools → Performance/Memory
2. Take heap snapshot
3. Interact with sliders for 2-3 minutes
4. Take another heap snapshot
5. Memory should remain stable (no continuous growth)

---

## 4. Event Delegation (Tabs Block)

### What Changed

Replaced individual tab listeners with parent-level delegation.

**Before:**
```javascript
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => setActiveTab(index));
  tab.addEventListener('keydown', (e) => handleKeyboard(e, index));
});
// 10 tabs = 20 event listeners
```

**After:**
```javascript
this.nav.addEventListener("click", (e) => {
  const button = e.target.closest(".dsg-tabs__tab");
  if (!button) return;
  const index = parseInt(button.dataset.tabIndex);
  this.setActiveTab(index);
});
// 10 tabs = 2 event listeners (90% reduction)
```

### Benefits

- Lower memory usage (-2KB per tabs instance)
- Faster DOM manipulation
- Cleaner code architecture

### Pattern to Follow

When creating interactive blocks with multiple similar elements:
```javascript
// ✅ GOOD: Event delegation
container.addEventListener('click', (e) => {
  const item = e.target.closest('.item');
  if (!item) return;
  handleClick(item);
});

// ❌ BAD: Individual listeners
items.forEach(item => {
  item.addEventListener('click', () => handleClick(item));
});
```

---

## 5. Dashicons Conditional Loading

### What Changed

Dashicons (40KB) now only loads when tabs or accordion blocks are present.

```php
// includes/class-assets.php
private function has_dashicon_blocks() {
  $content = $post->post_content;
  return (
    strpos($content, 'wp:designsetgo/tabs') !== false ||
    strpos($content, 'wp:designsetgo/accordion') !== false
  );
}

public function enqueue_frontend_assets() {
  if ($this->has_dashicon_blocks()) {
    wp_enqueue_style('dashicons');
  }
}
```

### Benefits

- -40KB on pages without tabs/accordion
- Backward compatible (loads when needed)

### When to Use This Pattern

Apply conditional loading for:
- Large external libraries (>20KB)
- Assets used by only 1-2 blocks
- Frontend-only dependencies

**DON'T use for:**
- Small shared utilities (<5KB)
- Assets used by many blocks
- WordPress core dependencies (already optimized)

---

## 6. Webpack Bundle Analyzer & Performance Budgets

### Bundle Analyzer

**Usage:**
```bash
# Generate interactive bundle report
npm run build:analyze

# Opens bundle-report.html automatically
# Shows treemap of all assets with sizes
```

**What to Look For:**
- Blocks >15KB raw (investigate why)
- Duplicate dependencies (can be code-split)
- Large CSS files (can styles be optimized?)
- Unexpected asset sizes

### Performance Budgets

**Current Limits:**
```javascript
// webpack.config.js
performance: {
  maxEntrypointSize: 250000,  // 250KB raw
  maxAssetSize: 50000,         // 50KB raw per asset
}
```

**Build Warnings:**
```bash
WARNING in asset size limit:
Assets:
  shared-icon-library.js (49.8 KiB)
```

**Action on Warnings:**
1. Is the asset actually used?
2. Can it be lazy-loaded?
3. Can it be optimized?
4. Is the warning acceptable? (document why)

### Updating Budgets

Only increase budgets after:
1. Investigating all optimization options
2. Documenting why increase is necessary
3. Team review/approval

```javascript
// Document all budget changes
performance: {
  maxAssetSize: 60000,  // Increased from 50KB for [reason]
}
```

---

## Common Patterns & Anti-Patterns

### ✅ DO: Lazy Load Large Frontend Scripts

```javascript
// Only load when block is actually used
if (document.querySelector('.dsg-complex-block')) {
  import('./complex-functionality').then(module => {
    module.init();
  });
}
```

### ✅ DO: Clean Up Event Listeners

```javascript
class MyBlock {
  init() {
    this.handleClick = () => { /* ... */ };
    document.addEventListener('click', this.handleClick);
  }

  destroy() {
    document.removeEventListener('click', this.handleClick);
  }
}
```

### ✅ DO: Use Event Delegation

```javascript
// Single listener for all items
container.addEventListener('click', (e) => {
  const item = e.target.closest('.item');
  if (item) handleItem(item);
});
```

### ❌ DON'T: Import Block Styles Globally

```scss
// ❌ BAD - src/style.scss
@use './blocks/my-block/style';

// ✅ GOOD - src/blocks/my-block/block.json
{
  "style": "file:./style.scss"
}
```

### ❌ DON'T: Add Listeners Without Cleanup

```javascript
// ❌ BAD - Memory leak
document.addEventListener('scroll', () => { /* ... */ });

// ✅ GOOD - Cleanup + debounce
this.handleScroll = debounce(() => { /* ... */ }, 150);
document.addEventListener('scroll', this.handleScroll);
// Later: document.removeEventListener('scroll', this.handleScroll);
```

### ❌ DON'T: Use Individual Listeners for Multiple Items

```javascript
// ❌ BAD - N listeners
items.forEach(item => {
  item.addEventListener('click', handler);
});

// ✅ GOOD - 1 listener
container.addEventListener('click', (e) => {
  const item = e.target.closest('.item');
  if (item) handler(item);
});
```

---

## Performance Testing Workflow

### Before Each Release

1. **Build Analysis**
   ```bash
   npm run build:analyze
   ```
   - Review bundle sizes
   - Check for unexpected growth
   - Identify optimization opportunities

2. **Memory Testing**
   - Open Chrome DevTools → Performance
   - Record 2-3 minute session with blocks
   - Check for memory leaks (continuous growth)

3. **Bundle Size Check**
   ```bash
   npm run build | grep WARNING
   ```
   - All warnings must be documented
   - No new warnings without justification

4. **Core Web Vitals**
   - Test on real WordPress install
   - Use Lighthouse or WebPageTest
   - Target: LCP <2.5s, FCP <1.8s, TBT <300ms

### Automated Checks (CI/CD)

```yaml
# .github/workflows/performance.yml
- name: Check bundle sizes
  run: |
    npm run build
    npm run build:analyze
    # Parse bundle-stats.json
    # Fail if budgets exceeded
```

---

## Troubleshooting

### Grid Block Responsive Issues

**Problem:** Grid items not constraining on tablet/mobile

**Solutions:**
1. Check browser console for JavaScript errors
2. Verify `view.js` is loading: `<script src="build/blocks/grid/view.js">`
3. Test JavaScript syntax: `node -c build/blocks/grid/view.js`
4. Verify Grid has responsive classes: `dsg-grid-cols-tablet-2`

### Memory Still Growing

**Problem:** Memory leaks despite fixes

**Debug:**
```javascript
// Add logging to destroy() method
destroy() {
  console.log('Destroying instance:', this);
  // ... cleanup code
}
```

**Check:**
1. Are all `addEventListener` calls matched with `removeEventListener`?
2. Are timers/intervals cleared? (`clearTimeout`, `clearInterval`)
3. Are references to DOM elements cleared?

### Build Warnings

**Problem:** Asset size limit warnings

**Analysis:**
```bash
npm run build:analyze
# Examine the flagged asset in bundle-report.html
```

**Actions:**
1. Identify largest dependencies in the asset
2. Check if dependencies can be lazy-loaded
3. Look for duplicate code across chunks
4. Consider code splitting

---

## Resources

- [OPTIMIZATION-SUMMARY.md](OPTIMIZATION-SUMMARY.md) - Complete optimization report
- [PERFORMANCE-AUDIT.md](PERFORMANCE-AUDIT.md) - Detailed audit findings
- [webpack.config.js](webpack.config.js) - Bundle configuration
- [Grid view.js](src/blocks/grid/view.js) - JavaScript optimization example

---

## Getting Help

If you encounter performance issues:

1. **Check existing documentation** (this file, audit report)
2. **Run bundle analyzer** to identify issue
3. **Test in isolation** (single block, simple page)
4. **Profile with DevTools** (Performance tab, Memory tab)
5. **Document findings** for team review

**Performance regression?**
1. Identify when it started (git bisect)
2. Compare bundle sizes before/after
3. Review changes to modified files
4. Run performance tests

---

**Last Updated:** November 11, 2025
**Maintained By:** Development Team
**Questions?** Review audit documentation or consult team
