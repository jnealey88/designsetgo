/**
 * Product Categories Grid Block - Edit Component
 *
 * Displays WooCommerce product categories in a responsive visual grid.
 * Fetches categories from the WC Store API and provides controls for
 * filtering, layout, and display options.
 *
 * @since 2.1.0
 */

import { __, sprintf } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Placeholder,
	Spinner,
	Notice,
	ToggleControl,
	RangeControl,
	ButtonGroup,
	Button,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';

import GridPreview from './components/GridPreview';
import CategoryPicker from './components/CategoryPicker';
import CategoryList from './components/CategoryList';
import useProductCategories from './hooks/useProductCategories';

/**
 * Image aspect ratio options for the Layout panel.
 *
 * @type {Array<{label: string, value: string}>}
 */
const ASPECT_RATIO_OPTIONS = [
	{ label: '1:1', value: '1/1' },
	{ label: '3:4', value: '3/4' },
	{ label: '4:3', value: '4/3' },
	{ label: '16:9', value: '16/9' },
];

/**
 * Product Categories Grid Edit Component
 *
 * @param {Object}   props               Component props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to update block attributes
 * @return {JSX.Element} Edit component
 */
export default function ProductCategoriesGridEdit({
	attributes,
	setAttributes,
}) {
	const {
		categorySource,
		columns,
		showProductCount,
		showEmpty,
		imageAspectRatio,
	} = attributes;

	const {
		isLoading,
		error,
		filteredCategories,
		excludeIds,
		manualCategories,
		manualFeaturedIds,
		categoryNames,
		handleCategorySelect,
	} = useProductCategories(attributes, setAttributes);

	const blockProps = useBlockProps({
		className: 'dsgo-product-categories-grid-wrapper',
	});

	return (
		<>
			{/* ── Toolbar ──────────────────────────────────────────────── */}
			<BlockControls>
				<ToolbarGroup>
					{[2, 3, 4, 5].map((count) => (
						<ToolbarButton
							key={count}
							label={sprintf(
								/* translators: %d: number of columns */
								__('%d Columns', 'designsetgo'),
								count
							)}
							isActive={columns === count}
							onClick={() => setAttributes({ columns: count })}
						>
							{count}
						</ToolbarButton>
					))}
				</ToolbarGroup>
			</BlockControls>

			{/* ── Sidebar ───────────────────────────────────────────────── */}
			<InspectorControls>
				{/* Categories panel */}
				<PanelBody
					title={__('Categories', 'designsetgo')}
					initialOpen={true}
				>
					<ButtonGroup>
						<Button
							isPressed={categorySource === 'all'}
							onClick={() =>
								setAttributes({ categorySource: 'all' })
							}
							__next40pxDefaultSize
						>
							{__('All Categories', 'designsetgo')}
						</Button>
						<Button
							isPressed={categorySource === 'manual'}
							onClick={() =>
								setAttributes({ categorySource: 'manual' })
							}
							__next40pxDefaultSize
						>
							{__('Manual', 'designsetgo')}
						</Button>
					</ButtonGroup>

					{categorySource === 'all' && (
						<ToggleControl
							label={__('Show Empty Categories', 'designsetgo')}
							checked={showEmpty}
							onChange={(value) =>
								setAttributes({ showEmpty: value })
							}
							__nextHasNoMarginBottom
						/>
					)}

					{categorySource === 'manual' && (
						<>
							<CategoryPicker
								onSelect={handleCategorySelect}
								excludeIds={excludeIds}
							/>
							<CategoryList
								selectedCategories={
									attributes.selectedCategories
								}
								categoryNames={categoryNames}
								onChange={(newList) =>
									setAttributes({
										selectedCategories: newList,
									})
								}
							/>
						</>
					)}
				</PanelBody>

				{/* Display panel */}
				<PanelBody
					title={__('Display', 'designsetgo')}
					initialOpen={true}
				>
					<ToggleControl
						label={__('Show Product Count', 'designsetgo')}
						checked={showProductCount}
						onChange={(value) =>
							setAttributes({ showProductCount: value })
						}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				{/* Layout panel */}
				<PanelBody
					title={__('Layout', 'designsetgo')}
					initialOpen={false}
				>
					<RangeControl
						label={__('Columns', 'designsetgo')}
						value={columns}
						onChange={(value) => setAttributes({ columns: value })}
						min={2}
						max={5}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<p
						className="dsgo-product-categories-grid__aspect-ratio-label"
						id="dsgo-pcg-aspect-ratio-label"
					>
						{__('Image Aspect Ratio', 'designsetgo')}
					</p>
					<ButtonGroup aria-labelledby="dsgo-pcg-aspect-ratio-label">
						{ASPECT_RATIO_OPTIONS.map((option) => (
							<Button
								key={option.value}
								isPressed={imageAspectRatio === option.value}
								onClick={() =>
									setAttributes({
										imageAspectRatio: option.value,
									})
								}
								__next40pxDefaultSize
							>
								{option.label}
							</Button>
						))}
					</ButtonGroup>
				</PanelBody>
			</InspectorControls>

			{/* ── Canvas ────────────────────────────────────────────────── */}
			<div {...blockProps}>
				{isLoading && (
					<Placeholder
						icon="category"
						label={__('Product Categories Grid', 'designsetgo')}
					>
						<Spinner />
					</Placeholder>
				)}

				{!isLoading && error && (
					<Placeholder
						icon="category"
						label={__('Product Categories Grid', 'designsetgo')}
					>
						<Notice status="error" isDismissible={false}>
							{error}
						</Notice>
					</Placeholder>
				)}

				{!isLoading &&
					!error &&
					categorySource === 'manual' &&
					manualCategories.length > 0 && (
						<GridPreview
							categories={manualCategories}
							attributes={attributes}
							featuredIds={manualFeaturedIds}
						/>
					)}

				{!isLoading &&
					!error &&
					categorySource === 'manual' &&
					manualCategories.length === 0 && (
						<Placeholder
							icon="category"
							label={__('Product Categories Grid', 'designsetgo')}
							instructions={__(
								'Search and select categories in the sidebar to build your grid.',
								'designsetgo'
							)}
						/>
					)}

				{!isLoading &&
					!error &&
					categorySource === 'all' &&
					filteredCategories.length === 0 && (
						<Placeholder
							icon="category"
							label={__('Product Categories Grid', 'designsetgo')}
							instructions={__(
								'No categories found. Add product categories in WooCommerce, or enable "Show Empty Categories" above.',
								'designsetgo'
							)}
						/>
					)}

				{!isLoading &&
					!error &&
					categorySource === 'all' &&
					filteredCategories.length > 0 && (
						<GridPreview
							categories={filteredCategories}
							attributes={attributes}
							featuredIds={[]}
						/>
					)}
			</div>
		</>
	);
}
