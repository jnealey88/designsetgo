# DesignSetGo - Future Block Ideas

**Last Updated:** 2025-11-15
**Status:** Research & Ideation
**Purpose:** Explore innovative blocks beyond the current roadmap

---

## Document Purpose

This document captures block ideas that go beyond the [BLOCKS-ROADMAP.md](BLOCKS-ROADMAP.md), including:
- WooCommerce-specific blocks for e-commerce sites
- Advanced query loop variations for dynamic content
- Marketing automation and conversion optimization blocks
- Advanced media and interactive experiences
- Specialized blocks for niches (e-learning, local business, etc.)

**Note:** These are exploratory ideas. Each must pass the "Jobs-to-be-Done" test and WordPress-native principles before development.

---

## WooCommerce Integration Blocks

### Product Showcase Hero
**Priority:** High | **Effort:** Medium | **Impact:** High

**Problem:** Product pages need compelling hero sections with immediate purchase options.

**Features:**
- Featured product display with large image/gallery
- Product title, price, rating
- Add to cart button (WooCommerce native)
- Stock status indicator
- Sale badge/discount percentage
- Product variations selector (color, size)
- Quick view/zoom functionality
- Background options (solid, gradient, image)

**JTBD:** "When showcasing a hero product, I want an eye-catching section with purchase option, so visitors convert without scrolling."

---

### WooCommerce Product Query Block
**Priority:** High | **Effort:** High | **Impact:** High

**Problem:** Posts Grid is great for content, but WooCommerce products need commerce-specific filters.

**Features:**
- **Product Filters:**
  - Category/tag/attribute
  - Price range (min/max)
  - On sale only
  - Featured products
  - Stock status (in stock, out of stock, backorder)
  - Product rating (4+ stars, etc.)
  - Product type (simple, variable, grouped)
  - Exclude products/categories

- **Display Options:**
  - Product image
  - Title
  - Price (regular + sale)
  - Rating stars
  - Add to cart button
  - Quick view button
  - Sale badge
  - Stock indicator
  - Short description

- **Layout:**
  - Grid (2-6 columns)
  - List
  - Carousel
  - Masonry

- **Frontend Filtering:**
  - Filter by category
  - Filter by price range (slider)
  - Filter by attributes (color, size, etc.)
  - Sort by (popularity, rating, price, newest)
  - AJAX filtering (no page reload)

- **Pagination:**
  - Standard pagination
  - Load more button
  - Infinite scroll

**Use Cases:**
- Shop page alternative
- Category showcases
- Sale/promotion sections
- Related products (smarter than default)
- Cross-sell displays

**JTBD:** "When building a shop page, I want advanced product queries with filters, so customers find products easily without a page builder."

---

### Mini Cart Block
**Priority:** Medium | **Effort:** Medium | **Impact:** High

**Problem:** Fixed header needs cart icon with item count and quick checkout.

**Features:**
- Cart icon with item count badge
- Slide-out cart drawer on click
- Cart items list (mini view)
- Subtotal display
- Remove item from cart
- Quantity adjustment
- View cart/checkout buttons
- Empty cart state
- Position control (header, floating, sidebar)
- Color/styling options
- Animation on add to cart

**JTBD:** "When customers add products to cart, I want a visible cart icon they can access anywhere, so they checkout faster."

---

### Product Comparison Block
**Priority:** Medium | **Effort:** High | **Impact:** Medium

**Problem:** Customers need to compare multiple WooCommerce products side-by-side.

**Features:**
- Select 2-4 products to compare
- Show product images
- Compare attributes/specifications
- Compare prices
- Compare ratings
- Compare availability
- Add to cart from comparison
- Highlight differences
- Sticky header columns
- Mobile responsive (horizontal scroll)
- Save/share comparison

**Use Cases:**
- Product category pages
- Landing pages
- Product selection help
- Technical specifications comparison

**JTBD:** "When evaluating similar products, I want side-by-side comparison, so I make informed purchasing decisions."

---

### Recently Viewed Products
**Priority:** Low | **Effort:** Low | **Impact:** Medium

**Problem:** Help customers return to products they were considering.

**Features:**
- Auto-track viewed products (cookie/localStorage)
- Display 3-6 recently viewed items
- Exclude current product
- Horizontal carousel
- Clear history option
- Privacy-friendly (local storage)
- Limit number of stored products
- Time-based expiration

**JTBD:** "When browsing products, I want to see what I recently viewed, so I can return to items I'm considering."

---

### Product Categories Grid
**Priority:** Medium | **Effort:** Low | **Impact:** Medium

**Problem:** Shop homepage needs visual category navigation.

**Features:**
- Display product categories
- Category image/thumbnail
- Category name
- Product count
- Custom icon per category
- Grid or masonry layout
- Hover effects
- Link to category archive
- Include/exclude specific categories
- Order by (name, count, custom)
- Show subcategories

**JTBD:** "When customers land on shop page, I want category navigation with images, so they find product types quickly."

---

### Upsell/Cross-Sell Block
**Priority:** Medium | **Effort:** Medium | **Impact:** High

**Problem:** Increase average order value with smart product suggestions.

**Features:**
- Manual product selection
- Auto-based on categories/tags
- "Frequently bought together"
- "You may also like"
- Add multiple to cart (bundles)
- Discount for bundle
- Display on product/cart/checkout pages
- Inline or sidebar placement

**JTBD:** "When customers are ready to buy, I want smart upsells that feel helpful, so average order value increases."

---

### Product Reviews Showcase
**Priority:** Low | **Effort:** Low | **Impact:** Medium

**Problem:** Highlight best reviews for social proof beyond default WooCommerce display.

**Features:**
- Display product reviews
- Filter by rating (5-star only, 4+ stars, etc.)
- Sort by (most recent, most helpful, highest rating)
- Reviewer name and avatar
- Verified purchase badge
- Review images (if available)
- Pagination or carousel
- Show specific product or aggregate reviews
- Schema.org Review markup

**JTBD:** "When building trust, I want to showcase top reviews prominently, so hesitant customers feel confident buying."

---

### Wishlist Block
**Priority:** Low | **Effort:** High | **Impact:** Medium

**Problem:** Customers want to save products for later consideration.

**Features:**
- Add to wishlist button
- Wishlist page/popup
- Share wishlist (link)
- Move to cart from wishlist
- Remove from wishlist
- Logged-in and guest support
- Email wishlist to self
- Wishlist count badge

**Use Cases:**
- Product pages
- Product grids
- Gift registries
- Save for later

**JTBD:** "When I find products I like, I want to save them for later, so I can compare and decide before buying."

---

### Stock Scarcity Block
**Priority:** Medium | **Effort:** Low | **Impact:** Medium

**Problem:** Create urgency with real-time stock information.

**Features:**
- "Only X left in stock" message
- Stock level bar (visual)
- Low stock threshold setting
- Color-coded (red for low, green for in stock)
- Position control (near add to cart)
- Auto-hide when out of stock
- Countdown for restocking date
- Custom messaging

**JTBD:** "When stock is low, I want customers to see scarcity, so they purchase before missing out."

---

## Advanced Query & Dynamic Content

### Custom Post Type Query Builder
**Priority:** High | **Effort:** High | **Impact:** High

**Problem:** Sites with custom post types (portfolio, team, events, etc.) need flexible display without code.

**Features:**
- Select any custom post type
- Query by custom taxonomies
- Query by custom fields (ACF, Meta Box, Pods)
- Advanced meta queries (date ranges, number ranges, text matching)
- Relation logic (AND/OR)
- Display custom fields in layout
- Template builder for CPT layout
- Repeater field support

**Use Cases:**
- Portfolio grids
- Team member directories
- Event listings
- Case studies
- Testimonial rotators
- Real estate listings

**JTBD:** "When I have custom post types, I want to display them beautifully without custom PHP, so I control content layout in the editor."

---

### Taxonomy Terms Display
**Priority:** Medium | **Effort:** Medium | **Impact:** Medium

**Problem:** Display category lists, tag clouds, or custom taxonomy terms.

**Features:**
- Select taxonomy (category, tag, custom)
- Display as grid, list, or cloud
- Term count display
- Term description
- Custom icon per term
- Link to term archive
- Include/exclude specific terms
- Order by (name, count, custom)
- Hierarchical display (parent/child)
- Color-coded terms

**Use Cases:**
- Blog category navigation
- Product category lists
- Topic clouds
- Location filters
- Skill tags

**JTBD:** "When organizing content by topics, I want visual taxonomy navigation, so visitors browse categories easily."

---

### Archive Query Block
**Priority:** Medium | **Effort:** Medium | **Impact:** Medium

**Problem:** Archive pages (category, tag, author, date) need custom layouts.

**Features:**
- Auto-detect archive type
- Custom layout per archive type
- Archive title and description
- Post count
- Custom post display
- Breadcrumbs integration
- Filter options
- Pagination

**Use Cases:**
- Category archive pages
- Tag pages
- Author archives
- Date-based archives
- Custom taxonomy archives

**JTBD:** "When visitors land on archive pages, I want custom-designed layouts, so archives look as good as my homepage."

---

### Filtered Portfolio/Gallery
**Priority:** High | **Effort:** Medium | **Impact:** High

**Problem:** Portfolios and galleries need category filtering without page reload.

**Features:**
- Filter by category/tag
- Animated filtering (fade/slide)
- Masonry or grid layout
- Lightbox on click
- Hover overlay effects
- AJAX loading
- Search functionality
- Sort options (date, title, random)
- Lazy loading images

**Use Cases:**
- Creative portfolios
- Image galleries
- Project showcases
- Before/after galleries
- Product categories

**JTBD:** "When showcasing portfolio work, I want visitors to filter projects instantly, so they find relevant examples without waiting."

---

### Related Content (Advanced)
**Priority:** Medium | **Effort:** Medium | **Impact:** Medium

**Problem:** WordPress related posts are basic; need smarter content recommendations.

**Features:**
- Multiple relation methods (category, tag, author, custom field)
- Weighted scoring (prioritize certain criteria)
- Exclude already-read posts (cookie tracking)
- Time decay (prefer recent content)
- Manual override (pin specific posts)
- Include multiple post types
- Personalization based on user behavior
- A/B testing for algorithm

**JTBD:** "When readers finish content, I want smart recommendations that keep them engaged, so time-on-site and page views increase."

---

### Dynamic Content Block
**Priority:** High | **Effort:** Very High | **Impact:** High

**Problem:** Display different content based on user conditions (role, logged-in, location, device, etc.).

**Features:**
- **Conditions:**
  - User role (subscriber, customer, etc.)
  - Logged in/out
  - User meta fields
  - Date/time ranges
  - Day of week
  - Device type (mobile, tablet, desktop)
  - Browser
  - Referral source
  - Cookie values
  - Query parameters
  - WooCommerce conditions (has purchased, cart total, etc.)

- **Content:**
  - Uses InnerBlocks (any content inside)
  - Multiple condition sets (if/else)
  - Default fallback content

- **Use Cases:**
  - Member-only content
  - Geo-targeted messaging
  - Time-based promotions
  - Device-specific layouts
  - Personalized CTAs

**JTBD:** "When personalizing content, I want rule-based display without plugins, so visitors see relevant content that converts better."

---

### Content Scheduler Block
**Priority:** Medium | **Effort:** Low | **Impact:** Medium

**Problem:** Show/hide content blocks based on date/time without republishing pages.

**Features:**
- Start date/time
- End date/time
- Timezone handling
- Countdown to reveal
- Auto-hide after end date
- "Coming soon" placeholder
- Recurring schedules (weekly, monthly)
- Multiple date ranges

**Use Cases:**
- Limited-time promotions
- Event information
- Seasonal content
- Product launches
- Holiday messages
- Course enrollment periods

**JTBD:** "When running time-limited promotions, I want content to auto-show/hide, so I don't manually update pages daily."

---

## Marketing & Conversion Optimization

### Social Proof Notifications
**Priority:** High | **Effort:** High | **Impact:** High

**Problem:** Show live activity to create FOMO and social proof.

**Features:**
- Display recent actions (purchases, signups, downloads)
- Source from WooCommerce orders
- Source from form submissions
- Source from custom events
- Fake/demo mode for testing
- Real-time or recent (last X hours)
- Display position (bottom-left, bottom-right, top)
- Show/hide rules (delay, pages, user type)
- Dismissible or auto-hide
- Animation effects
- Privacy-friendly (anonymize data)

**Example Messages:**
- "John from New York just purchased [Product]"
- "5 people are viewing this page right now"
- "23 people signed up today"

**JTBD:** "When visitors are undecided, I want social proof notifications that show activity, so they trust the site and convert."

---

### Scarcity Timer Block
**Priority:** Medium | **Effort:** Medium | **Impact:** High

**Problem:** Create urgency beyond simple countdown timers.

**Features:**
- Stock countdown ("Only 5 left!")
- Time-based countdown (expires in X hours)
- Quantity sold countdown ("10 of 50 sold")
- Visitor countdown ("5 spots remaining")
- Evergreen countdown (personal deadline per visitor)
- Action after expiration (hide block, show message, redirect)
- WooCommerce stock integration
- Custom messaging
- Visual urgency (colors, animations)

**JTBD:** "When running limited offers, I want authentic scarcity timers, so customers act fast without feeling manipulated."

---

### Lead Magnet Block
**Priority:** High | **Effort:** Medium | **Impact:** High

**Problem:** Offer downloadable resources in exchange for email.

**Features:**
- File upload (PDF, ebook, template, etc.)
- Email collection form (integration with Form Builder)
- Instant download or email delivery
- Custom thank-you message
- Redirect after submission
- Email service integration (Mailchimp, ConvertKit, etc.)
- Preview of lead magnet (cover image, description)
- GDPR consent checkbox
- Countdown timer for urgency

**Use Cases:**
- Ebooks
- Templates
- Checklists
- Whitepapers
- Resource libraries
- Discount codes

**JTBD:** "When growing email list, I want lead magnet blocks that exchange value for emails, so I build an engaged audience."

---

### Exit-Intent Popup
**Priority:** Medium | **Effort:** Medium | **Impact:** High

**Problem:** Capture abandoning visitors with last-chance offers.

**Features:**
- Trigger on exit intent (mouse leaves viewport)
- Delay trigger (X seconds on page first)
- Scroll depth trigger (seen X% of page)
- Custom content (use Modal block)
- Frequency control (once per session, per week, etc.)
- Cookie/localStorage for "don't show again"
- A/B testing variants
- Mobile behavior (scroll trigger, not exit)

**Use Cases:**
- Newsletter signup
- Discount offers
- Cart abandonment recovery
- Survey requests
- Alternative CTA

**JTBD:** "When visitors leave, I want one last chance to engage them, so I reduce bounce rate and capture more leads."

---

### Sticky CTA Bar
**Priority:** Medium | **Effort:** Low | **Impact:** Medium

**Problem:** Keep call-to-action visible as users scroll.

**Features:**
- Sticky at top or bottom of viewport
- Show after scroll depth
- Hide on certain pages/sections
- Button + text
- Close/dismiss button
- Slide-in animation
- Background color/gradient
- Mobile responsive
- Link to any URL or anchor

**Use Cases:**
- Limited-time offers
- Event registration
- Newsletter signup
- App download
- Contact sales

**JTBD:** "When visitors scroll, I want CTAs to follow them, so conversion opportunities are always visible."

---

### Survey/Poll Block
**Priority:** Medium | **Effort:** Medium | **Impact:** Medium

**Problem:** Gather user feedback and engagement.

**Features:**
- Single or multiple choice questions
- Star ratings
- Text feedback (optional)
- Show results after submission
- Percentage bars for results
- Vote count
- Anonymous or require email
- One vote per user (cookie/IP)
- Export results to CSV
- Display on specific pages/posts
- Random question rotation

**Use Cases:**
- Customer satisfaction
- Product feedback
- Content preferences
- Quick polls
- Engagement tool

**JTBD:** "When gathering feedback, I want simple polls that engage visitors, so I understand audience needs and improve content."

---

### Quiz Block
**Priority:** High | **Effort:** Very High | **Impact:** High

**Problem:** Interactive quizzes drive engagement and lead generation.

**Features:**
- Multiple question types (multiple choice, true/false, image choice)
- Scoring system
- Result pages based on score
- Personality quiz (result based on answer patterns)
- Progress indicator
- Timer (optional)
- Email gate (require email to see results)
- Share results on social
- Retake option
- Answer explanations
- Jump to specific questions
- Conditional questions (skip based on answer)

**Use Cases:**
- Knowledge tests
- Personality assessments
- Product finders
- Lead qualification
- Entertainment/engagement

**JTBD:** "When engaging visitors, I want interactive quizzes that collect emails, so I grow my list while providing value."

---

### Coupon Code Display
**Priority:** Low | **Effort:** Low | **Impact:** Medium

**Problem:** Display promotional codes with easy copy functionality.

**Features:**
- Coupon code input
- Click-to-copy button
- Copied confirmation
- Expiration date display
- Countdown timer
- Terms and conditions
- Discount amount display
- Background styling
- Dashed border (coupon look)
- Integration with WooCommerce coupon validation

**JTBD:** "When running promotions, I want easy-to-copy coupon codes, so customers redeem offers without frustration."

---

### Net Promoter Score (NPS) Widget
**Priority:** Low | **Effort:** Medium | **Impact:** Low

**Problem:** Measure customer satisfaction with NPS methodology.

**Features:**
- 0-10 scale
- "How likely are you to recommend?" question
- Follow-up feedback field
- Categorize responses (detractor, passive, promoter)
- Calculate NPS score
- Display conditions (after purchase, after X days, etc.)
- Email collection (optional)
- Thank you message
- Display once per user
- Export responses

**JTBD:** "When measuring satisfaction, I want NPS surveys at key moments, so I track customer loyalty over time."

---

## Advanced Media & Visual

### 360° Product Viewer
**Priority:** Medium | **Effort:** High | **Impact:** High

**Problem:** E-commerce products need interactive 360° views.

**Features:**
- Upload image sequence (36-72 images)
- Auto-rotate option
- Drag to rotate
- Zoom functionality
- Rotation speed control
- Loop or pause at end
- Mobile touch support
- Loading indicator
- Fallback image
- Autoplay settings

**Use Cases:**
- Product photography
- Real estate virtual tours
- Fashion/clothing
- Jewelry
- Electronics

**JTBD:** "When selling products online, I want 360° views so customers see all angles, reducing returns and increasing confidence."

---

### Image Hotspots Block
**Priority:** Medium | **Effort:** Medium | **Impact:** Medium

**Problem:** Make images interactive with clickable information points.

**Features:**
- Upload base image
- Add multiple hotspot markers
- Marker styles (pulse, icon, number, custom)
- Tooltip or popup on click/hover
- Tooltip content (text, image, link, product info)
- Link to URL or product
- Hotspot position (drag and drop)
- Mobile responsive
- Animation effects

**Use Cases:**
- Product features
- Infographics
- Floor plans
- Lookbook images
- WooCommerce product tagging

**JTBD:** "When showcasing complex products, I want interactive hotspots that explain features, so customers understand value without reading walls of text."

---

### Lightbox Gallery Block
**Priority:** Medium | **Effort:** Medium | **Impact:** Medium

**Problem:** WordPress core gallery lacks modern lightbox functionality.

**Features:**
- Gallery layouts (grid, masonry, justified)
- Click to open lightbox
- Navigation arrows
- Keyboard support
- Thumbnails strip
- Zoom functionality
- Captions in lightbox
- Full-screen mode
- Share buttons
- Download option
- Slideshow autoplay
- Video support in gallery

**JTBD:** "When displaying image galleries, I want professional lightbox viewing, so visitors enjoy photos without leaving the page."

---

### Parallax Sections Block
**Priority:** Medium | **Effort:** Medium | **Impact:** Medium

**Problem:** Create depth and visual interest with scroll-based effects.

**Features:**
- Background image parallax
- Multi-layer parallax (foreground, middle, background)
- Speed control per layer
- Vertical or horizontal parallax
- Disable on mobile (performance)
- Scroll-triggered animations
- InnerBlocks for content
- Video background parallax

**Use Cases:**
- Hero sections
- Portfolio showcases
- Landing pages
- Storytelling pages

**JTBD:** "When creating immersive pages, I want parallax effects that wow visitors, so they engage more with content."

---

### Lottie Animation Block
**Priority:** Low | **Effort:** Low | **Impact:** Medium

**Problem:** Need lightweight, scalable animations beyond GIFs.

**Features:**
- Upload Lottie JSON file
- Play on page load or scroll trigger
- Loop or play once
- Play on hover
- Speed control
- Size control
- Alignment
- Link to URL
- Accessibility (pause option)
- Fallback image

**Use Cases:**
- Icons with animation
- Loading indicators
- Illustrations
- Decorative elements
- Explainer animations

**JTBD:** "When adding animations, I want lightweight Lottie files that look crisp on any screen, so pages load fast but feel dynamic."

---

### Audio Player Block
**Priority:** Medium | **Effort:** Medium | **Impact:** Medium

**Problem:** Podcast and music sites need custom audio players.

**Features:**
- Upload audio file or URL
- Custom player design
- Playlist support
- Episode metadata (title, description, duration)
- Download button
- Speed control (1x, 1.5x, 2x)
- Skip forward/back (15/30 seconds)
- Progress bar with chapters
- Subscribe links (Apple Podcasts, Spotify, etc.)
- Transcript toggle
- Embed code generation

**Use Cases:**
- Podcast episodes
- Music samples
- Audio guides
- Meditations
- Language lessons

**JTBD:** "When publishing podcasts, I want a beautiful audio player with all features listeners expect, so they enjoy content without leaving my site."

---

### Video Gallery Block
**Priority:** Low | **Effort:** Medium | **Impact:** Medium

**Problem:** Showcase multiple videos in organized gallery.

**Features:**
- Grid layout
- Video thumbnails
- Play in lightbox or inline
- Support for YouTube, Vimeo, self-hosted
- Category filtering
- Search functionality
- Load more pagination
- Video duration display
- View count (if available)
- Related videos

**Use Cases:**
- Video tutorials library
- Course lessons
- Product demos
- Webinar recordings
- Testimonial videos

**JTBD:** "When sharing video content, I want organized galleries that help visitors find relevant videos, so they consume more content."

---

## Navigation & User Experience

### Off-Canvas Sidebar/Menu
**Priority:** Medium | **Effort:** Medium | **Impact:** Medium

**Problem:** Mobile navigation and sidebar content needs slide-in panels.

**Features:**
- Slide from left, right, top, or bottom
- Trigger button (hamburger, custom)
- Close button and overlay
- Uses InnerBlocks (any content)
- Animation style (slide, fade, push)
- Overlay opacity
- Width/height control
- Sticky trigger button
- Close on outside click
- Lock body scroll when open

**Use Cases:**
- Mobile navigation
- Filters sidebar
- Shopping cart
- User account panel
- Quick links

**JTBD:** "When designing mobile experiences, I want slide-out panels for navigation, so content is accessible without cluttering the screen."

---

### Floating Action Button (FAB)
**Priority:** Low | **Effort:** Low | **Impact:** Medium

**Problem:** Provide quick access to primary action from any scroll position.

**Features:**
- Fixed position (bottom-right, bottom-left, etc.)
- Icon or text
- Click action (link, popup, scroll to top, etc.)
- Show after scroll depth
- Pulse animation
- Tooltip on hover
- Multiple FABs (expandable menu)
- Hide on certain pages
- Mobile responsive

**Use Cases:**
- Contact/chat
- Back to top
- Call now
- WhatsApp/messenger
- Add to cart (WooCommerce)

**JTBD:** "When visitors need help, I want a floating button they can click anytime, so they contact me without searching for links."

---

### Back to Top Button
**Priority:** Low | **Effort:** Low | **Impact:** Low

**Problem:** Long pages need quick return to top.

**Features:**
- Fixed position (bottom-right, bottom-left, custom)
- Show after scroll depth
- Smooth scroll animation
- Icon customization
- Shape (circle, square, rounded)
- Background color/opacity
- Hover effects
- Hide on mobile (optional)
- Keyboard accessible

**JTBD:** "When visitors scroll long pages, I want easy return to top, so navigation is convenient and frustration-free."

---

### Anchor Navigation Block
**Priority:** Medium | **Effort:** Low | **Impact:** Medium

**Problem:** Long pages need sticky navigation to sections.

**Features:**
- Auto-generate from page headings
- Manual anchor link list
- Sticky positioning
- Scroll spy (highlight current section)
- Smooth scroll to section
- Horizontal or vertical layout
- Collapse on mobile
- Offset for fixed headers
- Custom link text
- Style options

**Use Cases:**
- Long-form sales pages
- Documentation
- Single-page sites
- Course content
- Legal pages

**JTBD:** "When creating long pages, I want sticky section navigation, so visitors jump to relevant content quickly."

---

### Post Navigation Block
**Priority:** Low | **Effort:** Low | **Impact:** Low

**Problem:** Blog posts need prev/next navigation.

**Features:**
- Previous and next post links
- Post thumbnail preview
- Post title
- Post excerpt (optional)
- Same category only (optional)
- Custom text ("Older Post", "Newer Post")
- Style options (arrows, cards, minimal)
- Keyboard shortcuts (arrow keys)

**JTBD:** "When readers finish posts, I want easy prev/next navigation, so they consume more content without returning to archives."

---

### Filter Bar Block
**Priority:** High | **Effort:** High | **Impact:** High

**Problem:** Query blocks need frontend filtering without page reload.

**Features:**
- Works with Posts Grid, CPT Query, WooCommerce Query
- Filter by taxonomy (category, tag, custom)
- Filter by custom fields
- Filter by date range
- Filter by price (WooCommerce)
- Sort options
- Search field
- AJAX filtering
- Active filters display
- Clear all filters
- Filter count badges
- Mobile responsive (collapse filters)

**JTBD:** "When displaying filterable content, I want a filter bar that updates results instantly, so users find exactly what they want."

---

## E-Learning & Documentation

### Lesson/Course Structure Block
**Priority:** High | **Effort:** Very High | **Impact:** High

**Problem:** E-learning sites need course structure without heavy LMS plugins.

**Features:**
- Course outline (nested lessons/modules)
- Progress tracking (localStorage or logged-in users)
- Mark as complete
- Prerequisites (unlock lessons in order)
- Estimated time per lesson
- Lesson status indicators
- Certificate on completion
- Drip content (release schedule)
- Quiz integration
- Resource downloads per lesson

**Use Cases:**
- Online courses
- Training programs
- Documentation
- Onboarding processes

**JTBD:** "When creating courses, I want simple structure and progress tracking, so learners stay organized without complex LMS plugins."

---

### Code Syntax Highlighter
**Priority:** High | **Effort:** Low | **Impact:** High

**Problem:** Documentation and tutorials need beautiful code blocks.

**Features:**
- Multiple language support (JS, PHP, Python, CSS, etc.)
- Syntax highlighting themes (Dracula, Monokai, GitHub, etc.)
- Line numbers
- Line highlighting (specific lines)
- Copy button
- File name/label
- Word wrap toggle
- Collapsible long code
- Diff view (show changes)
- Dark mode support

**Use Cases:**
- Developer documentation
- Tutorials
- Code snippets
- Technical blogs
- API documentation

**JTBD:** "When sharing code, I want syntax highlighting that makes code readable, so developers understand examples quickly."

---

### API Documentation Block
**Priority:** Medium | **Effort:** High | **Impact:** Medium

**Problem:** Document REST APIs with interactive examples.

**Features:**
- Endpoint display (GET, POST, etc.)
- Parameters table (name, type, required, description)
- Request example (with syntax highlighting)
- Response example (JSON/XML)
- Try it now (live API testing)
- Authentication details
- Rate limits
- Error codes table
- Code examples (multiple languages)
- Copy button for code

**Use Cases:**
- API documentation
- Developer portals
- Integration guides
- Webhook documentation

**JTBD:** "When documenting APIs, I want interactive docs that developers can test, so they integrate faster without support tickets."

---

### Changelog Block
**Priority:** Low | **Effort:** Low | **Impact:** Low

**Problem:** Product/software changelog pages need consistent formatting.

**Features:**
- Version number
- Release date
- Change categories (Added, Fixed, Changed, Removed, Deprecated)
- Categorized list items
- Badges (New, Breaking Change, Beta)
- Collapsible versions
- Search/filter versions
- RSS feed for changelog
- Link to version docs
- Diff view (code changes)

**JTBD:** "When releasing updates, I want organized changelogs that inform users, so they understand what changed and why."

---

### Video Lesson with Resources
**Priority:** Medium | **Effort:** Medium | **Impact:** Medium

**Problem:** Educational videos need associated resources and structure.

**Features:**
- Video player (YouTube, Vimeo, self-hosted)
- Lesson description
- Resource downloads (PDFs, files, templates)
- Chapters/timestamps (jump to section)
- Transcript (searchable)
- Notes section
- Comments/discussion
- Mark as watched
- Next lesson button
- Quiz after video

**JTBD:** "When teaching with video, I want all resources in one place, so learners have everything they need without searching."

---

## Data Visualization

### Chart/Graph Block
**Priority:** High | **Effort:** High | **Impact:** High

**Problem:** Display data visually without third-party tools.

**Features:**
- **Chart Types:**
  - Bar (vertical, horizontal)
  - Line
  - Pie/Donut
  - Area
  - Scatter
  - Radar

- **Data Entry:**
  - Manual data table
  - Import CSV
  - Dynamic data (custom fields, WooCommerce)
  - Google Sheets integration

- **Styling:**
  - Color schemes
  - Custom colors per dataset
  - Legend position
  - Gridlines
  - Axis labels
  - Data labels
  - Animations

- **Features:**
  - Responsive
  - Tooltips on hover
  - Export as image
  - Accessible (ARIA labels)

**Use Cases:**
- Reports
- Statistics
- Comparison data
- Analytics dashboards
- Survey results
- Sales data

**JTBD:** "When presenting data, I want interactive charts that make numbers visual, so readers understand insights quickly."

---

### Live Counter Block
**Priority:** Low | **Effort:** Medium | **Impact:** Low

**Problem:** Show dynamic metrics that update in real-time.

**Features:**
- Data sources (custom post count, WooCommerce orders, form submissions, API)
- Real-time updates (via AJAX)
- Animated counting
- Prefix/suffix ($, %, etc.)
- Number formatting (1,000 vs 1K)
- Update interval
- Label/description
- Color coding
- Icon

**Examples:**
- "X orders this week"
- "X active users"
- "X downloads"
- "X visitors today"

**JTBD:** "When showing site activity, I want live counters that prove popularity, so visitors feel confident engaging."

---

## Local Business & Services

### Opening Hours Block
**Priority:** Medium | **Effort:** Low | **Impact:** Medium

**Problem:** Local businesses need clear hour displays with Schema.org markup.

**Features:**
- Day-by-day hours
- Special hours (holidays)
- Currently open/closed indicator
- Time zone display
- 12/24 hour format
- Multiple locations support
- Split hours (open twice per day)
- Appointment only option
- Schema.org OpeningHours markup

**JTBD:** "When customers want to visit, I want opening hours that show current status, so they know if we're open right now."

---

### Team Members Grid
**Priority:** Medium | **Effort:** Medium | **Impact:** Medium

**Problem:** About pages need structured team displays.

**Features:**
- Team member cards (repeater)
- Photo
- Name
- Title/role
- Bio (short and full)
- Social links
- Email/phone
- Skills/expertise tags
- Grid or list layout
- Filter by department/role
- Detail popup or link to profile page
- Custom fields integration

**JTBD:** "When showcasing my team, I want professional profiles that build trust, so visitors see expertise and connect with people."

---

### Service Pricing List
**Priority:** Medium | **Effort:** Low | **Impact:** Medium

**Problem:** Service businesses need clear pricing presentation.

**Features:**
- Service items (repeater)
- Service name
- Price or price range
- Duration/time estimate
- Description
- Icon per service
- Book now button
- Popular/featured badge
- Grouped by category
- Expandable details
- Custom pricing text ("Starting at...", "Contact for quote")

**JTBD:** "When explaining services, I want clear pricing that sets expectations, so qualified leads contact me."

---

### Restaurant Menu Block
**Priority:** Medium | **Effort:** Medium | **Impact:** Medium

**Problem:** Restaurants need menu presentation with sections and items.

**Features:**
- Menu sections (Appetizers, Entrees, etc.)
- Menu items with:
  - Name
  - Description
  - Price
  - Image (optional)
  - Dietary icons (vegan, gluten-free, spicy, etc.)
  - Allergen warnings
- Featured/popular items
- Search/filter menu
- Print-friendly
- Multi-language support
- PDF download
- Schema.org Menu markup

**JTBD:** "When customers want to see our menu, I want mobile-friendly display with filters, so they find dishes that match preferences."

---

### Simple Event Calendar
**Priority:** Low | **Effort:** High | **Impact:** Medium

**Problem:** Small sites need basic event lists without complex calendar plugins.

**Features:**
- Event list (not full calendar)
- Event items with:
  - Date/time
  - Title
  - Location
  - Description
  - Image
  - Register/RSVP button
- Upcoming events only
- Past events archive
- Filter by category/tag
- Search events
- Add to calendar (iCal)
- Google Maps integration
- Countdown to event
- Schema.org Event markup

**Note:** Keep simple; for complex calendars, recommend dedicated plugins.

**JTBD:** "When promoting events, I want a simple list that shows what's coming up, so attendees register without confusion."

---

## Advanced Interactive

### Hover Card Block
**Priority:** Low | **Effort:** Low | **Impact:** Low

**Problem:** Reveal additional information on hover without cluttering layout.

**Features:**
- Trigger element (image, icon, text)
- Hover card content (InnerBlocks)
- Trigger on hover or click
- Card position (top, bottom, left, right, auto)
- Delay before showing
- Animation (fade, slide, scale)
- Close button (for click trigger)
- Mobile behavior (tap to open)

**Use Cases:**
- Team member bios
- Product details
- Definition tooltips
- Image captions
- Feature explanations

**JTBD:** "When space is limited, I want hover cards that reveal details, so layouts stay clean but information is accessible."

---

### Tooltip Block
**Priority:** Low | **Effort:** Low | **Impact:** Low

**Problem:** Add contextual help without disrupting content flow.

**Features:**
- Trigger text or icon
- Tooltip content (text or rich content)
- Position (top, bottom, left, right, auto)
- Trigger (hover, click, focus)
- Style (light, dark, custom)
- Arrow/pointer
- Max width control
- Accessible (ARIA)

**JTBD:** "When explaining terms, I want inline tooltips so readers get context without leaving the page."

---

### Masonry Grid Block
**Priority:** Medium | **Effort:** Medium | **Impact:** Medium

**Problem:** Pinterest-style layouts for content with varying heights.

**Features:**
- Dynamic grid (items fit without gaps)
- Column count control (2-6)
- Gutter spacing
- Works with any content (InnerBlocks)
- Lazy loading
- Filter/sort integration
- Animated rearrangement
- Responsive breakpoints

**Use Cases:**
- Image galleries
- Blog cards
- Portfolio items
- Product grids
- Pinterest-like layouts

**JTBD:** "When displaying varied-height content, I want masonry layouts that look organized, so nothing feels out of place."

---

### Mega Footer Block
**Priority:** Low | **Effort:** Medium | **Impact:** Low

**Problem:** Complex sites need rich footer with multiple sections.

**Features:**
- Multi-column footer sections
- Widget areas (use InnerBlocks)
- Newsletter signup
- Social icons
- Payment icons
- Copyright text
- Back to top link
- Collapsible on mobile
- Background options
- Copyright year (auto-updates)

**JTBD:** "When visitors scroll to footer, I want organized information and links, so they find what they need or take action."

---

## Evaluation Criteria

Each block idea should be evaluated on:

1. **Does it pass JTBD test?** - Real user need
2. **Does WordPress/WooCommerce already do this?** - Avoid duplication
3. **Can we build without bloat?** - Keep performance high
4. **Will it work with any theme?** - FSE compatible
5. **Does it differentiate from competitors?** - Unique value
6. **Is there demand?** - User requests or research
7. **Can it be maintained long-term?** - Sustainable development

---

## Next Steps

1. **Community Feedback** - Share with users for validation
2. **Prioritization Workshop** - Score each idea (effort vs. impact)
3. **Technical Feasibility** - Research implementation challenges
4. **Competitive Analysis** - What do other block plugins offer?
5. **Roadmap Integration** - Move high-priority items to main roadmap

---

## Contributing Ideas

Have a block idea not listed here? Submit via:
- GitHub issue (feature request template)
- Community Discord (#block-ideas channel)
- Support forum (tag "block idea")

**Include:**
- Block name
- Problem it solves (JTBD)
- Key features
- Use cases
- Why existing solutions aren't enough

---

**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Living document - will evolve based on feedback
