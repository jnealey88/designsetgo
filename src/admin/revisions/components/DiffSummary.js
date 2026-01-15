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

	const { added, removed, modified } = diffData.summary;
	const totalChanges = added + removed + modified;

	if (totalChanges === 0) {
		return (
			<div className="dsgo-diff-summary">
				<span>{__('No visual changes detected.', 'designsetgo')}</span>
			</div>
		);
	}

	return (
		<div className="dsgo-diff-summary">
			{added > 0 && (
				<div className="dsgo-diff-summary__item dsgo-diff-summary__item--added">
					<span className="dsgo-diff-summary__badge">{added}</span>
					<span>
						{added === 1
							? __('block added', 'designsetgo')
							: __('blocks added', 'designsetgo')}
					</span>
				</div>
			)}
			{removed > 0 && (
				<div className="dsgo-diff-summary__item dsgo-diff-summary__item--removed">
					<span className="dsgo-diff-summary__badge">{removed}</span>
					<span>
						{removed === 1
							? __('block removed', 'designsetgo')
							: __('blocks removed', 'designsetgo')}
					</span>
				</div>
			)}
			{modified > 0 && (
				<div className="dsgo-diff-summary__item dsgo-diff-summary__item--modified">
					<span className="dsgo-diff-summary__badge">{modified}</span>
					<span>
						{modified === 1
							? __('block modified', 'designsetgo')
							: __('blocks modified', 'designsetgo')}
					</span>
				</div>
			)}
		</div>
	);
};

export default DiffSummary;
