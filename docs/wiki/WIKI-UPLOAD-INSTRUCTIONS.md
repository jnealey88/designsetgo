# How to Upload Documentation to GitHub Wiki

This guide explains how to add the Sticky Header and Responsive Visibility documentation to your GitHub wiki.

## Option 1: Upload via GitHub Web Interface (Easiest)

### Step 1: Navigate to Wiki

1. Go to: https://github.com/jnealey88/designsetgo/wiki
2. Click **"New Page"** button in the top-right

### Step 2: Create Sticky Header Page

1. Page Title: `Sticky Header`
2. Copy the entire contents of `docs/wiki/Sticky-Header.md`
3. Paste into the editor
4. Click **"Save Page"**

### Step 3: Create Responsive Visibility Page

1. Click **"New Page"** again
2. Page Title: `Responsive Visibility`
3. Copy the entire contents of `docs/wiki/Responsive-Visibility.md`
4. Paste into the editor
5. Click **"Save Page"**

### Step 4: Update Home Page (Optional)

1. Go to the wiki Home page
2. Click **"Edit"**
3. Add links to the new pages:

```markdown
## Features

- [Sticky Header](Sticky-Header) - Make your header sticky while scrolling
- [Responsive Visibility](Responsive-Visibility) - Hide blocks on specific devices
```

4. Click **"Save Page"**

---

## Option 2: Upload via Git (Advanced)

### Clone the Wiki Repository

```bash
# Navigate to your repos directory
cd ~/Documents/GitHub

# Clone the wiki (it's a separate repo)
git clone https://github.com/jnealey88/designsetgo.wiki.git

# Navigate into wiki directory
cd designsetgo.wiki
```

### Add the Documentation Files

```bash
# Copy the files from the main repo
cp ../designsetgo/docs/wiki/Sticky-Header.md ./Sticky-Header.md
cp ../designsetgo/docs/wiki/Responsive-Visibility.md ./Responsive-Visibility.md

# Add and commit
git add Sticky-Header.md Responsive-Visibility.md
git commit -m "docs: Add Sticky Header and Responsive Visibility documentation"

# Push to GitHub
git push origin master
```

### Update Home Page (Optional)

```bash
# Edit Home.md
nano Home.md

# Add the links (see above)

# Commit and push
git add Home.md
git commit -m "docs: Add links to new feature pages"
git push origin master
```

---

## Option 3: Create Wiki Pages Manually

If you prefer to write directly in GitHub:

### Sticky Header Page

1. Go to: https://github.com/jnealey88/designsetgo/wiki/_new
2. Title: `Sticky Header`
3. Copy/paste content from `docs/wiki/Sticky-Header.md`
4. Save

### Responsive Visibility Page

1. Go to: https://github.com/jnealey88/designsetgo/wiki/_new
2. Title: `Responsive Visibility`
3. Copy/paste content from `docs/wiki/Responsive-Visibility.md`
4. Save

---

## Verifying the Upload

After uploading, verify the pages work correctly:

1. **Visit the pages**:
   - https://github.com/jnealey88/designsetgo/wiki/Sticky-Header
   - https://github.com/jnealey88/designsetgo/wiki/Responsive-Visibility

2. **Check formatting**:
   - Headers render correctly
   - Tables display properly
   - Links work
   - Code blocks are formatted

3. **Test internal links**:
   - Click links between pages
   - Ensure they navigate correctly

4. **Check mobile view**:
   - View on mobile device or resize browser
   - Ensure tables are responsive
   - Check readability

---

## Suggested Wiki Structure

Consider organizing your wiki with this structure:

```
Home
├── Getting Started
├── Features
│   ├── Sticky Header ← NEW
│   ├── Responsive Visibility ← NEW
│   ├── Section Block
│   ├── Row Block (Flex)
│   └── Grid Block
├── Blocks
│   ├── Container Blocks
│   ├── Layout Blocks
│   └── Interactive Blocks
├── Extensions
├── Troubleshooting
└── FAQ
```

To create this structure:

1. Create a "Features" page
2. Link to Sticky Header and Responsive Visibility from Features
3. Link to Features from Home

---

## Maintaining the Documentation

### When to Update

Update the wiki documentation when:
- Features are added or changed
- Bugs are fixed that affect user experience
- Common support questions arise
- Screenshots or examples need updating

### Best Practices

- ✅ Keep documentation in sync with code
- ✅ Add examples for common use cases
- ✅ Include troubleshooting steps
- ✅ Use screenshots where helpful
- ✅ Link between related pages
- ✅ Test all code examples
- ✅ Update version numbers if applicable

### Version Management

Consider adding version info to docs:

```markdown
> **Version**: 1.0.0
> **Last Updated**: 2025-11-12
> **Minimum WordPress**: 6.4
```

---

## Getting Help

If you encounter issues uploading to the wiki:

1. Check GitHub permissions - you need write access
2. Ensure wiki is enabled in repository settings
3. Try incognito/private browsing mode
4. Clear browser cache
5. Contact GitHub support if issues persist

---

## Files Created

The following documentation files have been created in `docs/wiki/`:

1. **Sticky-Header.md** (7,500+ words)
   - Complete feature documentation
   - Step-by-step guides
   - Configuration options
   - Troubleshooting
   - Use cases and examples

2. **Responsive-Visibility.md** (8,000+ words)
   - Complete feature documentation
   - Device breakpoint details
   - Visual editor indicators
   - Common use cases
   - Best practices
   - SEO and accessibility considerations
   - FAQ section

Both files are ready to be copied directly to your GitHub wiki!

---

## Next Steps

1. Upload both files to the wiki using Option 1 (easiest)
2. Update your wiki Home page with links
3. Consider adding screenshots to enhance the documentation
4. Share the wiki links in your README.md

**Direct Wiki URL**: https://github.com/jnealey88/designsetgo/wiki
