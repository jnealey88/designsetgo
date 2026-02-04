# Claude Memory - DesignSetGo

## Shape Dividers (Section Block)

### Design Decisions

1. **Positioning**: Shape dividers are positioned **inside** the section at `top: 0` / `bottom: 0` (not outside). Positioning outside the block boundary is bad practice and can cause overlap issues with adjacent content.

2. **Automatic Padding**: When a shape divider is enabled, the inner container (`dsgo-stack__inner`) automatically receives padding equal to the shape's height. This prevents content from overlapping the shapes while letting users adjust their own padding on top.

3. **Color Controls Location**: Shape divider colors appear in the **main Color panel** (InspectorControls group="color") alongside other color settings like Overlay, Hover Background, etc. The Shape Divider panels only handle shape selection, height, width, flip, and front options.

4. **Two Color Properties**:
   - **Shape Color**: The SVG fill color
   - **Background Color**: The color behind the shape (useful for transitions between sections)

### Files

- `src/blocks/section/components/ShapeDivider.js` - Renders the SVG shape
- `src/blocks/section/components/ShapeDividerControls.js` - Shape selection and settings (not colors)
- Color controls are in `edit.js` within `<InspectorControls group="color">`
