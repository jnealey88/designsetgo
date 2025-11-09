---
description: Display DesignSetGo plugin architecture and structure
---

Display key information about the DesignSetGo plugin.

Show:

1. **Architecture Overview**
   - Hybrid approach: Extends core blocks + creates custom blocks
   - Philosophy: Work WITH WordPress, not against it

2. **Current Extensions**
   - List all extensions in `src/extensions/`
   - Show which core blocks they enhance
   - List features each extension adds

3. **Current Variations**
   - List all variations in `src/variations/`
   - Show which core blocks they extend
   - Brief description of each variation

4. **Custom Blocks** (if any)
   - List all custom blocks in `src/blocks/`
   - Brief description of each

5. **Build Configuration**
   - Entry points
   - Output structure
   - Key webpack settings

6. **File Structure**
   - Extension pattern
   - Variation pattern
   - Block pattern
   - Build output

7. **Key Principles** (from `.claude/claude.md`)
   - Extend, don't replace
   - Conditional controls
   - Respect native UX
   - Think responsive
   - Future-proof

Present this information in a clear, organized markdown format.
