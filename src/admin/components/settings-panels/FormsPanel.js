/**
 * Forms Settings Panel
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import {
	Card,
	CardHeader,
	CardBody,
	ToggleControl,
	RangeControl,
} from '@wordpress/components';

const FormsPanel = ({ settings, updateSetting }) => {
	return (
		<Card className="designsetgo-settings-panel">
			<CardHeader>
				<h2>{__('Forms', 'designsetgo')}</h2>
			</CardHeader>
			<CardBody>
				<p className="designsetgo-panel-description">
					{__(
						'Configure security and data retention for form submissions.',
						'designsetgo'
					)}
				</p>

				<div className="designsetgo-settings-section">
					<h3 className="designsetgo-section-heading">
						{__('Security', 'designsetgo')}
					</h3>

					<ToggleControl
						label={__('Enable Honeypot', 'designsetgo')}
						help={__(
							'Add a hidden field to detect spam bots. Recommended.',
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
							'Prevent spam by limiting submission frequency from the same IP.',
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
				</div>

				<div className="designsetgo-settings-section">
					<h3 className="designsetgo-section-heading">
						{__('Data Management', 'designsetgo')}
					</h3>

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
						marks={[
							{ value: 0, label: __('Forever', 'designsetgo') },
							{ value: 30, label: __('30d', 'designsetgo') },
							{ value: 90, label: __('90d', 'designsetgo') },
							{ value: 365, label: __('1yr', 'designsetgo') },
						]}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</div>
			</CardBody>
		</Card>
	);
};

export default FormsPanel;
