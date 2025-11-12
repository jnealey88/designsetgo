# Responsive Visibility

The Responsive Visibility feature allows you to hide any block on specific devices (desktop, tablet, or mobile) without writing any code.

## What is Responsive Visibility?

Responsive Visibility gives you fine-grained control over which blocks appear on different screen sizes. This helps you:
- Create mobile-specific layouts
- Hide desktop-only content on small screens
- Optimize content for each device type
- Improve user experience across all devices

## Key Features

- 🎯 **Universal**: Works on ALL blocks (WordPress core blocks AND DesignSetGo custom blocks)
- 🚀 **Performance**: Pure CSS solution - zero JavaScript on frontend
- 🎨 **Visual Feedback**: Subtle badge indicator in editor shows which devices block is hidden on
- 💡 **Simple Controls**: Easy toggle switches in the Settings sidebar
- ✅ **No Conflicts**: Uses namespaced CSS classes to avoid theme conflicts

## Device Breakpoints

The feature uses these standard breakpoints:

| Device | Screen Width | Icon |
|--------|-------------|------|
| **Mobile** | Less than 768px | M |
| **Tablet** | 768px - 1023px | T |
| **Desktop** | 1024px and above | D |

These breakpoints match industry standards and work well with most WordPress themes.

## How to Use

### Step-by-Step Guide

1. **Select Any Block**
   - In the WordPress block editor, select the block you want to control
   - Works with Paragraphs, Images, Headings, Buttons, and ALL DesignSetGo blocks

2. **Open Settings Sidebar**
   - If not visible, click the Settings icon (gear) in the top-right
   - Make sure you're on the "Block" tab (not "Page")

3. **Find Responsive Visibility**
   - Scroll down in the Settings sidebar
   - Look for the **"Responsive Visibility"** panel
   - Click to expand if closed

4. **Toggle Device Visibility**
   - **Hide on Desktop**: Block won't appear on screens ≥1024px
   - **Hide on Tablet**: Block won't appear on screens 768-1023px
   - **Hide on Mobile**: Block won't appear on screens <768px
   - You can select multiple devices

5. **Visual Confirmation**
   - A small badge appears in the top-right corner of the block
   - Shows which devices it's hidden on (D, T, M, or combinations)
   - Subtle dashed outline around the block

6. **Save and Test**
   - Update/publish your page
   - View on different devices or resize browser to test
   - Use browser DevTools responsive mode for quick testing

## Common Use Cases

### 1. Hide Desktop Content on Mobile

**Scenario**: Large hero image looks great on desktop but takes too much space on mobile

**Solution**:
- Select the hero image block
- Enable: **Hide on Mobile** ✅
- Create a mobile-optimized version and set it to "Hide on Desktop"

### 2. Mobile-Only Call-to-Action

**Scenario**: Show a prominent "Call Now" button only on mobile devices

**Solution**:
- Create a Button block with phone link
- Enable: **Hide on Desktop** ✅
- Enable: **Hide on Tablet** ✅
- Result: Only visible on mobile

### 3. Tablet-Specific Layout

**Scenario**: Show different navigation for tablet users

**Solution**:
- Create tablet navigation
- Enable: **Hide on Desktop** ✅
- Enable: **Hide on Mobile** ✅
- Create separate mobile/desktop versions with opposite settings

### 4. Desktop-Only Features

**Scenario**: Advanced features that don't work well on touch devices

**Solution**:
- Select the feature block
- Enable: **Hide on Tablet** ✅
- Enable: **Hide on Mobile** ✅

### 5. Progressive Content Loading

**Scenario**: Show summary on mobile, full content on desktop

**Desktop Block**:
- Full detailed content
- Hide on Mobile ✅
- Hide on Tablet ✅

**Mobile Block**:
- Short summary with "Read More" link
- Hide on Desktop ✅

## Visual Editor Indicators

### Badge Display

When you hide a block on any device, a small badge appears in the top-right corner:

| Badge | Meaning |
|-------|---------|
| **D** | Hidden on Desktop only |
| **T** | Hidden on Tablet only |
| **M** | Hidden on Mobile only |
| **DM** | Hidden on Desktop and Mobile |
| **DT** | Hidden on Desktop and Tablet |
| **TM** | Hidden on Tablet and Mobile |
| **DTM** | ⚠️ Hidden on ALL devices (warning - red badge) |

### Outline Indicator

- **Light dashed outline** (blue) indicates the block has visibility settings
- Outline becomes **slightly stronger** when block is selected
- **No opacity changes** - block always appears at full opacity in editor

### Hover Behavior

- Badge becomes **more prominent** on hover
- Helps you quickly identify which blocks have visibility settings

## Best Practices

### ✅ DO

- **Test on actual devices** when possible (not just browser resize)
- **Use descriptive block names** for easier management
- **Consider tablet users** - don't just think mobile vs desktop
- **Check print layouts** - hidden blocks still appear when printing
- **Optimize images** - hide large images on mobile and use smaller versions
- **Think about SEO** - hidden content is still in the HTML

### ❌ DON'T

- **Don't hide everything** - Users on all devices need content!
- **Don't rely solely on visibility** - Consider mobile-first design
- **Don't forget about accessibility** - Hidden blocks are not announced by screen readers
- **Don't create duplicate content** unnecessarily
- **Don't use this for sensitive content** - Content is in HTML, just hidden with CSS

## Troubleshooting

### Block Still Visible on Hidden Device

**Problem**: Toggled "Hide on Mobile" but block still shows on phone

**Solutions**:
1. **Clear cache** - Browser cache or caching plugin might be serving old CSS
2. **Hard refresh** - Press Cmd/Ctrl + Shift + R
3. **Check CSS specificity** - Theme CSS might be overriding with `!important`
4. **Verify device width** - Check if device is actually in the breakpoint range
5. **Test in incognito** - Rules out browser extensions interfering

### Badge Not Showing in Editor

**Problem**: Enabled visibility settings but no badge appears

**Solutions**:
1. **Save the block** - Changes may not be applied yet
2. **Refresh the editor** - Reload the page editor
3. **Check browser console** - Look for JavaScript errors
4. **Clear browser cache** - Old CSS might be cached
5. **Try a different block** - Some blocks may not support wrapperProps

### All Devices Hidden (Red Badge)

**Problem**: Badge shows "DTM" in red

**Meaning**: You've hidden the block on ALL devices

**Solutions**:
1. This is usually unintentional - review your settings
2. Go to Responsive Visibility panel
3. Uncheck at least one device option
4. The block should now be visible somewhere

### Conflicts with Theme

**Problem**: Theme CSS interfering with visibility settings

**Solutions**:
1. CSS classes use `!important` to ensure they work
2. Check theme's CSS specificity
3. Contact theme support if issues persist
4. Consider child theme for custom CSS overrides

### Layout Breaks on Hidden Blocks

**Problem**: Layout jumps or breaks when blocks are hidden

**Solutions**:
1. **Flexbox/Grid containers** may need adjustment
2. **Set explicit heights** on parent containers if needed
3. **Use placeholder blocks** that maintain space
4. **Test thoroughly** at all breakpoints
5. **Consider redesigning** the layout for better responsiveness

## Technical Details

### CSS Classes Applied

Frontend CSS classes (applied to saved blocks):

```css
.dsg-hide-desktop  /* Hides on desktop (≥1024px) */
.dsg-hide-tablet   /* Hides on tablet (768-1023px) */
.dsg-hide-mobile   /* Hides on mobile (<768px) */
```

Editor CSS classes (only in editor):

```css
.dsg-has-responsive-visibility  /* Block has visibility settings */
```

### How It Works

**Editor (While editing)**:
1. Filter adds 3 boolean attributes to all blocks
2. Inspector controls added to Settings sidebar
3. Visual indicator component adds badge and outline
4. No actual hiding occurs in editor (for editing convenience)

**Frontend (Published page)**:
1. CSS classes added to block wrapper on save
2. CSS media queries hide blocks at appropriate breakpoints
3. Zero JavaScript - pure CSS performance
4. Content remains in HTML (SEO-friendly)

### Block Attributes

Three attributes are added to every block:

```javascript
{
  dsgHideOnDesktop: {
    type: 'boolean',
    default: false
  },
  dsgHideOnTablet: {
    type: 'boolean',
    default: false
  },
  dsgHideOnMobile: {
    type: 'boolean',
    default: false
  }
}
```

### CSS Implementation

```scss
// Mobile: < 768px
@media (max-width: 767px) {
  .dsg-hide-mobile {
    display: none !important;
  }
}

// Tablet: 768px - 1023px
@media (min-width: 768px) and (max-width: 1023px) {
  .dsg-hide-tablet {
    display: none !important;
  }
}

// Desktop: ≥ 1024px
@media (min-width: 1024px) {
  .dsg-hide-desktop {
    display: none !important;
  }
}
```

## Performance

- ✅ **Zero JavaScript** on frontend
- ✅ **Minimal CSS** (~200 bytes)
- ✅ **No render blocking**
- ✅ **No layout shift** (blocks removed before paint)
- ✅ **Works offline** (pure CSS)
- ✅ **No API calls**
- ✅ **Cacheable** by all caching plugins

## SEO Considerations

### Content Accessibility

**Important**: Hidden blocks are still in the HTML source code. Search engines can see and index this content.

**Implications**:
- ✅ Good: Mobile-hidden content still contributes to SEO
- ⚠️ Caution: Don't hide spam or keyword-stuffing content
- ✅ Good: Use for legitimate responsive design
- ⚠️ Caution: Don't create completely different content for different devices

### Best Practices for SEO

1. **Use sparingly** - Don't hide large amounts of unique content
2. **Keep important content visible** on all devices when possible
3. **Use responsive design** first, visibility control as enhancement
4. **Don't cloak** - Don't show completely different content to users vs bots
5. **Structure matters** - Keep proper heading hierarchy even with hidden blocks

## Accessibility

### Screen Readers

**Important**: Hidden blocks (`display: none`) are **not announced** by screen readers.

**Implications**:
- ✅ Hidden content is properly excluded from accessibility tree
- ⚠️ Don't hide important accessibility information
- ✅ Use ARIA labels and proper semantic HTML regardless of visibility
- ⚠️ Test with actual screen readers (VoiceOver, NVDA, JAWS)

### Keyboard Navigation

- ✅ Hidden blocks cannot be focused via keyboard
- ✅ Tab order is maintained properly
- ✅ No keyboard traps created by hiding blocks

### Color Contrast

- ✅ Editor badge meets WCAG 2.1 AA standards
- ✅ Outline color has sufficient contrast
- ✅ Works with high contrast mode

## Browser Support

- ✅ Chrome/Edge (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile, Samsung Internet)
- ✅ Internet Explorer 11 (CSS only, no editor features)

## Supported Blocks

### Works With ALL Blocks Including:

**WordPress Core Blocks**:
- Paragraph, Heading, Image, Button, Group, Column, etc.
- Lists, Tables, Quotes, Code, etc.
- Media blocks (Video, Audio, Gallery, etc.)
- All core blocks supported ✅

**DesignSetGo Custom Blocks**:
- Section, Row (Flex), Grid
- Stack, Icon, Icon Button, Pill
- Accordion, Tabs, Counter
- Form Builder and all form components
- All DesignSetGo blocks supported ✅

**Third-Party Blocks**:
- Most third-party blocks work ✅
- Some may have styling conflicts (rare)
- Report issues if you find incompatible blocks

## Comparison with Other Solutions

| Feature | Responsive Visibility | Hide Block Plugin | CSS Display | Theme.json |
|---------|---------------------|------------------|-------------|------------|
| **Easy to use** | ✅ Visual toggles | ⚠️ Varies | ❌ Code required | ⚠️ Complex |
| **Performance** | ✅ CSS only | ⚠️ May use JS | ✅ CSS only | ✅ CSS only |
| **Works on all blocks** | ✅ Yes | ⚠️ May not | ✅ Yes | ⚠️ Limited |
| **Visual feedback** | ✅ Badge indicator | ⚠️ Varies | ❌ None | ❌ None |
| **Learning curve** | ✅ Minimal | ⚠️ Moderate | ❌ Steep | ❌ Steep |
| **Maintenance** | ✅ Built-in | ⚠️ Plugin updates | ⚠️ Manual | ⚠️ Manual |

## FAQ

**Q: Can I hide blocks based on user login status?**
A: No, this is device-based only. Use PHP logic or plugins like Content Visibility for user-based hiding.

**Q: Does this slow down my site?**
A: No! It uses pure CSS with zero JavaScript on the frontend. Performance impact is negligible.

**Q: Can I hide the same block on multiple devices?**
A: Yes! Toggle multiple options to hide on Desktop + Mobile, for example.

**Q: Will hidden content affect my SEO?**
A: Hidden content is still in the HTML and indexed by search engines. Use responsibly.

**Q: Can I customize the breakpoints?**
A: Not through the UI. Developers can modify the breakpoints in `src/styles/_utilities.scss`.

**Q: Does this work with caching plugins?**
A: Yes! It's pure CSS so caching plugins won't affect functionality.

**Q: Can I hide entire sections or just individual blocks?**
A: Both! You can hide any block including container blocks (Section, Row, Group).

**Q: What if I accidentally hide a block on all devices?**
A: The badge turns red (warning) if hidden on all devices. Simply uncheck at least one device option.

**Q: Can I use this with WooCommerce?**
A: Yes! Works with WooCommerce blocks like product grids, cart, checkout, etc.

**Q: Does this work in widgets or FSE templates?**
A: Yes! Works anywhere blocks are used - posts, pages, widgets, templates, patterns.

## Related Features

- [Sticky Header](Sticky-Header) - Make your header stick to the top while scrolling
- [Section Block](Section-Block) - Full-width container for responsive layouts
- [Row Block (Flex)](Row-Block) - Flexible horizontal layouts with responsive controls
- [Grid Block](Grid-Block) - Responsive grid layouts with column controls

## Support

Having issues? Here's how to get help:

1. **Check this documentation** - Most questions are answered here
2. **Browser console** - Check for JavaScript errors
3. **Test in different browser** - Rules out browser-specific issues
4. **Disable other plugins** - Check for plugin conflicts
5. **GitHub Issues** - Report bugs at [github.com/jnealey88/designsetgo/issues](https://github.com/jnealey88/designsetgo/issues)

---

**Next Steps**: [Explore Grid Block for responsive layouts →](Grid-Block)
