# Icon Search Aliases

## Problem

Icon blocks use specific canonical names (e.g., `envelope`, `lightning`, `circle-check`) but users often search using common synonyms (`email`, `zap`, `check-circle`). This affects both:

1. **IconPicker search** — typing "email" returns no results even though the envelope icon exists
2. **LLM-generated markup** — an LLM might output `icon: "email"` instead of `icon: "envelope"`, causing a broken block

## Solution

A curated alias map in `svg-icons.js` that maps ~250 alternative names to canonical icon names.

### Changes

1. **`src/blocks/icon/utils/svg-icons.js`**
   - `ICON_ALIASES` — object mapping alias strings to canonical icon names
   - `resolveIconName(name)` — returns the canonical name for any alias (or the input unchanged if already canonical)
   - `getIconAliases()` — returns reverse map (canonical → alias array) for search
   - `getIcon()` — updated to call `resolveIconName()` before SVG lookup

2. **`src/blocks/icon/components/IconPicker.js`**
   - Search filter checks both icon names and their aliases

3. **`src/blocks/shared/icon-utils.js`**
   - Exports `resolveIconName` and `getIconAliases` for other blocks

### Design Decisions

- **Curated aliases only** — no keyword tags or fuzzy matching; keeps results predictable
- **Co-located in svg-icons.js** — single source of truth for all icon metadata
- **Resolves in both search and rendering** — prevents broken blocks from LLM output
- **IconPicker only** — block inserter keywords unchanged (inserter finds blocks, not specific icons)
