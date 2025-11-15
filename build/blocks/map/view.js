/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/blocks/map/handlers/DSGMap.js":
/*!*******************************************!*\
  !*** ./src/blocks/map/handlers/DSGMap.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DSGMap)
/* harmony export */ });
/* harmony import */ var _openstreetmap_handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./openstreetmap-handler */ "./src/blocks/map/handlers/openstreetmap-handler.js");
/* harmony import */ var _googlemaps_handler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./googlemaps-handler */ "./src/blocks/map/handlers/googlemaps-handler.js");
/**
 * DSGMap Class - Main map instance manager.
 *
 * Manages individual map instances, configuration parsing, privacy mode, and initialization.
 */




/**
 * DSGMap Class - Manages individual map instances.
 */
class DSGMap {
  /**
   * Constructor.
   *
   * @param {HTMLElement} element - Map block element.
   */
  constructor(element) {
    this.element = element;
    this.config = this.parseConfig();
    this.mapInstance = null;
    this.loadMapBound = this.loadMap.bind(this);
    if (this.config.privacyMode) {
      this.setupPrivacyMode();
    } else {
      this.loadMap();
    }
  }

  /**
   * Parse configuration from data attributes with validation.
   *
   * @return {Object} Parsed and validated configuration.
   */
  parseConfig() {
    const dataset = this.element.dataset;

    // Parse and validate coordinates
    const lat = parseFloat(dataset.dsgoLat);
    const lng = parseFloat(dataset.dsgoLng);
    const zoom = parseInt(dataset.dsgoZoom);
    return {
      provider: dataset.dsgoProvider || 'openstreetmap',
      // Clamp latitude between -90 and 90
      lat: Number.isFinite(lat) ? Math.max(-90, Math.min(90, lat)) : 0,
      // Clamp longitude between -180 and 180
      lng: Number.isFinite(lng) ? Math.max(-180, Math.min(180, lng)) : 0,
      // Clamp zoom between 1 and 20
      zoom: Number.isInteger(zoom) && zoom >= 1 && zoom <= 20 ? zoom : 13,
      address: dataset.dsgoAddress || '',
      markerIcon: dataset.dsgoMarkerIcon || '📍',
      markerColor: dataset.dsgoMarkerColor || '#e74c3c',
      markerPopup: dataset.dsgoMarkerPopup || '',
      grayscale: dataset.dsgoGrayscale === 'true',
      privacyMode: dataset.dsgoPrivacyMode === 'true',
      apiKey: dataset.dsgoApiKey || '',
      mapStyle: dataset.dsgoMapStyle || 'standard'
    };
  }

  /**
   * Setup privacy mode (click-to-load).
   */
  setupPrivacyMode() {
    const button = this.element.querySelector('.dsgo-map__load-button');
    if (!button) {
      return;
    }
    button.addEventListener('click', this.loadMapBound);
  }

  /**
   * Load and initialize the map.
   */
  async loadMap() {
    try {
      if (this.config.provider === 'googlemaps') {
        await (0,_googlemaps_handler__WEBPACK_IMPORTED_MODULE_1__.initGoogleMap)(this);
      } else {
        await (0,_openstreetmap_handler__WEBPACK_IMPORTED_MODULE_0__.initOpenStreetMap)(this);
      }

      // Hide privacy overlay if present
      const overlay = this.element.querySelector('.dsgo-map__privacy-overlay');
      if (overlay) {
        overlay.style.display = 'none';
      }

      // Focus management for accessibility
      const container = this.element.querySelector('.dsgo-map__container');
      if (container && this.config.privacyMode) {
        // Make container focusable and move focus to it
        container.setAttribute('tabindex', '-1');
        container.focus();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load map:', error);
      this.showError('Failed to load map. Please check your settings.');
    }
  }

  /**
   * Show error message.
   *
   * @param {string} message - Error message to display.
   */
  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'dsgo-map__error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
			padding: 20px;
			text-align: center;
			color: #d63638;
			background: #fef7f7;
			border: 1px solid #f0c0c0;
			border-radius: 4px;
		`;

    // Hide privacy overlay if present
    const overlay = this.element.querySelector('.dsgo-map__privacy-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
    this.element.appendChild(errorDiv);
  }

  /**
   * Cleanup and destroy the map instance.
   * Removes event listeners and frees memory.
   */
  destroy() {
    // Remove privacy mode event listener
    if (this.config.privacyMode) {
      const button = this.element.querySelector('.dsgo-map__load-button');
      if (button) {
        button.removeEventListener('click', this.loadMapBound);
      }
    }

    // Clean up map instance
    if (this.mapInstance) {
      try {
        // Leaflet cleanup (OpenStreetMap)
        if (this.config.provider === 'openstreetmap' && this.mapInstance.remove) {
          this.mapInstance.remove();
        }
        // Google Maps cleanup
        else if (this.config.provider === 'googlemaps' && window.google?.maps) {
          // Google Maps doesn't have a destroy method, just null the reference
          // The garbage collector will handle cleanup
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error cleaning up map:', error);
      }
      this.mapInstance = null;
    }

    // Clear element reference
    this.element = null;
  }
}

/***/ }),

/***/ "./src/blocks/map/handlers/googlemaps-handler.js":
/*!*******************************************************!*\
  !*** ./src/blocks/map/handlers/googlemaps-handler.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initGoogleMap: () => (/* binding */ initGoogleMap)
/* harmony export */ });
/* unused harmony export GOOGLE_MAP_STYLES */
/* harmony import */ var _utils_script_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/script-loader */ "./src/blocks/map/utils/script-loader.js");
/**
 * Google Maps Handler
 *
 * Handles Google Maps initialization and styling.
 */



/**
 * Google Maps style configurations.
 * Complete styles that properly show roads, water, and terrain.
 */
const GOOGLE_MAP_STYLES = {
  silver: [{
    elementType: 'geometry',
    stylers: [{
      color: '#f5f5f5'
    }]
  }, {
    elementType: 'labels.icon',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#616161'
    }]
  }, {
    elementType: 'labels.text.stroke',
    stylers: [{
      color: '#f5f5f5'
    }]
  }, {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{
      color: '#ffffff'
    }]
  }, {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#d6d6d6'
    }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{
      color: '#dadada'
    }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#b3b3b3'
    }]
  }, {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{
      color: '#c9c9c9'
    }]
  }, {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#9e9e9e'
    }]
  }, {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{
      color: '#eeeeee'
    }]
  }, {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{
      color: '#e5e5e5'
    }]
  }],
  dark: [{
    elementType: 'geometry',
    stylers: [{
      color: '#212121'
    }]
  }, {
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#757575'
    }]
  }, {
    elementType: 'labels.text.stroke',
    stylers: [{
      color: '#212121'
    }]
  }, {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{
      color: '#2c2c2c'
    }]
  }, {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#212121'
    }]
  }, {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#8a8a8a'
    }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{
      color: '#3c3c3c'
    }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#1c1c1c'
    }]
  }, {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{
      color: '#000000'
    }]
  }, {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#3d3d3d'
    }]
  }, {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{
      color: '#263238'
    }]
  }, {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{
      color: '#181818'
    }]
  }, {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#616161'
    }]
  }]
};

/**
 * Initialize Google Maps for a DSGMap instance.
 * Uses modern dynamic library import pattern.
 *
 * @param {Object} dsgMap - DSGMap instance (this context).
 * @return {Promise} Resolves when map is initialized.
 */
async function initGoogleMap(dsgMap) {
  // Load Google Maps bootstrap
  await (0,_utils_script_loader__WEBPACK_IMPORTED_MODULE_0__.loadGoogleMaps)(dsgMap.config.apiKey);

  // Dynamically import the Maps and Marker libraries (modern async pattern)
  const {
    Map
  } = await window.google.maps.importLibrary('maps');
  const {
    AdvancedMarkerElement,
    PinElement
  } = await window.google.maps.importLibrary('marker');

  // Get or create map container
  let container = dsgMap.element.querySelector('.dsgo-map__container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'dsgo-map__container';
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Map');
    dsgMap.element.appendChild(container);
  }

  // Map options (need mapId for advanced markers)
  const mapOptions = {
    center: {
      lat: dsgMap.config.lat,
      lng: dsgMap.config.lng
    },
    zoom: dsgMap.config.zoom,
    mapId: 'dsgo-map-' + Math.random().toString(36).substr(2, 9) // Unique ID for advanced markers
  };

  // Apply style if not standard
  if (dsgMap.config.mapStyle !== 'standard' && GOOGLE_MAP_STYLES[dsgMap.config.mapStyle]) {
    mapOptions.styles = GOOGLE_MAP_STYLES[dsgMap.config.mapStyle];
  }

  // Initialize Google Map
  dsgMap.mapInstance = new Map(container, mapOptions);

  // Create marker with standard Google Maps pin (customizable color only)
  const pinElement = new PinElement({
    background: dsgMap.config.markerColor || '#e74c3c',
    borderColor: '#ffffff',
    glyphColor: '#ffffff',
    scale: 1.2
  });

  // Add marker using AdvancedMarkerElement (no popup - removed per user request)
  new AdvancedMarkerElement({
    map: dsgMap.mapInstance,
    position: {
      lat: dsgMap.config.lat,
      lng: dsgMap.config.lng
    },
    content: pinElement.element
  });
}

/***/ }),

/***/ "./src/blocks/map/handlers/openstreetmap-handler.js":
/*!**********************************************************!*\
  !*** ./src/blocks/map/handlers/openstreetmap-handler.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initOpenStreetMap: () => (/* binding */ initOpenStreetMap)
/* harmony export */ });
/* harmony import */ var _utils_script_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/script-loader */ "./src/blocks/map/utils/script-loader.js");
/**
 * OpenStreetMap Handler
 *
 * Handles OpenStreetMap (Leaflet.js) initialization.
 */



/**
 * Initialize OpenStreetMap with Leaflet for a DSGMap instance.
 *
 * @param {Object} dsgMap - DSGMap instance (this context).
 * @return {Promise} Resolves when map is initialized.
 */
async function initOpenStreetMap(dsgMap) {
  await (0,_utils_script_loader__WEBPACK_IMPORTED_MODULE_0__.loadLeaflet)();

  // Get or create map container
  let container = dsgMap.element.querySelector('.dsgo-map__container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'dsgo-map__container';
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Map');
    dsgMap.element.appendChild(container);
  }

  // Initialize Leaflet map
  dsgMap.mapInstance = window.L.map(container, {
    center: [dsgMap.config.lat, dsgMap.config.lng],
    zoom: dsgMap.config.zoom
  });

  // Add tile layer
  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(dsgMap.mapInstance);

  // Create custom marker (XSS-safe)
  const iconContainer = document.createElement('div');
  iconContainer.textContent = dsgMap.config.markerIcon; // Treats as text, prevents XSS
  iconContainer.style.cssText = `
		font-size: 32px;
		line-height: 1;
		text-align: center;
		filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
	`;
  const customIcon = window.L.divIcon({
    html: iconContainer.outerHTML,
    className: 'dsgo-map__custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });

  // Add marker (no popup - removed per user request)
  window.L.marker([dsgMap.config.lat, dsgMap.config.lng], {
    icon: customIcon
  }).addTo(dsgMap.mapInstance);
}

/***/ }),

/***/ "./src/blocks/map/utils/script-loader.js":
/*!***********************************************!*\
  !*** ./src/blocks/map/utils/script-loader.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   loadGoogleMaps: () => (/* binding */ loadGoogleMaps),
/* harmony export */   loadLeaflet: () => (/* binding */ loadLeaflet)
/* harmony export */ });
/* unused harmony exports loadScript, loadStylesheet */
/**
 * Script and Stylesheet Loading Utilities
 *
 * Utilities for dynamically loading external scripts and stylesheets.
 */

/**
 * Load external script dynamically.
 *
 * @param {string} url - Script URL.
 * @param {string} id  - Unique script ID.
 * @return {Promise} Resolves when script loads.
 */
function loadScript(url, id) {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = url;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load: ${url}`));
    document.head.appendChild(script);
  });
}

/**
 * Load external stylesheet dynamically.
 *
 * @param {string} url - Stylesheet URL.
 * @param {string} id  - Unique stylesheet ID.
 * @return {Promise} Resolves when stylesheet loads.
 */
function loadStylesheet(url, id) {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load: ${url}`));
    document.head.appendChild(link);
  });
}

/**
 * Load Leaflet library (CSS + JS).
 *
 * @return {Promise} Resolves when Leaflet is loaded.
 */
async function loadLeaflet() {
  const version = '1.9.4';
  const baseUrl = `https://unpkg.com/leaflet@${version}`;
  await loadStylesheet(`${baseUrl}/dist/leaflet.css`, 'leaflet-css');
  await loadScript(`${baseUrl}/dist/leaflet.js`, 'leaflet-js');
  if (typeof window.L === 'undefined') {
    throw new Error('Leaflet failed to initialize');
  }
}

/**
 * Load Google Maps API using the modern async loading pattern.
 * Uses Google's recommended dynamic library import.
 *
 * @param {string} apiKey - Google Maps API key.
 * @return {Promise} Resolves when Google Maps bootstrap is loaded.
 */
async function loadGoogleMaps(apiKey) {
  if (!apiKey) {
    throw new Error('Google Maps API key is required');
  }

  // Check if already initialized
  if (window.google?.maps?.importLibrary) {
    return;
  }

  // Initialize Google Maps bootstrap loader (inline bootstrap pattern)
  // This follows Google's recommended async loading: https://goo.gle/js-api-loading
  return new Promise((resolve, reject) => {
    try {
      // Google Maps inline bootstrap loader
      (g => {
        let h, a, k;
        const p = 'The Google Maps JavaScript API';
        const c = 'google';
        const l = 'importLibrary';
        const q = '__ib__';
        const m = document;
        const b = window;
        b[c] = b[c] || {};
        const d = b[c].maps || (b[c].maps = {});
        const r = new Set();
        const e = new URLSearchParams();
        const u = () => h || (h = new Promise(async (f, n) => {
          await (a = m.createElement('script'));
          e.set('libraries', [...r] + '');
          for (k in g) {
            e.set(k.replace(/[A-Z]/g, t => '_' + t[0].toLowerCase()), g[k]);
          }
          e.set('callback', c + '.maps.' + q);
          a.src = `https://maps.googleapis.com/maps/api/js?` + e;
          d[q] = f;
          a.onerror = () => h = n(Error(p + ' could not load.'));
          a.nonce = m.querySelector('script[nonce]')?.nonce || '';
          m.head.append(a);
        }));

        // eslint-disable-next-line no-unused-expressions
        d[l] ?
        // eslint-disable-next-line no-console
        console.warn(p + ' only loads once. Ignoring:', g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n));
      })({
        key: apiKey,
        v: 'weekly'
      });

      // Resolve immediately - the actual library loads on-demand via importLibrary
      resolve();
    } catch (error) {
      reject(new Error('Failed to initialize Google Maps: ' + error.message));
    }
  });
}

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
/*!********************************!*\
  !*** ./src/blocks/map/view.js ***!
  \********************************/
/* harmony import */ var _handlers_DSGMap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./handlers/DSGMap */ "./src/blocks/map/handlers/DSGMap.js");
/**
 * Map Block - Frontend JavaScript
 *
 * Handles map initialization, privacy mode, and interactive functionality.
 */



/**
 * Initialize all map blocks.
 */
function initMaps() {
  const mapBlocks = document.querySelectorAll('.dsgo-map');
  mapBlocks.forEach(element => {
    // Prevent duplicate initialization
    if (element.hasAttribute('data-dsgo-initialized')) {
      return;
    }
    element.setAttribute('data-dsgo-initialized', 'true');
    new _handlers_DSGMap__WEBPACK_IMPORTED_MODULE_0__["default"](element);
  });
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMaps);
} else {
  initMaps();
}

// Expose to window for external access
window.DSGMap = _handlers_DSGMap__WEBPACK_IMPORTED_MODULE_0__["default"];
})();

/******/ })()
;
//# sourceMappingURL=view.js.map