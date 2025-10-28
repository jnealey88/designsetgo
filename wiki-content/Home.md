# Welcome to DesignSetGo

**Modern Gutenberg block library bridging the gap between core WordPress blocks and advanced page builders.**

---

## 🚀 Quick Links

### Getting Started
- **[Quick Start Guide](Quick-Start)** - Get up and running in 5 minutes
- **[Installation](Installation)** - Installation methods and requirements
- **[Finding Your Blocks](Finding-Your-Blocks)** - Locate blocks in the WordPress editor

### Using DesignSetGo
- **[Container Block](Container-Block)** - Advanced layouts, grids, and video backgrounds
- **[Tabs Block](Tabs-Block)** - Tabbed content with icons and deep linking
- **[Accordion Block](Accordion-Block)** - Collapsible content panels
- **[Counter Block](Counter-Block)** - Animated counting numbers
- **[Icon Block](Icon-Block)** - 500+ icons with shapes and animations
- **[Progress Bar Block](Progress-Bar)** - Animated progress indicators
- **[Pill Block](Pill-Block)** - Badge/tag components

### For Developers
- **[Development Guide](Development-Guide)** - Complete development reference
- **[Best Practices](Best-Practices)** - WordPress block development patterns
- **[Architecture Guide](Architecture-Guide)** - Custom blocks vs extensions
- **[Testing Guide](Testing-Guide)** - E2E and unit testing
- **[API Reference](API-Reference)** - PHP classes and JS utilities

### Reference
- **[Troubleshooting](Troubleshooting)** - Common issues and solutions
- **[FAQ](FAQ)** - Frequently asked questions
- **[Changelog](Changelog)** - Version history

---

## ✨ What is DesignSetGo?

DesignSetGo is a **free, open-source Gutenberg block library** that adds powerful design blocks to WordPress while following WordPress best practices.

### Key Features

| Category | Features |
|----------|----------|
| **Blocks** | 7 custom blocks (Container, Accordion, Tabs, Counter, Icon, Progress Bar, Pill) |
| **Patterns** | Pre-designed layouts (Hero, CTA, Features, FAQ) |
| **FSE Ready** | Full Site Editing compatible, theme.json integration |
| **Performance** | < 10 KB per block, CSS-only animations, no jQuery |
| **Accessibility** | WCAG 2.1 AA compliant, keyboard navigation, screen reader friendly |
| **Developer DX** | WordPress best practices, clean code, comprehensive docs |

---

## 📦 Installation

### Via WordPress Admin (Recommended)
Coming soon - preparing for WordPress.org submission

### Manual Installation

1. **Download** the [latest release](https://github.com/jnealey88/designsetgo/releases)
2. **Upload** to `/wp-content/plugins/designsetgo/`
3. **Activate** via WordPress admin

### For Development

```bash
git clone https://github.com/jnealey88/designsetgo.git
cd designsetgo
npm install
npx wp-env start
npm start
```

See [Installation Guide](Installation) for detailed instructions.

---

## 🎯 Quick Start

### 1. Install & Activate
Install DesignSetGo plugin and activate it in WordPress

### 2. Create New Post/Page
Open WordPress block editor (Gutenberg)

### 3. Insert DesignSetGo Blocks
- Click the **(+)** block inserter button
- Type the block name (e.g., "container", "tabs", "accordion")
- Look for the **DesignSetGo** category
- Click to insert

### 4. Customize
Use the block settings panel on the right to customize your block

See [Quick Start Guide](Quick-Start) for step-by-step instructions.

---

## 💪 What Makes DesignSetGo Different?

### WordPress-First Philosophy
- **Native Integration**: Uses WordPress's built-in features (useBlockProps, theme.json)
- **FSE Compatible**: Works seamlessly with Full Site Editing
- **Theme Agnostic**: Works with any modern WordPress theme
- **No jQuery**: Pure vanilla JavaScript for better performance

### Developer-Friendly
- **Clean Code**: < 300 lines per file, comprehensive JSDoc
- **Best Practices**: Follows official WordPress patterns
- **Declarative**: No DOM manipulation, React-based
- **Security-First**: Input sanitization, output escaping, nonce verification

### Performance Optimized
- **Small Bundles**: < 10 KB per block (editor), < 5 KB (frontend)
- **CSS-Only Animations**: No JavaScript libraries
- **Progressive Enhancement**: Core features work without JavaScript
- **Tree-Shaking**: Only loads what you use

### Accessibility First
- **WCAG 2.1 AA**: Meets accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Friendly**: Proper ARIA labels
- **Reduced Motion**: Respects `prefers-reduced-motion`

---

## 📚 Documentation Structure

This wiki is organized by audience:

### For Users
Learn how to use DesignSetGo blocks in your WordPress site
- Getting Started guides
- Block-specific tutorials
- Patterns and examples
- Troubleshooting

### For Developers
Build with DesignSetGo or contribute to the project
- Development setup
- Architecture decisions
- Best practices
- Testing guides
- API documentation

### For Contributors
Help improve DesignSetGo
- Contributing guidelines
- Code standards
- Pull request process
- Security policies

---

## 🤝 Contributing

DesignSetGo is 100% free and open source (GPL v2+). Contributions welcome!

- **Report bugs**: [GitHub Issues](https://github.com/jnealey88/designsetgo/issues)
- **Request features**: [GitHub Discussions](https://github.com/jnealey88/designsetgo/discussions)
- **Submit code**: [Contributing Guide](Contributing)
- **Improve docs**: [Edit this wiki](https://github.com/jnealey88/designsetgo/wiki)

---

## 📞 Support

### Getting Help
- **Documentation**: Browse this wiki for guides and references
- **GitHub Issues**: [Report bugs](https://github.com/jnealey88/designsetgo/issues)
- **Discussions**: [Ask questions](https://github.com/jnealey88/designsetgo/discussions)
- **Troubleshooting**: [Common issues](Troubleshooting)

### Useful Links
- [WordPress.org Plugin](https://wordpress.org/plugins/designsetgo/) (coming soon)
- [GitHub Repository](https://github.com/jnealey88/designsetgo)
- [Changelog](Changelog)

---

## 📄 License

GPL-2.0-or-later - 100% Free Forever

---

**Version**: 1.0.0 | **Requires WordPress**: 6.4+ | **Requires PHP**: 7.4+

Built with ❤️ for the WordPress community
