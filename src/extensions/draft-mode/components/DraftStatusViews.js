/**
 * Draft Mode Status Views
 *
 * Different view states for the Draft Mode panel based on draft status.
 *
 * @package
 * @since 1.4.0
 */

import { __ } from '@wordpress/i18n';
import { Notice, Button, ExternalLink } from '@wordpress/components';

/**
 * View when editing a draft of a published page
 *
 * @param {Object}   props           Component props.
 * @param {Object}   props.status    Draft status data.
 * @param {Function} props.onPublish Callback to publish draft.
 * @param {Function} props.onDiscard Callback to discard draft.
 * @param {boolean}  props.isLoading Whether an action is loading.
 */
export function IsDraftView({ status, onPublish, onDiscard, isLoading }) {
	return (
		<div className="dsgo-draft-mode-panel__content dsgo-draft-mode-panel__content--is-draft">
			<Notice
				status="warning"
				isDismissible={false}
				className="dsgo-draft-mode-panel__notice"
			>
				{__('You are editing a draft version.', 'designsetgo')}
			</Notice>

			<p className="dsgo-draft-mode-panel__description">
				{__(
					"Changes here won't affect the live page until you publish them.",
					'designsetgo'
				)}
			</p>

			{status.original_view_url && (
				<p className="dsgo-draft-mode-panel__link">
					<ExternalLink href={status.original_view_url}>
						{__('View live page', 'designsetgo')}
					</ExternalLink>
				</p>
			)}

			{/* Action buttons */}
			<div className="dsgo-draft-mode-panel__actions">
				<Button
					variant="primary"
					onClick={onPublish}
					disabled={isLoading}
					isBusy={isLoading}
				>
					{__('Publish Changes', 'designsetgo')}
				</Button>

				<Button
					variant="secondary"
					isDestructive
					onClick={onDiscard}
					disabled={isLoading}
				>
					{__('Discard Draft', 'designsetgo')}
				</Button>
			</div>
		</div>
	);
}

/**
 * View when published page has a pending draft
 *
 * @param {Object} props        Component props.
 * @param {Object} props.status Draft status data.
 */
export function HasDraftView({ status }) {
	return (
		<div className="dsgo-draft-mode-panel__content dsgo-draft-mode-panel__content--has-draft">
			<Notice
				status="info"
				isDismissible={false}
				className="dsgo-draft-mode-panel__notice"
			>
				{__('A draft version exists for this page.', 'designsetgo')}
			</Notice>

			<p className="dsgo-draft-mode-panel__description">
				{__(
					'Edit the draft to make changes without affecting the live page.',
					'designsetgo'
				)}
			</p>

			{status.draft_created && (
				<p className="dsgo-draft-mode-panel__meta">
					{__('Created:', 'designsetgo')} {status.draft_created}
				</p>
			)}

			{status.draft_edit_url && (
				<div className="dsgo-draft-mode-panel__actions">
					<Button variant="primary" href={status.draft_edit_url}>
						{__('Edit Draft', 'designsetgo')}
					</Button>
				</div>
			)}
		</div>
	);
}

/**
 * View when published page can create a draft
 *
 * @param {Object}   props          Component props.
 * @param {Function} props.onCreate Callback to create draft.
 */
export function CanCreateDraftView({ onCreate }) {
	return (
		<div className="dsgo-draft-mode-panel__content dsgo-draft-mode-panel__content--can-create">
			<p className="dsgo-draft-mode-panel__description">
				{__(
					'Create a draft to make changes without affecting the live page.',
					'designsetgo'
				)}
			</p>

			<div className="dsgo-draft-mode-panel__actions">
				<Button variant="primary" onClick={onCreate}>
					{__('Create Draft', 'designsetgo')}
				</Button>
			</div>
		</div>
	);
}

/**
 * View when draft mode is not available (not a published page)
 */
export function UnavailableView() {
	return (
		<div className="dsgo-draft-mode-panel__content dsgo-draft-mode-panel__content--unavailable">
			<p className="dsgo-draft-mode-panel__description dsgo-draft-mode-panel__description--muted">
				{__(
					'Draft mode is only available for published pages.',
					'designsetgo'
				)}
			</p>
		</div>
	);
}
