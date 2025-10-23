Create a new block extension to enhance a WordPress core block.

Ask the user for:
- Which core block to extend (e.g., "core/heading", "core/button", "core/image")
- What enhancements to add (e.g., "gradient text", "icon support", "hover effects")
- Whether it needs frontend JavaScript for interactivity

Then:
1. Create extension directory in `src/extensions/[block-name]-enhancements/`
2. Create `index.js` with:
   - `blocks.registerBlockType` filter to add attributes
   - `editor.BlockEdit` filter to add inspector controls
   - `blocks.getSaveContent.extraProps` filter to add classes on save
   - Conditional controls based on WordPress state (e.g., only show grid controls when `layout.type === 'grid'`)
3. Create `styles.scss` for frontend styles
4. Create `editor.scss` for editor-only styles
5. If interactive features needed, create `frontend.js`
6. Import and initialize the extension in `src/index.js`

IMPORTANT: Follow the patterns in `.claude/claude.md`:
- Work WITH WordPress attributes, don't replace them
- Show controls conditionally based on WordPress state
- Don't duplicate WordPress toolbar functionality
- Use WordPress layout system when extending Group block
