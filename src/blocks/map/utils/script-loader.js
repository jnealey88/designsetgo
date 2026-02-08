/**
 * Script and Stylesheet Loading Utilities
 *
 * Utilities for dynamically loading external scripts and stylesheets.
 */

// Cache in-flight promises so concurrent callers share one load.
const pendingScripts = new Map();
const pendingStyles = new Map();

/**
 * Load external script dynamically.
 *
 * @param {string} url - Script URL.
 * @param {string} id  - Unique script ID.
 * @return {Promise} Resolves when script loads.
 */
export function loadScript(url, id) {
	if (pendingScripts.has(id)) {
		return pendingScripts.get(id);
	}

	const promise = new Promise((resolve, reject) => {
		const existing = document.getElementById(id);
		if (existing) {
			// Script tag exists — if already loaded, resolve; otherwise wait.
			if (existing.dataset.loaded === 'true') {
				resolve();
				return;
			}
			existing.addEventListener('load', () => resolve());
			existing.addEventListener('error', () =>
				reject(new Error(`Failed to load: ${url}`))
			);
			return;
		}

		const script = document.createElement('script');
		script.id = id;
		script.src = url;
		script.async = true;
		script.onload = () => {
			script.dataset.loaded = 'true';
			resolve();
		};
		script.onerror = () => reject(new Error(`Failed to load: ${url}`));
		document.head.appendChild(script);
	});

	pendingScripts.set(id, promise);
	return promise;
}

/**
 * Load external stylesheet dynamically.
 *
 * @param {string} url - Stylesheet URL.
 * @param {string} id  - Unique stylesheet ID.
 * @return {Promise} Resolves when stylesheet loads.
 */
export function loadStylesheet(url, id) {
	if (pendingStyles.has(id)) {
		return pendingStyles.get(id);
	}

	const promise = new Promise((resolve, reject) => {
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

	pendingStyles.set(id, promise);
	return promise;
}

/**
 * Load Leaflet library (CSS + JS).
 *
 * @return {Promise} Resolves when Leaflet is loaded.
 */
export async function loadLeaflet() {
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
export async function loadGoogleMaps(apiKey) {
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
			((g) => {
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

				const u = () =>
					h ||
					(h = new Promise(async (f, n) => {
						await (a = m.createElement('script'));
						e.set('libraries', [...r] + '');
						for (k in g) {
							e.set(
								k.replace(
									/[A-Z]/g,
									(t) => '_' + t[0].toLowerCase()
								),
								g[k]
							);
						}
						e.set('callback', c + '.maps.' + q);
						a.src = `https://maps.googleapis.com/maps/api/js?` + e;
						d[q] = f;
						a.onerror = () =>
							(h = n(Error(p + ' could not load.')));
						a.nonce = m.querySelector('script[nonce]')?.nonce || '';
						m.head.append(a);
					}));

				// eslint-disable-next-line no-unused-expressions
				d[l]
					? // eslint-disable-next-line no-console
						console.warn(p + ' only loads once. Ignoring:', g)
					: (d[l] = (f, ...n) =>
							r.add(f) && u().then(() => d[l](f, ...n)));
			})({
				key: apiKey,
				v: 'weekly',
			});

			// Resolve immediately - the actual library loads on-demand via importLibrary
			resolve();
		} catch (error) {
			reject(
				new Error('Failed to initialize Google Maps: ' + error.message)
			);
		}
	});
}
