/**
 * Max Width Extension - Editor Controls
 *
 * Inspector panel and editor style application for max-width.
 * Lazy-loaded to reduce initial bundle size.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { InspectorControls, useSettings } from '@wordpress/block-editor';
import {
	PanelBody,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';

/**
 * Max width inspector controls panel
 *
 * @param {Object} props Block props
 */
export function MaxWidthPanel(props) {
	const { attributes, setAttributes } = props;
	const { dsgoMaxWidth } = attributes;

	const [spacingUnits] = useSettings('spacing.units');
	const units = useCustomUnits({
		availableUnits: spacingUnits || ['px', 'em', 'rem', 'vh', 'vw', '%'],
	});

	return (
		<InspectorControls>
			<PanelBody title={__('Width', 'designsetgo')} initialOpen={false}>
				<UnitControl
					label={__('Max width', 'designsetgo')}
					value={dsgoMaxWidth || ''}
					onChange={(value) =>
						setAttributes({ dsgoMaxWidth: value || '' })
					}
					units={units}
					help={__(
						'Maximum width for this block. Leave empty for no constraint.',
						'designsetgo'
					)}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);
}

/**
 * Max width editor style application wrapper
 *
 * @param {Object} props                Block list block props
 * @param {Object} props.BlockListBlock Original BlockListBlock component
 */
export function MaxWidthStyles({ BlockListBlock, ...props }) {
	const { attributes, clientId } = props;
	const { dsgoMaxWidth, align, textAlign } = attributes;

	const maxWidth = dsgoMaxWidth;
	const styleId = `dsgo-max-width-${clientId}`;

	useEffect(() => {
		const editorDocument =
			document.querySelector('iframe[name="editor-canvas"]')
				?.contentDocument || document;

		const existingStyle = editorDocument.getElementById(styleId);
		if (existingStyle) {
			existingStyle.remove();
		}

		if (maxWidth) {
			const styleElement = editorDocument.createElement('style');
			styleElement.id = styleId;

			let marginLeft = 'auto';
			let marginRight = 'auto';

			if (textAlign === 'left' || align === 'left') {
				marginLeft = '0';
				marginRight = 'auto';
			} else if (textAlign === 'right' || align === 'right') {
				marginLeft = 'auto';
				marginRight = '0';
			}

			const selector = `[data-block="${clientId}"]`;
			styleElement.textContent = `
				${selector} {
					max-width: ${maxWidth} !important;
					margin-left: ${marginLeft} !important;
					margin-right: ${marginRight} !important;
				}
			`;

			editorDocument.head.appendChild(styleElement);
		}

		return () => {
			const styleToRemove = editorDocument.getElementById(styleId);
			if (styleToRemove) {
				styleToRemove.remove();
			}
		};
	}, [maxWidth, clientId, styleId, textAlign, align]);

	const className = maxWidth
		? `${props.className || ''} dsgo-has-max-width`.trim()
		: props.className;

	return <BlockListBlock {...props} className={className} />;
}
