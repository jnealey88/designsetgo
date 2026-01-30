---
name: review-extension
description: Review block extension for WordPress best practices
context: fork
agent: Explore
allowed-tools: Read, Glob, Grep, Bash(git *), Bash(npm run *)
---


Review a block extension for best practices.

Ask the user which extension to review, then check that the extension:

1. **Works WITH WordPress attributes**
   - Uses `layout.type` when extending Group block
   - Doesn't create duplicate layout systems
   - Respects WordPress native attributes

2. **Shows controls conditionally**
   - Grid controls only shown when `layout.type === 'grid'`
   - Flex controls only shown when layout is flex
   - Controls make sense in current context

3. **Doesn't duplicate WordPress toolbar**
   - No layout selectors that conflict with toolbar icons
   - No controls that replicate native WordPress features
   - Enhances rather than replaces

4. **Uses proper filter hooks**
   - `blocks.registerBlockType` for attributes
   - `editor.BlockEdit` for inspector controls
   - `blocks.getSaveContent.extraProps` for save classes
   - Proper filter names with namespace

5. **Includes responsive considerations**
   - Desktop/tablet/mobile variants
   - Mobile-first approach
   - Proper breakpoints

6. **Follows project patterns**
   - Matches patterns in `.claude/claude.md`
   - Uses consistent naming (dsg prefix)
   - Proper file structure
   - No versioned filenames (no -v2, -v3, etc.)

7. **CSS Strategy**
   - Uses `!important` when overriding WordPress defaults
   - Targets correct elements (.wp-block-group__inner-container for Group)
   - Includes both frontend and editor styles

Provide a detailed review with specific code examples of any issues found and recommendations for fixes.
