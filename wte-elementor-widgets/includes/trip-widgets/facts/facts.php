<?php
/**
 * Trip Facts Widget Render.
 *
 * @since 1.3.0
 * @package wptravelengine-elementor-widgets
 */
global $post;

$trip_id = $post->ID;

if ( ! empty( $atts['id'] ) ) {
	$trip_id = $atts['id'];
}

$global_trip_facts = wptravelengine_get_trip_facts_options();
$trip_settings     = get_post_meta( $trip_id, 'wp_travel_engine_setting', true );

// Retrieve attributes value form elementor.
$attributes      = (object) $attributes;
$icon_position   = isset( $attributes->{'icon_alignment'} ) ? $attributes->{'icon_alignment'} : 'left';
$icon_v_position = isset( $attributes->{'vertical_alignment'} ) ? $attributes->{'vertical_alignment'} : 'center';
$column_desktop  = isset( $attributes->{'noofcolumn'} ) ? $attributes->{'noofcolumn'} : 3;
$column_tablet   = isset( $attributes->{'noofcolumn_tablet'} ) ? $attributes->{'noofcolumn_tablet'} : 2;
$column_mobile   = isset( $attributes->{'noofcolumn_mobile'} ) ? $attributes->{'noofcolumn_mobile'} : 2;
$_trip_facts     = isset( $trip_settings['trip_facts'] ) && is_array( $trip_settings['trip_facts'] ) ? $trip_settings['trip_facts'] : array();
if ( ! empty( $_trip_facts ) ) :
	?>
		<div id="wte-facts" class="secondary-trip-info">
			<div class="wte-trip-facts">
				<ul class="trip-facts-value wte-col-<?php echo isset( $column_desktop ) ? esc_attr( "{$column_desktop}" ) : ''; ?> wte-col-tablet-<?php echo isset( $column_tablet ) ? esc_attr( "{$column_tablet}" ) : ''; ?> wte-col-mobile-<?php echo isset( $column_mobile ) ? esc_attr( "{$column_mobile}" ) : ''; ?>">
					<?php
					foreach ( $_trip_facts['field_type'] as $key => $field_type ) {
						if ( isset( $global_trip_facts['fid'][ $key ] ) ) {
							$_id = $global_trip_facts['field_id'][ $key ];
							if ( isset( $_trip_facts[ $key ][ $key ] ) && ! empty( $_trip_facts[ $key ][ $key ] ) ) {
								echo '<li class="trip-facts facts-icon-position-' . esc_attr( $icon_position ) . ' vertical-align-' . esc_attr( $icon_v_position ) . ' ">';
								$icon = '';
								if ( ! empty( $global_trip_facts['field_icon'][ $key ] ) ) {
									$icon = $global_trip_facts['field_icon'][ $key ];
									echo '<div class="wte-trip-fact-icon-wrapper"><span class="icon-holder">' . wptravelengine_svg_by_fa_icon( $icon, false ) . '</span></div>';
								}
								$field_value = isset( $_trip_facts[ $key ][ $key ] ) ? $_trip_facts[ $key ][ $key ] : '';
								if ( 'duration' === $field_type && ! preg_match( '/([^\d]+)/', trim( $field_value ) ) ) {
									$duration_type = 'days';
									if ( isset( $trip_settings['trip_duration_unit'] ) && in_array( $trip_settings['trip_duration_unit'], array( 'days', 'hours' ) ) ) {
										$duration_type = $trip_settings['trip_duration_unit'];
									}
									$field_value = sprintf(
										// translators: %d is the number of days or hours.
										_n( 'hours' === $duration_type ? '%d Hour' : '%d Day', 'hours' === $duration_type ? '%d Hours' : '%d Days', (int) $field_value, 'wptravelengine-elementor-widgets' ),
										(int) $field_value
									);
								}
								if ( 'textarea' === $field_type ) {
									$field_value = nl2br( $field_value );
								}
								?>
								<div class="wte-trip-fact-content-wrapper">
									<label><?php echo esc_html( $_id ); ?></label>
									<div class="trip-facts-<?php echo esc_attr( $field_type ); ?>">
										<div class="value"><?php echo wp_kses_post( $field_value ); ?></div>
									</div>
								</div>
								<?php
								echo '</li>';
							}
						}
					}
					$get_trip_terms        = function ( $taxonomy ) use ( $trip_id ) {
						$terms = get_the_terms( $trip_id, $taxonomy );
						$value = '';
						if ( is_array( $terms ) ) {
							foreach ( $terms as $term ) {
								$value .= sprintf( '<a href="%s">%s</a>', get_term_link( $term, $taxonomy ), $term->name );
							}
						}
						return $value;
					};
					$trip_facts_value      = array(
						'minimum-age'  => array(
							'value'     => function () use ( $trip_id ) {
								return get_post_meta( $trip_id, 'wp_travel_engine_trip_min_age', true );
							},
							'condition' => isset( $trip_settings['min_max_age_enable'] ) && 'true' === $trip_settings['min_max_age_enable'],
						),
						'maximum-age'  => array(
							'value'     => function () use ( $trip_id ) {
								return get_post_meta( $trip_id, 'wp_travel_engine_trip_max_age', true );
							},
							'condition' => isset( $trip_settings['min_max_age_enable'] ) && 'true' === $trip_settings['min_max_age_enable'],
						),
						'group-size'   => array(
							'value'     => function () use ( $trip_settings ) {
								$group_size = array();
								if ( ! empty( $trip_settings['trip_minimum_pax'] ) ) {
									$group_size[] = (int) $trip_settings['trip_minimum_pax'];
								}
								if ( ! empty( $trip_settings['trip_maximum_pax'] ) ) {
									$group_size[] = $trip_settings['trip_maximum_pax'];
								}
								return ! empty( $group_size ) ? implode( ' - ', $group_size ) : '';
							},
							'condition' => isset( $trip_settings['minmax_pax_enable'] ) && 'true' === $trip_settings['minmax_pax_enable'],
						),
						'difficulties' => array(
							'value' => function () use ( $trip_settings ) {
								$difficulty_level = isset( $trip_settings['difficulty_level'] ) ? $trip_settings['difficulty_level'] : '';
								$difficulty_term = get_term( (int) $difficulty_level, 'difficulty' );
								return $difficulty_term instanceof \WP_Term ? $difficulty_term->name : '';
							},
						),
					);
					$additional_trip_facts = wptravelengine_get_trip_facts_default_options();
					foreach ( $additional_trip_facts as $fact ) {
						if ( ! isset( $fact['enabled'] ) || 'no' === $fact['enabled'] ) {
							continue;
						}
						$fact_class = '';
						if ( isset( $trip_facts_value[ $fact['field_type'] ]['value'] ) ) {
							$fact_value = $trip_facts_value[ $fact['field_type'] ]['value'];
							if ( is_callable( $fact_value ) && ( ! isset( $trip_facts_value[ $fact['field_type'] ]['condition'] ) || $trip_facts_value[ $fact['field_type'] ]['condition'] ) ) {
								$fact_value = call_user_func( $fact_value );
							} else {
								$fact_value = '';
							}
						} elseif ( isset( $fact['field_type'] ) && strpos( $fact['field_type'], 'taxonomy:' ) >= 0 ) {
							list( $label, $taxonomy ) = explode( ':', $fact['field_type'] );
							$fact_value               = $get_trip_terms( $taxonomy );
							$fact_class               = 'trip-facts-taxonomy';
						}
						if ( empty( $fact_value ) ) {
							continue;
						}
						echo '<li class="trip-facts facts-icon-position-' . esc_attr( $icon_position ) . ' vertical-align-' . esc_attr( $icon_v_position ) . ' ">';
						?>
							<div class="wte-trip-fact-icon-wrapper">
								<span class="icon-holder"><?php wptravelengine_svg_by_fa_icon( $fact['field_icon'] ); ?></span>
							</div>
							<div class="wte-trip-fact-content-wrapper">
								<label><?php echo esc_html( $fact['field_id'] ); ?></label>
								<div class="trip-facts-text <?php echo esc_attr( $fact_class ); ?>">
									<div class="value"><?php echo wp_kses( $fact_value, array( 'a' => array( 'href' => array() ) ) ); ?></div>
								</div>
							</div>
						</li>
						<?php
					}
					?>
				</ul>
			</div>
		</div>
	<?php
endif;
