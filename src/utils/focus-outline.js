/**
 * Toggle focus outlines only for keyboard users.
 *
 * Adds a class to the body when the user presses Tab so we can
 * safely hide outlines for pointer interactions without hurting accessibility.
 *
 * @package
 */

const FOCUS_OUTLINE_CLASS = 'dsg-show-focus-outlines';
const TAB_KEY = 'Tab';

const handlePointerInput = () => {
	if (!document.body) {
		return;
	}

	document.body.classList.remove(FOCUS_OUTLINE_CLASS);
};

const handleKeyDown = (event) => {
	if (event.key !== TAB_KEY || !document.body) {
		return;
	}

	document.body.classList.add(FOCUS_OUTLINE_CLASS);

	// Remove outlines again after the next pointer interaction.
	window.addEventListener('pointerdown', handlePointerInput, { once: true });
};

const initFocusOutlineToggle = () => {
	if (typeof document === 'undefined') {
		return;
	}

	if (document.body) {
		document.body.classList.remove(FOCUS_OUTLINE_CLASS);
	} else {
		document.addEventListener(
			'DOMContentLoaded',
			() => document.body?.classList.remove(FOCUS_OUTLINE_CLASS),
			{ once: true }
		);
	}

	window.addEventListener('keydown', handleKeyDown);
};

if (typeof document !== 'undefined') {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initFocusOutlineToggle, {
			once: true,
		});
	} else {
		initFocusOutlineToggle();
	}
}
