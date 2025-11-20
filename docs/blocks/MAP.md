# Map Block - User Guide

**Version**: 1.0.0
**Category**: Widgets
**Keywords**: map, location, address, openstreetmap, google maps, directions

## Overview

The **Map Block** displays interactive maps using OpenStreetMap (free, no API key) or Google Maps. Perfect for showing business locations, event venues, or any geographic information. Features GDPR-compliant privacy mode and customizable markers.

**Key Features:**
- Free OpenStreetMap or Google Maps (requires API key)
- Address search with automatic geocoding
- Privacy mode with user consent (GDPR-compliant)
- Customizable markers and colors
- Responsive aspect ratios or custom heights
- Google Maps styling options (Standard, Silver, Dark)

## Quick Start

1. Insert the **Map** block into your page or post.
2. Choose **Map Provider** (OpenStreetMap or Google Maps).
3. Enter an address in **Search Address** and click **Search Address** button.
4. Adjust **Zoom Level** as needed (1 = world, 20 = street level).
5. Customize appearance (height, marker, colors).

## Settings & Configuration

### Map Provider
- **OpenStreetMap**: Free, no API key required, privacy-friendly.
- **Google Maps**: Requires API key (configure in Settings > DesignSetGo).

### Location
- **Search Address**: Enter location name or address for automatic coordinates.
- **Latitude/Longitude**: Manual coordinate entry (-90 to 90, -180 to 180).
- **Zoom Level**: 1-20 (1 = world view, 20 = street level).

### Marker
- **Marker Icon**: Emoji or character (default: 📍).
- **Marker Color**: Set color via sidebar color picker.

### Appearance
- **Aspect Ratio**: 16:9, 4:3, 1:1, or Custom Height.
- **Map Height**: Custom height in px, %, or vh (when Aspect Ratio is Custom).
- **Map Style** (Google Maps only): Standard, Silver, or Dark Mode.

### Privacy
- **Enable Privacy Mode**: Map won't load until user clicks to consent.
- **Privacy Notice**: Custom message shown before loading (GDPR-compliant).

## Common Use Cases

### 1. Business Location
Use **OpenStreetMap** with address search. Set zoom to 15-17 for neighborhood view.

### 2. Event Venue
Use **Google Maps** with Dark Mode style for modern look. Enable privacy mode for GDPR compliance.

### 3. Contact Page
Use **Privacy Mode** to comply with privacy regulations. Customize privacy notice to match your brand.

### 4. Store Locator
Use custom marker icon and brand color. Set aspect ratio to 16:9 for widescreen displays.

## Best Practices

**DO:**
- Use OpenStreetMap by default (no API key, privacy-friendly).
- Enable privacy mode for EU/GDPR compliance.
- Use address search instead of manual coordinates.
- Set zoom level 13-15 for city view, 15-17 for street view.

**DON'T:**
- Forget to configure Google Maps API key if using Google Maps.
- Set zoom too low (world view) or too high (extreme close-up).
- Disable privacy mode on public sites without user consent.

## Accessibility

- **Keyboard Navigation**: Map supports standard browser keyboard controls.
- **Screen Reader**: Map announces location coordinates and provider.
- **Privacy Mode**: Clear button and notice ensure informed consent.

## Google Maps Setup

1. Go to **Settings > DesignSetGo > Integrations**.
2. Enter your **Google Maps API Key**.
3. In Google Cloud Console, restrict API key by HTTP referrer for security.

For API key creation: [Google Maps Platform](https://developers.google.com/maps/documentation/javascript/get-api-key)
