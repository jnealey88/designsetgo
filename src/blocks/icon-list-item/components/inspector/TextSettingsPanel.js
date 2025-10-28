/**
 * Icon List Item - Text Settings Panel Component
 *
 * Provides controls for title and description HTML tag selection.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl } from '@wordpress/components';

/**
 * Text Settings Panel Component
 *
 * @param {Object}   props                - Component props
 * @param {string}   props.titleTag       - Current title HTML tag
 * @param {string}   props.descriptionTag - Current description HTML tag
 * @param {Function} props.setAttributes  - Function to update attributes
 * @return {JSX.Element} Text Settings Panel component
 */
export const TextSettingsPanel = ({
	titleTag,
	descriptionTag,
	setAttributes,
}) => {
	return (
		<PanelBody
			title={__('Text Settings', 'designsetgo')}
			initialOpen={false}
		>
			<SelectControl
				label={__('Title Tag', 'designsetgo')}
				value={titleTag}
				options={[
					{ label: __('Heading 2 (H2)', 'designsetgo'), value: 'h2' },
					{ label: __('Heading 3 (H3)', 'designsetgo'), value: 'h3' },
					{ label: __('Heading 4 (H4)', 'designsetgo'), value: 'h4' },
					{ label: __('Heading 5 (H5)', 'designsetgo'), value: 'h5' },
					{ label: __('Heading 6 (H6)', 'designsetgo'), value: 'h6' },
					{ label: __('Paragraph (P)', 'designsetgo'), value: 'p' },
					{ label: __('Div', 'designsetgo'), value: 'div' },
				]}
				onChange={(value) => setAttributes({ titleTag: value })}
				help={__('HTML element for the title', 'designsetgo')}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>

			<SelectControl
				label={__('Description Tag', 'designsetgo')}
				value={descriptionTag}
				options={[
					{ label: __('Paragraph (P)', 'designsetgo'), value: 'p' },
					{ label: __('Span', 'designsetgo'), value: 'span' },
					{ label: __('Div', 'designsetgo'), value: 'div' },
				]}
				onChange={(value) => setAttributes({ descriptionTag: value })}
				help={__('HTML element for the description', 'designsetgo')}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
		</PanelBody>
	);
};
