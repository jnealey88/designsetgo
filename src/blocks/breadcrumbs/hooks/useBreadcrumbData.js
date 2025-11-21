/**
 * Custom hook to fetch breadcrumb data from the editor
 *
 * @return {Object} Breadcrumb data including post title, type, parents, and categories
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

export function useBreadcrumbData() {
	return useSelect((select) => {
		const { getCurrentPost, getEditedPostAttribute } =
			select('core/editor') || {};
		const { getEntityRecords } = select('core') || {};

		if (!getCurrentPost || !getEditedPostAttribute) {
			return {
				postTitle: '',
				postType: 'post',
				postParents: [],
				postCategories: [],
				isEditorReady: false,
			};
		}

		const title = getEditedPostAttribute('title');
		const type = getEditedPostAttribute('type');
		const parentId = getEditedPostAttribute('parent');
		const categoryIds = getEditedPostAttribute('categories') || [];

		const parents = [];
		const categories = [];

		// Get parent pages if this is a page with a parent
		if (type === 'page' && parentId && getEntityRecords) {
			const allPages = getEntityRecords('postType', 'page', {
				per_page: -1,
			});

			if (allPages) {
				let currentParentId = parentId;
				while (currentParentId) {
					const parent = allPages.find(
						(page) => page.id === currentParentId
					);
					if (parent) {
						parents.unshift({
							title: parent.title.rendered,
							id: parent.id,
						});
						currentParentId = parent.parent;
					} else {
						break;
					}
				}
			}
		}

		// Get categories for posts
		if (type === 'post' && categoryIds.length > 0 && getEntityRecords) {
			const allCategories = getEntityRecords('taxonomy', 'category', {
				per_page: -1,
			});

			if (allCategories) {
				// Get the first category (matching frontend behavior)
				const firstCategoryId = categoryIds[0];
				const category = allCategories.find(
					(cat) => cat.id === firstCategoryId
				);
				if (category) {
					categories.push({
						title: category.name,
						id: category.id,
					});
				}
			}
		}

		return {
			postTitle: title || __('(no title)', 'designsetgo'),
			postType: type || 'post',
			postParents: parents,
			postCategories: categories,
			isEditorReady: true,
		};
	}, []);
}
