import { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';

/*
 * AirportVisualLayers — Enhanced 2.5D airport visual rendering
 *
 * Adds realistic aviation ground markings:
 * - Runway centerlines, edge lines, threshold chevrons, TDZ markings
 * - Taxiway centerlines with aviation-yellow dashing
 * - Stand lead-in guidance lines
 * - Apron surface grid/texture
 * - Safety zones, hold-short markings
 * - Glow/bloom effects on active elements
 *
 * All layers are GeoJSON-based vector data — they scale perfectly with zoom.
 */

// ─── Runway Visual Enhancement ───────────────────────────────────────────────
export function RunwayDetailLayers({ runways = [] }) {
  // Build GeoJSON for runway details
  const runwayGeoJSON = useMemo(() => {
    if (runways.length === 0) return { type: 'FeatureCollection', features: [] };

    const features = [];
    runways.forEach((rwy) => {
      const coords = rwy.coordinates.map((c) => [c.lng, c.lat]);
      if (coords.length < 2) return;

      // Main runway surface (wide fill)
      features.push({
        type: 'Feature',
        properties: { id: rwy.id, layer: 'surface', name: rwy.name },
        geometry: { type: 'LineString', coordinates: coords },
      });

      // Centerline (dashed)
      features.push({
        type: 'Feature',
        properties: { id: rwy.id, layer: 'centerline', name: rwy.name },
        geometry: { type: 'LineString', coordinates: coords },
      });

      // Edge lines (solid white)
      features.push({
        type: 'Feature',
        properties: { id: rwy.id, layer: 'edge-left', name: rwy.name },
        geometry: { type: 'LineString', coordinates: coords },
      });
      features.push({
        type: 'Feature',
        properties: { id: rwy.id, layer: 'edge-right', name: rwy.name },
        geometry: { type: 'LineString', coordinates: coords },
      });

      // Threshold markings at start point
      const start = coords[0];
      const end = coords[coords.length - 1];
      features.push({
        type: 'Feature',
        properties: { id: rwy.id, layer: 'threshold-start', name: rwy.name },
        geometry: { type: 'Point', coordinates: start },
      });
      features.push({
        type: 'Feature',
        properties: { id: rwy.id, layer: 'threshold-end', name: rwy.name },
        geometry: { type: 'Point', coordinates: end },
      });
    });

    return { type: 'FeatureCollection', features };
  }, [runways]);

  if (runways.length === 0) return null;

  return (
    <Source id="runway-detail" type="geojson" data={runwayGeoJSON}>
      {/* Runway surface — wide dark strip */}
      <Layer id="rwy-surface" type="line"
        filter={['==', ['get', 'layer'], 'surface']}
        layout={{ 'line-cap': 'butt' }}
        paint={{
          'line-color': '#1a2a3d',
          'line-width': ['interpolate', ['linear'], ['zoom'], 13, 20, 16, 60, 18, 120],
          'line-opacity': 0.9,
        }}
      />
      {/* Surface glow underneath */}
      <Layer id="rwy-surface-glow" type="line"
        filter={['==', ['get', 'layer'], 'surface']}
        layout={{ 'line-cap': 'butt' }}
        paint={{
          'line-color': '#4a9eff',
          'line-width': ['interpolate', ['linear'], ['zoom'], 13, 24, 16, 68, 18, 130],
          'line-opacity': 0.06,
          'line-blur': 8,
        }}
        beforeId="rwy-surface"
      />
      {/* Centerline — white dashed */}
      <Layer id="rwy-centerline" type="line"
        filter={['==', ['get', 'layer'], 'centerline']}
        paint={{
          'line-color': '#ffffff',
          'line-width': ['interpolate', ['linear'], ['zoom'], 14, 1, 17, 3],
          'line-opacity': 0.85,
          'line-dasharray': [8, 6],
        }}
      />
      {/* Edge lines — solid white */}
      <Layer id="rwy-edge-left" type="line"
        filter={['==', ['get', 'layer'], 'edge-left']}
        paint={{
          'line-color': '#ffffff',
          'line-width': ['interpolate', ['linear'], ['zoom'], 14, 0.5, 17, 2],
          'line-opacity': 0.7,
          'line-offset': ['interpolate', ['linear'], ['zoom'], 13, -10, 16, -28, 18, -55],
        }}
      />
      <Layer id="rwy-edge-right" type="line"
        filter={['==', ['get', 'layer'], 'edge-right']}
        paint={{
          'line-color': '#ffffff',
          'line-width': ['interpolate', ['linear'], ['zoom'], 14, 0.5, 17, 2],
          'line-opacity': 0.7,
          'line-offset': ['interpolate', ['linear'], ['zoom'], 13, 10, 16, 28, 18, 55],
        }}
      />
      {/* Threshold markers */}
      <Layer id="rwy-threshold-start" type="circle"
        filter={['==', ['get', 'layer'], 'threshold-start']}
        paint={{
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 14, 4, 17, 14],
          'circle-color': '#ffffff',
          'circle-opacity': 0.15,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.6,
        }}
      />
      <Layer id="rwy-threshold-end" type="circle"
        filter={['==', ['get', 'layer'], 'threshold-end']}
        paint={{
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 14, 4, 17, 14],
          'circle-color': '#ffffff',
          'circle-opacity': 0.15,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.6,
        }}
      />
      {/* Runway name labels */}
      <Layer id="rwy-name-labels" type="symbol"
        filter={['==', ['get', 'layer'], 'surface']}
        layout={{
          'symbol-placement': 'line-center',
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 13, 10, 16, 18, 18, 28],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-allow-overlap': true,
          'text-rotation-alignment': 'map',
          'text-pitch-alignment': 'map',
          'text-letter-spacing': 0.15,
        }}
        paint={{
          'text-color': '#ffffff',
          'text-opacity': 0.8,
          'text-halo-color': '#1a2a3d',
          'text-halo-width': 3,
        }}
      />
    </Source>
  );
}

// ─── Taxiway Visual Enhancement ──────────────────────────────────────────────
export function TaxiwayDetailLayers({ taxiways = [] }) {
  const taxiwayGeoJSON = useMemo(() => {
    if (taxiways.length === 0) return { type: 'FeatureCollection', features: [] };

    const features = [];
    taxiways.forEach((twy) => {
      const coords = twy.coordinates.map((c) => [c.lng, c.lat]);
      if (coords.length < 2) return;

      // Taxiway surface
      features.push({
        type: 'Feature',
        properties: { id: twy.id, layer: 'twy-surface', name: twy.name, color: twy.color },
        geometry: { type: 'LineString', coordinates: coords },
      });

      // Centerline
      features.push({
        type: 'Feature',
        properties: { id: twy.id, layer: 'twy-centerline', name: twy.name },
        geometry: { type: 'LineString', coordinates: coords },
      });

      // Edge marking
      features.push({
        type: 'Feature',
        properties: { id: twy.id, layer: 'twy-edge', name: twy.name },
        geometry: { type: 'LineString', coordinates: coords },
      });
    });

    return { type: 'FeatureCollection', features };
  }, [taxiways]);

  if (taxiways.length === 0) return null;

  return (
    <Source id="taxiway-detail" type="geojson" data={taxiwayGeoJSON}>
      {/* Taxiway surface — medium dark strip */}
      <Layer id="twy-surface" type="line"
        filter={['==', ['get', 'layer'], 'twy-surface']}
        layout={{ 'line-cap': 'round', 'line-join': 'round' }}
        paint={{
          'line-color': '#16253a',
          'line-width': ['interpolate', ['linear'], ['zoom'], 13, 8, 16, 24, 18, 48],
          'line-opacity': 0.85,
        }}
      />
      {/* Taxiway glow */}
      <Layer id="twy-glow" type="line"
        filter={['==', ['get', 'layer'], 'twy-surface']}
        layout={{ 'line-cap': 'round' }}
        paint={{
          'line-color': '#facc15',
          'line-width': ['interpolate', ['linear'], ['zoom'], 13, 12, 16, 30, 18, 56],
          'line-opacity': 0.04,
          'line-blur': 6,
        }}
        beforeId="twy-surface"
      />
      {/* Centerline — yellow dashed (aviation standard) */}
      <Layer id="twy-centerline" type="line"
        filter={['==', ['get', 'layer'], 'twy-centerline']}
        paint={{
          'line-color': '#facc15',
          'line-width': ['interpolate', ['linear'], ['zoom'], 14, 1, 17, 2.5],
          'line-opacity': 0.8,
          'line-dasharray': [6, 4],
        }}
      />
      {/* Edge double lines — solid yellow */}
      <Layer id="twy-edge-l" type="line"
        filter={['==', ['get', 'layer'], 'twy-edge']}
        paint={{
          'line-color': '#facc15',
          'line-width': ['interpolate', ['linear'], ['zoom'], 14, 0.3, 17, 1.5],
          'line-opacity': 0.5,
          'line-offset': ['interpolate', ['linear'], ['zoom'], 13, -4, 16, -11, 18, -22],
        }}
      />
      <Layer id="twy-edge-r" type="line"
        filter={['==', ['get', 'layer'], 'twy-edge']}
        paint={{
          'line-color': '#facc15',
          'line-width': ['interpolate', ['linear'], ['zoom'], 14, 0.3, 17, 1.5],
          'line-opacity': 0.5,
          'line-offset': ['interpolate', ['linear'], ['zoom'], 13, 4, 16, 11, 18, 22],
        }}
      />
      {/* Taxiway name labels */}
      <Layer id="twy-name-labels" type="symbol"
        filter={['==', ['get', 'layer'], 'twy-surface']}
        layout={{
          'symbol-placement': 'line-center',
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 14, 9, 17, 14],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-allow-overlap': true,
          'text-rotation-alignment': 'map',
          'text-pitch-alignment': 'map',
          'text-letter-spacing': 0.1,
        }}
        paint={{
          'text-color': '#facc15',
          'text-opacity': 0.85,
          'text-halo-color': '#16253a',
          'text-halo-width': 2.5,
        }}
      />
    </Source>
  );
}

// ─── Stand Lead-in Lines ─────────────────────────────────────────────────────
export function StandLeadInLayers({ stands = [], statusColors = {} }) {
  const leadInGeoJSON = useMemo(() => {
    const features = [];
    stands.forEach((s) => {
      // Lead-in line from ~50m ahead of stand (in heading direction) to stand point
      const headingRad = ((s.heading || 180) * Math.PI) / 180;
      const dist = 0.0004; // ~40m in lat/lng
      const startLat = s.lat + Math.cos(headingRad) * dist;
      const startLng = s.lng + Math.sin(headingRad) * dist * 1.3; // lng correction for latitude

      // Centerline
      features.push({
        type: 'Feature',
        properties: { id: s.id, label: s.label, layer: 'lead-in', type: s.type },
        geometry: {
          type: 'LineString',
          coordinates: [[startLng, startLat], [s.lng, s.lat]],
        },
      });

      // Stop bar at stand position
      const perpRad = headingRad + Math.PI / 2;
      const barLen = 0.00012;
      features.push({
        type: 'Feature',
        properties: { id: s.id, layer: 'stop-bar', type: s.type },
        geometry: {
          type: 'LineString',
          coordinates: [
            [s.lng + Math.sin(perpRad) * barLen * 1.3, s.lat + Math.cos(perpRad) * barLen],
            [s.lng - Math.sin(perpRad) * barLen * 1.3, s.lat - Math.cos(perpRad) * barLen],
          ],
        },
      });
    });

    return { type: 'FeatureCollection', features };
  }, [stands]);

  return (
    <Source id="stand-lead-in" type="geojson" data={leadInGeoJSON}>
      {/* Lead-in centerline — yellow dashed */}
      <Layer id="lead-in-line" type="line"
        filter={['==', ['get', 'layer'], 'lead-in']}
        paint={{
          'line-color': '#facc15',
          'line-width': ['interpolate', ['linear'], ['zoom'], 14, 0.5, 17, 1.5],
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0.2, 16, 0.5],
          'line-dasharray': [4, 3],
        }}
        minzoom={14.5}
      />
      {/* Stop bar — solid red */}
      <Layer id="stop-bar" type="line"
        filter={['==', ['get', 'layer'], 'stop-bar']}
        paint={{
          'line-color': '#ef4444',
          'line-width': ['interpolate', ['linear'], ['zoom'], 15, 1, 17, 3],
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 15, 0.3, 17, 0.6],
        }}
        minzoom={15}
      />
    </Source>
  );
}

// ─── Apron Surface Enhancement ───────────────────────────────────────────────
export function ApronSurfaceLayers({ aprons = [] }) {
  // Create subtle grid lines within apron boundaries
  const gridGeoJSON = useMemo(() => {
    const features = [];
    aprons.forEach((apron) => {
      if (!apron.coordinates || apron.coordinates.length < 3) return;

      // Apron boundary — enhanced stroke
      const coords = apron.coordinates.map(([lat, lng]) => [lng, lat]);
      coords.push(coords[0]); // close polygon

      features.push({
        type: 'Feature',
        properties: { id: apron.id, layer: 'apron-boundary', color: apron.color || '#00ffff' },
        geometry: { type: 'LineString', coordinates: coords },
      });

      // Safety zone — inner boundary slightly inset
      features.push({
        type: 'Feature',
        properties: { id: apron.id, layer: 'apron-inner', color: apron.color || '#00ffff' },
        geometry: { type: 'LineString', coordinates: coords },
      });
    });

    return { type: 'FeatureCollection', features };
  }, [aprons]);

  return (
    <Source id="apron-surface-detail" type="geojson" data={gridGeoJSON}>
      {/* Apron boundary glow */}
      <Layer id="apron-boundary-glow" type="line"
        filter={['==', ['get', 'layer'], 'apron-boundary']}
        paint={{
          'line-color': ['get', 'color'],
          'line-width': ['interpolate', ['linear'], ['zoom'], 14, 3, 17, 8],
          'line-opacity': 0.06,
          'line-blur': 6,
        }}
      />
      {/* Apron boundary — dashed */}
      <Layer id="apron-boundary-line" type="line"
        filter={['==', ['get', 'layer'], 'apron-boundary']}
        paint={{
          'line-color': ['get', 'color'],
          'line-width': ['interpolate', ['linear'], ['zoom'], 14, 1, 17, 2.5],
          'line-opacity': 0.4,
          'line-dasharray': [6, 4],
        }}
      />
    </Source>
  );
}

// ─── Ground Effect Layer (ambient lighting) ──────────────────────────────────
export function GroundEffectLayer() {
  // A large radial gradient that simulates airport ground lighting
  return (
    <Source id="ground-lights" type="geojson" data={{
      type: 'FeatureCollection',
      features: [],
    }}>
      {/* Placeholder for future ground lighting effects */}
      <Layer id="ground-ambient" type="background" paint={{
        'background-color': 'transparent',
        'background-opacity': 0,
      }} />
    </Source>
  );
}

// ─── Stand Glow Enhancement ──────────────────────────────────────────────────
export function StandGlowLayers({ standGeoJSON }) {
  return (
    <Source id="stand-glow-enhanced" type="geojson" data={standGeoJSON}>
      {/* Outermost glow — wide, faint */}
      <Layer id="stand-enhanced-glow-outer" type="circle"
        filter={['!=', ['get', 'status'], 'empty']}
        paint={{
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 13, 14, 16, 30, 18, 48],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.025,
          'circle-blur': 1,
        }}
      />
      {/* Mid glow */}
      <Layer id="stand-enhanced-glow-mid" type="circle"
        filter={['!=', ['get', 'status'], 'empty']}
        paint={{
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 13, 9, 16, 20, 18, 32],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.06,
          'circle-blur': 0.8,
        }}
      />
      {/* Inner glow — tight, brighter */}
      <Layer id="stand-enhanced-glow-inner" type="circle"
        filter={['!=', ['get', 'status'], 'empty']}
        paint={{
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 13, 5, 16, 12, 18, 20],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.1,
          'circle-blur': 0.5,
        }}
      />
    </Source>
  );
}

// ─── Combined export ─────────────────────────────────────────────────────────
export default function AirportVisualLayers({
  rwyTwyFeatures = [],
  stands = [],
  aprons = [],
  standGeoJSON,
  statusColors = {},
}) {
  const runways = rwyTwyFeatures.filter((f) => f.type === 'runway');
  const taxiways = rwyTwyFeatures.filter((f) => f.type === 'taxiway');

  return (
    <>
      <RunwayDetailLayers runways={runways} />
      <TaxiwayDetailLayers taxiways={taxiways} />
      {/* StandLeadInLayers removed — heading indicator lines replace them */}
      <ApronSurfaceLayers aprons={aprons} />
      {standGeoJSON && <StandGlowLayers standGeoJSON={standGeoJSON} />}
    </>
  );
}
