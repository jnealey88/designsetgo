/**
 * Inspector Control Panels for Breadcrumbs Block
 */
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	SelectControl,
} from '@wordpress/components';

export function DisplaySettingsPanel({ attributes, setAttributes }) {
	const {
		showHome,
		homeText,
		separator,
		showCurrent,
		linkCurrent,
		prefixText,
		hideOnHome,
	} = attributes;

	return (
		<PanelBody
			title={__('Display Settings', 'designsetgo')}
			initialOpen={true}
		>
			<ToggleControl
				label={__('Show home link', 'designsetgo')}
				checked={showHome}
				onChange={(value) => setAttributes({ showHome: value })}
				help={__(
					'Display a link to the homepage at the start of the breadcrumb trail',
					'designsetgo'
				)}
				__nextHasNoMarginBottom
			/>

			{showHome && (
				<TextControl
					label={__('Home text', 'designsetgo')}
					value={homeText}
					onChange={(value) => setAttributes({ homeText: value })}
					help={__(
						'Text to display for the home link',
						'designsetgo'
					)}
					__nextHasNoMarginBottom
				/>
			)}

			<SelectControl
				label={__('Separator', 'designsetgo')}
				value={separator}
				options={[
					{ label: '/', value: 'slash' },
					{ label: '›', value: 'chevron' },
					{ label: '>', value: 'greater' },
					{ label: '•', value: 'bullet' },
					{ label: '→', value: 'arrow-right' },
				]}
				onChange={(value) => setAttributes({ separator: value })}
				help={__(
					'Character used to separate breadcrumb items',
					'designsetgo'
				)}
				__nextHasNoMarginBottom
			/>

			<ToggleControl
				label={__('Show current page', 'designsetgo')}
				checked={showCurrent}
				onChange={(value) => setAttributes({ showCurrent: value })}
				help={__(
					'Display the current page in the breadcrumb trail',
					'designsetgo'
				)}
				__nextHasNoMarginBottom
			/>

			{showCurrent && (
				<ToggleControl
					label={__('Link current page', 'designsetgo')}
					checked={linkCurrent}
					onChange={(value) => setAttributes({ linkCurrent: value })}
					help={__(
						'Make the current page a clickable link',
						'designsetgo'
					)}
					__nextHasNoMarginBottom
				/>
			)}

			<TextControl
				label={__('Prefix text', 'designsetgo')}
				value={prefixText}
				onChange={(value) => setAttributes({ prefixText: value })}
				help={__(
					'Optional text to display before the breadcrumb trail (e.g., "You are here:")',
					'designsetgo'
				)}
				placeholder={__('You are here:', 'designsetgo')}
				__nextHasNoMarginBottom
			/>

			<ToggleControl
				label={__('Hide on homepage', 'designsetgo')}
				checked={hideOnHome}
				onChange={(value) => setAttributes({ hideOnHome: value })}
				help={__(
					'Hide breadcrumbs when viewing the homepage',
					'designsetgo'
				)}
				__nextHasNoMarginBottom
			/>
		</PanelBody>
	);
}
