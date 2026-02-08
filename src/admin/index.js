/**
 * DesignSetGo Admin Dashboard
 *
 * Main entry point for the React-based admin interface.
 *
 * @package
 */

import { createRoot, lazy, Suspense, Component } from '@wordpress/element';
import { Spinner, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './style.scss';

/**
 * Error boundary for lazy-loaded admin components
 */
class AdminErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="designsetgo-admin-error">
					<p>
						{__(
							'Something went wrong loading this page.',
							'designsetgo'
						)}
					</p>
					<Button
						variant="secondary"
						onClick={() => window.location.reload()}
					>
						{__('Reload Page', 'designsetgo')}
					</Button>
				</div>
			);
		}
		return this.props.children;
	}
}

// Lazy-load page components - only one is shown at a time
const Dashboard = lazy(
	() =>
		import(
			/* webpackChunkName: "admin-dashboard" */ './components/Dashboard'
		)
);
const BlocksExtensions = lazy(
	() =>
		import(
			/* webpackChunkName: "admin-blocks" */ './components/BlocksExtensions'
		)
);
const Settings = lazy(
	() =>
		import(/* webpackChunkName: "admin-settings" */ './components/Settings')
);

/**
 * Admin App Component
 */
const App = () => {
	const { currentPage } = window.designSetGoAdmin || {};

	// Determine which component to render based on current page
	let PageComponent;
	switch (currentPage) {
		case 'blocks':
			PageComponent = BlocksExtensions;
			break;
		case 'settings':
			PageComponent = Settings;
			break;
		case 'dashboard':
		default:
			PageComponent = Dashboard;
			break;
	}

	return (
		<div className="designsetgo-admin-wrapper">
			<AdminErrorBoundary>
				<Suspense
					fallback={
						<div className="designsetgo-admin-loading">
							<Spinner />
						</div>
					}
				>
					<PageComponent />
				</Suspense>
			</AdminErrorBoundary>
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
