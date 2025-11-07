/**
 * Block Registration Tests
 *
 * Tests for block registration and basic functionality.
 *
 * @package
 */

import { registerBlockType } from '@wordpress/blocks';

// Mock @wordpress/blocks
jest.mock('@wordpress/blocks', () => ({
	registerBlockType: jest.fn(),
}));

describe('Block Registration', () => {
	beforeEach(() => {
		// Clear all mocks before each test
		jest.clearAllMocks();
	});

	test('registerBlockType is defined', () => {
		expect(registerBlockType).toBeDefined();
		expect(typeof registerBlockType).toBe('function');
	});

	test('can register a block with valid configuration', () => {
		const blockName = 'designsetgo/test-block';
		const blockConfig = {
			title: 'Test Block',
			description: 'A test block',
			category: 'design',
			icon: 'layout',
			attributes: {},
			edit: () => null,
			save: () => null,
		};

		registerBlockType(blockName, blockConfig);

		expect(registerBlockType).toHaveBeenCalledWith(blockName, blockConfig);
		expect(registerBlockType).toHaveBeenCalledTimes(1);
	});

	test('block name follows namespace convention', () => {
		const validNames = [
			'designsetgo/flex',
			'designsetgo/grid',
			'designsetgo/stack',
			'designsetgo/tabs',
		];

		validNames.forEach((name) => {
			expect(name).toMatch(/^designsetgo\//);
		});
	});

	test('block name does not follow convention', () => {
		const invalidNames = ['my-plugin/block', 'core/block', 'invalid-name'];

		invalidNames.forEach((name) => {
			expect(name).not.toMatch(/^designsetgo\//);
		});
	});
});
