Refactor code in the DesignSetGo WordPress plugin following best practices.

Ask the user what they want to refactor:
- A specific extension (e.g., "group-enhancements")
- A block variation
- Frontend JavaScript
- CSS/SCSS files
- PHP plugin files
- Build configuration
- General code cleanup

Then perform the refactor following these principles:

## Core Refactoring Principles

1. **Extension-First Architecture**
   - Prefer extending WordPress blocks over creating custom blocks
   - Work WITH WordPress attributes, not against them
   - Remove any code that duplicates WordPress functionality

2. **Conditional Logic**
   - Controls should only appear when relevant (e.g., grid controls when `layout.type === 'grid'`)
   - Remove hardcoded layout logic that conflicts with WordPress toolbar
   - Check WordPress state before showing custom controls

3. **No Versioned Files**
   - Remove any files with version suffixes (-v2.js, -v3.scss, etc.)
   - Git is our version control - delete old approaches
   - Keep only the active implementation

4. **WordPress Patterns**
   - Use WordPress layout attribute instead of custom layout systems
   - Don't override WordPress toolbar icons
   - Enhance WordPress features, don't replace them

5. **Code Quality**
   - Remove unused imports (React hooks, WordPress components)
   - Remove console.log statements
   - Remove commented-out code blocks
   - Use consistent naming (dsg prefix for all custom attributes)
   - Clean up after architectural pivots

6. **CSS Best Practices**
   - Use `!important` only for:
     - Accessibility requirements (e.g., white text on dark overlay)
     - User-chosen features that must override theme
     - WordPress core overrides when necessary
   - Import frontend styles in `src/styles/style.scss`
   - Import editor styles in `src/styles/editor.scss`
   - Target correct WordPress elements (.wp-block-group__inner-container)

7. **Simplification**
   - Replace complex dynamic solutions with simpler fixed options
   - Remove features that don't work reliably
   - Prefer fewer, better variations over many mediocre ones

## Refactoring Process

1. **Analyze Current Code**
   - Read the target files
   - Identify code smells (duplicates, conflicts, unused code)
   - Check for patterns from `.claude/claude.md` and `CLAUDE.md`

2. **Plan Refactor**
   - Create todo list with specific refactor tasks
   - Note breaking changes
   - Identify files that need updating

3. **Execute Refactor**
   - Make changes incrementally
   - Update imports when moving/removing code
   - Update comments to reflect current implementation
   - Remove abandoned approaches

4. **Verify Build**
   - Run `npx wp-scripts build`
   - Check build output for errors
   - Verify file sizes are reasonable
   - Search build output for expected classes/styles

5. **Test**
   - Verify changes work in editor
   - Verify changes work on frontend
   - Check responsive behavior
   - Ensure no console errors

## Common Refactoring Scenarios

### Scenario 1: Extension Conflicts with WordPress
**Symptoms**: Duplicate controls, layout toolbar not working
**Fix**: Remove custom layout logic, detect and enhance WordPress layout instead

### Scenario 2: Complex Feature That Doesn't Work
**Symptoms**: CSS variables not applying, dynamic styles failing
**Fix**: Simplify to fixed options with CSS classes instead

### Scenario 3: Versioned Files
**Symptoms**: Multiple versions of same file (index.js, index-v2.js)
**Fix**: Delete old versions, keep only active implementation

### Scenario 4: Missing Frontend Styles
**Symptoms**: Works in editor, broken on frontend
**Fix**: Import extension styles in `src/styles/style.scss`

### Scenario 5: Unused Code After Pivot
**Symptoms**: Imports for removed features, commented blocks, old approaches
**Fix**: Clean sweep - remove all unused imports, comments, and abandoned code

## After Refactoring

- [ ] Build completes without errors
- [ ] No console warnings/errors
- [ ] Works in editor
- [ ] Works on frontend
- [ ] Responsive behavior intact
- [ ] No duplicate WordPress controls
- [ ] WordPress toolbar still works
- [ ] File structure clean (no versioned files)
- [ ] Imports up to date
- [ ] Comments reflect current implementation

Provide a summary of changes made and any recommendations for future improvements.
