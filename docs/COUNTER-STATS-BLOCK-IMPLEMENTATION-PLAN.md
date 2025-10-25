# Counter/Stats Block - Implementation Plan

**Plugin:** DesignSetGo
**Block Type:** Custom Block (Parent-Child Pattern)
**Research Date:** October 25, 2025
**Status:** Implementation Ready

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Competitive Analysis](#competitive-analysis)
3. [Recommended Architecture](#recommended-architecture)
4. [Block Structure](#block-structure)
5. [Complete block.json Specifications](#complete-blockjson-specifications)
6. [Key Features & Controls](#key-features--controls)
7. [Animation Implementation](#animation-implementation)
8. [Accessibility Implementation](#accessibility-implementation)
9. [File Structure](#file-structure)
10. [Critical Code Patterns](#critical-code-patterns)
11. [Implementation Checklist](#implementation-checklist)

---

## Executive Summary

### What is a Counter/Stats Block?

A Counter/Stats block displays animated numbers that "count up" from zero (or a start value) to a final value when scrolled into view. These blocks are commonly used for:

- Statistics sections ("500+ Happy Customers", "99.9% Uptime")
- Achievement highlights ("$1M+ Revenue", "50K Downloads")
- Key metrics ("24/7 Support", "15 Years Experience")
- Data visualization (numeric KPIs, growth percentages)

### Key Requirements

1. **Animated count-up** when element scrolls into view
2. **Flexible layout** - Grid of 2, 3, or 4 columns
3. **FSE compatible** - Works with Full Site Editing
4. **Accessible** - WCAG 2.1 AA compliant
5. **Customizable** - Prefix/suffix, icons, labels, colors
6. **Performant** - Lightweight, uses modern browser APIs

### Recommended Pattern

**Parent-Child Block Architecture:**
- **Parent:** `designsetgo/counter-group` - Container with layout controls
- **Child:** `designsetgo/counter` - Individual counter item

This follows WordPress best practices (similar to Accordion/Accordion Item, Tabs/Tab pattern already in DesignSetGo).

---

## Competitive Analysis

### Popular Block Libraries

Based on research into Kadence Blocks, Stackable, and GenerateBlocks:

#### Kadence Blocks - Counter Block

**Features:**
- Count up & count down animations
- Respects `prefers-reduced-motion` (shows final value immediately)
- Active development (October 2025 release)
- Design library with pre-built patterns
- Fast performance (keeps Core Web Vitals green)

**UI Pattern:**
- Single counter or multiple counters in grid
- Icon support
- Prefix/suffix text
- Customizable animation duration

#### Stackable Blocks

**Features:**
- Multiple counter items in grid layout
- Icon integration
- Color customization
- Responsive column controls

#### GenerateBlocks

**Features:**
- Minimalist, performance-first approach
- Fewer controls, more flexibility
- Pattern builder for custom layouts

### Common Patterns Across All

1. **Grid Layout:** 2-4 columns typical
2. **Icon Support:** Optional icon above/beside number
3. **Prefix/Suffix:** "$", "%", "K", "M", "+", etc.
4. **Label/Description:** Below the number
5. **Animation Triggers:** Scroll into view (Intersection Observer)
6. **Duration Control:** 1-3 seconds typical
7. **Easing Functions:** EaseOut, Linear, EaseInOut
8. **Responsive:** Mobile stacks to 1 column

---

## Recommended Architecture

### Parent-Child Block Pattern

Following DesignSetGo's existing Accordion and Tabs pattern:

```
Counter Group (Parent)
├── Counter Item (Child) #1
├── Counter Item (Child) #2
├── Counter Item (Child) #3
└── Counter Item (Child) #4
```

**Why This Pattern:**

✅ **Follows WordPress Best Practices**
- Same pattern as core Columns/Column blocks
- Matches existing DesignSetGo Accordion, Tabs blocks
- Easy to understand for users

✅ **Flexible & Maintainable**
- Users can add/remove counters easily
- Each counter has independent settings
- Parent controls shared layout/styling
- Clean separation of concerns

✅ **Better UX**
- Visual builder experience
- Drag-and-drop reordering
- Individual counter customization
- Global styling from parent

### Alternative Considered: Single Block with Attributes Array

❌ **Rejected because:**
- More complex state management
- Harder to build custom UI for adding/removing items
- Less intuitive for users
- Doesn't follow established DesignSetGo patterns

---

## Block Structure

### Counter Group (Parent Block)

**Purpose:** Container that manages layout, shared styling, and animation settings.

**Responsibilities:**
- Define grid columns (responsive: desktop/tablet/mobile)
- Set gap between counters
- Control alignment
- Provide global animation settings (can be overridden per counter)
- Pass context to child blocks

**User Interface:**
- Layout controls (grid columns)
- Spacing controls (gap, padding, margin)
- Global animation settings panel
- Color scheme controls (optional)
- Typography controls (optional)

### Counter (Child Block)

**Purpose:** Individual counter with number, icon, label, and animation.

**Responsibilities:**
- Display animated number
- Show optional icon
- Display label/description
- Handle individual animation settings
- Manage prefix/suffix text

**User Interface:**
- Number input (end value)
- Start value input (default: 0)
- Prefix/suffix text inputs
- Icon picker (optional)
- Label text input
- Animation override controls
- Color/typography controls

---

## Complete block.json Specifications

### Counter Group (Parent) - block.json

```json
{
	"$schema": "https://schemas.wp.org/trunk/block.json",
	"apiVersion": 3,
	"name": "designsetgo/counter-group",
	"version": "1.0.0",
	"title": "Counter Group",
	"category": "designsetgo",
	"description": "Display animated statistics and numbers in a grid layout with count-up effects.",
	"keywords": ["counter", "stats", "statistics", "numbers", "metrics", "count-up", "animated"],
	"textdomain": "designsetgo",
	"attributes": {
		"columns": {
			"type": "number",
			"default": 3
		},
		"columnsTablet": {
			"type": "number",
			"default": 2
		},
		"columnsMobile": {
			"type": "number",
			"default": 1
		},
		"gap": {
			"type": "string",
			"default": "var(--wp--preset--spacing--50)"
		},
		"alignment": {
			"type": "string",
			"default": "center"
		},
		"animationDuration": {
			"type": "number",
			"default": 2000
		},
		"animationDelay": {
			"type": "number",
			"default": 0
		},
		"animationEasing": {
			"type": "string",
			"default": "easeOutExpo",
			"enum": ["linear", "easeOutExpo", "easeInOutQuad", "easeOutQuad"]
		},
		"enableScrollSpy": {
			"type": "boolean",
			"default": true
		},
		"useGrouping": {
			"type": "boolean",
			"default": true
		},
		"separator": {
			"type": "string",
			"default": ","
		},
		"decimal": {
			"type": "string",
			"default": "."
		}
	},
	"providesContext": {
		"designsetgo/counterGroup/animationDuration": "animationDuration",
		"designsetgo/counterGroup/animationDelay": "animationDelay",
		"designsetgo/counterGroup/animationEasing": "animationEasing",
		"designsetgo/counterGroup/enableScrollSpy": "enableScrollSpy",
		"designsetgo/counterGroup/useGrouping": "useGrouping",
		"designsetgo/counterGroup/separator": "separator",
		"designsetgo/counterGroup/decimal": "decimal"
	},
	"supports": {
		"anchor": true,
		"align": ["wide", "full"],
		"html": false,
		"inserter": true,
		"spacing": {
			"margin": true,
			"padding": true,
			"blockGap": true,
			"__experimentalDefaultControls": {
				"padding": true,
				"blockGap": true
			}
		},
		"color": {
			"background": true,
			"text": true,
			"link": true,
			"__experimentalDefaultControls": {
				"background": true,
				"text": true
			}
		},
		"typography": {
			"fontSize": true,
			"lineHeight": true,
			"__experimentalFontFamily": true,
			"__experimentalFontWeight": true,
			"__experimentalDefaultControls": {
				"fontSize": true,
				"lineHeight": true
			}
		},
		"__experimentalBorder": {
			"color": true,
			"radius": true,
			"style": true,
			"width": true,
			"__experimentalDefaultControls": {
				"radius": true
			}
		}
	},
	"example": {
		"attributes": {
			"columns": 3
		},
		"innerBlocks": [
			{
				"name": "designsetgo/counter",
				"attributes": {
					"endValue": 500,
					"suffix": "+",
					"label": "Happy Customers"
				}
			},
			{
				"name": "designsetgo/counter",
				"attributes": {
					"endValue": 99.9,
					"decimalPlaces": 1,
					"suffix": "%",
					"label": "Uptime"
				}
			},
			{
				"name": "designsetgo/counter",
				"attributes": {
					"startValue": 0,
					"endValue": 24,
					"suffix": "/7",
					"label": "Support"
				}
			}
		]
	},
	"editorScript": "file:./index.js",
	"editorStyle": "file:./editor.css",
	"style": "file:./style.css",
	"viewScript": "file:./frontend.js"
}
```

### Counter (Child) - block.json

```json
{
	"$schema": "https://schemas.wp.org/trunk/block.json",
	"apiVersion": 3,
	"name": "designsetgo/counter",
	"version": "1.0.0",
	"title": "Counter",
	"category": "designsetgo",
	"parent": ["designsetgo/counter-group"],
	"description": "An individual animated counter within a counter group.",
	"keywords": ["counter", "number", "stat", "metric"],
	"textdomain": "designsetgo",
	"attributes": {
		"startValue": {
			"type": "number",
			"default": 0
		},
		"endValue": {
			"type": "number",
			"default": 100
		},
		"decimalPlaces": {
			"type": "number",
			"default": 0
		},
		"prefix": {
			"type": "string",
			"default": ""
		},
		"suffix": {
			"type": "string",
			"default": ""
		},
		"label": {
			"type": "string",
			"default": "Counter Label"
		},
		"showIcon": {
			"type": "boolean",
			"default": false
		},
		"icon": {
			"type": "string",
			"default": ""
		},
		"iconPosition": {
			"type": "string",
			"default": "top",
			"enum": ["top", "left", "right"]
		},
		"uniqueId": {
			"type": "string",
			"default": ""
		},
		"overrideAnimation": {
			"type": "boolean",
			"default": false
		},
		"customDuration": {
			"type": "number",
			"default": 2000
		},
		"customDelay": {
			"type": "number",
			"default": 0
		},
		"customEasing": {
			"type": "string",
			"default": "easeOutExpo"
		}
	},
	"usesContext": [
		"designsetgo/counterGroup/animationDuration",
		"designsetgo/counterGroup/animationDelay",
		"designsetgo/counterGroup/animationEasing",
		"designsetgo/counterGroup/enableScrollSpy",
		"designsetgo/counterGroup/useGrouping",
		"designsetgo/counterGroup/separator",
		"designsetgo/counterGroup/decimal"
	],
	"supports": {
		"html": false,
		"reusable": false,
		"spacing": {
			"padding": true,
			"margin": false,
			"__experimentalDefaultControls": {
				"padding": true
			}
		},
		"color": {
			"background": true,
			"text": true,
			"link": true,
			"__experimentalDefaultControls": {
				"background": false,
				"text": true
			}
		},
		"typography": {
			"fontSize": true,
			"lineHeight": true,
			"__experimentalFontWeight": true,
			"__experimentalFontFamily": true,
			"__experimentalDefaultControls": {
				"fontSize": true
			}
		},
		"__experimentalBorder": {
			"color": true,
			"radius": true,
			"style": true,
			"width": true,
			"__experimentalDefaultControls": {
				"radius": true
			}
		}
	},
	"editorScript": "file:./index.js",
	"editorStyle": "file:./editor.css",
	"style": "file:./style.css"
}
```

---

## Key Features & Controls

### Counter Group (Parent) - Inspector Controls

#### Layout Panel
- **Grid Columns (Desktop):** Range control, 1-6, default: 3
- **Grid Columns (Tablet):** Range control, 1-4, default: 2
- **Grid Columns (Mobile):** Range control, 1-2, default: 1
- **Gap:** Spacing control (uses theme spacing tokens)
- **Alignment:** AlignmentControl (left, center, right)

#### Animation Settings Panel
- **Animation Duration:** Range control, 500-5000ms, default: 2000ms
- **Animation Delay:** Range control, 0-2000ms, default: 0ms
- **Animation Easing:** Select control
  - Linear (constant speed)
  - Ease Out Expo (fast to slow, recommended)
  - Ease In Out Quad (slow-fast-slow)
  - Ease Out Quad (fast to slow, gentle)
- **Enable Scroll Spy:** Toggle (animate on scroll into view)
- **Number Formatting:**
  - Use Grouping (1,000 vs 1000): Toggle, default: true
  - Separator: Text input, default: ","
  - Decimal: Text input, default: "."

#### Block Toolbar
- Alignment toolbar (inherited from supports)
- Block settings (anchor, spacing, etc.)

### Counter (Child) - Inspector Controls

#### Counter Settings Panel
- **Start Value:** Number input, default: 0
- **End Value:** Number input, default: 100
- **Decimal Places:** Range control, 0-3, default: 0
- **Prefix:** Text input (e.g., "$", "€", "~")
- **Suffix:** Text input (e.g., "+", "%", "K", "M")

#### Label Panel
- **Label Text:** TextControl, default: "Counter Label"

#### Icon Panel
- **Show Icon:** Toggle control, default: false
- **Icon:** IconPicker component (when showIcon is true)
- **Icon Position:** Select control (top, left, right)

#### Animation Override Panel (Advanced)
- **Override Parent Animation:** Toggle, default: false
- **Custom Duration:** Range control (when override is true)
- **Custom Delay:** Range control (when override is true)
- **Custom Easing:** Select control (when override is true)

#### Block Toolbar
- Individual counter settings
- Remove counter button

---

## Animation Implementation

### Recommended Library: CountUp.js

**Why CountUp.js:**
- ✅ Lightweight (~3KB gzipped)
- ✅ Dependency-free (vanilla JavaScript)
- ✅ Smooth, performant animations
- ✅ Built-in easing functions
- ✅ Scroll spy support (Intersection Observer)
- ✅ Prefix/suffix support
- ✅ Number formatting (separators, decimals)
- ✅ Actively maintained (2025)
- ✅ MIT License (compatible with GPL)

**Installation:**

```bash
npm install countup.js
```

### CountUp.js Configuration

```javascript
import { CountUp } from 'countup.js';

// Basic usage
const countUp = new CountUp('counter-id', endValue, {
	startVal: 0,
	duration: 2, // seconds
	decimalPlaces: 0,
	useEasing: true,
	easingFn: easeOutExpo,
	useGrouping: true,
	separator: ',',
	decimal: '.',
	prefix: '$',
	suffix: '+',
	enableScrollSpy: true,
});

// Start the animation
if (!countUp.error) {
	countUp.start();
} else {
	console.error(countUp.error);
}
```

### Intersection Observer Pattern

For scroll-triggered animations (when `enableScrollSpy` is true):

```javascript
// Frontend JavaScript
document.addEventListener('DOMContentLoaded', () => {
	const counters = document.querySelectorAll('.dsg-counter');

	// Create Intersection Observer
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					// Get counter configuration from data attributes
					const element = entry.target;
					const counterId = element.querySelector('.dsg-counter-number').id;
					const config = JSON.parse(element.dataset.counterConfig);

					// Initialize CountUp
					const countUp = new CountUp(counterId, config.endValue, {
						startVal: config.startValue,
						duration: config.duration / 1000, // Convert ms to seconds
						decimalPlaces: config.decimalPlaces,
						useEasing: config.useEasing,
						easingFn: getEasingFunction(config.easing),
						useGrouping: config.useGrouping,
						separator: config.separator,
						decimal: config.decimal,
						prefix: config.prefix,
						suffix: config.suffix,
					});

					// Start animation
					if (!countUp.error) {
						countUp.start();
					}

					// Unobserve after animating (animate only once)
					observer.unobserve(element);
				}
			});
		},
		{
			threshold: 0.3, // Trigger when 30% visible
			rootMargin: '0px 0px -100px 0px', // Start slightly before fully in view
		}
	);

	// Observe all counters
	counters.forEach((counter) => observer.observe(counter));
});

// Easing function helper
function getEasingFunction(easingName) {
	const easingFunctions = {
		linear: (t, b, c, d) => (c * t) / d + b,
		easeOutExpo: (t, b, c, d) =>
			t === d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b,
		easeInOutQuad: (t, b, c, d) => {
			t /= d / 2;
			if (t < 1) return (c / 2) * t * t + b;
			t--;
			return (-c / 2) * (t * (t - 2) - 1) + b;
		},
		easeOutQuad: (t, b, c, d) => -c * (t /= d) * (t - 2) + b,
	};
	return easingFunctions[easingName] || easingFunctions.easeOutExpo;
}
```

### Alternative: Vanilla JavaScript (No Library)

If you prefer not to add a dependency:

```javascript
function animateCounter(element, start, end, duration, easing = 'easeOutExpo') {
	const startTime = performance.now();
	const range = end - start;

	function update(currentTime) {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / duration, 1);

		// Apply easing
		const easedProgress = applyEasing(progress, easing);
		const currentValue = start + range * easedProgress;

		// Update DOM
		element.textContent = Math.round(currentValue).toLocaleString();

		if (progress < 1) {
			requestAnimationFrame(update);
		} else {
			element.textContent = end.toLocaleString(); // Ensure final value
		}
	}

	requestAnimationFrame(update);
}

function applyEasing(t, easing) {
	const easings = {
		linear: (t) => t,
		easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
		easeInOutQuad: (t) =>
			t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
		easeOutQuad: (t) => 1 - (1 - t) * (1 - t),
	};
	return easings[easing](t);
}
```

**Recommendation:** Use CountUp.js for production. It's battle-tested, handles edge cases, and saves development time.

---

## Accessibility Implementation

### WCAG 2.1 AA Compliance Checklist

#### 1. Semantic HTML

```html
<div class="dsg-counter" role="region" aria-label="Statistics">
	<div class="dsg-counter-item">
		<!-- Icon (optional, decorative) -->
		<div class="dsg-counter-icon" aria-hidden="true">
			<svg>...</svg>
		</div>

		<!-- Number with live region -->
		<div class="dsg-counter-number-wrapper">
			<span class="dsg-counter-prefix" aria-hidden="true">$</span>
			<span
				class="dsg-counter-number"
				role="text"
				aria-live="polite"
				aria-atomic="true"
			>
				1000
			</span>
			<span class="dsg-counter-suffix" aria-hidden="true">+</span>
		</div>

		<!-- Label (accessible text) -->
		<div class="dsg-counter-label" id="counter-label-1">
			Happy Customers
		</div>
	</div>
</div>
```

#### 2. ARIA Live Regions

**Purpose:** Announce number changes to screen readers.

```javascript
// In edit.js - Editor preview
<span
	className="dsg-counter-number"
	role="text"
	aria-live="polite"
	aria-atomic="true"
	aria-label={`${prefix}${endValue}${suffix} ${label}`}
>
	{prefix}{endValue.toLocaleString()}{suffix}
</span>
```

**Important:**
- `aria-live="polite"`: Announces changes without interrupting
- `aria-atomic="true"`: Reads entire value on update
- `aria-label`: Provides full context (prefix + number + suffix + label)

#### 3. Reduced Motion Support

**CSS:**

```scss
// Respect user's motion preferences
@media (prefers-reduced-motion: reduce) {
	.dsg-counter {
		* {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
		}
	}
}
```

**JavaScript:**

```javascript
// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia(
	'(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
	// Skip animation, show final value immediately
	element.textContent = config.endValue.toLocaleString();
} else {
	// Animate normally
	countUp.start();
}
```

**Best Practice (Kadence approach):**
When `prefers-reduced-motion` is enabled, immediately display the final value without animation.

#### 4. Keyboard Navigation

Not applicable for counter blocks (non-interactive), but ensure:
- ✅ Proper heading hierarchy if used in hero sections
- ✅ Sufficient color contrast (WCAG AA: 4.5:1 for text)
- ✅ Focus indicators if linking counters

#### 5. Screen Reader Announcements

**Problem:** Counting animations can be disorienting for screen readers.

**Solution:**

```javascript
// Only announce once animation completes
const countUp = new CountUp('counter-id', endValue, {
	// ... config
	onCompleteCallback: () => {
		// Update aria-live region with final value
		const liveRegion = document.getElementById(`${counterId}-live`);
		liveRegion.textContent = `${prefix}${endValue}${suffix} ${label}`;
	},
});
```

**Hidden live region:**

```html
<div
	id="counter-1-live"
	class="screen-reader-text"
	aria-live="polite"
	aria-atomic="true"
></div>
```

#### 6. Color Contrast

Ensure proper contrast ratios:

```scss
.dsg-counter-number {
	// Use theme colors or ensure minimum 4.5:1 contrast
	color: var(--wp--preset--color--contrast);
	font-size: var(--wp--preset--font-size--xx-large);
	font-weight: 700;

	// Fallback if theme doesn't define contrast color
	@supports not (color: var(--wp--preset--color--contrast)) {
		color: #1a1a1a; // Dark text on light background
	}
}
```

#### 7. Focus Management

If counters are clickable/linkable:

```scss
.dsg-counter:focus-visible {
	outline: 2px solid var(--wp--preset--color--primary);
	outline-offset: 2px;
	border-radius: 4px;
}
```

### Accessibility Testing Checklist

- [ ] Test with VoiceOver (macOS/iOS)
- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Test keyboard navigation
- [ ] Test with browser zoom (200%, 400%)
- [ ] Verify color contrast with Chrome DevTools
- [ ] Test with `prefers-reduced-motion` enabled
- [ ] Validate HTML with W3C Validator
- [ ] Run axe DevTools accessibility scan
- [ ] Test with real users (if possible)

---

## File Structure

### Recommended Directory Structure

```
src/blocks/
├── counter-group/
│   ├── block.json
│   ├── index.js              # Edit component
│   ├── save.js               # Save component
│   ├── editor.scss           # Editor styles
│   ├── style.scss            # Frontend styles
│   └── frontend.js           # Animation logic (CountUp.js)
│
└── counter/
    ├── block.json
    ├── index.js              # Edit component
    ├── save.js               # Save component
    ├── editor.scss           # Editor styles
    └── style.scss            # Frontend styles
```

### File Responsibilities

#### Counter Group (Parent)

**index.js** - Edit Component:
```javascript
// Imports
import { useBlockProps, useInnerBlocksProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, SelectControl } from '@wordpress/components';

// Component
export default function Edit({ attributes, setAttributes }) {
	const { columns, columnsTablet, columnsMobile, gap, animationDuration, ... } = attributes;

	const blockProps = useBlockProps({
		className: 'dsg-counter-group',
		style: {
			'--dsg-counter-columns': columns,
			'--dsg-counter-columns-tablet': columnsTablet,
			'--dsg-counter-columns-mobile': columnsMobile,
			'--dsg-counter-gap': gap,
		},
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: ['designsetgo/counter'],
		template: [
			['designsetgo/counter', { endValue: 100, suffix: '+', label: 'Counter 1' }],
			['designsetgo/counter', { endValue: 200, suffix: '%', label: 'Counter 2' }],
			['designsetgo/counter', { endValue: 300, suffix: 'K', label: 'Counter 3' }],
		],
		templateLock: false,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title="Layout Settings">
					{/* Layout controls */}
				</PanelBody>
				<PanelBody title="Animation Settings">
					{/* Animation controls */}
				</PanelBody>
			</InspectorControls>
			<div {...innerBlocksProps} />
		</>
	);
}
```

**save.js** - Save Component:
```javascript
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
	const { columns, columnsTablet, columnsMobile, gap } = attributes;

	const blockProps = useBlockProps.save({
		className: 'dsg-counter-group',
		style: {
			'--dsg-counter-columns': columns,
			'--dsg-counter-columns-tablet': columnsTablet,
			'--dsg-counter-columns-mobile': columnsMobile,
			'--dsg-counter-gap': gap,
		},
	});

	const innerBlocksProps = useInnerBlocksProps.save(blockProps);

	return <div {...innerBlocksProps} />;
}
```

**frontend.js** - Animation Logic:
```javascript
import { CountUp } from 'countup.js';

document.addEventListener('DOMContentLoaded', () => {
	initCounters();
});

function initCounters() {
	const counters = document.querySelectorAll('.dsg-counter');

	// Check for reduced motion preference
	const prefersReducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;

	if (prefersReducedMotion) {
		// Show final values immediately
		counters.forEach((counter) => {
			const numberEl = counter.querySelector('.dsg-counter-number');
			const config = JSON.parse(counter.dataset.counterConfig);
			numberEl.textContent = formatNumber(config.endValue, config);
		});
		return;
	}

	// Create Intersection Observer
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					animateCounter(entry.target);
					observer.unobserve(entry.target);
				}
			});
		},
		{
			threshold: 0.3,
			rootMargin: '0px 0px -100px 0px',
		}
	);

	// Observe all counters
	counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(counterElement) {
	const config = JSON.parse(counterElement.dataset.counterConfig);
	const numberId = counterElement.querySelector('.dsg-counter-number').id;

	const countUp = new CountUp(numberId, config.endValue, {
		startVal: config.startValue,
		duration: config.duration / 1000,
		decimalPlaces: config.decimalPlaces,
		useEasing: true,
		easingFn: getEasingFunction(config.easing),
		useGrouping: config.useGrouping,
		separator: config.separator,
		decimal: config.decimal,
		prefix: config.prefix,
		suffix: config.suffix,
	});

	if (!countUp.error) {
		countUp.start();
	}
}

// ... helper functions
```

**style.scss** - Frontend Styles:
```scss
.dsg-counter-group {
	display: grid;
	grid-template-columns: repeat(var(--dsg-counter-columns, 3), 1fr);
	gap: var(--dsg-counter-gap, var(--wp--preset--spacing--50));

	@media (max-width: 1023px) {
		grid-template-columns: repeat(var(--dsg-counter-columns-tablet, 2), 1fr);
	}

	@media (max-width: 767px) {
		grid-template-columns: repeat(var(--dsg-counter-columns-mobile, 1), 1fr);
	}
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
	.dsg-counter-group {
		* {
			animation-duration: 0.01ms !important;
			transition-duration: 0.01ms !important;
		}
	}
}
```

#### Counter (Child)

**index.js** - Edit Component:
```javascript
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';

export default function Edit({ attributes, setAttributes, context }) {
	const {
		startValue,
		endValue,
		decimalPlaces,
		prefix,
		suffix,
		label,
		showIcon,
		icon,
		uniqueId,
	} = attributes;

	// Generate unique ID
	useEffect(() => {
		if (!uniqueId) {
			setAttributes({ uniqueId: `counter-${Math.random().toString(36).substr(2, 9)}` });
		}
	}, []);

	const blockProps = useBlockProps({
		className: 'dsg-counter',
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title="Counter Settings">
					{/* Controls */}
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{showIcon && icon && (
					<div className="dsg-counter-icon">{/* Icon SVG */}</div>
				)}
				<div className="dsg-counter-number-wrapper">
					<span className="dsg-counter-prefix">{prefix}</span>
					<span className="dsg-counter-number">
						{endValue.toLocaleString()}
					</span>
					<span className="dsg-counter-suffix">{suffix}</span>
				</div>
				<RichText
					tagName="div"
					className="dsg-counter-label"
					value={label}
					onChange={(value) => setAttributes({ label: value })}
					placeholder="Enter label..."
				/>
			</div>
		</>
	);
}
```

**save.js** - Save Component:
```javascript
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save({ attributes, context }) {
	const {
		startValue,
		endValue,
		decimalPlaces,
		prefix,
		suffix,
		label,
		showIcon,
		icon,
		uniqueId,
		overrideAnimation,
		customDuration,
		customDelay,
		customEasing,
	} = attributes;

	// Merge parent context with local attributes
	const config = {
		startValue,
		endValue,
		decimalPlaces,
		prefix,
		suffix,
		duration: overrideAnimation ? customDuration : context['designsetgo/counterGroup/animationDuration'],
		delay: overrideAnimation ? customDelay : context['designsetgo/counterGroup/animationDelay'],
		easing: overrideAnimation ? customEasing : context['designsetgo/counterGroup/animationEasing'],
		useGrouping: context['designsetgo/counterGroup/useGrouping'],
		separator: context['designsetgo/counterGroup/separator'],
		decimal: context['designsetgo/counterGroup/decimal'],
	};

	const blockProps = useBlockProps.save({
		className: 'dsg-counter',
		'data-counter-config': JSON.stringify(config),
	});

	const numberId = `dsg-counter-number-${uniqueId}`;

	return (
		<div {...blockProps}>
			{showIcon && icon && (
				<div className="dsg-counter-icon" aria-hidden="true">
					{/* Icon SVG */}
				</div>
			)}
			<div className="dsg-counter-number-wrapper">
				{prefix && (
					<span className="dsg-counter-prefix" aria-hidden="true">
						{prefix}
					</span>
				)}
				<span
					id={numberId}
					className="dsg-counter-number"
					role="text"
					aria-live="polite"
					aria-atomic="true"
					aria-label={`${prefix}${endValue}${suffix} ${label}`}
				>
					{endValue.toLocaleString()}
				</span>
				{suffix && (
					<span className="dsg-counter-suffix" aria-hidden="true">
						{suffix}
					</span>
				)}
			</div>
			<RichText.Content
				tagName="div"
				className="dsg-counter-label"
				value={label}
			/>
			{/* Hidden live region for screen readers */}
			<div
				id={`${numberId}-live`}
				className="screen-reader-text"
				aria-live="polite"
				aria-atomic="true"
			/>
		</div>
	);
}
```

**style.scss** - Frontend Styles:
```scss
.dsg-counter {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	padding: var(--wp--preset--spacing--40);

	.dsg-counter-icon {
		margin-bottom: var(--wp--preset--spacing--30);
		font-size: 3rem;
		color: var(--wp--preset--color--primary, #0073aa);
	}

	.dsg-counter-number-wrapper {
		display: flex;
		align-items: baseline;
		justify-content: center;
		margin-bottom: var(--wp--preset--spacing--20);
		font-size: var(--wp--preset--font-size--xx-large, 3rem);
		font-weight: 700;
		line-height: 1.2;
		color: var(--wp--preset--color--contrast, #1a1a1a);
	}

	.dsg-counter-prefix,
	.dsg-counter-suffix {
		font-size: 0.6em;
		font-weight: 600;
		opacity: 0.8;
	}

	.dsg-counter-prefix {
		margin-right: 0.1em;
	}

	.dsg-counter-suffix {
		margin-left: 0.1em;
	}

	.dsg-counter-label {
		font-size: var(--wp--preset--font-size--medium, 1rem);
		color: var(--wp--preset--color--secondary, #666);
	}
}

// Screen reader only text
.screen-reader-text {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
}
```

---

## Critical Code Patterns

### 1. Parent-Child Context Communication

**Parent provides context:**

```javascript
// In counter-group/block.json
"providesContext": {
	"designsetgo/counterGroup/animationDuration": "animationDuration",
	"designsetgo/counterGroup/animationEasing": "animationEasing"
}
```

**Child consumes context:**

```javascript
// In counter/block.json
"usesContext": [
	"designsetgo/counterGroup/animationDuration",
	"designsetgo/counterGroup/animationEasing"
]

// In counter/index.js (Edit)
export default function Edit({ attributes, context }) {
	const parentDuration = context['designsetgo/counterGroup/animationDuration'];
	// Use parent settings unless overridden
}

// In counter/save.js
export default function Save({ attributes, context }) {
	const duration = attributes.overrideAnimation
		? attributes.customDuration
		: context['designsetgo/counterGroup/animationDuration'];
}
```

### 2. Unique ID Generation

```javascript
import { useEffect } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
	const { uniqueId } = attributes;

	// Generate unique ID on mount
	useEffect(() => {
		if (!uniqueId) {
			const id = `counter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			setAttributes({ uniqueId: id });
		}
	}, [uniqueId, setAttributes]);

	// Use uniqueId for DOM element IDs
	const numberId = `dsg-counter-number-${uniqueId}`;
}
```

### 3. Data Attributes for Frontend JavaScript

```javascript
// In save.js
const config = {
	startValue: attributes.startValue,
	endValue: attributes.endValue,
	duration: attributes.animationDuration,
	// ... more config
};

const blockProps = useBlockProps.save({
	className: 'dsg-counter',
	'data-counter-config': JSON.stringify(config),
});

// In frontend.js
const config = JSON.parse(counterElement.dataset.counterConfig);
```

### 4. CSS Custom Properties for Responsive Grids

```javascript
// In counter-group save.js
const blockProps = useBlockProps.save({
	className: 'dsg-counter-group',
	style: {
		'--dsg-counter-columns': attributes.columns,
		'--dsg-counter-columns-tablet': attributes.columnsTablet,
		'--dsg-counter-columns-mobile': attributes.columnsMobile,
		'--dsg-counter-gap': attributes.gap,
	},
});
```

```scss
// In counter-group style.scss
.dsg-counter-group {
	display: grid;
	grid-template-columns: repeat(var(--dsg-counter-columns, 3), 1fr);
	gap: var(--dsg-counter-gap, var(--wp--preset--spacing--50));

	@media (max-width: 1023px) {
		grid-template-columns: repeat(var(--dsg-counter-columns-tablet, 2), 1fr);
	}

	@media (max-width: 767px) {
		grid-template-columns: repeat(var(--dsg-counter-columns-mobile, 1), 1fr);
	}
}
```

### 5. InnerBlocks Template

```javascript
import { useInnerBlocksProps } from '@wordpress/block-editor';

const innerBlocksProps = useInnerBlocksProps(blockProps, {
	allowedBlocks: ['designsetgo/counter'],
	template: [
		[
			'designsetgo/counter',
			{
				endValue: 500,
				suffix: '+',
				label: 'Happy Customers',
			},
		],
		[
			'designsetgo/counter',
			{
				endValue: 99.9,
				decimalPlaces: 1,
				suffix: '%',
				label: 'Uptime',
			},
		],
		[
			'designsetgo/counter',
			{
				endValue: 24,
				suffix: '/7',
				label: 'Support',
			},
		],
	],
	templateLock: false, // Allow adding/removing counters
});
```

### 6. Easing Functions

```javascript
// Easing functions for CountUp.js
const easingFunctions = {
	linear: (t, b, c, d) => (c * t) / d + b,

	easeOutExpo: (t, b, c, d) =>
		t === d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b,

	easeInOutQuad: (t, b, c, d) => {
		t /= d / 2;
		if (t < 1) return (c / 2) * t * t + b;
		t--;
		return (-c / 2) * (t * (t - 2) - 1) + b;
	},

	easeOutQuad: (t, b, c, d) => -c * (t /= d) * (t - 2) + b,
};

// Usage
const countUp = new CountUp('counter-id', endValue, {
	easingFn: easingFunctions[attributes.animationEasing],
});
```

### 7. Number Formatting Helper

```javascript
function formatNumber(value, config) {
	const {
		decimalPlaces = 0,
		useGrouping = true,
		separator = ',',
		decimal = '.',
		prefix = '',
		suffix = '',
	} = config;

	// Format number
	let formatted = value.toFixed(decimalPlaces);

	// Replace decimal separator
	if (decimal !== '.') {
		formatted = formatted.replace('.', decimal);
	}

	// Add grouping separators
	if (useGrouping) {
		const parts = formatted.split(decimal);
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
		formatted = parts.join(decimal);
	}

	return `${prefix}${formatted}${suffix}`;
}
```

---

## Implementation Checklist

### Phase 1: Setup & Structure

- [ ] Create `src/blocks/counter-group/` directory
- [ ] Create `src/blocks/counter/` directory
- [ ] Create `counter-group/block.json` with full configuration
- [ ] Create `counter/block.json` with parent relationship
- [ ] Install `countup.js` via npm: `npm install countup.js`
- [ ] Register blocks in PHP (if not auto-registered)

### Phase 2: Counter Group (Parent) Block

- [ ] Implement `counter-group/index.js` (Edit component)
- [ ] Add Layout panel (columns, gap, alignment)
- [ ] Add Animation Settings panel (duration, delay, easing)
- [ ] Add Number Formatting panel (grouping, separator, decimal)
- [ ] Implement `counter-group/save.js` with CSS custom properties
- [ ] Create `counter-group/style.scss` with grid layout
- [ ] Create `counter-group/editor.scss` for editor-specific styles
- [ ] Test InnerBlocks template with 3 default counters
- [ ] Verify context is provided to child blocks

### Phase 3: Counter (Child) Block

- [ ] Implement `counter/index.js` (Edit component)
- [ ] Add Counter Settings panel (start, end, decimals, prefix, suffix)
- [ ] Add Label control (RichText)
- [ ] Add Icon panel (show/hide, icon picker, position)
- [ ] Add Animation Override panel (toggle + custom settings)
- [ ] Implement unique ID generation
- [ ] Implement `counter/save.js` with data attributes
- [ ] Create `counter/style.scss` with counter item styles
- [ ] Test context consumption from parent
- [ ] Verify ARIA attributes in save output

### Phase 4: Frontend Animation

- [ ] Create `counter-group/frontend.js`
- [ ] Import CountUp.js library
- [ ] Implement Intersection Observer pattern
- [ ] Add `prefers-reduced-motion` detection
- [ ] Implement counter animation logic
- [ ] Add easing function helper
- [ ] Test scroll-triggered animations
- [ ] Test multiple counter groups on same page
- [ ] Test edge cases (negative numbers, large numbers, decimals)

### Phase 5: Styling & Polish

- [ ] Implement responsive grid (desktop/tablet/mobile)
- [ ] Add theme.json integration (spacing, colors, typography)
- [ ] Test with Twenty Twenty-Five theme
- [ ] Add icon support (SVG or icon library)
- [ ] Create hover states (if applicable)
- [ ] Ensure proper typography hierarchy
- [ ] Test color contrast ratios (WCAG AA)
- [ ] Add loading states (optional)

### Phase 6: Accessibility

- [ ] Add ARIA live regions to counter numbers
- [ ] Add `aria-label` with full context
- [ ] Hide decorative elements with `aria-hidden="true"`
- [ ] Implement `prefers-reduced-motion` support
- [ ] Add screen-reader-only live region
- [ ] Test with VoiceOver
- [ ] Test with NVDA
- [ ] Test keyboard navigation
- [ ] Run axe DevTools scan
- [ ] Fix any accessibility issues

### Phase 7: FSE Integration

- [ ] Add comprehensive `supports` to both blocks
- [ ] Create block example with preview
- [ ] Test in Site Editor
- [ ] Verify Global Styles work
- [ ] Test theme spacing presets
- [ ] Test theme color presets
- [ ] Create block patterns (e.g., "Stats Section")
- [ ] Add to block category "designsetgo"

### Phase 8: Testing

- [ ] Test adding/removing counters
- [ ] Test with 1-6 counters
- [ ] Test responsive breakpoints
- [ ] Test all animation easings
- [ ] Test prefix/suffix combinations
- [ ] Test decimal places (0, 1, 2, 3)
- [ ] Test large numbers (1,000,000+)
- [ ] Test negative numbers
- [ ] Test decimal numbers
- [ ] Test animation override on individual counters
- [ ] Test multiple counter groups on same page
- [ ] Test in different themes
- [ ] Test browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Test mobile devices (iOS, Android)

### Phase 9: Documentation

- [ ] Add JSDoc comments to all functions
- [ ] Create user documentation (how to use)
- [ ] Add code comments for complex logic
- [ ] Document animation options
- [ ] Document accessibility features
- [ ] Add troubleshooting guide
- [ ] Create examples/patterns

### Phase 10: Optimization

- [ ] Minimize bundle size
- [ ] Lazy load CountUp.js (if needed)
- [ ] Optimize CSS (remove unused styles)
- [ ] Add build optimization (webpack)
- [ ] Test Core Web Vitals (LCP, CLS, FID)
- [ ] Profile JavaScript performance
- [ ] Optimize for multiple instances

### Phase 11: Launch Preparation

- [ ] Final code review
- [ ] Final accessibility audit
- [ ] Final browser testing
- [ ] Final theme compatibility testing
- [ ] Create demo page
- [ ] Prepare release notes
- [ ] Update plugin version
- [ ] Build production assets

---

## Similar Blocks from Competitors

### Reference Implementations

#### 1. Kadence Blocks - Counter Block
- **Features:** Count up/down, icon, prefix/suffix, duration control
- **Accessibility:** Respects `prefers-reduced-motion`
- **Animation:** Scroll-triggered
- **URL:** https://wordpress.org/plugins/kadence-blocks/

#### 2. Stackable - Count Up Block
- **Features:** Grid layout, responsive columns, icon support
- **UI:** Clean sidebar controls
- **Styling:** Comprehensive color/typography options
- **URL:** https://wordpress.org/plugins/stackable-ultimate-gutenberg-blocks/

#### 3. Ultimate Addons for Gutenberg - Counter Block
- **Features:** Number animation, icon, label, customizable speed
- **Layout:** Flexible alignment options
- **URL:** https://wordpress.org/plugins/ultimate-addons-for-gutenberg/

#### 4. Spectra (formerly UAG) - Counter Block
- **Features:** Multi-counter grid, scroll animation, easing options
- **Performance:** Lightweight, optimized
- **URL:** https://wordpress.org/plugins/ultimate-addons-for-gutenberg/

#### 5. Otter Blocks - Counting Number Block
- **Features:** Animated counter with prefix/suffix
- **Integration:** Works with FSE
- **URL:** https://wordpress.org/plugins/otter-blocks/

### What They Do Well

✅ **Common Strengths:**
1. Simple, intuitive UI
2. Scroll-triggered animations (Intersection Observer)
3. Flexible layout options (grid, columns)
4. Icon integration
5. Prefix/suffix support
6. Responsive design
7. Theme integration

### What DesignSetGo Can Do Better

🎯 **Differentiators:**
1. **Superior Accessibility:** Full ARIA support, better screen reader experience
2. **Advanced Animation Control:** More easing options, per-counter overrides
3. **Better FSE Integration:** Comprehensive theme.json support
4. **Parent-Child Pattern:** More intuitive than single-block approach
5. **Performance-First:** Lightweight, optimized for Core Web Vitals
6. **Open Source Philosophy:** 100% free, no premium upsells

---

## Next Steps

### Immediate Actions

1. **Review this plan** - Discuss with team, get feedback
2. **Set up blocks** - Create directories, block.json files
3. **Install dependencies** - `npm install countup.js`
4. **Start with parent block** - Build Counter Group first
5. **Add child block** - Build Counter second
6. **Test integration** - Verify parent-child communication

### Development Timeline Estimate

- **Week 1:** Setup + Counter Group block (layout, controls)
- **Week 2:** Counter child block (number, label, icon)
- **Week 3:** Frontend animation (CountUp.js, Intersection Observer)
- **Week 4:** Accessibility + FSE integration
- **Week 5:** Testing + polish
- **Week 6:** Documentation + launch

**Total:** ~6 weeks for full implementation

### Resources

- **CountUp.js Docs:** https://github.com/inorganik/countUp.js
- **InnerBlocks Guide:** https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/nested-blocks-inner-blocks/
- **Intersection Observer API:** https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **WordPress Block Supports:** https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/

---

## Conclusion

The Counter/Stats block is a valuable addition to DesignSetGo that will provide users with an engaging way to showcase numerical data and statistics. By following this implementation plan, you'll create a block that is:

- **Accessible** - WCAG 2.1 AA compliant
- **Performant** - Lightweight, optimized animations
- **Flexible** - Customizable layout and styling
- **FSE-compatible** - Works with modern WordPress themes
- **User-friendly** - Intuitive controls, visual builder
- **Future-proof** - Uses WordPress best practices

The parent-child architecture provides the best balance of flexibility, maintainability, and user experience, while CountUp.js offers battle-tested animation functionality that saves development time.

**Ready to build? Start with Phase 1 of the implementation checklist!**

---

**Document Version:** 1.0
**Last Updated:** October 25, 2025
**Author:** Claude (Anthropic)
**Plugin:** DesignSetGo Blocks
