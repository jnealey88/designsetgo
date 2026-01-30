---
name: build
description: Build plugin and watch for changes
disable-model-invocation: true
allowed-tools: Bash(npm run *), Bash(npx wp-env *), Bash(git *), Read, Glob
---


Build the DesignSetGo plugin for development or production.

## Options

**Development build with watch mode:**
```bash
npm run start
```
- Hot module replacement enabled
- Source maps included
- Watches for file changes
- Assets unminified for debugging

**Production build:**
```bash
npm run build
```
- Minified assets
- Source maps removed
- Optimized for performance
- Tree-shaking applied

## Verify Build

After building, check output:
```bash
ls -lh build/
```

**Expected output:**
- `index.js` - Block editor scripts
- `style-index.css` - Frontend styles
- `index.css` - Editor-only styles
- Individual block assets

## Troubleshooting

**Build fails:**
- Check for syntax errors: `npm run lint:js`
- Clear node_modules: `rm -rf node_modules && npm install`

**Styles not applying:**
- Verify imports in `src/styles/style.scss` and `src/styles/editor.scss`
- Check: `grep "your-class" build/style-index.css`

**Bundle size too large:**
- Check sizes: `ls -lh build/*.js build/*.css`
- Per-block budget: < 10KB JS, < 5KB CSS
