/**
 * Modal Block - Save Component
 *
 * @package DesignSetGo
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { transferStylesToContent } from './utils/style-transfer';

export default function save({ attributes }) {
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

	const blockProps = useBlockProps.save({
		className: 'dsgo-modal',
		id: modalId,
		role: 'dialog',
		'aria-modal': 'true',
		// Use aria-labelledby if title element exists, with aria-label as fallback
		'aria-labelledby': `${modalId}-title`,
		'aria-label': __('Modal', 'designsetgo'), // Fallback if title element is removed
		'aria-hidden': 'true',
		'data-dsgo-modal': 'true',
		'data-modal-id': modalId,
		'data-animation-type': animationType,
		'data-animation-duration': animationDuration,
		'data-close-on-backdrop': closeOnBackdrop,
		'data-close-on-esc': closeOnEsc,
		'data-disable-body-scroll': disableBodyScroll,
	});

	const overlayStyle = {
		backgroundColor: overlayColor,
		opacity: overlayOpacity / 100,
		backdropFilter: overlayBlur > 0 ? `blur(${overlayBlur}px)` : undefined,
	};

	const closeButtonIsInside = closeButtonPosition.startsWith('inside-');

	const closeButton = showCloseButton ? (
		<button
			className={`dsgo-modal__close dsgo-modal__close--${closeButtonPosition}`}
			style={{
				width: `${closeButtonSize}px`,
				height: `${closeButtonSize}px`,
				color: closeButtonIconColor || undefined,
				backgroundColor: closeButtonBgColor || undefined,
			}}
			type="button"
			aria-label={__('Close modal', 'designsetgo')}
		>
			<svg
				width="100%"
				height="100%"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
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
	) : null;

	// Transfer block support styles from wrapper to content using shared utility
	const { contentStyle, wrapperProps, contentClasses } = transferStylesToContent(
		blockProps,
		{ width, maxWidth, height, maxHeight }
	);

	const innerBlocksProps = useInnerBlocksProps.save({
		className: ['dsgo-modal__content', ...contentClasses].join(' '),
		style: contentStyle,
	});

	return (
		<div {...wrapperProps}>
			<div
				className="dsgo-modal__backdrop"
				style={overlayStyle}
				aria-hidden="true"
			/>
			<div className="dsgo-modal__dialog">
				{!closeButtonIsInside && closeButton}
				<div {...innerBlocksProps}>
					{innerBlocksProps.children}
					{closeButtonIsInside && closeButton}
				</div>
			</div>
		</div>
	);
}
