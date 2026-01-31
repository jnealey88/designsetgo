# DesignSetGo Plugin - Quick Reference

**Core Principle**: Use WordPress defaults first. Ask "Does WordPress already provide this?" before building custom solutions.

## Code Standards

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

## Common Pitfalls

1. Frontend imports missing → Add to `src/styles/style.scss`
2. style.scss ≠ editor.scss → Edit BOTH
3. Plain `<InnerBlocks />` → Use `useInnerBlocksProps()`
4. Only test editor → Test frontend too
5. Change shared utility → Test ALL consumers
6. Broad CSS selectors → Scope to block
7. Change attributes → Create deprecation first

## Key Patterns

- **Clickable Groups**: Check `!e.target.closest('a, button')` before navigation
- **External Links**: `window.open(url, '_blank'); win.opener = null`
- **Context**: `providesContext` in parent, `usesContext` in child
- **!important**: Only for accessibility, user expectation, or WP core override

## Container Width Pattern

**Two-div structure** (outer: full-width/backgrounds, inner: constrained):
```jsx
<div className="dsgo-block">
  <div className="dsgo-block__inner" style={innerStyle}>
```

**Width constraints**:
- Edit: `maxWidth: contentWidth || themeContentSize`
- Save: `maxWidth: contentWidth || 'var(--wp--style--global--content-size, 1140px)'`
- Nested: Reset constraints via CSS (`.dsgo-stack__inner > &`)

📖 [WIDTH-LAYOUT-PATTERNS.md](docs/WIDTH-LAYOUT-PATTERNS.md)

## FSE & Debugging

**FSE Checklist**: Comprehensive `supports`, `example` property, WordPress presets only, test Twenty Twenty-Five
📖 [FSE-COMPATIBILITY-GUIDE.md](docs/FSE-COMPATIBILITY-GUIDE.md)

**Debug**: `npx wp-env logs` (500 errors), `grep -i "class" build/style-index.css` (missing CSS)

## Documentation

📖 [BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md](docs/BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md)
📖 [BEST-PRACTICES-SUMMARY.md](docs/BEST-PRACTICES-SUMMARY.md)
📖 [EDITOR-STYLING-GUIDE.md](docs/EDITOR-STYLING-GUIDE.md)
📖 [Block Editor Handbook](https://developer.wordpress.org/block-editor/)

## Version Control

**Format**: `type: description` (`feat`, `fix`, `refactor`, `style`, `docs`, `chore`)
**Commit**: `src/`, `includes/`, `*.php`, `package.json`, `block.json`, `*.md`
**Ignore**: `build/`, `node_modules/`, `wp-env/`


## Branches

Branch prefixes should start with claude/
---
**Updated**: 2025-11-11 | **Version**: 1.0.1 | **WP**: 6.4+
