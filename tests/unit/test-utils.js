/**
 * Shared Test Utilities
 *
 * Common utilities and helpers for Jest tests.
 * Import these in your tests to reduce boilerplate.
 *
 * @package
 */

/**
 * Create a mock block settings object for testing filters
 *
 * @param {Object} overrides - Properties to override defaults
 * @return {Object} Mock block settings
 */
export function createMockBlockSettings(overrides = {}) {
	return {
		name: 'test/block',
		title: 'Test Block',
		category: 'common',
		attributes: {},
		supports: {
			html: false,
		},
		...overrides,
	};
}

/**
 * Create a mock block.json configuration
 *
 * @param {Object} overrides - Properties to override defaults
 * @return {Object} Mock block.json config
 */
export function createMockBlockJson(overrides = {}) {
	return {
		$schema: 'https://schemas.wp.org/trunk/block.json',
		apiVersion: 3,
		name: 'designsetgo/test-block',
		version: '1.0.0',
		title: 'Test Block',
		category: 'design',
		description: 'A test block for unit testing purposes.',
		keywords: ['test'],
		textdomain: 'designsetgo',
		attributes: {},
		supports: {
			html: false,
		},
		editorScript: 'file:./index.js',
		...overrides,
	};
}

/**
 * Create mock WordPress block props
 *
 * @param {Object} overrides - Properties to override defaults
 * @return {Object} Mock block props
 */
export function createMockBlockProps(overrides = {}) {
	return {
		name: 'designsetgo/test-block',
		clientId: 'test-client-id-123',
		className: 'wp-block-designsetgo-test-block',
		attributes: {},
		setAttributes: jest.fn(),
		isSelected: false,
		...overrides,
	};
}

/**
 * Create mock responsive values object
 *
 * @param {Object} values - Values for each breakpoint
 * @return {Object} Responsive values object
 */
export function createResponsiveValues(values = {}) {
	return {
		desktop: values.desktop ?? null,
		tablet: values.tablet ?? null,
		mobile: values.mobile ?? null,
	};
}

/**
 * Create mock spacing values object
 *
 * @param {Object} values - Values for each side
 * @return {Object} Spacing values object
 */
export function createSpacingValues(values = {}) {
	return {
		top: values.top ?? null,
		right: values.right ?? null,
		bottom: values.bottom ?? null,
		left: values.left ?? null,
	};
}

/**
 * Wait for async operations in tests
 *
 * @param {number} ms - Milliseconds to wait
 * @return {Promise} Resolves after delay
 */
export function wait(ms = 0) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a mock WordPress hooks addFilter function that captures registrations
 *
 * @return {Object} Object with mock and getRegistrations method
 */
export function createFilterCapture() {
	const registrations = [];

	const mockAddFilter = jest.fn(
		(hookName, namespace, callback, priority = 10) => {
			registrations.push({ hookName, namespace, callback, priority });
		}
	);

	return {
		mock: mockAddFilter,
		getRegistrations: () => [...registrations],
		getByHook: (hookName) =>
			registrations.filter((r) => r.hookName === hookName),
		getByNamespace: (namespace) =>
			registrations.filter((r) => r.namespace.includes(namespace)),
		clear: () => {
			registrations.length = 0;
			mockAddFilter.mockClear();
		},
	};
}

/**
 * Validate that an attribute config follows WordPress block API conventions
 *
 * @param {Object} attrConfig - Attribute configuration object
 * @param {string} attrName   - Attribute name for error messages
 * @return {Object} Validation result with isValid and errors array
 */
export function validateAttributeConfig(attrConfig, attrName = 'attribute') {
	const errors = [];
	const validTypes = [
		'string',
		'number',
		'boolean',
		'object',
		'array',
		'integer',
		'null',
	];

	if (!attrConfig) {
		errors.push(`${attrName}: config is undefined`);
		return { isValid: false, errors };
	}

	if (attrConfig.type && !validTypes.includes(attrConfig.type)) {
		errors.push(`${attrName}: invalid type '${attrConfig.type}'`);
	}

	if (attrConfig.enum && !Array.isArray(attrConfig.enum)) {
		errors.push(`${attrName}: enum must be an array`);
	}

	if (attrConfig.enum && attrConfig.default !== undefined) {
		if (!attrConfig.enum.includes(attrConfig.default)) {
			errors.push(`${attrName}: default value not in enum`);
		}
	}

	if (attrConfig.type === 'boolean' && attrConfig.default !== undefined) {
		if (typeof attrConfig.default !== 'boolean') {
			errors.push(
				`${attrName}: boolean attribute has non-boolean default`
			);
		}
	}

	if (attrConfig.type === 'number' && attrConfig.default !== undefined) {
		if (typeof attrConfig.default !== 'number') {
			errors.push(`${attrName}: number attribute has non-number default`);
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}

/**
 * CSS assertion helpers
 */
export const cssAssertions = {
	/**
	 * Check if CSS string contains a valid rule
	 *
	 * @param {string} css      - CSS string to check.
	 * @param {string} selector - CSS selector.
	 * @param {string} property - CSS property name.
	 * @return {boolean} Whether the rule exists.
	 */
	containsRule: (css, selector, property) => {
		const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const escapedProperty = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const regex = new RegExp(
			`${escapedSelector}[^{]*\\{[^}]*${escapedProperty}[^}]*\\}`
		);
		return regex.test(css);
	},

	/**
	 * Check if CSS contains a media query
	 *
	 * @param {string} css  - CSS string to check.
	 * @param {string} type - Media query type or 'any'.
	 * @return {boolean} Whether the media query exists.
	 */
	containsMediaQuery: (css, type = 'any') => {
		if (type === 'any') {
			return css.includes('@media');
		}
		return css.includes(`@media (${type}`);
	},

	/**
	 * Extract all selectors from CSS string
	 *
	 * @param {string} css - CSS string to parse.
	 * @return {Array} Array of selector strings.
	 */
	extractSelectors: (css) => {
		const matches = css.match(/([^{]+)\s*\{/g) || [];
		return matches.map((m) => m.replace(/\s*\{$/, '').trim());
	},
};

/**
 * Block test data generators
 */
export const blockTestData = {
	/**
	 * Generate test cases for common attribute types
	 */
	attributeTestCases: {
		string: [
			{ input: '', expected: '' },
			{ input: 'simple text', expected: 'simple text' },
			{
				input: 'text with <script>xss</script>',
				expected: 'text with xss',
			},
		],
		number: [
			{ input: 0, expected: 0 },
			{ input: 100, expected: 100 },
			{ input: -50, expected: -50 },
			{ input: 1.5, expected: 1.5 },
		],
		boolean: [
			{ input: true, expected: true },
			{ input: false, expected: false },
		],
	},

	/**
	 * Common CSS values for testing
	 */
	cssValues: {
		validSizes: ['10px', '1rem', '50%', 'auto', 'calc(100% - 20px)'],
		invalidSizes: [
			'javascript:alert(1)',
			'<script>bad</script>',
			'expression()',
		],
		validColors: [
			'#fff',
			'#ffffff',
			'rgb(255, 0, 0)',
			'var(--wp--preset--color--primary)',
		],
		invalidColors: ['url(bad)', 'expression()', 'var(--evil)'],
	},
};
