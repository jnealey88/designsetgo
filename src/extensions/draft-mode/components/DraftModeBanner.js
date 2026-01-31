/**
 * Draft Mode Bottom Banner
 *
 * Displays a banner at the bottom of the editor when editing a draft.
 *
 * @package
 * @since 1.4.0
 */

import { __ } from '@wordpress/i18n';

/**
 * Bottom banner component
 *
 * @param {Object} props        Component props.
 * @param {Object} props.status Draft status data.
 */
export default function DraftModeBanner({ status }) {
	if (!status?.is_draft) {
		return null;
	}

	return (
		<div className="dsgo-draft-mode-banner">
			<span className="dsgo-draft-mode-banner__icon">&#9998;</span>
			<span className="dsgo-draft-mode-banner__text">
				{__('You are editing a draft version.', 'designsetgo')}
				{status.original_title && (
					<>
						{' '}
						<strong>{status.original_title}</strong>
					</>
				)}
			</span>
			{status.original_view_url && (
				<a
					href={status.original_view_url}
					target="_blank"
					rel="noopener noreferrer"
					className="dsgo-draft-mode-banner__link"
					aria-label={__(
						'View live page (opens in new tab)',
						'designsetgo'
					)}
				>
					{__('View live page', 'designsetgo')}
				</a>
			)}
		</div>
	);
}
