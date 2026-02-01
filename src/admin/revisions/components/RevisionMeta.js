/**
 * Revision Meta Component
 *
 * Displays author and date information for a revision.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { dateI18n, getSettings } from '@wordpress/date';

/**
 * RevisionMeta Component
 *
 * @param {Object} props          Component props.
 * @param {Object} props.revision Revision object.
 */
const RevisionMeta = ({ revision }) => {
	if (!revision) {
		return null;
	}

	const dateFormat = getSettings().formats.datetime;
	const formattedDate = dateI18n(dateFormat, revision.date);
	const authorName = revision.author?.name || __('Unknown', 'designsetgo');
	const avatarUrl = revision.author?.avatar;

	return (
		<div className="dsgo-revision-meta">
			{avatarUrl && (
				<img
					className="dsgo-revision-meta__avatar"
					src={avatarUrl}
					alt={authorName}
				/>
			)}
			<div className="dsgo-revision-meta__info">
				<span className="dsgo-revision-meta__author">{authorName}</span>
				<span className="dsgo-revision-meta__date">
					{formattedDate}
				</span>
			</div>
		</div>
	);
};

export default RevisionMeta;
