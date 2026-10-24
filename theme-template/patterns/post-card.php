<?php
/**
 * Title: Post Card
 * Slug: {{theme_slug}}/post-card
 * Description: A single post card with featured image, title, excerpt, and metadata.
 * Categories: posts
 * Keywords: post, card, article, blog
 * Inserter: no
 * Viewport Width: 400
 *
 * @package {{theme_name}}
 * @since {{version}}
 */

$read_more_label = esc_html__( 'Continue reading', '{{theme_slug}}' );
?>
<!-- wp:group {"tagName":"article","style":{"spacing":{"blockGap":"var:preset|spacing|20"},"border":{"radius":"8px","width":"1px"}},"borderColor":"neutral","layout":{"type":"constrained"}} -->
<article class="wp-block-group has-border-color has-neutral-border-color" style="border-width:1px;border-radius:8px">
	<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"16/9","style":{"border":{"radius":{"topLeft":"8px","topRight":"8px"}}}} /-->

	<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|20","right":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30"},"blockGap":"var:preset|spacing|15"}},"layout":{"type":"constrained"}} -->
	<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30)">
		<!-- wp:post-terms {"term":"category","style":{"typography":{"textTransform":"uppercase"}},"fontSize":"x-small"} /-->

		<!-- wp:post-title {"isLink":true,"level":3,"style":{"typography":{"fontStyle":"normal","fontWeight":"600"},"spacing":{"margin":{"top":"var:preset|spacing|10"}}},"fontSize":"medium"} /-->

		<!-- wp:post-excerpt {"moreText":"<?php echo esc_attr( $read_more_label ); ?>","excerptLength":20} /-->

		<!-- wp:separator {"className":"is-style-wide","style":{"spacing":{"margin":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20"}}}} -->
		<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide" style="margin-top:var(--wp--preset--spacing--20);margin-bottom:var(--wp--preset--spacing--20)" aria-hidden="true"/>
		<!-- /wp:separator -->

		<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"},"fontSize":"small"} -->
		<div class="wp-block-group has-small-font-size" aria-label="<?php esc_attr_e( 'Post metadata', '{{theme_slug}}' ); ?>">
			<!-- wp:post-date /-->
			<!-- wp:post-author {"showAvatar":false,"showBio":false,"isLink":true} /-->
		</div>
		<!-- /wp:group -->
	</div>
	<!-- /wp:group -->
</article>
<!-- /wp:group -->
