/**
 * Diff Summary Component
 *
 * Displays a summary of changes between revisions.
 *
 * @package DesignSetGo
 */

import { __ } from '@wordpress/i18n';

/**
 * DiffSummary Component
 *
 * @param {Object} props          Component props.
 * @param {Object} props.diffData Diff data from API.
 */
const DiffSummary = ({ diffData }) => {
	if (!diffData?.summary) {
		return null;
	}

	const { total } = diffData.summary;

	if (total === 0) {
		return (
			<div className="dsgo-diff-summary">
				<span>{__('No visual changes detected.', 'designsetgo')}</span>
			</div>
		);
	}

	return (
		<div className="dsgo-diff-summary">
			<div className="dsgo-diff-summary__item">
				<span className="dsgo-diff-summary__badge">{total}</span>
				<span>
					{total === 1
						? __('block changed', 'designsetgo')
						: __('blocks changed', 'designsetgo')}
				</span>
			</div>
		</div>
	);
};

export default DiffSummary;
