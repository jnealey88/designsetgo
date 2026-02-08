# REST API Reference

**Namespace**: `designsetgo/v1`
**Base URL**: `/wp-json/designsetgo/v1/`

All endpoints require authentication unless noted otherwise. Admin endpoints require the `manage_options` capability. Nonce-protected write endpoints expect an `X-WP-Nonce` header with a valid `wp_rest` nonce.

---

## Settings

Manages plugin-wide configuration.

**Source**: `includes/admin/class-settings.php`

### GET `/settings`

Returns all current settings merged with defaults.

| Auth | Capability |
|------|------------|
| Required | `manage_options` |

**Response** — `200 OK`

```json
{
  "enabled_blocks": [],
  "enabled_extensions": [],
  "excluded_blocks": [],
  "performance": { "conditional_loading": true, "cache_duration": 3600 },
  "forms": { "enable_honeypot": true, "enable_rate_limiting": true, "enable_email_logging": false, "retention_days": 30 },
  "animations": { "enable_animations": true, "default_duration": 600, "default_easing": "ease-in-out", "respect_prefers_reduced_motion": true },
  "security": { "log_ip_addresses": true, "log_user_agents": true, "log_referrers": false },
  "integrations": { "google_maps_api_key": "", "turnstile_site_key": "", "turnstile_secret_key": "" },
  "sticky_header": { "enable": true, "custom_selector": "", "z_index": 100, "..." : "..." },
  "draft_mode": { "enable": true, "show_page_list_actions": true, "..." : "..." },
  "revisions": { "enable_visual_comparison": true, "default_to_visual": true },
  "llms_txt": { "enable": false, "post_types": ["page", "post"] }
}
```

### POST `/settings`

Updates plugin settings. Partial updates are supported — only supplied keys are changed.

| Auth | Capability | Nonce |
|------|------------|-------|
| Required | `manage_options` | `X-WP-Nonce` |

**Body Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `enabled_blocks` | `array<string>` | Block names to enable. Empty = all enabled. |
| `enabled_extensions` | `array<string>` | Extension names to enable. Empty = all enabled. |
| `excluded_blocks` | `array<string>` | Block name patterns excluded from abilities API. |
| `performance` | `object` | `{ conditional_loading: bool, cache_duration: int }` |
| `forms` | `object` | `{ enable_honeypot: bool, enable_rate_limiting: bool, enable_email_logging: bool, retention_days: int }` |
| `animations` | `object` | `{ enable_animations: bool, default_duration: int, default_easing: string, respect_prefers_reduced_motion: bool }` |
| `security` | `object` | `{ log_ip_addresses: bool, log_user_agents: bool, log_referrers: bool }` |
| `integrations` | `object` | `{ google_maps_api_key: string, turnstile_site_key: string, turnstile_secret_key: string }` |
| `sticky_header` | `object` | Sticky header configuration (see `get_defaults()` for full schema). |
| `draft_mode` | `object` | `{ enable: bool, show_page_list_actions: bool, show_page_list_column: bool, show_frontend_preview: bool, auto_save_enabled: bool, auto_save_interval: int }` |
| `revisions` | `object` | `{ enable_visual_comparison: bool, default_to_visual: bool }` |
| `llms_txt` | `object` | `{ enable: bool, post_types: array<string> }` |

**Response** — `200 OK`

```json
{ "success": true, "settings": { "..." : "..." } }
```

### GET `/blocks`

Returns available blocks organized by category.

| Auth | Capability |
|------|------------|
| Required | `manage_options` |

**Response** — `200 OK`

```json
{
  "containers": { "label": "Container Blocks", "blocks": [{ "name": "designsetgo/grid", "title": "Grid Container", "description": "...", "performance": "low" }] },
  "ui": { "..." : "..." },
  "interactive": { "..." : "..." },
  "widgets": { "..." : "..." },
  "forms": { "..." : "..." }
}
```

### GET `/extensions`

Returns available extensions.

| Auth | Capability |
|------|------------|
| Required | `manage_options` |

**Response** — `200 OK`

```json
[
  { "name": "animation", "title": "Animation", "description": "Base animation framework" },
  "..."
]
```

### GET `/stats`

Returns plugin statistics.

| Auth | Capability |
|------|------------|
| Required | `manage_options` |

**Response** — `200 OK`

```json
{ "total_blocks": 48, "enabled_blocks": 48, "form_submissions": 0 }
```

---

## Global Styles

Manages theme.json integration and style overrides.

**Source**: `includes/admin/class-global-styles.php`

### GET `/global-styles`

Returns saved global style overrides.

| Auth | Capability |
|------|------------|
| Required | `manage_options` |

**Response** — `200 OK` — Saved styles object (or empty object `{}`).

### POST `/global-styles`

Updates global style overrides.

| Auth | Capability | Nonce |
|------|------------|-------|
| Required | `manage_options` | `X-WP-Nonce` |

**Body Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `spacing` | `object` | Spacing style overrides. |
| `typography` | `object` | Typography style overrides. |
| `color` | `object` | Color style overrides. |
| `border` | `object` | Border style overrides. |

**Response** — `200 OK`

```json
{ "success": true }
```

---

## Draft Mode

Create, publish, and discard draft copies of published pages.

**Source**: `includes/admin/class-draft-mode-rest.php`

### POST `/draft-mode/create`

Creates a draft copy of a published page.

| Auth | Capability |
|------|------------|
| Required | `publish_pages` + `edit_post` on target |

**Body Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `post_id` | `integer` | Yes | ID of the published page to copy. |
| `content` | `string` | No | Content override (captures unsaved edits). |
| `title` | `string` | No | Title override. |
| `excerpt` | `string` | No | Excerpt override. |

**Response** — `200 OK`

```json
{ "success": true, "draft_id": 123, "edit_url": "...", "message": "Draft created successfully.", "draft_title": "...", "original_id": 45 }
```

### POST `/draft-mode/{id}/publish`

Merges a draft back into the original published page.

| Auth | Capability |
|------|------------|
| Required | `publish_pages` + `delete_post` on draft + `publish_post` on original |

**URL Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `integer` | Draft post ID. |

**Response** — `200 OK`

```json
{ "success": true, "original_id": 45, "edit_url": "...", "view_url": "...", "message": "Changes published successfully." }
```

### DELETE `/draft-mode/{id}`

Discards a draft.

| Auth | Capability |
|------|------------|
| Required | `publish_pages` + `delete_post` on draft |

**URL Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `integer` | Draft post ID. |

**Response** — `200 OK`

```json
{ "success": true, "original_id": 45, "message": "Draft discarded." }
```

### GET `/draft-mode/status/{post_id}`

Returns draft mode status for a post.

| Auth | Capability |
|------|------------|
| Required | `edit_pages` + `edit_post` on target |

**URL Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `post_id` | `integer` | Post ID to check. |

**Response** — `200 OK`

```json
{ "settings": { "enabled": true }, "exists": true, "is_draft": false, "has_draft": true, "draft_id": 123, "original_id": 45, "can_create": true }
```

---

## Revisions

Visual revision comparison and restore.

**Source**: `includes/admin/class-revision-rest-api.php`

### GET `/revisions/{post_id}`

Lists revisions for a post.

| Auth | Capability |
|------|------------|
| Required | `edit_post` on target |

**URL Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `post_id` | `integer` | Post ID. |

**Response** — `200 OK`

```json
{
  "post_id": 45,
  "post_type": "page",
  "revisions": [
    { "id": 50, "date": "2026-02-07 12:00:00", "author": { "id": 1, "name": "Admin", "avatar": "..." }, "is_autosave": false, "is_current": true }
  ]
}
```

### GET `/revisions/render/{revision_id}`

Renders a revision as HTML.

| Auth | Capability |
|------|------------|
| Required | `edit_post` on parent post |

**URL Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `revision_id` | `integer` | Revision ID. |

**Response** — `200 OK` — Rendered HTML content.

### GET `/revisions/diff/{from_id}/{to_id}`

Returns a block-level diff between two revisions.

| Auth | Capability |
|------|------------|
| Required | `edit_post` on parent post (both revisions must share the same parent) |

**URL Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `from_id` | `integer` | Source revision ID. |
| `to_id` | `integer` | Target revision ID. |

**Response** — `200 OK`

```json
{ "from_id": 48, "to_id": 50, "changes": [...], "summary": { "total": 3 } }
```

### POST `/revisions/restore/{revision_id}`

Restores a post to a previous revision.

| Auth | Capability |
|------|------------|
| Required | `edit_post` on parent post |

**URL Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `revision_id` | `integer` | Revision to restore. |

**Response** — `200 OK`

```json
{ "success": true, "post_id": 45, "edit_url": "..." }
```

---

## Forms

Public form submission endpoint.

**Source**: `includes/blocks/class-form-handler.php`

### POST `/form/submit`

Handles form submissions. This is a **public endpoint** — no authentication required. Protected by honeypot, time-based checks, rate limiting, optional Turnstile, and field validation.

| Auth | Capability |
|------|------------|
| None | Public |

**Body Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `formId` | `string` | Yes | Form identifier. |
| `fields` | `array` | Yes | Form field values. |
| `honeypot` | `string` | No | Honeypot field (must be empty). |
| `timestamp` | `string` | No | Submission timestamp for bot detection. |
| `enable_email` | `boolean` | No | Whether to send email notification. |
| `email_to` | `string` | No | Recipient email. |
| `email_from_email` | `string` | No | Sender email. |
| `email_from_name` | `string` | No | Sender name. |
| `email_subject` | `string` | No | Email subject line. |
| `turnstile_token` | `string` | No | Cloudflare Turnstile verification token. |

**Response** — `200 OK`

```json
{ "success": true, "message": "Form submitted successfully." }
```

**Error Responses**

| Code | Status | Cause |
|------|--------|-------|
| `spam_detected` | 403 | Honeypot or time check failed. |
| `rate_limit_exceeded` | 429 | Too many submissions from this IP. |
| `turnstile_failed` | 403 | Cloudflare verification failed. |
| `validation_error` | 400 | Field validation failed. |

---

## GDPR Compliance

Data export and deletion for form submissions.

**Source**: `includes/admin/class-gdpr-compliance.php`

### POST `/gdpr/export`

Exports all form submission data for an email address.

| Auth | Capability |
|------|------------|
| Required | `manage_options` |

**Body Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | `string` | Yes | Email address to export data for. Must be a valid email. |

**Response** — `200 OK`

```json
{ "items_found": 5, "data": [...] }
```

### DELETE `/gdpr/delete`

Deletes all form submission data for an email address.

| Auth | Capability |
|------|------------|
| Required | `manage_options` |

**Body Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | `string` | Yes | Email address to delete data for. Must be a valid email. |

**Response** — `200 OK`

```json
{ "items_removed": 5, "items_retained": 0, "done": true }
```

---

## llms.txt

Manages the llms.txt AI documentation system.

**Source**: `includes/llms-txt/class-rest-controller.php`

### GET `/llms-txt/post-types`

Returns public post types available for llms.txt generation.

| Auth | Capability |
|------|------------|
| Required | `manage_options` |

**Response** — `200 OK`

```json
[
  { "name": "page", "label": "Pages" },
  { "name": "post", "label": "Posts" }
]
```

### GET `/llms-txt/status`

Returns current llms.txt feature status and conflict info.

| Auth | Capability |
|------|------------|
| Required | `manage_options` |

**Response** — `200 OK`

```json
{ "enabled": false, "url": "https://example.com/llms.txt", "has_conflict": false, "conflict_dismissed": false, "conflict_info": null }
```

### GET `/llms-txt/markdown/{post_id}`

Returns a published post converted to markdown.

| Auth | Capability |
|------|------------|
| None | Public (feature must be enabled; post must be published and not excluded) |

**URL Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `post_id` | `integer` | Post ID to convert. Must be > 0. |

**Response** — `200 OK`

```json
{ "id": 45, "title": "About Us", "url": "https://example.com/about/", "updated": "2026-02-07T12:00:00+00:00", "markdown": "# About Us\n..." }
```

**Error Responses**

| Code | Status | Cause |
|------|--------|-------|
| `not_found` | 404 | Post does not exist. |
| `not_published` | 404 | Post is not published. |
| `not_public` | 404 | Post is password-protected or not publicly viewable. |
| `excluded` | 403 | Post excluded via `_designsetgo_exclude_llms` meta. |
| `feature_disabled` | 403 | llms.txt feature is disabled in settings. |
| `post_type_disabled` | 403 | Post type not enabled for llms.txt. |

### POST `/llms-txt/flush-cache`

Clears all cached llms.txt and markdown data.

| Auth | Capability |
|------|------------|
| Required | `manage_options` |

**Response** — `200 OK`

```json
{ "success": true, "message": "llms.txt cache has been cleared." }
```

### POST `/llms-txt/generate-files`

Generates markdown files for all eligible posts.

| Auth | Capability |
|------|------------|
| Required | `manage_options` |

**Response** — `200 OK`

```json
{ "success": true, "generated_count": 12, "errors": [], "message": "Generated 12 markdown files." }
```

### POST `/llms-txt/resolve-conflict`

Renames an existing physical llms.txt file to resolve a conflict.

| Auth | Capability |
|------|------------|
| Required | `manage_options` |

**Response** — `200 OK`

```json
{ "success": true, "message": "The existing llms.txt file has been renamed. DesignSetGo will now serve the dynamic version." }
```

### POST `/llms-txt/dismiss-conflict`

Dismisses the conflict notice without resolving.

| Auth | Capability |
|------|------------|
| Required | `manage_options` |

**Response** — `200 OK`

```json
{ "success": true, "message": "Conflict notice dismissed." }
```

---

## Endpoint Summary

| Method | Route | Auth | Source |
|--------|-------|------|--------|
| GET | `/settings` | `manage_options` | `class-settings.php` |
| POST | `/settings` | `manage_options` + nonce | `class-settings.php` |
| GET | `/blocks` | `manage_options` | `class-settings.php` |
| GET | `/extensions` | `manage_options` | `class-settings.php` |
| GET | `/stats` | `manage_options` | `class-settings.php` |
| GET | `/global-styles` | `manage_options` | `class-global-styles.php` |
| POST | `/global-styles` | `manage_options` + nonce | `class-global-styles.php` |
| POST | `/draft-mode/create` | `publish_pages` | `class-draft-mode-rest.php` |
| POST | `/draft-mode/{id}/publish` | `publish_pages` | `class-draft-mode-rest.php` |
| DELETE | `/draft-mode/{id}` | `publish_pages` | `class-draft-mode-rest.php` |
| GET | `/draft-mode/status/{post_id}` | `edit_pages` | `class-draft-mode-rest.php` |
| GET | `/revisions/{post_id}` | `edit_post` | `class-revision-rest-api.php` |
| GET | `/revisions/render/{revision_id}` | `edit_post` | `class-revision-rest-api.php` |
| GET | `/revisions/diff/{from_id}/{to_id}` | `edit_post` | `class-revision-rest-api.php` |
| POST | `/revisions/restore/{revision_id}` | `edit_post` | `class-revision-rest-api.php` |
| POST | `/form/submit` | Public | `class-form-handler.php` |
| POST | `/gdpr/export` | `manage_options` | `class-gdpr-compliance.php` |
| DELETE | `/gdpr/delete` | `manage_options` | `class-gdpr-compliance.php` |
| GET | `/llms-txt/post-types` | `manage_options` | `class-rest-controller.php` |
| GET | `/llms-txt/status` | `manage_options` | `class-rest-controller.php` |
| GET | `/llms-txt/markdown/{post_id}` | Public | `class-rest-controller.php` |
| POST | `/llms-txt/flush-cache` | `manage_options` | `class-rest-controller.php` |
| POST | `/llms-txt/generate-files` | `manage_options` | `class-rest-controller.php` |
| POST | `/llms-txt/resolve-conflict` | `manage_options` | `class-rest-controller.php` |
| POST | `/llms-txt/dismiss-conflict` | `manage_options` | `class-rest-controller.php` |
