Refactor code in the DesignSetGo WordPress plugin following WordPress best practices and project learnings.

Ask the user what they want to refactor:
- A specific block (e.g., "container", "accordion", "tabs")
- A specific extension (e.g., "group-enhancements")
- A block variation or pattern
- Frontend JavaScript
- CSS/SCSS files
- PHP plugin files
- Build configuration
- General code cleanup

Then perform the refactor following these principles from `.claude/CLAUDE.md` and the comprehensive best practices docs.

---

## Core Refactoring Principles

### 1. WordPress-Native Patterns (CRITICAL)

**Always Use WordPress Hooks:**
- ✅ `useBlockProps()` for block wrapper
- ✅ `useInnerBlocksProps()` for nested blocks (NOT plain `<InnerBlocks />`)
- ✅ `useSelect()` for reading WordPress stores
- ✅ `useDispatch()` for writing to WordPress stores

**Never Use Anti-Patterns:**
- ❌ `useEffect()` for styling (race conditions, timing issues)
- ❌ `querySelector()` or DOM manipulation (conflicts with React)
- ❌ `useState()` for block data (use attributes instead)
- ❌ Plain `<InnerBlocks />` without `useInnerBlocksProps` (breaks layouts)

**Why This Matters:**
- Prevents editor/frontend styling mismatches
- Eliminates race conditions and timing issues
- Ensures layouts work immediately without JavaScript
- Maintains WordPress compatibility

### 2. Declarative Styles Over Imperative DOM Manipulation

**Correct Pattern:**
```javascript
// Calculate styles declaratively based on attributes
const innerStyles = {
  display: layoutType === 'grid' ? 'grid' : 'flex',
  gridTemplateColumns: layoutType === 'grid' ? `repeat(${columns}, 1fr)` : undefined,
  gap: gap,
};

const innerBlocksProps = useInnerBlocksProps({
  className: 'my-inner-container',
  style: innerStyles, // Applied declaratively
});

return <div {...blockProps}><div {...innerBlocksProps} /></div>;
```

**Anti-Pattern to Remove:**
```javascript
// ❌ REMOVE - useEffect with DOM manipulation
useEffect(() => {
  const element = document.querySelector(`[data-block="${clientId}"]`);
  element.style.display = 'grid';
}, [clientId]);
```

### 3. Extension vs Custom Block Decision

| Use Extension When | Use Custom Block When |
|-------------------|----------------------|
| ≤3 simple controls | Complex functionality |
| No DOM restructuring | Need video/media backgrounds |
| CSS-only changes | Interactive components (tabs, accordion) |
| Enhancing existing blocks | Unique UI patterns |

**For DesignSetGo**: Default to custom blocks for unique features. Extensions only for simple enhancements.

### 4. Attribute Design Best Practices

```javascript
// ✅ GOOD - Flat structure, typed, with defaults
{
  "columns": { "type": "number", "default": 3 },
  "gap": { "type": "string", "default": "24px" },
  "enableOverlay": { "type": "boolean", "default": false },
  "layoutType": { "type": "string", "default": "stack" }
}

// ❌ BAD - Nested, untyped, no defaults
{
  "settings": { "type": "object" }
}
```

**Migration Planning:**
- Always provide `deprecated` array when changing attributes
- Test existing blocks don't break after updates
- Provide clear migration path

### 5. Styling Strategy

| Scenario | Solution | Example |
|----------|----------|---------|
| User-controlled values | Inline styles | `backgroundColor`, `padding`, `columns` |
| Responsive behavior | CSS classes + media queries | `.block--mobile` |
| Theme variations | CSS classes | `.block--style-card` |
| State indicators | CSS classes | `.is-active`, `.has-overlay` |
| Dynamic calculations | CSS custom properties | `--columns: 3` |

**Rule**: Use inline styles for user-controlled dynamic values, CSS classes for everything else.

### 6. FSE (Full Site Editing) Compatibility

**Required in block.json:**
```json
{
  "supports": {
    "html": false,
    "inserter": true,
    "layout": {
      "allowSwitching": true,
      "allowEditing": true
    },
    "spacing": {
      "margin": true,
      "padding": true,
      "blockGap": true
    },
    "color": {
      "background": true,
      "text": true
    }
  },
  "example": {
    "attributes": {},
    "innerBlocks": []
  }
}
```

**Always:**
- Use theme spacing tokens (`var(--wp--preset--spacing--xl)`)
- Never hardcode spacing values
- Provide block examples for pattern library
- Test with Twenty Twenty-Five theme

### 7. Performance Budgets

| Metric | Target | Maximum | Action if Exceeded |
|--------|--------|---------|-------------------|
| Bundle size per block | < 10 KB | 15 KB | Lazy load |
| Editor JS (all blocks) | < 150 KB | 200 KB | Code split |
| Frontend JS (per block) | < 5 KB | 10 KB | Optimize or remove feature |
| CSS (per block) | < 3 KB | 5 KB | Remove unused styles |

**Check after refactoring:**
```bash
ls -lh build/*.js build/*.css
```

### 8. Accessibility Non-Negotiables

**Every Block Must Have:**
- [ ] WCAG 2.1 AA contrast (4.5:1 minimum)
- [ ] Full keyboard navigation
- [ ] ARIA labels for custom controls
- [ ] Semantic HTML (proper heading hierarchy)
- [ ] Visible focus indicators
- [ ] Alt text for images (required)
- [ ] Color NOT the only indicator

**Force readable text when needed:**
```scss
.has-dsg-overlay {
  color: #ffffff !important; // Accessibility > specificity
  h1, h2, h3, h4, h5, h6, p { color: #ffffff !important; }
}
```

### 9. Security Checklist

**JavaScript (Editor):**
```javascript
// Validate ALL user input before saving
<URLInput
  value={url}
  onChange={(value) => {
    if (value.match(/^https?:\/\//)) {
      setAttributes({ url: value });
    }
  }}
/>
```

**PHP (Render):**
```php
// Escape ALL output
<h2><?php echo esc_html($attributes['title']); ?></h2>
<a href="<?php echo esc_url($attributes['url']); ?>">Link</a>
<div><?php echo wp_kses_post($attributes['content']); ?></div>
```

### 10. Internationalization

**Every User-Facing String:**
```javascript
import { __ } from '@wordpress/i18n';

__('Click here', 'designsetgo')
sprintf(__('You have %d items', 'designsetgo'), count)
_n('%d item', '%d items', count, 'designsetgo')
```

### 11. Code Maintainability & Developer Experience

**File Organization:**
```
src/blocks/{block-name}/
├── block.json         # Block configuration (single source of truth)
├── index.js           # Block registration
├── edit.js            # Editor component
├── save.js            # Save/render component
├── style.scss         # Frontend styles
├── editor.scss        # Editor-only styles
└── frontend.js        # Frontend interactivity (if needed)
```

**Naming Conventions:**
- CSS classes: `dsg-{block-name}__element--modifier` (BEM)
- Attributes: Flat, descriptive names (`layoutType`, not `type` or `settings.layout`)
- Components: PascalCase (`ContainerEdit`, not `edit` or `container_edit`)
- Functions: camelCase, descriptive (`calculateInnerStyles`, not `getStyles`)
- Files: kebab-case (`group-enhancements`, not `groupEnhancements`)

**Code Organization:**
```javascript
// Good component structure:
// 1. Imports (grouped: WordPress, internal, utils)
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// 2. Utility functions (if small, otherwise separate file)
const calculateStyles = (attributes) => { /* ... */ };

// 3. Main component
export default function Edit({ attributes, setAttributes }) {
  // 4. Destructure attributes
  const { layoutType, columns } = attributes;

  // 5. Hooks (useSelect, useDispatch, etc.)

  // 6. Computed values (styles, classes)
  const innerStyles = calculateStyles(attributes);

  // 7. Event handlers
  const handleLayoutChange = (value) => setAttributes({ layoutType: value });

  // 8. Block props
  const blockProps = useBlockProps();

  // 9. Return JSX
  return (
    <>
      <InspectorControls>...</InspectorControls>
      <div {...blockProps}>...</div>
    </>
  );
}
```

**Dependencies Management:**
- Import only what you need (tree-shaking)
- Don't import entire WordPress packages if only using one function
- Remove unused imports immediately
- Pin versions in package.json for stability

```javascript
// ❌ BAD - Imports entire package
import * as blockEditor from '@wordpress/block-editor';

// ✅ GOOD - Import only what's needed
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
```

**Code Reusability:**
- Extract repeated logic to `src/utils/`
- Create shared components in `src/components/`
- Use WordPress components when possible (don't rebuild what exists)
- Document shared utilities with JSDoc comments

```javascript
/**
 * Calculate responsive grid columns based on device type.
 *
 * @param {string} device - Device type ('desktop', 'tablet', 'mobile')
 * @param {Object} attributes - Block attributes containing column settings
 * @return {number} Number of columns for the device
 */
export const getResponsiveColumns = (device, attributes) => {
  // Implementation
};
```

**Comments & Documentation:**
- Add JSDoc for all exported functions
- Explain WHY, not WHAT (code shows what)
- Document non-obvious WordPress patterns
- Add TODO comments with issue numbers

```javascript
// ✅ GOOD - Explains reasoning
// Force white text on dark overlay for WCAG 2.1 AA compliance
color: '#ffffff !important';

// ❌ BAD - States the obvious
// Set color to white
color: '#ffffff';

// ✅ GOOD - Actionable TODO
// TODO: Migrate to @use when Dart Sass 3.0 is stable (Issue #123)

// ❌ BAD - Vague TODO
// TODO: Fix this later
```

**Development Workflow:**
- Run linters before committing: `npm run lint:js`, `npm run lint:css`
- Test in both editor and frontend before considering complete
- Verify build output after changes: `npx wp-scripts build && ls -lh build/`
- Keep wp-env running during development: `npx wp-env start`

**Error Handling:**
```javascript
// Always validate user input
const handleUrlChange = (value) => {
  // Validate before saving
  if (!value || value.match(/^https?:\/\//)) {
    setAttributes({ url: value });
  } else {
    // Optionally show error to user
    console.warn('Invalid URL format');
  }
};
```

**Build Optimization:**
- Monitor bundle sizes after every change
- Use code splitting for large features
- Lazy load heavy dependencies
- Remove console.log statements before committing

```bash
# Check bundle size impact
ls -lh build/index.js build/style-index.css
```

**Testing Setup:**
- Write tests for complex logic (utils, calculations)
- Test edge cases (empty attributes, invalid values)
- Use Playwright for E2E tests
- Test with multiple themes (Twenty Twenty-Four, Twenty Twenty-Five)

**Code Consistency:**
- Use ESLint and Prettier configurations
- Follow WordPress coding standards
- Use consistent quote style (single quotes for JS)
- Use consistent spacing (tabs vs spaces as per .editorconfig)

**Git Workflow:**
- Commit messages: `type: description` (feat, fix, refactor, docs, style, chore)
- Commit frequently with small, focused changes
- Don't commit build output or node_modules
- Review your own changes before committing

**Performance Considerations:**
- Avoid expensive operations in render (move to useMemo if needed)
- Don't query DOM in React components
- Use CSS for styling, not JavaScript
- Lazy load blocks that aren't commonly used

**Maintainability Red Flags:**
- [ ] Files > 300 lines (consider splitting)
- [ ] Functions > 50 lines (consider extracting)
- [ ] Nested ternaries > 2 levels (use if/else or switch)
- [ ] Duplicate code across 3+ files (extract to shared utility)
- [ ] Hard-coded magic numbers (use constants)
- [ ] Complex regex without explanation comment
- [ ] Callbacks nested > 3 levels (refactor)

**Quick Wins for Maintainability:**
1. Add TypeScript-style JSDoc for autocomplete
2. Extract magic numbers to named constants
3. Add helpful error messages
4. Group related imports
5. Add section comments for large files
6. Remove dead code immediately
7. Keep functions focused (single responsibility)
8. Use destructuring to make intent clear

---

## Refactoring Process

### 1. Analyze Current Code

**Read the target files and identify:**

**Anti-Patterns to Remove:**
- [ ] `useEffect()` for styling
- [ ] `querySelector()` or direct DOM access
- [ ] Plain `<InnerBlocks />` without `useInnerBlocksProps`
- [ ] Hardcoded spacing values (use theme tokens)
- [ ] Missing FSE supports
- [ ] No block example
- [ ] Unescaped PHP output
- [ ] Non-internationalized strings

**Code Smells:**
- [ ] Versioned files (file-v2.js, file-old.scss)
- [ ] Unused imports
- [ ] Commented-out code blocks
- [ ] console.log statements
- [ ] Duplicate WordPress functionality
- [ ] Complex features that don't work reliably

**Check Documentation:**
- Read `.claude/CLAUDE.md` for project-specific patterns
- Reference `docs/BEST-PRACTICES-SUMMARY.md` for quick patterns
- Reference `docs/BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md` for deep dives

### 2. Plan Refactor

**Create todo list with specific tasks:**
- List files that need changes
- Note breaking changes (attribute migrations needed?)
- Identify opportunities to simplify
- Plan deprecation strategy if needed
- Estimate bundle size impact

### 3. Execute Refactor

**Make changes incrementally:**

**For Blocks with InnerBlocks:**
1. Replace `<InnerBlocks />` with `useInnerBlocksProps` pattern
2. Move styles from `useEffect` to declarative style objects
3. Remove DOM queries and manipulation
4. Update save.js to match edit.js exactly
5. Provide deprecation for old save format

**For All Blocks:**
1. Add/update FSE supports in block.json
2. Add block example for pattern library
3. Replace hardcoded values with theme tokens
4. Add ARIA labels to custom controls
5. Escape all PHP output
6. Internationalize all strings
7. Remove unused imports and dead code

**For Extensions:**
1. Verify they're truly simple (≤3 controls)
2. If complex, consider converting to custom block
3. Ensure they work WITH WordPress, not against it

**Update Related Files:**
- Import new styles in `src/styles/style.scss` (frontend)
- Import new styles in `src/styles/editor.scss` (editor)
- Update PHP includes if needed
- Update frontend.js (remove layout code if moving to declarative styles)

### 4. Verify Build

```bash
# Build
npx wp-scripts build

# Check output
ls -lh build/
cat build/style-index.css | grep "your-class-name"

# Verify bundle sizes are within budgets
```

### 5. Test Thoroughly

**Editor Testing:**
- [ ] Block loads without errors
- [ ] Controls work as expected
- [ ] Styles apply immediately (no delay)
- [ ] WordPress native controls still work
- [ ] Block inserter works
- [ ] No console errors

**Frontend Testing:**
- [ ] Frontend matches editor exactly
- [ ] Styles work without JavaScript
- [ ] Responsive behavior correct
- [ ] No flash of unstyled content (FOUC)
- [ ] Interactive elements work (buttons, links)

**FSE Testing:**
- [ ] Block appears in Site Editor
- [ ] Preview shows in pattern library
- [ ] Global styles can be applied
- [ ] Theme spacing tokens work
- [ ] Works with Twenty Twenty-Five theme

**Accessibility Testing:**
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Contrast meets WCAG 2.1 AA
- [ ] Focus indicators visible

### 6. Validate Performance

**Check bundle sizes:**
```bash
ls -lh build/*.js build/*.css
```

**If over budget:**
- Code split per block
- Remove unused dependencies
- Tree-shake imports
- Lazy load heavy features

---

## Common Refactoring Scenarios

### Scenario 1: Block Uses useEffect for Styling

**Symptoms:**
- Styles don't apply in editor or have delays
- Editor doesn't match frontend
- Race conditions, timing issues

**Fix:**
1. Remove `useEffect` hooks
2. Calculate styles declaratively from attributes
3. Use `useInnerBlocksProps` with style object
4. Update save.js to match
5. Test immediately in editor and frontend

### Scenario 2: Plain InnerBlocks Breaking Layouts

**Symptoms:**
- Grid/flexbox layouts don't work
- Content width constraints ignored
- Extra wrapper divs in markup

**Fix:**
```javascript
// ❌ BEFORE
<div style={{ maxWidth: '800px' }}>
  <InnerBlocks />
</div>

// ✅ AFTER
const innerBlocksProps = useInnerBlocksProps({
  style: { maxWidth: '800px' }
});
return <div {...innerBlocksProps} />;
```

### Scenario 3: Complex Feature That Doesn't Work

**Symptoms:**
- CSS variables not applying
- Dynamic styles failing
- User feedback: "This isn't working"

**Fix:**
1. Simplify to fixed, well-designed options
2. Replace color pickers with preset choices
3. Use CSS classes instead of dynamic inline styles
4. User says "Let's just have a toggle" → Do it!

### Scenario 4: Missing FSE Support

**Symptoms:**
- Block doesn't appear in Site Editor
- No preview in pattern library
- Can't apply global styles

**Fix:**
1. Add comprehensive supports to block.json
2. Add example with innerBlocks
3. Use theme spacing/color tokens
4. Test with Twenty Twenty-Five

### Scenario 5: Frontend Styles Missing

**Symptoms:**
- Works in editor
- Broken on frontend

**Fix:**
1. Import styles in `src/styles/style.scss`
2. Rebuild: `npx wp-scripts build`
3. Verify: `grep "your-class" build/style-index.css`

### Scenario 6: Versioned Files and Dead Code

**Symptoms:**
- Multiple versions of same file
- Commented-out code blocks
- Unused imports

**Fix:**
1. Delete all versioned files (Git is version control)
2. Remove commented code
3. Remove unused imports
4. Clean sweep after architectural pivots

### Scenario 7: Accessibility Issues

**Symptoms:**
- Overlay makes text unreadable
- No keyboard navigation
- Poor contrast

**Fix:**
1. Force white text on dark overlays with `!important`
2. Add ARIA labels to all custom controls
3. Test with keyboard only
4. Run axe DevTools

### Scenario 8: Security Vulnerabilities

**Symptoms:**
- Unescaped output in PHP
- No input validation
- XSS vulnerabilities

**Fix:**
1. Escape all PHP output: `esc_html()`, `esc_url()`, `wp_kses_post()`
2. Validate all user input in JavaScript
3. Sanitize before saving attributes

### Scenario 9: Performance Issues

**Symptoms:**
- Large bundle sizes
- Slow editor
- Heavy frontend JS

**Fix:**
1. Remove DOM manipulation (use declarative styles)
2. Remove layout code from frontend.js (use inline styles)
3. Tree-shake imports
4. Code split per block
5. Measure before/after with `ls -lh build/`

### Scenario 10: Poor Code Maintainability

**Symptoms:**
- Hard to understand or modify code
- Duplicate code across files
- Large, monolithic files
- No documentation or comments
- Inconsistent naming
- Hard-coded magic numbers

**Fix:**
1. **Extract Shared Logic:**
   ```javascript
   // ❌ BEFORE - Duplicated in 3 blocks
   const columns = device === 'mobile' ? mobileColumns :
                   device === 'tablet' ? tabletColumns :
                   desktopColumns;

   // ✅ AFTER - Shared utility
   // src/utils/responsive.js
   export const getResponsiveValue = (device, values) => {
     return values[device] || values.desktop;
   };
   ```

2. **Split Large Files:**
   - Extract controls to separate components
   - Move style calculations to utility functions
   - Separate concerns (data, presentation, logic)

3. **Add Documentation:**
   ```javascript
   /**
    * Calculates inner container styles based on layout type.
    * Supports grid, flex, and stack layouts with responsive columns.
    *
    * @param {Object} attributes - Block attributes
    * @param {string} attributes.layoutType - Layout type (grid/flex/stack)
    * @param {number} attributes.columns - Number of columns
    * @return {Object} React style object for inner container
    */
   export const calculateInnerStyles = (attributes) => {
     // Implementation
   };
   ```

4. **Use Named Constants:**
   ```javascript
   // ❌ BEFORE
   if (columns > 6) { /* ... */ }

   // ✅ AFTER
   const MAX_GRID_COLUMNS = 6;
   if (columns > MAX_GRID_COLUMNS) { /* ... */ }
   ```

5. **Consistent Naming:**
   - Attributes: `layoutType`, `gridColumns`, `enableOverlay`
   - CSS classes: `dsg-container`, `dsg-container__inner`, `dsg-container--hero`
   - Functions: `calculateStyles`, `handleLayoutChange`, `getResponsiveColumns`

6. **Add Inline Comments for Complex Logic:**
   ```javascript
   // Calculate aspect ratio for video background to maintain 16:9
   // even when container is resized or on different screen sizes
   const aspectRatio = (height / width) * 100;
   ```

---

## Migration Checklist (For Breaking Changes)

If refactoring changes save format or attributes:

```javascript
// block.json
{
  "deprecated": [
    {
      "attributes": { /* old attributes */ },
      "supports": { /* old supports */ },
      "migrate": function(attributes) {
        return {
          // Map old to new
          newAttribute: attributes.oldAttribute
        };
      },
      "save": function(props) {
        // Old save function
      }
    }
  ]
}
```

**Test:**
1. Create block with old version
2. Update plugin
3. Edit block (should auto-migrate)
4. No "invalid content" error

---

## After Refactoring Checklist

**Build & Code Quality:**
- [ ] `npx wp-scripts build` completes without errors
- [ ] No Sass deprecation warnings (or noted for future)
- [ ] No console warnings/errors
- [ ] Bundle sizes within budgets
- [ ] No versioned files
- [ ] Imports up to date
- [ ] Comments reflect current implementation

**Functionality:**
- [ ] Works in editor (block editor)
- [ ] Works on frontend (published post)
- [ ] Works in Site Editor (FSE)
- [ ] Responsive behavior intact
- [ ] No duplicate WordPress controls
- [ ] WordPress toolbar still works
- [ ] Interactive elements work (buttons, links)

**WordPress Patterns:**
- [ ] Uses `useBlockProps()` correctly
- [ ] Uses `useInnerBlocksProps()` for nested blocks (not plain `<InnerBlocks />`)
- [ ] No `useEffect()` for styling
- [ ] No DOM manipulation
- [ ] Edit.js matches save.js markup exactly
- [ ] Uses theme spacing/color tokens

**FSE Compatibility:**
- [ ] Block appears in Site Editor inserter
- [ ] Preview shows in pattern library
- [ ] Global styles can be applied
- [ ] Theme.json integration works
- [ ] Example provided in block.json

**Accessibility:**
- [ ] WCAG 2.1 AA contrast (4.5:1)
- [ ] Keyboard navigation works
- [ ] ARIA labels on custom controls
- [ ] Screen reader tested
- [ ] Focus indicators visible
- [ ] Semantic HTML

**Security:**
- [ ] All PHP output escaped
- [ ] All user input validated
- [ ] External links have `noopener noreferrer`
- [ ] No XSS vulnerabilities

**Internationalization:**
- [ ] All user-facing strings use `__()`
- [ ] Text domain is 'designsetgo'
- [ ] Translator comments added for context

**Performance:**
- [ ] Frontend JS < 5 KB (or lazy loaded)
- [ ] CSS < 3 KB per block
- [ ] No unnecessary dependencies
- [ ] Layouts work without JavaScript

**Documentation:**
- [ ] Update `.claude/CLAUDE.md` with new learnings
- [ ] Document breaking changes
- [ ] Update block README if applicable

**Maintainability:**
- [ ] No files > 300 lines
- [ ] No functions > 50 lines
- [ ] No duplicate code across multiple files
- [ ] Named constants instead of magic numbers
- [ ] JSDoc comments on exported functions
- [ ] Consistent naming conventions (BEM for CSS, camelCase for JS)
- [ ] Shared utilities extracted to `src/utils/`
- [ ] Complex logic has explanatory comments
- [ ] No nested ternaries > 2 levels
- [ ] Imports grouped and organized

---

## Output Format

Provide a comprehensive summary:

### Refactoring Summary

**Files Changed:**
- List all modified files with brief description of changes

**Anti-Patterns Removed:**
- useEffect for styling → Declarative styles
- Plain InnerBlocks → useInnerBlocksProps
- DOM manipulation → React props
- Etc.

**Improvements Made:**
- Added FSE supports
- Improved accessibility (ARIA labels, contrast)
- Reduced bundle size by X KB
- Added internationalization
- Fixed security issues
- Improved maintainability (extracted utilities, added docs, consistent naming)
- Etc.

**Performance Impact:**
- Before: X KB → After: Y KB
- Percentage change: -Z%

**Maintainability Improvements:**
- Extracted shared utilities: List utilities created
- Reduced file sizes: List files that were split or reduced
- Added documentation: JSDoc added to X functions
- Consistent naming: Renamed X attributes/classes/functions
- Removed duplicate code: X instances of duplication eliminated
- Added constants: Replaced X magic numbers with named constants

**Breaking Changes:**
- List any attribute changes
- Migration strategy provided: Yes/No
- Deprecation added: Yes/No

**Testing Results:**
- [ ] Editor: Pass/Fail
- [ ] Frontend: Pass/Fail
- [ ] FSE: Pass/Fail
- [ ] Accessibility: Pass/Fail
- [ ] Performance: Pass/Fail

**Code Quality Metrics:**
- Lines of code: Before X → After Y
- Number of files: Before X → After Y
- Largest file size: Before X lines → After Y lines
- Cyclomatic complexity: Reduced/Same/Increased
- Test coverage: X% (if applicable)
- Linter warnings: Before X → After Y

**Recommendations:**
- Future improvements
- Technical debt to address
- New features to consider
- Remaining maintainability issues to address

---

## Reference Documentation

**Quick Reference:**
- `docs/BEST-PRACTICES-SUMMARY.md` - Copy-paste ready patterns

**Comprehensive Guide:**
- `docs/BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md` - Deep dives

**Project Learnings:**
- `.claude/CLAUDE.md` - DesignSetGo-specific patterns

**WordPress Docs:**
- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [useBlockProps](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops)
- [useInnerBlocksProps](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useinnerblocksprops)

---

Now, what would you like to refactor?
