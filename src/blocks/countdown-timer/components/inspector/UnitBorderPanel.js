/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
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
 * Uses WordPress core-style border controls for consistency.
 *
 * @param {Object}   props               - Component properties
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @return {JSX.Element} Border controls component
 */
export default function UnitBorderPanel({ attributes, setAttributes }) {
	const { unitBorderWidth, unitBorderRadius } = attributes;

	return (
		<InspectorControls group="border">
			<div style={{ gridColumn: '1 / -1' }}>
				<ToolsPanel
					label={__('Unit Borders', 'designsetgo')}
					resetAll={() => {
						setAttributes({
							unitBorderWidth: 2,
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
						hasValue={() => unitBorderWidth !== 2}
						label={__('Unit Width', 'designsetgo')}
						onDeselect={() => setAttributes({ unitBorderWidth: 2 })}
						isShownByDefault={true}
						panelId="unit-borders"
					>
						<UnitControl
							label={__('Unit Width', 'designsetgo')}
							value={`${unitBorderWidth}px`}
							onChange={(value) => {
								const numValue = parseInt(value);
								setAttributes({
									unitBorderWidth: isNaN(numValue)
										? 2
										: numValue,
								});
							}}
							units={[{ value: 'px', label: 'px' }]}
							min={0}
							max={10}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
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
