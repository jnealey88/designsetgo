/**
 * Block Animations - Settings Panel
 *
 * Panel component for configuring block animations
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
	Notice,
} from '@wordpress/components';
import {
	ANIMATION_TYPES,
	ANIMATION_TRIGGERS,
	ANIMATION_DURATIONS,
	ANIMATION_EASINGS,
} from '../constants';

/**
 * Animation Settings Panel
 *
 * @param {Object}   props               Component props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to update attributes
 * @return {JSX.Element} Animation panel component
 */
export default function AnimationPanel({ attributes, setAttributes }) {
	const {
		dsgoAnimationEnabled,
		dsgoEntranceAnimation,
		dsgoExitAnimation,
		dsgoAnimationTrigger,
		dsgoAnimationDuration,
		dsgoAnimationDelay,
		dsgoAnimationEasing,
		dsgoAnimationOffset,
		dsgoAnimationOnce,
	} = attributes;

	return (
		<PanelBody
			title={__('Animations', 'designsetgo')}
			initialOpen={false}
			icon="video-alt3"
		>
			<ToggleControl
				label={__('Enable Animations', 'designsetgo')}
				checked={dsgoAnimationEnabled}
				onChange={(value) =>
					setAttributes({ dsgoAnimationEnabled: value })
				}
				help={__(
					'Add entrance and exit animations to this block',
					'designsetgo'
				)}
				__nextHasNoMarginBottom
			/>

			{dsgoAnimationEnabled && (
				<>
					<SelectControl
						label={__('Entrance Animation', 'designsetgo')}
						value={dsgoEntranceAnimation}
						options={[
							{ label: __('None', 'designsetgo'), value: '' },
							...ANIMATION_TYPES.entrance,
						]}
						onChange={(value) =>
							setAttributes({ dsgoEntranceAnimation: value })
						}
						help={__('Animation when block appears', 'designsetgo')}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Exit Animation (Optional)', 'designsetgo')}
						value={dsgoExitAnimation}
						options={[
							{ label: __('None', 'designsetgo'), value: '' },
							...ANIMATION_TYPES.exit,
						]}
						onChange={(value) => {
							// When exit animation is selected with scroll trigger,
							// disable "animate once" so the animation can repeat
							if (value && dsgoAnimationTrigger === 'scroll') {
								setAttributes({
									dsgoExitAnimation: value,
									dsgoAnimationOnce: false,
								});
							} else {
								setAttributes({ dsgoExitAnimation: value });
							}
						}}
						help={__(
							'Animation when block disappears',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Animation Trigger', 'designsetgo')}
						value={dsgoAnimationTrigger}
						options={ANIMATION_TRIGGERS}
						onChange={(value) =>
							setAttributes({ dsgoAnimationTrigger: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Duration', 'designsetgo')}
						value={dsgoAnimationDuration}
						options={ANIMATION_DURATIONS}
						onChange={(value) =>
							setAttributes({
								dsgoAnimationDuration: parseInt(value, 10),
							})
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Delay (ms)', 'designsetgo')}
						value={dsgoAnimationDelay}
						onChange={(value) =>
							setAttributes({ dsgoAnimationDelay: value })
						}
						min={0}
						max={3000}
						step={100}
						help={__(
							'Delay before animation starts',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Easing', 'designsetgo')}
						value={dsgoAnimationEasing}
						options={ANIMATION_EASINGS}
						onChange={(value) =>
							setAttributes({ dsgoAnimationEasing: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					{dsgoAnimationTrigger === 'scroll' && (
						<>
							<RangeControl
								label={__(
									'Viewport Offset (px)',
									'designsetgo'
								)}
								value={dsgoAnimationOffset}
								onChange={(value) =>
									setAttributes({
										dsgoAnimationOffset: value,
									})
								}
								min={0}
								max={500}
								step={10}
								help={__(
									'Distance from viewport to trigger animation',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							{dsgoExitAnimation && (
								<Notice status="info" isDismissible={false}>
									{__(
										'Exit animations require repeating behavior. "Animate Once" is disabled.',
										'designsetgo'
									)}
								</Notice>
							)}

							<ToggleControl
								label={__('Animate Once', 'designsetgo')}
								checked={dsgoAnimationOnce}
								onChange={(value) =>
									setAttributes({ dsgoAnimationOnce: value })
								}
								disabled={!!dsgoExitAnimation}
								help={
									dsgoExitAnimation
										? __(
												'Disabled when exit animation is set',
												'designsetgo'
											)
										: __(
												'Only animate the first time block enters viewport',
												'designsetgo'
											)
								}
								__nextHasNoMarginBottom
							/>
						</>
					)}

					{!dsgoEntranceAnimation && !dsgoExitAnimation && (
						<Notice status="warning" isDismissible={false}>
							{__(
								'Please select at least one animation type.',
								'designsetgo'
							)}
						</Notice>
					)}
				</>
			)}
		</PanelBody>
	);
}
