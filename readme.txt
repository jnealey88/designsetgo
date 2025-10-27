=== DesignSetGo ===
Contributors: justinnealey
Donate link: https://designsetgo.com/donate
Tags: blocks, gutenberg, page builder, design, visual builder, layout, container, tabs, accordion
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Modern Gutenberg block library bridging the gap between core WordPress blocks and advanced page builders. Design made easy, fast, and beautiful.

== Description ==

DesignSetGo is a comprehensive collection of modern Gutenberg blocks designed to help you create stunning websites without the complexity of traditional page builders. Built using the same patterns as WordPress core blocks (Group, Columns, Cover), DesignSetGo provides full FSE support, exceptional performance, and guaranteed editor/frontend parity.

= Key Features =

**Advanced Layout Blocks**
* **Container Block** - Responsive grids, video backgrounds, overlays, and flexible layouts
* **Tabs Block** - Tabbed content with icons, deep linking, and mobile accordion mode
* **Accordion Block** - Collapsible panels with smooth animations

**Interactive Elements**
* **Counter Block** - Animated counting statistics with icons and formatters
* **Icon Block** - 500+ icons with customizable shapes and animations
* **Progress Bar Block** - Animated progress indicators with multiple styles

**Global Features**
* **Block Animations** - Add entrance and exit animations to ANY WordPress block with scroll, hover, click, or load triggers

**Why Choose DesignSetGo?**

✓ **Performance First** - Lightweight bundles, optimized code, no jQuery
✓ **WordPress Core Patterns** - Built using the same patterns as WordPress core blocks
✓ **Editor/Frontend Parity** - What you see in the editor matches the frontend exactly
✓ **FSE Compatible** - Works seamlessly with Full Site Editing and Site Editor
✓ **Theme Integration** - Respects theme.json colors, spacing, and typography
✓ **Accessibility** - WCAG 2.1 AA compliant with full keyboard navigation
✓ **Mobile Responsive** - All blocks are mobile-first and fully responsive
✓ **Progressive Enhancement** - Core functionality works even without JavaScript
✓ **No Vendor Lock-in** - Uses standard WordPress patterns, easy to migrate

= Block List =

1. **Container** - Advanced layout container with:
   - Responsive grids (Desktop/Tablet/Mobile columns)
   - Video backgrounds with poster images
   - Color overlays for better contrast
   - Content width constraints
   - Clickable containers (card links)
   - Responsive visibility controls

2. **Tabs** - Tabbed content with:
   - Horizontal or vertical orientation
   - 4 tab styles (Default, Pills, Underline, Minimal)
   - Icons with position control
   - Mobile modes (Accordion, Dropdown, Scrollable)
   - Deep linking support
   - Keyboard navigation

3. **Accordion** - Collapsible panels with:
   - Individual or group toggle modes
   - Icons and custom colors
   - Smooth animations
   - Schema.org markup for SEO

4. **Counter Group** - Animated statistics with:
   - CountUp.js integration
   - Number formatting (thousands separator, decimals)
   - Prefix/suffix support
   - Custom icons
   - Synchronized animations

5. **Icon Block** - Icon display with:
   - 500+ icon library
   - Shape styles (None, Circle, Square, Rounded)
   - Size and color controls
   - Link support
   - Hover animations

6. **Progress Bar** - Progress indicators with:
   - Percentage control (0-100%)
   - 3 bar styles (Solid, Striped, Animated)
   - Label positions (Above, Inside, Below)
   - Scroll-triggered animations
   - Custom colors

7. **Block Animations** - Universal animation system for ALL blocks:
   - 13 entrance animations (Fade In, Slide In, Zoom In, Bounce In, Flip In, etc.)
   - 11 exit animations (Fade Out, Slide Out, Zoom Out, Bounce Out, etc.)
   - 4 trigger types (Scroll, Load, Hover, Click)
   - Customizable duration, delay, and easing
   - Scroll offset and "animate once" controls
   - Accessible via lightning bolt icon in block toolbar
   - Works with any WordPress block (core or third-party)

= Built With WordPress Standards =

* Uses official WordPress APIs (useBlockProps, useInnerBlocksProps, Block Context)
* Follows WordPress Coding Standards and best practices
* Same development patterns as WordPress core blocks (Group, Columns, Cover)
* Declarative styling - no DOM manipulation or timing issues
* Full internationalization (i18n) support with translation-ready strings
* Comprehensive JSDoc documentation throughout codebase
* Regular updates and support

= Perfect For =

* Marketing sites and landing pages
* Business websites and portfolios
* Membership and community sites
* Educational and course platforms
* E-commerce product showcases
* Any site needing modern, flexible layouts

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

= Do I need a page builder plugin? =

No! DesignSetGo works with the native WordPress block editor (Gutenberg). You don't need Elementor, Beaver Builder, or any other page builder.

= Does this work with Full Site Editing (FSE)? =

Yes! All blocks are fully compatible with Full Site Editing and the Site Editor. You can use them in templates, template parts, and patterns.

= Is this compatible with my theme? =

DesignSetGo is designed to work with any modern WordPress theme. It respects your theme's colors, spacing, and typography settings from theme.json.

= Will this slow down my site? =

No! DesignSetGo is built for performance:
- Editor bundle: < 100 KB (continuously optimized)
- Frontend bundle: < 20 KB per block
- CSS bundle: < 30 KB total
- No jQuery dependency (saves 150 KB)
- Optimized animations using CSS and Intersection Observer
- Progressive enhancement - core layouts work without JavaScript
- Declarative styles apply instantly (no render delays)
- Code-split per block - only loads what you use

= Can I use these blocks with the Classic Editor? =

DesignSetGo requires the block editor (Gutenberg). If you're using the Classic Editor plugin, you'll need to switch to the block editor to use these blocks.

= Is this a freemium plugin? =

The free version is fully functional with all features included. We may offer premium add-ons in the future, but the core plugin will always remain free.

= How do I get support? =

- Check the [documentation](https://designsetgo.com/docs/)
- Visit the [support forum](https://wordpress.org/support/plugin/designsetgo/)
- Report bugs on [GitHub](https://github.com/designsetgo/designsetgo)

= Does this work with WooCommerce? =

Yes! You can use DesignSetGo blocks on any WooCommerce page, including product pages, shop pages, and custom layouts.

= Does the editor match the frontend exactly? =

Yes! DesignSetGo uses WordPress core patterns (useBlockProps, useInnerBlocksProps) to ensure 100% editor/frontend parity. What you see in the editor is exactly what appears on your live site. No surprises, no mismatches, no "why does it look different" moments.

= Can I translate this plugin? =

Absolutely! DesignSetGo is fully internationalized and ready for translation. Visit [translate.wordpress.org](https://translate.wordpress.org/projects/wp-plugins/designsetgo/) to contribute.

= Are there any conflicts with other plugins? =

DesignSetGo is built using WordPress standards and shouldn't conflict with well-coded plugins. If you experience issues, please report them in the support forum.

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

= 1.0.0 - 2025-01-XX =
* Initial release
* Container block with video backgrounds and responsive grids
* Tabs block with multiple orientations and styles
* Accordion block with toggle modes
* Counter Group block with CountUp.js
* Icon block with 500+ icons
* Progress Bar block with animations
* Block Animations extension - 24 animations for ANY WordPress block
* Full FSE (Full Site Editing) support
* WCAG 2.1 AA accessibility compliance
* Complete internationalization (i18n)
* Comprehensive documentation
* Built with WordPress core patterns (useBlockProps, useInnerBlocksProps)
* Editor/frontend parity - WYSIWYG reliability
* Progressive enhancement - works without JavaScript
* Optimized performance with declarative styling
* Code-split architecture for minimal bundle sizes

== Upgrade Notice ==

= 1.0.0 =
Initial release of DesignSetGo. Start creating beautiful layouts with modern Gutenberg blocks!

== Privacy Policy ==

DesignSetGo does NOT:
* Track you or your users
* Collect any personal data
* Send data to external servers
* Use cookies or localStorage for tracking
* Phone home or send analytics

DesignSetGo is 100% privacy-friendly and GDPR compliant.

== Credits ==

**Third-Party Libraries:**
* [CountUp.js](https://github.com/inorganik/countUp.js) - MIT License
* [@wordpress/scripts](https://www.npmjs.com/package/@wordpress/scripts) - GPLv2+

**Icons:**
* Built using WordPress Dashicons

== Support ==

Need help? We're here for you:

* [Documentation](https://designsetgo.com/docs/)
* [Support Forum](https://wordpress.org/support/plugin/designsetgo/)
* [GitHub Issues](https://github.com/designsetgo/designsetgo/issues)
* [Email Support](mailto:support@designsetgo.com)

== Contributing ==

We welcome contributions! Visit our [GitHub repository](https://github.com/designsetgo/designsetgo) to:

* Report bugs
* Suggest features
* Submit pull requests
* Improve documentation

== Development ==

Want to contribute to development?

**Repository:** https://github.com/designsetgo/designsetgo

**Build from source:**
```
npm install
npm run build
```

**Development:**
```
npm run start
```

**Testing:**
```
npm run lint:js
npm run lint:css
npm run lint:php
npm run test:unit
npm run test:e2e
```

== Technical Details ==

**Minimum Requirements:**
* WordPress 6.0 or higher
* PHP 7.4 or higher
* Modern browser with ES6 support

**Recommended:**
* WordPress 6.7 or higher
* PHP 8.0 or higher
* MySQL 5.7+ or MariaDB 10.3+

**Browser Support:**
* Chrome (last 2 versions)
* Firefox (last 2 versions)
* Safari (last 2 versions)
* Edge (last 2 versions)
* Mobile Safari (iOS 12+)
* Chrome Mobile (Android 8+)
