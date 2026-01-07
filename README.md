# Titanium

A sleek UI + visual layer for Cesium.js.

## Demo highlights
- Blue vs red/orange air activity with mixed solid and dotted trails
- Multiple base stations with pulsing rings and rotating radar sweeps
- Multi-missile launches with impact bursts and mid-air intercepts
- Ground convoys, launchers, and blue/enemy ship fleets
- Minimal Titanium playback + scene controls
- Enemy palette selector (red/orange) in the Visuals panel

## Local development
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Notes
- Uses CARTO dark tiles by default, with automatic fallback to OpenStreetMap. No API keys required.
- Cesium remains the rendering engine; Titanium wraps UI and control logic.
