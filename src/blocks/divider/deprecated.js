/**
 * Divider Block - Deprecated Versions
 *
 * Handles backward compatibility for blocks saved with previous versions.
 *
 * @since 1.2.0
 */

import { useBlockProps } from '@wordpress/block-editor';
import { getIcon } from '../icon/utils/svg-icons';

/**
 * Version 1: Before lazy loading icon library
 *
 * Changes in current version:
 * - Icons now use data attributes for frontend lazy loading
 * - Frontend icons injected via PHP to avoid bundling 51KB library
 */
const v1 = {
	attributes: {
		dividerStyle: {
			type: 'string',
			default: 'solid',
		},
		width: {
			type: 'number',
			default: 100,
		},
		thickness: {
			type: 'number',
			default: 2,
		},
		iconName: {
			type: 'string',
			default: 'star',
		},
	},
	save({ attributes }) {
		const { dividerStyle, width, thickness, iconName } = attributes;

		// Block wrapper props
		const blockProps = useBlockProps.save({
			className: `dsgo-divider dsgo-divider--${dividerStyle}`,
		});

		// Divider container styles
		const containerStyle = {
			width: `${width}%`,
		};

		// Divider line styles
		const lineStyle = {
			height: `${thickness}px`,
		};

		return (
			<div {...blockProps}>
				<div className="dsgo-divider__container" style={containerStyle}>
					{dividerStyle === 'icon' ? (
						<div className="dsgo-divider__icon-wrapper">
							<span
								className="dsgo-divider__line dsgo-divider__line--left"
								style={lineStyle}
							/>
							<span className="dsgo-divider__icon">
								{getIcon(iconName)}
							</span>
							<span
								className="dsgo-divider__line dsgo-divider__line--right"
								style={lineStyle}
							/>
						</div>
					) : (
						<div className="dsgo-divider__line" style={lineStyle} />
					)}
				</div>
			</div>
		);
	},
	migrate(attributes) {
		// No attribute changes needed - only save function changed
		return attributes;
	},
};

export default [v1];
