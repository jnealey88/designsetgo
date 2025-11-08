/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelBody, RadioControl, TextControl } from '@wordpress/components';

/**
 * Completion Panel component
 *
 * @param {Object}   props               - Component properties
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @return {JSX.Element} Panel component
 */
export default function CompletionPanel({ attributes, setAttributes }) {
	const { completionAction, completionMessage } = attributes;

	return (
		<PanelBody title={__('Completion Settings', 'designsetgo')}>
			<RadioControl
				label={__('When Countdown Ends', 'designsetgo')}
				selected={completionAction}
				options={[
					{
						label: __('Show Custom Message', 'designsetgo'),
						value: 'message',
					},
					{
						label: __('Hide Timer Completely', 'designsetgo'),
						value: 'hide',
					},
				]}
				onChange={(value) => setAttributes({ completionAction: value })}
			/>

			{completionAction === 'message' && (
				<TextControl
					label={__('Completion Message', 'designsetgo')}
					value={completionMessage}
					onChange={(value) =>
						setAttributes({ completionMessage: value })
					}
					placeholder={__('The countdown has ended!', 'designsetgo')}
					help={__(
						'This message will replace the countdown timer when it reaches zero.',
						'designsetgo'
					)}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			)}
		</PanelBody>
	);
}
