---
description: Update translation files and check for untranslated strings
---

Manage internationalization for the DesignSetGo plugin.

## Quick Commands

**Find untranslated strings:**

```bash
# JavaScript strings missing translation
grep -r "'[A-Z][a-z]" src/ --include="*.js" | grep -v "__(" | grep -v "//"

# Strings missing text domain
grep -r "__(" src/ includes/ | grep -v "'designsetgo'"
```

**Generate POT file:**

```bash
npx wp i18n make-pot . languages/designsetgo.pot
```

**Update PO files:**

```bash
# For each language
msgmerge --update languages/designsetgo-nl_NL.po languages/designsetgo.pot
msgmerge --update languages/designsetgo-es_ES.po languages/designsetgo.pot
```

**Compile MO files:**

```bash
msgfmt languages/designsetgo-nl_NL.po -o languages/designsetgo-nl_NL.mo
msgfmt languages/designsetgo-es_ES.po -o languages/designsetgo-es_ES.mo
```

## Full Workflow

### 1. Find Untranslated Strings

Scan codebase for hardcoded strings or missing text domains.

### 2. Fix Translation Issues

**Common issues:**

```javascript
// ❌ BAD - Hardcoded string
console.log('Block loaded');

// ✅ GOOD - Translated
console.log(__('Block loaded', 'designsetgo'));

// ❌ BAD - String concatenation
const msg = 'You have ' + count + ' items';

// ✅ GOOD - Use sprintf
const msg = sprintf(__('You have %d items', 'designsetgo'), count);

// ❌ BAD - Missing translator comment
__('Save', 'designsetgo')

// ✅ GOOD - With context
/* translators: Button label to save block settings */
__('Save', 'designsetgo')
```

### 3. Generate POT File

Create or update the template file with all translatable strings.

### 4. Update Language Files

Merge new strings into existing translations. Translators will fill in missing translations.

### 5. Compile MO Files

Convert human-readable PO files to machine-readable MO files.

### 6. Test Translations

**In WordPress:**

1. Go to Settings → General
2. Change Site Language
3. Check all block labels, descriptions, and controls
4. Verify strings appear in target language

**Test RTL Languages:**

For Arabic, Hebrew:

1. Switch language in WordPress
2. Check layout doesn't break
3. Verify `style-rtl.css` is loaded

## Best Practices

**Always:**
- Use `__('String', 'designsetgo')` for translatable strings
- Add translator comments for ambiguous strings
- Use `sprintf()` for variable interpolation
- Test with RTL languages

**Never:**
- Translate URLs, code, or HTML tags
- Concatenate translated strings
- Use variables in translation strings (use placeholders)

## Common Translation Functions

```javascript
// Simple translation
__('Text', 'designsetgo')

// Translation with echo
_e('Text', 'designsetgo')

// Singular/plural
_n('%d item', '%d items', count, 'designsetgo')

// Translation with context
_x('Post', 'noun', 'designsetgo')
_x('Post', 'verb', 'designsetgo')
```

## Before Committing

Always check for untranslated strings:

```bash
npm run lint:i18n  # If you have this script
```

## Reference

- [WordPress I18n Documentation](https://developer.wordpress.org/plugins/internationalization/)
- [Plugin Handbook: I18n](https://developer.wordpress.org/plugins/internationalization/how-to-internationalize-your-plugin/)
