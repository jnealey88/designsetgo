# DesignSetGo Plugin - Quick Reference

**Core Principle**: Use WordPress defaults first. Ask "Does WordPress already provide this?" before building custom solutions.

## Code Standards

- **Indentation**: Tabs for JS/SCSS/PHP, 2 spaces for JSON/YAML
- **Prefix**: `dsgo-` for CSS/data attributes, `dsgoAttributeName` for JS, `designsetgo_` for PHP
- **File Size**: Max 300 lines (excluding data/constants)
- **Block Props**: Always use `useBlockProps()` and `useInnerBlocksProps()`
- **Block JSON**: Use `apiVersion: 3` and `textdomain: "designsetgo"`
- **Color Controls**: Use `ColorGradientSettingsDropdown` in `<InspectorControls group="color">` (requires `clientId` prop)
- **Future-Proof**: Add `__next40pxDefaultSize` and `__nextHasNoMarginBottom` to form components
- **Block Supports**: Use `supports` in block.json before custom controls
- **No console.log**: Remove all `console.log` statements before commit

## Architecture

- **Categories**: Use WordPress core categories (`"category": "design"`), plus custom collection
- **Extensions**: Use `addFilter()` with explicit block name allowlist
- **File Structure**: `src/blocks/{block}/` → index.js (registration), edit.js, save.js, components/, utils/
- **Asset Loading**: Enqueue in `enqueue_block_assets` with `is_admin()` check

## Security

- **Input**: Validate all user input
- **Output**: Escape with `esc_html()`, `esc_attr()`, `esc_url()`, `wp_kses_post()`
- **Forms**: Use nonce verification and capability checks
- **Direct Access**: Add `defined('ABSPATH') || exit;` to PHP files
- **No XSS**: Never use `innerHTML` with unsanitized data
- **No SQL Injection**: Use `$wpdb->prepare()` for all queries

## Accessibility

- **Keyboard**: All interactive elements accessible via keyboard
- **Screen Readers**: Use alt text, aria-labels, semantic HTML
- **Contrast**: WCAG AA minimum (4.5:1 normal text, 3:1 large text)
- **Focus**: Visible focus indicators on all interactive elements
- **Headings**: Proper hierarchy (don't skip levels)

## Internationalization

- **Text Domain**: `designsetgo`
- **PHP Strings**: `__('text', 'designsetgo')`, `esc_html__()`, `esc_attr__()`
- **JS Strings**: Import from `@wordpress/i18n`
- **No Concatenation**: Use `sprintf(__('Hello %s', 'designsetgo'), $name)`

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

```bash
npm run build
npm run lint:js
npm run lint:css
npm run lint:php
# Test editor + frontend + responsive
# Check browser console for errors
```

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

## FSE & Debugging

**FSE Checklist**: Comprehensive `supports`, `example` property, WordPress presets only, test Twenty Twenty-Five

**Debug**: `npx wp-env logs` (500 errors), `grep -i "class" build/style-index.css` (missing CSS)

## Documentation

- [REFACTORING-GUIDE.md](.claude/docs/REFACTORING-GUIDE.md)
- [FSE-COMPATIBILITY-GUIDE.md](.claude/docs/FSE-COMPATIBILITY-GUIDE.md)
- [EDITOR-STYLING-GUIDE.md](.claude/docs/EDITOR-STYLING-GUIDE.md)
- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)

## Version Control

**Format**: `type: description` (`feat`, `fix`, `refactor`, `style`, `docs`, `chore`)

**Commit**: `src/`, `includes/`, `*.php`, `package.json`, `block.json`, `*.md`

**Ignore**: `build/`, `node_modules/`, `wp-env/`

## Branches

Branch prefixes should start with `claude/`

## Memory

As you work on an issue, add notes to memory, .claude/claude-memory.md, create an agent ID or session ID so as to not confuse other agents.
---

**Updated**: 2025-01-31 | **Version**: 1.1.0 | **WP**: 6.4+
