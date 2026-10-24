<?php
/**
 * Title: Hero Section
 * Slug: {{theme_slug}}/hero
 * Description: A full-width hero section with background image, title, description, and call-to-action buttons.
 * Categories: featured, call-to-action, banner
 * Keywords: hero, banner, cta, featured, cover, landing
 * Viewport Width: 1400
 * Inserter: yes
 *
 * @package {{theme_name}}
 * @since {{version}}
 */

$hero_title       = esc_html__( 'Welcome to Our Site', '{{theme_slug}}' );
$hero_description = esc_html__( 'Discover amazing content and explore what we have to offer. Start your journey today.', '{{theme_slug}}' );
$primary_button   = esc_html__( 'Get Started', '{{theme_slug}}' );
$secondary_button = esc_html__( 'Learn More', '{{theme_slug}}' );
?>
<!-- wp:cover {"dimRatio":60,"overlayColor":"black","minHeight":600,"contentPosition":"center center","align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"}}}} -->
<div class="wp-block-cover alignfull" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70);min-height:600px">
	<span aria-hidden="true" class="wp-block-cover__background has-black-background-color has-background-dim-60 has-background-dim"></span>
	<div class="wp-block-cover__inner-container">
		<!-- wp:group {"layout":{"type":"constrained","contentSize":"800px"}} -->
		<div class="wp-block-group">
			<!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontWeight":"700"}},"fontSize":"huge"} -->
			<h1 class="wp-block-heading has-text-align-center has-huge-font-size" style="font-weight:700"><?php echo esc_html( $hero_title ); ?></h1>
			<!-- /wp:heading -->

			<!-- wp:paragraph {"align":"center","fontSize":"large","style":{"spacing":{"margin":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|40"}}}} -->
			<p class="has-text-align-center has-large-font-size" style="margin-top:var(--wp--preset--spacing--30);margin-bottom:var(--wp--preset--spacing--40)"><?php echo esc_html( $hero_description ); ?></p>
			<!-- /wp:paragraph -->

			<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"blockGap":"var:preset|spacing|20"}}} -->
			<div class="wp-block-buttons">
				<!-- wp:button {"className":"is-style-fill"} -->
				<div class="wp-block-button is-style-fill"><a class="wp-block-button__link wp-element-button" href="#"><?php echo esc_html( $primary_button ); ?></a></div>
				<!-- /wp:button -->

				<!-- wp:button {"className":"is-style-outline"} -->
				<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="#"><?php echo esc_html( $secondary_button ); ?></a></div>
				<!-- /wp:button -->
			</div>
			<!-- /wp:buttons -->
		</div>
		<!-- /wp:group -->
	</div>
</div>
<!-- /wp:cover -->
