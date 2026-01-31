/**
 * CSS Generator Utility Tests
 *
 * Tests for CSS generation utilities used across the plugin.
 * These tests focus on behavior, not implementation details.
 *
 * @package DesignSetGo
 */

import {
	generateResponsiveCSS,
	generateSpacingCSS,
	generateUniqueId,
	sanitizeCSSUnit,
} from '../../src/utils/css-generator';

describe('CSS Generator Utilities', () => {
	describe('generateResponsiveCSS', () => {
		it('generates desktop-only CSS when only desktop value provided', () => {
			const result = generateResponsiveCSS('.test', 'width', {
				desktop: '100px',
			});

			expect(result).toContain('.test');
			expect(result).toContain('width: 100px');
			expect(result).not.toContain('@media');
		});

		it('generates responsive CSS for all breakpoints', () => {
			const result = generateResponsiveCSS('.test', 'padding', {
				desktop: '20px',
				tablet: '15px',
				mobile: '10px',
			});

			expect(result).toContain('padding: 20px');
			expect(result).toContain('padding: 15px');
			expect(result).toContain('padding: 10px');
			expect(result).toContain('@media');
		});

		it('handles missing breakpoint values gracefully', () => {
			const result = generateResponsiveCSS('.test', 'margin', {
				desktop: '20px',
				// tablet intentionally missing
				mobile: '10px',
			});

			expect(result).toContain('margin: 20px');
			expect(result).toContain('margin: 10px');
			// Should not have tablet media query
			expect(result.match(/@media/g)?.length || 0).toBe(1);
		});

		it('returns empty string for empty values object', () => {
			const result = generateResponsiveCSS('.test', 'width', {});
			expect(result).toBe('');
		});

		it('handles complex selectors', () => {
			const result = generateResponsiveCSS(
				'.parent > .child:hover',
				'color',
				{ desktop: '#000' }
			);

			expect(result).toContain('.parent > .child:hover');
			expect(result).toContain('color: #000');
		});

		it('handles CSS variables as values', () => {
			const result = generateResponsiveCSS('.test', 'background', {
				desktop: 'var(--wp--preset--color--primary)',
			});

			expect(result).toContain('var(--wp--preset--color--primary)');
		});

		it('handles calc() expressions', () => {
			const result = generateResponsiveCSS('.test', 'width', {
				desktop: 'calc(100% - 20px)',
			});

			expect(result).toContain('calc(100% - 20px)');
		});
	});

	describe('generateSpacingCSS', () => {
		it('generates individual spacing properties', () => {
			const result = generateSpacingCSS('.test', 'padding', {
				top: '10px',
				right: '20px',
				bottom: '15px',
				left: '25px',
			});

			expect(result).toContain('padding-top: 10px');
			expect(result).toContain('padding-right: 20px');
			expect(result).toContain('padding-bottom: 15px');
			expect(result).toContain('padding-left: 25px');
		});

		it('handles partial spacing values', () => {
			const result = generateSpacingCSS('.test', 'margin', {
				top: '10px',
				bottom: '20px',
			});

			expect(result).toContain('margin-top: 10px');
			expect(result).toContain('margin-bottom: 20px');
			expect(result).not.toContain('margin-right');
			expect(result).not.toContain('margin-left');
		});

		it('returns empty string for empty values', () => {
			const result = generateSpacingCSS('.test', 'padding', {});
			expect(result).toBe('');
		});

		it('works with margin type', () => {
			const result = generateSpacingCSS('.element', 'margin', {
				top: 'auto',
			});

			expect(result).toContain('margin-top: auto');
		});

		it('handles rem and em units', () => {
			const result = generateSpacingCSS('.test', 'padding', {
				top: '1rem',
				right: '2em',
			});

			expect(result).toContain('padding-top: 1rem');
			expect(result).toContain('padding-right: 2em');
		});
	});

	describe('generateUniqueId', () => {
		it('generates IDs starting with dsgo-', () => {
			const id = generateUniqueId();
			expect(id).toMatch(/^dsgo-/);
		});

		it('generates unique IDs on each call', () => {
			const ids = new Set();
			for (let i = 0; i < 100; i++) {
				ids.add(generateUniqueId());
			}
			// All 100 IDs should be unique
			expect(ids.size).toBe(100);
		});

		it('generates IDs of consistent length', () => {
			const id1 = generateUniqueId();
			const id2 = generateUniqueId();

			// Both should have similar length (dsgo- + 9 chars = 14)
			expect(id1.length).toBeGreaterThanOrEqual(10);
			expect(id2.length).toBeGreaterThanOrEqual(10);
		});

		it('generates IDs with valid CSS class characters', () => {
			const id = generateUniqueId();
			// Should only contain valid CSS class name characters
			expect(id).toMatch(/^[a-z0-9-]+$/);
		});
	});

	describe('sanitizeCSSUnit', () => {
		it('returns empty string for falsy values', () => {
			expect(sanitizeCSSUnit('')).toBe('');
			expect(sanitizeCSSUnit(null)).toBe('');
			expect(sanitizeCSSUnit(undefined)).toBe('');
			expect(sanitizeCSSUnit(0)).toBe('');
		});

		it('adds px suffix to numbers', () => {
			expect(sanitizeCSSUnit(10)).toBe('10px');
			expect(sanitizeCSSUnit(100)).toBe('100px');
			expect(sanitizeCSSUnit(1.5)).toBe('1.5px');
		});

		it('returns string values unchanged', () => {
			expect(sanitizeCSSUnit('20px')).toBe('20px');
			expect(sanitizeCSSUnit('1.5rem')).toBe('1.5rem');
			expect(sanitizeCSSUnit('50%')).toBe('50%');
			expect(sanitizeCSSUnit('auto')).toBe('auto');
		});

		it('handles calc expressions', () => {
			expect(sanitizeCSSUnit('calc(100% - 20px)')).toBe(
				'calc(100% - 20px)'
			);
		});

		it('handles CSS variables', () => {
			expect(sanitizeCSSUnit('var(--spacing-md)')).toBe(
				'var(--spacing-md)'
			);
		});
	});
});
