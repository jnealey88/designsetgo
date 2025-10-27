# WordPress.org Plugin Submission Checklist

**Plugin**: DesignSetGo
**Version**: 1.0.0
**License**: GPL-2.0-or-later

---

## 📋 Pre-Submission Requirements

### ✅ Required Files

- [ ] **readme.txt** (WordPress.org format - NOT README.md)
  - Must include: Description, Installation, FAQ, Screenshots, Changelog
  - Must follow WordPress readme.txt format exactly
  - Test at: https://wordpress.org/plugins/developers/readme-validator/

- [ ] **LICENSE.txt** (GPL-2.0-or-later full text)
  - Must be in root directory
  - Full GPL license text required

- [ ] **Main plugin file** (designsetgo.php) ✅
  - Plugin headers present
  - Proper security (ABSPATH check)

- [ ] **assets/** folder (for WordPress.org listing)
  - `icon-128x128.png` or `icon-256x256.png` (required)
  - `icon.svg` (recommended, shows in plugin installer)
  - `banner-772x250.png` (high-res display)
  - `banner-1544x500.png` (retina display)
  - `screenshot-1.png`, `screenshot-2.png`, etc. (max 10)

---

## 🔐 Security & Code Quality

### Security Review
- [ ] All input sanitized with WordPress functions
  - `sanitize_text_field()`, `sanitize_email()`, `esc_url()`, etc.

- [ ] All output escaped
  - `esc_html()`, `esc_attr()`, `esc_url()`, `wp_kses_post()`

- [ ] Nonces used for form submissions
  - `wp_create_nonce()` / `wp_verify_nonce()`

- [ ] Capabilities checked before privileged operations
  - `current_user_can('manage_options')`, etc.

- [ ] No hardcoded database table prefixes
  - Use `$wpdb->prefix` instead of `wp_`

- [ ] No SQL injection vulnerabilities
  - Use `$wpdb->prepare()` for all queries

- [ ] No XSS vulnerabilities
  - All user input escaped on output

- [ ] No CSRF vulnerabilities
  - Nonces used for all forms

- [ ] File uploads properly validated
  - Check file types, sizes, and sanitize filenames

### Code Quality
- [ ] No PHP errors, warnings, or notices
  - Test with `WP_DEBUG` enabled

- [ ] No JavaScript console errors

- [ ] All strings internationalized (i18n)
  - Use `__()`, `_e()`, `esc_html__()`, etc.
  - Text domain: `'designsetgo'`

- [ ] Proper WordPress Coding Standards
  - Run: `composer run-script lint` ✅

- [ ] No external dependencies (CDNs)
  - All CSS/JS must be bundled
  - No loading from external URLs

- [ ] Proper enqueuing of scripts/styles
  - Use `wp_enqueue_script()` / `wp_enqueue_style()`
  - No inline scripts/styles without reason

---

## 📦 Plugin Functionality

### WordPress Compatibility
- [ ] Tested with minimum WordPress version (6.0)

- [ ] Tested with latest WordPress version (6.7+)

- [ ] Tested with PHP 7.4, 8.0, 8.1, 8.2, 8.3

- [ ] No conflicts with popular themes
  - Twenty Twenty-Four
  - Twenty Twenty-Five
  - GeneratePress, Astra, etc.

- [ ] No conflicts with popular plugins
  - Yoast SEO, WooCommerce, Contact Form 7, etc.

### Block Editor Integration
- [ ] All blocks appear in block inserter

- [ ] Block previews work (example attribute)

- [ ] Blocks work in Site Editor (FSE)

- [ ] Block patterns appear in pattern library

- [ ] No block validation errors

- [ ] Blocks save and load correctly

- [ ] Responsive preview works (Desktop/Tablet/Mobile)

- [ ] Global styles apply correctly

### Performance
- [ ] Plugin loads in < 200ms

- [ ] Editor bundle < 150 KB

- [ ] Frontend bundle < 20 KB

- [ ] CSS bundle < 30 KB

- [ ] No memory leaks

- [ ] No excessive database queries

---

## 📝 Documentation

### readme.txt Requirements
- [ ] **Plugin Name** - Descriptive, < 50 characters

- [ ] **Contributors** - WordPress.org usernames

- [ ] **Tags** - Max 12 tags, relevant keywords

- [ ] **Requires at least** - Minimum WordPress version (6.0)

- [ ] **Tested up to** - Latest WordPress version

- [ ] **Requires PHP** - Minimum PHP version (7.4)

- [ ] **Stable tag** - Current version (1.0.0)

- [ ] **License** - GPL-2.0-or-later

- [ ] **Short Description** - < 150 characters, no markup

- [ ] **Long Description** - Features, use cases, benefits

- [ ] **Installation** - Step-by-step instructions

- [ ] **FAQ** - At least 3-5 common questions

- [ ] **Screenshots** - Descriptions for each screenshot

- [ ] **Changelog** - Version history (1.0.0 initial release)

- [ ] **Upgrade Notice** - For version upgrades

### In-Plugin Documentation
- [ ] Contextual help in block inspector

- [ ] Tooltips for complex settings

- [ ] Help text for all controls

- [ ] Link to documentation in plugin settings

---

## 🎨 Assets for WordPress.org

### Icon (Required)
- [ ] **icon-128x128.png** - 128x128px PNG
- [ ] **icon-256x256.png** - 256x256px PNG (retina)
- [ ] **icon.svg** - SVG version (recommended)

**Design Requirements:**
- Square format (1:1 ratio)
- Transparent or solid background
- High contrast for visibility
- Recognizable at small sizes

### Banner (Optional but Recommended)
- [ ] **banner-772x250.png** - 772x250px PNG
- [ ] **banner-1544x500.png** - 1544x500px PNG (retina)

**Design Requirements:**
- Professional appearance
- Plugin branding
- No text overload
- High-res images only

### Screenshots (Highly Recommended)
- [ ] **screenshot-1.png** - Block inserter view
- [ ] **screenshot-2.png** - Block in editor
- [ ] **screenshot-3.png** - Inspector controls
- [ ] **screenshot-4.png** - Frontend display
- [ ] **screenshot-5.png** - Additional features

**Requirements:**
- PNG or JPG format
- Max 1MB per file
- Minimum 772px wide
- Clear, high-quality captures
- Order matters (1, 2, 3...)

---

## 🚀 WordPress.org Policies

### Prohibited Content
- [ ] No phone-home code (tracking, analytics)
  - Analytics require opt-in consent

- [ ] No obfuscated/encrypted code
  - All code must be readable

- [ ] No affiliate links or upsells
  - Free version must be fully functional

- [ ] No trademark violations
  - Don't use "WordPress" or "WP" in plugin slug

- [ ] No advertising within WordPress admin
  - No admin notices for upgrades (free version)

### Allowed Content
- [ ] GPL-compatible license ✅

- [ ] Third-party libraries (if GPL-compatible)
  - List all dependencies and licenses

- [ ] External service calls (if disclosed)
  - Must be documented in readme.txt

- [ ] Freemium model (if properly implemented)
  - Free version must be functional without paid upgrades

---

## 🧪 Testing Checklist

### Environment Testing
- [ ] Fresh WordPress install (latest version)

- [ ] WordPress multisite

- [ ] PHP 7.4, 8.0, 8.1, 8.2, 8.3

- [ ] MySQL 5.7, 8.0

- [ ] MariaDB 10.3, 10.6

- [ ] Various web servers (Apache, Nginx)

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Functionality Testing
- [ ] Install plugin
- [ ] Activate plugin
- [ ] Create blocks
- [ ] Edit blocks
- [ ] Save post
- [ ] View frontend
- [ ] Deactivate plugin
- [ ] Reactivate plugin
- [ ] Uninstall plugin (cleanup test)

### Accessibility Testing
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation
- [ ] Screen reader compatibility (VoiceOver, NVDA)
- [ ] Color contrast 4.5:1 minimum
- [ ] Focus indicators visible
- [ ] ARIA labels present

---

## 📤 Submission Process

### Step 1: Prepare Plugin Package
- [ ] Remove development files
  - `node_modules/`, `.git/`, `.github/`
  - `tests/`, `playwright-report/`
  - Development docs (keep user-facing docs)

- [ ] Keep only production files
  - `designsetgo.php` (main file)
  - `/build/` (compiled assets)
  - `/includes/` (PHP classes)
  - `/languages/` (translations)
  - `readme.txt` (required)
  - `LICENSE.txt` (required)
  - `/assets/` (WordPress.org assets - separate upload)

- [ ] Build production version
  ```bash
  npm run build
  npm run plugin-zip
  ```

- [ ] Test the ZIP file
  - Extract and install on fresh WordPress
  - Verify all features work

### Step 2: Create WordPress.org Account
- [ ] Sign up at https://login.wordpress.org/register

- [ ] Verify email address

- [ ] Complete profile

### Step 3: Submit Plugin
- [ ] Go to https://wordpress.org/plugins/developers/add/

- [ ] Upload plugin ZIP file

- [ ] Wait for automated security scan (few minutes)

- [ ] Review will take 3-10 business days

### Step 4: Respond to Review
- [ ] Address any feedback from reviewers

- [ ] Fix any security or guideline violations

- [ ] Resubmit if requested

### Step 5: SVN Setup (After Approval)
- [ ] Receive SVN repository URL via email

- [ ] Set up SVN client

- [ ] Commit plugin files to `/trunk/`

- [ ] Commit assets to `/assets/`

- [ ] Create `/tags/1.0.0/` for release

- [ ] Wait for plugin to appear (few hours)

---

## 📊 Post-Submission

### After Approval
- [ ] Set up support forum monitoring

- [ ] Respond to user questions (< 48 hours)

- [ ] Monitor reviews and ratings

- [ ] Track active installations

- [ ] Plan for updates and bug fixes

### Version Updates
- [ ] Update version in `designsetgo.php`
- [ ] Update version in `package.json`
- [ ] Update `readme.txt` changelog
- [ ] Build production version
- [ ] Commit to SVN `/trunk/`
- [ ] Create new `/tags/X.X.X/` tag
- [ ] Update "Tested up to" regularly

---

## 🔧 Common Rejection Reasons

### Security Issues
- ❌ Unescaped output
- ❌ Unsanitized input
- ❌ Missing nonces
- ❌ Direct file access (no ABSPATH check)
- ❌ SQL injection vulnerabilities

### Code Quality Issues
- ❌ PHP errors/warnings
- ❌ JavaScript console errors
- ❌ Not internationalized
- ❌ Loading external resources (CDNs)
- ❌ Using reserved prefixes (wp_, _wp)

### Guideline Violations
- ❌ Obfuscated code
- ❌ Phone-home without consent
- ❌ Trademark violations
- ❌ Misleading descriptions
- ❌ Required paid upgrade for basic features

---

## 📚 Resources

### Official Documentation
- [Plugin Handbook](https://developer.wordpress.org/plugins/)
- [Plugin Guidelines](https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/)
- [readme.txt Guide](https://developer.wordpress.org/plugins/wordpress-org/how-your-readme-txt-works/)
- [Plugin Assets Guide](https://developer.wordpress.org/plugins/wordpress-org/plugin-assets/)

### Tools
- [readme.txt Validator](https://wordpress.org/plugins/developers/readme-validator/)
- [Plugin Check Plugin](https://wordpress.org/plugins/plugin-check/)
- [Plugin Review Tools](https://wordpress.org/plugins/developers/tools/)

### Community
- [WordPress Slack](https://make.wordpress.org/chat/) - #pluginreview channel
- [Make WordPress Plugins](https://make.wordpress.org/plugins/)
- [Plugin Review Team](https://make.wordpress.org/plugins/handbook/)

---

## ✅ Final Pre-Submission Checklist

Before clicking "Submit":

- [ ] All security checks pass
- [ ] All code quality checks pass
- [ ] Plugin tested on fresh WordPress install
- [ ] readme.txt validated successfully
- [ ] All assets created and optimized
- [ ] LICENSE.txt included
- [ ] No development files in package
- [ ] Plugin ZIP tested and works
- [ ] WordPress.org account created
- [ ] Ready to respond to review feedback

---

**Estimated Timeline:**
- Preparation: 2-5 days
- Automated scan: 5-10 minutes
- Human review: 3-10 business days
- Address feedback (if any): 1-3 days
- SVN setup & publish: 1 day

**Total: ~1-2 weeks from submission to published**

Good luck with your submission! 🚀
