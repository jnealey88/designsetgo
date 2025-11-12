/**
 * Settings Component
 *
 * Configure performance, forms, animations, sticky header, and security settings.
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
	RangeControl,
	SelectControl,
	TextControl,
	Button,
	Spinner,
	Notice,
	ColorPicker,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const Settings = () => {
	const [settings, setSettings] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [notice, setNotice] = useState(null);

	// Fetch initial data
	useEffect(() => {
		apiFetch({ path: '/designsetgo/v1/settings' })
			.then((data) => {
				setSettings(data);
				setLoading(false);
			})
			.catch(() => {
				setNotice({
					status: 'error',
					message: __('Failed to load settings.', 'designsetgo'),
				});
				setLoading(false);
			});
	}, []);

	/**
	 * Update a setting value
	 *
	 * @param {string} section - The settings section.
	 * @param {string} key     - The setting key.
	 * @param {*}      value   - The new value.
	 */
	const updateSetting = (section, key, value) => {
		setSettings({
			...settings,
			[section]: {
				...settings[section],
				[key]: value,
			},
		});
	};

	/**
	 * Save settings
	 */
	const saveSettings = () => {
		setSaving(true);
		setNotice(null);

		apiFetch({
			path: '/designsetgo/v1/settings',
			method: 'POST',
			data: settings,
		})
			.then(() => {
				setNotice({
					status: 'success',
					message: __('Settings saved successfully!', 'designsetgo'),
				});
				setSaving(false);
			})
			.catch((error) => {
				setNotice({
					status: 'error',
					message:
						error.message ||
						__('Failed to save settings.', 'designsetgo'),
				});
				setSaving(false);
			});
	};

	if (loading) {
		return (
			<div className="designsetgo-admin-loading">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="designsetgo-settings">
			<div className="designsetgo-settings__header">
				<h1>{__('Settings', 'designsetgo')}</h1>
				<p className="description">
					{__(
						'Configure performance, forms, animations, sticky header, and security options.',
						'designsetgo'
					)}
				</p>
			</div>

			{notice && (
				<div
					style={{
						position: 'fixed',
						top: '32px',
						right: '20px',
						zIndex: 100000,
						maxWidth: '400px',
						boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
					}}
				>
					<Notice
						status={notice.status}
						onRemove={() => setNotice(null)}
						isDismissible={true}
					>
						{notice.message}
					</Notice>
				</div>
			)}

			{/* Sticky Header Settings */}
			<Card>
				<CardHeader>
					<h2>{__('Sticky Header', 'designsetgo')}</h2>
				</CardHeader>
				<CardBody>
					<p className="description" style={{ marginBottom: '16px' }}>
						{__(
							'Enable sticky header functionality for blocks with position:sticky applied. These settings enhance the default WordPress sticky positioning with additional features.',
							'designsetgo'
						)}
					</p>

					<ToggleControl
						label={__('Enable Sticky Header', 'designsetgo')}
						help={__(
							'Enable enhanced sticky header functionality.',
							'designsetgo'
						)}
						checked={settings?.sticky_header?.enable || false}
						onChange={(value) =>
							updateSetting('sticky_header', 'enable', value)
						}
						__nextHasNoMarginBottom
					/>

					{settings?.sticky_header?.enable && (
						<>
							<TextControl
								label={__(
									'Custom CSS Selector (Advanced)',
									'designsetgo'
								)}
								help={__(
									'Override the default selector if using a custom theme or page builder. Leave empty to use: .wp-block-template-part:has(.is-position-sticky)',
									'designsetgo'
								)}
								value={
									settings?.sticky_header?.custom_selector ||
									''
								}
								onChange={(value) =>
									updateSetting(
										'sticky_header',
										'custom_selector',
										value
									)
								}
								placeholder=".wp-block-template-part:has(.is-position-sticky)"
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>

							<RangeControl
								label={__('Z-Index', 'designsetgo')}
								help={__(
									'Stacking order of the sticky header.',
									'designsetgo'
								)}
								value={settings?.sticky_header?.z_index || 100}
								onChange={(value) =>
									updateSetting(
										'sticky_header',
										'z_index',
										value
									)
								}
								min={1}
								max={9999}
								step={1}
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>

							<RangeControl
								label={__(
									'Scroll Threshold (px)',
									'designsetgo'
								)}
								help={__(
									'Pixels user must scroll before effects activate.',
									'designsetgo'
								)}
								value={
									settings?.sticky_header?.scroll_threshold ||
									50
								}
								onChange={(value) =>
									updateSetting(
										'sticky_header',
										'scroll_threshold',
										value
									)
								}
								min={0}
								max={500}
								step={10}
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>

							<RangeControl
								label={__(
									'Transition Speed (ms)',
									'designsetgo'
								)}
								help={__(
									'Animation speed for sticky effects.',
									'designsetgo'
								)}
								value={
									settings?.sticky_header?.transition_speed ||
									300
								}
								onChange={(value) =>
									updateSetting(
										'sticky_header',
										'transition_speed',
										value
									)
								}
								min={0}
								max={1000}
								step={50}
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>

							<ToggleControl
								label={__('Shadow on Scroll', 'designsetgo')}
								help={__(
									'Add shadow when scrolled past threshold.',
									'designsetgo'
								)}
								checked={
									settings?.sticky_header?.shadow_on_scroll ||
									false
								}
								onChange={(value) =>
									updateSetting(
										'sticky_header',
										'shadow_on_scroll',
										value
									)
								}
								__nextHasNoMarginBottom
							/>

							{settings?.sticky_header?.shadow_on_scroll && (
								<SelectControl
									label={__('Shadow Size', 'designsetgo')}
									value={
										settings?.sticky_header?.shadow_size ||
										'medium'
									}
									options={[
										{
											label: __('Small', 'designsetgo'),
											value: 'small',
										},
										{
											label: __('Medium', 'designsetgo'),
											value: 'medium',
										},
										{
											label: __('Large', 'designsetgo'),
											value: 'large',
										},
									]}
									onChange={(value) =>
										updateSetting(
											'sticky_header',
											'shadow_size',
											value
										)
									}
									__nextHasNoMarginBottom
									__next40pxDefaultSize
								/>
							)}

							<ToggleControl
								label={__('Shrink on Scroll', 'designsetgo')}
								help={__(
									'Reduce header height when scrolling.',
									'designsetgo'
								)}
								checked={
									settings?.sticky_header?.shrink_on_scroll ||
									false
								}
								onChange={(value) =>
									updateSetting(
										'sticky_header',
										'shrink_on_scroll',
										value
									)
								}
								__nextHasNoMarginBottom
							/>

							{settings?.sticky_header?.shrink_on_scroll && (
								<RangeControl
									label={__(
										'Shrink Amount (%)',
										'designsetgo'
									)}
									help={__(
										'Percentage to reduce header height.',
										'designsetgo'
									)}
									value={
										settings?.sticky_header
											?.shrink_amount || 20
									}
									onChange={(value) =>
										updateSetting(
											'sticky_header',
											'shrink_amount',
											value
										)
									}
									min={5}
									max={50}
									step={5}
									__nextHasNoMarginBottom
									__next40pxDefaultSize
								/>
							)}

							<ToggleControl
								label={__(
									'Hide Header on Scroll Down',
									'designsetgo'
								)}
								help={__(
									'Hide header when scrolling down, show when scrolling up.',
									'designsetgo'
								)}
								checked={
									settings?.sticky_header
										?.hide_on_scroll_down || false
								}
								onChange={(value) =>
									updateSetting(
										'sticky_header',
										'hide_on_scroll_down',
										value
									)
								}
								__nextHasNoMarginBottom
							/>

							<ToggleControl
								label={__(
									'Background Color on Scroll',
									'designsetgo'
								)}
								help={__(
									'Apply background color when scrolled.',
									'designsetgo'
								)}
								checked={
									settings?.sticky_header
										?.background_on_scroll || false
								}
								onChange={(value) =>
									updateSetting(
										'sticky_header',
										'background_on_scroll',
										value
									)
								}
								__nextHasNoMarginBottom
							/>

							{settings?.sticky_header?.background_on_scroll && (
								<>
									<div style={{ marginBottom: '16px' }}>
										<div
											style={{
												display: 'block',
												marginBottom: '8px',
												fontWeight: 600,
											}}
										>
											{__(
												'Background Color',
												'designsetgo'
											)}
										</div>
										<ColorPicker
											color={
												settings?.sticky_header
													?.background_scroll_color ||
												''
											}
											onChangeComplete={(color) =>
												updateSetting(
													'sticky_header',
													'background_scroll_color',
													color.hex
												)
											}
											enableAlpha={false}
										/>
									</div>

									<RangeControl
										label={__(
											'Background Opacity (%)',
											'designsetgo'
										)}
										value={
											settings?.sticky_header
												?.background_scroll_opacity ||
											100
										}
										onChange={(value) =>
											updateSetting(
												'sticky_header',
												'background_scroll_opacity',
												value
											)
										}
										min={0}
										max={100}
										step={5}
										__nextHasNoMarginBottom
										__next40pxDefaultSize
									/>
								</>
							)}

							<hr style={{ margin: '24px 0' }} />

							<h3>{__('Mobile Settings', 'designsetgo')}</h3>

							<ToggleControl
								label={__('Enable on Mobile', 'designsetgo')}
								help={__(
									'Enable sticky header on mobile devices.',
									'designsetgo'
								)}
								checked={
									settings?.sticky_header?.mobile_enabled ||
									false
								}
								onChange={(value) =>
									updateSetting(
										'sticky_header',
										'mobile_enabled',
										value
									)
								}
								__nextHasNoMarginBottom
							/>

							{settings?.sticky_header?.mobile_enabled && (
								<RangeControl
									label={__(
										'Mobile Breakpoint (px)',
										'designsetgo'
									)}
									help={__(
										'Screen width below which mobile settings apply.',
										'designsetgo'
									)}
									value={
										settings?.sticky_header
											?.mobile_breakpoint || 768
									}
									onChange={(value) =>
										updateSetting(
											'sticky_header',
											'mobile_breakpoint',
											value
										)
									}
									min={320}
									max={1024}
									step={1}
									__nextHasNoMarginBottom
									__next40pxDefaultSize
								/>
							)}
						</>
					)}
				</CardBody>
			</Card>

			{/* Performance Settings */}
			<Card>
				<CardHeader>
					<h2>{__('Performance', 'designsetgo')}</h2>
				</CardHeader>
				<CardBody>
					<ToggleControl
						label={__('Conditional Asset Loading', 'designsetgo')}
						help={__(
							'Load block assets only on pages that use them. Improves performance.',
							'designsetgo'
						)}
						checked={
							settings?.performance?.conditional_loading || false
						}
						onChange={(value) =>
							updateSetting(
								'performance',
								'conditional_loading',
								value
							)
						}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Cache Duration (seconds)', 'designsetgo')}
						help={__(
							'How long to cache block detection results.',
							'designsetgo'
						)}
						value={settings?.performance?.cache_duration || 3600}
						onChange={(value) =>
							updateSetting(
								'performance',
								'cache_duration',
								value
							)
						}
						min={0}
						max={86400}
						step={300}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</CardBody>
			</Card>

			{/* Form Settings */}
			<Card>
				<CardHeader>
					<h2>{__('Forms', 'designsetgo')}</h2>
				</CardHeader>
				<CardBody>
					<ToggleControl
						label={__('Enable Honeypot', 'designsetgo')}
						help={__(
							'Add a hidden field to detect spam bots.',
							'designsetgo'
						)}
						checked={settings?.forms?.enable_honeypot || false}
						onChange={(value) =>
							updateSetting('forms', 'enable_honeypot', value)
						}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Enable Rate Limiting', 'designsetgo')}
						help={__(
							'Prevent spam by limiting submission frequency.',
							'designsetgo'
						)}
						checked={settings?.forms?.enable_rate_limiting || false}
						onChange={(value) =>
							updateSetting(
								'forms',
								'enable_rate_limiting',
								value
							)
						}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Submission Retention (days)', 'designsetgo')}
						help={__(
							'How long to keep form submissions. Set to 0 to keep forever.',
							'designsetgo'
						)}
						value={settings?.forms?.retention_days || 30}
						onChange={(value) =>
							updateSetting('forms', 'retention_days', value)
						}
						min={0}
						max={365}
						step={1}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</CardBody>
			</Card>

			{/* Animation Settings */}
			<Card>
				<CardHeader>
					<h2>{__('Animations', 'designsetgo')}</h2>
				</CardHeader>
				<CardBody>
					<ToggleControl
						label={__('Enable Animations', 'designsetgo')}
						help={__(
							'Enable block entrance/exit animations.',
							'designsetgo'
						)}
						checked={
							settings?.animations?.enable_animations || false
						}
						onChange={(value) =>
							updateSetting(
								'animations',
								'enable_animations',
								value
							)
						}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Default Duration (ms)', 'designsetgo')}
						help={__(
							'Default animation duration in milliseconds.',
							'designsetgo'
						)}
						value={settings?.animations?.default_duration || 600}
						onChange={(value) =>
							updateSetting(
								'animations',
								'default_duration',
								value
							)
						}
						min={100}
						max={2000}
						step={100}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<SelectControl
						label={__('Default Easing', 'designsetgo')}
						help={__(
							'Default animation timing function.',
							'designsetgo'
						)}
						value={
							settings?.animations?.default_easing ||
							'ease-in-out'
						}
						options={[
							{ label: 'Ease', value: 'ease' },
							{ label: 'Ease In', value: 'ease-in' },
							{ label: 'Ease Out', value: 'ease-out' },
							{ label: 'Ease In Out', value: 'ease-in-out' },
							{ label: 'Linear', value: 'linear' },
						]}
						onChange={(value) =>
							updateSetting('animations', 'default_easing', value)
						}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<ToggleControl
						label={__(
							'Respect Prefers Reduced Motion',
							'designsetgo'
						)}
						help={__(
							'Disable animations for users who prefer reduced motion (accessibility).',
							'designsetgo'
						)}
						checked={
							settings?.animations
								?.respect_prefers_reduced_motion || false
						}
						onChange={(value) =>
							updateSetting(
								'animations',
								'respect_prefers_reduced_motion',
								value
							)
						}
						__nextHasNoMarginBottom
					/>
				</CardBody>
			</Card>

			{/* Security Settings */}
			<Card>
				<CardHeader>
					<h2>{__('Security & Privacy', 'designsetgo')}</h2>
				</CardHeader>
				<CardBody>
					<ToggleControl
						label={__('Log IP Addresses', 'designsetgo')}
						help={__(
							'Store IP addresses with form submissions.',
							'designsetgo'
						)}
						checked={settings?.security?.log_ip_addresses || false}
						onChange={(value) =>
							updateSetting('security', 'log_ip_addresses', value)
						}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Log User Agents', 'designsetgo')}
						help={__(
							'Store browser user agent strings with form submissions.',
							'designsetgo'
						)}
						checked={settings?.security?.log_user_agents || false}
						onChange={(value) =>
							updateSetting('security', 'log_user_agents', value)
						}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Log Referrers', 'designsetgo')}
						help={__(
							'Store referrer URLs with form submissions.',
							'designsetgo'
						)}
						checked={settings?.security?.log_referrers || false}
						onChange={(value) =>
							updateSetting('security', 'log_referrers', value)
						}
						__nextHasNoMarginBottom
					/>
				</CardBody>
			</Card>

			<div className="designsetgo-save-bar">
				<Button
					variant="primary"
					onClick={saveSettings}
					isBusy={saving}
					disabled={saving}
				>
					{saving
						? __('Saving…', 'designsetgo')
						: __('Save Changes', 'designsetgo')}
				</Button>
			</div>
		</div>
	);
};

export default Settings;
