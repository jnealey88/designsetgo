/**
 * DesignSetGo Admin Dashboard
 *
 * Main entry point for the React-based admin interface.
 *
 * @package
 */

import { createRoot, lazy, Suspense } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import './style.scss';

// Lazy-load page components - only one is shown at a time
const Dashboard = lazy(() =>
	import(/* webpackChunkName: "admin-dashboard" */ './components/Dashboard')
);
const BlocksExtensions = lazy(() =>
	import(
		/* webpackChunkName: "admin-blocks" */ './components/BlocksExtensions'
	)
);
const Settings = lazy(() =>
	import(/* webpackChunkName: "admin-settings" */ './components/Settings')
);

/**
 * Admin App Component
 */
const App = () => {
	const { currentPage } = window.designSetGoAdmin || {};

	// Determine which component to render based on current page
	let Component;
	switch (currentPage) {
		case 'blocks':
			Component = BlocksExtensions;
			break;
		case 'settings':
			Component = Settings;
			break;
		case 'dashboard':
		default:
			Component = Dashboard;
			break;
	}

	return (
		<div className="designsetgo-admin-wrapper">
			<Suspense
				fallback={
					<div className="designsetgo-admin-loading">
						<Spinner />
					</div>
				}
			>
				<Component />
			</Suspense>
		</div>
	);
};

/**
 * Initialize the admin app
 */
document.addEventListener('DOMContentLoaded', () => {
	const rootElement = document.getElementById('designsetgo-admin-root');

	if (rootElement) {
		const root = createRoot(rootElement);
		root.render(<App />);
	}
});
