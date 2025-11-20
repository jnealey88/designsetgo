/**
 * Inspector Control Panels for Table of Contents Block
 */
import { __ } from '@wordpress/i18n';
import {
    PanelBody,
    ToggleControl,
    TextControl,
    RangeControl,
    CheckboxControl,
    RadioControl,
} from '@wordpress/components';

export function HeadingLevelsPanel({ attributes, setAttributes }) {
    const { includeH2, includeH3, includeH4, includeH5, includeH6 } =
        attributes;

    return (
        <PanelBody
            title={__('Heading Levels', 'designsetgo')}
            initialOpen={true}
        >
            <p className="components-base-control__help">
                {__(
                    'Select which heading levels to include in the table of contents:',
                    'designsetgo'
                )}
            </p>
            <CheckboxControl
                label={__('Include H2', 'designsetgo')}
                checked={includeH2}
                onChange={(value) => setAttributes({ includeH2: value })}
                __nextHasNoMarginBottom
            />
            <CheckboxControl
                label={__('Include H3', 'designsetgo')}
                checked={includeH3}
                onChange={(value) => setAttributes({ includeH3: value })}
                __nextHasNoMarginBottom
            />
            <CheckboxControl
                label={__('Include H4', 'designsetgo')}
                checked={includeH4}
                onChange={(value) => setAttributes({ includeH4: value })}
                __nextHasNoMarginBottom
            />
            <CheckboxControl
                label={__('Include H5', 'designsetgo')}
                checked={includeH5}
                onChange={(value) => setAttributes({ includeH5: value })}
                __nextHasNoMarginBottom
            />
            <CheckboxControl
                label={__('Include H6', 'designsetgo')}
                checked={includeH6}
                onChange={(value) => setAttributes({ includeH6: value })}
                __nextHasNoMarginBottom
            />
        </PanelBody>
    );
}

export function DisplaySettingsPanel({ attributes, setAttributes }) {
    const { displayMode, listStyle } = attributes;

    return (
        <PanelBody title={__('Display Settings', 'designsetgo')}>
            <RadioControl
                label={__('Display Mode', 'designsetgo')}
                selected={displayMode}
                options={[
                    {
                        label: __('Hierarchical (Nested)', 'designsetgo'),
                        value: 'hierarchical',
                    },
                    {
                        label: __('Flat List', 'designsetgo'),
                        value: 'flat',
                    },
                ]}
                onChange={(value) => setAttributes({ displayMode: value })}
                __nextHasNoMarginBottom
            />
            <RadioControl
                label={__('List Style', 'designsetgo')}
                selected={listStyle}
                options={[
                    {
                        label: __('Unordered (Bullets)', 'designsetgo'),
                        value: 'unordered',
                    },
                    {
                        label: __('Ordered (Numbers)', 'designsetgo'),
                        value: 'ordered',
                    },
                ]}
                onChange={(value) => setAttributes({ listStyle: value })}
                __nextHasNoMarginBottom
            />
        </PanelBody>
    );
}

export function TitleSettingsPanel({ attributes, setAttributes }) {
    const { showTitle, titleText } = attributes;

    return (
        <PanelBody title={__('Title Settings', 'designsetgo')}>
            <ToggleControl
                label={__('Show Title', 'designsetgo')}
                checked={showTitle}
                onChange={(value) => setAttributes({ showTitle: value })}
                __nextHasNoMarginBottom
            />
            {showTitle && (
                <TextControl
                    label={__('Title Text', 'designsetgo')}
                    value={titleText}
                    onChange={(value) => setAttributes({ titleText: value })}
                    placeholder={__('Table of Contents', 'designsetgo')}
                    __next40pxDefaultSize
                    __nextHasNoMarginBottom
                />
            )}
        </PanelBody>
    );
}

export function ScrollSettingsPanel({ attributes, setAttributes }) {
    const { scrollSmooth, scrollOffset, stickyOffset } = attributes;

    return (
        <PanelBody title={__('Scroll & Position Settings', 'designsetgo')}>
            <ToggleControl
                label={__('Smooth Scroll', 'designsetgo')}
                help={__(
                    'Enable smooth scrolling when clicking links',
                    'designsetgo'
                )}
                checked={scrollSmooth}
                onChange={(value) => setAttributes({ scrollSmooth: value })}
                __nextHasNoMarginBottom
            />
            <RangeControl
                label={__('Scroll Offset', 'designsetgo')}
                help={__(
                    'Offset from top when scrolling to headings (useful for sticky headers)',
                    'designsetgo'
                )}
                value={scrollOffset}
                onChange={(value) => setAttributes({ scrollOffset: value })}
                min={0}
                max={200}
                step={10}
                __next40pxDefaultSize
                __nextHasNoMarginBottom
            />
            <RangeControl
                label={__('Sticky Position Offset', 'designsetgo')}
                help={__(
                    'Offset from top when this block is sticky (prevents overlap with sticky headers)',
                    'designsetgo'
                )}
                value={stickyOffset}
                onChange={(value) => setAttributes({ stickyOffset: value })}
                min={0}
                max={200}
                step={10}
                __next40pxDefaultSize
                __nextHasNoMarginBottom
            />
        </PanelBody>
    );
}
