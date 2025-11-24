/**
 * Modal Trigger Block - Editor Component
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	Notice,
	RangeControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { getIcon } from '../icon/utils/svg-icons';
import { IconPicker } from '../icon/components/IconPicker';

export default function ModalTriggerEdit({ attributes, setAttributes }) {
	const {
		targetModalId,
		text,
		buttonStyle,
		width,
		icon,
		iconPosition,
		iconSize,
		iconGap,
	} = attributes;

	// Get all modal blocks on the current page
	// Only re-run when blocks actually change (not on every selection change)
	const modals = useSelect((select) => {
		const { getBlocks } = select('core/block-editor');
		const allBlocks = getBlocks();

		// Optimized recursive search - flatten and filter in one pass
		const findModals = (blocks, result = []) => {
			for (const block of blocks) {
				if (block.name === 'designsetgo/modal') {
					result.push({
						id: block.attributes.modalId || '',
						clientId: block.clientId,
					});
				}
				// Only recurse if innerBlocks exist
				if (block.innerBlocks?.length) {
					findModals(block.innerBlocks, result);
				}
			}
			return result;
		};

		return findModals(allBlocks);
	}); // No dependency array - useSelect optimizes to only re-run when returned data changes

	// Create options for the select control
	const modalOptions = [
		{ label: __('Select a modal…', 'designsetgo'), value: '' },
		...modals.map((modal) => ({
			label: modal.id || __('(Unnamed Modal)', 'designsetgo'),
			value: modal.id,
		})),
	];

	// Calculate button styles
	const buttonStyles = {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: iconPosition !== 'none' && icon ? iconGap : 0,
		flexDirection: iconPosition === 'end' ? 'row-reverse' : 'row',
	};

	// Calculate icon wrapper styles
	const iconWrapperStyles = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: `${iconSize}px`,
		height: `${iconSize}px`,
		flexShrink: 0,
	};

	const blockProps = useBlockProps({
		className: `dsgo-modal-trigger dsgo-modal-trigger--${buttonStyle} dsgo-modal-trigger--width-${width}`,
		style: { display: width === 'full' ? 'block' : 'inline-block' },
	});

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Trigger Settings', 'designsetgo')}
					initialOpen={true}
				>
					{modals.length === 0 && (
						<Notice status="warning" isDismissible={false}>
							{__(
								'No modal blocks found on this page. Add a Modal block first.',
								'designsetgo'
							)}
						</Notice>
					)}

					<SelectControl
						label={__('Target Modal', 'designsetgo')}
						value={targetModalId}
						options={modalOptions}
						onChange={(value) =>
							setAttributes({ targetModalId: value })
						}
						help={__(
							'Select which modal this button should open.',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Button Style', 'designsetgo')}
						value={buttonStyle}
						onChange={(value) =>
							setAttributes({ buttonStyle: value })
						}
						options={[
							{
								label: __('Fill', 'designsetgo'),
								value: 'fill',
							},
							{
								label: __('Outline', 'designsetgo'),
								value: 'outline',
							},
							{
								label: __('Link', 'designsetgo'),
								value: 'link',
							},
						]}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Width', 'designsetgo')}
						value={width}
						onChange={(value) => setAttributes({ width: value })}
						options={[
							{
								label: __('Auto', 'designsetgo'),
								value: 'auto',
							},
							{
								label: __('Full Width', 'designsetgo'),
								value: 'full',
							},
						]}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Icon Settings', 'designsetgo')}
					initialOpen={false}
				>
					<IconPicker
						label={__('Icon', 'designsetgo')}
						value={icon}
						onChange={(value) => {
							setAttributes({ icon: value });
							// If icon is selected and position is none, default to start
							if (value && iconPosition === 'none') {
								setAttributes({ iconPosition: 'start' });
							}
							// If icon is cleared, set position to none
							if (!value) {
								setAttributes({ iconPosition: 'none' });
							}
						}}
					/>

					{icon && (
						<>
							<SelectControl
								label={__('Icon Position', 'designsetgo')}
								value={iconPosition}
								options={[
									{
										label: __('Start', 'designsetgo'),
										value: 'start',
									},
									{
										label: __('End', 'designsetgo'),
										value: 'end',
									},
									{
										label: __('None', 'designsetgo'),
										value: 'none',
									},
								]}
								onChange={(value) =>
									setAttributes({ iconPosition: value })
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							{iconPosition !== 'none' && (
								<>
									<RangeControl
										label={__(
											'Icon Size (px)',
											'designsetgo'
										)}
										value={iconSize}
										onChange={(value) =>
											setAttributes({ iconSize: value })
										}
										min={12}
										max={48}
										step={1}
										__next40pxDefaultSize
										__nextHasNoMarginBottom
									/>

									<UnitControl
										label={__('Icon Gap', 'designsetgo')}
										value={iconGap}
										onChange={(value) =>
											setAttributes({ iconGap: value })
										}
										units={[
											{ value: 'px', label: 'px' },
											{ value: 'em', label: 'em' },
											{ value: 'rem', label: 'rem' },
										]}
										__next40pxDefaultSize
									/>
								</>
							)}
						</>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div
					className="dsgo-modal-trigger__button"
					style={buttonStyles}
				>
					{icon && iconPosition === 'start' && (
						<span style={iconWrapperStyles}>{getIcon(icon)}</span>
					)}
					<RichText
						tagName="span"
						value={text}
						onChange={(value) => setAttributes({ text: value })}
						placeholder={__('Button text…', 'designsetgo')}
						allowedFormats={['core/bold', 'core/italic']}
						className="dsgo-modal-trigger__text"
					/>
					{icon && iconPosition === 'end' && (
						<span style={iconWrapperStyles}>{getIcon(icon)}</span>
					)}
				</div>
			</div>
		</>
	);
}
