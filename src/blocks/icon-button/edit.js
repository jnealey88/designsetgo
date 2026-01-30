/**
 * Icon Button Block - Edit Component
 *
 * Button with optional icon at start or end.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { getIcon } from '../icon/utils/svg-icons';
import { ButtonSettingsPanel } from './components/inspector/ButtonSettingsPanel';
import { convertPaddingValue } from './utils/padding';

/**
 * Icon Button Edit Component
 *
 * @param {Object}   props               - Component props
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @param {Object}   props.context       - Block context from parent
 * @param {string}   props.clientId      - Block client ID
 * @return {JSX.Element} Icon Button edit component
 */
export default function IconButtonEdit({
	attributes,
	setAttributes,
	context,
	clientId,
}) {
	const {
		text,
		url,
		linkTarget,
		rel,
		icon,
		iconPosition,
		iconSize,
		iconGap,
		width,
		hoverAnimation,
		hoverBackgroundColor,
		hoverTextColor,
		style,
		backgroundColor,
		textColor,
		fontSize,
		modalCloseId,
	} = attributes;

	// Check if button is inside a modal
	const isInsideModal = useSelect(
		(select) => {
			const { getBlockParents, getBlock } = select('core/block-editor');
			const parents = getBlockParents(clientId);
			return parents.some(
				(parentId) => getBlock(parentId)?.name === 'designsetgo/modal'
			);
		},
		[clientId]
	);

	// Get hover button background from parent container context
	const parentHoverButtonBg =
		context['designsetgo/hoverButtonBackgroundColor'];

	// Get theme color palette and gradient settings
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	// Extract WordPress color values
	// Custom colors come from style.color.background (hex/rgb)
	// Preset colors come from backgroundColor/textColor (slugs that need conversion)
	const bgColor =
		style?.color?.background ||
		(backgroundColor && `var(--wp--preset--color--${backgroundColor})`);
	const txtColor =
		style?.color?.text ||
		(textColor && `var(--wp--preset--color--${textColor})`);

	// Extract font size
	// Custom font sizes come from style.typography.fontSize (px/rem/em)
	// Preset font sizes come from fontSize (slug that needs conversion)
	const fontSizeValue =
		style?.typography?.fontSize ||
		(fontSize && `var(--wp--preset--font-size--${fontSize})`);

	// Extract padding - WordPress stores it in style.spacing.padding
	const paddingValue = style?.spacing?.padding;

	// Calculate button styles
	const buttonStyles = {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: iconPosition !== 'none' && icon ? iconGap : 0,
		width: width === 'auto' ? 'auto' : width,
		flexDirection: iconPosition === 'end' ? 'row-reverse' : 'row',
		...(bgColor && { backgroundColor: bgColor }),
		...(txtColor && { color: txtColor }),
		...(fontSizeValue && { fontSize: fontSizeValue }),
		...(paddingValue && {
			paddingTop: convertPaddingValue(paddingValue.top),
			paddingRight: convertPaddingValue(paddingValue.right),
			paddingBottom: convertPaddingValue(paddingValue.bottom),
			paddingLeft: convertPaddingValue(paddingValue.left),
		}),
		...(hoverBackgroundColor && {
			'--dsgo-button-hover-bg': hoverBackgroundColor,
		}),
		...(hoverTextColor && {
			'--dsgo-button-hover-color': hoverTextColor,
		}),
	};

	// Calculate icon wrapper styles
	const iconWrapperStyles = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: `${iconSize}px`,
		height: `${iconSize}px`,
		flexShrink: 0,
	};

	// Build animation class
	const animationClass =
		hoverAnimation && hoverAnimation !== 'none'
			? ` dsgo-icon-button--${hoverAnimation}`
			: '';

	// Build width class for CSS-based width handling
	// Default to auto width for any non-100% value
	const widthClass =
		width === '100%'
			? ' dsgo-icon-button--width-full'
			: ' dsgo-icon-button--width-auto';

	// wp-block-button class enables theme.json button styles to cascade to wp-block-button__link
	const blockProps = useBlockProps({
		className: `dsgo-icon-button wp-block-button${animationClass}${widthClass}`,
		style: {
			// Let block wrapper be block-level to respect WordPress content width constraints
			// Width styling is now handled via CSS classes on both wrapper and inner element
			...(parentHoverButtonBg && {
				'--dsgo-parent-hover-button-bg': parentHoverButtonBg,
			}),
		},
	});

	return (
		<>
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					panelId={clientId}
					title={__('Hover Colors', 'designsetgo')}
					settings={[
						{
							label: __('Hover Background', 'designsetgo'),
							colorValue: hoverBackgroundColor,
							onColorChange: (color) =>
								setAttributes({
									hoverBackgroundColor: color || '',
								}),
							clearable: true,
						},
						{
							label: __('Hover Text', 'designsetgo'),
							colorValue: hoverTextColor,
							onColorChange: (color) =>
								setAttributes({ hoverTextColor: color || '' }),
							clearable: true,
						},
					]}
					{...colorGradientSettings}
				/>
			</InspectorControls>

			<InspectorControls>
				<ButtonSettingsPanel
					url={url}
					linkTarget={linkTarget}
					rel={rel}
					icon={icon}
					iconPosition={iconPosition}
					iconSize={iconSize}
					iconGap={iconGap}
					width={width}
					hoverAnimation={hoverAnimation}
					modalCloseId={modalCloseId}
					isInsideModal={isInsideModal}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<div {...blockProps}>
				<div
					className="dsgo-icon-button__wrapper wp-element-button wp-block-button__link"
					style={buttonStyles}
				>
					{iconPosition !== 'none' && icon && (
						<span
							className="dsgo-icon-button__icon"
							style={iconWrapperStyles}
						>
							{getIcon(icon)}
						</span>
					)}
					<RichText
						tagName="span"
						className="dsgo-icon-button__text"
						value={text}
						onChange={(value) => setAttributes({ text: value })}
						placeholder={__('Button text…', 'designsetgo')}
						allowedFormats={['core/bold', 'core/italic']}
						withoutInteractiveFormatting
					/>
				</div>
			</div>
		</>
	);
}
