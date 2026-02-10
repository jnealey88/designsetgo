/**
 * Animations Settings Panel
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import {
	Card,
	CardHeader,
	CardBody,
	ToggleControl,
	RangeControl,
	SelectControl,
} from '@wordpress/components';

const AnimationsPanel = ({ settings, updateSetting }) => {
	return (
		<Card className="designsetgo-settings-panel">
			<CardHeader>
				<h2>{__('Animations', 'designsetgo')}</h2>
			</CardHeader>
			<CardBody>
				<p className="designsetgo-panel-description">
					{__(
						'Configure default animation settings for block entrance and exit effects.',
						'designsetgo'
					)}
				</p>

				<ToggleControl
					label={__('Enable Animations', 'designsetgo')}
					help={__(
						'Enable block entrance/exit animations globally.',
						'designsetgo'
					)}
					checked={settings?.animations?.enable_animations || false}
					onChange={(value) =>
						updateSetting('animations', 'enable_animations', value)
					}
					__nextHasNoMarginBottom
				/>

				{settings?.animations?.enable_animations && (
					<div className="designsetgo-settings-group">
						<RangeControl
							label={__('Default Duration (ms)', 'designsetgo')}
							help={__(
								'Default animation duration in milliseconds.',
								'designsetgo'
							)}
							value={
								settings?.animations?.default_duration || 600
							}
							onChange={(value) =>
								updateSetting(
									'animations',
									'default_duration',
									value
								)
							}
							min={100}
							max={2000}
							step={100}
							marks={[
								{
									value: 300,
									label: __('Fast', 'designsetgo'),
								},
								{
									value: 600,
									label: __('Normal', 'designsetgo'),
								},
								{
									value: 1000,
									label: __('Slow', 'designsetgo'),
								},
							]}
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>

						<SelectControl
							label={__('Default Easing', 'designsetgo')}
							help={__(
								'Default animation timing function.',
								'designsetgo'
							)}
							value={
								settings?.animations?.default_easing ||
								'ease-in-out'
							}
							options={[
								{
									label: __('Ease', 'designsetgo'),
									value: 'ease',
								},
								{
									label: __('Ease In', 'designsetgo'),
									value: 'ease-in',
								},
								{
									label: __('Ease Out', 'designsetgo'),
									value: 'ease-out',
								},
								{
									label: __('Ease In Out', 'designsetgo'),
									value: 'ease-in-out',
								},
								{
									label: __('Linear', 'designsetgo'),
									value: 'linear',
								},
							]}
							onChange={(value) =>
								updateSetting(
									'animations',
									'default_easing',
									value
								)
							}
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>

						<div className="designsetgo-settings-section">
							<h3 className="designsetgo-section-heading">
								{__('Default Hover Effects', 'designsetgo')}
							</h3>

							<SelectControl
								label={__(
									'Icon Button Default Hover',
									'designsetgo'
								)}
								help={__(
									'Set a default hover animation for all Icon Button blocks. Individual blocks can override this setting.',
									'designsetgo'
								)}
								value={
									settings?.animations
										?.default_icon_button_hover ||
									'fill-diagonal'
								}
								options={[
									{
										label: __('None', 'designsetgo'),
										value: 'none',
									},
									{
										label: __(
											'Fill Diagonal',
											'designsetgo'
										),
										value: 'fill-diagonal',
									},
									{
										label: __('Zoom In', 'designsetgo'),
										value: 'zoom-in',
									},
									{
										label: __('Slide Left', 'designsetgo'),
										value: 'slide-left',
									},
									{
										label: __('Slide Right', 'designsetgo'),
										value: 'slide-right',
									},
									{
										label: __('Slide Down', 'designsetgo'),
										value: 'slide-down',
									},
									{
										label: __('Slide Up', 'designsetgo'),
										value: 'slide-up',
									},
									{
										label: __(
											'Border Pulse',
											'designsetgo'
										),
										value: 'border-pulse',
									},
									{
										label: __('Border Glow', 'designsetgo'),
										value: 'border-glow',
									},
									{
										label: __('Lift', 'designsetgo'),
										value: 'lift',
									},
									{
										label: __('Shrink', 'designsetgo'),
										value: 'shrink',
									},
								]}
								onChange={(value) =>
									updateSetting(
										'animations',
										'default_icon_button_hover',
										value
									)
								}
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
						</div>

						<div className="designsetgo-settings-section">
							<h3 className="designsetgo-section-heading">
								{__('Accessibility', 'designsetgo')}
							</h3>

							<ToggleControl
								label={__(
									'Respect Prefers Reduced Motion',
									'designsetgo'
								)}
								help={__(
									'Disable animations for users who prefer reduced motion. Highly recommended for accessibility.',
									'designsetgo'
								)}
								checked={
									settings?.animations
										?.respect_prefers_reduced_motion ||
									false
								}
								onChange={(value) =>
									updateSetting(
										'animations',
										'respect_prefers_reduced_motion',
										value
									)
								}
								__nextHasNoMarginBottom
							/>
						</div>
					</div>
				)}
			</CardBody>
		</Card>
	);
};

export default AnimationsPanel;
