<?php
/**
 * Title: Single Post Content
 * Slug: block-theme-scaffold/single-post-content
 * Description: Content layout for single blog posts with title, meta, content, and tags.
 * Categories: posts
 * Keywords: single, post, article, blog, content
 * Template Types: single
 * Inserter: no
 * Viewport Width: 1200
 *
 * @package Block Theme Scaffold
 * @since 1.0.0
 */
?>
<!-- wp:group {"tagName":"article","style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"constrained"}} -->
<article class="wp-block-group">
	<!-- wp:post-title {"textAlign":"center","level":1,"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} /-->

	<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"center"},"style":{"spacing":{"blockGap":"var:preset|spacing|15"}},"fontSize":"small"} -->
	<div class="wp-block-group has-small-font-size" aria-label="<?php esc_attr_e( 'Post metadata', 'block-theme-scaffold' ); ?>">
		<!-- wp:post-date /-->
		<!-- wp:paragraph {"fontSize":"small"} -->
		<p class="has-small-font-size" aria-hidden="true">·</p>
		<!-- /wp:paragraph -->
		<!-- wp:post-author {"showAvatar":false,"isLink":true} /-->
		<!-- wp:paragraph {"fontSize":"small"} -->
		<p class="has-small-font-size" aria-hidden="true">·</p>
		<!-- /wp:paragraph -->
		<!-- wp:post-terms {"term":"category"} /-->
	</div>
	<!-- /wp:group -->

	<!-- wp:post-featured-image {"align":"wide","style":{"spacing":{"margin":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40"}},"border":{"radius":"8px"}}} /-->

	<!-- wp:post-content {"layout":{"type":"constrained"}} /-->

	<!-- wp:group {"style":{"spacing":{"margin":{"top":"var:preset|spacing|50"},"padding":{"top":"var:preset|spacing|30"}}},"layout":{"type":"flex","flexWrap":"wrap"},"fontSize":"small"} -->
	<div class="wp-block-group has-small-font-size" style="margin-top:var(--wp--preset--spacing--50);padding-top:var(--wp--preset--spacing--30)" aria-label="<?php esc_attr_e( 'Post tags', 'block-theme-scaffold' ); ?>">
		<!-- wp:paragraph {"style":{"typography":{"fontWeight":"600"}}} -->
		<p style="font-weight:600"><?php esc_html_e( 'Tags:', 'block-theme-scaffold' ); ?></p>
		<!-- /wp:paragraph -->
		<!-- wp:post-terms {"term":"post_tag"} /-->
	</div>
	<!-- /wp:group -->
</article>
<!-- /wp:group -->
