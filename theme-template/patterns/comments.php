<?php
/**
 * Title: Comments
 * Slug: {{theme_slug}}/comments
 * Categories: posts
 * Keywords: comments, discussion
 * Description: Comments section with form and list.
 * Block Types: core/comments
 */
?>
<!-- wp:comments {"className":"wp-block-comments-query-loop"} -->
<div class="wp-block-comments wp-block-comments-query-loop">
    <!-- wp:heading {"level":2} -->
    <h2><?php esc_html_e( 'Comments', '{{theme_slug}}' ); ?></h2>
    <!-- /wp:heading -->

    <!-- wp:comments-title {"level":3} /-->

    <!-- wp:comment-template -->
        <!-- wp:group {"style":{"spacing":{"margin":{"top":"0","bottom":"var:preset|spacing|medium"}}}} -->
        <div class="wp-block-group" style="margin-top:0;margin-bottom:var(--wp--preset--spacing--medium)">
            <!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
            <div class="wp-block-group">
                <!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
                <div class="wp-block-group">
                    <!-- wp:avatar {"size":40,"style":{"border":{"radius":"20px"}}} /-->
                    <!-- wp:group {"layout":{"type":"flex","orientation":"vertical","justifyContent":"left"}} -->
                    <div class="wp-block-group">
                        <!-- wp:comment-author-name /-->
                        <!-- wp:comment-date {"format":"F j, Y \\a\\t g:i a"} /-->
                    </div>
                    <!-- /wp:group -->
                </div>
                <!-- /wp:group -->
                <!-- wp:comment-edit-link /-->
            </div>
            <!-- /wp:group -->

            <!-- wp:comment-content /-->

            <!-- wp:comment-reply-link {"style":{"typography":{"fontSize":"0.875rem"}}} /-->
        </div>
        <!-- /wp:group -->
    <!-- /wp:comment-template -->

    <!-- wp:comments-pagination {"layout":{"type":"flex","justifyContent":"space-between"}} -->
        <!-- wp:comments-pagination-previous /-->
        <!-- wp:comments-pagination-numbers /-->
        <!-- wp:comments-pagination-next /-->
    <!-- /wp:comments-pagination -->

    <!-- wp:post-comments-form /-->
</div>
<!-- /wp:comments -->
