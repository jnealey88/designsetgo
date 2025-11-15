/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/blocks/card/block.json":
/*!************************************!*\
  !*** ./src/blocks/card/block.json ***!
  \************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"designsetgo/card","version":"1.0.0","title":"Card","category":"design","description":"Display content in a card layout with image, badge, title, subtitle, body text, and CTA button. Perfect for pricing, features, services, and team members.","keywords":["card","content","image","cta","pricing","feature"],"textdomain":"designsetgo","supports":{"anchor":true,"align":["left","center","right","wide","full"],"html":false,"inserter":true,"spacing":{"margin":true,"padding":true,"blockGap":true,"__experimentalDefaultControls":{"margin":false,"padding":true,"blockGap":false}},"color":{"background":true,"text":true,"gradients":true,"__experimentalDefaultControls":{"background":true,"text":false}},"typography":{"fontSize":true,"lineHeight":true,"__experimentalFontWeight":true,"__experimentalFontFamily":true,"__experimentalDefaultControls":{"fontSize":false}},"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true,"__experimentalDefaultControls":{"radius":true,"width":false}},"shadow":true,"interactivity":{"clientNavigation":true}},"attributes":{"layoutPreset":{"type":"string","default":"standard","enum":["standard","horizontal-left","horizontal-right","background","minimal","featured"]},"imageId":{"type":"number","default":0},"imageUrl":{"type":"string","default":""},"imageAlt":{"type":"string","default":""},"imageAspectRatio":{"type":"string","default":"16-9","enum":["16-9","4-3","1-1","original","custom"]},"imageCustomAspectRatio":{"type":"string","default":""},"imageObjectFit":{"type":"string","default":"cover","enum":["cover","contain","fill","scale-down"]},"imageFocalPoint":{"type":"object","default":{"x":0.5,"y":0.5}},"badgeText":{"type":"string","default":""},"badgeStyle":{"type":"string","default":"floating","enum":["floating","inline"]},"badgeFloatingPosition":{"type":"string","default":"top-right","enum":["top-left","top-right","bottom-left","bottom-right"]},"badgeInlinePosition":{"type":"string","default":"above-title","enum":["above-title","below-title"]},"badgeBackgroundColor":{"type":"string","default":""},"badgeTextColor":{"type":"string","default":""},"title":{"type":"string","default":""},"subtitle":{"type":"string","default":""},"bodyText":{"type":"string","default":""},"overlayOpacity":{"type":"number","default":80},"overlayColor":{"type":"string","default":""},"borderColor":{"type":"string","default":""},"contentAlignment":{"type":"string","default":"center","enum":["left","center","right"]},"visualStyle":{"type":"string","default":"default","enum":["default","outlined","filled","shadow","minimal"]},"showImage":{"type":"boolean","default":true},"showTitle":{"type":"boolean","default":true},"showSubtitle":{"type":"boolean","default":true},"showBody":{"type":"boolean","default":true},"showBadge":{"type":"boolean","default":true},"showCta":{"type":"boolean","default":true}},"providesContext":{"designsetgo/card/layoutPreset":"layoutPreset"},"example":{"attributes":{"title":"Card Title","subtitle":"Card Subtitle","bodyText":"This is a sample card with all the features you need for pricing, features, services, and team members.","badgeText":"New","layoutPreset":"standard"}},"editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./index.css"}');

/***/ }),

/***/ "./src/blocks/card/edit.js":
/*!*********************************!*\
  !*** ./src/blocks/card/edit.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CardEdit)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * WordPress dependencies
 */




/**
 * Edit component for Card block
 *
 * @param {Object}   props               - Component props
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to set attributes
 * @param {string}   props.clientId      - Block client ID
 * @return {Element} Edit component
 */

function CardEdit({
  attributes,
  setAttributes,
  clientId
}) {
  const {
    layoutPreset,
    imageUrl,
    imageAlt,
    imageAspectRatio,
    imageCustomAspectRatio,
    imageObjectFit,
    imageFocalPoint,
    badgeText,
    badgeStyle,
    badgeFloatingPosition,
    badgeInlinePosition,
    badgeBackgroundColor,
    badgeTextColor,
    title,
    subtitle,
    bodyText,
    overlayOpacity,
    overlayColor,
    contentAlignment,
    visualStyle,
    borderColor,
    showImage,
    showTitle,
    showSubtitle,
    showBody,
    showBadge,
    showCta
  } = attributes;
  const colorGradientSettings = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalUseMultipleOriginColorsAndGradients)();

  // Build block props with border color
  const blockStyles = {};
  // Only apply custom border color on styles that have borders (not minimal)
  if (borderColor && visualStyle !== 'minimal') {
    blockStyles.borderColor = borderColor;
    // Ensure border exists
    blockStyles.borderWidth = visualStyle === 'outlined' ? '2px' : '1px';
    blockStyles.borderStyle = 'solid';
  }
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: `dsgo-card dsgo-card--${layoutPreset} dsgo-card--style-${visualStyle}`,
    style: blockStyles
  });

  // Inner blocks props for CTA area
  const innerBlocksProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useInnerBlocksProps)({
    className: 'dsgo-card__cta'
  }, {
    template: [['designsetgo/icon-button', {
      text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Learn More', 'designsetgo')
    }]],
    templateLock: false,
    allowedBlocks: ['designsetgo/icon-button']
  });

  // Calculate image styles
  const imageStyles = {};
  if (imageAspectRatio !== 'original') {
    if (imageAspectRatio === 'custom' && imageCustomAspectRatio) {
      imageStyles.aspectRatio = imageCustomAspectRatio;
    } else if (imageAspectRatio === '16-9') {
      imageStyles.aspectRatio = '16 / 9';
    } else if (imageAspectRatio === '4-3') {
      imageStyles.aspectRatio = '4 / 3';
    } else if (imageAspectRatio === '1-1') {
      imageStyles.aspectRatio = '1 / 1';
    }
  }
  if (imageObjectFit) {
    imageStyles.objectFit = imageObjectFit;
  }
  if (imageObjectFit === 'cover' && imageFocalPoint) {
    imageStyles.objectPosition = `${imageFocalPoint.x * 100}% ${imageFocalPoint.y * 100}%`;
  }

  // Calculate badge styles
  const badgeStyles = {};
  if (badgeBackgroundColor) {
    badgeStyles.backgroundColor = badgeBackgroundColor;
  }
  if (badgeTextColor) {
    badgeStyles.color = badgeTextColor;
  }

  // Calculate overlay styles for background layout
  const overlayStyles = {};
  if (layoutPreset === 'background') {
    if (overlayColor) {
      overlayStyles.backgroundColor = overlayColor;
      overlayStyles.opacity = overlayOpacity / 100;
    } else {
      // Use theme contrast color at full opacity, let overlayOpacity control transparency
      overlayStyles.backgroundColor = 'var(--wp--preset--color--contrast, #000)';
      overlayStyles.opacity = overlayOpacity / 100;
    }
  }

  // Content alignment class
  const contentAlignmentClass = `dsgo-card__content--${contentAlignment}`;

  // Options for select controls
  const layoutOptions = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Standard (Image Top)', 'designsetgo'),
    value: 'standard'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Horizontal (Image Left)', 'designsetgo'),
    value: 'horizontal-left'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Horizontal (Image Right)', 'designsetgo'),
    value: 'horizontal-right'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Background (Image Behind)', 'designsetgo'),
    value: 'background'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Minimal (No Image)', 'designsetgo'),
    value: 'minimal'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Featured (Large Image)', 'designsetgo'),
    value: 'featured'
  }];
  const visualStyleOptions = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Default', 'designsetgo'),
    value: 'default'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Outlined', 'designsetgo'),
    value: 'outlined'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Filled', 'designsetgo'),
    value: 'filled'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Shadow', 'designsetgo'),
    value: 'shadow'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Minimal', 'designsetgo'),
    value: 'minimal'
  }];
  const alignmentOptions = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Left', 'designsetgo'),
    value: 'left'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Center', 'designsetgo'),
    value: 'center'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Right', 'designsetgo'),
    value: 'right'
  }];
  const badgeStyleOptions = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Floating (Over Card)', 'designsetgo'),
    value: 'floating'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Inline (In Content)', 'designsetgo'),
    value: 'inline'
  }];
  const badgeFloatingPositionOptions = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top Left', 'designsetgo'),
    value: 'top-left'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top Right', 'designsetgo'),
    value: 'top-right'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bottom Left', 'designsetgo'),
    value: 'bottom-left'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bottom Right', 'designsetgo'),
    value: 'bottom-right'
  }];
  const badgeInlinePositionOptions = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Above Title', 'designsetgo'),
    value: 'above-title'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Below Title', 'designsetgo'),
    value: 'below-title'
  }];

  // Render badge
  const renderBadge = () => {
    if (!showBadge || !badgeText) {
      return null;
    }
    const badgeClass = badgeStyle === 'floating' ? `dsgo-card__badge dsgo-card__badge--floating dsgo-card__badge--${badgeFloatingPosition}` : `dsgo-card__badge dsgo-card__badge--inline dsgo-card__badge--${badgeInlinePosition}`;
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
      className: badgeClass,
      style: badgeStyles,
      children: badgeText
    });
  };

  // Render image
  const renderImage = () => {
    if (!showImage || layoutPreset === 'minimal') {
      return null;
    }

    // Placeholder for background layout
    if (layoutPreset === 'background') {
      if (!imageUrl) {
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "dsgo-card__background dsgo-card__background--placeholder",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "dsgo-card__placeholder-content",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
              className: "dashicons dashicons-format-image"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select background image', 'designsetgo')
            })]
          })
        });
      }
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "dsgo-card__background",
        style: {
          backgroundImage: `url(${imageUrl})`
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "dsgo-card__overlay",
          style: overlayStyles
        })
      });
    }

    // Placeholder for standard layouts
    if (!imageUrl) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "dsgo-card__image-wrapper dsgo-card__image-wrapper--placeholder",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "dsgo-card__placeholder-content",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
            className: "dashicons dashicons-format-image"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select image', 'designsetgo')
          })]
        })
      });
    }
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "dsgo-card__image-wrapper",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("img", {
        src: imageUrl,
        alt: imageAlt,
        className: "dsgo-card__image",
        style: imageStyles
      })
    });
  };

  // Render content
  const renderContent = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: `dsgo-card__content ${layoutPreset === 'background' ? contentAlignmentClass : ''}`,
    children: [badgeStyle === 'inline' && badgeInlinePosition === 'above-title' && renderBadge(), showTitle && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "h3",
      className: "dsgo-card__title",
      value: title,
      onChange: value => setAttributes({
        title: value
      }),
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Card Title…', 'designsetgo')
    }), badgeStyle === 'inline' && badgeInlinePosition === 'below-title' && renderBadge(), showSubtitle && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "p",
      className: "dsgo-card__subtitle",
      value: subtitle,
      onChange: value => setAttributes({
        subtitle: value
      }),
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Card Subtitle…', 'designsetgo')
    }), showBody && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "p",
      className: "dsgo-card__body",
      value: bodyText,
      onChange: value => setAttributes({
        bodyText: value
      }),
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Card description goes here…', 'designsetgo')
    }), showCta && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      ...innerBlocksProps
    })]
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Card Settings', 'designsetgo'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Layout Preset', 'designsetgo'),
          value: layoutPreset,
          options: layoutOptions,
          onChange: value => setAttributes({
            layoutPreset: value
          }),
          __next40pxDefaultSize: true,
          __nextHasNoMarginBottom: true
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Visual Style', 'designsetgo'),
          value: visualStyle,
          options: visualStyleOptions,
          onChange: value => setAttributes({
            visualStyle: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Choose a visual style for the card appearance.', 'designsetgo'),
          __next40pxDefaultSize: true,
          __nextHasNoMarginBottom: true
        }), layoutPreset === 'background' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Overlay Opacity', 'designsetgo'),
            value: overlayOpacity,
            onChange: value => setAttributes({
              overlayOpacity: value
            }),
            min: 0,
            max: 100,
            step: 5,
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Darkens the background image to improve text readability.', 'designsetgo'),
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Content Alignment', 'designsetgo'),
            value: contentAlignment,
            options: alignmentOptions,
            onChange: value => setAttributes({
              contentAlignment: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Horizontal alignment for content over background image.', 'designsetgo'),
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalDivider, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Badge Text', 'designsetgo'),
          value: badgeText,
          onChange: value => setAttributes({
            badgeText: value
          }),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('NEW', 'designsetgo'),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Leave empty to hide the badge.', 'designsetgo'),
          __next40pxDefaultSize: true,
          __nextHasNoMarginBottom: true
        }), badgeText && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Badge Style', 'designsetgo'),
            value: badgeStyle,
            options: badgeStyleOptions,
            onChange: value => setAttributes({
              badgeStyle: value
            }),
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true
          }), badgeStyle === 'floating' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Floating Position', 'designsetgo'),
            value: badgeFloatingPosition,
            options: badgeFloatingPositionOptions,
            onChange: value => setAttributes({
              badgeFloatingPosition: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Position the badge over the card.', 'designsetgo'),
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true
          }), badgeStyle === 'inline' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Inline Position', 'designsetgo'),
            value: badgeInlinePosition,
            options: badgeInlinePositionOptions,
            onChange: value => setAttributes({
              badgeInlinePosition: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Position the badge in the content flow.', 'designsetgo'),
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalDivider, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
          style: {
            marginBottom: '8px',
            fontWeight: 600
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Content Elements', 'designsetgo')
        }), layoutPreset !== 'minimal' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Image', 'designsetgo'),
          checked: showImage,
          onChange: value => setAttributes({
            showImage: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display the card image.', 'designsetgo'),
          __nextHasNoMarginBottom: true
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Title', 'designsetgo'),
          checked: showTitle,
          onChange: value => setAttributes({
            showTitle: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display the card title.', 'designsetgo'),
          __nextHasNoMarginBottom: true
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Subtitle', 'designsetgo'),
          checked: showSubtitle,
          onChange: value => setAttributes({
            showSubtitle: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display the card subtitle.', 'designsetgo'),
          __nextHasNoMarginBottom: true
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Body Text', 'designsetgo'),
          checked: showBody,
          onChange: value => setAttributes({
            showBody: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display the card body text.', 'designsetgo'),
          __nextHasNoMarginBottom: true
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Badge', 'designsetgo'),
          checked: showBadge,
          onChange: value => setAttributes({
            showBadge: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display the badge element.', 'designsetgo'),
          __nextHasNoMarginBottom: true
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show CTA Button', 'designsetgo'),
          checked: showCta,
          onChange: value => setAttributes({
            showCta: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display the call-to-action button.', 'designsetgo'),
          __nextHasNoMarginBottom: true
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      group: "color",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalColorGradientSettingsDropdown, {
        panelId: clientId,
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Border', 'designsetgo'),
        settings: [{
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Border Color', 'designsetgo'),
          colorValue: borderColor,
          onColorChange: color => setAttributes({
            borderColor: color || ''
          }),
          clearable: true
        }],
        ...colorGradientSettings
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalColorGradientSettingsDropdown, {
        panelId: `${clientId}-badge`,
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Badge Colors', 'designsetgo'),
        settings: [{
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Badge Background', 'designsetgo'),
          colorValue: badgeBackgroundColor,
          onColorChange: color => setAttributes({
            badgeBackgroundColor: color || ''
          }),
          clearable: true
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Badge Text', 'designsetgo'),
          colorValue: badgeTextColor,
          onColorChange: color => setAttributes({
            badgeTextColor: color || ''
          }),
          clearable: true
        }],
        ...colorGradientSettings
      }), layoutPreset === 'background' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalColorGradientSettingsDropdown, {
        panelId: `${clientId}-overlay`,
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Overlay Color', 'designsetgo'),
        settings: [{
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Overlay', 'designsetgo'),
          colorValue: overlayColor,
          onColorChange: color => setAttributes({
            overlayColor: color || ''
          }),
          clearable: true
        }],
        ...colorGradientSettings
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      ...blockProps,
      children: [badgeStyle === 'floating' && renderBadge(), layoutPreset === 'background' && renderImage(), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "dsgo-card__inner",
        children: [layoutPreset !== 'background' && renderImage(), renderContent()]
      })]
    })]
  });
}

/***/ }),

/***/ "./src/blocks/card/editor.scss":
/*!*************************************!*\
  !*** ./src/blocks/card/editor.scss ***!
  \*************************************/
/***/ (() => {

// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/card/save.js":
/*!*********************************!*\
  !*** ./src/blocks/card/save.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CardSave)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * WordPress dependencies
 */



/**
 * Validates image URL to prevent XSS attacks
 *
 * @param {string} url - URL to validate
 * @return {boolean} True if URL is safe
 */

const isValidImageUrl = url => {
  if (!url || typeof url !== 'string') return false;
  // Only allow http(s) and data URLs, block javascript: and other protocols
  return /^(https?:\/\/|data:image\/)/.test(url);
};

/**
 * Save component for Card block
 *
 * @param {Object} props - Component props
 * @param {Object} props.attributes - Block attributes
 * @return {Element} Save component
 */
function CardSave({
  attributes
}) {
  const {
    layoutPreset,
    imageUrl,
    imageAlt,
    imageAspectRatio,
    imageCustomAspectRatio,
    imageObjectFit,
    imageFocalPoint,
    badgeText,
    badgeStyle,
    badgeFloatingPosition,
    badgeInlinePosition,
    badgeBackgroundColor,
    badgeTextColor,
    title,
    subtitle,
    bodyText,
    overlayOpacity,
    overlayColor,
    contentAlignment,
    visualStyle,
    borderColor,
    showImage,
    showTitle,
    showSubtitle,
    showBody,
    showBadge,
    showCta
  } = attributes;

  // Build block props with border color
  const blockStyles = {};
  // Only apply custom border color on styles that have borders (not minimal)
  if (borderColor && visualStyle !== 'minimal') {
    blockStyles.borderColor = borderColor;
    // Ensure border exists
    blockStyles.borderWidth = visualStyle === 'outlined' ? '2px' : '1px';
    blockStyles.borderStyle = 'solid';
  }
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
    className: `dsgo-card dsgo-card--${layoutPreset} dsgo-card--style-${visualStyle}`,
    style: blockStyles
  });

  // Inner blocks props for CTA area
  const innerBlocksProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useInnerBlocksProps.save({
    className: 'dsgo-card__cta'
  });

  // Calculate image styles
  const imageStyles = {};
  if (imageAspectRatio !== 'original') {
    if (imageAspectRatio === 'custom' && imageCustomAspectRatio) {
      imageStyles.aspectRatio = imageCustomAspectRatio;
    } else if (imageAspectRatio === '16-9') {
      imageStyles.aspectRatio = '16 / 9';
    } else if (imageAspectRatio === '4-3') {
      imageStyles.aspectRatio = '4 / 3';
    } else if (imageAspectRatio === '1-1') {
      imageStyles.aspectRatio = '1 / 1';
    }
  }
  if (imageObjectFit) {
    imageStyles.objectFit = imageObjectFit;
  }
  if (imageObjectFit === 'cover' && imageFocalPoint) {
    imageStyles.objectPosition = `${imageFocalPoint.x * 100}% ${imageFocalPoint.y * 100}%`;
  }

  // Calculate badge styles
  const badgeStyles = {};
  if (badgeBackgroundColor) {
    badgeStyles.backgroundColor = badgeBackgroundColor;
  }
  if (badgeTextColor) {
    badgeStyles.color = badgeTextColor;
  }

  // Calculate overlay styles for background layout
  const overlayStyles = {};
  if (layoutPreset === 'background') {
    if (overlayColor) {
      overlayStyles.backgroundColor = overlayColor;
      overlayStyles.opacity = overlayOpacity / 100;
    } else {
      // Use theme contrast color at full opacity, let overlayOpacity control transparency
      overlayStyles.backgroundColor = 'var(--wp--preset--color--contrast, #000)';
      overlayStyles.opacity = overlayOpacity / 100;
    }
  }

  // Content alignment class
  const contentAlignmentClass = `dsgo-card__content--${contentAlignment}`;

  // Render badge
  const renderBadge = () => {
    if (!showBadge || !badgeText) return null;
    const badgeClass = badgeStyle === 'floating' ? `dsgo-card__badge dsgo-card__badge--floating dsgo-card__badge--${badgeFloatingPosition}` : `dsgo-card__badge dsgo-card__badge--inline dsgo-card__badge--${badgeInlinePosition}`;
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
      className: badgeClass,
      style: badgeStyles,
      role: "status",
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Badge', 'designsetgo'),
      children: badgeText
    });
  };

  // Render image
  const renderImage = () => {
    if (!showImage || layoutPreset === 'minimal' || !imageUrl || !isValidImageUrl(imageUrl)) {
      return null;
    }
    if (layoutPreset === 'background') {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "dsgo-card__background",
        style: {
          backgroundImage: `url(${imageUrl})`
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "dsgo-card__overlay",
          style: overlayStyles
        })
      });
    }

    // Provide fallback alt text for accessibility
    const altText = imageAlt || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Card image', 'designsetgo');
    const imageProps = {
      src: imageUrl,
      alt: altText,
      className: 'dsgo-card__image',
      style: imageStyles
    };

    // Hide decorative images from screen readers
    if (!imageAlt) {
      imageProps['aria-hidden'] = 'true';
    }
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "dsgo-card__image-wrapper",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("img", {
        ...imageProps
      })
    });
  };

  // Render content
  const renderContent = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: `dsgo-card__content ${layoutPreset === 'background' ? contentAlignmentClass : ''}`,
    children: [badgeStyle === 'inline' && badgeInlinePosition === 'above-title' && renderBadge(), showTitle && title && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
      tagName: "h3",
      className: "dsgo-card__title",
      value: title
    }), badgeStyle === 'inline' && badgeInlinePosition === 'below-title' && renderBadge(), showSubtitle && subtitle && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
      tagName: "p",
      className: "dsgo-card__subtitle",
      value: subtitle
    }), showBody && bodyText && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
      tagName: "p",
      className: "dsgo-card__body",
      value: bodyText
    }), showCta && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      ...innerBlocksProps
    })]
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    ...blockProps,
    children: [badgeStyle === 'floating' && renderBadge(), layoutPreset === 'background' && renderImage(), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "dsgo-card__inner",
      children: [layoutPreset !== 'background' && renderImage(), renderContent()]
    })]
  });
}

/***/ }),

/***/ "./src/blocks/card/style.scss":
/*!************************************!*\
  !*** ./src/blocks/card/style.scss ***!
  \************************************/
/***/ (() => {

// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/shared/constants.js":
/*!****************************************!*\
  !*** ./src/blocks/shared/constants.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ICON_COLOR: () => (/* binding */ ICON_COLOR)
/* harmony export */ });
/**
 * Shared Constants for DesignSetGo Blocks
 *
 * @package
 * @since 1.0.0
 */

/**
 * Brand Color - Consistent across all block icons
 * Using a professional blue that works well in both light and dark themes
 */
const ICON_COLOR = '#2563eb';

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************************!*\
  !*** ./src/blocks/card/index.js ***!
  \**********************************/
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/card/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./save */ "./src/blocks/card/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./block.json */ "./src/blocks/card/block.json");
/* harmony import */ var _shared_constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shared/constants */ "./src/blocks/shared/constants.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/card/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./editor.scss */ "./src/blocks/card/editor.scss");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);
/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */







/**
 * Register: Card Block
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/
 */

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_3__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_3__,
  icon: {
    src: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("svg", {
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("rect", {
        x: "3",
        y: "4",
        width: "18",
        height: "16",
        rx: "2",
        stroke: "currentColor",
        strokeWidth: "1.5"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("rect", {
        x: "6",
        y: "7",
        width: "5",
        height: "4",
        rx: "1",
        fill: "currentColor"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("rect", {
        x: "6",
        y: "13",
        width: "12",
        height: "1.5",
        rx: "0.75",
        fill: "currentColor"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("rect", {
        x: "6",
        y: "16",
        width: "8",
        height: "1.5",
        rx: "0.75",
        fill: "currentColor"
      })]
    }),
    foreground: _shared_constants__WEBPACK_IMPORTED_MODULE_4__.ICON_COLOR
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_2__["default"]
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map