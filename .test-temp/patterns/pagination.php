<?php
/**
 * Title: Pagination
 * Slug: block-theme-scaffold/pagination
 * Description: Query pagination with previous, numbers, and next links.
 * Categories: posts, query
 * Keywords: pagination, navigation, pages, next, previous
 * Block Types: core/query-pagination
 * Inserter: no
 * Viewport Width: 800
 *
 * @package Block Theme Scaffold
 * @since 1.0.0
 */

$prev_label = esc_html__( 'Previous', 'block-theme-scaffold' );
$next_label = esc_html__( 'Next', 'block-theme-scaffold' );
?>
<!-- wp:query-pagination {"paginationArrow":"arrow","layout":{"type":"flex","justifyContent":"space-between"},"style":{"spacing":{"margin":{"top":"var:preset|spacing|50"}}}} -->
	<!-- wp:query-pagination-previous {"label":"<?php echo esc_attr( $prev_label ); ?>"} /-->

	<!-- wp:query-pagination-numbers /-->

	<!-- wp:query-pagination-next {"label":"<?php echo esc_attr( $next_label ); ?>"} /-->
<!-- /wp:query-pagination -->
