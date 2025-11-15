/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (arg) {
				classes = appendClass(classes, parseValue(arg));
			}
		}

		return classes;
	}

	function parseValue (arg) {
		if (typeof arg === 'string' || typeof arg === 'number') {
			return arg;
		}

		if (typeof arg !== 'object') {
			return '';
		}

		if (Array.isArray(arg)) {
			return classNames.apply(null, arg);
		}

		if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
			return arg.toString();
		}

		var classes = '';

		for (var key in arg) {
			if (hasOwn.call(arg, key) && arg[key]) {
				classes = appendClass(classes, key);
			}
		}

		return classes;
	}

	function appendClass (value, newClass) {
		if (!newClass) {
			return value;
		}
	
		if (value) {
			return value + ' ' + newClass;
		}
	
		return value + newClass;
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else // removed by dead control flow
{}
}());


/***/ }),

/***/ "./src/blocks/map/block.json":
/*!***********************************!*\
  !*** ./src/blocks/map/block.json ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"designsetgo/map","version":"1.0.0","title":"Map","category":"widgets","description":"Display an interactive map using OpenStreetMap or Google Maps.","keywords":["map","location","address","openstreetmap","google maps","directions"],"textdomain":"designsetgo","attributes":{"dsgoProvider":{"type":"string","default":"openstreetmap","enum":["openstreetmap","googlemaps"]},"dsgoLatitude":{"type":"number","default":40.7128},"dsgoLongitude":{"type":"number","default":-74.006},"dsgoZoom":{"type":"number","default":13},"dsgoAddress":{"type":"string","default":""},"dsgoMarkerIcon":{"type":"string","default":"📍"},"dsgoMarkerColor":{"type":"string","default":"#e74c3c"},"dsgoHeight":{"type":"string","default":"400px"},"dsgoAspectRatio":{"type":"string","default":"custom","enum":["16:9","4:3","1:1","custom"]},"dsgoPrivacyMode":{"type":"boolean","default":false},"dsgoPrivacyNotice":{"type":"string","default":"This map will load content from external services. Click to load and view the map."},"dsgoMapStyle":{"type":"string","default":"standard"}},"supports":{"anchor":true,"align":["wide","full"],"html":false,"spacing":{"margin":true,"padding":true,"blockGap":false,"__experimentalDefaultControls":{"padding":false,"margin":false}},"color":{"background":true,"text":false,"link":false,"__experimentalDefaultControls":{"background":false}},"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true,"__experimentalDefaultControls":{"radius":true}}},"example":{"attributes":{"dsgoLatitude":40.7128,"dsgoLongitude":-74.006,"dsgoZoom":13,"dsgoAddress":"New York, NY"}},"editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./index.css","viewScript":"file:./view.js"}');

/***/ }),

/***/ "./src/blocks/map/components/inspector/MapSettingsPanel.js":
/*!*****************************************************************!*\
  !*** ./src/blocks/map/components/inspector/MapSettingsPanel.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MapSettingsPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_geocoding__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/geocoding */ "./src/blocks/map/utils/geocoding.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * Map Settings Panel Component
 *
 * Consolidated inspector panel for all map settings.
 */






function MapSettingsPanel({
  attributes,
  setAttributes
}) {
  const {
    dsgoProvider,
    dsgoLatitude,
    dsgoLongitude,
    dsgoZoom,
    dsgoAddress,
    dsgoMarkerIcon,
    dsgoHeight,
    dsgoAspectRatio,
    dsgoMapStyle,
    dsgoPrivacyMode,
    dsgoPrivacyNotice
  } = attributes;
  const [isSearching, setIsSearching] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [searchError, setSearchError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('');

  /**
   * Handle address search and geocoding.
   * Debounced to respect Nominatim API rate limiting (1 req/sec).
   */
  const handleAddressSearch = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(async () => {
    if (!dsgoAddress || dsgoAddress.trim() === '') {
      setSearchError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Please enter an address to search.', 'designsetgo'));
      return;
    }
    setIsSearching(true);
    setSearchError('');
    try {
      const result = await (0,_utils_geocoding__WEBPACK_IMPORTED_MODULE_3__.geocodeAddress)(dsgoAddress);
      if (result) {
        setAttributes({
          dsgoLatitude: result.lat,
          dsgoLongitude: result.lng,
          dsgoAddress: result.display_name
        });
      } else {
        setSearchError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Address not found. Please try a different search.', 'designsetgo'));
      }
    } catch (error) {
      setSearchError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Failed to search address. Please try again.', 'designsetgo'));
    } finally {
      setIsSearching(false);
    }
  }, [dsgoAddress, setAttributes]);

  // Note: Debouncing removed for now - can be added back if needed for rate limiting
  // const debouncedSearch = useMemo(
  // 	() => debounce(handleAddressSearch, 1000),
  // 	[handleAddressSearch]
  // );

  /**
   * Handle Enter key in address field.
   *
   * @param {KeyboardEvent} event - Keyboard event.
   */
  const handleAddressKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddressSearch();
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Map Settings', 'designsetgo'),
    initialOpen: true,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Map Provider', 'designsetgo'),
      value: dsgoProvider,
      options: [{
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('OpenStreetMap (No API key required)', 'designsetgo'),
        value: 'openstreetmap'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Google Maps (Requires API key)', 'designsetgo'),
        value: 'googlemaps'
      }],
      onChange: value => setAttributes({
        dsgoProvider: value
      }),
      help: dsgoProvider === 'openstreetmap' ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Privacy-friendly and free to use.', 'designsetgo') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Requires a Google Maps API key.', 'designsetgo'),
      __next40pxDefaultSize: true,
      __nextHasNoMarginBottom: true
    }), dsgoProvider === 'googlemaps' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
      children: window.dsgoIntegrations?.googleMapsApiKey ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
        status: "success",
        isDismissible: false,
        style: {
          marginTop: '12px'
        },
        children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('✓ Google Maps API key configured in', 'designsetgo'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("a", {
          href: "/wp-admin/admin.php?page=designsetgo-settings",
          target: "_blank",
          rel: "noopener noreferrer",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Settings', 'designsetgo')
        }), "."]
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
        status: "warning",
        isDismissible: false,
        style: {
          marginTop: '12px'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("strong", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('⚠ No API key configured.', 'designsetgo')
        }), ' ', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add a Google Maps API key in', 'designsetgo'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("a", {
          href: "/wp-admin/admin.php?page=designsetgo-settings",
          target: "_blank",
          rel: "noopener noreferrer",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Settings', 'designsetgo')
        }), ' ', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('to use Google Maps.', 'designsetgo'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("br", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("small", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("strong", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Security:', 'designsetgo')
          }), ' ', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Configure HTTP referrer restrictions in Google Cloud Console.', 'designsetgo')]
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      style: {
        marginTop: '24px'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
        style: {
          fontSize: '13px',
          fontWeight: '500',
          marginBottom: '12px'
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Location', 'designsetgo')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Search Address', 'designsetgo'),
        value: dsgoAddress,
        onChange: value => {
          setAttributes({
            dsgoAddress: value
          });
          setSearchError('');
        },
        onKeyPress: handleAddressKeyPress,
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enter an address or location', 'designsetgo'),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Search for a location to automatically set coordinates.', 'designsetgo'),
        __next40pxDefaultSize: true,
        __nextHasNoMarginBottom: true
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        variant: "secondary",
        onClick: handleAddressSearch,
        isBusy: isSearching,
        disabled: !dsgoAddress || isSearching,
        style: {
          marginTop: '8px'
        },
        children: isSearching ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Searching…', 'designsetgo') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Search Address', 'designsetgo')
      }), searchError && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
        status: "error",
        isDismissible: false,
        style: {
          marginTop: '12px'
        },
        children: searchError
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        style: {
          marginTop: '16px'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Latitude', 'designsetgo'),
          type: "number",
          value: dsgoLatitude,
          onChange: value => {
            const num = parseFloat(value);
            const clamped = Number.isFinite(num) ? Math.max(-90, Math.min(90, num)) : 0;
            setAttributes({
              dsgoLatitude: clamped
            });
          },
          step: "0.000001",
          min: "-90",
          max: "90",
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Manual coordinate entry (between -90 and 90).', 'designsetgo'),
          __next40pxDefaultSize: true,
          __nextHasNoMarginBottom: true
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Longitude', 'designsetgo'),
          type: "number",
          value: dsgoLongitude,
          onChange: value => {
            const num = parseFloat(value);
            const clamped = Number.isFinite(num) ? Math.max(-180, Math.min(180, num)) : 0;
            setAttributes({
              dsgoLongitude: clamped
            });
          },
          step: "0.000001",
          min: "-180",
          max: "180",
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Manual coordinate entry (between -180 and 180).', 'designsetgo'),
          __next40pxDefaultSize: true,
          __nextHasNoMarginBottom: true
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Zoom Level', 'designsetgo'),
        value: dsgoZoom,
        onChange: value => setAttributes({
          dsgoZoom: value
        }),
        min: 1,
        max: 20,
        step: 1,
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('1 = world view, 20 = street level.', 'designsetgo'),
        __next40pxDefaultSize: true,
        __nextHasNoMarginBottom: true
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      style: {
        marginTop: '24px'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
        style: {
          fontSize: '13px',
          fontWeight: '500',
          marginBottom: '12px'
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Marker', 'designsetgo')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Marker Icon', 'designsetgo'),
        value: dsgoMarkerIcon,
        onChange: value => setAttributes({
          dsgoMarkerIcon: value || '📍'
        }),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enter an emoji or icon character.', 'designsetgo'),
        __next40pxDefaultSize: true,
        __nextHasNoMarginBottom: true
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      style: {
        marginTop: '24px'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
        style: {
          fontSize: '13px',
          fontWeight: '500',
          marginBottom: '12px'
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Appearance', 'designsetgo')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Aspect Ratio', 'designsetgo'),
        value: dsgoAspectRatio,
        options: [{
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('16:9 (Widescreen)', 'designsetgo'),
          value: '16:9'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('4:3 (Standard)', 'designsetgo'),
          value: '4:3'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('1:1 (Square)', 'designsetgo'),
          value: '1:1'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Custom Height', 'designsetgo'),
          value: 'custom'
        }],
        onChange: value => setAttributes({
          dsgoAspectRatio: value
        }),
        help: dsgoAspectRatio === 'custom' ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set a custom height below.', 'designsetgo') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Maintains aspect ratio across screen sizes.', 'designsetgo'),
        __next40pxDefaultSize: true,
        __nextHasNoMarginBottom: true
      }), dsgoAspectRatio === 'custom' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalUnitControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Map Height', 'designsetgo'),
        value: dsgoHeight,
        onChange: value => setAttributes({
          dsgoHeight: value || '400px'
        }),
        units: [{
          value: 'px',
          label: 'px'
        }, {
          value: '%',
          label: '%'
        }, {
          value: 'vh',
          label: 'vh'
        }],
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set a custom height for the map.', 'designsetgo'),
        __next40pxDefaultSize: true,
        __nextHasNoMarginBottom: true
      }), dsgoProvider === 'googlemaps' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Map Style', 'designsetgo'),
        value: dsgoMapStyle,
        options: [{
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Standard', 'designsetgo'),
          value: 'standard'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Silver (Minimalist)', 'designsetgo'),
          value: 'silver'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Dark Mode', 'designsetgo'),
          value: 'dark'
        }],
        onChange: value => setAttributes({
          dsgoMapStyle: value
        }),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Choose a visual style for Google Maps.', 'designsetgo'),
        __next40pxDefaultSize: true,
        __nextHasNoMarginBottom: true
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      style: {
        marginTop: '24px'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
        style: {
          fontSize: '13px',
          fontWeight: '500',
          marginBottom: '12px'
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Privacy', 'designsetgo')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enable Privacy Mode', 'designsetgo'),
        checked: dsgoPrivacyMode,
        onChange: value => setAttributes({
          dsgoPrivacyMode: value
        }),
        help: dsgoPrivacyMode ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Map will not load until user clicks to consent.', 'designsetgo') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Map will load automatically when page loads.', 'designsetgo'),
        __nextHasNoMarginBottom: true
      }), dsgoPrivacyMode && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextareaControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Privacy Notice', 'designsetgo'),
          value: dsgoPrivacyNotice,
          onChange: value => setAttributes({
            dsgoPrivacyNotice: value
          }),
          rows: 4,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Message shown to users before loading the map.', 'designsetgo'),
          __nextHasNoMarginBottom: true
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          style: {
            marginTop: '12px',
            fontSize: '12px',
            color: '#757575'
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Privacy mode is GDPR-compliant. External map services will only load after user consent.', 'designsetgo')
        })]
      })]
    })]
  });
}

/***/ }),

/***/ "./src/blocks/map/deprecated.js":
/*!**************************************!*\
  !*** ./src/blocks/map/deprecated.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * Map Block - Deprecated Versions
 *
 * Handles backward compatibility when block attributes or save format changes.
 */





/**
 * Version 1: Original version with marker attributes
 * Deprecated when markers were removed from the block
 */

const v1 = {
  attributes: {
    dsgoProvider: {
      type: 'string',
      default: 'openstreetmap'
    },
    dsgoLatitude: {
      type: 'number',
      default: 40.7128
    },
    dsgoLongitude: {
      type: 'number',
      default: -74.006
    },
    dsgoZoom: {
      type: 'number',
      default: 13
    },
    dsgoAddress: {
      type: 'string',
      default: ''
    },
    dsgoMarkerIcon: {
      type: 'string',
      default: '📍'
    },
    dsgoMarkerColor: {
      type: 'string',
      default: '#e74c3c'
    },
    dsgoMarkerPopup: {
      type: 'string',
      default: ''
    },
    dsgoHeight: {
      type: 'string',
      default: '400px'
    },
    dsgoAspectRatio: {
      type: 'string',
      default: 'custom'
    },
    dsgoGrayscale: {
      type: 'boolean',
      default: false
    },
    dsgoPrivacyMode: {
      type: 'boolean',
      default: false
    },
    dsgoPrivacyNotice: {
      type: 'string',
      default: 'This map will load content from external services. Click to load and view the map.'
    },
    dsgoMapStyle: {
      type: 'string',
      default: 'standard'
    }
  },
  save({
    attributes
  }) {
    const {
      dsgoProvider,
      dsgoLatitude,
      dsgoLongitude,
      dsgoZoom,
      dsgoAddress,
      dsgoMarkerIcon,
      dsgoMarkerColor,
      dsgoMarkerPopup,
      dsgoHeight,
      dsgoAspectRatio,
      dsgoGrayscale,
      dsgoPrivacyMode,
      dsgoPrivacyNotice,
      dsgoMapStyle
    } = attributes;

    // Ensure coordinates are within valid ranges (security)
    const safeLat = Math.max(-90, Math.min(90, dsgoLatitude || 0));
    const safeLng = Math.max(-180, Math.min(180, dsgoLongitude || 0));
    const safeZoom = Math.max(1, Math.min(20, dsgoZoom || 13));

    // Block classes
    const blockClasses = classnames__WEBPACK_IMPORTED_MODULE_2___default()('dsgo-map', {
      'dsgo-map--grayscale': dsgoGrayscale,
      'dsgo-map--privacy-mode': dsgoPrivacyMode,
      [`dsgo-map--aspect-${dsgoAspectRatio.replace(':', '-')}`]: dsgoAspectRatio !== 'custom'
    });

    // Custom styles
    const blockStyles = {};
    if (dsgoAspectRatio === 'custom') {
      blockStyles.height = dsgoHeight;
    }

    // Data attributes for view.js
    const dataAttributes = {
      'data-dsgo-provider': dsgoProvider,
      'data-dsgo-lat': safeLat,
      'data-dsgo-lng': safeLng,
      'data-dsgo-zoom': safeZoom,
      'data-dsgo-address': dsgoAddress || '',
      'data-dsgo-marker-icon': dsgoMarkerIcon || '📍',
      'data-dsgo-marker-color': dsgoMarkerColor || '#e74c3c',
      'data-dsgo-marker-popup': dsgoMarkerPopup || '',
      'data-dsgo-grayscale': dsgoGrayscale,
      'data-dsgo-privacy-mode': dsgoPrivacyMode,
      'data-dsgo-map-style': dsgoMapStyle || 'standard'
    };
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
      className: blockClasses,
      style: blockStyles,
      ...dataAttributes
    });

    // Compute aria-label for map container
    /* translators: %s: The address being shown on the map */
    const mapAriaLabel = dsgoAddress ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Map showing %s', 'designsetgo'), dsgoAddress) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Interactive map', 'designsetgo');

    // Render privacy overlay or map container
    if (dsgoPrivacyMode) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        ...blockProps,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "dsgo-map__privacy-overlay",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("svg", {
            className: "dsgo-map__privacy-icon",
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            "aria-hidden": "true",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("path", {
              d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("circle", {
              cx: "12",
              cy: "10",
              r: "3"
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
            className: "dsgo-map__privacy-text",
            children: dsgoPrivacyNotice || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Click to load map', 'designsetgo')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
            className: "dsgo-map__load-button",
            type: "button",
            "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Load map. This will connect to external map services.', 'designsetgo'),
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Load Map', 'designsetgo')
          })]
        })
      });
    }
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      ...blockProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "dsgo-map__container",
        role: "region",
        "aria-label": mapAriaLabel
      })
    });
  },
  migrate(attributes) {
    // Remove deprecated attributes (popup message and grayscale)
    const {
      dsgoMarkerPopup,
      dsgoGrayscale,
      ...newAttributes
    } = attributes;
    return newAttributes;
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([v1]);

/***/ }),

/***/ "./src/blocks/map/edit.js":
/*!********************************!*\
  !*** ./src/blocks/map/edit.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_inspector_MapSettingsPanel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/inspector/MapSettingsPanel */ "./src/blocks/map/components/inspector/MapSettingsPanel.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * Map Block - Editor Component
 *
 * Renders the map block in the WordPress editor with inspector controls.
 */





// Inspector Panel


/**
 * Edit component for Map block.
 *
 * @param {Object}   props               - Component props.
 * @param {Object}   props.attributes    - Block attributes.
 * @param {Function} props.setAttributes - Function to update attributes.
 * @param {string}   props.clientId      - Block client ID.
 * @return {JSX.Element} Editor component.
 */

function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  const {
    dsgoProvider,
    dsgoLatitude,
    dsgoLongitude,
    dsgoZoom,
    dsgoMarkerColor,
    dsgoAspectRatio,
    dsgoHeight,
    dsgoPrivacyMode,
    dsgoPrivacyNotice
  } = attributes;
  const colorGradientSettings = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalUseMultipleOriginColorsAndGradients)();

  // Compute block classes
  const blockClasses = classnames__WEBPACK_IMPORTED_MODULE_2___default()('dsgo-map', {
    'dsgo-map--privacy-mode': dsgoPrivacyMode,
    [`dsgo-map--aspect-${dsgoAspectRatio.replace(':', '-')}`]: dsgoAspectRatio !== 'custom'
  });

  // Custom styles for the map container
  const mapStyles = {};

  // Apply aspect ratio or custom height
  if (dsgoAspectRatio !== 'custom') {
    // Aspect ratio will be handled by CSS
  } else {
    mapStyles.height = dsgoHeight;
  }
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: blockClasses,
    style: mapStyles
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components_inspector_MapSettingsPanel__WEBPACK_IMPORTED_MODULE_3__["default"], {
        attributes: attributes,
        setAttributes: setAttributes
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      group: "color",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalColorGradientSettingsDropdown, {
        panelId: clientId,
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Marker Color', 'designsetgo'),
        settings: [{
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Marker Color', 'designsetgo'),
          colorValue: dsgoMarkerColor,
          onColorChange: color => setAttributes({
            dsgoMarkerColor: color || '#e74c3c'
          }),
          clearable: true
        }],
        ...colorGradientSettings
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      ...blockProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "dsgo-map__editor-preview",
        children: dsgoPrivacyMode ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "dsgo-map__privacy-overlay",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "dsgo-map__privacy-content",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("svg", {
              className: "dsgo-map__privacy-icon",
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("path", {
                d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("circle", {
                cx: "12",
                cy: "10",
                r: "3"
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              className: "dsgo-map__privacy-text",
              children: dsgoPrivacyNotice || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Click to load map', 'designsetgo')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
              className: "dsgo-map__load-button",
              type: "button",
              onClick: e => e.preventDefault(),
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Load Map', 'designsetgo')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              className: "dsgo-map__preview-note",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Preview: Privacy mode is enabled', 'designsetgo')
            })]
          })
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "dsgo-map__preview-placeholder",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "dsgo-map__preview-info",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("svg", {
              className: "dsgo-map__preview-icon",
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("path", {
                d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("circle", {
                cx: "12",
                cy: "10",
                r: "3"
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
              className: "dsgo-map__preview-details",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("strong", {
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Map Preview', 'designsetgo')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
                className: "dsgo-map__preview-coords",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("code", {
                  children: [dsgoLatitude.toFixed(6), ",", ' ', dsgoLongitude.toFixed(6)]
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                className: "dsgo-map__preview-meta",
                children: [dsgoProvider === 'openstreetmap' ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('OpenStreetMap', 'designsetgo') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Google Maps', 'designsetgo'), ' ', "\u2022 ", (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Zoom:', 'designsetgo'), ' ', dsgoZoom]
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "dsgo-map__preview-note",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Interactive map will display on the frontend', 'designsetgo')
          })]
        })
      })
    })]
  });
}

/***/ }),

/***/ "./src/blocks/map/editor.scss":
/*!************************************!*\
  !*** ./src/blocks/map/editor.scss ***!
  \************************************/
/***/ (() => {

"use strict";
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/map/save.js":
/*!********************************!*\
  !*** ./src/blocks/map/save.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Save)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * Map Block - Save Component
 *
 * Renders the static HTML output for the frontend.
 */





/**
 * Save component for Map block.
 *
 * @param {Object} props            - Component props.
 * @param {Object} props.attributes - Block attributes.
 * @return {JSX.Element} Saved HTML.
 */

function Save({
  attributes
}) {
  const {
    dsgoProvider,
    dsgoLatitude,
    dsgoLongitude,
    dsgoZoom,
    dsgoAddress,
    dsgoMarkerIcon,
    dsgoMarkerColor,
    dsgoHeight,
    dsgoAspectRatio,
    dsgoPrivacyMode,
    dsgoPrivacyNotice,
    dsgoMapStyle
  } = attributes;

  // Compute block classes (must match edit.js)
  const blockClasses = classnames__WEBPACK_IMPORTED_MODULE_2___default()('dsgo-map', {
    'dsgo-map--privacy-mode': dsgoPrivacyMode,
    [`dsgo-map--aspect-${dsgoAspectRatio.replace(':', '-')}`]: dsgoAspectRatio !== 'custom'
  });

  // Custom styles
  const mapStyles = {};
  if (dsgoAspectRatio === 'custom') {
    mapStyles.height = dsgoHeight;
  }

  // Ensure coordinates are within valid ranges (security)
  const safeLat = Math.max(-90, Math.min(90, dsgoLatitude || 0));
  const safeLng = Math.max(-180, Math.min(180, dsgoLongitude || 0));
  const safeZoom = Math.max(1, Math.min(20, dsgoZoom || 13));

  // Build data attributes for view.js
  // Note: Google Maps API key is injected via PHP render_block filter for security
  const dataAttributes = {
    'data-dsgo-provider': dsgoProvider,
    'data-dsgo-lat': safeLat,
    'data-dsgo-lng': safeLng,
    'data-dsgo-zoom': safeZoom,
    'data-dsgo-address': dsgoAddress || '',
    'data-dsgo-marker-icon': dsgoMarkerIcon || '📍',
    'data-dsgo-marker-color': dsgoMarkerColor || '#e74c3c',
    'data-dsgo-privacy-mode': dsgoPrivacyMode ? 'true' : 'false',
    'data-dsgo-map-style': dsgoMapStyle
  };
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
    className: blockClasses,
    style: mapStyles,
    ...dataAttributes
  });

  // Compute aria-label for map container
  /* translators: %s: The address being shown on the map */
  const mapAriaLabel = dsgoAddress ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Map showing %s', 'designsetgo'), dsgoAddress) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Interactive map', 'designsetgo');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    ...blockProps,
    children: dsgoPrivacyMode ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "dsgo-map__privacy-overlay",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "dsgo-map__privacy-content",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("svg", {
          className: "dsgo-map__privacy-icon",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          "aria-hidden": "true",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("path", {
            d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("circle", {
            cx: "12",
            cy: "10",
            r: "3"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
          className: "dsgo-map__privacy-text",
          children: dsgoPrivacyNotice || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Click to load map', 'designsetgo')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
          className: "dsgo-map__load-button",
          type: "button",
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Load map. This will connect to external map services.', 'designsetgo'),
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Load Map', 'designsetgo')
        })]
      })
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "dsgo-map__container",
      role: "region",
      "aria-label": mapAriaLabel
    })
  });
}

/***/ }),

/***/ "./src/blocks/map/style.scss":
/*!***********************************!*\
  !*** ./src/blocks/map/style.scss ***!
  \***********************************/
/***/ (() => {

"use strict";
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/map/utils/geocoding.js":
/*!*******************************************!*\
  !*** ./src/blocks/map/utils/geocoding.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   geocodeAddress: () => (/* binding */ geocodeAddress)
/* harmony export */ });
/* unused harmony exports reverseGeocode, isValidLatitude, isValidLongitude, isValidZoom */
/**
 * Geocoding Utilities
 *
 * Functions for converting addresses to coordinates using Nominatim API (OpenStreetMap).
 */

/**
 * Geocode an address to latitude/longitude using Nominatim API.
 *
 * @param {string} address - The address to geocode.
 * @return {Promise<Object|null>} Object with lat, lng, and display_name, or null if failed.
 */
async function geocodeAddress(address) {
  if (!address || address.trim() === '') {
    return null;
  }
  try {
    const encodedAddress = encodeURIComponent(address.trim());
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'DesignSetGo WordPress Plugin'
      }
    });
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }
    const data = await response.json();
    if (data && data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        display_name: result.display_name
      };
    }
    return null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to an address using Nominatim API.
 *
 * @param {number} lat - Latitude.
 * @param {number} lng - Longitude.
 * @return {Promise<string|null>} Address string or null if failed.
 */
async function reverseGeocode(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return null;
  }
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'DesignSetGo WordPress Plugin'
      }
    });
    if (!response.ok) {
      throw new Error('Reverse geocoding request failed');
    }
    const data = await response.json();
    if (data && data.display_name) {
      return data.display_name;
    }
    return null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

/**
 * Validate latitude value.
 *
 * @param {number} lat - Latitude to validate.
 * @return {boolean} True if valid.
 */
function isValidLatitude(lat) {
  return typeof lat === 'number' && lat >= -90 && lat <= 90;
}

/**
 * Validate longitude value.
 *
 * @param {number} lng - Longitude to validate.
 * @return {boolean} True if valid.
 */
function isValidLongitude(lng) {
  return typeof lng === 'number' && lng >= -180 && lng <= 180;
}

/**
 * Validate zoom level.
 *
 * @param {number} zoom - Zoom level to validate.
 * @return {boolean} True if valid.
 */
function isValidZoom(zoom) {
  return typeof zoom === 'number' && zoom >= 1 && zoom <= 20;
}

/***/ }),

/***/ "./src/blocks/shared/constants.js":
/*!****************************************!*\
  !*** ./src/blocks/shared/constants.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

"use strict";
module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
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
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!*********************************!*\
  !*** ./src/blocks/map/index.js ***!
  \*********************************/
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/map/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./save */ "./src/blocks/map/save.js");
/* harmony import */ var _deprecated__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./deprecated */ "./src/blocks/map/deprecated.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/blocks/map/block.json");
/* harmony import */ var _shared_constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../shared/constants */ "./src/blocks/shared/constants.js");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./editor.scss */ "./src/blocks/map/editor.scss");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/map/style.scss");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);
/**
 * Map Block
 *
 * Displays an interactive map with custom markers using OpenStreetMap or Google Maps.
 */








// Import styles



/**
 * Register the Map block.
 */

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_4__,
  icon: {
    src: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("path", {
        d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("circle", {
        cx: "12",
        cy: "10",
        r: "3"
      })]
    }),
    foreground: _shared_constants__WEBPACK_IMPORTED_MODULE_5__.ICON_COLOR
  },
  deprecated: _deprecated__WEBPACK_IMPORTED_MODULE_3__["default"],
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_2__["default"]
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map