---
name: check-compat
description: Check compatibility with WordPress and Gutenberg versions
context: fork
agent: Explore
allowed-tools: Read, Glob, Grep, Bash(npm *), Bash(npx *)
---


Check compatibility with current WordPress and Gutenberg versions.

1. **Check WordPress version requirements**
   - Review `designsetgo.php` "Requires at least" header
   - Check if any deprecated WordPress functions are used
   - Search codebase for WordPress functions with @deprecated tags

2. **Check Gutenberg/Block Editor compatibility**
   - Review all `@wordpress/*` package versions in `package.json`
   - Check for deprecated block APIs
   - Verify `apiVersion` in all `block.json` files (should be 2 or 3)
   - Check for deprecated components (e.g., old `PanelColorSettings`)

3. **Review block.json schema compliance**
   - Verify all `block.json` files follow WordPress schema
   - Check required fields: name, title, category, icon
   - Validate attribute definitions
   - Check supports field for proper features

4. **Check for deprecated APIs**
   - Search for `wp.editor` (deprecated, use `wp.blockEditor`)
   - Search for `wp.blocks.Editable` (deprecated, use `RichText`)
   - Search for `wp.element.renderToString` (deprecated)
   - Search for deprecated filter hooks

5. **Verify proper package usage**
   - All WordPress packages imported correctly
   - No direct access to globals when package available
   - Using `@wordpress/dependency-extraction-webpack-plugin`

6. **Test with WordPress beta** (if available)
   - Check WordPress.org for beta releases
   - Recommend testing procedure
   - List potential breaking changes to watch for

7. **Theme compatibility**
   - Check for theme.json support
   - Verify styles work with FSE themes
   - Test with Twenty Twenty-Four, Twenty Twenty-Three

Provide detailed report with:
- Current compatibility status
- Any deprecated code found
- Recommended updates
- Testing recommendations
