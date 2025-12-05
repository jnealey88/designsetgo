/**
 * Vertical Scroll Parallax - Inspector Panel Component
 *
 * UI controls for configuring vertical scroll parallax effects
 *
 * @package
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	RangeControl,
	Flex,
	FlexItem,
	Notice,
} from '@wordpress/components';
import {
	DIRECTION_VALUES,
	RELATIVE_TO_VALUES,
	DEFAULT_PARALLAX_SETTINGS,
} from '../constants';

/**
 * Parallax Panel Component
 *
 * @param {Object}   props               Component props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to update attributes
 * @return {JSX.Element} Panel component
 */
export default function ParallaxPanel({ attributes, setAttributes }) {
	// Translatable options - defined here where __ is available
	const directionOptions = [
		{ label: __('Up', 'designsetgo'), value: DIRECTION_VALUES.UP },
		{ label: __('Down', 'designsetgo'), value: DIRECTION_VALUES.DOWN },
	];

	const relativeToOptions = [
		{
			label: __('Viewport', 'designsetgo'),
			value: RELATIVE_TO_VALUES.VIEWPORT,
		},
		{
			label: __('Entire Page', 'designsetgo'),
			value: RELATIVE_TO_VALUES.PAGE,
		},
	];
	const {
		dsgoParallaxEnabled = DEFAULT_PARALLAX_SETTINGS.enabled,
		dsgoParallaxDirection = DEFAULT_PARALLAX_SETTINGS.direction,
		dsgoParallaxSpeed = DEFAULT_PARALLAX_SETTINGS.speed,
		dsgoParallaxViewportStart = DEFAULT_PARALLAX_SETTINGS.viewportStart,
		dsgoParallaxViewportEnd = DEFAULT_PARALLAX_SETTINGS.viewportEnd,
		dsgoParallaxRelativeTo = DEFAULT_PARALLAX_SETTINGS.relativeTo,
		dsgoParallaxDesktop = DEFAULT_PARALLAX_SETTINGS.enableDesktop,
		dsgoParallaxTablet = DEFAULT_PARALLAX_SETTINGS.enableTablet,
		dsgoParallaxMobile = DEFAULT_PARALLAX_SETTINGS.enableMobile,
	} = attributes;

	return (
		<PanelBody
			title={__('Vertical Scroll Parallax', 'designsetgo')}
			initialOpen={false}
		>
			<ToggleControl
				label={__('Enable Vertical Scroll Effect', 'designsetgo')}
				checked={dsgoParallaxEnabled}
				onChange={(value) =>
					setAttributes({ dsgoParallaxEnabled: value })
				}
				__nextHasNoMarginBottom
			/>

			{dsgoParallaxEnabled && (
				<>
					<SelectControl
						label={__('Direction', 'designsetgo')}
						value={dsgoParallaxDirection}
						options={directionOptions}
						onChange={(value) =>
							setAttributes({ dsgoParallaxDirection: value })
						}
						help={__(
							'Direction the element moves while scrolling down.',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Speed', 'designsetgo')}
						value={dsgoParallaxSpeed}
						onChange={(value) =>
							setAttributes({ dsgoParallaxSpeed: value })
						}
						min={0}
						max={10}
						step={1}
						marks={[
							{ value: 0, label: __('None', 'designsetgo') },
							{ value: 5, label: '' },
							{ value: 10, label: __('Max', 'designsetgo') },
						]}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Viewport Start (%)', 'designsetgo')}
						value={dsgoParallaxViewportStart}
						onChange={(value) =>
							setAttributes({ dsgoParallaxViewportStart: value })
						}
						min={0}
						max={100}
						step={5}
						help={__(
							'Effect starts when element reaches this viewport position.',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Viewport End (%)', 'designsetgo')}
						value={dsgoParallaxViewportEnd}
						onChange={(value) =>
							setAttributes({ dsgoParallaxViewportEnd: value })
						}
						min={0}
						max={100}
						step={5}
						help={__(
							'Effect ends when element reaches this viewport position.',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Effects Relative To', 'designsetgo')}
						value={dsgoParallaxRelativeTo}
						options={relativeToOptions}
						onChange={(value) =>
							setAttributes({ dsgoParallaxRelativeTo: value })
						}
						help={__(
							'Calculate scroll position relative to viewport or entire page.',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<p
						style={{
							marginTop: '16px',
							marginBottom: '8px',
							fontWeight: 500,
						}}
					>
						{__('Apply Effects On', 'designsetgo')}
					</p>

					<Flex wrap>
						<FlexItem>
							<ToggleControl
								label={__('Desktop', 'designsetgo')}
								checked={dsgoParallaxDesktop}
								onChange={(value) =>
									setAttributes({
										dsgoParallaxDesktop: value,
									})
								}
								__nextHasNoMarginBottom
							/>
						</FlexItem>
						<FlexItem>
							<ToggleControl
								label={__('Tablet', 'designsetgo')}
								checked={dsgoParallaxTablet}
								onChange={(value) =>
									setAttributes({ dsgoParallaxTablet: value })
								}
								__nextHasNoMarginBottom
							/>
						</FlexItem>
						<FlexItem>
							<ToggleControl
								label={__('Mobile', 'designsetgo')}
								checked={dsgoParallaxMobile}
								onChange={(value) =>
									setAttributes({ dsgoParallaxMobile: value })
								}
								__nextHasNoMarginBottom
							/>
						</FlexItem>
					</Flex>

					{!dsgoParallaxMobile && (
						<Notice status="info" isDismissible={false}>
							{__(
								'Mobile is disabled by default for better performance.',
								'designsetgo'
							)}
						</Notice>
					)}
				</>
			)}
		</PanelBody>
	);
}
