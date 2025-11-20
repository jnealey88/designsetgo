import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	RangeControl,
	CheckboxControl,
	RadioControl,
	Notice,
} from '@wordpress/components';
import { useEffect, useState, useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import classnames from 'classnames';

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		uniqueId,
		includeH2,
		includeH3,
		includeH4,
		includeH5,
		includeH6,
		displayMode,
		listStyle,
		showTitle,
		titleText,
		scrollSmooth,
		scrollOffset,
		linkColor,
		activeLinkColor,
	} = attributes;

	const [previewHeadings, setPreviewHeadings] = useState([]);

	// Generate unique ID on mount
	useEffect(() => {
		if (!uniqueId) {
			setAttributes({ uniqueId: clientId.substring(0, 8) });
		}
	}, [uniqueId, clientId, setAttributes]);

	// Subscribe to block changes in the editor
	// This triggers re-scan when blocks are added, removed, or modified
	const { blocks } = useSelect(
		(select) => ({
			blocks: select(blockEditorStore).getBlocks(),
		}),
		[]
	);

	// Scan editor for headings to show preview
	// Triggers when blocks change OR when heading level settings change
	useEffect(() => {
		const scanEditorHeadings = () => {
			try {
				const headings = [];
				const levels = [];

				if (includeH2) {
					levels.push('h2');
				}
				if (includeH3) {
					levels.push('h3');
				}
				if (includeH4) {
					levels.push('h4');
				}
				if (includeH5) {
					levels.push('h5');
				}
				if (includeH6) {
					levels.push('h6');
				}

				if (levels.length === 0) {
					setPreviewHeadings([]);
					return;
				}

				// Search in editor content
				const editorContent = document.querySelector(
					'.editor-styles-wrapper'
				);
				if (!editorContent) {
					// Editor wrapper not found yet, will retry on next update
					setPreviewHeadings([]);
					return;
				}

				// Create a single selector for all heading levels
				const selector = levels.join(', ');
				editorContent
					.querySelectorAll(selector)
					.forEach((heading, idx) => {
						// Skip if this heading is inside the current TOC block
						if (heading.closest('.dsgo-table-of-contents')) {
							return;
						}

						const text = heading.textContent?.trim();
						if (text) {
							headings.push({
								level: parseInt(
									heading.tagName.replace('H', '')
								),
								text,
								id: heading.id || `heading-${idx}`,
							});
						}
					});

				// querySelectorAll returns elements in document order
				setPreviewHeadings(headings);
			} catch (error) {
				// Gracefully handle DOM errors
				console.error(
					'[DSG TOC] Error scanning editor headings:',
					error
				);
				setPreviewHeadings([]);
			}
		};

		// Scan when blocks change or heading settings change
		scanEditorHeadings();
	}, [blocks, includeH2, includeH3, includeH4, includeH5, includeH6]);

	// Get color settings
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	// Check if at least one heading level is selected
	const hasSelectedLevels =
		includeH2 || includeH3 || includeH4 || includeH5 || includeH6;

	// Styles using CSS custom properties (only set if user has chosen colors)
	const customStyles = {};
	if (linkColor) {
		customStyles['--dsgo-toc-link-color'] = linkColor;
	}
	if (activeLinkColor) {
		customStyles['--dsgo-toc-active-link-color'] = activeLinkColor;
	}

	const blockProps = useBlockProps({
		className: classnames('dsgo-table-of-contents', {
			'dsgo-table-of-contents--hierarchical':
				displayMode === 'hierarchical',
			'dsgo-table-of-contents--flat': displayMode === 'flat',
			'dsgo-table-of-contents--ordered': listStyle === 'ordered',
			'dsgo-table-of-contents--smooth': scrollSmooth,
		}),
		style: customStyles,
	});

	// Helper function to render hierarchical structure
	// Extracted outside renderPreview for memoization
	const renderHierarchical = (headings, minLevel, ListTag) => {
		const items = [];
		let i = 0;

		while (i < headings.length) {
			const heading = headings[i];

			if (heading.level === minLevel) {
				const children = [];
				let j = i + 1;

				// Collect children
				while (j < headings.length && headings[j].level > minLevel) {
					children.push(headings[j]);
					j++;
				}

				items.push(
					<li
						key={i}
						className={`dsgo-table-of-contents__item dsgo-table-of-contents__item--level-${heading.level}`}
					>
						<a
							href={`#${heading.id}`}
							className="dsgo-table-of-contents__link"
						>
							{heading.text}
						</a>
						{children.length > 0 && (
							<ListTag className="dsgo-table-of-contents__sublist">
								{renderHierarchical(
									children,
									minLevel + 1,
									ListTag
								)}
							</ListTag>
						)}
					</li>
				);

				i = j;
			} else {
				i++;
			}
		}

		return items;
	};

	// Memoize the TOC preview content to avoid recalculating hierarchy on every render
	const tocContent = useMemo(() => {
		if (!hasSelectedLevels) {
			return (
				<Notice status="warning" isDismissible={false}>
					{__(
						'Please select at least one heading level to display.',
						'designsetgo'
					)}
				</Notice>
			);
		}

		if (previewHeadings.length === 0) {
			return (
				<Notice status="info" isDismissible={false}>
					{__(
						'No headings found. Add heading blocks to your page to see the table of contents.',
						'designsetgo'
					)}
				</Notice>
			);
		}

		const ListTag = listStyle === 'ordered' ? 'ol' : 'ul';

		if (displayMode === 'flat') {
			return (
				<ListTag className="dsgo-table-of-contents__list">
					{previewHeadings.map((heading, idx) => (
						<li key={idx} className="dsgo-table-of-contents__item">
							<a
								href={`#${heading.id}`}
								className="dsgo-table-of-contents__link"
							>
								{heading.text}
							</a>
						</li>
					))}
				</ListTag>
			);
		}

		// Hierarchical mode
		const minLevel = Math.min(...previewHeadings.map((h) => h.level));
		return (
			<ListTag className="dsgo-table-of-contents__list">
				{renderHierarchical(previewHeadings, minLevel, ListTag)}
			</ListTag>
		);
	}, [previewHeadings, displayMode, listStyle, hasSelectedLevels]);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Heading Levels', 'designsetgo')}
					initialOpen={true}
				>
					<p className="components-base-control__help">
						{__(
							'Select which heading levels to include in the table of contents.',
							'designsetgo'
						)}
					</p>
					<CheckboxControl
						label={__('Include H2', 'designsetgo')}
						checked={includeH2}
						onChange={(value) =>
							setAttributes({ includeH2: value })
						}
					/>
					<CheckboxControl
						label={__('Include H3', 'designsetgo')}
						checked={includeH3}
						onChange={(value) =>
							setAttributes({ includeH3: value })
						}
					/>
					<CheckboxControl
						label={__('Include H4', 'designsetgo')}
						checked={includeH4}
						onChange={(value) =>
							setAttributes({ includeH4: value })
						}
					/>
					<CheckboxControl
						label={__('Include H5', 'designsetgo')}
						checked={includeH5}
						onChange={(value) =>
							setAttributes({ includeH5: value })
						}
					/>
					<CheckboxControl
						label={__('Include H6', 'designsetgo')}
						checked={includeH6}
						onChange={(value) =>
							setAttributes({ includeH6: value })
						}
					/>
				</PanelBody>

				<PanelBody title={__('Display Settings', 'designsetgo')}>
					<RadioControl
						label={__('Display Mode', 'designsetgo')}
						selected={displayMode}
						options={[
							{
								label: __(
									'Hierarchical (Nested)',
									'designsetgo'
								),
								value: 'hierarchical',
							},
							{
								label: __('Flat List', 'designsetgo'),
								value: 'flat',
							},
						]}
						onChange={(value) =>
							setAttributes({ displayMode: value })
						}
					/>
					<RadioControl
						label={__('List Style', 'designsetgo')}
						selected={listStyle}
						options={[
							{
								label: __('Unordered (Bullets)', 'designsetgo'),
								value: 'unordered',
							},
							{
								label: __('Ordered (Numbers)', 'designsetgo'),
								value: 'ordered',
							},
						]}
						onChange={(value) =>
							setAttributes({ listStyle: value })
						}
					/>
				</PanelBody>

				<PanelBody title={__('Title Settings', 'designsetgo')}>
					<ToggleControl
						label={__('Show Title', 'designsetgo')}
						checked={showTitle}
						onChange={(value) =>
							setAttributes({ showTitle: value })
						}
					/>
					{showTitle && (
						<TextControl
							label={__('Title Text', 'designsetgo')}
							value={titleText}
							onChange={(value) =>
								setAttributes({ titleText: value })
							}
						/>
					)}
				</PanelBody>

				<PanelBody title={__('Scroll Settings', 'designsetgo')}>
					<ToggleControl
						label={__('Smooth Scroll', 'designsetgo')}
						help={__(
							'Enable smooth scrolling when clicking links.',
							'designsetgo'
						)}
						checked={scrollSmooth}
						onChange={(value) =>
							setAttributes({ scrollSmooth: value })
						}
					/>
					<RangeControl
						label={__('Scroll Offset (px)', 'designsetgo')}
						help={__(
							'Offset from top when scrolling to headings (useful for sticky headers).',
							'designsetgo'
						)}
						value={scrollOffset}
						onChange={(value) =>
							setAttributes({ scrollOffset: value })
						}
						min={0}
						max={200}
						step={10}
					/>
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					__experimentalIsRenderedInSidebar
					settings={[
						{
							label: __('Link Color', 'designsetgo'),
							colorValue: linkColor,
							onColorChange: (value) =>
								setAttributes({ linkColor: value || '' }),
							clearable: true,
						},
						{
							label: __('Active Link Color', 'designsetgo'),
							colorValue: activeLinkColor,
							onColorChange: (value) =>
								setAttributes({ activeLinkColor: value || '' }),
							clearable: true,
						},
					]}
					panelId={clientId}
					{...colorGradientSettings}
				/>
			</InspectorControls>

			<div {...blockProps}>
				<div className="dsgo-table-of-contents__content">
					{showTitle && (
						<div className="dsgo-table-of-contents__title">
							{titleText}
						</div>
					)}
					{tocContent}
				</div>
			</div>
		</>
	);
}
