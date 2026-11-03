<?php
/**
 * Block patterns registration for {{theme_name}}
 *
 * @package {{theme_name}}
 * @since {{version}}
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register hero section pattern.
 *
 * @return void
 */
function {{theme_slug|snakeCase}}_register_hero_pattern() {
	register_block_pattern(
		'{{theme_slug}}/hero-section',
		array(
			'title'       => __( 'Hero Section', '{{theme_slug}}' ),
			'description' => __( 'A large hero section with heading, text, and button.', '{{theme_slug}}' ),
			'categories'  => array( '{{theme_slug}}-hero' ),
			'keywords'    => array( 'hero', 'banner', 'header' ),
			'content'     => '<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50"}}},"backgroundColor":"primary-500","textColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-color has-primary-500-background-color has-text-color has-background" style="padding-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50)">
	<!-- wp:heading {"textAlign":"center","level":1,"fontSize":"700"} -->
	<h1 class="wp-block-heading has-text-align-center has-700-font-size">{{hero_title}}</h1>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"align":"center","fontSize":"500"} -->
	<p class="has-text-align-center has-500-font-size">{{hero_description}}</p>
	<!-- /wp:paragraph -->

	<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"var:preset|spacing|30"}}}} -->
	<div class="wp-block-buttons" style="margin-top:var(--wp--preset--spacing--30)">
		<!-- wp:button {"backgroundColor":"base","textColor":"primary-500","className":"is-style-fill"} -->
		<div class="wp-block-button is-style-fill"><a class="wp-block-button__link has-primary-500-color has-base-background-color has-text-color has-background wp-element-button">{{hero_button_text}}</a></div>
		<!-- /wp:button -->
	</div>
	<!-- /wp:buttons -->
</div>
<!-- /wp:group -->',
		)
	);
}
add_action( 'init', '{{theme_slug|snakeCase}}_register_hero_pattern' );

/**
 * Register call to action pattern.
 *
 * @return void
 */
function {{theme_slug|snakeCase}}_register_cta_pattern() {
	register_block_pattern(
		'{{theme_slug}}/call-to-action',
		array(
			'title'       => __( 'Call to Action', '{{theme_slug}}' ),
			'description' => __( 'A call to action section with heading and button.', '{{theme_slug}}' ),
			'categories'  => array( '{{theme_slug}}-cta' ),
			'keywords'    => array( 'cta', 'call to action', 'button' ),
			'content'     => '<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}},"border":{"width":"1px","style":"solid"}},"borderColor":"neutral-500","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide has-border-color has-neutral-500-border-color" style="border-style:solid;border-width:1px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--30)">
	<!-- wp:heading {"textAlign":"center","level":2} -->
	<h2 class="wp-block-heading has-text-align-center">{{cta_title}}</h2>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"align":"center"} -->
	<p class="has-text-align-center">{{cta_description}}</p>
	<!-- /wp:paragraph -->

	<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
	<div class="wp-block-buttons">
		<!-- wp:button -->
		<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">{{cta_button_text}}</a></div>
		<!-- /wp:button -->
	</div>
	<!-- /wp:buttons -->
</div>
<!-- /wp:group -->',
		)
	);
}
add_action( 'init', '{{theme_slug|snakeCase}}_register_cta_pattern' );

/**
 * Register team section pattern.
 *
 * @return void
 */
function {{theme_slug|snakeCase}}_register_team_pattern() {
	register_block_pattern(
		'{{theme_slug}}/team-section',
		array(
			'title'       => __( 'Team Section', '{{theme_slug}}' ),
			'description' => __( 'A team section with multiple team member cards.', '{{theme_slug}}' ),
			'categories'  => array( '{{theme_slug}}-team' ),
			'keywords'    => array( 'team', 'members', 'staff' ),
			'content'     => '<!-- wp:group {"align":"wide","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide">
	<!-- wp:heading {"textAlign":"center","level":2} -->
	<h2 class="wp-block-heading has-text-align-center">{{team_title}}</h2>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"align":"center"} -->
	<p class="has-text-align-center">{{team_description}}</p>
	<!-- /wp:paragraph -->

	<!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"var:preset|spacing|30","left":"var:preset|spacing|30"}}}} -->
	<div class="wp-block-columns">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:image {"aspectRatio":"1","scale":"cover","sizeSlug":"large","linkDestination":"none","style":{"border":{"radius":"50%"}}} -->
			<figure class="wp-block-image size-large has-custom-border"><img alt="" style="border-radius:50%;aspect-ratio:1;object-fit:cover"/></figure>
			<!-- /wp:image -->

			<!-- wp:heading {"textAlign":"center","level":3} -->
			<h3 class="wp-block-heading has-text-align-center">{{team_member_1_name}}</h3>
			<!-- /wp:heading -->

			<!-- wp:paragraph {"align":"center","textColor":"neutral-500"} -->
			<p class="has-text-align-center has-neutral-500-color has-text-color">{{team_member_1_role}}</p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:image {"aspectRatio":"1","scale":"cover","sizeSlug":"large","linkDestination":"none","style":{"border":{"radius":"50%"}}} -->
			<figure class="wp-block-image size-large has-custom-border"><img alt="" style="border-radius:50%;aspect-ratio:1;object-fit:cover"/></figure>
			<!-- /wp:image -->

			<!-- wp:heading {"textAlign":"center","level":3} -->
			<h3 class="wp-block-heading has-text-align-center">{{team_member_2_name}}</h3>
			<!-- /wp:heading -->

			<!-- wp:paragraph {"align":"center","textColor":"neutral-500"} -->
			<p class="has-text-align-center has-neutral-500-color has-text-color">{{team_member_2_role}}</p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:image {"aspectRatio":"1","scale":"cover","sizeSlug":"large","linkDestination":"none","style":{"border":{"radius":"50%"}}} -->
			<figure class="wp-block-image size-large has-custom-border"><img alt="" style="border-radius:50%;aspect-ratio:1;object-fit:cover"/></figure>
			<!-- /wp:image -->

			<!-- wp:heading {"textAlign":"center","level":3} -->
			<h3 class="wp-block-heading has-text-align-center">{{team_member_3_name}}</h3>
			<!-- /wp:heading -->

			<!-- wp:paragraph {"align":"center","textColor":"neutral-500"} -->
			<p class="has-text-align-center has-neutral-500-color has-text-color">{{team_member_3_role}}</p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</div>
<!-- /wp:group -->',
		)
	);
}
add_action( 'init', '{{theme_slug|snakeCase}}_register_team_pattern' );
