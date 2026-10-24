<?php
/**
 * Title: Posts Grid Query
 * Slug: {{theme_slug}}/query-posts-grid
 * Description: A query loop displaying posts in a responsive grid format.
 * Categories: posts, query
 * Keywords: posts, blog, grid, query, loop, cards
 * Block Types: core/query
 * Inserter: yes
 * Viewport Width: 1200
 *
 * @package {{theme_name}}
 * @since {{version}}
 */

$read_more_label = esc_html__( 'Continue reading', '{{theme_slug}}' );
$prev_label      = esc_html__( 'Previous', '{{theme_slug}}' );
$next_label      = esc_html__( 'Next', '{{theme_slug}}' );
$no_posts_text   = esc_html__( 'No posts found.', '{{theme_slug}}' );
?>
<!-- wp:query {"queryId":0,"query":{"perPage":9,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":true},"align":"wide","layout":{"type":"default"}} -->
<div class="wp-block-query alignwide">
	<!-- wp:post-template {"layout":{"type":"grid","columnCount":3},"style":{"spacing":{"blockGap":"var:preset|spacing|40"}}} -->
		<!-- wp:group {"tagName":"article","style":{"spacing":{"blockGap":"var:preset|spacing|20"},"border":{"radius":"8px"}},"layout":{"type":"constrained"}} -->
		<article class="wp-block-group" style="border-radius:8px">
			<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"4/3","style":{"border":{"radius":{"topLeft":"8px","topRight":"8px"}}}} /-->

			<!-- wp:group {"style":{"spacing":{"padding":{"right":"var:preset|spacing|20","left":"var:preset|spacing|20","bottom":"var:preset|spacing|20"},"blockGap":"var:preset|spacing|10"}},"layout":{"type":"constrained"}} -->
			<div class="wp-block-group" style="padding-right:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--20);padding-bottom:var(--wp--preset--spacing--20)">
				<!-- wp:post-terms {"term":"category","fontSize":"small"} /-->

				<!-- wp:post-title {"isLink":true,"level":3,"style":{"typography":{"fontStyle":"normal","fontWeight":"600"}},"fontSize":"medium"} /-->

				<!-- wp:post-excerpt {"moreText":"<?php echo esc_attr( $read_more_label ); ?>","excerptLength":15} /-->

				<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"},"fontSize":"small"} -->
				<div class="wp-block-group has-small-font-size">
					<!-- wp:post-date /-->
					<!-- wp:post-author {"showAvatar":false,"showBio":false,"byline":"","isLink":true} /-->
				</div>
				<!-- /wp:group -->
			</div>
			<!-- /wp:group -->
		</article>
		<!-- /wp:group -->
	<!-- /wp:post-template -->

	<!-- wp:query-pagination {"paginationArrow":"arrow","layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"var:preset|spacing|50"}}}} -->
		<!-- wp:query-pagination-previous {"label":"<?php echo esc_attr( $prev_label ); ?>"} /-->
		<!-- wp:query-pagination-numbers /-->
		<!-- wp:query-pagination-next {"label":"<?php echo esc_attr( $next_label ); ?>"} /-->
	<!-- /wp:query-pagination -->

	<!-- wp:query-no-results -->
		<!-- wp:group {"layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50"}}}} -->
		<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50)">
			<!-- wp:paragraph {"align":"center"} -->
			<p class="has-text-align-center"><?php echo esc_html( $no_posts_text ); ?></p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:group -->
	<!-- /wp:query-no-results -->
</div>
<!-- /wp:query -->
