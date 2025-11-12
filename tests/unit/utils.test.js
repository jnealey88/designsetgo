/**
 * Utility Functions Tests
 *
 * Tests for common utility functions used across the plugin.
 *
 * @package
 */

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
});
