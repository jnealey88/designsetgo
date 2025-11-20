/**
 * Auto-Trigger Settings Panel Component
 *
 * @package DesignSetGo
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
	Notice,
} from '@wordpress/components';

export default function TriggerSettings({ attributes, setAttributes }) {
	const {
		autoTriggerType,
		autoTriggerDelay,
		autoTriggerFrequency,
		cookieDuration,
		exitIntentSensitivity,
		exitIntentMinTime,
		exitIntentExcludeMobile,
		scrollDepth,
		scrollDirection,
		timeOnPage,
	} = attributes;

	return (
		<PanelBody title={__('Auto Trigger', 'designsetgo')} initialOpen={false}>
			<SelectControl
				label={__('Trigger Type', 'designsetgo')}
				value={autoTriggerType}
				options={[
					{ label: __('None', 'designsetgo'), value: 'none' },
					{ label: __('Page Load', 'designsetgo'), value: 'pageLoad' },
					{ label: __('Exit Intent', 'designsetgo'), value: 'exitIntent' },
					{ label: __('Scroll Depth', 'designsetgo'), value: 'scroll' },
					{ label: __('Time on Page', 'designsetgo'), value: 'time' },
				]}
				onChange={(value) => setAttributes({ autoTriggerType: value })}
				help={__(
					'Automatically open the modal based on user behavior.',
					'designsetgo'
				)}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>

			{autoTriggerType !== 'none' && (
				<>
					<Notice status="info" isDismissible={false}>
						{__(
							'Auto-triggers are disabled in the editor. They will work on the frontend.',
							'designsetgo'
						)}
					</Notice>

					<SelectControl
						label={__('Frequency', 'designsetgo')}
						value={autoTriggerFrequency}
						options={[
							{ label: __('Every Visit', 'designsetgo'), value: 'always' },
							{
								label: __('Once per Session', 'designsetgo'),
								value: 'session',
							},
							{ label: __('Once per User', 'designsetgo'), value: 'once' },
						]}
						onChange={(value) =>
							setAttributes({ autoTriggerFrequency: value })
						}
						help={__(
							'How often the modal should automatically open.',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					{autoTriggerFrequency === 'once' && (
						<RangeControl
							label={__('Cookie Duration (days)', 'designsetgo')}
							value={cookieDuration}
							onChange={(value) => setAttributes({ cookieDuration: value })}
							min={1}
							max={365}
							help={__(
								'How long to remember that the user has seen this modal.',
								'designsetgo'
							)}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					)}

					{autoTriggerType === 'pageLoad' && (
						<RangeControl
							label={__('Delay (milliseconds)', 'designsetgo')}
							value={autoTriggerDelay}
							onChange={(value) =>
								setAttributes({ autoTriggerDelay: value })
							}
							min={0}
							max={30000}
							step={100}
							help={__(
								'Wait time before opening the modal after page loads.',
								'designsetgo'
							)}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					)}

					{autoTriggerType === 'exitIntent' && (
						<>
							<SelectControl
								label={__('Sensitivity', 'designsetgo')}
								value={exitIntentSensitivity}
								options={[
									{ label: __('Low', 'designsetgo'), value: 'low' },
									{ label: __('Medium', 'designsetgo'), value: 'medium' },
									{ label: __('High', 'designsetgo'), value: 'high' },
								]}
								onChange={(value) =>
									setAttributes({ exitIntentSensitivity: value })
								}
								help={__(
									'How close to the top edge triggers exit intent.',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<RangeControl
								label={__('Minimum Time (seconds)', 'designsetgo')}
								value={exitIntentMinTime}
								onChange={(value) =>
									setAttributes({ exitIntentMinTime: value })
								}
								min={0}
								max={300}
								help={__(
									'Minimum time on page before exit intent can trigger.',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<ToggleControl
								label={__('Exclude Mobile Devices', 'designsetgo')}
								checked={exitIntentExcludeMobile}
								onChange={(value) =>
									setAttributes({ exitIntentExcludeMobile: value })
								}
								help={__(
									"Don't trigger exit intent on mobile devices.",
									'designsetgo'
								)}
								__nextHasNoMarginBottom
							/>
						</>
					)}

					{autoTriggerType === 'scroll' && (
						<>
							<RangeControl
								label={__('Scroll Depth (%)', 'designsetgo')}
								value={scrollDepth}
								onChange={(value) => setAttributes({ scrollDepth: value })}
								min={0}
								max={100}
								help={__(
									'Percentage of page scrolled before modal opens.',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<SelectControl
								label={__('Scroll Direction', 'designsetgo')}
								value={scrollDirection}
								options={[
									{
										label: __('Down Only', 'designsetgo'),
										value: 'down',
									},
									{
										label: __('Up or Down', 'designsetgo'),
										value: 'both',
									},
								]}
								onChange={(value) =>
									setAttributes({ scrollDirection: value })
								}
								help={__(
									'Trigger only when scrolling down or in any direction.',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</>
					)}

					{autoTriggerType === 'time' && (
						<RangeControl
							label={__('Time on Page (seconds)', 'designsetgo')}
							value={timeOnPage}
							onChange={(value) => setAttributes({ timeOnPage: value })}
							min={0}
							max={300}
							help={__(
								'Seconds on page before modal opens.',
								'designsetgo'
							)}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					)}
				</>
			)}
		</PanelBody>
	);
}
