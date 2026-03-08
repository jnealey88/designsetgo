/**
 * Tabs Block - Frontend Unit Tests
 *
 * Tests for the tabs view.js frontend script.
 * The module exposes window.DSGTabs after loading via IIFE, so tests
 * can either load the module (jest.isolateModules) or construct directly.
 *
 * @package
 */

/**
 * Create a tabs container with panels.
 *
 * @param {Object}  options                  Configuration options.
 * @param {number}  options.panelCount       Number of tab panels.
 * @param {number}  options.activeTab        Initial active tab index.
 * @param {number}  options.mobileBreakpoint Mobile breakpoint width.
 * @param {string}  options.mobileMode       Mobile mode ('accordion' or 'dropdown').
 * @param {boolean} options.deepLinking      Whether deep linking is enabled.
 * @param {boolean} options.vertical         Whether tabs are vertical orientation.
 * @param {Array}   options.labels           Custom labels for panels.
 * @return {HTMLElement} The tabs container element.
 */
function createTabs( {
	panelCount = 3,
	activeTab = 0,
	mobileBreakpoint = 768,
	mobileMode = 'accordion',
	deepLinking = false,
	vertical = false,
	labels = [],
} = {} ) {
	const container = document.createElement( 'div' );
	container.classList.add( 'dsgo-tabs' );
	container.setAttribute( 'data-active-tab', String( activeTab ) );
	container.setAttribute( 'data-mobile-breakpoint', String( mobileBreakpoint ) );
	container.setAttribute( 'data-mobile-mode', mobileMode );

	if ( deepLinking ) {
		container.setAttribute( 'data-deep-linking', 'true' );
	}
	if ( vertical ) {
		container.classList.add( 'dsgo-tabs--vertical' );
	}

	// Create nav container (buildNavigation will populate it)
	const nav = document.createElement( 'div' );
	nav.classList.add( 'dsgo-tabs__nav' );
	nav.setAttribute( 'role', 'tablist' );
	container.appendChild( nav );

	// Create panels container
	const panelsWrapper = document.createElement( 'div' );
	panelsWrapper.classList.add( 'dsgo-tabs__panels' );

	for ( let i = 0; i < panelCount; i++ ) {
		const panel = document.createElement( 'div' );
		panel.classList.add( 'dsgo-tab' );
		panel.id = `panel-${ i }`;
		panel.setAttribute( 'role', 'tabpanel' );
		panel.setAttribute(
			'aria-label',
			labels[ i ] || `Tab ${ i + 1 }`
		);

		const content = document.createElement( 'div' );
		content.classList.add( 'dsgo-tab__content' );
		content.textContent = `Content for tab ${ i + 1 }`;
		panel.appendChild( content );

		panelsWrapper.appendChild( panel );
	}

	container.appendChild( panelsWrapper );
	document.body.appendChild( container );
	return container;
}

/**
 * Load the view.js module in isolation.
 * Exposes window.DSGTabs and triggers auto-initialization
 * of any .dsgo-tabs elements already in the DOM.
 */
function loadView() {
	jest.isolateModules( () => {
		require( '../../../src/blocks/tabs/view.js' );
	} );
}

/**
 * Dispatch a keyboard event on an element.
 *
 * @param {HTMLElement} element Target element.
 * @param {string}      key    Key name (e.g. 'ArrowRight', 'Home').
 */
function pressKey( element, key ) {
	const event = new KeyboardEvent( 'keydown', {
		key,
		bubbles: true,
		cancelable: true,
	} );
	element.dispatchEvent( event );
}

/**
 * Get all generated tab buttons from a tabs container.
 *
 * @param {HTMLElement} container The tabs container.
 * @return {NodeList} Tab buttons.
 */
function getTabButtons( container ) {
	return container.querySelectorAll( '.dsgo-tabs__tab' );
}

/**
 * Clean up DOM and restore defaults between tests.
 */
function cleanup() {
	while ( document.body.firstChild ) {
		document.body.removeChild( document.body.firstChild );
	}
	global.setMatchMedia( false );
	Object.defineProperty( window, 'innerWidth', {
		writable: true,
		configurable: true,
		value: 1024,
	} );
	delete window.DSGTabs;
	// Reset location hash
	window.location.hash = '';
}

describe( 'Tabs - Frontend', () => {
	afterEach( () => {
		cleanup();
	} );

	describe( 'Initialization and navigation building', () => {
		test( 'creates tab buttons from panels', () => {
			const container = createTabs( { panelCount: 3 } );
			loadView();

			const buttons = getTabButtons( container );
			expect( buttons ).toHaveLength( 3 );
			expect( buttons[ 0 ].textContent ).toContain( 'Tab 1' );
			expect( buttons[ 1 ].textContent ).toContain( 'Tab 2' );
			expect( buttons[ 2 ].textContent ).toContain( 'Tab 3' );
		} );

		test( 'first tab is active by default', () => {
			const container = createTabs();
			loadView();

			const buttons = getTabButtons( container );
			expect( buttons[ 0 ].classList.contains( 'is-active' ) ).toBe( true );
			expect( buttons[ 0 ].getAttribute( 'aria-selected' ) ).toBe( 'true' );

			const panels = container.querySelectorAll( '.dsgo-tab' );
			expect( panels[ 0 ].classList.contains( 'is-active' ) ).toBe( true );
			expect( panels[ 0 ].hidden ).toBe( false );
		} );
	} );

	describe( 'Tab switching', () => {
		test( 'click switches active tab', () => {
			const container = createTabs();
			loadView();

			const buttons = getTabButtons( container );
			const panels = container.querySelectorAll( '.dsgo-tab' );

			// Click the second tab button
			buttons[ 1 ].click();

			expect( buttons[ 1 ].classList.contains( 'is-active' ) ).toBe( true );
			expect( buttons[ 0 ].classList.contains( 'is-active' ) ).toBe( false );
			expect( panels[ 1 ].classList.contains( 'is-active' ) ).toBe( true );
			expect( panels[ 0 ].classList.contains( 'is-active' ) ).toBe( false );
		} );

		test( 'sets aria-selected correctly on tab switch', () => {
			const container = createTabs();
			loadView();

			const buttons = getTabButtons( container );

			// First tab selected initially
			expect( buttons[ 0 ].getAttribute( 'aria-selected' ) ).toBe( 'true' );
			expect( buttons[ 1 ].getAttribute( 'aria-selected' ) ).toBe( 'false' );
			expect( buttons[ 2 ].getAttribute( 'aria-selected' ) ).toBe( 'false' );

			// Switch to second tab
			buttons[ 1 ].click();

			expect( buttons[ 0 ].getAttribute( 'aria-selected' ) ).toBe( 'false' );
			expect( buttons[ 1 ].getAttribute( 'aria-selected' ) ).toBe( 'true' );
			expect( buttons[ 2 ].getAttribute( 'aria-selected' ) ).toBe( 'false' );
		} );

		test( 'hides inactive panels in tab mode', () => {
			const container = createTabs();
			loadView();

			const panels = container.querySelectorAll( '.dsgo-tab' );

			// Only first panel is visible
			expect( panels[ 0 ].hidden ).toBe( false );
			expect( panels[ 1 ].hidden ).toBe( true );
			expect( panels[ 2 ].hidden ).toBe( true );

			// Switch to second
			const buttons = getTabButtons( container );
			buttons[ 1 ].click();

			expect( panels[ 0 ].hidden ).toBe( true );
			expect( panels[ 1 ].hidden ).toBe( false );
			expect( panels[ 2 ].hidden ).toBe( true );
		} );
	} );

	describe( 'Keyboard navigation - horizontal', () => {
		test( 'ArrowRight advances to next tab', () => {
			const container = createTabs();
			loadView();

			const buttons = getTabButtons( container );
			buttons[ 0 ].focus();
			pressKey( buttons[ 0 ], 'ArrowRight' );

			expect( buttons[ 1 ].classList.contains( 'is-active' ) ).toBe( true );
			expect( document.activeElement ).toBe( buttons[ 1 ] );
		} );

		test( 'ArrowLeft goes to previous tab', () => {
			const container = createTabs();
			loadView();

			const buttons = getTabButtons( container );

			// Switch to second tab first
			buttons[ 1 ].click();
			buttons[ 1 ].focus();

			pressKey( buttons[ 1 ], 'ArrowLeft' );

			expect( buttons[ 0 ].classList.contains( 'is-active' ) ).toBe( true );
			expect( document.activeElement ).toBe( buttons[ 0 ] );
		} );

		test( 'Home focuses first tab, End focuses last tab', () => {
			const container = createTabs();
			loadView();

			const buttons = getTabButtons( container );

			// Start at second tab
			buttons[ 1 ].click();
			buttons[ 1 ].focus();

			// Home goes to first
			pressKey( buttons[ 1 ], 'Home' );
			expect( buttons[ 0 ].classList.contains( 'is-active' ) ).toBe( true );
			expect( document.activeElement ).toBe( buttons[ 0 ] );

			// End goes to last
			pressKey( buttons[ 0 ], 'End' );
			expect( buttons[ 2 ].classList.contains( 'is-active' ) ).toBe( true );
			expect( document.activeElement ).toBe( buttons[ 2 ] );
		} );
	} );

	describe( 'Keyboard navigation - vertical', () => {
		test( 'vertical tabs use ArrowUp and ArrowDown', () => {
			const container = createTabs( { vertical: true } );
			loadView();

			const buttons = getTabButtons( container );
			buttons[ 0 ].focus();

			// ArrowDown advances
			pressKey( buttons[ 0 ], 'ArrowDown' );
			expect( buttons[ 1 ].classList.contains( 'is-active' ) ).toBe( true );
			expect( document.activeElement ).toBe( buttons[ 1 ] );

			// ArrowUp goes back
			pressKey( buttons[ 1 ], 'ArrowUp' );
			expect( buttons[ 0 ].classList.contains( 'is-active' ) ).toBe( true );
			expect( document.activeElement ).toBe( buttons[ 0 ] );
		} );
	} );

	describe( 'Custom events', () => {
		test( 'dispatches dsgo-tab-change custom event on tab switch', () => {
			const container = createTabs();
			loadView();

			const handler = jest.fn();
			container.addEventListener( 'dsgo-tab-change', handler );

			const buttons = getTabButtons( container );
			buttons[ 2 ].click();

			expect( handler ).toHaveBeenCalledTimes( 1 );
			const detail = handler.mock.calls[ 0 ][ 0 ].detail;
			expect( detail.index ).toBe( 2 );
			expect( detail.panel ).toBe(
				container.querySelectorAll( '.dsgo-tab' )[ 2 ]
			);
		} );
	} );

	describe( 'Mobile accordion mode', () => {
		test( 'hides nav and shows accordion headers at mobile width', () => {
			Object.defineProperty( window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: 500,
			} );

			const container = createTabs( { mobileMode: 'accordion' } );
			loadView();

			const nav = container.querySelector( '.dsgo-tabs__nav' );
			expect( nav.style.display ).toBe( 'none' );

			expect(
				container.classList.contains( 'dsgo-tabs--accordion' )
			).toBe( true );

			// Accordion headers are created for each panel
			const headers = container.querySelectorAll(
				'.dsgo-tab__accordion-header'
			);
			expect( headers ).toHaveLength( 3 );
			expect( headers[ 0 ].textContent ).toBe( 'Tab 1' );
			expect( headers[ 1 ].textContent ).toBe( 'Tab 2' );

			// All panels are visible in accordion mode
			const panels = container.querySelectorAll( '.dsgo-tab' );
			panels.forEach( ( panel ) => {
				expect( panel.hidden ).toBe( false );
			} );
		} );
	} );

	describe( 'Mobile dropdown mode', () => {
		test( 'creates select element at mobile width', () => {
			Object.defineProperty( window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: 500,
			} );

			const container = createTabs( { mobileMode: 'dropdown' } );
			loadView();

			expect(
				container.classList.contains( 'dsgo-tabs--dropdown' )
			).toBe( true );

			const dropdown = container.querySelector( '.dsgo-tabs__dropdown' );
			expect( dropdown ).not.toBeNull();
			expect( dropdown.tagName ).toBe( 'SELECT' );
			expect( dropdown.getAttribute( 'aria-label' ) ).toBe( 'Select tab' );

			// Options match panels
			const options = dropdown.querySelectorAll( 'option' );
			expect( options ).toHaveLength( 3 );
			expect( options[ 0 ].textContent ).toBe( 'Tab 1' );
		} );
	} );

	describe( 'Restoring tabs mode', () => {
		test( 'removes mobile UI when viewport exceeds breakpoint', () => {
			// Start at mobile width
			Object.defineProperty( window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: 500,
			} );

			const container = createTabs( { mobileMode: 'accordion' } );
			loadView();

			// Verify accordion mode is active
			expect(
				container.classList.contains( 'dsgo-tabs--accordion' )
			).toBe( true );
			const headers = container.querySelectorAll(
				'.dsgo-tab__accordion-header'
			);
			expect( headers.length ).toBeGreaterThan( 0 );

			// Simulate resize to desktop
			Object.defineProperty( window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: 1024,
			} );

			// The DSGTabs instance has a handleResize method; call it
			// via the exposed class by constructing directly
			// We need to trigger the resize; the debounced listener
			// registered internally would require timers. Instead,
			// we can directly access window.DSGTabs.
			const instance = new window.DSGTabs( container );

			// After re-init at desktop size, accordion classes and headers are removed
			expect(
				container.classList.contains( 'dsgo-tabs--accordion' )
			).toBe( false );

			const headersAfter = container.querySelectorAll(
				'.dsgo-tab__accordion-header'
			);
			expect( headersAfter ).toHaveLength( 0 );

			const nav = container.querySelector( '.dsgo-tabs__nav' );
			expect( nav.style.display ).toBe( '' );
		} );
	} );

	describe( 'Deep linking', () => {
		test( 'reads hash on init to set active tab', () => {
			const container = createTabs( { deepLinking: true } );

			// Set hash before loading
			window.location.hash = '#panel-2';

			loadView();

			const buttons = getTabButtons( container );
			expect( buttons[ 2 ].classList.contains( 'is-active' ) ).toBe( true );
			expect( buttons[ 2 ].getAttribute( 'aria-selected' ) ).toBe( 'true' );

			const panels = container.querySelectorAll( '.dsgo-tab' );
			expect( panels[ 2 ].classList.contains( 'is-active' ) ).toBe( true );
		} );
	} );
} );
