/**
 * Overlay Header Panel
 *
 * Adds a sidebar panel to posts/pages for enabling overlay header.
 *
 * @package
 * @since 2.1.0
 */

import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { ToggleControl, Notice } from '@wordpress/components';

/**
 * Overlay Header Panel Component
 */
const OverlayHeaderPanel = () => {
	const postType = useSelect(
		(select) => select('core/editor').getCurrentPostType(),
		[]
	);

	const [meta, setMeta] = useEntityProp('postType', postType, 'meta');

	const overlayEnabled = meta?.dsgo_overlay_header || false;
	const skipTopBarEnabled = meta?.dsgo_overlay_skip_top_bar || false;

	const updateOverlay = (value) => {
		setMeta({ ...meta, dsgo_overlay_header: value });
	};

	const updateSkipTopBar = (value) => {
		setMeta({ ...meta, dsgo_overlay_skip_top_bar: value });
	};

	// Only show for content post types.
	if (!postType || postType === 'attachment') {
		return null;
	}

	return (
		<PluginDocumentSettingPanel
			name="dsgo-overlay-header"
			title={__('Header Display', 'designsetgo')}
			className="dsgo-overlay-header-panel"
		>
			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Overlay Header', 'designsetgo')}
				help={__(
					'Makes the header transparent and positions it over the page content. Best used with hero sections that have a background image or color.',
					'designsetgo'
				)}
				checked={overlayEnabled}
				onChange={updateOverlay}
			/>
			{overlayEnabled && (
				<>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Skip Top Bar', 'designsetgo')}
						help={__(
							'Only overlay the main header row. If your header has a top bar, the hero content will begin below it.',
							'designsetgo'
						)}
						checked={skipTopBarEnabled}
						onChange={updateSkipTopBar}
					/>
					<Notice status="info" isDismissible={false}>
						{__(
							'Preview this page on the frontend to see the overlay effect.',
							'designsetgo'
						)}
					</Notice>
				</>
			)}
		</PluginDocumentSettingPanel>
	);
};

registerPlugin('dsgo-overlay-header', {
	render: OverlayHeaderPanel,
});
