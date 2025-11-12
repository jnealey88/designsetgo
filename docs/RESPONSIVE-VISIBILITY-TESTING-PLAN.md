# Responsive Visibility Extension - Testing Plan

**Extension:** Responsive Visibility
**Version:** 1.0.0
**Date:** 2025-11-12
**Related Docs:** [RESPONSIVE-VISIBILITY-EXTENSION-SPEC.md](RESPONSIVE-VISIBILITY-EXTENSION-SPEC.md)

---

## Overview

This document outlines the comprehensive testing strategy for the Responsive Visibility Extension, which adds device-based visibility controls to all WordPress blocks.

---

## Testing Scope

### What We're Testing

1. ✅ Attribute registration on all blocks
2. ✅ Inspector controls appearance and functionality
3. ✅ CSS class application (frontend and editor)
4. ✅ Visual indicator display
5. ✅ Visibility at different viewport sizes
6. ✅ Compatibility with core blocks
7. ✅ Compatibility with custom blocks
8. ✅ Editor functionality (no crashes, no validation errors)
9. ✅ Performance impact
10. ✅ Accessibility compliance

### Out of Scope

- ❌ Custom breakpoint definitions (not in v1)
- ❌ JavaScript-based visibility (CSS-only approach)
- ❌ Show-only mode (hide-only in v1)
- ❌ Integration with WordPress responsive preview (future enhancement)

---

## Test Environment Setup

### Local Development

```bash
# Start WordPress environment
npx wp-env start

# Build plugin
npm run build

# Watch for changes during development
npm run start
```

### Required Tools

- **wp-env** - Local WordPress instance
- **Browser DevTools** - Responsive testing
- **Browser Extensions:**
  - Responsive Viewer (Chrome/Edge)
  - Responsive Design Mode (Firefox built-in)

### Test Browsers

**Desktop:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Mobile:**
- iOS Safari (latest 2 versions)
- Chrome Mobile (latest)

### Test Devices

**Physical Devices (if available):**
- iPhone 13/14/15
- iPad Pro
- Android phone (any recent model)

**Browser Emulation:**
- iPhone SE (375px)
- iPad (768px)
- Desktop (1024px, 1280px, 1920px)

---

## Unit Testing

### Test Suite 1: Attribute Registration

**File:** `tests/unit/responsive-visibility.test.js`

```javascript
describe('Responsive Visibility - Attribute Registration', () => {
    it('adds dsgHideOnDesktop attribute to all blocks', () => {
        const block = registerBlockType('core/paragraph', metadata);
        expect(block.attributes.dsgHideOnDesktop).toBeDefined();
        expect(block.attributes.dsgHideOnDesktop.type).toBe('boolean');
        expect(block.attributes.dsgHideOnDesktop.default).toBe(false);
    });

    it('adds dsgHideOnTablet attribute to all blocks', () => {
        const block = registerBlockType('core/heading', metadata);
        expect(block.attributes.dsgHideOnTablet).toBeDefined();
        expect(block.attributes.dsgHideOnTablet.type).toBe('boolean');
    });

    it('adds dsgHideOnMobile attribute to all blocks', () => {
        const block = registerBlockType('core/image', metadata);
        expect(block.attributes.dsgHideOnMobile).toBeDefined();
        expect(block.attributes.dsgHideOnMobile.type).toBe('boolean');
    });

    it('does not override existing attributes', () => {
        const mockSettings = {
            attributes: {
                content: { type: 'string' },
            },
        };
        const result = addResponsiveVisibilityAttributes(mockSettings);
        expect(result.attributes.content).toBeDefined();
        expect(result.attributes.dsgHideOnDesktop).toBeDefined();
    });
});
```

### Test Suite 2: CSS Class Application

```javascript
describe('Responsive Visibility - CSS Classes', () => {
    it('applies dsg-hide-desktop class when attribute is true', () => {
        const props = applyResponsiveVisibilityClasses(
            { className: 'wp-block' },
            {},
            { dsgHideOnDesktop: true }
        );
        expect(props.className).toContain('dsg-hide-desktop');
    });

    it('applies multiple classes when multiple attributes are true', () => {
        const props = applyResponsiveVisibilityClasses(
            { className: 'wp-block' },
            {},
            {
                dsgHideOnDesktop: true,
                dsgHideOnMobile: true
            }
        );
        expect(props.className).toContain('dsg-hide-desktop');
        expect(props.className).toContain('dsg-hide-mobile');
    });

    it('does not apply classes when attributes are false', () => {
        const props = applyResponsiveVisibilityClasses(
            { className: 'wp-block' },
            {},
            {
                dsgHideOnDesktop: false,
                dsgHideOnTablet: false,
                dsgHideOnMobile: false
            }
        );
        expect(props.className).not.toContain('dsg-hide-desktop');
        expect(props.className).not.toContain('dsg-hide-tablet');
        expect(props.className).not.toContain('dsg-hide-mobile');
    });

    it('preserves existing classes', () => {
        const props = applyResponsiveVisibilityClasses(
            { className: 'wp-block my-custom-class' },
            {},
            { dsgHideOnMobile: true }
        );
        expect(props.className).toContain('wp-block');
        expect(props.className).toContain('my-custom-class');
        expect(props.className).toContain('dsg-hide-mobile');
    });
});
```

### Running Unit Tests

```bash
# Run all tests
npm run test:unit

# Run with coverage
npm run test:unit -- --coverage

# Watch mode during development
npm run test:unit -- --watch
```

---

## Integration Testing

### Test Suite 3: Block Editor Functionality

**Manual Test Cases**

#### TC-01: Inspector Controls Appear
**Objective:** Verify controls appear for all blocks
**Steps:**
1. Insert any core block (Paragraph, Heading, Image, etc.)
2. Open Settings sidebar
3. Scroll to find "Responsive Visibility" panel
**Expected:** Panel appears, collapsed by default

#### TC-02: Toggle Controls Work
**Objective:** Verify toggles update attributes
**Steps:**
1. Insert Paragraph block
2. Open "Responsive Visibility" panel
3. Toggle "Hide on Mobile" ON
4. Save post
5. Reload editor
6. Check "Hide on Mobile" toggle
**Expected:** Toggle remains ON after reload

#### TC-03: Visual Indicator Appears
**Objective:** Verify indicator shows when block is hidden
**Steps:**
1. Insert Paragraph block
2. Toggle "Hide on Desktop" ON
3. Observe block in editor
**Expected:** Blue indicator appears above block with text "Hidden on: Desktop"

#### TC-04: Multiple Devices Indicator
**Objective:** Verify indicator shows multiple devices
**Steps:**
1. Insert Heading block
2. Toggle "Hide on Desktop" ON
3. Toggle "Hide on Mobile" ON
4. Observe indicator
**Expected:** Indicator shows "Hidden on: Desktop, Mobile"

#### TC-05: Warning for Hidden on All Devices
**Objective:** Verify warning appears when hidden everywhere
**Steps:**
1. Insert Image block
2. Toggle all three visibility options ON
3. Observe panel
**Expected:** Warning notice appears: "This block is hidden on all devices."

### Test Suite 4: Frontend Visibility

**Manual Test Cases**

#### TC-06: Hide on Desktop Works
**Objective:** Verify block hidden on desktop viewports
**Steps:**
1. Create post with Paragraph block
2. Set "Hide on Desktop" ON
3. Publish post
4. View post at 1024px+ viewport
**Expected:** Block is not visible

#### TC-07: Hide on Tablet Works
**Objective:** Verify block hidden on tablet viewports
**Steps:**
1. Create post with Heading block
2. Set "Hide on Tablet" ON
3. Publish post
4. View post at 768-1023px viewport
**Expected:** Block is not visible at tablet size, visible at mobile and desktop

#### TC-08: Hide on Mobile Works
**Objective:** Verify block hidden on mobile viewports
**Steps:**
1. Create post with Image block
2. Set "Hide on Mobile" ON
3. Publish post
4. View post at <768px viewport
**Expected:** Block is not visible on mobile, visible on larger sizes

#### TC-09: Multiple Visibility Settings
**Objective:** Verify multiple hide settings work together
**Steps:**
1. Create post with Button block
2. Set "Hide on Desktop" and "Hide on Mobile" ON
3. Publish post
4. Test at all viewport sizes
**Expected:**
- Hidden at 1024px+ (desktop)
- Visible at 768-1023px (tablet)
- Hidden at <768px (mobile)

---

## Block Compatibility Testing

### Core Blocks - Essential Set

**Priority 1 (Must Test):**
- [ ] Paragraph
- [ ] Heading (H1-H6)
- [ ] Image
- [ ] Gallery
- [ ] List (Ordered & Unordered)
- [ ] Quote
- [ ] Button/Buttons
- [ ] Group
- [ ] Columns/Column
- [ ] Cover

**Priority 2 (Should Test):**
- [ ] Video
- [ ] Audio
- [ ] File
- [ ] Code
- [ ] Preformatted
- [ ] Table
- [ ] Verse
- [ ] Pullquote
- [ ] Separator
- [ ] Spacer

**Priority 3 (Nice to Test):**
- [ ] Navigation
- [ ] Site Logo
- [ ] Post Title
- [ ] Post Content
- [ ] Query Loop
- [ ] Search
- [ ] Social Icons

### Custom DesignSetGo Blocks

**Container Blocks:**
- [ ] Section
- [ ] Row
- [ ] Grid

**Interactive Blocks:**
- [ ] Accordion
- [ ] Accordion Item
- [ ] Tabs
- [ ] Tab
- [ ] Counter
- [ ] Counter Group
- [ ] Flip Card
- [ ] Scroll Accordion
- [ ] Image Accordion

**UI Blocks:**
- [ ] Icon
- [ ] Icon Button
- [ ] Icon List
- [ ] Progress Bar
- [ ] Pill
- [ ] Divider
- [ ] Reveal

**Advanced Blocks:**
- [ ] Slider
- [ ] Form Builder
- [ ] Scroll Marquee

### Testing Matrix Template

For each block, verify:

| Block | Insert | Toggle Desktop | Toggle Tablet | Toggle Mobile | Frontend Desktop | Frontend Tablet | Frontend Mobile | Issues |
|-------|--------|---------------|---------------|---------------|-----------------|----------------|----------------|--------|
| Paragraph | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | None |
| ... | | | | | | | | |

---

## Edge Case Testing

### TC-10: Nested Blocks
**Scenario:** Parent and child have different visibility settings
**Setup:**
1. Create Group block, set "Hide on Mobile"
2. Inside Group, add Paragraph, set "Hide on Desktop"
**Test at:**
- Desktop: Only Paragraph hidden (Group visible but empty)
- Tablet: Both visible
- Mobile: Group hidden (entire block including Paragraph)
**Expected:** Parent visibility overrides children (CSS cascade)

### TC-11: Reusable Blocks
**Scenario:** Visibility settings on reusable blocks
**Setup:**
1. Create Paragraph block
2. Convert to reusable block
3. Set visibility on original instance
4. Insert reusable block in another post
**Expected:** Each instance has independent visibility settings

### TC-12: Block Patterns
**Scenario:** Visibility in block patterns
**Setup:**
1. Create pattern with multiple blocks
2. Set visibility on one block in pattern
3. Insert pattern
**Expected:** Visibility settings transfer with pattern

### TC-13: Widget Areas (if applicable)
**Scenario:** Visibility in widget areas
**Setup:**
1. Add block to widget area
2. Set visibility settings
3. View frontend
**Expected:** Visibility works in widgets

### TC-14: Full Site Editing
**Scenario:** Visibility in FSE templates
**Setup:**
1. Edit site header template
2. Add block with visibility settings
3. View site
**Expected:** Visibility works in FSE templates

---

## Performance Testing

### Metrics to Measure

**Editor Performance:**
- [ ] Time to load editor (with vs without extension)
- [ ] Time to insert block (with attributes)
- [ ] Time to toggle visibility setting
- [ ] Memory usage in editor

**Frontend Performance:**
- [ ] Page load time impact
- [ ] CSS file size increase
- [ ] No JavaScript added to frontend
- [ ] No runtime calculations

### Performance Test Cases

#### TC-15: Editor Load Time
**Setup:**
1. Create post with 50 blocks
2. Add visibility settings to 25 blocks
3. Measure editor load time
**Baseline:** < 2 seconds
**With extension:** < 2.1 seconds (< 5% increase acceptable)

#### TC-16: Bundle Size Impact
**Measure:**
```bash
# Before
ls -lh build/blocks.js

# After adding extension
ls -lh build/blocks.js

# Calculate difference
```
**Acceptable:** < 5KB increase

#### TC-17: Frontend Page Speed
**Tools:** Google PageSpeed Insights, Lighthouse
**Setup:** Page with 20 blocks, 10 with visibility settings
**Metrics:**
- [ ] No impact on First Contentful Paint (FCP)
- [ ] No impact on Largest Contentful Paint (LCP)
- [ ] No impact on Cumulative Layout Shift (CLS)

---

## Accessibility Testing

### WCAG 2.1 AA Compliance

#### TC-18: Screen Reader Support
**Tools:** NVDA (Windows), VoiceOver (Mac), JAWS
**Test:**
1. Navigate to block with visibility settings
2. Use screen reader to read content
**Expected:** Hidden blocks not announced

#### TC-19: Keyboard Navigation
**Test:**
1. Open inspector controls using keyboard only
2. Navigate to Responsive Visibility panel
3. Toggle settings with keyboard
**Expected:**
- All controls keyboard accessible
- Tab order logical
- Enter/Space toggles switches

#### TC-20: Focus Management
**Test:**
1. Select block with visibility settings
2. Tab through controls
3. Close panel and re-focus block
**Expected:** Focus returns to correct element

#### TC-21: Color Contrast
**Test:** Visual indicator color contrast
**Tool:** WebAIM Contrast Checker
**Expected:**
- Indicator background/text: 4.5:1 minimum
- Indicator should be visible in high contrast mode

---

## Browser & Device Compatibility

### Compatibility Matrix

| Browser/Device | Version | Desktop | Tablet | Mobile | Status | Issues |
|----------------|---------|---------|--------|--------|--------|--------|
| Chrome | Latest | ✅ | ✅ | ✅ | | |
| Firefox | Latest | ✅ | ✅ | ✅ | | |
| Safari | Latest | ✅ | ✅ | ✅ | | |
| Edge | Latest | ✅ | ✅ | ✅ | | |
| iOS Safari | 16.x | - | ✅ | ✅ | | |
| iOS Safari | 17.x | - | ✅ | ✅ | | |
| Chrome Mobile | Latest | - | ✅ | ✅ | | |

### Device-Specific Tests

**iPhone SE (375px):**
- [ ] Mobile visibility works
- [ ] Indicator appears correctly in editor
- [ ] Controls accessible

**iPad (768px):**
- [ ] Tablet visibility works
- [ ] Switches between mobile/tablet correctly at 768px
- [ ] Editor usable on tablet

**Desktop (1920px):**
- [ ] Desktop visibility works
- [ ] All controls visible
- [ ] Performance acceptable

---

## Regression Testing

### After Each Change, Verify:

1. **No Block Validation Errors**
   - [ ] No "block contains unexpected or invalid content" errors
   - [ ] Blocks load without recovery prompt

2. **No Console Errors**
   - [ ] No JavaScript errors in browser console (editor)
   - [ ] No JavaScript errors in browser console (frontend)
   - [ ] No React warnings

3. **Existing Functionality Intact**
   - [ ] All core blocks still work
   - [ ] All custom blocks still work
   - [ ] Other extensions still work
   - [ ] No style conflicts

4. **Build Success**
   - [ ] `npm run build` completes without errors
   - [ ] No webpack warnings
   - [ ] All assets generated correctly

---

## WordPress Version Compatibility

### Test Across WordPress Versions

**Minimum Supported:** WordPress 6.4

| WP Version | Core Blocks | Custom Blocks | FSE | Status | Notes |
|------------|-------------|---------------|-----|--------|-------|
| 6.4 | ✅ | ✅ | ✅ | | Minimum version |
| 6.5 | ✅ | ✅ | ✅ | | |
| 6.6 | ✅ | ✅ | ✅ | | Latest stable |
| 6.7 | ✅ | ✅ | ✅ | | Latest |

### Theme Compatibility

**Classic Themes:**
- [ ] Twenty Twenty-One
- [ ] Twenty Twenty-Two
- [ ] Twenty Twenty-Three

**Block Themes:**
- [ ] Twenty Twenty-Four
- [ ] Twenty Twenty-Five (latest)

---

## Automated Testing Setup

### GitHub Actions Workflow

```yaml
# .github/workflows/test-responsive-visibility.yml
name: Test Responsive Visibility Extension

on:
  push:
    paths:
      - 'src/extensions/responsive/**'
      - 'tests/unit/responsive-visibility.test.js'
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- responsive-visibility

      - name: Build plugin
        run: npm run build

      - name: Check bundle size
        run: |
          ls -lh build/
          # Add size check logic
```

### E2E Testing with Playwright

```javascript
// tests/e2e/responsive-visibility.spec.js
import { test, expect } from '@playwright/test';

test.describe('Responsive Visibility Extension', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/wp-admin/post-new.php');
        await page.waitForSelector('.editor-canvas');
    });

    test('shows responsive visibility panel for paragraph block', async ({ page }) => {
        // Insert paragraph
        await page.click('[aria-label="Add block"]');
        await page.click('button:has-text("Paragraph")');

        // Open settings
        await page.click('[aria-label="Settings"]');

        // Find responsive visibility panel
        const panel = page.locator('text=Responsive Visibility');
        await expect(panel).toBeVisible();
    });

    test('applies hide on mobile class', async ({ page }) => {
        // Insert and configure block
        await page.click('[aria-label="Add block"]');
        await page.click('button:has-text("Paragraph")');
        await page.type('[data-type="core/paragraph"]', 'Test content');

        // Open responsive visibility
        await page.click('[aria-label="Settings"]');
        await page.click('text=Responsive Visibility');

        // Toggle hide on mobile
        await page.click('label:has-text("Hide on Mobile")');

        // Verify class applied
        const block = page.locator('[data-type="core/paragraph"]');
        await expect(block).toHaveClass(/dsg-hide-mobile/);
    });
});
```

---

## Bug Report Template

When filing issues during testing:

```markdown
### Bug Report: Responsive Visibility Extension

**Environment:**
- WordPress Version:
- Plugin Version:
- Browser:
- Device:

**Block Affected:**
- Block Type:
- Block Name:

**Steps to Reproduce:**
1.
2.
3.

**Expected Behavior:**


**Actual Behavior:**


**Screenshots/Video:**


**Console Errors:**
```


**Additional Context:**

```

---

## Sign-Off Criteria

Extension is ready for release when:

### Functionality
- [ ] All Priority 1 core blocks tested and working
- [ ] All custom blocks tested and working
- [ ] All manual test cases pass
- [ ] All unit tests pass
- [ ] No block validation errors

### Performance
- [ ] Editor load time increase < 5%
- [ ] Bundle size increase < 5KB
- [ ] No frontend JavaScript added
- [ ] PageSpeed score unchanged

### Compatibility
- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] Works on WordPress 6.4+
- [ ] Works with Twenty Twenty-Five theme
- [ ] No conflicts with other extensions

### Quality
- [ ] No console errors
- [ ] No PHP errors
- [ ] All accessibility checks pass
- [ ] Code reviewed and approved

### Documentation
- [ ] User documentation complete
- [ ] Code comments added
- [ ] Testing documented
- [ ] Known issues documented

---

## Testing Schedule

### Phase 1: Unit Testing (Day 1)
- Set up test environment
- Write and run unit tests
- Fix any failing tests

### Phase 2: Core Block Testing (Day 2)
- Test Priority 1 core blocks
- Document any issues
- Test Priority 2 core blocks

### Phase 3: Custom Block Testing (Day 3)
- Test all custom blocks
- Focus on container blocks
- Test interactive blocks

### Phase 4: Integration & Edge Cases (Day 4)
- Nested blocks
- Reusable blocks
- Block patterns
- FSE templates

### Phase 5: Performance & Accessibility (Day 5)
- Performance benchmarks
- Accessibility audit
- Cross-browser testing

### Phase 6: Regression & Sign-Off (Day 6)
- Full regression test
- Final checks
- Documentation review
- Sign-off

---

## Resources

### Testing Tools
- [WordPress Handbook - Testing](https://developer.wordpress.org/block-editor/contributors/code/testing-overview/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Internal Documentation
- [RESPONSIVE-VISIBILITY-EXTENSION-SPEC.md](RESPONSIVE-VISIBILITY-EXTENSION-SPEC.md)
- [BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md](BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md)
- [CLAUDE.md](../CLAUDE.md)

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-12
**Next Review:** After implementation completion
