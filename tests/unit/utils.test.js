/**
 * Utility Functions Tests
 *
 * Tests for common utility functions used across the plugin.
 *
 * @package
 */

import {
	shouldExtendBlock,
	clearExclusionCache,
} from '../../src/utils/should-extend-block';
import { convertPresetToCSSVar } from '../../src/utils/convert-preset-to-css-var';

describe('Utility Functions', () => {
	describe('classNames helper', () => {
		const classNames = (...classes) => {
			return classes.filter(Boolean).join(' ');
		};

		test('combines multiple class names', () => {
			const result = classNames('class-1', 'class-2', 'class-3');
			expect(result).toBe('class-1 class-2 class-3');
		});

		test('filters out falsy values', () => {
			const result = classNames(
				'class-1',
				false,
				'class-2',
				null,
				undefined,
				'class-3'
			);
			expect(result).toBe('class-1 class-2 class-3');
		});

		test('handles conditional classes', () => {
			const isActive = true;
			const isDisabled = false;

			const result = classNames(
				'button',
				isActive && 'active',
				isDisabled && 'disabled'
			);
			expect(result).toBe('button active');
		});

		test('returns empty string for no valid classes', () => {
			const result = classNames(false, null, undefined);
			expect(result).toBe('');
		});
	});

	describe('debounce helper', () => {
		const debounce = (func, wait) => {
			let timeout;
			return (...args) => {
				clearTimeout(timeout);
				timeout = setTimeout(() => func(...args), wait);
			};
		};

		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		test('delays function execution', () => {
			const func = jest.fn();
			const debouncedFunc = debounce(func, 100);

			debouncedFunc();
			expect(func).not.toHaveBeenCalled();

			jest.advanceTimersByTime(100);
			expect(func).toHaveBeenCalledTimes(1);
		});

		test('cancels previous calls', () => {
			const func = jest.fn();
			const debouncedFunc = debounce(func, 100);

			debouncedFunc();
			debouncedFunc();
			debouncedFunc();

			jest.advanceTimersByTime(100);
			expect(func).toHaveBeenCalledTimes(1);
		});
	});

	describe('sanitize functions', () => {
		test('sanitizes HTML', () => {
			const sanitizeHTML = (html) => {
				const temp = document.createElement('div');
				temp.textContent = html;
				return temp.innerHTML;
			};

			const input = '<script>alert("XSS")</script>';
			const result = sanitizeHTML(input);

			expect(result).not.toContain('<script>');
			expect(result).toContain('&lt;script&gt;');
		});

		test('sanitizes class name', () => {
			const sanitizeClassName = (className) => {
				return className
					.toLowerCase()
					.replace(/[^a-z0-9-_]/g, '-')
					.replace(/-+/g, '-')
					.replace(/^-|-$/g, '');
			};

			expect(sanitizeClassName('My Class Name')).toBe('my-class-name');
			expect(sanitizeClassName('class__name')).toBe('class__name');
			expect(sanitizeClassName('123-class')).toBe('123-class');
			expect(sanitizeClassName('invalid@#$class')).toBe('invalid-class');
		});
	});

	describe('responsive value helpers', () => {
		test('gets responsive value for breakpoint', () => {
			const getResponsiveValue = (values, breakpoint) => {
				return values[breakpoint] || values.default;
			};

			const values = {
				default: '1fr 1fr',
				tablet: '1fr',
				mobile: '1fr',
			};

			expect(getResponsiveValue(values, 'desktop')).toBe('1fr 1fr');
			expect(getResponsiveValue(values, 'tablet')).toBe('1fr');
			expect(getResponsiveValue(values, 'mobile')).toBe('1fr');
		});

		test('converts breakpoint to CSS media query', () => {
			const getMediaQuery = (breakpoint) => {
				const breakpoints = {
					mobile: '(max-width: 767px)',
					tablet: '(min-width: 768px) and (max-width: 1023px)',
					desktop: '(min-width: 1024px)',
				};
				return breakpoints[breakpoint] || '';
			};

			expect(getMediaQuery('mobile')).toBe('(max-width: 767px)');
			expect(getMediaQuery('tablet')).toBe(
				'(min-width: 768px) and (max-width: 1023px)'
			);
			expect(getMediaQuery('desktop')).toBe('(min-width: 1024px)');
		});
	});

	describe('convertPresetToCSSVar', () => {
		test('converts preset format to CSS variable', () => {
			expect(convertPresetToCSSVar('var:preset|spacing|md')).toBe(
				'var(--wp--preset--spacing--md)'
			);
		});

		test('converts preset with different categories', () => {
			expect(convertPresetToCSSVar('var:preset|color|primary')).toBe(
				'var(--wp--preset--color--primary)'
			);
			expect(convertPresetToCSSVar('var:preset|font-size|large')).toBe(
				'var(--wp--preset--font-size--large)'
			);
		});

		test('returns existing CSS variable as-is', () => {
			expect(
				convertPresetToCSSVar('var(--wp--preset--spacing--md)')
			).toBe('var(--wp--preset--spacing--md)');
		});

		test('returns plain value as-is', () => {
			expect(convertPresetToCSSVar('16px')).toBe('16px');
			expect(convertPresetToCSSVar('1.5rem')).toBe('1.5rem');
		});

		test('returns undefined for falsy values', () => {
			expect(convertPresetToCSSVar(undefined)).toBeUndefined();
			expect(convertPresetToCSSVar(null)).toBeUndefined();
			expect(convertPresetToCSSVar('')).toBeUndefined();
			expect(convertPresetToCSSVar(0)).toBeUndefined();
		});

		test('handles object format with top value', () => {
			expect(
				convertPresetToCSSVar({
					top: 'var:preset|spacing|md',
					left: 'var:preset|spacing|lg',
				})
			).toBe('var(--wp--preset--spacing--md)');
		});

		test('handles object format falling back to left value', () => {
			expect(
				convertPresetToCSSVar({
					top: '',
					left: 'var:preset|spacing|lg',
				})
			).toBe('var(--wp--preset--spacing--lg)');
		});

		test('returns undefined for empty object', () => {
			expect(convertPresetToCSSVar({})).toBeUndefined();
			expect(
				convertPresetToCSSVar({ top: '', left: '' })
			).toBeUndefined();
		});

		test('converts non-string values to string', () => {
			expect(convertPresetToCSSVar(42)).toBe('42');
		});
	});

	describe('shouldExtendBlock', () => {
		let originalDsgoSettings;

		beforeEach(() => {
			// Store original window.dsgoSettings
			originalDsgoSettings = window.dsgoSettings;
		});

		afterEach(() => {
			// Restore original window.dsgoSettings
			window.dsgoSettings = originalDsgoSettings;
			// Clear cache to prevent test interference
			clearExclusionCache();
		});

		test('returns true when dsgoSettings is undefined', () => {
			delete window.dsgoSettings;
			expect(shouldExtendBlock('core/paragraph')).toBe(true);
		});

		test('returns true when excludedBlocks is undefined', () => {
			window.dsgoSettings = {};
			expect(shouldExtendBlock('core/paragraph')).toBe(true);
		});

		test('returns true when excludedBlocks is empty', () => {
			window.dsgoSettings = { excludedBlocks: [] };
			expect(shouldExtendBlock('core/paragraph')).toBe(true);
		});

		test('returns false for exact block name match', () => {
			window.dsgoSettings = {
				excludedBlocks: ['gravityforms/form', 'mailpoet/form'],
			};
			expect(shouldExtendBlock('gravityforms/form')).toBe(false);
			expect(shouldExtendBlock('mailpoet/form')).toBe(false);
		});

		test('returns true for non-matching block name', () => {
			window.dsgoSettings = {
				excludedBlocks: ['gravityforms/form'],
			};
			expect(shouldExtendBlock('core/paragraph')).toBe(true);
			expect(shouldExtendBlock('woocommerce/product')).toBe(true);
		});

		test('returns false for namespace wildcard match', () => {
			window.dsgoSettings = {
				excludedBlocks: ['gravityforms/*', 'mailpoet/*'],
			};
			expect(shouldExtendBlock('gravityforms/form')).toBe(false);
			expect(shouldExtendBlock('gravityforms/confirmation')).toBe(false);
			expect(shouldExtendBlock('mailpoet/form')).toBe(false);
		});

		test('returns true for non-matching namespace wildcard', () => {
			window.dsgoSettings = {
				excludedBlocks: ['gravityforms/*'],
			};
			expect(shouldExtendBlock('woocommerce/product')).toBe(true);
			expect(shouldExtendBlock('core/paragraph')).toBe(true);
		});

		test('handles mixed exact and wildcard exclusions', () => {
			window.dsgoSettings = {
				excludedBlocks: [
					'gravityforms/*',
					'woocommerce/product',
					'mailpoet/*',
				],
			};
			// Wildcard matches
			expect(shouldExtendBlock('gravityforms/form')).toBe(false);
			expect(shouldExtendBlock('gravityforms/confirmation')).toBe(false);
			expect(shouldExtendBlock('mailpoet/form')).toBe(false);

			// Exact match
			expect(shouldExtendBlock('woocommerce/product')).toBe(false);

			// Non-matches
			expect(shouldExtendBlock('woocommerce/cart')).toBe(true);
			expect(shouldExtendBlock('core/paragraph')).toBe(true);
		});

		test('handles block names without namespace separator', () => {
			window.dsgoSettings = {
				excludedBlocks: ['gravityforms/*'],
			};
			// Block name without '/' should not crash
			expect(shouldExtendBlock('invalidblockname')).toBe(true);
		});

		test('handles empty block name', () => {
			window.dsgoSettings = {
				excludedBlocks: ['gravityforms/*'],
			};
			expect(shouldExtendBlock('')).toBe(true);
		});

		test('case-sensitive matching', () => {
			window.dsgoSettings = {
				excludedBlocks: ['gravityforms/form'],
			};
			// WordPress block names are case-sensitive
			expect(shouldExtendBlock('GravityForms/Form')).toBe(true);
			expect(shouldExtendBlock('gravityforms/form')).toBe(false);
		});

		test('caches results for performance', () => {
			window.dsgoSettings = {
				excludedBlocks: ['gravityforms/form'],
			};

			// First call - not cached
			const firstResult = shouldExtendBlock('core/paragraph');
			expect(firstResult).toBe(true);

			// Second call - should return cached result
			const secondResult = shouldExtendBlock('core/paragraph');
			expect(secondResult).toBe(true);

			// Verify cache works for excluded blocks too
			expect(shouldExtendBlock('gravityforms/form')).toBe(false);
			expect(shouldExtendBlock('gravityforms/form')).toBe(false);
		});

		test('clearExclusionCache clears the cache', () => {
			window.dsgoSettings = {
				excludedBlocks: ['gravityforms/form'],
			};

			// Cache a result
			expect(shouldExtendBlock('core/paragraph')).toBe(true);

			// Clear cache
			clearExclusionCache();

			// Change settings
			window.dsgoSettings = {
				excludedBlocks: ['core/paragraph'],
			};

			// Should reflect new settings (not cached value)
			expect(shouldExtendBlock('core/paragraph')).toBe(false);
		});
	});
});
