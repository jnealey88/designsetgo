/**
 * Background Video Extension
 *
 * Adds background video capability to DesignSetGo container blocks.
 *
 * @package
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { shouldExtendBlock } from '../../utils/should-extend-block';
import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { PanelBody, Button, ToggleControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/**
 * Container blocks that support background video
 */
const ALLOWED_BLOCKS = [
	'designsetgo/section', // Section block (vertical stack)
	'designsetgo/row', // Row block (horizontal flex)
	'designsetgo/grid',
	'designsetgo/reveal',
	'designsetgo/flip-card',
	'designsetgo/flip-card-front',
	'designsetgo/flip-card-back',
	'designsetgo/accordion',
	'designsetgo/accordion-item',
	'designsetgo/tabs',
	'designsetgo/tab',
	'designsetgo/scroll-accordion',
	'designsetgo/scroll-accordion-item',
	'designsetgo/scroll-marquee',
	'designsetgo/image-accordion',
	'designsetgo/image-accordion-item',
];

/**
 * Add background video attributes to allowed container blocks
 *
 * @param {Object} settings Block settings
 * @param {string} name     Block name
 * @return {Object} Modified settings
 */
function addBackgroundVideoAttributes(settings, name) {
	// Check user exclusion list first
	if (!shouldExtendBlock(name)) {
		return settings;
	}

	if (!ALLOWED_BLOCKS.includes(name)) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			dsgoVideoUrl: {
				type: 'string',
				default: '',
			},
			dsgoVideoPoster: {
				type: 'string',
				default: '',
			},
			dsgoVideoMuted: {
				type: 'boolean',
				default: true,
			},
			dsgoVideoLoop: {
				type: 'boolean',
				default: true,
			},
			dsgoVideoAutoplay: {
				type: 'boolean',
				default: true,
			},
			dsgoVideoMobileHide: {
				type: 'boolean',
				default: true,
			},
			dsgoVideoOverlayColor: {
				type: 'string',
				default: '',
			},
		},
	};
}

addFilter(
	'blocks.registerBlockType',
	'designsetgo/background-video-attributes',
	addBackgroundVideoAttributes
);

/**
 * Add background video controls to block inspector
 */
const withBackgroundVideoControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, setAttributes, name, clientId } = props;
		const {
			dsgoVideoUrl,
			dsgoVideoPoster,
			dsgoVideoMuted,
			dsgoVideoLoop,
			dsgoVideoAutoplay,
			dsgoVideoMobileHide,
			dsgoVideoOverlayColor,
		} = attributes;

		const colorGradientSettings = useMultipleOriginColorsAndGradients();

		if (!ALLOWED_BLOCKS.includes(name)) {
			return <BlockEdit {...props} />;
		}

		return (
			<Fragment>
				<BlockEdit {...props} />
				{dsgoVideoUrl && (
					<InspectorControls group="color">
						<ColorGradientSettingsDropdown
							panelId={clientId}
							title={__('Video Overlay', 'designsetgo')}
							settings={[
								{
									label: __(
										'Video Overlay Color',
										'designsetgo'
									),
									colorValue: dsgoVideoOverlayColor,
									onColorChange: (color) => {
										setAttributes({
											dsgoVideoOverlayColor: color || '',
										});
									},
									clearable: true,
								},
							]}
							{...colorGradientSettings}
						/>
					</InspectorControls>
				)}
				<InspectorControls>
					<PanelBody
						title={__('Background Video', 'designsetgo')}
						initialOpen={false}
					>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={(media) => {
									setAttributes({
										dsgoVideoUrl: media.url,
									});
								}}
								allowedTypes={['video']}
								value={dsgoVideoUrl}
								render={({ open }) => (
									<div className="dsgo-video-upload">
										{dsgoVideoUrl ? (
											<Fragment>
												<video
													src={dsgoVideoUrl}
													autoPlay
													loop
													muted
													style={{
														width: '100%',
														maxHeight: '200px',
														objectFit: 'cover',
														borderRadius: '4px',
														marginBottom: '12px',
													}}
												/>
												<Button
													onClick={open}
													variant="secondary"
													isSmall
													style={{
														marginRight: '8px',
													}}
												>
													{__(
														'Replace Video',
														'designsetgo'
													)}
												</Button>
												<Button
													onClick={() =>
														setAttributes({
															dsgoVideoUrl: '',
															dsgoVideoPoster: '',
														})
													}
													variant="secondary"
													isDestructive
													isSmall
												>
													{__(
														'Remove Video',
														'designsetgo'
													)}
												</Button>
											</Fragment>
										) : (
											<Button
												onClick={open}
												variant="primary"
											>
												{__(
													'Upload Video',
													'designsetgo'
												)}
											</Button>
										)}
									</div>
								)}
							/>
						</MediaUploadCheck>

						{dsgoVideoUrl && (
							<Fragment>
								<div style={{ marginTop: '16px' }}>
									<MediaUploadCheck>
										<MediaUpload
											onSelect={(media) => {
												setAttributes({
													dsgoVideoPoster: media.url,
												});
											}}
											allowedTypes={['image']}
											value={dsgoVideoPoster}
											render={({ open }) => (
												<div className="dsgo-poster-upload">
													<div
														style={{
															display: 'block',
															marginBottom: '8px',
															fontSize: '11px',
															fontWeight: '500',
															textTransform:
																'uppercase',
														}}
													>
														{__(
															'Poster Image (Optional)',
															'designsetgo'
														)}
													</div>
													{dsgoVideoPoster ? (
														<Fragment>
															<img
																src={
																	dsgoVideoPoster
																}
																alt={__(
																	'Video poster',
																	'designsetgo'
																)}
																style={{
																	width: '100%',
																	maxHeight:
																		'100px',
																	objectFit:
																		'cover',
																	borderRadius:
																		'4px',
																	marginBottom:
																		'8px',
																}}
															/>
															<Button
																onClick={open}
																variant="secondary"
																isSmall
																style={{
																	marginRight:
																		'8px',
																}}
															>
																{__(
																	'Replace Poster',
																	'designsetgo'
																)}
															</Button>
															<Button
																onClick={() =>
																	setAttributes(
																		{
																			dsgoVideoPoster:
																				'',
																		}
																	)
																}
																variant="secondary"
																isDestructive
																isSmall
															>
																{__(
																	'Remove Poster',
																	'designsetgo'
																)}
															</Button>
														</Fragment>
													) : (
														<Button
															onClick={open}
															variant="secondary"
															isSmall
														>
															{__(
																'Upload Poster',
																'designsetgo'
															)}
														</Button>
													)}
												</div>
											)}
										/>
									</MediaUploadCheck>
								</div>

								<ToggleControl
									label={__('Autoplay', 'designsetgo')}
									checked={dsgoVideoAutoplay}
									onChange={(value) =>
										setAttributes({
											dsgoVideoAutoplay: value,
										})
									}
									help={__(
										'Automatically start playing when page loads',
										'designsetgo'
									)}
									__nextHasNoMarginBottom
								/>

								<ToggleControl
									label={__('Loop', 'designsetgo')}
									checked={dsgoVideoLoop}
									onChange={(value) =>
										setAttributes({ dsgoVideoLoop: value })
									}
									help={__(
										'Restart video when it ends',
										'designsetgo'
									)}
									__nextHasNoMarginBottom
								/>

								<ToggleControl
									label={__('Muted', 'designsetgo')}
									checked={dsgoVideoMuted}
									onChange={(value) =>
										setAttributes({ dsgoVideoMuted: value })
									}
									help={__(
										'Mute audio (required for autoplay)',
										'designsetgo'
									)}
									__nextHasNoMarginBottom
								/>

								<ToggleControl
									label={__('Hide on Mobile', 'designsetgo')}
									checked={dsgoVideoMobileHide}
									onChange={(value) =>
										setAttributes({
											dsgoVideoMobileHide: value,
										})
									}
									help={__(
										'Hide video on mobile devices to save bandwidth',
										'designsetgo'
									)}
									__nextHasNoMarginBottom
								/>
							</Fragment>
						)}
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withBackgroundVideoControls');

addFilter(
	'editor.BlockEdit',
	'designsetgo/background-video-controls',
	withBackgroundVideoControls,
	5 // High priority - major visual element, appears early in settings
);

/**
 * Add background video wrapper in editor
 */
const withBackgroundVideoEdit = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { attributes, name } = props;
		const { dsgoVideoUrl, dsgoVideoPoster, dsgoVideoOverlayColor, align } =
			attributes;

		if (!ALLOWED_BLOCKS.includes(name) || !dsgoVideoUrl) {
			return <BlockListBlock {...props} />;
		}

		// Build wrapper class names, including alignment classes
		// CRITICAL: Pass alignment classes to wrapper so full-width blocks remain full-width in editor
		const wrapperClasses = ['dsgo-has-video-background'];
		if (align === 'full') {
			wrapperClasses.push('alignfull');
		} else if (align === 'wide') {
			wrapperClasses.push('alignwide');
		}

		// Apply 70% opacity to overlay color if set
		const overlayStyle = dsgoVideoOverlayColor
			? {
					backgroundColor: dsgoVideoOverlayColor,
					opacity: 0.7,
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					zIndex: 1,
					pointerEvents: 'none',
				}
			: null;

		return (
			<div className={wrapperClasses.join(' ')}>
				<div
					className="dsgo-video-background-editor"
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						zIndex: 0,
						overflow: 'hidden',
						pointerEvents: 'none',
					}}
				>
					<video
						src={dsgoVideoUrl}
						poster={dsgoVideoPoster}
						autoPlay
						loop
						muted
						playsInline
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
					/>
					{overlayStyle && <div style={overlayStyle} />}
				</div>
				<BlockListBlock {...props} />
			</div>
		);
	};
}, 'withBackgroundVideoEdit');

addFilter(
	'editor.BlockListBlock',
	'designsetgo/background-video-edit',
	withBackgroundVideoEdit
);

/**
 * Add background video classes and data attributes to save
 *
 * @param {Object} props      - Block props.
 * @param {Object} blockType  - Block type.
 * @param {Object} attributes - Block attributes.
 * @return {Object} Modified props.
 */
function addBackgroundVideoSaveProps(props, blockType, attributes) {
	const { dsgoVideoUrl } = attributes;

	if (!dsgoVideoUrl) {
		return props;
	}

	return {
		...props,
		className: `${props.className || ''} dsgo-has-video-background`.trim(),
		'data-video-url': dsgoVideoUrl,
		'data-video-poster': attributes.dsgoVideoPoster || '',
		'data-video-muted': attributes.dsgoVideoMuted ? 'true' : 'false',
		'data-video-loop': attributes.dsgoVideoLoop ? 'true' : 'false',
		'data-video-autoplay': attributes.dsgoVideoAutoplay ? 'true' : 'false',
		'data-video-mobile-hide': attributes.dsgoVideoMobileHide
			? 'true'
			: 'false',
		'data-video-overlay-color': attributes.dsgoVideoOverlayColor || '',
	};
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'designsetgo/background-video-save-props',
	addBackgroundVideoSaveProps
);
