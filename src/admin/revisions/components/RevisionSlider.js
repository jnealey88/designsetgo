/**
 * Revision Slider Component
 *
 * WordPress-style slider for selecting two revisions to compare.
 *
 * @package DesignSetGo
 */

import { __ } from '@wordpress/i18n';
import { Button, Tooltip } from '@wordpress/components';
import { useState, useRef, useEffect, useCallback } from '@wordpress/element';
import { dateI18n, getSettings } from '@wordpress/date';

/**
 * Format a revision date for display
 *
 * @param {Object} revision Revision object.
 * @return {string} Formatted date.
 */
const formatRevisionDate = (revision) => {
	const dateFormat = getSettings().formats.datetime;
	return dateI18n(dateFormat, revision.date);
};

/**
 * Format tooltip content for a revision
 *
 * @param {Object} revision Revision object.
 * @return {string} Tooltip content.
 */
const formatTooltip = (revision) => {
	const date = formatRevisionDate(revision);
	const author = revision.author?.name || __('Unknown', 'designsetgo');
	let label = `${date}\n${author}`;

	if (revision.is_current) {
		label += ` (${__('Current', 'designsetgo')})`;
	} else if (revision.is_autosave) {
		label += ` (${__('Autosave', 'designsetgo')})`;
	}

	return label;
};

/**
 * RevisionSlider Component
 *
 * @param {Object}   props              Component props.
 * @param {Array}    props.revisions    List of revisions.
 * @param {Object}   props.fromRevision Currently selected "from" revision.
 * @param {Object}   props.toRevision   Currently selected "to" revision.
 * @param {Function} props.onFromChange Callback when "from" changes.
 * @param {Function} props.onToChange   Callback when "to" changes.
 */
const RevisionSlider = ({
	revisions,
	fromRevision,
	toRevision,
	onFromChange,
	onToChange,
}) => {
	const sliderRef = useRef(null);
	const [isDragging, setIsDragging] = useState(null); // 'from' or 'to'

	// Revisions are ordered newest first, reverse for slider display (oldest left, newest right).
	const orderedRevisions = [...revisions].reverse();

	// Find indices.
	const fromIndex = fromRevision
		? orderedRevisions.findIndex((r) => r.id === fromRevision.id)
		: 0;
	const toIndex = toRevision
		? orderedRevisions.findIndex((r) => r.id === toRevision.id)
		: orderedRevisions.length - 1;

	// Handle tick click.
	const handleTickClick = (index) => {
		const revision = orderedRevisions[index];

		// If clicking between from and to, update the closer one.
		if (index < fromIndex) {
			onFromChange(revision);
		} else if (index > toIndex) {
			onToChange(revision);
		} else if (index > fromIndex && index < toIndex) {
			// Click is between - update whichever is closer.
			const distToFrom = index - fromIndex;
			const distToTo = toIndex - index;

			if (distToFrom <= distToTo) {
				onFromChange(revision);
			} else {
				onToChange(revision);
			}
		}
	};

	// Handle dragging.
	const handleMouseDown = (handle) => (e) => {
		e.preventDefault();
		setIsDragging(handle);
	};

	const handleMouseMove = useCallback(
		(e) => {
			if (!isDragging || !sliderRef.current) {
				return;
			}

			const rect = sliderRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const percent = Math.max(0, Math.min(1, x / rect.width));
			const index = Math.round(percent * (orderedRevisions.length - 1));
			const revision = orderedRevisions[index];

			if (isDragging === 'from' && index < toIndex) {
				onFromChange(revision);
			} else if (isDragging === 'to' && index > fromIndex) {
				onToChange(revision);
			}
		},
		[
			isDragging,
			orderedRevisions,
			fromIndex,
			toIndex,
			onFromChange,
			onToChange,
		]
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(null);
	}, []);

	useEffect(() => {
		if (isDragging) {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);

			return () => {
				document.removeEventListener('mousemove', handleMouseMove);
				document.removeEventListener('mouseup', handleMouseUp);
			};
		}
	}, [isDragging, handleMouseMove, handleMouseUp]);

	// Previous/Next navigation.
	const handlePrevious = () => {
		if (fromIndex > 0) {
			onFromChange(orderedRevisions[fromIndex - 1]);
			if (toIndex > fromIndex) {
				onToChange(orderedRevisions[toIndex - 1]);
			}
		}
	};

	const handleNext = () => {
		if (toIndex < orderedRevisions.length - 1) {
			onToChange(orderedRevisions[toIndex + 1]);
			if (fromIndex < toIndex) {
				onFromChange(orderedRevisions[fromIndex + 1]);
			}
		}
	};

	const canGoPrevious = fromIndex > 0;
	const canGoNext = toIndex < orderedRevisions.length - 1;

	// Calculate handle positions.
	const fromPercent =
		orderedRevisions.length > 1
			? (fromIndex / (orderedRevisions.length - 1)) * 100
			: 0;
	const toPercent =
		orderedRevisions.length > 1
			? (toIndex / (orderedRevisions.length - 1)) * 100
			: 100;

	return (
		<div className="dsgo-revision-slider">
			<div className="dsgo-revision-slider__header">
				<h3>{__('Compare Revisions', 'designsetgo')}</h3>
				<div className="dsgo-revision-slider__nav">
					<Button
						variant="secondary"
						size="small"
						onClick={handlePrevious}
						disabled={!canGoPrevious}
						aria-label={__('Previous revision', 'designsetgo')}
					>
						← {__('Previous', 'designsetgo')}
					</Button>
					<Button
						variant="secondary"
						size="small"
						onClick={handleNext}
						disabled={!canGoNext}
						aria-label={__('Next revision', 'designsetgo')}
					>
						{__('Next', 'designsetgo')} →
					</Button>
				</div>
			</div>

			<div className="dsgo-revision-slider__track-container">
				<div className="dsgo-revision-slider__track" ref={sliderRef}>
					{/* Selection range highlight */}
					<div
						className="dsgo-revision-slider__range"
						style={{
							left: `${fromPercent}%`,
							width: `${toPercent - fromPercent}%`,
						}}
					/>

					{/* Tick marks */}
					{orderedRevisions.map((revision, index) => {
						const percent =
							orderedRevisions.length > 1
								? (index / (orderedRevisions.length - 1)) * 100
								: 50;
						const isFrom = index === fromIndex;
						const isTo = index === toIndex;
						const isInRange = index >= fromIndex && index <= toIndex;

						let tickClass = 'dsgo-revision-slider__tick';

						if (isFrom || isTo) {
							tickClass += ' dsgo-revision-slider__tick--selected';
						} else if (isInRange) {
							tickClass += ' dsgo-revision-slider__tick--in-range';
						}

						if (revision.is_current) {
							tickClass += ' dsgo-revision-slider__tick--current';
						}

						return (
							<Tooltip key={revision.id} text={formatTooltip(revision)}>
								<button
									type="button"
									className={tickClass}
									style={{ left: `${percent}%` }}
									onClick={() => handleTickClick(index)}
									aria-label={formatTooltip(revision)}
								/>
							</Tooltip>
						);
					})}

					{/* From handle */}
					<div
						className="dsgo-revision-slider__handle dsgo-revision-slider__handle--from"
						style={{ left: `${fromPercent}%` }}
						onMouseDown={handleMouseDown('from')}
						role="slider"
						tabIndex={0}
						aria-label={__('From revision', 'designsetgo')}
						aria-valuenow={fromIndex}
						aria-valuemin={0}
						aria-valuemax={toIndex - 1}
					/>

					{/* To handle */}
					<div
						className="dsgo-revision-slider__handle dsgo-revision-slider__handle--to"
						style={{ left: `${toPercent}%` }}
						onMouseDown={handleMouseDown('to')}
						role="slider"
						tabIndex={0}
						aria-label={__('To revision', 'designsetgo')}
						aria-valuenow={toIndex}
						aria-valuemin={fromIndex + 1}
						aria-valuemax={orderedRevisions.length - 1}
					/>
				</div>

				{/* Labels */}
				<div className="dsgo-revision-slider__labels">
					<span className="dsgo-revision-slider__label dsgo-revision-slider__label--oldest">
						{__('Oldest', 'designsetgo')}
					</span>
					<span className="dsgo-revision-slider__label dsgo-revision-slider__label--newest">
						{__('Newest', 'designsetgo')}
					</span>
				</div>
			</div>

			{/* Selected revision info */}
			<div className="dsgo-revision-slider__info">
				<div className="dsgo-revision-slider__info-item dsgo-revision-slider__info-item--from">
					<span className="dsgo-revision-slider__info-label">
						{__('From:', 'designsetgo')}
					</span>
					<span className="dsgo-revision-slider__info-date">
						{fromRevision && formatRevisionDate(fromRevision)}
					</span>
					<span className="dsgo-revision-slider__info-author">
						{fromRevision?.author?.name}
					</span>
				</div>
				<div className="dsgo-revision-slider__info-item dsgo-revision-slider__info-item--to">
					<span className="dsgo-revision-slider__info-label">
						{__('To:', 'designsetgo')}
					</span>
					<span className="dsgo-revision-slider__info-date">
						{toRevision && formatRevisionDate(toRevision)}
						{toRevision?.is_current && (
							<span className="dsgo-revision-slider__current-badge">
								{__('Current', 'designsetgo')}
							</span>
						)}
					</span>
					<span className="dsgo-revision-slider__info-author">
						{toRevision?.author?.name}
					</span>
				</div>
			</div>
		</div>
	);
};

export default RevisionSlider;
