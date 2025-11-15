/**
 * Map Settings Panel Component
 *
 * Consolidated inspector panel for all map settings.
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	SelectControl,
	TextControl,
	RangeControl,
	Button,
	Notice,
	ToggleControl,
	TextareaControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { useState, useCallback } from '@wordpress/element';
import { geocodeAddress } from '../../utils/geocoding';

export default function MapSettingsPanel({ attributes, setAttributes }) {
	const {
		dsgoProvider,
		dsgoLatitude,
		dsgoLongitude,
		dsgoZoom,
		dsgoAddress,
		dsgoMarkerIcon,
		dsgoHeight,
		dsgoAspectRatio,
		dsgoMapStyle,
		dsgoPrivacyMode,
		dsgoPrivacyNotice,
	} = attributes;

	const [isSearching, setIsSearching] = useState(false);
	const [searchError, setSearchError] = useState('');

	/**
	 * Handle address search and geocoding.
	 * Debounced to respect Nominatim API rate limiting (1 req/sec).
	 */
	const handleAddressSearch = useCallback(async () => {
		if (!dsgoAddress || dsgoAddress.trim() === '') {
			setSearchError(
				__('Please enter an address to search.', 'designsetgo')
			);
			return;
		}

		setIsSearching(true);
		setSearchError('');

		try {
			const result = await geocodeAddress(dsgoAddress);

			if (result) {
				setAttributes({
					dsgoLatitude: result.lat,
					dsgoLongitude: result.lng,
					dsgoAddress: result.display_name,
				});
			} else {
				setSearchError(
					__(
						'Address not found. Please try a different search.',
						'designsetgo'
					)
				);
			}
		} catch (error) {
			setSearchError(
				__('Failed to search address. Please try again.', 'designsetgo')
			);
		} finally {
			setIsSearching(false);
		}
	}, [dsgoAddress, setAttributes]);

	// Note: Debouncing removed for now - can be added back if needed for rate limiting
	// const debouncedSearch = useMemo(
	// 	() => debounce(handleAddressSearch, 1000),
	// 	[handleAddressSearch]
	// );

	/**
	 * Handle Enter key in address field.
	 *
	 * @param {KeyboardEvent} event - Keyboard event.
	 */
	const handleAddressKeyPress = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleAddressSearch();
		}
	};

	return (
		<PanelBody title={__('Map Settings', 'designsetgo')} initialOpen={true}>
			{/* Provider Selection */}
			<SelectControl
				label={__('Map Provider', 'designsetgo')}
				value={dsgoProvider}
				options={[
					{
						label: __(
							'OpenStreetMap (No API key required)',
							'designsetgo'
						),
						value: 'openstreetmap',
					},
					{
						label: __(
							'Google Maps (Requires API key)',
							'designsetgo'
						),
						value: 'googlemaps',
					},
				]}
				onChange={(value) => setAttributes({ dsgoProvider: value })}
				help={
					dsgoProvider === 'openstreetmap'
						? __('Privacy-friendly and free to use.', 'designsetgo')
						: __('Requires a Google Maps API key.', 'designsetgo')
				}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>

			{dsgoProvider === 'googlemaps' && (
				<>
					{window.dsgoIntegrations?.googleMapsApiKey ? (
						<Notice
							status="success"
							isDismissible={false}
							style={{ marginTop: '12px' }}
						>
							{__(
								'✓ Google Maps API key configured in',
								'designsetgo'
							)}
							<a
								href="/wp-admin/admin.php?page=designsetgo-settings"
								target="_blank"
								rel="noopener noreferrer"
							>
								{__('Settings', 'designsetgo')}
							</a>
							.
						</Notice>
					) : (
						<Notice
							status="warning"
							isDismissible={false}
							style={{ marginTop: '12px' }}
						>
							<strong>
								{__('⚠ No API key configured.', 'designsetgo')}
							</strong>{' '}
							{__('Add a Google Maps API key in', 'designsetgo')}
							<a
								href="/wp-admin/admin.php?page=designsetgo-settings"
								target="_blank"
								rel="noopener noreferrer"
							>
								{__('Settings', 'designsetgo')}
							</a>{' '}
							{__('to use Google Maps.', 'designsetgo')}
							<br />
							<small>
								<strong>
									{__('Security:', 'designsetgo')}
								</strong>{' '}
								{__(
									'Configure HTTP referrer restrictions in Google Cloud Console.',
									'designsetgo'
								)}
							</small>
						</Notice>
					)}
				</>
			)}

			{/* Location Section */}
			<div style={{ marginTop: '24px' }}>
				<h3
					style={{
						fontSize: '13px',
						fontWeight: '500',
						marginBottom: '12px',
					}}
				>
					{__('Location', 'designsetgo')}
				</h3>

				<TextControl
					label={__('Search Address', 'designsetgo')}
					value={dsgoAddress}
					onChange={(value) => {
						setAttributes({ dsgoAddress: value });
						setSearchError('');
					}}
					onKeyPress={handleAddressKeyPress}
					placeholder={__(
						'Enter an address or location',
						'designsetgo'
					)}
					help={__(
						'Search for a location to automatically set coordinates.',
						'designsetgo'
					)}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>

				<Button
					variant="secondary"
					onClick={handleAddressSearch}
					isBusy={isSearching}
					disabled={!dsgoAddress || isSearching}
					style={{ marginTop: '8px' }}
				>
					{isSearching
						? __('Searching…', 'designsetgo')
						: __('Search Address', 'designsetgo')}
				</Button>

				{searchError && (
					<Notice
						status="error"
						isDismissible={false}
						style={{ marginTop: '12px' }}
					>
						{searchError}
					</Notice>
				)}

				<div style={{ marginTop: '16px' }}>
					<TextControl
						label={__('Latitude', 'designsetgo')}
						type="number"
						value={dsgoLatitude}
						onChange={(value) => {
							const num = parseFloat(value);
							const clamped = Number.isFinite(num)
								? Math.max(-90, Math.min(90, num))
								: 0;
							setAttributes({ dsgoLatitude: clamped });
						}}
						step="0.000001"
						min="-90"
						max="90"
						help={__(
							'Manual coordinate entry (between -90 and 90).',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<TextControl
						label={__('Longitude', 'designsetgo')}
						type="number"
						value={dsgoLongitude}
						onChange={(value) => {
							const num = parseFloat(value);
							const clamped = Number.isFinite(num)
								? Math.max(-180, Math.min(180, num))
								: 0;
							setAttributes({ dsgoLongitude: clamped });
						}}
						step="0.000001"
						min="-180"
						max="180"
						help={__(
							'Manual coordinate entry (between -180 and 180).',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</div>

				<RangeControl
					label={__('Zoom Level', 'designsetgo')}
					value={dsgoZoom}
					onChange={(value) => setAttributes({ dsgoZoom: value })}
					min={1}
					max={20}
					step={1}
					help={__(
						'1 = world view, 20 = street level.',
						'designsetgo'
					)}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</div>

			{/* Marker Section */}
			<div style={{ marginTop: '24px' }}>
				<h3
					style={{
						fontSize: '13px',
						fontWeight: '500',
						marginBottom: '12px',
					}}
				>
					{__('Marker', 'designsetgo')}
				</h3>

				<TextControl
					label={__('Marker Icon', 'designsetgo')}
					value={dsgoMarkerIcon}
					onChange={(value) =>
						setAttributes({ dsgoMarkerIcon: value || '📍' })
					}
					help={__(
						'Enter an emoji or icon character.',
						'designsetgo'
					)}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</div>

			{/* Appearance Section */}
			<div style={{ marginTop: '24px' }}>
				<h3
					style={{
						fontSize: '13px',
						fontWeight: '500',
						marginBottom: '12px',
					}}
				>
					{__('Appearance', 'designsetgo')}
				</h3>

				<SelectControl
					label={__('Aspect Ratio', 'designsetgo')}
					value={dsgoAspectRatio}
					options={[
						{
							label: __('16:9 (Widescreen)', 'designsetgo'),
							value: '16:9',
						},
						{
							label: __('4:3 (Standard)', 'designsetgo'),
							value: '4:3',
						},
						{
							label: __('1:1 (Square)', 'designsetgo'),
							value: '1:1',
						},
						{
							label: __('Custom Height', 'designsetgo'),
							value: 'custom',
						},
					]}
					onChange={(value) =>
						setAttributes({ dsgoAspectRatio: value })
					}
					help={
						dsgoAspectRatio === 'custom'
							? __('Set a custom height below.', 'designsetgo')
							: __(
									'Maintains aspect ratio across screen sizes.',
									'designsetgo'
								)
					}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>

				{dsgoAspectRatio === 'custom' && (
					<UnitControl
						label={__('Map Height', 'designsetgo')}
						value={dsgoHeight}
						onChange={(value) =>
							setAttributes({ dsgoHeight: value || '400px' })
						}
						units={[
							{ value: 'px', label: 'px' },
							{ value: '%', label: '%' },
							{ value: 'vh', label: 'vh' },
						]}
						help={__(
							'Set a custom height for the map.',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				)}

				{dsgoProvider === 'googlemaps' && (
					<SelectControl
						label={__('Map Style', 'designsetgo')}
						value={dsgoMapStyle}
						options={[
							{
								label: __('Standard', 'designsetgo'),
								value: 'standard',
							},
							{
								label: __('Silver (Minimalist)', 'designsetgo'),
								value: 'silver',
							},
							{
								label: __('Dark Mode', 'designsetgo'),
								value: 'dark',
							},
						]}
						onChange={(value) =>
							setAttributes({ dsgoMapStyle: value })
						}
						help={__(
							'Choose a visual style for Google Maps.',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				)}
			</div>

			{/* Privacy Section */}
			<div style={{ marginTop: '24px' }}>
				<h3
					style={{
						fontSize: '13px',
						fontWeight: '500',
						marginBottom: '12px',
					}}
				>
					{__('Privacy', 'designsetgo')}
				</h3>

				<ToggleControl
					label={__('Enable Privacy Mode', 'designsetgo')}
					checked={dsgoPrivacyMode}
					onChange={(value) =>
						setAttributes({ dsgoPrivacyMode: value })
					}
					help={
						dsgoPrivacyMode
							? __(
									'Map will not load until user clicks to consent.',
									'designsetgo'
								)
							: __(
									'Map will load automatically when page loads.',
									'designsetgo'
								)
					}
					__nextHasNoMarginBottom
				/>

				{dsgoPrivacyMode && (
					<>
						<TextareaControl
							label={__('Privacy Notice', 'designsetgo')}
							value={dsgoPrivacyNotice}
							onChange={(value) =>
								setAttributes({ dsgoPrivacyNotice: value })
							}
							rows={4}
							help={__(
								'Message shown to users before loading the map.',
								'designsetgo'
							)}
							__nextHasNoMarginBottom
						/>

						<p
							style={{
								marginTop: '12px',
								fontSize: '12px',
								color: '#757575',
							}}
						>
							{__(
								'Privacy mode is GDPR-compliant. External map services will only load after user consent.',
								'designsetgo'
							)}
						</p>
					</>
				)}
			</div>
		</PanelBody>
	);
}
