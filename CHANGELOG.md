# Changelog

All notable changes to the DesignSetGo plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-11-21

### New Features
- New: Breadcrumbs block with Schema.org markup for improved SEO and navigation
- New: Table of Contents block with automatic heading detection, smooth scrolling, and sticky positioning
- New: Modal/Popup block with accessible triggers, animations, and gallery support
- Enhancement: Modal close triggers and improved icon-button UX with better accessibility

### Bug Fixes
- Fix: Table of Contents critical production readiness fixes for stable performance
- Fix: Table of Contents sticky positioning and scroll spy highlighting functionality
- Fix: Table of Contents error handling in view.js for better reliability
- Fix: Prevent sticky header from affecting footer template parts

### Security
- Security: Fixed 3 critical vulnerabilities in Modal block + performance optimizations

### Internationalization
- i18n: Added modal block translations to all language files
- i18n: Updated translation strings for modal close functionality

### Documentation
- Docs: Reorganized and created comprehensive block/extension documentation

### Maintenance
- Maintenance: Updated dependencies (glob 10.4.5 → 10.5.0)
- Maintenance: Optimized screenshot-1.gif (24MB → 5.7MB)
- Maintenance: Updated WordPress.org assets and screenshots

## [1.1.4] - 2025-11-19

### Bug Fixes
- Fix: Slider initialization on uncached first load - sliders now display correctly on first page visit
- Fix: Critical race condition in image loading detection that could cause 3-second initialization delays
- Fix: Memory leak from uncleaned setTimeout timers in slider initialization
- Fix: Double-counting bug in slider image load detection that could prevent initialization

### Performance Improvements
- Performance: Eliminated redundant DOM queries in slider initialization
- Performance: Optimized Array.from conversions for better memory efficiency

### Code Quality
- Docs: Added comprehensive JSDoc documentation for slider initialization functions
- Docs: Enhanced inline comments explaining race condition prevention and error handling

## [1.1.3] - 2025-11-16

### Performance Improvements
- Performance: Major CSS loading strategy optimization - improved enqueue logic and selective loading (#93)
- Performance: Fixed forced reflows in JavaScript and optimized asset loading strategy (#91)
- Performance: Eliminated layout thrashing by batching DOM reads/writes and deferring non-critical operations

### Bug Fixes
- Fix: Flip card back panel now correctly displays background color and text in editor (#94)
- Fix: Added alignment options to countdown timer block for better layout control (#95)

### Documentation
- Docs: Updated WordPress.org screenshots to reflect current plugin features

## [1.1.2] - 2025-11-15

### New Features
- New: Added five comprehensive filter hooks for Custom CSS customization
  - `designsetgo/custom_css_block` - Modify CSS per block before processing
  - `designsetgo/custom_css_class_name` - Customize CSS class name generation
  - `designsetgo/custom_css_sanitize` - Additional sanitization rules
  - `designsetgo/custom_css_processed` - Post-process CSS after sanitization
  - `designsetgo/custom_css_output` - Control final CSS output
- New: Comprehensive developer documentation with 16+ practical examples in docs/CUSTOM-CSS-FILTERS.md

### Bug Fixes
- Fix: Section hover background now correctly renders behind content instead of over text
- Fix: Resolved z-index stacking issue where hover overlay appeared above section content

### Enhancements
- Enhancement: Improved Custom CSS textarea UX with better styling and increased height
- Enhancement: Added block name tracking to Custom CSS data structure for better debugging
- Documentation: Enhanced PHPDoc comments with detailed filter hook usage examples

## [1.1.1] - 2025-11-15

### Security Fixes
- Security: Fixed HIGH severity string escaping vulnerability in counter number formatting (CVE alerts #15-18)
- Security: Added escapeReplacement() function to prevent injection via replacement string special sequences
- Security: Enhanced GitHub Actions workflows with explicit permissions following principle of least privilege

### Changes
- Fix: Escape special characters in separator strings used by Counter and Counter Group blocks
- Enhancement: Added explicit permissions blocks to all GitHub Actions workflows for improved security posture

## [1.1.0] - 2025-11-14

### New Blocks
- New: Card block with multiple layout presets (horizontal, vertical, overlay, compact, featured)
- New: Map block with Google Maps and OpenStreetMap support, privacy mode, and customizable markers

### Admin Interface Overhaul
- New: Completely redesigned admin dashboard with stat cards showing blocks, extensions, and form submissions
- New: Enhanced dashboard displays blocks organized by category and extension status pills
- New: Tabbed settings interface organized into Features, Optimization, and Integrations tabs
- New: Google Maps API key management in Settings > Integrations with security guidance
- Enhancement: Two-column grid layouts for improved settings panel space efficiency
- Enhancement: Gradient icon stat cards with hover effects for better visual hierarchy
- Enhancement: Collapsible sections for advanced settings to reduce vertical scroll

### Translations
- Enhancement: Added translation support for 9 languages (Spanish, French, German, Italian, Portuguese, Dutch, Russian, Chinese, Japanese)
- Enhancement: Updated POT file with 100% translation coverage for all admin strings

### Security & Bug Fixes
- Security: Fixed js-yaml prototype pollution vulnerability (CVE-2023-2251)
- Fix: Added missing ToggleControl import to Card block editor component
- Fix: Google Maps API key now persists correctly after save/reload
- Fix: API key properly exposed to frontend via data attributes with secure referrer-based protection

## [1.0.1] - 2025-11-14

### Documentation
- Docs: Streamlined readme.txt with JTBD-focused messaging for better scannability
- Docs: Condensed description from 516 to 339 lines while keeping essential information
- Docs: Reordered FAQ to address user anxiety barriers first

## [1.0.0] - 2025-11-12

🚀 **Initial Release**

### 43 Professional Blocks
- 5 Container blocks (Row, Section, Flex, Grid, Stack)
- 13 Form Builder blocks (complete system with AJAX, spam protection, email notifications)
- 10 Interactive blocks (Tabs, Accordion, Flip Card, Slider, Counters, Progress Bar, Scroll effects)
- 8 Visual blocks (Icons, Icon Button, Icon List, Card, Pill, Divider, Countdown Timer, Blobs)
- 9 Child blocks (Tab, Accordion Item, Slide, Flip Card Front/Back, Icon List Item, Image Accordion Item, Scroll Accordion Item, Counter)

### 11 Universal Extensions
(work with ANY block)
- Block Animations (24+ effects with scroll triggers)
- Sticky Header (FSE-optimized with offset controls)
- Clickable Groups (accessible card/container links)
- Background Video (YouTube and self-hosted)
- Responsive Visibility (hide by device)
- Max Width (content width constraints)
- Custom CSS (per-block styling)
- Grid Span (column/row control)
- Reveal Control (advanced hover effects)
- Text Alignment Inheritance (parent-child context)

### Performance & Quality
- Built with WordPress core patterns for guaranteed editor/frontend parity
- Optimized bundles, no jQuery, code-splitting
- WCAG 2.1 AA accessible with full keyboard navigation
- FSE compatible with theme.json integration
- Comprehensive documentation and developer guides

### Requirements
- WordPress 6.0 or higher
- PHP 7.4 or higher
- Modern browser with JavaScript enabled

---

[1.2.0]: https://github.com/jnealey88/designsetgo/releases/tag/v1.2.0
[1.1.4]: https://github.com/jnealey88/designsetgo/releases/tag/v1.1.4
[1.1.3]: https://github.com/jnealey88/designsetgo/releases/tag/v1.1.3
[1.1.2]: https://github.com/jnealey88/designsetgo/releases/tag/v1.1.2
[1.1.1]: https://github.com/jnealey88/designsetgo/releases/tag/v1.1.1
[1.1.0]: https://github.com/jnealey88/designsetgo/releases/tag/v1.1.0
[1.0.1]: https://github.com/jnealey88/designsetgo/releases/tag/v1.0.1
[1.0.0]: https://github.com/jnealey88/designsetgo/releases/tag/v1.0.0
