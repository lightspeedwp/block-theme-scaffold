<?php
/**
 * Title: 404 Page Content
 * Slug: {{theme_slug}}/404-content
 * Description: Content displayed when a page is not found, includes search and recent posts.
 * Categories: text
 * Keywords: 404, not found, error, search
 * Template Types: 404
 * Inserter: no
 * Viewport Width: 1200
 *
 * @package {{theme_name}}
 * @since {{version}}
 */

$heading_text     = esc_html__( 'Page Not Found', '{{theme_slug}}' );
$description_text = esc_html__( 'Sorry, the page you are looking for could not be found. Try searching for it below or browse our recent posts.', '{{theme_slug}}' );
$search_label     = esc_html__( 'Search', '{{theme_slug}}' );
$search_placeholder = esc_html__( 'Search the site...', '{{theme_slug}}' );
$recent_posts_heading = esc_html__( 'Recent Posts', '{{theme_slug}}' );
$homepage_button_text = esc_html__( 'Go to Homepage', '{{theme_slug}}' );
$no_posts_text    = esc_html__( 'No posts available.', '{{theme_slug}}' );
?>
<!-- wp:group {"tagName":"main","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}},"layout":{"type":"constrained"}} -->
<main class="wp-block-group" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)" role="main" aria-labelledby="error-title">
	<!-- wp:heading {"textAlign":"center","level":1,"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|30"}}},"anchor":"error-title"} -->
	<h1 class="wp-block-heading has-text-align-center" id="error-title" style="margin-bottom:var(--wp--preset--spacing--30)"><?php echo esc_html( $heading_text ); ?></h1>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"align":"center","fontSize":"large","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|40"}}}} -->
	<p class="has-text-align-center has-large-font-size" style="margin-bottom:var(--wp--preset--spacing--40)"><?php echo esc_html( $description_text ); ?></p>
	<!-- /wp:paragraph -->

	<!-- wp:search {"label":"<?php echo esc_attr( $search_label ); ?>","showLabel":false,"placeholder":"<?php echo esc_attr( $search_placeholder ); ?>","width":100,"widthUnit":"%","buttonText":"<?php echo esc_attr( $search_label ); ?>","buttonPosition":"button-inside","buttonUseIcon":true,"align":"center","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|50"}}}} /-->

	<!-- wp:separator {"opacity":"css","className":"is-style-wide","style":{"spacing":{"margin":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40"}}}} -->
	<hr class="wp-block-separator has-css-opacity is-style-wide" style="margin-top:var(--wp--preset--spacing--40);margin-bottom:var(--wp--preset--spacing--40)" aria-hidden="true"/>
	<!-- /wp:separator -->

	<!-- wp:heading {"textAlign":"center","level":2,"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|40"}}}} -->
	<h2 class="wp-block-heading has-text-align-center" style="margin-bottom:var(--wp--preset--spacing--40)"><?php echo esc_html( $recent_posts_heading ); ?></h2>
	<!-- /wp:heading -->

	<!-- wp:query {"queryId":0,"query":{"perPage":3,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false},"align":"wide"} -->
	<div class="wp-block-query alignwide">
		<!-- wp:post-template {"layout":{"type":"grid","columnCount":3},"style":{"spacing":{"blockGap":"var:preset|spacing|40"}}} -->
			<!-- wp:group {"tagName":"article","style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"layout":{"type":"constrained"}} -->
			<article class="wp-block-group">
				<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"16/9","style":{"border":{"radius":"4px"}}} /-->

				<!-- wp:post-title {"isLink":true,"level":3,"fontSize":"medium"} /-->

				<!-- wp:post-excerpt {"excerptLength":20} /-->

				<!-- wp:post-date {"isLink":true,"fontSize":"small"} /-->
			</article>
			<!-- /wp:group -->
		<!-- /wp:post-template -->

		<!-- wp:query-no-results -->
			<!-- wp:paragraph {"align":"center"} -->
			<p class="has-text-align-center"><?php echo esc_html( $no_posts_text ); ?></p>
			<!-- /wp:paragraph -->
		<!-- /wp:query-no-results -->
	</div>
	<!-- /wp:query -->

	<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"var:preset|spacing|50"}}}} -->
	<div class="wp-block-buttons" style="margin-top:var(--wp--preset--spacing--50)">
		<!-- wp:button -->
		<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php echo esc_html( $homepage_button_text ); ?></a></div>
		<!-- /wp:button -->
	</div>
	<!-- /wp:buttons -->
</main>
<!-- /wp:group -->
