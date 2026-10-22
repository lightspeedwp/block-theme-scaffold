<?php
/**
 * Title: Author Header
 * Slug: {{theme_slug}}/author-header
 * Description: Header section for author archive pages with avatar and biography.
 * Categories: posts
 * Keywords: author, header, avatar, biography
 * Template Types: author
 * Inserter: no
 * Viewport Width: 1200
 *
 * @package {{theme_name}}
 * @since {{version}}
 */
?>
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|40"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--40)">
	<!-- wp:query-title {"type":"author","textAlign":"center","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|30"}}}} /-->

	<!-- wp:avatar {"size":120,"isLink":false,"align":"center","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} /-->

	<!-- wp:post-author-biography {"textAlign":"center","style":{"typography":{"lineHeight":"1.7"}},"fontSize":"medium"} /-->
</div>
<!-- /wp:group -->
