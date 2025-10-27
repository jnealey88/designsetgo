#!/bin/bash
#
# Prepare WordPress.org Assets
# This script converts JPG screenshots to PNG and renames them properly
#

echo "🎨 Preparing WordPress.org Assets..."
echo ""

cd "$(dirname "$0")/images"

# Check if ImageMagick is available (for conversion)
if ! command -v convert &> /dev/null; then
    echo "⚠️  ImageMagick not found. Installing via Homebrew..."
    brew install imagemagick
fi

echo "📸 Converting and renaming screenshots..."

# Convert and rename screenshots
# Order them logically for WordPress.org display

# Screenshot 1: Container blocks (most impressive)
if [ -f "container-blocks.jpg" ]; then
    convert "container-blocks.jpg" "screenshot-1.png"
    echo "✅ Created screenshot-1.png (Container Blocks)"
fi

# Screenshot 2: Tabs block
if [ -f "tabs.jpg" ]; then
    convert "tabs.jpg" "screenshot-2.png"
    echo "✅ Created screenshot-2.png (Tabs Block)"
fi

# Screenshot 3: Accordion block
if [ -f "Accordion.jpg" ]; then
    convert "Accordion.jpg" "screenshot-3.png"
    echo "✅ Created screenshot-3.png (Accordion Block)"
fi

# Screenshot 4: Counter block
if [ -f "counter.jpg" ]; then
    convert "counter.jpg" "screenshot-4.png"
    echo "✅ Created screenshot-4.png (Counter Block)"
fi

# Screenshot 5: Icons
if [ -f "icons.jpg" ]; then
    convert "icons.jpg" "screenshot-5.png"
    echo "✅ Created screenshot-5.png (Icon Block)"
fi

# Screenshot 6: Progress bars
if [ -f "progress.jpg" ]; then
    convert "progress.jpg" "screenshot-6.png"
    echo "✅ Created screenshot-6.png (Progress Bar)"
fi

# Screenshot 7: Animations
if [ -f "animations.jpg" ]; then
    convert "animations.jpg" "screenshot-7.png"
    echo "✅ Created screenshot-7.png (Animations)"
fi

echo ""
echo "📊 File sizes:"
ls -lh screenshot-*.png 2>/dev/null | awk '{print $9, $5}'

echo ""
echo "✨ Done! Screenshots converted to PNG format."
echo ""
echo "⚠️  Next steps:"
echo "1. Optimize banners at https://tinypng.com/"
echo "   - banner-1544x500.png (currently 368K, should be <200K)"
echo "   - banner-772x250.png (currently 122K, should be <100K)"
echo ""
echo "2. Optional: Optimize screenshots at https://tinypng.com/"
echo "   (They're currently around 300-500K each, which is acceptable)"
echo ""
