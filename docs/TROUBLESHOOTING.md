# DesignSetGo - Troubleshooting Guide

## Blocks Not Appearing in Editor

If you don't see DesignSetGo blocks in the block inserter, follow these steps:

### 1. Verify Plugin is Activated

```bash
# Access your WordPress container
npx wp-env run cli wp plugin list

# You should see:
# designsetgo | active
```

If not active, activate it:

```bash
npx wp-env run cli wp plugin activate designsetgo
```

### 2. Check for PHP Errors

```bash
# Check WordPress debug log
npx wp-env run cli wp eval 'echo ABSPATH;'
npx wp-env logs wordpress | grep -i error
```

### 3. Verify Plugin Structure

The plugin directory should be at:
```
/var/www/html/wp-content/plugins/designsetgo/
```

Check with:
```bash
npx wp-env run cli ls -la /var/www/html/wp-content/plugins/designsetgo/
```

### 4. Verify Build Files Exist

```bash
# Check that block files were built
ls -la build/blocks/container/

# You should see:
# - block.json
# - index.js
# - index.css
# - style-index.css
```

### 5. Check Block Registration

```bash
# List all registered blocks
npx wp-env run cli wp block list | grep designsetgo

# You should see:
# designsetgo/container
```

### 6. Clear WordPress Cache

```bash
# Restart WordPress environment
npx wp-env stop
npx wp-env start
```

### 7. Check Browser Console

1. Open WordPress editor
2. Open browser DevTools (F12)
3. Go to Console tab
4. Look for any JavaScript errors related to "designsetgo"

### 8. Verify the Plugin is in the Right Location

If you're using `wp-env`, the current directory is automatically mapped as a plugin. Make sure you're running wp-env from the project root:

```bash
# Should be in /path/to/designsetgo/
pwd

# Start wp-env from here
npx wp-env start
```

### 9. Manual Plugin Check

Visit WordPress admin:
1. Go to http://localhost:8888/wp-admin
2. Navigate to Plugins
3. Look for "DesignSetGo"
4. Click "Activate" if not already active

### 10. Create a Test Post

1. Go to Posts → Add New
2. Click the (+) button to add a block
3. Search for "Container"
4. You should see "Container" with the DesignSetGo category

## Common Issues

### Issue: "The plugin does not have a valid header"

**Solution:** Make sure `designsetgo.php` is in the root of the plugin directory with proper headers.

### Issue: "Parse error" or "Fatal error"

**Solution:** Check PHP version:
```bash
npx wp-env run cli php -v
# Should be PHP 8.0 or higher
```

### Issue: "Block validation error"

**Solution:** This happens when block attributes change. Clear the block and try again, or check browser console for details.

### Issue: Styles not loading

**Solution:** Rebuild the plugin:
```bash
npm run build
npx wp-env stop
npx wp-env start
```

## Debugging Mode

Enable WordPress debugging by adding to `.wp-env.override.json`:

```json
{
  "config": {
    "WP_DEBUG": true,
    "WP_DEBUG_LOG": true,
    "WP_DEBUG_DISPLAY": true,
    "SCRIPT_DEBUG": true
  }
}
```

Then restart:
```bash
npx wp-env stop
npx wp-env start
```

## Check Plugin Health

Run this command to verify everything:

```bash
# Check if plugin files exist
ls -la designsetgo.php includes/ src/ build/

# Check PHP syntax
find includes -name "*.php" -exec php -l {} \;

# Check if blocks are registered
npx wp-env run cli wp block list | grep designsetgo

# Check plugin status
npx wp-env run cli wp plugin list --status=active
```

## Still Having Issues?

1. **Check GitHub Issues:** https://github.com/yourusername/designsetgo/issues
2. **Create a New Issue:** Include:
   - WordPress version
   - PHP version
   - Browser and version
   - Console errors (if any)
   - Steps to reproduce

## Quick Reset

If all else fails, do a complete reset:

```bash
# Stop environment
npx wp-env stop

# Clean everything
npx wp-env clean all

# Rebuild
npm run build

# Start fresh
npx wp-env start

# Activate plugin
npx wp-env run cli wp plugin activate designsetgo

# Verify
npx wp-env run cli wp block list | grep designsetgo
```

This should show your DesignSetGo blocks!
