/**
 * Color Section Component
 *
 * Unified color controls with Text/Background tabs, each with solid/gradient options.
 *
 * @since 1.3.0
 */

import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	ColorPalette,
	GradientPicker,
	Button,
	ButtonGroup,
} from '@wordpress/components';
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

/**
 * ColorSection Component
 *
 * @param {Object}   props                           - Component props
 * @param {string}   props.textColor                 - Current solid text color
 * @param {string}   props.textGradient              - Current gradient text fill
 * @param {string}   props.highlightColor            - Current solid highlight color
 * @param {string}   props.highlightGradient         - Current gradient highlight
 * @param {Function} props.onTextColorChange         - Callback when text color changes
 * @param {Function} props.onTextGradientChange      - Callback when text gradient changes
 * @param {Function} props.onHighlightColorChange    - Callback when highlight color changes
 * @param {Function} props.onHighlightGradientChange - Callback when highlight gradient changes
 * @return {JSX.Element} The color section
 */
export default function ColorSection( {
	textColor,
	textGradient,
	highlightColor,
	highlightGradient,
	onTextColorChange,
	onTextGradientChange,
	onHighlightColorChange,
	onHighlightGradientChange,
} ) {
	// Determine initial main tab based on current values
	const getInitialMainTab = () => {
		if ( highlightColor || highlightGradient ) {
			return 'background';
		}
		return 'text';
	};

	// Determine initial type tab based on current values
	const getInitialTypeTab = ( mainTab ) => {
		if ( mainTab === 'text' ) {
			return textGradient ? 'gradient' : 'solid';
		}
		return highlightGradient ? 'gradient' : 'solid';
	};

	const [ mainTab, setMainTab ] = useState( () => getInitialMainTab() );
	const [ textTypeTab, setTextTypeTab ] = useState( () =>
		getInitialTypeTab( 'text' )
	);
	const [ bgTypeTab, setBgTypeTab ] = useState( () =>
		getInitialTypeTab( 'background' )
	);

	// Get theme colors and gradients
	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const allColors = ( colorGradientSettings?.colors || [] ).flatMap(
		( origin ) => origin.colors || []
	);
	const allGradients = ( colorGradientSettings?.gradients || [] ).flatMap(
		( origin ) => origin.gradients || []
	);

	// Check if gradient text is active (disables ALL background options)
	// Gradient text uses background-clip: text which clips all backgrounds
	const hasGradientText = Boolean( textGradient );

	return (
		<div className="dsgo-text-style-popover__section">
			{ /* Main Tabs: Text / Background */ }
			<div className="dsgo-text-style-popover__section-header">
				<span className="dsgo-text-style-popover__section-title">
					{ __( 'Color', 'designsetgo' ) }
				</span>
				<ButtonGroup className="dsgo-text-style-popover__tabs">
					<Button
						size="small"
						variant={ mainTab === 'text' ? 'primary' : 'secondary' }
						onClick={ () => setMainTab( 'text' ) }
					>
						{ __( 'Text', 'designsetgo' ) }
					</Button>
					<Button
						size="small"
						variant={
							mainTab === 'background' ? 'primary' : 'secondary'
						}
						onClick={ () => setMainTab( 'background' ) }
					>
						{ __( 'Background', 'designsetgo' ) }
					</Button>
				</ButtonGroup>
			</div>

			{ /* Text Color Controls */ }
			{ mainTab === 'text' && (
				<>
					{ /* Solid/Gradient Toggle */ }
					<div className="dsgo-text-style-popover__type-tabs">
						<ButtonGroup>
							<Button
								size="small"
								variant={
									textTypeTab === 'solid'
										? 'primary'
										: 'tertiary'
								}
								onClick={ () => setTextTypeTab( 'solid' ) }
							>
								{ __( 'Solid', 'designsetgo' ) }
							</Button>
							<Button
								size="small"
								variant={
									textTypeTab === 'gradient'
										? 'primary'
										: 'tertiary'
								}
								onClick={ () => setTextTypeTab( 'gradient' ) }
							>
								{ __( 'Gradient', 'designsetgo' ) }
							</Button>
						</ButtonGroup>
					</div>

					{ textTypeTab === 'solid' && (
						<ColorPalette
							colors={ allColors }
							value={ textColor }
							onChange={ ( value ) =>
								onTextColorChange( value || '' )
							}
							clearable
							enableAlpha
						/>
					) }

					{ textTypeTab === 'gradient' && (
						<GradientPicker
							gradients={ allGradients }
							value={ textGradient || undefined }
							onChange={ ( value ) =>
								onTextGradientChange( value || '' )
							}
						/>
					) }
				</>
			) }

			{ /* Background/Highlight Controls */ }
			{ mainTab === 'background' && (
				<>
					{ /* Notice when gradient text is active */ }
					{ hasGradientText && (
						<p className="dsgo-text-style-popover__notice">
							{ __(
								'Background unavailable with gradient text. Gradient text uses background-clip which affects all backgrounds.',
								'designsetgo'
							) }
						</p>
					) }

					{ /* Only show controls when gradient text is NOT active */ }
					{ ! hasGradientText && (
						<>
							{ /* Solid/Gradient Toggle */ }
							<div className="dsgo-text-style-popover__type-tabs">
								<ButtonGroup>
									<Button
										size="small"
										variant={
											bgTypeTab === 'solid'
												? 'primary'
												: 'tertiary'
										}
										onClick={ () => setBgTypeTab( 'solid' ) }
									>
										{ __( 'Solid', 'designsetgo' ) }
									</Button>
									<Button
										size="small"
										variant={
											bgTypeTab === 'gradient'
												? 'primary'
												: 'tertiary'
										}
										onClick={ () =>
											setBgTypeTab( 'gradient' )
										}
									>
										{ __( 'Gradient', 'designsetgo' ) }
									</Button>
								</ButtonGroup>
							</div>

							{ bgTypeTab === 'solid' && (
								<ColorPalette
									colors={ allColors }
									value={ highlightColor }
									onChange={ ( value ) =>
										onHighlightColorChange( value || '' )
									}
									clearable
									enableAlpha
								/>
							) }

							{ bgTypeTab === 'gradient' && (
								<GradientPicker
									gradients={ allGradients }
									value={ highlightGradient || undefined }
									onChange={ ( value ) =>
										onHighlightGradientChange( value || '' )
									}
								/>
							) }
						</>
					) }
				</>
			) }
		</div>
	);
}
