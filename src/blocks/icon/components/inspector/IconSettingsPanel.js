/**
 * Icon Block - Icon Settings Panel Component
 *
 * Provides controls for icon selection, size, and rotation.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	Button,
	RangeControl,
	SearchControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalToggleGroupControl as ToggleGroupControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { ALL_ICONS, MAX_DISPLAYED_ICONS } from '../../utils/dashicons-library';

/**
 * Icon Settings Panel - Controls for icon selection and appearance.
 *
 * Allows selecting an icon from Dashicons library with search,
 * adjusting icon size, and setting rotation.
 *
 * @param {Object}   props               - Component props
 * @param {string}   props.icon          - Current icon name
 * @param {number}   props.iconSize      - Icon size in pixels
 * @param {number}   props.rotation      - Rotation in degrees
 * @param {Function} props.setAttributes - Function to update block attributes
 * @return {JSX.Element} Icon Settings Panel component
 */
export const IconSettingsPanel = ({
	icon,
	iconSize,
	rotation,
	setAttributes,
}) => {
	const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
	const [iconSearch, setIconSearch] = useState('');

	// Filter icons based on search
	const filteredIcons = iconSearch
		? ALL_ICONS.filter((iconName) =>
				iconName.toLowerCase().includes(iconSearch.toLowerCase())
			)
		: null;

	return (
		<PanelBody
			title={__('Icon Settings', 'designsetgo')}
			initialOpen={true}
		>
			<Button
				variant="secondary"
				onClick={() => setIsIconPickerOpen(!isIconPickerOpen)}
				style={{ width: '100%', marginBottom: '16px' }}
			>
				{__('Change Icon', 'designsetgo')}
			</Button>

			{isIconPickerOpen && (
				<div className="dsg-icon-picker">
					<SearchControl
						value={iconSearch}
						onChange={setIconSearch}
						placeholder={__('Search icons…', 'designsetgo')}
					/>
					<div className="dsg-icon-picker__grid">
						{(filteredIcons || ALL_ICONS)
							.slice(0, MAX_DISPLAYED_ICONS)
							.map((iconName) => (
								<button
									key={iconName}
									className={`dsg-icon-picker__item ${
										icon === iconName ? 'is-selected' : ''
									}`}
									onClick={() => {
										setAttributes({ icon: iconName });
										setIsIconPickerOpen(false);
										setIconSearch('');
									}}
									title={iconName}
								>
									<span
										className={`dashicons dashicons-${iconName}`}
									/>
								</button>
							))}
					</div>
					{filteredIcons &&
						filteredIcons.length > MAX_DISPLAYED_ICONS && (
							<p
								style={{
									textAlign: 'center',
									color: '#666',
									fontSize: '12px',
								}}
							>
								{__(
									'Showing first 100 results. Refine your search to see more.',
									'designsetgo'
								)}
							</p>
						)}
				</div>
			)}

			<RangeControl
				label={__('Icon Size', 'designsetgo')}
				value={iconSize}
				onChange={(value) => setAttributes({ iconSize: value })}
				min={16}
				max={200}
				step={2}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>

			<ToggleGroupControl
				label={__('Rotation', 'designsetgo')}
				value={rotation}
				onChange={(value) =>
					setAttributes({ rotation: parseInt(value) })
				}
				isBlock
			>
				<ToggleGroupControlOption value="0" label="0°" />
				<ToggleGroupControlOption value="90" label="90°" />
				<ToggleGroupControlOption value="180" label="180°" />
				<ToggleGroupControlOption value="270" label="270°" />
			</ToggleGroupControl>
		</PanelBody>
	);
};
