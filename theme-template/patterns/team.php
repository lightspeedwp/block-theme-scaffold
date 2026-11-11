<?php
/**
 * Title: Team
 * Slug: {{theme_slug}}/team
 * Description: A heading, introduction and three team member cards with photo, name and role.
 * Categories: team
 * Keywords: team, members, staff, people
 * Viewport Width: 1400
 * Inserter: yes
 *
 * @package {{theme_name}}
 * @since {{version}}
 */

$section_title       = esc_html__( 'Meet the team', '{{theme_slug}}' );
$section_description = esc_html__( 'The people behind {{theme_name}}.', '{{theme_slug}}' );
$member_name         = esc_html__( 'Team member', '{{theme_slug}}' );
$member_role         = esc_html__( 'Role', '{{theme_slug}}' );
?>
<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">
	<!-- wp:heading {"textAlign":"center","level":2} -->
	<h2 class="wp-block-heading has-text-align-center"><?php echo esc_html( $section_title ); ?></h2>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"align":"center","style":{"color":{"text":"var(--wp--custom--color--text--muted)"}}} -->
	<p class="has-text-align-center has-text-color" style="color:var(--wp--custom--color--text--muted)"><?php echo esc_html( $section_description ); ?></p>
	<!-- /wp:paragraph -->

	<!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"var:preset|spacing|30","left":"var:preset|spacing|30"}}}} -->
	<div class="wp-block-columns">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:image {"aspectRatio":"1","scale":"cover","sizeSlug":"large","linkDestination":"none","style":{"border":{"radius":"50%"}}} -->
			<figure class="wp-block-image size-large has-custom-border"><img alt="" style="border-radius:50%;aspect-ratio:1;object-fit:cover"/></figure>
			<!-- /wp:image -->

			<!-- wp:heading {"textAlign":"center","level":3} -->
			<h3 class="wp-block-heading has-text-align-center"><?php echo esc_html( $member_name ); ?></h3>
			<!-- /wp:heading -->

			<!-- wp:paragraph {"align":"center","style":{"color":{"text":"var(--wp--custom--color--text--muted)"}}} -->
			<p class="has-text-align-center has-text-color" style="color:var(--wp--custom--color--text--muted)"><?php echo esc_html( $member_role ); ?></p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:image {"aspectRatio":"1","scale":"cover","sizeSlug":"large","linkDestination":"none","style":{"border":{"radius":"50%"}}} -->
			<figure class="wp-block-image size-large has-custom-border"><img alt="" style="border-radius:50%;aspect-ratio:1;object-fit:cover"/></figure>
			<!-- /wp:image -->

			<!-- wp:heading {"textAlign":"center","level":3} -->
			<h3 class="wp-block-heading has-text-align-center"><?php echo esc_html( $member_name ); ?></h3>
			<!-- /wp:heading -->

			<!-- wp:paragraph {"align":"center","style":{"color":{"text":"var(--wp--custom--color--text--muted)"}}} -->
			<p class="has-text-align-center has-text-color" style="color:var(--wp--custom--color--text--muted)"><?php echo esc_html( $member_role ); ?></p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:image {"aspectRatio":"1","scale":"cover","sizeSlug":"large","linkDestination":"none","style":{"border":{"radius":"50%"}}} -->
			<figure class="wp-block-image size-large has-custom-border"><img alt="" style="border-radius:50%;aspect-ratio:1;object-fit:cover"/></figure>
			<!-- /wp:image -->

			<!-- wp:heading {"textAlign":"center","level":3} -->
			<h3 class="wp-block-heading has-text-align-center"><?php echo esc_html( $member_name ); ?></h3>
			<!-- /wp:heading -->

			<!-- wp:paragraph {"align":"center","style":{"color":{"text":"var(--wp--custom--color--text--muted)"}}} -->
			<p class="has-text-align-center has-text-color" style="color:var(--wp--custom--color--text--muted)"><?php echo esc_html( $member_role ); ?></p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</div>
<!-- /wp:group -->
