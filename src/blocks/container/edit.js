/**
 * Container Block - Edit Component
 *
 * WordPress Best Practice Approach:
 * - Uses useInnerBlocksProps for proper inner blocks integration
 * - Declarative style application (no useEffect or DOM manipulation)
 * - Editor matches frontend exactly
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	BlockControls,
	MediaUpload,
	MediaUploadCheck,
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
	AlignmentControl,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	ToggleControl,
	TextControl,
	SelectControl,
	Button,
	ToolbarGroup,
	ToolbarButton,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import classnames from 'classnames';

export default function ContainerEdit({ attributes, setAttributes }) {
	const {
		layoutType,
		constrainWidth,
		contentWidth,
		gridColumns,
		gridColumnsTablet,
		gridColumnsMobile,
		gap,
		videoUrl,
		videoPoster,
		videoAutoplay,
		videoLoop,
		videoMuted,
		hideOnDesktop,
		hideOnTablet,
		hideOnMobile,
		enableOverlay,
		overlayColor,
		linkUrl,
		linkTarget,
		textAlign,
	} = attributes;

	// ========================================
	// Calculate inner blocks styles declaratively
	// (WordPress best practice: NO useEffect, NO DOM manipulation)
	// ========================================
	const innerStyles = {
		position: 'relative',
		zIndex: 2,
	};

	// Apply layout based on type
	if (layoutType === 'grid') {
		innerStyles.display = 'grid';
		innerStyles.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;
		innerStyles.gap = gap;
	} else if (layoutType === 'flex') {
		innerStyles.display = 'flex';
		innerStyles.flexDirection = 'row';
		innerStyles.flexWrap = 'wrap';
		innerStyles.gap = gap;
	} else {
		// Stack (default)
		innerStyles.display = 'flex';
		innerStyles.flexDirection = 'column';
		innerStyles.gap = gap;
	}

	// Apply width constraint if enabled (works for ALL layouts)
	if (constrainWidth) {
		innerStyles.maxWidth = contentWidth;
		innerStyles.marginLeft = 'auto';
		innerStyles.marginRight = 'auto';
	}

	// ========================================
	// Block wrapper props
	// ========================================
	const blockProps = useBlockProps({
		className: classnames('dsg-container', {
			'has-video-background': videoUrl,
			'has-dsg-overlay': enableOverlay,
			'dsg-hide-desktop': hideOnDesktop,
			'dsg-hide-tablet': hideOnTablet,
			'dsg-hide-mobile': hideOnMobile,
			'is-clickable': linkUrl,
			[`has-text-align-${textAlign}`]: textAlign,
		}),
		style: {
			position: 'relative',
			...(textAlign && { textAlign }),
		},
	});

	// ========================================
	// Inner blocks props (WordPress best practice)
	// Replaces plain <InnerBlocks /> to fix layout issues
	// ========================================
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsg-container__inner',
			style: innerStyles,
		},
		{
			// Orientation hint for flex layouts
			orientation: layoutType === 'flex' ? 'horizontal' : undefined,
		}
	);

	return (
		<>
			{/* Block Toolbar */}
			<BlockControls group="block">
				{/* Text Alignment */}
				<AlignmentControl
					value={textAlign}
					onChange={(nextAlign) => {
						setAttributes({ textAlign: nextAlign });
					}}
				/>

				{/* Video Background */}
				<ToolbarGroup>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) => setAttributes({ videoUrl: media.url })}
							allowedTypes={['video']}
							value={videoUrl}
							render={({ open }) => (
								<ToolbarButton
									icon="video-alt3"
									label={videoUrl ? __('Replace Video Background', 'designsetgo') : __('Add Video Background', 'designsetgo')}
									onClick={open}
									isPressed={!!videoUrl}
								/>
							)}
						/>
					</MediaUploadCheck>
					{videoUrl && (
						<ToolbarButton
							icon="no"
							label={__('Remove Video Background', 'designsetgo')}
							onClick={() => setAttributes({ videoUrl: '', videoPoster: '' })}
						/>
					)}
				</ToolbarGroup>

				{/* Background Image */}
				<ToolbarGroup>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) => {
								setAttributes({
									style: {
										...attributes.style,
										background: {
											...attributes.style?.background,
											backgroundImage: {
												url: media.url,
											},
										},
									},
								});
							}}
							allowedTypes={['image']}
							value={attributes.style?.background?.backgroundImage?.url}
							render={({ open }) => (
								<ToolbarButton
									icon="format-image"
									label={attributes.style?.background?.backgroundImage ? __('Replace Background Image', 'designsetgo') : __('Add Background Image', 'designsetgo')}
									onClick={open}
									isPressed={!!attributes.style?.background?.backgroundImage}
								/>
							)}
						/>
					</MediaUploadCheck>
					{attributes.style?.background?.backgroundImage && (
						<ToolbarButton
							icon="no"
							label={__('Remove Background Image', 'designsetgo')}
							onClick={() => {
								const newStyle = { ...attributes.style };
								if (newStyle.background) {
									delete newStyle.background.backgroundImage;
								}
								setAttributes({ style: newStyle });
							}}
						/>
					)}
				</ToolbarGroup>

				{/* Overlay Toggle */}
				{(videoUrl || attributes.style?.background?.backgroundImage) && (
					<ToolbarGroup>
						<ToolbarButton
							icon="admin-appearance"
							label={__('Toggle Overlay', 'designsetgo')}
							isActive={enableOverlay}
							onClick={() =>
								setAttributes({ enableOverlay: !enableOverlay })
							}
						/>
					</ToolbarGroup>
				)}
			</BlockControls>

			{/* SETTINGS TAB */}
			<InspectorControls>
				{/* Layout Type */}
				<PanelBody
					title={__('Layout', 'designsetgo')}
					initialOpen={true}
				>
					<ToggleGroupControl
						label={__('Layout Type', 'designsetgo')}
						value={layoutType}
						onChange={(value) => setAttributes({ layoutType: value })}
						isBlock
					>
						<ToggleGroupControlOption
							value="stack"
							label={
								<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
									<rect x="3" y="3" width="14" height="2" />
									<rect x="3" y="9" width="14" height="2" />
									<rect x="3" y="15" width="14" height="2" />
								</svg>
							}
							aria-label={__('Stack', 'designsetgo')}
						/>
						<ToggleGroupControlOption
							value="grid"
							label={
								<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
									<rect x="2" y="2" width="7" height="7" />
									<rect x="11" y="2" width="7" height="7" />
									<rect x="2" y="11" width="7" height="7" />
									<rect x="11" y="11" width="7" height="7" />
								</svg>
							}
							aria-label={__('Grid', 'designsetgo')}
						/>
						<ToggleGroupControlOption
							value="flex"
							label={
								<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
									<rect x="2" y="3" width="5" height="14" />
									<rect x="8" y="3" width="5" height="14" />
									<rect x="14" y="3" width="4" height="14" />
								</svg>
							}
							aria-label={__('Flex', 'designsetgo')}
						/>
					</ToggleGroupControl>

					<ToggleControl
						label={__('Constrain Width', 'designsetgo')}
						checked={constrainWidth}
						onChange={(value) => setAttributes({ constrainWidth: value })}
						help={
							constrainWidth
								? __('Content is centered with max-width', 'designsetgo')
								: __('Content uses full width', 'designsetgo')
						}
						style={{ marginTop: '16px' }}
					/>

					{constrainWidth && (
						<TextControl
							label={__('Max Width', 'designsetgo')}
							value={contentWidth}
							onChange={(value) => setAttributes({ contentWidth: value })}
							help={__(
								'e.g., 800px, 60rem',
								'designsetgo'
							)}
						/>
					)}

					{layoutType === 'grid' && (
						<>
							<p className="components-base-control__help" style={{ marginTop: '16px', marginBottom: '16px', fontWeight: 500 }}>
								{__(
									'Control your grid layout across all devices.',
									'designsetgo'
								)}
							</p>

							<RangeControl
								label={__('Desktop Columns', 'designsetgo')}
								value={gridColumns}
								onChange={(value) => {
									// Auto-adjust tablet/mobile when desktop changes
									const newAttrs = { gridColumns: value };
									if (value < gridColumnsTablet) {
										newAttrs.gridColumnsTablet = value;
									}
									if (value < gridColumnsMobile) {
										newAttrs.gridColumnsMobile = Math.min(value, 2);
									}
									setAttributes(newAttrs);
								}}
								min={1}
								max={6}
								help={__(
									'Desktop (>1024px)',
									'designsetgo'
								)}
							/>

							<RangeControl
								label={__('Tablet Columns', 'designsetgo')}
								value={gridColumnsTablet}
								onChange={(value) => {
									// Auto-adjust mobile if tablet is smaller
									const newMobile = value < gridColumnsMobile ? value : gridColumnsMobile;
									setAttributes({
										gridColumnsTablet: value,
										...(newMobile !== gridColumnsMobile && { gridColumnsMobile: newMobile })
									});
								}}
								min={1}
								max={gridColumns}
								help={__(
									'Tablet (768px - 1023px)',
									'designsetgo'
								)}
							/>

							<RangeControl
								label={__('Mobile Columns', 'designsetgo')}
								value={gridColumnsMobile}
								onChange={(value) =>
									setAttributes({ gridColumnsMobile: value })
								}
								min={1}
								max={Math.min(gridColumns, gridColumnsTablet)}
								help={__(
									'Mobile (<768px)',
									'designsetgo'
								)}
							/>
						</>
					)}

					<TextControl
						label={__('Gap', 'designsetgo')}
						value={gap}
						onChange={(value) => setAttributes({ gap: value })}
						help={__(
							'e.g., 24px, 2rem',
							'designsetgo'
						)}
					/>
				</PanelBody>

				{/* Link Settings */}
				<PanelBody
					title={__('Link Settings', 'designsetgo')}
					initialOpen={false}
				>
					<TextControl
						label={__('Link URL', 'designsetgo')}
						value={linkUrl}
						onChange={(value) => setAttributes({ linkUrl: value })}
						placeholder="https://example.com"
						help={__(
							'Make entire container clickable',
							'designsetgo'
						)}
					/>

					{linkUrl && (
						<SelectControl
							label={__('Link Target', 'designsetgo')}
							value={linkTarget}
							options={[
								{
									label: __('Same Window', 'designsetgo'),
									value: '_self',
								},
								{
									label: __('New Window', 'designsetgo'),
									value: '_blank',
								},
							]}
							onChange={(value) =>
								setAttributes({ linkTarget: value })
							}
						/>
					)}
				</PanelBody>

				{/* Responsive Visibility */}
				<PanelBody
					title={__('Responsive Visibility', 'designsetgo')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Hide on Desktop', 'designsetgo')}
						checked={hideOnDesktop}
						onChange={(value) =>
							setAttributes({ hideOnDesktop: value })
						}
						help={__(
							'Hide this container on desktop (>1024px)',
							'designsetgo'
						)}
					/>
					<ToggleControl
						label={__('Hide on Tablet', 'designsetgo')}
						checked={hideOnTablet}
						onChange={(value) =>
							setAttributes({ hideOnTablet: value })
						}
						help={__(
							'Hide this container on tablet (768-1023px)',
							'designsetgo'
						)}
					/>
					<ToggleControl
						label={__('Hide on Mobile', 'designsetgo')}
						checked={hideOnMobile}
						onChange={(value) =>
							setAttributes({ hideOnMobile: value })
						}
						help={__(
							'Hide this container on mobile (<768px)',
							'designsetgo'
						)}
					/>
				</PanelBody>

				{/* Video Background */}
				<PanelBody
					title={__('Video Background', 'designsetgo')}
					initialOpen={false}
				>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) =>
								setAttributes({ videoUrl: media.url })
							}
							allowedTypes={['video']}
							value={videoUrl}
							render={({ open }) => (
								<>
									<Button
										onClick={open}
										variant="secondary"
										style={{ marginBottom: '10px', width: '100%' }}
									>
										{videoUrl ? __('Replace Video', 'designsetgo') : __('Select Video', 'designsetgo')}
									</Button>
									{videoUrl && (
										<Button
											onClick={() => setAttributes({ videoUrl: '' })}
											variant="tertiary"
											isDestructive
											style={{ marginBottom: '10px', width: '100%' }}
										>
											{__('Remove Video', 'designsetgo')}
										</Button>
									)}
								</>
							)}
						/>
					</MediaUploadCheck>

					{videoUrl && (
						<>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) =>
										setAttributes({ videoPoster: media.url })
									}
									allowedTypes={['image']}
									value={videoPoster}
									render={({ open }) => (
										<>
											<Button
												onClick={open}
												variant="secondary"
												style={{ marginTop: '10px', marginBottom: '10px', width: '100%' }}
											>
												{videoPoster ? __('Replace Poster', 'designsetgo') : __('Select Poster', 'designsetgo')}
											</Button>
											{videoPoster && (
												<Button
													onClick={() => setAttributes({ videoPoster: '' })}
													variant="tertiary"
													isDestructive
													style={{ marginBottom: '10px', width: '100%' }}
												>
													{__('Remove Poster', 'designsetgo')}
												</Button>
											)}
										</>
									)}
								/>
							</MediaUploadCheck>

							<ToggleControl
								label={__('Autoplay', 'designsetgo')}
								checked={videoAutoplay}
								onChange={(value) => setAttributes({ videoAutoplay: value })}
							/>
							<ToggleControl
								label={__('Loop', 'designsetgo')}
								checked={videoLoop}
								onChange={(value) => setAttributes({ videoLoop: value })}
							/>
							<ToggleControl
								label={__('Muted', 'designsetgo')}
								checked={videoMuted}
								onChange={(value) => setAttributes({ videoMuted: value })}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>

			{/* STYLES TAB */}
			<InspectorControls group="styles">
				{/* Background Overlay */}
				{(videoUrl || attributes.style?.background?.backgroundImage) && (
					<PanelBody
						title={__('Background Overlay', 'designsetgo')}
						initialOpen={false}
					>
						<ToggleControl
							label={__('Enable Overlay', 'designsetgo')}
							checked={enableOverlay}
							onChange={(value) =>
								setAttributes({ enableOverlay: value })
							}
							help={__(
								'Add a color overlay over the background for better text contrast',
								'designsetgo'
							)}
						/>

						{enableOverlay && (
							<>
								<PanelColorGradientSettings
									__experimentalIsRenderedInSidebar
									settings={[
										{
											colorValue: overlayColor,
											onColorChange: (value) =>
												setAttributes({
													overlayColor:
														value || 'rgba(0, 0, 0, 0.5)',
												}),
											label: __(
												'Overlay Color',
												'designsetgo'
											),
											enableAlpha: true,
										},
									]}
									panelId="overlay-color"
								/>
								<p className="components-base-control__help" style={{ marginTop: '10px' }}>
									{__(
										'Tip: Use the opacity slider to adjust how much of the background shows through.',
										'designsetgo'
									)}
								</p>
							</>
						)}
					</PanelBody>
				)}
			</InspectorControls>

			{/* Block Content */}
			<div {...blockProps}>
				{/* Video Background Preview */}
				{videoUrl && (
					<div
						className="dsg-video-background"
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							overflow: 'hidden',
							zIndex: 0,
							pointerEvents: 'none',
							backgroundImage: videoPoster
								? `url(${videoPoster})`
								: 'none',
							backgroundSize: 'cover',
							backgroundPosition: 'center',
						}}
					>
						<video
							src={videoUrl}
							poster={videoPoster}
							autoPlay={videoAutoplay}
							loop={videoLoop}
							muted={videoMuted}
							playsInline
							style={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								minWidth: '100%',
								minHeight: '100%',
								width: 'auto',
								height: 'auto',
								transform: 'translate(-50%, -50%)',
								objectFit: 'cover',
							}}
						/>
					</div>
				)}

				{/* Overlay */}
				{enableOverlay && (
					<div
						className="dsg-overlay"
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background: overlayColor,
							zIndex: 1,
							pointerEvents: 'none',
						}}
					/>
				)}

				{/* Inner Blocks - WordPress best practice: NO wrapper div, spread props directly */}
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}
