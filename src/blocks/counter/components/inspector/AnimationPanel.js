/**
 * Counter Block - Animation Panel Component
 *
 * Provides controls for overriding parent counter group animation settings.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, RangeControl, SelectControl } from '@wordpress/components';

/**
 * Animation Panel - Controls for animation override.
 *
 * Allows this counter to use custom animation settings instead of inheriting
 * from the parent Counter Group block.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.overrideAnimation - Whether to override parent animation
 * @param {number} props.customDuration - Custom animation duration (seconds)
 * @param {number} props.customDelay - Custom animation delay (seconds)
 * @param {string} props.customEasing - Custom easing function
 * @param {Object} props.context - Block context from parent
 * @param {Function} props.setAttributes - Function to update block attributes
 * @return {JSX.Element} Animation Panel component
 */
export const AnimationPanel = ({
	overrideAnimation,
	customDuration,
	customDelay,
	customEasing,
	context,
	setAttributes,
}) => {
	// Get parent settings from context (with fallback defaults)
	const parentDuration = context?.['designsetgo/counterGroup/animationDuration'] || 2;
	const parentDelay = context?.['designsetgo/counterGroup/animationDelay'] || 0;
	const parentEasing = context?.['designsetgo/counterGroup/animationEasing'] || 'easeOutQuad';

	return (
		<PanelBody
			title={__('Animation Override', 'designsetgo')}
			initialOpen={false}
		>
			<ToggleControl
				label={__('Override Parent Animation', 'designsetgo')}
				checked={overrideAnimation}
				onChange={(value) => setAttributes({ overrideAnimation: value })}
				help={__(
					'Use custom animation settings instead of parent settings',
					'designsetgo'
				)}
			/>

			{overrideAnimation && (
				<>
					<RangeControl
						label={__('Animation Duration (seconds)', 'designsetgo')}
						value={customDuration}
						onChange={(value) => setAttributes({ customDuration: value })}
						min={0.5}
						max={5}
						step={0.1}
						help={__('How long the counting animation takes', 'designsetgo')}
					/>

					<RangeControl
						label={__('Animation Delay (seconds)', 'designsetgo')}
						value={customDelay}
						onChange={(value) => setAttributes({ customDelay: value })}
						min={0}
						max={2}
						step={0.1}
						help={__('Delay before animation starts', 'designsetgo')}
					/>

					<SelectControl
						label={__('Easing Function', 'designsetgo')}
						value={customEasing}
						options={[
							{
								label: __('Ease Out Quad', 'designsetgo'),
								value: 'easeOutQuad',
							},
							{
								label: __('Ease Out Cubic', 'designsetgo'),
								value: 'easeOutCubic',
							},
							{
								label: __('Ease In Out', 'designsetgo'),
								value: 'easeInOutQuad',
							},
							{ label: __('Linear', 'designsetgo'), value: 'linear' },
						]}
						onChange={(value) => setAttributes({ customEasing: value })}
					/>
				</>
			)}

			{!overrideAnimation && (
				<div
					style={{
						padding: '12px',
						background: '#f0f0f0',
						borderRadius: '4px',
						marginTop: '12px',
					}}
				>
					<p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
						<strong>{__('Using parent settings:', 'designsetgo')}</strong>
						<br />
						{__('Duration:', 'designsetgo')} {parentDuration}s
						<br />
						{__('Delay:', 'designsetgo')} {parentDelay}s
						<br />
						{__('Easing:', 'designsetgo')} {parentEasing}
					</p>
				</div>
			)}
		</PanelBody>
	);
};
