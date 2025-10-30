/**
 * Container Block - Flex Panel Component
 *
 * Provides controls for flex layout justification and item alignment.
 * Also handles width controls for nested containers inside flex parents.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

/**
 * Flex Panel - Controls for flex layout justification, alignment, wrapping, and nested container width.
 *
 * @param {Object}   props                - Component props
 * @param {string}   props.layoutType     - Current layout type ('stack', 'grid', 'flex')
 * @param {string}   props.flexJustify    - Flex justification value (horizontal)
 * @param {string}   props.flexAlign      - Flex alignment value (vertical)
 * @param {string}   props.flexWrap       - Flex wrap value ('wrap' or 'nowrap')
 * @param {boolean}  props.flexMobileStack - Whether to stack items on mobile
 * @param {string}   props.flexItemWidth  - Width for nested containers in flex parent
 * @param {boolean}  props.hasParentFlex  - Whether parent is a flex horizontal container
 * @param {Function} props.setAttributes  - Function to update block attributes
 * @return {JSX.Element} Flex Panel component
 */
export const FlexPanel = ({
	layoutType,
	flexJustify,
	flexAlign,
	flexWrap,
	flexMobileStack,
	flexItemWidth,
	hasParentFlex,
	setAttributes,
}) => {
	// Only show this panel if:
	// 1. This container is set to flex layout, OR
	// 2. This container is inside a flex parent (to control its width)
	if (layoutType !== 'flex' && !hasParentFlex) {
		return null;
	}

	return (
		<PanelBody
			title={__('Flex Settings', 'designsetgo')}
			initialOpen={false}
		>
			{/* Flex Justification - Only show when this container is flex */}
			{layoutType === 'flex' && (
				<>
					<SelectControl
						label={__('Justify Items (Horizontal)', 'designsetgo')}
						value={flexJustify}
						options={[
							{
								label: __('Left', 'designsetgo'),
								value: 'flex-start',
							},
							{
								label: __('Center', 'designsetgo'),
								value: 'center',
							},
							{
								label: __('Right', 'designsetgo'),
								value: 'flex-end',
							},
							{
								label: __('Space Around', 'designsetgo'),
								value: 'space-around',
							},
							{
								label: __('Space Between', 'designsetgo'),
								value: 'space-between',
							},
							{
								label: __(
									'Stretch (Full Width)',
									'designsetgo'
								),
								value: 'stretch',
							},
						]}
						onChange={(value) =>
							setAttributes({ flexJustify: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						help={__(
							'Control how items are distributed horizontally.',
							'designsetgo'
						)}
					/>

					<SelectControl
						label={__('Align Items (Vertical)', 'designsetgo')}
						value={flexAlign}
						options={[
							{
								label: __('Top', 'designsetgo'),
								value: 'flex-start',
							},
							{
								label: __('Middle', 'designsetgo'),
								value: 'center',
							},
							{
								label: __('Bottom', 'designsetgo'),
								value: 'flex-end',
							},
							{
								label: __(
									'Stretch (Full Height)',
									'designsetgo'
								),
								value: 'stretch',
							},
						]}
						onChange={(value) =>
							setAttributes({ flexAlign: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						help={__(
							'Control how items are aligned vertically.',
							'designsetgo'
						)}
					/>

					<SelectControl
						label={__('Wrap', 'designsetgo')}
						value={flexWrap}
						options={[
							{
								label: __('Wrap (Multi-line)', 'designsetgo'),
								value: 'wrap',
							},
							{
								label: __('No Wrap (Single line)', 'designsetgo'),
								value: 'nowrap',
							},
						]}
						onChange={(value) =>
							setAttributes({ flexWrap: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						help={__(
							'Allow items to wrap to new lines or force single line.',
							'designsetgo'
						)}
					/>

					<ToggleControl
						label={__('Stack on Mobile', 'designsetgo')}
						checked={flexMobileStack}
						onChange={(value) =>
							setAttributes({ flexMobileStack: value })
						}
						__nextHasNoMarginBottom
						help={__(
							'Stack items vertically on mobile devices for better readability.',
							'designsetgo'
						)}
					/>
				</>
			)}

			{/* Flex Item Width - Only show when inside a flex parent */}
			{hasParentFlex && (
				<>
					<UnitControl
						label={__('Item Width', 'designsetgo')}
						value={flexItemWidth}
						onChange={(value) =>
							setAttributes({ flexItemWidth: value || '' })
						}
						units={[
							{ value: 'px', label: 'px' },
							{ value: '%', label: '%' },
							{ value: 'vw', label: 'vw' },
							{ value: 'em', label: 'em' },
							{ value: 'rem', label: 'rem' },
						]}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						help={__(
							'Set a specific width for this container within the flex parent. Leave empty to use auto width.',
							'designsetgo'
						)}
					/>
				</>
			)}
		</PanelBody>
	);
};
