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

// Mock browser APIs not implemented in JSDOM
window.scrollTo = jest.fn();
window.scroll = jest.fn();

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: jest.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(),
		removeListener: jest.fn(),
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
	constructor() {
		this.observe = jest.fn();
		this.unobserve = jest.fn();
		this.disconnect = jest.fn();
	}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
	constructor() {
		this.observe = jest.fn();
		this.unobserve = jest.fn();
		this.disconnect = jest.fn();
	}
};
