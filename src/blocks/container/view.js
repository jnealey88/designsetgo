/**
 * Container Block - Frontend JavaScript
 *
 * WordPress Best Practice Approach:
 * - Layouts are applied via inline styles (no JavaScript needed)
 * - This file only handles interactive features (video, clickable)
 *
 * Features:
 * - Lazy-loaded video backgrounds with Intersection Observer
 * - Clickable container links
 */

/* global IntersectionObserver */

/**
 * Initialize container features on page load
 */
document.addEventListener('DOMContentLoaded', () => {
	initVideoBackgrounds();
	initClickableContainers();
});

/**
 * Initialize video backgrounds with lazy loading
 */
function initVideoBackgrounds() {
	const containers = document.querySelectorAll(
		'.dsg-container.has-video-background'
	);

	if (!containers.length) {
		return;
	}

	// Use Intersection Observer for lazy loading
	const videoObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					loadVideoBackground(entry.target);
					videoObserver.unobserve(entry.target);
				}
			});
		},
		{
			rootMargin: '50px', // Start loading 50px before element enters viewport
		}
	);

	containers.forEach((container) => {
		// Ensure container has position relative
		const currentPosition = window.getComputedStyle(container).position;
		if (currentPosition === 'static') {
			container.style.position = 'relative';
		}

		videoObserver.observe(container);
	});
}

/**
 * Load video background for a container
 * @param {HTMLElement} container - Container element
 */
function loadVideoBackground(container) {
	const videoUrl = container.dataset.videoUrl;
	const posterUrl = container.dataset.videoPoster;
	const autoplay = container.dataset.videoAutoplay === 'true';
	const loop = container.dataset.videoLoop === 'true';
	const muted = container.dataset.videoMuted === 'true';

	if (!videoUrl) {
		return;
	}

	// Sanitize URL
	const sanitizedVideoUrl = sanitizeUrl(videoUrl);
	if (!sanitizedVideoUrl) {
		return;
	}

	// Create video container
	const videoContainer = document.createElement('div');
	videoContainer.className = 'dsg-video-background';
	videoContainer.style.cssText = `
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		z-index: 0;
		pointer-events: none;
	`;

	// Add poster as background if provided
	if (posterUrl) {
		const sanitizedPoster = sanitizeUrl(posterUrl);
		if (sanitizedPoster) {
			videoContainer.style.backgroundImage = `url(${sanitizedPoster})`;
			videoContainer.style.backgroundSize = 'cover';
			videoContainer.style.backgroundPosition = 'center';
		}
	}

	// Create video element
	const video = document.createElement('video');
	video.style.cssText = `
		position: absolute;
		top: 50%;
		left: 50%;
		min-width: 100%;
		min-height: 100%;
		width: auto;
		height: auto;
		transform: translate(-50%, -50%);
		object-fit: cover;
	`;

	// Set video attributes
	if (posterUrl) {
		video.setAttribute('poster', posterUrl);
	}
	if (autoplay) {
		video.setAttribute('autoplay', '');
	}
	if (loop) {
		video.setAttribute('loop', '');
	}
	if (muted) {
		video.setAttribute('muted', '');
	}
	video.setAttribute('playsinline', '');
	video.setAttribute('preload', 'metadata');

	// Create video source
	const source = document.createElement('source');
	source.src = sanitizedVideoUrl;
	source.type = 'video/mp4';

	video.appendChild(source);
	videoContainer.appendChild(video);

	// Insert video container at the beginning
	container.insertBefore(videoContainer, container.firstChild);

	// Ensure content stays above video
	const children = Array.from(container.children);
	children.forEach((child) => {
		if (
			child !== videoContainer &&
			!child.classList.contains('dsg-overlay')
		) {
			child.style.position = 'relative';
			child.style.zIndex = '2';
		}
	});
}

/**
 * Initialize clickable containers
 */
function initClickableContainers() {
	const clickableContainers = document.querySelectorAll(
		'.dsg-container.is-clickable'
	);

	clickableContainers.forEach((container) => {
		const linkUrl = container.dataset.linkUrl;
		const linkTarget = container.dataset.linkTarget || '_self';
		const linkRel = container.dataset.linkRel || '';

		if (!linkUrl) {
			return;
		}

		// Add cursor pointer
		container.style.cursor = 'pointer';

		// Handle click
		container.addEventListener('click', (e) => {
			// Don't intercept clicks on interactive elements
			const isInteractive =
				e.target.tagName === 'A' ||
				e.target.tagName === 'BUTTON' ||
				e.target.closest('a') ||
				e.target.closest('button');

			if (isInteractive) {
				return;
			}

			// Open link
			if (linkTarget === '_blank') {
				const newWindow = window.open(linkUrl, '_blank');
				if (newWindow) {
					newWindow.opener = null; // Security
					if (linkRel) {
						newWindow.rel = linkRel;
					}
				}
			} else {
				window.location.href = linkUrl;
			}
		});
	});
}

/**
 * Sanitize URL to prevent XSS
 * @param {string} url - URL to sanitize
 * @return {string|null} Sanitized URL or null if invalid
 */
function sanitizeUrl(url) {
	if (!url || typeof url !== 'string') {
		return null;
	}

	// Remove dangerous protocols
	const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
	const lowerUrl = url.toLowerCase().trim();

	for (const protocol of dangerousProtocols) {
		if (lowerUrl.startsWith(protocol)) {
			return null;
		}
	}

	// Allow only http(s) and relative URLs
	if (
		lowerUrl.startsWith('http://') ||
		lowerUrl.startsWith('https://') ||
		lowerUrl.startsWith('/') ||
		lowerUrl.startsWith('./')
	) {
		return url;
	}

	return null;
}
