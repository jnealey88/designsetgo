# Handling Linting Errors During Git Commits

## The Problem

ESLint sometimes flags imports as "unused" during pre-commit checks, even when they're used in JSX. Blindly removing these imports can break your blocks.

## Safe Process for Handling "Unused Import" Errors

### 1. **Don't Remove Immediately**

When you see an error like:
```
error: 'ToggleControl' is defined but never used (no-unused-vars)
```

**DO NOT** immediately delete the import.

### 2. **Verify It's Actually Unused**

Use the verification script:

```bash
./scripts/verify-imports.sh src/blocks/card/edit.js ToggleControl
```

**Output if USED (DO NOT REMOVE):**
```
✅ FOUND - DO NOT remove this import:

391:					<ToggleControl
400:				<ToggleControl

This import IS being used in the file.
```

**Output if UNUSED (SAFE TO REMOVE):**
```
❌ NOT FOUND - Safe to remove this import
```

### 3. **Manual Verification**

Or manually check with grep:

```bash
# Search for usage (excluding the import line)
grep -n "ToggleControl" src/blocks/card/edit.js | grep -v "^[0-9]*:import"
```

If you see results, the import **IS** being used - don't remove it!

### 4. **If It's Actually Used But ESLint Complains**

Add an eslint-disable comment:

```javascript
import {
    PanelBody,
    SelectControl,
    // Component used in JSX below
    // eslint-disable-next-line @wordpress/no-unused-vars-before-return
    ToggleControl,
} from '@wordpress/components';
```

Or disable for the whole import block:

```javascript
/* eslint-disable @wordpress/no-unused-vars-before-return */
import {
    PanelBody,
    ToggleControl,
    RangeControl,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unused-vars-before-return */
```

## Quick Reference Checklist

Before removing any import during a lint error:

- [ ] Run `./scripts/verify-imports.sh <file> <import-name>`
- [ ] Or manually grep for usage: `grep -n "ImportName" file.js`
- [ ] Check if it's used in JSX (e.g., `<ToggleControl />`)
- [ ] Check if it's used in any sub-components
- [ ] If actually used, add eslint-disable comment instead

## Common False Positives

These are often flagged as unused but are actually used in JSX:

- `ToggleControl` - Used for toggles in inspector
- `RangeControl` - Used for sliders
- `TextControl` - Used for text inputs
- `SelectControl` - Used for dropdowns
- `__experimentalDivider as Divider` - Used for visual separators

## What Happened with Card Block

During a commit, ESLint flagged several imports as unused:
- ✅ `ToggleControl` - Flagged as unused, but used 6 times in JSX → Should NOT have been removed
- ✅ `RangeControl` - Flagged as unused, but used for overlay opacity → Should NOT have been removed
- ✅ `TextControl` - Flagged as unused, but used for custom aspect ratio → Should NOT have been removed
- ✅ `Divider` - Flagged as unused, but used twice for visual separation → Should NOT have been removed
- ✅ `AlignmentMatrixControl` - Flagged as unused, genuinely not used → Safe to remove
- ✅ `overlayColor` - Flagged as unused, genuinely not used → Safe to remove

**Lesson**: Always verify before removing. The linter isn't perfect with JSX usage detection.

## Prevention

1. Use the verification script before every removal
2. When in doubt, search the file manually
3. Test the block after making changes
4. Build and test in browser before committing

## Recovery

If you accidentally remove a used import:

1. Check git history: `git log --oneline src/blocks/card/edit.js`
2. See the diff: `git show <commit-hash>:src/blocks/card/edit.js`
3. Restore the import
4. Rebuild: `npm run build`
5. Test in browser with hard refresh (Cmd+Shift+R)
