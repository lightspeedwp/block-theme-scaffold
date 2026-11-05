<?php
/**
 * Title: Header
 * Slug: {{theme_slug}}/header
 * Description: Main site header with logo, site title, tagline, and navigation menu.
 * Categories: header
 * Keywords: header, navigation, menu, logo, site-title
 * Block Types: core/template-part/header
 * Inserter: no
 *
 * @package {{theme_name}}
 * @since {{version}}
 */
?>
<!-- wp:group {"tagName":"header","style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"}}},"backgroundColor":"base","layout":{"type":"constrained"}} -->
<header class="wp-block-group has-base-background-color has-background" style="padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)">
	<!-- wp:group {"align":"wide","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
	<div class="wp-block-group alignwide">
		<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
		<div class="wp-block-group">
			<!-- wp:site-logo {"width":50,"shouldSyncIcon":true} /-->

			<!-- wp:group {"style":{"spacing":{"blockGap":"0"}},"layout":{"type":"constrained"}} -->
			<div class="wp-block-group">
				<!-- wp:site-title {"level":0,"style":{"typography":{"fontWeight":"700"}},"fontSize":"300"} /-->
				<!-- wp:site-tagline {"fontSize":"100","style":{"elements":{"link":{"color":{"text":"var:preset|color|contrast"}}},"color":{"text":"var:preset|color|contrast"}}} /-->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:group -->

		<!-- wp:navigation {"ref":0,"textColor":"contrast","overlayBackgroundColor":"base","overlayTextColor":"contrast","layout":{"type":"flex","setCascadingProperties":true,"justifyContent":"right","orientation":"horizontal"},"style":{"spacing":{"blockGap":"var:preset|spacing|30"},"typography":{"fontWeight":"500"}},"fontSize":"100"} /-->
	</div>
	<!-- /wp:group -->
</header>
<!-- /wp:group -->
