/**
 * Cleanup Teardown for Playwright Tests
 *
 * This file handles cleanup after all tests complete.
 */

const { test as teardown } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

teardown('cleanup test data', async ({ }) => {
	// Clean up storage state
	const storageStatePath = process.env.STORAGE_STATE_PATH || path.join(
		process.cwd(),
		'artifacts/storage-states/admin.json'
	);

	if (fs.existsSync(storageStatePath)) {
		fs.unlinkSync(storageStatePath);
		console.log('✓ Cleaned up authentication state');
	}

	// Additional cleanup can be added here
	// For example: delete test posts, clean up database, etc.
});
