<?php
/**
 * Title: Call to Action
 * Slug: block-theme-scaffold/call-to-action
 * Description: A prominent call-to-action section with heading, description, and button.
 * Categories: call-to-action, featured
 * Keywords: cta, banner, action, button, promotion
 * Viewport Width: 1400
 * Inserter: yes
 *
 * @package Block Theme Scaffold
 * @since 1.0.0
 */

$cta_title       = esc_html__( 'Ready to Get Started?', 'block-theme-scaffold' );
$cta_description = esc_html__( 'Join thousands of satisfied customers who have already taken the first step. Start your journey today.', 'block-theme-scaffold' );
$cta_button      = esc_html__( 'Get Started Now', 'block-theme-scaffold' );
?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}},"backgroundColor":"primary","textColor":"background","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-background-color has-primary-background-color has-text-color has-background" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">
	<!-- wp:heading {"textAlign":"center","level":2,"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
	<h2 class="wp-block-heading has-text-align-center" style="margin-bottom:var(--wp--preset--spacing--20)"><?php echo esc_html( $cta_title ); ?></h2>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"align":"center","fontSize":"medium","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|30"}}}} -->
	<p class="has-text-align-center has-medium-font-size" style="margin-bottom:var(--wp--preset--spacing--30)"><?php echo esc_html( $cta_description ); ?></p>
	<!-- /wp:paragraph -->

	<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
	<div class="wp-block-buttons">
		<!-- wp:button {"backgroundColor":"background","textColor":"primary","className":"is-style-fill"} -->
		<div class="wp-block-button is-style-fill"><a class="wp-block-button__link has-primary-color has-background-background-color has-text-color has-background wp-element-button" href="#"><?php echo esc_html( $cta_button ); ?></a></div>
		<!-- /wp:button -->
	</div>
	<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
