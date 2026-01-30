---
name: add-block
description: Create a new Gutenberg block with scaffolding
argument-hint: [block-name]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(mkdir *), Bash(npm run *)
---


Create a new Gutenberg block following WordPress best practices.

## Ask the User For

- **Block name** (e.g., "accordion", "testimonial-slider")
- **Block category** (e.g., "design", "widgets", "text", "media")
- **Needs frontend JavaScript?** (Yes/No)
- **Needs dynamic rendering (PHP)?** (Yes/No)

## What Gets Created

1. Block directory: `src/blocks/[block-name]/`
2. `block.json` with proper metadata and attributes
3. `index.js` to register the block
4. `edit.js` with editor controls
5. `save.js` with frontend markup
6. `style.scss` for frontend styles
7. `editor.scss` for editor-only styles
8. `frontend.js` (if needed for interactivity)
9. `render.php` (if dynamic rendering needed)

## Critical Patterns to Follow

**ALWAYS use these in edit.js:**
- `useBlockProps()` for block wrapper
- `useInnerBlocksProps()` for nested blocks (NOT plain `<InnerBlocks />`)
- Declarative styling (NO `useEffect` for styles)

**ALWAYS include in block.json:**
- Comprehensive `supports` for FSE compatibility
- `example` property for pattern library
- WordPress presets (no hardcoded colors/spacing)

**Color controls:**
- Use `ColorGradientSettingsDropdown` (NOT `PanelColorSettings`)
- Place in `<InspectorControls group="color">`
- Require `clientId` parameter in edit function

## After Creation

Block will be auto-detected by webpack - no need to modify `src/index.js`.

If dynamic rendering is used, add PHP registration in `includes/class-plugin.php`.

## Build and Test

```bash
npm run build
```

Test in both editor and frontend.

## Reference

See [BEST-PRACTICES-SUMMARY.md](../../docs/BEST-PRACTICES-SUMMARY.md) for complete patterns.
