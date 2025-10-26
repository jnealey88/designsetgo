/**
 * Container Block - Grid Panel Component
 *
 * Provides responsive grid column controls (desktop, tablet, mobile).
 * Only displayed when layout type is 'grid'.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl } from '@wordpress/components';

/**
 * Grid Panel - Responsive grid column controls.
 *
 * Automatically adjusts smaller breakpoints when larger ones change to maintain logical hierarchy:
 * Desktop >= Tablet >= Mobile
 *
 * @param {Object} props - Component props
 * @param {string} props.layoutType - Current layout type
 * @param {number} props.gridColumns - Desktop columns (1-6)
 * @param {number} props.gridColumnsTablet - Tablet columns (1-6)
 * @param {number} props.gridColumnsMobile - Mobile columns (1-2)
 * @param {Function} props.setAttributes - Function to update block attributes
 * @return {JSX.Element|null} Grid Panel component or null if not grid layout
 */
export const GridPanel = ({
	layoutType,
	gridColumns,
	gridColumnsTablet,
	gridColumnsMobile,
	setAttributes,
}) => {
	// Only show when layout is grid
	if (layoutType !== 'grid') {
		return null;
	}

	return (
		<PanelBody title={__('Grid Settings', 'designsetgo')} initialOpen={true}>
			<p
				className="components-base-control__help"
				style={{
					marginTop: 0,
					marginBottom: '16px',
					fontWeight: 500,
				}}
			>
				{__('Control your grid layout across all devices.', 'designsetgo')}
			</p>

			<RangeControl
				label={__('Desktop Columns', 'designsetgo')}
				value={gridColumns}
				onChange={(value) => {
					// Auto-adjust tablet/mobile when desktop changes
					const newAttrs = { gridColumns: value };

					// If desktop is less than tablet, reduce tablet
					if (value < gridColumnsTablet) {
						newAttrs.gridColumnsTablet = value;
					}

					// If desktop is less than mobile, reduce mobile (max 2)
					if (value < gridColumnsMobile) {
						newAttrs.gridColumnsMobile = Math.min(value, 2);
					}

					setAttributes(newAttrs);
				}}
				min={1}
				max={6}
				help={__('Number of columns on desktop screens (>1024px)', 'designsetgo')}
			/>

			<RangeControl
				label={__('Tablet Columns', 'designsetgo')}
				value={gridColumnsTablet}
				onChange={(value) => {
					const newAttrs = { gridColumnsTablet: value };

					// Auto-adjust mobile if tablet is smaller than mobile
					if (value < gridColumnsMobile) {
						newAttrs.gridColumnsMobile = value;
					}

					setAttributes(newAttrs);
				}}
				min={1}
				max={gridColumns}
				help={__('Number of columns on tablet screens (768px-1023px)', 'designsetgo')}
			/>

			<RangeControl
				label={__('Mobile Columns', 'designsetgo')}
				value={gridColumnsMobile}
				onChange={(value) => setAttributes({ gridColumnsMobile: value })}
				min={1}
				max={Math.min(gridColumns, gridColumnsTablet)}
				help={__('Number of columns on mobile screens (<768px)', 'designsetgo')}
			/>
		</PanelBody>
	);
};
