/**
 * Container Block - Edit Component
 *
 * @package DesignSetGo
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks, useInnerBlocksProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ToggleControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import classnames from 'classnames';
import { generateUniqueId } from '../../utils';

import './editor.scss';

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		uniqueId,
		layout,
		flexDirection,
		justifyContent,
		alignItems,
		gap,
		gridColumns,
		minHeight,
		htmlTag,
		animation,
		responsive,
	} = attributes;

	// Generate unique ID on mount.
	useEffect(() => {
		if (!uniqueId) {
			setAttributes({ uniqueId: generateUniqueId() });
		}
	}, []);

	const blockProps = useBlockProps({
		className: classnames('dsg-container', `dsg-container--${layout}`, {
			'dsg-hide-desktop': responsive.hideOnDesktop,
			'dsg-hide-tablet': responsive.hideOnTablet,
			'dsg-hide-mobile': responsive.hideOnMobile,
		}),
		style: {
			display: layout === 'flex' ? 'flex' : 'grid',
			flexDirection: layout === 'flex' ? flexDirection : undefined,
			justifyContent: layout === 'flex' ? justifyContent : undefined,
			alignItems: layout === 'flex' ? alignItems : undefined,
			gap: gap.desktop,
			gridTemplateColumns:
				layout === 'grid'
					? `repeat(${gridColumns.desktop}, 1fr)`
					: undefined,
			minHeight: minHeight.desktop,
		},
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		renderAppender: InnerBlocks.ButtonBlockAppender,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Layout', 'designsetgo')} initialOpen={true}>
					<SelectControl
						label={__('Layout Type', 'designsetgo')}
						value={layout}
						options={[
							{
								label: __('Flexbox', 'designsetgo'),
								value: 'flex',
							},
							{ label: __('Grid', 'designsetgo'), value: 'grid' },
							{
								label: __('Auto Grid', 'designsetgo'),
								value: 'auto-grid',
							},
						]}
						onChange={(value) => setAttributes({ layout: value })}
					/>

					{layout === 'flex' && (
						<>
							<SelectControl
								label={__('Direction', 'designsetgo')}
								value={flexDirection}
								options={[
									{
										label: __('Row', 'designsetgo'),
										value: 'row',
									},
									{
										label: __('Row Reverse', 'designsetgo'),
										value: 'row-reverse',
									},
									{
										label: __('Column', 'designsetgo'),
										value: 'column',
									},
									{
										label: __('Column Reverse', 'designsetgo'),
										value: 'column-reverse',
									},
								]}
								onChange={(value) =>
									setAttributes({ flexDirection: value })
								}
							/>

							<SelectControl
								label={__('Justify Content', 'designsetgo')}
								value={justifyContent}
								options={[
									{
										label: __('Start', 'designsetgo'),
										value: 'flex-start',
									},
									{
										label: __('Center', 'designsetgo'),
										value: 'center',
									},
									{
										label: __('End', 'designsetgo'),
										value: 'flex-end',
									},
									{
										label: __('Space Between', 'designsetgo'),
										value: 'space-between',
									},
									{
										label: __('Space Around', 'designsetgo'),
										value: 'space-around',
									},
									{
										label: __('Space Evenly', 'designsetgo'),
										value: 'space-evenly',
									},
								]}
								onChange={(value) =>
									setAttributes({ justifyContent: value })
								}
							/>

							<SelectControl
								label={__('Align Items', 'designsetgo')}
								value={alignItems}
								options={[
									{
										label: __('Start', 'designsetgo'),
										value: 'flex-start',
									},
									{
										label: __('Center', 'designsetgo'),
										value: 'center',
									},
									{
										label: __('End', 'designsetgo'),
										value: 'flex-end',
									},
									{
										label: __('Stretch', 'designsetgo'),
										value: 'stretch',
									},
									{
										label: __('Baseline', 'designsetgo'),
										value: 'baseline',
									},
								]}
								onChange={(value) =>
									setAttributes({ alignItems: value })
								}
							/>
						</>
					)}

					{layout === 'grid' && (
						<RangeControl
							label={__('Columns (Desktop)', 'designsetgo')}
							value={gridColumns.desktop}
							onChange={(value) =>
								setAttributes({
									gridColumns: {
										...gridColumns,
										desktop: value,
									},
								})
							}
							min={1}
							max={12}
						/>
					)}
				</PanelBody>

				<PanelBody
					title={__('Settings', 'designsetgo')}
					initialOpen={false}
				>
					<SelectControl
						label={__('HTML Tag', 'designsetgo')}
						value={htmlTag}
						options={[
							{ label: 'div', value: 'div' },
							{ label: 'section', value: 'section' },
							{ label: 'article', value: 'article' },
							{ label: 'aside', value: 'aside' },
							{ label: 'header', value: 'header' },
							{ label: 'footer', value: 'footer' },
							{ label: 'main', value: 'main' },
						]}
						onChange={(value) => setAttributes({ htmlTag: value })}
					/>
				</PanelBody>

				<PanelBody
					title={__('Responsive', 'designsetgo')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Hide on Desktop', 'designsetgo')}
						checked={responsive.hideOnDesktop}
						onChange={(value) =>
							setAttributes({
								responsive: {
									...responsive,
									hideOnDesktop: value,
								},
							})
						}
					/>
					<ToggleControl
						label={__('Hide on Tablet', 'designsetgo')}
						checked={responsive.hideOnTablet}
						onChange={(value) =>
							setAttributes({
								responsive: {
									...responsive,
									hideOnTablet: value,
								},
							})
						}
					/>
					<ToggleControl
						label={__('Hide on Mobile', 'designsetgo')}
						checked={responsive.hideOnMobile}
						onChange={(value) =>
							setAttributes({
								responsive: {
									...responsive,
									hideOnMobile: value,
								},
							})
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...innerBlocksProps} />
		</>
	);
}
