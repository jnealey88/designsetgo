/**
 * Grid Container Block - Edit Component
 *
 * Responsive multi-column grid layouts.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	useSetting,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalToolsPanel as ToolsPanel,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalToolsPanelItem as ToolsPanelItem,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Grid Container Edit Component
 *
 * @param {Object}   props               Component props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to update attributes
 * @return {JSX.Element} Edit component
 */
export default function GridEdit({ attributes, setAttributes }) {
	const {
		desktopColumns,
		tabletColumns,
		mobileColumns,
		rowGap,
		columnGap,
		alignItems,
		constrainWidth,
		contentWidth,
	} = attributes;

	const [useCustomGaps, setUseCustomGaps] = useState(!!(rowGap || columnGap));

	// Get spacing sizes and content size from theme
	const spacingSizes = useSetting('spacing.spacingSizes');
	const themeContentWidth = useSetting('layout.contentSize');

	// Calculate effective content width
	const effectiveContentWidth = contentWidth || themeContentWidth || '1200px';

	// Units for UnitControl components (still used in Gap Settings)
	const units = [
		{ value: 'px', label: 'px' },
		{ value: 'em', label: 'em' },
		{ value: 'rem', label: 'rem' },
		{ value: '%', label: '%' },
	];

	// Calculate inner styles declaratively with responsive columns
	// IMPORTANT: Always provide a default gap to prevent overlapping items
	// Custom gaps override the default when set
	const innerStyles = {
		display: 'grid',
		gridTemplateColumns: `repeat(${desktopColumns || 3}, 1fr)`,
		alignItems: alignItems || 'start',
		// Apply gaps: custom values OR default (24px / --wp--preset--spacing--50)
		rowGap: rowGap || 'var(--wp--preset--spacing--50)',
		columnGap: columnGap || 'var(--wp--preset--spacing--50)',
		...(constrainWidth && {
			maxWidth: effectiveContentWidth,
			marginLeft: 'auto',
			marginRight: 'auto',
		}),
	};

	// Block wrapper props with responsive column classes
	const blockProps = useBlockProps({
		className: `dsg-grid dsg-grid-cols-${desktopColumns} dsg-grid-cols-tablet-${tabletColumns} dsg-grid-cols-mobile-${mobileColumns}`,
	});

	// Inner blocks props with declarative styles
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsg-grid__inner',
			style: innerStyles,
		},
		{
			templateLock: false,
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Grid Settings', 'designsetgo')}
					initialOpen={true}
				>
					<RangeControl
						label={__('Desktop Columns', 'designsetgo')}
						value={desktopColumns}
						onChange={(value) => {
							// Ensure tablet columns don't exceed desktop
							const newTabletCols = Math.min(
								tabletColumns,
								value
							);
							// Ensure mobile columns don't exceed tablet
							const newMobileCols = Math.min(
								mobileColumns,
								newTabletCols
							);

							setAttributes({
								desktopColumns: value,
								...(newTabletCols !== tabletColumns && {
									tabletColumns: newTabletCols,
								}),
								...(newMobileCols !== mobileColumns && {
									mobileColumns: newMobileCols,
								}),
							});
						}}
						min={1}
						max={12}
						help={__(
							'Number of columns on desktop screens',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Tablet Columns', 'designsetgo')}
						value={tabletColumns}
						onChange={(value) => {
							// Ensure mobile columns don't exceed tablet
							const newMobileCols = Math.min(
								mobileColumns,
								value
							);

							setAttributes({
								tabletColumns: value,
								...(newMobileCols !== mobileColumns && {
									mobileColumns: newMobileCols,
								}),
							});
						}}
						min={1}
						max={desktopColumns}
						help={__(
							'Number of columns on tablet screens (≤ 1024px)',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Mobile Columns', 'designsetgo')}
						value={mobileColumns}
						onChange={(value) =>
							setAttributes({ mobileColumns: value })
						}
						min={1}
						max={tabletColumns}
						help={__(
							'Number of columns on mobile screens (≤ 767px)',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Align Items', 'designsetgo')}
						value={alignItems}
						options={[
							{
								label: __('Start', 'designsetgo'),
								value: 'start',
							},
							{
								label: __('Center', 'designsetgo'),
								value: 'center',
							},
							{ label: __('End', 'designsetgo'), value: 'end' },
							{
								label: __('Stretch', 'designsetgo'),
								value: 'stretch',
							},
						]}
						onChange={(value) =>
							setAttributes({ alignItems: value })
						}
						help={__(
							'Vertical alignment of grid items',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Gap Settings', 'designsetgo')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Custom Row/Column Gaps', 'designsetgo')}
						checked={useCustomGaps}
						onChange={(value) => {
							setUseCustomGaps(value);
							if (!value) {
								// Reset to WordPress blockGap
								setAttributes({ rowGap: '', columnGap: '' });
							}
						}}
						help={
							useCustomGaps
								? __(
										'Using separate row and column gaps',
										'designsetgo'
									)
								: __(
										'Using WordPress blockGap (configure in Spacing panel)',
										'designsetgo'
									)
						}
						__nextHasNoMarginBottom
					/>

					{useCustomGaps && (
						<>
							<UnitControl
								label={__('Row Gap', 'designsetgo')}
								value={rowGap}
								onChange={(value) =>
									setAttributes({ rowGap: value })
								}
								units={units}
								isResetValueOnUnitChange
								__unstableInputWidth="80px"
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<UnitControl
								label={__('Column Gap', 'designsetgo')}
								value={columnGap}
								onChange={(value) =>
									setAttributes({ columnGap: value })
								}
								units={units}
								isResetValueOnUnitChange
								__unstableInputWidth="80px"
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}
