# REST API quick guide (`wp-abilities/v1`)

The Abilities API exposes endpoints under the REST namespace `wp-abilities/v1`. All endpoints require authentication. Abilities must have `show_in_rest => true` to appear.

## Endpoints

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `GET /wp-abilities/v1/abilities` | `GET` | List all abilities |
| `GET /wp-abilities/v1/{namespace}/{ability}` | `GET` | Retrieve a single ability definition |
| `GET /wp-abilities/v1/categories` | `GET` | List all categories |
| `GET\|POST\|DELETE /wp-abilities/v1/{namespace}/{ability}/run` | Varies | Execute an ability |

### List abilities

```
GET /wp-json/wp-abilities/v1/abilities?page=1&per_page=25&category=my-plugin
```

Query parameters: `page`, `per_page` (max 100), `category`.

### Retrieve single ability

```
GET /wp-json/wp-abilities/v1/my-plugin/get-info
```

Returns the full ability definition including schema and annotations.

### Execute ability (`/run`)

```
GET|POST|DELETE /wp-json/wp-abilities/v1/{namespace}/{ability}/run
```

HTTP method is determined by the ability's `annotations`:

| Annotation | HTTP Method |
| ---------- | ----------- |
| `readonly: true` | `GET` |
| `destructive: true` | `DELETE` |
| Neither set | `POST` (default) |

**Examples:**

```bash
# Readonly ability (GET)
curl -u "admin:app_password" \
  "http://yoursite.com/wp-json/wp-abilities/v1/designsetgo/list-blocks/run?category=layout"

# Modification ability (POST)
curl -X POST -u "admin:app_password" \
  "http://yoursite.com/wp-json/wp-abilities/v1/designsetgo/insert-flex-container/run" \
  -H "Content-Type: application/json" \
  -d '{"post_id": 123, "attributes": {"direction": "row"}}'

# Using ?rest_route= (when pretty permalinks are off)
curl -X POST -u "admin:app_password" \
  "http://yoursite.com/?rest_route=/wp-abilities/v1/designsetgo/insert-flex-container/run" \
  -H "Content-Type: application/json" \
  -d '{"input": {"post_id": 123}}'
```

## Authentication

All endpoints require authentication. Unauthenticated requests return `rest_ability_not_found`.

Supported methods:
- **Application Passwords** (recommended) — HTTP Basic Auth with `username:app_password`
- **Cookie Authentication** — for logged-in users in the browser
- **Custom auth plugins** — OAuth 2.0, JWT, etc.

## Error codes

| Code | HTTP Status | Description |
| ---- | ----------- | ----------- |
| `rest_ability_not_found` | 404 | Ability not found or `show_in_rest` is `false` |
| `ability_missing_input_schema` | 400 | Ability requires input but none provided |
| `ability_invalid_input` | 400 | Input failed JSON Schema validation |
| `ability_invalid_permissions` | 403 | User lacks required permissions |
| `ability_invalid_output` | 500 | Output failed schema validation (server error) |

## Debug checklist

1. Confirm the route exists: `curl http://yoursite.com/wp-json/wp-abilities/v1/abilities`
2. Verify the ability shows in REST responses (check `show_in_rest => true`)
3. If missing, confirm the ability is registered during `wp_abilities_api_init`
4. Check authentication — unauthenticated requests always return 404
5. For DesignSetGo abilities: ensure the plugin is active and WordPress 6.9+ is running

## References

- REST API endpoints: https://developer.wordpress.org/apis/abilities-api/rest-api-endpoints/
- Abilities API handbook: https://developer.wordpress.org/apis/abilities-api/
