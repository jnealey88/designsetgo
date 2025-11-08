/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalBorderControl as BorderControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalToolsPanel as ToolsPanel,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Unit Border Panel component
 *
 * Controls for individual countdown unit borders (Days, Hours, Minutes, Seconds).
 * These appear in the Styles tab → Border section alongside container border controls.
 * Uses WordPress core BorderControl component for color, style, and width.
 *
 * @param {Object}   props               - Component properties
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @return {JSX.Element} Border controls component
 */
export default function UnitBorderPanel({ attributes, setAttributes }) {
	const { unitBorder, unitBorderRadius } = attributes;

	// Default border values
	const defaultBorder = {
		color: undefined,
		style: 'solid',
		width: '2px',
	};

	return (
		<InspectorControls group="border">
			<div style={{ gridColumn: '1 / -1' }}>
				<ToolsPanel
					label={__('Unit Borders', 'designsetgo')}
					resetAll={() => {
						setAttributes({
							unitBorder: defaultBorder,
							unitBorderRadius: 12,
						});
					}}
					panelId="unit-borders"
					hasInnerWrapper={true}
					shouldRenderPlaceholderItems={true}
					__experimentalFirstVisibleItemClass="first"
					__experimentalLastVisibleItemClass="last"
				>
					<p
						className="components-base-control__help"
						style={{ margin: '0 0 8px 0', gridColumn: '1 / -1' }}
					>
						{__(
							'Customize borders for individual countdown units (Days, Hours, etc.). Container border is controlled above.',
							'designsetgo'
						)}
					</p>
					<ToolsPanelItem
						hasValue={() =>
							unitBorder &&
							(unitBorder.color !== undefined ||
								unitBorder.style !== 'solid' ||
								unitBorder.width !== '2px')
						}
						label={__('Unit Border', 'designsetgo')}
						onDeselect={() =>
							setAttributes({ unitBorder: defaultBorder })
						}
						isShownByDefault={true}
						panelId="unit-borders"
					>
						<BorderControl
							label={__('Unit Border', 'designsetgo')}
							value={unitBorder || defaultBorder}
							onChange={(value) =>
								setAttributes({ unitBorder: value })
							}
							withSlider={true}
							__next40pxDefaultSize
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						hasValue={() => unitBorderRadius !== 12}
						label={__('Unit Radius', 'designsetgo')}
						onDeselect={() =>
							setAttributes({ unitBorderRadius: 12 })
						}
						isShownByDefault={true}
						panelId="unit-borders"
					>
						<UnitControl
							label={__('Unit Radius', 'designsetgo')}
							value={`${unitBorderRadius}px`}
							onChange={(value) => {
								const numValue = parseInt(value);
								setAttributes({
									unitBorderRadius: isNaN(numValue)
										? 12
										: numValue,
								});
							}}
							units={[{ value: 'px', label: 'px' }]}
							min={0}
							max={50}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</div>
		</InspectorControls>
	);
}
