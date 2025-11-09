/**
 * Divider Block - Save Function
 *
 * WordPress Best Practice Approach:
 * - Declarative style application (matches edit.js exactly)
 * - Static output, no frontend JavaScript needed
 * - Block Supports automatically applies color styles
 *
 * @since 1.0.0
 */

import { useBlockProps } from '@wordpress/block-editor';
import { getIcon } from '../icon/utils/svg-icons';

/**
 * Divider Save Function
 *
 * @param {Object} props            - Component props
 * @param {Object} props.attributes - Block attributes
 * @return {JSX.Element} Saved divider block markup
 */
export default function DividerSave({ attributes }) {
	const { dividerStyle, width, thickness, iconName } = attributes;

	// Block wrapper props - Block Supports automatically applies color styles
	const blockProps = useBlockProps.save({
		className: `dsg-divider dsg-divider--${dividerStyle}`,
	});

	// Divider container styles
	const containerStyle = {
		width: `${width}%`,
		margin: '0 auto',
	};

	// Divider line styles
	const lineStyle = {
		height: `${thickness}px`,
	};

	return (
		<div {...blockProps}>
			<div className="dsg-divider__container" style={containerStyle}>
				{dividerStyle === 'icon' ? (
					<div className="dsg-divider__icon-wrapper">
						<span
							className="dsg-divider__line dsg-divider__line--left"
							style={lineStyle}
						/>
						<span className="dsg-divider__icon">
							{getIcon(iconName)}
						</span>
						<span
							className="dsg-divider__line dsg-divider__line--right"
							style={lineStyle}
						/>
					</div>
				) : (
					<div className="dsg-divider__line" style={lineStyle} />
				)}
			</div>
		</div>
	);
}
