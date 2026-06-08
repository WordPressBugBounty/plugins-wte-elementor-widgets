<?php
/**
 * Trip FAQs Widget Demo.
 *
 * @since 1.3.0
 * @package wptravelengine-elementor-widgets
 * @since 1.5.3 Added faq categorized data for demo purpose.
 */

$faqs_data = array(
	'sectionTitle' => __( 'Frequently Asked Questions', 'wptravelengine-elementor-widgets' ),
	'categories'   => array(
		array(
			'id'   => 'demo-cat-1',
			'name' => __( 'General', 'wptravelengine-elementor-widgets' ),
			'faqs' => array(
				array(
					'id'       => 'demo-1',
					'question' => __( 'What is Everest Base Camp (EBC)?', 'wptravelengine-elementor-widgets' ),
					'answer'   => __( 'Everest Base Camp is the starting point for climbers attempting to summit Mount Everest, the highest peak in the world. It is located at an altitude of approximately 5,364 meters (17,598 feet) above sea level in the Khumbu region of Nepal.', 'wptravelengine-elementor-widgets' ),
				),
				array(
					'id'       => 'demo-2',
					'question' => __( 'How do I get to Everest Base Camp?', 'wptravelengine-elementor-widgets' ),
					'answer'   => __( 'The most common way to reach Everest Base Camp is by trekking from Lukla, a small mountain airstrip in Nepal. You can take a flight from Kathmandu to Lukla and start your trek from there. The trek usually takes around 12-14 days round trip.', 'wptravelengine-elementor-widgets' ),
				),
			),
		),
		array(
			'id'   => 'demo-cat-2',
			'name' => __( 'Trekking', 'wptravelengine-elementor-widgets' ),
			'faqs' => array(
				array(
					'id'       => 'demo-3',
					'question' => __( 'Do I need previous trekking experience to reach EBC?', 'wptravelengine-elementor-widgets' ),
					'answer'   => __( 'While previous trekking experience can be helpful, it is not mandatory. The Everest Base Camp trek is challenging but can be undertaken by anyone with a good level of fitness and a strong determination to complete the journey.', 'wptravelengine-elementor-widgets' ),
				),
				array(
					'id'       => 'demo-4',
					'question' => __( 'When is the best time to trek to Everest Base Camp?', 'wptravelengine-elementor-widgets' ),
					'answer'   => __( 'The best time for the Everest Base Camp trek is during the pre-monsoon (spring) season (March to May) and post-monsoon (autumn) season (September to November). During these months, the weather is relatively stable, and the skies are clear, providing breathtaking views of the Himalayas.', 'wptravelengine-elementor-widgets' ),
				),
			),
		),
	),
);

$show_title          = $attributes['show_title'] ?? 'yes';
$show_expand_all     = $attributes['show_expand_all'] ?? 'yes';
$expand_all_label    = $attributes['expand_all_label'] ?? '';
$show_category_title = $attributes['show_category_title'] ?? 'yes';
$html_tag            = wptravelengineeb_normalize_html_tag( $attributes['html_tag'] ?? 'h3' );
$section_title       = $faqs_data['sectionTitle'];
?>
<div class="wpte-faq-section">
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
		$category_id = $category['id'];
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
				<?php foreach ( $category['faqs'] as $faq_item ) : ?>
					<div class="wpte-faq-item" data-faq-id="<?php echo esc_attr( $faq_item['id'] ); ?>">
						<button class="wpte-faq-question" aria-expanded="false" aria-controls="wpte-faq-answer-<?php echo esc_attr( $faq_item['id'] ); ?>">
							<span class="wpte-faq-question-text"><?php echo esc_html( $faq_item['question'] ); ?></span>
							<span class="wpte-faq-icon">
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</span>
						</button>
						<div class="wpte-faq-answer" id="wpte-faq-answer-<?php echo esc_attr( $faq_item['id'] ); ?>" hidden>
							<div class="wpte-faq-answer-content">
								<?php echo wp_kses( wpautop( $faq_item['answer'] ), wptravelengineeb_kses_allowed_html() ); ?>
							</div>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	<?php endforeach; ?>
</div>
