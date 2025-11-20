/**
 * Modal Block Variations
 *
 * Pre-configured modal patterns for common use cases.
 *
 * @package DesignSetGo
 */

import { __ } from '@wordpress/i18n';

const variations = [
	{
		name: 'newsletter',
		title: __('Newsletter Signup', 'designsetgo'),
		description: __('Modal optimized for newsletter signup forms with exit intent trigger.', 'designsetgo'),
		icon: 'email',
		attributes: {
			width: '500px',
			maxWidth: '90vw',
			height: 'auto',
			maxHeight: '90vh',
			autoTriggerType: 'exitIntent',
			exitIntentSensitivity: 'medium',
			exitIntentMinTime: 10,
			autoTriggerFrequency: 'once',
			cookieDuration: 30,
			overlayColor: '#000000',
			overlayOpacity: 80,
			animationType: 'slide-up',
		},
		innerBlocks: [
			[
				'core/heading',
				{
					level: 2,
					content: __('Subscribe to Our Newsletter', 'designsetgo'),
					textAlign: 'center',
				},
			],
			[
				'core/paragraph',
				{
					content: __(
						'Get the latest updates and exclusive content delivered to your inbox.',
						'designsetgo'
					),
					align: 'center',
				},
			],
			[
				'core/paragraph',
				{
					content: __(
						'<strong>Email:</strong> <input type="email" placeholder="your@email.com" style="width: 100%; padding: 8px; margin: 8px 0;" />',
						'designsetgo'
					),
				},
			],
			[
				'core/buttons',
				{
					layout: { type: 'flex', justifyContent: 'center' },
				},
				[
					[
						'core/button',
						{
							text: __('Subscribe', 'designsetgo'),
							width: 100,
						},
					],
				],
			],
		],
		scope: ['block'],
	},
	{
		name: 'video',
		title: __('Video Player', 'designsetgo'),
		description: __('Modal optimized for video content with 16:9 aspect ratio.', 'designsetgo'),
		icon: 'video-alt3',
		attributes: {
			width: '800px',
			maxWidth: '95vw',
			height: 'auto',
			maxHeight: '95vh',
			overlayColor: '#000000',
			overlayOpacity: 95,
			animationType: 'zoom',
			closeButtonPosition: 'outside-top-right',
		},
		innerBlocks: [
			[
				'core/embed',
				{
					url: '',
					type: 'video',
					providerNameSlug: 'youtube',
					responsive: true,
					className: 'wp-embed-aspect-16-9',
				},
			],
		],
		scope: ['block'],
	},
	{
		name: 'lightbox',
		title: __('Image Lightbox', 'designsetgo'),
		description: __('Full-screen modal for displaying images with minimal chrome.', 'designsetgo'),
		icon: 'format-image',
		attributes: {
			width: 'auto',
			maxWidth: '95vw',
			height: 'auto',
			maxHeight: '95vh',
			overlayColor: '#000000',
			overlayOpacity: 90,
			overlayBlur: 5,
			animationType: 'fade',
			closeButtonPosition: 'inside-top-right',
			closeButtonSize: 32,
			closeButtonIconColor: '#ffffff',
			closeButtonBgColor: 'rgba(0, 0, 0, 0.5)',
		},
		innerBlocks: [
			[
				'core/image',
				{
					url: '',
					alt: '',
					sizeSlug: 'full',
					linkDestination: 'none',
				},
			],
			[
				'core/paragraph',
				{
					content: __('Image caption goes here...', 'designsetgo'),
					align: 'center',
					fontSize: 'small',
				},
			],
		],
		scope: ['block'],
	},
	{
		name: 'announcement',
		title: __('Announcement / Promo', 'designsetgo'),
		description: __('Eye-catching modal for announcements and promotional content.', 'designsetgo'),
		icon: 'megaphone',
		attributes: {
			width: '600px',
			maxWidth: '90vw',
			height: 'auto',
			autoTriggerType: 'pageLoad',
			autoTriggerDelay: 2000,
			autoTriggerFrequency: 'session',
			overlayColor: '#000000',
			overlayOpacity: 70,
			animationType: 'zoom',
		},
		innerBlocks: [
			[
				'core/heading',
				{
					level: 2,
					content: __('🎉 Special Offer!', 'designsetgo'),
					textAlign: 'center',
				},
			],
			[
				'core/paragraph',
				{
					content: __(
						'Get 20% off your first purchase. Use code <strong>WELCOME20</strong> at checkout.',
						'designsetgo'
					),
					align: 'center',
					fontSize: 'medium',
				},
			],
			[
				'core/buttons',
				{
					layout: { type: 'flex', justifyContent: 'center' },
				},
				[
					[
						'core/button',
						{
							text: __('Shop Now', 'designsetgo'),
							width: 100,
						},
					],
				],
			],
		],
		scope: ['block'],
	},
	{
		name: 'cookie-notice',
		title: __('Cookie Notice', 'designsetgo'),
		description: __('Modal for cookie consent and privacy notices.', 'designsetgo'),
		icon: 'shield',
		attributes: {
			width: '500px',
			maxWidth: '95vw',
			height: 'auto',
			autoTriggerType: 'pageLoad',
			autoTriggerDelay: 1000,
			autoTriggerFrequency: 'once',
			cookieDuration: 365,
			overlayColor: '#000000',
			overlayOpacity: 50,
			animationType: 'slide-up',
			closeOnBackdrop: false,
			closeOnEsc: false,
			showCloseButton: false,
		},
		innerBlocks: [
			[
				'core/heading',
				{
					level: 3,
					content: __('🍪 Cookie Notice', 'designsetgo'),
				},
			],
			[
				'core/paragraph',
				{
					content: __(
						'We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.',
						'designsetgo'
					),
					fontSize: 'small',
				},
			],
			[
				'core/buttons',
				{
					layout: { type: 'flex', justifyContent: 'space-between' },
				},
				[
					[
						'core/button',
						{
							text: __('Learn More', 'designsetgo'),
							className: 'is-style-outline',
						},
					],
					[
						'core/button',
						{
							text: __('Accept', 'designsetgo'),
						},
					],
				],
			],
		],
		scope: ['block'],
	},
];

export default variations;
