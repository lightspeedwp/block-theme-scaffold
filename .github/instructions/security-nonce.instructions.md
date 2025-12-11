---
name: "Security Nonce Standards"
description: "Coding standards for WordPress nonce implementation in block themes"
applyTo: "**/*.{php,js,jsx,ts,tsx}"
---

# Security Nonce Coding Standards

## Purpose

This instruction file provides coding standards for implementing WordPress nonce verification in block theme development. AI agents and developers must follow these standards when creating or modifying code that handles user input, AJAX requests, or REST API endpoints.

## When to Apply

Apply these standards when:

- Creating AJAX endpoints
- Implementing custom REST API routes
- Processing admin forms
- Handling user-submitted data
- Creating state-changing operations
- Implementing admin actions

## Nonce Utility Functions

The theme provides standardized nonce utilities in `inc/nonce.php`:

### Available Functions

```php
/**
 * Build a namespaced nonce action
 *
 * @param string $suffix Action suffix (e.g., 'frontend', 'admin', 'api')
 * @return string Namespaced nonce action
 */
function lswp_theme_nonce_action($suffix)

/**
 * Create a nonce for the given action
 *
 * @param string $action Nonce action
 * @return string Nonce value
 */
function lswp_theme_create_nonce($action)

/**
 * Verify request nonce from GET/POST
 *
 * @param string $action Nonce action to verify
 * @param string $param  Nonce parameter name (default: '_wpnonce')
 * @return bool True if nonce is valid
 */
function lswp_theme_verify_request_nonce($action, $param = '_wpnonce')

/**
 * Verify REST API nonce from request
 *
 * @param WP_REST_Request $request REST request object
 * @param string          $action  Optional nonce action (default: 'wp_rest')
 * @return bool True if nonce is valid
 */
function lswp_theme_verify_rest_nonce($request, $action = 'wp_rest')
```

## Coding Standards

### 1. Always Verify Nonces for State-Changing Operations

**✅ CORRECT:**

```php
add_action('wp_ajax_block_theme_example', function () {
    // Always verify nonce first
    if (!lswp_theme_verify_request_nonce(lswp_theme_nonce_action('frontend'))) {
        wp_send_json_error(['message' => 'Invalid nonce'], 403);
    }

    // Process request
    wp_send_json_success(['message' => 'OK']);
});
```

**❌ INCORRECT:**

```php
add_action('wp_ajax_block_theme_example', function () {
    // Missing nonce verification!
    wp_send_json_success(['message' => 'OK']);
});
```

### 2. Use Theme-Prefixed Nonce Actions

**✅ CORRECT:**

```php
// Use the nonce action helper
$action = lswp_theme_nonce_action('frontend');
$nonce = lswp_theme_create_nonce($action);

// Or create custom action with prefix
$action = 'lswp_theme_custom_action';
$nonce = wp_create_nonce($action);
```

**❌ INCORRECT:**

```php
// Generic action without theme prefix
$nonce = wp_create_nonce('frontend');

// Risk of collision with other themes/plugins
$nonce = wp_create_nonce('ajax_action');
```

### 3. REST API Nonce Verification

**✅ CORRECT:**

```php
register_rest_route('block-theme/v1', '/endpoint', [
    'methods' => 'POST',
    'callback' => function ($request) {
        // Verify REST nonce
        if (!lswp_theme_verify_rest_nonce($request)) {
            return new WP_Error(
                'rest_forbidden',
                'Invalid nonce',
                ['status' => 403]
            );
        }

        return ['status' => 'success'];
    },
    'permission_callback' => '__return_true',
]);
```

**❌ INCORRECT:**

```php
register_rest_route('block-theme/v1', '/endpoint', [
    'methods' => 'POST',
    'callback' => function ($request) {
        // Missing nonce verification!
        return ['status' => 'success'];
    },
    'permission_callback' => '__return_true',
]);
```

### 4. Admin Form Nonce Implementation

**✅ CORRECT:**

```php
// In form template:
<form method="post">
    <?php wp_nonce_field('lswp_theme_admin_action', 'lswp_theme_nonce'); ?>
    <input type="text" name="field" />
    <button type="submit">Submit</button>
</form>

// In handler:
if (isset($_POST['lswp_theme_nonce'])) {
    if (!check_admin_referer('lswp_theme_admin_action', 'lswp_theme_nonce')) {
        wp_die('Invalid nonce');
    }

    // Process form
}
```

**❌ INCORRECT:**

```php
// Missing nonce field in form:
<form method="post">
    <input type="text" name="field" />
    <button type="submit">Submit</button>
</form>

// Missing nonce verification in handler:
if (isset($_POST['field'])) {
    // Process form without verification!
}
```

### 5. JavaScript Nonce Usage

**✅ CORRECT:**

```javascript
// Localize nonce in PHP:
wp_localize_script('theme-script', 'BlockTheme', [
    'nonce' => wp_create_nonce(lswp_theme_nonce_action('frontend')),
    'ajaxurl' => admin_url('admin-ajax.php'),
]);

// Use in JavaScript:
fetch(BlockTheme.ajaxurl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
        action: 'block_theme_example',
        _wpnonce: BlockTheme.nonce,
        data: 'value'
    })
});
```

**❌ INCORRECT:**

```javascript
// Missing nonce in request:
fetch(ajaxurl, {
  method: "POST",
  body: new URLSearchParams({
    action: "block_theme_example",
    data: "value",
  }),
});
```

### 6. REST API JavaScript Usage

**✅ CORRECT:**

```javascript
// WordPress provides wpApiSettings with REST nonce
fetch("/wp-json/block-theme/v1/endpoint", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-WP-Nonce": wpApiSettings.nonce,
  },
  body: JSON.stringify({ data: "value" }),
});
```

**❌ INCORRECT:**

```javascript
// Missing X-WP-Nonce header:
fetch("/wp-json/block-theme/v1/endpoint", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ data: "value" }),
});
```

## Implementation Patterns

### Pattern 1: AJAX Handler

```php
/**
 * Register AJAX handler with nonce verification
 */
add_action('wp_ajax_theme_action', 'lswp_theme_ajax_handler');
add_action('wp_ajax_nopriv_theme_action', 'lswp_theme_ajax_handler');

function lswp_theme_ajax_handler() {
    // 1. Verify nonce first
    if (!lswp_theme_verify_request_nonce(lswp_theme_nonce_action('frontend'))) {
        wp_send_json_error(['message' => 'Invalid nonce'], 403);
    }

    // 2. Check capabilities if needed
    if (!current_user_can('edit_posts')) {
        wp_send_json_error(['message' => 'Insufficient permissions'], 403);
    }

    // 3. Validate input
    if (!isset($_POST['data']) || !is_string($_POST['data'])) {
        wp_send_json_error(['message' => 'Invalid input'], 400);
    }

    // 4. Sanitize input
    $data = sanitize_text_field(wp_unslash($_POST['data']));

    // 5. Process request
    $result = process_data($data);

    // 6. Send response
    wp_send_json_success(['result' => $result]);
}
```

### Pattern 2: REST API Route

```php
/**
 * Register REST API route with nonce verification
 */
add_action('rest_api_init', function () {
    register_rest_route('block-theme/v1', '/endpoint', [
        'methods' => 'POST',
        'callback' => 'lswp_theme_rest_handler',
        'permission_callback' => '__return_true',
        'args' => [
            'data' => [
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
                'validate_callback' => function ($param) {
                    return is_string($param) && !empty($param);
                },
            ],
        ],
    ]);
});

function lswp_theme_rest_handler($request) {
    // 1. Verify nonce
    if (!lswp_theme_verify_rest_nonce($request)) {
        return new WP_Error(
            'rest_forbidden',
            'Invalid nonce',
            ['status' => 403]
        );
    }

    // 2. Check capabilities if needed
    if (!current_user_can('edit_posts')) {
        return new WP_Error(
            'rest_forbidden',
            'Insufficient permissions',
            ['status' => 403]
        );
    }

    // 3. Get validated parameter
    $data = $request->get_param('data');

    // 4. Process request
    $result = process_data($data);

    // 5. Return response
    return rest_ensure_response([
        'status' => 'success',
        'result' => $result,
    ]);
}
```

### Pattern 3: Admin Form

```php
/**
 * Render admin form with nonce
 */
function lswp_theme_render_admin_form() {
    ?>
    <div class="wrap">
        <h1><?php echo esc_html__('Settings', 'theme-slug'); ?></h1>

        <form method="post" action="">
            <?php
            // Add nonce field
            wp_nonce_field('lswp_theme_save_settings', 'lswp_theme_settings_nonce');
            ?>

            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="setting_field">
                            <?php echo esc_html__('Setting', 'theme-slug'); ?>
                        </label>
                    </th>
                    <td>
                        <input
                            type="text"
                            id="setting_field"
                            name="setting_field"
                            value="<?php echo esc_attr(get_option('setting_field', '')); ?>"
                        />
                    </td>
                </tr>
            </table>

            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

/**
 * Process admin form with nonce verification
 */
add_action('admin_init', function () {
    if (!isset($_POST['lswp_theme_settings_nonce'])) {
        return;
    }

    // 1. Verify nonce
    if (!check_admin_referer('lswp_theme_save_settings', 'lswp_theme_settings_nonce')) {
        wp_die('Invalid nonce');
    }

    // 2. Check capabilities
    if (!current_user_can('manage_options')) {
        wp_die('Insufficient permissions');
    }

    // 3. Validate and sanitize
    if (isset($_POST['setting_field'])) {
        $value = sanitize_text_field(wp_unslash($_POST['setting_field']));
        update_option('setting_field', $value);
    }

    // 4. Redirect with success message
    wp_safe_redirect(add_query_arg('settings-updated', 'true', wp_get_referer()));
    exit;
});
```

## Error Handling

### Consistent Error Responses

**AJAX:**

```php
// 403 Forbidden for invalid nonce
wp_send_json_error(['message' => 'Invalid nonce'], 403);

// 400 Bad Request for invalid input
wp_send_json_error(['message' => 'Invalid input'], 400);

// 401 Unauthorized for auth issues
wp_send_json_error(['message' => 'Unauthorized'], 401);
```

**REST API:**

```php
// 403 Forbidden for invalid nonce
return new WP_Error('rest_forbidden', 'Invalid nonce', ['status' => 403]);

// 400 Bad Request for invalid input
return new WP_Error('rest_invalid_param', 'Invalid parameter', ['status' => 400]);

// 401 Unauthorized for auth issues
return new WP_Error('rest_forbidden', 'Unauthorized', ['status' => 401]);
```

## Testing Requirements

All nonce implementations must include tests:

```php
/**
 * Test nonce creation
 */
public function test_nonce_creation() {
    $action = lswp_theme_nonce_action('frontend');
    $nonce = lswp_theme_create_nonce($action);

    $this->assertNotEmpty($nonce);
    $this->assertTrue(wp_verify_nonce($nonce, $action));
}

/**
 * Test nonce verification success
 */
public function test_nonce_verification_success() {
    $action = lswp_theme_nonce_action('frontend');
    $_REQUEST['_wpnonce'] = wp_create_nonce($action);

    $this->assertTrue(lswp_theme_verify_request_nonce($action));
}

/**
 * Test nonce verification failure
 */
public function test_nonce_verification_failure() {
    $action = lswp_theme_nonce_action('frontend');
    $_REQUEST['_wpnonce'] = 'invalid_nonce';

    $this->assertFalse(lswp_theme_verify_request_nonce($action));
}

/**
 * Test REST nonce verification
 */
public function test_rest_nonce_verification() {
    $user_id = $this->factory->user->create(['role' => 'administrator']);
    wp_set_current_user($user_id);

    $request = new WP_REST_Request('POST', '/block-theme/v1/endpoint');
    $request->set_header('X-WP-Nonce', wp_create_nonce('wp_rest'));

    $this->assertTrue(lswp_theme_verify_rest_nonce($request));
}
```

## PHPCS Rules

These WordPress sniffs validate nonce usage:

- `WordPress.Security.NonceVerification.Recommended` - Nonce verification recommended
- `WordPress.Security.NonceVerification.Missing` - Nonce verification required
- `WordPress.Security.ValidatedSanitizedInput` - Input must be validated/sanitized

Suppress only when absolutely necessary with clear justification:

```php
// phpcs:ignore WordPress.Security.NonceVerification.Missing -- Nonce verified in parent function
```

## Common Mistakes to Avoid

### ❌ Mistake 1: No Nonce Verification

```php
// NEVER do this:
add_action('wp_ajax_my_action', function () {
    update_option('my_option', $_POST['value']); // Dangerous!
});
```

### ❌ Mistake 2: Incorrect Nonce Parameter

```php
// NEVER do this:
wp_verify_nonce($_POST['nonce'], 'my_action'); // 'nonce' instead of '_wpnonce'
```

### ❌ Mistake 3: Generic Nonce Actions

```php
// NEVER do this:
$nonce = wp_create_nonce('action'); // Too generic, risk of collision
```

### ❌ Mistake 4: Bypassing Verification

```php
// NEVER do this:
if (true || !wp_verify_nonce($_POST['_wpnonce'], 'action')) {
    // Process anyway
}
```

### ❌ Mistake 5: Missing REST Nonce Header

```javascript
// NEVER do this:
fetch("/wp-json/my-plugin/v1/endpoint", {
  method: "POST",
  body: JSON.stringify({}), // Missing X-WP-Nonce header!
});
```

## Agent Instructions

When creating or modifying code:

1. **Always add nonce verification** for state-changing operations
2. **Use theme-prefixed actions** with `lswp_theme_nonce_action()`
3. **Verify before processing** - nonce check comes first
4. **Return proper HTTP status codes** (403 for invalid nonce)
5. **Include tests** for all nonce implementations
6. **Document nonce requirements** in function docblocks
7. **Localize nonces** properly for JavaScript usage
8. **Use REST nonce verification** for REST API endpoints

## Related Documentation

- [SECURITY.md](../../docs/SECURITY.md) - Complete security guide
- [VALIDATION.md](../../docs/VALIDATION.md) - Security validation reference
- [TESTING.md](../../docs/TESTING.md) - Testing requirements
- [inc/nonce.php](../../inc/nonce.php) - Nonce utility implementation

## External Resources

- [WordPress Nonces](https://developer.wordpress.org/apis/security/nonces/)
- [WordPress AJAX](https://developer.wordpress.org/plugins/javascript/ajax/)
- [WordPress REST API Authentication](https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/)
- [WordPress Security Handbook](https://developer.wordpress.org/apis/security/)

## Version History

| Date       | Change                                        |
| ---------- | --------------------------------------------- |
| 2025-12-07 | Initial security nonce coding standards       |
| 2025-12-07 | Added comprehensive patterns and examples     |
| 2025-12-07 | Added testing requirements and error handling |
