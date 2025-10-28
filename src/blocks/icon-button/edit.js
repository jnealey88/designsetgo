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
	BlockControls,
	AlignmentToolbar,
} from '@wordpress/block-editor';
import { getIcon } from '../icon/utils/svg-icons';
import { ButtonSettingsPanel } from './components/inspector/ButtonSettingsPanel';

/**
 * Icon Button Edit Component
 *
 * @param {Object}   props               - Component props
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @return {JSX.Element} Icon Button edit component
 */
export default function IconButtonEdit({ attributes, setAttributes }) {
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
	} = attributes;

	// Calculate button styles
	const buttonStyles = {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: iconPosition !== 'none' && icon ? iconGap : 0,
		width: width === 'auto' ? 'auto' : width,
		flexDirection: iconPosition === 'end' ? 'row-reverse' : 'row',
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

	const blockProps = useBlockProps({
		className: 'dsg-icon-button',
		style: { display: width === '100%' ? 'block' : 'inline-block' },
	});

	return (
		<>
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
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<div {...blockProps}>
				<div className="dsg-icon-button__wrapper" style={buttonStyles}>
					{iconPosition !== 'none' && icon && (
						<span
							className="dsg-icon-button__icon"
							style={iconWrapperStyles}
						>
							{getIcon(icon)}
						</span>
					)}
					<RichText
						tagName="span"
						className="dsg-icon-button__text"
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
