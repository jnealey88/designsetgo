/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
	useSettings,
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './editor.scss';
import { convertColorToCSSVar } from '../../utils/convert-preset-to-css-var';
import ScrollSlidesPlaceholder from './components/ScrollSlidesPlaceholder';
import ScrollSlidesInspector from './components/ScrollSlidesInspector';

const ALLOWED_BLOCKS = ['designsetgo/scroll-slide'];
const MAX_SLIDES = 10;

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		minHeight,
		maxHeight,
		constrainWidth,
		contentWidth,
		overlayColor,
		navColor,
		navActiveColor,
	} = attributes;
	const [activeSlide, setActiveSlide] = useState(0);

	const [themeContentSize] = useSettings('layout.contentSize');

	// Read inner blocks to build nav and show/hide panels
	const { innerBlocks, hasInnerBlocks } = useSelect(
		(select) => {
			const { getBlock } = select(blockEditorStore);
			const block = getBlock(clientId);
			return {
				innerBlocks: block?.innerBlocks || [],
				hasInnerBlocks: block?.innerBlocks?.length > 0,
			};
		},
		[clientId]
	);

	const { updateBlockAttributes, selectBlock } =
		useDispatch(blockEditorStore);

	// Clamp active slide to valid range when slides are removed
	const clampedActive =
		innerBlocks.length > 0
			? Math.min(activeSlide, innerBlocks.length - 1)
			: 0;

	const blockClassName = [
		'dsgo-scroll-slides',
		overlayColor && 'dsgo-scroll-slides--has-overlay',
		!constrainWidth && 'dsgo-scroll-slides--no-width-constraint',
		(navColor || navActiveColor) && 'dsgo-scroll-slides--has-nav-color',
	]
		.filter(Boolean)
		.join(' ');

	// Compute effective height for editor preview (mirrors frontend behavior)
	const effectiveMinHeight = minHeight || '100vh';
	const editorHeight = maxHeight
		? `min(${effectiveMinHeight}, ${maxHeight})`
		: effectiveMinHeight;

	// Build background preview from the active slide's block supports.
	// On the frontend, view.js extracts per-slide backgrounds into full-width
	// crossfading layers. This mirrors that behavior in the editor.
	const editorBgStyle = {};
	if (hasInnerBlocks) {
		const activeBlock = innerBlocks[clampedActive];
		const slideAttrs = activeBlock?.attributes || {};
		const slideStyle = slideAttrs.style || {};

		// Background color: preset slug or custom hex
		if (slideStyle?.color?.background) {
			editorBgStyle.backgroundColor = slideStyle.color.background;
		} else if (slideAttrs.backgroundColor) {
			editorBgStyle.backgroundColor = `var(--wp--preset--color--${slideAttrs.backgroundColor})`;
		}

		// Gradient: custom CSS or preset slug
		if (slideStyle?.color?.gradient) {
			editorBgStyle.backgroundImage = slideStyle.color.gradient;
		} else if (slideAttrs.gradient) {
			editorBgStyle.backgroundImage = `var(--wp--preset--gradient--${slideAttrs.gradient})`;
		}

		// Background image (overrides gradient if set)
		if (slideStyle?.background?.backgroundImage?.url) {
			editorBgStyle.backgroundImage = `url(${slideStyle.background.backgroundImage.url})`;
			editorBgStyle.backgroundSize =
				slideStyle.background?.backgroundSize || 'cover';
			editorBgStyle.backgroundPosition =
				slideStyle.background?.backgroundPosition || 'center';
			editorBgStyle.backgroundRepeat =
				slideStyle.background?.backgroundRepeat || 'no-repeat';
		}
	}

	const hasEditorBg = Object.keys(editorBgStyle).length > 0;

	const blockProps = useBlockProps({
		className: blockClassName,
		'data-dsgo-active-slide': clampedActive,
		style: {
			minHeight: editorHeight,
			...(overlayColor && {
				'--dsgo-overlay-color': convertColorToCSSVar(overlayColor),
				'--dsgo-overlay-opacity': '0.8',
			}),
			...(navColor && {
				'--dsgo-nav-color': convertColorToCSSVar(navColor),
			}),
			...(navActiveColor && {
				'--dsgo-nav-active-color': convertColorToCSSVar(navActiveColor),
			}),
		},
	});

	const innerStyle = {};
	if (constrainWidth) {
		innerStyle.maxWidth = contentWidth || themeContentSize || '1140px';
		innerStyle.marginLeft = 'auto';
		innerStyle.marginRight = 'auto';
	}

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsgo-scroll-slides__editor-panels',
		},
		{
			allowedBlocks: ALLOWED_BLOCKS,
			orientation: 'vertical',
			renderAppender:
				innerBlocks.length >= MAX_SLIDES ? false : undefined,
		}
	);

	/**
	 * Handle nav heading click — switch active slide and select child block
	 *
	 * @param {number} index Slide index
	 */
	const handleNavClick = (index) => {
		setActiveSlide(index);
		if (innerBlocks[index]) {
			selectBlock(innerBlocks[index].clientId);
		}
	};

	/**
	 * Handle inline editing of nav heading text
	 *
	 * @param {number} index Slide index
	 * @param {string} value New heading text
	 */
	const handleNavHeadingChange = (index, value) => {
		if (innerBlocks[index]) {
			updateBlockAttributes(innerBlocks[index].clientId, {
				navHeading: value,
			});
		}
	};

	// Show template chooser when block is first inserted
	if (!hasInnerBlocks) {
		return (
			<div {...blockProps}>
				<ScrollSlidesPlaceholder
					clientId={clientId}
					setAttributes={setAttributes}
				/>
			</div>
		);
	}

	return (
		<>
			<ScrollSlidesInspector
				attributes={attributes}
				setAttributes={setAttributes}
				clientId={clientId}
				themeContentSize={themeContentSize}
			/>

			<div {...blockProps}>
				{hasEditorBg && (
					<div
						className="dsgo-scroll-slides__editor-bg"
						style={editorBgStyle}
						aria-hidden="true"
					/>
				)}
				<div className="dsgo-scroll-slides__inner" style={innerStyle}>
					{/* Navigation — editable headings, click to switch slide */}
					{innerBlocks.length > 0 && (
						<div className="dsgo-scroll-slides__editor-nav">
							{innerBlocks.map((block, index) => (
								<div
									key={block.clientId}
									className={`dsgo-scroll-slides__editor-nav-item${
										index === clampedActive
											? ' is-active'
											: ''
									}`}
								>
									<input
										type="text"
										className="dsgo-scroll-slides__editor-nav-input"
										value={
											block.attributes.navHeading || ''
										}
										placeholder={sprintf(
											/* translators: %d: slide number */
											__('Slide %d', 'designsetgo'),
											index + 1
										)}
										onChange={(e) =>
											handleNavHeadingChange(
												index,
												e.target.value
											)
										}
										onFocus={() => handleNavClick(index)}
									/>
								</div>
							))}
						</div>
					)}

					{/* Slide panels — all rendered, CSS shows only active */}
					<div {...innerBlocksProps} />
				</div>
			</div>
		</>
	);
}
