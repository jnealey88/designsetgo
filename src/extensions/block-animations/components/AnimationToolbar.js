/**
 * Block Animations - Toolbar Button
 *
 * Adds animation icon to block toolbar for quick access
 *
 * @package DesignSetGo
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton, Dropdown, MenuGroup, MenuItem } from '@wordpress/components';
import { Icon } from '@wordpress/icons';
import { ANIMATION_TYPES } from '../constants';

/**
 * Custom Animation Icon - Lightning bolt represents speed/motion
 */
const AnimationIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
	>
		<path
			d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * Animation Toolbar Component
 *
 * @param {Object} props Component props
 * @param {Object} props.attributes Block attributes
 * @param {Function} props.setAttributes Function to update attributes
 * @return {JSX.Element|null} Toolbar component
 */
export default function AnimationToolbar({ attributes, setAttributes }) {
	const { dsgAnimationEnabled, dsgEntranceAnimation } = attributes;

	return (
		<BlockControls group="block">
			<ToolbarGroup>
				<Dropdown
					popoverProps={{
						placement: 'bottom-start',
					}}
					renderToggle={({ isOpen, onToggle }) => (
						<ToolbarButton
							icon={<Icon icon={<AnimationIcon />} />}
							label={__('Animations', 'designsetgo')}
							onClick={onToggle}
							aria-expanded={isOpen}
							isPressed={dsgAnimationEnabled}
						/>
					)}
					renderContent={() => (
						<MenuGroup label={__('Quick Animations', 'designsetgo')}>
							<MenuItem
								onClick={() =>
									setAttributes({
										dsgAnimationEnabled: !dsgAnimationEnabled,
									})
								}
								isSelected={!dsgAnimationEnabled}
							>
								{__('None', 'designsetgo')}
							</MenuItem>

							{ANIMATION_TYPES.entrance.slice(0, 5).map((animation) => (
								<MenuItem
									key={animation.value}
									onClick={() =>
										setAttributes({
											dsgAnimationEnabled: true,
											dsgEntranceAnimation: animation.value,
											dsgAnimationTrigger: 'scroll',
										})
									}
									isSelected={
										dsgAnimationEnabled &&
										dsgEntranceAnimation === animation.value
									}
								>
									{animation.label}
								</MenuItem>
							))}
						</MenuGroup>
					)}
				/>
			</ToolbarGroup>
		</BlockControls>
	);
}
