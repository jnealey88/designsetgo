import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import { PanelBody, Icon, ToggleControl } from '@wordpress/components';
import classnames from 'classnames';

// Icon components for different styles
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

export default function AccordionItemEdit({ attributes, setAttributes, context }) {
	const { title, isOpen, uniqueId } = attributes;

	// Get context from parent accordion
	const iconStyle = context['designsetgo/accordion/iconStyle'] || 'chevron';
	const iconPosition = context['designsetgo/accordion/iconPosition'] || 'right';

	// Generate unique ID for accessibility
	useEffect(() => {
		if (!uniqueId) {
			setAttributes({
				uniqueId: `accordion-item-${Math.random().toString(36).substr(2, 9)}`,
			});
		}
	}, [uniqueId, setAttributes]);

	// Declaratively calculate classes
	const itemClasses = classnames('dsg-accordion-item', {
		'dsg-accordion-item--open': isOpen,
		'dsg-accordion-item--closed': !isOpen,
	});

	const blockProps = useBlockProps({
		className: itemClasses,
	});

	// Inner blocks for accordion content
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsg-accordion-item__content',
		},
		{
			template: [
				[
					'core/paragraph',
					{
						placeholder: __('Add content...', 'designsetgo'),
					},
				],
			],
		}
	);

	// Render the appropriate icon
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
				<Icon icon={<IconComponent />} />
			</span>
		);
	};

	const toggleOpen = () => {
		setAttributes({ isOpen: !isOpen });
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Item Settings', 'designsetgo')} initialOpen={true}>
					<ToggleControl
						label={__('Open by Default', 'designsetgo')}
						help={
							isOpen
								? __('This panel will be open when the page loads', 'designsetgo')
								: __('This panel will be closed when the page loads', 'designsetgo')
						}
						checked={isOpen}
						onChange={(value) => setAttributes({ isOpen: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="dsg-accordion-item__header">
					<button
						type="button"
						className={classnames('dsg-accordion-item__trigger', {
							'dsg-accordion-item__trigger--icon-left': iconPosition === 'left',
							'dsg-accordion-item__trigger--icon-right': iconPosition === 'right',
						})}
						onClick={toggleOpen}
						aria-expanded={isOpen}
					>
						{iconPosition === 'left' && renderIcon()}
						<RichText
							tagName="span"
							className="dsg-accordion-item__title"
							value={title}
							onChange={(value) => setAttributes({ title: value })}
							placeholder={__('Accordion Item Title', 'designsetgo')}
							allowedFormats={['core/bold', 'core/italic']}
						/>
						{iconPosition === 'right' && renderIcon()}
					</button>
				</div>

				{isOpen && (
					<div className="dsg-accordion-item__panel">
						<div {...innerBlocksProps} />
					</div>
				)}
			</div>
		</>
	);
}
