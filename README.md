# Titanium

A sleek UI + visual layer for Cesium.js.

## Milestone 0
- Cesium Viewer with a time-dynamic demo track
- Minimal Titanium playback controls (play/pause, speed, jump, rewind/fast-forward)
- Timeline scrubber with time readout
- Optional track-entity camera follow
- Scene mode toggle (3D / 2D / 2.5D)
- Stylized rendering toggles (toon + edge)

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
- Uses OpenStreetMap tiles by default. No API keys required.
- Cesium remains the rendering engine; Titanium wraps UI and control logic.
