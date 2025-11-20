# DesignSetGo Plugin - Quick Reference

**Core Principle**: Use WordPress defaults first. Ask "Does WordPress already provide this?" before building custom solutions.

## Code Standards

- **Indentation**: Spaces (4 for JS/SCSS/PHP, 2 for JSON), never tabs
- **Prefix**: `dsgo-` for CSS/data attributes, `dsgoAttributeName` for JS, `designsetgo_` for PHP
- **File Size**: Max 300 lines (excluding data/constants)
- **Block Props**: Always use `useBlockProps()` and `useInnerBlocksProps()`
- **Color Controls**: Use `ColorGradientSettingsDropdown` in `<InspectorControls group="color">` (requires `clientId` prop)
- **Future-Proof**: Add `__next40pxDefaultSize` and `__nextHasNoMarginBottom` to form components
- **Block Supports**: Use `supports` in block.json before custom controls

## Architecture

- **Categories**: Use WordPress core categories (`"category": "design"`), plus custom collection
- **Extensions**: Use `addFilter()` with explicit block name allowlist
- **File Structure**: `src/blocks/{block}/` → index.js (registration), edit.js, save.js, components/, utils/
- **Asset Loading**: Enqueue in `enqueue_block_assets` with `is_admin()` check

📖 [REFACTORING-GUIDE.md](docs/REFACTORING-GUIDE.md)

## Safety Rules

### Shared Code Changes
1. `grep -r "ComponentName" src/` to find ALL usages
2. Test affected blocks (Container: Stack/Flex/Grid, Interactive: Accordion/Tabs, Styled: Icon/Pill, List: Icon List)
3. `npm run build` + check console (editor + frontend)

### CSS/JS Scope
- **CSS**: Use `:where()` for low specificity, scope to `.wp-block-designsetgo-{block}`
- **JS**: Use `[data-dsgo-*]` selectors, event delegation with `.closest()`

### Deprecations
Required when changing: attribute schema, HTML structure, or removing attributes
```javascript
const v1 = { attributes: {}, save: () => {}, migrate: (attrs) => ({}) };
export default [v1];
```

### Style Imports (MANDATORY)
Add to `src/styles/style.scss` (frontend) AND `src/styles/editor.scss` (editor)
Verify: `grep -i "class-name" build/style-index.css`

### Pre-Commit
`npm run build` → Test editor + frontend + responsive → Check console

## Top 10 Common Pitfalls

1. **Frontend imports missing** → Add to `src/styles/style.scss`
2. **style.scss ≠ editor.scss** → Edit BOTH for visual styles
3. **Plain `<InnerBlocks />`** → Use `useInnerBlocksProps()`
4. **Custom width on alignfull** → Let WordPress handle sizing
5. **Only test editor** → ALWAYS test frontend too
6. **No blockGap default in dynamic blocks** → Add to block.json attributes
7. **Change shared utility** → Test ALL consumers (`grep -r`)
8. **Broad CSS selectors** → Scope to `.wp-block-designsetgo-{block}`
9. **addFilter without name check** → Use explicit allowlist
10. **Change attributes** → Create deprecation first

## Technical Patterns

### Clickable Groups
```javascript
group.addEventListener('click', (e) => {
    const isInteractive = e.target.matches('a, button') ||
                         e.target.closest('a, button');
    if (!isInteractive) window.location.href = linkUrl;
});
```

### External Link Security
```javascript
if (linkTarget === '_blank') {
    const win = window.open(linkUrl, '_blank');
    if (win) win.opener = null;
}
```

### Parent-Child Context
```json
// Parent
"providesContext": { "ns/parent/color": "color" }

// Child
"usesContext": ["ns/parent/color"]
```
```javascript
const effectiveColor = color || parentColor || defaultColor;
```

### When to Use `!important`
Only for: Accessibility, User expectation, WordPress core override

### Width & Layout Patterns (Container Blocks)

**⚠️ CRITICAL: Always use two-div pattern for container blocks**

```jsx
// ✅ CORRECT - Two-div pattern
<div className="dsgo-block">        // Outer: full-width, backgrounds
  <div className="dsgo-block__inner" style={innerStyle}>  // Inner: constrained
    {children}
  </div>
</div>
```

**Width Constraint Pattern:**
```javascript
// In edit.js
const [themeContentSize] = useSettings('layout.contentSize');
const innerStyle = {};
if (constrainWidth) {
    innerStyle.maxWidth = contentWidth || themeContentSize;
    innerStyle.marginLeft = 'auto';
    innerStyle.marginRight = 'auto';
}

// In save.js
if (constrainWidth) {
    innerStyle.maxWidth = contentWidth || 'var(--wp--style--global--content-size, 1140px)';
    innerStyle.marginLeft = 'auto';
    innerStyle.marginRight = 'auto';
}
```

**Apply Conditional Classes:**
```javascript
const className = [
    'dsgo-block',
    !constrainWidth && 'dsgo-no-width-constraint',
].filter(Boolean).join(' ');
```

**Handle Nested Containers (Required CSS):**
```scss
.dsgo-my-block {
    // When nested inside another container
    .dsgo-stack__inner > &,
    .dsgo-flex__inner > &,
    .dsgo-grid__inner > & {
        width: 100% !important;
        .dsgo-my-block__inner {
            max-width: none !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
        }
    }
}
```

**📖 See [WIDTH-LAYOUT-PATTERNS.md](docs/WIDTH-LAYOUT-PATTERNS.md) for:**
- Complete width/contentSize documentation
- Known conflicts with nested items (7 identified issues)
- Testing matrix for container nesting
- Migration guide for fixing existing issues

## FSE Compatibility

📖 See [FSE-COMPATIBILITY-GUIDE.md](docs/FSE-COMPATIBILITY-GUIDE.md)

- [ ] Comprehensive `supports` in block.json
- [ ] `example` property
- [ ] WordPress presets (no hardcoded values)
- [ ] Test Twenty Twenty-Five theme
- [ ] Block patterns

## Debugging

**500 Error**: `npx wp-env logs`
**CSS Missing**: `grep -i "class" build/style-index.css`
**Build Verify**: `ls -lh build/ && cat build/style-index.css`

## Resources

📖 **Detailed Guides** (in `docs/`):
- [BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md](docs/BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md) - Complete reference
- [BEST-PRACTICES-SUMMARY.md](docs/BEST-PRACTICES-SUMMARY.md) - Quick patterns
- [EDITOR-STYLING-GUIDE.md](docs/EDITOR-STYLING-GUIDE.md) - Styling patterns
- [WIDTH-LAYOUT-PATTERNS.md](docs/WIDTH-LAYOUT-PATTERNS.md) - Width/layout patterns & nesting conflicts

**Official**:
- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [Block Supports](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/)
- [Theme.json](https://developer.wordpress.org/themes/global-settings-and-styles/settings/)

## Version Control

**Commit Format**: `type: description`
**Types**: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`

**Commit**: `src/`, `includes/`, `*.php`, `package.json`, `block.json`, `*.md`
**Don't Commit**: `build/`, `node_modules/`, `wp-env/`

---
**Updated**: 2025-11-11 | **Version**: 1.0.1 | **WP**: 6.4+
