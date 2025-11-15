# Contributing to DesignSetGo

Welcome! We're excited that you want to contribute to DesignSetGo. This guide will walk you through everything you need to know to start contributing.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Branch Protection & PR Workflow](#branch-protection--pr-workflow)
- [Development Setup](#development-setup)
- [Project Architecture](#project-architecture)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Getting Help](#getting-help)

## 🚀 Quick Start

**New to the project?** Start here:

1. **[Getting Started Guide](docs/GETTING-STARTED.md)** - Detailed setup walkthrough
2. **[Architecture Overview](docs/ARCHITECTURE.md)** - Understanding the codebase
3. **[Best Practices](.claude/CLAUDE.md)** - Development patterns

**First contribution?** Look for issues labeled `good-first-issue` in the [issue tracker](https://github.com/jnealey88/designsetgo/issues).

## 🔒 Branch Protection & PR Workflow

### Repository Rules

This repository uses **branch protection** on the `main` branch to ensure code quality and maintain a clean history:

- **All changes require Pull Requests (PRs)** - No direct commits to `main`
- **No force pushes** - Prevents accidental history rewrites
- **No branch deletion** - Protects the main branch

### For Repository Maintainers

As a repository owner/admin, you can:
- Create feature branches and submit PRs
- Merge your own PRs without waiting for reviews
- Push changes through the standard PR workflow

**Workflow:**
```bash
# 1. Create a feature branch
git checkout -b feature/your-feature

# 2. Make changes and commit
git add .
git commit -m "feat: your changes"

# 3. Push and create PR
git push -u origin feature/your-feature
gh pr create --title "Your Feature" --body "Description"

# 4. Merge your own PR (as owner/admin)
gh pr merge --squash  # or --merge, --rebase
```

### For External Contributors

**IMPORTANT**: External contributors must follow these steps:

1. **Create an issue first** describing:
   - Bug: Steps to reproduce, expected vs actual behavior
   - Feature: Use case, proposed implementation
   - Documentation: What needs to be added/updated

2. **Fork the repository** or create a feature branch

3. **Link your PR to the issue**:
   ```bash
   gh pr create --title "Fix accordion bug" --body "Description

   Fixes #123"
   ```

4. **Wait for review and approval** from maintainers before merging

**Why this workflow?**
- Ensures all changes are tracked via issues
- Provides context for code reviews
- Maintains a clear project history
- Allows for discussion before implementation

### PR Requirements (All Contributors)

Before creating a PR, ensure:

- [ ] Code builds without errors: `npm run build`
- [ ] **Linters pass (no auto-fix)**: `npm run lint:js`, `npm run lint:css`, `npm run lint:php`
  - Linters will fail the build if there are errors
  - Fix issues manually or run `npm run format` to auto-format
  - Review all changes before committing
- [ ] Tests pass (if applicable)
- [ ] Changes tested in editor AND frontend
- [ ] No console errors (browser + `npx wp-env logs`)
- [ ] Responsive testing completed (375px/768px/1200px)
- [ ] Documentation updated (if needed)

**Note**: CI checks will fail if linting errors exist. They will NOT auto-fix code.

## 🛠️ Development Setup

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 8+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Docker Desktop** (for wp-env) ([Download](https://www.docker.com/products/docker-desktop/))

**Note**: You don't need to install WordPress, PHP, or MySQL separately. The `wp-env` tool handles this using Docker.

### Step-by-Step Setup

#### 1. Fork and Clone

```bash
# Fork the repository on GitHub first, then:
git clone https://github.com/YOUR-USERNAME/designsetgo.git
cd designsetgo
```

#### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# This installs:
# - WordPress scripts and tools
# - React and WordPress packages
# - Development tools (linters, formatters)
# - Testing frameworks (Jest, Playwright)
```

#### 3. Start Local WordPress Environment

```bash
# Start WordPress (first time may take 2-3 minutes)
npx wp-env start

# What this does:
# - Downloads WordPress via Docker
# - Sets up MySQL database
# - Installs the plugin automatically
# - Creates admin user (admin/password)
```

**Access your local WordPress:**
- Frontend: http://localhost:8888
- Admin: http://localhost:8888/wp-admin
- Username: `admin`
- Password: `password`

#### 4. Start Development Build

Open a new terminal window:

```bash
# Start the build process with hot reload
npm start

# This watches for file changes and rebuilds automatically
# Keep this running while you develop
```

#### 5. Verify Installation

1. Go to http://localhost:8888/wp-admin
2. Log in with `admin` / `password`
3. Navigate to **Plugins** - DesignSetGo should be active
4. Create a new post/page
5. Click the **+** button to add a block
6. Search for "DesignSetGo" - you should see all blocks

**🎉 You're ready to start developing!**

### Common Setup Issues

**Docker not running:**
```bash
# Error: "Cannot connect to Docker daemon"
# Solution: Start Docker Desktop, then retry
```

**Port already in use:**
```bash
# Error: "Port 8888 is already in use"
# Solution: Stop the conflicting service or change wp-env ports in package.json
```

**Build errors:**
```bash
# Try clearing node_modules and rebuilding
rm -rf node_modules package-lock.json
npm install
npm start
```

See [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for more help.

## 🏗️ Project Architecture

### Folder Structure

```
designsetgo/
├── .claude/              # AI development context (Claude Code instructions)
│   └── CLAUDE.md        # Development patterns and best practices
│
├── src/                 # JavaScript source files (edit these!)
│   ├── blocks/         # Individual block implementations
│   │   ├── accordion/  # Example: Accordion block
│   │   │   ├── index.js        # Block registration
│   │   │   ├── edit.js         # Editor component (React)
│   │   │   ├── save.js         # Frontend output
│   │   │   ├── block.json      # Block configuration
│   │   │   ├── style.scss      # Frontend styles
│   │   │   └── editor.scss     # Editor-only styles
│   │   └── ...
│   ├── components/     # Shared React components
│   ├── extensions/     # Block extensions (animations, responsive)
│   ├── styles/         # Global styles
│   └── utils/          # Shared utilities
│
├── includes/           # PHP source files
│   ├── admin/         # Admin interface
│   ├── blocks/        # PHP block registration
│   ├── patterns/      # Pattern registration
│   └── class-*.php    # Core classes
│
├── build/             # Compiled files (auto-generated, don't edit!)
│   ├── blocks/       # Compiled JS/CSS
│   └── *.asset.php   # Asset dependencies
│
├── docs/             # Developer documentation
│   ├── GETTING-STARTED.md     # This guide
│   ├── ARCHITECTURE.md         # Code structure
│   ├── BEST-PRACTICES-SUMMARY.md
│   └── ...
│
├── tests/            # Test files
│   ├── e2e/         # End-to-end tests (Playwright)
│   └── unit/        # Unit tests (Jest)
│
└── designsetgo.php   # Main plugin file
```

**Key Directories:**

- **`src/`** - Where you write code (JavaScript, React, SCSS)
- **`includes/`** - PHP code (server-side logic)
- **`build/`** - Compiled output (never edit directly!)
- **`docs/`** - Documentation (you're reading one now!)

### How Code Flows

```
Developer writes code
    ↓
src/blocks/my-block/edit.js (React component for editor)
src/blocks/my-block/save.js (HTML output for frontend)
src/blocks/my-block/style.scss (CSS styles)
    ↓
npm start (or npm run build)
    ↓
Webpack compiles
    ↓
build/blocks/my-block/index.js (compiled JS)
build/blocks/my-block/style-index.css (compiled CSS)
    ↓
PHP loads in WordPress
    ↓
User sees in editor/frontend
```

For detailed architecture explanation, see [ARCHITECTURE.md](docs/ARCHITECTURE.md).

## 🔄 Development Workflow

### Making Changes

#### 1. Create a Branch

```bash
# Create a descriptive branch name
git checkout -b feature/add-timeline-block
# or
git checkout -b fix/accordion-animation-bug
```

**Branch naming convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code improvements
- `docs/` - Documentation updates

#### 2. Make Your Changes

Example: Adding a new block attribute

**Edit `src/blocks/my-block/block.json`:**
```json
{
  "attributes": {
    "newAttribute": {
      "type": "string",
      "default": ""
    }
  }
}
```

**Edit `src/blocks/my-block/edit.js`:**
```javascript
export default function Edit({ attributes, setAttributes }) {
  const { newAttribute } = attributes;

  return (
    <div>
      <TextControl
        label="New Attribute"
        value={newAttribute}
        onChange={(value) => setAttributes({ newAttribute: value })}
      />
    </div>
  );
}
```

#### 3. Test Your Changes

```bash
# The build should auto-reload (if npm start is running)
# Go to http://localhost:8888/wp-admin
# Test in the editor
# Preview on the frontend
```

**Testing checklist:**
- [ ] Works in block editor
- [ ] Saves correctly
- [ ] Displays correctly on frontend
- [ ] No JavaScript console errors
- [ ] No PHP errors (check `npx wp-env logs`)
- [ ] Responsive on mobile/tablet/desktop

#### 4. Run Linters and Tests

**⚠️ Important**: Linters will **report errors but NOT auto-fix** them. This is intentional to ensure you understand and review all changes.

```bash
# Lint JavaScript (reports errors, no auto-fix)
npm run lint:js

# Lint CSS (reports errors, no auto-fix)
npm run lint:css

# Format code manually if needed
npm run format

# Run unit tests
npm run test:unit

# Run E2E tests (if relevant)
npm run test:e2e
```

**If linters fail:**
1. Review the errors carefully
2. Fix them manually OR run `npm run format` to auto-format
3. Understand what changed before committing

#### 5. Commit Your Changes

```bash
# Stage your changes
git add src/blocks/my-block/

# Commit with a descriptive message
git commit -m "feat: add new attribute to My Block"
```

**Commit message format:**
```
type: description

Examples:
feat: add Timeline block with horizontal/vertical layouts
fix: resolve accordion animation timing issue
refactor: extract Icon Picker to shared component
docs: update CONTRIBUTING guide with setup steps
style: fix spacing in Grid block CSS
test: add E2E tests for Form Builder
chore: update dependencies
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code improvement (no behavior change)
- `docs` - Documentation
- `style` - Code formatting
- `test` - Adding/updating tests
- `chore` - Build process, dependencies

### AI-Assisted Development

DesignSetGo includes comprehensive documentation for AI tools like Claude Code:

**`.claude/CLAUDE.md`** - Instructions for AI agents containing:
- Critical patterns (color controls, block props)
- WordPress hooks and APIs
- Common pitfalls and solutions
- Pre-commit checklist

**Using Claude Code?** The AI will automatically reference this file to follow project conventions.

**Manual development?** Read `.claude/CLAUDE.md` for quick reference patterns.

## 📏 Code Standards

### WordPress Standards

We follow official WordPress coding standards:

- [JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- [PHP Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/)
- [CSS Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/)

### Project-Specific Rules

#### 1. Use WordPress Hooks (CRITICAL)

```javascript
// ✅ CORRECT
import { useBlockProps } from '@wordpress/block-editor';

export default function Edit() {
  const blockProps = useBlockProps();
  return <div {...blockProps}>Content</div>;
}

// ❌ WRONG
export default function Edit() {
  return <div className="my-class">Content</div>;
}
```

#### 2. File Size Limit: 300 Lines

Keep files focused and maintainable:

```bash
# Check file size
wc -l src/blocks/my-block/edit.js

# If > 300 lines, extract components
src/blocks/my-block/
├── edit.js (main component)
├── components/
│   ├── inspector/
│   │   ├── LayoutPanel.js
│   │   └── StylePanel.js
│   └── preview/
│       └── BlockPreview.js
└── utils/
    └── helpers.js
```

See [REFACTORING-GUIDE.md](docs/REFACTORING-GUIDE.md) for patterns.

#### 3. Color Controls Pattern

**ALWAYS use modern WordPress color controls:**

```javascript
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
        settings={[{
          label: __('Text Color', 'designsetgo'),
          colorValue: attributes.textColor,
          onColorChange: (color) => setAttributes({ textColor: color || '' }),
        }]}
        {...colorGradientSettings}
      />
    </InspectorControls>
  );
}
```

#### 4. Internationalization (i18n)

All user-facing strings must be translatable:

```javascript
import { __ } from '@wordpress/i18n';

// ✅ CORRECT
const label = __('Click here', 'designsetgo');

// ❌ WRONG
const label = 'Click here';
```

#### 5. Naming Conventions

**Prefix all custom identifiers with `dsgo-`:**

```javascript
// CSS classes
className="dsgo-accordion"
className="dsgo-accordion__item"

// Data attributes
data-dsgo-animation="fadeIn"

// JavaScript (camelCase)
const dsgoStickyEnabled = true;

// PHP (snake_case)
function designsetgo_register_blocks() {}
```

### Complete Best Practices

See [.claude/CLAUDE.md](.claude/CLAUDE.md) for comprehensive patterns.

## 🧪 Testing

### Test Before Committing

```bash
# 1. Build the project
npm run build

# 2. Check for errors
npm run lint:js
npm run lint:css

# 3. Run unit tests
npm run test:unit

# 4. Manual testing
# - Test in editor (http://localhost:8888/wp-admin)
# - Test on frontend
# - Check browser console for errors
# - Test responsive (375px, 768px, 1200px)
```

### Writing Tests

#### Unit Tests (Jest)

```javascript
// tests/unit/blocks/my-block/edit.test.js
import { render } from '@testing-library/react';
import Edit from '../../../../src/blocks/my-block/edit';

describe('MyBlock Edit', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Edit attributes={{}} setAttributes={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });
});
```

#### E2E Tests (Playwright)

```javascript
// tests/e2e/my-block.spec.js
import { test, expect } from '@playwright/test';

test.describe('My Block', () => {
  test('should insert block', async ({ page, editor }) => {
    await editor.insertBlock({ name: 'designsetgo/my-block' });
    const block = await editor.getBlock({ name: 'designsetgo/my-block' });
    await expect(block).toBeVisible();
  });
});
```

See [TESTING.md](docs/TESTING.md) for complete testing guide.

## 🚀 Submitting Changes

### Before You Submit

**Pre-submission checklist:**

- [ ] Code builds without errors: `npm run build`
- [ ] Linters pass: `npm run lint:js` and `npm run lint:css`
- [ ] Tests pass: `npm run test:unit`
- [ ] Changes tested in editor and frontend
- [ ] No console errors (JavaScript or PHP)
- [ ] Responsive testing completed (mobile/tablet/desktop)
- [ ] Code follows WordPress and project standards
- [ ] Commit messages follow format: `type: description`
- [ ] Documentation updated (if needed)

### Creating a Pull Request

#### 1. Push Your Branch

```bash
git push origin feature/your-feature-name
```

#### 2. Open Pull Request on GitHub

1. Go to https://github.com/jnealey88/designsetgo
2. Click "Pull requests" → "New pull request"
3. Select your fork and branch
4. Click "Create pull request"

#### 3. Fill Out PR Template

**Title:** Clear, descriptive title
```
Add Timeline block with horizontal/vertical layouts
Fix accordion animation timing issue
```

**Description:** Include:
- What changes were made
- Why the changes were needed
- How to test the changes
- Screenshots/videos (if UI changes)
- Related issues (if any)

**Example:**
```markdown
## Description
Adds a new Timeline block that displays events in chronological order.

## Changes
- Created new Timeline block with horizontal/vertical layout options
- Added animation support for timeline items
- Integrated with Block Supports for colors and spacing

## Testing
1. Insert Timeline block
2. Add Timeline Item child blocks
3. Test both horizontal and vertical layouts
4. Verify animations work correctly

## Screenshots
[Screenshot of timeline in editor]
[Screenshot of timeline on frontend]

Closes #123
```

### Review Process

1. **Automated checks** run (linting, tests)
2. **Code review** by maintainers
3. **Feedback/changes** may be requested
4. **Approval and merge** when ready

**Be responsive to feedback!** We're here to help you succeed.

## 💬 Getting Help

### Documentation

- **[Getting Started](docs/GETTING-STARTED.md)** - Detailed setup guide
- **[Architecture](docs/ARCHITECTURE.md)** - Project structure
- **[Best Practices](.claude/CLAUDE.md)** - Development patterns
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues

### Community

- **GitHub Issues** - [Report bugs or request features](https://github.com/jnealey88/designsetgo/issues)
- **GitHub Discussions** - [Ask questions](https://github.com/jnealey88/designsetgo/discussions)

### Common Questions

**Q: I'm new to WordPress block development. Where do I start?**
A: Start with the [Block Editor Handbook](https://developer.wordpress.org/block-editor/), then review our [Getting Started Guide](docs/GETTING-STARTED.md).

**Q: How do I add a new block?**
A: Use the block template in `docs/BLOCK-TEMPLATE-EDIT.js` as a starting point.

**Q: The build is failing. What do I do?**
A: Check [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) or open an issue with the error message.

**Q: Can I work on an issue that's already assigned?**
A: Comment on the issue first to coordinate with the assignee.

**Q: How long does PR review take?**
A: Usually within 3-5 days. Larger changes may take longer.

## 🎯 What to Work On

### Good First Issues

Look for issues labeled `good-first-issue`:
- Documentation improvements
- Small bug fixes
- Adding tests
- Improving error messages

### Feature Requests

Check [ROADMAP.md](docs/ROADMAP.md) for planned features.

### Bugs

Search for `bug` label in issues.

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for everyone.

### Our Standards

**Positive behaviors:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what's best for the community

**Unacceptable behaviors:**
- Harassment or discriminatory language
- Trolling or insulting comments
- Publishing others' private information
- Other conduct inappropriate in a professional setting

### Enforcement

Report issues to the project maintainers. All complaints will be reviewed and investigated.

## 🙏 Thank You!

Thank you for contributing to DesignSetGo! Every contribution, no matter how small, helps make this project better for everyone.

**Questions?** Open an issue or discussion. We're here to help!

---

**License**: GPL-2.0-or-later | **Version**: 1.0.0 | **WordPress**: 6.4+
