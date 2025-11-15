#!/bin/bash

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Configuration
SVN_URL="${svn_location}/assets"
SVN_USER="${wordpress_svn_user}"
SVN_PASS="${wordpress_svn_password}"
TEMP_DIR="/tmp/designsetgo-svn-assets"

echo "🚀 Pushing screenshots to WordPress.org SVN..."
echo "SVN URL: $SVN_URL"
echo "User: $SVN_USER"
echo ""

# Clean up any existing temp directory
rm -rf "$TEMP_DIR"

# Checkout the assets folder
echo "📦 Checking out SVN assets folder..."
svn checkout "$SVN_URL" "$TEMP_DIR" --username "$SVN_USER" --password "$SVN_PASS" --non-interactive --trust-server-cert

if [ $? -ne 0 ]; then
    echo "❌ Failed to checkout SVN repository"
    exit 1
fi

cd "$TEMP_DIR"

# Copy updated screenshots
echo ""
echo "📸 Copying updated screenshots..."
cp -v "$OLDPWD/assets/screenshot-2.png" .
cp -v "$OLDPWD/assets/screenshot-4.gif" .
cp -v "$OLDPWD/assets/screenshot-8.png" .

# Remove old screenshot-4.png if it exists
if [ -f "screenshot-4.png" ]; then
    echo "🗑️  Removing old screenshot-4.png..."
    svn delete screenshot-4.png
fi

# Add new files to SVN
echo ""
echo "➕ Adding new files to SVN..."
svn add --force screenshot-*.{png,gif} 2>/dev/null

# Show status
echo ""
echo "📊 SVN Status:"
svn status

# Commit changes
echo ""
read -p "Ready to commit? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "💾 Committing to SVN..."
    svn commit -m "Update plugin screenshots" --username "$SVN_USER" --password "$SVN_PASS" --non-interactive

    if [ $? -eq 0 ]; then
        echo "✅ Successfully pushed screenshots to WordPress.org!"
    else
        echo "❌ Failed to commit to SVN"
        exit 1
    fi
else
    echo "❌ Commit cancelled"
    exit 1
fi

# Cleanup
cd "$OLDPWD"
rm -rf "$TEMP_DIR"

echo ""
echo "🎉 Done! Your screenshots are now live on WordPress.org"
echo "View them at: https://wordpress.org/plugins/designsetgo/"
