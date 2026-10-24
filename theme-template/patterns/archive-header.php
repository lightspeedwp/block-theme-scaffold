<?php
/**
 * Title: Archive Header
 * Slug: {{theme_slug}}/archive-header
 * Description: Header section for archive pages with title and description.
 * Categories: posts, query
 * Keywords: archive, header, title, description
 * Template Types: archive, category, tag, author
 * Inserter: no
 * Viewport Width: 1200
 *
 * @package {{theme_name}}
 * @since {{version}}
 */
?>
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|40"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--40)">
	<!-- wp:query-title {"type":"archive","textAlign":"center","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} /-->

	<!-- wp:term-description {"textAlign":"center","style":{"spacing":{"margin":{"bottom":"0"}}}} /-->
</div>
<!-- /wp:group -->
