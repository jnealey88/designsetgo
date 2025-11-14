# DesignSetGo Translation Guide

## Current Status

- **Total strings to translate per language:** 1,530
- **Languages needed:** 9 (Spanish, French, German, Italian, Portuguese (Brazil), Japanese, Chinese (Simplified), Dutch, Russian)
- **Total translations needed:** 13,770

## Initial Progress

### Completed Translations

**Spanish (es_ES):** 164 strings translated (~11%)
**French (fr_FR):** 156 strings translated (~10%)

### Remaining Work

- **Spanish:** 1,366 strings
- **French:** 1,374 strings
- **German:** 1,530 strings
- **Italian:** 1,530 strings
- **Portuguese (Brazil):** 1,530 strings
- **Japanese:** 1,530 strings
- **Chinese (Simplified):** 1,530 strings
- **Dutch:** 1,530 strings
- **Russian:** 1,530 strings

**Total remaining:** ~13,450 translations

## Recommended Approaches

### Option 1: Professional Translation Services (Recommended)

Use a professional WordPress translation service:

- **GlotPress/WordPress.org Translation**: Submit plugin to WordPress.org and use community translations
- **WPML**: WordPress Multilingual Plugin with professional translation services
- **Weglot**: Automatic translation service for WordPress
- **TranslatePress**: WordPress translation plugin with automatic translation

### Option 2: AI Translation APIs

Use translation APIs to automate the process:

1. **Google Cloud Translation API**
   - Cost: ~$20/million characters
   - High quality, supports all required languages
   - Code example provided in `google_translate_example.py`

2. **DeepL API**
   - Cost: €4.99/month for 500,000 characters
   - Very high quality translations
   - Supports: ES, FR, DE, IT, PT-BR, JA, ZH, NL, RU

3. **LibreTranslate (Free & Open Source)**
   - Free self-hosted option
   - Good quality for basic translations
   - May need post-editing

### Option 3: WordPress Translation Plugins

Install and use WordPress translation plugins that automate PO file translation:

1. **Loco Translate** + Machine Translation add-on
2. **WPML** with automatic translation
3. **Weglot** (handles PO files)

### Option 4: Manual Translation with Tools

Use translation management tools:

1. **Poedit Pro** ($99) - Has machine translation built-in
2. **POEditor** (online) - Collaborative translation platform
3. **Crowdin** - Community translation platform

## Files Provided

### Translation Scripts

1. **`auto_translate.py`**
   - Python script with comprehensive translation mappings
   - Currently handles ~160 common strings per language
   - Extensible - add more translations to dictionaries

2. **`untranslated_strings.txt`**
   - List of all untranslated strings
   - Use for reference or batch processing

3. **`msgids_to_translate.txt`**
   - Complete list of all msgids from POT template
   - Use as source for translation projects

### Usage

Run the Python script:
```bash
cd /Users/jnealey/Documents/GitHub/designsetgo/languages
python3 auto_translate.py
```

## Translation Guidelines

### What to Translate

✅ **DO translate:**
- UI labels and buttons
- Block names and descriptions
- Error messages and notifications
- Form field labels
- Help text and tooltips
- Settings and options

❌ **DON'T translate:**
- Technical terms: Flexbox, CSS, HTML, JavaScript, JSON, API, AJAX, URL, ID, ARIA
- Plugin name: DesignSetGo
- URLs: https://designsetgoblocks.com
- File names and paths
- Code examples
- Placeholder patterns: %s, %d, %1$s
- HTML tags: `<strong>`, `<em>`, etc.

### Translation Best Practices

1. **Preserve Placeholders**
   - Original: "Inner block at index %d is missing a valid name."
   - Spanish: "El bloque interior en el índice %d no tiene un nombre válido."

2. **Preserve HTML Tags**
   - Original: "Click <strong>Save</strong> to continue."
   - Spanish: "Haz clic en <strong>Guardar</strong> para continuar."

3. **Match WordPress Terminology**
   - Use official WordPress translations for core terms
   - Check wordpress.org translations for your language

4. **UI Text Length**
   - Keep translations concise for buttons and labels
   - Some languages (German) tend to be longer - test in UI

5. **Tone**
   - Use informal/friendly tone (tú/vous form)
   - Match WordPress core tone for consistency

### WordPress Terminology Reference

Use these official WordPress translations:

- **Post** = Entrada (ES), Article (FR), Beitrag (DE)
- **Page** = Página (ES), Page (FR), Seite (DE)
- **Block** = Bloque (ES), Bloc (FR), Block (DE)
- **Settings** = Ajustes (ES), Réglages (FR), Einstellungen (DE)

## Quick Start Guide

### For Non-Technical Users

1. **Use Poedit Pro** ($99 one-time)
   - Open each `.po` file
   - Click "Pre-translate" → Use machine translation
   - Review and adjust translations
   - Save files

2. **Use Loco Translate WordPress Plugin**
   - Install plugin on WordPress site
   - Go to Loco Translate → Plugins → DesignSetGo
   - Use built-in machine translation
   - Edit and save

### For Developers

1. **Use Translation API** (see code examples)
   - Google Cloud Translation API
   - DeepL API
   - LibreTranslate API

2. **Extend Python Script**
   - Add translations to dictionaries in `auto_translate.py`
   - Run script: `python3 auto_translate.py`
   - Review and test

## Testing Translations

### In WordPress

1. Install language pack:
   ```bash
   wp language core install es_ES
   ```

2. Set site language:
   ```bash
   wp site switch-language es_ES
   ```

3. Test in block editor:
   - Create new post
   - Insert DesignSetGo blocks
   - Verify all text is translated correctly
   - Check for truncated text or layout issues

### Validation

Run WP-CLI validation:
```bash
wp i18n make-pot . languages/designsetgo.pot
wp i18n make-json languages/designsetgo-es_ES.po --no-purge
```

Check for errors:
```bash
msgfmt -cv languages/designsetgo-es_ES.po
```

## Common Issues

### Issue: Translations Don't Appear

**Solutions:**
1. Clear WordPress caches
2. Regenerate JSON files: `wp i18n make-json`
3. Check file permissions
4. Verify PO file syntax

### Issue: Garbled Characters

**Solutions:**
1. Ensure files are UTF-8 encoded
2. Check BOM (Byte Order Mark) - remove if present
3. Verify special characters are properly escaped

### Issue: Partial Translations

**Solutions:**
1. Check for empty `msgstr` entries
2. Verify plural forms are translated
3. Rebuild MO files: `msgfmt languages/designsetgo-es_ES.po -o languages/designsetgo-es_ES.mo`

## Cost Estimates

### Professional Translation Services

- **Human translation**: $0.10-0.25/word × ~15,000 words = $1,500-3,750 per language
- **Total (9 languages)**: $13,500-33,750

### Machine Translation APIs

- **Google Translate**: ~$20/million characters × ~200,000 characters = $4
- **DeepL Pro**: €24.99/month for up to 100,000 characters/month
- **Total for all languages**: $40-100

### WordPress Plugins with Translation

- **WPML**: $99/year
- **Weglot**: $15/month (includes all languages)
- **TranslatePress**: $89/year

## Next Steps

1. **Choose translation approach** based on budget and quality needs
2. **Set up translation workflow**
3. **Translate priority languages first** (e.g., Spanish, French, German)
4. **Test translations in WordPress**
5. **Get native speaker review** for quality assurance
6. **Submit to WordPress.org** for community contributions

## Support

For translation questions or issues:
- WordPress Translation Handbook: https://make.wordpress.org/polyglots/handbook/
- GlotPress: https://translate.wordpress.org/
- Plugin Support: https://designsetgoblocks.com/support/

---

**Created:** 2025-11-07
**Plugin:** DesignSetGo v1.0.0
**Total Strings:** 1,530 per language
**Languages:** 9
