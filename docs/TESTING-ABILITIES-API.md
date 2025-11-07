# Testing the WordPress Abilities API Integration

This guide walks through testing all 5 DesignSetGo abilities in your local development environment.

---

## Prerequisites

Before testing, ensure you have:

- ✅ WordPress environment running (`npx wp-env start`)
- ✅ DesignSetGo plugin built (`npm run build`)
- ✅ Composer dependencies installed (`composer install` or `composer update`)
- ✅ WordPress admin access (admin/password)

---

## Step 1: Verify Installation

### Check Composer Package

```bash
# Verify wordpress/abilities-api is installed
composer show wordpress/abilities-api
```

**Expected Output:**
```
name     : wordpress/abilities-api
descrip. : WordPress Abilities API
versions : * v0.4.0
```

### Check Files Exist

```bash
# Check abilities directory
ls -la includes/abilities/

# Should show:
# class-abilities-registry.php
# class-abstract-ability.php
# class-block-inserter.php
# class-block-configurator.php
# info/, inserters/, configurators/, generators/, schemas/
```

---

## Step 2: Enable WordPress Abilities API

The Abilities API needs to be activated in WordPress. Since it's a Composer package, we need to ensure it's loaded properly.

### Option A: Via Plugin Activation Hook

Add this to your `designsetgo.php` main plugin file (temporary for testing):

```php
// Add after the main Plugin::instance() call
add_action('plugins_loaded', function() {
    if (class_exists('WP_Abilities_Registry')) {
        error_log('✅ Abilities API is loaded');
    } else {
        error_log('❌ Abilities API NOT loaded - check Composer autoloader');
    }
}, 1);
```

### Option B: Check via wp-env Logs

```bash
# View WordPress logs
npx wp-env logs

# Look for ability registration messages
```

---

## Step 3: Create Test Content

Before testing abilities, create a test post to work with:

### Via WordPress Admin

1. Go to http://localhost:8888/wp-admin
2. Login: `admin` / `password`
3. Posts → Add New
4. Title: "Abilities API Test Post"
5. Publish
6. **Note the Post ID** (visible in the URL: `?post=123`)

### Via WP-CLI

```bash
# Create test post
npx wp-env run cli wp post create \
  --post_title="Abilities API Test Post" \
  --post_status=publish \
  --porcelain

# Returns: 123 (post ID)
```

---

## Step 4: Set Up Authentication

### Create Application Password

1. Go to http://localhost:8888/wp-admin/profile.php
2. Scroll to **"Application Passwords"**
3. Enter name: `Abilities API Testing`
4. Click **"Add New Application Password"**
5. **Copy the generated password** (you can't see it again!)

Example password: `1234 5678 90AB CDEF GHIJ KLMN`

### Store Credentials

```bash
# Export for easy testing
export WP_USER="admin"
export WP_PASS="1234 5678 90AB CDEF GHIJ KLMN"  # Your actual password
export WP_URL="http://localhost:8888"
export TEST_POST_ID=123  # Your test post ID
```

---

## Step 5: Test Each Ability

### Test 1: List All Abilities (Discovery)

First, verify the Abilities API is working and DesignSetGo abilities are registered:

```bash
# List ALL registered abilities
curl -s -u "$WP_USER:$WP_PASS" \
  "$WP_URL/wp-json/wp-abilities/v1/abilities" | jq '.'
```

**Expected Output:** JSON array containing WordPress abilities

**Look for DesignSetGo abilities:**
```bash
# Filter to show only DesignSetGo abilities
curl -s -u "$WP_USER:$WP_PASS" \
  "$WP_URL/wp-json/wp-abilities/v1/abilities" | \
  jq '[.[] | select(.name | startswith("designsetgo/"))]'
```

**Expected:**
```json
[
  {
    "name": "designsetgo/list-blocks",
    "label": "List DesignSetGo Blocks",
    "description": "Returns a comprehensive list...",
    ...
  },
  {
    "name": "designsetgo/insert-flex-container",
    ...
  },
  ...
]
```

---

### Test 2: `designsetgo/list-blocks`

List all DesignSetGo blocks:

```bash
curl -s -X POST \
  -u "$WP_USER:$WP_PASS" \
  -H "Content-Type: application/json" \
  "$WP_URL/wp-json/wp-abilities/v1/abilities/designsetgo/list-blocks/execute" \
  -d '{"category": "all"}' | jq '.'
```

**Expected Output:**
```json
[
  {
    "name": "designsetgo/flex",
    "title": "Flex Container",
    "description": "Flexible horizontal or vertical layout container...",
    "category": "layout",
    "attributes": {
      "direction": { "type": "string", "enum": ["row", "column"] },
      ...
    },
    "supports": ["color", "spacing", "align", "anchor"]
  },
  ...
]
```

**Test with different categories:**

```bash
# Layout blocks only
curl -s -X POST \
  -u "$WP_USER:$WP_PASS" \
  -H "Content-Type: application/json" \
  "$WP_URL/wp-json/wp-abilities/v1/abilities/designsetgo/list-blocks/execute" \
  -d '{"category": "layout"}' | jq '.'

# Interactive blocks only
curl -s -X POST \
  -u "$WP_USER:$WP_PASS" \
  -H "Content-Type: application/json" \
  "$WP_URL/wp-json/wp-abilities/v1/abilities/designsetgo/list-blocks/execute" \
  -d '{"category": "interactive"}' | jq '.'
```

---

### Test 3: `designsetgo/insert-flex-container`

Insert a Flex Container block into your test post:

```bash
curl -s -X POST \
  -u "$WP_USER:$WP_PASS" \
  -H "Content-Type: application/json" \
  "$WP_URL/wp-json/wp-abilities/v1/abilities/designsetgo/insert-flex-container/execute" \
  -d '{
    "post_id": '"$TEST_POST_ID"',
    "position": -1,
    "attributes": {
      "direction": "row",
      "justifyContent": "center",
      "alignItems": "center",
      "wrap": true
    }
  }' | jq '.'
```

**Expected Output:**
```json
{
  "success": true,
  "post_id": 123,
  "block_id": "block-abc123",
  "position": -1
}
```

**Verify in WordPress:**
1. Go to http://localhost:8888/wp-admin/post.php?post=123&action=edit
2. You should see a Flex Container block at the bottom
3. Check the block settings to confirm attributes

**Test with inner blocks:**

```bash
curl -s -X POST \
  -u "$WP_USER:$WP_PASS" \
  -H "Content-Type: application/json" \
  "$WP_URL/wp-json/wp-abilities/v1/abilities/designsetgo/insert-flex-container/execute" \
  -d '{
    "post_id": '"$TEST_POST_ID"',
    "attributes": {
      "direction": "row",
      "justifyContent": "space-between"
    },
    "innerBlocks": [
      {
        "name": "core/button",
        "attributes": {
          "text": "Button 1"
        }
      },
      {
        "name": "core/button",
        "attributes": {
          "text": "Button 2"
        }
      }
    ]
  }' | jq '.'
```

---

### Test 4: `designsetgo/insert-grid-container`

Insert a responsive Grid Container:

```bash
curl -s -X POST \
  -u "$WP_USER:$WP_PASS" \
  -H "Content-Type: application/json" \
  "$WP_URL/wp-json/wp-abilities/v1/abilities/designsetgo/insert-grid-container/execute" \
  -d '{
    "post_id": '"$TEST_POST_ID"',
    "attributes": {
      "desktopColumns": 3,
      "tabletColumns": 2,
      "mobileColumns": 1,
      "gap": "20px"
    },
    "innerBlocks": [
      {
        "name": "core/group",
        "attributes": {
          "style": {
            "spacing": {
              "padding": "20px"
            }
          }
        },
        "innerBlocks": [
          {
            "name": "core/heading",
            "attributes": {
              "content": "Column 1",
              "level": 3
            }
          }
        ]
      },
      {
        "name": "core/group",
        "innerBlocks": [
          {
            "name": "core/heading",
            "attributes": {
              "content": "Column 2",
              "level": 3
            }
          }
        ]
      },
      {
        "name": "core/group",
        "innerBlocks": [
          {
            "name": "core/heading",
            "attributes": {
              "content": "Column 3",
              "level": 3
            }
          }
        ]
      }
    ]
  }' | jq '.'
```

**Verify in WordPress:**
- Grid should have 3 columns on desktop
- Responsive settings should be in block settings

---

### Test 5: `designsetgo/configure-counter-animation`

First, insert a Counter Group with a Counter block:

```bash
# Create post with counter (via wp-cli for simplicity)
npx wp-env run cli wp post create \
  --post_title="Counter Test" \
  --post_content='<!-- wp:designsetgo/counter-group -->
<div class="wp-block-designsetgo-counter-group">
  <!-- wp:designsetgo/counter {"endValue":100,"suffix":"+"} -->
  <div class="wp-block-designsetgo-counter">100+</div>
  <!-- /wp:designsetgo/counter -->
</div>
<!-- /wp:designsetgo/counter-group -->' \
  --post_status=publish \
  --porcelain

# Returns: 124 (new post ID)
export COUNTER_POST_ID=124
```

Now configure the counter:

```bash
curl -s -X POST \
  -u "$WP_USER:$WP_PASS" \
  -H "Content-Type: application/json" \
  "$WP_URL/wp-json/wp-abilities/v1/abilities/designsetgo/configure-counter-animation/execute" \
  -d '{
    "post_id": '"$COUNTER_POST_ID"',
    "settings": {
      "endValue": 500,
      "prefix": "$",
      "suffix": "+",
      "decimals": 0,
      "label": "Revenue",
      "customDuration": 2
    }
  }' | jq '.'
```

**Expected Output:**
```json
{
  "success": true,
  "post_id": 124,
  "updated_count": 1,
  "block_name": "designsetgo/counter",
  "new_attributes": {
    "endValue": 500,
    "prefix": "$",
    "suffix": "+",
    ...
  }
}
```

---

### Test 6: `designsetgo/apply-animation`

Apply a fade-in animation to a heading:

```bash
# First create a post with a heading
npx wp-env run cli wp post create \
  --post_title="Animation Test" \
  --post_content='<!-- wp:heading -->
<h2>My Heading</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Some content</p>
<!-- /wp:paragraph -->' \
  --post_status=publish \
  --porcelain

# Returns: 125
export ANIM_POST_ID=125
```

Apply animation:

```bash
curl -s -X POST \
  -u "$WP_USER:$WP_PASS" \
  -H "Content-Type: application/json" \
  "$WP_URL/wp-json/wp-abilities/v1/abilities/designsetgo/apply-animation/execute" \
  -d '{
    "post_id": '"$ANIM_POST_ID"',
    "block_name": "core/heading",
    "animation": {
      "enabled": true,
      "entranceAnimation": "fadeInUp",
      "trigger": "scroll",
      "duration": 600,
      "delay": 0,
      "easing": "ease-out",
      "once": true
    }
  }' | jq '.'
```

**Expected Output:**
```json
{
  "success": true,
  "post_id": 125,
  "updated_count": 1,
  "block_name": "core/heading",
  "new_attributes": {
    "dsgAnimationEnabled": true,
    "dsgEntranceAnimation": "fadeInUp",
    ...
  }
}
```

**Verify:**
- Edit the post in WordPress
- Select the heading block
- Check Block Settings → DesignSetGo → Animation
- Should show fadeInUp animation enabled

---

## Step 6: Test Error Handling

### Test Invalid Post ID

```bash
curl -s -X POST \
  -u "$WP_USER:$WP_PASS" \
  -H "Content-Type: application/json" \
  "$WP_URL/wp-json/wp-abilities/v1/abilities/designsetgo/insert-flex-container/execute" \
  -d '{
    "post_id": 99999,
    "attributes": {}
  }' | jq '.'
```

**Expected:**
```json
{
  "code": "invalid_post",
  "message": "Post not found.",
  "data": {
    "status": 404
  }
}
```

### Test Missing Required Parameters

```bash
curl -s -X POST \
  -u "$WP_USER:$WP_PASS" \
  -H "Content-Type: application/json" \
  "$WP_URL/wp-json/wp-abilities/v1/abilities/designsetgo/insert-flex-container/execute" \
  -d '{}' | jq '.'
```

**Expected:**
```json
{
  "code": "missing_post_id",
  "message": "Post ID is required.",
  ...
}
```

### Test Invalid Authentication

```bash
curl -s -X POST \
  -u "wrong:password" \
  -H "Content-Type: application/json" \
  "$WP_URL/wp-json/wp-abilities/v1/abilities/designsetgo/list-blocks/execute" \
  -d '{}' | jq '.'
```

**Expected:**
```json
{
  "code": "rest_forbidden",
  "message": "Sorry, you are not allowed to do that.",
  ...
}
```

---

## Step 7: Debug Common Issues

### Issue: "Abilities API not loaded"

**Cause:** Composer autoloader not loading

**Fix:**
```bash
# Ensure Composer dependencies are installed
cd /path/to/designsetgo
composer install

# Check if vendor/autoload.php exists
ls -la vendor/autoload.php

# Rebuild the plugin
npm run build

# Restart wp-env
npx wp-env stop
npx wp-env start
```

### Issue: "No DesignSetGo abilities found"

**Cause:** Abilities not registered

**Debug:**
```bash
# Check WordPress error logs
npx wp-env logs

# Add debug logging to includes/abilities/class-abilities-registry.php
# In the register_abilities() method:
error_log('Registering ' . count($this->abilities) . ' abilities');
foreach ($this->abilities as $ability) {
    error_log('Registering: ' . $ability->get_name());
}
```

### Issue: "REST API returns empty array"

**Cause:** Abilities API hook not firing

**Fix:**
```php
// In includes/class-plugin.php, verify the registry is initialized:
add_action('init', function() {
    $plugin = \DesignSetGo\Plugin::instance();
    if ($plugin->abilities_registry) {
        error_log('✅ Abilities Registry initialized');
        error_log('Abilities count: ' . count($plugin->abilities_registry->get_abilities()));
    } else {
        error_log('❌ Abilities Registry NOT initialized');
    }
}, 999);
```

### Issue: "Block not inserted correctly"

**Debug the block markup:**
```bash
# Get the post content to see raw block markup
npx wp-env run cli wp post get $TEST_POST_ID --field=post_content
```

---

## Step 8: Automated Testing (Optional)

Create a test script for quick verification:

```bash
#!/bin/bash
# test-abilities.sh

set -e

WP_USER="admin"
WP_PASS="your-app-password-here"
WP_URL="http://localhost:8888"

echo "🧪 Testing DesignSetGo Abilities API..."

# Test 1: List abilities
echo "Test 1: List all abilities"
curl -s -u "$WP_USER:$WP_PASS" \
  "$WP_URL/wp-json/wp-abilities/v1/abilities" | \
  jq '[.[] | select(.name | startswith("designsetgo/"))] | length'

# Test 2: List blocks
echo "Test 2: List DesignSetGo blocks"
curl -s -X POST -u "$WP_USER:$WP_PASS" \
  -H "Content-Type: application/json" \
  "$WP_URL/wp-json/wp-abilities/v1/abilities/designsetgo/list-blocks/execute" \
  -d '{"category": "all"}' | jq 'length'

# Test 3: Insert flex container
echo "Test 3: Insert Flex Container"
POST_ID=$(npx wp-env run cli wp post create --post_title="Test" --post_status=publish --porcelain)
RESULT=$(curl -s -X POST -u "$WP_USER:$WP_PASS" \
  -H "Content-Type: application/json" \
  "$WP_URL/wp-json/wp-abilities/v1/abilities/designsetgo/insert-flex-container/execute" \
  -d "{\"post_id\": $POST_ID, \"attributes\": {}}")
echo $RESULT | jq '.success'

echo "✅ All tests passed!"
```

Make it executable:
```bash
chmod +x test-abilities.sh
./test-abilities.sh
```

---

## Step 9: Visual Verification Checklist

After running API tests, verify visually in WordPress:

### Block Editor
- [ ] Flex Container appears in block inserter
- [ ] Inserted blocks have correct attributes
- [ ] Block settings show applied values
- [ ] Animations are configured in settings panel

### Frontend
- [ ] Blocks render correctly
- [ ] Layouts match configured attributes
- [ ] Animations trigger on scroll
- [ ] Responsive settings work (test at different widths)

### Database
```bash
# Check post content in database
npx wp-env run cli wp post get $TEST_POST_ID --field=post_content

# Should see block markup like:
# <!-- wp:designsetgo/flex {"direction":"row"} -->
```

---

## Step 10: Performance Testing

Verify the Abilities API doesn't impact performance:

```bash
# Measure response time
time curl -s -X POST \
  -u "$WP_USER:$WP_PASS" \
  "$WP_URL/wp-json/wp-abilities/v1/abilities/designsetgo/list-blocks/execute" \
  -d '{}' > /dev/null

# Should be < 100ms
```

---

## Next Steps

Once all tests pass:

1. ✅ Document any issues encountered
2. ✅ Create example use cases
3. ✅ Test with actual AI agents (Claude, ChatGPT)
4. ✅ Create demo video
5. ✅ Share with WordPress AI initiative

---

## Troubleshooting Resources

- **WordPress Logs:** `npx wp-env logs`
- **PHP Errors:** `npx wp-env run cli wp config get WP_DEBUG`
- **REST API Docs:** http://localhost:8888/wp-json/wp-abilities/v1
- **DesignSetGo Issues:** https://github.com/yourrepo/designsetgo/issues

---

**Happy Testing!** 🚀🤖
