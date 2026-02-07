/**
 * Clickable Group Extension
 *
 * Makes container blocks clickable with link functionality.
 * Editor panel is lazy-loaded to reduce initial bundle size.
 *
 * @package
 * @since 1.0.0
 */

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { lazy, Suspense } from '@wordpress/element';
import classnames from 'classnames';
import { shouldExtendBlock } from '../../utils/should-extend-block';

// Import editor styles only (frontend styles imported in src/styles/style.scss)
import './editor.scss';

// Note: frontend.js is imported in src/frontend.js for frontend-only loading

/**
 * Blocks that support clickable functionality
 */
const SUPPORTED_BLOCKS = [
	'core/group',
	'designsetgo/section',
	'designsetgo/row',
	'designsetgo/grid',
];

// Lazy-load editor panel
const ClickableGroupPanel = lazy( () =>
	import( /* webpackChunkName: "ext-clickable-group" */ './edit' )
);

/**
 * Add link attributes to container blocks
 */
function addLinkAttributes( settings, name ) {
	if ( ! shouldExtendBlock( name ) ) {
		return settings;
	}

	if ( ! SUPPORTED_BLOCKS.includes( name ) ) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			dsgoLinkUrl: { type: 'string', default: '' },
			dsgoLinkTarget: { type: 'boolean', default: false },
			dsgoLinkRel: { type: 'string', default: '' },
		},
	};
}

addFilter(
	'blocks.registerBlockType',
	'designsetgo/clickable-group-attributes',
	addLinkAttributes
);

/**
 * Add link controls to container block inspector (lazy-loaded)
 */
const withLinkControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( ! SUPPORTED_BLOCKS.includes( props.name ) ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				<Suspense fallback={ null }>
					<ClickableGroupPanel { ...props } />
				</Suspense>
			</>
		);
	};
}, 'withLinkControls' );

addFilter(
	'editor.BlockEdit',
	'designsetgo/clickable-group-controls',
	withLinkControls
);

/**
 * Add clickable class to container blocks in editor
 */
const withClickableClass = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const { name, attributes } = props;

		if ( ! SUPPORTED_BLOCKS.includes( name ) ) {
			return <BlockListBlock { ...props } />;
		}

		const hasValidUrl = attributes.dsgoLinkUrl && attributes.dsgoLinkUrl.trim().length > 0;
		const classes = classnames( { 'dsgo-clickable': hasValidUrl } );

		return <BlockListBlock { ...props } className={ classes } />;
	};
}, 'withClickableClass' );

addFilter(
	'editor.BlockListBlock',
	'designsetgo/clickable-group-class',
	withClickableClass
);

/**
 * Add link data attributes and class to container blocks on save
 */
function addLinkSaveProps( extraProps, blockType, attributes ) {
	if ( ! SUPPORTED_BLOCKS.includes( blockType.name ) ) {
		return extraProps;
	}

	const { dsgoLinkUrl, dsgoLinkTarget, dsgoLinkRel } = attributes;

	if ( ! dsgoLinkUrl || dsgoLinkUrl.trim().length === 0 ) {
		return extraProps;
	}

	const classes = classnames( extraProps.className, 'dsgo-clickable' );
	const linkProps = { 'data-link-url': dsgoLinkUrl };

	if ( dsgoLinkTarget ) {
		linkProps[ 'data-link-target' ] = '_blank';
	}
	if ( dsgoLinkRel ) {
		linkProps[ 'data-link-rel' ] = dsgoLinkRel;
	}

	return { ...extraProps, ...linkProps, className: classes };
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'designsetgo/clickable-group-save-props',
	addLinkSaveProps
);
