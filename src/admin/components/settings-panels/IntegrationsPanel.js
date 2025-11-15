/**
 * Integrations Settings Panel
 *
 * @package DesignSetGo
 */

import { __ } from '@wordpress/i18n';
import {
	Card,
	CardHeader,
	CardBody,
	TextControl,
	ExternalLink,
} from '@wordpress/components';

const IntegrationsPanel = ({ settings, updateSetting }) => {
	return (
		<Card className="designsetgo-settings-panel">
			<CardHeader>
				<h2>{__('Integrations', 'designsetgo')}</h2>
			</CardHeader>
			<CardBody>
				<p className="designsetgo-panel-description">
					{__(
						'Configure third-party service API keys and credentials.',
						'designsetgo'
					)}
				</p>

				<div className="designsetgo-settings-section">
					<h3 className="designsetgo-section-heading">
						{__('Google Maps', 'designsetgo')}
					</h3>

					<TextControl
						label={__('Google Maps API Key', 'designsetgo')}
						help={
							<>
								{__(
									'Enter your Google Maps JavaScript API key. ',
									'designsetgo'
								)}
								<ExternalLink href="https://console.cloud.google.com/apis/credentials">
									{__(
										'Get your API key from Google Cloud Console',
										'designsetgo'
									)}
								</ExternalLink>
							</>
						}
						type="password"
						value={
							settings?.integrations?.google_maps_api_key || ''
						}
						onChange={(value) =>
							updateSetting(
								'integrations',
								'google_maps_api_key',
								value
							)
						}
						placeholder={__('AIza...', 'designsetgo')}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>

					<div className="designsetgo-settings-note">
						<strong>
							{__(
								'⚠️ Important Security Notice:',
								'designsetgo'
							)}
						</strong>
						<p>
							{__(
								'Always configure HTTP referrer restrictions in the Google Cloud Console to prevent unauthorized use of your API key. This is critical for security and preventing unexpected charges.',
								'designsetgo'
							)}
						</p>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default IntegrationsPanel;
