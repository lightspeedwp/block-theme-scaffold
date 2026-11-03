<?php
/**
 * Title: Call to Action
 * Slug: {{theme_slug}}/call-to-action
 * Description: A prominent call-to-action section with heading, description, and button.
 * Categories: call-to-action, featured
 * Keywords: cta, banner, action, button, promotion
 * Viewport Width: 1400
 * Inserter: yes
 *
 * @package {{theme_name}}
 * @since {{version}}
 */

$cta_title       = esc_html__( 'Ready to Get Started?', '{{theme_slug}}' );
$cta_description = esc_html__( 'Join thousands of satisfied customers who have already taken the first step. Start your journey today.', '{{theme_slug}}' );
$cta_button      = esc_html__( 'Get Started Now', '{{theme_slug}}' );
?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}},"backgroundColor":"primary-500","textColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-color has-primary-500-background-color has-text-color has-background" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">
	<!-- wp:heading {"textAlign":"center","level":2,"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
	<h2 class="wp-block-heading has-text-align-center" style="margin-bottom:var(--wp--preset--spacing--20)"><?php echo esc_html( $cta_title ); ?></h2>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"align":"center","fontSize":"300","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|30"}}}} -->
	<p class="has-text-align-center has-300-font-size" style="margin-bottom:var(--wp--preset--spacing--30)"><?php echo esc_html( $cta_description ); ?></p>
	<!-- /wp:paragraph -->

	<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
	<div class="wp-block-buttons">
		<!-- wp:button {"backgroundColor":"base","textColor":"primary-500","className":"is-style-fill"} -->
		<div class="wp-block-button is-style-fill"><a class="wp-block-button__link has-primary-500-color has-base-background-color has-text-color has-background wp-element-button" href="#"><?php echo esc_html( $cta_button ); ?></a></div>
		<!-- /wp:button -->
	</div>
	<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
