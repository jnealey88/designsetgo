# Modal Block - Next Phase Plan

**Current Version**: 1.0.0
**Last Updated**: 2025-11-19
**Status**: Planning

## Current State

### Completed Features ✅

**Modal Block:**
- Customizable dimensions (width, max-width, height, max-height)
- Animation types (fade, slide-up, slide-down, zoom, none)
- Overlay customization (color, opacity, blur)
- Close button with 4 position options (inside/outside, left/right)
- Full WordPress block supports (colors, typography, spacing, borders)
- Responsive behavior optimized for mobile and tablet
- Accessibility features (ARIA attributes, keyboard support)
- Body scroll locking

**Modal Trigger Block:**
- Button with 3 styles (fill, outline, link)
- Icon support with positioning (start, end, none)
- Width options (auto, full)
- Target modal via ID
- Full block supports for customization

**Technical Foundation:**
- Modal portaling to document.body to escape stacking contexts
- Context API for modal ID and close behavior
- Proper z-index handling (max safe integer)
- Reduced motion support
- High contrast mode support

## Phase 2: Advanced Triggering & Automation

### Priority: High

### 2.1 URL Hash Triggering
**User Story**: As a site owner, I want to open a modal by linking to a specific URL hash so I can link directly to modal content.

**Implementation:**
```javascript
// Example: https://example.com/page#dsgo-modal-newsletter
// Automatically opens modal with ID "dsgo-modal-newsletter"
```

**New Modal Attributes:**
- `allowHashTrigger` (boolean, default: true)

**Technical Notes:**
- Listen for URL hash changes
- Open modal on page load if hash matches
- Update URL when modal opens (optional)
- Handle browser back button

### 2.2 Auto-Open Triggers
**User Story**: As a marketer, I want modals to automatically open based on user behavior to increase engagement.

**New Trigger Block Variation: "Auto Trigger"**

**Trigger Types:**
1. **Page Load**
   - Delay (ms): 0-30000
   - Frequency: Every visit, Once per session, Once per user (cookie)
   - Cookie duration (days): 1-365

2. **Exit Intent**
   - Sensitivity: Low, Medium, High
   - Minimum time on page (seconds)
   - Exclude mobile devices (boolean)

3. **Scroll Depth**
   - Trigger at % scrolled: 25, 50, 75, 100
   - Direction: Down only, Up or Down

4. **Time on Page**
   - Seconds on page: 0-300
   - Frequency: Once per session, Every time

**New Attributes:**
```json
{
  "autoTriggerType": {
    "type": "string",
    "enum": ["none", "pageLoad", "exitIntent", "scroll", "time"]
  },
  "autoTriggerDelay": {
    "type": "number",
    "default": 0
  },
  "autoTriggerFrequency": {
    "type": "string",
    "enum": ["always", "session", "once"]
  },
  "scrollDepth": {
    "type": "number",
    "default": 50
  },
  "timeOnPage": {
    "type": "number",
    "default": 30
  }
}
```

**UI Considerations:**
- Add "Auto Trigger" panel in Modal settings
- Clear indicators when auto-trigger is active
- Preview mode in editor (don't actually trigger)
- Test button to preview trigger behavior

## Phase 3: Content & Templates

### Priority: Medium

### 3.1 Modal Patterns
**User Story**: As a content creator, I want pre-built modal templates to quickly create common use cases.

**Block Variations:**
1. **Newsletter Signup**
   - Pre-configured with form pattern
   - Best practice dimensions and styling
   - Exit intent trigger enabled

2. **Video Player**
   - Optimized dimensions for 16:9 video
   - Auto-play on open, pause on close
   - Black overlay, no padding

3. **Image Gallery/Lightbox**
   - Full-screen dimensions
   - Minimal chrome, just close button
   - Keyboard navigation hints

4. **Cookie Notice**
   - Bottom-aligned variation
   - Sticky positioning
   - Remember choice functionality

5. **Promo/Announcement**
   - Eye-catching defaults
   - CTA button pattern
   - Time-limited display option

**Implementation:**
- Use `variations` in block.json
- Pre-configured attributes and innerBlocks templates
- Custom icons for each variation

### 3.2 Modal Gallery/Carousel
**User Story**: As a photographer, I want to display a gallery of images in modals with navigation between them.

**New Feature: Modal Navigation**
- Previous/Next buttons
- Keyboard arrow key support
- Swipe gestures on mobile
- Thumbnail navigation (optional)

**Technical Implementation:**
- New context: `modalGroupId`
- Multiple modals can belong to same group
- Navigation rendered dynamically
- Focus management between modals

## Phase 4: Developer Experience

### Priority: Medium

### 4.1 JavaScript API
**User Story**: As a developer, I want programmatic control over modals for custom integrations.

**Public API:**
```javascript
// Global namespace
window.dsgoModal = {
  open: (modalId, options) => {},
  close: (modalId) => {},
  closeAll: () => {},
  isOpen: (modalId) => boolean,
  on: (event, callback) => {},
  off: (event, callback) => {}
};

// Events
dsgoModal.on('modalOpen', ({ modalId, element }) => {});
dsgoModal.on('modalClose', ({ modalId, element }) => {});
dsgoModal.on('modalBeforeOpen', ({ modalId, element }) => {});
dsgoModal.on('modalBeforeClose', ({ modalId, element }) => {});
```

**Use Cases:**
- Form validation before close
- Analytics tracking
- Custom animations
- Third-party integrations

### 4.2 PHP Filters & Actions
**User Story**: As a developer, I want to customize modal behavior server-side.

**Filters:**
```php
// Modify modal attributes before render
apply_filters('designsetgo/modal/attributes', $attributes, $block);

// Add custom data attributes
apply_filters('designsetgo/modal/data_attributes', $data_attrs, $attributes);

// Modify modal classes
apply_filters('designsetgo/modal/classes', $classes, $attributes);
```

**Actions:**
```php
// Before modal block renders
do_action('designsetgo/modal/before_render', $attributes, $block);

// After modal block renders
do_action('designsetgo/modal/after_render', $attributes, $block);
```

## Phase 5: Performance & Polish

### Priority: Low (but important)

### 5.1 Performance Optimization
- Lazy load modal content (don't render until first open)
- Intersection Observer for auto-triggers
- Debounce scroll/resize handlers
- Reduce JavaScript bundle size
- CSS containment for better painting

### 5.2 Enhanced Accessibility
- Screen reader testing with NVDA/JAWS
- Focus trap improvements
- Better keyboard navigation hints
- ARIA live regions for dynamic content
- Reduced motion enhancements

### 5.3 Advanced Styling
- Custom animation builder (GUI)
- Animation presets library
- Border shadows/glows
- Glassmorphism effects
- Pattern overlays

### 5.4 Testing & Documentation
- E2E tests for all trigger types
- Unit tests for modal utilities
- Visual regression tests
- Comprehensive user documentation
- Developer API documentation
- Video tutorials

## Implementation Timeline

### Immediate (v1.1.0) - ✅ COMPLETED
- [x] URL hash triggering
- [x] Page load auto-trigger
- [x] Basic modal patterns (5 variations)
- [x] Exit intent trigger
- [x] Scroll depth trigger
- [x] Time-based trigger
- [x] Frequency tracking (session/once per user)
- [x] Cookie/localStorage management

### Short Term (v1.2.0) - 1 Month
- [ ] JavaScript API (core methods)

### Medium Term (v1.3.0) - 2-3 Months
- [ ] Modal gallery/navigation
- [ ] All block variations
- [ ] PHP filters/actions
- [ ] Performance optimizations

### Long Term (v2.0.0) - 6 Months
- [ ] Custom animation builder
- [ ] Advanced templates
- [ ] Complete API
- [ ] Comprehensive testing suite

## Open Questions

1. **Cookie Storage**: Use first-party cookies or localStorage for frequency tracking?
   - Cookies: Better for server-side integration, privacy regulations
   - localStorage: Better for SPA-like experiences, no server overhead

2. **Analytics Integration**: Should we provide built-in analytics hooks?
   - Google Analytics
   - Google Tag Manager
   - Custom events

3. **Form Integration**: How deep should form integration go?
   - Basic: Just container for forms
   - Advanced: Form validation, AJAX submission, success/error handling

4. **Monetization**: Any premium features?
   - All features free (current model)
   - Pro version with advanced triggers/analytics
   - Freemium model with limits

## Success Metrics

### User Adoption
- Download/install rate
- Active installations
- User ratings/reviews
- Support ticket volume

### Feature Usage
- Most used modal types
- Most popular trigger methods
- Average customization depth
- Performance impact

### Developer Feedback
- API usage statistics
- GitHub issues/PRs
- Community contributions
- Documentation clarity

## Resources & References

### Similar Implementations
- **Popup Maker**: Full-featured WordPress popup plugin
- **OptinMonster**: Marketing-focused popup builder
- **Elementor Popup**: Page builder integration
- **Kadence Modal**: Block-based approach

### Accessibility Standards
- [ARIA Authoring Practices Guide - Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WebAIM: Creating Accessible Modal Dialogs](https://webaim.org/techniques/aria/modal)

### Performance
- [Web Vitals - CLS](https://web.dev/cls/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

---

**Feedback Welcome**: This is a living document. Suggestions and prioritization feedback appreciated!
