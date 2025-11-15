/**
 * Security & Privacy Settings Panel
 *
 * @package DesignSetGo
 */

import { __ } from '@wordpress/i18n';
import {
	Card,
	CardHeader,
	CardBody,
	ToggleControl,
	Notice,
} from '@wordpress/components';

const SecurityPanel = ({ settings, updateSetting }) => {
	return (
		<Card className="designsetgo-settings-panel">
			<CardHeader>
				<h2>{__('Security & Privacy', 'designsetgo')}</h2>
			</CardHeader>
			<CardBody>
				<p className="designsetgo-panel-description">
					{__(
						'Control what data is logged with form submissions. Consider your privacy policy when enabling these options.',
						'designsetgo'
					)}
				</p>

				<Notice status="info" isDismissible={false}>
					{__(
						'These settings affect form submissions only. Consider privacy regulations (GDPR, CCPA) when collecting user data.',
						'designsetgo'
					)}
				</Notice>

				<ToggleControl
					label={__('Log IP Addresses', 'designsetgo')}
					help={__(
						'Store IP addresses with form submissions for spam detection.',
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
						'Store browser user agent strings for analytics and troubleshooting.',
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
						'Store referrer URLs to track where submissions originate.',
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
	);
};

export default SecurityPanel;
