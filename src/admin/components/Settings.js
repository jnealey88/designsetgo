/**
 * Settings Component
 *
 * Configure performance, forms, animations, and security settings.
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
	Button,
	Spinner,
	Notice,
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
						'Configure performance, forms, animations, and security options.',
						'designsetgo'
					)}
				</p>
			</div>

			{notice && (
				<Notice
					status={notice.status}
					onRemove={() => setNotice(null)}
					isDismissible={true}
				>
					{notice.message}
				</Notice>
			)}

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
