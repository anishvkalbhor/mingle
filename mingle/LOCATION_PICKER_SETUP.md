# Location Picker Setup

## MapTiler API Key Setup

The location picker feature requires a MapTiler API key for geocoding and map tiles.

### Steps to get your API key:

1. Go to [MapTiler](https://www.maptiler.com/)
2. Sign up for a free account
3. Go to your account dashboard
4. Copy your API key

### Environment Setup:

Create a `.env.local` file in the root directory with:

```
NEXT_PUBLIC_MAPTILER_KEY=your_actual_api_key_here
```

### Features:

✅ **Search Locations**: Type any city, state, or location name
✅ **Click on Map**: Click anywhere on the map to select the nearest city
✅ **Reverse Geocoding**: Automatically detects the location name from coordinates
✅ **Multiple Map Styles**: Streets, Satellite, Terrain, Hybrid
✅ **Responsive Design**: Works on mobile and desktop

### How to Use:

1. Click the map pin icon next to the location input field
2. Search for a location or click on the map
3. The selected location will be automatically detected
4. Click "Confirm Location" to save

### Technical Details:

- Uses MapTiler's geocoding API for location search
- Uses MapTiler's reverse geocoding for map clicks
- Built with React Leaflet for the interactive map
- Supports all major browsers and devices 