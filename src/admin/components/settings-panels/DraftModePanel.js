/**
 * Draft Mode Settings Panel
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

const DraftModePanel = ({ settings, updateSetting }) => {
	return (
		<Card className="designsetgo-settings-panel">
			<CardHeader>
				<h2>{__('Draft Mode', 'designsetgo')}</h2>
			</CardHeader>
			<CardBody>
				<p className="designsetgo-panel-description">
					{__(
						'Configure draft mode for safely editing published pages without affecting the live site.',
						'designsetgo'
					)}
				</p>

				<div className="designsetgo-settings-section">
					<h3 className="designsetgo-section-heading">
						{__('General', 'designsetgo')}
					</h3>

					<ToggleControl
						label={__('Enable Draft Mode', 'designsetgo')}
						help={__(
							'Allow creating draft versions of published pages for safe editing.',
							'designsetgo'
						)}
						checked={settings?.draft_mode?.enable ?? true}
						onChange={(value) =>
							updateSetting('draft_mode', 'enable', value)
						}
						__nextHasNoMarginBottom
					/>
				</div>

				{settings?.draft_mode?.enable && (
					<>
						<div className="designsetgo-settings-section">
							<h3 className="designsetgo-section-heading">
								{__('Auto-Save', 'designsetgo')}
							</h3>

							<ToggleControl
								label={__(
									'Enable Auto-Save by Default',
									'designsetgo'
								)}
								help={__(
									'Automatically save drafts at regular intervals. Users can override this per-draft.',
									'designsetgo'
								)}
								checked={
									settings?.draft_mode?.auto_save_enabled ??
									true
								}
								onChange={(value) =>
									updateSetting(
										'draft_mode',
										'auto_save_enabled',
										value
									)
								}
								__nextHasNoMarginBottom
							/>

							{settings?.draft_mode?.auto_save_enabled && (
								<RangeControl
									label={__(
										'Default Auto-Save Interval (seconds)',
										'designsetgo'
									)}
									help={__(
										'How often drafts are automatically saved. Users can adjust this per-draft.',
										'designsetgo'
									)}
									value={
										settings?.draft_mode
											?.auto_save_interval || 60
									}
									onChange={(value) =>
										updateSetting(
											'draft_mode',
											'auto_save_interval',
											value
										)
									}
									min={10}
									max={300}
									step={10}
									marks={[
										{
											value: 10,
											label: __('10s', 'designsetgo'),
										},
										{
											value: 60,
											label: __('60s', 'designsetgo'),
										},
										{
											value: 120,
											label: __('2m', 'designsetgo'),
										},
										{
											value: 300,
											label: __('5m', 'designsetgo'),
										},
									]}
									__nextHasNoMarginBottom
									__next40pxDefaultSize
								/>
							)}
						</div>

						<div className="designsetgo-settings-section">
							<h3 className="designsetgo-section-heading">
								{__('Admin Interface', 'designsetgo')}
							</h3>

							<ToggleControl
								label={__(
									'Show Page List Actions',
									'designsetgo'
								)}
								help={__(
									'Display "Create Draft" and "Edit Draft" links in the Pages list.',
									'designsetgo'
								)}
								checked={
									settings?.draft_mode
										?.show_page_list_actions ?? true
								}
								onChange={(value) =>
									updateSetting(
										'draft_mode',
										'show_page_list_actions',
										value
									)
								}
								__nextHasNoMarginBottom
							/>

							<ToggleControl
								label={__(
									'Show Draft Status Column',
									'designsetgo'
								)}
								help={__(
									'Display a "Draft Status" column in the Pages list.',
									'designsetgo'
								)}
								checked={
									settings?.draft_mode
										?.show_page_list_column ?? true
								}
								onChange={(value) =>
									updateSetting(
										'draft_mode',
										'show_page_list_column',
										value
									)
								}
								__nextHasNoMarginBottom
							/>
						</div>
					</>
				)}
			</CardBody>
		</Card>
	);
};

export default DraftModePanel;
