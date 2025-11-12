/**
 * Lazy Icon Library Loader
 *
 * Provides on-demand loading of the icon library (svg-icons.js) to avoid
 * loading 50KB (12.7KB gzipped) of icons when they're not needed.
 *
 * Usage:
 * import { getIconLazy } from '@/utils/lazy-icon-library';
 *
 * const MyComponent = () => {
 *   const [icon, setIcon] = useState(null);
 *
 *   useEffect(() => {
 *     getIconLazy('star', 24, 24).then(setIcon);
 *   }, []);
 *
 *   return icon;
 * };
 */

// Cache the loaded icon library module
let iconLibraryPromise = null;

/**
 * Lazy load the icon library module.
 *
 * @return {Promise} Promise that resolves to the icon library module.
 */
export async function loadIconLibrary() {
	if (!iconLibraryPromise) {
		// Dynamic import - webpack will code-split this automatically
		// The icon library is already extracted as 'shared-icon-library' chunk
		iconLibraryPromise = import(
			/* webpackChunkName: "shared-icon-library" */
			'../blocks/icon/utils/svg-icons'
		);
	}
	return iconLibraryPromise;
}

/**
 * Get an icon SVG element (lazy loaded).
 *
 * @param {string} iconName - Name of the icon (e.g., 'star', 'heart').
 * @param {number} width    - Icon width in pixels.
 * @param {number} height   - Icon height in pixels.
 * @param {string} color    - Optional icon color.
 * @return {Promise<JSX.Element|null>} Promise that resolves to the icon element.
 */
export async function getIconLazy(iconName, width = 24, height = 24, color) {
	try {
		const { getIcon } = await loadIconLibrary();
		return getIcon(iconName, width, height, color);
	} catch (error) {
		console.error('Failed to load icon library:', error);
		return null;
	}
}

/**
 * Get all available icons (lazy loaded).
 *
 * @return {Promise<Object>} Promise that resolves to the icons object.
 */
export async function getAllIconsLazy() {
	try {
		const { icons } = await loadIconLibrary();
		return icons;
	} catch (error) {
		console.error('Failed to load icon library:', error);
		return {};
	}
}

/**
 * React hook for lazy loading an icon.
 *
 * @param {string} iconName - Name of the icon.
 * @param {number} width    - Icon width.
 * @param {number} height   - Icon height.
 * @param {string} color    - Icon color.
 * @return {JSX.Element|null} The icon element or null while loading.
 */
export function useLazyIcon(iconName, width = 24, height = 24, color) {
	const [icon, setIcon] = React.useState(null);

	React.useEffect(() => {
		if (iconName) {
			getIconLazy(iconName, width, height, color).then(setIcon);
		}
	}, [iconName, width, height, color]);

	return icon;
}
