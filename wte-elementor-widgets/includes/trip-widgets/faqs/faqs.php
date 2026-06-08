<?php
/**
 * Trip FAQs Widget.
 *
 * @since 1.3.0
 * @package wptravelengine-elementor-widgets
 * @since 1.5.3 Added support for categorized FAQs with backward compatibility for legacy flat structure.
 */

global $post;
$post_meta  = get_post_meta( $post->ID, 'wp_travel_engine_setting', true );
$faqs_data  = $post_meta['faqs_data'] ?? array();
$legacy_faq = $post_meta['faq'] ?? array();

$global_faq_map = function_exists( 'wptravelengine_get_global_faq_map' ) ? wptravelengine_get_global_faq_map() : array();

if ( ! empty( $faqs_data['categories'] ) && function_exists( 'wptravelengine_filter_orphaned_faqs' ) ) {
	$faqs_data['categories'] = wptravelengine_filter_orphaned_faqs( $faqs_data['categories'], array_keys( $global_faq_map ) );
}

$show_title          = $attributes['show_title'] ?? 'yes';
$show_expand_all     = $attributes['show_expand_all'] ?? 'yes';
$expand_all_label    = $attributes['expand_all_label'] ?? '';
$show_category_title = $attributes['show_category_title'] ?? 'yes';
$html_tag            = wptravelengineeb_normalize_html_tag( $attributes['html_tag'] ?? 'h3' );

if ( ! empty( $faqs_data['categories'] ) ) :
	$section_title = ! empty( $faqs_data['sectionTitle'] )
		? $faqs_data['sectionTitle']
		: ( $post_meta['faq_section_title'] ?? '' );
	?>
	<?php do_action( 'wte_before_faq_content' ); ?>
	<div id="wte-faqs" class="wpte-faq-section">
		<?php if ( 'yes' === $show_title && ! empty( $section_title ) ) : ?>
			<?php
			printf(
				'<%1$s class="wpte-faq-section-title">%2$s</%1$s>',
				esc_html( $html_tag ),
				esc_html( $section_title )
			);
			?>
		<?php endif; ?>

		<?php foreach ( $faqs_data['categories'] as $cat_index => $category ) : ?>
			<?php
			if ( empty( $category['faqs'] ) ) {
				continue;
			}
			$category_id = $category['id'] ?? 'faq-cat-' . $cat_index;
			?>
			<div class="wpte-faq-category">
				<?php if ( 'yes' === $show_category_title || 'yes' === $show_expand_all ) : ?>
					<div class="wpte-faq-category-header">
						<?php if ( 'yes' === $show_category_title && ! empty( $category['name'] ) ) : ?>
							<h3 class="wpte-faq-category-title"><?php echo esc_html( $category['name'] ); ?></h3>
						<?php endif; ?>
						<?php if ( 'yes' === $show_expand_all && ! empty( $expand_all_label ) ) : ?>
							<div class="wpte-faq-expand-all expand-all-button" data-category="<?php echo esc_attr( $category_id ); ?>">
								<label for="expand-all-<?php echo esc_attr( $category_id ); ?>" class="faq-button-label"><?php echo esc_html( $expand_all_label ); ?></label>
								<input id="expand-all-<?php echo esc_attr( $category_id ); ?>" type="checkbox" class="checkbox">
							</div>
						<?php endif; ?>
					</div>
				<?php endif; ?>
				<div class="wpte-faq-list" data-category-id="<?php echo esc_attr( $category_id ); ?>">
					<?php
					$faq_index = 0;
					foreach ( $category['faqs'] as $faq_item ) :
						$faq_question  = (string) ( $faq_item['question'] ?? '' );
						$faq_answer    = (string) ( $faq_item['answer'] ?? '' );
						$source_id     = (string) ( $faq_item['sourceId'] ?? $faq_item['globalFaqId'] ?? '' );
						$added_in_bulk = isset( $faq_item['addedInBulk'] ) ? (bool) $faq_item['addedInBulk'] : false;

						if ( $added_in_bulk && '' !== $source_id && isset( $global_faq_map[ $source_id ] ) ) {
							$faq_question = $global_faq_map[ $source_id ]['question'];
							$faq_answer   = $global_faq_map[ $source_id ]['answer'];
						}

						if ( '' === $faq_question ) {
							continue;
						}
						++$faq_index;
						$item_id = $faq_item['id'] ?? 'faq-' . $cat_index . '-' . $faq_index;
						?>
						<div class="wpte-faq-item" data-faq-id="<?php echo esc_attr( $item_id ); ?>">
							<button class="wpte-faq-question" aria-expanded="false" aria-controls="wpte-faq-answer-<?php echo esc_attr( $item_id ); ?>">
								<span class="wpte-faq-question-text"><?php echo esc_html( $faq_question ); ?></span>
								<span class="wpte-faq-icon">
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
								</span>
							</button>
							<div class="wpte-faq-answer" id="wpte-faq-answer-<?php echo esc_attr( $item_id ); ?>" hidden>
								<div class="wpte-faq-answer-content">
									<?php echo wp_kses( $faq_answer, wptravelengineeb_kses_allowed_html() ); ?>
								</div>
							</div>
						</div>
						<?php
					endforeach;
					?>
				</div>
			</div>
		<?php endforeach; ?>
	</div>
	<?php
	do_action( 'wte_after_faq_content' );
else :
	// Legacy flat structure — backward compatibility.
	?>
	<?php do_action( 'wte_before_faq_content' ); ?>
	<div id="wte-faqs" class="post-data faq">
		<div class="wp-travel-engine-faq-tab-header">
			<?php
			if ( 'yes' === $show_title ) {
				/**
				 * Hook - Display tab content title, left for themes.
				 */
				do_action( 'wte_faqs_tab_title' );
			}
			?>
			<div class="wpte-faq-button-toggle expand-all-button">
				<?php if ( ! empty( $legacy_faq ) && ! empty( $expand_all_label ) && 'yes' === $show_expand_all ) : ?>
					<label for="faq-toggle-btn" class="wpte-faq-button-label"><?php echo esc_html( $expand_all_label ); ?></label>
					<input id="faq-toggle-btn" type="checkbox" class="checkbox">
				<?php endif; ?>
			</div>
		</div>
		<div class="wp-travel-engine-faq-tab-content">
			<?php
			if ( isset( $legacy_faq['faq_title'] ) && ! empty( $legacy_faq['faq_title'] ) ) {
				$arr_keys = array_keys( $legacy_faq['faq_title'] );
				foreach ( $arr_keys as $value ) {
					if ( array_key_exists( $value, $legacy_faq['faq_title'] ) ) {
						?>
						<div id="faq-tabs<?php echo esc_attr( $value ); ?>"
							data-id="<?php echo esc_attr( $value ); ?>" class="faq-row">
							<a class="accordion-tabs-toggle" href="javascript:void(0);">
								<span class="dashicons dashicons-arrow-down custom-toggle-tabs rotator"></span>
								<div class="faq-title">
									<?php echo esc_html( $legacy_faq['faq_title'][ $value ] ?? '' ); ?>
								</div>
							</a>
							<div class="faq-content">
								<p>
									<?php
									$faq_content = $legacy_faq['faq_content'][ $value ] ?? '';
									echo wp_kses( wpautop( $faq_content ), wptravelengineeb_kses_allowed_html() );
									?>
								</p>
							</div>
						</div>
						<?php
					}
				}
			}
			?>
		</div>
	</div>
	<?php
	do_action( 'wte_after_faq_content' );
endif;
