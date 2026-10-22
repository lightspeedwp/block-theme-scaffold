<?php
/**
 * Title: Posts List Query
 * Slug: {{theme_slug}}/query-posts-list
 * Description: A query loop displaying posts in a list format with title, excerpt, and metadata.
 * Categories: posts, query
 * Keywords: posts, blog, list, query, loop
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
<!-- wp:query {"queryId":0,"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":true},"align":"wide","layout":{"type":"default"}} -->
<div class="wp-block-query alignwide">
	<!-- wp:post-template {"style":{"spacing":{"blockGap":"var:preset|spacing|50"}},"layout":{"type":"default"}} -->
		<!-- wp:group {"tagName":"article","style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"layout":{"type":"constrained"}} -->
		<article class="wp-block-group">
			<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"16/9","style":{"border":{"radius":"4px"}}} /-->

			<!-- wp:post-title {"isLink":true,"level":2,"style":{"typography":{"fontStyle":"normal","fontWeight":"600"}},"fontSize":"large"} /-->

			<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap"},"style":{"spacing":{"blockGap":"var:preset|spacing|10"}},"fontSize":"small"} -->
			<div class="wp-block-group has-small-font-size" aria-label="<?php esc_attr_e( 'Post metadata', '{{theme_slug}}' ); ?>">
				<!-- wp:post-date {"isLink":true} /-->
				<!-- wp:paragraph {"fontSize":"small"} -->
				<p class="has-small-font-size" aria-hidden="true">·</p>
				<!-- /wp:paragraph -->
				<!-- wp:post-author {"showAvatar":false,"showBio":false,"byline":"","isLink":true} /-->
				<!-- wp:paragraph {"fontSize":"small"} -->
				<p class="has-small-font-size" aria-hidden="true">·</p>
				<!-- /wp:paragraph -->
				<!-- wp:post-terms {"term":"category"} /-->
			</div>
			<!-- /wp:group -->

			<!-- wp:post-excerpt {"moreText":"<?php echo esc_attr( $read_more_label ); ?>","excerptLength":30,"style":{"spacing":{"margin":{"top":"var:preset|spacing|20"}}}} /-->
		</article>
		<!-- /wp:group -->
	<!-- /wp:post-template -->

	<!-- wp:query-pagination {"paginationArrow":"arrow","layout":{"type":"flex","justifyContent":"space-between"},"style":{"spacing":{"margin":{"top":"var:preset|spacing|50"}}}} -->
		<!-- wp:query-pagination-previous {"label":"<?php echo esc_attr( $prev_label ); ?>"} /-->
		<!-- wp:query-pagination-numbers /-->
		<!-- wp:query-pagination-next {"label":"<?php echo esc_attr( $next_label ); ?>"} /-->
	<!-- /wp:query-pagination -->

	<!-- wp:query-no-results -->
		<!-- wp:paragraph {"align":"center"} -->
		<p class="has-text-align-center"><?php echo esc_html( $no_posts_text ); ?></p>
		<!-- /wp:paragraph -->
	<!-- /wp:query-no-results -->
</div>
<!-- /wp:query -->
