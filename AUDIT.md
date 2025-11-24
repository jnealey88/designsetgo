# DesignSetGo Plugin Audit (code quality, security, performance, WordPress best practices)

## High/critical
- Public REST form submission lacks nonce verification (`includes/blocks/class-form-handler.php:114-123,502-520`), so third parties can POST cross-site and bypass CSRF. Add nonce check and optionally CAPTCHA/Turnstile.
- Form email notifications are effectively disabled: `enable_email` is sanitized to boolean but later compared to string `"true"` (`includes/blocks/class-form-handler.php:531-536`). Switch to a boolean check so notifications work.
- Form submissions CPT uses `capability_type => 'post'` with `map_meta_cap`, letting editors/authors read private submissions containing PII (emails/IPs) (`includes/blocks/class-form-submissions.php:49-66`). Restrict to an admin-level/custom cap.
- Uninstall cleanup uses `dsg` prefixes while CPT/transients use `dsgo` (`uninstall.php:19-49`), leaving submissions/meta/transients behind and violating privacy expectations. Align prefixes and purge correctly.
- Data retention and anti-abuse toggles are stored but not enforced: `retention_days`, `enable_honeypot`, and `enable_rate_limiting` (settings) are unused in `Form_Handler`, and no scheduled purge exists. Implement honoring toggles and a cron to delete old submissions.
- Rate limiting/abuse logging trusts spoofable headers (`HTTP_X_FORWARDED_FOR`, etc.) without a trusted proxy list (`includes/blocks/class-form-handler.php:460-485`), allowing rate-limit bypass. Prefer `REMOTE_ADDR` or a validated proxy allowlist.

## Medium
- CSRF for admin REST: settings/global-styles/GDPR routes require nonce and `manage_options`, which is good, but the responses don’t set `permission_callback` errors to proper `WP_Error` consistently (some return `false`). Standardize on `WP_Error` for clearer failures and logging.
- Custom CSS sanitizer removes many vectors but still allows `url()` with http(s) resources; consider allowlisting schemes or stripping remote URLs if user-provided (`includes/class-custom-css-renderer.php:240-277`).
- Form emails allow arbitrary `email_body`/subject from the request; while header injection is mitigated, consider length limits and allowlisted HTML or plain text only.

## Performance
- Critical CSS inlining dequeues matching styles, but failure to find build files just logs and skips, potentially causing broken styles in production if build missing (`includes/class-assets.php:264-326`). Consider a safer fallback (enqueue without inline) when assets are absent.
- Block detection cache uses object cache and transient invalidation; however, `has_designsetgo_blocks` returns false on non-singular requests, so global assets never load for archives where blocks may appear. Evaluate front-end UX there.

## WordPress best practices
- Form REST endpoint is public by design; document explicitly in readme and admin UI that site owners should enable referrer restrictions/anti-spam.
- Submissions CPT should set `show_in_rest` to false (default) and potentially mark supports to none; ensure export/eraser integrations are covered (currently good).
- Add capability mapping for submission eraser/export to match tightened caps once applied.
- Add unit/integration tests around REST permissions, nonce checks, rate limiting, and retention purge logic.

## Suggested fixes (prioritized)
1) Enforce REST nonce on form submissions; add Turnstile/reCAPTCHA option.  
2) Fix `enable_email` boolean handling; add basic email body length/HTML restrictions.  
3) Restrict CPT caps to admin-level/custom cap and update eraser/export to use it.  
4) Align uninstall prefixes and add retention cron respecting `retention_days`.  
5) Harden IP resolution (trusted proxies or `REMOTE_ADDR`), and respect `enable_rate_limiting`/`enable_honeypot` flags.  
6) Tighten CSS sanitizer or disallow remote `url()` in user CSS.
