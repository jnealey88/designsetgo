/**
 * llms.txt Exclusion Panel
 *
 * Adds a sidebar panel to posts/pages for excluding from llms.txt.
 *
 * @package
 * @since 1.4.0
 * @see https://llmstxt.org/
 */

import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { ToggleControl, ExternalLink } from '@wordpress/components';

/**
 * LLMS TXT Panel Component
 *
 * Renders a sidebar panel in the document settings for controlling
 * whether the current post/page is included in llms.txt.
 */
const LLMSTxtPanel = () => {
	const postType = useSelect(
		(select) => select('core/editor').getCurrentPostType(),
		[]
	);

	const [meta, setMeta] = useEntityProp('postType', postType, 'meta');

	// Get exclusion state from meta, defaulting to false (included).
	const excludeFromLLMS = meta?._designsetgo_exclude_llms || false;

	/**
	 * Update the exclusion meta value.
	 *
	 * @param {boolean} value Whether to exclude from llms.txt.
	 */
	const updateExclusion = (value) => {
		setMeta({ ...meta, _designsetgo_exclude_llms: value });
	};

	// Only show for public post types (skip attachments).
	if (!postType || postType === 'attachment') {
		return null;
	}

	return (
		<PluginDocumentSettingPanel
			name="designsetgo-llms-txt"
			title={__('AI & LLMs', 'designsetgo')}
			className="designsetgo-llms-txt-panel"
		>
			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Exclude from llms.txt', 'designsetgo')}
				help={
					excludeFromLLMS
						? __(
								'This content will NOT appear in llms.txt',
								'designsetgo'
							)
						: __(
								'This content will appear in llms.txt',
								'designsetgo'
							)
				}
				checked={excludeFromLLMS}
				onChange={updateExclusion}
			/>
			<p
				style={{
					fontSize: '12px',
					color: '#757575',
					marginTop: '8px',
				}}
			>
				{__(
					'llms.txt helps AI language models understand your site content.',
					'designsetgo'
				)}{' '}
				<ExternalLink href="https://llmstxt.org/">
					{__('Learn more', 'designsetgo')}
				</ExternalLink>
			</p>
		</PluginDocumentSettingPanel>
	);
};

// Register the plugin.
registerPlugin('designsetgo-llms-txt', {
	render: LLMSTxtPanel,
	icon: 'visibility',
});
