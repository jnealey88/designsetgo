import { useBlockProps, useInnerBlocksProps, RichText } from '@wordpress/block-editor';
import classnames from 'classnames';

// Icon SVGs - same as edit.js
const ChevronIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
		<path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z" />
	</svg>
);

const PlusMinusIcon = ({ isOpen }) => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
		{isOpen ? (
			<path d="M4 8h8v1H4z" />
		) : (
			<>
				<path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="1" fill="none" />
			</>
		)}
	</svg>
);

const CaretIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
		<path d="M6 7l2 2 2-2z" />
	</svg>
);

export default function AccordionItemSave({ attributes, context }) {
	const { title, isOpen, uniqueId } = attributes;

	// Get context from parent accordion (same as edit.js)
	const iconStyle = context?.['designsetgo/accordion/iconStyle'] || 'chevron';
	const iconPosition = context?.['designsetgo/accordion/iconPosition'] || 'right';

	// Same classes as edit.js - MUST MATCH
	const itemClasses = classnames('dsg-accordion-item', {
		'dsg-accordion-item--open': isOpen,
		'dsg-accordion-item--closed': !isOpen,
	});

	const blockProps = useBlockProps.save({
		className: itemClasses,
		'data-initially-open': isOpen,
	});

	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsg-accordion-item__content',
	});

	// Render icon (same logic as edit.js)
	const renderIcon = () => {
		if (iconStyle === 'none') return null;

		let IconComponent;
		switch (iconStyle) {
			case 'plus-minus':
				IconComponent = () => <PlusMinusIcon isOpen={isOpen} />;
				break;
			case 'caret':
				IconComponent = CaretIcon;
				break;
			case 'chevron':
			default:
				IconComponent = ChevronIcon;
		}

		return (
			<span className="dsg-accordion-item__icon" aria-hidden="true">
				<IconComponent />
			</span>
		);
	};

	const headerId = `${uniqueId}-header`;
	const panelId = `${uniqueId}-panel`;

	return (
		<div {...blockProps}>
			<div className="dsg-accordion-item__header">
				<button
					type="button"
					className={classnames('dsg-accordion-item__trigger', {
						'dsg-accordion-item__trigger--icon-left': iconPosition === 'left',
						'dsg-accordion-item__trigger--icon-right': iconPosition === 'right',
					})}
					aria-expanded={isOpen}
					aria-controls={panelId}
					id={headerId}
				>
					{iconPosition === 'left' && renderIcon()}
					<RichText.Content
						tagName="span"
						className="dsg-accordion-item__title"
						value={title}
					/>
					{iconPosition === 'right' && renderIcon()}
				</button>
			</div>

			<div
				className="dsg-accordion-item__panel"
				role="region"
				aria-labelledby={headerId}
				id={panelId}
				hidden={!isOpen}
			>
				<div {...innerBlocksProps} />
			</div>
		</div>
	);
}
