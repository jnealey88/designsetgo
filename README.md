# DesignSetGo

Modern Gutenberg block library bridging the gap between core WordPress blocks and advanced page builders. Design made easy, fast, and beautiful.

## Status

✨ **Active Development** - Core blocks complete, expanding features

**Current Progress:**
- ✅ Project foundation and architecture complete
- ✅ Build system configured (webpack + @wordpress/scripts)
- ✅ PHP plugin architecture implemented
- ✅ 11 custom blocks with FSE integration
- ✅ Block extensions (Responsive, Animations)
- ✅ Global styles system (theme.json integration)
- ✅ Animation system with 8+ entrance animations
- ✅ Block patterns library
- ✅ Comprehensive testing setup (E2E + Unit)
- ✅ WordPress 6.4+ compatibility
- 🔄 Expanding pattern library and documentation

See [CLAUDE.md](.claude/CLAUDE.md) for development learnings and best practices.

## Features at a Glance

| Category | Features |
|----------|----------|
| **Blocks** | 11 custom blocks (Container, Accordion, Tabs, Counter, Icon, Progress Bar, etc.) |
| **Extensions** | Responsive visibility, entrance animations for any block |
| **Patterns** | Pre-designed layouts (Hero, CTA, Features, FAQ) |
| **FSE Ready** | Full Site Editing compatible, theme.json integration |
| **Performance** | < 10 KB per block, CSS-only animations, no jQuery |
| **Accessibility** | WCAG 2.1 AA compliant, keyboard navigation, screen reader friendly |
| **Developer DX** | WordPress best practices, < 300 lines per file, comprehensive docs |
| **Testing** | E2E (Playwright) + Unit (Jest) + PHP (PHPUnit) |

## Quick Start

### Requirements

- **Node.js**: 18+ (for development)
- **PHP**: 7.4+ (8.0+ recommended)
- **WordPress**: 6.4+
- **npm**: 8+ (or pnpm/yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/designsetgo.git
cd designsetgo

# Install dependencies
npm install

# Build the plugin
npm run build
```

### Development Workflow

```bash
# Start development with hot reload
npm start

# Build for production
npm run build

# Lint and fix code
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

### WordPress Environment Setup

```bash
# Start local WordPress environment (wp-env)
npm run wp-env:start
# or: npx wp-env start

# Access WordPress
# URL: http://localhost:8888
# Admin: http://localhost:8888/wp-admin
# Username: admin
# Password: password

# Stop environment
npm run wp-env:stop

# Clean environment (remove all data)
npm run wp-env:clean
```

## Current Features

### 11 Custom Blocks

#### Layout & Structure
**Container Block** - Advanced layout container with responsive controls
- Layout types: Stack, Grid, Flexbox
- Responsive grid columns (Desktop/Tablet/Mobile)
- Content width constraints
- Video backgrounds
- Background overlays
- Clickable containers (card-style links)
- Semantic HTML options (div, section, article, etc.)

#### Interactive Components
**Accordion** - Collapsible content panels
- Multiple items with expand/collapse
- Customizable icons
- Smooth animations
- Individual item control (Accordion Item block)

**Tabs** - Horizontal tabbed interface
- Multiple tab panels
- Customizable styling
- Keyboard navigation
- Individual tab control (Tab block)

**Counter** - Animated number counting
- Count-up animations using CountUp.js
- Customizable start/end values
- Duration, delay, and easing controls
- Prefix/suffix support
- Decimal precision
- Counter Group for multiple stats

**Progress Bar** - Visual progress indicator
- Animated fill effect
- Customizable colors and height
- Percentage display
- Label support

#### Visual Elements
**Icon Block** - SVG icon library
- 20+ built-in icons
- Size and color controls
- Alignment options
- Link support

**Icon List** - Structured lists with icons
- Custom icon per item
- Flexible styling
- Individual item control (Icon List Item block)

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

### User Guides
- [How to Use DesignSetGo](docs/HOW-TO-USE.md) - Getting started guide
- [Finding Your Blocks](docs/FINDING-YOUR-BLOCKS.md) - Locating blocks in the editor
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues and solutions
- [Testing Guide](docs/TESTING.md) - How to test the plugin

### Developer Documentation
- [Claude Code Learnings](.claude/CLAUDE.md) - Development insights and patterns ⭐
- [Block Development Best Practices (Comprehensive)](docs/BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md) - 2,500+ line reference guide
- [Best Practices Summary](docs/BEST-PRACTICES-SUMMARY.md) - Quick reference for daily development
- [WordPress Block Editor Best Practices](docs/WORDPRESS-BLOCK-EDITOR-BEST-PRACTICES.md)
- [Extension vs Custom Blocks](docs/EXTENSION-VS-CUSTOM-BLOCKS.md) - When to use each approach
- [Block Extension Strategy](docs/BLOCK-EXTENSION-STRATEGY.md)
- [Working with WordPress Layouts](docs/WORKING-WITH-WORDPRESS-LAYOUTS.md)

### Design & Planning
- [Design System](docs/DESIGN-SYSTEM.md) - Color, spacing, typography tokens
- [Design System (TT5)](docs/DESIGN-SYSTEM-TT5.md) - Twenty Twenty-Five integration
- [Missing Blocks Research](docs/MISSING-BLOCKS-RESEARCH.md) - Market research
- [Next Blocks](docs/NEXT-BLOCKS.md) - Roadmap for future blocks
- [Implementation Plans](docs/COUNTER-STATS-BLOCK-IMPLEMENTATION-PLAN.md) - Detailed feature specs

## Roadmap

### ✅ Completed (Phase 1)
- 11 core custom blocks (Container, Accordion, Tabs, Counter, Icon, Progress Bar, etc.)
- Block extensions (Responsive, Animations)
- Global styles integration
- Animation system (8+ entrance animations)
- Block patterns (Hero, CTA, Features, FAQ)
- Comprehensive documentation (2,500+ lines)
- Testing infrastructure (E2E + Unit)
- FSE compatibility (Twenty Twenty-Five)

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
- Community feedback integration
- WordPress.org release

### 🔮 Future Phases
- Dynamic content blocks
- WooCommerce integration blocks
- Form builder blocks
- Advanced theme builder features
- Template library
- Community pattern marketplace

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

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Follow WordPress coding standards**: Run linters before committing
4. **Write tests**: Add unit and E2E tests for new features
5. **Document your code**: Add JSDoc comments to all functions
6. **Submit a pull request**: Include a clear description of changes

### Development Guidelines

- Follow the patterns in [CLAUDE.md](.claude/CLAUDE.md)
- Keep files under 300 lines (refactor when exceeded)
- Use WordPress hooks (useBlockProps, useInnerBlocksProps)
- No direct DOM manipulation (use React patterns)
- Test in both editor and frontend
- Ensure FSE compatibility (test with Twenty Twenty-Five)

### Reporting Issues

- Use GitHub Issues for bug reports and feature requests
- Include WordPress version, PHP version, and browser
- Provide steps to reproduce for bugs
- Share screenshots or videos when helpful

## License

GPL-2.0-or-later - 100% Free Forever

## Block Categories

Blocks are organized in the WordPress block inserter:

**DesignSetGo** - Main category (appears first)
- Container
- Accordion / Accordion Item
- Tabs / Tab
- Counter / Counter Group
- Icon / Icon List / Icon List Item
- Progress Bar

**Extensions** - Available for all blocks
- Responsive visibility toggles (Block Settings → DesignSetGo)
- Entrance animations (Block Settings → DesignSetGo)

**Patterns** - Pre-designed layouts
- Look for the "DesignSetGo" category in the pattern inserter

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

**Powered by**: React, WordPress Block Editor, Webpack, @wordpress/scripts

---

**License**: GPL-2.0-or-later | **Version**: 1.0.0 | **Requires WordPress**: 6.4+ | **Requires PHP**: 7.4+
