/**
 * SVG Patterns Extension - Editor Integration
 *
 * @package
 */

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import SvgPatternsPanel from './components/SvgPatternsPanel';
import { SUPPORTED_BLOCKS } from './constants';
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

			if (
				dsgoSvgPatternEnabled &&
				dsgoSvgPatternType &&
				PATTERNS[dsgoSvgPatternType]
			) {
				const bg = getPatternBackground(
					dsgoSvgPatternType,
					dsgoSvgPatternColor || '#9c92ac',
					dsgoSvgPatternOpacity ?? 0.4,
					dsgoSvgPatternScale ?? 1
				);

				const patternStyle = {
					...props.wrapperProps?.style,
					'--dsgo-svg-pattern-image': bg?.backgroundImage || 'none',
					'--dsgo-svg-pattern-size': bg?.backgroundSize || 'auto',
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
		dsgoSvgPatternFixed,
	} = attributes;

	if (
		!SUPPORTED_BLOCKS.includes(blockType.name) ||
		!dsgoSvgPatternEnabled ||
		!dsgoSvgPatternType ||
		!PATTERN_IDS.includes(dsgoSvgPatternType)
	) {
		return extraProps;
	}

	const bg = getPatternBackground(
		dsgoSvgPatternType,
		dsgoSvgPatternColor || '#9c92ac',
		dsgoSvgPatternOpacity ?? 0.4,
		dsgoSvgPatternScale ?? 1
	);

	if (!bg) {
		return extraProps;
	}

	const patternStyle = {
		...(extraProps.style || {}),
		'--dsgo-svg-pattern-image': bg.backgroundImage,
		'--dsgo-svg-pattern-size': bg.backgroundSize,
	};

	if (dsgoSvgPatternFixed) {
		patternStyle['--dsgo-svg-pattern-attachment'] = 'fixed';
	}

	return {
		...extraProps,
		className: [extraProps.className, 'has-dsgo-svg-pattern']
			.filter(Boolean)
			.join(' '),
		style: patternStyle,
		'data-dsgo-svg-pattern': dsgoSvgPatternType,
		'data-dsgo-svg-pattern-color': dsgoSvgPatternColor || '',
		'data-dsgo-svg-pattern-opacity': String(dsgoSvgPatternOpacity ?? 0.4),
		'data-dsgo-svg-pattern-scale': String(dsgoSvgPatternScale ?? 1),
	};
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'designsetgo/svg-pattern-save-props',
	addSvgPatternSaveProps
);
