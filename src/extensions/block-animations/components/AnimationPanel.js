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
		dsgAnimationEnabled,
		dsgEntranceAnimation,
		dsgExitAnimation,
		dsgAnimationTrigger,
		dsgAnimationDuration,
		dsgAnimationDelay,
		dsgAnimationEasing,
		dsgAnimationOffset,
		dsgAnimationOnce,
	} = attributes;

	return (
		<PanelBody
			title={__('Animations', 'designsetgo')}
			initialOpen={false}
			icon="video-alt3"
		>
			<ToggleControl
				label={__('Enable Animations', 'designsetgo')}
				checked={dsgAnimationEnabled}
				onChange={(value) =>
					setAttributes({ dsgAnimationEnabled: value })
				}
				help={__(
					'Add entrance and exit animations to this block',
					'designsetgo'
				)}
				__nextHasNoMarginBottom
			/>

			{dsgAnimationEnabled && (
				<>
					<SelectControl
						label={__('Entrance Animation', 'designsetgo')}
						value={dsgEntranceAnimation}
						options={[
							{ label: __('None', 'designsetgo'), value: '' },
							...ANIMATION_TYPES.entrance,
						]}
						onChange={(value) =>
							setAttributes({ dsgEntranceAnimation: value })
						}
						help={__('Animation when block appears', 'designsetgo')}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Exit Animation (Optional)', 'designsetgo')}
						value={dsgExitAnimation}
						options={[
							{ label: __('None', 'designsetgo'), value: '' },
							...ANIMATION_TYPES.exit,
						]}
						onChange={(value) => {
							// When exit animation is selected with scroll trigger,
							// disable "animate once" so the animation can repeat
							if (value && dsgAnimationTrigger === 'scroll') {
								setAttributes({
									dsgExitAnimation: value,
									dsgAnimationOnce: false,
								});
							} else {
								setAttributes({ dsgExitAnimation: value });
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
						value={dsgAnimationTrigger}
						options={ANIMATION_TRIGGERS}
						onChange={(value) =>
							setAttributes({ dsgAnimationTrigger: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Duration', 'designsetgo')}
						value={dsgAnimationDuration}
						options={ANIMATION_DURATIONS}
						onChange={(value) =>
							setAttributes({
								dsgAnimationDuration: parseInt(value, 10),
							})
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Delay (ms)', 'designsetgo')}
						value={dsgAnimationDelay}
						onChange={(value) =>
							setAttributes({ dsgAnimationDelay: value })
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
						value={dsgAnimationEasing}
						options={ANIMATION_EASINGS}
						onChange={(value) =>
							setAttributes({ dsgAnimationEasing: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					{dsgAnimationTrigger === 'scroll' && (
						<>
							<RangeControl
								label={__(
									'Viewport Offset (px)',
									'designsetgo'
								)}
								value={dsgAnimationOffset}
								onChange={(value) =>
									setAttributes({ dsgAnimationOffset: value })
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

							{dsgExitAnimation && (
								<Notice status="info" isDismissible={false}>
									{__(
										'Exit animations require repeating behavior. "Animate Once" is disabled.',
										'designsetgo'
									)}
								</Notice>
							)}

							<ToggleControl
								label={__('Animate Once', 'designsetgo')}
								checked={dsgAnimationOnce}
								onChange={(value) =>
									setAttributes({ dsgAnimationOnce: value })
								}
								disabled={!!dsgExitAnimation}
								help={
									dsgExitAnimation
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

					{!dsgEntranceAnimation && !dsgExitAnimation && (
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
