/**
 * Modal Block - Save Component
 *
 * @package DesignSetGo
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

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
		disableBodyScroll,
	} = attributes;

	const blockProps = useBlockProps.save({
		className: 'dsgo-modal',
		id: modalId,
		role: 'dialog',
		'aria-modal': 'true',
		'aria-labelledby': `${modalId}-title`,
		'aria-hidden': 'true',
		'data-dsgo-modal': 'true',
		'data-modal-id': modalId,
		'data-animation-type': animationType,
		'data-animation-duration': animationDuration,
		'data-close-on-backdrop': closeOnBackdrop,
		'data-close-on-esc': closeOnEsc,
		'data-disable-body-scroll': disableBodyScroll,
		style: {
			display: 'none',
		},
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

	// Transfer background styles from block wrapper to content
	const contentStyle = {
		width,
		maxWidth,
		height: height !== 'auto' ? height : undefined,
		maxHeight: height !== 'auto' ? maxHeight : undefined,
	};

	// Extract background/color styles from blockProps and apply to content
	if (blockProps.style) {
		if (blockProps.style.backgroundColor) {
			contentStyle.backgroundColor = blockProps.style.backgroundColor;
		}
		if (blockProps.style.color) {
			contentStyle.color = blockProps.style.color;
		}
	}

	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsgo-modal__content',
		style: contentStyle,
	});

	return (
		<div {...blockProps}>
			<div
				className="dsgo-modal__backdrop"
				style={overlayStyle}
				aria-hidden="true"
			/>
			<div className="dsgo-modal__dialog">
				{!closeButtonIsInside && closeButton}
				<div {...innerBlocksProps}>
					{closeButtonIsInside && closeButton}
				</div>
			</div>
		</div>
	);
}
