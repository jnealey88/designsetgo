---
description: Build and deploy the Airo Blocks plugin to Local WP site
---

Build the WordPress plugin and deploy it to the Local WP test site by:

1. Remove any existing build artifacts
2. Create a clean zip file of the plugin (excluding unnecessary files like node_modules, .git, etc.)
3. Remove the old plugin version from `/Users/jnealey/Local Sites/template-styles/app/public/wp-content/plugins/airo-blocks` if it exists
4. Extract the new plugin zip to the plugins directory
5. Confirm the deployment was successful

Important files to exclude from the zip:
- node_modules/
- .git/
- .gitignore
- .editorconfig
- .eslintrc.js
- .prettierrc
- .stylelintrc.json
- .wp-env.json
- composer.json
- phpcs.xml
- phpstan.neon
- package-lock.json
- DEV-PHASE-1.md
- PRD.md
- README.md (or include if you want)

The plugin should be ready to activate in WordPress after deployment.
