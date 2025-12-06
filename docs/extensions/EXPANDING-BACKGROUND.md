# Expanding Background Extension - User Guide

**Compatible With**: Group and Section blocks (core/group, designsetgo/section)
**Since**: 1.3.0
**Status**: Production Ready

## Overview

The **Expanding Background Extension** creates a scroll-driven background effect where a small, blurred circle expands to fill the entire section as users scroll. This creates a dramatic reveal effect perfect for section transitions and visual storytelling.

**Features:**
- Scroll-driven expansion animation
- Configurable background color via theme palette
- Adjustable initial circle size
- Blur amount control for soft edges
- Animation speed multiplier
- Trigger offset and completion point controls
- Performance-optimized with Intersection Observer

## How to Use

1. Select a **Group** or **Section** block
2. Open the block settings sidebar
3. Find the **Expanding Background** panel
4. Toggle **Enable expanding background** to ON
5. Set your background color in the **Colors** panel (under "Expanding Background Color")
6. Scroll in the frontend to see the effect (preview shown only on frontend)

## Settings

### Enable Expanding Background
Toggle the scroll-driven expanding background effect on or off.

### Background Color
Set in the **Colors** panel (appears when enabled):
- Choose from your theme's color palette
- Use custom colors via the color picker
- The circle expands with this color until it fills the section

### Initial Circle Size
Starting radius of the circle in pixels:
- **Range**: 20px - 300px
- **Default**: 50px
- Smaller values create a more dramatic "point of origin" effect
- Larger values start with a more visible color area

### Blur Amount
Initial blur that fades as the circle expands:
- **Range**: 0px - 50px
- **Default**: 30px
- Creates soft, organic edges on the expanding circle
- Set to 0 for sharp edges

### Animation Speed
Speed multiplier for the expansion effect:
- **Range**: 0.5x - 2x
- **Default**: 1x
- Lower values = slower, more gradual expansion
- Higher values = faster, more aggressive expansion

### Trigger Offset
Percentage of scroll progress before the effect starts:
- **Range**: 0% - 100%
- **Default**: 0%
- Use to delay the effect start until user has scrolled partway into the section

### Completion Point
Percentage of scroll through section where effect reaches 100%:
- **Range**: 50% - 100%
- **Default**: 80%
- Lower values = effect completes earlier (faster)
- Higher values = effect completes later (slower)

## Use Cases

### 1. Section Color Reveals
Create dramatic transitions between page sections:
```
White section -> scroll -> expands to blue background
```

### 2. Service/Feature Highlights
Draw attention to important sections as users scroll:
```
Content appears normal, then background color "blooms" behind it
```

### 3. Story-driven Pages
Create chapters or scene transitions in long-form content:
```
Each section reveals its own color as the story progresses
```

### 4. Landing Page Drama
Add visual interest to landing pages without overwhelming:
```
Hero section -> expanding background reveals next section's color
```

## Best Practices

**DO:**
- Use colors that complement your existing design
- Set appropriate trigger offset if section content needs to be read first
- Test the completion point to match your scroll rhythm
- Combine with content that remains readable over the background
- Use on sections with sufficient height for the effect to be visible

**DON'T:**
- Apply to every section (diminishes impact)
- Use colors that make content unreadable
- Set blur too high (can look blurry/unfinished)
- Forget that the effect is only visible on the frontend
- Use on very short sections (effect won't complete)

## Editor vs Frontend

**Important**: The expanding background effect is only visible on the **frontend** when you scroll. In the editor, you'll see an informational notice explaining this. This is by design - scroll-driven effects require actual page scrolling to function.

To preview:
1. Save your changes
2. View the page on the frontend
3. Scroll through the section to see the expansion effect

## Technical Notes

- Uses CSS radial gradients for the expanding circle
- IntersectionObserver tracks element visibility
- Scroll position calculated as percentage through element
- Effect interpolates from initial state to full coverage
- Clean up functions prevent memory leaks
- The circle expands from the center of the section
- Background is positioned behind section content via z-index

## Troubleshooting

### Effect not appearing
1. Ensure the block is a Group or Section block
2. Verify "Enable expanding background" is toggled ON
3. Check that you've set a background color
4. View on the **frontend** (not editor) and scroll
5. Ensure the section is tall enough for scrolling

### Color not visible
1. Open the Colors panel in block settings
2. Look for "Expanding Background Color > Background Color"
3. Select a color - default is light gray (#e8e8e8)

### Effect looks wrong
1. Adjust initial circle size for desired starting point
2. Reduce blur if edges look too soft
3. Modify speed if expansion feels too fast/slow
4. Tune trigger offset and completion point for timing

### Content unreadable
1. Choose a background color with sufficient contrast
2. Consider adding text shadows to content
3. Ensure text color works on both initial and final states
4. Use the Section block's overlay options for additional contrast
