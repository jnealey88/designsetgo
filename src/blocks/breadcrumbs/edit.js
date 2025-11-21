/**
 * Breadcrumbs Block - Edit Component
 *
 * Shows a preview of breadcrumbs in the editor based on current page context.
 */
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
    __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { Notice } from '@wordpress/components';
import classnames from 'classnames';
import { useMemo } from '@wordpress/element';
import {
    DisplaySettingsPanel,
} from './components/InspectorPanels';

/**
 * Get separator character based on attributes
 */
function getSeparatorChar(separator) {
    const separators = {
        slash: '/',
        chevron: '›',
        greater: '>',
        bullet: '•',
        'arrow-right': '→',
    };
    return separators[separator] || '/';
}

export default function Edit({ attributes, setAttributes, clientId }) {
    const {
        showHome,
        homeText,
        separator,
        showCurrent,
        linkCurrent,
        prefixText,
        hideOnHome,
    } = attributes;

    // Get color settings for ColorGradientSettingsDropdown
    const colorGradientSettings = useMultipleOriginColorsAndGradients();

    // Get current post/page data from editor
    const { postTitle, postType, postParents, postCategories, isEditorReady } = useSelect(
        (select) => {
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

            const currentPost = getCurrentPost();
            const title = getEditedPostAttribute('title');
            const type = getEditedPostAttribute('type');
            const parentId = getEditedPostAttribute('parent');
            const categoryIds = getEditedPostAttribute('categories') || [];

            let parents = [];
            let categories = [];

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
        },
        []
    );

    // Build preview breadcrumb trail
    const previewTrail = useMemo(() => {
        const trail = [];

        // Add home link (always a link)
        if (showHome) {
            trail.push({
                title: homeText,
                isCurrent: false,
            });
        }

        // Add parent pages for pages (always links)
        if (postType === 'page' && postParents.length > 0) {
            postParents.forEach((parent) => {
                trail.push({
                    title: parent.title,
                    isCurrent: false,
                });
            });
        }

        // Add categories for posts (always links)
        if (postType === 'post' && postCategories.length > 0) {
            postCategories.forEach((category) => {
                trail.push({
                    title: category.title,
                    isCurrent: false,
                });
            });
        }

        // Add current page (link only if linkCurrent is true)
        if (showCurrent && postTitle) {
            trail.push({
                title: postTitle,
                isCurrent: true,
                linked: linkCurrent,
            });
        }

        return trail;
    }, [
        showHome,
        homeText,
        showCurrent,
        linkCurrent,
        postTitle,
        postType,
        postParents,
        postCategories,
    ]);

    const separatorChar = getSeparatorChar(separator);

    const blockProps = useBlockProps({
        className: 'dsgo-breadcrumbs',
    });

    return (
        <>
            <InspectorControls>
                <DisplaySettingsPanel
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
            </InspectorControls>

            <InspectorControls group="color">
                <ColorGradientSettingsDropdown
                    __experimentalIsRenderedInSidebar
                    settings={[
                        {
                            label: __('Link', 'designsetgo'),
                            colorValue: attributes.style?.elements?.link?.color
                                ?.text,
                            onColorChange: (newColor) => {
                                setAttributes({
                                    style: {
                                        ...attributes.style,
                                        elements: {
                                            ...attributes.style?.elements,
                                            link: {
                                                ...attributes.style?.elements
                                                    ?.link,
                                                color: {
                                                    text: newColor,
                                                },
                                            },
                                        },
                                    },
                                });
                            },
                        },
                        {
                            label: __('Link Hover', 'designsetgo'),
                            colorValue: attributes.style?.elements?.link?.[
                                ':hover'
                            ]?.color?.text,
                            onColorChange: (newColor) => {
                                setAttributes({
                                    style: {
                                        ...attributes.style,
                                        elements: {
                                            ...attributes.style?.elements,
                                            link: {
                                                ...attributes.style?.elements
                                                    ?.link,
                                                ':hover': {
                                                    color: {
                                                        text: newColor,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                });
                            },
                        },
                    ]}
                    panelId={clientId}
                    {...colorGradientSettings}
                />
            </InspectorControls>

            <nav {...blockProps}>
                {!isEditorReady ? (
                    <Notice status="info" isDismissible={false}>
                        {__('Loading breadcrumbs preview…', 'designsetgo')}
                    </Notice>
                ) : previewTrail.length === 0 ? (
                    <Notice status="warning" isDismissible={false}>
                        {__(
                            'No breadcrumbs to display. Enable "Show home link" or "Show current page" in the block settings.',
                            'designsetgo'
                        )}
                    </Notice>
                ) : (
                    <>
                        {prefixText && (
                            <span className="dsgo-breadcrumbs__prefix">
                                {prefixText}
                            </span>
                        )}

                        <ol className="dsgo-breadcrumbs__list">
                            {previewTrail.map((item, index) => (
                                <>
                                    <li
                                        key={index}
                                        className={classnames(
                                            'dsgo-breadcrumbs__item',
                                            {
                                                'dsgo-breadcrumbs__item--current':
                                                    item.isCurrent,
                                            }
                                        )}
                                    >
                                        {!item.isCurrent || item.linked ? (
                                            <a
                                                href="#"
                                                className="dsgo-breadcrumbs__link"
                                                onClick={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                {item.title}
                                            </a>
                                        ) : (
                                            <span className="dsgo-breadcrumbs__text">
                                                {item.title}
                                            </span>
                                        )}
                                    </li>

                                    {index < previewTrail.length - 1 && (
                                        <li
                                            key={`sep-${index}`}
                                            className="dsgo-breadcrumbs__separator"
                                            aria-hidden="true"
                                        >
                                            {separatorChar}
                                        </li>
                                    )}
                                </>
                            ))}
                        </ol>
                    </>
                )}
            </nav>
        </>
    );
}
