/**
 * Breadcrumbs Block - Registration
 *
 * Registers the Breadcrumbs block with WordPress.
 * Provides dynamic breadcrumb navigation with Schema.org markup.
 *
 * @since 1.0.0
 */

import { registerBlockType } from '@wordpress/blocks';

import edit from './edit';
import save from './save';
import metadata from './block.json';
import { ICON_COLOR } from '../shared/constants';

import './editor.scss';
import './style.scss';

/**
 * Register Breadcrumbs Block
 *
 * Display navigation breadcrumbs showing page hierarchy with
 * Schema.org markup for improved SEO and user experience.
 */
registerBlockType(metadata.name, {
    ...metadata,
    icon: {
        src: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M3 12h4l3-3 3 3h4" />
                <path d="M3 6h2l2-2 2 2h2" />
                <path d="M3 18h6l2-2 2 2h6" />
                <circle cx="8" cy="12" r="1" fill="currentColor" />
                <circle cx="16" cy="12" r="1" fill="currentColor" />
            </svg>
        ),
        foreground: ICON_COLOR,
    },
    edit,
    save,
});
