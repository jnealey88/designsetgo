---
description: Prepare plugin for WordPress.org deployment
---

Prepare the plugin for deployment to WordPress.org.

1. **Run production build**
   - Execute `npm run build`
   - Verify build completes without errors

2. **Update version numbers**
   - Ask user for new version number (e.g., "1.2.0")
   - Update `package.json` version
   - Update `designsetgo.php` header "Version:" field
   - Update `designsetgo.php` DESIGNSETGO_VERSION constant
   - Update `readme.txt` "Stable tag:" field
   - Update changelog in `readme.txt`

3. **Run security audit**
   - Execute `/security-audit` command
   - Address any critical or high severity issues

4. **Run tests and lint**
   - Execute `npm test` to ensure all tests pass
   - Execute `npm run lint:js` and `npm run lint:css`
   - Fix any issues found

5. **Create deployment package**
   - Create a clean zip file excluding:
     - `.git/`
     - `node_modules/`
     - `src/` (only include `build/`)
     - `.github/`
     - `.claude/`
     - `*.log`
     - `.env*`
     - Development config files
   - Name zip: `designsetgo.[version].zip`

6. **Pre-deployment checklist**
   - All tests passing?
   - No console errors in browser?
   - Works with latest WordPress version?
   - Works with latest Gutenberg plugin?
   - Tested with common themes?
   - Security audit clean?
   - Changelog updated?
   - Screenshots current?

Provide summary of deployment package and next steps for WordPress.org SVN upload.
