/**
 * Text Style Popover Component
 *
 * Main popover container with all style controls.
 *
 * @since 1.3.0
 */

import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { close as closeIcon } from '@wordpress/icons';

import ColorSection from './ColorSection';
import SizeSection from './SizeSection';
import { hasAnyStyle } from '../utils';

/**
 * TextStylePopover Component
 *
 * @param {Object}   props               - Component props
 * @param {Object}   props.styles        - Initial style values from format
 * @param {Function} props.onChange      - Callback when styles change
 * @param {Function} props.onClear       - Callback to clear all styles
 * @param {Function} props.onClose       - Callback to close popover
 * @return {JSX.Element} The popover content
 */
export default function TextStylePopover( {
	styles: initialStyles,
	onChange,
	onClear,
	onClose,
} ) {
	// Use local state for immediate UI feedback
	const [ localStyles, setLocalStyles ] = useState( initialStyles );

	// Sync with external styles when they change (e.g., undo/redo)
	useEffect( () => {
		setLocalStyles( initialStyles );
	}, [ initialStyles ] );

	const {
		textColor,
		textGradient,
		highlightColor,
		highlightGradient,
		fontSize,
		padding,
		borderRadius,
	} = localStyles;

	/**
	 * Update a single style property
	 */
	const updateStyle = ( property, value ) => {
		const newStyles = { ...localStyles, [ property ]: value };

		// Handle mutual exclusivity between gradient text and backgrounds
		// Gradient text uses background-clip: text which clips ALL backgrounds
		if ( property === 'textGradient' && value ) {
			// Clear ALL background options when applying text gradient
			newStyles.highlightGradient = '';
			newStyles.highlightColor = '';
			// Clear solid text color when applying gradient
			newStyles.textColor = '';
		} else if ( property === 'textColor' && value ) {
			// Clear text gradient when applying solid color
			newStyles.textGradient = '';
		} else if ( property === 'highlightGradient' && value ) {
			// Clear text gradient when applying highlight gradient
			newStyles.textGradient = '';
			// Clear solid highlight when applying gradient
			newStyles.highlightColor = '';
		} else if ( property === 'highlightColor' && value ) {
			// Clear highlight gradient when applying solid color
			newStyles.highlightGradient = '';
		}

		// Update local state immediately for UI feedback
		setLocalStyles( newStyles );

		// Apply to format
		onChange( newStyles );
	};

	/**
	 * Handle clear all
	 */
	const handleClear = () => {
		setLocalStyles( {
			textColor: '',
			textGradient: '',
			highlightColor: '',
			highlightGradient: '',
			fontSize: '',
			padding: '',
			borderRadius: '',
		} );
		onClear();
	};

	return (
		<div className="dsgo-text-style-popover__content">
			{ /* Header */ }
			<div className="dsgo-text-style-popover__header">
				<span className="dsgo-text-style-popover__title">
					{ __( 'Text Style', 'designsetgo' ) }
				</span>
				<Button
					icon={ closeIcon }
					label={ __( 'Close', 'designsetgo' ) }
					onClick={ onClose }
					size="small"
				/>
			</div>

			{ /* Size & Padding Section (first for quick access) */ }
			<SizeSection
				fontSize={ fontSize }
				onFontSizeChange={ ( value ) =>
					updateStyle( 'fontSize', value )
				}
				padding={ padding }
				onPaddingChange={ ( value ) =>
					updateStyle( 'padding', value )
				}
				borderRadius={ borderRadius }
				onBorderRadiusChange={ ( value ) =>
					updateStyle( 'borderRadius', value )
				}
			/>

			{ /* Color Section (Text + Background with tabs) */ }
			<ColorSection
				textColor={ textColor }
				textGradient={ textGradient }
				highlightColor={ highlightColor }
				highlightGradient={ highlightGradient }
				onTextColorChange={ ( value ) =>
					updateStyle( 'textColor', value )
				}
				onTextGradientChange={ ( value ) =>
					updateStyle( 'textGradient', value )
				}
				onHighlightColorChange={ ( value ) =>
					updateStyle( 'highlightColor', value )
				}
				onHighlightGradientChange={ ( value ) =>
					updateStyle( 'highlightGradient', value )
				}
			/>

			{ /* Clear All Button */ }
			{ hasAnyStyle( localStyles ) && (
				<div className="dsgo-text-style-popover__footer">
					<Button
						variant="secondary"
						isDestructive
						onClick={ handleClear }
						className="dsgo-text-style-popover__clear-button"
					>
						{ __( 'Clear All Styles', 'designsetgo' ) }
					</Button>
				</div>
			) }
		</div>
	);
}
