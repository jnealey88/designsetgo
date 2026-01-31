# Troubleshooting Guide - DesignSetGo

Common issues and their solutions for DesignSetGo WordPress plugin development.

---

## Build Issues

### npm run build hangs indefinitely

**Symptoms:**
- `npm run build` starts but never completes
- Webpack process appears stuck (no output or progress)
- High CPU usage from webpack/node process

**Root Cause:**
Corrupted webpack cache in `node_modules/.cache` or stale wp-env WordPress files.

**Solution:**

```bash
# Quick fix: Clean cache and rebuild
npm run build:clean

# Or manually:
npm run clean:cache
npm run build

# Nuclear option: Clean everything
npm run clean:all
npm install
npm run build
```

**Prevention:**
- The `postinstall` script now auto-clears cache after `npm install`
- CI automatically clears cache before builds
- Use `npm run build:clean` if you suspect cache issues

**Why it happens:**
- Interrupted builds can corrupt webpack cache
- 117 entry points (large codebase) stresses caching
- Node v24 (very new) may have edge cases

---

### Build is slow (>10 seconds)

**Expected Performance:**
- Normal build: 3-5 seconds
- First build after cache clear: 8-12 seconds
- With 117 entry points, anything >15 seconds is abnormal

**Solutions:**

```bash
# Increase Node memory (if you have RAM)
NODE_OPTIONS="--max-old-space-size=8192" npm run build

# Use webpack bundle analyzer to find bloat
npm run build:analyze

# Disable code splitting temporarily (debug)
# Edit webpack.config.js: optimization.splitChunks = false
```

---

### PHPStan hanging or using too much memory

**Symptoms:**
- `composer run-script analyse` hangs
- PHP process uses >2GB RAM

**Solution:**

```bash
# Run with lower level (faster, less strict)
vendor/bin/phpstan analyse --level=3

# Increase memory limit
php -d memory_limit=4G vendor/bin/phpstan analyse

# Skip problematic paths
# Edit phpstan.neon and add to excludePaths
```

---

### Jest tests hang or fail

**Symptoms:**
- `npm run test:unit` never completes
- Tests timeout after 60 seconds

**Solutions:**

```bash
# Run with --no-cache
npm run test:unit -- --no-cache

# Run single test file
npm run test:unit -- path/to/test.test.js

# Clear Jest cache
npx jest --clearCache
```

---

## WordPress Environment Issues

### wp-env won't start

**Symptoms:**
- `npm run wp-env:start` fails
- Docker containers not starting
- Port conflicts (8888 already in use)

**Solutions:**

```bash
# Clean and restart
npm run wp-env:clean
npm run wp-env:start

# Check Docker
docker ps  # See running containers
docker system prune  # Clean up unused containers

# Check port 8888
lsof -i :8888  # See what's using port 8888
```

---

### Plugin not showing in WordPress admin

**Symptoms:**
- Plugin appears in `wp plugin list` but not in admin
- Activation fails silently

**Solutions:**

```bash
# Rebuild and restart wp-env
npm run build
npm run wp-env:stop
npm run wp-env:start

# Check for PHP errors
npx wp-env run cli wp plugin activate designsetgo --debug

# Check wp-env logs
npx wp-env logs
```

---

## Dependency Issues

### npm install fails

**Solutions:**

```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Use legacy peer deps (if peer dependency conflicts)
npm install --legacy-peer-deps
```

---

### composer install fails

**Solutions:**

```bash
# Clear composer cache
composer clear-cache

# Update composer
composer self-update

# Install with verbose output
composer install -vvv
```

---

## Git/Pre-commit Issues

### Pre-commit hook fails

**Symptoms:**
- Commit blocked by linting errors
- Hook hangs or times out

**Solutions:**

```bash
# Pre-commit hooks are non-blocking by design
# They show warnings but allow commits

# Skip hooks if needed (not recommended)
git commit --no-verify -m "message"

# Fix linting issues
npm run lint:js -- --fix
npm run lint:css -- --fix
composer run-script lint:fix
```

---

## Performance Issues

### Editor is slow in browser

**Symptoms:**
- Block insertion lags
- Typing has delay
- Browser DevTools shows warnings

**Debug:**

```bash
# Build with bundle analyzer
npm run build:analyze
# Opens browser with bundle visualization

# Check for large assets
ls -lh build/ | sort -k5 -h

# Run Lighthouse audit
npx lighthouse http://localhost:8888 --view
```

---

## CI/CD Issues

### CI builds fail but local works

**Common causes:**

1. **Missing environment:** CI uses PHP 8.0, 8.1, 8.2 matrix
   ```bash
   # Test locally with specific PHP version
   composer install --ignore-platform-reqs
   ```

2. **Cache issues:** CI clears cache, you might have stale cache
   ```bash
   npm run clean:all
   npm install
   npm run build
   ```

3. **WordPress version mismatch:** CI tests WP 6.4-latest
   ```bash
   # Test locally with specific WP version
   # Edit .wp-env.json: "core": "WordPress/WordPress#6.4"
   npm run wp-env:clean
   npm run wp-env:start
   ```

---

### PHPStan fails in CI but passes locally

**Likely cause:** Different PHP versions

```bash
# Check your local PHP version
php --version

# CI uses PHP 8.0, 8.1, 8.2
# Test with Docker to match CI environment
docker run -v $(pwd):/app -w /app php:8.2-cli composer run-script analyse
```

---

## Quick Diagnostic Commands

```bash
# Check versions
node --version  # Should be 18.x, 20.x, or 22.x
npm --version   # Should be 8.x or higher
php --version   # Should be 8.0+
composer --version

# Check disk space (large caches can fill disk)
du -sh node_modules/.cache
du -sh .wp-env

# Check for hanging processes
ps aux | grep -i "webpack\|wp-scripts\|phpstan"

# Kill hanging processes
pkill -9 -f "webpack|wp-scripts|phpstan"

# Check git status
git status
git log --oneline -5
```

---

## Getting Help

If you're still stuck:

1. **Search Issues:** Check [GitHub Issues](https://github.com/jnealey88/designsetgo/issues)
2. **Check Logs:**
   - Build: Look for errors in `npm run build` output
   - PHP: Check `npx wp-env logs`
   - Browser: Open DevTools console (F12)
3. **Clean Slate:**
   ```bash
   npm run clean:all
   rm -rf vendor
   npm install
   composer install
   npm run build
   ```

---

## Prevention Checklist

✅ **Daily:**
- Pull latest changes before starting work
- Run `npm run build` to verify setup

✅ **Weekly:**
- Run `npm run clean:cache` to prevent cache buildup
- Update dependencies: `npm outdated` and `composer outdated`

✅ **Before PR:**
- Run `npm run build:clean` to ensure clean build
- Test in fresh wp-env: `npm run wp-env:clean && npm run wp-env:start`
- Run all linters: `npm run lint:js && npm run lint:css && composer run-script lint`

---

**Last Updated:** 2025-11-23
**Plugin Version:** 1.2.0
**Node Version:** 18.x-24.x
**PHP Version:** 7.4-8.2
**WordPress Version:** 6.0+
