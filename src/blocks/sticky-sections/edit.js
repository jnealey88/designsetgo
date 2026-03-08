/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	PanelBody,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import './editor.scss';
import StickySectionsPlaceholder from './components/StickySectionsPlaceholder';

const ALLOWED_BLOCKS = ['designsetgo/section'];

export default function Edit({ attributes, setAttributes, clientId }) {
	const { stickyOffset } = attributes;

	const hasInnerBlocks = useSelect(
		(select) => {
			const { getBlock } = select(blockEditorStore);
			const block = getBlock(clientId);
			return block?.innerBlocks?.length > 0;
		},
		[clientId]
	);

	const blockProps = useBlockProps({
		className: 'dsgo-sticky-sections',
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		orientation: 'vertical',
	});

	// Show template chooser when block is first inserted
	if (!hasInnerBlocks) {
		return (
			<div {...blockProps}>
				<StickySectionsPlaceholder
					clientId={clientId}
					setAttributes={setAttributes}
				/>
			</div>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Sticky Sections Settings', 'designsetgo')}
					initialOpen={true}
				>
					<UnitControl
						label={__('Sticky Offset', 'designsetgo')}
						value={stickyOffset}
						onChange={(value) =>
							setAttributes({ stickyOffset: value })
						}
						help={__(
							'Offset from the top of the viewport. Useful when your site has a fixed header.',
							'designsetgo'
						)}
						units={[
							{ value: 'px', label: 'px' },
							{ value: 'rem', label: 'rem' },
							{ value: 'vh', label: 'vh' },
						]}
						__next40pxDefaultSize
					/>
				</PanelBody>
			</InspectorControls>

			<div {...innerBlocksProps} />
		</>
	);
}
