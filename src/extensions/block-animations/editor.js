/**
 * Block Animations - Editor Extension
 *
 * Adds animation controls and classes to blocks in the editor
 *
 * @package DesignSetGo
 * @since 1.0.0
 */

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import AnimationPanel from './components/AnimationPanel';
import AnimationToolbar from './components/AnimationToolbar';

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
			dsgAnimationEnabled,
			dsgEntranceAnimation,
			dsgExitAnimation,
		} = attributes;

		// Skip if animations not enabled or block not supported
		if (
			!dsgAnimationEnabled ||
			name.startsWith('core-embed/') ||
			name === 'core/freeform'
		) {
			return <BlockListBlock {...props} />;
		}

		// Build animation classes
		let className = props.className || '';

		if (dsgAnimationEnabled) {
			className += ' has-dsg-animation';
			if (dsgEntranceAnimation) {
				className += ` dsg-animation-${dsgEntranceAnimation}`;
			}
			if (dsgExitAnimation) {
				className += ` dsg-animation-exit-${dsgExitAnimation}`;
			}
		}

		return (
			<BlockListBlock
				{...props}
				className={className.trim()}
			/>
		);
	};
}, 'withAnimationClasses');

/**
 * Add animation data attributes to save props
 */
function addAnimationSaveProps(extraProps, blockType, attributes) {
	const {
		dsgAnimationEnabled,
		dsgEntranceAnimation,
		dsgExitAnimation,
		dsgAnimationTrigger,
		dsgAnimationDuration,
		dsgAnimationDelay,
		dsgAnimationEasing,
		dsgAnimationOffset,
		dsgAnimationOnce,
	} = attributes;

	// Skip if animations not enabled
	if (!dsgAnimationEnabled) {
		return extraProps;
	}

	// Add data attributes for frontend JavaScript
	const dataAttributes = {
		'data-dsg-animation-enabled': 'true',
		'data-dsg-entrance-animation': dsgEntranceAnimation || '',
		'data-dsg-exit-animation': dsgExitAnimation || '',
		'data-dsg-animation-trigger': dsgAnimationTrigger,
		'data-dsg-animation-duration': dsgAnimationDuration,
		'data-dsg-animation-delay': dsgAnimationDelay,
		'data-dsg-animation-easing': dsgAnimationEasing,
		'data-dsg-animation-offset': dsgAnimationOffset,
		'data-dsg-animation-once': dsgAnimationOnce ? 'true' : 'false',
	};

	// Build animation classes
	let className = extraProps.className || '';
	className += ' has-dsg-animation';

	if (dsgEntranceAnimation) {
		className += ` dsg-animation-${dsgEntranceAnimation}`;
	}
	if (dsgExitAnimation) {
		className += ` dsg-animation-exit-${dsgExitAnimation}`;
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
	withAnimationControls
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
