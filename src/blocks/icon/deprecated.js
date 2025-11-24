/**
 * Icon Block - Deprecated Versions
 *
 * Handles backward compatibility for blocks saved with previous versions.
 *
 * @since 1.2.0
 */

import { useBlockProps } from '@wordpress/block-editor';
import { getIcon } from './utils/svg-icons';

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

/**
 * Version 1: Before lazy loading icon library
 *
 * Changes in current version:
 * - Icons now use data attributes for frontend lazy loading
 * - Frontend icons injected via PHP to avoid bundling 51KB library
 * - Editor still uses getIcon() from shared library
 */
const v1 = {
	isEligible() {
		// v1 is eligible for all blocks saved before lazy loading
		// Always try this deprecation since it's the only one
		return true;
	},

	attributes: {
		icon: {
			type: 'string',
			default: 'star',
		},
		iconStyle: {
			type: 'string',
			default: 'filled',
		},
		strokeWidth: {
			type: 'number',
			default: 1.5,
		},
		iconSize: {
			type: 'number',
			default: 48,
		},
		rotation: {
			type: 'number',
			default: 0,
		},
		linkUrl: {
			type: 'string',
			default: '',
		},
		linkTarget: {
			type: 'string',
			default: '_self',
		},
		linkRel: {
			type: 'string',
			default: '',
		},
		ariaLabel: {
			type: 'string',
			default: '',
		},
		isDecorative: {
			type: 'boolean',
			default: false,
		},
	},
	save({ attributes }) {
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
			borderRadius: 'inherit',
		};

		// Determine ARIA attributes based on accessibility settings
		const getAriaAttributes = () => {
			if (isDecorative) {
				return {
					role: 'presentation',
					'aria-hidden': 'true',
				};
			}

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

		// Render icon with getIcon() - OLD VERSION
		const iconElement = (
			<div
				className={`dsgo-icon__wrapper${
					iconStyle === 'outlined' ? ' dsgo-icon-outlined' : ''
				}`}
				style={{
					...iconWrapperStyle,
					...(iconStyle === 'outlined' && {
						'--icon-stroke-width': strokeWidth,
					}),
				}}
				{...ariaAttributes}
			>
				{getIcon(icon)}
			</div>
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
	},
	migrate(attributes) {
		// No attribute changes needed - only save function changed
		return attributes;
	},
};

export default [v1];
