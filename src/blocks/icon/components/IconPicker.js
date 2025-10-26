/**
 * Visual Icon Picker Component
 *
 * Displays icons in a visual grid for easy selection
 */

import { Button, Popover, SearchControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { getIcon, getIconNames } from '../utils/svg-icons';

/**
 * Icon categories for organization
 */
const ICON_CATEGORIES = {
	all: {
		label: __('All', 'designsetgo'),
		icons: null, // null means show all icons
	},
	popular: {
		label: __('Popular', 'designsetgo'),
		icons: [
			'star',
			'heart',
			'check',
			'circle-check',
			'user',
			'users',
			'envelope',
			'phone',
			'location',
			'clock',
			'thumbs-up',
			'rocket',
		],
	},
	social: {
		label: __('Social Media', 'designsetgo'),
		icons: [
			'facebook',
			'twitter',
			'instagram',
			'linkedin',
			'youtube',
			'github',
		],
	},
	ecommerce: {
		label: __('E-commerce', 'designsetgo'),
		icons: ['shopping-cart', 'credit-card', 'tag', 'dollar', 'gift'],
	},
	communication: {
		label: __('Communication', 'designsetgo'),
		icons: ['comment', 'chat', 'bell', 'info', 'warning'],
	},
	actions: {
		label: __('Actions', 'designsetgo'),
		icons: [
			'plus',
			'minus',
			'times',
			'edit',
			'trash',
			'download',
			'upload',
			'search',
			'settings',
			'menu',
		],
	},
	media: {
		label: __('Media', 'designsetgo'),
		icons: [
			'play',
			'pause',
			'video',
			'image',
			'camera',
			'lightbulb',
			'trophy',
		],
	},
	navigation: {
		label: __('Navigation', 'designsetgo'),
		icons: [
			'arrow-right',
			'arrow-left',
			'arrow-up',
			'arrow-down',
			'chevron-right',
			'chevron-left',
		],
	},
	ui: {
		label: __('UI Elements', 'designsetgo'),
		icons: [
			'home',
			'bookmark',
			'link',
			'folder',
			'file',
			'code',
			'shield',
		],
	},
};

/**
 * IconPicker Component
 *
 * @param {Object} props
 * @param {string} props.value - Currently selected icon name
 * @param {Function} props.onChange - Callback when icon is selected
 */
export const IconPicker = ({ value, onChange }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [activeCategory, setActiveCategory] = useState('all');

	// Get all icon names for search
	const allIcons = getIconNames();

	// Filter icons based on search
	const getFilteredIcons = () => {
		if (!searchTerm) {
			const categoryIcons = ICON_CATEGORIES[activeCategory]?.icons;
			// If icons is null (like "all" category), show all icons
			return categoryIcons === null ? allIcons : categoryIcons || [];
		}

		// Search across all icons
		return allIcons.filter((iconName) =>
			iconName.toLowerCase().includes(searchTerm.toLowerCase())
		);
	};

	const filteredIcons = getFilteredIcons();

	return (
		<div className="dsg-icon-picker">
			<div className="dsg-icon-picker__label">
				{__('Choose Icon', 'designsetgo')}
			</div>

			{/* Current Icon Preview */}
			<Button
				className="dsg-icon-picker__trigger"
				onClick={() => setIsOpen(!isOpen)}
				aria-expanded={isOpen}
			>
				<span
					className="dsg-icon-picker__preview"
					style={{ width: '32px', height: '32px' }}
				>
					{getIcon(value)}
				</span>
				<span className="dsg-icon-picker__name">
					{value.charAt(0).toUpperCase() +
						value.slice(1).replace(/-/g, ' ')}
				</span>
			</Button>

			{/* Popover with Icon Grid */}
			{isOpen && (
				<Popover
					position="bottom left"
					onClose={() => {
						setIsOpen(false);
						setSearchTerm('');
					}}
					className="dsg-icon-picker__popover"
				>
					<div className="dsg-icon-picker__content">
						{/* Search */}
						<SearchControl
							value={searchTerm}
							onChange={setSearchTerm}
							placeholder={__('Search icons...', 'designsetgo')}
						/>

						{/* Category Tabs */}
						{!searchTerm && (
							<div className="dsg-icon-picker__categories">
								{Object.keys(ICON_CATEGORIES).map((categoryKey) => (
									<Button
										key={categoryKey}
										className={`dsg-icon-picker__category ${
											activeCategory === categoryKey
												? 'is-active'
												: ''
										}`}
										onClick={() => setActiveCategory(categoryKey)}
									>
										{ICON_CATEGORIES[categoryKey].label}
									</Button>
								))}
							</div>
						)}

						{/* Icon Grid */}
						<div className="dsg-icon-picker__grid">
							{filteredIcons.length > 0 ? (
								filteredIcons.map((iconName) => (
									<Button
										key={iconName}
										className={`dsg-icon-picker__icon ${
											value === iconName ? 'is-selected' : ''
										}`}
										onClick={() => {
											onChange(iconName);
											setIsOpen(false);
											setSearchTerm('');
										}}
										aria-label={iconName}
										title={iconName
											.charAt(0)
											.toUpperCase() +
											iconName.slice(1).replace(/-/g, ' ')}
									>
										<span
											style={{
												width: '24px',
												height: '24px',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											{getIcon(iconName)}
										</span>
									</Button>
								))
							) : (
								<div className="dsg-icon-picker__empty">
									{__('No icons found', 'designsetgo')}
								</div>
							)}
						</div>
					</div>
				</Popover>
			)}
		</div>
	);
};
