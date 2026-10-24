<?php
/**
 * Title: Features Grid
 * Slug: {{theme_slug}}/features
 * Description: A three-column grid showcasing features or services with titles and descriptions.
 * Categories: featured, services
 * Keywords: features, services, benefits, columns, grid
 * Viewport Width: 1400
 * Inserter: yes
 *
 * @package {{theme_name}}
 * @since {{version}}
 */

$section_title    = esc_html__( 'Our Features', '{{theme_slug}}' );
$section_desc     = esc_html__( 'Discover what makes us different and why customers choose us.', '{{theme_slug}}' );
$feature_1_title  = esc_html__( 'Fast Performance', '{{theme_slug}}' );
$feature_1_desc   = esc_html__( 'Optimized for speed and efficiency, delivering the best experience for your users.', '{{theme_slug}}' );
$feature_2_title  = esc_html__( 'Easy to Use', '{{theme_slug}}' );
$feature_2_desc   = esc_html__( 'Intuitive design and simple setup process to get you started quickly.', '{{theme_slug}}' );
$feature_3_title  = esc_html__( 'Reliable Support', '{{theme_slug}}' );
$feature_3_desc   = esc_html__( 'Our dedicated support team is here to help you every step of the way.', '{{theme_slug}}' );
?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">
	<!-- wp:heading {"textAlign":"center","level":2,"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
	<h2 class="wp-block-heading has-text-align-center" style="margin-bottom:var(--wp--preset--spacing--20)"><?php echo esc_html( $section_title ); ?></h2>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|50"}}}} -->
	<p class="has-text-align-center" style="margin-bottom:var(--wp--preset--spacing--50)"><?php echo esc_html( $section_desc ); ?></p>
	<!-- /wp:paragraph -->

	<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|40","left":"var:preset|spacing|40"}}}} -->
	<div class="wp-block-columns alignwide">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","right":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30"}},"border":{"radius":"8px"}},"backgroundColor":"neutral","layout":{"type":"constrained"}} -->
			<div class="wp-block-group has-neutral-background-color has-background" style="border-radius:8px;padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30)">
				<!-- wp:heading {"textAlign":"center","level":3,"fontSize":"large"} -->
				<h3 class="wp-block-heading has-text-align-center has-large-font-size"><?php echo esc_html( $feature_1_title ); ?></h3>
				<!-- /wp:heading -->

				<!-- wp:paragraph {"align":"center"} -->
				<p class="has-text-align-center"><?php echo esc_html( $feature_1_desc ); ?></p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","right":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30"}},"border":{"radius":"8px"}},"backgroundColor":"neutral","layout":{"type":"constrained"}} -->
			<div class="wp-block-group has-neutral-background-color has-background" style="border-radius:8px;padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30)">
				<!-- wp:heading {"textAlign":"center","level":3,"fontSize":"large"} -->
				<h3 class="wp-block-heading has-text-align-center has-large-font-size"><?php echo esc_html( $feature_2_title ); ?></h3>
				<!-- /wp:heading -->

				<!-- wp:paragraph {"align":"center"} -->
				<p class="has-text-align-center"><?php echo esc_html( $feature_2_desc ); ?></p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","right":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30"}},"border":{"radius":"8px"}},"backgroundColor":"neutral","layout":{"type":"constrained"}} -->
			<div class="wp-block-group has-neutral-background-color has-background" style="border-radius:8px;padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30)">
				<!-- wp:heading {"textAlign":"center","level":3,"fontSize":"large"} -->
				<h3 class="wp-block-heading has-text-align-center has-large-font-size"><?php echo esc_html( $feature_3_title ); ?></h3>
				<!-- /wp:heading -->

				<!-- wp:paragraph {"align":"center"} -->
				<p class="has-text-align-center"><?php echo esc_html( $feature_3_desc ); ?></p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</div>
<!-- /wp:group -->
