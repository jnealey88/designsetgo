import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	Button,
	Notice,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis -- UnitControl and HStack are stable in practice
	__experimentalUnitControl as UnitControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalHStack as HStack,
} from '@wordpress/components';
import { plus, close } from '@wordpress/icons';

export default function ScrollMarqueeEdit({ attributes, setAttributes }) {
	const {
		rows,
		scrollSpeed,
		imageHeight,
		imageWidth,
		gap,
		rowGap,
		borderRadius,
	} = attributes;

	const imageInlineStyle = {
		height: imageHeight,
		width: imageWidth,
		borderRadius,
	};

	// Performance: Calculate total images across all rows
	const totalImages = rows.reduce(
		(sum, row) => sum + (row.images?.length || 0),
		0
	);
	const showPerformanceWarning = totalImages > 20;

	const blockProps = useBlockProps({
		className: 'dsg-scroll-marquee',
		style: {
			'--dsg-marquee-gap': gap,
			'--dsg-marquee-row-gap': rowGap,
			'--dsg-marquee-image-height': imageHeight,
			'--dsg-marquee-image-width': imageWidth,
			'--dsg-marquee-border-radius': borderRadius,
		},
	});

	const addRow = () => {
		const newRows = [
			...rows,
			{ images: [], direction: rows.length % 2 === 0 ? 'left' : 'right' },
		];
		setAttributes({ rows: newRows });
	};

	const removeRow = (rowIndex) => {
		const newRows = rows.filter((_, index) => index !== rowIndex);
		setAttributes({ rows: newRows });
	};

	const toggleRowDirection = (rowIndex) => {
		const newRows = [...rows];
		newRows[rowIndex].direction =
			newRows[rowIndex].direction === 'left' ? 'right' : 'left';
		setAttributes({ rows: newRows });
	};

	const onSelectImages = (rowIndex, images) => {
		const newRows = [...rows];
		// MediaUpload with 'value' prop pre-selects existing images,
		// so 'images' param contains ALL selected images (existing + new)
		// We just need to map them to our format
		newRows[rowIndex].images = images.map((img) => ({
			id: img.id,
			url: img.url,
			alt: img.alt || '',
		}));
		setAttributes({ rows: newRows });
	};

	const removeImage = (rowIndex, imageIndex) => {
		const newRows = [...rows];
		newRows[rowIndex].images = newRows[rowIndex].images.filter(
			(_, index) => index !== imageIndex
		);
		setAttributes({ rows: newRows });
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Performance', 'designsetgo')}
					initialOpen={showPerformanceWarning}
				>
					{showPerformanceWarning && (
						<Notice status="warning" isDismissible={false}>
							{__('You have', 'designsetgo')}
							<strong>{totalImages}</strong>
							{__(
								'images. For best performance, consider using fewer images (20 or less) or optimizing image sizes. Each image is duplicated 6 times for smooth infinite scrolling.',
								'designsetgo'
							)}
						</Notice>
					)}
					{!showPerformanceWarning && (
						<Notice status="success" isDismissible={false}>
							{__('Total images:', 'designsetgo')}
							<strong>{totalImages}</strong>
							{__(
								'(duplicated 6x for infinite scroll)',
								'designsetgo'
							)}
						</Notice>
					)}
				</PanelBody>

				<PanelBody
					title={__('Scroll Settings', 'designsetgo')}
					initialOpen={!showPerformanceWarning}
				>
					<RangeControl
						label={__('Scroll Speed', 'designsetgo')}
						value={scrollSpeed}
						onChange={(value) =>
							setAttributes({ scrollSpeed: value })
						}
						min={0.1}
						max={2}
						step={0.1}
						help={__(
							'Controls how fast images move based on scroll',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Image Dimensions', 'designsetgo')}
					initialOpen={false}
				>
					<UnitControl
						label={__('Image Height', 'designsetgo')}
						value={imageHeight}
						onChange={(value) =>
							setAttributes({ imageHeight: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<UnitControl
						label={__('Image Width', 'designsetgo')}
						value={imageWidth}
						onChange={(value) =>
							setAttributes({ imageWidth: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<UnitControl
						label={__('Border Radius', 'designsetgo')}
						value={borderRadius}
						onChange={(value) =>
							setAttributes({ borderRadius: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Spacing', 'designsetgo')}
					initialOpen={false}
				>
					<UnitControl
						label={__('Gap Between Images', 'designsetgo')}
						value={gap}
						onChange={(value) => setAttributes({ gap: value })}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<UnitControl
						label={__('Gap Between Rows', 'designsetgo')}
						value={rowGap}
						onChange={(value) => setAttributes({ rowGap: value })}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{rows.map((row, rowIndex) => (
					<div
						key={rowIndex}
						className="dsg-scroll-marquee__row"
						data-direction={row.direction}
					>
						<div className="dsg-scroll-marquee__row-controls">
							<HStack justify="space-between" spacing={3}>
								<div className="dsg-scroll-marquee__direction-control">
									<Button
										variant="secondary"
										size="small"
										onClick={() =>
											toggleRowDirection(rowIndex)
										}
										style={{ minWidth: '120px' }}
									>
										{row.direction === 'left'
											? '← Scroll Left'
											: 'Scroll Right →'}
									</Button>
								</div>
								<Button
									icon={close}
									label={__('Remove Row', 'designsetgo')}
									onClick={() => removeRow(rowIndex)}
									isDestructive
									size="small"
								/>
							</HStack>
						</div>

						<div className="dsg-scroll-marquee__track">
							<div className="dsg-scroll-marquee__track-segment">
								{row.images.map((image, imageIndex) => (
									<div
										key={imageIndex}
										className="dsg-scroll-marquee__image-wrapper"
									>
										<img
											src={image.url}
											alt={image.alt}
											className="dsg-scroll-marquee__image"
											style={imageInlineStyle}
										/>
										<Button
											icon={close}
											label={__(
												'Remove Image',
												'designsetgo'
											)}
											onClick={() =>
												removeImage(
													rowIndex,
													imageIndex
												)
											}
											className="dsg-scroll-marquee__remove-image"
											isDestructive
											size="small"
										/>
									</div>
								))}

								<MediaUploadCheck>
									<MediaUpload
										onSelect={(images) =>
											onSelectImages(rowIndex, images)
										}
										allowedTypes={['image']}
										multiple={true}
										value={row.images.map((img) => img.id)}
										render={({ open }) => (
											<Button
												icon={plus}
												onClick={open}
												className="dsg-scroll-marquee__add-images"
												variant="secondary"
											>
												{row.images.length === 0
													? __(
															'Add Images',
															'designsetgo'
														)
													: __(
															'Add More Images',
															'designsetgo'
														)}
											</Button>
										)}
									/>
								</MediaUploadCheck>
							</div>
						</div>
					</div>
				))}

				<Button
					icon={plus}
					onClick={addRow}
					className="dsg-scroll-marquee__add-row"
					variant="primary"
				>
					{__('Add Row', 'designsetgo')}
				</Button>
			</div>
		</>
	);
}
