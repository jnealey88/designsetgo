# Scroll Accordion Stacking Updates

Date: 2024-XX-XX  
Author: Codex (GPT-5)

## Summary
Implemented several fixes to make the Scroll Accordion block behave like a deck of cards that sticks/overlaps near the middle of the viewport (Apple-style effect). Work focuses on removing CSS that prevented sticky positioning, ensuring parent Sections allow overflow, and improving the sticking point for better visual balance.

## Key Changes

1. **Section overflow opt-out**
   - Added `dsgo-stack--allow-overflow` modifier in `src/blocks/section/style.scss`.
   - Scroll accordion JS now finds *all* ancestor `.dsgo-stack` wrappers and adds this class to prevent overflow clipping that breaks `position: sticky`.

2. **Sticky offset tuning**
   - Introduced `--dsgo-scroll-accordion-sticky-offset` custom property in `src/blocks/scroll-accordion/style.scss`.
   - Accordion items now use this variable (`top: clamp(6rem, 15vh, 12rem)`) so the stack “sticks” slightly below center instead of at the very top.

3. **Min-height removal**
   - Removed the forced `min-height: 100vh` from each accordion item so the deck height is driven by real content, avoiding excessive spacing.

4. **Frontend JS**
   - `src/blocks/scroll-accordion/view.js` ensures every ancestor Section permits overflow, even when accordions are deeply nested. Still handles reduced-motion users and scaling animation.

## Deployment Notes
- Rebuild assets after pulling these changes: `npm run build`.
- Clear caches/CDN so updated CSS/JS loads on WordPress frontends.

## Future Considerations
- Consider exposing the sticky offset as a block control so editors can fine-tune the vertical snap point.
- Evaluate performance if many accordions exist on a single page; current JS listens on `window` scroll/resize.
