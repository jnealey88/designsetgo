/**
 * Behavior Settings Panel Component
 *
 * @package DesignSetGo
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl } from '@wordpress/components';

export default function BehaviorSettings({ attributes, setAttributes }) {
	const { closeOnBackdrop, closeOnEsc, disableBodyScroll } = attributes;

	return (
		<PanelBody title={__('Behavior', 'designsetgo')} initialOpen={false}>
			<ToggleControl
				label={__('Close on Backdrop Click', 'designsetgo')}
				checked={closeOnBackdrop}
				onChange={(value) => setAttributes({ closeOnBackdrop: value })}
				help={__(
					'Allow closing the modal by clicking outside of it.',
					'designsetgo'
				)}
				__nextHasNoMarginBottom
			/>

			<ToggleControl
				label={__('Close on ESC Key', 'designsetgo')}
				checked={closeOnEsc}
				onChange={(value) => setAttributes({ closeOnEsc: value })}
				help={__(
					'Allow closing the modal with the Escape key.',
					'designsetgo'
				)}
				__nextHasNoMarginBottom
			/>

			<ToggleControl
				label={__('Disable Body Scroll', 'designsetgo')}
				checked={disableBodyScroll}
				onChange={(value) =>
					setAttributes({ disableBodyScroll: value })
				}
				help={__(
					'Prevent scrolling the page when modal is open.',
					'designsetgo'
				)}
				__nextHasNoMarginBottom
			/>
		</PanelBody>
	);
}
