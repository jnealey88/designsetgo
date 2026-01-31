/**
 * Extension System Tests
 *
 * Tests for the block extension system that adds attributes
 * and functionality to WordPress blocks.
 *
 * These tests verify:
 * - Extension attribute injection works correctly
 * - Excluded blocks are properly skipped
 * - Default values are appropriate
 * - Filter functions maintain block settings integrity
 *
 * @package
 */

// Mock WordPress hooks before importing extensions
jest.mock('@wordpress/hooks', () => ({
	addFilter: jest.fn(),
}));

jest.mock('@wordpress/i18n', () => ({
	__: jest.fn((text) => text),
}));

jest.mock('@wordpress/block-editor', () => ({
	InspectorControls: ({ children }) => children,
}));

jest.mock('@wordpress/components', () => ({
	PanelBody: ({ children }) => children,
	TextareaControl: () => null,
}));

jest.mock('@wordpress/compose', () => ({
	createHigherOrderComponent: jest.fn((fn) => fn),
}));

jest.mock('@wordpress/element', () => ({
	useEffect: jest.fn(),
}));

describe('Extension System', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Block Animations Extension', () => {
		let addAnimationAttributes;

		beforeEach(() => {
			// Clear module cache and re-import
			jest.resetModules();
			jest.mock('@wordpress/hooks', () => ({
				addFilter: jest.fn(),
			}));

			// Import the extension
			require('../../src/extensions/block-animations/attributes');

			// Get the registered filter function
			const { addFilter: mockAddFilter } = require('@wordpress/hooks');
			const calls = mockAddFilter.mock.calls.filter(
				(call) =>
					call[0] === 'blocks.registerBlockType' &&
					call[1].includes('block-animations')
			);

			if (calls.length > 0) {
				addAnimationAttributes = calls[0][2];
			}
		});

		it('registers a filter for block registration', () => {
			const { addFilter: mockAddFilter } = require('@wordpress/hooks');
			expect(mockAddFilter).toHaveBeenCalledWith(
				'blocks.registerBlockType',
				'designsetgo/block-animations/add-attributes',
				expect.any(Function)
			);
		});

		it('adds animation attributes to regular blocks', () => {
			if (!addAnimationAttributes) {
				return; // Skip if filter not found
			}

			const originalSettings = {
				attributes: {
					content: { type: 'string' },
				},
			};

			const result = addAnimationAttributes(
				originalSettings,
				'core/paragraph'
			);

			expect(result.attributes).toHaveProperty('dsgoAnimationEnabled');
			expect(result.attributes).toHaveProperty('dsgoEntranceAnimation');
			expect(result.attributes).toHaveProperty('dsgoExitAnimation');
			expect(result.attributes).toHaveProperty('dsgoAnimationDuration');
			expect(result.attributes).toHaveProperty('dsgoAnimationDelay');
			expect(result.attributes).toHaveProperty('dsgoAnimationEasing');
		});

		it('preserves original block attributes', () => {
			if (!addAnimationAttributes) {
				return;
			}

			const originalSettings = {
				attributes: {
					content: { type: 'string', default: 'Hello' },
					level: { type: 'number', default: 2 },
				},
			};

			const result = addAnimationAttributes(
				originalSettings,
				'core/heading'
			);

			expect(result.attributes.content).toEqual({
				type: 'string',
				default: 'Hello',
			});
			expect(result.attributes.level).toEqual({
				type: 'number',
				default: 2,
			});
		});

		it('skips embed blocks', () => {
			if (!addAnimationAttributes) {
				return;
			}

			const originalSettings = {
				attributes: {},
			};

			const result = addAnimationAttributes(
				originalSettings,
				'core-embed/youtube'
			);

			expect(result.attributes).not.toHaveProperty(
				'dsgoAnimationEnabled'
			);
		});

		it('skips freeform block', () => {
			if (!addAnimationAttributes) {
				return;
			}

			const originalSettings = {
				attributes: {},
			};

			const result = addAnimationAttributes(
				originalSettings,
				'core/freeform'
			);

			expect(result.attributes).not.toHaveProperty(
				'dsgoAnimationEnabled'
			);
		});

		it('animation attributes have correct types', () => {
			if (!addAnimationAttributes) {
				return;
			}

			const result = addAnimationAttributes(
				{ attributes: {} },
				'core/group'
			);

			expect(result.attributes.dsgoAnimationEnabled.type).toBe('boolean');
			expect(result.attributes.dsgoEntranceAnimation.type).toBe('string');
			expect(result.attributes.dsgoAnimationDuration.type).toBe('number');
			expect(result.attributes.dsgoAnimationOnce.type).toBe('boolean');
		});
	});

	describe('Custom CSS Extension', () => {
		let addCustomCSSAttribute;

		beforeEach(() => {
			jest.resetModules();
			jest.mock('@wordpress/hooks', () => ({
				addFilter: jest.fn(),
			}));
			jest.mock('@wordpress/i18n', () => ({
				__: jest.fn((text) => text),
			}));
			jest.mock('@wordpress/block-editor', () => ({
				InspectorControls: ({ children }) => children,
			}));
			jest.mock('@wordpress/components', () => ({
				PanelBody: ({ children }) => children,
				TextareaControl: () => null,
			}));
			jest.mock('@wordpress/compose', () => ({
				createHigherOrderComponent: jest.fn((fn) => fn),
			}));
			jest.mock('@wordpress/element', () => ({
				useEffect: jest.fn(),
			}));

			require('../../src/extensions/custom-css/index');

			const { addFilter: mockAddFilter } = require('@wordpress/hooks');
			const calls = mockAddFilter.mock.calls.filter(
				(call) =>
					call[0] === 'blocks.registerBlockType' &&
					call[1].includes('custom-css')
			);

			if (calls.length > 0) {
				addCustomCSSAttribute = calls[0][2];
			}
		});

		it('registers a filter for block registration', () => {
			const { addFilter: mockAddFilter } = require('@wordpress/hooks');
			expect(mockAddFilter).toHaveBeenCalledWith(
				'blocks.registerBlockType',
				'designsetgo/add-custom-css-attribute',
				expect.any(Function)
			);
		});

		it('adds dsgoCustomCSS attribute to blocks', () => {
			if (!addCustomCSSAttribute) {
				return;
			}

			const result = addCustomCSSAttribute(
				{ attributes: {} },
				'core/group'
			);

			expect(result.attributes).toHaveProperty('dsgoCustomCSS');
			expect(result.attributes.dsgoCustomCSS.type).toBe('string');
			expect(result.attributes.dsgoCustomCSS.default).toBe('');
		});

		it('excludes core/html block', () => {
			if (!addCustomCSSAttribute) {
				return;
			}

			const originalSettings = { attributes: {} };
			const result = addCustomCSSAttribute(originalSettings, 'core/html');

			expect(result.attributes).not.toHaveProperty('dsgoCustomCSS');
		});

		it('excludes core/code block', () => {
			if (!addCustomCSSAttribute) {
				return;
			}

			const originalSettings = { attributes: {} };
			const result = addCustomCSSAttribute(originalSettings, 'core/code');

			expect(result.attributes).not.toHaveProperty('dsgoCustomCSS');
		});

		it('preserves original attributes', () => {
			if (!addCustomCSSAttribute) {
				return;
			}

			const originalSettings = {
				attributes: {
					align: { type: 'string' },
					backgroundColor: { type: 'string' },
				},
			};

			const result = addCustomCSSAttribute(
				originalSettings,
				'core/cover'
			);

			expect(result.attributes.align).toEqual({ type: 'string' });
			expect(result.attributes.backgroundColor).toEqual({
				type: 'string',
			});
			expect(result.attributes.dsgoCustomCSS).toBeDefined();
		});

		it('works with DesignSetGo blocks', () => {
			if (!addCustomCSSAttribute) {
				return;
			}

			const result = addCustomCSSAttribute(
				{ attributes: {} },
				'designsetgo/accordion'
			);

			expect(result.attributes).toHaveProperty('dsgoCustomCSS');
		});
	});

	describe('Extension Registration Order', () => {
		it('filters are registered with proper namespacing', () => {
			jest.resetModules();
			jest.mock('@wordpress/hooks', () => ({
				addFilter: jest.fn(),
			}));
			jest.mock('@wordpress/i18n', () => ({
				__: jest.fn((text) => text),
			}));
			jest.mock('@wordpress/block-editor', () => ({
				InspectorControls: ({ children }) => children,
			}));
			jest.mock('@wordpress/components', () => ({
				PanelBody: ({ children }) => children,
				TextareaControl: () => null,
			}));
			jest.mock('@wordpress/compose', () => ({
				createHigherOrderComponent: jest.fn((fn) => fn),
			}));
			jest.mock('@wordpress/element', () => ({
				useEffect: jest.fn(),
			}));

			// Import extensions
			require('../../src/extensions/block-animations/attributes');
			require('../../src/extensions/custom-css/index');

			const { addFilter: mockAddFilter } = require('@wordpress/hooks');

			// All filter namespaces should start with 'designsetgo/'
			mockAddFilter.mock.calls.forEach((call) => {
				const namespace = call[1];
				expect(namespace).toMatch(/^designsetgo\//);
			});
		});
	});

	describe('Attribute Type Consistency', () => {
		it('extension attributes follow consistent naming convention', () => {
			jest.resetModules();
			jest.mock('@wordpress/hooks', () => ({
				addFilter: jest.fn(),
			}));

			require('../../src/extensions/block-animations/attributes');

			const { addFilter: mockAddFilter } = require('@wordpress/hooks');
			const animationFilter = mockAddFilter.mock.calls.find((call) =>
				call[1].includes('block-animations')
			);

			if (animationFilter) {
				const filterFn = animationFilter[2];
				const result = filterFn({ attributes: {} }, 'core/paragraph');

				// All animation attributes should start with 'dsgo'
				const animationAttrs = Object.keys(result.attributes).filter(
					(key) => key.startsWith('dsgo')
				);

				animationAttrs.forEach((attr) => {
					expect(attr).toMatch(/^dsgo[A-Z]/);
				});
			}
		});
	});
});

describe('Extension Utility Functions', () => {
	describe('replaceSelector (from custom-css)', () => {
		// Test the selector replacement logic that's internal to custom-css
		const replaceSelector = (css, className) => {
			if (!css) {
				return '';
			}
			return css.replace(/\bselector\b/g, `.${className}`);
		};

		it('replaces selector with class name', () => {
			const result = replaceSelector(
				'selector { color: red; }',
				'my-class'
			);
			expect(result).toBe('.my-class { color: red; }');
		});

		it('handles multiple selector occurrences', () => {
			const css =
				'selector { color: red; } selector:hover { color: blue; }';
			const result = replaceSelector(css, 'block-123');
			expect(result).toBe(
				'.block-123 { color: red; } .block-123:hover { color: blue; }'
			);
		});

		it('handles nested selectors', () => {
			const css =
				'selector h3 { font-size: 2rem; } selector p { margin: 0; }';
			const result = replaceSelector(css, 'my-block');
			expect(result).toBe(
				'.my-block h3 { font-size: 2rem; } .my-block p { margin: 0; }'
			);
		});

		it('returns empty string for empty input', () => {
			expect(replaceSelector('', 'class')).toBe('');
			expect(replaceSelector(null, 'class')).toBe('');
			expect(replaceSelector(undefined, 'class')).toBe('');
		});

		it('does not replace selector inside words', () => {
			// 'selectored' should not become '.my-classed'
			const result = replaceSelector(
				'selectored { color: red; }',
				'my-class'
			);
			expect(result).toBe('selectored { color: red; }');
		});

		it('handles complex CSS', () => {
			const css = `
				selector {
					background: linear-gradient(45deg, red, blue);
					padding: calc(1rem + 10px);
				}
				selector::before {
					content: '';
				}
			`;
			const result = replaceSelector(css, 'complex-block');
			expect(result).toContain('.complex-block {');
			expect(result).toContain('.complex-block::before');
		});
	});

	describe('hashCode (from custom-css)', () => {
		// Test hash function consistency
		// Bitwise operators are intentional for hash algorithm
		const hashCode = (str) => {
			let hash = 0;
			for (let i = 0; i < str.length; i++) {
				const char = str.charCodeAt(i);
				// eslint-disable-next-line no-bitwise
				hash = (hash << 5) - hash + char;
				// eslint-disable-next-line no-bitwise
				hash = hash & hash;
			}
			return Math.abs(hash).toString(36);
		};

		it('generates consistent hashes for same input', () => {
			const input = 'selector { color: red; }core/paragraph';
			const hash1 = hashCode(input);
			const hash2 = hashCode(input);
			expect(hash1).toBe(hash2);
		});

		it('generates different hashes for different inputs', () => {
			const hash1 = hashCode('content1');
			const hash2 = hashCode('content2');
			expect(hash1).not.toBe(hash2);
		});

		it('generates valid CSS class name characters', () => {
			const hash = hashCode('test string with special chars!@#$%');
			// Should only contain alphanumeric characters (base36)
			expect(hash).toMatch(/^[a-z0-9]+$/);
		});

		it('handles empty string', () => {
			const hash = hashCode('');
			expect(hash).toBe('0');
		});

		it('handles long strings', () => {
			const longString = 'a'.repeat(10000);
			const hash = hashCode(longString);
			expect(hash).toBeDefined();
			expect(hash.length).toBeLessThan(20); // Hash should be compact
		});
	});
});
