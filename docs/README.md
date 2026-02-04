# DesignSetGo Documentation

Complete reference documentation for developing blocks in the DesignSetGo WordPress plugin.

## 🚀 Quick Start

### For New Contributors
**Never contributed before?** Start with these guides in order:

1. **[GETTING-STARTED.md](./GETTING-STARTED.md)** ⭐ **Start here!**
   - Complete setup walkthrough
   - Prerequisites and installation
   - Making your first change
   - Common workflows

2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Understand the codebase
   - Project structure
   - How blocks work
   - Build system
   - Data flow

3. **[../CONTRIBUTING.md](../CONTRIBUTING.md)** - Contribution workflow
   - Code standards
   - Testing requirements
   - Pull request process

### For Experienced WordPress Developers
1. Read [BEST-PRACTICES-SUMMARY.md](./guides/BEST-PRACTICES-SUMMARY.md) for quick patterns
2. Review [BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md](./guides/BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md) for deep understanding
3. Check [FSE-COMPATIBILITY-GUIDE.md](./FSE-COMPATIBILITY-GUIDE.md) when creating new blocks

### For AI-Assisted Development
**This plugin was built 100% with AI assistance!**

1. **[AI-ASSISTED-DEVELOPMENT.md](./guides/AI-ASSISTED-DEVELOPMENT.md)** ⭐ **Complete AI development guide!**
   - How this plugin was built with Claude Code
   - Available slash commands (/add-block, /lint, /test, etc.)
   - Best practices for AI-assisted development
   - Common workflows and examples
   - Tips, tricks, and limitations

2. **[../.claude/CLAUDE.md](../.claude/CLAUDE.md)** - Development patterns and context
   - Critical patterns AI follows
   - WordPress best practices
   - Project-specific conventions

3. **[BEST-PRACTICES-SUMMARY.md](./guides/BEST-PRACTICES-SUMMARY.md)** - Quick reference
4. **[BLOCK-TEMPLATE-EDIT.js](./templates/BLOCK-TEMPLATE-EDIT.js)** - Block template to copy

## 📁 Folder Organization

The documentation is organized into the following categories:

### Core Documentation (Root Level)
- **[README.md](./README.md)** - This file, your navigation hub
- **[GETTING-STARTED.md](./GETTING-STARTED.md)** - Complete setup and onboarding guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Deep dive into project architecture

### Categorized Documentation

#### [api/](./api/)
API references and technical documentation:
- [ABILITIES-API-GUIDE.md](./api/ABILITIES-API-GUIDE.md) - WordPress Abilities API integration guide
- [ABILITIES-API.md](./api/ABILITIES-API.md) - Core Abilities API reference
- [INTERACTIVE-BLOCKS.md](./api/INTERACTIVE-BLOCKS.md) - Interactive block patterns

#### [audits/](./audits/)
Block audits and analysis documents:
- [CARD-BLOCK-AUDIT.md](./audits/CARD-BLOCK-AUDIT.md) - Card block audit and improvements
- [scroll-accordion-stacking-notes.md](./audits/scroll-accordion-stacking-notes.md) - Scroll accordion analysis

#### [blocks/](./blocks/)
User-facing documentation for all 25 blocks:

**Container Blocks (3):**
- [GRID.md](./blocks/GRID.md) - Responsive CSS Grid layouts
- [ROW.md](./blocks/ROW.md) - Horizontal flexbox containers
- [SECTION.md](./blocks/SECTION.md) - Vertical stacking sections

**Interactive Blocks (7):**
- [ACCORDION.md](./blocks/ACCORDION.md) - Collapsible content panels
- [TABS.md](./blocks/TABS.md) - Tabbed interface with deep linking
- [SLIDER.md](./blocks/SLIDER.md) - Image/content carousel
- [FLIP-CARD.md](./blocks/FLIP-CARD.md) - Two-sided flip cards
- [REVEAL.md](./blocks/REVEAL.md) - Hover-triggered content reveal
- [IMAGE-ACCORDION.md](./blocks/IMAGE-ACCORDION.md) - Expandable image panels
- [SCROLL-ACCORDION.md](./blocks/SCROLL-ACCORDION.md) - Scroll-triggered sticky cards

**Icon Blocks (3):**
- [ICON.md](./blocks/ICON.md) - SVG icon display
- [ICON-BUTTON.md](./blocks/ICON-BUTTON.md) - Buttons with icons
- [ICON-LIST.md](./blocks/ICON-LIST.md) - Lists with custom icons

**Counter Blocks (2):**
- [COUNTER-GROUP.md](./blocks/COUNTER-GROUP.md) - Animated statistics
- [PROGRESS-BAR.md](./blocks/PROGRESS-BAR.md) - Animated progress indicators

**Content/UI Blocks (5):**
- [CARD.md](./blocks/CARD.md) - Content cards with layouts
- [PILL.md](./blocks/PILL.md) - Inline badges and tags
- [DIVIDER.md](./blocks/DIVIDER.md) - Content separators
- [COUNTDOWN-TIMER.md](./blocks/COUNTDOWN-TIMER.md) - Live countdowns
- [BLOBS.md](./blocks/BLOBS.md) - Organic animated shapes

**Utility Blocks (3):**
- [MAP.md](./blocks/MAP.md) - Interactive maps (OSM/Google)
- [MODAL.md](./blocks/MODAL.md) - Modal dialogs and popups
- [MODAL-TRIGGER.md](./blocks/MODAL-TRIGGER.md) - Modal trigger buttons

**Forms (1):**
- [FORM-BUILDER.md](./blocks/FORM-BUILDER.md) - Complete form system (12 field types)

**Special (1):**
- [SCROLL-GALLERY.md](./blocks/SCROLL-GALLERY.md) - Scroll-based parallax gallery

#### [extensions/](./extensions/)
Documentation for all 11 block extensions that enhance any WordPress block:

**Animation & Effects:**
- [BLOCK-ANIMATIONS.md](./extensions/BLOCK-ANIMATIONS.md) - Entrance/exit animations
- [REVEAL-CONTROL.md](./extensions/REVEAL-CONTROL.md) - Hover reveal effects

**Layout & Positioning:**
- [STICKY-HEADER.md](./extensions/STICKY-HEADER.md) - Sticky header behavior
- [MAX-WIDTH.md](./extensions/MAX-WIDTH.md) - Content width constraints
- [GRID-SPAN.md](./extensions/GRID-SPAN.md) - Grid column spanning

**Interaction:**
- [CLICKABLE-GROUP.md](./extensions/CLICKABLE-GROUP.md) - Clickable containers
- [BACKGROUND-VIDEO.md](./extensions/BACKGROUND-VIDEO.md) - Video backgrounds

**Responsive & Styling:**
- [RESPONSIVE-VISIBILITY.md](./extensions/RESPONSIVE-VISIBILITY.md) - Device-based visibility
- [CUSTOM-CSS.md](./extensions/CUSTOM-CSS.md) - Custom CSS per block
- [TEXT-ALIGNMENT-INHERITANCE.md](./extensions/TEXT-ALIGNMENT-INHERITANCE.md) - Alignment inheritance
- [ANIMATION.md](./extensions/ANIMATION.md) - Animation framework (advanced)

#### [compliance/](./compliance/)
Accessibility and compliance documentation:
- [ACCESSIBILITY-COLOR-CONTRAST-GUIDE.md](./compliance/ACCESSIBILITY-COLOR-CONTRAST-GUIDE.md) - Color contrast standards
- [GDPR-COMPLIANCE.md](./compliance/GDPR-COMPLIANCE.md) - GDPR compliance guide

#### [guides/](./guides/)
Development guides and best practices:
- [AI-ASSISTED-DEVELOPMENT.md](./guides/AI-ASSISTED-DEVELOPMENT.md) - AI-assisted development guide
- [BEST-PRACTICES-SUMMARY.md](./guides/BEST-PRACTICES-SUMMARY.md) - Quick reference guide
- [BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md](./guides/BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md) - Comprehensive guide
- [BLOCK-CONTROLS-ORGANIZATION.md](./guides/BLOCK-CONTROLS-ORGANIZATION.md) - Inspector controls patterns
- [CONTROL-REORGANIZATION.md](./guides/CONTROL-REORGANIZATION.md) - Control reorganization strategies
- [DESIGN-SYSTEM.md](./guides/DESIGN-SYSTEM.md) - Design system and tokens

#### [patterns/](./patterns/)
Design patterns and architectural strategies:
- [COLOR-CONTROLS-PATTERN.md](./patterns/COLOR-CONTROLS-PATTERN.md) - Color control patterns
- [CUSTOM-CSS-FILTERS.md](./patterns/CUSTOM-CSS-FILTERS.md) - CSS filter patterns
- [PERFORMANCE-CSS-STRATEGY.md](./patterns/PERFORMANCE-CSS-STRATEGY.md) - CSS performance optimization
- [WIDTH-CSS-STRATEGY-IMPLEMENTATION.md](./patterns/WIDTH-CSS-STRATEGY-IMPLEMENTATION.md) - Width strategy implementation
- [WIDTH-LAYOUT-PATTERNS.md](./patterns/WIDTH-LAYOUT-PATTERNS.md) - Layout width patterns

#### [planning/](./planning/)
Roadmaps, strategy, and future planning:
- [BLOCK-EXTENSION-STRATEGY.md](./planning/BLOCK-EXTENSION-STRATEGY.md) - Extension strategy
- [BLOCKS-FUTURE-IDEAS.md](./planning/BLOCKS-FUTURE-IDEAS.md) - Future block ideas
- [BLOCKS-ROADMAP.md](./planning/BLOCKS-ROADMAP.md) - Blocks roadmap
- [EXTENSION-VS-CUSTOM-BLOCKS.md](./planning/EXTENSION-VS-CUSTOM-BLOCKS.md) - Strategic decisions
- [JTBD.md](./planning/JTBD.md) - Jobs to be Done framework
- [ROADMAP.md](./planning/ROADMAP.md) - Overall project roadmap

#### [templates/](./templates/)
Code templates and boilerplate:
- [BLOCK-TEMPLATE-EDIT.js](./templates/BLOCK-TEMPLATE-EDIT.js) - Block edit.js template

#### [testing/](./testing/)
Testing documentation and strategies:
- [TESTING-ABILITIES-API.md](./testing/TESTING-ABILITIES-API.md) - Abilities API testing
- [TESTING.md](./testing/TESTING.md) - General testing guide

#### [troubleshooting/](./troubleshooting/)
Debugging and problem-solving guides:
- [HANDLING-LINT-ERRORS.md](./troubleshooting/HANDLING-LINT-ERRORS.md) - Lint error solutions
- [TROUBLESHOOTING.md](./troubleshooting/TROUBLESHOOTING.md) - General troubleshooting

## 📚 Documentation Structure

### Getting Started (New Contributors)

#### [GETTING-STARTED.md](./GETTING-STARTED.md)
Complete step-by-step guide for new contributors:
- **Software prerequisites**: Node.js, Git, Docker Desktop
- **Understanding the stack**: What technologies we use and why
- **Step-by-step setup**: From fork to first contribution
- **Your first change**: Hands-on example walking through a real code change
- **Development tools**: npm scripts, VS Code integration, browser DevTools
- **Common workflows**: Daily development, updating fork, fixing issues
- **Troubleshooting**: Solutions to common setup problems
- **Next steps**: Learning resources and finding issues to work on

**When to use**: First time setting up the project or helping someone else get started.

#### [ARCHITECTURE.md](./ARCHITECTURE.md)
Deep dive into project architecture and code organization:
- **High-level overview**: Technology stack and core components
- **Complete directory structure**: Every folder explained with purpose
- **Block architecture**: Anatomy of a block, file-by-file breakdown
- **Build system**: Webpack, asset compilation, dependency management
- **Data flow**: How data moves from editor to database to frontend
- **Extension system**: How extensions modify existing blocks
- **PHP backend**: Server-side architecture and registration
- **Testing infrastructure**: E2E and unit test setup
- **AI integration**: WordPress Abilities API architecture

**When to use**: Understanding how the codebase works, onboarding to the project, or making architectural decisions.

#### [../CONTRIBUTING.md](../CONTRIBUTING.md)
Complete contribution guide and workflow:
- **Development setup**: Prerequisites and step-by-step installation
- **Project architecture**: Quick overview with links to detailed docs
- **Development workflow**: Creating branches, making changes, testing
- **Code standards**: WordPress patterns, project-specific rules
- **Testing requirements**: What to test before submitting
- **Submitting changes**: Pull request process and checklist
- **Getting help**: Where to ask questions and report issues

**When to use**: Ready to contribute code or submitting a pull request.

#### [AI-ASSISTED-DEVELOPMENT.md](./AI-ASSISTED-DEVELOPMENT.md)
Complete guide to AI-assisted development (how this plugin was built):
- **Why AI-assisted development**: Benefits and use cases
- **Getting started with Claude Code**: Installation and setup
- **Available slash commands**: /add-block, /lint, /test, /deploy, and more
- **Best practices**: Effective prompts, iteration, validation
- **Common workflows**: Creating blocks, debugging, refactoring with AI
- **Using other AI tools**: ChatGPT, GitHub Copilot, Abilities API
- **Tips and tricks**: Context management, learning patterns
- **Limitations and validation**: When AI makes mistakes, validation checklist

**When to use**: Using AI tools (Claude Code, ChatGPT, Copilot) to contribute, or curious about how this entire plugin was built with AI.

---

## 🎯 Quick Reference Links

### Critical Patterns (Read First!)

#### Color Controls - MOST IMPORTANT ⚠️
**Location**: [../.claude/CLAUDE.md](../.claude/CLAUDE.md#color-controls---critical-pattern)

**Rule**: ALWAYS use `ColorGradientSettingsDropdown`, NEVER use `PanelColorSettings`

```javascript
// CORRECT - Modern WordPress pattern
import {
  __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
  __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes, clientId }) {
  const colorGradientSettings = useMultipleOriginColorsAndGradients();

  return (
    <InspectorControls group="color">
      <ColorGradientSettingsDropdown
        panelId={clientId}
        title={__('Colors', 'designsetgo')}
        settings={[
          {
            label: __('Text Color', 'designsetgo'),
            colorValue: textColor,
            onColorChange: (color) =>
              setAttributes({ textColor: color || '' }),
            clearable: true,
          },
        ]}
        {...colorGradientSettings}
      />
    </InspectorControls>
  );
}
```

**Why This Matters**:
- All 13 existing blocks use this pattern (migrated 2025-11-08)
- PanelColorSettings is deprecated and will be removed
- Places controls in Styles tab (better UX, WordPress standard)

### Reference Documents

#### [BEST-PRACTICES-SUMMARY.md](./guides/BEST-PRACTICES-SUMMARY.md)
- **Use for**: Quick reference during development
- **Contains**: Critical rules, decision trees, copy-paste patterns
- **Read time**: 5-10 minutes

#### [BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md](./guides/BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md)
- **Use for**: Deep understanding of patterns and rationale
- **Contains**: 15 major topics with real-world examples
- **Read time**: 30-45 minutes

#### [BLOCK-TEMPLATE-EDIT.js](./templates/BLOCK-TEMPLATE-EDIT.js)
- **Use for**: Starting point for new blocks
- **Contains**: Fully commented template with all critical patterns
- **Copy this file** when creating new blocks

### Specialized Guides

#### [FSE-COMPATIBILITY-GUIDE.md](./FSE-COMPATIBILITY-GUIDE.md)
Full Site Editing compatibility requirements:
- Block.json configuration
- Supports properties
- Testing checklist
- Pattern creation

#### [REFACTORING-GUIDE.md](./REFACTORING-GUIDE.md)
File structure and refactoring patterns:
- 300-line file size limit
- Component extraction strategies
- Real-world examples with ROI

#### [EDITOR-STYLING-GUIDE.md](./EDITOR-STYLING-GUIDE.md)
Editor styling best practices:
- Declarative styling patterns
- useInnerBlocksProps usage
- :where() specificity patterns

#### [BLOCK-CONTROLS-ORGANIZATION.md](./guides/BLOCK-CONTROLS-ORGANIZATION.md)
Inspector controls organization:
- Settings tab vs Styles tab
- Block Supports usage
- Panel structure

#### [BLOCK-SUPPORTS-AUDIT.md](./BLOCK-SUPPORTS-AUDIT.md)
Block Supports optimization audit:
- Current support usage across all blocks
- Opportunities for improvement
- Migration patterns

## 🎯 Common Tasks

### Creating a New Block
1. Copy [BLOCK-TEMPLATE-EDIT.js](./templates/BLOCK-TEMPLATE-EDIT.js) to `src/blocks/{block-name}/edit.js`
2. Update block.json with proper supports (see [FSE-COMPATIBILITY-GUIDE.md](./FSE-COMPATIBILITY-GUIDE.md))
3. Implement save.js matching edit.js structure
4. Add color controls using ColorGradientSettingsDropdown pattern
5. Test in editor and frontend

### Adding Color Controls to Existing Block
1. Add imports:
   ```javascript
   import {
     __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
     __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
   } from '@wordpress/block-editor';
   ```
2. Add `clientId` to function signature
3. Add `useMultipleOriginColorsAndGradients()` hook
4. Replace PanelColorSettings with ColorGradientSettingsDropdown in Styles tab

See [BLOCK-TEMPLATE-EDIT.js](./templates/BLOCK-TEMPLATE-EDIT.js) for complete example.

### Refactoring Large Files
1. Check file line count: `wc -l src/blocks/{block-name}/edit.js`
2. If >300 lines, follow [REFACTORING-GUIDE.md](./REFACTORING-GUIDE.md)
3. Extract components into `components/` directory
4. Extract utilities into `utils/` directory
5. Keep index.js focused on registration only

## 📊 Project Statistics (2025-11-08)

### Block Count
- **Total blocks**: 41
- **Container blocks**: 3 (Flex, Grid, Stack)
- **Form blocks**: 11 (Form Builder + 10 field types)
- **Content blocks**: 27

### Code Quality
- **Block Supports adoption**: 93% (38/41 blocks)
- **Color controls**: 100% modern (13/13 blocks using ColorGradientSettingsDropdown)
- **Refactored blocks**: 4 (Container, Counter, Icon, Icon List)
- **Average file size reduction**: 66% (after refactoring)

### Recent Migrations
- **2025-11-08**: All 13 blocks migrated from PanelColorSettings to ColorGradientSettingsDropdown
- **Blocks affected**: Icon List, Counter, Progress Bar, Counter Group, Countdown Timer, Tabs, Grid, Stack, Flex, Form Builder, Blobs, Slider, Icon Button
- **Result**: Zero PanelColorSettings instances remaining in codebase

## 🔍 Finding Information

### "How do I add color controls?"
→ [../.claude/CLAUDE.md](../.claude/CLAUDE.md#color-controls---critical-pattern) or [BLOCK-TEMPLATE-EDIT.js](./templates/BLOCK-TEMPLATE-EDIT.js)

### "What's the proper block structure?"
→ [BEST-PRACTICES-SUMMARY.md](./guides/BEST-PRACTICES-SUMMARY.md) or [BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md](./guides/BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md)

### "How do I make my block FSE-compatible?"
→ [FSE-COMPATIBILITY-GUIDE.md](./FSE-COMPATIBILITY-GUIDE.md)

### "My file is too large, how do I refactor?"
→ [REFACTORING-GUIDE.md](./REFACTORING-GUIDE.md)

### "Should I use Block Supports or custom controls?"
→ [BLOCK-CONTROLS-ORGANIZATION.md](./guides/BLOCK-CONTROLS-ORGANIZATION.md) and [BLOCK-SUPPORTS-AUDIT.md](./BLOCK-SUPPORTS-AUDIT.md)

## 🎓 Learning Path

### Beginner
1. Read [BEST-PRACTICES-SUMMARY.md](./guides/BEST-PRACTICES-SUMMARY.md) - Critical rules
2. Copy [BLOCK-TEMPLATE-EDIT.js](./templates/BLOCK-TEMPLATE-EDIT.js) - Build first block
3. Read [FSE-COMPATIBILITY-GUIDE.md](./FSE-COMPATIBILITY-GUIDE.md) - Make it compatible

### Intermediate
1. Read [BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md](./guides/BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md) - Deep understanding
2. Review [BLOCK-CONTROLS-ORGANIZATION.md](./guides/BLOCK-CONTROLS-ORGANIZATION.md) - Better UX patterns
3. Study [EDITOR-STYLING-GUIDE.md](./EDITOR-STYLING-GUIDE.md) - Proper styling

### Advanced
1. Apply [REFACTORING-GUIDE.md](./REFACTORING-GUIDE.md) - Clean architecture
2. Optimize with [BLOCK-SUPPORTS-AUDIT.md](./BLOCK-SUPPORTS-AUDIT.md) - Less code, better integration
3. Contribute patterns back to [../.claude/CLAUDE.md](../.claude/CLAUDE.md)

## 📝 Contributing to Documentation

When you discover new patterns or best practices:

1. **Critical patterns** → Add to [../.claude/CLAUDE.md](../.claude/CLAUDE.md)
2. **Quick reference** → Add to [BEST-PRACTICES-SUMMARY.md](./guides/BEST-PRACTICES-SUMMARY.md)
3. **Deep explanations** → Add to [BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md](./guides/BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md)
4. **Specialized topics** → Create new guide or update existing specialized guide in appropriate folder

---

**Last Updated**: 2025-11-19
**Plugin Version**: 1.4.1
**WordPress Compatibility**: 6.7+
