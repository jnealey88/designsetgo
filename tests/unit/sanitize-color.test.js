/**
 * Color Sanitization Tests
 *
 * Tests for sanitizeColor utility to prevent XSS attacks.
 *
 * @package
 */

import { sanitizeColor } from '../../src/blocks/section/utils/sanitize-color';

describe('sanitizeColor', () => {
	describe('valid color formats', () => {
		test('accepts hex colors (3 digits)', () => {
			expect(sanitizeColor('#fff')).toBe('#fff');
			expect(sanitizeColor('#FFF')).toBe('#FFF');
			expect(sanitizeColor('#abc')).toBe('#abc');
		});

		test('accepts hex colors (4 digits with alpha)', () => {
			expect(sanitizeColor('#fffa')).toBe('#fffa');
			expect(sanitizeColor('#FFFA')).toBe('#FFFA');
		});

		test('accepts hex colors (6 digits)', () => {
			expect(sanitizeColor('#ffffff')).toBe('#ffffff');
			expect(sanitizeColor('#FFFFFF')).toBe('#FFFFFF');
			expect(sanitizeColor('#aabbcc')).toBe('#aabbcc');
		});

		test('accepts hex colors (8 digits with alpha)', () => {
			expect(sanitizeColor('#ffffffaa')).toBe('#ffffffaa');
			expect(sanitizeColor('#FFFFFFAA')).toBe('#FFFFFFAA');
		});

		test('accepts rgb colors', () => {
			expect(sanitizeColor('rgb(255, 255, 255)')).toBe(
				'rgb(255, 255, 255)'
			);
			expect(sanitizeColor('rgb(0,0,0)')).toBe('rgb(0,0,0)');
			expect(sanitizeColor('rgb( 128 , 128 , 128 )')).toBe(
				'rgb( 128 , 128 , 128 )'
			);
		});

		test('accepts rgba colors', () => {
			expect(sanitizeColor('rgba(255, 255, 255, 0.5)')).toBe(
				'rgba(255, 255, 255, 0.5)'
			);
			expect(sanitizeColor('rgba(0,0,0,1)')).toBe('rgba(0,0,0,1)');
		});

		test('accepts hsl colors', () => {
			expect(sanitizeColor('hsl(120, 100%, 50%)')).toBe(
				'hsl(120, 100%, 50%)'
			);
			expect(sanitizeColor('hsl(0, 0%, 0%)')).toBe('hsl(0, 0%, 0%)');
		});

		test('accepts hsla colors', () => {
			expect(sanitizeColor('hsla(120, 100%, 50%, 0.5)')).toBe(
				'hsla(120, 100%, 50%, 0.5)'
			);
		});

		test('accepts CSS custom properties (variables)', () => {
			expect(sanitizeColor('var(--wp--preset--color--primary)')).toBe(
				'var(--wp--preset--color--primary)'
			);
			expect(sanitizeColor('var(--my-custom-color)')).toBe(
				'var(--my-custom-color)'
			);
			expect(sanitizeColor('var(--color-1)')).toBe('var(--color-1)');
		});

		test('accepts CSS variables with fallback', () => {
			expect(sanitizeColor('var(--color, #fff)')).toBe(
				'var(--color, #fff)'
			);
			expect(sanitizeColor('var(--primary, red)')).toBe(
				'var(--primary, red)'
			);
		});

		test('accepts named colors', () => {
			expect(sanitizeColor('red')).toBe('red');
			expect(sanitizeColor('blue')).toBe('blue');
			expect(sanitizeColor('transparent')).toBe('transparent');
			expect(sanitizeColor('currentColor')).toBe('currentColor');
		});

		test('trims whitespace', () => {
			expect(sanitizeColor('  #fff  ')).toBe('#fff');
			expect(sanitizeColor('\n#fff\n')).toBe('#fff');
		});
	});

	describe('invalid/malicious inputs', () => {
		test('rejects null and undefined', () => {
			expect(sanitizeColor(null)).toBe(null);
			expect(sanitizeColor(undefined)).toBe(null);
		});

		test('rejects non-string values', () => {
			expect(sanitizeColor(123)).toBe(null);
			expect(sanitizeColor({})).toBe(null);
			expect(sanitizeColor([])).toBe(null);
		});

		test('rejects empty string', () => {
			expect(sanitizeColor('')).toBe(null);
			expect(sanitizeColor('   ')).toBe(null);
		});

		test('rejects XSS injection attempts in color values', () => {
			// The attack vector mentioned in the bug report
			expect(
				sanitizeColor(
					'red;}</style><script>alert("XSS")</script><style>'
				)
			).toBe(null);

			// Other XSS attempts
			expect(sanitizeColor('<script>alert("XSS")</script>')).toBe(null);
			expect(sanitizeColor('javascript:alert(1)')).toBe(null);
			expect(sanitizeColor('expression(alert(1))')).toBe(null);
		});

		test('rejects CSS injection attempts', () => {
			expect(sanitizeColor('red; background: url(evil.com)')).toBe(null);
			expect(sanitizeColor('#fff; position: fixed')).toBe(null);
			expect(sanitizeColor('rgb(0,0,0); z-index: 9999')).toBe(null);
		});

		test('rejects malformed hex colors', () => {
			expect(sanitizeColor('#gg')).toBe(null);
			expect(sanitizeColor('#12345')).toBe(null);
			expect(sanitizeColor('#1234567890')).toBe(null);
			expect(sanitizeColor('##fff')).toBe(null);
		});

		test('rejects malformed rgb/rgba', () => {
			expect(sanitizeColor('rgb()')).toBe(null);
			expect(sanitizeColor('rgb(255)')).toBe(null);
			expect(sanitizeColor('rgb(255,255)')).toBe(null);
			expect(sanitizeColor('rgb(-1, 0, 0)')).toBe(null);
		});

		test('rejects url() values', () => {
			expect(sanitizeColor('url(http://evil.com/exploit.js)')).toBe(null);
			expect(sanitizeColor('url("data:text/html,<script>")')).toBe(null);
		});

		test('rejects calc() and other functions', () => {
			expect(sanitizeColor('calc(100% - 10px)')).toBe(null);
		});

		test('rejects color values with special characters', () => {
			expect(sanitizeColor('red<')).toBe(null);
			expect(sanitizeColor('red>')).toBe(null);
			expect(sanitizeColor('red"')).toBe(null);
			expect(sanitizeColor("red'")).toBe(null);
			expect(sanitizeColor('red&')).toBe(null);
		});
	});
});
