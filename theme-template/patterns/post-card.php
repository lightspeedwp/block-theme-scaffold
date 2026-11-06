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
<!-- wp:group {"tagName":"article","style":{"spacing":{"blockGap":"var:preset|spacing|20"},"border":{"radius":"8px","width":"1px","color":"var(--wp--custom--color--border--default)"}},"layout":{"type":"constrained"}} -->
<article class="wp-block-group has-border-color" style="border-color:var(--wp--custom--color--border--default);border-width:1px;border-radius:8px">
	<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"16/9","style":{"border":{"radius":{"topLeft":"8px","topRight":"8px"}}}} /-->

	<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|20","right":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30"},"blockGap":"var:preset|spacing|20"}},"layout":{"type":"constrained"}} -->
	<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30)">
		<!-- wp:post-terms {"term":"category","style":{"typography":{"textTransform":"uppercase"}},"fontSize":"100"} /-->

		<!-- wp:post-title {"isLink":true,"level":3,"style":{"typography":{"fontStyle":"normal","fontWeight":"600"},"spacing":{"margin":{"top":"var:preset|spacing|10"}}},"fontSize":"300"} /-->

		<!-- wp:post-excerpt {"moreText":"<?php echo esc_attr( $read_more_label ); ?>","excerptLength":20} /-->

		<!-- wp:separator {"className":"is-style-wide","style":{"spacing":{"margin":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20"}}}} -->
		<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide" style="margin-top:var(--wp--preset--spacing--20);margin-bottom:var(--wp--preset--spacing--20)"/>
		<!-- /wp:separator -->

		<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"},"fontSize":"100"} -->
		<div class="wp-block-group has-100-font-size">
			<!-- wp:post-date /-->
			<!-- wp:post-author {"showAvatar":false,"showBio":false,"isLink":true} /-->
		</div>
		<!-- /wp:group -->
	</div>
	<!-- /wp:group -->
</article>
<!-- /wp:group -->
