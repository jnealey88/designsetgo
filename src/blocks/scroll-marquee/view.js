/**
 * Scroll Marquee Block - Frontend JavaScript
 * Handles scroll-based horizontal animation with seamless infinite loop
 */

/* global IntersectionObserver, requestAnimationFrame */

function initScrollMarquees() {
	const marquees = document.querySelectorAll('.dsg-scroll-marquee');

	if (!marquees.length) {
		return;
	}

	// Check if user prefers reduced motion
	const prefersReducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;

	if (prefersReducedMotion) {
		return; // Don't animate if user prefers reduced motion
	}

	marquees.forEach((marquee) => {
		const scrollSpeed = parseFloat(marquee.dataset.scrollSpeed) || 0.5;
		const rows = marquee.querySelectorAll('.dsg-scroll-marquee__row');

		if (!rows.length) {
			return;
		}

		// Calculate segment width for each row (for infinite loop)
		const rowData = [];
		rows.forEach((row) => {
			const track = row.querySelector('.dsg-scroll-marquee__track');
			const segment = track?.querySelector(
				'.dsg-scroll-marquee__track-segment'
			);
			if (segment) {
				// Get the width of one segment (one set of images)
				const segmentWidth = segment.offsetWidth;
				// Get gap from track (gap is between segments)
				const gapStyle = window.getComputedStyle(track).gap || '20px';
				const gap = parseFloat(gapStyle);

				// For seamless loop: we have 6 segments, loop every 1 segment
				// This ensures we always have enough duplicates visible
				rowData.push({
					segmentWidth,
					gap,
				});
			} else {
				rowData.push({ segmentWidth: 0, gap: 0 });
			}
		});

		let isInViewport = false;

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
				const track = row.querySelector('.dsg-scroll-marquee__track');
				if (!track) {
					return;
				}

				const direction = row.dataset.direction;
				const data = rowData[index];

				if (data.segmentWidth > 0) {
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

		// Add scroll listener with passive flag for better performance
		window.addEventListener('scroll', requestTick, { passive: true });

		// Initial update
		updateMarquee();
	});
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initScrollMarquees);
} else {
	// DOM already loaded
	initScrollMarquees();
}
