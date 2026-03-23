/*
 * Multi-Airport Configuration System
 *
 * HOW IT WORKS:
 * 1. Each airport is defined by its ICAO code (e.g., LTAC, LTFE)
 * 2. The config contains center coordinates, default zoom, and optional style overrides
 * 3. Stands, aprons, and labels are stored per-airport and can be loaded/saved independently
 * 4. MapLibre vector tiles contain worldwide aeroway data (runways, taxiways) from OpenStreetMap
 *    — the same styling rules work for ANY airport automatically
 * 5. Runway/taxiway colors and labels are derived from OSM data's `class` and `ref` properties
 *    — no per-airport config needed for base map features
 *
 * ADDING A NEW AIRPORT:
 * 1. Add entry to AIRPORT_PRESETS with ICAO code, name, coords, zoom
 * 2. Start with empty stands/aprons arrays
 * 3. Upload a Jeppesen chart as overlay → use it to place stands accurately
 * 4. Export layout JSON when done → can be re-imported later
 *
 * PHASE 2 (API integration):
 * - Airport configs loaded from backend
 * - Flight data fetched per-airport via REST/WebSocket
 * - Stand definitions synced with operational database
 */

export const AIRPORT_PRESETS = {
  LTAC: {
    icao: 'LTAC',
    iata: 'ESB',
    name: 'Esenboğa International Airport',
    city: 'Ankara',
    country: 'Turkey',
    center: { latitude: 40.1258, longitude: 32.9990 },
    defaultZoom: 15.5,
    defaultPitch: 45,
    defaultBearing: -30,
    // Aeroway style overrides (optional — defaults work fine for most airports)
    aeroStyle: {
      runwayColor: '#4a9eff',
      runwayWidth: 6,
      taxiwayColor: '#facc15',
      taxiwayWidth: 3,
      areaColor: '#0f2b44',
    },
  },
  LTFE: {
    icao: 'LTFE',
    iata: 'BJV',
    name: 'Milas-Bodrum Airport',
    city: 'Bodrum',
    country: 'Turkey',
    center: { latitude: 37.2506, longitude: 27.6643 },
    defaultZoom: 15.5,
    defaultPitch: 45,
    defaultBearing: 0,
    aeroStyle: {
      runwayColor: '#4a9eff',
      runwayWidth: 6,
      taxiwayColor: '#facc15',
      taxiwayWidth: 3,
      areaColor: '#0f2b44',
    },
  },
  LTFM: {
    icao: 'LTFM',
    iata: 'IST',
    name: 'Istanbul Airport',
    city: 'Istanbul',
    country: 'Turkey',
    center: { latitude: 41.2610, longitude: 28.7420 },
    defaultZoom: 14.5,
    defaultPitch: 45,
    defaultBearing: -15,
    aeroStyle: {
      runwayColor: '#4a9eff',
      runwayWidth: 6,
      taxiwayColor: '#facc15',
      taxiwayWidth: 3,
      areaColor: '#0f2b44',
    },
  },
  LTAI: {
    icao: 'LTAI',
    iata: 'AYT',
    name: 'Antalya Airport',
    city: 'Antalya',
    country: 'Turkey',
    center: { latitude: 36.8987, longitude: 30.8005 },
    defaultZoom: 15,
    defaultPitch: 45,
    defaultBearing: -10,
    aeroStyle: {
      runwayColor: '#4a9eff',
      runwayWidth: 6,
      taxiwayColor: '#facc15',
      taxiwayWidth: 3,
      areaColor: '#0f2b44',
    },
  },
  LTFJ: {
    icao: 'LTFJ',
    iata: 'SAW',
    name: 'Sabiha Gökçen Airport',
    city: 'Istanbul',
    country: 'Turkey',
    center: { latitude: 40.8986, longitude: 29.3092 },
    defaultZoom: 15,
    defaultPitch: 45,
    defaultBearing: -20,
    aeroStyle: {
      runwayColor: '#4a9eff',
      runwayWidth: 6,
      taxiwayColor: '#facc15',
      taxiwayWidth: 3,
      areaColor: '#0f2b44',
    },
  },
};

// Generate empty airport data template
export function createEmptyAirportData(icao) {
  return {
    stands: [],
    aprons: [],
    labelOverrides: {},
    statusConfig: null, // uses default
  };
}
