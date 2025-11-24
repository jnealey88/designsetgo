/**
 * Icon Block - Save Component
 *
 * Renders inline SVG icon on the frontend
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * Sanitize URL to prevent XSS attacks
 *
 * @param {string} url URL to sanitize
 * @return {string} Sanitized URL or empty string if dangerous
 */
function sanitizeUrl(url) {
	if (!url || typeof url !== 'string') {
		return '';
	}

	// Block dangerous protocols
	const dangerousProtocols = /^(javascript|data|vbscript|file|about):/i;
	if (dangerousProtocols.test(url.trim())) {
		return '';
	}

	return url;
}

export default function IconSave({ attributes }) {
	const {
		icon,
		iconStyle,
		strokeWidth,
		iconSize,
		rotation,
		linkUrl,
		linkTarget,
		linkRel,
		ariaLabel,
		isDecorative,
	} = attributes;

	const blockProps = useBlockProps.save({
		className: 'dsgo-icon',
		style: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
	});

	// Icon wrapper styles
	const iconWrapperStyle = {
		width: `${iconSize}px`,
		height: `${iconSize}px`,
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
		// Background is inherited via CSS rules (see style.scss)
		// borderRadius inherits from parent for shape variants
		borderRadius: 'inherit',
	};

	// Determine ARIA attributes based on accessibility settings
	const getAriaAttributes = () => {
		// If decorative, hide from assistive technology
		if (isDecorative) {
			return {
				role: 'presentation',
				'aria-hidden': 'true',
			};
		}

		// If has custom label, use it
		if (ariaLabel) {
			return {
				role: 'img',
				'aria-label': ariaLabel,
			};
		}

		// Fallback to icon name (convert to readable format)
		const fallbackLabel = icon
			.replace(/-/g, ' ')
			.replace(/\b\w/g, (l) => l.toUpperCase());

		return {
			role: 'img',
			'aria-label': fallbackLabel,
		};
	};

	const ariaAttributes = getAriaAttributes();

	const iconElement = (
		<div
			className="dsgo-icon__wrapper dsgo-lazy-icon"
			style={iconWrapperStyle}
			data-icon-name={icon}
			data-icon-style={iconStyle}
			data-icon-stroke-width={strokeWidth}
			{...ariaAttributes}
		/>
	);

	// Sanitize URL for security
	const safeUrl = sanitizeUrl(linkUrl);

	return (
		<div {...blockProps}>
			{safeUrl ? (
				<a
					href={safeUrl}
					target={linkTarget}
					rel={
						linkTarget === '_blank'
							? linkRel || 'noopener noreferrer'
							: linkRel || undefined
					}
				>
					{iconElement}
				</a>
			) : (
				iconElement
			)}
		</div>
	);
}
