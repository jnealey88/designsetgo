/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
	TextControl,
	Spinner,
	Placeholder,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useEffect, useState } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import classnames from 'classnames';

/**
 * Taxonomy term selector component.
 *
 * @param {Object}   props          Component props.
 * @param {string}   props.taxonomy Taxonomy slug.
 * @param {number[]} props.values   Selected term IDs.
 * @param {Function} props.onChange Callback when selection changes.
 * @param {string}   props.label    Control label.
 */
function TaxonomyTermSelector({ taxonomy, values, onChange, label }) {
	const { terms, isLoading } = useSelect(
		(select) => {
			const { getEntityRecords, isResolving } = select(coreStore);
			return {
				terms:
					getEntityRecords('taxonomy', taxonomy, {
						per_page: 100,
						orderby: 'count',
						order: 'desc',
						_fields: 'id,name',
					}) || [],
				isLoading: isResolving('getEntityRecords', [
					'taxonomy',
					taxonomy,
					{ per_page: 100 },
				]),
			};
		},
		[taxonomy]
	);

	if (isLoading) {
		return null;
	}

	if (!terms.length) {
		return null;
	}

	const options = [
		{ label: __('All', 'designsetgo'), value: '' },
		...terms.map((term) => ({
			label: decodeEntities(term.name),
			value: String(term.id),
		})),
	];

	return (
		<SelectControl
			multiple
			label={label}
			value={values.map(String)}
			options={options}
			onChange={(selected) =>
				onChange(selected.filter((v) => v !== '').map((v) => Number(v)))
			}
			__next40pxDefaultSize
			__nextHasNoMarginBottom
		/>
	);
}

/**
 * Post type selector component.
 *
 * @param {Object}   props          Component props.
 * @param {string}   props.value    Selected post type slug.
 * @param {Function} props.onChange Callback when selection changes.
 */
function PostTypeSelector({ value, onChange }) {
	const postTypes = useSelect((select) => {
		const { getPostTypes } = select(coreStore);
		const types = getPostTypes({ per_page: -1 }) || [];
		return types.filter(
			(type) =>
				type.viewable &&
				type.slug !== 'attachment' &&
				type.slug !== 'wp_block' &&
				type.slug !== 'wp_navigation' &&
				type.slug !== 'wp_template' &&
				type.slug !== 'wp_template_part'
		);
	}, []);

	const options = (postTypes || []).map((type) => ({
		label: type.labels?.singular_name || type.name,
		value: type.slug,
	}));

	return (
		<SelectControl
			label={__('Post Type', 'designsetgo')}
			value={value}
			options={options}
			onChange={onChange}
			__next40pxDefaultSize
			__nextHasNoMarginBottom
		/>
	);
}

/**
 * Main edit component for the Query Slider block.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 * @param {string}   props.clientId      Block client ID.
 */
export default function QuerySliderEdit({
	attributes,
	setAttributes,
	clientId,
}) {
	const {
		query,
		showTitle,
		showExcerpt,
		showDate,
		showCategory,
		showReadMore,
		readMoreText,
		titleTag: TitleTag,
		excerptLength,
		linkTitle,
		overlayColor,
		overlayOpacity,
		contentVerticalAlign,
		contentHorizontalAlign,
		slidesPerView,
		slidesPerViewTablet,
		slidesPerViewMobile,
		height,
		useAspectRatio,
		aspectRatio,
		gap,
		showArrows,
		showDots,
		arrowStyle,
		arrowPosition,
		arrowVerticalPosition,
		arrowColor,
		arrowBackgroundColor,
		arrowSize,
		arrowPadding,
		dotStyle,
		dotPosition,
		dotColor,
		effect,
		transitionDuration,
		transitionEasing,
		autoplay,
		autoplayInterval,
		pauseOnHover,
		pauseOnInteraction,
		loop,
		draggable,
		swipeable,
		freeMode,
		centeredSlides,
		styleVariation,
	} = attributes;

	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const [activeSlide, setActiveSlide] = useState(0);

	// Force slides per view to 1 for fade/zoom effects.
	useEffect(() => {
		if ((effect === 'fade' || effect === 'zoom') && slidesPerView !== 1) {
			setAttributes({
				slidesPerView: 1,
				slidesPerViewTablet: 1,
				slidesPerViewMobile: 1,
			});
		}
	}, [effect, slidesPerView, setAttributes]);

	// Helper to update query sub-attributes.
	const updateQuery = (newValues) => {
		setAttributes({ query: { ...query, ...newValues } });
	};

	// Fetch posts from REST API based on query attributes.
	const { posts, isLoading } = useSelect(
		(select) => {
			const { getEntityRecords, isResolving } = select(coreStore);
			const queryArgs = {
				per_page: query.postsPerPage || 6,
				orderby: query.orderBy || 'date',
				order: query.order || 'desc',
				offset: query.offset || 0,
				_embed: true,
				status: 'publish',
			};

			if (query.categories?.length) {
				queryArgs.categories = query.categories;
			}
			if (query.tags?.length) {
				queryArgs.tags = query.tags;
			}

			const postType = query.postType || 'post';

			return {
				posts: getEntityRecords('postType', postType, queryArgs) || [],
				isLoading: isResolving('getEntityRecords', [
					'postType',
					postType,
					queryArgs,
				]),
			};
		},
		[query]
	);

	// Extract featured image URL from embedded data.
	const getImageUrl = (post) => {
		const media =
			post._embedded?.['wp:featuredmedia']?.[0] ||
			post._embedded?.['wp:featuredmedia']?.[0];
		if (media?.source_url) {
			return media.source_url;
		}
		return '';
	};

	// Get primary category name.
	const getCategoryName = (post) => {
		const terms = post._embedded?.['wp:term']?.[0];
		if (terms?.length) {
			return decodeEntities(terms[0].name);
		}
		return '';
	};

	// Truncate excerpt to word count.
	const truncateExcerpt = (excerpt, length) => {
		if (!excerpt) {
			return '';
		}
		const stripped = excerpt.replace(/<[^>]+>/g, '');
		const words = stripped.split(/\s+/);
		if (words.length <= length) {
			return stripped;
		}
		return words.slice(0, length).join(' ') + '...';
	};

	// Vertical alignment to CSS value.
	const verticalAlignMap = {
		top: 'flex-start',
		center: 'center',
		end: 'flex-end',
		bottom: 'flex-end',
	};

	// Horizontal alignment to CSS value.
	const horizontalAlignMap = {
		left: 'flex-start',
		start: 'flex-start',
		center: 'center',
		right: 'flex-end',
		end: 'flex-end',
	};

	// CSS custom properties matching the slider block.
	const customStyles = {
		'--dsgo-slider-height': useAspectRatio ? 'auto' : height,
		'--dsgo-slider-aspect-ratio': useAspectRatio ? aspectRatio : 'auto',
		'--dsgo-slider-gap': gap,
		'--dsgo-slider-slides-per-view': slidesPerView,
		'--dsgo-slider-slides-per-view-tablet': slidesPerViewTablet,
		'--dsgo-slider-slides-per-view-mobile': slidesPerViewMobile,
		'--dsgo-slider-arrow-color':
			arrowColor || 'var(--wp--preset--color--base, #ffffff)',
		'--dsgo-slider-arrow-bg': arrowBackgroundColor || 'rgba(0, 0, 0, 0.5)',
		'--dsgo-slider-arrow-size': arrowSize,
		'--dsgo-slider-arrow-padding': arrowPadding || '0',
		'--dsgo-slider-dot-color':
			dotColor || 'var(--wp--preset--color--base, #ffffff)',
		'--dsgo-slider-transition-duration': transitionDuration,
		'--dsgo-slider-transition-easing': transitionEasing,
	};

	const sliderClasses = classnames('dsgo-slider', {
		[`dsgo-slider--effect-${effect}`]: effect,
		'dsgo-slider--has-arrows': showArrows,
		'dsgo-slider--has-dots': showDots,
		[`dsgo-slider--arrows-${arrowStyle}`]: arrowStyle,
		[`dsgo-slider--arrows-${arrowPosition}`]: arrowPosition,
		[`dsgo-slider--arrows-v-${arrowVerticalPosition}`]:
			arrowVerticalPosition,
		[`dsgo-slider--dots-${dotStyle}`]: dotStyle,
		[`dsgo-slider--dots-${dotPosition}`]: dotPosition,
		[`dsgo-slider--style-${styleVariation}`]: styleVariation,
		'dsgo-slider--use-aspect-ratio': useAspectRatio,
		'dsgo-slider--centered': centeredSlides,
		'dsgo-slider--free-mode': freeMode,
	});

	const blockProps = useBlockProps({
		className: sliderClasses,
		style: customStyles,
	});

	// Editor slide navigation.
	const totalSlides = posts.length;
	const goToSlide = (index) => {
		if (index >= 0 && index < totalSlides) {
			setActiveSlide(index);
		}
	};

	// Slide content CSS variables.
	const slideContentStyles = {
		'--dsgo-slide-overlay-color': overlayColor,
		'--dsgo-slide-overlay-opacity': String(overlayOpacity / 100),
		'--dsgo-slide-content-justify':
			verticalAlignMap[contentVerticalAlign] || 'flex-end',
		'--dsgo-slide-content-align':
			horizontalAlignMap[contentHorizontalAlign] || 'flex-start',
	};

	return (
		<>
			<InspectorControls>
				{/* ── Query Settings ── */}
				<PanelBody
					title={__('Query Settings', 'designsetgo')}
					initialOpen={true}
				>
					<PostTypeSelector
						value={query.postType}
						onChange={(value) =>
							updateQuery({
								postType: value,
								categories: [],
								tags: [],
							})
						}
					/>

					<RangeControl
						label={__('Number of Posts', 'designsetgo')}
						value={query.postsPerPage}
						onChange={(value) =>
							updateQuery({ postsPerPage: value })
						}
						min={1}
						max={20}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Order By', 'designsetgo')}
						value={query.orderBy}
						options={[
							{
								label: __('Date', 'designsetgo'),
								value: 'date',
							},
							{
								label: __('Title', 'designsetgo'),
								value: 'title',
							},
							{
								label: __('Modified', 'designsetgo'),
								value: 'modified',
							},
							{
								label: __('Menu Order', 'designsetgo'),
								value: 'menu_order',
							},
						]}
						onChange={(value) => updateQuery({ orderBy: value })}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Order', 'designsetgo')}
						value={query.order}
						options={[
							{
								label: __('Newest First', 'designsetgo'),
								value: 'desc',
							},
							{
								label: __('Oldest First', 'designsetgo'),
								value: 'asc',
							},
						]}
						onChange={(value) => updateQuery({ order: value })}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					{query.postType === 'post' && (
						<>
							<TaxonomyTermSelector
								taxonomy="category"
								values={query.categories || []}
								onChange={(values) =>
									updateQuery({ categories: values })
								}
								label={__(
									'Filter by Categories',
									'designsetgo'
								)}
							/>
							<TaxonomyTermSelector
								taxonomy="post_tag"
								values={query.tags || []}
								onChange={(values) =>
									updateQuery({ tags: values })
								}
								label={__('Filter by Tags', 'designsetgo')}
							/>
						</>
					)}

					<RangeControl
						label={__('Offset', 'designsetgo')}
						value={query.offset}
						onChange={(value) => updateQuery({ offset: value })}
						min={0}
						max={20}
						help={__(
							'Skip this many posts from the beginning',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Exclude Current Post', 'designsetgo')}
						checked={query.excludeCurrent}
						onChange={(value) =>
							updateQuery({ excludeCurrent: value })
						}
						help={__(
							'Prevent the current post from appearing in the slider',
							'designsetgo'
						)}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				{/* ── Slide Content ── */}
				<PanelBody
					title={__('Slide Content', 'designsetgo')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Show Title', 'designsetgo')}
						checked={showTitle}
						onChange={(value) =>
							setAttributes({ showTitle: value })
						}
						__nextHasNoMarginBottom
					/>
					{showTitle && (
						<>
							<SelectControl
								label={__('Title Tag', 'designsetgo')}
								value={TitleTag}
								options={[
									{ label: 'H2', value: 'h2' },
									{ label: 'H3', value: 'h3' },
									{ label: 'H4', value: 'h4' },
								]}
								onChange={(value) =>
									setAttributes({ titleTag: value })
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={__('Link Title to Post', 'designsetgo')}
								checked={linkTitle}
								onChange={(value) =>
									setAttributes({ linkTitle: value })
								}
								__nextHasNoMarginBottom
							/>
						</>
					)}

					<ToggleControl
						label={__('Show Excerpt', 'designsetgo')}
						checked={showExcerpt}
						onChange={(value) =>
							setAttributes({ showExcerpt: value })
						}
						__nextHasNoMarginBottom
					/>
					{showExcerpt && (
						<RangeControl
							label={__('Excerpt Length (words)', 'designsetgo')}
							value={excerptLength}
							onChange={(value) =>
								setAttributes({ excerptLength: value })
							}
							min={5}
							max={55}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					)}

					<ToggleControl
						label={__('Show Date', 'designsetgo')}
						checked={showDate}
						onChange={(value) => setAttributes({ showDate: value })}
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Show Category', 'designsetgo')}
						checked={showCategory}
						onChange={(value) =>
							setAttributes({ showCategory: value })
						}
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Show Read More', 'designsetgo')}
						checked={showReadMore}
						onChange={(value) =>
							setAttributes({ showReadMore: value })
						}
						__nextHasNoMarginBottom
					/>
					{showReadMore && (
						<TextControl
							label={__('Read More Text', 'designsetgo')}
							value={readMoreText}
							onChange={(value) =>
								setAttributes({ readMoreText: value })
							}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					)}

					<SelectControl
						label={__('Content Vertical Position', 'designsetgo')}
						value={contentVerticalAlign}
						options={[
							{
								label: __('Top', 'designsetgo'),
								value: 'top',
							},
							{
								label: __('Center', 'designsetgo'),
								value: 'center',
							},
							{
								label: __('Bottom', 'designsetgo'),
								value: 'end',
							},
						]}
						onChange={(value) =>
							setAttributes({ contentVerticalAlign: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Content Horizontal Position', 'designsetgo')}
						value={contentHorizontalAlign}
						options={[
							{
								label: __('Left', 'designsetgo'),
								value: 'start',
							},
							{
								label: __('Center', 'designsetgo'),
								value: 'center',
							},
							{
								label: __('Right', 'designsetgo'),
								value: 'end',
							},
						]}
						onChange={(value) =>
							setAttributes({
								contentHorizontalAlign: value,
							})
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				{/* ── Layout Settings ── */}
				<PanelBody
					title={__('Layout Settings', 'designsetgo')}
					initialOpen={false}
				>
					{effect !== 'fade' && effect !== 'zoom' && (
						<>
							<RangeControl
								label={__(
									'Slides Per View (Desktop)',
									'designsetgo'
								)}
								value={slidesPerView}
								onChange={(value) =>
									setAttributes({ slidesPerView: value })
								}
								min={1}
								max={6}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
							<RangeControl
								label={__(
									'Slides Per View (Tablet)',
									'designsetgo'
								)}
								value={slidesPerViewTablet}
								onChange={(value) =>
									setAttributes({
										slidesPerViewTablet: value,
									})
								}
								min={1}
								max={4}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
							<RangeControl
								label={__(
									'Slides Per View (Mobile)',
									'designsetgo'
								)}
								value={slidesPerViewMobile}
								onChange={(value) =>
									setAttributes({
										slidesPerViewMobile: value,
									})
								}
								min={1}
								max={3}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</>
					)}

					<ToggleControl
						label={__('Use Aspect Ratio', 'designsetgo')}
						checked={useAspectRatio}
						onChange={(value) =>
							setAttributes({ useAspectRatio: value })
						}
						help={
							useAspectRatio
								? __(
										'Height is determined by aspect ratio',
										'designsetgo'
									)
								: __('Fixed height is used', 'designsetgo')
						}
						__nextHasNoMarginBottom
					/>
					{useAspectRatio ? (
						<SelectControl
							label={__('Aspect Ratio', 'designsetgo')}
							value={aspectRatio}
							options={[
								{ label: '16:9', value: '16/9' },
								{ label: '4:3', value: '4/3' },
								{ label: '3:2', value: '3/2' },
								{ label: '21:9', value: '21/9' },
								{ label: '1:1', value: '1/1' },
							]}
							onChange={(value) =>
								setAttributes({ aspectRatio: value })
							}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					) : (
						<UnitControl
							label={__('Height', 'designsetgo')}
							value={height}
							onChange={(value) =>
								setAttributes({
									height: value || '500px',
								})
							}
							units={[
								{
									value: 'px',
									label: 'px',
									default: 500,
								},
								{
									value: 'vh',
									label: 'vh',
									default: 50,
								},
								{
									value: 'rem',
									label: 'rem',
									default: 30,
								},
							]}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					)}

					<UnitControl
						label={__('Gap Between Slides', 'designsetgo')}
						value={gap}
						onChange={(value) =>
							setAttributes({ gap: value || '20px' })
						}
						units={[
							{ value: 'px', label: 'px', default: 20 },
							{ value: 'rem', label: 'rem', default: 1.25 },
						]}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Style Variation', 'designsetgo')}
						value={styleVariation}
						options={[
							{
								label: __('Classic', 'designsetgo'),
								value: 'classic',
							},
							{
								label: __('Minimal', 'designsetgo'),
								value: 'minimal',
							},
							{
								label: __('Card', 'designsetgo'),
								value: 'card',
							},
							{
								label: __('Fullbleed', 'designsetgo'),
								value: 'fullbleed',
							},
						]}
						onChange={(value) =>
							setAttributes({ styleVariation: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				{/* ── Navigation Settings ── */}
				<PanelBody
					title={__('Navigation', 'designsetgo')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Show Arrows', 'designsetgo')}
						checked={showArrows}
						onChange={(value) =>
							setAttributes({ showArrows: value })
						}
						__nextHasNoMarginBottom
					/>
					{showArrows && (
						<>
							<SelectControl
								label={__('Arrow Style', 'designsetgo')}
								value={arrowStyle}
								options={[
									{
										label: __('Default', 'designsetgo'),
										value: 'default',
									},
									{
										label: __('Circle', 'designsetgo'),
										value: 'circle',
									},
									{
										label: __('Square', 'designsetgo'),
										value: 'square',
									},
									{
										label: __('Minimal', 'designsetgo'),
										value: 'minimal',
									},
								]}
								onChange={(value) =>
									setAttributes({ arrowStyle: value })
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
							<SelectControl
								label={__('Arrow Position', 'designsetgo')}
								value={arrowPosition}
								options={[
									{
										label: __('Sides', 'designsetgo'),
										value: 'sides',
									},
									{
										label: __('Inside', 'designsetgo'),
										value: 'inside',
									},
									{
										label: __('Outside', 'designsetgo'),
										value: 'outside',
									},
								]}
								onChange={(value) =>
									setAttributes({
										arrowPosition: value,
									})
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</>
					)}

					<ToggleControl
						label={__('Show Dots', 'designsetgo')}
						checked={showDots}
						onChange={(value) => setAttributes({ showDots: value })}
						__nextHasNoMarginBottom
					/>
					{showDots && (
						<SelectControl
							label={__('Dot Style', 'designsetgo')}
							value={dotStyle}
							options={[
								{
									label: __('Default', 'designsetgo'),
									value: 'default',
								},
								{
									label: __('Lines', 'designsetgo'),
									value: 'lines',
								},
								{
									label: __('Squares', 'designsetgo'),
									value: 'squares',
								},
							]}
							onChange={(value) =>
								setAttributes({ dotStyle: value })
							}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					)}
				</PanelBody>

				{/* ── Transition Settings ── */}
				<PanelBody
					title={__('Transition', 'designsetgo')}
					initialOpen={false}
				>
					<SelectControl
						label={__('Effect', 'designsetgo')}
						value={effect}
						options={[
							{
								label: __('Slide', 'designsetgo'),
								value: 'slide',
							},
							{
								label: __('Fade', 'designsetgo'),
								value: 'fade',
							},
							{
								label: __('Zoom', 'designsetgo'),
								value: 'zoom',
							},
						]}
						onChange={(value) => setAttributes({ effect: value })}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<UnitControl
						label={__('Transition Duration', 'designsetgo')}
						value={transitionDuration}
						onChange={(value) =>
							setAttributes({
								transitionDuration: value || '0.5s',
							})
						}
						units={[
							{ value: 's', label: 's', default: 0.5 },
							{ value: 'ms', label: 'ms', default: 500 },
						]}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				{/* ── Autoplay Settings ── */}
				<PanelBody
					title={__('Autoplay', 'designsetgo')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Enable Autoplay', 'designsetgo')}
						checked={autoplay}
						onChange={(value) => setAttributes({ autoplay: value })}
						__nextHasNoMarginBottom
					/>
					{autoplay && (
						<>
							<RangeControl
								label={__('Interval (ms)', 'designsetgo')}
								value={autoplayInterval}
								onChange={(value) =>
									setAttributes({
										autoplayInterval: value,
									})
								}
								min={1000}
								max={10000}
								step={500}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={__('Pause on Hover', 'designsetgo')}
								checked={pauseOnHover}
								onChange={(value) =>
									setAttributes({
										pauseOnHover: value,
									})
								}
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={__(
									'Pause on Interaction',
									'designsetgo'
								)}
								checked={pauseOnInteraction}
								onChange={(value) =>
									setAttributes({
										pauseOnInteraction: value,
									})
								}
								__nextHasNoMarginBottom
							/>
						</>
					)}
				</PanelBody>

				{/* ── Behavior Settings ── */}
				<PanelBody
					title={__('Behavior', 'designsetgo')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Loop', 'designsetgo')}
						checked={loop}
						onChange={(value) => setAttributes({ loop: value })}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Swipeable', 'designsetgo')}
						checked={swipeable}
						onChange={(value) =>
							setAttributes({ swipeable: value })
						}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Draggable', 'designsetgo')}
						checked={draggable}
						onChange={(value) =>
							setAttributes({ draggable: value })
						}
						__nextHasNoMarginBottom
					/>
					{effect === 'slide' && (
						<>
							<ToggleControl
								label={__('Free Mode', 'designsetgo')}
								checked={freeMode}
								onChange={(value) =>
									setAttributes({ freeMode: value })
								}
								help={__(
									'Allow free scrolling without snapping',
									'designsetgo'
								)}
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={__('Centered Slides', 'designsetgo')}
								checked={centeredSlides}
								onChange={(value) =>
									setAttributes({
										centeredSlides: value,
									})
								}
								__nextHasNoMarginBottom
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>

			{/* ── Color Controls ── */}
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					panelId={clientId}
					settings={[
						{
							label: __('Slide Overlay', 'designsetgo'),
							colorValue: overlayColor,
							onColorChange: (color) =>
								setAttributes({
									overlayColor: color || '',
								}),
							clearable: true,
						},
						{
							label: __('Arrow Color', 'designsetgo'),
							colorValue: arrowColor,
							onColorChange: (color) =>
								setAttributes({
									arrowColor: color || '',
								}),
							clearable: true,
						},
						{
							label: __('Arrow Background', 'designsetgo'),
							colorValue: arrowBackgroundColor,
							onColorChange: (color) =>
								setAttributes({
									arrowBackgroundColor: color || '',
								}),
							clearable: true,
						},
						{
							label: __('Dot Color', 'designsetgo'),
							colorValue: dotColor,
							onColorChange: (color) =>
								setAttributes({
									dotColor: color || '',
								}),
							clearable: true,
						},
					]}
					{...colorGradientSettings}
				/>
			</InspectorControls>

			{/* ── Block Output ── */}
			<div {...blockProps}>
				<div className="dsgo-slider__viewport">
					<div
						className="dsgo-slider__track"
						style={{
							transform: `translateX(-${activeSlide * (100 / slidesPerView)}%)`,
						}}
					>
						{isLoading && (
							<div className="dsgo-query-slider__loading">
								<Spinner />
								<span>
									{__('Loading posts…', 'designsetgo')}
								</span>
							</div>
						)}

						{!isLoading && posts.length === 0 && (
							<Placeholder
								label={__('Post Slider', 'designsetgo')}
								instructions={__(
									'No posts found. Adjust your query settings in the sidebar.',
									'designsetgo'
								)}
							/>
						)}

						{!isLoading &&
							posts.map((post) => {
								const imageUrl = getImageUrl(post);
								const categoryName = getCategoryName(post);
								const excerptText = truncateExcerpt(
									post.excerpt?.rendered || '',
									excerptLength
								);

								const slideClasses = classnames('dsgo-slide', {
									[`dsgo-slide--style-${styleVariation}`]:
										styleVariation,
									'dsgo-slide--has-background': !!imageUrl,
								});

								const slideStyles = {
									...slideContentStyles,
									...(imageUrl && {
										backgroundImage: `url(${imageUrl})`,
										backgroundSize: 'cover',
										backgroundPosition: 'center center',
									}),
								};

								return (
									<div
										key={post.id}
										className={slideClasses}
										style={slideStyles}
										role="group"
										aria-roledescription="slide"
									>
										{overlayColor && (
											<div className="dsgo-slide__overlay" />
										)}
										<div className="dsgo-slide__content">
											{showCategory && categoryName && (
												<span className="dsgo-query-slide__category">
													{categoryName}
												</span>
											)}
											{showDate && (
												<time className="dsgo-query-slide__date">
													{new Date(
														post.date
													).toLocaleDateString()}
												</time>
											)}
											{showTitle && (
												<TitleTag className="dsgo-query-slide__title">
													{decodeEntities(
														post.title?.rendered ||
															''
													)}
												</TitleTag>
											)}
											{showExcerpt && excerptText && (
												<p className="dsgo-query-slide__excerpt">
													{excerptText}
												</p>
											)}
											{showReadMore && (
												<span className="dsgo-query-slide__read-more">
													{readMoreText}
												</span>
											)}
										</div>
									</div>
								);
							})}
					</div>
				</div>

				{/* Editor-only navigation */}
				{totalSlides > 1 && !isLoading && (
					<>
						{showArrows && (
							<>
								<button
									className="dsgo-slider__arrow dsgo-slider__arrow--prev dsgo-slider__arrow--editor-only"
									onClick={() => goToSlide(activeSlide - 1)}
									disabled={activeSlide === 0}
									aria-label={__(
										'Previous slide',
										'designsetgo'
									)}
								>
									&#8249;
								</button>
								<button
									className="dsgo-slider__arrow dsgo-slider__arrow--next dsgo-slider__arrow--editor-only"
									onClick={() => goToSlide(activeSlide + 1)}
									disabled={activeSlide === totalSlides - 1}
									aria-label={__('Next slide', 'designsetgo')}
								>
									&#8250;
								</button>
							</>
						)}
						{showDots && (
							<div className="dsgo-slider__dots dsgo-slider__dots--editor-only">
								{posts.map((_, index) => (
									<button
										key={index}
										className={classnames(
											'dsgo-slider__dot',
											{
												'dsgo-slider__dot--active':
													index === activeSlide,
											}
										)}
										onClick={() => goToSlide(index)}
										aria-label={`${__(
											'Go to slide',
											'designsetgo'
										)} ${index + 1}`}
									/>
								))}
							</div>
						)}
					</>
				)}
			</div>
		</>
	);
}
