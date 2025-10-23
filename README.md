# DesignSetGo

Modern Gutenberg block library bridging the gap between core WordPress blocks and advanced page builders. Design made easy, fast, and beautiful.

## Status

🚧 **In Active Development** - Phase 1 MVP (Sprint 1-2)

**Current Progress:**
- ✅ Project foundation and architecture complete
- ✅ Build system configured
- ✅ PHP plugin architecture implemented
- ✅ Container block (basic implementation)
- ✅ Global styles system (theme.json integration)
- ✅ Animation system foundation
- 🔄 Shared React components (next sprint)

See [PRD.md](PRD.md) for product vision and [DEV-PHASE-1.md](DEV-PHASE-1.md) for detailed development documentation.

## Quick Start

### Prerequisites

- Node.js 18+
- PHP 8.0+
- WordPress 6.4+
- npm or pnpm

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

# Lint JavaScript
npm run lint:js

# Lint CSS/SCSS
npm run lint:css

# Format code
npm run format

# Run tests
npm run test:unit
npm run test:e2e
```

### WordPress Environment Setup

```bash
# Start local WordPress environment (using wp-env)
npx wp-env start

# Access WordPress
# URL: http://localhost:8888
# Username: admin
# Password: password

# Stop environment
npx wp-env stop
```

## Current Features

### Container Block
Advanced layout container with:
- **Layout Types:** Flexbox, Grid, Auto-Grid
- **Flexbox Controls:** Direction, justify-content, align-items
- **Grid Controls:** Column count (responsive)
- **Responsive:** Hide on specific devices
- **Semantic HTML:** Choose from div, section, article, etc.
- **FSE Integration:** Native WordPress spacing, colors, borders support
- **Animation Support:** Entrance animations (fadeIn, fadeInUp, etc.)

### Global Styles System
- FSE-first approach using theme.json
- Color palette (Primary, Secondary, Accent)
- Gradient presets
- Spacing scale (xs, sm, md, lg, xl)
- Typography presets
- Full WordPress compatibility

### Animation System
- 8 entrance animations
- Configurable duration, delay, and easing
- Respects `prefers-reduced-motion`
- CSS-only implementation (no JS libraries)

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

- [Product Requirements Document](PRD.md) - Vision, strategy, market analysis
- [Development Phase 1 Guide](DEV-PHASE-1.md) - Technical documentation
- [Missing Blocks Research](docs/MISSING-BLOCKS-RESEARCH.md) - Market research

## Roadmap

**Phase 1 (16 weeks) - MVP:**
- 15 core blocks
- Global styles system
- Basic animations
- 20+ patterns
- WordPress.org release

**Phase 2 (Months 5-10):**
- 10-15 additional blocks
- Advanced animations
- Dynamic content
- WooCommerce integration

**Phase 3 (Months 11-18):**
- Theme builder
- Community marketplace
- Advanced integrations

## Contributing

This project is 100% free and open source (GPL v2+). Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Follow WordPress coding standards
4. Write tests for new features
5. Submit a pull request

## License

GPL-2.0-or-later - 100% Free Forever

## Support

- GitHub Issues: [Report bugs](https://github.com/yourusername/designsetgo/issues)
- Documentation: [docs](./docs/)
- WordPress.org: Coming soon

---

**Built with ❤️ for the WordPress community**
