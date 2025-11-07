# Testing Quick Start

Quick guide to test the WordPress Abilities API integration.

## 🚀 Fastest Way to Test (2 minutes)

### 1. Start WordPress

```bash
npx wp-env start
npm run build
```

### 2. Create Application Password

1. Visit: http://localhost:8888/wp-admin/profile.php
2. Login: `admin` / `password`
3. Scroll to "Application Passwords"
4. Name: `Testing` → Click "Add New"
5. **Copy the password**

### 3. Run Automated Tests

```bash
./test-abilities.sh
```

When prompted, paste your Application Password.

**Expected Output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓ ALL TESTS PASSED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Tests:  8
Passed:       8
Failed:       0
```

---

## 📋 Manual Testing (5 minutes)

### Test 1: List Available Abilities

```bash
curl -s -u "admin:YOUR_APP_PASSWORD" \
  "http://localhost:8888/wp-json/wp-abilities/v1/abilities" | \
  jq '[.[] | select(.name | startswith("designsetgo/"))]'
```

**You should see 5 abilities:**
- designsetgo/list-blocks
- designsetgo/insert-flex-container
- designsetgo/insert-grid-container
- designsetgo/configure-counter-animation
- designsetgo/apply-animation

### Test 2: Insert a Block

```bash
# Get your credentials
export WP_USER="admin"
export WP_PASS="YOUR_APP_PASSWORD"

# Create a test post
POST_ID=$(npx wp-env run cli wp post create \
  --post_title="Test" \
  --post_status=publish \
  --porcelain)

echo "Created post ID: $POST_ID"

# Insert a Flex Container
curl -X POST \
  -u "$WP_USER:$WP_PASS" \
  -H "Content-Type: application/json" \
  "http://localhost:8888/wp-json/wp-abilities/v1/abilities/designsetgo/insert-flex-container/execute" \
  -d "{
    \"post_id\": $POST_ID,
    \"attributes\": {
      \"direction\": \"row\",
      \"justifyContent\": \"center\"
    }
  }" | jq '.'
```

**Expected:**
```json
{
  "success": true,
  "post_id": 123,
  "block_id": "block-abc123",
  "position": -1
}
```

### Test 3: Verify in WordPress

1. Go to: http://localhost:8888/wp-admin/edit.php
2. Find your "Test" post
3. Click "Edit"
4. You should see a Flex Container block!

---

## 🐛 Troubleshooting

### "Abilities API endpoint not found"

```bash
# Check if package is installed
composer show wordpress/abilities-api

# If not found:
composer install

# Restart WordPress
npx wp-env restart
```

### "No DesignSetGo abilities found"

```bash
# Check logs
npx wp-env logs | grep -i "abilities"

# Rebuild
npm run build

# Restart
npx wp-env restart
```

### "Authentication failed"

- Make sure you're using an **Application Password**, not your regular password
- Remove spaces from the password: `1234 5678` → `12345678`
- Create a new Application Password if needed

---

## 📖 Full Documentation

For comprehensive testing details, see:
- [docs/TESTING-ABILITIES-API.md](docs/TESTING-ABILITIES-API.md) - Complete testing guide
- [docs/ABILITIES-API.md](docs/ABILITIES-API.md) - Full API documentation

---

## ✅ Success Checklist

After testing, you should have:

- [ ] Automated tests passing (8/8)
- [ ] Flex Container inserted in test post
- [ ] Grid Container inserted in test post
- [ ] Animation applied to heading
- [ ] Error handling working (invalid post ID)
- [ ] Blocks visible in WordPress editor
- [ ] Blocks rendering on frontend

---

## 🎯 Next Steps

1. **Test with AI Agents** - Try with Claude or ChatGPT
2. **Create Custom Abilities** - Add your own abilities
3. **Contribute** - Share your findings with the WordPress AI initiative

---

**Questions?** See [docs/TESTING-ABILITIES-API.md](docs/TESTING-ABILITIES-API.md) or create an issue.
