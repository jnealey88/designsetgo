# Finding Your DesignSetGo Blocks in the Editor

## ✅ Confirmation: Everything is Set Up!

Your DesignSetGo plugin has:
- ✅ **Plugin:** Active and loaded
- ✅ **Block:** `designsetgo/container` registered
- ✅ **Category:** `DesignSetGo` with layout icon
- ✅ **Assets:** All JS/CSS files loaded

## 🎯 Where to Find Your Blocks

### Visual Guide

When you open the WordPress Block Editor, here's exactly where to find DesignSetGo blocks:

```
┌────────────────────────────────────────┐
│  [+] Add Block                         │
├────────────────────────────────────────┤
│  Search for blocks...                  │
│  ┌──────────────────────────────────┐  │
│  │ container                        │  │
│  └──────────────────────────────────┘  │
│                                        │
│  DesignSetGo                    [📐]  │
│  └─ Container                          │
│     Advanced layout container with     │
│     flex/grid controls, backgrounds,   │
│     and visual effects.                │
│                                        │
└────────────────────────────────────────┘
```

### Step-by-Step Instructions

#### Method 1: Quick Search (Fastest)

1. Click the **(+)** button anywhere in the editor
2. Type **`container`**
3. You'll see:
   ```
   DesignSetGo
   └── Container
       Advanced layout container...
   ```
4. Click it!

#### Method 2: Browse by Category

1. Click the **(+)** button
2. Click **"Browse all"** (or click the grid icon)
3. Scroll down to find **"DesignSetGo"** section
4. You'll see all DesignSetGo blocks grouped together
5. Click **"Container"**

#### Method 3: Slash Command (Power User)

1. In an empty paragraph, type: **`/container`**
2. Select "Container" from the dropdown
3. Press Enter

## 🔍 What the Category Looks Like

The **DesignSetGo** category appears with:
- **Icon:** 📐 (layout/grid icon)
- **Title:** "DesignSetGo"
- **Position:** Among other categories (Design, Text, Media, etc.)

## 📸 Visual Reference

### In the Block Inserter

```
All Blocks
├── Text
├── Media
├── Design
├── Widgets
├── Theme
├── Embeds
└── DesignSetGo  ← YOUR CATEGORY HERE!
    └── Container  ← YOUR BLOCK HERE!
```

### Block Categories in WordPress

Your DesignSetGo category will appear alongside:
- **Text** (Paragraph, Heading, List, etc.)
- **Media** (Image, Gallery, Video, etc.)
- **Design** (Buttons, Columns, Group, etc.)
- **DesignSetGo** ← **Your blocks!**

## 🎨 What You'll See in the Editor

### Container Block Appearance

When you insert the Container block:

```
┌─────────────────────────────────────────┐
│ Container                          [⚙️] │
├─────────────────────────────────────────┤
│                                         │
│   Click '+' to add blocks inside        │
│                                         │
└─────────────────────────────────────────┘
```

### With Content Inside

After adding content:

```
┌─────────────────────────────────────────┐
│ Container                          [⚙️] │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ 🖼️ Image                           │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ Heading                             │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ Paragraph text...                   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Settings Sidebar

When Container is selected, you'll see:

```
Block Settings
├── Layout
│   ├── Layout Type: [Flexbox ▼]
│   ├── Direction: [Row ▼]
│   ├── Justify Content: [Start ▼]
│   └── Align Items: [Stretch ▼]
├── Settings
│   └── HTML Tag: [div ▼]
├── Responsive
│   ├── ☐ Hide on Desktop
│   ├── ☐ Hide on Tablet
│   └── ☐ Hide on Mobile
├── Color (WordPress native)
├── Spacing (WordPress native)
└── Border (WordPress native)
```

## 🚀 Quick Test

To quickly verify everything works:

1. Go to: **http://localhost:8888/wp-admin**
2. Click: **Posts → All Posts**
3. Find: **"Test DesignSetGo Blocks"**
4. Click: **Edit**
5. You should see the Container block already in the post!

## 📋 Verification Checklist

Run these commands to verify everything:

```bash
# 1. Check plugin is active
npx wp-env run cli wp plugin list | grep designsetgo
# Should show: designsetgo | active

# 2. Check block is registered
npx wp-env run cli wp eval 'echo WP_Block_Type_Registry::get_instance()->is_registered("designsetgo/container") ? "✓ Block registered\n" : "✗ Not found\n";'
# Should show: ✓ Block registered

# 3. Check category exists
npx wp-env run cli wp eval '$post = get_post(7); $settings = get_block_editor_settings([], $post); foreach ($settings["blockCategories"] as $cat) { if ($cat["slug"] == "designsetgo") echo "✓ Category: " . $cat["title"] . "\n"; }'
# Should show: ✓ Category: DesignSetGo
```

## 🎯 All Three Should Return ✓

If all three checks pass (they do!), then:
- Your plugin is active ✅
- Your block is registered ✅
- Your category exists ✅

**You're ready to use DesignSetGo blocks!**

## 🆘 Still Can't Find It?

### Quick Troubleshooting

**1. Clear Browser Cache**
   - Press Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Or open in an Incognito/Private window

**2. Check Browser Console**
   - Press F12 (or Cmd+Option+I on Mac)
   - Look for errors with "designsetgo"

**3. Restart WordPress**
   ```bash
   npx wp-env stop
   npx wp-env start
   ```

**4. Verify in Different Browser**
   - Try Chrome, Firefox, or Safari
   - Sometimes browser extensions interfere

**5. Check Classic vs Block Editor**
   - Make sure you're using the Block Editor (Gutenberg)
   - Not the Classic Editor

## 🎉 Success Indicators

You'll know it's working when you see:

1. **In Block Inserter:** A "DesignSetGo" category with the layout icon
2. **In Search:** Typing "container" shows the Container block
3. **In Editor:** The block has controls in the right sidebar
4. **On Frontend:** The block renders with your chosen layout

## 📚 Next Steps

Once you confirm you can see and insert the block:

1. **Experiment with layouts** - Try Flexbox, Grid, Auto-Grid
2. **Add inner blocks** - Put headings, images, paragraphs inside
3. **Test responsive** - Use the hide on device options
4. **Try different HTML tags** - Section, Article, Header, etc.
5. **Check the frontend** - Preview to see how it renders

## 💡 Pro Tips

- **Search is fastest:** Just type "container" in the block inserter
- **Slash commands:** Type `/container` for quick insertion
- **Block toolbar:** Use the toolbar icons for quick access to common options
- **Sidebar settings:** Use the right sidebar for detailed customization

---

**Need more help?** Check [HOW-TO-USE.md](HOW-TO-USE.md) for detailed usage instructions!
