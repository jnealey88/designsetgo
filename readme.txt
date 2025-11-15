=== DesignSetGo ===
Contributors: justinnealey
Donate link: https://designsetgoblocks.com/donate
Tags: blocks, gutenberg, form-builder, animations, responsive
Requires at least: 6.0
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 1.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Professional WordPress blocks without page builder bloat. 49 blocks + 7 universal extensions that enhance ANY block.

== Description ==

**When you need professional design features but page builders feel too heavy, too complex, or too limiting.**

DesignSetGo gives you the power of a page builder with the simplicity of WordPress blocks. Build layouts, forms, interactive elements, and stunning visuals—all using the native block editor you already know.

= Why DesignSetGo? =

✓ **Works Like WordPress** - If you know blocks, you know DesignSetGo. No separate interface, no learning curve.
✓ **49 Blocks, One Plugin** - Replaces multiple plugins: forms, sliders, tabs, accordions, counters, cards, maps, and more.
✓ **7 Universal Extensions** - Add animations, responsive visibility, sticky headers, and custom CSS to ANY WordPress block (including core blocks).
✓ **Performance First** - Lightweight code, no jQuery, optimized bundles. Your site stays fast.
✓ **No Lock-In** - Built with WordPress standards. What you build works with or without the plugin.
✓ **Editor = Frontend** - What you see in the editor is exactly what appears on your site. No surprises.

= What's Included =

**Layouts & Containers (5 blocks)**
Build responsive layouts without code: flex, grid, stacks, rows, and full-width sections with content width controls.

**Complete Form Builder (13 blocks)**
Professional forms with AJAX submission, spam protection, and email notifications. Includes text, email, phone, textarea, number, URL, date, time, select, checkbox, file upload, and hidden fields. No external services required.

**Interactive Elements (10 blocks)**
Tabs, accordions, flip cards, sliders, scroll effects, counters, progress bars, and revealing content. All with smooth animations and mobile-responsive behavior.

**Visual Components (15 blocks)**
Icons (500+), icon buttons, icon lists, pills/badges, dividers (8 styles), countdown timers, organic blob shapes, content cards with multiple layout presets, and interactive maps with Google Maps and OpenStreetMap support.

**Universal Extensions (7 extensions)**
These work with ANY WordPress block—including core blocks and third-party blocks:
* **Block Animations** - 24 effects with scroll/hover/click triggers
* **Responsive Visibility** - Hide blocks by device
* **Background Video** - Add videos to containers
* **Clickable Groups** - Turn containers into links
* **Sticky Header** - Advanced sticky controls for FSE
* **Custom CSS** - Per-block custom styling
* **Grid Span** - Column control for grid layouts

= Perfect For =

* **Freelancers & Agencies** - Build client sites faster without learning another page builder
* **Business Websites** - Professional forms, FAQs, service listings, and call-to-action sections
* **Marketing & Landing Pages** - Eye-catching layouts with counters, flip cards, and animations
* **Portfolios & Showcases** - Image galleries, sliders, and scroll effects for stunning presentations
* **Membership & Community Sites** - Registration forms, organized content, gamification elements
* **E-commerce Sites** - Enhanced product pages with sliders, icon lists, and custom layouts

== Installation ==

= Automatic Installation =

1. Log in to your WordPress dashboard
2. Go to **Plugins > Add New**
3. Search for "DesignSetGo"
4. Click **Install Now**
5. Click **Activate**
6. Start using blocks in the block editor!

= Manual Installation =

1. Download the plugin ZIP file
2. Log in to your WordPress dashboard
3. Go to **Plugins > Add New > Upload Plugin**
4. Choose the ZIP file and click **Install Now**
5. Click **Activate**
6. Blocks are now available in the editor

= After Activation =

1. Edit any post or page
2. Click the **+** button to add a block
3. Find DesignSetGo blocks in the **DesignSetGo** category
4. Insert a block and configure using the inspector controls
5. Check the documentation for detailed guides

== Frequently Asked Questions ==

= Will this work with my theme? =

Yes! DesignSetGo is designed to work with any modern WordPress theme. It respects your theme's colors, spacing, and typography settings from theme.json. Tested with Twenty Twenty-Five and FSE themes.

= Will this slow down my site? =

No! DesignSetGo is built for performance. The entire CSS bundle is under 30 KB, there's no jQuery dependency (saves 150 KB), and blocks only load what you actually use. Your PageSpeed scores stay high.

= Do I need to know how to code? =

Not at all. If you can use WordPress blocks, you can use DesignSetGo. Everything is controlled through the familiar block inspector—no code required. (But if you want to add custom CSS to any block, you can!)

= What happens if I deactivate the plugin? =

Your content stays intact. Because DesignSetGo uses WordPress standards, your layouts won't break—they'll just render as standard containers and content. No proprietary markup means no lock-in.

= Does the editor match the frontend? =

Yes, exactly. DesignSetGo uses the same patterns as WordPress core blocks to guarantee what you see in the editor is what appears on your live site. No surprises.

= Do I need Contact Form 7 or another form plugin? =

No! DesignSetGo includes a complete form builder with 11 field types, AJAX submission, spam protection, and email notifications. Everything is built-in and works without external services.

= Does this work with Full Site Editing (FSE)? =

Absolutely. All blocks work seamlessly with FSE, the Site Editor, templates, and template parts. The Sticky Header extension is specifically designed for FSE header template parts.

= Can I use this with WooCommerce? =

Yes! Use DesignSetGo blocks on any WooCommerce page to enhance product layouts, create custom sections, and build better shopping experiences.

= How do I get support? =

Check the [documentation](https://designsetgoblocks.com/docs/), visit the [support forum](https://wordpress.org/support/plugin/designsetgo/), or report bugs on [GitHub](https://github.com/designsetgo/designsetgo).

== Screenshots ==

1. Container block with responsive grid layout and video background support
2. Tabs block with horizontal orientation, icons, and multiple style options
3. Accordion block with collapsible panels and smooth animations
4. Counter Group block with animated statistics and number formatting
5. Icon block with 500+ icons, shape styles, and customization options
6. Progress Bar block with animated fills and multiple display styles
7. Block animation controls showing entrance effects and timing options
10. Mobile responsive preview in the editor

== Changelog ==

= 1.1.0 - 2025-11-14 =
**New Blocks:**
* New: Card block with multiple layout presets (horizontal, vertical, overlay, compact, featured)
* New: Map block with Google Maps and OpenStreetMap support, privacy mode, and customizable markers

**Admin Interface Overhaul:**
* New: Completely redesigned admin dashboard with stat cards showing blocks, extensions, and form submissions
* New: Enhanced dashboard displays blocks organized by category and extension status pills
* New: Tabbed settings interface organized into Features, Optimization, and Integrations tabs
* New: Google Maps API key management in Settings > Integrations with security guidance
* Enhancement: Two-column grid layouts for improved settings panel space efficiency
* Enhancement: Gradient icon stat cards with hover effects for better visual hierarchy
* Enhancement: Collapsible sections for advanced settings to reduce vertical scroll

**Translations:**
* Enhancement: Added translation support for 9 languages (Spanish, French, German, Italian, Portuguese, Dutch, Russian, Chinese, Japanese)
* Enhancement: Updated POT file with 100% translation coverage for all admin strings

**Security & Bug Fixes:**
* Security: Fixed js-yaml prototype pollution vulnerability (CVE-2023-2251)
* Fix: Added missing ToggleControl import to Card block editor component
* Fix: Google Maps API key now persists correctly after save/reload
* Fix: API key properly exposed to frontend via data attributes with secure referrer-based protection

= 1.0.1 - 2025-11-14 =
* Docs: Streamlined readme.txt with JTBD-focused messaging for better scannability
* Docs: Condensed description from 516 to 339 lines while keeping essential information
* Docs: Reordered FAQ to address user anxiety barriers first

= 1.0.0 - 2025-11-12 =

🚀 **Initial Release**

**47 Professional Blocks:**
* 5 Container blocks (Row, Section, Flex, Grid, Stack)
* 13 Form Builder blocks (complete system with AJAX, spam protection, email notifications)
* 10 Interactive blocks (Tabs, Accordion, Flip Card, Slider, Counters, Progress Bar, Scroll effects)
* 13 Visual blocks (Icons, Icon Button, Icon List, Pill, Divider with 8 styles, Countdown Timer, Blobs)
* 6 Child blocks (Tab, Accordion Item, Slide, etc.)

**7 Universal Extensions** (work with ANY block):
* Block Animations (24 effects, 4 trigger types)
* Responsive Visibility (hide by device)
* Background Video (containers)
* Clickable Groups (card links)
* Sticky Header (FSE-optimized)
* Custom CSS (per-block)
* Grid Span (column control)

**Performance & Quality:**
* Built with WordPress core patterns for guaranteed editor/frontend parity
* Optimized bundles, no jQuery, code-splitting
* WCAG 2.1 AA accessible with full keyboard navigation
* FSE compatible with theme.json integration
* Comprehensive documentation and developer guides

== Upgrade Notice ==

= 1.0.0 =
Initial release with 47 professional blocks + 7 universal extensions. Build stunning WordPress sites without page builders—native blocks with the power you need.

== Privacy & Security ==

DesignSetGo respects your privacy:
* No tracking or analytics
* No data collection
* No external server connections
* No cookies or localStorage for tracking
* 100% GDPR compliant

Form submissions are processed on your server and sent via your WordPress email system. No third-party services required.
