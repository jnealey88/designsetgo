/**
 * Scroll Slides Placeholder
 *
 * Template chooser displayed when the block is first inserted.
 */

import { __ } from '@wordpress/i18n';
import { Button, Placeholder, Icon } from '@wordpress/components';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { useDispatch } from '@wordpress/data';
import scrollSlidesTemplates from '../templates';
import './scroll-slides-placeholder.scss';

export default function ScrollSlidesPlaceholder({ clientId, setAttributes }) {
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
			icon="slides"
			label={__('Scroll Slides', 'designsetgo')}
			instructions={__(
				'Choose a starting layout for your scroll-pinned slideshow.',
				'designsetgo'
			)}
			className="dsgo-scroll-slides-placeholder"
		>
			<div className="dsgo-scroll-slides-placeholder__templates">
				{scrollSlidesTemplates.map((template) => (
					<Button
						key={template.name}
						className={`dsgo-scroll-slides-placeholder__template dsgo-scroll-slides-placeholder__template--${template.name}`}
						onClick={() => selectTemplate(template)}
						variant="secondary"
					>
						<div className="dsgo-scroll-slides-placeholder__template-icon">
							<Icon icon={template.icon} size={32} />
						</div>
						<div className="dsgo-scroll-slides-placeholder__template-info">
							<span className="dsgo-scroll-slides-placeholder__template-title">
								{template.title}
							</span>
							<span className="dsgo-scroll-slides-placeholder__template-description">
								{template.description}
							</span>
						</div>
					</Button>
				))}
			</div>
		</Placeholder>
	);
}
