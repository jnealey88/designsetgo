/**
 * Scrolling Gallery Block - Frontend JavaScript
 * Handles scroll-based horizontal animation with seamless infinite loop
 */

/* global IntersectionObserver, requestAnimationFrame */

// Track initialized marquees to prevent double initialization
const initializedMarquees = new WeakSet();

/**
 * Get images and their loading state for a marquee
 *
 * @param {HTMLElement} marquee - The marquee element to check
 * @return {{images: HTMLImageElement[], allLoaded: boolean}} Object containing images array and loading state
 */
function getMarqueeImageLoadState(marquee) {
	const images = Array.from(marquee.querySelectorAll('img'));
	const allLoaded =
		images.length === 0 ||
		images.every((img) => img.complete && img.naturalHeight !== 0);
	return { images, allLoaded };
}

/**
 * Initialize a single marquee element
 *
 * @param {HTMLElement} marquee - The marquee element to initialize
 */
function initSingleMarquee(marquee) {
	// Prevent double initialization
	if (initializedMarquees.has(marquee)) {
		return;
	}
	initializedMarquees.add(marquee);

	// Check if user prefers reduced motion
	const prefersReducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;

	if (prefersReducedMotion) {
		return; // Don't animate if user prefers reduced motion
	}

	const scrollSpeed = parseFloat(marquee.dataset.scrollSpeed) || 0.5;
	const rows = marquee.querySelectorAll('.dsgo-scroll-marquee__row');

	if (!rows.length) {
		return;
	}

	// Performance: Cache row data (segment widths and gaps)
	let rowData = [];

	/**
	 * Calculate and cache dimensions for all rows
	 * Performance optimization: Batches all layout reads together
	 */
	function calculateDimensions() {
		// Batch all layout reads (prevents layout thrashing)
		const newRowData = [];

		rows.forEach((row) => {
			const track = row.querySelector('.dsgo-scroll-marquee__track');
			const segment = track?.querySelector(
				'.dsgo-scroll-marquee__track-segment'
			);

			if (segment && track) {
				// Read all layout properties at once
				const segmentWidth = segment.offsetWidth;
				const gapStyle = window.getComputedStyle(track).gap || '20px';
				const gap = parseFloat(gapStyle);

				newRowData.push({
					segmentWidth,
					gap,
				});
			} else {
				newRowData.push({ segmentWidth: 0, gap: 0 });
			}
		});

		// Update cached data after all reads are complete
		rowData = newRowData;
	}

	// Check if element is in viewport initially
	const rect = marquee.getBoundingClientRect();
	const viewportHeight =
		window.innerHeight || document.documentElement.clientHeight;
	let isInViewport = rect.top < viewportHeight && rect.bottom > 0;

	// Use Intersection Observer to only animate when visible
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				isInViewport = entry.isIntersecting;
			});
		},
		{
			root: null,
			rootMargin: '0px',
			threshold: 0.1,
		}
	);

	observer.observe(marquee);

	// Scroll event handler with requestAnimationFrame throttling
	let ticking = false;

	function updateMarquee() {
		if (!isInViewport) {
			ticking = false;
			return;
		}

		const scrollY = window.scrollY || window.pageYOffset;

		rows.forEach((row, index) => {
			const track = row.querySelector('.dsgo-scroll-marquee__track');
			if (!track) {
				return;
			}

			const direction = row.dataset.direction;
			const data = rowData[index];

			if (data && data.segmentWidth > 0) {
				// Simplified scroll calculation: just use scroll position * speed
				let scrollPosition = scrollY * scrollSpeed;

				// Apply modulo to create seamless infinite loop
				// With 6 duplicates, we loop every 1 segment (plus its gap)
				const loopRange = data.segmentWidth + data.gap;
				scrollPosition = scrollPosition % loopRange;

				// Apply direction and offset
				let translateX;
				if (direction === 'left') {
					// Left scrolling: move images left (negative)
					translateX = -scrollPosition;
				} else {
					// Right scrolling: start images off-screen left, move right (positive)
					// Offset by segment width so images start to the left
					translateX = scrollPosition - data.segmentWidth;
				}

				track.style.transform = `translateX(${translateX}px)`;
			}
		});

		ticking = false;
	}

	function requestTick() {
		if (!ticking) {
			requestAnimationFrame(updateMarquee);
			ticking = true;
		}
	}

	// Use requestAnimationFrame to ensure layout is complete before measuring
	requestAnimationFrame(() => {
		// Initial dimension calculation
		calculateDimensions();

		// If dimensions are still 0, recalculate after a short delay
		// This handles cases where CSS hasn't fully applied yet
		const hasZeroDimensions = rowData.some(
			(data) => data.segmentWidth === 0
		);
		if (hasZeroDimensions) {
			setTimeout(() => {
				calculateDimensions();
				// Trigger an initial update after recalculation
				updateMarquee();
			}, 100);
		}

		// Initial update
		updateMarquee();
	});

	// Recalculate on resize (debounced)
	let resizeTimer;
	const handleResize = () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			calculateDimensions();
		}, 250);
	};
	window.addEventListener('resize', handleResize, { passive: true });

	// Add scroll listener with passive flag for better performance
	window.addEventListener('scroll', requestTick, { passive: true });
}

/**
 * Initialize marquees after ensuring images are loaded
 */
function initScrollMarquees() {
	const marquees = document.querySelectorAll('.dsgo-scroll-marquee');

	if (!marquees.length) {
		return;
	}

	marquees.forEach((marquee) => {
		const { images, allLoaded } = getMarqueeImageLoadState(marquee);

		if (allLoaded) {
			// Images already loaded, initialize immediately
			initSingleMarquee(marquee);
		} else {
			// Wait for images to load
			let loadedCount = 0;
			const totalImages = images.length;

			const checkAndInitialize = () => {
				if (loadedCount === totalImages) {
					initSingleMarquee(marquee);
				}
			};

			const onImageLoad = () => {
				loadedCount++;
				checkAndInitialize();
			};

			images.forEach((img) => {
				if (img.complete) {
					loadedCount++;
				} else {
					// Attach both load and error listeners to ensure marquee initializes
					// even if images fail to load
					img.addEventListener('load', onImageLoad, { once: true });
					img.addEventListener('error', onImageLoad, { once: true });

					// Re-check in case image loaded between check and listener attachment
					if (img.complete) {
						img.removeEventListener('load', onImageLoad);
						img.removeEventListener('error', onImageLoad);
						loadedCount++;
					}
				}
			});

			// Initialize if all images completed during listener setup
			checkAndInitialize();

			// Fallback: Initialize after timeout if images take too long
			setTimeout(() => {
				if (!initializedMarquees.has(marquee)) {
					initSingleMarquee(marquee);
				}
			}, 3000);
		}
	});
}

// Initialize on DOMContentLoaded
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initScrollMarquees);
} else {
	// DOM already loaded
	initScrollMarquees();
}

// Also initialize on load event as backup (ensures all resources loaded)
window.addEventListener('load', () => {
	// Initialize any marquees that weren't initialized yet
	const marquees = document.querySelectorAll('.dsgo-scroll-marquee');
	marquees.forEach((marquee) => {
		if (!initializedMarquees.has(marquee)) {
			initSingleMarquee(marquee);
		}
	});
});
