# DesignSetGo Blocks Roadmap

**Last Updated:** 2025-11-15
**Current Block Count:** 43 blocks
**Target Year 1:** 70+ blocks

---

## Philosophy

New blocks must pass the "Jobs-to-be-Done" test:

1. **Does it solve a real problem** that users face when building WordPress sites?
2. **Can't WordPress core or a popular plugin do this better?** (If yes, don't build)
3. **Does it maintain our promise** of no lock-in and WordPress-native patterns?
4. **Will it work with any theme** including FSE themes?
5. **Can we build it without bloat** and maintain performance?

**Principle:** We'd rather have 70 excellent blocks than 200 mediocre ones.

---

## Current State (v1.1.0)

### Shipped Blocks by Category

**Container Blocks (5)**
- Row
- Section
- Flex Container
- Grid Container
- Stack Container

**Form Builder (13)**
- Form Builder
- Text Field
- Email Field
- Phone Field
- Textarea Field
- Number Field
- URL Field
- Date Field
- Time Field
- Select Field
- Checkbox Field
- File Upload Field
- Hidden Field

**Interactive Blocks (10 + child blocks)**
- Tabs
- Accordion
- Flip Card
- Reveal
- Scroll Marquee
- Scroll Accordion
- Image Accordion
- Slider
- Counter Group
- Progress Bar
- Plus child blocks: Tab, Accordion Item, Slide, Flip Card Front, Flip Card Back, Image Accordion Item, Scroll Accordion Item, Counter

**Content & UI Blocks (8 + child blocks)**
- Icon
- Icon Button
- Icon List
- Card
- Pill
- Divider
- Countdown Timer
- Blobs
- Plus child blocks: Icon List Item

**Location Blocks (1)**
- Map

**Total:** 43 blocks

### Gap Analysis

**Missing but needed:**
- ✗ Spacer (vertical spacing control) - WordPress core has this
- ✅ Map (location display) - SHIPPED in v1.1.0
- ✗ Social Share (share buttons)
- ✗ Video (enhanced video player)
- ✗ Timeline (event chronology)
- ✗ Comparison Table (feature comparison)
- ✗ Before/After Slider (image comparison)
- ✗ Modal/Popup (content overlay)
- ✗ Testimonial (dedicated testimonial block)
- ✗ Posts Grid (dynamic content)
- ✗ Table of Contents (auto-generated from headings)

---

## Phase 1: Quick Wins & Essential Blocks
**Timeline:** v1.1.0 - v1.2.0 (Months 1-3)
**Goal:** Fill obvious gaps with high-value, low-effort blocks



### Media & Content

#### Enhanced Video Block
**Version:** v1.2.0
**Priority:** Medium | **Effort:** Medium | **Impact:** Medium

**Problem:** WordPress core video block lacks modern features like custom controls, lazy loading, and overlay text.

**Features:**
- Custom play button styling (size, color, icon)
- Video overlay with text/heading
- Lazy loading (loads on scroll)
- Thumbnail/poster image
- Aspect ratio presets (16:9, 9:16, 4:3, 1:1, 21:9)
- Autoplay with muted option
- Loop control
- Video controls (show/hide)
- Caption below video

**Why:** Better than core, fills gap between simple video and complex background video.

**JTBD:** "When I'm showcasing a product demo, I want a professional video player with custom branding, so it matches my site design."

---

#### Map Block
**Version:** v1.2.0
**Priority:** Medium | **Effort:** Medium | **Impact:** Medium

**Problem:** Users need location maps without complex API setup or third-party embeds.

**Features:**
- **Provider Options:**
  - OpenStreetMap (no API key needed, privacy-friendly)
  - Google Maps (requires API key, more features)

- **Core Features:**
  - Address search/autocomplete
  - Custom marker with icon/color
  - Zoom level (1-20)
  - Map center control
  - Height control (px or %)
  - Aspect ratio presets

- **Styling:**
  - Map styles/themes (for Google Maps)
  - Grayscale option
  - Custom marker popup
  - Border radius

- **Privacy:**
  - No map loads until user interaction (GDPR-friendly option)
  - "Click to load map" overlay

**Why:** Every business site needs location display. Current options require API keys or heavy plugins.

**JTBD:** "When I'm building a contact page, I want to show our location without dealing with Google API setup, so I can launch faster."

---

## Phase 2: Interactive & Engagement Blocks
**Timeline:** v1.3.0 - v1.5.0 (Months 4-6)
**Goal:** Blocks that drive user engagement and interactivity

### Interactive Elements

#### Timeline Block
**Version:** v1.4.0
**Priority:** High | **Effort:** Medium | **Impact:** High

**Problem:** Users need to display chronological events, company history, or process steps.

**Features:**
- **Layout:**
  - Vertical timeline (default)
  - Horizontal timeline
  - Alternating sides (vertical)
  - Single side (vertical)

- **Timeline Items (child block):**
  - Date/label
  - Icon or image
  - Heading
  - Description (rich text)
  - Optional link

- **Styling:**
  - Line color/thickness
  - Connector style (solid, dashed, dotted)
  - Milestone marker (circle, square, icon, image)
  - Marker size and color
  - Item spacing

- **Features:**
  - Scroll animations (items appear on scroll)
  - Active/inactive states
  - Mobile responsiveness (horizontal becomes vertical)

**Use Cases:**
- Company history
- Product development roadmap
- Event chronology
- Process/workflow steps
- Educational courses

**JTBD:** "When I'm showcasing our company history, I want a visual timeline that tells our story, so visitors understand our journey."

---

#### Modal/Popup Block
**Version:** v1.5.0
**Priority:** High | **Effort:** High | **Impact:** High

**Problem:** Users need overlay content without JavaScript libraries or complex plugins.

**Features:**
- **Trigger Options:**
  - Button click
  - Text/image click
  - Auto-delay (seconds after page load)
  - Scroll depth (% or px)
  - Exit intent (mouse leaves viewport)
  - Manual (via custom JS/link)

- **Modal Content:**
  - Uses InnerBlocks (any blocks inside)
  - Full-width or custom width
  - Max height with scroll
  - Padding control

- **Styling:**
  - Overlay color/opacity
  - Background color
  - Border radius
  - Shadow
  - Close button position/style
  - Animation (fade, slide, zoom, none)

- **Behavior:**
  - Close on overlay click
  - Close on ESC key
  - Prevent body scroll when open
  - Show once per session (cookie)
  - Show once per visitor (localStorage)
  - Re-open after X days

- **Accessibility:**
  - Focus trap
  - Keyboard navigation
  - Screen reader support
  - ARIA labels

**Use Cases:**
- Newsletter signup
- Video playback
- Image galleries
- Lead magnets
- Announcements
- Cookie consent

**JTBD:** "When I want to collect emails, I need a popup that doesn't annoy users or hurt SEO, so I can grow my list responsibly."

---

#### Before/After Slider Block
**Version:** v1.4.0
**Priority:** Medium | **Effort:** Medium | **Impact:** High

**Problem:** Users need image comparison for transformations, testimonials, or product demos.

**Features:**
- **Images:**
  - Before image (left/top)
  - After image (right/bottom)
  - Image upload or media library
  - Alt text for accessibility

- **Slider:**
  - Vertical or horizontal orientation
  - Drag handle to compare
  - Click/tap to move
  - Keyboard arrow keys to move
  - Starting position (default 50%)

- **Labels:**
  - "Before" and "After" text (customizable)
  - Label position (top-left, top-right, bottom-left, bottom-right)
  - Label styling (color, background, padding)
  - Show/hide labels

- **Handle:**
  - Icon (arrows or custom)
  - Color
  - Size
  - Shadow/glow for visibility

- **Styling:**
  - Border radius
  - Aspect ratio (preserve or custom)
  - Max width
  - Shadow

**Use Cases:**
- Before/after photos (fitness, design, renovation)
- Product comparisons
- Image editing showcase
- Historical comparisons

**JTBD:** "When I'm showing client transformations, I want an interactive before/after slider, so potential clients see the dramatic results."

---

#### Comparison Table Block
**Version:** v1.4.0
**Priority:** High | **Effort:** High | **Impact:** High

**Problem:** Users need feature comparison tables for products, services, or plans.

**Features:**
- **Table Structure:**
  - Header row (product/plan names)
  - Feature rows (add/remove rows)
  - Dynamic columns (2-6 columns)

- **Cell Content:**
  - Text
  - Checkmark ✓
  - X mark ✗
  - Custom icon
  - Number/value
  - Rich text (limited)

- **Styling:**
  - Featured column highlight
  - Alternating row colors
  - Header styling (background, text color)
  - Cell padding
  - Border styles
  - Responsive (stacks on mobile or horizontal scroll)

- **Features:**
  - Tooltips on hover (explain features)
  - Link in header (CTA button)
  - Sticky header on scroll
  - Sortable (future)

**Use Cases:**
- Pricing plan comparison
- Product features
- Service tiers
- Plugin/theme comparisons
- "This vs That" content

**JTBD:** "When I'm selling multiple plans, I want a clear comparison table that helps users choose, so I convert more visitors."

---

#### Testimonial Block
**Version:** v1.3.0
**Priority:** Medium | **Effort:** Low | **Impact:** Medium

**Problem:** Current solution uses generic blocks. Dedicated testimonial block with Schema.org markup is better for SEO.

**Features:**
- **Content:**
  - Testimonial text (quote)
  - Author name
  - Author title/company
  - Author image/avatar
  - Star rating (1-5, optional)
  - Date (optional)

- **Layout:**
  - Card style (with background)
  - Quote style (with quotation marks)
  - Minimal (text + attribution)

- **Styling:**
  - Background color/gradient
  - Border/shadow
  - Quote mark icon (show/hide)
  - Star color
  - Author image shape (circle, square, rounded)

- **Features:**
  - Schema.org Review markup (for SEO)
  - Link to full review
  - Company logo (optional)

**Use Cases:**
- Customer reviews
- Client testimonials
- Case study quotes
- Social proof

**JTBD:** "When I'm building trust, I want testimonials with star ratings and proper markup, so they appear in search results."

---

### Dynamic Content

#### Posts Grid Block
**Version:** v1.6.0
**Priority:** High | **Effort:** High | **Impact:** High

**Problem:** Users need to display blog posts, portfolio items, or custom post types with filtering and styling.

**Features:**
- **Query Options:**
  - Post type (posts, pages, custom post types)
  - Categories/tags/taxonomies
  - Author
  - Date range
  - Order by (date, title, random, menu order)
  - Posts per page
  - Offset (skip first X posts)
  - Exclude current post
  - Sticky posts (include/exclude/only)

- **Layout:**
  - Grid (2-6 columns)
  - List
  - Masonry (Pinterest-style)
  - Carousel (uses existing Slider block)

- **Display Options:**
  - Featured image (show/hide, aspect ratio)
  - Title (show/hide, heading level)
  - Excerpt (show/hide, length)
  - Meta (date, author, categories, tags, comments)
  - Read more link (text customization)

- **Filtering (frontend):**
  - Category filter dropdown
  - Tag filter
  - Search box
  - Animated filtering (no page reload)

- **Pagination:**
  - Numbered pagination
  - Load more button
  - Infinite scroll
  - No pagination (show all)

- **Styling:**
  - Card style (background, padding, shadow)
  - Image hover effects
  - Spacing controls
  - Typography controls

**Use Cases:**
- Blog index page
- Portfolio grid
- Team members
- Product showcase (without WooCommerce)
- News archive

**JTBD:** "When I'm building a blog, I want a beautiful post grid with filters, so readers find content easily without a page builder."

---

#### Table of Contents Block
**Version:** v1.6.0
**Priority:** High | **Effort:** Medium | **Impact:** High

**Problem:** Long-form content needs navigation. Users manually create anchor links or install heavy plugins.

**Features:**
- **Auto-Generation:**
  - Scans page for headings (H2-H6)
  - Generates anchor links automatically
  - Updates when headings change

- **Settings:**
  - Which heading levels to include (H2, H3, H4, etc.)
  - Hierarchical (nested) or flat list
  - Ordered or unordered list
  - Custom heading for TOC ("Contents", "On This Page", etc.)

- **Behavior:**
  - Smooth scroll to section
  - Scroll spy (highlight current section)
  - Collapsible on mobile
  - Sticky TOC option (stays in view while scrolling)

- **Styling:**
  - Bullet/number styles
  - Indentation for nested items
  - Active item highlight
  - Hover effects
  - Border/background

- **Accessibility:**
  - Keyboard navigation
  - Screen reader friendly
  - Skip to content link

**Use Cases:**
- Long blog posts
- Documentation pages
- Tutorial content
- Legal pages
- Guides and resources

**JTBD:** "When I write long articles, I want an auto-updating table of contents, so readers navigate easily and stay engaged."

---

#### Related Posts Block
**Version:** v1.6.0
**Priority:** Medium | **Effort:** Medium | **Impact:** Medium

**Problem:** Keep users on site longer by suggesting related content.

**Features:**
- **Relation Logic:**
  - By category (same categories)
  - By tag (shared tags)
  - By custom taxonomy
  - By author (same author)
  - Manual selection (choose specific posts)
  - Random

- **Settings:**
  - Number of posts (2-12)
  - Exclude current post
  - Order by (date, random, relevance)
  - Heading ("Related Posts", "You Might Like", etc.)

- **Layout:**
  - Grid (2-4 columns)
  - List
  - Carousel/Slider

- **Display:**
  - Featured image
  - Title
  - Excerpt (short)
  - Date/author
  - Category

- **Styling:**
  - Card backgrounds
  - Hover effects
  - Image aspect ratio
  - Spacing

**Use Cases:**
- Blog post endings
- Article suggestions
- Portfolio related work
- Product cross-sell

**JTBD:** "When readers finish an article, I want to suggest related content, so they stay engaged and explore more of my site."

---

#### Author Box Block
**Version:** v1.6.0
**Priority:** Low | **Effort:** Low | **Impact:** Low

**Problem:** Blog posts need author bio sections for credibility and social links.

**Features:**
- **Content:**
  - Author avatar (Gravatar or custom upload)
  - Author name
  - Bio/description
  - Social media links (Twitter, LinkedIn, Website, etc.)
  - Email link (optional)
  - Author archive link ("View all posts by...")

- **Layout:**
  - Horizontal (image left, content right)
  - Vertical (image top, content below)
  - Minimal (no image, just text)

- **Styling:**
  - Background color/border
  - Avatar shape (circle, square, rounded)
  - Avatar size
  - Social icon styles
  - Padding/spacing

- **Features:**
  - Auto-pull author data (from WordPress user)
  - Manual override (custom author for guest posts)
  - Multiple authors support

**Use Cases:**
- Blog post author bio
- Guest post credits
- Team member profiles
- Podcast host info

**JTBD:** "When I publish articles, I want author bios with social links, so readers connect with writers and follow them."

---

#### Breadcrumbs Block
**Version:** v1.6.0
**Priority:** Low | **Effort:** Low | **Impact:** Medium

**Problem:** Users need navigation hierarchy for UX and SEO.

**Features:**
- **Auto-Generation:**
  - Home → Category → Current Page
  - Home → Parent Page → Current Page
  - WooCommerce product hierarchy
  - Custom post type hierarchy

- **Settings:**
  - Separator (/, >, arrow, custom icon)
  - Show/hide home link
  - Home icon or text
  - Current page (linked or plain text)
  - Prefix text ("You are here:", "Current:", etc.)

- **Styling:**
  - Link colors (default, hover, current)
  - Font size/weight
  - Spacing between items
  - Background/border (optional)

- **Features:**
  - Schema.org BreadcrumbList markup (for SEO)
  - Custom breadcrumb override
  - Hide on homepage

**Use Cases:**
- E-commerce product pages
- Documentation sites
- Multi-level page hierarchies
- Blog category pages

**JTBD:** "When users browse my site, I want breadcrumbs for navigation, so they understand where they are and can go back easily."

---

## Phase 3: Advanced & Specialized Blocks
**Timeline:** v1.7.0 - v1.9.0 (Months 7-12)
**Goal:** Unique blocks that differentiate from competitors

### Advanced Interactive

#### Mega Menu Block
**Version:** v1.7.0
**Priority:** Medium | **Effort:** Very High | **Impact:** High

**Problem:** FSE themes need rich navigation menus beyond WordPress default.

**Features:**
- **Structure:**
  - Uses InnerBlocks for menu items
  - Multi-column dropdowns
  - Nested submenus (2-3 levels)

- **Menu Items:**
  - Text links
  - Icons + text
  - Images (featured menu items)
  - Descriptions under links
  - Buttons/CTAs
  - Highlighted items

- **Layout:**
  - Horizontal (desktop)
  - Vertical (sidebar navigation)
  - Hamburger menu (mobile)
  - Dropdown direction (left, right, center)

- **Features:**
  - Hover or click to open
  - Mobile-responsive (converts to accordion/drawer)
  - Search bar in menu
  - Sticky navigation integration
  - Close on outside click

- **Styling:**
  - Background colors (menu bar, dropdowns)
  - Link colors (default, hover, active)
  - Spacing/padding
  - Dropdown shadows
  - Animation effects

**Use Cases:**
- FSE header template parts
- E-commerce navigation
- Complex site structures
- Marketing site menus

**JTBD:** "When I'm building an FSE site, I want a rich navigation menu with images and descriptions, so users find what they need quickly."

---

#### Pricing Toggle Block
**Version:** v1.5.0
**Priority:** Medium | **Effort:** Low | **Impact:** Medium

**Problem:** Pricing pages need monthly/yearly switching without custom JavaScript.

**Features:**
- **Toggle:**
  - Monthly/Yearly labels (customizable)
  - Switch animation
  - Discount badge ("Save 20%")
  - Toggle style (switch, buttons, tabs)

- **Integration:**
  - Works with pricing table patterns
  - Updates prices dynamically
  - Hide/show elements based on selection

- **Settings:**
  - Default selection (monthly or yearly)
  - Discount percentage display
  - Custom toggle text

- **Styling:**
  - Toggle colors
  - Badge styling
  - Active state

**Use Cases:**
- SaaS pricing pages
- Subscription services
- Membership tiers

**JTBD:** "When I show pricing, I want users to toggle between monthly and yearly, so they see savings and choose longer plans."

---

### Content Display

#### Alert/Notice Block
**Version:** v1.3.0
**Priority:** Low | **Effort:** Low | **Impact:** Low

**Problem:** Need attention-grabbing notices for announcements, warnings, or tips.

**Features:**
- **Types:**
  - Info (blue)
  - Success (green)
  - Warning (yellow)
  - Error (red)
  - Tip (purple)
  - Custom

- **Content:**
  - Icon (auto or custom)
  - Heading (optional)
  - Message text (rich text)
  - Dismiss button (optional)

- **Styling:**
  - Background color
  - Border (left, all, none)
  - Border color/thickness
  - Icon color
  - Padding

- **Behavior:**
  - Dismissible (close button)
  - Remember dismissal (cookie)
  - Auto-hide after X seconds
  - Slide in animation

**Use Cases:**
- Announcements
- Cookie notices
- Form validation messages
- Help/tip boxes
- Warning messages

**JTBD:** "When I need to highlight important info, I want eye-catching alerts that users notice but can dismiss."

---

#### FAQ Block
**Version:** v1.5.0
**Priority:** Medium | **Effort:** Low | **Impact:** Medium

**Problem:** FAQ sections need Schema.org markup and dedicated styling beyond generic Accordion.

**Features:**
- **Structure:**
  - FAQ Item (child block) with question + answer
  - Based on Accordion but with FAQ-specific markup

- **Schema.org:**
  - FAQPage markup
  - Question/Answer entities
  - Rich results in Google Search

- **Settings:**
  - Allow multiple open (or close others)
  - Default all closed or first open
  - Custom icons (expand/collapse)

- **Styling:**
  - Question styling (bold, background, etc.)
  - Answer styling (padding, text color)
  - Dividers between items
  - Hover effects

- **Features:**
  - Search/filter FAQs
  - Jump links from Table of Contents
  - Print-friendly (all expanded)

**Use Cases:**
- FAQ pages
- Product documentation
- Support pages
- Onboarding content

**JTBD:** "When I create an FAQ page, I want proper Schema markup and search-friendly structure, so answers appear in Google."

**Note:** Could be built as variation of existing Accordion with Schema.org addition.

---

### WooCommerce Integration

#### Product Features List Block
**Version:** v1.8.0
**Priority:** Medium | **Effort:** Low | **Impact:** Medium

**Problem:** WooCommerce product pages need better feature presentation.

**Features:**
- **Content:**
  - Feature items (child blocks)
  - Icon per feature (500+ icons)
  - Feature text
  - Optional description

- **Layout:**
  - List (vertical)
  - Grid (2-3 columns)
  - Checklist style

- **Styling:**
  - Icon color/size
  - Checkmarks or custom icons
  - Background/borders
  - Spacing

- **Integration:**
  - Use on WooCommerce product pages
  - Pull from product attributes (future)

**Use Cases:**
- Product specifications
- What's included
- Feature highlights
- Benefits list

**JTBD:** "When selling products, I want attractive feature lists with icons, so customers see value at a glance."

---

#### Trust Badge Block
**Version:** v1.8.0
**Priority:** Low | **Effort:** Low | **Impact:** Low

**Problem:** E-commerce sites need trust signals (shipping, payment, guarantees).

**Features:**
- **Badge Types:**
  - Payment icons (Visa, Mastercard, PayPal, etc.)
  - Shipping (Free shipping, Fast delivery, etc.)
  - Guarantees (Money-back, Secure checkout, etc.)
  - Custom badge with icon + text

- **Layout:**
  - Horizontal row
  - Grid
  - Stacked

- **Content:**
  - Icon library (payment, shipping, security)
  - Custom text
  - Optional link

- **Styling:**
  - Grayscale or color icons
  - Size control
  - Spacing
  - Background/border

**Use Cases:**
- Product pages
- Cart/checkout pages
- Homepage (below hero)
- Footer

**JTBD:** "When customers hesitate to buy, I want trust badges that reduce friction, so conversion rates improve."

---

## Phase 4: Pro & Advanced Blocks
**Timeline:** v2.0.0+ (Year 2)
**Goal:** Premium blocks that justify Pro version

### Pro Blocks (Potential)

#### Advanced Form Fields (Pro)
**Version:** v2.0.0
**Priority:** TBD | **Effort:** High | **Impact:** High

- **Multi-select Field** - Choose multiple options
- **Radio Group Field** - Single choice with custom layouts
- **File Upload (Multiple)** - Upload multiple files
- **Signature Field** - Draw signature (canvas)
- **Star Rating Field** - Visual rating input
- **Slider Input Field** - Range slider
- **Color Picker Field** - Choose color
- **Matrix/Grid Field** - Table of questions

---

#### Advanced Slider/Carousel (Pro)
**Version:** v2.0.0
**Priority:** TBD | **Effort:** High | **Impact:** Medium

**Enhanced version of current Slider:**
- Ken Burns effect (zoom/pan)
- Parallax layers
- Video slides
- Custom transitions
- Thumbnail navigation
- Lightbox mode
- Synchronized sliders

---

#### Pricing Calculator (Pro)
**Version:** v2.1.0
**Priority:** TBD | **Effort:** High | **Impact:** Medium

**Problem:** SaaS and service businesses need interactive pricing.

**Features:**
- User inputs (sliders, dropdowns)
- Dynamic price calculation
- Discount logic
- Add-ons/extras
- Comparison with plans
- "Get Quote" button
- Save/share calculations

**Use Cases:**
- SaaS pricing
- Consulting fees
- Product configurators
- Service quotes

---

#### Advanced Data Table (Pro)
**Version:** v2.1.0
**Priority:** TBD | **Effort:** Very High | **Impact:** Medium

**Problem:** Complex data needs sorting, filtering, pagination.

**Features:**
- Import from CSV/Excel
- Sortable columns
- Searchable/filterable
- Pagination
- Responsive (horizontal scroll or stack)
- Sticky headers
- Freeze columns
- Export to CSV

**Use Cases:**
- Product comparisons
- Data reports
- Specifications
- Directory listings

---

#### Chat/Chatbot Block (Pro)
**Version:** v2.2.0
**Priority:** TBD | **Effort:** Very High | **Impact:** TBD

**Problem:** Sites need simple FAQ chatbot without external services.

**Features:**
- Conversational UI
- Question/answer pairs
- Branching logic
- Fallback to human (form)
- Trigger on page load/scroll
- Custom avatar
- Privacy-friendly (no tracking)

**Use Cases:**
- Customer support
- Lead qualification
- FAQ navigation
- Onboarding

---

## Anti-Roadmap: Blocks We Won't Build

❌ **Gutenberg Core Duplicates** - Don't build what WordPress already has (Paragraph, Image, Gallery, Quote, etc.)
❌ **Social Media Feeds** - Requires API keys, privacy concerns, and constant maintenance
❌ **Live Chat (External)** - Zendesk, Intercom, etc. already exist
❌ **Analytics Dashboard** - Outside scope, use dedicated tools
❌ **Site Search** - WordPress core handles this
❌ **Comments Block** - WordPress core comments work fine
❌ **Ecommerce Product Block** - WooCommerce provides this
❌ **Calendar/Booking** - Complex, plugins like Calendly integrate well
❌ **Email Marketing** - Mailchimp, ConvertKit, etc. handle this
❌ **Pop-up Builder (Complex)** - Would require SaaS infrastructure for targeting rules
❌ **Membership Gating** - Plugins like MemberPress do this comprehensively

**Principle:** Don't compete with core WordPress or established category leaders. Enhance, don't replace.

---

## Block Development Priorities

### High Priority (Build Soon)
1. **Spacer** - Essential gap in current offerings
2. **Timeline** - High demand, medium effort
3. **Modal/Popup** - Game-changer for conversions
4. **Comparison Table** - Needed for pricing/features
5. **Posts Grid** - Core dynamic content need
6. **Table of Contents** - SEO and UX win

### Medium Priority (Plan Carefully)
1. **Map** - Depends on API choice
2. **Before/After Slider** - Nice-to-have, visual impact
3. **Video (Enhanced)** - Competes with core, must be significantly better
4. **Testimonial** - Can use patterns for now
5. **Related Posts** - SEO benefit
6. **FAQ** - May be Accordion variation

### Low Priority (Defer)
1. **Social Share** - Low impact, alternatives exist
2. **Author Box** - Niche use case
3. **Breadcrumbs** - SEO plugins handle this
4. **Alert/Notice** - Can use patterns
5. **Trust Badge** - WooCommerce-specific

### Pro/Future (Research)
1. Advanced Form Fields
2. Pricing Calculator
3. Data Table
4. Chat/Chatbot
5. Advanced Slider

---

## Block Count Projections

| Phase | Timeline | New Blocks | Total Blocks |
|-------|----------|------------|--------------|
| Current | v1.0.1 | - | 47 |
| Phase 1 | v1.1.0-1.2.0 | +4 (Spacer, Map, Video, Social Share) | 51 |
| Phase 2 | v1.3.0-1.5.0 | +6 (Timeline, Modal, Before/After, Comparison Table, Testimonial, FAQ) | 57 |
| Phase 3 | v1.6.0-1.9.0 | +8 (Posts Grid, TOC, Related Posts, Author Box, Breadcrumbs, Mega Menu, Pricing Toggle, Alert) | 65 |
| Phase 4 | v2.0.0+ | +5-10 (Pro blocks) | 70-75 |

**Target:** 70+ blocks by end of Year 1

---

## Success Metrics per Block

Each new block should be evaluated on:

1. **Adoption Rate** - % of active installs using it (target: 20%+)
2. **Usage Frequency** - Average uses per site (target: 3+)
3. **Support Requests** - Low = good (target: <5 tickets/month)
4. **Performance Impact** - Bundle size increase (target: <5 KB)
5. **User Rating** - Feedback/reviews (target: 4+ stars)

**Review Process:** After 90 days, evaluate if block meets targets. If not, improve or deprecate.

---

## Block Request Process

**Users can request blocks via:**
1. GitHub issues (feature request template)
2. Community Discord (#feature-requests channel)
3. Support forum (tagged "feature request")

**Evaluation Criteria:**
- Does it pass the JTBD test?
- How many users request it? (>10 requests = high priority)
- Can it be built without bloat?
- Does it maintain WordPress standards?
- Is there a good alternative already?

**Response Time:** All requests acknowledged within 7 days, evaluated within 30 days.

---

## Version History

- **2025-11-14** - Initial blocks roadmap based on gap analysis

---

**Remember:** Quality over quantity. Every block must earn its place by solving a real problem better than existing solutions.
