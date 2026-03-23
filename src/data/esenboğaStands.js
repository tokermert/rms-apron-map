// Esenboğa Airport — Stand & Apron Definitions
// Coordinates are approximate, based on satellite imagery

export const apronDefinitions = [
  {
    id: 'apron-main',
    label: 'Main Apron',
    type: 'apron',
    color: '#00ffff',
    coordinates: [
      [40.1275, 32.9950],
      [40.1275, 33.0040],
      [40.1245, 33.0040],
      [40.1245, 32.9950],
    ],
  },
  {
    id: 'apron-east',
    label: 'East Apron',
    type: 'apron',
    color: '#00ff88',
    coordinates: [
      [40.1275, 33.0045],
      [40.1275, 33.0100],
      [40.1245, 33.0100],
      [40.1245, 33.0045],
    ],
  },
  {
    id: 'apron-cargo',
    label: 'Cargo Apron',
    type: 'apron',
    color: '#facc15',
    coordinates: [
      [40.1248, 32.9885],
      [40.1248, 32.9945],
      [40.1228, 32.9945],
      [40.1228, 32.9885],
    ],
  },
];

export const standDefinitions = [
  // Main Apron — Contact Stands along terminal north face (~40.1258)
  { id: 'S101', label: '101', apron: 'Main Apron', lat: 40.12580, lng: 32.9958, heading: 160, type: 'contact', hasBridge: true, bridgeAngle: 200 },
  { id: 'S102', label: '102', apron: 'Main Apron', lat: 40.12580, lng: 32.9967, heading: 160, type: 'contact', hasBridge: true, bridgeAngle: 200 },
  { id: 'S103', label: '103', apron: 'Main Apron', lat: 40.12585, lng: 32.9976, heading: 170, type: 'contact', hasBridge: true, bridgeAngle: 210 },
  { id: 'S104', label: '104', apron: 'Main Apron', lat: 40.12590, lng: 32.9985, heading: 170, type: 'contact', hasBridge: true, bridgeAngle: 210 },
  { id: 'S105', label: '105', apron: 'Main Apron', lat: 40.12595, lng: 32.9994, heading: 175, type: 'contact', hasBridge: true, bridgeAngle: 215 },
  { id: 'S106', label: '106', apron: 'Main Apron', lat: 40.12595, lng: 33.0003, heading: 175, type: 'contact', hasBridge: true, bridgeAngle: 215 },
  { id: 'S107', label: '107', apron: 'Main Apron', lat: 40.12590, lng: 33.0012, heading: 180, type: 'contact', hasBridge: true, bridgeAngle: 220 },
  { id: 'S108', label: '108', apron: 'Main Apron', lat: 40.12585, lng: 33.0021, heading: 180, type: 'contact', hasBridge: true, bridgeAngle: 220 },
  { id: 'S109', label: '109', apron: 'Main Apron', lat: 40.12580, lng: 33.0030, heading: 185, type: 'contact', hasBridge: true, bridgeAngle: 225 },
  { id: 'S110', label: '110', apron: 'Main Apron', lat: 40.12575, lng: 33.0039, heading: 185, type: 'contact', hasBridge: true, bridgeAngle: 225 },

  // Remote Stands — north of main apron (~40.1272)
  { id: 'S201', label: '201', apron: 'Main Apron', lat: 40.12720, lng: 32.9960, heading: 350, type: 'remote' },
  { id: 'S202', label: '202', apron: 'Main Apron', lat: 40.12720, lng: 32.9972, heading: 350, type: 'remote' },
  { id: 'S203', label: '203', apron: 'Main Apron', lat: 40.12720, lng: 32.9984, heading: 355, type: 'remote' },
  { id: 'S204', label: '204', apron: 'Main Apron', lat: 40.12720, lng: 32.9996, heading: 355, type: 'remote' },
  { id: 'S205', label: '205', apron: 'Main Apron', lat: 40.12720, lng: 33.0008, heading: 0, type: 'remote' },
  { id: 'S206', label: '206', apron: 'Main Apron', lat: 40.12720, lng: 33.0020, heading: 0, type: 'remote' },

  // East Apron — Contact Stands (301-305)
  { id: 'S301', label: '301', apron: 'East Apron', lat: 40.12570, lng: 33.0052, heading: 190, type: 'contact' },
  { id: 'S302', label: '302', apron: 'East Apron', lat: 40.12570, lng: 33.0063, heading: 190, type: 'contact' },
  { id: 'S303', label: '303', apron: 'East Apron', lat: 40.12570, lng: 33.0074, heading: 195, type: 'contact' },
  { id: 'S304', label: '304', apron: 'East Apron', lat: 40.12570, lng: 33.0085, heading: 195, type: 'contact' },
  { id: 'S305', label: '305', apron: 'East Apron', lat: 40.12570, lng: 33.0096, heading: 200, type: 'contact' },

  // Cargo Stands — west side
  { id: 'C1', label: 'C1', apron: 'Cargo Apron', lat: 40.12400, lng: 32.9898, heading: 90, type: 'cargo' },
  { id: 'C2', label: 'C2', apron: 'Cargo Apron', lat: 40.12400, lng: 32.9915, heading: 90, type: 'cargo' },
  { id: 'C3', label: 'C3', apron: 'Cargo Apron', lat: 40.12400, lng: 32.9932, heading: 90, type: 'cargo' },
];

// Mock flight data — which aircraft is at which stand
export const mockFlightData = [
  {
    standId: 'S101',
    callsign: 'TK 2124',
    airline: 'Turkish Airlines',
    aircraftType: 'A320',
    registration: 'TC-JPA',
    origin: 'IST',
    destination: 'ESB',
    status: 'parked',
    sta: '08:30',
    std: '09:45',
    eta: '08:28',
    etd: '09:50',
    turnaround: 75,
    progress: 60,
  },
  {
    standId: 'S103',
    callsign: 'TK 2190',
    airline: 'Turkish Airlines',
    aircraftType: 'B737',
    registration: 'TC-JFV',
    origin: 'AYT',
    destination: 'ESB',
    status: 'boarding',
    sta: '07:15',
    std: '08:40',
    eta: '07:10',
    etd: '08:45',
    turnaround: 85,
    progress: 85,
  },
  {
    standId: 'S105',
    callsign: 'PC 2432',
    airline: 'Pegasus',
    aircraftType: 'A320',
    registration: 'TC-NBK',
    origin: 'SAW',
    destination: 'ESB',
    status: 'parked',
    sta: '09:00',
    std: '10:15',
    eta: '09:05',
    etd: '10:20',
    turnaround: 70,
    progress: 35,
  },
  {
    standId: 'S107',
    callsign: 'TK 2126',
    airline: 'Turkish Airlines',
    aircraftType: 'A320',
    registration: 'TC-JPB',
    origin: 'IST',
    destination: 'ESB',
    status: 'delayed',
    sta: '10:00',
    std: '11:15',
    eta: '10:35',
    etd: '11:50',
    turnaround: 75,
    progress: 0,
  },
  {
    standId: 'S109',
    callsign: 'XQ 302',
    airline: 'SunExpress',
    aircraftType: 'B737',
    registration: 'TC-SOH',
    origin: 'ADB',
    destination: 'ESB',
    status: 'parked',
    sta: '08:00',
    std: '09:20',
    eta: '07:55',
    etd: '09:25',
    turnaround: 80,
    progress: 50,
  },
  {
    standId: 'S201',
    callsign: 'TK 2188',
    airline: 'Turkish Airlines',
    aircraftType: 'A320',
    registration: 'TC-JPC',
    origin: 'IST',
    destination: 'ESB',
    status: 'pushback',
    sta: '06:30',
    std: '07:50',
    eta: '06:28',
    etd: '07:55',
    turnaround: 80,
    progress: 95,
  },
  {
    standId: 'S203',
    callsign: 'PC 2434',
    airline: 'Pegasus',
    aircraftType: 'A320',
    registration: 'TC-NBL',
    origin: 'SAW',
    destination: 'ESB',
    status: 'parked',
    sta: '09:30',
    std: '10:45',
    eta: '09:35',
    etd: '10:50',
    turnaround: 70,
    progress: 20,
  },
  {
    standId: 'S301',
    callsign: 'TK 2128',
    airline: 'Turkish Airlines',
    aircraftType: 'B737',
    registration: 'TC-JFW',
    origin: 'IST',
    destination: 'ESB',
    status: 'parked',
    sta: '08:45',
    std: '10:00',
    eta: '08:42',
    etd: '10:05',
    turnaround: 75,
    progress: 45,
  },
  {
    standId: 'S303',
    callsign: 'AJ 750',
    airline: 'AnadoluJet',
    aircraftType: 'B737',
    registration: 'TC-JHZ',
    origin: 'ADB',
    destination: 'ESB',
    status: 'arrived',
    sta: '09:15',
    std: '10:30',
    eta: '09:12',
    etd: '10:35',
    turnaround: 75,
    progress: 10,
  },
  {
    standId: 'C1',
    callsign: 'TK 6724',
    airline: 'TK Cargo',
    aircraftType: 'A330F',
    registration: 'TC-JOV',
    origin: 'IST',
    destination: 'ESB',
    status: 'loading',
    sta: '05:00',
    std: '08:00',
    eta: '04:55',
    etd: '08:15',
    turnaround: 180,
    progress: 70,
  },
];

// Terminal / Building definitions
export const terminalDefinitions = [
  {
    id: 'terminal-main',
    label: 'Main Terminal',
    type: 'terminal',
    lat: 40.1248,
    lng: 32.9990,
  },
  {
    id: 'terminal-domestic',
    label: 'Domestic Terminal',
    type: 'terminal',
    lat: 40.1243,
    lng: 33.0035,
  },
];

// Status definitions — editable at runtime
export const DEFAULT_STATUS_CONFIG = {
  parked:   { label: 'Parked',       color: '#00ffff' },
  boarding: { label: 'Boarding',     color: '#00ff88' },
  pushback: { label: 'Pushback',    color: '#facc15' },
  delayed:  { label: 'Delayed',     color: '#ff4444' },
  arrived:  { label: 'Just Arrived', color: '#a855f7' },
  loading:  { label: 'Loading',     color: '#facc15' },
  empty:    { label: 'Empty',       color: '#94A3B8' },
};

// Legacy compat — derive from config
export const STATUS_COLORS = Object.fromEntries(Object.entries(DEFAULT_STATUS_CONFIG).map(([k, v]) => [k, v.color]));
export const STATUS_LABELS = Object.fromEntries(Object.entries(DEFAULT_STATUS_CONFIG).map(([k, v]) => [k, v.label]));

/*
 * Aircraft type categories — ICAO-based size classes
 * Code A: Small regional (ATR-72, CRJ-200, ERJ-145)        ~25m span
 * Code B: Regional jets  (E170, E190, CRJ-900)              ~28m span
 * Code C: Narrow-body    (A320, B737, A321)                  ~34-36m span  ← most common
 * Code D: Large narrow   (B757, A321XLR)                     ~38m span
 * Code E: Wide-body      (A330, B767, B787)                  ~60m span
 * Code F: Heavy          (B777, A340)                        ~65m span
 * Code G: Super heavy    (A380, B747)                        ~68-80m span
 */

// Top-down SVG silhouettes per aircraft size category
// Each SVG is 40x40 viewBox, COLOR placeholder gets replaced at render time
export const AIRCRAFT_TYPE_SVGS = {
  // Code A — Small turboprop (ATR-72 style): high wing, straight wings, T-tail
  'regional-turboprop': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
    <g fill="COLOR" fill-opacity="0.9" stroke="COLOR" stroke-width="0.4" stroke-opacity="0.5">
      <path d="M20 6 L21.5 14 L33 17 L33 19 L21.5 18 L21.5 30 L25 32.5 L25 34 L20 32.5 L15 34 L15 32.5 L18.5 30 L18.5 18 L7 19 L7 17 L18.5 14 Z"/>
      <circle cx="12" cy="17.5" r="1.5" fill-opacity="0.5"/>
      <circle cx="28" cy="17.5" r="1.5" fill-opacity="0.5"/>
    </g>
  </svg>`,

  // Code B — Regional jet (E190 style): swept low wings, rear engines
  'regional-jet': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
    <g fill="COLOR" fill-opacity="0.9" stroke="COLOR" stroke-width="0.4" stroke-opacity="0.5">
      <path d="M20 5 L21.8 14 L33 18.5 L33 20.5 L21.8 18.5 L22 28 L26 31 L26 33 L20 31 L14 33 L14 31 L18 28 L18.2 18.5 L7 20.5 L7 18.5 L18.2 14 Z"/>
      <rect x="21.5" y="25" width="3" height="2" rx="0.5" fill-opacity="0.5"/>
      <rect x="15.5" y="25" width="3" height="2" rx="0.5" fill-opacity="0.5"/>
    </g>
  </svg>`,

  // Code C — Narrow-body (A320/B737 style): under-wing engines, most common
  'narrow-body': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
    <g fill="COLOR" fill-opacity="0.9" stroke="COLOR" stroke-width="0.5" stroke-opacity="0.6">
      <path d="M20 4 L22 14 L34 18 L34 21 L22 19 L22 30 L27 33 L27 35 L20 33 L13 35 L13 33 L18 30 L18 19 L6 21 L6 18 L18 14 Z"/>
      <ellipse cx="14" cy="17" rx="1.8" ry="2.5" fill-opacity="0.5"/>
      <ellipse cx="26" cy="17" rx="1.8" ry="2.5" fill-opacity="0.5"/>
    </g>
  </svg>`,

  // Code D — Large narrow (B757 style): longer fuselage, slightly wider span
  'large-narrow': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
    <g fill="COLOR" fill-opacity="0.9" stroke="COLOR" stroke-width="0.5" stroke-opacity="0.6">
      <path d="M20 3 L22 13 L35 17 L35 20 L22 18 L22 30 L27.5 33.5 L27.5 35.5 L20 33 L12.5 35.5 L12.5 33.5 L18 30 L18 18 L5 20 L5 17 L18 13 Z"/>
      <ellipse cx="13.5" cy="16" rx="1.8" ry="2.8" fill-opacity="0.5"/>
      <ellipse cx="26.5" cy="16" rx="1.8" ry="2.8" fill-opacity="0.5"/>
    </g>
  </svg>`,

  // Code E — Wide-body twin (A330/B787 style): wider fuselage, larger engines
  'wide-body': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
    <g fill="COLOR" fill-opacity="0.9" stroke="COLOR" stroke-width="0.5" stroke-opacity="0.6">
      <path d="M20 3 L22.5 12 L36 16 L36 20 L22.5 18 L22.5 29 L28 32.5 L28 35 L20 32 L12 35 L12 32.5 L17.5 29 L17.5 18 L4 20 L4 16 L17.5 12 Z"/>
      <ellipse cx="12.5" cy="15.5" rx="2.2" ry="3.2" fill-opacity="0.5"/>
      <ellipse cx="27.5" cy="15.5" rx="2.2" ry="3.2" fill-opacity="0.5"/>
    </g>
  </svg>`,

  // Code F — Heavy quad (B747/A340 style): 4 engines
  'heavy-quad': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
    <g fill="COLOR" fill-opacity="0.9" stroke="COLOR" stroke-width="0.5" stroke-opacity="0.6">
      <path d="M20 2 L22.5 11 L37 15 L37 19 L22.5 17 L22.5 29 L28.5 33 L28.5 35.5 L20 32 L11.5 35.5 L11.5 33 L17.5 29 L17.5 17 L3 19 L3 15 L17.5 11 Z"/>
      <ellipse cx="11" cy="14.5" rx="1.6" ry="2.5" fill-opacity="0.5"/>
      <ellipse cx="16" cy="13.5" rx="1.6" ry="2.5" fill-opacity="0.5"/>
      <ellipse cx="24" cy="13.5" rx="1.6" ry="2.5" fill-opacity="0.5"/>
      <ellipse cx="29" cy="14.5" rx="1.6" ry="2.5" fill-opacity="0.5"/>
    </g>
  </svg>`,

  // Code G — Super heavy (A380 style): massive wingspan, double-deck body
  'super-heavy': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
    <g fill="COLOR" fill-opacity="0.9" stroke="COLOR" stroke-width="0.6" stroke-opacity="0.6">
      <path d="M20 2 L23 10 L38 14 L38 19 L23 16.5 L23 28 L29 32 L29 35 L20 31.5 L11 35 L11 32 L17 28 L17 16.5 L2 19 L2 14 L17 10 Z"/>
      <ellipse cx="10" cy="13.5" rx="2" ry="2.8" fill-opacity="0.5"/>
      <ellipse cx="15.5" cy="12.5" rx="2" ry="2.8" fill-opacity="0.5"/>
      <ellipse cx="24.5" cy="12.5" rx="2" ry="2.8" fill-opacity="0.5"/>
      <ellipse cx="30" cy="13.5" rx="2" ry="2.8" fill-opacity="0.5"/>
    </g>
  </svg>`,
};

// Map common ICAO/IATA aircraft codes to our SVG categories
export const AIRCRAFT_CODE_MAP = {
  // Turboprops (Code A)
  'ATR72': 'regional-turboprop', 'ATR42': 'regional-turboprop', 'DH8D': 'regional-turboprop',
  'AT76': 'regional-turboprop', 'AT75': 'regional-turboprop',
  // Regional jets (Code B)
  'E170': 'regional-jet', 'E175': 'regional-jet', 'E190': 'regional-jet', 'E195': 'regional-jet',
  'CRJ9': 'regional-jet', 'CRJ7': 'regional-jet', 'E145': 'regional-jet',
  // Narrow-body (Code C) — most common
  'A320': 'narrow-body', 'A319': 'narrow-body', 'A20N': 'narrow-body', 'A21N': 'narrow-body',
  'B737': 'narrow-body', 'B738': 'narrow-body', 'B38M': 'narrow-body', 'B39M': 'narrow-body',
  'A321': 'narrow-body',
  // Large narrow (Code D)
  'B752': 'large-narrow', 'B753': 'large-narrow', 'A321XLR': 'large-narrow',
  // Wide-body twin (Code E)
  'A330': 'wide-body', 'A332': 'wide-body', 'A333': 'wide-body', 'A330F': 'wide-body',
  'B767': 'wide-body', 'B787': 'wide-body', 'B788': 'wide-body', 'B789': 'wide-body',
  'A350': 'wide-body', 'A359': 'wide-body',
  // Heavy quad (Code F)
  'B777': 'heavy-quad', 'B772': 'heavy-quad', 'B773': 'heavy-quad', 'B77W': 'heavy-quad',
  'A340': 'heavy-quad', 'A343': 'heavy-quad', 'A346': 'heavy-quad',
  // Super heavy (Code G)
  'A380': 'super-heavy', 'A388': 'super-heavy', 'B747': 'super-heavy', 'B748': 'super-heavy', 'B744': 'super-heavy',
};

// Jet bridge / passenger boarding bridge SVG
// Top-down view: telescopic arm extending from terminal to aircraft door
export const JET_BRIDGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 20" width="60" height="20">
  <g fill="none" stroke="COLOR" stroke-width="1.2" stroke-opacity="0.7">
    <!-- Fixed base (terminal side) -->
    <rect x="0" y="6" width="10" height="8" rx="1.5" fill="COLOR" fill-opacity="0.15"/>
    <!-- Telescopic arm -->
    <line x1="10" y1="10" x2="44" y2="10" stroke-dasharray="3 2"/>
    <!-- Rotunda (cab at aircraft end) -->
    <rect x="44" y="5" width="12" height="10" rx="3" fill="COLOR" fill-opacity="0.2"/>
    <!-- Cab opening -->
    <line x1="56" y1="8" x2="60" y2="8"/>
    <line x1="56" y1="12" x2="60" y2="12"/>
  </g>
</svg>`;
