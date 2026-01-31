/**
 * Error Modal Component
 *
 * Displays error messages in a modal dialog.
 *
 * @package
 * @since 1.4.0
 */

import { __ } from '@wordpress/i18n';
import { Modal, Flex, FlexItem, Button } from '@wordpress/components';

/**
 * Error modal component
 *
 * @param {Object}   props         Component props.
 * @param {boolean}  props.isOpen  Whether the modal is open.
 * @param {string}   props.message Error message to display.
 * @param {Function} props.onClose Callback when modal is closed.
 */
export default function ErrorModal({ isOpen, message, onClose }) {
	if (!isOpen) {
		return null;
	}

	return (
		<Modal
			title={__('Error', 'designsetgo')}
			onRequestClose={onClose}
			size="small"
		>
			<Flex direction="column" gap={4}>
				<FlexItem>
					<p style={{ margin: 0 }}>{message}</p>
				</FlexItem>
				<Flex justify="flex-end">
					<FlexItem>
						<Button variant="primary" onClick={onClose}>
							{__('OK', 'designsetgo')}
						</Button>
					</FlexItem>
				</Flex>
			</Flex>
		</Modal>
	);
}
