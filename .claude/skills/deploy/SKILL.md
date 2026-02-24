---
name: deploy
description: Prepare plugin for WordPress.org deployment
disable-model-invocation: true
allowed-tools: Bash(npm run *), Bash(npx wp-env *), Bash(git *), Read, Glob
---


Prepare the plugin for deployment to WordPress.org via automated GitHub Actions workflow.

1. **Run production build**
   - Execute `npm run build`
   - Verify build completes without errors

2. **Update version numbers**
   - Ask user for new version number (e.g., "1.2.0")
   - Update `package.json` version
   - Update `designsetgo.php` header "Version:" field (line 6)
   - Update `designsetgo.php` DESIGNSETGO_VERSION constant (line 25)
   - Update `readme.txt` "Stable tag:" field
   - Add new version entry to changelog in `readme.txt`

3. **Run security audit**
   - Execute `/security-audit` command
   - Address any critical or high severity issues

4. **Run tests and lint**
   - Execute `npm run test:unit` to run JS unit tests (wp-scripts test-unit-js)
   - Execute `npm run test:php` to run PHP tests (composer test)
   - Execute `npm run lint:js` and `npm run lint:css`
   - Fix any issues found
   - Note: E2E tests (`npm run test:e2e`) require a running WordPress instance and are run separately

5. **Pre-deployment checklist**
   - Do we need to update any documentation?
   - All tests passing?
   - No console errors in browser (editor + frontend)?
   - Works with latest WordPress version?
   - Works with latest Gutenberg plugin?
   - Tested with common themes (esp. Twenty Twenty-Five)?
   - Security audit clean?
   - Changelog updated?
   - Screenshots current in `.wordpress-org/`?
   - readme.txt description under 150 characters?

6. **Commit and tag for deployment**
   - Stage all changes: `git add .`
   - Commit: `git commit -m "chore: Release version X.X.X"`
   - Create tag: `git tag vX.X.X`
   - Push commits: `git push origin main`
   - Push tag: `git push origin vX.X.X`
   - GitHub Actions will automatically deploy to WordPress.org SVN

7. **Verify deployment**
   - Monitor GitHub Actions workflow at https://github.com/jnealey-godaddy/designsetgo/actions
   - Wait 5-10 minutes for WordPress.org to process
   - Check plugin page: https://wordpress.org/plugins/designsetgo/
   - Verify version number, changelog, and screenshots display correctly

**Note**: The `.distignore` file controls which files are excluded from WordPress.org deployment. Only production files from `/build/` are included; development files (`/src/`, `/tests/`, `.github/`, etc.) are automatically excluded.
