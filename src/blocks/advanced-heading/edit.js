/**
 * Advanced Heading Block - Edit Component
 *
 * Renders a heading element containing inner blocks (heading segments)
 * that each support independent typography controls.
 *
 * @since 1.5.0
 */

import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToolbarGroup,
	ToolbarDropdownMenu,
} from '@wordpress/components';
import { heading as headingIcon } from '@wordpress/icons';

const ALLOWED_BLOCKS = ['designsetgo/heading-segment'];
const TEMPLATE = [
	[
		'designsetgo/heading-segment',
		{
			content: 'Bold ',
			style: { typography: { fontWeight: '700' } },
		},
	],
	['designsetgo/heading-segment', { content: 'Heading' }],
];

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6];

/**
 * Advanced Heading Edit Component
 *
 * @param {Object}   props               - Component props
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @return {JSX.Element} Advanced Heading block edit component
 */
export default function AdvancedHeadingEdit({ attributes, setAttributes }) {
	const { level = 2, textAlign } = attributes;
	const validLevel = HEADING_LEVELS.includes(level) ? level : 2;
	const TagName = `h${validLevel}`;

	const blockProps = useBlockProps({
		className: classnames('dsgo-advanced-heading', {
			[`has-text-align-${textAlign}`]: textAlign,
		}),
	});

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsgo-advanced-heading__inner',
		},
		{
			allowedBlocks: ALLOWED_BLOCKS,
			template: TEMPLATE,
			orientation: 'horizontal',
			renderAppender: false,
		}
	);

	return (
		<>
			{/* ========================================
			     BLOCK TOOLBAR
			    ======================================== */}
			<BlockControls group="block">
				<ToolbarGroup>
					<ToolbarDropdownMenu
						icon={headingIcon}
						label={__('Change heading level', 'designsetgo')}
						controls={HEADING_LEVELS.map((targetLevel) => ({
							icon: headingIcon,
							title: `H${targetLevel}`,
							isActive: level === targetLevel,
							onClick: () =>
								setAttributes({ level: targetLevel }),
						}))}
					/>
				</ToolbarGroup>
				<AlignmentToolbar
					value={textAlign}
					onChange={(value) => setAttributes({ textAlign: value })}
				/>
			</BlockControls>

			{/* ========================================
			     INSPECTOR CONTROLS
			    ======================================== */}
			<InspectorControls>
				<PanelBody
					title={__('Heading Settings', 'designsetgo')}
					initialOpen={true}
				>
					<p className="dsgo-advanced-heading__level-label">
						{__('Heading Level', 'designsetgo')}
					</p>
					<div className="dsgo-advanced-heading__level-buttons">
						{HEADING_LEVELS.map((targetLevel) => (
							<button
								key={targetLevel}
								className={`dsgo-advanced-heading__level-button${level === targetLevel ? ' is-active' : ''}`}
								onClick={() =>
									setAttributes({ level: targetLevel })
								}
								aria-pressed={level === targetLevel}
							>
								H{targetLevel}
							</button>
						))}
					</div>
				</PanelBody>
			</InspectorControls>

			{/* ========================================
			     BLOCK CONTENT
			    ======================================== */}
			<div {...blockProps}>
				<TagName {...innerBlocksProps} />
			</div>
		</>
	);
}
