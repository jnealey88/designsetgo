/**
 * Product Categories Grid Block - Edit Component
 *
 * @since 2.1.0
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Placeholder } from '@wordpress/components';

export default function ProductCategoriesGridEdit() {
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<Placeholder
				icon="category"
				label={__('Product Categories Grid', 'designsetgo')}
				instructions={__(
					'Display your WooCommerce product categories in a visual grid.',
					'designsetgo'
				)}
			/>
		</div>
	);
}
