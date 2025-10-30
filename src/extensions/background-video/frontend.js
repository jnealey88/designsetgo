/**
 * Background Video Extension - Frontend
 *
 * Handles background video initialization on the frontend.
 *
 * @package DesignSetGo
 * @since 1.0.0
 */

(function () {
	'use strict';

	/**
	 * Initialize background videos
	 */
	function initBackgroundVideos() {
		const videoBlocks = document.querySelectorAll('.dsg-has-video-background');

		videoBlocks.forEach((block) => {
			const videoUrl = block.getAttribute('data-video-url');
			const posterUrl = block.getAttribute('data-video-poster');
			const muted = block.getAttribute('data-video-muted') === 'true';
			const loop = block.getAttribute('data-video-loop') === 'true';
			const autoplay = block.getAttribute('data-video-autoplay') === 'true';
			const mobileHide = block.getAttribute('data-video-mobile-hide') === 'true';

			if (!videoUrl) {
				return;
			}

			// Check if mobile and should hide
			const isMobile = window.innerWidth <= 767;
			if (isMobile && mobileHide) {
				return;
			}

			// Check if video already exists
			if (block.querySelector('.dsg-video-background')) {
				return;
			}

			// Create video wrapper
			const videoWrapper = document.createElement('div');
			videoWrapper.className = 'dsg-video-background';
			videoWrapper.style.position = 'absolute';
			videoWrapper.style.top = '0';
			videoWrapper.style.left = '0';
			videoWrapper.style.width = '100%';
			videoWrapper.style.height = '100%';
			videoWrapper.style.zIndex = '0';
			videoWrapper.style.overflow = 'hidden';
			videoWrapper.style.pointerEvents = 'none';

			// Create video element
			const video = document.createElement('video');
			video.src = videoUrl;
			if (posterUrl) {
				video.poster = posterUrl;
			}
			video.muted = muted;
			video.loop = loop;
			video.autoplay = autoplay;
			video.playsInline = true;
			video.style.width = '100%';
			video.style.height = '100%';
			video.style.objectFit = 'cover';

			// Append video to wrapper
			videoWrapper.appendChild(video);

			// Ensure block has position relative
			const blockPosition = window.getComputedStyle(block).position;
			if (blockPosition === 'static') {
				block.style.position = 'relative';
			}

			// Insert video wrapper as first child
			block.insertBefore(videoWrapper, block.firstChild);

			// Ensure content is above video
			Array.from(block.children).forEach((child) => {
				if (child !== videoWrapper) {
					const childPosition = window.getComputedStyle(child).position;
					if (childPosition === 'static') {
						child.style.position = 'relative';
						child.style.zIndex = '2';
					}
				}
			});

			// Play video if autoplay is enabled
			if (autoplay) {
				const playPromise = video.play();
				if (playPromise !== undefined) {
					playPromise.catch(() => {
						// Autoplay failed, likely because not muted
						console.warn('Background video autoplay failed. Video must be muted for autoplay.');
					});
				}
			}
		});
	}

	// Initialize on DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initBackgroundVideos);
	} else {
		initBackgroundVideos();
	}

	// Re-initialize on window resize (for mobile hide/show)
	let resizeTimeout;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			// Remove existing videos
			document.querySelectorAll('.dsg-video-background').forEach((video) => {
				video.remove();
			});
			// Re-initialize
			initBackgroundVideos();
		}, 250);
	});
})();
