# Draft Mode API

**Since**: 1.4.0

Draft Mode allows users to create working copies of published pages, edit them safely without affecting the live site, and publish changes when ready.

## Overview

When a page is published in WordPress, any edits are immediately live. Draft Mode solves this by:

1. **Automatic draft creation**: When you start editing a published page, a draft is created automatically
2. **Seamless editing**: Your changes are captured and transferred to the draft
3. **Safe editing**: All subsequent saves go to the draft, not the live page
4. **One-click publishing**: Merge the draft back into the original when ready
5. **URL preservation**: The original URL and SEO value are preserved

## User Experience

### Editing a Published Page

1. Navigate to any published page in the block editor
2. Make any edit (type text, add a block, change a setting)
3. A draft is **automatically created** with your changes
4. You're redirected to the draft editor to continue working
5. A yellow header bar shows you're in "Draft Mode"

### Publishing Changes

When your draft is ready:
1. Click **"Publish Changes"** in the header bar
2. Confirm the action
3. Your changes are merged into the live page
4. The draft is deleted
5. You're redirected to the published page

### Discarding Changes

To abandon your draft:
1. Click **"Discard Draft"** in the header bar
2. Confirm the action
3. The draft is deleted
4. The live page remains unchanged

## REST API Endpoints

**Namespace**: `designsetgo/v1`
**Base Path**: `/draft-mode/`

### Authentication

All endpoints require authentication with `publish_posts` capability (Authors, Editors, Administrators).

**Methods**:
- Basic Authentication: `Authorization: Basic base64(username:password)`
- Application Passwords (WordPress 5.6+)
- Cookie + Nonce: `X-WP-Nonce` header (for admin JavaScript)

---

### Get Draft Status

Check the draft status of any page.

**Endpoint**: `GET /draft-mode/status/{post_id}`

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `post_id` | integer | Yes | The page ID to check |

**Response** (page with no draft):
```json
{
  "exists": true,
  "is_draft": false,
  "has_draft": false,
  "draft_id": null,
  "original_id": null,
  "can_create": true
}
```

**Response** (page has a pending draft):
```json
{
  "exists": true,
  "is_draft": false,
  "has_draft": true,
  "draft_id": 456,
  "draft_edit_url": "http://example.com/wp-admin/post.php?post=456&action=edit",
  "original_id": 123,
  "draft_created": "2024-01-15 10:30:00"
}
```

**Response** (this IS a draft):
```json
{
  "exists": true,
  "is_draft": true,
  "has_draft": false,
  "draft_id": 456,
  "original_id": 123,
  "original_title": "My Page",
  "original_edit_url": "http://example.com/wp-admin/post.php?post=123&action=edit",
  "original_view_url": "http://example.com/my-page/",
  "draft_created": "2024-01-15 10:30:00"
}
```

**Example**:
```bash
curl -X GET "https://example.com/wp-json/designsetgo/v1/draft-mode/status/123" \
  -H "Authorization: Basic $(echo -n 'user:pass' | base64)"
```

---

### Create Draft

Create a draft copy of a published page.

**Endpoint**: `POST /draft-mode/create`

**Request Body**:
```json
{
  "post_id": 123
}
```

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `post_id` | integer | Yes | The published page ID |

**Response** (success):
```json
{
  "success": true,
  "draft_id": 456,
  "edit_url": "http://example.com/wp-admin/post.php?post=456&action=edit",
  "message": "Draft created successfully.",
  "draft_title": "My Page",
  "original_id": 123
}
```

**Errors**:
| Code | Message |
|------|---------|
| `invalid_post` | Post not found |
| `invalid_post_type` | Draft mode is only available for pages |
| `invalid_status` | Only published pages can have a draft version |
| `draft_exists` | A draft version already exists for this page |

**Example**:
```bash
curl -X POST "https://example.com/wp-json/designsetgo/v1/draft-mode/create" \
  -H "Authorization: Basic $(echo -n 'user:pass' | base64)" \
  -H "Content-Type: application/json" \
  -d '{"post_id": 123}'
```

---

### Publish Draft

Merge draft content into the original published page.

**Endpoint**: `POST /draft-mode/{draft_id}/publish`

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `draft_id` | integer | Yes | The draft post ID |

**Response** (success):
```json
{
  "success": true,
  "original_id": 123,
  "edit_url": "http://example.com/wp-admin/post.php?post=123&action=edit",
  "view_url": "http://example.com/my-page/",
  "message": "Changes published successfully."
}
```

**What gets merged**:
- Post title
- Post content (all blocks)
- Post excerpt
- All post meta (except internal WordPress meta)
- Featured image

**Errors**:
| Code | Message |
|------|---------|
| `invalid_draft` | Draft not found |
| `not_a_draft` | This post is not a draft version |
| `original_not_found` | The original page no longer exists |

**Example**:
```bash
curl -X POST "https://example.com/wp-json/designsetgo/v1/draft-mode/456/publish" \
  -H "Authorization: Basic $(echo -n 'user:pass' | base64)"
```

---

### Discard Draft

Delete a draft without publishing changes.

**Endpoint**: `DELETE /draft-mode/{draft_id}`

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `draft_id` | integer | Yes | The draft post ID |

**Response** (success):
```json
{
  "success": true,
  "original_id": 123,
  "message": "Draft discarded."
}
```

**Errors**:
| Code | Message |
|------|---------|
| `invalid_draft` | Draft not found |
| `not_a_draft` | This post is not a draft version |

**Example**:
```bash
curl -X DELETE "https://example.com/wp-json/designsetgo/v1/draft-mode/456" \
  -H "Authorization: Basic $(echo -n 'user:pass' | base64)"
```

---

## Post Meta

Draft Mode uses post meta to track relationships:

| Meta Key | Location | Description |
|----------|----------|-------------|
| `_dsgo_draft_of` | Draft post | ID of the original published page |
| `_dsgo_has_draft` | Original post | ID of the pending draft |
| `_dsgo_draft_created` | Draft post | Creation timestamp |

---

## PHP Hooks

### Actions

```php
// Fired after a draft is created
do_action( 'designsetgo_draft_created', int $draft_id, int $original_id );

// Fired after a draft is published (merged)
do_action( 'designsetgo_draft_published', int $original_id, int $draft_id );

// Fired after a draft is discarded
do_action( 'designsetgo_draft_discarded', int $draft_id, int $original_id );
```

### Filters

```php
// Enable/disable draft mode globally
apply_filters( 'designsetgo_draft_mode_enabled', bool $enabled );

// Control which meta keys are excluded when creating a draft
apply_filters( 'designsetgo_draft_excluded_meta_keys', array $keys, int $source_id );

// Control which meta keys are preserved on original when publishing
apply_filters( 'designsetgo_draft_preserve_meta_keys', array $keys, int $original_id );
```

---

## JavaScript API

For use within the WordPress admin (with proper nonce):

```javascript
import apiFetch from '@wordpress/api-fetch';

// Get status
const status = await apiFetch({
  path: `/designsetgo/v1/draft-mode/status/${postId}`,
});

// Create draft
const result = await apiFetch({
  path: '/designsetgo/v1/draft-mode/create',
  method: 'POST',
  data: { post_id: postId },
});

// Publish draft
await apiFetch({
  path: `/designsetgo/v1/draft-mode/${draftId}/publish`,
  method: 'POST',
});

// Discard draft
await apiFetch({
  path: `/designsetgo/v1/draft-mode/${draftId}`,
  method: 'DELETE',
});
```

---

## Agent/Automation Workflow

Example workflow for an automated system:

```bash
# 1. Check if page has a draft
STATUS=$(curl -s -X GET "https://example.com/wp-json/designsetgo/v1/draft-mode/status/123" \
  -H "Authorization: Basic $AUTH")

# 2. Create draft if none exists
if [ "$(echo $STATUS | jq -r '.has_draft')" = "false" ]; then
  DRAFT=$(curl -s -X POST "https://example.com/wp-json/designsetgo/v1/draft-mode/create" \
    -H "Authorization: Basic $AUTH" \
    -H "Content-Type: application/json" \
    -d '{"post_id": 123}')
  DRAFT_ID=$(echo $DRAFT | jq -r '.draft_id')
fi

# 3. Edit the draft using WordPress REST API
curl -X POST "https://example.com/wp-json/wp/v2/pages/$DRAFT_ID" \
  -H "Authorization: Basic $AUTH" \
  -H "Content-Type: application/json" \
  -d '{"content": "<!-- wp:paragraph --><p>Updated content</p><!-- /wp:paragraph -->"}'

# 4. Publish when ready
curl -X POST "https://example.com/wp-json/designsetgo/v1/draft-mode/$DRAFT_ID/publish" \
  -H "Authorization: Basic $AUTH"
```

---

## Limitations

- **Pages only**: Draft mode is currently limited to pages (not posts or custom post types)
- **One draft per page**: Only one draft can exist for each published page
- **No scheduling**: Drafts must be published manually (no scheduled publishing)
- **Authors and above**: Requires `publish_posts` capability

---

## UI Integration

Draft Mode is integrated into:

1. **Block Editor**: "Draft Mode" panel in the document sidebar
2. **Page List**: "Create Draft" / "Edit Draft" row actions
3. **Page List**: "Draft Status" column showing draft state
