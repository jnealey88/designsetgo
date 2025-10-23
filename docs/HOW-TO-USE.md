# How to Use DesignSetGo Blocks

## Quick Start Guide

### Step 1: Access WordPress

Your local WordPress is running at:
- **URL:** http://localhost:8888
- **Admin:** http://localhost:8888/wp-admin
- **Username:** `admin`
- **Password:** `password`

### Step 2: Create a New Post or Page

1. Log into WordPress admin
2. Click **Posts → Add New** (or **Pages → Add New**)
3. You'll see the WordPress Block Editor (Gutenberg)

### Step 3: Add the Container Block

There are **3 ways** to add the Container block:

#### Method 1: Using the Block Inserter
1. Click the **(+)** button in the top-left corner or anywhere in the editor
2. Type **"container"** in the search box
3. Look for the block labeled **"Container"** with the DesignSetGo category
4. Click it to insert

#### Method 2: Using Slash Commands
1. In an empty paragraph, type `/container`
2. Select **"Container"** from the dropdown
3. Press Enter

#### Method 3: Using the Browse All Button
1. Click the **(+)** button
2. Click **"Browse all"** to see all blocks organized by category
3. Look for the **"DesignSetGo"** category
4. Click **"Container"**

### Step 4: Customize Your Container

Once inserted, you'll see the Container block. Click on it to see options in the right sidebar:

#### Layout Panel
- **Layout Type:** Choose Flexbox, Grid, or Auto-Grid
- **Direction:** (Flexbox only) Row, Column, Row-Reverse, Column-Reverse
- **Justify Content:** Control horizontal alignment
- **Align Items:** Control vertical alignment
- **Columns:** (Grid only) Number of columns

#### Settings Panel
- **HTML Tag:** Choose semantic HTML (div, section, article, etc.)

#### Responsive Panel
- **Hide on Desktop:** Toggle visibility on desktop screens
- **Hide on Tablet:** Toggle visibility on tablets
- **Hide on Mobile:** Toggle visibility on mobile devices

#### WordPress Native Controls
In the toolbar and sidebar, you'll also see:
- **Spacing:** Margin and padding controls
- **Colors:** Background and text colors
- **Border:** Border radius, width, style
- **Alignment:** Wide, Full width

### Step 5: Add Content Inside

The Container block uses **InnerBlocks**, meaning you can add any WordPress blocks inside it:

1. Click inside the Container block
2. Click the **(+)** button
3. Add Headings, Paragraphs, Images, or any other blocks
4. The Container will layout its children based on your settings

## Example Uses

### Flexbox Row Layout
```
Container (Layout: Flex, Direction: Row)
├── Image
├── Heading
└── Paragraph
```
Perfect for side-by-side content.

### Grid Layout
```
Container (Layout: Grid, Columns: 3)
├── Feature Card
├── Feature Card
└── Feature Card
```
Perfect for feature sections.

### Centered Hero Section
```
Container (Layout: Flex, Justify: Center, Align: Center)
└── Heading
```
Perfect for hero sections.

## Verification Checklist

✅ **Plugin Active:** Run `npx wp-env run cli wp plugin list`
✅ **Block Registered:** Run the PHP eval command (see TROUBLESHOOTING.md)
✅ **WordPress Accessible:** Visit http://localhost:8888
✅ **Editor Open:** Create a new post/page

## What You Should See

When you open the block inserter, you should see:

```
All
  DesignSetGo
    └── Container
```

The Container block will have:
- **Icon:** A simple grid/layout icon
- **Title:** Container
- **Description:** "Advanced layout container with flex/grid controls, backgrounds, and visual effects."

## Still Not Seeing It?

### Check 1: Plugin Is Active
```bash
npx wp-env run cli wp plugin list
```
Should show `designsetgo | active`

### Check 2: Block Is Registered
```bash
npx wp-env run cli wp eval 'foreach( WP_Block_Type_Registry::get_instance()->get_all_registered() as $name => $block ) { if ( strpos( $name, "designsetgo" ) === 0 ) { echo $name . "\n"; } }'
```
Should output: `designsetgo/container`

### Check 3: Clear Cache
```bash
npx wp-env stop
npx wp-env start
```

### Check 4: Check Browser Console
1. Open the post editor
2. Press F12 (or Cmd+Option+I on Mac)
3. Go to Console tab
4. Look for any errors with "designsetgo"

### Check 5: Try Classic Editor
If you're still having issues, make sure you're using the **Block Editor** (Gutenberg), not the Classic Editor.

## Screenshots Guide

### 1. Finding the Block
The block inserter should look like this:
- Click the (+) button
- Type "container" in search
- See "Container" under DesignSetGo category

### 2. Block Settings
When selected, the right sidebar shows:
- Layout controls
- Responsive settings
- WordPress spacing/colors

### 3. Adding Content
- Click inside the Container
- Click (+) to add inner blocks
- Build your layout

## Next Steps

Once you've successfully inserted the Container block:

1. **Experiment with layouts** - Try Flexbox vs Grid
2. **Add nested blocks** - Put headings, paragraphs, images inside
3. **Test responsive** - Try the hide on mobile/tablet options
4. **Preview** - Click Preview to see how it looks on the frontend

## Need More Help?

- See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed debugging
- Check browser console for JavaScript errors
- Verify PHP errors with `npx wp-env logs wordpress`

---

**Pro Tip:** Once you're comfortable with the Container block, check [DEV-PHASE-1.md](DEV-PHASE-1.md) to see what blocks are coming next!
