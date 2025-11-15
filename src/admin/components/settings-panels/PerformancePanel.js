/**
 * Performance Settings Panel
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

const PerformancePanel = ({ settings, updateSetting }) => {
	return (
		<Card className="designsetgo-settings-panel">
			<CardHeader>
				<h2>{__('Performance', 'designsetgo')}</h2>
			</CardHeader>
			<CardBody>
				<p className="designsetgo-panel-description">
					{__(
						'Optimize asset loading and caching to improve site performance.',
						'designsetgo'
					)}
				</p>

				<ToggleControl
					label={__('Conditional Asset Loading', 'designsetgo')}
					help={__(
						'Load block assets only on pages that use them. Recommended for better performance.',
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
						'How long to cache block detection results. Lower values use more resources but detect changes faster.',
						'designsetgo'
					)}
					value={settings?.performance?.cache_duration || 3600}
					onChange={(value) =>
						updateSetting('performance', 'cache_duration', value)
					}
					min={0}
					max={86400}
					step={300}
					marks={[
						{ value: 0, label: __('Off', 'designsetgo') },
						{ value: 3600, label: __('1h', 'designsetgo') },
						{ value: 21600, label: __('6h', 'designsetgo') },
						{ value: 86400, label: __('24h', 'designsetgo') },
					]}
					__nextHasNoMarginBottom
					__next40pxDefaultSize
				/>
			</CardBody>
		</Card>
	);
};

export default PerformancePanel;
