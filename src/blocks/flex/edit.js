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
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseCustomUnits as useCustomUnits,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

/**
 * Flex Container Edit Component
 *
 * @param {Object}   props               Component props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to update attributes
 * @return {JSX.Element} Edit component
 */
export default function FlexEdit({ attributes, setAttributes }) {
	const {
		direction,
		wrap,
		justifyContent,
		alignItems,
		gap,
		mobileStack,
	} = attributes;

	// Get spacing units from theme
	const units = useCustomUnits({
		availableUnits: useSetting('spacing.units') || ['px', 'em', 'rem', 'vh', 'vw'],
	});

	// Calculate inner styles declaratively
	const innerStyles = {
		display: 'flex',
		flexDirection: direction || 'row',
		flexWrap: wrap ? 'wrap' : 'nowrap',
		justifyContent: justifyContent || 'flex-start',
		alignItems: alignItems || 'center',
		gap: gap || 'var(--wp--preset--spacing--50)',
	};

	// Block wrapper props
	const blockProps = useBlockProps({
		className: `dsg-flex ${mobileStack ? 'dsg-flex--mobile-stack' : ''}`,
	});

	// Inner blocks props with declarative styles
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsg-flex__inner',
			style: innerStyles,
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
							{ label: __('Row (Horizontal)', 'designsetgo'), value: 'row' },
							{ label: __('Column (Vertical)', 'designsetgo'), value: 'column' },
						]}
						onChange={(value) => setAttributes({ direction: value })}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Wrap Items', 'designsetgo')}
						checked={wrap}
						onChange={(value) => setAttributes({ wrap: value })}
						help={
							wrap
								? __('Items will wrap to next line if needed', 'designsetgo')
								: __('Items will stay in single line', 'designsetgo')
						}
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Justify Content', 'designsetgo')}
						value={justifyContent}
						options={[
							{ label: __('Start', 'designsetgo'), value: 'flex-start' },
							{ label: __('Center', 'designsetgo'), value: 'center' },
							{ label: __('End', 'designsetgo'), value: 'flex-end' },
							{ label: __('Space Between', 'designsetgo'), value: 'space-between' },
							{ label: __('Space Around', 'designsetgo'), value: 'space-around' },
							{ label: __('Space Evenly', 'designsetgo'), value: 'space-evenly' },
						]}
						onChange={(value) => setAttributes({ justifyContent: value })}
						help={__('Horizontal alignment (main axis)', 'designsetgo')}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Align Items', 'designsetgo')}
						value={alignItems}
						options={[
							{ label: __('Start', 'designsetgo'), value: 'flex-start' },
							{ label: __('Center', 'designsetgo'), value: 'center' },
							{ label: __('End', 'designsetgo'), value: 'flex-end' },
							{ label: __('Stretch', 'designsetgo'), value: 'stretch' },
							{ label: __('Baseline', 'designsetgo'), value: 'baseline' },
						]}
						onChange={(value) => setAttributes({ alignItems: value })}
						help={__('Vertical alignment (cross axis)', 'designsetgo')}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<UnitControl
						label={__('Gap', 'designsetgo')}
						value={gap}
						onChange={(value) => setAttributes({ gap: value })}
						units={units}
						isResetValueOnUnitChange
						__unstableInputWidth="80px"
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Stack on Mobile', 'designsetgo')}
						checked={mobileStack}
						onChange={(value) => setAttributes({ mobileStack: value })}
						help={
							mobileStack
								? __('Items will stack vertically on mobile devices', 'designsetgo')
								: __('Items maintain flex layout on all devices', 'designsetgo')
						}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}
