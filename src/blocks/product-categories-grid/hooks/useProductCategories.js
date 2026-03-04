/**
 * useProductCategories Hook
 *
 * Fetches and manages WooCommerce product categories from the Store API.
 * Handles both "all" and "manual" source modes, including caching,
 * filtered/derived lists, and the category selection handler.
 *
 * @since 2.1.0
 */

import { useState, useEffect, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

/**
 * @param {Object}   attributes    Block attributes
 * @param {Function} setAttributes Function to update block attributes
 * @return {Object} Category data, state, and handlers
 */
export default function useProductCategories(attributes, setAttributes) {
	const { excludeCategories, showEmpty } = attributes;

	const [categories, setCategories] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [categoryDataCache, setCategoryDataCache] = useState({});

	// Fetch top-level product categories from the WC Store API on mount.
	// Limited to 100 (Store API maximum) — stores with >100 top-level
	// categories will see a truncated list in the editor.
	useEffect(() => {
		setIsLoading(true);
		setError(null);

		apiFetch({
			path: '/wc/store/v1/products/categories?per_page=100&parent=0',
		})
			.then((data) => {
				setCategories(data);
				const cache = {};
				data.forEach((cat) => {
					cache[cat.id] = cat;
				});
				setCategoryDataCache((prev) => ({ ...prev, ...cache }));
			})
			.catch(() => {
				setError(
					__(
						'Could not load categories. Please ensure WooCommerce is active.',
						'designsetgo'
					)
				);
			})
			.finally(() => setIsLoading(false));
	}, []);

	// Fetch missing category data for manual mode (e.g., after page reload).
	useEffect(() => {
		if (
			attributes.categorySource !== 'manual' ||
			!attributes.selectedCategories.length
		) {
			return;
		}

		const missingIds = attributes.selectedCategories
			.map((sc) => sc.id)
			.filter((id) => !categoryDataCache[id]);

		if (!missingIds.length) {
			return;
		}

		Promise.all(
			missingIds.map((id) =>
				apiFetch({
					path: `/wc/store/v1/products/categories/${id}`,
				}).catch(() => null)
			)
		).then((results) => {
			const newCache = {};
			results.forEach((cat) => {
				if (cat) {
					newCache[cat.id] = cat;
				}
			});
			if (Object.keys(newCache).length) {
				setCategoryDataCache((prev) => ({
					...prev,
					...newCache,
				}));
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps -- Intentionally excludes categoryDataCache to avoid infinite refetch loop.
	}, [attributes.categorySource, attributes.selectedCategories]);

	// Filter categories for "all" source mode.
	const filteredCategories = categories.filter((category) => {
		if (excludeCategories.includes(category.id)) {
			return false;
		}
		if (!showEmpty && category.count <= 0) {
			return false;
		}
		return true;
	});

	// Memoize excludeIds for CategoryPicker to prevent reference instability.
	const excludeIds = useMemo(
		() => attributes.selectedCategories.map((sc) => sc.id),
		[attributes.selectedCategories]
	);

	// Build manual categories list for preview.
	const manualCategories = attributes.selectedCategories
		.map((sc) => categoryDataCache[sc.id])
		.filter(Boolean);

	const manualFeaturedIds = attributes.selectedCategories
		.filter((sc) => sc.featured)
		.map((sc) => sc.id);

	// Build category names map for CategoryList.
	const categoryNames = {};
	attributes.selectedCategories.forEach((sc) => {
		if (categoryDataCache[sc.id]) {
			categoryNames[sc.id] = categoryDataCache[sc.id].name;
		}
	});

	// Handler for when a category is selected via CategoryPicker.
	const handleCategorySelect = (categoryId, categoryData) => {
		const newSelected = [
			...attributes.selectedCategories,
			{ id: categoryId, featured: false },
		];
		setAttributes({ selectedCategories: newSelected });

		if (categoryData) {
			setCategoryDataCache((prev) => ({
				...prev,
				[categoryId]: categoryData,
			}));
		}
	};

	return {
		categories,
		isLoading,
		error,
		filteredCategories,
		excludeIds,
		manualCategories,
		manualFeaturedIds,
		categoryNames,
		handleCategorySelect,
	};
}
