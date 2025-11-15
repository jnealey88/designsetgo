/**
 * Map Block - Save Component
 *
 * Renders the static HTML output for the frontend.
 */

import { useBlockProps } from '@wordpress/block-editor';
import { __, sprintf } from '@wordpress/i18n';
import classnames from 'classnames';

/**
 * Save component for Map block.
 *
 * @param {Object} props            - Component props.
 * @param {Object} props.attributes - Block attributes.
 * @return {JSX.Element} Saved HTML.
 */
export default function Save({ attributes }) {
	const {
		dsgoProvider,
		dsgoLatitude,
		dsgoLongitude,
		dsgoZoom,
		dsgoAddress,
		dsgoMarkerIcon,
		dsgoMarkerColor,
		dsgoHeight,
		dsgoAspectRatio,
		dsgoPrivacyMode,
		dsgoPrivacyNotice,
		dsgoMapStyle,
	} = attributes;

	// Compute block classes (must match edit.js)
	const blockClasses = classnames('dsgo-map', {
		'dsgo-map--privacy-mode': dsgoPrivacyMode,
		[`dsgo-map--aspect-${dsgoAspectRatio.replace(':', '-')}`]:
			dsgoAspectRatio !== 'custom',
	});

	// Custom styles
	const mapStyles = {};
	if (dsgoAspectRatio === 'custom') {
		mapStyles.height = dsgoHeight;
	}

	// Ensure coordinates are within valid ranges (security)
	const safeLat = Math.max(-90, Math.min(90, dsgoLatitude || 0));
	const safeLng = Math.max(-180, Math.min(180, dsgoLongitude || 0));
	const safeZoom = Math.max(1, Math.min(20, dsgoZoom || 13));

	// Build data attributes for view.js
	// Note: Google Maps API key is injected via PHP render_block filter for security
	const dataAttributes = {
		'data-dsgo-provider': dsgoProvider,
		'data-dsgo-lat': safeLat,
		'data-dsgo-lng': safeLng,
		'data-dsgo-zoom': safeZoom,
		'data-dsgo-address': dsgoAddress || '',
		'data-dsgo-marker-icon': dsgoMarkerIcon || '📍',
		'data-dsgo-marker-color': dsgoMarkerColor || '#e74c3c',
		'data-dsgo-privacy-mode': dsgoPrivacyMode ? 'true' : 'false',
		'data-dsgo-map-style': dsgoMapStyle,
	};

	const blockProps = useBlockProps.save({
		className: blockClasses,
		style: mapStyles,
		...dataAttributes,
	});

	// Compute aria-label for map container
	const mapAriaLabel = dsgoAddress
		? /* translators: %s: The address being shown on the map */
			sprintf(__('Map showing %s', 'designsetgo'), dsgoAddress)
		: __('Interactive map', 'designsetgo');

	return (
		<div {...blockProps}>
			{dsgoPrivacyMode ? (
				<div className="dsgo-map__privacy-overlay">
					<div className="dsgo-map__privacy-content">
						<svg
							className="dsgo-map__privacy-icon"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
							<circle cx="12" cy="10" r="3" />
						</svg>
						<p className="dsgo-map__privacy-text">
							{dsgoPrivacyNotice ||
								__('Click to load map', 'designsetgo')}
						</p>
						<button
							className="dsgo-map__load-button"
							type="button"
							aria-label={__(
								'Load map. This will connect to external map services.',
								'designsetgo'
							)}
						>
							{__('Load Map', 'designsetgo')}
						</button>
					</div>
				</div>
			) : (
				<div
					className="dsgo-map__container"
					role="region"
					aria-label={mapAriaLabel}
				/>
			)}
		</div>
	);
}
