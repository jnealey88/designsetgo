/**
 * Jest Setup File
 *
 * This file runs before all tests and sets up the testing environment.
 *
 * @package
 */

// Add custom matchers if needed
// import '@testing-library/jest-dom';

// Mock WordPress global functions if they're not already mocked by @wordpress/scripts
global.wp = global.wp || {};

// Mock common WordPress functions
global.__ = jest.fn((text) => text);
global._x = jest.fn((text) => text);
global._n = jest.fn((single, plural, number) =>
	number === 1 ? single : plural
);
global.sprintf = jest.fn((format) => format);

// Mock console methods in tests (optional)
// global.console = {
//   ...console,
//   error: jest.fn(),
//   warning: jest.fn(),
// };

// Set up any global test utilities
global.testUtils = {
	// Add common test utilities here
};
