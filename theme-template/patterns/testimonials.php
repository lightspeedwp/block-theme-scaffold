<?php
/**
 * Title: Testimonials
 * Slug: {{theme_slug}}/testimonials
 * Description: A three-column grid of customer testimonials with quotes and attribution.
 * Categories: testimonials, text
 * Keywords: testimonials, reviews, quotes, social proof, customers
 * Viewport Width: 1400
 * Inserter: yes
 *
 * @package {{theme_name}}
 * @since {{version}}
 */

$section_title = esc_html__( 'What Our Customers Say', '{{theme_slug}}' );

$testimonial_1_text   = esc_html__( '"This product has completely transformed how we work. The efficiency gains have been incredible and the support team is always there when we need them."', '{{theme_slug}}' );
$testimonial_1_author = esc_html__( 'Jane Smith', '{{theme_slug}}' );
$testimonial_1_role   = esc_html__( 'CEO, Tech Company', '{{theme_slug}}' );

$testimonial_2_text   = esc_html__( '"I was skeptical at first, but after just one month of use, I became a believer. The results speak for themselves."', '{{theme_slug}}' );
$testimonial_2_author = esc_html__( 'John Doe', '{{theme_slug}}' );
$testimonial_2_role   = esc_html__( 'Marketing Director', '{{theme_slug}}' );

$testimonial_3_text   = esc_html__( '"Outstanding quality and exceptional customer service. This is exactly what we were looking for to take our business to the next level."', '{{theme_slug}}' );
$testimonial_3_author = esc_html__( 'Sarah Johnson', '{{theme_slug}}' );
$testimonial_3_role   = esc_html__( 'Small Business Owner', '{{theme_slug}}' );
?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}},"backgroundColor":"neutral","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-neutral-background-color has-background" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">
	<!-- wp:heading {"textAlign":"center","level":2,"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|50"}}}} -->
	<h2 class="wp-block-heading has-text-align-center" style="margin-bottom:var(--wp--preset--spacing--50)"><?php echo esc_html( $section_title ); ?></h2>
	<!-- /wp:heading -->

	<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|40"}}}} -->
	<div class="wp-block-columns alignwide">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","right":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30"}},"border":{"radius":"8px"}},"backgroundColor":"background","layout":{"type":"constrained"}} -->
			<div class="wp-block-group has-background-background-color has-background" style="border-radius:8px;padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30)">
				<!-- wp:paragraph {"style":{"typography":{"fontStyle":"italic","lineHeight":"1.7"}}} -->
				<p style="font-style:italic;line-height:1.7"><?php echo esc_html( $testimonial_1_text ); ?></p>
				<!-- /wp:paragraph -->

				<!-- wp:separator {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20"}}},"className":"is-style-wide"} -->
				<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide" style="margin-top:var(--wp--preset--spacing--20);margin-bottom:var(--wp--preset--spacing--20)" aria-hidden="true"/>
				<!-- /wp:separator -->

				<!-- wp:paragraph {"fontSize":"small"} -->
				<p class="has-small-font-size"><strong><?php echo esc_html( $testimonial_1_author ); ?></strong><br/><span style="opacity:0.7"><?php echo esc_html( $testimonial_1_role ); ?></span></p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","right":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30"}},"border":{"radius":"8px"}},"backgroundColor":"background","layout":{"type":"constrained"}} -->
			<div class="wp-block-group has-background-background-color has-background" style="border-radius:8px;padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30)">
				<!-- wp:paragraph {"style":{"typography":{"fontStyle":"italic","lineHeight":"1.7"}}} -->
				<p style="font-style:italic;line-height:1.7"><?php echo esc_html( $testimonial_2_text ); ?></p>
				<!-- /wp:paragraph -->

				<!-- wp:separator {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20"}}},"className":"is-style-wide"} -->
				<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide" style="margin-top:var(--wp--preset--spacing--20);margin-bottom:var(--wp--preset--spacing--20)" aria-hidden="true"/>
				<!-- /wp:separator -->

				<!-- wp:paragraph {"fontSize":"small"} -->
				<p class="has-small-font-size"><strong><?php echo esc_html( $testimonial_2_author ); ?></strong><br/><span style="opacity:0.7"><?php echo esc_html( $testimonial_2_role ); ?></span></p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","right":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30"}},"border":{"radius":"8px"}},"backgroundColor":"background","layout":{"type":"constrained"}} -->
			<div class="wp-block-group has-background-background-color has-background" style="border-radius:8px;padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30)">
				<!-- wp:paragraph {"style":{"typography":{"fontStyle":"italic","lineHeight":"1.7"}}} -->
				<p style="font-style:italic;line-height:1.7"><?php echo esc_html( $testimonial_3_text ); ?></p>
				<!-- /wp:paragraph -->

				<!-- wp:separator {"style":{"spacing":{"margin":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20"}}},"className":"is-style-wide"} -->
				<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide" style="margin-top:var(--wp--preset--spacing--20);margin-bottom:var(--wp--preset--spacing--20)" aria-hidden="true"/>
				<!-- /wp:separator -->

				<!-- wp:paragraph {"fontSize":"small"} -->
				<p class="has-small-font-size"><strong><?php echo esc_html( $testimonial_3_author ); ?></strong><br/><span style="opacity:0.7"><?php echo esc_html( $testimonial_3_role ); ?></span></p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</div>
<!-- /wp:group -->
