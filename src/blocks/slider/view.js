/**
 * Slider Block - Frontend JavaScript
 * Handles all slider interactions: navigation, auto-play, swipe, drag, keyboard
 */

class DSGSlider {
	constructor(element) {
		this.slider = element;
		this.viewport = element.querySelector('.dsg-slider__viewport');
		this.track = element.querySelector('.dsg-slider__track');
		this.originalSlides = Array.from(
			element.querySelectorAll('.dsg-slide')
		);

		if (this.originalSlides.length === 0) {
			return;
		}

		// Parse configuration from data attributes
		this.config = this.parseConfig();

		// State
		this.currentIndex = parseInt(this.config.activeSlide) || 0;
		this.isAnimating = false;
		this.autoplayTimer = null;
		this.isInViewport = false;
		this.touchStartX = 0;
		this.touchEndX = 0;
		this.dragStartX = 0;
		this.isDragging = false;
		this.cloneCount = 0;
		this.realSlideCount = this.originalSlides.length;

		// Setup infinite loop clones if needed
		if (this.config.loop && this.config.effect === 'slide') {
			this.setupInfiniteLoop();
		}

		// Get all slides (including clones)
		this.slides = Array.from(this.track.querySelectorAll('.dsg-slide'));

		// Initialize
		this.init();
	}

	parseConfig() {
		return {
			slidesPerView: parseInt(this.slider.dataset.slidesPerView) || 1,
			slidesPerViewTablet:
				parseInt(this.slider.dataset.slidesPerViewTablet) || 1,
			slidesPerViewMobile:
				parseInt(this.slider.dataset.slidesPerViewMobile) || 1,
			effect: this.slider.dataset.effect || 'slide',
			transitionDuration:
				this.slider.dataset.transitionDuration || '0.5s',
			transitionEasing:
				this.slider.dataset.transitionEasing || 'ease-in-out',
			autoplay: this.slider.dataset.autoplay === 'true',
			autoplayInterval:
				parseInt(this.slider.dataset.autoplayInterval) || 3000,
			pauseOnHover: this.slider.dataset.pauseOnHover === 'true',
			pauseOnInteraction:
				this.slider.dataset.pauseOnInteraction === 'true',
			loop: this.slider.dataset.loop === 'true',
			draggable: this.slider.dataset.draggable === 'true',
			swipeable: this.slider.dataset.swipeable === 'true',
			freeMode: this.slider.dataset.freeMode === 'true',
			centeredSlides: this.slider.dataset.centeredSlides === 'true',
			showArrows: this.slider.dataset.showArrows === 'true',
			showDots: this.slider.dataset.showDots === 'true',
			mobileBreakpoint:
				parseInt(this.slider.dataset.mobileBreakpoint) || 768,
			tabletBreakpoint:
				parseInt(this.slider.dataset.tabletBreakpoint) || 1024,
			activeSlide: parseInt(this.slider.dataset.activeSlide) || 0,
		};
	}

	setupInfiniteLoop() {
		// Determine how many slides to clone (based on slides per view)
		const slidesToClone = Math.ceil(this.config.slidesPerView);
		this.cloneCount = slidesToClone;

		// Clone last N slides and prepend to track
		for (
			let i = this.originalSlides.length - slidesToClone;
			i < this.originalSlides.length;
			i++
		) {
			const clone = this.originalSlides[i].cloneNode(true);
			clone.classList.add('dsg-slide--clone');
			clone.classList.add('dsg-slide--clone-before');
			clone.setAttribute('aria-hidden', 'true');
			clone.removeAttribute('id'); // Remove any IDs from clones
			this.track.insertBefore(clone, this.track.firstChild);
		}

		// Clone first N slides and append to track
		for (let i = 0; i < slidesToClone; i++) {
			const clone = this.originalSlides[i].cloneNode(true);
			clone.classList.add('dsg-slide--clone');
			clone.classList.add('dsg-slide--clone-after');
			clone.setAttribute('aria-hidden', 'true');
			clone.removeAttribute('id'); // Remove any IDs from clones
			this.track.appendChild(clone);
		}

		// Adjust currentIndex to account for prepended clones
		this.currentIndex = this.currentIndex + this.cloneCount;
	}

	init() {
		// Build navigation
		if (this.config.showArrows) {
			this.buildArrows();
		}
		if (this.config.showDots) {
			this.buildDots();
		}

		// Add screen reader announcement region
		this.buildAnnouncementRegion();

		// Set initial slide
		this.goToSlide(this.currentIndex, false);

		// Initialize features
		if (this.config.swipeable) {
			this.initSwipe();
		}
		if (this.config.draggable) {
			this.initDrag();
		}
		if (this.config.autoplay) {
			this.observeVisibility();
		}

		this.initKeyboard();
		this.initResponsive();

		// Check reduced motion preference
		this.respectReducedMotion();
	}

	buildArrows() {
		// Remove editor-only arrows if present
		const editorArrows = this.slider.querySelector(
			'.dsg-slider__arrows--editor-only'
		);
		if (editorArrows) {
			editorArrows.remove();
		}

		const arrowsContainer = document.createElement('div');
		arrowsContainer.className = 'dsg-slider__arrows';
		arrowsContainer.innerHTML = `
			<button type="button" class="dsg-slider__arrow dsg-slider__arrow--prev" aria-label="Previous slide">
				<span>‹</span>
			</button>
			<button type="button" class="dsg-slider__arrow dsg-slider__arrow--next" aria-label="Next slide">
				<span>›</span>
			</button>
		`;

		this.slider.appendChild(arrowsContainer);

		this.prevArrow = arrowsContainer.querySelector(
			'.dsg-slider__arrow--prev'
		);
		this.nextArrow = arrowsContainer.querySelector(
			'.dsg-slider__arrow--next'
		);

		this.prevArrow.addEventListener('click', () => this.prev());
		this.nextArrow.addEventListener('click', () => this.next());

		this.updateArrows();
	}

	buildDots() {
		// Remove editor-only dots if present
		const editorDots = this.slider.querySelector(
			'.dsg-slider__dots--editor-only'
		);
		if (editorDots) {
			editorDots.remove();
		}

		const dotsContainer = document.createElement('div');
		dotsContainer.className = 'dsg-slider__dots';
		dotsContainer.setAttribute('role', 'tablist');
		dotsContainer.setAttribute('aria-label', 'Slide navigation');

		// Only create dots for real slides, not clones
		const dotCount =
			this.cloneCount > 0 ? this.realSlideCount : this.slides.length;

		for (let i = 0; i < dotCount; i++) {
			const dot = document.createElement('button');
			dot.type = 'button';
			dot.className = 'dsg-slider__dot';
			dot.setAttribute('role', 'tab');
			dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
			const realIndex = this.cloneCount > 0 ? i + this.cloneCount : i;
			dot.setAttribute(
				'aria-selected',
				realIndex === this.currentIndex ? 'true' : 'false'
			);
			dot.addEventListener('click', () => this.goToSlide(realIndex));
			dotsContainer.appendChild(dot);
		}

		this.slider.appendChild(dotsContainer);
		this.dots = Array.from(
			dotsContainer.querySelectorAll('.dsg-slider__dot')
		);
		this.updateDots();
	}

	buildAnnouncementRegion() {
		// Create visually hidden region for screen reader announcements
		const announcer = document.createElement('div');
		announcer.className = 'dsg-slider__announcer';
		announcer.setAttribute('role', 'status');
		announcer.setAttribute('aria-live', 'polite');
		announcer.setAttribute('aria-atomic', 'true');
		announcer.style.position = 'absolute';
		announcer.style.left = '-9999px';
		announcer.style.width = '1px';
		announcer.style.height = '1px';
		announcer.style.overflow = 'hidden';

		this.slider.appendChild(announcer);
		this.announcer = announcer;
	}

	goToSlide(index, animate = true) {
		if (this.isAnimating && animate) {
			return;
		}

		const previousIndex = this.currentIndex;

		// Handle loop mode with clones (slide effect)
		if (
			this.config.loop &&
			this.cloneCount > 0 &&
			this.config.effect === 'slide'
		) {
			// Allow moving to clones, they will be handled in applySlideTransition
			this.currentIndex = index;
		}
		// Handle loop mode without clones (other effects)
		else if (this.config.loop) {
			if (index < 0) {
				index = this.slides.length - 1;
			}
			if (index >= this.slides.length) {
				index = 0;
			}
			this.currentIndex = index;
		}
		// No loop - clamp to valid range
		else {
			this.currentIndex = Math.max(
				0,
				Math.min(index, this.slides.length - 1)
			);
		}

		if (!animate) {
			this.isAnimating = false;
		} else {
			this.isAnimating = true;
		}

		// Apply transition based on effect type
		if (this.config.effect === 'slide') {
			this.applySlideTransition(animate);
		} else if (this.config.effect === 'fade') {
			this.applyFadeTransition();
		} else if (this.config.effect === 'zoom') {
			this.applyZoomTransition();
		}

		// Update navigation
		this.updateArrows();
		this.updateDots();
		this.updateARIA();

		// Pause autoplay on interaction
		if (this.config.pauseOnInteraction && this.autoplayTimer) {
			this.stopAutoplay();
		}

		// Dispatch custom event (use real index for event)
		const realIndex = this.getRealIndex(this.currentIndex);
		this.slider.dispatchEvent(
			new CustomEvent('dsg-slider-change', {
				detail: {
					previousIndex: this.getRealIndex(previousIndex),
					currentIndex: realIndex,
				},
			})
		);

		// Announce slide change to screen readers
		if (this.announcer && animate) {
			const totalSlides =
				this.cloneCount > 0 ? this.realSlideCount : this.slides.length;
			this.announcer.textContent = `Slide ${realIndex + 1} of ${totalSlides}`;
		}

		// Reset animating state
		if (animate) {
			const duration = parseFloat(this.config.transitionDuration) * 1000;
			setTimeout(() => {
				this.isAnimating = false;
			}, duration);
		}
	}

	applySlideTransition(animate = true) {
		const slideWidth = this.slides[0].offsetWidth;
		const gap = parseFloat(window.getComputedStyle(this.track).gap) || 0;
		const offset = -(this.currentIndex * (slideWidth + gap));

		// Apply transition
		if (!animate) {
			this.track.style.transition = 'none';
			this.track.style.transform = `translateX(${offset}px)`;
			// eslint-disable-next-line no-unused-expressions
			this.track.offsetHeight; // Force reflow
			this.track.style.transition = '';
		} else {
			this.track.style.transform = `translateX(${offset}px)`;

			// For infinite loop: check if we're on a clone and need to jump to real slide
			if (this.cloneCount > 0) {
				const duration =
					parseFloat(this.config.transitionDuration) * 1000;
				setTimeout(() => {
					let needsJump = false;
					let newIndex = this.currentIndex;

					// If we're on a clone after the real slides, jump to the corresponding real slide at the start
					if (
						this.currentIndex >=
						this.cloneCount + this.realSlideCount
					) {
						newIndex =
							this.cloneCount +
							(this.currentIndex -
								(this.cloneCount + this.realSlideCount));
						needsJump = true;
					}
					// If we're on a clone before the real slides, jump to the corresponding real slide at the end
					else if (this.currentIndex < this.cloneCount) {
						newIndex =
							this.cloneCount +
							this.realSlideCount -
							(this.cloneCount - this.currentIndex);
						needsJump = true;
					}

					if (needsJump) {
						this.currentIndex = newIndex;
						this.track.style.transition = 'none';
						this.track.style.transform = `translateX(${-(newIndex * (slideWidth + gap))}px)`;
						// eslint-disable-next-line no-unused-expressions
						this.track.offsetHeight; // Force reflow
						this.track.style.transition = '';

						// Update navigation after jump
						this.updateDots();
						this.updateARIA();
					}
				}, duration);
			}
		}
	}

	applyFadeTransition() {
		this.slides.forEach((slide, index) => {
			slide.classList.toggle(
				'dsg-slide--active',
				index === this.currentIndex
			);
		});
	}

	applyZoomTransition() {
		this.slides.forEach((slide, index) => {
			slide.classList.toggle(
				'dsg-slide--active',
				index === this.currentIndex
			);
		});
	}

	next() {
		this.goToSlide(this.currentIndex + 1);
	}

	prev() {
		this.goToSlide(this.currentIndex - 1);
	}

	updateArrows() {
		if (!this.prevArrow || !this.nextArrow) {
			return;
		}

		if (!this.config.loop) {
			// For non-loop, account for clones in the index
			const minIndex = this.cloneCount;
			const maxIndex =
				this.cloneCount > 0
					? this.cloneCount + this.realSlideCount - 1
					: this.slides.length - 1;
			this.prevArrow.disabled = this.currentIndex === minIndex;
			this.nextArrow.disabled = this.currentIndex === maxIndex;
		} else {
			this.prevArrow.disabled = false;
			this.nextArrow.disabled = false;
		}
	}

	getRealIndex(index) {
		if (this.cloneCount === 0) {
			return index;
		}

		// Convert any index to its real slide equivalent
		const adjustedIndex = index - this.cloneCount;
		if (adjustedIndex < 0) {
			return this.realSlideCount + adjustedIndex;
		} else if (adjustedIndex >= this.realSlideCount) {
			return adjustedIndex - this.realSlideCount;
		}
		return adjustedIndex;
	}

	updateDots() {
		if (!this.dots) {
			return;
		}

		const realIndex = this.getRealIndex(this.currentIndex);

		this.dots.forEach((dot, index) => {
			const isActive = index === realIndex;
			dot.classList.toggle('dsg-slider__dot--active', isActive);
			dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
		});
	}

	updateARIA() {
		this.slides.forEach((slide, index) => {
			const isActive = index === this.currentIndex;
			slide.setAttribute('aria-hidden', !isActive ? 'true' : 'false');
			slide.setAttribute('tabindex', isActive ? '0' : '-1');
		});
	}

	// Swipe support (touch devices)
	initSwipe() {
		this.track.addEventListener(
			'touchstart',
			(e) => {
				this.touchStartX = e.touches[0].clientX;
			},
			{ passive: true }
		);

		this.track.addEventListener(
			'touchend',
			(e) => {
				this.touchEndX = e.changedTouches[0].clientX;
				this.handleSwipe();
			},
			{ passive: true }
		);
	}

	handleSwipe() {
		const diff = this.touchStartX - this.touchEndX;
		const threshold = 50;

		if (Math.abs(diff) > threshold) {
			if (diff > 0) {
				this.next();
			} else {
				this.prev();
			}
		}
	}

	// Drag support (mouse)
	initDrag() {
		let startX = 0;
		let currentTranslate = 0;
		let previousTranslate = 0;

		this.track.addEventListener('mousedown', (e) => {
			this.isDragging = true;
			startX = e.clientX;
			this.track.style.cursor = 'grabbing';
			previousTranslate = currentTranslate;
		});

		document.addEventListener('mousemove', (e) => {
			if (!this.isDragging) {
				return;
			}

			const currentX = e.clientX;
			const diff = currentX - startX;
			currentTranslate = previousTranslate + diff;

			if (this.config.effect === 'slide') {
				this.track.style.transform = `translateX(${currentTranslate}px)`;
			}
		});

		document.addEventListener('mouseup', () => {
			if (!this.isDragging) {
				return;
			}

			this.isDragging = false;
			this.track.style.cursor = 'grab';

			const diff = currentTranslate - previousTranslate;
			const threshold = 50;

			if (Math.abs(diff) > threshold) {
				if (diff < 0) {
					this.next();
				} else {
					this.prev();
				}
			} else {
				this.goToSlide(this.currentIndex); // Snap back
			}
		});

		this.track.style.cursor = 'grab';
	}

	// Keyboard navigation
	initKeyboard() {
		this.slider.addEventListener('keydown', (e) => {
			if (
				e.target !== this.slider &&
				!this.slider.contains(e.target.ownerDocument.activeElement)
			) {
				return;
			}

			switch (e.key) {
				case 'ArrowLeft':
					e.preventDefault();
					this.prev();
					break;
				case 'ArrowRight':
					e.preventDefault();
					this.next();
					break;
				case 'Home':
					e.preventDefault();
					this.goToSlide(0);
					break;
				case 'End':
					e.preventDefault();
					this.goToSlide(this.slides.length - 1);
					break;
			}
		});

		// Make slider focusable
		if (!this.slider.hasAttribute('tabindex')) {
			this.slider.setAttribute('tabindex', '0');
		}
	}

	// Responsive handling
	initResponsive() {
		let resizeTimer;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(() => {
				this.goToSlide(this.currentIndex, false);
			}, 250);
		});
	}

	// Auto-play with IntersectionObserver
	observeVisibility() {
		const observer = new window.IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					this.isInViewport = entry.isIntersecting;
					if (this.isInViewport) {
						this.startAutoplay();
					} else {
						this.stopAutoplay();
					}
				});
			},
			{ threshold: 0.5 }
		);

		observer.observe(this.slider);

		// Pause on hover
		if (this.config.pauseOnHover) {
			this.slider.addEventListener('mouseenter', () =>
				this.stopAutoplay()
			);
			this.slider.addEventListener('mouseleave', () => {
				if (this.isInViewport) {
					this.startAutoplay();
				}
			});
		}
	}

	startAutoplay() {
		if (!this.config.autoplay || this.autoplayTimer) {
			return;
		}

		this.autoplayTimer = setInterval(() => {
			this.next();
		}, this.config.autoplayInterval);
	}

	stopAutoplay() {
		if (this.autoplayTimer) {
			clearInterval(this.autoplayTimer);
			this.autoplayTimer = null;
		}
	}

	// Respect reduced motion preference
	respectReducedMotion() {
		const prefersReducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches;

		if (prefersReducedMotion) {
			this.config.transitionDuration = '0s';
			this.track.style.transition = 'none';
			this.slides.forEach((slide) => {
				slide.style.transition = 'none';
			});

			// Disable autoplay for reduced motion
			if (this.config.autoplay) {
				this.stopAutoplay();
			}
		}
	}
}

// Initialize all sliders on page load
document.addEventListener('DOMContentLoaded', () => {
	const sliders = document.querySelectorAll('.dsg-slider');
	sliders.forEach((slider) => {
		new DSGSlider(slider);
	});
});
