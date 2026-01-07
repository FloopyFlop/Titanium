# Titanium

A sleek UI + visual layer for Cesium.js.

## Demo highlights
- Blue vs red/orange air activity with mixed solid and dotted trails
- Dual base stations with pulsing radar rings and rotating sweeps
- Missile launch sequence with timed impact flash and shockwave rays
- Ground convoys, launchers, and tracking beams
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
