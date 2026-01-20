/**
 * Settings Component
 *
 * Configure performance, forms, animations, sticky header, and security settings.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Button, Spinner, Notice, TabPanel } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

// Import settings panels
import StickyHeaderPanel from './settings-panels/StickyHeaderPanel';
import PerformancePanel from './settings-panels/PerformancePanel';
import FormsPanel from './settings-panels/FormsPanel';
import AnimationsPanel from './settings-panels/AnimationsPanel';
import SecurityPanel from './settings-panels/SecurityPanel';
import IntegrationsPanel from './settings-panels/IntegrationsPanel';
import DraftModePanel from './settings-panels/DraftModePanel';
import LLMSTxtPanel from './settings-panels/LLMSTxtPanel';

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

	// Auto-dismiss success notices
	useEffect(() => {
		if (notice?.status === 'success') {
			const timer = setTimeout(() => {
				setNotice(null);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [notice]);

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

			<div className="designsetgo-settings-tabs">
				<TabPanel
					className="designsetgo-tab-panel"
					tabs={[
						{
							name: 'features',
							title: __('Features', 'designsetgo'),
							className: 'designsetgo-tab-features',
						},
						{
							name: 'optimization',
							title: __('Optimization', 'designsetgo'),
							className: 'designsetgo-tab-optimization',
						},
						{
							name: 'integrations',
							title: __('Integrations', 'designsetgo'),
							className: 'designsetgo-tab-integrations',
						},
					]}
				>
					{(tab) => (
						<div className="designsetgo-tab-content">
							{tab.name === 'features' && (
								<>
									<StickyHeaderPanel
										settings={settings}
										updateSetting={updateSetting}
									/>
									<DraftModePanel
										settings={settings}
										updateSetting={updateSetting}
									/>
									<FormsPanel
										settings={settings}
										updateSetting={updateSetting}
									/>
									<AnimationsPanel
										settings={settings}
										updateSetting={updateSetting}
									/>
								</>
							)}

							{tab.name === 'optimization' && (
								<>
									<PerformancePanel
										settings={settings}
										updateSetting={updateSetting}
									/>
									<SecurityPanel
										settings={settings}
										updateSetting={updateSetting}
									/>
								</>
							)}

							{tab.name === 'integrations' && (
								<>
									<IntegrationsPanel
										settings={settings}
										updateSetting={updateSetting}
									/>
									<LLMSTxtPanel
										settings={settings}
										updateSetting={updateSetting}
									/>
								</>
							)}
						</div>
					)}
				</TabPanel>
			</div>

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
