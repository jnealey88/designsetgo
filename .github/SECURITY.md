# Security Policy

## Supported Versions

Currently supported versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please DO NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via:

1. **Email**: justin@nealey.pro (recommended)
2. **GitHub Security Advisory**: Use the "Security" tab → "Report a vulnerability"

### What to Include

Please include the following information:

- Type of vulnerability
- Full paths of affected source files
- Location of the affected code (tag/branch/commit)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Varies by severity (critical issues prioritized)

### Disclosure Policy

- We follow **coordinated disclosure**
- We'll work with you to understand and fix the issue
- We request you give us reasonable time to fix before public disclosure
- We'll credit you in release notes (unless you prefer anonymity)

## Security Best Practices for Contributors

When contributing to DesignSetGo:

1. **Sanitize Input**: Use WordPress sanitization functions
   - `sanitize_text_field()`, `sanitize_textarea_field()`
   - `sanitize_url()`, `esc_url()`
   - `wp_kses_post()`, `wp_kses_allowed_html()`

2. **Escape Output**: Use WordPress escaping functions
   - `esc_html()`, `esc_attr()`
   - `esc_url()`, `esc_js()`

3. **Validate Nonces**: For all form submissions and AJAX requests
   - `wp_verify_nonce()`, `check_ajax_referer()`

4. **Check Capabilities**: Use `current_user_can()` for permissions

5. **Prepared Statements**: Use `$wpdb->prepare()` for database queries

6. **No `eval()`**: Never use `eval()` or similar constructs

7. **Validate File Uploads**: Check file types, sizes, and MIME types

## Known Security Considerations

### Plugin Scope

This plugin provides:
- Custom WordPress blocks (editor-only)
- Frontend styling and interactions
- No database modifications beyond post content
- No external API calls
- No file uploads or user data collection

### WordPress Permissions

All block features respect WordPress's built-in capability system:
- Block editor access requires `edit_posts` capability
- No custom capabilities added
- No privilege escalation vectors

## Third-Party Dependencies

We monitor dependencies for security issues via:
- Dependabot alerts
- npm audit
- composer audit (if applicable)

Dependencies are updated promptly when security issues are discovered.

## Questions?

For general security questions (not vulnerabilities), please open a public issue with the `security-question` label.
