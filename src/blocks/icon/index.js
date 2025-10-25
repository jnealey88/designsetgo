/**
 * Icon Block - Edit Component
 *
 * Display icons from WordPress Dashicons library
 */

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	useBlockProps,
	InspectorControls,
	__experimentalLinkControl as LinkControl
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	Button,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	Popover,
	SearchControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { link } from '@wordpress/icons';

import metadata from './block.json';
import save from './save';
import './editor.scss';
import './style.scss';

// Common Dashicons grouped by category
const DASHICONS = {
	'General': [
		'admin-site', 'admin-site-alt', 'admin-site-alt2', 'admin-site-alt3',
		'dashboard', 'admin-post', 'admin-media', 'admin-links', 'admin-page',
		'admin-comments', 'admin-appearance', 'admin-plugins', 'admin-users',
		'admin-tools', 'admin-settings', 'admin-network', 'admin-home',
		'admin-generic', 'admin-collapse', 'filter', 'admin-customizer',
		'admin-multisite'
	],
	'Posts': [
		'welcome-write-blog', 'welcome-add-page', 'welcome-view-site',
		'welcome-widgets-menus', 'welcome-comments', 'welcome-learn-more'
	],
	'Media': [
		'format-image', 'format-gallery', 'format-audio', 'format-video',
		'format-chat', 'format-status', 'format-aside', 'format-quote',
		'camera', 'camera-alt', 'images-alt', 'images-alt2', 'video-alt',
		'video-alt2', 'video-alt3'
	],
	'Content': [
		'media-archive', 'media-audio', 'media-code', 'media-default',
		'media-document', 'media-interactive', 'media-spreadsheet', 'media-text',
		'media-video', 'playlist-audio', 'playlist-video', 'controls-play',
		'controls-pause', 'controls-forward', 'controls-skipforward',
		'controls-back', 'controls-skipback', 'controls-repeat', 'controls-volumeon',
		'controls-volumeoff'
	],
	'Social': [
		'share', 'share-alt', 'share-alt2', 'rss', 'email', 'email-alt',
		'email-alt2', 'networking', 'amazon', 'facebook', 'facebook-alt',
		'google', 'instagram', 'linkedin', 'pinterest', 'podio', 'reddit',
		'spotify', 'twitch', 'twitter', 'twitter-alt', 'whatsapp', 'xing',
		'youtube'
	],
	'Interface': [
		'menu', 'menu-alt', 'menu-alt2', 'menu-alt3', 'admin-collapse',
		'screenoptions', 'info', 'cart', 'feedback', 'cloud', 'cloud-upload',
		'cloud-download', 'cloud-saved', 'translation', 'tag', 'category',
		'archive', 'tagcloud', 'text', 'bell', 'yes', 'yes-alt', 'no', 'no-alt',
		'plus', 'plus-alt', 'plus-alt2', 'minus', 'dismiss', 'marker',
		'star-filled', 'star-half', 'star-empty', 'flag', 'warning', 'location',
		'location-alt', 'vault', 'shield', 'shield-alt', 'sos', 'search',
		'slides', 'analytics', 'chart-pie', 'chart-bar', 'chart-line',
		'chart-area', 'groups', 'businessman', 'businesswoman', 'businessperson',
		'id', 'id-alt', 'products', 'awards', 'forms', 'testimonial',
		'portfolio', 'book', 'book-alt', 'download', 'upload', 'backup',
		'clock', 'lightbulb', 'microphone', 'desktop', 'laptop', 'tablet',
		'smartphone', 'phone', 'index-card', 'carrot', 'building', 'store',
		'album', 'palmtree', 'tickets-alt', 'money', 'money-alt', 'smiley',
		'thumbs-up', 'thumbs-down', 'layout'
	],
	'Arrows': [
		'arrow-up', 'arrow-down', 'arrow-right', 'arrow-left',
		'arrow-up-alt', 'arrow-down-alt', 'arrow-right-alt', 'arrow-left-alt',
		'arrow-up-alt2', 'arrow-down-alt2', 'arrow-right-alt2', 'arrow-left-alt2',
		'sort', 'leftright', 'randomize', 'list-view', 'grid-view',
		'move', 'editor-expand', 'editor-contract', 'editor-contract-alt'
	],
	'Editor': [
		'editor-bold', 'editor-italic', 'editor-ul', 'editor-ol',
		'editor-quote', 'editor-alignleft', 'editor-aligncenter',
		'editor-alignright', 'editor-insertmore', 'editor-spellcheck',
		'editor-expand', 'editor-contract', 'editor-kitchensink',
		'editor-underline', 'editor-justify', 'editor-textcolor',
		'editor-paste-word', 'editor-paste-text', 'editor-removeformatting',
		'editor-video', 'editor-customchar', 'editor-outdent', 'editor-indent',
		'editor-help', 'editor-strikethrough', 'editor-unlink',
		'editor-rtl', 'editor-ltr', 'editor-break', 'editor-code',
		'editor-paragraph', 'editor-table'
	]
};

// Flatten all icons for search
const ALL_ICONS = Object.values(DASHICONS).flat();

// Maximum number of icons to display in picker
const MAX_DISPLAYED_ICONS = 100;

/**
 * Edit component
 */
function IconEdit({ attributes, setAttributes }) {
	const {
		icon,
		iconSize,
		rotation,
		shape,
		shapePadding,
		linkUrl,
		linkTarget,
		linkRel,
	} = attributes;

	const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
	const [iconSearch, setIconSearch] = useState('');
	const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);

	// Filter icons based on search
	const filteredIcons = iconSearch
		? ALL_ICONS.filter((iconName) =>
				iconName.toLowerCase().includes(iconSearch.toLowerCase())
			)
		: null;

	// Block wrapper props
	const blockProps = useBlockProps({
		className: 'dsg-icon',
	});

	// Icon wrapper classes
	const iconClasses = `dsg-icon__wrapper shape-${shape}`;

	// Icon wrapper styles
	const iconWrapperStyle = {
		fontSize: `${iconSize}px`,
		padding: shape !== 'none' ? `${shapePadding}px` : undefined,
	};

	// Icon styles
	const iconStyle = {
		transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
	};

	return (
		<>
			<InspectorControls>
				{/* Icon Settings */}
				<PanelBody title={__('Icon Settings', 'designsetgo')} initialOpen={true}>
					<Button
						variant="secondary"
						onClick={() => setIsIconPickerOpen(!isIconPickerOpen)}
						style={{ width: '100%', marginBottom: '16px' }}
					>
						{__('Change Icon', 'designsetgo')}
					</Button>

					{isIconPickerOpen && (
						<div className="dsg-icon-picker">
							<SearchControl
								value={iconSearch}
								onChange={setIconSearch}
								placeholder={__('Search icons...', 'designsetgo')}
							/>
							<div className="dsg-icon-picker__grid">
								{(filteredIcons || ALL_ICONS)
									.slice(0, MAX_DISPLAYED_ICONS)
									.map((iconName) => (
										<button
											key={iconName}
											className={`dsg-icon-picker__item ${
												icon === iconName
													? 'is-selected'
													: ''
											}`}
											onClick={() => {
												setAttributes({
													icon: iconName,
												});
												setIsIconPickerOpen(false);
												setIconSearch('');
											}}
											title={iconName}
										>
											<span
												className={`dashicons dashicons-${iconName}`}
											/>
										</button>
									))}
							</div>
							{filteredIcons &&
								filteredIcons.length > MAX_DISPLAYED_ICONS && (
									<p
										style={{
											textAlign: 'center',
											color: '#666',
											fontSize: '12px',
										}}
									>
										{__(
											'Showing first 100 results. Refine your search to see more.',
											'designsetgo'
										)}
									</p>
								)}
						</div>
					)}

					<RangeControl
						label={__('Icon Size', 'designsetgo')}
						value={iconSize}
						onChange={(value) => setAttributes({ iconSize: value })}
						min={16}
						max={200}
						step={2}
					/>

					<ToggleGroupControl
						label={__('Rotation', 'designsetgo')}
						value={rotation}
						onChange={(value) => setAttributes({ rotation: parseInt(value) })}
						isBlock
					>
						<ToggleGroupControlOption value="0" label="0°" />
						<ToggleGroupControlOption value="90" label="90°" />
						<ToggleGroupControlOption value="180" label="180°" />
						<ToggleGroupControlOption value="270" label="270°" />
					</ToggleGroupControl>
				</PanelBody>

				{/* Shape Settings */}
				<PanelBody title={__('Shape Settings', 'designsetgo')} initialOpen={false}>
					<SelectControl
						label={__('Background Shape', 'designsetgo')}
						value={shape}
						options={[
							{ label: __('None', 'designsetgo'), value: 'none' },
							{ label: __('Circle', 'designsetgo'), value: 'circle' },
							{ label: __('Square', 'designsetgo'), value: 'square' },
							{ label: __('Rounded', 'designsetgo'), value: 'rounded' },
						]}
						onChange={(value) => setAttributes({ shape: value })}
					/>

					{shape !== 'none' && (
						<RangeControl
							label={__('Shape Padding', 'designsetgo')}
							value={shapePadding}
							onChange={(value) => setAttributes({ shapePadding: value })}
							min={0}
							max={64}
							step={2}
						/>
					)}
				</PanelBody>

				{/* Link Settings */}
				<PanelBody title={__('Link Settings', 'designsetgo')} initialOpen={false}>
					<Button
						icon={link}
						variant={linkUrl ? 'primary' : 'secondary'}
						onClick={() => setIsLinkPopoverOpen(!isLinkPopoverOpen)}
						style={{ width: '100%' }}
					>
						{linkUrl ? __('Edit Link', 'designsetgo') : __('Add Link', 'designsetgo')}
					</Button>

					{linkUrl && (
						<div style={{ marginTop: '12px' }}>
							<TextControl
								label={__('URL', 'designsetgo')}
								value={linkUrl}
								onChange={(value) => setAttributes({ linkUrl: value })}
							/>
							<SelectControl
								label={__('Open in', 'designsetgo')}
								value={linkTarget}
								options={[
									{ label: __('Same Tab', 'designsetgo'), value: '_self' },
									{ label: __('New Tab', 'designsetgo'), value: '_blank' },
								]}
								onChange={(value) => setAttributes({ linkTarget: value })}
							/>
							{linkTarget === '_blank' && (
								<TextControl
									label={__('Link Rel', 'designsetgo')}
									value={linkRel}
									onChange={(value) => setAttributes({ linkRel: value })}
									help={__('Recommended: "noopener noreferrer"', 'designsetgo')}
								/>
							)}
						</div>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className={iconClasses} style={iconWrapperStyle}>
					<span
						className={`dashicons dashicons-${icon}`}
						style={iconStyle}
					/>
				</div>
			</div>
		</>
	);
}

/**
 * Register block
 */
registerBlockType(metadata.name, {
	...metadata,
	icon: {
		src: (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
				<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
			</svg>
		),
		foreground: '#2563eb',
	},
	edit: IconEdit,
	save,
});
