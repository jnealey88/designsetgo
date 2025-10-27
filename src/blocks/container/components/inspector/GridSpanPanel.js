/**
 * Container Block - Grid Span Panel Component
 *
 * Provides controls for setting column span when nested in a parent grid container.
 * Only displays when parent container uses grid layout.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl } from '@wordpress/components';

/**
 * Grid Span Panel - Controls column span for nested containers in grid layouts.
 *
 * @param {Object}   props                   - Component props
 * @param {boolean}  props.parentIsGrid      - Whether parent container is using grid layout
 * @param {number}   props.parentGridColumns - Number of columns in parent grid
 * @param {number}   props.gridColumnSpan    - Current column span value
 * @param {Function} props.setAttributes     - Function to update block attributes
 * @return {JSX.Element|null} Grid Span Panel component or null if not in grid context
 */
export const GridSpanPanel = ({
	parentIsGrid,
	parentGridColumns,
	gridColumnSpan,
	setAttributes,
}) => {
	// Only show if parent is a grid container
	if (!parentIsGrid) {
		return null;
	}

	return (
		<PanelBody
			title={__('Grid Column Span', 'designsetgo')}
			initialOpen={false}
		>
			<RangeControl
				label={__('Columns to Span', 'designsetgo')}
				value={gridColumnSpan}
				onChange={(value) => setAttributes({ gridColumnSpan: value })}
				min={1}
				max={parentGridColumns || 12}
				help={__(
					'How many columns this container should span in the parent grid.',
					'designsetgo'
				)}
			/>
		</PanelBody>
	);
};
