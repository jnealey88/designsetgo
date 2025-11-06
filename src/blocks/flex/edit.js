/**
 * Flex Container Block - Edit Component
 *
 * Flexible horizontal or vertical layouts with wrapping.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	useSetting,
	PanelColorSettings,
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { PanelBody, ToggleControl, SelectControl } from '@wordpress/components';
import { useRef } from '@wordpress/element';

/**
 * Flex Container Edit Component
 *
 * @param {Object}   props               Component props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to update attributes
 * @param {string}   props.clientId      Block client ID
 * @return {JSX.Element} Edit component
 */
export default function FlexEdit({ attributes, setAttributes, clientId }) {
	const {
		direction,
		wrap,
		justifyContent,
		alignItems,
		mobileStack,
		constrainWidth,
		contentWidth,
		hoverBackgroundColor,
		hoverTextColor,
		hoverIconBackgroundColor,
		hoverButtonBackgroundColor,
	} = attributes;

	// Get content size from theme
	const themeContentWidth = useSetting('layout.contentSize');

	// Calculate effective content width
	const effectiveContentWidth = contentWidth || themeContentWidth || '1200px';

	// Reference to inner container div (where the empty space actually is)
	const innerRef = useRef(null);

	// Get dispatch function to select this block
	const { selectBlock } = useDispatch('core/block-editor');

	/**
	 * Handle clicks on the container to enable selection when clicking empty space
	 * This allows clicks between flex items to select the container
	 */
	const handleContainerClick = (event) => {
		// Only handle clicks directly on the inner container (empty space between blocks)
		// Don't handle clicks on child blocks themselves
		if (event.target === innerRef.current || event.target.classList.contains('dsg-flex__inner')) {
			event.stopPropagation();
			selectBlock(clientId);
		}
	};

	// Calculate inner styles declaratively
	// Note: gap is handled by WordPress blockGap support via style.spacing.blockGap
	const innerStyles = {
		display: 'flex',
		flexDirection: direction || 'row',
		flexWrap: wrap ? 'wrap' : 'nowrap',
		justifyContent: justifyContent || 'flex-start',
		alignItems: alignItems || 'center',
		...(constrainWidth && {
			maxWidth: effectiveContentWidth,
			marginLeft: 'auto',
			marginRight: 'auto',
		}),
	};

	// Block wrapper props
	// CRITICAL: Set width: 100% AND align-self: stretch on outer wrapper
	// align-self: stretch ensures nested containers fill parent width even when parent has alignItems: flex-start
	const blockProps = useBlockProps({
		className: `dsg-flex ${mobileStack ? 'dsg-flex--mobile-stack' : ''}`,
		style: {
			width: '100%',
			alignSelf: 'stretch',
			...(hoverBackgroundColor && {
				'--dsg-hover-bg-color': hoverBackgroundColor,
			}),
			...(hoverTextColor && {
				'--dsg-hover-text-color': hoverTextColor,
			}),
			...(hoverIconBackgroundColor && {
				'--dsg-parent-hover-icon-bg': hoverIconBackgroundColor,
			}),
			...(hoverButtonBackgroundColor && {
				'--dsg-hover-button-bg-color': hoverButtonBackgroundColor,
			}),
		},
	});

	// Inner blocks props with declarative styles
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsg-flex__inner',
			style: innerStyles,
			ref: innerRef,
			onClick: handleContainerClick,
		},
		{
			orientation: direction === 'column' ? 'vertical' : 'horizontal',
			templateLock: false,
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Flex Settings', 'designsetgo')}
					initialOpen={true}
				>
					<SelectControl
						label={__('Direction', 'designsetgo')}
						value={direction}
						options={[
							{
								label: __('Row (Horizontal)', 'designsetgo'),
								value: 'row',
							},
							{
								label: __('Column (Vertical)', 'designsetgo'),
								value: 'column',
							},
						]}
						onChange={(value) =>
							setAttributes({ direction: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Wrap Items', 'designsetgo')}
						checked={wrap}
						onChange={(value) => setAttributes({ wrap: value })}
						help={
							wrap
								? __(
										'Items will wrap to next line if needed',
										'designsetgo'
									)
								: __(
										'Items will stay in single line',
										'designsetgo'
									)
						}
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Justify Content', 'designsetgo')}
						value={justifyContent}
						options={[
							{
								label: __('Start', 'designsetgo'),
								value: 'flex-start',
							},
							{
								label: __('Center', 'designsetgo'),
								value: 'center',
							},
							{
								label: __('End', 'designsetgo'),
								value: 'flex-end',
							},
							{
								label: __('Space Between', 'designsetgo'),
								value: 'space-between',
							},
							{
								label: __('Space Around', 'designsetgo'),
								value: 'space-around',
							},
							{
								label: __('Space Evenly', 'designsetgo'),
								value: 'space-evenly',
							},
						]}
						onChange={(value) =>
							setAttributes({ justifyContent: value })
						}
						help={__(
							'Horizontal alignment (main axis)',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Align Items', 'designsetgo')}
						value={alignItems}
						options={[
							{
								label: __('Start', 'designsetgo'),
								value: 'flex-start',
							},
							{
								label: __('Center', 'designsetgo'),
								value: 'center',
							},
							{
								label: __('End', 'designsetgo'),
								value: 'flex-end',
							},
							{
								label: __('Stretch', 'designsetgo'),
								value: 'stretch',
							},
							{
								label: __('Baseline', 'designsetgo'),
								value: 'baseline',
							},
						]}
						onChange={(value) =>
							setAttributes({ alignItems: value })
						}
						help={__(
							'Vertical alignment (cross axis)',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Stack on Mobile', 'designsetgo')}
						checked={mobileStack}
						onChange={(value) =>
							setAttributes({ mobileStack: value })
						}
						help={
							mobileStack
								? __(
										'Items will stack vertically on mobile devices',
										'designsetgo'
									)
								: __(
										'Items maintain flex layout on all devices',
										'designsetgo'
									)
						}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelColorSettings
					title={__('Hover Settings', 'designsetgo')}
					initialOpen={false}
					colorSettings={[
						{
							value: hoverBackgroundColor,
							onChange: (color) =>
								setAttributes({ hoverBackgroundColor: color }),
							label: __('Hover Background Color', 'designsetgo'),
							clearable: true,
						},
						{
							value: hoverTextColor,
							onChange: (color) =>
								setAttributes({ hoverTextColor: color }),
							label: __('Hover Text Color', 'designsetgo'),
							clearable: true,
						},
						// Only show icon background control if hover background is set
						...(hoverBackgroundColor
							? [
									{
										value: hoverIconBackgroundColor,
										onChange: (color) =>
											setAttributes({
												hoverIconBackgroundColor: color,
											}),
										label: __(
											'Hover Icon Background Color',
											'designsetgo'
										),
										clearable: true,
									},
								]
							: []),
						// Only show button background control if hover background is set
						...(hoverBackgroundColor
							? [
									{
										value: hoverButtonBackgroundColor,
										onChange: (color) =>
											setAttributes({
												hoverButtonBackgroundColor: color,
											}),
										label: __(
											'Hover Button Background Color',
											'designsetgo'
										),
										clearable: true,
									},
								]
							: []),
					]}
				/>
			</InspectorControls>

			<div {...blockProps}>
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}
