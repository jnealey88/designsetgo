/**
 * llms.txt Settings Panel
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {
	Card,
	CardHeader,
	CardBody,
	ToggleControl,
	CheckboxControl,
	ExternalLink,
	Spinner,
	Button,
	Notice,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const LLMSTxtPanel = ({ settings, updateSetting }) => {
	const [postTypes, setPostTypes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState(null);
	const [flushing, setFlushing] = useState(false);
	const [flushNotice, setFlushNotice] = useState(null);
	const [generating, setGenerating] = useState(false);
	const [generateNotice, setGenerateNotice] = useState(null);

	// Fetch available post types.
	useEffect(() => {
		apiFetch({ path: '/designsetgo/v1/llms-txt/post-types' })
			.then((data) => {
				setPostTypes(data);
				setLoading(false);
			})
			.catch((error) => {
				// eslint-disable-next-line no-console
				console.error(
					'DesignSetGo: Failed to fetch post types for llms.txt settings',
					error
				);
				setLoadError(
					__(
						'Failed to load content types. Please refresh the page.',
						'designsetgo'
					)
				);
				setLoading(false);
			});
	}, []);

	const isEnabled = settings?.llms_txt?.enable || false;
	const enabledPostTypes = settings?.llms_txt?.post_types || ['page', 'post'];

	/**
	 * Toggle a post type in the enabled list.
	 *
	 * @param {string}  postType Post type name.
	 * @param {boolean} enabled  Whether to enable.
	 */
	const togglePostType = (postType, enabled) => {
		const newTypes = enabled
			? [...enabledPostTypes, postType]
			: enabledPostTypes.filter((t) => t !== postType);
		updateSetting('llms_txt', 'post_types', newTypes);
	};

	/**
	 * Generate static markdown files.
	 */
	const generateFiles = () => {
		setGenerating(true);
		setGenerateNotice(null);

		apiFetch({
			path: '/designsetgo/v1/llms-txt/generate-files',
			method: 'POST',
		})
			.then((response) => {
				setGenerateNotice({
					status: response.success ? 'success' : 'warning',
					message: response.message,
				});
			})
			.catch((error) => {
				// eslint-disable-next-line no-console
				console.error(
					'DesignSetGo: Failed to generate markdown files',
					error
				);
				setGenerateNotice({
					status: 'error',
					message: __(
						'Failed to generate markdown files.',
						'designsetgo'
					),
				});
			})
			.finally(() => {
				setGenerating(false);
			});
	};

	/**
	 * Flush the llms.txt cache.
	 */
	const flushCache = () => {
		setFlushing(true);
		setFlushNotice(null);

		apiFetch({
			path: '/designsetgo/v1/llms-txt/flush-cache',
			method: 'POST',
		})
			.then(() => {
				setFlushNotice({
					status: 'success',
					message: __('Cache cleared successfully.', 'designsetgo'),
				});
			})
			.catch((error) => {
				// eslint-disable-next-line no-console
				console.error(
					'DesignSetGo: Failed to flush llms.txt cache',
					error
				);
				setFlushNotice({
					status: 'error',
					message: __('Failed to clear cache.', 'designsetgo'),
				});
			})
			.finally(() => {
				setFlushing(false);
			});
	};

	// Get site URL for display.
	const siteUrl = window.designSetGoAdmin?.siteUrl || '';

	/**
	 * Render the post types list or appropriate state.
	 *
	 * @return {JSX.Element} Post types UI.
	 */
	const renderPostTypes = () => {
		if (loading) {
			return <Spinner />;
		}

		if (loadError) {
			return (
				<Notice status="error" isDismissible={false}>
					{loadError}
				</Notice>
			);
		}

		return postTypes.map((postType) => (
			<CheckboxControl
				__nextHasNoMarginBottom
				key={postType.name}
				label={postType.label}
				checked={enabledPostTypes.includes(postType.name)}
				onChange={(checked) => togglePostType(postType.name, checked)}
			/>
		));
	};

	return (
		<Card className="designsetgo-settings-panel">
			<CardHeader>
				<h2>{__('llms.txt', 'designsetgo')}</h2>
			</CardHeader>
			<CardBody>
				<p className="designsetgo-panel-description">
					{__(
						'Generate an llms.txt file to help AI language models understand your site content.',
						'designsetgo'
					)}{' '}
					<ExternalLink href="https://llmstxt.org/">
						{__('Learn about the llms.txt standard', 'designsetgo')}
					</ExternalLink>
				</p>

				<ToggleControl
					__nextHasNoMarginBottom
					label={__('Enable llms.txt', 'designsetgo')}
					help={
						isEnabled ? (
							<>
								{__(
									'Your llms.txt is available at:',
									'designsetgo'
								)}{' '}
								<ExternalLink href={siteUrl + '/llms.txt'}>
									{siteUrl}/llms.txt
								</ExternalLink>
							</>
						) : (
							__(
								'Enable to generate an llms.txt file for your site.',
								'designsetgo'
							)
						)
					}
					checked={isEnabled}
					onChange={(value) =>
						updateSetting('llms_txt', 'enable', value)
					}
				/>

				{isEnabled && (
					<div className="designsetgo-settings-section">
						<h3 className="designsetgo-section-heading">
							{__('Content Types', 'designsetgo')}
						</h3>
						<p className="designsetgo-section-description">
							{__(
								'Select which content types to include in llms.txt.',
								'designsetgo'
							)}
						</p>

						{renderPostTypes()}

						<div className="designsetgo-settings-note">
							<strong>
								{__('Excluding specific pages:', 'designsetgo')}
							</strong>
							<p>
								{__(
									'You can exclude individual pages or posts from llms.txt by editing them and toggling "Exclude from llms.txt" in the AI & LLMs panel.',
									'designsetgo'
								)}
							</p>
						</div>

						<div className="designsetgo-settings-note">
							<strong>{__('Performance:', 'designsetgo')}</strong>
							<p>
								{__(
									'For performance, llms.txt includes up to 500 posts per content type. Developers can adjust this limit using the designsetgo_llms_txt_posts_limit filter.',
									'designsetgo'
								)}
							</p>
						</div>

						<div className="designsetgo-settings-section">
							<h3 className="designsetgo-section-heading">
								{__('Static Markdown Files', 'designsetgo')}
							</h3>
							<p className="designsetgo-section-description">
								{__(
									'Generate static .md files for all your content. These files will be linked directly in llms.txt for faster access. Files are automatically regenerated when posts are saved.',
									'designsetgo'
								)}
							</p>

							{generateNotice && (
								<Notice
									status={generateNotice.status}
									isDismissible={true}
									onRemove={() => setGenerateNotice(null)}
								>
									{generateNotice.message}
								</Notice>
							)}

							<Button
								variant="primary"
								onClick={generateFiles}
								isBusy={generating}
								disabled={generating}
							>
								{generating
									? __('Generating…', 'designsetgo')
									: __(
											'Generate Markdown Files',
											'designsetgo'
										)}
							</Button>
						</div>

						<div className="designsetgo-settings-section">
							<h3 className="designsetgo-section-heading">
								{__('Cache', 'designsetgo')}
							</h3>
							<p className="designsetgo-section-description">
								{__(
									'The llms.txt file is cached for performance. Clear the cache to regenerate it with the latest content.',
									'designsetgo'
								)}
							</p>

							{flushNotice && (
								<Notice
									status={flushNotice.status}
									isDismissible={true}
									onRemove={() => setFlushNotice(null)}
								>
									{flushNotice.message}
								</Notice>
							)}

							<Button
								variant="secondary"
								onClick={flushCache}
								isBusy={flushing}
								disabled={flushing}
							>
								{flushing
									? __('Clearing…', 'designsetgo')
									: __('Clear Cache', 'designsetgo')}
							</Button>
						</div>
					</div>
				)}
			</CardBody>
		</Card>
	);
};

export default LLMSTxtPanel;
