/**
 * Category Picker Component
 *
 * Searchable category selector using the WooCommerce Store API.
 *
 * @since 2.1.0
 */

import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import { ComboboxControl, Spinner } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

/**
 * Category Picker Component
 *
 * @param {Object}   props            Component props
 * @param {Function} props.onSelect   Callback when a category is selected; receives (categoryId, categoryData)
 * @param {Array}    props.excludeIds Array of category IDs to exclude from results
 * @param {string}   props.className  Optional additional class name
 * @return {JSX.Element} Category picker
 */
export default function CategoryPicker({
	onSelect,
	excludeIds = [],
	className,
}) {
	const [searchValue, setSearchValue] = useState('');
	const [options, setOptions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const debounceTimer = useRef(null);
	const abortControllerRef = useRef(null);
	const categoriesRef = useRef([]);

	// Fetch categories when search value changes (debounced).
	useEffect(() => {
		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current);
		}

		if (!searchValue || searchValue.length < 2) {
			setOptions([]);
			return;
		}

		debounceTimer.current = setTimeout(() => {
			// Cancel any in-flight request.
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
			abortControllerRef.current = new AbortController();

			setIsLoading(true);
			apiFetch({
				path: `/wc/store/v1/products/categories?search=${encodeURIComponent(searchValue)}&per_page=20`,
				signal: abortControllerRef.current.signal,
			})
				.then((categories) => {
					categoriesRef.current = categories;
					setOptions(
						categories
							.filter((cat) => !excludeIds.includes(cat.id))
							.map((cat) => ({
								value: cat.id,
								label: cat.name,
							}))
					);
				})
				.catch((err) => {
					if (err.name !== 'AbortError') {
						setOptions([]);
					}
				})
				.finally(() => {
					setIsLoading(false);
				});
		}, 300);

		return () => {
			if (debounceTimer.current) {
				clearTimeout(debounceTimer.current);
			}
		};
	}, [searchValue, excludeIds]);

	return (
		<div className={className}>
			<ComboboxControl
				label={__('Search for a category', 'designsetgo')}
				value={null}
				options={options}
				onChange={(categoryId) => {
					if (categoryId) {
						const categoryData = categoriesRef.current.find(
							(c) => c.id === categoryId
						);
						onSelect(categoryId, categoryData || null);
					}
				}}
				onFilterValueChange={setSearchValue}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
			{isLoading && <Spinner />}
		</div>
	);
}
