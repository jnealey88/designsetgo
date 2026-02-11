/**
 * Shared Icon Utilities
 *
 * Re-exports icon utilities for use by blocks that need icon functionality
 * (e.g., divider, icon-list) without importing from icon block internals.
 *
 * @since 2.0.0
 */

export {
	getIcon,
	getIconNames,
	resolveIconName,
	getIconAliases,
} from '../icon/utils/svg-icons';
export { IconPicker } from '../icon/components/IconPicker';
