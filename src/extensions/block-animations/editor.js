/**
 * Block Animations - Editor Extension
 *
 * Adds animation controls and classes to blocks in the editor
 *
 * @package
 * @since 1.0.0
 */

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import AnimationPanel from './components/AnimationPanel';
import AnimationToolbar from './components/AnimationToolbar';
import { DEFAULT_ANIMATION_SETTINGS } from './constants';

/**
 * Add animation controls to block edit component
 */
const withAnimationControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, setAttributes, name } = props;

		// Skip core embed blocks and other blocks that shouldn't have animations
		if (name.startsWith('core-embed/') || name === 'core/freeform') {
			return <BlockEdit {...props} />;
		}

		return (
			<>
				<AnimationToolbar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
				<BlockEdit {...props} />
				<InspectorControls>
					<AnimationPanel
						attributes={attributes}
						setAttributes={setAttributes}
					/>
				</InspectorControls>
			</>
		);
	};
}, 'withAnimationControls');

/**
 * Add animation classes to block wrapper
 */
const withAnimationClasses = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { attributes, name } = props;
		const {
			dsgoAnimationEnabled,
			dsgoEntranceAnimation,
			dsgoExitAnimation,
		} = attributes;

		// Skip if animations not enabled or block not supported
		if (
			!dsgoAnimationEnabled ||
			name.startsWith('core-embed/') ||
			name === 'core/freeform'
		) {
			return <BlockListBlock {...props} />;
		}

		// Build animation classes
		let className = props.className || '';

		if (dsgoAnimationEnabled) {
			className += ' has-dsgo-animation';
			if (dsgoEntranceAnimation) {
				className += ` dsgo-animation-${dsgoEntranceAnimation}`;
			}
			if (dsgoExitAnimation) {
				className += ` dsgo-animation-exit-${dsgoExitAnimation}`;
			}
		}

		return <BlockListBlock {...props} className={className.trim()} />;
	};
}, 'withAnimationClasses');

/**
 * Add animation data attributes to save props
 *
 * @param {Object} extraProps - Extra props to add to the block
 * @param {Object} blockType  - Block type object
 * @param {Object} attributes - Block attributes
 * @return {Object} Modified extra props with animation data attributes
 */
function addAnimationSaveProps(extraProps, blockType, attributes) {
	const {
		dsgoAnimationEnabled,
		dsgoEntranceAnimation,
		dsgoExitAnimation,
		dsgoAnimationTrigger,
		dsgoAnimationDuration,
		dsgoAnimationDelay,
		dsgoAnimationEasing,
		dsgoAnimationOffset,
		dsgoAnimationOnce,
	} = attributes;

	// Skip if animations not enabled
	if (!dsgoAnimationEnabled) {
		return extraProps;
	}

	// Always include the enabled flag and animation type(s) — these are required
	const dataAttributes = {
		'data-dsgo-animation-enabled': 'true',
	};

	if (dsgoEntranceAnimation) {
		dataAttributes['data-dsgo-entrance-animation'] = dsgoEntranceAnimation;
	}
	if (dsgoExitAnimation) {
		dataAttributes['data-dsgo-exit-animation'] = dsgoExitAnimation;
	}

	// Only output settings that differ from defaults to keep markup lean
	if (dsgoAnimationTrigger !== DEFAULT_ANIMATION_SETTINGS.trigger) {
		dataAttributes['data-dsgo-animation-trigger'] = dsgoAnimationTrigger;
	}
	if (dsgoAnimationDuration !== DEFAULT_ANIMATION_SETTINGS.duration) {
		dataAttributes['data-dsgo-animation-duration'] = dsgoAnimationDuration;
	}
	if (dsgoAnimationDelay !== DEFAULT_ANIMATION_SETTINGS.delay) {
		dataAttributes['data-dsgo-animation-delay'] = dsgoAnimationDelay;
	}
	if (dsgoAnimationEasing !== DEFAULT_ANIMATION_SETTINGS.easing) {
		dataAttributes['data-dsgo-animation-easing'] = dsgoAnimationEasing;
	}
	if (dsgoAnimationOffset !== DEFAULT_ANIMATION_SETTINGS.offset) {
		dataAttributes['data-dsgo-animation-offset'] = dsgoAnimationOffset;
	}
	if (Boolean(dsgoAnimationOnce) !== DEFAULT_ANIMATION_SETTINGS.once) {
		dataAttributes['data-dsgo-animation-once'] = dsgoAnimationOnce
			? 'true'
			: 'false';
	}

	// Build animation classes
	let className = extraProps.className || '';
	className += ' has-dsgo-animation';

	if (dsgoEntranceAnimation) {
		className += ` dsgo-animation-${dsgoEntranceAnimation}`;
	}
	if (dsgoExitAnimation) {
		className += ` dsgo-animation-exit-${dsgoExitAnimation}`;
	}

	return {
		...extraProps,
		...dataAttributes,
		className: className.trim(),
	};
}

// Register filters
addFilter(
	'editor.BlockEdit',
	'designsetgo/block-animations/with-controls',
	withAnimationControls,
	100 // After core styling - animations are effects applied to styled blocks
);

addFilter(
	'editor.BlockListBlock',
	'designsetgo/block-animations/with-classes',
	withAnimationClasses
);

addFilter(
	'blocks.getSaveContent.extraProps',
	'designsetgo/block-animations/save-props',
	addAnimationSaveProps
);
