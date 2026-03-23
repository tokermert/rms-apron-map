import { Polygon } from 'react-leaflet';

// Esenboğa Airport approximate boundary
const AIRPORT_BOUNDARY = [
  [40.1380, 32.9750],
  [40.1380, 33.0150],
  [40.1180, 33.0150],
  [40.1180, 32.9750],
];

// World bounds (inverted polygon - covers everything EXCEPT the airport)
const WORLD_BOUNDS = [
  [90, -180],
  [90, 180],
  [-90, 180],
  [-90, -180],
];

export default function AirportMask({ visible }) {
  if (!visible) return null;

  return (
    <Polygon
      positions={[WORLD_BOUNDS, AIRPORT_BOUNDARY]}
      pathOptions={{
        fillColor: '#050508',
        fillOpacity: 0.82,
        stroke: true,
        color: '#00ffff',
        weight: 1.5,
        opacity: 0.4,
        dashArray: '8, 6',
        className: 'neon-polygon-cyan',
      }}
    />
  );
}
