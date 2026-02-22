/**
 * Product Picker Component
 *
 * Searchable product selector using the WooCommerce Store API.
 *
 * @since 2.1.0
 */

import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import { ComboboxControl, Spinner } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

/**
 * Product Picker Component
 *
 * @param {Object}   props              Component props
 * @param {Function} props.onSelect     Callback when a product is selected
 * @param {string}   props.className    Optional additional class name
 * @return {JSX.Element} Product picker
 */
export default function ProductPicker({ onSelect, className }) {
	const [searchValue, setSearchValue] = useState('');
	const [options, setOptions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const debounceTimer = useRef(null);

	// Fetch products when search value changes (debounced).
	useEffect(() => {
		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current);
		}

		if (!searchValue || searchValue.length < 2) {
			setOptions([]);
			return;
		}

		debounceTimer.current = setTimeout(() => {
			setIsLoading(true);
			apiFetch({
				path: `/wc/store/v1/products?search=${encodeURIComponent(searchValue)}&per_page=10`,
			})
				.then((products) => {
					setOptions(
						products.map((product) => ({
							value: product.id,
							label: product.name,
						}))
					);
				})
				.catch(() => {
					setOptions([]);
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
	}, [searchValue]);

	return (
		<div className={className}>
			<ComboboxControl
				label={__('Search for a product', 'designsetgo')}
				value={null}
				options={options}
				onChange={(productId) => {
					if (productId) {
						onSelect(productId);
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
