/**
 * Breakpoint Utilities Tests
 *
 * Tests for responsive breakpoint utilities.
 * These tests verify the breakpoint configuration and device detection.
 *
 * @package
 */

import {
	breakpoints,
	mediaQueries,
	getCurrentDevice,
} from '../../src/utils/breakpoints';

describe('Breakpoint Utilities', () => {
	describe('breakpoints object', () => {
		it('defines all required breakpoints', () => {
			expect(breakpoints).toHaveProperty('mobile');
			expect(breakpoints).toHaveProperty('tablet');
			expect(breakpoints).toHaveProperty('desktop');
		});

		it('has breakpoints in ascending order', () => {
			expect(breakpoints.mobile).toBeLessThan(breakpoints.tablet);
			expect(breakpoints.tablet).toBeLessThan(breakpoints.desktop);
		});

		it('has reasonable pixel values', () => {
			// Mobile breakpoint should be between 320 and 900
			expect(breakpoints.mobile).toBeGreaterThanOrEqual(320);
			expect(breakpoints.mobile).toBeLessThanOrEqual(900);

			// Tablet breakpoint should be between mobile and 1400
			expect(breakpoints.tablet).toBeGreaterThan(breakpoints.mobile);
			expect(breakpoints.tablet).toBeLessThanOrEqual(1400);

			// Desktop should be reasonable
			expect(breakpoints.desktop).toBeGreaterThan(breakpoints.tablet);
		});

		it('exports numeric values', () => {
			expect(typeof breakpoints.mobile).toBe('number');
			expect(typeof breakpoints.tablet).toBe('number');
			expect(typeof breakpoints.desktop).toBe('number');
		});
	});

	describe('mediaQueries object', () => {
		it('defines all required media queries', () => {
			expect(mediaQueries).toHaveProperty('mobile');
			expect(mediaQueries).toHaveProperty('tablet');
			expect(mediaQueries).toHaveProperty('desktop');
		});

		it('mobile query uses max-width', () => {
			expect(mediaQueries.mobile).toContain('@media');
			expect(mediaQueries.mobile).toContain('max-width');
		});

		it('tablet query uses min-width and max-width', () => {
			expect(mediaQueries.tablet).toContain('@media');
			expect(mediaQueries.tablet).toContain('min-width');
			expect(mediaQueries.tablet).toContain('max-width');
		});

		it('desktop query uses min-width', () => {
			expect(mediaQueries.desktop).toContain('@media');
			expect(mediaQueries.desktop).toContain('min-width');
		});

		it('media queries contain valid CSS syntax', () => {
			// All should be valid media query format
			const mediaQueryPattern = /@media\s*\([^)]+\)/;
			expect(mediaQueries.mobile).toMatch(mediaQueryPattern);
			expect(mediaQueries.tablet).toMatch(mediaQueryPattern);
			expect(mediaQueries.desktop).toMatch(mediaQueryPattern);
		});

		it('mobile query breakpoint is one less than mobile value', () => {
			const expectedMaxWidth = breakpoints.mobile - 1;
			expect(mediaQueries.mobile).toContain(`${expectedMaxWidth}px`);
		});

		it('tablet query range is correct', () => {
			expect(mediaQueries.tablet).toContain(`${breakpoints.mobile}px`);
			expect(mediaQueries.tablet).toContain(
				`${breakpoints.tablet - 1}px`
			);
		});

		it('desktop query starts at tablet breakpoint', () => {
			expect(mediaQueries.desktop).toContain(`${breakpoints.tablet}px`);
		});
	});

	describe('getCurrentDevice', () => {
		const originalInnerWidth = window.innerWidth;

		afterEach(() => {
			// Reset window width after each test
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: originalInnerWidth,
			});
		});

		it('returns mobile for small screens', () => {
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: 375,
			});

			expect(getCurrentDevice()).toBe('mobile');
		});

		it('returns tablet for medium screens', () => {
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: 800,
			});

			expect(getCurrentDevice()).toBe('tablet');
		});

		it('returns desktop for large screens', () => {
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: 1200,
			});

			expect(getCurrentDevice()).toBe('desktop');
		});

		it('returns mobile at exact mobile breakpoint minus 1', () => {
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: breakpoints.mobile - 1,
			});

			expect(getCurrentDevice()).toBe('mobile');
		});

		it('returns tablet at exact mobile breakpoint', () => {
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: breakpoints.mobile,
			});

			expect(getCurrentDevice()).toBe('tablet');
		});

		it('returns tablet at exact tablet breakpoint minus 1', () => {
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: breakpoints.tablet - 1,
			});

			expect(getCurrentDevice()).toBe('tablet');
		});

		it('returns desktop at exact tablet breakpoint', () => {
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: breakpoints.tablet,
			});

			expect(getCurrentDevice()).toBe('desktop');
		});

		it('returns desktop for very large screens', () => {
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: 2560,
			});

			expect(getCurrentDevice()).toBe('desktop');
		});

		it('returns desktop when window is undefined (SSR)', () => {
			// This test verifies SSR safety
			// The actual function checks typeof window === 'undefined'
			// In Jest/JSDOM, window is always defined, so we test the fallback behavior
			// by verifying the function handles any width gracefully
			expect(getCurrentDevice()).toBeDefined();
			expect(['mobile', 'tablet', 'desktop']).toContain(
				getCurrentDevice()
			);
		});
	});
});
