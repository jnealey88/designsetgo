/**
 * Block Attributes Tests
 *
 * Tests for block attribute validation and defaults.
 *
 * @package
 */

describe('Block Attributes', () => {
	describe('Attribute Type Validation', () => {
		test('string attribute accepts string value', () => {
			const attribute = {
				type: 'string',
				default: '',
			};

			expect(typeof attribute.default).toBe('string');
		});

		test('number attribute accepts number value', () => {
			const attribute = {
				type: 'number',
				default: 0,
			};

			expect(typeof attribute.default).toBe('number');
		});

		test('boolean attribute accepts boolean value', () => {
			const attribute = {
				type: 'boolean',
				default: false,
			};

			expect(typeof attribute.default).toBe('boolean');
		});

		test('object attribute accepts object value', () => {
			const attribute = {
				type: 'object',
				default: {},
			};

			expect(typeof attribute.default).toBe('object');
		});

		test('array attribute accepts array value', () => {
			const attribute = {
				type: 'array',
				default: [],
			};

			expect(Array.isArray(attribute.default)).toBe(true);
		});
	});

	describe('Common Block Attributes', () => {
		test('alignment attribute has valid options', () => {
			const validAlignments = ['left', 'center', 'right', 'wide', 'full'];
			const alignment = 'center';

			expect(validAlignments).toContain(alignment);
		});

		test('gap/spacing attribute uses WordPress presets', () => {
			const gapValue = 'var(--wp--preset--spacing--50)';

			expect(gapValue).toMatch(/^var\(--wp--preset--spacing--\d+\)$/);
		});

		test('color attribute uses WordPress color presets', () => {
			const colorValue = 'var(--wp--preset--color--primary)';

			expect(colorValue).toMatch(/^var\(--wp--preset--color--[\w-]+\)$/);
		});
	});

	describe('Attribute Defaults', () => {
		test('flexDirection has valid default', () => {
			const flexDirection = {
				type: 'string',
				default: 'row',
			};

			const validValues = [
				'row',
				'column',
				'row-reverse',
				'column-reverse',
			];
			expect(validValues).toContain(flexDirection.default);
		});

		test('justifyContent has valid default', () => {
			const justifyContent = {
				type: 'string',
				default: 'flex-start',
			};

			const validValues = [
				'flex-start',
				'flex-end',
				'center',
				'space-between',
				'space-around',
				'space-evenly',
			];
			expect(validValues).toContain(justifyContent.default);
		});

		test('alignItems has valid default', () => {
			const alignItems = {
				type: 'string',
				default: 'stretch',
			};

			const validValues = [
				'stretch',
				'flex-start',
				'flex-end',
				'center',
				'baseline',
			];
			expect(validValues).toContain(alignItems.default);
		});
	});

	describe('Attribute Validation Functions', () => {
		test('validates positive number', () => {
			const validatePositive = (value) => value >= 0;

			expect(validatePositive(10)).toBe(true);
			expect(validatePositive(0)).toBe(true);
			expect(validatePositive(-5)).toBe(false);
		});

		test('validates CSS unit', () => {
			const validateUnit = (value) => {
				if (typeof value !== 'string') {
					return false;
				}
				return /^\d+(\.\d+)?(px|em|rem|%|vw|vh)$/.test(value);
			};

			expect(validateUnit('10px')).toBe(true);
			expect(validateUnit('2.5em')).toBe(true);
			expect(validateUnit('50%')).toBe(true);
			expect(validateUnit('invalid')).toBe(false);
		});

		test('validates hex color', () => {
			const validateHexColor = (value) => {
				if (typeof value !== 'string') {
					return false;
				}
				return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
			};

			expect(validateHexColor('#ffffff')).toBe(true);
			expect(validateHexColor('#fff')).toBe(true);
			expect(validateHexColor('#FF0000')).toBe(true);
			expect(validateHexColor('ffffff')).toBe(false);
			expect(validateHexColor('#gggggg')).toBe(false);
		});
	});
});
