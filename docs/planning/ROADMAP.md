# DesignSetGo Roadmap

**Last Updated:** 2025-11-14
**Current Version:** 1.0.1
**Strategy:** Jobs-to-be-Done driven development

---

## Philosophy

Every feature on this roadmap answers the question: **"Does this help users build professional WordPress sites faster without learning a new system?"**

Our development is guided by the Jobs-to-be-Done framework documented in [jtbd.md](jtbd.md). We prioritize features that:

1. **Make progress faster** - Reduce time from idea to published page
2. **Reduce anxiety** - Build trust through stability, performance, and documentation
3. **Maintain control** - No black boxes, no proprietary lock-in
4. **Stay WordPress-native** - Enhance, don't replace, the WordPress experience
5. **Enable portability** - Content survives plugin removal

---

## Current State (v1.0.1)

### Shipped Features
- **47 Professional Blocks**
  - 5 Container blocks (Row, Section, Flex, Grid, Stack)
  - 13 Form Builder blocks (complete system with AJAX, spam protection, email notifications)
  - 10 Interactive blocks (Tabs, Accordion, Flip Card, Slider, Counters, Progress Bar, Scroll effects)
  - 13 Visual blocks (Icons, Icon Button, Icon List, Pill, Divider, Countdown Timer, Blobs)
  - 6 Child blocks (Tab, Accordion Item, Slide, etc.)

- **7 Universal Extensions** (work with ANY block)
  - Block Animations (24 effects, 4 trigger types)
  - Responsive Visibility (hide by device)
  - Background Video (containers)
  - Clickable Groups (card links)
  - Sticky Header (FSE-optimized)
  - Custom CSS (per-block)
  - Grid Span (column control)

- **Performance & Quality**
  - Built with WordPress core patterns
  - Editor/frontend parity guaranteed
  - WCAG 2.1 AA accessible
  - FSE compatible with theme.json integration
  - Comprehensive documentation

### JTBD Scorecard

| Progress Factor | Rating | Status |
|----------------|--------|--------|
| Does the user see progress fast? | **Strong** |  Real-time preview, no refresh delays |
| Does the user feel safe? | **Strong** |  Built with WP standards, proper deprecation |
| Does the user stay in control? | **Strong** |  No proprietary markup, transparent CSS |
| Does the product remove friction? | **Strong** |  One plugin replaces many |
| Does the product reduce anxiety? | **Medium** |   Need social proof, trust signals |
| Does the user return? | **Medium** |   Need patterns, templates, discovery |

**Focus Areas:** Phases 1-2 address the "Medium" ratings above.

---

## Phase 1: Build Trust & Reduce Anxiety
**Timeline:** Months 1-3
**Goal:** Remove adoption barriers, prove stability and quality
**JTBD Impact:** Addresses "Anxiety of Change" and "Trust Barriers"

### 1.1 Documentation & Education

#### Block Pattern Library (v1.1.0)
**Priority:** High | **Effort:** Medium | **Impact:** High

- [ ] **Hero Sections** (5 variations)
  - Centered with image background
  - Split layout with form
  - Minimal with large heading
  - Video background with CTA
  - Animated with Counter Group

- [ ] **Pricing Tables** (3 layouts)
  - 3-column comparison
  - Toggle monthly/yearly (using Tabs)
  - Featured plan highlight

- [ ] **Feature Grids** (4 styles)
  - Icon + heading + description (Grid Container)
  - Flip Cards for interactive reveals
  - Accordion for detailed features
  - Image Accordion for visual features

- [ ] **Testimonial Sections** (3 designs)
  - Slider carousel
  - Grid layout with icons
  - Single featured with image

- [ ] **FAQ Sections**
  - Accordion with Schema.org markup
  - Two-column layout
  - Tabbed categories

- [ ] **Contact Sections** (3 variations)
  - Form Builder + contact info
  - Split layout with map
  - Simple centered form

- [ ] **Team/About Sections**
  - Grid with hover effects
  - Slider for large teams
  - Split content with images

- [ ] **Call-to-Action Blocks** (6 variations)
  - Centered with button
  - Split with image
  - Countdown timer urgency
  - Progress bar gamification
  - Video background
  - Minimal text-only

**Success Metric:** 20+ patterns by v1.1.0, 40+ by end of Phase 1

#### Video Tutorial Series (v1.1.0-1.2.0)
**Priority:** High | **Effort:** Medium | **Impact:** High

- [ ] **Getting Started Series** (5 videos, 2-4 min each)
  - Installation and first steps
  - Understanding containers (Row, Section, Flex, Grid, Stack)
  - Building your first layout
  - Using extensions (animations, responsive visibility)
  - Form Builder basics

- [ ] **Container Deep-Dive** (4 videos)
  - Row vs Flex vs Grid: When to use which
  - Responsive layouts without code
  - Nesting containers effectively
  - Width constraints and full-width sections

- [ ] **Form Builder Mastery** (3 videos)
  - Building contact forms
  - Advanced validation and conditional logic (future)
  - Styling and customization

- [ ] **Interactive Elements** (5 videos)
  - Creating tabbed interfaces
  - FAQ sections with Accordion
  - Product showcases with Flip Cards
  - Statistics with Counter Group
  - Content sliders and carousels

- [ ] **Extensions Showcase** (7 videos, one per extension)
  - Block Animations in action
  - Responsive Visibility strategies
  - Background Video best practices
  - Clickable Groups for card designs
  - Sticky Header for FSE themes
  - Custom CSS power-user tips
  - Grid Span for asymmetric layouts

- [ ] **Migration Guides** (3 videos)
  - "Replacing Elementor with DesignSetGo"
  - "From Divi to Native Blocks"
  - "Beaver Builder to Block Editor"

**Success Metric:** 25+ videos with 10,000+ total views by end of Phase 1

#### Interactive Showcase Site (v1.1.0)
**Priority:** High | **Effort:** High | **Impact:** High

- [ ] **Block Library**
  - Live examples of every block
  - Interactive demos (click to see it work)
  - Copy-paste code snippets
  - Mobile preview toggle

- [ ] **Pattern Library**
  - Visual gallery of all patterns
  - One-click copy to clipboard
  - Category filtering
  - Search functionality

- [ ] **Real-World Examples**
  - 10+ complete page examples
  - Various industries (agency, e-commerce, portfolio, etc.)
  - Performance metrics for each
  - Source code view

- [ ] **Performance Dashboard**
  - Live PageSpeed Insights integration
  - Comparison charts (vs Elementor, Divi)
  - Bundle size visualization
  - Core Web Vitals tracking

- [ ] **"Built with DesignSetGo" Gallery**
  - User submission system
  - Featured sites (weekly rotation)
  - Filter by category/industry
  - Performance badges

**Success Metric:** 50+ featured examples by end of Phase 1

### 1.2 Social Proof & Community

#### Case Studies (v1.1.0-1.2.0)
**Priority:** High | **Effort:** Medium | **Impact:** High

- [ ] **Agency Site Rebuild**
  - Before: Elementor-based site
  - After: DesignSetGo implementation
  - Performance comparison (load time, PageSpeed score)
  - Development time saved
  - Client feedback

- [ ] **E-commerce Product Pages**
  - WooCommerce integration showcase
  - Product tabs, image galleries, size guides
  - Conversion rate impact
  - Mobile performance

- [ ] **Membership Site Migration**
  - Complex layouts with restricted content
  - Form integration for registrations
  - Performance under load
  - User experience improvements

- [ ] **Portfolio/Creative Agency**
  - Visual-heavy site
  - Image Accordion, Sliders, Flip Cards
  - Animation showcase
  - Client handoff experience

- [ ] **SaaS Landing Pages**
  - High-conversion design patterns
  - A/B testing results
  - Form submission rates
  - Trust badge usage

**Success Metric:** 5 detailed case studies with metrics

#### Performance Benchmarks (v1.1.0)
**Priority:** High | **Effort:** Low | **Impact:** High

- [ ] **Head-to-Head Comparisons**
  - DesignSetGo vs Elementor vs Divi
  - Same page layout, three implementations
  - Load time, bundle size, PageSpeed scores
  - Mobile vs desktop performance

- [ ] **PageSpeed Insights Documentation**
  - Typical scores (before/after examples)
  - Best practices for maintaining performance
  - Common pitfalls to avoid

- [ ] **Core Web Vitals Analysis**
  - LCP, FID, CLS measurements
  - How DesignSetGo optimizes each metric
  - Real-world site examples

- [ ] **Bundle Size Breakdown**
  - CSS: <30 KB total
  - JS per block analysis
  - No jQuery = 150 KB saved
  - Code-splitting benefits

- [ ] **"Performance Badge" System**
  - Sites can display "Built Fast with DesignSetGo" badge
  - Automated performance verification
  - Badge tiers (Good, Great, Excellent)

**Success Metric:** Published benchmarks showing 40%+ performance improvement vs competitors

#### Community Infrastructure (v1.1.0-1.2.0)
**Priority:** Medium | **Effort:** Medium | **Impact:** Medium

- [ ] **Discord/Slack Launch**
  - #general, #help, #showcase, #development channels
  - Active moderation
  - Weekly office hours

- [ ] **Weekly Design Challenge**
  - Theme announced Monday
  - Submissions due Friday
  - Featured winner showcase
  - Community voting

- [ ] **User Showcase Gallery**
  - Submission form with permission system
  - Featured sites (with credits)
  - Category organization
  - Social sharing

- [ ] **Testimonial Collection**
  - Automated request system (after 30 days)
  - Easy submission form
  - Display on marketing site
  - WordPress.org review prompts

**Success Metric:** 500+ community members, 20+ user showcases

### 1.3 Missing Block Types (Quick Wins)

#### New Blocks (v1.2.0)
**Priority:** Medium | **Effort:** Low | **Impact:** Medium

- [ ] **Spacer Block**
  - Simple vertical spacing control
  - Responsive height (desktop/tablet/mobile)
  - Visual height indicator in editor
  - Complements Divider block

- [ ] **Video Block Enhancement**
  - Better than core video block
  - Custom play button styling
  - Lazy loading
  - Thumbnail preview
  - Aspect ratio presets
  - Video overlay with text

- [ ] **Map Block**
  - Embedded maps without API complexity
  - OpenStreetMap or Google Maps options
  - Custom marker styling
  - Address search
  - Zoom and center controls

- [ ] **Social Share Block**
  - Share buttons with modern styling
  - Facebook, Twitter/X, LinkedIn, Pinterest, Email
  - Icon-only or icon+text layouts
  - Custom colors
  - Share counts (optional)

**Success Metric:** 51 total blocks by v1.2.0

---

## Phase 2: Increase Return Engagement
**Timeline:** Months 4-6
**Goal:** Make users come back, discover more value
**JTBD Impact:** Addresses "Return Engagement" and "Habit of Present"

### 2.1 Template System

#### Starter Templates (v1.3.0)
**Priority:** High | **Effort:** High | **Impact:** High

- [ ] **Homepage Templates** (3 variations)
  - **Business:** Hero + features + testimonials + CTA
  - **Creative:** Full-screen hero + portfolio grid + about
  - **Minimal:** Clean typography + simple sections + contact

- [ ] **About Page** (2 layouts)
  - Team grid + company story + timeline
  - Split layout + stats counter + mission/values

- [ ] **Services Page** (2 layouts)
  - Icon list + accordion FAQs + contact form
  - Grid layout + flip cards + pricing table

- [ ] **Contact Page**
  - Form Builder + contact info + map
  - Business hours + team members

- [ ] **Landing Pages** (2 high-conversion layouts)
  - Lead generation with countdown timer
  - Product launch with video + testimonials

**Success Metric:** 10 complete page templates

#### Section Templates (v1.3.0-1.4.0)
**Priority:** High | **Effort:** Medium | **Impact:** High

- [ ] **Hero Sections** (8 variations)
  - Full-width with video background
  - Split with form
  - Minimal centered
  - Image carousel
  - Counter statistics
  - Countdown timer
  - Animated text
  - Search bar

- [ ] **Feature Showcases** (6 variations)
  - Grid with icons
  - Tabs with images
  - Accordion with details
  - Flip cards
  - Timeline
  - Comparison table (future)

- [ ] **Pricing Comparisons** (4 variations)
  - 3-column table
  - Toggle monthly/yearly
  - Single highlighted plan
  - Accordion pricing tiers

- [ ] **Team Introductions** (3 variations)
  - Grid with hover effects
  - Slider carousel
  - List with bios

- [ ] **Testimonial Displays** (4 variations)
  - Slider with ratings
  - Grid layout
  - Single featured
  - Scroll marquee

- [ ] **Newsletter Signup** (3 variations)
  - Inline form
  - Modal popup (future)
  - Section with benefits

- [ ] **Footer Layouts** (4 variations)
  - Multi-column with links
  - Centered minimal
  - Newsletter + social
  - Sitemap style

**Success Metric:** 30+ section templates

### 2.2 Enhanced Discovery Features

#### Block Recommendations (v1.3.0)
**Priority:** Medium | **Effort:** Medium | **Impact:** Medium

- [ ] **"You Might Also Like..."**
  - Suggest complementary blocks
  - Example: Insert Form Builder ’ suggest Countdown Timer for urgency
  - Contextual suggestions in block inserter

- [ ] **Usage Patterns**
  - "People who use Tabs also use Icon List"
  - Based on aggregate anonymous usage data
  - Respect privacy (no tracking)

- [ ] **Context-Aware Suggestions**
  - Detect pattern intent from content
  - Example: "Contact" heading ’ suggest Form Builder
  - "Team" heading ’ suggest Grid with images

**Success Metric:** 20% increase in blocks discovered per user

#### Quick Insert Toolbar (v1.3.0)
**Priority:** Low | **Effort:** Low | **Impact:** Medium

- [ ] **Most-Used Blocks Shortcut**
  - Pin frequently used blocks
  - Customizable quick toolbar
  - Per-user preferences

- [ ] **Recent Blocks History**
  - Last 10 blocks inserted
  - Quick re-insert

- [ ] **Favorites/Bookmarks**
  - Star favorite blocks
  - Separate category in inserter

**Success Metric:** 30% faster block insertion for repeat users

### 2.3 Extension Enhancements

#### New Extensions (v1.4.0)
**Priority:** Medium | **Effort:** Medium | **Impact:** High

- [ ] **Parallax Extension**
  - Parallax scrolling for any block
  - Speed control (0.5x - 2x)
  - Direction (up, down, left, right)
  - Works with images, containers, text
  - Mobile disable option

- [ ] **Hover Effects Extension**
  - Advanced hover states for any block
  - Effects: lift, glow, rotate, scale, tilt
  - Transition timing control
  - Color shift on hover
  - Shadow on hover
  - Works with links and buttons

- [ ] **Scroll Animations Extension**
  - Position-based animations during scroll
  - Scale, rotate, translate effects
  - Trigger range (start/end scroll points)
  - Easing functions
  - Different from entrance animations

- [ ] **Shape Dividers Extension**
  - Add SVG shape dividers to containers
  - Top and/or bottom positioning
  - 12+ shapes (wave, curve, triangle, etc.)
  - Color control
  - Flip and rotate options

**Success Metric:** 11 total universal extensions

### 2.4 Form Builder Expansion

#### Advanced Form Features (v1.4.0-1.5.0)
**Priority:** High | **Effort:** High | **Impact:** High

- [ ] **Multi-Step Forms**
  - Wizard-style forms with steps
  - Progress indicator
  - Previous/Next buttons
  - Step validation
  - Save progress (localStorage)
  - Mobile-optimized

- [ ] **Conditional Logic**
  - Show/hide fields based on selections
  - Example: "Which service?" ’ show relevant fields
  - Support for: equals, not equals, contains, greater than, less than
  - Multiple condition rules (AND/OR)
  - Visual rule builder in editor

- [ ] **Form Analytics** (Privacy-Friendly)
  - Submission count tracking
  - Field completion rates
  - Abandonment points
  - No personal data stored
  - Dashboard in WordPress admin
  - Export CSV reports

- [ ] **Webhook Integration**
  - Send form data to external services
  - Zapier, Make, Webhooks.site support
  - Custom headers and authentication
  - Retry logic for failures
  - Test webhook feature

- [ ] **Save & Resume**
  - Let users save partial submissions
  - Email magic link to resume
  - Expire after X days
  - Privacy controls

**Success Metric:** Form Builder becomes #1 reason users choose DesignSetGo

---

## Phase 3: Advanced Features & Differentiation
**Timeline:** Months 7-12
**Goal:** Features competitors don't have, strengthen market position
**JTBD Impact:** Strengthens "Pull of New Solution"

### 3.1 Dynamic Content Blocks

#### Core Dynamic Blocks (v1.6.0)
**Priority:** High | **Effort:** High | **Impact:** High

- [ ] **Posts Grid**
  - Display blog posts with filtering/sorting
  - Category/tag filters
  - Date filters
  - Search functionality
  - Pagination or load more
  - Custom post type support
  - Layout: grid, list, masonry
  - Excerpt length control

- [ ] **Custom Query Block**
  - Advanced post queries
  - Meta field queries
  - Taxonomy queries
  - Date range queries
  - Author filters
  - Offset and per-page controls
  - Visual query builder

- [ ] **Related Posts**
  - Context-aware related content
  - By category, tag, or custom taxonomy
  - Exclude current post
  - Custom heading
  - Grid or list layout

- [ ] **Author Box**
  - Author bio with avatar
  - Social media links
  - Author archive link
  - Custom styling
  - Multiple layout options

- [ ] **Breadcrumbs**
  - Accessibility-focused navigation
  - Schema.org markup
  - Customizable separators
  - Home icon option
  - Current page styling

- [ ] **Table of Contents**
  - Auto-generated from headings (H2-H6)
  - Smooth scroll to anchor
  - Scroll spy (highlight current section)
  - Collapsible on mobile
  - Hierarchical or flat list
  - Custom heading levels

**Success Metric:** 6 new dynamic blocks, 57 total blocks

### 3.2 Advanced Interactive Blocks

#### New Interactive Blocks (v1.6.0-1.7.0)
**Priority:** High | **Effort:** High | **Impact:** High

- [ ] **Timeline Block**
  - Vertical or horizontal timeline
  - Milestone points with content
  - Icons and images
  - Alternating left/right layout (vertical)
  - Scroll animations
  - Date labels

- [ ] **Comparison Table**
  - Feature comparison with highlighting
  - Checkmark/X indicators
  - Featured column highlight
  - Responsive (stacks on mobile)
  - Header row styling
  - Custom colors per column

- [ ] **Pricing Toggle**
  - Switch between monthly/yearly pricing
  - Animated price changes
  - "Save X%" badge
  - Works with pricing patterns
  - Custom toggle labels

- [ ] **Testimonial Carousel**
  - Auto-rotating testimonials
  - Star ratings
  - Author image + name + company
  - Autoplay with pause on hover
  - Touch/swipe support
  - Navigation dots

- [ ] **Before/After Slider**
  - Image comparison slider
  - Drag handle to compare
  - Vertical or horizontal
  - Labels ("Before" / "After")
  - Custom handle styling

- [ ] **Modal/Popup Block**
  - Lightbox-style content popups
  - Trigger: button click, auto-delay, scroll depth
  - Close on overlay click
  - Close button styling
  - Animation effects
  - Cookie to show once

- [ ] **Mega Menu**
  - Rich navigation menus
  - Works with FSE headers
  - Multi-column dropdowns
  - Icons and images in menu
  - Featured items
  - Responsive mobile menu

**Success Metric:** 7 new interactive blocks, 64 total blocks

### 3.3 WooCommerce Integration

#### WooCommerce Blocks (v1.7.0-1.8.0)
**Priority:** Medium | **Effort:** High | **Impact:** Medium

- [ ] **Product Grid (Enhanced)**
  - Better than WooCommerce defaults
  - Custom layouts
  - Hover effects
  - Quick view
  - Add to cart without reload
  - Filter by category, tag, attribute
  - Sale badge styling

- [ ] **Product Comparison**
  - Side-by-side product features
  - Add products to compare
  - Feature checkmarks
  - Price comparison
  - Responsive table

- [ ] **Product Tabs**
  - Custom product information tabs
  - Description, reviews, specs, shipping
  - Icon support
  - Custom tab content
  - Replaces default WooCommerce tabs

- [ ] **Size Guide**
  - Custom size charts
  - Table with measurements
  - Image support
  - Modal or inline display
  - Per-product or global

- [ ] **Trust Badges**
  - Payment icons
  - Shipping guarantees
  - Security badges
  - Money-back guarantee
  - Icon + text layouts

- [ ] **Product Countdown**
  - Limited-time offer timers
  - Per-product countdowns
  - Sale end time
  - Stock countdown
  - Urgency messaging

**Success Metric:** WooCommerce users represent 20% of active installations

### 3.4 Performance & Developer Tools

#### Advanced Controls (v1.8.0-1.9.0)
**Priority:** Medium | **Effort:** Medium | **Impact:** High

- [ ] **Global Styles Manager**
  - Create reusable style presets
  - Save button styles, heading styles, etc.
  - Apply to multiple blocks
  - Export/import presets
  - Design system integration

- [ ] **Copy/Paste Styles**
  - Transfer styles between blocks
  - Copy all settings at once
  - Paste to single or multiple blocks
  - Cross-page style transfer

- [ ] **Design Tokens**
  - Consistent spacing system
  - Size scale (xs, sm, md, lg, xl)
  - Border radius tokens
  - Shadow tokens
  - Apply across all blocks

- [ ] **CSS Variables Integration**
  - Use theme CSS variables
  - Auto-detect available variables
  - Dropdown selector for variables
  - Fallback value support

- [ ] **Block Locking**
  - Prevent editing of specific blocks
  - "Client mode" safe editing
  - Lock content, attributes, or removal
  - Password protection (admin only)

- [ ] **Conditional Display**
  - Show blocks based on:
    - User role (admin, editor, subscriber, etc.)
    - Login status (logged in/out)
    - Date range
    - Day of week / time of day
    - Custom PHP conditions (advanced)

**Success Metric:** Power users report 50%+ time savings

---

## Phase 4: Pro Features & Ecosystem
**Timeline:** Year 2
**Goal:** Sustainable business model, enterprise features
**JTBD Impact:** Long-term sustainability without compromising core promise

### 4.1 DesignSetGo Pro (Optional Premium)

**Core Philosophy:** Extensions stay free, charge for advanced implementations

#### Pro Features (v2.0.0)
**Priority:** TBD | **Effort:** High | **Impact:** High

- [ ] **Advanced Animation Timeline**
  - Keyframe-based animations
  - Visual timeline editor
  - Multiple animation layers
  - Export/import animations

- [ ] **Dynamic Content Pro**
  - ACF (Advanced Custom Fields) integration
  - Toolset integration
  - MetaBox integration
  - Custom field display blocks
  - Repeater field support

- [ ] **Advanced Form Features**
  - Stripe payment integration
  - File upload to cloud storage (S3, Dropbox)
  - Email autoresponders
  - Form abandonment tracking
  - Advanced spam protection (reCAPTCHA)

- [ ] **White Label**
  - Remove DesignSetGo branding
  - Custom plugin name
  - Custom block category
  - Agency licensing

- [ ] **Multi-Site Management**
  - Sync settings across sites
  - Global pattern library
  - Centralized template management
  - Bulk updates

- [ ] **Priority Support**
  - Dedicated support channel
  - Video call support
  - Priority bug fixes
  - Feature request priority

- [ ] **Pro Templates**
  - 50+ premium starter sites
  - Industry-specific templates
  - Regular new releases
  - Figma design files included

**Pricing Model:** $99/year or $249/lifetime per site

### 4.2 Developer Ecosystem

#### Developer Tools (v2.1.0)
**Priority:** Medium | **Effort:** High | **Impact:** Medium

- [ ] **Block Development CLI**
  - `npx create-dsgo-block`
  - Scaffold custom blocks using DesignSetGo patterns
  - Pre-configured build process
  - Example templates

- [ ] **Extension API**
  - Let developers create third-party extensions
  - Documented hook system
  - Extension marketplace (future)
  - Quality guidelines

- [ ] **Custom Block Workshop**
  - Educational series on building blocks
  - Video tutorials
  - Written guides
  - Code examples

- [ ] **Component Library**
  - Reusable React components
  - Pre-built inspector controls
  - Common UI patterns
  - Published on npm

- [ ] **Hooks & Filters Reference**
  - Complete developer documentation
  - Filter examples
  - Action hooks
  - PHP and JavaScript APIs

**Success Metric:** 100+ developer contributors, 10+ third-party extensions

### 4.3 AI-Assisted Features

#### AI Tools (v2.2.0+)
**Priority:** Low | **Effort:** High | **Impact:** TBD

**Note:** AI features must maintain user control and transparency

- [ ] **Pattern Suggestions**
  - AI suggests patterns based on page content
  - "This looks like an About page, try these patterns"
  - Non-intrusive suggestions

- [ ] **Content Enhancement**
  - AI writing assistance for:
    - Form confirmation messages
    - Call-to-action text
    - Button labels
  - User always has final say

- [ ] **Accessibility Checker**
  - AI-powered WCAG compliance scanning
  - Suggest alt text for images
  - Contrast ratio checking
  - Keyboard navigation testing

- [ ] **Performance Optimizer**
  - AI suggests optimizations
  - Unused block detection
  - Heavy media warnings
  - Alternative layout suggestions

**Success Metric:** TBD - monitor user reception carefully

### 4.4 Enterprise Features

#### Enterprise Tools (v2.3.0+)
**Priority:** Low | **Effort:** High | **Impact:** Medium

- [ ] **Client Mode**
  - Simplified editor for non-technical users
  - Hide advanced controls
  - Pre-approved blocks only
  - Guided editing experience

- [ ] **Role-Based Block Access**
  - Control which blocks users can insert
  - Per-role permissions
  - Block category restrictions
  - Extension access control

- [ ] **Design System Enforcement**
  - Lock color palette
  - Restrict typography choices
  - Enforce spacing scale
  - Brand guideline compliance

- [ ] **Brand Guidelines Integration**
  - Import brand colors from PDF/file
  - Font pairing suggestions
  - Logo usage rules
  - Spacing and sizing standards

- [ ] **Audit Trail**
  - Track who changed what
  - Block edit history
  - Rollback capability
  - Compliance reporting

- [ ] **Multi-Language Support**
  - WPML integration
  - Polylang integration
  - TranslatePress integration
  - String translation management

**Pricing Model:** Enterprise license $499+/year

---

## Anti-Roadmap: What We WON'T Build

To maintain focus and stay true to our JTBD, we explicitly **will not** build:

L **Separate Visual Builder** - No proprietary drag-and-drop interface outside WordPress
L **Site Management Tools** - No hosting, backups, security, or server management
L **Theme Replacement** - We enhance themes, not replace them
L **Complete Design Automation** - No "AI builds your site" features that remove user control
L **Content Creation Tools** - No blog post generators, content spinners, or SEO writers
L **Analytics Dashboard** - Let Google Analytics, Matomo, etc. handle that
L **Email Marketing Platform** - Integrate with existing tools, don't replace them
L **E-commerce Platform** - WooCommerce does this well, we enhance it
L **Membership Systems** - Plugins exist for this, we provide the design blocks
L **Proprietary Markup** - Everything we build uses WordPress standards
L **Vendor Lock-In Features** - Content must survive plugin removal

**Principle:** Before building a feature, ask: "Does WordPress or a popular plugin already handle this well?"

---

## Success Metrics by Phase

### Phase 1: Trust Building (Months 1-3)
- [ ] Active installations: 5,000+
- [ ] WordPress.org reviews: 100+ (4.5+ star average)
- [ ] Showcase sites: 50+ featured examples
- [ ] Video tutorial views: 10,000+ total
- [ ] Support satisfaction: >90% positive
- [ ] Documentation pages: 50+ articles
- [ ] Community members: 500+ Discord/Slack

### Phase 2: Engagement (Months 4-6)
- [ ] Monthly active users: 50% of installs
- [ ] Patterns used: Average 5+ per site
- [ ] Return usage: 60% use on 2+ sites
- [ ] Community members: 1,000+
- [ ] User-submitted showcases: 20+
- [ ] Template downloads: 1,000+
- [ ] Tutorial completion rate: 40%+

### Phase 3: Differentiation (Months 7-12)
- [ ] Active installations: 20,000+
- [ ] Developer integrations: 10+ third-party extensions
- [ ] Enterprise clients: 50+ agencies
- [ ] Performance benchmarks: 40%+ better than competitors
- [ ] Case studies: 10+ published
- [ ] Revenue (if Pro launched): $50,000+ MRR
- [ ] Support ticket resolution: <24 hours average

### Phase 4: Sustainability (Year 2+)
- [ ] Active installations: 50,000+
- [ ] Pro subscriptions: 2,000+ (if launched)
- [ ] Developer ecosystem: 100+ contributors
- [ ] Enterprise contracts: 200+ agencies
- [ ] WordPress.org top 100 plugin
- [ ] Community members: 5,000+
- [ ] Revenue: $200,000+ ARR

---

## Development Priority Matrix

### High Impact, Low Effort (Do First)
1. Block Pattern Library (20 patterns)
2. Spacer block
3. Video tutorials (first 5)
4. Showcase site MVP
5. Performance benchmarks
6. Social share block
7. Map block

### High Impact, High Effort (Plan Carefully)
1. Multi-step forms
2. Conditional logic
3. Dynamic content blocks
4. Template system (10 templates)
5. WooCommerce integration
6. Pro version infrastructure
7. Developer API/ecosystem

### Low Impact, Low Effort (Quick Wins)
1. Copy/paste styles
2. Block favorites
3. Recent blocks history
4. Global color swatches
5. Block keyboard shortcuts

### Low Impact, High Effort (Defer/Avoid)
1. AI content generation (too early, conflicts with control principle)
2. Custom hosting integration (outside scope)
3. Built-in analytics platform (conflicts with privacy promise)
4. Complete theme framework (conflicts with theme compatibility promise)

---

## Release Schedule

### Q1 2025 (Phase 1: Trust)
- **v1.1.0** - Block Pattern Library (20 patterns), Showcase site, First 5 tutorials
- **v1.2.0** - Spacer, Map, Social Share, Video blocks, 20 more patterns, Performance benchmarks

### Q2 2025 (Phase 1 Continued)
- **v1.2.5** - Community Discord launch, 10 more tutorials, 3 case studies
- **v1.3.0** - Template system (10 page templates, 15 section templates), Block recommendations

### Q3 2025 (Phase 2: Engagement)
- **v1.4.0** - Parallax, Hover Effects, Shape Dividers, Scroll Animations extensions
- **v1.5.0** - Multi-step forms, Conditional logic, Form analytics, Webhook integration

### Q4 2025 (Phase 3: Differentiation)
- **v1.6.0** - Posts Grid, Custom Query, Related Posts, Author Box, Breadcrumbs, TOC blocks
- **v1.7.0** - Timeline, Comparison Table, Pricing Toggle, Before/After Slider blocks

### Q1 2026 (Phase 3 Continued)
- **v1.8.0** - Modal/Popup, Mega Menu blocks, Global Styles Manager, Copy/Paste Styles
- **v1.9.0** - WooCommerce integration (6 blocks), Product-specific features

### Q2 2026 (Phase 4: Pro Launch)
- **v2.0.0** - DesignSetGo Pro launch, Advanced Animations, Dynamic Content Pro
- **v2.1.0** - Developer CLI, Extension API, Component Library

---

## How to Use This Roadmap

### For Users
This roadmap shows what's coming and when. If you need a feature, check here first. Want to influence priorities? Join the community and share your use case.

### For Contributors
Pick items marked with your skill level. Each major feature will have a GitHub issue with detailed requirements. Comment on issues to claim them.

### For Stakeholders
This roadmap is a living document. Priorities may shift based on:
- User feedback and feature requests
- WordPress core changes (FSE evolution)
- Market opportunities
- Technical discoveries
- Resource availability

**Guiding Principle:** We'd rather ship fewer features that solve real problems than many features that add complexity.

---

## Feedback & Requests

Have a feature request? Here's how to submit it:

1. **Check this roadmap** - Is it already planned?
2. **Describe the job** - What progress are you trying to make?
3. **Submit an issue** - Use the feature request template on GitHub
4. **Join the discussion** - Community vote helps prioritize

**Good Feature Request:**
> "When I'm building a services page, I want to show before/after examples of my work, so potential clients can see the transformation. A before/after slider block would let me do this without installing another plugin."

**Less Helpful Request:**
> "Add a before/after slider."

The first explains the **job to be done**. The second only describes a solution.

---

## Version History

- **2025-11-14** - Initial roadmap based on JTBD framework
- **TBD** - Next review after Phase 1 completion

---

**Remember:** Every feature must answer: "Does this help users build professional WordPress sites faster without learning a new system?"

If yes ’ Roadmap.
If no ’ Anti-roadmap.
