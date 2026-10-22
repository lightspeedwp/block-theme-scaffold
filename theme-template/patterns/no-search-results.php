<?php
/**
 * Title: No Search Results
 * Slug: {{theme_slug}}/no-search-results
 * Description: Content displayed when no search results are found.
 * Categories: text
 * Keywords: search, no results, empty
 * Inserter: no
 * Viewport Width: 800
 *
 * @package {{theme_name}}
 * @since {{version}}
 */

$heading_text       = esc_html__( 'Nothing Found', '{{theme_slug}}' );
$description_text   = esc_html__( 'Sorry, but nothing matched your search terms. Please try again with some different keywords.', '{{theme_slug}}' );
$search_label       = esc_html__( 'Search', '{{theme_slug}}' );
$search_placeholder = esc_html__( 'Search...', '{{theme_slug}}' );
?>
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50)" role="region" aria-label="<?php esc_attr_e( 'No search results', '{{theme_slug}}' ); ?>">
	<!-- wp:heading {"textAlign":"center","level":2,"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
	<h2 class="wp-block-heading has-text-align-center" style="margin-bottom:var(--wp--preset--spacing--20)"><?php echo esc_html( $heading_text ); ?></h2>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|30"}}}} -->
	<p class="has-text-align-center" style="margin-bottom:var(--wp--preset--spacing--30)"><?php echo esc_html( $description_text ); ?></p>
	<!-- /wp:paragraph -->

	<!-- wp:search {"label":"<?php echo esc_attr( $search_label ); ?>","showLabel":false,"placeholder":"<?php echo esc_attr( $search_placeholder ); ?>","width":80,"widthUnit":"%","buttonText":"<?php echo esc_attr( $search_label ); ?>","buttonPosition":"button-inside","buttonUseIcon":true,"align":"center"} /-->
</div>
<!-- /wp:group -->
