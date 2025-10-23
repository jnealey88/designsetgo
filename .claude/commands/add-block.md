Create a new Gutenberg block.

Ask the user for:
- Block name (e.g., "accordion")
- Block category (e.g., "design", "widgets", "text", "media")
- Whether it needs frontend JavaScript
- Whether it needs dynamic rendering (PHP)

Then:
1. Create block directory in `src/blocks/[block-name]/`
2. Create `block.json` with proper metadata and attributes
3. Create `index.js` to register the block
4. Create `edit.js` with editor controls
5. Create `save.js` with frontend markup
6. Create `style.scss` for frontend styles
7. Create `editor.scss` for editor-only styles
8. If frontend JS needed, create `frontend.js`
9. If dynamic rendering needed, create `render.php`
10. Block will be auto-detected by webpack - no need to modify `src/index.js`
11. If dynamic rendering, add PHP registration in `includes/class-plugin.php`

Follow WordPress block development best practices and use modern @wordpress packages.
