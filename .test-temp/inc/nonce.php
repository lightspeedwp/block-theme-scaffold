<?php
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Nonce utilities and examples for block themes
 *
 * While block themes rely less on server-side forms, nonces are still
 * essential for AJAX endpoints, custom REST routes, and admin actions.
 */

function lswp_theme_nonce_action($suffix = '') {
    $base = 'block-theme';
    return $suffix ? $base . ':' . $suffix : $base;
}

function lswp_theme_create_nonce($action = null) {
    $action = $action ?: lswp_theme_nonce_action();
    if (function_exists('wp_create_nonce')) {
        return call_user_func('wp_create_nonce', $action);
    }
    return '';
}

function lswp_theme_verify_request_nonce($action = null, $param = '_wpnonce') {
    $action = $action ?: lswp_theme_nonce_action();
    $val = isset($_REQUEST[$param]) ? $_REQUEST[$param] : '';
    if (function_exists('wp_unslash')) {
        $val = call_user_func('wp_unslash', $val);
    }
    if (function_exists('sanitize_text_field')) {
        $val = call_user_func('sanitize_text_field', $val);
    }
    $nonce = $val;
    if (function_exists('wp_verify_nonce')) {
        return $nonce && call_user_func('wp_verify_nonce', $nonce, $action);
    }
    return false;
}

function lswp_theme_verify_rest_nonce($request, $action = null) {
    $action = $action ?: lswp_theme_nonce_action('wp_rest');
    $nonce = method_exists($request, 'get_header') ? $request->get_header('X-WP-Nonce') : '';
    if (function_exists('wp_verify_nonce')) {
        return $nonce && call_user_func('wp_verify_nonce', $nonce, $action);
    }
    return false;
}

// Example: Add nonce to frontend inline script for AJAX
if (function_exists('add_action')) {
    call_user_func('add_action', 'wp_enqueue_scripts', function () {
        if (!function_exists('wp_add_inline_script') || !function_exists('wp_script_is')) {
            return;
        }

        $nonce = lswp_theme_create_nonce(lswp_theme_nonce_action('frontend'));

        $jsonFunc = function_exists('wp_json_encode') ? 'wp_json_encode' : null;
        $jsonNonce = $jsonFunc ? call_user_func($jsonFunc, $nonce) : json_encode($nonce);
        $inline = 'window.BlockTheme = Object.assign(window.BlockTheme||{}, { nonce: ' . $jsonNonce . ' });';

        // Attach to theme script if exists
        if (call_user_func('wp_script_is', 'block-theme-script', 'registered')) {
            call_user_func('wp_add_inline_script', 'block-theme-script', $inline, 'before');
        }
    });
}

// Example: AJAX handler with nonce verification
if (function_exists('add_action')) {
    call_user_func('add_action', 'wp_ajax_block_theme_example', function () {
        if (!lswp_theme_verify_request_nonce(lswp_theme_nonce_action('frontend'))) {
            if (function_exists('wp_send_json_error')) {
                call_user_func('wp_send_json_error', array('message' => 'Invalid nonce'), 403);
            }
            exit;
        }

        if (function_exists('wp_send_json_success')) {
            call_user_func('wp_send_json_success', array('message' => 'OK'));
        } else {
            echo json_encode(array('message' => 'OK'));
        }
    });
}
