---
title: Security Guide
description: Security implementation guide for WordPress block themes
category: Development
type: Guide
audience: Developers
date: 2025-12-07
---

# Security Guide

## Overview

This guide covers security implementation for WordPress block themes, including security headers, nonce verification, and best practices. While block themes primarily use declarative HTML templates, security remains essential for AJAX endpoints, REST API routes, admin actions, and user-submitted data processing.

## Table of Contents

- [Security Headers](#security-headers)
- [Nonce Verification](#nonce-verification)
- [Best Practices](#best-practices)
- [Validation](#validation)
- [Related Documentation](#related-documentation)

## Security Headers

Block themes should implement the same security headers as plugins. Prefer server configuration for performance; use WordPress-level headers when server config is unavailable.

### Recommended Headers

- **Strict-Transport-Security (HSTS):** `max-age=31536000; includeSubDomains`
- **Content-Security-Policy (CSP):** Start strict and relax as needed; prefer nonces for inline scripts.
- **X-Content-Type-Options:** `nosniff`
- **Referrer-Policy:** `strict-origin-when-cross-origin`
- **Permissions-Policy:** Disable unused APIs: `geolocation=(), camera=(), microphone=()`
- **X-Frame-Options / frame-ancestors:** `SAMEORIGIN` (or CSP `frame-ancestors 'self'`)
- **Cross-Origin-Opener-Policy:** `same-origin`
- **Cross-Origin-Resource-Policy:** `same-origin`

### Apache Configuration

Add to `.htaccess`:

```apacheconf
<IfModule mod_headers.c>
  # Only on HTTPS
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains" env=HTTPS

  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set Permissions-Policy "geolocation=(), camera=(), microphone=()"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set Cross-Origin-Opener-Policy "same-origin"
  Header set Cross-Origin-Resource-Policy "same-origin"

  # Baseline CSP — adjust for your theme assets and third-parties
  Header set Content-Security-Policy "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data: https:"
</IfModule>
```

### NGINX Configuration

Add to server/location blocks:

```nginx
# Security Headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), camera=(), microphone=()" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Resource-Policy "same-origin" always;

# Baseline CSP — adjust for your theme assets and third-parties
add_header Content-Security-Policy "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data: https:" always;
```

### WordPress-Level Headers

Use when you must scope headers or cannot modify the server. Test thoroughly.

**File:** `functions.php`

```php
add_action('send_headers', function () {
    if (is_admin()) {
        return; // Skip admin area
    }

    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: geolocation=(), camera=(), microphone=()');
    header('X-Frame-Options: SAMEORIGIN');
    header('Cross-Origin-Opener-Policy: same-origin');
    header('Cross-Origin-Resource-Policy: same-origin');

    // Optional CSP with nonce (advanced):
    // Generate a per-request nonce and attach to enqueued <script> tags.
    $nonce = base64_encode(random_bytes(18));
    header("Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-$nonce'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:");

    add_filter('script_loader_tag', function ($tag, $handle, $src) use ($nonce) {
        // Inject nonce attribute into script tag.
        return str_replace('<script ', '<script nonce="' . esc_attr($nonce) . '" ', $tag);
    }, 10, 3);
});
```

### Header Implementation Notes

- Block themes often require `'unsafe-inline'` for `style-src` due to inline block styles. Work toward removing this by externalizing styles.
- Tighten CSP over time: list CDN domains you rely on (e.g., `https://cdn.example`) and remove `'unsafe-inline'` where feasible.
- Scope WordPress-level headers to frontend only if needed: wrap in `!is_admin()` checks.

### Verification

Verify security headers implementation:

**Browser DevTools:**

1. Open Developer Tools
2. Navigate to Network tab
3. Reload page
4. Select document request
5. Check Response Headers section

**Command Line:**

```bash
curl -I https://example.com/
```

**External Scanners:**

- [securityheaders.com](https://securityheaders.com)
- [Mozilla Observatory](https://observatory.mozilla.org)
- Lighthouse Best Practices audit

### Rollout Tips

- Start on staging; monitor console errors.
- Log CSP violations with a `report-to`/`report-uri` endpoint during rollout.
- Document exceptions (third-party domains, iframes) and revisit periodically.
- Test thoroughly with browser DevTools console open.
- Gradually tighten policies as you identify and fix issues.

## Nonce Verification

Block themes primarily use declarative HTML templates, but nonces remain essential for:

- AJAX endpoints
- Custom REST API routes
- Admin actions and forms
- User-submitted data processing

### Nonce Utilities

The theme includes generic nonce helpers in `inc/nonce.php` with the `lswp_theme_*` prefix.

**Available Functions:**

- **`lswp_theme_nonce_action($suffix)`**: Builds a namespaced nonce action.
- **`lswp_theme_create_nonce($action)`**: Creates a nonce for the given action.
- **`lswp_theme_verify_request_nonce($action, $param)`**: Verifies `_wpnonce` from `GET`/`POST`.
- **`lswp_theme_verify_rest_nonce($request, $action)`**: Verifies `X-WP-Nonce` for REST requests.

### Loading Utilities

Load utilities in `functions.php`:

```php
require_once get_template_directory() . '/inc/nonce.php';
```

### AJAX Example

**JavaScript:**

```javascript
fetch(ajaxurl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
        action: 'block_theme_example',
        _wpnonce: window.BlockTheme.nonce,
        data: 'value'
    })
});
```

**PHP Handler** (already registered in `inc/nonce.php`):

```php
add_action('wp_ajax_block_theme_example', function () {
    if (!lswp_theme_verify_request_nonce(lswp_theme_nonce_action('frontend'))) {
        wp_send_json_error(['message' => 'Invalid nonce'], 403);
    }
    // Process request
    wp_send_json_success(['message' => 'OK']);
});
```

### REST API Example

**PHP Registration:**

```php
register_rest_route('block-theme/v1', '/endpoint', [
    'methods' => 'POST',
    'callback' => function ($request) {
        if (!lswp_theme_verify_rest_nonce($request)) {
            return new WP_Error('rest_forbidden', 'Invalid nonce', ['status' => 403]);
        }
        return ['status' => 'success'];
    },
    'permission_callback' => '__return_true',
]);
```

**JavaScript:**

```javascript
fetch('/wp-json/block-theme/v1/endpoint', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': wpApiSettings.nonce
    },
    body: JSON.stringify({ data: 'value' })
});
```

### Admin Forms Example

For admin forms, use WordPress core functions:

```php
// In form:
wp_nonce_field('my_action_name', 'my_nonce_field');

// In handler:
if (!check_admin_referer('my_action_name', 'my_nonce_field')) {
    wp_die('Invalid nonce');
}
```

## Best Practices

### Security Coding Standards

Follow WordPress security coding standards:

1. **Always escape output:**

   ```php
   echo esc_html($text);
   echo esc_attr($attribute);
   echo esc_url($url);
   ```

2. **Always sanitize input:**

   ```php
   $text = sanitize_text_field($_POST['field']);
   $email = sanitize_email($_POST['email']);
   $url = esc_url_raw($_POST['url']);
   ```

3. **Always validate input:**

   ```php
   if (!isset($_POST['field']) || !is_string($_POST['field'])) {
       wp_die('Invalid input');
   }
   ```

4. **Always use prepared statements:**

   ```php
   $wpdb->prepare("SELECT * FROM $wpdb->posts WHERE ID = %d", $post_id);
   ```

5. **Always verify nonces:**

   ```php
   if (!wp_verify_nonce($_POST['_wpnonce'], 'my_action')) {
       wp_die('Invalid nonce');
   }
   ```

### Nonce Best Practices

- Always verify nonces for state-changing operations.
- Use `wp_create_nonce('wp_rest')` for REST API nonces.
- Rotate nonces by using unique action suffixes per feature.
- For admin forms, use `wp_nonce_field()` and `check_admin_referer()`.
- Never bypass nonce verification in production code.
- Use descriptive nonce action names for debugging.

### Content Security Policy Best Practices

- Start with strict policies and relax as needed.
- Use nonces for inline scripts instead of `'unsafe-inline'`.
- Document all exceptions and third-party domains.
- Monitor CSP violation reports during rollout.
- Regularly audit and tighten policies.
- Test thoroughly across all pages and user flows.

### General Security Practices

- Keep WordPress, themes, and plugins updated.
- Use HTTPS for all production sites.
- Implement security headers at server level when possible.
- Follow OWASP Top 10 security guidelines.
- Regularly audit dependencies for vulnerabilities.
- Implement logging for security events.
- Use environment variables for sensitive configuration.
- Never commit secrets or credentials to version control.

## Validation

All security implementations are validated:

### Code Security Validation

**PHPCS Security Sniffs:**

- `WordPress.Security.EscapeOutput` - All output must be escaped
- `WordPress.Security.NonceVerification` - Forms must verify nonces
- `WordPress.Security.ValidatedSanitizedInput` - Input must be validated/sanitized
- `WordPress.WP.PreparedSQL` - Use prepared SQL statements

**Run validation:**

```bash
npm run lint:php             # Checks security issues
composer run lint            # Direct PHPCS command
```

### Security Header Validation

Test security headers:

```bash
# Check headers
curl -I https://example.com/

# Security scanners
# https://securityheaders.com
# https://observatory.mozilla.org
```

### Nonce Validation

All nonce implementations are tested:

**Test File:** `tests/php/test-nonce.php` (if exists)

```php
public function test_nonce_creation() {
    $nonce = lswp_theme_create_nonce('frontend');
    $this->assertNotEmpty($nonce);
}

public function test_nonce_verification() {
    $action = lswp_theme_nonce_action('frontend');
    $_REQUEST['_wpnonce'] = wp_create_nonce($action);
    $this->assertTrue(lswp_theme_verify_request_nonce($action));
}
```

**Reference:** [VALIDATION.md](./VALIDATION.md#security-validation)

## Related Documentation

- [VALIDATION.md](./VALIDATION.md) - Complete validation reference including security checks
- [TESTING.md](./TESTING.md) - Testing guide including security tests
- [.github/instructions/security-nonce.instructions.md](../.github/instructions/security-nonce.instructions.md) - Nonce coding standards for AI agents
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Security contribution guidelines
- [inc/nonce.php](../inc/nonce.php) - Nonce utility implementation

## External Resources

- [WordPress Security Handbook](https://developer.wordpress.org/apis/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [Security Headers Reference](https://securityheaders.com/)

## Version History

| Date | Change |
|------|--------|
| 2025-12-07 | Merged SECURITY_HEADERS.md and SECURITY_NONCE.md |
| 2025-12-07 | Added comprehensive security practices section |
| 2025-12-07 | Added validation section and cross-references |
| 2025-12-01 | Initial security headers guide |
| 2025-12-01 | Initial nonce utilities documentation |
