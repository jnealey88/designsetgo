/**
 * Dashboard Component
 *
 * Overview page with plugin stats and quick links.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Card, CardHeader, CardBody, Spinner } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const Dashboard = () => {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		apiFetch({ path: '/designsetgo/v1/stats' })
			.then((data) => {
				setStats(data);
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div className="designsetgo-admin-loading">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="designsetgo-dashboard">
			<div className="designsetgo-dashboard__header">
				<div className="designsetgo-dashboard__branding">
					<img
						src={window.designSetGoAdmin?.logoUrl}
						alt="DesignSetGo"
						className="designsetgo-logo"
					/>
					<p className="description">
						{__(
							'Manage your DesignSetGo blocks, extensions, and settings.',
							'designsetgo'
						)}
					</p>
				</div>
			</div>

			<div className="designsetgo-dashboard__stats">
				<Card>
					<CardHeader>
						<h2>{__('Plugin Statistics', 'designsetgo')}</h2>
					</CardHeader>
					<CardBody>
						<div className="designsetgo-stats-grid">
							<div className="designsetgo-stat">
								<div className="designsetgo-stat__value">
									{stats?.enabled_blocks || 0}/
									{stats?.total_blocks || 0}
								</div>
								<div className="designsetgo-stat__label">
									{__('Enabled Blocks', 'designsetgo')}
								</div>
							</div>
							<div className="designsetgo-stat">
								<div className="designsetgo-stat__value">
									{stats?.form_submissions || 0}
								</div>
								<div className="designsetgo-stat__label">
									{__('Form Submissions', 'designsetgo')}
								</div>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>

			<div className="designsetgo-dashboard__quick-links">
				<Card>
					<CardHeader>
						<h2>{__('Quick Links', 'designsetgo')}</h2>
					</CardHeader>
					<CardBody>
						<div className="designsetgo-quick-links-grid">
							<a
								href="?page=designsetgo-blocks"
								className="designsetgo-quick-link"
							>
								<span className="dashicons dashicons-layout"></span>
								<h3>{__('Manage Blocks', 'designsetgo')}</h3>
								<p>
									{__(
										'Enable or disable individual blocks and extensions',
										'designsetgo'
									)}
								</p>
							</a>
							<a
								href="?page=edit.php&post_type=dsg_form_submission"
								className="designsetgo-quick-link"
							>
								<span className="dashicons dashicons-feedback"></span>
								<h3>{__('Form Submissions', 'designsetgo')}</h3>
								<p>
									{__(
										'View and manage form submissions',
										'designsetgo'
									)}
								</p>
							</a>
							<a
								href="?page=designsetgo-settings"
								className="designsetgo-quick-link"
							>
								<span className="dashicons dashicons-admin-settings"></span>
								<h3>{__('Settings', 'designsetgo')}</h3>
								<p>
									{__(
										'Configure performance, forms, and security',
										'designsetgo'
									)}
								</p>
							</a>
							<a
								href={`${window.designSetGoAdmin?.siteUrl}/wp-admin/site-editor.php`}
								className="designsetgo-quick-link"
							>
								<span className="dashicons dashicons-admin-appearance"></span>
								<h3>{__('Global Styles', 'designsetgo')}</h3>
								<p>
									{__(
										'Customize colors, typography, and spacing',
										'designsetgo'
									)}
								</p>
							</a>
						</div>
					</CardBody>
				</Card>
			</div>

			<div className="designsetgo-dashboard__info">
				<Card>
					<CardHeader>
						<h2>{__('Getting Started', 'designsetgo')}</h2>
					</CardHeader>
					<CardBody>
						<p>
							{__(
								'DesignSetGo provides 41 powerful blocks and 10 extensions to enhance your WordPress editing experience.',
								'designsetgo'
							)}
						</p>
						<ul>
							<li>
								<strong>
									{__('Container Blocks:', 'designsetgo')}
								</strong>{' '}
								{__(
									'Flex, Grid, and Stack layouts for responsive designs',
									'designsetgo'
								)}
							</li>
							<li>
								<strong>
									{__('UI Elements:', 'designsetgo')}
								</strong>{' '}
								{__(
									'Icons, tabs, accordions, and more',
									'designsetgo'
								)}
							</li>
							<li>
								<strong>
									{__('Interactive Blocks:', 'designsetgo')}
								</strong>{' '}
								{__(
									'Sliders, flip cards, and animations',
									'designsetgo'
								)}
							</li>
							<li>
								<strong>
									{__('Form Builder:', 'designsetgo')}
								</strong>{' '}
								{__(
									'Complete form system with 11 field types',
									'designsetgo'
								)}
							</li>
						</ul>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default Dashboard;
