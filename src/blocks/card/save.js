/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	RichText,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Validates image URL to prevent XSS attacks
 *
 * @param {string} url - URL to validate
 * @return {boolean} True if URL is safe
 */
const isValidImageUrl = (url) => {
	if (!url || typeof url !== 'string') {
		return false;
	}
	// Only allow http(s) and data URLs, block javascript: and other protocols
	return /^(https?:\/\/|data:image\/)/.test(url);
};

/**
 * Save component for Card block
 *
 * @param {Object} props            - Component props
 * @param {Object} props.attributes - Block attributes
 * @return {Element} Save component
 */
export default function CardSave({ attributes }) {
	const {
		layoutPreset,
		imageUrl,
		imageAlt,
		imageAspectRatio,
		imageCustomAspectRatio,
		imageObjectFit,
		imageFocalPoint,
		badgeText,
		badgeStyle,
		badgeFloatingPosition,
		badgeInlinePosition,
		badgeBackgroundColor,
		badgeTextColor,
		title,
		subtitle,
		bodyText,
		overlayOpacity,
		overlayColor,
		contentAlignment,
		visualStyle,
		borderColor,
		showImage,
		showTitle,
		showSubtitle,
		showBody,
		showBadge,
		showCta,
		dsgoBlockStyleId,
	} = attributes;

	// Build block props with border color
	const blockStyles = {};
	// Only apply custom border color on styles that have borders (not minimal)
	if (borderColor && visualStyle !== 'minimal') {
		blockStyles.borderColor = borderColor;
		// Ensure border exists
		blockStyles.borderWidth = visualStyle === 'outlined' ? '2px' : '1px';
		blockStyles.borderStyle = 'solid';
	}

	const cardClassName = [
		'dsgo-card',
		dsgoBlockStyleId,
		`dsgo-card--${layoutPreset}`,
		`dsgo-card--style-${visualStyle}`,
	]
		.filter(Boolean)
		.join(' ');
	const blockProps = useBlockProps.save({
		className: cardClassName,
		style: blockStyles,
	});

	// Inner blocks props for CTA area
	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsgo-card__cta',
	});

	// Calculate image styles
	const imageStyles = {};
	if (imageAspectRatio !== 'original') {
		if (imageAspectRatio === 'custom' && imageCustomAspectRatio) {
			imageStyles.aspectRatio = imageCustomAspectRatio;
		} else if (imageAspectRatio === '16-9') {
			imageStyles.aspectRatio = '16 / 9';
		} else if (imageAspectRatio === '4-3') {
			imageStyles.aspectRatio = '4 / 3';
		} else if (imageAspectRatio === '1-1') {
			imageStyles.aspectRatio = '1 / 1';
		}
	}
	if (imageObjectFit) {
		imageStyles.objectFit = imageObjectFit;
	}
	if (imageObjectFit === 'cover' && imageFocalPoint) {
		imageStyles.objectPosition = `${imageFocalPoint.x * 100}% ${imageFocalPoint.y * 100}%`;
	}

	// Calculate badge styles
	const badgeStyles = {};
	if (badgeBackgroundColor) {
		badgeStyles.backgroundColor = badgeBackgroundColor;
	}
	if (badgeTextColor) {
		badgeStyles.color = badgeTextColor;
	}

	// Calculate overlay styles for background layout
	const overlayStyles = {};
	if (layoutPreset === 'background') {
		if (overlayColor) {
			overlayStyles.backgroundColor = overlayColor;
			overlayStyles.opacity = overlayOpacity / 100;
		} else {
			// Use theme contrast color at full opacity, let overlayOpacity control transparency
			overlayStyles.backgroundColor =
				'var(--wp--preset--color--contrast, #000)';
			overlayStyles.opacity = overlayOpacity / 100;
		}
	}

	// Content alignment class
	const contentAlignmentClass = `dsgo-card__content--${contentAlignment}`;

	// Render badge
	const renderBadge = () => {
		if (!showBadge || !badgeText) {
			return null;
		}

		const badgeClass =
			badgeStyle === 'floating'
				? `dsgo-card__badge dsgo-card__badge--floating dsgo-card__badge--${badgeFloatingPosition}`
				: `dsgo-card__badge dsgo-card__badge--inline dsgo-card__badge--${badgeInlinePosition}`;

		return (
			<span
				className={badgeClass}
				style={badgeStyles}
				role="status"
				aria-label={__('Badge', 'designsetgo')}
			>
				{badgeText}
			</span>
		);
	};

	// Render image
	const renderImage = () => {
		if (
			!showImage ||
			layoutPreset === 'minimal' ||
			!imageUrl ||
			!isValidImageUrl(imageUrl)
		) {
			return null;
		}

		if (layoutPreset === 'background') {
			return (
				<div
					className="dsgo-card__background"
					style={{ backgroundImage: `url(${imageUrl})` }}
				>
					<div className="dsgo-card__overlay" style={overlayStyles} />
				</div>
			);
		}

		// Provide fallback alt text for accessibility
		const altText = imageAlt || __('Card image', 'designsetgo');
		const imageProps = {
			src: imageUrl,
			alt: altText,
			className: 'dsgo-card__image',
			style: imageStyles,
			loading: 'lazy',
		};

		// Hide decorative images from screen readers
		if (!imageAlt) {
			imageProps['aria-hidden'] = 'true';
		}

		return (
			<div className="dsgo-card__image-wrapper">
				{/* eslint-disable-next-line jsx-a11y/alt-text */}
				<img {...imageProps} />
			</div>
		);
	};

	// Render content
	const renderContent = () => (
		<div
			className={`dsgo-card__content ${layoutPreset === 'background' ? contentAlignmentClass : ''}`}
		>
			{badgeStyle === 'inline' &&
				badgeInlinePosition === 'above-title' &&
				renderBadge()}

			{showTitle && title && (
				<RichText.Content
					tagName="h3"
					className="dsgo-card__title"
					value={title}
				/>
			)}

			{badgeStyle === 'inline' &&
				badgeInlinePosition === 'below-title' &&
				renderBadge()}

			{showSubtitle && subtitle && (
				<RichText.Content
					tagName="p"
					className="dsgo-card__subtitle"
					value={subtitle}
				/>
			)}

			{showBody && bodyText && (
				<RichText.Content
					tagName="p"
					className="dsgo-card__body"
					value={bodyText}
				/>
			)}

			{showCta && <div {...innerBlocksProps} />}
		</div>
	);

	return (
		<div {...blockProps}>
			{badgeStyle === 'floating' && renderBadge()}
			{layoutPreset === 'background' && renderImage()}

			<div className="dsgo-card__inner">
				{layoutPreset !== 'background' && renderImage()}
				{renderContent()}
			</div>
		</div>
	);
}
