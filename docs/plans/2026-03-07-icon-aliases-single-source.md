# Icon Aliases: Single Source of Truth

**Date**: 2026-03-07
**Status**: In Progress
**PR**: #294 follow-up

## Problem

The icon alias map is duplicated in two places:
- `src/blocks/icon/utils/svg-icons.js` (~350 lines) — JS `ICON_ALIASES` object
- `includes/icon-svg-library.php` (~350 lines) — PHP `dsgo_get_icon_aliases()` array

These must stay in sync manually. A comment says "Must be kept in sync" but there's no enforcement. Drift is inevitable.

## Solution

Extract the alias map into `includes/data/icon-aliases.json`. Both JS and PHP read from this single file.

### File: `includes/data/icon-aliases.json`

Flat JSON object mapping alias to canonical icon name. No comments (JSON limitation) — the values are self-documenting.

### JS consumption

Webpack handles JSON imports natively:
```js
import ICON_ALIASES from '../../../data/icon-aliases.json';
```

All downstream code (`resolveIconName`, `getIconAliases`, `getIcon`) references `ICON_ALIASES` unchanged.

### PHP consumption

```php
function dsgo_get_icon_aliases() {
    static $aliases = null;
    if ( null !== $aliases ) {
        return $aliases;
    }
    $file = plugin_dir_path( __DIR__ ) . 'includes/data/icon-aliases.json';
    if ( ! file_exists( $file ) ) {
        $aliases = array();
        return $aliases;
    }
    $aliases = json_decode( file_get_contents( $file ), true );
    return $aliases;
}
```

Static cache preserves current performance characteristics. Guard clause handles missing file edge case.

## Changes

| File | Action |
|------|--------|
| `includes/data/icon-aliases.json` | Create (~180 lines) |
| `src/blocks/icon/utils/svg-icons.js` | Remove inline ICON_ALIASES, add JSON import |
| `includes/icon-svg-library.php` | Replace hardcoded array with JSON file read |
| `includes/class-icon-injector.php` | No changes (calls `dsgo_get_icon_aliases()`) |

Net: ~700 lines removed, ~180-line JSON file created, two 1-line imports added.

## Testing

- `npm run build` — webpack fails if JSON path is wrong
- Editor: icon picker resolves aliases (search "zap" shows lightning)
- Frontend: aliased icons render correctly
