---
file_type: "instructions"
applyTo: ["**/*.php"]
description: "Apply WordPress PHP standards (formatting, naming, security, I18N)."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# WordPress PHP Coding Standards

WordPress uses a customized documentation schema that draws inspiration from PHPDoc, an evolving standard for providing documentation to PHP code, which is maintained by [phpDocumentor](http://phpdoc.org/).

## Mission

Ensure PHP code follows WordPress conventions for style, security and internationalisation while delivering high performance.

## Language & Frameworks

- PHP 7.4+ (WordPress currently supports up to 8.2). Use WordPress core functions and APIs wherever possible.

## Project Structure

- Organise code under `includes/`, `src/` or `plugins/` with autoloadable namespaces.
- Name classes and files consistently (e.g. `class-plugin-name.php`).

## Coding Standards

- Use **4‑space indentation**; brace styles follow the WordPress guidelines (K&R).
- Prefer **Yoda conditions** when performing comparisons that may involve assignments.
- Escape data on output (`esc_html`, `esc_attr`, `wp_kses_post`) and sanitise data on input (`sanitize_text_field`, `intval`, etc.).
- Protect against CSRF by using WordPress nonces for forms and actions.
- Wrap translatable strings in `__()`, `_e()` or similar functions with a text domain.
- Avoid direct database queries; use `$wpdb->prepare()` and helper functions.

### Security & Data Handling

**Always escape output:**

```php
echo esc_html( $user_input );
echo esc_attr( $attribute_value );
echo esc_url( $url );
echo wp_kses_post( $rich_content );
```

**Always sanitize input:**

```php
$clean_text = sanitize_text_field( $_POST['user_text'] );
$clean_email = sanitize_email( $_POST['user_email'] );
$clean_url = esc_url_raw( $_POST['user_url'] );
```

**Protect forms and AJAX with nonces:**

```php
wp_nonce_field( 'my_action_nonce', 'my_nonce' );
if ( ! wp_verify_nonce( $_POST['my_nonce'], 'my_action_nonce' ) ) {
    wp_die( 'Security check failed' );
}
```

**Check user capabilities:**

```php
if ( ! current_user_can( 'edit_posts' ) ) {
    wp_die( 'Insufficient permissions' );
}
```

### Database Operations

**Always use prepared statements:**

```php
global $wpdb;
$results = $wpdb->get_results( $wpdb->prepare(
    "SELECT * FROM {$wpdb->prefix}custom_table WHERE user_id = %d AND status = %s",
    $user_id,
    $status
) );
```

**Prefer WordPress helper functions over direct queries:**

```php
$posts = get_posts( array(
    'post_type' => 'custom_type',
    'meta_query' => array(
        array(
            'key' => 'custom_field',
            'value' => $value,
            'compare' => '='
        )
    )
) );
```

### Internationalization (i18n)

**Use consistent text domain:**

```php
__( 'Text to translate', 'textdomain' );
_e( 'Text to echo', 'textdomain' );
_x( 'Text', 'Context for translators', 'textdomain' );
_n( 'Singular', 'Plural', $count, 'textdomain' );
```

**Localize JavaScript strings:**

```php
wp_localize_script( 'my-script', 'myL10n', array(
    'ajaxurl' => admin_url( 'admin-ajax.php' ),
    'nonce' => wp_create_nonce( 'my_ajax_nonce' ),
    'strings' => array(
        'loading' => __( 'Loading...', 'textdomain' ),
        'error' => __( 'An error occurred', 'textdomain' ),
    )
) );
```

### Error Handling & Logging

**Use WordPress error handling:**

```php
if ( is_wp_error( $result ) ) {
    error_log( 'Custom plugin error: ' . $result->get_error_message() );
    return false;
}
```

**Debug logging (only when WP_DEBUG is true):**

```php
if ( WP_DEBUG ) {
    error_log( 'Debug info: ' . print_r( $debug_data, true ) );
}
```

**User-friendly error messages:**

```php
wp_die(
    __( 'Something went wrong. Please try again later.', 'textdomain' ),
    __( 'Error', 'textdomain' ),
    array( 'response' => 500 )
);
```

### Performance & Caching

**Cache expensive operations:**

```php
$cache_key = 'my_plugin_data_' . md5( serialize( $args ) );
$data = get_transient( $cache_key );

if ( false === $data ) {
    $data = expensive_operation( $args );
    set_transient( $cache_key, $data, HOUR_IN_SECONDS );
}
```

**Use object cache when available:**

```php
$data = wp_cache_get( $cache_key, 'my_plugin_group' );
if ( false === $data ) {
    $data = expensive_operation();
    wp_cache_set( $cache_key, $data, 'my_plugin_group', 3600 );
}
```

**Optimize database queries:**

```php
// Bad: N+1 query problem
foreach ( $posts as $post ) {
    $meta = get_post_meta( $post->ID, 'custom_field', true );
}

// Good: Single query with meta
$posts = get_posts( array(
    'meta_key' => 'custom_field',
    'meta_value' => $value
) );
```

### WordPress Hooks & Filters

**Use appropriate hook priorities:**

```php
add_action( 'init', 'my_plugin_init', 10 );
add_filter( 'the_content', 'my_content_filter', 20 );
```

**Remove hooks safely:**

```php
remove_action( 'wp_head', 'wp_generator' );
remove_filter( 'the_content', 'wpautop' );
```

**Conditional hook registration:**

```php
if ( is_admin() ) {
    add_action( 'admin_init', 'my_admin_init' );
} else {
    add_action( 'wp_enqueue_scripts', 'my_frontend_scripts' );
}
```

**Plugin activation/deactivation hooks:**

```php
register_activation_hook( __FILE__, 'my_plugin_activate' );
register_deactivation_hook( __FILE__, 'my_plugin_deactivate' );
```

### Class Structure & OOP

**Use singleton pattern for plugin main class:**

```php
class My_Plugin {
    private static $instance = null;

    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action( 'init', array( $this, 'init' ) );
    }

    public function init() {
        if ( is_admin() ) {
            $this->init_admin();
        } else {
            $this->init_frontend();
        }
    }
}

// Initialize
My_Plugin::get_instance();
```

### Block Development (PHP)

**Register blocks from block.json:**

```php
function my_plugin_register_blocks() {
    register_block_type( __DIR__ . '/build/blocks/custom-block' );
}
add_action( 'init', 'my_plugin_register_blocks' );
```

**Register blocks with PHP configuration:**

```php
register_block_type( 'my-plugin/custom-block', array(
    'render_callback' => 'my_plugin_render_custom_block',
    'attributes' => array(
        'content' => array(
            'type' => 'string',
            'default' => ''
        ),
        'alignment' => array(
            'type' => 'string',
            'default' => 'left'
        )
    ),
    'supports' => array(
        'anchor' => true,
        'spacing' => array(
            'margin' => true,
            'padding' => true
        )
    )
) );
```

**Block render callback:**

```php
function my_plugin_render_custom_block( $attributes, $content, $block ) {
    $wrapper_attributes = get_block_wrapper_attributes( array(
        'class' => 'my-custom-block align' . esc_attr( $attributes['alignment'] )
    ) );

    return sprintf(
        '<div %1$s><p>%2$s</p></div>',
        $wrapper_attributes,
        esc_html( $attributes['content'] )
    );
}
```

### Block Patterns

**Register block patterns:**

```php
function my_plugin_register_patterns() {
    register_block_pattern( 'my-plugin/hero', array(
        'title'       => __( 'Hero Section', 'my-plugin' ),
        'description' => __( 'Full-width hero with heading and CTA', 'my-plugin' ),
        'content'     => '<!-- wp:group {...} -->...<!-- /wp:group -->',
        'categories'  => array( 'featured', 'hero' ),
        'keywords'    => array( 'hero', 'header', 'banner' ),
        'viewportWidth' => 1024
    ) );
}
add_action( 'init', 'my_plugin_register_patterns' );
```

**Pattern naming conventions:**

- Use consistent naming: `plugin-slug/category-name` (e.g., `lsx/cta-newsletter`)
- Include proper categories and keywords for discoverability
- Provide descriptive viewportWidth for responsive design

### REST API Integration

**Register custom REST endpoints:**

```php
function my_plugin_register_rest_routes() {
    register_rest_route( 'my-plugin/v1', '/custom-endpoint', array(
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'my_plugin_rest_callback',
        'permission_callback' => 'my_plugin_rest_permission_check',
        'args' => array(
            'id' => array(
                'required' => true,
                'validate_callback' => function( $param, $request, $key ) {
                    return is_numeric( $param );
                },
                'sanitize_callback' => 'absint'
            )
        )
    ) );
}
add_action( 'rest_api_init', 'my_plugin_register_rest_routes' );
```

**REST API callback:**

```php
function my_plugin_rest_callback( $request ) {
    $id = $request->get_param( 'id' );
    $data = my_plugin_get_data( $id );

    if ( empty( $data ) ) {
        return new WP_Error( 'no_data', 'No data found', array( 'status' => 404 ) );
    }

    return rest_ensure_response( $data );
}
```

**Permission checks:**

```php
function my_plugin_rest_permission_check() {
    return current_user_can( 'read' );
}
```

### 10. Block Pattern & Asset Management Best Practices

#### 10.1 Asset Management (Scripts & Styles)

WordPress assets (scripts and styles) must be enqueued using the proper WordPress API functions rather than being loaded inline:

```php
// ✅ Correct - Using wp_enqueue_script()
add_action( 'wp_enqueue_scripts', function() {
    wp_enqueue_script(
        'my-script',
        get_template_directory_uri() . '/js/my-script.js',
        array( 'jquery' ), // Dependencies
        '1.0.0', // Version for cache busting
        true // Load in footer
    );

    // Localize data for JavaScript
    wp_localize_script( 'my-script', 'MyScriptData', array(
        'ajaxUrl' => admin_url( 'admin-ajax.php' ),
        'nonce'   => wp_create_nonce( 'my_nonce' ),
    ) );
} );

// ❌ Incorrect - Inline script loading
// <script src="<?php echo get_template_directory_uri(); ?>/js/my-script.js"></script>
```

Key principles:

- Always use `wp_enqueue_script()` for JavaScript and `wp_enqueue_style()` for CSS
- Specify dependencies array to ensure correct loading order
- Use versioning for cache busting when assets change
- Use `wp_localize_script()` to pass PHP data to JavaScript
- Load scripts in footer when possible (pass `true` as last parameter)

#### 10.2 Block Pattern Registration & Naming

Block patterns must follow consistent naming conventions and registration practices:

```php
register_block_pattern(
    'lsx/cta-newsletter', // Pattern slug: namespace/name format
    array(
        'title'         => __( 'Newsletter Call to Action', 'lsx-theme' ),
        'description'   => __( 'A call-to-action section for newsletter signup', 'lsx-theme' ),
        'categories'    => array( 'call-to-action', 'newsletter' ),
        'keywords'      => array( 'subscribe', 'email', 'newsletter', 'cta' ),
        'viewportWidth' => 1200, // Appropriate width for pattern display
        'content'       => '<!-- wp:group {"layout":{"type":"constrained"}} --><div class="wp-block-group"><!-- wp:heading --><h2>' . esc_html__( 'Subscribe to our newsletter', 'lsx-theme' ) . '</h2><!-- /wp:heading --></div><!-- /wp:group -->',
    )
);
```

Pattern naming conventions:

- Use format: `namespace/[category]-[name]` (e.g., `lsx/cta-newsletter`, `lsx/hero-split-image`)
- Keep names lowercase with hyphens (no underscores)
- Be descriptive about pattern function
- Use meaningful categories and keywords for discoverability
- Set `viewportWidth` appropriate for pattern's intended display

#### 10.3 Pattern Content & Performance

When creating patterns, follow these best practices:

```php
// ✅ Best practice - Use theme.json variables for styling
'content' => '<!-- wp:paragraph {"fontSize":"large"} --><p>' . esc_html__( 'Welcome to our site', 'lsx-theme' ) . '</p><!-- /wp:paragraph -->',

// ✅ Best practice - Optimize images in patterns
'content' => '<!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure><img src="' . esc_url( get_template_directory_uri() . '/images/pattern.jpg' ) . '" alt="' . esc_attr__( 'Pattern image', 'lsx-theme' ) . '" /></figure><!-- /wp:image -->',

// ✅ Best practice - Avoid unnecessary database queries
// Pre-fetch any data needed for pattern generation outside the pattern content

// ❌ Avoid - Inline scripts or styles
// 'content' => '<script>alert("This is bad")</script>',

// ❌ Avoid - Complex custom rendering logic
// Keep patterns simple and maintainable; use core blocks instead
```

Key points:

- Use theme.json design tokens for consistent styling
- Optimize images: use appropriate sizes and formats
- Avoid render-blocking scripts
- Keep pattern structure clean and nested properly
- Test patterns across different viewport sizes
- Document pattern sections with meaningful comments

## Testing & Quality

- Run **PHPCS** with the `WordPress`, `WordPress-Docs` and `WordPress-Extra` rulesets. Use `phpcbf` for safe automatic fixes and review residual warnings.
- Write unit tests with PHPUnit and integration tests with the WordPress testing suite.

## Performance & Security

- Cache expensive operations; use transients or object caching APIs.
- Validate and sanitise all user inputs; never trust `$_GET`, `$_POST` or `$_REQUEST` without sanitisation.
- Use prepared statements to prevent SQL injection.

## Documentation Standards

Every PHP function, class, method, and hook must be accompanied by proper DocBlocks following WordPress standards. Documentation serves multiple purposes: IDE support, Code Reference generation, and developer understanding.

### What Must Be Documented

- Functions and class methods
- Classes and class members (properties and constants)
- Requires and includes
- Hooks (actions and filters)
- File headers
- Constants

### DocBlock Language & Grammar

Summaries should be **clear, brief, and use third-person singular verbs**. Write "Filters the post content" (not "Filter" or "Let's you edit").

- _Functions_: What does it do? → "Displays the last modified date for a post."
- _Filters_: What is being filtered? → "Filters the post content."
- _Actions_: When does it fire? → "Fires after core is loaded and user is authenticated."

Descriptions should be complete sentences, using the serial (Oxford) comma when listing items. File header summaries are titles and may omit periods, but all other descriptions should end with periods.

### DocBlock Tags Reference

| Tag               | Usage                                      | Example                                              |
| ----------------- | ------------------------------------------ | ---------------------------------------------------- |
| **`@since`**      | Version introduced (3-digit format)        | `@since 1.0.0`                                       |
| **`@param`**      | Function parameter with type & description | `@param string $name User name.`                     |
| **`@return`**     | Return type and description                | `@return bool True on success, false on failure.`    |
| **`@global`**     | Global variables used                      | `@global wpdb $wpdb WordPress database object.`      |
| **`@see`**        | Related function/method/class              | `@see related_function()`                            |
| **`@link`**       | External URL reference                     | `@link https://example.com/docs`                     |
| **`@deprecated`** | Version deprecated with replacement        | `@deprecated 2.0.0 Use new_function_name() instead.` |
| **`@var`**        | Variable/property type                     | `@var string $variable Description.`                 |
| **`@type`**       | Array value types in hash notation         | `@type string $key Description.`                     |
| **`@ignore`**     | Skip parsing this element                  | `@ignore`                                            |
| **`@access`**     | Access level (private/internal only)       | `@access private`                                    |
| **`@package`**    | Package name for file                      | `@package WordPress`                                 |
| **`@subpackage`** | Component/subpackage                       | `@subpackage Admin`                                  |
| **`@todo`**       | Planned changes not yet implemented        | `@todo Refactor after version 3.0`                   |
| **`@throws`**     | Exception types thrown                     | `@throws InvalidArgumentException`                   |

### File Headers

Every PHP file should have a header DocBlock:

```php
<?php
/**
 * Summary of file purpose (no period)
 *
 * Longer description explaining what this file contains and how it fits into
 * the overall component or API. Include context and usage examples if helpful.
 * Use proper sentences and end with a period.
 *
 * @package WordPress
 * @subpackage ComponentName
 * @since 1.0.0
 */
```

### Functions & Methods

```php
/**
 * Retrieves the current user's display name.
 *
 * Fetches the display name for the currently logged-in user, or an empty
 * string if no user is logged in.
 *
 * @since 1.0.0
 * @since 2.0.0 Returns empty string for guests instead of 'Anonymous'.
 *
 * @global WP_User $current_user The currently authenticated user.
 *
 * @return string The user's display name, or empty string if not logged in.
 */
function ls_get_current_user_display_name() {
    $user = wp_get_current_user();
    return isset( $user->display_name ) ? esc_html( $user->display_name ) : '';
}
```

### Functions with Parameters

```php
/**
 * Creates or updates a post with metadata.
 *
 * This function handles both new post creation and updating existing posts,
 * along with associated metadata.
 *
 * @since 1.0.0
 *
 * @param array $args {
 *     Arguments for creating or updating the post.
 *
 *     @type int    $ID             Post ID. Leave empty to create new.
 *     @type string $post_title     The post title. Required.
 *     @type string $post_content   The post content. Default empty.
 *     @type string $post_type      Post type. Default 'post'. Accepts 'post', 'page', 'custom'.
 *     @type array  $meta_input {
 *         Post metadata to set.
 *
 *         @type string $key Custom metadata key.
 *     }
 * }
 * @param array $options {
 *     Optional. Additional options for processing.
 *
 *     @type bool $sanitize Whether to sanitize input. Default true.
 *     @type bool $validate Whether to validate input. Default true.
 * }
 *
 * @return int|WP_Error Post ID on success, WP_Error on failure.
 */
function ls_create_post_with_metadata( $args, $options = array() ) {
    // Implementation
}
```

### Classes

```php
/**
 * Manages plugin features and integration with WordPress.
 *
 * The Plugin class serves as the main entry point, coordinating initialization,
 * registration of hooks, and management of plugin features.
 *
 * @since 1.0.0
 */
class LS_Plugin {
    /**
     * Main plugin instance.
     *
     * @since 1.0.0
     * @var LS_Plugin
     */
    private static $instance = null;

    /**
     * Plugin settings and configuration.
     *
     * @since 1.0.0
     * @var array
     */
    private $settings = array();

    /**
     * Retrieves the singleton instance of the plugin.
     *
     * @since 1.0.0
     *
     * @return LS_Plugin The plugin instance.
     */
    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Initializes the plugin.
     *
     * Sets up hooks, loads configuration, and prepares functionality.
     *
     * @since 1.0.0
     */
    public function init() {
        add_action( 'wp_loaded', array( $this, 'load_features' ) );
    }

    /**
     * Loads plugin features.
     *
     * @since 1.0.0
     */
    public function load_features() {
        // Feature loading code
    }
}
```

### Hooks (Actions & Filters)

```php
/**
 * Filters the post content before display.
 *
 * Allows plugins to modify the post content that is output on the frontend.
 * This filter is applied to all single post views.
 *
 * @since 1.0.0
 *
 * @param string $content The post content.
 * @param int    $post_id The post ID.
 */
$content = apply_filters( 'ls_post_content', $content, get_the_ID() );

/**
 * Fires after the post content is rendered.
 *
 * Use this hook to add additional functionality after post content output,
 * such as related posts, comments, or tracking pixels.
 *
 * @since 1.0.0
 *
 * @param int $post_id The post ID.
 */
do_action( 'ls_after_post_content', get_the_ID() );
```

### Deprecating Functions

```php
/**
 * Retrieves user data.
 *
 * @since 1.0.0
 * @deprecated 2.0.0 Use get_user_data_v2() instead.
 * @see get_user_data_v2()
 *
 * @param int $user_id The user ID.
 * @return array|false User data or false if not found.
 */
function get_user_data( $user_id ) {
    _deprecated_function( __FUNCTION__, '2.0.0', 'get_user_data_v2' );
    return get_user_data_v2( $user_id );
}
```

### Inline Comments

For single-line comments within code:

```php
// Verify user has required capability before proceeding.
if ( ! current_user_can( 'edit_posts' ) ) {
    return false;
}
```

For multi-line comments (note: use `/*` not `/**` to avoid parser confusion):

```php
/*
 * This is a comment spanning multiple lines. It follows the same formatting
 * as DocBlocks but uses a single asterisk to distinguish it from documentation
 * blocks that should be parsed by documentation generators.
 */
```

### Documentation Formatting Best Practices

- **Line wrapping**: Wrap at 80 characters of text (not counting indentation)
- **Alignment**: Align parameter descriptions with each other
- **Code in descriptions**: Indent by 4 spaces, add blank line before and after
- **Lists in descriptions**: Use hyphens for unordered, numbers for ordered, with blank lines before and after
- **HTML tags**: Write as "image tag" or "link element" not `<img>` or `<link>`
- **Links**: Use `@link` tag for URLs, `{@see 'hook_name'}` for inline hook references

### Changelog Pattern

When making significant changes to existing functions, add changelog entries:

```php
/**
 * Handles user authentication.
 *
 * @since 1.0.0
 * @since 1.1.0 Added support for two-factor authentication.
 * @since 2.0.0 The `$remember` parameter is now optional.
 *
 * @param string $user     Username or email.
 * @param string $password User password.
 * @param bool   $remember Optional. Remember user login. Default false.
 * @return bool|WP_Error True on success, WP_Error on failure.
 */
```

#### Line wrapping

DocBlock text should wrap to the next line after 80 characters of text. If the DocBlock itself is indented on the left 20 character positions, the wrap could occur at position 100, but should not extend beyond a total of 120 characters wide.

## DocBlock Formatting

The examples provided in each section below show the expected DocBlock content and tags, as well as the exact formatting. Use spaces inside the DocBlock, not tabs, and ensure that items in each tag group are aligned according to the examples.

### 1. Functions &amp; Class Methods

Functions and class methods should be formatted as follows:

- **Summary**: A brief, one sentence explanation of the purpose of the function spanning a maximum of two lines. Use a period at the end.
- **Description**: A supplement to the summary, providing a more detailed description. Use a period at the end of sentences.
- **`@ignore`**: Used when an element is meant only for internal use and should be skipped from parsing.
- **`@since x.x.x`**: Should always be 3-digit (e.g. `@since 3.9.0`). Exception is `@since MU (3.0.0)`.
- **`@access`**: Only used for core-only functions or classes implementing "private" core APIs. If the element is private it will be output with a message stating its intention for internal use.
- **`@see`**: Reference to a function, method, or class that is heavily-relied on within. See the note above about inline `@see` tags for expected formatting.
- **`@link`**: URL that provides more information. This should never be used to reference another function, hook, class, or method, see `@see`.
- **`@global`**: List PHP globals that are used within the function or method, with an optional description of the global. If multiple globals are listed, they should be aligned by type, variable, and description, with each other as a group.
- **`@param`**: Note if the parameter is _Optional_ before the description, and include a period at the end. The description should mention accepted values as well as the default. For example: _Optional. This value does something. Accepts 'post', 'term', or empty. Default empty._
- **`@return`**: Should contain all possible return types and a description for each. Use a period at the end. Note: `@return void` should not be used outside the default bundled themes and the PHP compatibility shims included in WordPress Core.

```php
/**
 * Summary.
 *
 * Description.
 *
 * @since x.x.x
 *
 * @see Function/method/class relied on
 * @link URL
 * @global type $varname Description.
 * @global type $varname Description.
 *
 * @param type $var Description.
 * @param type $var Optional. Description. Default.
 * @return type Description.
 */
```

#### 1.1 Parameters That Are Arrays

Parameters that are an array of arguments should be documented in the "originating" function only, and cross-referenced via an `@see` tag in corresponding DocBlocks.

Array values should be documented using WordPress' flavor of hash notation style similar to how [Hooks](https://developer.wordpress.org/coding-standards/inline-documentation-standards/php/#4-hooks-actions-and-filters) can be documented, each array value beginning with the `@type` tag, and taking the form of:

```php
*     @type type $key Description. Default 'value'. Accepts 'value', 'value'.
*                     (aligned with Description, if wraps to a new line)
```

An example of an "originating" function and re-use of an argument array is [`wp_remote_request|post|get|head()`](https://core.trac.wordpress.org/browser/tags/6.0/src/wp-includes/http.php/#L114).

```php
/**
 * Summary.
 *
 * Description.
 *
 * @since x.x.x
 *
 * @param type  $var Description.
 * @param array $args {
 *     Optional. An array of arguments.
 *
 *     @type type $key Description. Default 'value'. Accepts 'value', 'value'.
 *                     (aligned with Description, if wraps to a new line)
 *     @type type $key Description.
 * }
 * @param type  $var Description.
 * @return type Description.
 */
```

In most cases, there is no need to mark individual arguments in a hash notation as _optional_, as the entire array is usually optional. Specifying "Optional." in the hash notation description should suffice. In the case where the array is NOT optional, individual key/value pairs may be optional and should be marked as such as necessary.

#### 1.2 Deprecated Functions

If the function is deprecated and should not be used any longer, the `@deprecated` tag, along with the version and description of what to use instead, should be added. Note the additional use of an `@see` tag - the Code Reference uses this information to attempt to link to the replacement function.

```php
/**
 * Summary.
 *
 * Description.
 *
 * @since x.x.x
 * @deprecated x.x.x Use new_function_name()
 * @see new_function_name()
 *
 * @param type $var Optional. Description.
 * @param type $var Description.
 * @return type Description.
 */
```

### 2. Classes

Class DocBlocks should be formatted as follows:

- **Summary**: A brief, one sentence explanation of the **purpose** of the class spanning a maximum of two lines. Use a period at the end.
- **Description**: A supplement to the summary, providing a more detailed description. Use a period at the end.
- **`@since x.x.x`**: Should always be 3-digit (e.g. `@since 3.9.0`). Exception is `@since MU (3.0.0)`.

```php
/**
 * Summary.
 *
 * Description.
 *
 * @since x.x.x
 */
```

If documenting a sub-class, it's also helpful to include an `@see` tag reference to the super class:

```php
/**
 * Summary.
 *
 * Description.
 *
 * @since x.x.x
 *
 * @see Super_Class
 */
```

#### 2.1 Class Members

##### 2.1.1 Properties

Class properties should be formatted as follows:

- **Summary**: Use a period at the end.
- **`@since x.x.x`**: Should always be 3-digit (e.g. `@since 3.9.0`). Exception is `@since MU (3.0.0)`.
- **`@var`**: Formatted the same way as `@param`, though the description may be omitted.

```php
/**
 * Summary.
 *
 * @since x.x.x
 * @var type $var Description.
 */
```

##### 2.1.2 Constants

- **Summary**: Use a period at the end.</li>
- **`@since x.x.x`**: Should always be 3-digit (e.g. `@since 3.9.0`). Exception is `@since MU (3.0.0)`.
- **`@var`**: Formatted the same way as `@param`, though the description may be omitted.

```php
/**
 * Summary.
 *
 * @since x.x.x
 * @var type $var Description.
 */
const NAME = value;
```

### 3. Requires and Includes

Files required or included should be documented with a summary description DocBlock. Optionally, this may apply to inline `get_template_part()` calls as needed for clarity.

```php
/**
 * Summary.
 */
require_once( ABSPATH . WPINC . '/filename.php' );
```

### 4. Hooks (Actions and Filters)

Both action and filter hooks should be documented on the line immediately preceding the call to `do_action()` or `do_action_ref_array()`, or `apply_filters()` or `apply_filters_ref_array()`, and formatted as follows:

- **Summary**: A brief, one line explanation of the purpose of the hook. Use a period at the end.
- **Description**: A supplemental description to the summary, if warranted.
- **`@ignore`**: Used when a hook is meant only for internal use and should be skipped from parsing.
- **`@since x.x.x`**: Should always be 3-digit (e.g. `@since 3.9.0`). Exception is `@since MU (3.0.0)`.
- **`@param`**: If the parameter is an array of arguments, document each argument using a hash notation (described above in the _Parameters That Are Arrays_ section), and include a period at the end of each line.

Note that `@return` is _not_ used for hook documentation, because action hooks return nothing, and filter hooks always return their first parameter.

```php
/**
 * Summary.
 *
 * Description.
 *
 * @since x.x.x
 *
 * @param type  $var Description.
 * @param array $args {
 *     Short description about this hash.
 *
 *     @type type $var Description.
 *     @type type $var Description.
 * }
 * @param type  $var Description.
 */
```

If a hook is in the middle of a block of HTML or a long conditional, the DocBlock should be placed on the line immediately before the start of the HTML block or conditional, even if it means forcing line-breaks/PHP tags in a continuous line of HTML.

Tools to use when searching for the version a hook was added are [`svn blame`](http://make.wordpress.org/core/handbook/svn/code-history/#using-subversion-annotate), or the [WordPress Hooks Database](http://adambrown.info/p/wp_hooks) for older hooks. If, after using these tools, the version number cannot be determined, use `@since Unknown`.

#### 4.1 Duplicate Hooks

Occasionally, hooks will be used multiple times in the same or separate core files. In these cases, rather than list the entire DocBlock every time, only the first-added or most logically-placed version of an action or filter will be fully documented. Subsequent versions should have a single-line comment.

For actions:

```php
/** This action is documented in path/to/filename.php */
```

For filters:

```php
/** This filter is documented in path/to/filename.php */
```

To determine which instance should be documented, search for multiples of the same hook tag, then use [`svn blame`](http://make.wordpress.org/core/handbook/svn/code-history/#using-subversion-annotate) to find the first use of the hook in terms of the earliest revision. If multiple instances of the hook were added in the same release, document the one most logically-placed as the "primary".

### 5. Inline Comments

Inline comments inside methods and functions should be formatted as follows:

#### 5.1 Single line comments

```php
// Allow plugins to filter an array.
```

#### 5.2 Multi-line comments

```php
/*
 * This is a comment that is long enough to warrant being stretched over
 * the span of multiple lines. You'll notice this follows basically
 * the same format as the PHPDoc wrapping and comment block style.
 */
```

**Important note**: Multi-line comments must not begin with `/**` (double asterisk) as the parser might mistake it for a DocBlock. Use `/*` (single asterisk) instead.

### 6. File Headers

The file header DocBlock is used to give an overview of what is contained in the file.

Whenever possible, **all** WordPress files should contain a header DocBlock, regardless of the file's contents - this includes files containing classes.

```php
/**
 * Summary (no period for file headers)
 *
 * Description. (use period)
 *
 * @link URL
 *
 * @package WordPress
 * @subpackage Component
 * @since x.x.x (when the file was introduced)
 */
```

The _Summary_ section is meant to serve as a succinct description of **what** specific purpose the file serves.

Examples:

- Good: _"Widgets API: WP_Widget class"_
- Bad: _"Core widgets class"_

The _Description_ section can be used to better explain overview information for the file such as how the particular file fits into the overall makeup of an API or component.

Examples:

- Good: _"The Widgets API is comprised of the WP_Widget and WP_Widget_Factory classes in addition to a variety of top-level functionality that implements the Widgets and related sidebar APIs. WordPress registers a number of common widgets by default."_

### 7. Constants

The constant DocBlock is used to give a description of the constant for better use and understanding.

Constants should be formatted as follows:

- **Summary**: Use a period at the end.
- **`@since x.x.x`**: Should always be 3-digit (e.g. `@since 3.9.0`). Exception is `@since MU (3.0.0)`.
- **`@var`**: Formatted the same way as `@param`. The description is optional.

```php
/**
 * Summary.
 *
 * @since x.x.x (if available)
 * @var type $var Description.
 */
```

## PHPDoc Tags

Common PHPDoc tags used in WordPress include `@since`, `@see`, `@global` `@param`, and `@return` (see table below for full list).

For the most part, tags are used correctly, but not all the time. For instance, sometimes you'll see an `@link` tag inline, linking to a separate function or method. "Linking" to known classes, methods, or functions is not necessary, as the Code Reference automatically links these elements. For "linking" hooks inline, the proper tag to use is `@see` - see the _Other Descriptions_ section.

| Tag               | Usage                                                       | Description                                                                                                                                                                                                                                        |
| ----------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`@access`**     | private                                                     | Only used in limited circumstances, like when visibility modifiers cannot be used in the code, and only when private, such as for core-only functions or core classes implementing "private" APIs. Used directly below the `@since` line in block. |
| **`@deprecated`** | version x.x.x Use _replacement function name_ instead       | What version of WordPress the function/method was deprecated. Use 3-digit version number. Should be accompanied by a matching `@see` tag.                                                                                                          |
| **`@global`**     | datatype $variable description                              | Document global(s) used in the function/method. For boolean and integer types, use `bool` and `int`, respectively.                                                                                                                                 |
| **`@internal`**   | information string                                          | Typically used wrapped in `{}` for adding notes for internal use only.                                                                                                                                                                             |
| **`@ignore`**     | (standalone)                                                | Used to skip parsing of the entire element.                                                                                                                                                                                                        |
| **`@link`**       | URL                                                         | Link to additional information for the function/method. For an external script/library, links to source. Not to be used for related functions/methods; use `@see` instead.                                                                         |
| **`@method`**     | returntype description                                      | Shows a "magic" method found inside the class.                                                                                                                                                                                                     |
| **`@package`**    | packagename                                                 | Specifies package that all functions, includes, and defines in the file belong to. Found in DocBlock at top of the file. For core (and bundled themes), this is always **WordPress**.                                                              |
| **`@param`**      | datatype $variable description                              | Function/method parameter of the format: parameter type, variable name, description, default behavior. For boolean and integer types, use `bool` and `int`, respectively.                                                                          |
| **`@return`**     | datatype description                                        | Document the return value of functions or methods. `@return void` should not be used outside of the default bundled themes. For boolean and integer types, use `bool` and `int`, respectively.                                                     |
| **`@see`**        | elementname                                                 | References another function/method/class the function/method relies on. Should only be used inline for "linking" hooks.                                                                                                                            |
| **`@since`**      | version x.x.x                                               | Documents release version function/method was added. Use 3-digit version number - this is to aid with version searches, and for use when comparing versions in code. Exception is `@since MU (3.0.0)`.                                             |
| **`@static`**     | (standalone)                                                | Note: This tag has been used in the past, but should no longer be used. Just using the static keyword in your code is enough for phpDocumentor on PHP5+ to recognize static variables and methods, and PhpDocumentor will mark them as static.     |
| **`@staticvar`**  | datatype $variable description                              | Note: This tag has been used in the past, but should no longer be used. Document a static variable's use in a function/method. For boolean and integer types, use `bool` and `int`, respectively.                                                  |
| **`@subpackage`** | subpackagename                                              | For page-level DocBlock, specifies the Component that all functions and defines in file belong to. For class-level DocBlock, specifies the subpackage/component the class belongs to.                                                              |
| **`@todo`**       | information string                                          | Documents planned changes to an element that have not been implemented.                                                                                                                                                                            |
| **`@type`**       | datatype description for an argument array value            | Used to denote argument array value types. See the **Hooks** or **Parameters That Are Arrays** sections for example syntax.                                                                                                                        |
| **`@uses`**       | class::methodname() / class::$variablename / functionname() | Note: This tag has been used in the past, but should no longer be used. References a key function/method used. May include a short description.                                                                                                    |
| **`@var`**        | datatype description                                        | Data type for a class variable and short description. Callbacks are marked callback.                                                                                                                                                               |

[info]
PHPDoc tags work with some text editors/IDEs to display more information about a piece of code. It is useful to developers using those editors to understand what the purpose is, and where they would use it in their code. PhpStorm and Netbeans already support PHPDoc.

The following text editors/IDEs have extensions/bundles you can install that will help you auto-create DocBlocks:

- Notepad++: [DocIt for Notepad++](http://sourceforge.net/projects/nppdocit/) (Windows)
- TextMate: [php.tmbundle](https://github.com/textmate/php.tmbundle) (Mac)
- SublimeText: [sublime packages](https://packagecontrol.io/search/phpdoc) (Windows, Mac, Linux)

Note: Even with help generating DocBlocks, most code editors don't do a very thorough job - it's likely you'll need to manually fill in certain areas of any generated DocBlocks.
[/info]

### Deprecated Tags

> **Preface:** For the time being, and for the sake of consistency, WordPress Core will continue to use `@subpackage` tags - both when writing new DocBlocks, and editing old ones.
>
> Only when the new - external - PSR-5 recommendations are finalized, will across-the-board changes be considered, such as deprecating certain tags.

As proposed in the [new PSR-5](https://github.com/phpDocumentor/fig-standards/blob/master/proposed/phpdoc.md) recommendations, the following PHPDoc tag should be deprecated:

- `@subpackage` (in favor of a unified package tag: `@package Package\Subpackage`)
- `@static` (no longer needed)
- `@staticvar` (no longer needed)

### Other Tags

**`@package` Tag in Plugins and Themes (bundled themes excluded)**

Third-party plugin and theme authors **must not** use `@package WordPress` in their plugins or themes. The `@package` name for plugins should be the plugin name; for themes, it should be the theme name, spaced with underscores: `Twenty_Fifteen`.

**`@author` Tag**

It is WordPress' policy not to use the `@author` tag, except in the case of maintaining it in external libraries. We do not want to imply any sort of "ownership" over code that might discourage contribution.

**`@copyright` and `@license` Tags**

The `@copyright` and `@license` tags are used in external libraries and scripts, and should not be used in WordPress core files.

- `@copyright` is used to specify external script copyrights.
- `@license` is used to specify external script licenses.

# Checklists

- [ ] All database queries use prepared statements.
- [ ] Data is sanitised on input and escaped on output.
- [ ] Functions and classes include full DocBlocks.

## Resources

- [Wikipedia on PHPDoc](http://en.wikipedia.org/wiki/PHPDoc)
- [PEAR Standards](http://pear.php.net/manual/en/standards.sample.php)
- [phpDocumentor](http://www.phpdoc.org/)
- [phpDocumentor Tutorial Tags](http://manual.phpdoc.org/HTMLSmartyConverter/HandS/phpDocumentor/tutorial_tags.pkg.html)
- [Draft PSR-5 recommendations](https://github.com/phpDocumentor/fig-standards/blob/master/proposed/phpdoc.md)
- [Draft PSR-19 recommendations](https://github.com/phpDocumentor/fig-standards/blob/master/proposed/phpdoc-tags.md)
- <https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/>
