# DesignSetGo Refactoring Checklist

**Created:** October 25, 2025  
**Total Tasks:** 47  
**Estimated Time:** 60-80 hours

---

## Phase 1: Critical Cleanup (2-3 hours)

### Delete Duplicate Files (Root Directory)
- [ ] /.editorconfig 2
- [ ] /.eslintrc 2.js
- [ ] /.gitignore 2
- [ ] /.prettierrc 2
- [ ] /.stylelintrc 2.json
- [ ] /DEV-PHASE-1 2.md
- [ ] /PRD 2.md
- [ ] /README 2.md
- [ ] /package 2.json
- [ ] /airo-blocks.php
- [ ] /test-assets.php

### Delete Duplicate Directories
- [ ] /includes/admin 2/
- [ ] /includes/blocks 2/
- [ ] /includes/patterns 2/
- [ ] /src/styles 2/
- [ ] /src/utils 2/

### Verify Build Process
- [ ] Confirm no build references to deleted files
- [ ] Run npm run build successfully
- [ ] Test plugin loads without errors
- [ ] Verify all block assets compile

---

## Phase 2: Code Quality Fixes (8-10 hours)

### Fix useEffect Anti-Pattern

#### File: `/src/blocks/tabs/edit.js`
- [ ] Replace useEffect ID generation (lines 48-52)
- [ ] Fix querySelector usage (lines 104-108)
- [ ] Remove inline styles (line 115+)
- [ ] Test in block editor

#### File: `/src/blocks/tab/edit.js`
- [ ] Replace useEffect ID generation (lines 39-43, 46-54)
- [ ] Fix hardcoded preview styles (lines 162-167)
- [ ] Add JSDoc comments
- [ ] Test active/inactive tab switching

#### File: `/src/blocks/accordion-item/edit.js`
- [ ] Replace useEffect ID generation (lines 45-51)
- [ ] Verify dependencies array ([uniqueId, setAttributes])
- [ ] Add JSDoc comments
- [ ] Test open/closed state

#### File: `/src/blocks/counter/index.js`
- [ ] Replace useEffect ID generation (lines 55-61)
- [ ] Extract magic numbers to constants
- [ ] Add JSDoc comments
- [ ] Test counter value display

### Extract Inline Styles

#### File: `/src/blocks/container/edit.js`
- [ ] Extract preview styles (lines 162-167) to CSS
- [ ] Extract video background styles (lines 598-632) to CSS
- [ ] Extract overlay styles (lines 640-650) to CSS
- [ ] Verify visual appearance unchanged

#### File: `/src/blocks/tab/edit.js`
- [ ] Extract icon preview styling (lines 162-167) to CSS class

#### File: `/src/blocks/counter/index.js`
- [ ] Extract textAlign style (line 84) to CSS or class

### Remove Console Statements

#### File: `/src/blocks/counter-group/frontend.js`
- [ ] Remove or gate `console.error()` (line 132)
- [ ] Verify fallback still works

---

## Phase 3: FSE Compliance (5-8 hours)

### Add Block Examples

#### File: `/src/blocks/tab/block.json`
- [ ] Add "example" section with sample tab
- [ ] Include innerBlocks with paragraph

#### File: `/src/blocks/accordion-item/block.json`
- [ ] Add "example" section with sample item
- [ ] Include innerBlocks with paragraph

#### File: `/src/blocks/counter/block.json`
- [ ] Add "example" section with sample counter
- [ ] Include endValue and suffix

### Enhance block.json Supports

#### File: `/src/blocks/accordion-item/block.json`
- [ ] Add `layout` support
- [ ] Add `dimensions` support (minHeight)
- [ ] Add `shadow` support
- [ ] Add `position` support

#### File: `/src/blocks/tab/block.json`
- [ ] Add `layout` support
- [ ] Add `dimensions` support
- [ ] Add `shadow` support
- [ ] Add `typography` enhancements

#### File: `/src/blocks/counter/block.json`
- [ ] Add `layout` support
- [ ] Add `dimensions` support
- [ ] Add `typography` support

### Test FSE Compatibility
- [ ] Activate Twenty Twenty-Five theme
- [ ] Test blocks in Site Editor
- [ ] Verify global styles apply correctly
- [ ] Test pattern insertion
- [ ] Check layout switching functionality

---

## Phase 4: i18n & Documentation (4-5 hours)

### Add Internationalization

#### File: `/src/blocks/counter-group/block.json`
- [ ] Wrap example labels in __() function
- [ ] Update "Happy Customers" string
- [ ] Update "Revenue Generated" string
- [ ] Update "Uptime" string
- [ ] Verify all strings use 'designsetgo' text domain

#### All Block Files
- [ ] Audit all user-facing strings
- [ ] Ensure all are wrapped in __() or _n()
- [ ] Verify text domain is 'designsetgo'

### Add JSDoc Documentation

#### File: `/src/blocks/container/frontend.js`
- [ ] Add JSDoc for initVideoBackgrounds()
- [ ] Add JSDoc for loadVideoBackground()
- [ ] Add JSDoc for initClickableContainers()
- [ ] Add JSDoc for handleContainerClick()
- [ ] Add JSDoc for sanitizeUrl()

#### File: `/src/blocks/tabs/frontend.js`
- [ ] Add JSDoc for DSGTabs class
- [ ] Add JSDoc for init()
- [ ] Add JSDoc for buildNavigation()
- [ ] Add JSDoc for setActiveTab()
- [ ] Add JSDoc for all methods

#### File: `/src/blocks/accordion/frontend.js`
- [ ] Add JSDoc for initAccordions()
- [ ] Add JSDoc for openPanel()
- [ ] Add JSDoc for closePanel()
- [ ] Add JSDoc for helper functions

---

## Phase 5: Security & Accessibility (6-8 hours)

### Security Audit

#### PHP Files
- [ ] Check `/includes/helpers.php` for unescaped output
- [ ] Verify all echo statements use esc_html/esc_url
- [ ] Verify wp_kses_post for content
- [ ] Check nonce handling where needed
- [ ] Verify capability checks on admin pages

#### JavaScript Files
- [ ] Verify URL validation in MediaUpload
- [ ] Check input sanitization in all forms
- [ ] Verify no direct eval() usage
- [ ] Check for proper error handling

### Accessibility Testing

#### Keyboard Navigation
- [ ] Test Tab navigation on all blocks
- [ ] Test arrow keys on Tabs block
- [ ] Test arrow keys on Accordion
- [ ] Test Enter/Space on all buttons
- [ ] Test Home/End keys where applicable
- [ ] Verify focus indicators visible
- [ ] Test with keyboard only (no mouse)

#### Color Contrast
- [ ] Test dark overlay contrast (WCAG AA)
- [ ] Test tab active/inactive contrast
- [ ] Test accordion open/closed contrast
- [ ] Use axe DevTools to scan
- [ ] Test with color contrast analyzer

#### Screen Reader Testing
- [ ] Test with VoiceOver (Mac)
- [ ] Test with NVDA (Windows)
- [ ] Verify proper ARIA labels
- [ ] Verify aria-hidden used correctly
- [ ] Check form labels and descriptions
- [ ] Test landmark regions

---

## Phase 6: Optimization (4-6 hours)

### Performance Optimization

#### File: `/src/blocks/icon/index.js`
- [ ] Memoize icon filtering with useMemo()
- [ ] Test performance with large icon list
- [ ] Verify search still responsive

#### Extract Magic Numbers
- [ ] `/src/blocks/container/edit.js` - max={40} gap
- [ ] `/src/blocks/tabs/edit.js` - max={40} gap, 768/1024 breakpoints
- [ ] `/src/blocks/counter/index.js` - min={0}, max={5} duration
- [ ] Create constants.js file
- [ ] Import and use constants

### Refactor Large Files

#### File: `/src/blocks/container/edit.js` (658 lines)
- [ ] Extract LayoutControls component
- [ ] Extract VideoBackgroundControls component
- [ ] Extract ResponsiveVisibilityControls component
- [ ] Extract LinkSettings component
- [ ] Extract OverlaySettings component
- [ ] Keep edit.js < 300 lines
- [ ] Update imports in main file
- [ ] Test all controls still work

#### File: `/src/blocks/counter/index.js` (357 lines)
- [ ] Extract CounterEdit component
- [ ] Extract CounterSave component
- [ ] Consider component composition
- [ ] Verify under 300 lines

### Performance Profiling
- [ ] Profile block editor performance
- [ ] Check bundle sizes with npx wp-scripts build --analyze
- [ ] Identify large files
- [ ] Optimize imports if needed
- [ ] Test with slow 3G network

---

## Code Quality Verification

### Testing

- [ ] Run `npm run build` without errors
- [ ] Run `npm run test` if available
- [ ] Run ESLint if configured
- [ ] Run Prettier formatting
- [ ] Verify no console errors in editor
- [ ] Verify no console errors on frontend
- [ ] Test all blocks in post editor
- [ ] Test all blocks in Site Editor
- [ ] Test responsive behavior

### Final Verification

- [ ] All 47 issues addressed or documented
- [ ] Code follows CLAUDE.md patterns
- [ ] No duplicate files/directories remaining
- [ ] No console.log statements in production code
- [ ] All user-facing strings translated
- [ ] All functions have JSDoc comments
- [ ] No useEffect anti-patterns
- [ ] No querySelector in editor code
- [ ] All blocks have examples
- [ ] Keyboard navigation works
- [ ] WCAG 2.1 AA compliant

---

## Completion Checklist

- [ ] Phase 1 complete and tested
- [ ] Phase 2 complete and tested
- [ ] Phase 3 complete and tested
- [ ] Phase 4 complete and tested
- [ ] Phase 5 complete and tested
- [ ] Phase 6 complete and tested
- [ ] All 47 issues resolved
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Tested on WordPress 6.5+
- [ ] Tested with Twenty Twenty-Five theme
- [ ] Ready for production release

---

## Progress Tracking

| Phase | Status | Hours | Completion |
|-------|--------|-------|-----------|
| Phase 1 | Not Started | 2-3 | 0% |
| Phase 2 | Not Started | 8-10 | 0% |
| Phase 3 | Not Started | 5-8 | 0% |
| Phase 4 | Not Started | 4-5 | 0% |
| Phase 5 | Not Started | 6-8 | 0% |
| Phase 6 | Not Started | 4-6 | 0% |
| **TOTAL** | **Not Started** | **60-80** | **0%** |

---

## Notes

- See CODE-AUDIT-REPORT.md for detailed issue descriptions
- See CLAUDE.md for WordPress best practices and patterns
- Use this checklist to track daily progress
- Update completion percentages as you work through items
- Create commits for each phase completion

---

**Last Updated:** October 25, 2025
**Report Version:** 1.0
**Auditor:** Claude Code
