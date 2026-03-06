# WordPress 7.0 Compatibility Testing Plan

**Date:** 2026-03-04
**WP 7.0 Final Release:** April 9, 2026
**Environment:** `npm run wp-env:start:7` (WP 7.0 Beta 2)

---

## 1. Build Verification

- [ ] `npm run build` completes without errors
- [ ] `npm run lint:js` passes (0 errors, 0 unexpected warnings)
- [ ] `npm run lint:css` passes
- [ ] `npm run lint:php` passes

---

## 2. Plugin Activation & Basic Functionality

- [ ] Plugin activates without PHP errors on WP 7.0
- [ ] No PHP deprecation notices in `wp-env logs`
- [ ] Admin settings page renders correctly
- [ ] Block inserter shows all DesignSetGo blocks under correct categories
- [ ] Block collection label ("DesignSetGo") appears in inserter

---

## 3. Iframed Editor Testing

WP 7.0 changes how the post editor handles iframes ([dev note](https://make.wordpress.org/core/2026/02/24/iframed-editor-changes-in-wordpress-7-0/)).

- [ ] All blocks render correctly in the post editor
- [ ] Inspector controls (sidebar panels) work for all blocks
- [ ] Block toolbars appear and function correctly
- [ ] Custom CSS loads properly in editor iframe
- [ ] No `document` or `window` reference errors in console
- [ ] Frontend styles match editor preview

### Blocks with custom JS that may reference `document`/`window`:
- [ ] Accordion — toggle behavior in editor
- [ ] Tabs — tab switching in editor
- [ ] Modal / Modal Trigger — trigger behavior
- [ ] Slider — slide navigation
- [ ] Countdown Timer — timer display
- [ ] Counter — animation trigger
- [ ] Scroll Marquee — scroll behavior
- [ ] Image Accordion — hover interactions

---

## 4. Migrated API Smoke Tests

### UnitControl (25 files migrated)
- [ ] Section block — padding/margin unit controls work
- [ ] Grid block — gap unit controls work
- [ ] Row block — gap unit controls work
- [ ] Accordion block — spacing unit controls work
- [ ] Progress Bar — height/width unit controls work
- [ ] Countdown Timer — sizing panel unit controls work
- [ ] Modal — settings panel unit controls work
- [ ] Icon Button — settings panel unit controls work
- [ ] Map — settings panel unit controls work
- [ ] Text Style format — size section unit controls work
- [ ] Max Width extension — unit controls work
- [ ] Shared WidthPanel component — unit controls work

### ToggleGroupControl (3 files migrated)
- [ ] Icon block — icon settings toggle groups work
- [ ] Progress Bar — toggle group controls work

### block.json Supports (border + typography)
- [ ] Border controls appear in sidebar for blocks that had `__experimentalBorder`
- [ ] Typography controls (font family, weight, style, transform, decoration, letter-spacing) appear for blocks that had experimental typography keys
- [ ] Writing mode controls appear for Blobs and Pill blocks

### useSetting → useSettings
- [ ] Heading Segment — font family dropdown populates correctly in toolbar

### Global wp → module imports
- [ ] Block category filter — DesignSetGo collection appears in inserter
- [ ] Section transforms — transform to/from other blocks works
- [ ] Row transforms — transform to/from other blocks works
- [ ] Grid transforms — transform to/from other blocks works
- [ ] Icon Button transforms — transform to/from other blocks works

---

## 5. New Core Block Naming Collision Tests

### Core Breadcrumbs vs `designsetgo/breadcrumbs`
- [ ] Both blocks register without console errors
- [ ] Core Breadcrumbs appears separately from DesignSetGo Breadcrumbs in inserter
- [ ] Inserting each block produces the correct output
- [ ] No PHP fatal errors from duplicate registration

### Core Icons vs `designsetgo/icon`
- [ ] Both blocks register without console errors
- [ ] Core Icons appears separately from DesignSetGo Icon in inserter
- [ ] Inserting each block produces the correct output
- [ ] No PHP fatal errors from duplicate registration

---

## 6. Changed Core Block Interaction Tests

### Grid Block (core now has responsive controls)
- [ ] Our `designsetgo/grid` works alongside core Grid
- [ ] No CSS conflicts between core and our grid styles
- [ ] Our grid responsive controls don't conflict with core's new responsive controls

### Navigation Block (overlays are template parts)
- [ ] Site editor with Navigation block works normally
- [ ] Our header-related extensions don't conflict with overlay template parts

### Cover Block (video embed backgrounds)
- [ ] Our background-video extension works alongside Cover block video backgrounds
- [ ] No JS conflicts between our video handling and core's

### Gallery Block (lightbox support)
- [ ] Gallery lightbox doesn't conflict with our modal/lightbox functionality
- [ ] No CSS z-index conflicts

---

## 7. New WP 7.0 Feature Interaction Tests

### Responsive Visibility Controls
- [ ] Our blocks work with core's new viewport-based visibility
- [ ] No conflicts with our responsive display logic (if any)

### Real-Time Collaboration
- [ ] Insert a DesignSetGo block in collaborative editing mode
- [ ] Block attributes sync correctly between users
- [ ] No console errors during collaborative editing

### View Transitions
- [ ] Navigate between admin pages — no JS errors
- [ ] Our admin settings page transitions smoothly
- [ ] No visual glitches during page transitions

### Block Supports: Dimension width/height
- [ ] Blocks with custom width controls don't conflict with core dimension controls
- [ ] Max Width extension works alongside core width/height support

### Block Supports: Line indent / text columns
- [ ] Our typography controls don't overlap or conflict with core's new text indent/columns

---

## 8. Frontend Rendering Tests

- [ ] All blocks render correctly on the frontend
- [ ] No broken styles on frontend
- [ ] Interactive blocks (Accordion, Tabs, Modal, Slider, Counter) function correctly
- [ ] Scroll-based blocks (Scroll Marquee, Scroll Accordion, Text Reveal) animate correctly
- [ ] Form Builder submits correctly

---

## 9. Theme Compatibility

- [ ] Test with Twenty Twenty-Five (default)
- [ ] Test with Twenty Twenty-Four
- [ ] Verify theme.json integration works (colors, typography, spacing)
- [ ] Block styles use CSS custom properties correctly

---

## 10. Console Error Sweep

- [ ] Open browser console during all tests above
- [ ] No JavaScript errors in editor
- [ ] No JavaScript errors on frontend
- [ ] No unexpected deprecation warnings in console
- [ ] Check `npx wp-env logs` for PHP errors/warnings after testing

---

## Test Results

| Category | Pass | Fail | Notes |
|---|---|---|---|
| Build Verification | | | |
| Plugin Activation | | | |
| Iframed Editor | | | |
| Migrated APIs | | | |
| Naming Collisions | | | |
| Core Block Interactions | | | |
| New Features | | | |
| Frontend Rendering | | | |
| Theme Compatibility | | | |
| Console Errors | | | |

---

## How to Run

```bash
# Start WP 7.0 Beta 2 environment
npm run wp-env:start:7

# Build latest code
npm run build

# Access at http://localhost:8891
# Login: admin / password

# When done, stop and clean up
npm run wp-env:stop:7
```
