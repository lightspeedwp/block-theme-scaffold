<?php
/**
 * Title: Sidebar
 * Slug: block-theme-scaffold/sidebar
 * Description: A sidebar with search, recent posts, categories, tags, and archives widgets.
 * Categories: block-theme-scaffold-components
 * Keywords: sidebar, widgets, search, categories, tags, archives
 * Block Types: core/template-part/sidebar
 * Viewport Width: 400
 */
?>
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group" role="complementary" aria-label="<?php esc_attr_e( 'Blog sidebar', 'block-theme-scaffold' ); ?>">
	<!-- wp:heading {"level":2,"className":"screen-reader-text"} -->
	<h2 class="wp-block-heading screen-reader-text"><?php esc_html_e( 'Sidebar', 'block-theme-scaffold' ); ?></h2>
	<!-- /wp:heading -->

	<!-- wp:search {"label":"<?php esc_attr_e( 'Search', 'block-theme-scaffold' ); ?>","showLabel":false,"placeholder":"<?php esc_attr_e( 'Search…', 'block-theme-scaffold' ); ?>","buttonText":"<?php esc_attr_e( 'Search', 'block-theme-scaffold' ); ?>"} /-->

	<!-- wp:separator -->
	<hr class="wp-block-separator has-alpha-channel-opacity"/>
	<!-- /wp:separator -->

	<!-- wp:heading {"level":3} -->
	<h3 class="wp-block-heading"><?php esc_html_e( 'Recent Posts', 'block-theme-scaffold' ); ?></h3>
	<!-- /wp:heading -->

	<!-- wp:latest-posts {"postsToShow":5,"displayPostDate":true} /-->

	<!-- wp:separator -->
	<hr class="wp-block-separator has-alpha-channel-opacity"/>
	<!-- /wp:separator -->

	<!-- wp:heading {"level":3} -->
	<h3 class="wp-block-heading"><?php esc_html_e( 'Categories', 'block-theme-scaffold' ); ?></h3>
	<!-- /wp:heading -->

	<!-- wp:categories {"showPostCounts":true} /-->

	<!-- wp:separator -->
	<hr class="wp-block-separator has-alpha-channel-opacity"/>
	<!-- /wp:separator -->

	<!-- wp:heading {"level":3} -->
	<h3 class="wp-block-heading"><?php esc_html_e( 'Tags', 'block-theme-scaffold' ); ?></h3>
	<!-- /wp:heading -->

	<!-- wp:tag-cloud {"numberOfTags":20} /-->

	<!-- wp:separator -->
	<hr class="wp-block-separator has-alpha-channel-opacity"/>
	<!-- /wp:separator -->

	<!-- wp:heading {"level":3} -->
	<h3 class="wp-block-heading"><?php esc_html_e( 'Archives', 'block-theme-scaffold' ); ?></h3>
	<!-- /wp:heading -->

	<!-- wp:archives {"showPostCounts":true} /-->
</div>
<!-- /wp:group -->
