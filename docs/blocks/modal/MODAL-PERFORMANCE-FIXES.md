# Modal Block - Performance & Code Quality Fixes

**Status**: Implementation Guide
**Priority**: v1.3.1
**Estimated Effort**: 10-12 hours

## Overview

This document provides implementation details for the remaining performance and code quality improvements identified in the security audit. These are categorized as HIGH and MEDIUM priority for the v1.3.1 release.

---

## 1. Scroll Handler Debouncing ⚡ HIGH PRIORITY

**File**: `src/blocks/modal/view.js`
**Lines**: 502-532
**Effort**: 2 hours
**Impact**: 80-90% reduction in CPU usage during scroll

### Problem

The scroll event handler fires on every scroll event without debouncing, causing unnecessary CPU cycles on slower devices.

### Implementation

#### Step 1: Add Debounce Utility Method

Insert after `init()` method (around line 119):

```javascript
/**
 * Debounce utility function
 *
 * Limits the rate at which a function can fire.
 *
 * @param {Function} func Function to debounce.
 * @param {number} wait Milliseconds to wait.
 * @return {Function} Debounced function.
 */
debounce(func, wait) {
    let timeout;
    return (...args) => {
        const later = () => {
            clearTimeout(timeout);
            timeout = null;
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
```

#### Step 2: Update setupScrollTrigger Method

Replace the current implementation (lines 502-532):

```javascript
/**
 * Set up scroll depth trigger with debouncing
 */
setupScrollTrigger() {
    let hasTriggered = false;
    const targetDepth = this.settings.scrollDepth;
    let lastScrollTop = 0;

    // Create debounced scroll handler
    const scrollHandler = () => {
        if (hasTriggered || this.isOpen) {
            return;
        }

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;

        // Check direction if needed
        if (this.settings.scrollDirection === 'down') {
            if (scrollTop < lastScrollTop) {
                lastScrollTop = scrollTop;
                return; // Scrolling up, ignore
            }
        }

        lastScrollTop = scrollTop;

        // Check if we've reached the target depth
        if (scrollPercent >= targetDepth) {
            hasTriggered = true;
            this.open();
            this.markAsShown();
            window.removeEventListener('scroll', this.handleScroll);
        }
    };

    // Apply debouncing (100ms is optimal for scroll)
    this.handleScroll = this.debounce(scrollHandler, 100);

    window.addEventListener('scroll', this.handleScroll, { passive: true });
}
```

### Testing

```javascript
// Test debouncing
let scrollCount = 0;
window.addEventListener('scroll', () => scrollCount++);

// Scroll rapidly
window.scrollTo(0, 1000);
console.log(`Scroll events: ${scrollCount}`); // Should show much lower number
```

---

## 2. Cache Gallery Modal Discovery 🚀 HIGH PRIORITY

**File**: `src/blocks/modal/view.js`
**Lines**: 574-595
**Effort**: 2 hours
**Impact**: Eliminates redundant DOM queries on every modal open

### Problem

`updateGalleryModals()` runs `querySelectorAll` every time a modal opens, even though gallery structure rarely changes.

### Implementation

#### Step 1: Add Cache Properties to Constructor

In the constructor (around line 60):

```javascript
// Gallery state
this.galleryModals = [];
this.currentGalleryIndex = -1;
this.galleryModalsCache = null;        // ADD THIS
this.galleryModalsCacheTime = 0;       // ADD THIS
```

#### Step 2: Update updateGalleryModals Method

Replace lines 574-595:

```javascript
/**
 * Update the list of gallery modals
 *
 * @param {boolean} force Force cache refresh.
 */
updateGalleryModals(force = false) {
    const groupId = this.settings.galleryGroupId;

    // Use cached results if available and not stale (5 second cache)
    const cacheAge = Date.now() - this.galleryModalsCacheTime;
    if (!force && this.galleryModalsCache && cacheAge < 5000) {
        this.galleryModals = this.galleryModalsCache;
        return;
    }

    // Query DOM for gallery modals
    const allModals = document.querySelectorAll(`[data-gallery-group-id="${groupId}"]`);

    // Convert to array and sort by gallery index
    this.galleryModals = Array.from(allModals)
        .map((modalEl) => ({
            element: modalEl,
            instance: modalEl.dsgoModalInstance,
            index: parseInt(modalEl.getAttribute('data-gallery-index')) || 0,
            modalId: modalEl.getAttribute('data-modal-id'),
        }))
        .filter((item) => item.instance) // Only include initialized modals
        .sort((a, b) => a.index - b.index);

    // Find this modal's position in the gallery
    this.currentGalleryIndex = this.galleryModals.findIndex(
        (item) => item.modalId === this.modalId
    );

    // Cache results
    this.galleryModalsCache = this.galleryModals;
    this.galleryModalsCacheTime = Date.now();
}
```

#### Step 3: Invalidate Cache on Content Changes

Add to `initModals()` function (around line 1180):

```javascript
/**
 * Re-initialize on dynamic content load (for AJAX/SPA support)
 */
document.addEventListener('dsgo-content-loaded', () => {
    // Invalidate all gallery caches
    document.querySelectorAll('[data-dsgo-modal]').forEach((modal) => {
        if (modal.dsgoModalInstance) {
            modal.dsgoModalInstance.galleryModalsCache = null;
        }
    });

    initModals();
    initTriggers();
});
```

### Testing

```javascript
// Test cache hit
const modal = document.getElementById('dsgo-modal-1');
const instance = modal.dsgoModalInstance;

console.time('First call');
instance.updateGalleryModals();
console.timeEnd('First call'); // Should be slower

console.time('Cached call');
instance.updateGalleryModals();
console.timeEnd('Cached call'); // Should be much faster
```

---

## 3. Data Attribute Validation 🛡️ HIGH PRIORITY

**File**: `src/blocks/modal/view.js`
**Lines**: 33-56
**Effort**: 4 hours
**Impact**: Prevents crashes from malformed input

### Problem

Data attributes are read directly from DOM without validation, potentially causing unexpected behavior.

### Implementation

#### Step 1: Add Validation Helper Methods

Insert after `debounce()` method:

```javascript
/**
 * Validate number with range constraints
 *
 * @param {any} value Value to validate.
 * @param {number} defaultValue Default if invalid.
 * @param {number} min Minimum allowed value.
 * @param {number} max Maximum allowed value.
 * @return {number} Validated number.
 */
validateNumber(value, defaultValue, min, max) {
    const num = parseInt(value, 10);

    // Check for NaN
    if (isNaN(num)) {
        return defaultValue;
    }

    // Apply min/max constraints
    if (min !== undefined && num < min) {
        return min;
    }
    if (max !== undefined && num > max) {
        return max;
    }

    return num;
}

/**
 * Validate enum (string must be in allowed list)
 *
 * @param {any} value Value to validate.
 * @param {Array} validValues Array of valid values.
 * @param {string} defaultValue Default if invalid.
 * @return {string} Validated value.
 */
validateEnum(value, validValues, defaultValue) {
    return validValues.includes(value) ? value : defaultValue;
}

/**
 * Validate boolean from string
 *
 * @param {any} value Value to validate.
 * @param {boolean} defaultValue Default if invalid.
 * @return {boolean} Validated boolean.
 */
validateBoolean(value, defaultValue) {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === true || value === false) return value;
    return defaultValue;
}
```

#### Step 2: Update Constructor to Use Validation

Replace settings initialization (lines 33-56):

```javascript
// Settings from data attributes with validation
this.settings = {
    animationType: this.validateEnum(
        element.getAttribute('data-animation-type'),
        ['fade', 'slide-up', 'slide-down', 'zoom', 'none'],
        'fade'
    ),
    animationDuration: this.validateNumber(
        element.getAttribute('data-animation-duration'),
        300, 0, 2000
    ),
    closeOnBackdrop: this.validateBoolean(
        element.getAttribute('data-close-on-backdrop'),
        true
    ),
    closeOnEsc: this.validateBoolean(
        element.getAttribute('data-close-on-esc'),
        true
    ),
    disableBodyScroll: this.validateBoolean(
        element.getAttribute('data-disable-body-scroll'),
        true
    ),
    allowHashTrigger: this.validateBoolean(
        element.getAttribute('data-allow-hash-trigger'),
        true
    ),
    updateUrlOnOpen: this.validateBoolean(
        element.getAttribute('data-update-url-on-open'),
        false
    ),
    autoTriggerType: this.validateEnum(
        element.getAttribute('data-auto-trigger-type'),
        ['none', 'pageLoad', 'exitIntent', 'scroll', 'time'],
        'none'
    ),
    autoTriggerDelay: this.validateNumber(
        element.getAttribute('data-auto-trigger-delay'),
        0, 0, 300
    ),
    autoTriggerFrequency: this.validateEnum(
        element.getAttribute('data-auto-trigger-frequency'),
        ['always', 'session', 'once'],
        'always'
    ),
    cookieDuration: this.validateNumber(
        element.getAttribute('data-cookie-duration'),
        7, 1, 365
    ),
    exitIntentSensitivity: this.validateEnum(
        element.getAttribute('data-exit-intent-sensitivity'),
        ['low', 'medium', 'high'],
        'medium'
    ),
    exitIntentMinTime: this.validateNumber(
        element.getAttribute('data-exit-intent-min-time'),
        5, 0, 300
    ),
    exitIntentExcludeMobile: this.validateBoolean(
        element.getAttribute('data-exit-intent-exclude-mobile'),
        true
    ),
    scrollDepth: this.validateNumber(
        element.getAttribute('data-scroll-depth'),
        50, 0, 100
    ),
    scrollDirection: this.validateEnum(
        element.getAttribute('data-scroll-direction'),
        ['down', 'both'],
        'down'
    ),
    timeOnPage: this.validateNumber(
        element.getAttribute('data-time-on-page'),
        30, 0, 600
    ),
    galleryGroupId: element.getAttribute('data-gallery-group-id') || '',
    galleryIndex: this.validateNumber(
        element.getAttribute('data-gallery-index'),
        0, 0, 50
    ),
    showGalleryNavigation: this.validateBoolean(
        element.getAttribute('data-show-gallery-navigation'),
        true
    ),
    navigationStyle: this.validateEnum(
        element.getAttribute('data-navigation-style'),
        ['arrows', 'chevrons', 'text'],
        'arrows'
    ),
    navigationPosition: this.validateEnum(
        element.getAttribute('data-navigation-position'),
        ['sides', 'bottom', 'top'],
        'sides'
    ),
};
```

### Testing

```html
<!-- Test invalid values -->
<div data-dsgo-modal
     data-modal-id="test"
     data-animation-duration="abc"       <!-- Should fallback to 300 -->
     data-scroll-depth="999"             <!-- Should cap at 100 -->
     data-animation-type="invalid"       <!-- Should fallback to "fade" -->
>
```

---

## 4. Remove Production Console Statements 🔇 MEDIUM PRIORITY

**File**: `src/blocks/modal/view.js`
**Lines**: 1172, 1193, 1278, 1283, 1329
**Effort**: 2 hours
**Impact**: Prevents information disclosure in production

### Implementation

#### Option 1: Development Flag (Recommended)

Create a debug configuration in `class-modal.php`:

```php
// In enqueue_scripts method
wp_localize_script(
    'dsgo-modal-view',
    'dsgoModalConfig',
    array(
        'debug' => defined('WP_DEBUG') && WP_DEBUG,
    )
);
```

Then wrap all console statements:

```javascript
// Replace:
console.warn(`Modal with ID "${modalId}" not found`);

// With:
if (window.dsgoModalConfig?.debug) {
    console.warn('[DSG Modal]', `Modal with ID "${modalId}" not found`);
}
```

#### Option 2: Custom Logger (Better for Future)

```javascript
// Add at top of file after IIFE
const logger = {
    warn: (msg, ...args) => {
        if (window.dsgoModalConfig?.debug) {
            console.warn('[DSG Modal]', msg, ...args);
        }
    },
    error: (msg, ...args) => {
        if (window.dsgoModalConfig?.debug) {
            console.error('[DSG Modal]', msg, ...args);
        }
    },
    log: (msg, ...args) => {
        if (window.dsgoModalConfig?.debug) {
            console.log('[DSG Modal]', msg, ...args);
        }
    }
};

// Then replace all console calls:
logger.warn(`Modal with ID "${modalId}" not found`);
logger.error(`Error in ${event} callback:`, error);
```

### Locations to Update

1. Line 1172: `console.warn(Modal with ID "${modalId}" not found);`
2. Line 1193: `console.warn(Modal with ID "${modalId}" not found);`
3. Line 1278: `console.warn(Unknown event: ${event});`
4. Line 1283: `console.warn('Callback must be a function');`
5. Line 1329: `console.error(Error in ${event} callback:, error);`

---

## Implementation Priority

### Week 1 (Immediate)
1. ✅ PHP Sanitization (completed)
2. ✅ Cookie Security (completed)
3. ✅ ReDoS Fix (completed)

### Week 2 (v1.3.1)
1. Data Attribute Validation (4 hours) - Start here
2. Scroll Debouncing (2 hours)
3. Gallery Modal Caching (2 hours)
4. Console Statement Cleanup (2 hours)

**Total**: 10 hours for v1.3.1

---

## Testing Checklist

After implementing each fix:

- [ ] Build succeeds (`npm run build`)
- [ ] No console errors in browser
- [ ] Modal opens/closes correctly
- [ ] Auto-triggers still work
- [ ] Gallery navigation still works
- [ ] Performance improvement verified (DevTools Performance tab)
- [ ] Test on mobile devices
- [ ] Test with slow 3G throttling

---

**Next Steps**: Implement fixes in order of priority, test each one individually before moving to the next.
