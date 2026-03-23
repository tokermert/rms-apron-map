import { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { Map, Source, Layer, Popup, Marker, NavigationControl, ScaleControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { standDefinitions, mockFlightData, STATUS_COLORS, STATUS_LABELS, terminalDefinitions, AIRCRAFT_TYPE_SVGS, AIRCRAFT_CODE_MAP } from '../../data/esenboğaStands';
import AirportVisualLayers from './AirportVisualLayers';

const ESENBOGA_CENTER = { longitude: 32.9990, latitude: 40.1258 };
const DEFAULT_ZOOM = 15.5;
const DEFAULT_PITCH = 45;
const DEFAULT_BEARING = -30;

const MAP_STYLES = {
  dark: { url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' },
  positron: { url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' },
  satellite: {
    style: {
      version: 8,
      sources: { 'satellite-tiles': { type: 'raster', tiles: ['https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'], tileSize: 256, maxzoom: 21 } },
      layers: [{ id: 'satellite-layer', type: 'raster', source: 'satellite-tiles', minzoom: 0, maxzoom: 22 }],
    },
  },
  googleHybrid: {
    style: {
      version: 8,
      sources: { 'google-hybrid': { type: 'raster', tiles: ['https://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'], tileSize: 256, maxzoom: 21 } },
      layers: [{ id: 'google-hybrid-layer', type: 'raster', source: 'google-hybrid', minzoom: 0, maxzoom: 22 }],
    },
  },
  esriSat: {
    style: {
      version: 8,
      sources: { 'esri-tiles': { type: 'raster', tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, maxzoom: 19 } },
      layers: [{ id: 'esri-sat-layer', type: 'raster', source: 'esri-tiles', minzoom: 0, maxzoom: 22 }],
    },
  },
  voyager: { url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json' },
  osmRaster: {
    style: {
      version: 8,
      sources: { 'osm-raster-tiles': { type: 'raster', tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', 'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, maxzoom: 19 } },
      layers: [{ id: 'osm-raster-layer', type: 'raster', source: 'osm-raster-tiles', minzoom: 0, maxzoom: 22 }],
    },
  },
};

/* ─── Aircraft SVG (top-down silhouette) ─── */
const AIRCRAFT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
  <g fill="COLOR" fill-opacity="0.9" stroke="COLOR" stroke-width="0.5" stroke-opacity="0.6">
    <path d="M20 4 L22 14 L34 18 L34 21 L22 19 L22 30 L27 33 L27 35 L20 33 L13 35 L13 33 L18 30 L18 19 L6 21 L6 18 L18 14 Z"/>
  </g>
</svg>`;

function buildApronGeoJSON(aprons) {
  return {
    type: 'FeatureCollection',
    features: aprons.map((apron) => ({
      type: 'Feature',
      properties: { id: apron.id, label: apron.label, color: apron.color, strokeWidth: apron.strokeWidth || 2, strokeOpacity: apron.strokeOpacity || 0.6, fillOpacity: apron.fillOpacity || 0.08 },
      geometry: {
        type: 'Polygon',
        coordinates: [[...apron.coordinates.map(([lat, lng]) => [lng, lat]), [apron.coordinates[0][1], apron.coordinates[0][0]]]],
      },
    })),
  };
}

function buildApronLabelsGeoJSON(aprons) {
  return {
    type: 'FeatureCollection',
    features: aprons.map((apron) => {
      const cLat = apron.coordinates.reduce((s, c) => s + c[0], 0) / apron.coordinates.length;
      const cLng = apron.coordinates.reduce((s, c) => s + c[1], 0) / apron.coordinates.length;
      return { type: 'Feature', properties: { label: apron.label }, geometry: { type: 'Point', coordinates: [cLng, cLat] } };
    }),
  };
}

function buildApronHandlesGeoJSON(aprons, selectedApronId) {
  if (!selectedApronId) return { type: 'FeatureCollection', features: [] };
  const apron = aprons.find((a) => a.id === selectedApronId);
  if (!apron) return { type: 'FeatureCollection', features: [] };
  return {
    type: 'FeatureCollection',
    features: apron.coordinates.map(([lat, lng], i) => ({
      type: 'Feature',
      properties: { apronId: apron.id, vertexIndex: i, color: apron.color },
      geometry: { type: 'Point', coordinates: [lng, lat] },
    })),
  };
}

function buildStandGeoJSON(stands, colors, labels) {
  const flightMap = {};
  mockFlightData.forEach((f) => { flightMap[f.standId] = f; });
  const sc = colors || STATUS_COLORS;
  const sl = labels || STATUS_LABELS;
  return {
    type: 'FeatureCollection',
    features: stands.map((stand) => {
      const flight = flightMap[stand.id];
      const status = flight ? flight.status : 'empty';
      const color = sc[status] || sc.empty || '#1e293b';
      return {
        type: 'Feature',
        properties: {
          id: stand.id, label: stand.label, apron: stand.apron, type: stand.type,
          heading: stand.heading, status, color, hasAircraft: !!flight,
          callsign: flight?.callsign || '', airline: flight?.airline || '',
          aircraftType: flight?.aircraftType || '', registration: flight?.registration || '',
          origin: flight?.origin || '', destination: flight?.destination || '',
          sta: flight?.sta || '', std: flight?.std || '',
          eta: flight?.eta || '', etd: flight?.etd || '',
          progress: flight?.progress || 0, turnaround: flight?.turnaround || 0,
          statusLabel: sl[status] || status,
        },
        geometry: { type: 'Point', coordinates: [stand.lng, stand.lat] },
      };
    }),
  };
}

function buildTerminalLabelsGeoJSON() {
  return {
    type: 'FeatureCollection',
    features: terminalDefinitions.map((t) => ({
      type: 'Feature',
      properties: { label: t.label, id: t.id },
      geometry: { type: 'Point', coordinates: [t.lng, t.lat] },
    })),
  };
}

function calcDelay(scheduled, estimated) {
  if (!scheduled || !estimated) return null;
  const [sh, sm] = scheduled.split(':').map(Number);
  const [eh, em] = estimated.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

// Build heading indicator lines from each stand
function buildStandHeadingLines(stands) {
  return {
    type: 'FeatureCollection',
    features: stands.map((stand) => {
      const headingRad = ((stand.heading || 0) * Math.PI) / 180;
      const lengthM = stand.leadInLength || 80;
      const dLat = (lengthM * Math.cos(headingRad)) / 111320;
      const dLng = (lengthM * Math.sin(headingRad)) / (111320 * Math.cos((stand.lat * Math.PI) / 180));
      const endLat = stand.lat + dLat;
      const endLng = stand.lng + dLng;
      return {
        type: 'Feature',
        properties: { id: stand.id, heading: stand.heading || 0 },
        geometry: {
          type: 'LineString',
          coordinates: [[stand.lng, stand.lat], [endLng, endLat]],
        },
      };
    }),
  };
}

// Get occupied stands with their flight data for aircraft icons
function getOccupiedStands(stands, colors) {
  const flightMap = {};
  mockFlightData.forEach((f) => { flightMap[f.standId] = f; });
  const sc = colors || STATUS_COLORS;
  return stands
    .filter((s) => flightMap[s.id])
    .map((s) => ({ ...s, flight: flightMap[s.id], color: sc[flightMap[s.id].status] || '#00ffff' }));
}

// Get the right SVG for an aircraft type
function getAircraftSvg(aircraftType) {
  const category = AIRCRAFT_CODE_MAP[aircraftType] || 'narrow-body';
  return AIRCRAFT_TYPE_SVGS[category] || AIRCRAFT_TYPE_SVGS['narrow-body'];
}

// City layer IDs to toggle visibility
// Patterns matched against layer ID only (not source-layer, to avoid hiding aeroway via 'transportation')
const CITY_LAYER_PATTERNS = [
  'building', 'housenumber', 'road', 'highway', 'path', 'rail', 'bridge',
  'tunnel', 'landuse', 'landcover', 'park', 'water_name', 'water-name',
  'place', 'poi', 'boundary', 'mountain', 'country', 'state', 'city',
  'town', 'village', 'continent', 'suburb', 'waterway',
];

export default function MapViewGL({
  tileMode = 'dark', stands, editMode = false,
  statusColors: propStatusColors, statusLabels: propStatusLabels,
  labelOverrides = {}, onLabelOverride,
  addMode = false, onMapClickAdd, onStandSelect, selectedStandId, onStandMove,
  aprons, selectedApronId, onApronSelect, onApronVertexDrag, onApronMove, draggingVertex, onDragStart, onDragEnd,
  overlays = [], selectedOverlayId, onOverlayCornerDrag, onOverlayMove,
  airportConfig, hideCityLayers = false,
  // Runway/Taxiway drawing
  rwyTwyFeatures = [], rwyTwyDrawMode, rwyTwyDrawingPoints = [],
  rwyTwySelectedId, onRwyTwyAddPoint, onRwyTwyVertexDrag,
  // Building drawing
  buildings = [], selectedBuildingId, buildingDrawMode, buildingDrawingPoints = [],
  buildingDraggingVertex, onBuildingAddPoint, onBuildingVertexDrag,
  onBuildingMove, onBuildingSelect, onBuildingDragStart, onBuildingDragEnd,
}) {
  const mapRef = useRef(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const [editingLabel, setEditingLabel] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // ── Intro rotation state ──
  const introRotateRef = useRef(null);
  const userInteractedRef = useRef(false);
  const [introActive, setIntroActive] = useState(true);

  const center = airportConfig?.center || ESENBOGA_CENTER;
  const [viewState, setViewState] = useState({
    longitude: center.longitude, latitude: center.latitude,
    zoom: airportConfig?.defaultZoom || DEFAULT_ZOOM,
    pitch: airportConfig?.defaultPitch || DEFAULT_PITCH,
    bearing: airportConfig?.defaultBearing || DEFAULT_BEARING,
  });

  // ── Start slow rotation on load ──
  useEffect(() => {
    if (!airportConfig) return;
    let bearing = airportConfig.defaultBearing || DEFAULT_BEARING;
    const rotate = () => {
      if (userInteractedRef.current) return;
      bearing += 0.08;
      setViewState((prev) => ({ ...prev, bearing }));
      introRotateRef.current = requestAnimationFrame(rotate);
    };
    // Start rotation after a short delay to let the map load
    const t = setTimeout(() => {
      introRotateRef.current = requestAnimationFrame(rotate);
    }, 800);
    return () => { clearTimeout(t); if (introRotateRef.current) cancelAnimationFrame(introRotateRef.current); };
  }, []);

  // ── Stop rotation on user interaction ──
  const handleUserInteraction = useCallback((evt) => {
    if (!userInteractedRef.current && introActive) {
      userInteractedRef.current = true;
      if (introRotateRef.current) cancelAnimationFrame(introRotateRef.current);
      setIntroActive(false);
    }
    setViewState(evt.viewState);
  }, [introActive]);

  // Fly to airport when config changes
  useEffect(() => {
    if (!airportConfig) return;
    if (userInteractedRef.current) {
      setViewState((prev) => ({
        ...prev,
        longitude: airportConfig.center.longitude,
        latitude: airportConfig.center.latitude,
        zoom: airportConfig.defaultZoom || DEFAULT_ZOOM,
        pitch: airportConfig.defaultPitch || DEFAULT_PITCH,
        bearing: airportConfig.defaultBearing || DEFAULT_BEARING,
      }));
    }
  }, [airportConfig?.icao]);

  // ── Toggle city layers visibility ──
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !map.getStyle) return;
    let style;
    try { style = map.getStyle(); } catch (_) { return; }
    if (!style?.layers) return;

    style.layers.forEach((layer) => {
      const id = layer.id.toLowerCase();
      const srcLayer = (layer['source-layer'] || '').toLowerCase();
      // Never hide our custom aeroway layers
      const isAero = srcLayer === 'aeroway' || id.startsWith('osm-rwy') || id.startsWith('osm-twy') || id.startsWith('osm-aeroway');
      if (isAero) return;
      // Never hide our custom app layers (stands, aprons, routes, etc.)
      const isOurLayer = id.startsWith('stand') || id.startsWith('apron') || id.startsWith('terminal') || id.startsWith('custom') || id.startsWith('rwytwy') || id.startsWith('heading')
        || id === 'building-extrusion' || id === 'building-roof' || id === 'building-outline-2d' || id === 'building-handle-circles' || id === 'building-label-text';
      if (isOurLayer) return;

      // All fill-extrusion layers (3D buildings) should be hidden
      if (layer.type === 'fill-extrusion') {
        try { map.setLayoutProperty(layer.id, 'visibility', hideCityLayers ? 'none' : 'visible'); } catch (_) {}
        return;
      }

      // Also hide any layer whose source-layer is 'building' (2D fills from vector tiles)
      if (srcLayer === 'building') {
        try {
          if (layer.type === 'symbol') {
            map.setLayoutProperty(layer.id, 'visibility', hideCityLayers ? 'none' : 'visible');
          } else {
            const opProp = layer.type === 'fill' ? 'fill-opacity' : layer.type === 'line' ? 'line-opacity' : null;
            if (opProp) map.setPaintProperty(layer.id, opProp, hideCityLayers ? 0 : (layer.paint?.[opProp] || 1));
            else map.setLayoutProperty(layer.id, 'visibility', hideCityLayers ? 'none' : 'visible');
          }
        } catch (_) {}
        return;
      }

      // Transportation source-layer includes roads — hide all non-aeroway transportation
      const isTransportation = srcLayer === 'transportation' || srcLayer === 'transportation_name';
      const isCity = isTransportation || CITY_LAYER_PATTERNS.some((p) => id.includes(p) || srcLayer.includes(p));
      if (!isCity) return;

      try {
        if (layer.type === 'symbol') {
          map.setLayoutProperty(layer.id, 'visibility', hideCityLayers ? 'none' : 'visible');
        } else {
          const opProp = layer.type === 'fill' ? 'fill-opacity' : layer.type === 'line' ? 'line-opacity' : null;
          if (opProp) {
            map.setPaintProperty(layer.id, opProp, hideCityLayers ? 0 : (layer.paint?.[opProp] || 1));
          }
        }
      } catch (_) {}
    });
  }, [hideCityLayers, tileMode, mapLoaded]);

  // Re-run city layer hiding when new style data arrives (tiles loaded async)
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const onStyleData = () => {
      if (!hideCityLayers) return;
      try {
        const style = map.getStyle();
        if (!style?.layers) return;
        style.layers.forEach((layer) => {
          const id = layer.id.toLowerCase();
          const srcLayer = (layer['source-layer'] || '').toLowerCase();
          if (srcLayer !== 'building') return;
          // Skip our custom layers
          if (id === 'building-extrusion' || id === 'building-roof' || id === 'building-outline-2d' || id === 'building-handle-circles' || id === 'building-label-text') return;
          if (layer.type === 'fill-extrusion') {
            map.setLayoutProperty(layer.id, 'visibility', 'none');
          } else if (layer.type === 'fill') {
            map.setPaintProperty(layer.id, 'fill-opacity', 0);
          } else if (layer.type === 'line') {
            map.setPaintProperty(layer.id, 'line-opacity', 0);
          } else if (layer.type === 'symbol') {
            map.setLayoutProperty(layer.id, 'visibility', 'none');
          }
        });
      } catch (_) {}
    };
    map.on('styledata', onStyleData);
    // Run once immediately
    onStyleData();
    return () => map.off('styledata', onStyleData);
  }, [hideCityLayers, mapLoaded]);

  // Register aircraft icon on map load
  const aircraftImageLoaded = useRef(false);

  const standsData = stands || standDefinitions;
  const sc = propStatusColors || STATUS_COLORS;
  const sl = propStatusLabels || STATUS_LABELS;
  const standGeoJSON = useMemo(() => buildStandGeoJSON(standsData, sc, sl), [standsData, sc, sl]);
  const apronGeoJSON = useMemo(() => buildApronGeoJSON(aprons || []), [aprons]);
  const apronLabelsGeoJSON = useMemo(() => buildApronLabelsGeoJSON(aprons || []), [aprons]);
  const apronHandlesGeoJSON = useMemo(() => buildApronHandlesGeoJSON(aprons || [], selectedApronId), [aprons, selectedApronId]);
  const terminalLabelsGeoJSON = useMemo(() => buildTerminalLabelsGeoJSON(), []);
  const occupiedStands = useMemo(() => getOccupiedStands(standsData, sc), [standsData, sc]);
  const standHeadingLinesGeoJSON = useMemo(() => buildStandHeadingLines(standsData), [standsData]);

  const customLabelsGeoJSON = useMemo(() => ({
    type: 'FeatureCollection',
    features: Object.entries(labelOverrides).map(([key, data]) => ({
      type: 'Feature',
      properties: { label: data.text, featureKey: key, class: data.class },
      geometry: { type: 'Point', coordinates: [data.lng, data.lat] },
    })),
  }), [labelOverrides]);

  // Custom runway/taxiway GeoJSON
  const rwyTwyGeoJSON = useMemo(() => ({
    type: 'FeatureCollection',
    features: rwyTwyFeatures.map((f) => ({
      type: 'Feature',
      properties: { id: f.id, name: f.name, type: f.type, color: f.color, width: f.width, opacity: f.opacity },
      geometry: { type: 'LineString', coordinates: f.coordinates.map((c) => [c.lng, c.lat]) },
    })),
  }), [rwyTwyFeatures]);

  const rwyTwyLabelsGeoJSON = useMemo(() => ({
    type: 'FeatureCollection',
    features: rwyTwyFeatures.map((f) => {
      const mid = Math.floor(f.coordinates.length / 2);
      const c = f.coordinates[mid];
      return {
        type: 'Feature',
        properties: { name: f.name, type: f.type },
        geometry: { type: 'Point', coordinates: [c.lng, c.lat] },
      };
    }),
  }), [rwyTwyFeatures]);

  // Drawing preview line
  const drawPreviewGeoJSON = useMemo(() => {
    if (!rwyTwyDrawMode || rwyTwyDrawingPoints.length === 0) return null;
    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: { type: rwyTwyDrawMode },
        geometry: { type: 'LineString', coordinates: rwyTwyDrawingPoints.map((c) => [c.lng, c.lat]) },
      }],
    };
  }, [rwyTwyDrawMode, rwyTwyDrawingPoints]);

  // ── Building GeoJSON ──
  // Helper: hex color + opacity → rgba string for data-driven fill-extrusion-color
  const hexToRGBA = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
  };

  const buildingGeoJSON = useMemo(() => ({
    type: 'FeatureCollection',
    features: buildings.map((b) => ({
      type: 'Feature',
      properties: {
        id: b.id, name: b.name, height: b.height, baseHeight: b.baseHeight || 0,
        color: hexToRGBA(b.color, b.opacity ?? 0.85),
        roofColor: hexToRGBA(b.roofColor || b.color, b.opacity ?? 0.85),
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[...b.coordinates.map(([lat, lng]) => [lng, lat]), [b.coordinates[0][1], b.coordinates[0][0]]]],
      },
    })),
  }), [buildings]);

  const buildingHandlesGeoJSON = useMemo(() => {
    if (!selectedBuildingId) return { type: 'FeatureCollection', features: [] };
    const bldg = buildings.find((b) => b.id === selectedBuildingId);
    if (!bldg) return { type: 'FeatureCollection', features: [] };
    return {
      type: 'FeatureCollection',
      features: bldg.coordinates.map(([lat, lng], i) => ({
        type: 'Feature',
        properties: { buildingId: bldg.id, vertexIndex: i },
        geometry: { type: 'Point', coordinates: [lng, lat] },
      })),
    };
  }, [buildings, selectedBuildingId]);

  // Building draw preview polygon
  const buildingDrawPreviewGeoJSON = useMemo(() => {
    if (!buildingDrawMode || buildingDrawingPoints.length < 2) return null;
    const coords = buildingDrawingPoints.map((p) => [p.lng, p.lat]);
    coords.push(coords[0]); // close ring
    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: { type: 'Polygon', coordinates: [coords] },
      }],
    };
  }, [buildingDrawMode, buildingDrawingPoints]);

  const mapStyle = MAP_STYLES[tileMode]?.url || MAP_STYLES[tileMode]?.style || MAP_STYLES.dark.url;

  const addAircraftImage = useCallback((map) => {
    if (aircraftImageLoaded.current) return;
    // We'll use Marker-based approach instead of image sprites for colored aircraft
    aircraftImageLoaded.current = true;
  }, []);

  const handleLoad = useCallback((e) => {
    const map = e.target;
    if (!map || !map.getStyle) return;
    let style;
    try { style = map.getStyle(); } catch (_) { return; }
    if (!style || !style.layers) return;

    // Hide default aeroway layers — we'll render our own enhanced versions
    style.layers.forEach((layer) => {
      const id = layer.id;
      const srcLayer = layer['source-layer'] || '';
      if (id === 'aeroway-runway' || id === 'aeroway-taxiway') {
        try { map.setPaintProperty(id, 'line-opacity', 0); } catch (_) {}
      }
      if (srcLayer === 'aeroway' && layer.type === 'fill') {
        try { map.setPaintProperty(id, 'fill-opacity', 0); } catch (_) {}
      }
    });

    // ── Sky + Fog + Light — 2.5D atmosphere ──
    try {
      map.setLight({
        anchor: 'map',
        position: [1.5, 210, 30],
        color: '#cce0ff',
        intensity: 0.55,
      });
    } catch (_) {}
    try {
      map.setSky({
        'sky-color': '#060d1a',
        'sky-horizon-blend': 0.5,
        'horizon-color': '#0f2040',
        'fog-color': '#0a1628',
        'fog-ground-blend': 0.7,
      });
    } catch (_) {}
    try {
      map.setFog({
        range: [2, 12],
        color: 'rgba(8, 18, 38, 0.4)',
        'high-color': '#0a1628',
        'horizon-blend': 0.1,
      });
    } catch (_) {}

    addAircraftImage(map);
    setMapLoaded(true);
  }, [addAircraftImage, airportConfig]);

  const handleClick = useCallback((e) => {
    // Building draw mode — add polygon point
    if (editMode && buildingDrawMode) {
      if (onBuildingAddPoint) onBuildingAddPoint(e.lngLat.lat, e.lngLat.lng);
      return;
    }

    // Runway/Taxiway draw mode — add point
    if (editMode && rwyTwyDrawMode) {
      if (onRwyTwyAddPoint) onRwyTwyAddPoint(e.lngLat.lat, e.lngLat.lng);
      return;
    }

    if (editMode && addMode) {
      if (onMapClickAdd) onMapClickAdd(e.lngLat.lat, e.lngLat.lng);
      return;
    }

    const feature = e.features?.[0];
    if (!feature) {
      setPopupInfo(null);
      setEditingLabel(null);
      if (editMode && onStandSelect) onStandSelect(null);
      if (editMode && onApronSelect) onApronSelect(null);
      return;
    }

    // Edit mode: label clicks
    if (editMode && (feature.layer.id === 'runway-labels' || feature.layer.id === 'taxiway-labels')) {
      const props = feature.properties;
      const featureClass = props.class || (feature.layer.id === 'runway-labels' ? 'runway' : 'taxiway');
      const ref = props.ref || '';
      const featureKey = `${featureClass}-${ref}`;
      const existing = labelOverrides[featureKey];
      setEditingLabel({ featureKey, originalText: ref, currentText: existing?.text || ref, featureClass, longitude: e.lngLat.lng, latitude: e.lngLat.lat });
      setPopupInfo(null);
      return;
    }

    // Edit mode: building click
    if (editMode && (feature.layer.id === 'building-extrusion' || feature.layer.id === 'building-outline-2d')) {
      if (onBuildingSelect) onBuildingSelect(feature.properties.id);
      setPopupInfo(null);
      return;
    }

    // Edit mode: apron click
    if (editMode && (feature.layer.id === 'apron-fills' || feature.layer.id === 'apron-borders')) {
      if (onApronSelect) onApronSelect(feature.properties.id);
      setPopupInfo(null);
      return;
    }

    // Stand click
    if (feature.layer.id === 'stand-circles' || feature.layer.id === 'stand-glow') {
      const props = feature.properties;
      if (editMode && onStandSelect) {
        onStandSelect(props.id);
        setPopupInfo(null);
      } else {
        setPopupInfo({ longitude: e.lngLat.lng, latitude: e.lngLat.lat, ...props });
      }
      setEditingLabel(null);
    }
  }, [editMode, addMode, rwyTwyDrawMode, buildingDrawMode, labelOverrides, onMapClickAdd, onRwyTwyAddPoint, onBuildingAddPoint, onStandSelect, onApronSelect]);

  const interactiveLayerIds = editMode
    ? ['stand-circles', 'stand-glow', 'runway-labels', 'taxiway-labels', 'apron-fills', 'apron-borders', 'building-extrusion', 'building-outline-2d']
    : ['stand-circles', 'stand-glow'];

  const cursorStyle = editMode && (addMode || buildingDrawMode) ? 'crosshair' : (editMode && (draggingVertex || buildingDraggingVertex) ? 'grabbing' : 'auto');

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={handleUserInteraction}
      onLoad={handleLoad}
      onStyleData={handleLoad}
      onClick={handleClick}
      interactiveLayerIds={interactiveLayerIds}
      mapStyle={mapStyle}
      style={{ width: '100%', height: '100%' }}
      maxZoom={20}
      minZoom={10}
      attributionControl={false}
      cursor={cursorStyle}
      canvasContextAttributes={{ antialias: true }}
    >
      <NavigationControl position="bottom-right" visualizePitch showCompass />
      <ScaleControl position="bottom-left" />

      {/* ═══════════════════════════════════════════════════════════════════
          ─── Enhanced OSM Aeroway Rendering (replaces default styling) ───
          ═══════════════════════════════════════════════════════════════════ */}

      {/* Runway surface — wide dark asphalt strip */}
      <Layer id="osm-rwy-surface" type="line" source="carto" source-layer="aeroway"
        filter={['==', ['get', 'class'], 'runway']} minzoom={10}
        layout={{ 'line-cap': 'butt' }}
        paint={{
          'line-color': '#263E5E',
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 2, 13, 16, 15, 45, 17, 90, 19, 180],
          'line-opacity': 0.95,
        }}
      />
      {/* Runway triple glow — outer (wide, faint) */}
      <Layer id="osm-rwy-glow-outer" type="line" source="carto" source-layer="aeroway"
        filter={['==', ['get', 'class'], 'runway']} minzoom={10}
        layout={{ 'line-cap': 'butt' }}
        paint={{
          'line-color': '#4a9eff',
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 8, 13, 36, 15, 80, 17, 150, 19, 280],
          'line-opacity': 0.025,
          'line-blur': 16,
        }}
        beforeId="osm-rwy-surface"
      />
      {/* Runway triple glow — mid */}
      <Layer id="osm-rwy-glow-mid" type="line" source="carto" source-layer="aeroway"
        filter={['==', ['get', 'class'], 'runway']} minzoom={10}
        layout={{ 'line-cap': 'butt' }}
        paint={{
          'line-color': '#4a9eff',
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 5, 13, 26, 15, 62, 17, 110, 19, 210],
          'line-opacity': 0.05,
          'line-blur': 8,
        }}
        beforeId="osm-rwy-surface"
      />
      {/* Runway triple glow — inner (tight, brighter) */}
      <Layer id="osm-rwy-glow-inner" type="line" source="carto" source-layer="aeroway"
        filter={['==', ['get', 'class'], 'runway']} minzoom={10}
        layout={{ 'line-cap': 'butt' }}
        paint={{
          'line-color': '#4a9eff',
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 3, 13, 19, 15, 50, 17, 95, 19, 185],
          'line-opacity': 0.1,
          'line-blur': 3,
        }}
        beforeId="osm-rwy-surface"
      />
      {/* Runway threshold removed */}
      {/* Runway centerline — white dashed */}
      <Layer id="osm-rwy-centerline" type="line" source="carto" source-layer="aeroway"
        filter={['==', ['get', 'class'], 'runway']} minzoom={13}
        paint={{
          'line-color': '#ffffff',
          'line-width': ['interpolate', ['linear'], ['zoom'], 13, 0.5, 15, 1.5, 17, 3, 19, 5],
          'line-opacity': 0.85,
          'line-dasharray': [8, 6],
        }}
      />
      {/* Runway left edge — solid white */}
      <Layer id="osm-rwy-edge-l" type="line" source="carto" source-layer="aeroway"
        filter={['==', ['get', 'class'], 'runway']} minzoom={13}
        paint={{
          'line-color': '#ffffff',
          'line-width': ['interpolate', ['linear'], ['zoom'], 13, 0.3, 15, 0.8, 17, 2, 19, 3],
          'line-opacity': 0.6,
          'line-offset': ['interpolate', ['linear'], ['zoom'], 10, -1, 13, -7, 15, -20, 17, -42, 19, -85],
        }}
      />
      {/* Runway right edge */}
      <Layer id="osm-rwy-edge-r" type="line" source="carto" source-layer="aeroway"
        filter={['==', ['get', 'class'], 'runway']} minzoom={13}
        paint={{
          'line-color': '#ffffff',
          'line-width': ['interpolate', ['linear'], ['zoom'], 13, 0.3, 15, 0.8, 17, 2, 19, 3],
          'line-opacity': 0.6,
          'line-offset': ['interpolate', ['linear'], ['zoom'], 10, 1, 13, 7, 15, 20, 17, 42, 19, 85],
        }}
      />
      {/* Runway edge lights — dotted white at edges */}
      <Layer id="osm-rwy-lights-l" type="line" source="carto" source-layer="aeroway"
        filter={['==', ['get', 'class'], 'runway']} minzoom={15}
        paint={{
          'line-color': '#ffffff',
          'line-width': ['interpolate', ['linear'], ['zoom'], 15, 1, 17, 2.5],
          'line-opacity': 0.35,
          'line-dasharray': [0.5, 4],
          'line-offset': ['interpolate', ['linear'], ['zoom'], 15, -22, 17, -46, 19, -90],
        }}
      />
      <Layer id="osm-rwy-lights-r" type="line" source="carto" source-layer="aeroway"
        filter={['==', ['get', 'class'], 'runway']} minzoom={15}
        paint={{
          'line-color': '#ffffff',
          'line-width': ['interpolate', ['linear'], ['zoom'], 15, 1, 17, 2.5],
          'line-opacity': 0.35,
          'line-dasharray': [0.5, 4],
          'line-offset': ['interpolate', ['linear'], ['zoom'], 15, 22, 17, 46, 19, 90],
        }}
      />

      {/* ─── Taxiway surface — darker strip ─── */}
      <Layer id="osm-twy-surface" type="line" source="carto" source-layer="aeroway"
        filter={['==', ['get', 'class'], 'taxiway']} minzoom={12}
        layout={{ 'line-cap': 'round', 'line-join': 'round' }}
        paint={{
          'line-color': '#18263A',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 1, 14, 6, 16, 18, 18, 36],
          'line-opacity': 0.85,
        }}
      />
      {/* Taxiway triple glow — outer */}
      <Layer id="osm-twy-glow-outer" type="line" source="carto" source-layer="aeroway"
        filter={['==', ['get', 'class'], 'taxiway']} minzoom={12}
        layout={{ 'line-cap': 'round' }}
        paint={{
          'line-color': '#facc15',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 4, 14, 16, 16, 36, 18, 64],
          'line-opacity': 0.02,
          'line-blur': 12,
        }}
        beforeId="osm-twy-surface"
      />
      {/* Taxiway triple glow — mid */}
      <Layer id="osm-twy-glow-mid" type="line" source="carto" source-layer="aeroway"
        filter={['==', ['get', 'class'], 'taxiway']} minzoom={12}
        layout={{ 'line-cap': 'round' }}
        paint={{
          'line-color': '#facc15',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 3, 14, 12, 16, 28, 18, 50],
          'line-opacity': 0.04,
          'line-blur': 5,
        }}
        beforeId="osm-twy-surface"
      />
      {/* Taxiway triple glow — inner */}
      <Layer id="osm-twy-glow-inner" type="line" source="carto" source-layer="aeroway"
        filter={['==', ['get', 'class'], 'taxiway']} minzoom={12}
        layout={{ 'line-cap': 'round' }}
        paint={{
          'line-color': '#facc15',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 2, 14, 8, 16, 20, 18, 38],
          'line-opacity': 0.07,
          'line-blur': 2,
        }}
        beforeId="osm-twy-surface"
      />
      {/* Taxiway centerline — yellow dashed (aviation standard) */}
      <Layer id="osm-twy-centerline" type="line" source="carto" source-layer="aeroway"
        filter={['==', ['get', 'class'], 'taxiway']} minzoom={13}
        paint={{
          'line-color': '#facc15',
          'line-width': ['interpolate', ['linear'], ['zoom'], 13, 0.4, 15, 1, 17, 2, 19, 3.5],
          'line-opacity': 0.8,
          'line-dasharray': [6, 4],
        }}
      />
      {/* Taxiway edge lines */}
      <Layer id="osm-twy-edge-l" type="line" source="carto" source-layer="aeroway"
        filter={['==', ['get', 'class'], 'taxiway']} minzoom={14}
        paint={{
          'line-color': '#facc15',
          'line-width': ['interpolate', ['linear'], ['zoom'], 14, 0.2, 17, 1],
          'line-opacity': 0.4,
          'line-offset': ['interpolate', ['linear'], ['zoom'], 14, -3, 16, -8, 18, -16],
        }}
      />
      <Layer id="osm-twy-edge-r" type="line" source="carto" source-layer="aeroway"
        filter={['==', ['get', 'class'], 'taxiway']} minzoom={14}
        paint={{
          'line-color': '#facc15',
          'line-width': ['interpolate', ['linear'], ['zoom'], 14, 0.2, 17, 1],
          'line-opacity': 0.4,
          'line-offset': ['interpolate', ['linear'], ['zoom'], 14, 3, 16, 8, 18, 16],
        }}
      />
      {/* Taxiway edge lights — green dots */}
      <Layer id="osm-twy-lights-l" type="line" source="carto" source-layer="aeroway"
        filter={['==', ['get', 'class'], 'taxiway']} minzoom={15}
        paint={{
          'line-color': '#22c55e',
          'line-width': ['interpolate', ['linear'], ['zoom'], 15, 1, 17, 2],
          'line-opacity': 0.3,
          'line-dasharray': [0.5, 5],
          'line-offset': ['interpolate', ['linear'], ['zoom'], 15, -9, 17, -17],
        }}
      />
      <Layer id="osm-twy-lights-r" type="line" source="carto" source-layer="aeroway"
        filter={['==', ['get', 'class'], 'taxiway']} minzoom={15}
        paint={{
          'line-color': '#22c55e',
          'line-width': ['interpolate', ['linear'], ['zoom'], 15, 1, 17, 2],
          'line-opacity': 0.3,
          'line-dasharray': [0.5, 5],
          'line-offset': ['interpolate', ['linear'], ['zoom'], 15, 9, 17, 17],
        }}
      />

      {/* Runway designator removed */}
      {/* ─── Taxiway designator labels — flat on ground ─── */}
      <Layer id="osm-twy-designator" type="symbol" source="carto" source-layer="aeroway"
        filter={['all', ['==', ['get', 'class'], 'taxiway'], ['has', 'ref']]} minzoom={14}
        layout={{
          'symbol-placement': 'line-center',
          'text-field': ['get', 'ref'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 14, 8, 16, 12, 18, 18],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-rotation-alignment': 'map',
          'text-pitch-alignment': 'map',
          'text-allow-overlap': false,
          'text-letter-spacing': 0.15,
        }}
        paint={{
          'text-color': '#facc15',
          'text-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0.5, 16, 0.8],
          'text-halo-color': '#18263A',
          'text-halo-width': ['interpolate', ['linear'], ['zoom'], 14, 1.5, 17, 3],
        }}
      />

      {/* ─── Aeroway fill areas (apron/helipad surfaces) ─── */}
      <Layer id="osm-aeroway-area" type="fill" source="carto" source-layer="aeroway"
        filter={['==', ['geometry-type'], 'Polygon']} minzoom={12}
        paint={{
          'fill-color': '#0a1628',
          'fill-opacity': 0.45,
        }}
      />
      <Layer id="osm-aeroway-area-edge" type="line" source="carto" source-layer="aeroway"
        filter={['==', ['geometry-type'], 'Polygon']} minzoom={13}
        paint={{
          'line-color': '#1e3a5f',
          'line-width': ['interpolate', ['linear'], ['zoom'], 13, 0.5, 16, 1.5],
          'line-opacity': 0.3,
        }}
      />

      {/* ─── Image Overlays ─── */}
      {overlays.filter((ov) => ov.visible).map((ov) => {
        // MapLibre image source coordinates: [top-left, top-right, bottom-right, bottom-left] as [lng, lat]
        const coords = [
          [ov.bounds.topLeft[1], ov.bounds.topLeft[0]],
          [ov.bounds.topRight[1], ov.bounds.topRight[0]],
          [ov.bounds.bottomRight[1], ov.bounds.bottomRight[0]],
          [ov.bounds.bottomLeft[1], ov.bounds.bottomLeft[0]],
        ];
        return (
          <Source key={ov.id} id={`overlay-${ov.id}`} type="image" url={ov.imageUrl} coordinates={coords}>
            <Layer id={`overlay-layer-${ov.id}`} type="raster" paint={{ 'raster-opacity': ov.opacity, 'raster-fade-duration': 0 }} beforeId="apron-fills" />
          </Source>
        );
      })}

      {/* ─── Overlay corner handles (edit mode) ─── */}
      {editMode && selectedOverlayId && (() => {
        const ov = overlays.find((o) => o.id === selectedOverlayId);
        if (!ov) return null;
        const corners = [
          { key: 'topLeft', label: 'TL' },
          { key: 'topRight', label: 'TR' },
          { key: 'bottomRight', label: 'BR' },
          { key: 'bottomLeft', label: 'BL' },
        ];
        const cLat = (ov.bounds.topLeft[0] + ov.bounds.bottomRight[0]) / 2;
        const cLng = (ov.bounds.topLeft[1] + ov.bounds.bottomRight[1]) / 2;
        return (
          <>
            {corners.map(({ key, label }) => (
              <Marker key={`ov-corner-${ov.id}-${key}`}
                longitude={ov.bounds[key][1]} latitude={ov.bounds[key][0]}
                draggable
                onDrag={(e) => onOverlayCornerDrag && onOverlayCornerDrag(ov.id, key, e.lngLat.lat, e.lngLat.lng)}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', border: '2px solid #fff',
                  background: '#f97316', boxShadow: '0 0 8px rgba(249, 115, 22, 0.5)',
                  cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 7, fontWeight: 800, color: '#fff',
                }}>{label}</div>
              </Marker>
            ))}
            {/* Center handle — move entire overlay */}
            <Marker key={`ov-center-${ov.id}`} longitude={cLng} latitude={cLat} draggable
              onDrag={(e) => {
                const dLat = e.lngLat.lat - cLat;
                const dLng = e.lngLat.lng - cLng;
                if (onOverlayMove) onOverlayMove(ov.id, dLat, dLng);
              }}
            >
              <div style={{
                width: 24, height: 24, borderRadius: 6, border: '2px solid #fff',
                background: '#f97316', boxShadow: '0 0 12px rgba(249, 115, 22, 0.5)',
                cursor: 'move', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 0L8 3H4L6 0Z" fill="white"/>
                  <path d="M6 12L4 9H8L6 12Z" fill="white"/>
                  <path d="M0 6L3 4V8L0 6Z" fill="white"/>
                  <path d="M12 6L9 8V4L12 6Z" fill="white"/>
                </svg>
              </div>
            </Marker>
          </>
        );
      })()}

      {/* ─── Enhanced 2.5D Visual Layers ─── */}
      <AirportVisualLayers
        rwyTwyFeatures={rwyTwyFeatures}
        stands={standsData}
        aprons={aprons || []}
        standGeoJSON={standGeoJSON}
        statusColors={sc}
      />

      {/* ─── Custom Runways / Taxiways ─── */}
      <Source id="custom-rwy-twy" type="geojson" data={rwyTwyGeoJSON}>
        {rwyTwyFeatures.map((f) => (
          <Layer key={`rwy-twy-line-${f.id}`} id={`rwy-twy-line-${f.id}`} type="line"
            filter={['==', ['get', 'id'], f.id]}
            paint={{
              'line-color': f.color, 'line-width': f.width, 'line-opacity': f.opacity,
              'line-cap': 'round', 'line-join': 'round',
            }}
          />
        ))}
      </Source>
      <Source id="custom-rwy-twy-labels" type="geojson" data={rwyTwyLabelsGeoJSON}>
        <Layer id="custom-rwy-twy-label-text" type="symbol"
          layout={{
            'text-field': ['get', 'name'],
            'text-size': 12,
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-allow-overlap': true,
          }}
          paint={{
            'text-color': '#fff',
            'text-halo-color': '#000',
            'text-halo-width': 1.5,
          }}
        />
      </Source>

      {/* Drawing preview */}
      {drawPreviewGeoJSON && (
        <Source id="draw-preview" type="geojson" data={drawPreviewGeoJSON}>
          <Layer id="draw-preview-line" type="line"
            paint={{
              'line-color': rwyTwyDrawMode === 'runway' ? '#4a9eff' : '#facc15',
              'line-width': rwyTwyDrawMode === 'runway' ? 8 : 4,
              'line-opacity': 0.5,
              'line-dasharray': [2, 2],
              'line-cap': 'round',
            }}
          />
        </Source>
      )}
      {/* Drawing point markers */}
      {rwyTwyDrawingPoints.map((p, i) => (
        <Marker key={`draw-pt-${i}`} longitude={p.lng} latitude={p.lat} anchor="center">
          <div style={{
            width: 14, height: 14, borderRadius: '50%',
            border: `2px solid ${rwyTwyDrawMode === 'runway' ? '#4a9eff' : '#facc15'}`,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 7, fontWeight: 800, color: '#fff',
          }}>{i + 1}</div>
        </Marker>
      ))}

      {/* Vertex handles for selected custom feature */}
      {editMode && rwyTwySelectedId && rwyTwyFeatures.filter((f) => f.id === rwyTwySelectedId).map((f) =>
        f.coordinates.map((c, i) => (
          <Marker key={`rtwy-v-${f.id}-${i}`} longitude={c.lng} latitude={c.lat} anchor="center" draggable
            onDrag={(e) => onRwyTwyVertexDrag && onRwyTwyVertexDrag(f.id, i, e.lngLat.lat, e.lngLat.lng)}
          >
            <div style={{
              width: 14, height: 14, borderRadius: '50%',
              border: `2px solid ${f.color}`, background: 'rgba(0,0,0,0.5)',
              cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 7, fontWeight: 800, color: '#fff',
            }}>{i + 1}</div>
          </Marker>
        ))
      )}

      {/* ─── Apron polygons ─── */}
      <Source id="aprons" type="geojson" data={apronGeoJSON}>
        <Layer
          id="apron-fills"
          type="fill"
          paint={{
            'fill-color': ['get', 'color'],
            'fill-opacity': ['get', 'fillOpacity'],
          }}
        />
        <Layer
          id="apron-borders"
          type="line"
          paint={{
            'line-color': ['get', 'color'],
            'line-width': ['get', 'strokeWidth'],
            'line-dasharray': [4, 3],
            'line-opacity': ['get', 'strokeOpacity'],
          }}
        />
      </Source>

      {/* ─── Apron labels ─── */}
      <Source id="apron-labels" type="geojson" data={apronLabelsGeoJSON}>
        <Layer
          id="apron-label-text"
          type="symbol"
          layout={{
            'text-field': ['get', 'label'], 'text-size': 13,
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-transform': 'uppercase', 'text-letter-spacing': 0.15, 'text-allow-overlap': true,
          }}
          paint={{ 'text-color': '#94a3b8', 'text-halo-color': 'rgba(10, 10, 20, 0.8)', 'text-halo-width': 2 }}
        />
      </Source>

      {/* ─── Apron vertex handles (edit mode) ─── */}
      {editMode && selectedApronId && (
        <>
          <Source id="apron-handles" type="geojson" data={apronHandlesGeoJSON}>
            <Layer
              id="apron-handle-circles"
              type="circle"
              paint={{
                'circle-radius': 7,
                'circle-color': ['get', 'color'],
                'circle-opacity': 0.9,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
              }}
            />
          </Source>
          {/* Draggable Markers for each vertex */}
          {(aprons || []).find((a) => a.id === selectedApronId)?.coordinates.map(([lat, lng], i) => (
            <Marker
              key={`handle-${selectedApronId}-${i}`}
              longitude={lng}
              latitude={lat}
              draggable
              onDragStart={() => onDragStart && onDragStart(selectedApronId, i)}
              onDrag={(e) => onApronVertexDrag && onApronVertexDrag(selectedApronId, i, e.lngLat.lat, e.lngLat.lng)}
              onDragEnd={() => onDragEnd && onDragEnd()}
            >
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                border: '2.5px solid #fff',
                background: (aprons || []).find((a) => a.id === selectedApronId)?.color || '#00ffff',
                boxShadow: '0 0 8px rgba(0,0,0,0.4), 0 0 12px rgba(0,255,255,0.3)',
                cursor: 'grab',
              }} />
            </Marker>
          ))}
          {/* Center drag handle — move whole apron */}
          {(() => {
            const apron = (aprons || []).find((a) => a.id === selectedApronId);
            if (!apron) return null;
            const cLat = apron.coordinates.reduce((s, c) => s + c[0], 0) / apron.coordinates.length;
            const cLng = apron.coordinates.reduce((s, c) => s + c[1], 0) / apron.coordinates.length;
            return (
              <Marker
                key={`apron-center-${selectedApronId}`}
                longitude={cLng}
                latitude={cLat}
                draggable
                onDrag={(e) => {
                  const dLat = e.lngLat.lat - cLat;
                  const dLng = e.lngLat.lng - cLng;
                  if (onApronMove) onApronMove(selectedApronId, dLat, dLng);
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  border: '2px solid #fff',
                  background: apron.color || '#00ffff',
                  boxShadow: '0 0 10px rgba(0,0,0,0.5), 0 0 16px ' + (apron.color || '#00ffff') + '40',
                  cursor: 'move',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 0L8 3H4L6 0Z" fill="white"/>
                    <path d="M6 12L4 9H8L6 12Z" fill="white"/>
                    <path d="M0 6L3 4V8L0 6Z" fill="white"/>
                    <path d="M12 6L9 8V4L12 6Z" fill="white"/>
                  </svg>
                </div>
              </Marker>
            );
          })()}
        </>
      )}

      {/* ─── Building vertex drag handles ─── */}
      {editMode && selectedBuildingId && (() => {
        const bldg = buildings.find((b) => b.id === selectedBuildingId);
        if (!bldg) return null;
        const cLat = bldg.coordinates.reduce((s, c) => s + c[0], 0) / bldg.coordinates.length;
        const cLng = bldg.coordinates.reduce((s, c) => s + c[1], 0) / bldg.coordinates.length;
        return (
          <>
            {bldg.coordinates.map(([lat, lng], i) => (
              <Marker key={`bldg-handle-${bldg.id}-${i}`} longitude={lng} latitude={lat} draggable
                onDragStart={() => onBuildingDragStart && onBuildingDragStart(bldg.id, i)}
                onDrag={(e) => onBuildingVertexDrag && onBuildingVertexDrag(bldg.id, i, e.lngLat.lat, e.lngLat.lng)}
                onDragEnd={() => onBuildingDragEnd && onBuildingDragEnd()}
              >
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  border: '2.5px solid #fff', background: '#4a9eff',
                  boxShadow: '0 0 8px rgba(0,0,0,0.4), 0 0 10px rgba(74,158,255,0.4)',
                  cursor: 'grab',
                }} />
              </Marker>
            ))}
            {/* Center drag — move whole building */}
            <Marker key={`bldg-center-${bldg.id}`} longitude={cLng} latitude={cLat} draggable
              onDrag={(e) => {
                const dLat = e.lngLat.lat - cLat;
                const dLng = e.lngLat.lng - cLng;
                if (onBuildingMove) onBuildingMove(bldg.id, dLat, dLng);
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 5,
                border: '2px solid #fff', background: '#4a9eff',
                boxShadow: '0 0 10px rgba(0,0,0,0.5), 0 0 14px rgba(74,158,255,0.3)',
                cursor: 'move', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 0L8 3H4L6 0Z" fill="white"/>
                  <path d="M6 12L4 9H8L6 12Z" fill="white"/>
                  <path d="M0 6L3 4V8L0 6Z" fill="white"/>
                  <path d="M12 6L9 8V4L12 6Z" fill="white"/>
                </svg>
              </div>
            </Marker>
          </>
        );
      })()}

      {/* ─── Stand heading indicator lines ─── */}
      <Source id="stand-heading-lines" type="geojson" data={standHeadingLinesGeoJSON}>
        <Layer id="stand-heading-line" type="line"
          layout={{ 'line-cap': 'round' }}
          paint={{
            'line-color': '#c084fc',
            'line-width': ['interpolate', ['linear'], ['zoom'], 14, 1, 16, 2, 18, 3],
            'line-opacity': 0.5,
            'line-dasharray': [3, 3],
          }}
        />
        {/* Arrow tip at end of heading line */}
        <Layer id="stand-heading-arrow" type="symbol"
          layout={{
            'symbol-placement': 'line',
            'symbol-spacing': 1000,
            'text-field': '▶',
            'text-size': ['interpolate', ['linear'], ['zoom'], 14, 8, 16, 12, 18, 16],
            'text-rotation-alignment': 'map',
            'text-allow-overlap': true,
            'text-keep-upright': false,
          }}
          paint={{
            'text-color': '#c084fc',
            'text-opacity': 0.6,
          }}
        />
      </Source>

      {/* ─── Stand markers ─── */}
      <Source id="stands" type="geojson" data={standGeoJSON}>
        <Layer id="stand-circles" type="circle" paint={{
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 14, 4, 16, 8, 18, 14],
          'circle-color': ['get', 'color'],
          'circle-opacity': ['case', ['==', ['get', 'status'], 'empty'], 0.2, 0.7],
          'circle-stroke-width': ['case', ['==', ['get', 'status'], 'empty'], 1.5, 2],
          'circle-stroke-color': ['get', 'color'], 'circle-stroke-opacity': 0.9,
        }} />
        {/* Stand triple glow — outer */}
        <Layer id="stand-glow-outer" type="circle" filter={['!=', ['get', 'status'], 'empty']} paint={{
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 14, 16, 16, 30, 18, 44],
          'circle-color': ['get', 'color'], 'circle-opacity': 0.03, 'circle-blur': 1,
        }} />
        {/* Stand triple glow — mid */}
        <Layer id="stand-glow-mid" type="circle" filter={['!=', ['get', 'status'], 'empty']} paint={{
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 14, 11, 16, 20, 18, 32],
          'circle-color': ['get', 'color'], 'circle-opacity': 0.07, 'circle-blur': 0.8,
        }} />
        {/* Stand triple glow — inner */}
        <Layer id="stand-glow" type="circle" filter={['!=', ['get', 'status'], 'empty']} paint={{
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 14, 7, 16, 14, 18, 22],
          'circle-color': ['get', 'color'], 'circle-opacity': 0.12, 'circle-blur': 0.5,
        }} />
        <Layer id="stand-labels" type="symbol" layout={{
          'text-field': ['get', 'label'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 14, 8, 16, 11, 18, 13],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-offset': [0, -1.8], 'text-allow-overlap': true,
        }} paint={{ 'text-color': ['get', 'color'], 'text-halo-color': 'rgba(10, 10, 20, 0.9)', 'text-halo-width': 1.5 }} />
        <Layer id="stand-aircraft-labels" type="symbol" filter={['!=', ['get', 'callsign'], '']} layout={{
          'text-field': ['get', 'aircraftType'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 15, 0, 16, 8, 18, 10],
          'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
          'text-offset': [0, 1.6], 'text-allow-overlap': true,
        }} paint={{ 'text-color': '#94a3b8', 'text-halo-color': 'rgba(10, 10, 20, 0.9)', 'text-halo-width': 1 }} />
      </Source>

      {/* Jet bridges removed */}

      {/* ─── Aircraft shadow + SVG Markers on occupied stands (view mode) ─── */}
      {!editMode && occupiedStands.map((s) => {
        const svg = getAircraftSvg(s.flight?.aircraftType);
        return (
          <Marker key={`aircraft-shadow-${s.id}`} longitude={s.lng} latitude={s.lat} anchor="center">
            <div style={{
              transform: `rotate(${s.heading || 0}deg) translate(3px, 3px)`,
              lineHeight: 0,
              filter: 'blur(2px)',
              opacity: 0.25,
            }}
              dangerouslySetInnerHTML={{
                __html: svg.replace(/COLOR/g, '#000000'),
              }}
            />
          </Marker>
        );
      })}
      {!editMode && occupiedStands.map((s) => {
        const svg = getAircraftSvg(s.flight?.aircraftType);
        return (
          <Marker key={`aircraft-${s.id}`} longitude={s.lng} latitude={s.lat} anchor="center">
            <div
              style={{ transform: `rotate(${s.heading || 0}deg)`, lineHeight: 0 }}
              dangerouslySetInnerHTML={{
                __html: svg.replace(/COLOR/g, s.color || '#00ffff'),
              }}
            />
          </Marker>
        );
      })}

      {/* ─── Draggable stand markers (edit mode) ─── */}
      {editMode && standsData.map((s) => (
        <Marker
          key={`stand-drag-${s.id}`}
          longitude={s.lng}
          latitude={s.lat}
          anchor="center"
          draggable
          onDrag={(e) => onStandMove && onStandMove(s.id, e.lngLat.lat, e.lngLat.lng)}
        >
          <div style={{
            width: selectedStandId === s.id ? 18 : 14,
            height: selectedStandId === s.id ? 18 : 14,
            borderRadius: '50%',
            border: selectedStandId === s.id ? '2.5px solid #c084fc' : '2px solid rgba(255,255,255,0.6)',
            background: selectedStandId === s.id ? 'rgba(168, 85, 247, 0.4)' : 'rgba(255,255,255,0.15)',
            boxShadow: selectedStandId === s.id ? '0 0 12px rgba(168, 85, 247, 0.5)' : '0 0 4px rgba(0,0,0,0.3)',
            cursor: 'grab',
            transition: 'width 0.15s, height 0.15s, border 0.15s',
          }} />
        </Marker>
      ))}

      {/* ─── 3D buildings ─── */}
      <Layer id="3d-buildings" type="fill-extrusion" source="carto" source-layer="building" minzoom={14} paint={{
        'fill-extrusion-color': ['interpolate', ['linear'], ['get', 'render_height'],
          0, '#0a1628',
          5, '#0f1f35',
          10, '#152842',
          20, '#1a3052',
          40, '#1e3860',
        ],
        'fill-extrusion-height': ['interpolate', ['linear'], ['get', 'render_height'], 0, 0, 10, 10, 50, 50],
        'fill-extrusion-base': ['get', 'render_min_height'],
        'fill-extrusion-opacity': 0.92,
        'fill-extrusion-vertical-gradient': true,
      }} />
      {/* Building edge glow */}
      <Layer id="3d-buildings-edge" type="fill-extrusion" source="carto" source-layer="building" minzoom={15} paint={{
        'fill-extrusion-color': '#00ffff',
        'fill-extrusion-height': ['interpolate', ['linear'], ['get', 'render_height'], 0, 0.2, 10, 10.2, 50, 50.2],
        'fill-extrusion-base': ['get', 'render_height'],
        'fill-extrusion-opacity': 0.12,
      }} />

      {/* ─── Runway labels ─── */}
      <Layer id="runway-labels" type="symbol" source="carto" source-layer="aeroway" filter={['==', ['get', 'class'], 'runway']} minzoom={12} layout={{
        'text-field': ['get', 'ref'], 'text-size': ['interpolate', ['linear'], ['zoom'], 12, 10, 14, 13, 16, 16],
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'], 'symbol-placement': 'line-center',
        'text-rotation-alignment': 'map', 'text-allow-overlap': false, 'text-letter-spacing': 0.2,
      }} paint={{ 'text-color': '#4a9eff', 'text-halo-color': 'rgba(5, 10, 20, 0.95)', 'text-halo-width': 2.5 }} />

      {/* ─── Taxiway labels ─── */}
      <Layer id="taxiway-labels" type="symbol" source="carto" source-layer="aeroway" filter={['==', ['get', 'class'], 'taxiway']} minzoom={14} layout={{
        'text-field': ['get', 'ref'], 'text-size': ['interpolate', ['linear'], ['zoom'], 14, 8, 16, 10, 18, 12],
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'], 'symbol-placement': 'line-center',
        'text-rotation-alignment': 'map', 'text-allow-overlap': false,
      }} paint={{ 'text-color': '#facc15', 'text-halo-color': 'rgba(5, 10, 20, 0.9)', 'text-halo-width': 2 }} />

      {/* ─── Terminal labels ─── */}
      <Source id="terminal-labels" type="geojson" data={terminalLabelsGeoJSON}>
        <Layer id="terminal-label-text" type="symbol" layout={{
          'text-field': ['get', 'label'], 'text-size': ['interpolate', ['linear'], ['zoom'], 14, 10, 16, 14, 18, 16],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'], 'text-transform': 'uppercase',
          'text-letter-spacing': 0.2, 'text-allow-overlap': true,
        }} paint={{ 'text-color': '#e2e8f0', 'text-halo-color': 'rgba(10, 10, 20, 0.9)', 'text-halo-width': 2 }} />
      </Source>

      {/* ─── Custom Buildings (3D Extruded) ─── */}
      {/* Visible only when city layers are hidden (hideCityLayers=true) */}
      {buildings.length > 0 && (
        <Source id="custom-buildings" type="geojson" data={buildingGeoJSON}>
          {/* Walls — opacity is baked into the rgba color */}
          <Layer id="building-extrusion" type="fill-extrusion"
            layout={{ visibility: hideCityLayers ? 'visible' : 'none' }}
            paint={{
              'fill-extrusion-color': ['get', 'color'],
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'baseHeight'],
              'fill-extrusion-opacity': 1,
              'fill-extrusion-vertical-gradient': true,
            }} />
          {/* Roof cap — thin extrusion slab at top using roofColor */}
          <Layer id="building-roof" type="fill-extrusion"
            layout={{ visibility: hideCityLayers ? 'visible' : 'none' }}
            paint={{
              'fill-extrusion-color': ['get', 'roofColor'],
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['case', ['>=', ['get', 'height'], 1], ['-', ['get', 'height'], 0.5], ['get', 'height']],
              'fill-extrusion-opacity': 1,
            }} />
          <Layer id="building-outline-2d" type="line"
            layout={{ visibility: hideCityLayers ? 'visible' : 'none' }}
            paint={{
              'line-color': '#4a9eff',
              'line-width': 1.5,
              'line-opacity': editMode && selectedBuildingId ? 0.8 : 0.3,
            }} />
        </Source>
      )}

      {/* Building vertex handles (edit mode) */}
      {editMode && selectedBuildingId && (
        <Source id="building-handles" type="geojson" data={buildingHandlesGeoJSON}>
          <Layer id="building-handle-circles" type="circle" paint={{
            'circle-radius': 6,
            'circle-color': '#4a9eff',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.9,
          }} />
        </Source>
      )}

      {/* Building draw preview */}
      {buildingDrawMode && buildingDrawPreviewGeoJSON && (
        <Source id="building-draw-preview" type="geojson" data={buildingDrawPreviewGeoJSON}>
          <Layer id="building-draw-preview-fill" type="fill" paint={{
            'fill-color': '#4a9eff',
            'fill-opacity': 0.15,
          }} />
          <Layer id="building-draw-preview-line" type="line" paint={{
            'line-color': '#4a9eff',
            'line-width': 2,
            'line-dasharray': [4, 4],
            'line-opacity': 0.8,
          }} />
        </Source>
      )}

      {/* Building draw points */}
      {buildingDrawMode && buildingDrawingPoints.length > 0 && (
        <Source id="building-draw-points" type="geojson" data={{
          type: 'FeatureCollection',
          features: buildingDrawingPoints.map((p, i) => ({
            type: 'Feature',
            properties: { index: i },
            geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
          })),
        }}>
          <Layer id="building-draw-point-circles" type="circle" paint={{
            'circle-radius': 5,
            'circle-color': '#4a9eff',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          }} />
        </Source>
      )}

      {/* Building labels */}
      {buildings.length > 0 && (
        <Source id="building-labels" type="geojson" data={{
          type: 'FeatureCollection',
          features: buildings.map((b) => {
            const cLat = b.coordinates.reduce((s, c) => s + c[0], 0) / b.coordinates.length;
            const cLng = b.coordinates.reduce((s, c) => s + c[1], 0) / b.coordinates.length;
            return { type: 'Feature', properties: { label: b.name }, geometry: { type: 'Point', coordinates: [cLng, cLat] } };
          }),
        }}>
          <Layer id="building-label-text" type="symbol" layout={{
            visibility: hideCityLayers ? 'visible' : 'none',
            'text-field': ['get', 'label'], 'text-size': ['interpolate', ['linear'], ['zoom'], 14, 9, 16, 12, 18, 15],
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'], 'text-transform': 'uppercase',
            'text-letter-spacing': 0.15, 'text-allow-overlap': true,
          }} paint={{ 'text-color': '#93c5fd', 'text-halo-color': 'rgba(10, 10, 20, 0.9)', 'text-halo-width': 2 }} />
        </Source>
      )}

      {/* ─── Custom label overrides ─── */}
      {Object.keys(labelOverrides).length > 0 && (
        <Source id="custom-labels" type="geojson" data={customLabelsGeoJSON}>
          <Layer id="custom-runway-labels" type="symbol" filter={['==', ['get', 'class'], 'runway']} layout={{
            'text-field': ['get', 'label'], 'text-size': 16, 'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-allow-overlap': true, 'text-letter-spacing': 0.2,
          }} paint={{ 'text-color': '#60a5fa', 'text-halo-color': 'rgba(5, 10, 20, 1)', 'text-halo-width': 4 }} />
          <Layer id="custom-taxiway-labels" type="symbol" filter={['==', ['get', 'class'], 'taxiway']} layout={{
            'text-field': ['get', 'label'], 'text-size': 12, 'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-allow-overlap': true,
          }} paint={{ 'text-color': '#fbbf24', 'text-halo-color': 'rgba(5, 10, 20, 1)', 'text-halo-width': 3 }} />
        </Source>
      )}

      {/* ─── Label Edit Popup ─── */}
      {editMode && editingLabel && (
        <Popup longitude={editingLabel.longitude} latitude={editingLabel.latitude} anchor="bottom" onClose={() => setEditingLabel(null)} closeButton closeOnClick={false} maxWidth="260px">
          <LabelEditPopup editingLabel={editingLabel}
            onApply={(newText) => { if (onLabelOverride) onLabelOverride(editingLabel.featureKey, { text: newText, lng: editingLabel.longitude, lat: editingLabel.latitude, class: editingLabel.featureClass }); setEditingLabel(null); }}
            onReset={() => { if (onLabelOverride) onLabelOverride(editingLabel.featureKey, null); setEditingLabel(null); }}
          />
        </Popup>
      )}

      {/* ─── Stand Popup — View Mode ─── */}
      {!editMode && popupInfo && (popupInfo.hasAircraft === true || popupInfo.hasAircraft === 'true') && (
        <Popup longitude={popupInfo.longitude} latitude={popupInfo.latitude} anchor="bottom" onClose={() => setPopupInfo(null)} closeButton closeOnClick={false} className="stand-popup-gl" maxWidth="320px">
          <StandPopupContent info={popupInfo} />
        </Popup>
      )}
      {!editMode && popupInfo && popupInfo.hasAircraft !== true && popupInfo.hasAircraft !== 'true' && (
        <Popup longitude={popupInfo.longitude} latitude={popupInfo.latitude} anchor="bottom" onClose={() => setPopupInfo(null)} closeButton closeOnClick={false} className="stand-popup-gl" maxWidth="220px">
          <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: '4px 0' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>Stand {popupInfo.label}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{popupInfo.apron} • {popupInfo.type}</div>
            <div style={{ display: 'inline-block', fontSize: 10, fontWeight: 600, color: '#475569', background: '#f1f5f9', padding: '3px 10px', borderRadius: 6, marginTop: 2 }}>No Aircraft</div>
          </div>
        </Popup>
      )}
    </Map>
  );
}

/* ─── Sub-components ─── */

function LabelEditPopup({ editingLabel, onApply, onReset }) {
  const [text, setText] = useState(editingLabel.currentText);
  const isRunway = editingLabel.featureClass === 'runway';
  const typeColor = isRunway ? '#4a9eff' : '#facc15';
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minWidth: 200, padding: '4px 0' }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: typeColor, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 }}>
        {isRunway ? '✈ Runway' : '↗ Taxiway'} Label
      </div>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') onApply(text); }} autoFocus
        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${typeColor}40`, background: '#f8fafc', fontSize: 14, fontWeight: 700, color: '#0f172a', outline: 'none', marginBottom: 10, boxSizing: 'border-box' }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onApply(text)} style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: 'none', background: typeColor, color: '#0f172a', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Apply</button>
        <button onClick={onReset} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Reset</button>
      </div>
      {editingLabel.originalText && <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 8 }}>Original: {editingLabel.originalText}</div>}
    </div>
  );
}

function StandPopupContent({ info }) {
  const progressPercent = typeof info.progress === 'string' ? parseInt(info.progress) : (info.progress || 0);
  const turnaround = typeof info.turnaround === 'string' ? parseInt(info.turnaround) : (info.turnaround || 0);
  const remaining = turnaround ? Math.round(turnaround * (1 - progressPercent / 100)) : 0;
  const elapsed = turnaround - remaining;
  const arrDelay = calcDelay(info.sta, info.eta);
  const depDelay = calcDelay(info.std, info.etd);
  const statusColor = info.color === '#00ffff' ? '#06b6d4' : info.color;
  const statusLabel = info.statusLabel || info.status;

  const sectionStyle = { padding: '10px 12px', background: '#f8fafc', borderRadius: 8, marginBottom: 12 };
  const microLabel = { fontSize: 9, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minWidth: 260, padding: '2px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{info.callsign}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{info.airline}</div>
        </div>
        <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', background: statusColor + '18', color: statusColor, border: `1px solid ${statusColor}30` }}>
          {statusLabel}
        </div>
      </div>
      <div style={{ ...sectionStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', fontSize: 12 }}>
        <div><div style={microLabel}>Aircraft</div><div style={{ fontWeight: 700, color: '#0f172a' }}>{info.aircraftType}</div></div>
        <div><div style={microLabel}>Registration</div><div style={{ fontWeight: 700, color: '#0f172a' }}>{info.registration}</div></div>
        <div><div style={microLabel}>Stand</div><div style={{ fontWeight: 700, color: '#0f172a' }}>{info.label} <span style={{ fontWeight: 400, color: '#94a3b8' }}>({info.type})</span></div></div>
        <div><div style={microLabel}>Apron</div><div style={{ fontWeight: 700, color: '#0f172a' }}>{info.apron}</div></div>
      </div>
      {info.origin && (
        <div style={{ ...sectionStyle, display: 'flex', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', minWidth: 42 }}><div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{info.origin}</div><div style={{ fontSize: 9, color: '#94a3b8', marginTop: 1 }}>Origin</div></div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', margin: '0 8px' }}><div style={{ flex: 1, height: 1, background: '#cbd5e1' }} /><div style={{ margin: '0 6px', fontSize: 12, color: '#94a3b8' }}>✈</div><div style={{ flex: 1, height: 1, background: '#cbd5e1' }} /></div>
          <div style={{ textAlign: 'center', minWidth: 42 }}><div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{info.destination}</div><div style={{ fontSize: 9, color: '#94a3b8', marginTop: 1 }}>Dest</div></div>
        </div>
      )}
      {(info.sta || info.std) && (
        <div style={{ ...sectionStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', fontSize: 12 }}>
          {info.sta && <div><div style={microLabel}>STA</div><div style={{ fontWeight: 700, color: '#0f172a' }}>{info.sta}</div></div>}
          {info.eta && <div><div style={microLabel}>ETA{arrDelay !== null && arrDelay !== 0 && <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, color: arrDelay > 0 ? '#ef4444' : '#22c55e' }}>{arrDelay > 0 ? `+${arrDelay}m` : `${arrDelay}m`}</span>}</div><div style={{ fontWeight: 700, color: arrDelay && arrDelay > 0 ? '#ef4444' : '#0f172a' }}>{info.eta}</div></div>}
          {info.std && <div><div style={microLabel}>STD</div><div style={{ fontWeight: 700, color: '#0f172a' }}>{info.std}</div></div>}
          {info.etd && <div><div style={microLabel}>ETD{depDelay !== null && depDelay !== 0 && <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, color: depDelay > 0 ? '#ef4444' : '#22c55e' }}>{depDelay > 0 ? `+${depDelay}m` : `${depDelay}m`}</span>}</div><div style={{ fontWeight: 700, color: depDelay && depDelay > 0 ? '#ef4444' : '#0f172a' }}>{info.etd}</div></div>}
        </div>
      )}
      {turnaround > 0 && (
        <div style={{ ...sectionStyle, marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Turnaround</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{elapsed}m / {turnaround}m</span>
          </div>
          <div style={{ width: '100%', height: 6, borderRadius: 3, background: '#e2e8f0' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', borderRadius: 3, background: progressPercent >= 90 ? '#22c55e' : progressPercent >= 60 ? statusColor : '#3b82f6', transition: 'width 0.5s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>{progressPercent}%</span>
            <span style={{ fontSize: 10, color: remaining <= 10 ? '#ef4444' : '#94a3b8', fontWeight: remaining <= 10 ? 700 : 400 }}>{remaining}m remaining</span>
          </div>
        </div>
      )}
    </div>
  );
}
