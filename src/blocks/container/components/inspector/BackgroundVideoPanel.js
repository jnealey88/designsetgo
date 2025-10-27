/**
 * Container Block - Background Video Panel Component
 *
 * Provides controls for video background with poster image and playback options.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, Button, ToggleControl } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

/**
 * Background Video Panel - Controls for video background.
 *
 * Allows selecting a video, poster image, and playback options (autoplay, loop, muted).
 *
 * @param {Object}   props               - Component props
 * @param {string}   props.videoUrl      - Video URL
 * @param {string}   props.videoPoster   - Poster image URL
 * @param {boolean}  props.videoAutoplay - Whether video autoplays
 * @param {boolean}  props.videoLoop     - Whether video loops
 * @param {boolean}  props.videoMuted    - Whether video is muted
 * @param {Function} props.setAttributes - Function to update block attributes
 * @return {JSX.Element} Background Video Panel component
 */
export const BackgroundVideoPanel = ({
	videoUrl,
	videoPoster,
	videoAutoplay,
	videoLoop,
	videoMuted,
	setAttributes,
}) => {
	return (
		<PanelBody
			title={__('Video Background', 'designsetgo')}
			initialOpen={false}
		>
			<MediaUploadCheck>
				<MediaUpload
					onSelect={(media) => setAttributes({ videoUrl: media.url })}
					allowedTypes={['video']}
					value={videoUrl}
					render={({ open }) => (
						<>
							<Button
								onClick={open}
								variant="secondary"
								style={{
									marginBottom: '10px',
									width: '100%',
								}}
							>
								{videoUrl
									? __('Replace Video', 'designsetgo')
									: __('Select Video', 'designsetgo')}
							</Button>
							{videoUrl && (
								<Button
									onClick={() =>
										setAttributes({
											videoUrl: '',
											videoPoster: '',
										})
									}
									variant="tertiary"
									isDestructive
									style={{
										marginBottom: '10px',
										width: '100%',
									}}
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
										style={{
											marginTop: '10px',
											marginBottom: '10px',
											width: '100%',
										}}
									>
										{videoPoster
											? __(
													'Replace Poster',
													'designsetgo'
												)
											: __(
													'Select Poster',
													'designsetgo'
												)}
									</Button>
									{videoPoster && (
										<Button
											onClick={() =>
												setAttributes({
													videoPoster: '',
												})
											}
											variant="tertiary"
											isDestructive
											style={{
												marginBottom: '10px',
												width: '100%',
											}}
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
						onChange={(value) =>
							setAttributes({ videoAutoplay: value })
						}
						help={__(
							'Automatically play video when page loads',
							'designsetgo'
						)}
					/>

					<ToggleControl
						label={__('Loop', 'designsetgo')}
						checked={videoLoop}
						onChange={(value) =>
							setAttributes({ videoLoop: value })
						}
						help={__(
							'Restart video when it reaches the end',
							'designsetgo'
						)}
					/>

					<ToggleControl
						label={__('Muted', 'designsetgo')}
						checked={videoMuted}
						onChange={(value) =>
							setAttributes({ videoMuted: value })
						}
						help={__(
							'Mute video audio (required for autoplay on most browsers)',
							'designsetgo'
						)}
					/>
				</>
			)}
		</PanelBody>
	);
};
