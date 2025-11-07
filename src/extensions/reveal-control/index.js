/**
 * Reveal Control Extension
 * Adds "Reveal on Hover" functionality to container blocks
 * - Container blocks can enable reveal mode
 * - Child blocks can be marked to reveal on parent hover
 */

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const CONTAINER_BLOCKS = [
	'designsetgo/stack',
	'designsetgo/flex',
	'designsetgo/grid',
	'designsetgo/reveal',
];

/**
 * Add reveal control attributes to all blocks
 * @param settings
 */
function addRevealAttributes(settings) {
	// Add reveal toggle to container blocks
	if (CONTAINER_BLOCKS.includes(settings.name)) {
		settings.attributes = {
			...settings.attributes,
			enableRevealOnHover: {
				type: 'boolean',
				default: false,
			},
			revealAnimationType: {
				type: 'string',
				default: 'fade',
			},
		};

		// Add context provider for container blocks
		settings.providesContext = {
			...settings.providesContext,
			'designsetgo/reveal/isRevealContainer': 'enableRevealOnHover',
			'designsetgo/reveal/animationType': 'revealAnimationType',
		};
	}

	// Add reveal attribute to all blocks (for child blocks)
	settings.attributes = {
		...settings.attributes,
		dsgRevealOnHover: {
			type: 'boolean',
			default: false,
		},
	};

	// Add usesContext to all blocks so they can receive reveal container context
	if (!CONTAINER_BLOCKS.includes(settings.name)) {
		settings.usesContext = [
			...(settings.usesContext || []),
			'designsetgo/reveal/isRevealContainer',
			'designsetgo/reveal/animationType',
		];
	}

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'designsetgo/reveal-control-attributes',
	addRevealAttributes
);

/**
 * Add reveal control UI to blocks
 */
const withRevealControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, setAttributes, context = {}, name } = props;
		const { dsgRevealOnHover, enableRevealOnHover, revealAnimationType } =
			attributes;
		const isInRevealContainer =
			context['designsetgo/reveal/isRevealContainer'];
		const isContainerBlock = CONTAINER_BLOCKS.includes(name);

		return (
			<>
				<BlockEdit {...props} />
				<InspectorControls>
					{isContainerBlock && (
						<PanelBody
							title={__('Reveal on Hover', 'designsetgo')}
							initialOpen={false}
						>
							<ToggleControl
								label={__('Enable Reveal Mode', 'designsetgo')}
								help={
									enableRevealOnHover
										? __(
												'Child blocks can be set to reveal when hovering over this container.',
												'designsetgo'
											)
										: __(
												'Enable to allow child blocks to reveal on hover.',
												'designsetgo'
											)
								}
								checked={enableRevealOnHover}
								onChange={(value) =>
									setAttributes({
										enableRevealOnHover: value,
									})
								}
								__nextHasNoMarginBottom
							/>
							{enableRevealOnHover && (
								<ToggleControl
									label={__(
										'Collapse Animation',
										'designsetgo'
									)}
									help={
										revealAnimationType === 'collapse'
											? __(
													'Items collapse from height 0 with fade.',
													'designsetgo'
												)
											: __(
													'Items fade in without size change.',
													'designsetgo'
												)
									}
									checked={revealAnimationType === 'collapse'}
									onChange={(value) =>
										setAttributes({
											revealAnimationType: value
												? 'collapse'
												: 'fade',
										})
									}
									__nextHasNoMarginBottom
								/>
							)}
						</PanelBody>
					)}
					{isInRevealContainer && !isContainerBlock && (
						<PanelBody
							title={__('Reveal Settings', 'designsetgo')}
							initialOpen={false}
						>
							<ToggleControl
								label={__('Reveal on Hover', 'designsetgo')}
								help={
									dsgRevealOnHover
										? __(
												'This block will be hidden until you hover over the parent container.',
												'designsetgo'
											)
										: __(
												'This block is always visible.',
												'designsetgo'
											)
								}
								checked={dsgRevealOnHover}
								onChange={(value) =>
									setAttributes({ dsgRevealOnHover: value })
								}
								__nextHasNoMarginBottom
							/>
						</PanelBody>
					)}
				</InspectorControls>
			</>
		);
	};
}, 'withRevealControl');

addFilter(
	'editor.BlockEdit',
	'designsetgo/reveal-control-edit',
	withRevealControl
);

/**
 * Add reveal classes and data attributes to blocks
 * @param props
 * @param blockType
 * @param attributes
 */
function addRevealClasses(props, blockType, attributes) {
	const { dsgRevealOnHover, enableRevealOnHover, revealAnimationType } =
		attributes;
	const isContainerBlock = CONTAINER_BLOCKS.includes(blockType.name);

	// Add class to container blocks with reveal enabled
	if (isContainerBlock && enableRevealOnHover) {
		return {
			...props,
			className: `${props.className || ''} dsg-has-reveal`.trim(),
			'data-reveal-animation': revealAnimationType || 'fade',
		};
	}

	// Add class to child blocks marked for reveal
	if (dsgRevealOnHover) {
		return {
			...props,
			className: `${props.className || ''} dsg-reveal-item`.trim(),
		};
	}

	return props;
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'designsetgo/reveal-control-save',
	addRevealClasses
);

/**
 * Add reveal classes in editor
 */
const withRevealEditorClasses = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { attributes, context = {}, name } = props;
		const { dsgRevealOnHover, enableRevealOnHover, revealAnimationType } =
			attributes;
		const isInRevealContainer =
			context['designsetgo/reveal/isRevealContainer'];
		const isContainerBlock = CONTAINER_BLOCKS.includes(name);

		// Add class to container blocks with reveal enabled
		if (isContainerBlock && enableRevealOnHover) {
			return (
				<BlockListBlock
					{...props}
					className={`${props.className || ''} dsg-has-reveal`.trim()}
					data-reveal-animation={revealAnimationType || 'fade'}
				/>
			);
		}

		// Add class to child blocks marked for reveal
		if (isInRevealContainer && dsgRevealOnHover && !isContainerBlock) {
			return (
				<BlockListBlock
					{...props}
					className={`${props.className || ''} dsg-reveal-item`.trim()}
				/>
			);
		}

		return <BlockListBlock {...props} />;
	};
}, 'withRevealEditorClasses');

addFilter(
	'editor.BlockListBlock',
	'designsetgo/reveal-control-editor-classes',
	withRevealEditorClasses
);
