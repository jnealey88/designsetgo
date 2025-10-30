/**
 * Background Video Extension
 *
 * Adds background video capability to all WordPress blocks.
 *
 * @package DesignSetGo
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, Button, ToggleControl, TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/**
 * Blocks excluded from background video extension
 */
const EXCLUDED_BLOCKS = [
	'core/freeform',
	'core/template-part',
	'core/post-content',
];

/**
 * Add background video attributes to all blocks
 *
 * @param {Object} settings Block settings
 * @param {string} name     Block name
 * @return {Object} Modified settings
 */
function addBackgroundVideoAttributes(settings, name) {
	if (EXCLUDED_BLOCKS.includes(name)) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			dsgVideoUrl: {
				type: 'string',
				default: '',
			},
			dsgVideoPoster: {
				type: 'string',
				default: '',
			},
			dsgVideoMuted: {
				type: 'boolean',
				default: true,
			},
			dsgVideoLoop: {
				type: 'boolean',
				default: true,
			},
			dsgVideoAutoplay: {
				type: 'boolean',
				default: true,
			},
			dsgVideoMobileHide: {
				type: 'boolean',
				default: true,
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
		const { attributes, setAttributes, name } = props;
		const {
			dsgVideoUrl,
			dsgVideoPoster,
			dsgVideoMuted,
			dsgVideoLoop,
			dsgVideoAutoplay,
			dsgVideoMobileHide,
		} = attributes;

		if (EXCLUDED_BLOCKS.includes(name)) {
			return <BlockEdit {...props} />;
		}

		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody
						title={__('Background Video', 'designsetgo')}
						initialOpen={false}
					>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={(media) => {
									setAttributes({
										dsgVideoUrl: media.url,
									});
								}}
								allowedTypes={['video']}
								value={dsgVideoUrl}
								render={({ open }) => (
									<div className="dsg-video-upload">
										{dsgVideoUrl ? (
											<Fragment>
												<video
													src={dsgVideoUrl}
													poster={dsgVideoPoster}
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
													style={{ marginRight: '8px' }}
												>
													{__('Replace Video', 'designsetgo')}
												</Button>
												<Button
													onClick={() =>
														setAttributes({
															dsgVideoUrl: '',
															dsgVideoPoster: '',
														})
													}
													variant="secondary"
													isDestructive
													isSmall
												>
													{__('Remove Video', 'designsetgo')}
												</Button>
											</Fragment>
										) : (
											<Button onClick={open} variant="primary">
												{__('Upload Video', 'designsetgo')}
											</Button>
										)}
									</div>
								)}
							/>
						</MediaUploadCheck>

						{dsgVideoUrl && (
							<Fragment>
								<div style={{ marginTop: '16px' }}>
									<MediaUploadCheck>
										<MediaUpload
											onSelect={(media) => {
												setAttributes({
													dsgVideoPoster: media.url,
												});
											}}
											allowedTypes={['image']}
											value={dsgVideoPoster}
											render={({ open }) => (
												<div className="dsg-poster-upload">
													<label
														style={{
															display: 'block',
															marginBottom: '8px',
															fontSize: '11px',
															fontWeight: '500',
															textTransform: 'uppercase',
														}}
													>
														{__('Poster Image (Optional)', 'designsetgo')}
													</label>
													{dsgVideoPoster ? (
														<Fragment>
															<img
																src={dsgVideoPoster}
																alt={__('Video poster', 'designsetgo')}
																style={{
																	width: '100%',
																	maxHeight: '100px',
																	objectFit: 'cover',
																	borderRadius: '4px',
																	marginBottom: '8px',
																}}
															/>
															<Button
																onClick={open}
																variant="secondary"
																isSmall
																style={{ marginRight: '8px' }}
															>
																{__('Replace Poster', 'designsetgo')}
															</Button>
															<Button
																onClick={() =>
																	setAttributes({ dsgVideoPoster: '' })
																}
																variant="secondary"
																isDestructive
																isSmall
															>
																{__('Remove Poster', 'designsetgo')}
															</Button>
														</Fragment>
													) : (
														<Button onClick={open} variant="secondary" isSmall>
															{__('Upload Poster', 'designsetgo')}
														</Button>
													)}
												</div>
											)}
										/>
									</MediaUploadCheck>
								</div>

								<ToggleControl
									label={__('Autoplay', 'designsetgo')}
									checked={dsgVideoAutoplay}
									onChange={(value) =>
										setAttributes({ dsgVideoAutoplay: value })
									}
									help={__(
										'Automatically start playing when page loads',
										'designsetgo'
									)}
									__nextHasNoMarginBottom
								/>

								<ToggleControl
									label={__('Loop', 'designsetgo')}
									checked={dsgVideoLoop}
									onChange={(value) => setAttributes({ dsgVideoLoop: value })}
									help={__('Restart video when it ends', 'designsetgo')}
									__nextHasNoMarginBottom
								/>

								<ToggleControl
									label={__('Muted', 'designsetgo')}
									checked={dsgVideoMuted}
									onChange={(value) => setAttributes({ dsgVideoMuted: value })}
									help={__(
										'Mute audio (required for autoplay)',
										'designsetgo'
									)}
									__nextHasNoMarginBottom
								/>

								<ToggleControl
									label={__('Hide on Mobile', 'designsetgo')}
									checked={dsgVideoMobileHide}
									onChange={(value) =>
										setAttributes({ dsgVideoMobileHide: value })
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
	withBackgroundVideoControls
);

/**
 * Add background video wrapper in editor
 */
const withBackgroundVideoEdit = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { attributes, name } = props;
		const { dsgVideoUrl, dsgVideoPoster } = attributes;

		if (EXCLUDED_BLOCKS.includes(name) || !dsgVideoUrl) {
			return <BlockListBlock {...props} />;
		}

		return (
			<div className="dsg-has-video-background">
				<div
					className="dsg-video-background-editor"
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
						src={dsgVideoUrl}
						poster={dsgVideoPoster}
						autoPlay
						loop
						muted
						playsInline
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							opacity: 0.7,
						}}
					/>
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
 */
function addBackgroundVideoSaveProps(props, blockType, attributes) {
	const { dsgVideoUrl } = attributes;

	if (!dsgVideoUrl) {
		return props;
	}

	return {
		...props,
		className: `${props.className || ''} dsg-has-video-background`.trim(),
		'data-video-url': dsgVideoUrl,
		'data-video-poster': attributes.dsgVideoPoster || '',
		'data-video-muted': attributes.dsgVideoMuted ? 'true' : 'false',
		'data-video-loop': attributes.dsgVideoLoop ? 'true' : 'false',
		'data-video-autoplay': attributes.dsgVideoAutoplay ? 'true' : 'false',
		'data-video-mobile-hide': attributes.dsgVideoMobileHide ? 'true' : 'false',
	};
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'designsetgo/background-video-save-props',
	addBackgroundVideoSaveProps
);
