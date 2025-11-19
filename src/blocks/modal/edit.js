/**
 * Modal Block - Editor Component
 *
 * @package DesignSetGo
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { Notice } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { transferStylesToContent } from './utils/style-transfer';
import ModalSettings from './components/ModalSettings';
import AnimationSettings from './components/AnimationSettings';
import OverlaySettings from './components/OverlaySettings';
import CloseButtonSettings from './components/CloseButtonSettings';
import BehaviorSettings from './components/BehaviorSettings';

export default function ModalEdit({ attributes, setAttributes, clientId }) {
	const {
		modalId,
		width,
		maxWidth,
		height,
		maxHeight,
		animationType,
		animationDuration,
		overlayOpacity,
		overlayColor,
		overlayBlur,
		closeOnBackdrop,
		closeOnEsc,
		showCloseButton,
		closeButtonPosition,
		closeButtonSize,
		closeButtonIconColor,
		closeButtonBgColor,
		disableBodyScroll,
	} = attributes;

	// Generate unique modal ID on first load
	useEffect(() => {
		if (!modalId) {
			setAttributes({ modalId: `dsgo-modal-${clientId}` });
		}
	}, [modalId, clientId, setAttributes]);

	// Check for duplicate modal IDs
	const hasDuplicateId = useSelect(
		(select) => {
			if (!modalId) return false;

			const { getBlocks } = select('core/block-editor');
			const allBlocks = getBlocks();

			// Find all modal blocks with matching ID (excluding this block)
			const findDuplicates = (blocks) => {
				let count = 0;
				for (const block of blocks) {
					if (
						block.name === 'designsetgo/modal' &&
						block.clientId !== clientId &&
						block.attributes.modalId === modalId
					) {
						count++;
					}
					if (block.innerBlocks?.length) {
						count += findDuplicates(block.innerBlocks);
					}
				}
				return count;
			};

			return findDuplicates(allBlocks) > 0;
		},
		[modalId, clientId]
	);

	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	const blockProps = useBlockProps({
		className: 'dsgo-modal-editor-preview',
	});

	// Transfer block support styles from wrapper to content using shared utility
	const { contentStyle, wrapperProps, contentClasses } = transferStylesToContent(
		blockProps,
		{ width, maxWidth, height, maxHeight }
	);

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: ['dsgo-modal__content', ...contentClasses].join(' '),
			style: contentStyle,
		},
		{
			template: [
				[
					'core/heading',
					{
						level: 2,
						placeholder: __('Modal Title', 'designsetgo'),
					},
				],
				[
					'core/paragraph',
					{
						placeholder: __(
							'Add your modal content here...',
							'designsetgo'
						),
					},
				],
			],
			templateLock: false,
		}
	);

	return (
		<>
			<InspectorControls>
				{hasDuplicateId && (
					<Notice status="error" isDismissible={false}>
						{__(
							'Warning: Another modal on this page has the same ID. This will cause conflicts. Please change the Modal ID to be unique.',
							'designsetgo'
						)}
					</Notice>
				)}

				<ModalSettings
					attributes={attributes}
					setAttributes={setAttributes}
				/>
				<AnimationSettings
					attributes={attributes}
					setAttributes={setAttributes}
				/>
				<OverlaySettings
					attributes={attributes}
					setAttributes={setAttributes}
				/>
				<CloseButtonSettings
					attributes={attributes}
					setAttributes={setAttributes}
				/>
				<BehaviorSettings
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					panelId={clientId}
					title={__('Colors', 'designsetgo')}
					settings={[
						{
							label: __('Overlay Color', 'designsetgo'),
							colorValue: overlayColor,
							onColorChange: (color) =>
								setAttributes({
									overlayColor: color || '#000000',
								}),
							clearable: false,
							enableAlpha: true,
						},
						{
							label: __('Close Button Icon', 'designsetgo'),
							colorValue: closeButtonIconColor,
							onColorChange: (color) =>
								setAttributes({
									closeButtonIconColor: color || '',
								}),
							clearable: true,
							enableAlpha: true,
						},
						{
							label: __('Close Button Background', 'designsetgo'),
							colorValue: closeButtonBgColor,
							onColorChange: (color) =>
								setAttributes({
									closeButtonBgColor: color || '',
								}),
							clearable: true,
							enableAlpha: true,
						},
					]}
					{...colorGradientSettings}
				/>
			</InspectorControls>

			<div {...wrapperProps}>
				<div
					className="dsgo-modal-editor-preview__backdrop"
					style={{
						backgroundColor: overlayColor,
						opacity: overlayOpacity / 100,
					}}
				/>

				<div className="dsgo-modal-editor-preview__dialog">
					{showCloseButton &&
						!closeButtonPosition.startsWith('inside-') && (
							<button
								className={`dsgo-modal__close dsgo-modal__close--${closeButtonPosition}`}
								style={{
									width: `${closeButtonSize}px`,
									height: `${closeButtonSize}px`,
									color: closeButtonIconColor || undefined,
									backgroundColor: closeButtonBgColor || undefined,
								}}
								aria-label={__('Close modal', 'designsetgo')}
								disabled
							>
								<svg
									width="100%"
									height="100%"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M18 6L6 18M6 6L18 18"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
						)}

					<div
						{...innerBlocksProps}
						className={`${innerBlocksProps.className}${
							showCloseButton &&
							closeButtonPosition.startsWith('inside-')
								? ' has-inside-close-button'
								: ''
						}`}
					>
						{innerBlocksProps.children}
						{showCloseButton &&
							closeButtonPosition.startsWith('inside-') && (
								<button
									className={`dsgo-modal__close dsgo-modal__close--${closeButtonPosition}`}
									style={{
										width: `${closeButtonSize}px`,
										height: `${closeButtonSize}px`,
										color: closeButtonIconColor || undefined,
										backgroundColor: closeButtonBgColor || undefined,
									}}
									aria-label={__(
										'Close modal',
										'designsetgo'
									)}
									disabled
								>
									<svg
										width="100%"
										height="100%"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M18 6L6 18M6 6L18 18"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
							)}
					</div>
				</div>
			</div>
		</>
	);
}
