# DesignSetGo

Professional Gutenberg block library with 42 blocks - complete Form Builder, container system, interactive elements, and animations. Built with WordPress standards for guaranteed editor/frontend parity.

## 🤖 **First AI-Native WordPress Block Library**

DesignSetGo is the **first WordPress block plugin** to integrate with the WordPress 6.9 Abilities API, making it fully accessible to AI agents and automation tools. Build pages programmatically with Claude, ChatGPT, or custom AI workflows.

> **[📖 Read the Abilities API Documentation →](docs/ABILITIES-API.md)**

## Status

✨ **Active Development** - Core blocks complete, expanding features

**Current Progress:**
- ✅ Project foundation and architecture complete
- ✅ Build system configured (webpack + @wordpress/scripts)
- ✅ PHP plugin architecture implemented
- ✅ 42 custom blocks across 4 categories with FSE integration
- ✅ Complete Form Builder system (13 blocks: builder + 11 field types + submit button)
- ✅ Container system (Flex, Grid, Stack)
- ✅ Interactive blocks (Tabs, Accordion, Flip Card, Reveal, Scroll effects, Slider, Counters, Progress)
- ✅ Block Animations extension - 24 animations for ANY WordPress block
- ✅ Global styles system (theme.json integration)
- ✅ Block patterns library
- ✅ Comprehensive testing setup (E2E + Unit + PHP)
- ✅ WordPress 6.4+ compatibility (tested up to 6.7)
- ✅ WordPress Abilities API integration (AI-native)
- ✅ Comprehensive documentation (15,000+ lines)
- ✅ Zero JavaScript errors - comprehensive linting cleanup
- ✅ ViewScript support for interactive blocks
- ✅ 9 language translations (de, es, fr, it, ja, nl, pt, ru, zh)
- 🔄 Expanding pattern library

See [CLAUDE.md](.claude/CLAUDE.md) for development learnings and best practices.

## Features at a Glance

| Category | Features |
|----------|----------|
| **🤖 AI Integration** | **WordPress Abilities API** - First plugin with AI-native programmatic access |
| **Blocks** | **42 blocks** across 4 categories: **Container System (3)** - Flex, Grid, Stack; **Form Builder (13)** - Complete form system with AJAX, spam protection, 11 field types; **Interactive Blocks (10)** - Tabs, Accordion, Flip Card, Reveal, Scroll effects, Slider, Counters, Progress; **Visual/UI (16)** - Icon, Icon Button, Icon List, Pill, Blobs, plus child blocks |
| **Extensions** | **Block Animations** - 24 entrance/exit animations for ANY WordPress block (core or third-party) |
| **Patterns** | Pre-designed layouts (Hero, CTA, Features, FAQ) |
| **FSE Ready** | Full Site Editing compatible, theme.json integration, dual categorization |
| **Performance** | Optimized bundles, code-splitting, no jQuery, declarative styling, viewScript support |
| **Accessibility** | WCAG 2.1 AA compliant, keyboard navigation, screen reader friendly, Schema.org markup |
| **Developer DX** | WordPress best practices, < 300 lines per file, 15,000+ lines of docs, comprehensive refactoring guides |
| **Testing** | E2E (Playwright) + Unit (Jest) + PHP (PHPUnit + PHPStan) |
| **i18n** | Translation-ready with 9 language translations included |

## Quick Start

### Requirements

- **Node.js**: 18+ (for development)
- **PHP**: 7.4+ (8.0+ recommended)
- **WordPress**: 6.4+
- **npm**: 8+ (or pnpm/yarn)

### Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/designsetgo.git
cd designsetgo

# 2. Install dependencies
npm install

# 3. Start WordPress environment
npx wp-env start
# This starts a local WordPress at http://localhost:8888
# Login: admin / password

# 4. Start development (in a new terminal)
npm start
# This watches files and rebuilds automatically
```

**That's it!** The plugin is now active in your local WordPress. Visit [http://localhost:8888/wp-admin](http://localhost:8888/wp-admin) and start creating with DesignSetGo blocks.

### WordPress Environment

```bash
# Start WordPress
npx wp-env start

# Stop WordPress
npx wp-env stop

# Reset WordPress (clean install)
npx wp-env clean all

# Access:
# - Frontend: http://localhost:8888
# - Admin: http://localhost:8888/wp-admin (admin/password)
# - Database: http://localhost:8889 (phpMyAdmin - root/password)
```

### Development Workflow

```bash
# Start development with hot reload
npm start

# Build for production
npm run build

# Code Quality
npm run lint:js          # Lint JavaScript
npm run lint:css         # Lint SCSS/CSS
npm run lint:php         # Lint PHP (requires Composer)
npm run format           # Format all code (Prettier)

# Testing
npm run test:unit        # Run Jest unit tests
npm run test:e2e         # Run Playwright E2E tests
npm run test:e2e:ui      # Run E2E tests with UI
npm run test:e2e:debug   # Debug E2E tests
npm run test:php         # Run PHPUnit tests (requires Composer)

# Security & Compliance
npm run security:audit   # Check for vulnerabilities and license issues

# Create plugin ZIP for distribution
npm run plugin-zip
```

## Current Features

### 40 Custom Blocks

📚 **[View Complete Blocks Reference →](https://github.com/jnealey88/designsetgo/wiki/Blocks-Reference)**

#### Layout Containers (3 Blocks)
- **Flex Container** - Horizontal/vertical layouts with wrapping
- **Grid Container** - Responsive CSS Grid layouts
- **Stack Container** - Vertical stacking with spacing control

#### Interactive Content (7 Block Groups)
- **Accordion** - Collapsible content panels
- **Tabs** - Tabbed content interface with icons
- **Slider** - Modern slider with multiple effects (slide, fade, zoom)
- **Flip Card** - Interactive cards that flip on hover/click
- **Reveal** - Content that reveals on hover
- **Scroll Accordion** - Sticky stacking accordion triggered by scroll
- **Image Accordion** - Expandable image panels for portfolios

#### Content Elements (7 Blocks)
- **Icon** - 500+ icons with shapes and animations
- **Icon Button** - Icon-based buttons with styles
- **Icon List** - Lists with custom icons
- **Pill** - Badge/tag components
- **Counter** - Animated counting numbers
- **Progress Bar** - Animated progress indicators
- **Blobs** - Organic shapes with morphing animations

#### Advanced Interactions (1 Block)
- **Scroll Marquee** - Horizontal scrolling image galleries with parallax

#### Form Builder (14+ Blocks)
- **Form Builder** - Complete form system with 12 field types:
  - Text, Email, Phone, URL fields
  - Date, Time, Number fields
  - Checkbox, Select, Textarea
  - File Upload, Hidden field
- AJAX submission, spam protection, email notifications

### Block Extensions

**Responsive Extension** - Hide blocks on specific devices
- Desktop, Tablet, Mobile visibility toggles
- Works with any WordPress block

**Animation Extension** - Entrance animations
- 8+ animation types (fadeIn, fadeInUp, slideInLeft, etc.)
- Configurable duration, delay, and easing
- Respects `prefers-reduced-motion`
- CSS-only implementation (no JS libraries)

### Block Patterns

Pre-designed layouts ready to use:
- **Hero Section** - Full-width hero with container
- **Three Column Grid** - Feature/service showcase
- **Centered CTA** - Call-to-action section
- **FAQ Accordion** - Frequently asked questions

### Global Styles System
- FSE-first approach using theme.json
- Color palette integration
- Spacing scale (xs, sm, md, lg, xl)
- Typography presets
- Full Twenty Twenty-Five theme compatibility

### Developer Experience
- WordPress best practices (useBlockProps, useInnerBlocksProps)
- Declarative styling (no DOM manipulation)
- Comprehensive JSDoc documentation
- Refactored component architecture (< 300 lines per file)
- Security-first approach (sanitization, escaping, nonces)

## Project Structure

```
designsetgo/
├── includes/              # PHP classes
│   ├── admin/            # Admin interface
│   ├── blocks/           # Block registration
│   ├── patterns/         # Pattern registration
│   └── class-*.php       # Core classes
├── src/                  # JavaScript source
│   ├── blocks/          # Block implementations
│   │   └── container/   # Container block
│   ├── components/      # Shared React components
│   ├── extensions/      # Block extensions
│   ├── styles/          # Global SCSS
│   └── utils/           # Utility functions
├── build/               # Compiled output
├── patterns/            # Block patterns (PHP)
└── designsetgo.php      # Main plugin file
```

## Documentation

Complete documentation for users and developers.

### 📖 For Users

**[Visit the DesignSetGo Wiki](https://github.com/jnealey88/designsetgo/wiki)** for user-facing documentation:

- **[Quick Start Guide](https://github.com/jnealey88/designsetgo/wiki/Quick-Start)** - Get up and running in 5 minutes
- **[Installation Guide](https://github.com/jnealey88/designsetgo/wiki/Installation)** - All installation methods
- **[Blocks Reference](https://github.com/jnealey88/designsetgo/wiki/Blocks-Reference)** - Complete blocks documentation
- **[Troubleshooting](https://github.com/jnealey88/designsetgo/wiki/Troubleshooting)** - Common issues and solutions

### 👨‍💻 For Contributors & Developers

**[View Developer Documentation](docs/)** - Technical guides in the `/docs/` folder:

**Getting Started:**
- **[Getting Started Guide](docs/GETTING-STARTED.md)** ⭐ **Start here!**
  - Complete setup walkthrough for new contributors
  - Prerequisites and installation
  - Making your first change
  - Common workflows and troubleshooting

- **[Architecture Overview](docs/ARCHITECTURE.md)** ⭐ **Understand the code!**
  - Project structure and folder organization
  - How blocks work (code → editor → frontend)
  - Build system and asset pipeline
  - Data flow and component architecture

- **[Contributing Guide](CONTRIBUTING.md)** ⭐ **Ready to contribute!**
  - Complete contribution workflow
  - Code standards and best practices
  - Pull request process
  - Getting help

**Development Guides:**
- **[Best Practices Summary](docs/BEST-PRACTICES-SUMMARY.md)** - Quick reference patterns
- **[Block Development (Comprehensive)](docs/BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md)** - Deep dive
- **[WordPress Block Editor Best Practices](docs/WORDPRESS-BLOCK-EDITOR-BEST-PRACTICES.md)**
- **[FSE Compatibility Guide](docs/FSE-COMPATIBILITY-GUIDE.md)** - Full Site Editing integration
- **[Testing Guide](docs/TESTING.md)** - E2E and unit testing

**Specialized Topics:**
- **[Block Controls Organization](docs/BLOCK-CONTROLS-ORGANIZATION.md)**
- **[Color Controls Pattern](docs/COLOR-CONTROLS-PATTERN.md)**
- **[Width & Layout Patterns](docs/WIDTH-LAYOUT-PATTERNS.md)**
- **[Extension vs Custom Blocks](docs/EXTENSION-VS-CUSTOM-BLOCKS.md)**
- **[Abilities API](docs/ABILITIES-API.md)** - AI integration

**AI-Assisted Development:**
- **[AI-Assisted Development Guide](docs/AI-ASSISTED-DEVELOPMENT.md)** - Complete guide to building with AI
- **[.claude/CLAUDE.md](.claude/CLAUDE.md)** - Development patterns for AI agents

### 🗺️ Documentation Map

```
New to the project?
  ↓
1. Read GETTING-STARTED.md (setup and first contribution)
  ↓
2. Read ARCHITECTURE.md (understand the codebase)
  ↓
3. Read CONTRIBUTING.md (contribution workflow)
  ↓
4. Pick a good-first-issue and start coding!
  ↓
Reference .claude/CLAUDE.md as you develop
```

> **Note**: The `/docs/` folder contains **developer documentation**. User-facing docs are in the [Wiki](https://github.com/jnealey88/designsetgo/wiki).

## Roadmap

### ✅ Completed (Phase 1)
- 40 custom blocks across 5 categories (Layout, Interactive, Content, Advanced, Forms)
- Block extensions (Responsive, Animations, Scroll Effects)
- Global styles integration
- Animation system (8+ entrance animations)
- Block patterns (Hero, CTA, Features, FAQ)
- Comprehensive documentation (5,000+ lines across wiki and docs)
- Testing infrastructure (E2E + Unit + PHP)
- FSE compatibility (Twenty Twenty-Five)
- WordPress Abilities API integration

### 🔄 Current Focus
- Expanding pattern library
- Additional block variations
- Performance optimization
- Accessibility improvements
- WordPress.org submission preparation

### 📋 Near-Term (Next 3-6 Months)
- Additional interactive blocks (Timeline, Testimonials, Pricing Tables)
- Advanced animation sequences
- More block patterns (20+ total)
- Video tutorials and documentation
- Enhanced Form Builder features (conditional logic, multi-step forms)
- Community feedback integration
- WordPress.org release

### 🔮 Future Phases
- Dynamic content blocks
- WooCommerce integration blocks
- Advanced theme builder features
- Template library
- Community pattern marketplace
- Form integrations (Mailchimp, ConvertKit, etc.)

## What Makes DesignSetGo Different?

### WordPress-First Philosophy
- **Native Integration**: Uses WordPress's built-in features (useBlockProps, useInnerBlocksProps, theme.json)
- **FSE Compatible**: Full Site Editing support out of the box
- **Theme Agnostic**: Works seamlessly with any modern WordPress theme
- **No jQuery**: Pure vanilla JavaScript for better performance

### Developer-Friendly
- **Clean Code**: < 300 lines per file, comprehensive JSDoc documentation
- **Best Practices**: Follows official WordPress block development patterns
- **Declarative Styling**: No DOM manipulation, React-based architecture
- **Security-First**: Input sanitization, output escaping, nonce verification

### Performance Optimized
- **Small Bundle Sizes**: < 10 KB per block (editor), < 5 KB (frontend)
- **CSS-Only Animations**: No JavaScript libraries required
- **Progressive Enhancement**: Core features work without JavaScript
- **Tree-Shaking**: Only loads what you use

### Accessibility First
- **WCAG 2.1 AA**: Meets accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Friendly**: Proper ARIA labels and announcements
- **Reduced Motion**: Respects `prefers-reduced-motion` preference

## Contributing

This project is 100% free and open source (GPL v2+). Contributions welcome!

**⚠️ Important**: This repository requires Pull Requests for all changes. External contributors must create an issue first and link it to their PR. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### 🚀 New Contributors - Start Here!

**Never contributed before?** We've created comprehensive guides to get you started:

1. **[Getting Started Guide](docs/GETTING-STARTED.md)** - Complete step-by-step setup walkthrough
   - Prerequisites and software installation
   - Local environment setup with wp-env
   - Making your first code change
   - Development tools and workflows
   - Troubleshooting common issues

2. **[Architecture Overview](docs/ARCHITECTURE.md)** - Understanding the codebase
   - Project structure and folder organization
   - How blocks work (from code to browser)
   - Build system and asset pipeline
   - Data flow and state management
   - Testing infrastructure

3. **[Contributing Guide](CONTRIBUTING.md)** - Complete contribution workflow
   - Development setup and prerequisites
   - Code standards and best practices
   - Testing requirements
   - Pull request process
   - Getting help and community support

**Looking for something specific?**
- **Setup help**: [docs/GETTING-STARTED.md](docs/GETTING-STARTED.md)
- **Code structure**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Development patterns**: [.claude/CLAUDE.md](.claude/CLAUDE.md)
- **Testing guide**: [docs/TESTING.md](docs/TESTING.md)
- **Common issues**: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

### Quick Start for Developers

Already familiar with WordPress block development? Here's the quick version:

```bash
# 1. Fork and clone
git clone https://github.com/YOUR-USERNAME/designsetgo.git
cd designsetgo

# 2. Install and start
npm install
npx wp-env start  # Terminal 1
npm start         # Terminal 2

# 3. Access WordPress
# http://localhost:8888/wp-admin (admin/password)

# 4. Make changes, test, and submit PR!
```

**First contribution?** Look for issues labeled [`good-first-issue`](https://github.com/jnealey88/designsetgo/issues?q=is%3Aissue+is%3Aopen+label%3A%22good-first-issue%22).

### For AI-Assisted Development

**This plugin was built 100% with AI assistance (Claude Code).** We've documented everything:

- **[AI-Assisted Development Guide](docs/AI-ASSISTED-DEVELOPMENT.md)** ⭐ **Complete guide!**
  - How this entire plugin was built with AI
  - Available slash commands (/add-block, /lint, /test, /deploy, etc.)
  - Best practices and workflows
  - Tips, tricks, and real examples

- **[.claude/CLAUDE.md](.claude/CLAUDE.md)** - Development patterns for AI agents
  - Critical patterns AI should follow
  - WordPress best practices
  - Project-specific conventions

- **[WordPress Abilities API](docs/ABILITIES-API.md)** - AI-native programmatic access
  - REST API for AI agents
  - Block insertion and configuration
  - Automation workflows

**Using Claude Code, ChatGPT, or GitHub Copilot?** These guides will help you contribute effectively with AI assistance.

### Development Guidelines

**Core Principles:**
- ✅ Use WordPress defaults first (Block Supports, useBlockProps, theme.json)
- ✅ Keep files under 300 lines (extract components/utils)
- ✅ Test in both editor AND frontend
- ✅ Internationalize all strings (`__('Text', 'designsetgo')`)
- ✅ Follow WordPress coding standards

See [.claude/CLAUDE.md](.claude/CLAUDE.md) for complete patterns.

### Reporting Issues

**Found a bug or have a feature request?**

1. Check [existing issues](https://github.com/jnealey88/designsetgo/issues) first
2. If new, [create an issue](https://github.com/jnealey88/designsetgo/issues/new) with:
   - WordPress version, PHP version, browser
   - Steps to reproduce (for bugs)
   - Use case and expected behavior (for features)
   - Screenshots or videos (if helpful)

### Getting Help

**Questions?** We're here to help!

- **Setup/Development**: See [docs/GETTING-STARTED.md](docs/GETTING-STARTED.md)
- **Ask Questions**: [GitHub Discussions](https://github.com/jnealey88/designsetgo/discussions)
- **Report Bugs**: [GitHub Issues](https://github.com/jnealey88/designsetgo/issues)

## License

GPL-2.0-or-later - 100% Free Forever

## Block Categories

Blocks are organized in the WordPress block inserter:

**DesignSetGo Collection** - All 40 blocks grouped together
- Layout Containers: Flex, Grid, Stack
- Interactive: Accordion, Tabs, Slider, Flip Card, Reveal, Scroll Accordion, Image Accordion
- Content: Icon, Icon Button, Icon List, Pill, Counter, Progress Bar, Blobs
- Advanced: Scroll Marquee
- Forms: Form Builder + 12 field types

**WordPress Core Categories** - Blocks also appear in native categories
- **Design**: Most layout and interactive blocks
- **Text**: Icon List
- **Widgets**: Forms, Counters, Progress Bars

**Extensions** - Available for all blocks
- Responsive visibility toggles
- Entrance animations (8+ effects)
- Scroll effects
- Overlay controls
- Custom CSS

**Patterns** - Pre-designed layouts
- Look for the "DesignSetGo" category in the pattern inserter

📚 **[Complete Blocks Reference](https://github.com/jnealey88/designsetgo/wiki/Blocks-Reference)** - Detailed documentation for all blocks

## 🤖 AI Integration (WordPress Abilities API)

DesignSetGo is the **first WordPress block plugin** to fully integrate with the WordPress 6.9 Abilities API, enabling AI agents and automation tools to programmatically interact with blocks.

### Available Abilities (v2.0)

**Discovery:**
- `designsetgo/list-blocks` - List all available blocks with schemas

**Block Insertion:**
- `designsetgo/insert-flex-container` - Insert Flex layout
- `designsetgo/insert-grid-container` - Insert responsive Grid

**Configuration:**
- `designsetgo/configure-counter-animation` - Update counter settings
- `designsetgo/apply-animation` - Apply animations to any block

### Quick Example

```bash
# List all DesignSetGo blocks
curl -X POST http://yoursite.com/wp-json/wp-abilities/v1/abilities/designsetgo/list-blocks/execute \
  -u "username:password" \
  -d '{"category": "all"}'

# Insert a Flex container
curl -X POST http://yoursite.com/wp-json/wp-abilities/v1/abilities/designsetgo/insert-flex-container/execute \
  -u "username:password" \
  -d '{
    "post_id": 123,
    "attributes": {
      "direction": "row",
      "justifyContent": "center"
    }
  }'
```

### AI Agent Support

- ✅ **Claude** (via Model Context Protocol)
- ✅ **ChatGPT** (via REST API)
- ✅ **Custom Automation Tools**

**[📖 Full Abilities API Documentation →](docs/ABILITIES-API.md)**

---

## Support

### Getting Help
- **Documentation**: See [docs/](./docs/) folder for comprehensive guides
- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/designsetgo/issues)
- **Discussions**: Ask questions in [GitHub Discussions](https://github.com/yourusername/designsetgo/discussions)

### Useful Resources
- [How to Use Guide](docs/HOW-TO-USE.md) - Getting started
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues
- [Claude Code Learnings](.claude/CLAUDE.md) - Development insights

### WordPress.org
Coming soon - preparing for submission

## Credits

Built with ❤️ for the WordPress community by developers who believe in:
- WordPress-first development
- Open source collaboration
- Accessible, performant web experiences
- Clean, maintainable code

**Powered by**: React, WordPress Block Editor, Webpack, @wordpress/scripts, WordPress Abilities API

---

**License**: GPL-2.0-or-later | **Version**: 1.0.0 | **Requires WordPress**: 6.4+ | **Requires PHP**: 7.4+
