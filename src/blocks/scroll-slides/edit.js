/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	store as blockEditorStore,
	useSettings,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './editor.scss';
import {
	encodeColorValue,
	decodeColorValue,
} from '../../utils/encode-color-value';
import { convertPresetToCSSVar } from '../../utils/convert-preset-to-css-var';
import ScrollSlidesPlaceholder from './components/ScrollSlidesPlaceholder';

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
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

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
				'--dsgo-overlay-color': convertPresetToCSSVar(overlayColor),
				'--dsgo-overlay-opacity': '0.8',
			}),
			...(navColor && {
				'--dsgo-nav-color': convertPresetToCSSVar(navColor),
			}),
			...(navActiveColor && {
				'--dsgo-nav-active-color':
					convertPresetToCSSVar(navActiveColor),
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
			<InspectorControls>
				<PanelBody
					title={__('Scroll Slides Settings', 'designsetgo')}
					initialOpen={true}
				>
					<UnitControl
						label={__('Minimum Height', 'designsetgo')}
						value={minHeight}
						onChange={(value) =>
							setAttributes({ minHeight: value })
						}
						units={[
							{ value: 'vh', label: 'vh' },
							{ value: 'px', label: 'px' },
							{ value: 'rem', label: 'rem' },
							{ value: '%', label: '%' },
						]}
						__next40pxDefaultSize
					/>
					<UnitControl
						label={__('Maximum Height', 'designsetgo')}
						value={maxHeight}
						onChange={(value) =>
							setAttributes({ maxHeight: value })
						}
						help={__(
							'Caps the section height on tall monitors',
							'designsetgo'
						)}
						units={[
							{ value: 'px', label: 'px' },
							{ value: 'vh', label: 'vh' },
							{ value: 'rem', label: 'rem' },
						]}
						__next40pxDefaultSize
					/>
					<ToggleControl
						label={__('Constrain Content Width', 'designsetgo')}
						checked={constrainWidth}
						onChange={(value) =>
							setAttributes({ constrainWidth: value })
						}
						help={
							constrainWidth
								? __(
										'Content respects theme content width',
										'designsetgo'
									)
								: __('Content fills full width', 'designsetgo')
						}
						__nextHasNoMarginBottom
					/>
					{constrainWidth && (
						<UnitControl
							label={__('Content Width', 'designsetgo')}
							value={contentWidth}
							onChange={(value) =>
								setAttributes({ contentWidth: value })
							}
							placeholder={
								themeContentSize ||
								__('Theme default', 'designsetgo')
							}
							help={
								!contentWidth && themeContentSize
									? sprintf(
											/* translators: %s: theme content size */
											__(
												'Using theme default: %s',
												'designsetgo'
											),
											themeContentSize
										)
									: undefined
							}
							units={[
								{ value: 'px', label: 'px' },
								{ value: 'rem', label: 'rem' },
								{ value: '%', label: '%' },
								{ value: 'vw', label: 'vw' },
							]}
							__next40pxDefaultSize
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					panelId={clientId}
					title={__('Navigation', 'designsetgo')}
					settings={[
						{
							label: __('Navigation Title Color', 'designsetgo'),
							colorValue: decodeColorValue(
								navColor,
								colorGradientSettings
							),
							onColorChange: (color) =>
								setAttributes({
									navColor:
										encodeColorValue(
											color,
											colorGradientSettings
										) || '',
								}),
							clearable: true,
						},
						{
							label: __('Active Title Color', 'designsetgo'),
							colorValue: decodeColorValue(
								navActiveColor,
								colorGradientSettings
							),
							onColorChange: (color) =>
								setAttributes({
									navActiveColor:
										encodeColorValue(
											color,
											colorGradientSettings
										) || '',
								}),
							clearable: true,
						},
					]}
					{...colorGradientSettings}
					__experimentalIsRenderedInSidebar
				/>
				<ColorGradientSettingsDropdown
					panelId={clientId}
					title={__('Overlay', 'designsetgo')}
					settings={[
						{
							label: __('Overlay Color', 'designsetgo'),
							colorValue: decodeColorValue(
								overlayColor,
								colorGradientSettings
							),
							onColorChange: (color) =>
								setAttributes({
									overlayColor:
										encodeColorValue(
											color,
											colorGradientSettings
										) || '',
								}),
							clearable: true,
						},
					]}
					{...colorGradientSettings}
					__experimentalIsRenderedInSidebar
				/>
			</InspectorControls>

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
								<button
									key={block.clientId}
									type="button"
									className={`dsgo-scroll-slides__editor-nav-item${
										index === clampedActive
											? ' is-active'
											: ''
									}`}
									onClick={() => handleNavClick(index)}
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
										onClick={(e) => e.stopPropagation()}
									/>
								</button>
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
