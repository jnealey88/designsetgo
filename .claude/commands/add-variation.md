Create a new block variation for a WordPress core block.

Ask the user for:
- Which core block (e.g., "core/group", "core/columns", "core/cover")
- Variation name and description
- Default layout and attributes
- Icon for the variation (from WordPress Dashicons)

Then:
1. If directory doesn't exist, create `src/variations/[block-name]-variations/`
2. Create or update `index.js` with the new variation using `registerBlockVariation()`
3. Set appropriate default attributes:
   - Use WordPress `layout` attribute for layout types (grid, flex, etc.)
   - Set any custom attributes from extensions
   - Configure responsive defaults for mobile/tablet
4. If new variation file, import it in `src/index.js`

Use WordPress native layout attributes:
- For Grid: `layout: { type: 'grid', columnCount: 3 }`
- For Flex: `layout: { type: 'flex', orientation: 'horizontal' }`
- For Flow: `layout: { type: 'default' }` or `layout: { type: 'constrained' }`
