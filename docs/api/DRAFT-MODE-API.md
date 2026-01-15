# Draft Mode API

**Since**: 1.4.0

Draft Mode allows users to create working copies of published pages, edit them safely without affecting the live site, and publish changes when ready.

## Overview

When a page is published in WordPress, any edits are immediately live. Draft Mode solves this by:

1. **On-demand draft creation**: Click "Create Draft" to start working on a copy
2. **Seamless editing**: Your changes are captured and transferred to the draft
3. **Safe editing**: All subsequent saves go to the draft, not the live page
4. **Visual indicators**: Header controls and bottom banner show you're in draft mode
5. **One-click publishing**: Merge the draft back into the original when ready
6. **URL preservation**: The original URL and SEO value are preserved

## User Experience

### Editing a Published Page

1. Navigate to any published page in the block editor
2. Click **"Create Draft"** in the sidebar panel or editor header
3. You're redirected to the draft editor to continue working
4. The "Draft Mode" panel in the sidebar shows you're editing a draft
5. A **bottom banner** indicates you're in draft mode with a link to view the live page

### Working with Drafts

When editing a draft, you'll see:

**Editor Header:**

- **Save Draft link**: Appears when you have unsaved changes (saves without publishing)

**Sidebar Panel:**

- **Warning notice**: "You are editing a draft version"
- **View live page link**: Opens the published page in a new tab
- **Publish Changes button**: Merge changes to the live page (with confirmation)
- **Discard Draft button**: Delete the draft without publishing (with confirmation)

**Bottom Banner:**

- **Draft indicator**: Shows you're editing a draft with the original page title
- **View live page link**: Quick access to the published version

### Publishing Changes

When your draft is ready:

1. Click **"Publish Changes"** in the Draft Mode sidebar panel (or click the standard "Publish" button - it's intercepted automatically)
2. A confirmation modal appears: "This will replace the current live content with your draft changes."
3. Click **"Publish"** to confirm
4. Any unsaved changes are saved first
5. Your changes are merged into the live page
6. The draft is deleted
7. You're redirected to the published page editor

### Discarding Changes

To abandon your draft:

1. Click **"Discard Draft"** in the Draft Mode sidebar panel
2. A confirmation modal appears: "All changes will be lost and cannot be recovered."
3. Click **"Discard"** to confirm
4. The draft is deleted
5. You're redirected to the original page editor
6. The live page remains unchanged

---

## Plugin Settings

Draft Mode can be configured in DesignSetGo settings:

| Setting | Default | Description |
|---------|---------|-------------|
| `enable` | `true` | Enable/disable draft mode entirely |
| `show_page_list_actions` | `true` | Show Create/Edit Draft row actions in page list |
| `show_page_list_column` | `true` | Show Draft Status column in page list |

### Accessing Settings

Settings are stored in the `designsetgo_settings` option under the `draft_mode` key:

```php
$settings = get_option( 'designsetgo_settings' );
$draft_mode = $settings['draft_mode'];
```

---

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

Check the draft status of any page. Also returns current settings.

**Endpoint**: `GET /draft-mode/status/{post_id}`

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `post_id` | integer | Yes | The page ID to check |

**Response** (page with no draft):
```json
{
  "settings": {
    "enabled": true,
    "auto_save_enabled": true,
    "auto_save_interval": 60
  },
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
  "settings": {
    "enabled": true,
    "auto_save_enabled": true,
    "auto_save_interval": 60
  },
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
  "settings": {
    "enabled": true,
    "auto_save_enabled": true,
    "auto_save_interval": 60
  },
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
  "post_id": 123,
  "content": "<!-- wp:paragraph --><p>Optional content</p><!-- /wp:paragraph -->",
  "title": "Optional title",
  "excerpt": "Optional excerpt"
}
```

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `post_id` | integer | Yes | The published page ID |
| `content` | string | No | Content to use instead of published content (captures unsaved edits) |
| `title` | string | No | Title to use instead of published title |
| `excerpt` | string | No | Excerpt to use instead of published excerpt |

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
| `draft_mode_disabled` | Draft mode is disabled |
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

// Get status (includes settings)
const status = await apiFetch({
  path: `/designsetgo/v1/draft-mode/status/${postId}`,
});

// Check if draft mode is enabled
if (status.settings.enabled) {
  // Draft mode features available
}

// Create draft with content overrides
const result = await apiFetch({
  path: '/designsetgo/v1/draft-mode/create',
  method: 'POST',
  data: {
    post_id: postId,
    content: currentContent,  // Capture unsaved edits
    title: currentTitle,
    excerpt: currentExcerpt,
  },
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
# 1. Check if page has a draft and if draft mode is enabled
STATUS=$(curl -s -X GET "https://example.com/wp-json/designsetgo/v1/draft-mode/status/123" \
  -H "Authorization: Basic $AUTH")

# Check if draft mode is enabled
if [ "$(echo $STATUS | jq -r '.settings.enabled')" = "false" ]; then
  echo "Draft mode is disabled"
  exit 1
fi

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

1. **Block Editor Header**: Context-aware controls positioned at the left:
   - **For published pages**: "Create Draft" or "Edit Draft" link
   - **For drafts**: "Save Draft" link (appears when there are unsaved changes)

2. **Block Editor Sidebar**: "Draft Mode" panel in the document settings with:
   - Draft status indicator with warning/info notices
   - View live page link (when editing a draft)
   - Publish Changes button with confirmation modal
   - Discard Draft button with confirmation modal
   - Create Draft button (for published pages without a draft)

3. **Bottom Banner**: Fixed banner at the bottom of the editor (when editing a draft):
   - Visual indicator that you're editing a draft version
   - Original page title display
   - Quick link to view the live page

4. **Page List**: "Create Draft" / "Edit Draft" / "View Live" row actions (can be disabled in settings)

5. **Page List**: "Draft Status" column showing draft state (can be disabled in settings)

---

## Technical Notes

### Publish Button Interception

When editing a draft, the native WordPress "Publish" button is intercepted to use the custom `publishDraft()` API instead of the standard WordPress publish action. This ensures:

- Changes are merged back to the original published page
- The draft is deleted after publishing
- The user is redirected to the original page editor

The interception uses a capture-phase event listener to run before WordPress's native handler.

### Navigation Without "Leave Site?" Warnings

Draft Mode clears the editor's dirty state before navigation to prevent browser "Leave site?" warnings. This is done by resetting the editor's reference blocks to match the current state:

```javascript
const currentBlocks = wp.data.select('core/block-editor').getBlocks();
wp.data.dispatch('core/editor').resetEditorBlocks(currentBlocks, {
  __unstableShouldCreateUndoLevel: false,
});
```

This affects navigation after:

- Creating a draft (redirect to draft editor)
- Publishing changes (redirect to original page)
- Discarding a draft (redirect to original page)

### CSS Classes

The following CSS classes are added for styling:

- `.dsgo-draft-mode-active` - Added to `<body>` when editing a draft (hides native "Save draft" button)
- `.dsgo-draft-mode-save-draft` - Header "Save Draft" link styling
- `.dsgo-draft-mode-panel` - Sidebar panel styling
- `.dsgo-draft-mode-banner` - Bottom banner styling
