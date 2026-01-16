/**
 * Revision Slider Component
 *
 * Slider for selecting which revision to compare against current state.
 * The "after" (current state) is always locked to the newest revision.
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
 * @param {Array}    props.revisions    List of revisions (newest first).
 * @param {Object}   props.fromRevision Currently selected "from" revision.
 * @param {Object}   props.toRevision   Current state revision (always newest).
 * @param {Function} props.onFromChange Callback when "from" changes.
 */
const RevisionSlider = ({ revisions, fromRevision, toRevision, onFromChange }) => {
	const sliderRef = useRef(null);
	const [isDragging, setIsDragging] = useState(false);

	// Revisions are ordered newest first, reverse for slider display (oldest left, newest right).
	const orderedRevisions = [...revisions].reverse();
	const maxIndex = orderedRevisions.length - 1;

	// Find the selected revision index.
	const fromIndex = fromRevision
		? orderedRevisions.findIndex((r) => r.id === fromRevision.id)
		: 0;

	// Handle tick click - can select any revision except the newest (current state).
	const handleTickClick = (index) => {
		// Don't allow selecting the newest revision as "from"
		if (index >= maxIndex) {
			return;
		}
		onFromChange(orderedRevisions[index]);
	};

	// Handle dragging.
	const handleMouseDown = (e) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleMouseMove = useCallback(
		(e) => {
			if (!isDragging || !sliderRef.current) {
				return;
			}

			const rect = sliderRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const percent = Math.max(0, Math.min(1, x / rect.width));
			const index = Math.round(percent * maxIndex);

			// Don't allow selecting the newest revision as "from"
			if (index < maxIndex) {
				onFromChange(orderedRevisions[index]);
			}
		},
		[isDragging, orderedRevisions, maxIndex, onFromChange]
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
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

	// Previous/Next navigation - only moves the "from" revision.
	const handlePrevious = () => {
		if (fromIndex > 0) {
			onFromChange(orderedRevisions[fromIndex - 1]);
		}
	};

	const handleNext = () => {
		// Can move up to but not including the newest
		if (fromIndex < maxIndex - 1) {
			onFromChange(orderedRevisions[fromIndex + 1]);
		}
	};

	const canGoPrevious = fromIndex > 0;
	const canGoNext = fromIndex < maxIndex - 1;

	// Calculate handle position.
	const fromPercent =
		orderedRevisions.length > 1 ? (fromIndex / maxIndex) * 100 : 0;

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
					{/* Selection range highlight - from selected to newest */}
					<div
						className="dsgo-revision-slider__range"
						style={{
							left: `${fromPercent}%`,
							width: `${100 - fromPercent}%`,
						}}
					/>

					{/* Tick marks */}
					{orderedRevisions.map((revision, index) => {
						const percent =
							orderedRevisions.length > 1
								? (index / maxIndex) * 100
								: 50;
						const isSelected = index === fromIndex;
						const isCurrent = index === maxIndex;
						const isInRange = index >= fromIndex;

						let tickClass = 'dsgo-revision-slider__tick';

						if (isSelected || isCurrent) {
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
									disabled={isCurrent}
								/>
							</Tooltip>
						);
					})}

					{/* Single draggable handle for "from" revision */}
					<div
						className="dsgo-revision-slider__handle dsgo-revision-slider__handle--from"
						style={{ left: `${fromPercent}%` }}
						onMouseDown={handleMouseDown}
						role="slider"
						tabIndex={0}
						aria-label={__('Select revision', 'designsetgo')}
						aria-valuenow={fromIndex}
						aria-valuemin={0}
						aria-valuemax={maxIndex - 1}
					/>
				</div>

				{/* Labels */}
				<div className="dsgo-revision-slider__labels">
					<span className="dsgo-revision-slider__label dsgo-revision-slider__label--oldest">
						{__('Oldest', 'designsetgo')}
					</span>
					<span className="dsgo-revision-slider__label dsgo-revision-slider__label--newest">
						{__('Current', 'designsetgo')}
					</span>
				</div>
			</div>

			{/* Selected revision info */}
			<div className="dsgo-revision-slider__info">
				<div className="dsgo-revision-slider__info-item dsgo-revision-slider__info-item--from">
					<span className="dsgo-revision-slider__info-label">
						{__('Comparing:', 'designsetgo')}
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
						<span className="dsgo-revision-slider__current-badge">
							{__('Current', 'designsetgo')}
						</span>
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
