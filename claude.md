# Claude Code Learnings - DesignSetGo Plugin

This document captures key learnings and technical insights from working on the DesignSetGo WordPress plugin.

## Architecture Decisions

### Extension-Only Approach
**Decision**: Use block extensions via filters instead of custom blocks.

**Why**:
- Works WITH WordPress's native layout system rather than fighting it
- Reduces maintenance burden - WordPress handles core functionality
- Prevents conflicts with theme and core updates
- Eliminates build complexity for custom blocks

**Implementation**:
- Use `addFilter('blocks.registerBlockType')` to add attributes
- Use `addFilter('editor.BlockEdit')` to add controls
- Use `addFilter('blocks.getSaveContent.extraProps')` to add classes/data attributes

### Frontend Asset Loading
**Critical Learning**: Frontend styles MUST be explicitly imported.

**Problem**: Made changes to group enhancement styles, but they only appeared in editor, not frontend.

**Root Cause**: `src/styles/style.scss` wasn't importing group enhancement styles, so `build/style-index.css` didn't include them.

**Fix**:
```scss
// src/styles/style.scss
@import '../extensions/group-enhancements/styles';
```

**Verification Method**:
```bash
grep -i "has-dsg-overlay" build/style-index.css
```

## UI/UX Patterns

### Simplicity Over Flexibility
**Learning**: When a complex feature doesn't work reliably, simplify it.

**Case Study - Overlay Color**:
- **Initial Approach**: Color picker with opacity slider, dynamic CSS variables
- **Problem**: CSS variables weren't being applied to DOM elements
- **User Feedback**: "This isn't working. Let's just have a toggle"
- **Final Solution**: Boolean toggle with fixed `rgba(0, 0, 0, 0.75)`
- **Result**: Simpler, more reliable, easier to maintain

**Takeaway**: Fixed, well-designed defaults often beat complex customization.

### Accessibility First
**Learning**: Always consider contrast and readability when adding overlay features.

**Problem**: Dark overlay (75% black) could make text unreadable if theme uses light text.

**Solution**: Force white text color when overlay is enabled:
```scss
.has-dsg-overlay {
    color: #ffffff !important;

    h1, h2, h3, h4, h5, h6, p, a, span {
        color: #ffffff !important;
    }
}
```

**Why `!important`**: Must override theme styles to ensure readability. Accessibility > CSS specificity rules.

## Technical Patterns

### Clickable Groups Without Interfering with Interactive Elements
**Pattern**: Make entire group clickable, but detect and preserve nested interactive elements.

**Implementation**:
```javascript
group.addEventListener('click', function (e) {
    const isInteractive =
        e.target.tagName === 'A' ||
        e.target.tagName === 'BUTTON' ||
        e.target.closest('a') ||
        e.target.closest('button');

    if (!isInteractive) {
        window.location.href = linkUrl;
    }
});
```

**Why**: Allows card-style clickable containers while preserving button/link functionality inside.

### Security for External Links
**Pattern**: Always add `noopener noreferrer` when opening links in new tabs.

**Why**: Prevents new window from accessing `window.opener` (security risk).

**Implementation**:
```javascript
if (linkTarget === '_blank') {
    const newWindow = window.open(linkUrl, '_blank');
    if (newWindow) {
        newWindow.opener = null;
    }
}
```

## WordPress-Specific Learnings

### Block Category Ordering
**How to Make Custom Category First**:
```php
public function register_block_category( $categories ) {
    return array_merge(
        array(
            array(
                'slug'  => 'designsetgo',
                'title' => __( 'DesignSetGo', 'designsetgo' ),
            ),
        ),
        $categories  // New category first, then existing
    );
}
```

### Block Variations Cleanup
**Learning**: Fewer, better variations > many mediocre ones.

**Original**: 5 variations (Hero, 3-Column Grid, Card Grid, Centered Container, Side by Side)

**Final**: 2 variations (Hero Section, Responsive Grid)

**Why**:
- Removed redundant patterns
- Cleaner block inserter UI
- Users can customize from base variations

## Debugging Techniques

### 500 Internal Server Error - Block Assets
**Symptom**: `GET /wp-admin/post.php?post=7&action=edit 500`

**Debug Process**:
1. Check PHP error logs: `npx wp-env logs`
2. Found: `Failed opening required 'build/blocks/container/index.asset.php'`
3. Root cause: `block.json` existed but JS wasn't compiled

**Fix**: Remove custom blocks entirely, use extensions only.

### CSS Not Applying - Missing Imports
**Debug Process**:
1. Check if CSS exists in build: `cat build/style-index.css`
2. Search for specific class: `grep -i "has-dsg-overlay" build/style-index.css`
3. If missing, check source imports in `src/styles/style.scss`

### Dynamic Styles Not Applying
**Symptom**: Console shows style object created, but not in DOM.

**Debugging**:
```javascript
console.log('Attributes:', { dsgOverlayColor });
console.log('Style object:', overlayStyles);
// Then inspect HTML element to see if style attribute exists
```

**Finding**: `editor.BlockListBlock` filter doesn't reliably apply inline styles.

**Solution**: Use CSS classes instead of dynamic inline styles.

## Build Process

### When to Rebuild
Always rebuild after changes to:
- SCSS files (`.scss`)
- JavaScript files (`.js`, `.jsx`)
- Block attributes or controls

**Command**:
```bash
npx wp-scripts build
```

### Build Output Verification
Check what got compiled:
```bash
ls -lh build/                    # See file sizes
cat build/style-index.css       # Frontend styles
cat build/index.css             # Editor styles
cat build/index.js              # Block extensions JS
```

### Sass Deprecation Warnings
**Warning**: `Sass @import rules are deprecated`

**Fix** (future): Migrate to `@use` and `@forward`:
```scss
// Instead of:
@import 'variables';

// Use:
@use 'variables';
```

**Note**: Not critical for now, but plan migration before Dart Sass 3.0.0.

## File Organization

### Extension Structure
```
src/extensions/group-enhancements/
├── index.js         # Block registration, attributes, controls
├── styles.scss      # Frontend styles
├── editor.scss      # Editor-only styles
└── frontend.js      # Frontend JavaScript (clickable groups, etc.)
```

### Style Imports
```
src/
├── index.js                    # Main entry - imports everything
├── styles/
│   ├── style.scss             # Frontend entry - imports all frontend styles
│   └── editor.scss            # Editor entry - imports all editor styles
└── extensions/
    └── group-enhancements/
        ├── styles.scss        # Must be imported in style.scss
        └── editor.scss        # Must be imported in editor.scss
```

**Critical**: Extensions' styles must be explicitly imported in main style files, or they won't be compiled into build output.

## Code Quality

### When to Use `!important`
**Guideline**: Avoid `!important` EXCEPT when:
1. **Accessibility requirement** - Must override theme for readability (e.g., white text on dark overlay)
2. **User expectation** - Feature explicitly chosen should take precedence (e.g., responsive grid columns)
3. **WordPress core override** - Need to override core block styles for enhancement to work

### Clean Code After Pivots
When making architectural changes:
1. Remove unused code immediately
2. Delete abandoned approaches (e.g., container custom block)
3. Clean up imports (remove unused React hooks, components)
4. Update comments to reflect current implementation

**Example**: After simplifying overlay from color picker to toggle:
- Removed `useEffect`, `__experimentalPanelColorGradientSettings`
- Removed CSS variable logic
- Removed data attribute handling
- Updated comments from "dynamic overlay color" to "fixed dark overlay"

## Testing Strategy

### Local Development
1. Run wp-env: `npx wp-env start`
2. Build plugin: `npx wp-scripts build`
3. Test in editor: Create/edit post
4. Test on frontend: View published post
5. Test responsive: Use browser DevTools device emulation

### Verification Checklist
- [ ] Changes appear in editor
- [ ] Changes appear on frontend
- [ ] Changes work on mobile (responsive)
- [ ] Accessibility: Contrast, keyboard navigation
- [ ] Interactive elements still work (buttons, links)
- [ ] No console errors
- [ ] Build completes without errors

## User Feedback Patterns

### When User Says "It's Not Working"
1. **Ask for specifics**: Editor or frontend? What's expected vs. actual?
2. **Get console output**: JavaScript errors? Network errors?
3. **Check build**: Did changes compile? File sizes increased?
4. **Verify deployment**: Changes copied to Docker/Local WP?

### Simplification Triggers
User phrases that signal need to simplify:
- "This isn't working"
- "Let's just..."
- "Instead of [complex feature]..."
- "Can we make it simpler?"

**Response**: Immediately pivot to simpler solution, don't try to fix complex approach.

## WordPress Block Editor Quirks

### CSS Variable Limitations
- Block wrapper elements don't reliably accept inline style attributes from filters
- Use CSS classes instead of dynamic inline styles
- If you need dynamic values, use data attributes + CSS `attr()` or JavaScript

### Grid Layout Enhancement
WordPress sets `display: grid` via theme.json/layout settings. To enhance:
```scss
.dsg-grid-enhanced {
    // Override column count, WordPress handles display: grid
    &.dsg-grid-cols-3 {
        grid-template-columns: repeat(3, 1fr) !important;
    }
}
```

**Don't**: Try to set `display: grid` yourself - WordPress already does it.

### Hide WordPress Controls
To hide redundant WordPress controls when your enhancement is active:
```scss
body:has(.wp-block-group.is-selected.dsg-grid-enhanced) {
    .block-editor-hooks__layout-controls
    .components-base-control:has(input[aria-label*='Columns' i]) {
        display: none !important;
    }
}
```

**Why**: Prevents confusion from duplicate controls (WordPress columns + your responsive columns).

## Common Pitfalls

### 1. Forgetting Frontend Imports
**Mistake**: Adding styles to `src/extensions/*/styles.scss` but not importing in `src/styles/style.scss`.

**Result**: Works in editor, broken on frontend.

**Prevention**: Always update both source file AND import file.

### 2. Custom Block Asset Dependencies
**Mistake**: Creating `block.json` for custom block without ensuring build process compiles it.

**Result**: 500 error - WordPress looks for `index.asset.php` that doesn't exist.

**Prevention**: If using custom blocks, verify build output in `build/blocks/*/` directory.

### 3. Assuming CSS Specificity Works
**Mistake**: Expecting your styles to override theme without `!important`.

**Result**: Styles work in isolation but fail with real themes.

**Prevention**: Test with popular themes (Twenty Twenty-Four, etc.), use `!important` when necessary for user-chosen features.

### 4. Not Testing Frontend
**Mistake**: Only testing in block editor, assuming frontend works.

**Result**: Frontend broken, user discovers after deploy.

**Prevention**: ALWAYS test both editor AND frontend before considering feature complete.

## Version Control Best Practices

### Commit Messages for This Plugin
Format: `type: description`

Types:
- `feat:` - New feature (clickable groups, overlay)
- `fix:` - Bug fix (500 error, CSS not loading)
- `refactor:` - Code restructure (remove custom blocks)
- `style:` - CSS/SCSS changes
- `docs:` - Documentation updates
- `chore:` - Build, dependencies, cleanup

**Examples**:
```
feat: Add clickable group blocks with link settings
fix: Remove custom block causing 500 error
refactor: Simplify overlay from color picker to toggle
style: Add white text contrast for dark overlay
docs: Update claude.md with accessibility learnings
```

### What to Commit
- Source files (`src/`)
- PHP files (`includes/`, `*.php`)
- Configuration (`package.json`, `block.json`)
- Documentation (`*.md`)

### What NOT to Commit
- Build output (`build/`)
- Dependencies (`node_modules/`)
- WordPress environment (`wp-env/`)
- Logs

## Future Improvements

### Potential Enhancements
1. **Custom breakpoints** - Let users define tablet/mobile breakpoints
2. **Overlay opacity slider** - After CSS variable issue is resolved
3. **Animation presets** - Scroll-triggered animations
4. **Spacing presets** - Common padding/margin combinations
5. **Color scheme generator** - Auto-generate complementary colors

### Technical Debt
1. Migrate from `@import` to `@use`/`@forward` for Sass
2. Add unit tests for frontend JavaScript
3. Add E2E tests for block interactions
4. Optimize CSS bundle size (currently ~4.25 KiB, could be smaller)
5. Add translation support for all strings

## Resources

### Documentation
- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [Gutenberg Filters Reference](https://developer.wordpress.org/block-editor/reference-guides/filters/)
- [@wordpress/scripts Documentation](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)

### Tools
- [WordPress Playground](https://playground.wordpress.net/) - Quick testing
- [Block Editor Development Tools](https://wordpress.org/plugins/gutenberg-development-tools/) - Debug blocks
- [Query Monitor](https://wordpress.org/plugins/query-monitor/) - Debug PHP/SQL

### Community
- [WordPress Development Stack Exchange](https://wordpress.stackexchange.com/)
- [Gutenberg GitHub Issues](https://github.com/WordPress/gutenberg/issues)
- [Advanced WordPress Facebook Group](https://www.facebook.com/groups/advancedwp/)

---

**Last Updated**: 2025-10-23
**Plugin Version**: 1.0.0
**WordPress Compatibility**: 6.4+
