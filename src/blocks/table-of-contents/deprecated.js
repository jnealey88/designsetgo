/**
 * Table of Contents Block - Deprecations
 *
 * Handles backward compatibility for block schema changes.
 *
 * IMPORTANT: Add new deprecations to the TOP of the array.
 * WordPress will try them in order until one matches.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-deprecation/
 */

// Example deprecation (v1):
// If you change attributes or save structure in the future, uncomment and modify:
/*
const v1 = {
    attributes: {
        // Copy ORIGINAL attributes here (before change)
        scrollOffset: {
            type: 'number',
            default: 150, // Original default
        },
        // ... other original attributes
    },
    save: ({ attributes }) => {
        // Copy ORIGINAL save function here (before change)
        // This must match the HTML that was saved with the old version
    },
    migrate: (attributes) => {
        // Transform old attributes to new format
        return {
            ...attributes,
            // Example: If you changed scrollOffset default to 0,
            // but want to preserve user's existing value:
            scrollOffset: attributes.scrollOffset ?? 150,
        };
    },
};
*/

// Export array of deprecations (newest first)
export default [
	// v1, // Add deprecations here when needed
];
