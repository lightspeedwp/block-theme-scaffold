<?php
/**
 * Title: Footer
 * Slug: {{theme_slug}}/footer
 * Description: Site footer with site info, navigation links, social icons, and copyright.
 * Categories: footer
 * Keywords: footer, navigation, social, copyright, links
 * Block Types: core/template-part/footer
 * Inserter: no
 *
 * @package {{theme_name}}
 * @since {{version}}
 */

$quick_links_title = esc_html__( 'Quick Links', '{{theme_slug}}' );
$follow_us_title   = esc_html__( 'Follow Us', '{{theme_slug}}' );
$privacy_link      = esc_html__( 'Privacy Policy', '{{theme_slug}}' );
$terms_link        = esc_html__( 'Terms of Service', '{{theme_slug}}' );
$copyright_text    = sprintf(
	/* translators: %s: current year */
	esc_html__( '© %s All rights reserved.', '{{theme_slug}}' ),
	gmdate( 'Y' )
);
?>
<!-- wp:group {"tagName":"footer","style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50"},"margin":{"top":"var:preset|spacing|60"}}},"backgroundColor":"neutral","layout":{"type":"constrained"}} -->
<footer class="wp-block-group has-neutral-background-color has-background" style="margin-top:var(--wp--preset--spacing--60);padding-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50)" role="contentinfo">
	<!-- wp:group {"align":"wide","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between","verticalAlignment":"top"}} -->
	<div class="wp-block-group alignwide">
		<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|10"}},"layout":{"type":"constrained","contentSize":"300px"}} -->
		<div class="wp-block-group">
			<!-- wp:site-title {"level":0,"style":{"typography":{"fontWeight":"700"}},"fontSize":"large"} /-->
			<!-- wp:site-tagline {"fontSize":"small"} /-->

			<!-- wp:paragraph {"fontSize":"small","style":{"spacing":{"margin":{"top":"var:preset|spacing|20"}}}} -->
			<p class="has-small-font-size" style="margin-top:var(--wp--preset--spacing--20)"><?php echo esc_html( $copyright_text ); ?></p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:group -->

		<!-- wp:group {"layout":{"type":"constrained","contentSize":"200px"}} -->
		<div class="wp-block-group">
			<!-- wp:heading {"level":3,"fontSize":"medium","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
			<h3 class="wp-block-heading has-medium-font-size" style="margin-bottom:var(--wp--preset--spacing--20)"><?php echo esc_html( $quick_links_title ); ?></h3>
			<!-- /wp:heading -->

			<!-- wp:navigation {"ref":0,"overlayMenu":"never","layout":{"type":"flex","orientation":"vertical"},"style":{"spacing":{"blockGap":"var:preset|spacing|10"}},"fontSize":"small"} /-->
		</div>
		<!-- /wp:group -->

		<!-- wp:group {"layout":{"type":"constrained","contentSize":"200px"}} -->
		<div class="wp-block-group">
			<!-- wp:heading {"level":3,"fontSize":"medium","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
			<h3 class="wp-block-heading has-medium-font-size" style="margin-bottom:var(--wp--preset--spacing--20)"><?php echo esc_html( $follow_us_title ); ?></h3>
			<!-- /wp:heading -->

			<!-- wp:social-links {"iconColor":"foreground","iconColorValue":"var(--wp--preset--color--foreground)","className":"is-style-logos-only","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|20"}}}} -->
			<ul class="wp-block-social-links has-icon-color is-style-logos-only" aria-label="<?php esc_attr_e( 'Social media links', '{{theme_slug}}' ); ?>">
				<!-- wp:social-link {"url":"#","service":"twitter"} /-->
				<!-- wp:social-link {"url":"#","service":"facebook"} /-->
				<!-- wp:social-link {"url":"#","service":"instagram"} /-->
				<!-- wp:social-link {"url":"#","service":"linkedin"} /-->
			</ul>
			<!-- /wp:social-links -->
		</div>
		<!-- /wp:group -->
	</div>
	<!-- /wp:group -->

	<!-- wp:separator {"align":"wide","style":{"spacing":{"margin":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|30"}}},"className":"is-style-wide"} -->
	<hr class="wp-block-separator alignwide has-alpha-channel-opacity is-style-wide" style="margin-top:var(--wp--preset--spacing--40);margin-bottom:var(--wp--preset--spacing--30)" aria-hidden="true"/>
	<!-- /wp:separator -->

	<!-- wp:group {"align":"wide","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
	<div class="wp-block-group alignwide">
		<!-- wp:paragraph {"fontSize":"small"} -->
		<p class="has-small-font-size">
			<?php
			printf(
				/* translators: %s: WordPress link */
				esc_html__( 'Proudly powered by %s', '{{theme_slug}}' ),
				'<a href="' . esc_url( __( 'https://wordpress.org', '{{theme_slug}}' ) ) . '" rel="nofollow">WordPress</a>'
			);
			?>
		</p>
		<!-- /wp:paragraph -->

		<!-- wp:paragraph {"fontSize":"small"} -->
		<p class="has-small-font-size">
			<a href="<?php echo esc_url( get_privacy_policy_url() ); ?>"><?php echo esc_html( $privacy_link ); ?></a> |
			<a href="#"><?php echo esc_html( $terms_link ); ?></a>
		</p>
		<!-- /wp:paragraph -->
	</div>
	<!-- /wp:group -->
</footer>
<!-- /wp:group -->
