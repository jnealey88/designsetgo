CSS Width & Layout Strategy Plan
Context
You have a solid two-div pattern architecture with FSE contentSize integration, but recent optimizations revealed width inheritance issues. The plan focuses on WordPress compatibility and proper parent-child width relationships.
Phase 1: Fix Critical Width Conflicts (Immediate)
1.1 Remove Duplicate Width Extension
File: src/extensions/max-width/index.js
Issue: Adds constrainWidth/contentWidth to Section/Row/Grid that already have these natively
Fix: Exclude container blocks from extension OR remove extension entirely
Impact: Eliminates duplicate inspector controls
1.2 Standardize contentSize Usage (Editor/Frontend Parity)
Files: All container block edit.js and save.js
Issue: Editor uses actual theme value, frontend uses CSS variable with hardcoded fallback
Fix: Use var(--wp--style--global--content-size) in both, ensure CSS variable is always available
Impact: Consistent rendering across editor/frontend
Phase 2: Align with WordPress Layout System (Core Strategy)
2.1 Refactor Row Block to Use WordPress Layout
File: src/blocks/row/save.js (lines 79-114)
Current: Manually implements display: flex, justifyContent, gap conversion
Strategy: Use WordPress's layout system like Section block does
Benefit: Reduces maintenance, better theme compatibility, respects user preferences
2.2 Fix Grid blockGap Handling
File: src/blocks/grid/save.js (line 66-72)
Issue: Hard-coded gaps ignore attributes.style?.spacing?.blockGap
Fix: Priority order: blockGap attribute → rowGap/columnGap → preset fallback
Impact: Respects WordPress spacing settings
Phase 3: Child Block Width Strategy (New CSS Pattern)
3.1 Define Block Width Behavior Classes Create three categories: A. Full-Width Blocks (Default)
All container blocks (Section, Row, Grid)
Accordion, Tabs
Most content blocks
CSS Strategy:
// In parent container SCSS
.dsg-stack__inner,
.dsg-flex__inner,
.dsg-grid__inner {
  > .wp-block {
    width: 100%; // Default all children to full width
    max-width: none;
  }
}
B. Intrinsic Width Blocks (Inline)
Icon, Icon Button, Pill (already inline-flex)
Counter (standalone)
Progress Bar (when not full width)
CSS Strategy:
// Opt-out of full-width for inline elements
.dsg-stack__inner,
.dsg-flex__inner,
.dsg-grid__inner {
  > .wp-block-designsetgo-icon,
  > .wp-block-designsetgo-icon-button,
  > .wp-block-designsetgo-pill {
    width: auto; // Allow natural sizing
    display: inline-flex;
  }
}
C. User-Controlled Width Blocks
Blocks with explicit width controls
Blocks with alignment (alignleft, alignright, aligncenter)
CSS Strategy:
// Respect user alignment choices
.dsg-stack__inner > .alignleft,
.dsg-stack__inner > .alignright {
  width: auto;
  max-width: 50%; // or theme-defined
}
3.2 Create Centralized Width Utility SCSS
New File: src/styles/utilities/_width-layout.scss
Purpose: Single source of truth for width inheritance rules
Import: In src/styles/style.scss and src/styles/editor.scss
Phase 4: WordPress Class Compatibility
4.1 Leverage WordPress Container Classes Use .is-layout-flex and .is-layout-constrained:
// Work WITH WordPress, not against it
.wp-block-designsetgo-stack {
  &.is-layout-flex {
    // WordPress handles flex layout
  }
  
  &.is-layout-constrained {
    // WordPress handles width constraint
  }
}
4.2 Reduce !important Usage
Current: 24 !important rules in width-related CSS
Strategy: Use higher specificity selectors instead
Example: .wp-block-designsetgo-stack.alignfull.dsg-no-width-constraint > .dsg-stack__inner
Benefit: Better theme compatibility, easier overrides
4.3 Respect WordPress Alignment Classes
Ensure .alignfull, .alignwide, .alignleft, .alignright work correctly
Don't override with container-specific rules
Test with WordPress core blocks inside your containers
Phase 5: Testing & Documentation
5.1 Comprehensive Width Testing Matrix Test all combinations:
Parent Width Settings:
Constrained (default contentSize)
Constrained (custom width)
Unconstrained (full width)
Child Block Types:
Full-width blocks (Section, Accordion, Tabs)
Inline blocks (Icon, Pill)
WordPress core blocks (Paragraph, Image, Button)
Nesting Scenarios:
Section > Row > Grid
Full-width parent > Constrained child
Constrained parent > Full-width child
5.2 Update Documentation
Update WIDTH-LAYOUT-PATTERNS.md with new strategy
Add decision tree: "Should this block be full-width?"
Document opt-in/opt-out classes
Implementation Order
Week 1: Quick Wins
Remove duplicate max-width extension (15 min)
Fix Grid blockGap (10 min)
Standardize contentSize CSS variable usage (30 min)
Week 2: Core Strategy 4. Create centralized width utility SCSS (1 hour) 5. Implement child block width classes (2 hours) 6. Refactor Row to use WordPress layout (2 hours) Week 3: Polish 7. Reduce !important usage (1 hour) 8. Comprehensive testing (3 hours) 9. Update documentation (1 hour) Total Time Estimate: 10-12 hours
Success Metrics
✅ No duplicate width controls in inspector ✅ Zero conflicts with WordPress core blocks ✅ Consistent behavior between editor and frontend ✅ Predictable nesting - parent width always honored ✅ Inline blocks stay inline, full-width blocks go full-width ✅ Theme compatibility - works with any theme's contentSize
