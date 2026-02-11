/**
 * SVG Patterns Extension - Editor Integration
 *
 * @package
 */

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment, useMemo } from '@wordpress/element';
import SvgPatternsPanel from './components/SvgPatternsPanel';
import { SUPPORTED_BLOCKS, DEFAULTS } from './constants';
import { getPatternBackground, PATTERNS, PATTERN_IDS } from './patterns';

/**
 * Add SVG pattern controls to the block editor
 */
const withSvgPatternControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { name } = props;

		if (!SUPPORTED_BLOCKS.includes(name)) {
			return <BlockEdit {...props} />;
		}

		return (
			<Fragment>
				<BlockEdit {...props} />
				<SvgPatternsPanel {...props} />
			</Fragment>
		);
	};
}, 'withSvgPatternControls');

addFilter(
	'editor.BlockEdit',
	'designsetgo/svg-pattern-controls',
	withSvgPatternControls
);

/**
 * Add SVG pattern preview styles to block wrapper in editor
 */
const addSvgPatternEditorStyles = createHigherOrderComponent(
	(BlockListBlock) => {
		return (props) => {
			const { attributes, name } = props;

			if (!SUPPORTED_BLOCKS.includes(name)) {
				return <BlockListBlock {...props} />;
			}

			const {
				dsgoSvgPatternEnabled,
				dsgoSvgPatternType,
				dsgoSvgPatternColor,
				dsgoSvgPatternOpacity,
				dsgoSvgPatternScale,
				dsgoSvgPatternFixed,
			} = attributes;

			const isActive =
				dsgoSvgPatternEnabled &&
				dsgoSvgPatternType &&
				PATTERNS[dsgoSvgPatternType];

			// Memoize SVG generation to avoid re-encoding on every render
			const bg = useMemo(() => {
				if (!isActive) {
					return null;
				}
				return getPatternBackground(
					dsgoSvgPatternType,
					dsgoSvgPatternColor || DEFAULTS.color,
					dsgoSvgPatternOpacity ?? DEFAULTS.opacity,
					dsgoSvgPatternScale ?? DEFAULTS.scale
				);
			}, [
				isActive,
				dsgoSvgPatternType,
				dsgoSvgPatternColor,
				dsgoSvgPatternOpacity,
				dsgoSvgPatternScale,
			]);

			if (isActive && bg) {
				const patternStyle = {
					...props.wrapperProps?.style,
					'--dsgo-svg-pattern-image': bg.backgroundImage,
					'--dsgo-svg-pattern-size': bg.backgroundSize,
				};

				if (dsgoSvgPatternFixed) {
					patternStyle['--dsgo-svg-pattern-attachment'] = 'fixed';
				}

				// Use wrapperProps for both style and class — passing className
				// as a separate prop is silently dropped when wrapperProps is present.
				const wrapperProps = {
					...props.wrapperProps,
					className: [
						props.wrapperProps?.className,
						'has-dsgo-svg-pattern',
					]
						.filter(Boolean)
						.join(' '),
					style: patternStyle,
				};

				return (
					<BlockListBlock {...props} wrapperProps={wrapperProps} />
				);
			}

			return <BlockListBlock {...props} />;
		};
	},
	'addSvgPatternEditorStyles'
);

addFilter(
	'editor.BlockListBlock',
	'designsetgo/svg-pattern-editor-styles',
	addSvgPatternEditorStyles
);

/**
 * Add SVG pattern attributes to save props
 *
 * @param {Object} extraProps Block save props
 * @param {Object} blockType  Block type
 * @param {Object} attributes Block attributes
 * @return {Object} Modified props
 */
function addSvgPatternSaveProps(extraProps, blockType, attributes) {
	const {
		dsgoSvgPatternEnabled,
		dsgoSvgPatternType,
		dsgoSvgPatternColor,
		dsgoSvgPatternOpacity,
		dsgoSvgPatternScale,
	} = attributes;

	if (
		!SUPPORTED_BLOCKS.includes(blockType.name) ||
		!dsgoSvgPatternEnabled ||
		!dsgoSvgPatternType ||
		!PATTERN_IDS.includes(dsgoSvgPatternType)
	) {
		return extraProps;
	}

	const safeOpacity =
		typeof dsgoSvgPatternOpacity === 'number'
			? dsgoSvgPatternOpacity
			: DEFAULTS.opacity;
	const safeScale =
		typeof dsgoSvgPatternScale === 'number'
			? dsgoSvgPatternScale
			: DEFAULTS.scale;

	// Only save data attributes and class — the server-side renderer
	// (SVG_Pattern_Renderer) generates the SVG data URI at render time
	// from these attributes, keeping post_content lean.
	return {
		...extraProps,
		className: [extraProps.className, 'has-dsgo-svg-pattern']
			.filter(Boolean)
			.join(' '),
		style: extraProps.style || {},
		'data-dsgo-svg-pattern': dsgoSvgPatternType,
		'data-dsgo-svg-pattern-color': dsgoSvgPatternColor || '',
		'data-dsgo-svg-pattern-opacity': String(safeOpacity),
		'data-dsgo-svg-pattern-scale': String(safeScale),
	};
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'designsetgo/svg-pattern-save-props',
	addSvgPatternSaveProps
);

/**
 * Strip legacy inline SVG pattern CSS variables from saved content.
 *
 * Older versions saved the full SVG data URI in --dsgo-svg-pattern-image
 * and --dsgo-svg-pattern-size inline styles. The server-side renderer now
 * generates these at render time, so they are no longer saved. This filter
 * normalizes old content during block validation so the editor doesn't
 * show "Block contains unexpected content" errors.
 *
 * @param {string} content   Serialized block HTML.
 * @param {Object} blockType Block type definition.
 * @return {string} Cleaned content.
 */
function stripLegacySvgPatternStyles(content, blockType) {
	if (
		!SUPPORTED_BLOCKS.includes(blockType.name) ||
		typeof content !== 'string' ||
		!content.includes('--dsgo-svg-pattern-image')
	) {
		return content;
	}

	// Remove --dsgo-svg-pattern-image:url("data:image/svg+xml,...");
	// The url() value may contain encoded parens, so match up to the closing ");
	content = content.replace(
		/--dsgo-svg-pattern-image:url\(&quot;[^&]*&quot;\);?/g,
		''
	);

	// Remove --dsgo-svg-pattern-size:<value>;
	content = content.replace(/--dsgo-svg-pattern-size:[^;"]+;?/g, '');

	// Remove --dsgo-svg-pattern-attachment:fixed;
	content = content.replace(/--dsgo-svg-pattern-attachment:fixed;?/g, '');

	// Clean up dangling semicolons and empty style attributes.
	content = content.replace(/style=";\s*/g, 'style="');
	content = content.replace(/style="\s*"/g, '');

	return content;
}

addFilter(
	'blocks.getSaveContent',
	'designsetgo/svg-pattern-strip-legacy',
	stripLegacySvgPatternStyles
);
