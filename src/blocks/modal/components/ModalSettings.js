/**
 * Modal Settings Panel Component
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	SelectControl,
	TextControl,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

export default function ModalSettings({ attributes, setAttributes }) {
	const { modalId, width, maxWidth, height, maxHeight } = attributes;

	return (
		<PanelBody
			title={__('Modal Settings', 'designsetgo')}
			initialOpen={true}
		>
			<TextControl
				label={__('Modal ID', 'designsetgo')}
				value={modalId}
				onChange={(value) => {
					// Sanitize to valid HTML ID format
					// Only allow alphanumeric, hyphens, and underscores
					const sanitized = value
						.toLowerCase()
						.replace(/[^a-z0-9-_]/gi, '-')
						.replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
						.replace(/-{2,}/g, '-'); // Replace multiple hyphens with single

					// Ensure it starts with dsgo-modal- prefix
					const finalId = sanitized.startsWith('dsgo-modal-')
						? sanitized
						: sanitized
							? `dsgo-modal-${sanitized}`
							: 'dsgo-modal-';

					setAttributes({ modalId: finalId });
				}}
				help={__(
					'Unique identifier for this modal. Only letters, numbers, hyphens, and underscores allowed.',
					'designsetgo'
				)}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>

			<UnitControl
				label={__('Width', 'designsetgo')}
				value={width}
				onChange={(value) => setAttributes({ width: value })}
				units={[
					{ value: 'px', label: 'px' },
					{ value: '%', label: '%' },
					{ value: 'vw', label: 'vw' },
				]}
				__next40pxDefaultSize
			/>

			<UnitControl
				label={__('Max Width', 'designsetgo')}
				value={maxWidth}
				onChange={(value) => setAttributes({ maxWidth: value })}
				units={[
					{ value: 'px', label: 'px' },
					{ value: '%', label: '%' },
					{ value: 'vw', label: 'vw' },
				]}
				__next40pxDefaultSize
			/>

			<SelectControl
				label={__('Height', 'designsetgo')}
				value={height}
				onChange={(value) => setAttributes({ height: value })}
				options={[
					{ label: __('Auto', 'designsetgo'), value: 'auto' },
					{ label: __('Custom', 'designsetgo'), value: 'custom' },
				]}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>

			{height !== 'auto' && (
				<UnitControl
					label={__('Max Height', 'designsetgo')}
					value={maxHeight}
					onChange={(value) => setAttributes({ maxHeight: value })}
					units={[
						{ value: 'px', label: 'px' },
						{ value: 'vh', label: 'vh' },
					]}
					__next40pxDefaultSize
				/>
			)}
		</PanelBody>
	);
}
