/**
 * DesignSetGo Admin Dashboard
 *
 * Main entry point for the React-based admin interface.
 *
 * @package
 */

import { createRoot } from '@wordpress/element';
import Dashboard from './components/Dashboard';
import BlocksExtensions from './components/BlocksExtensions';
import Settings from './components/Settings';
import './style.scss';

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
			<Component />
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
