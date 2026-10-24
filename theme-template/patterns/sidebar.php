<?php
/**
 * Title: Sidebar
 * Slug: {{theme_slug}}/sidebar
 * Description: A sidebar with search, recent posts, categories, tags, and archives widgets.
 * Categories: {{theme_slug}}-components
 * Keywords: sidebar, widgets, search, categories, tags, archives
 * Block Types: core/template-part/sidebar
 * Viewport Width: 400
 */
?>
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group" role="complementary" aria-label="<?php esc_attr_e( 'Blog sidebar', '{{theme_slug}}' ); ?>">
	<!-- wp:heading {"level":2,"className":"screen-reader-text"} -->
	<h2 class="wp-block-heading screen-reader-text"><?php esc_html_e( 'Sidebar', '{{theme_slug}}' ); ?></h2>
	<!-- /wp:heading -->

	<!-- wp:search {"label":"<?php esc_attr_e( 'Search', '{{theme_slug}}' ); ?>","showLabel":false,"placeholder":"<?php esc_attr_e( 'Search…', '{{theme_slug}}' ); ?>","buttonText":"<?php esc_attr_e( 'Search', '{{theme_slug}}' ); ?>"} /-->

	<!-- wp:separator -->
	<hr class="wp-block-separator has-alpha-channel-opacity"/>
	<!-- /wp:separator -->

	<!-- wp:heading {"level":3} -->
	<h3 class="wp-block-heading"><?php esc_html_e( 'Recent Posts', '{{theme_slug}}' ); ?></h3>
	<!-- /wp:heading -->

	<!-- wp:latest-posts {"postsToShow":5,"displayPostDate":true} /-->

	<!-- wp:separator -->
	<hr class="wp-block-separator has-alpha-channel-opacity"/>
	<!-- /wp:separator -->

	<!-- wp:heading {"level":3} -->
	<h3 class="wp-block-heading"><?php esc_html_e( 'Categories', '{{theme_slug}}' ); ?></h3>
	<!-- /wp:heading -->

	<!-- wp:categories {"showPostCounts":true} /-->

	<!-- wp:separator -->
	<hr class="wp-block-separator has-alpha-channel-opacity"/>
	<!-- /wp:separator -->

	<!-- wp:heading {"level":3} -->
	<h3 class="wp-block-heading"><?php esc_html_e( 'Tags', '{{theme_slug}}' ); ?></h3>
	<!-- /wp:heading -->

	<!-- wp:tag-cloud {"numberOfTags":20} /-->

	<!-- wp:separator -->
	<hr class="wp-block-separator has-alpha-channel-opacity"/>
	<!-- /wp:separator -->

	<!-- wp:heading {"level":3} -->
	<h3 class="wp-block-heading"><?php esc_html_e( 'Archives', '{{theme_slug}}' ); ?></h3>
	<!-- /wp:heading -->

	<!-- wp:archives {"showPostCounts":true} /-->
</div>
<!-- /wp:group -->
