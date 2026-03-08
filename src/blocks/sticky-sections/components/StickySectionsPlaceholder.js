/**
 * Sticky Sections Placeholder
 *
 * Template chooser displayed when the block is first inserted.
 */

import { __ } from '@wordpress/i18n';
import { Button, Placeholder, Icon } from '@wordpress/components';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { useDispatch } from '@wordpress/data';
import stickySectionsTemplates from '../templates';
import './sticky-sections-placeholder.scss';

export default function StickySectionsPlaceholder({ clientId, setAttributes }) {
	const { replaceInnerBlocks } = useDispatch('core/block-editor');

	const selectTemplate = (template) => {
		if (template.attributes) {
			setAttributes(template.attributes);
		}

		if (template.innerBlocks && template.innerBlocks.length > 0) {
			const blocks = createBlocksFromInnerBlocksTemplate(
				template.innerBlocks
			);
			replaceInnerBlocks(clientId, blocks, false);
		}
	};

	return (
		<Placeholder
			icon="sticky"
			label={__('Sticky Sections', 'designsetgo')}
			instructions={__(
				'Choose a starting layout for your sticky stacking sections.',
				'designsetgo'
			)}
			className="dsgo-sticky-sections-placeholder"
		>
			<div className="dsgo-sticky-sections-placeholder__templates">
				{stickySectionsTemplates.map((template) => (
					<Button
						key={template.name}
						className={`dsgo-sticky-sections-placeholder__template dsgo-sticky-sections-placeholder__template--${template.name}`}
						onClick={() => selectTemplate(template)}
						variant="secondary"
					>
						<div className="dsgo-sticky-sections-placeholder__template-icon">
							<Icon icon={template.icon} size={32} />
						</div>
						<div className="dsgo-sticky-sections-placeholder__template-info">
							<span className="dsgo-sticky-sections-placeholder__template-title">
								{template.title}
							</span>
							<span className="dsgo-sticky-sections-placeholder__template-description">
								{template.description}
							</span>
						</div>
					</Button>
				))}
			</div>
		</Placeholder>
	);
}
