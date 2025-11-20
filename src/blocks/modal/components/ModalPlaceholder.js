/**
 * Modal Placeholder Component
 *
 * Displays template chooser when modal is first inserted.
 *
 * @package DesignSetGo
 */

import { __ } from '@wordpress/i18n';
import { Button, Placeholder, Icon } from '@wordpress/components';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { useDispatch } from '@wordpress/data';
import { modalTemplates } from '../templates';
import './modal-placeholder.scss';

export default function ModalPlaceholder({ clientId, setAttributes }) {
	const { replaceInnerBlocks } = useDispatch('core/block-editor');

	const selectTemplate = (template) => {
		// Apply template attributes
		if (template.attributes) {
			setAttributes(template.attributes);
		}

		// Insert template inner blocks
		if (template.innerBlocks && template.innerBlocks.length > 0) {
			const blocks = createBlocksFromInnerBlocksTemplate(template.innerBlocks);
			replaceInnerBlocks(clientId, blocks, false);
		}
	};

	return (
		<Placeholder
			icon="feedback"
			label={__('Modal', 'designsetgo')}
			instructions={__('Choose a template to get started, or start with a blank modal.', 'designsetgo')}
			className="dsgo-modal-placeholder"
		>
			<div className="dsgo-modal-placeholder__templates">
				{modalTemplates.map((template) => (
					<Button
						key={template.name}
						className={`dsgo-modal-placeholder__template dsgo-modal-placeholder__template--${template.name}`}
						onClick={() => selectTemplate(template)}
						variant="secondary"
					>
						<div className="dsgo-modal-placeholder__template-icon">
							<Icon icon={template.icon} size={32} />
						</div>
						<div className="dsgo-modal-placeholder__template-info">
							<span className="dsgo-modal-placeholder__template-title">
								{template.title}
							</span>
							<span className="dsgo-modal-placeholder__template-description">
								{template.description}
							</span>
						</div>
					</Button>
				))}
			</div>
		</Placeholder>
	);
}
