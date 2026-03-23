export const assetDefinitions = [
  // ─── AIRCRAFT ───────────────────────────────────────────
  {
    id: 'a320',
    label: 'A320',
    category: 'aircraft',
    width: 48,
    height: 48,
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <ellipse cx="40" cy="68" rx="22" ry="4" fill="#000" opacity="0.3"/>
      <!-- Fuselage -->
      <path d="M37 12 C37 8, 43 8, 43 12 L43 62 C43 66, 37 66, 37 62 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="0.5"/>
      <!-- Fuselage highlight -->
      <path d="M38 14 L38 60" stroke="#fff" stroke-width="1" opacity="0.4"/>
      <!-- Wings -->
      <path d="M40 34 L8 42 L8 45 L40 39 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.5"/>
      <path d="M40 34 L72 42 L72 45 L40 39 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.5"/>
      <!-- Wing tips -->
      <path d="M8 42 L6 40 L6 43 L8 45 Z" fill="#94a3b8"/>
      <path d="M72 42 L74 40 L74 43 L72 45 Z" fill="#94a3b8"/>
      <!-- Horizontal Stabilizer -->
      <path d="M40 10 L26 14 L26 16 L40 13 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.3"/>
      <path d="M40 10 L54 14 L54 16 L40 13 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.3"/>
      <!-- Vertical Stabilizer -->
      <path d="M39 6 L37 12 L43 12 L41 6 Z" fill="#3b82f6" stroke="#2563eb" stroke-width="0.4"/>
      <!-- Engines -->
      <rect x="18" y="38" width="5" height="10" rx="2" fill="#64748b" stroke="#475569" stroke-width="0.4"/>
      <rect x="57" y="38" width="5" height="10" rx="2" fill="#64748b" stroke="#475569" stroke-width="0.4"/>
      <!-- Engine intake glow -->
      <ellipse cx="20.5" cy="48" rx="2" ry="1" fill="#facc15" opacity="0.6"/>
      <ellipse cx="59.5" cy="48" rx="2" ry="1" fill="#facc15" opacity="0.6"/>
      <!-- Cockpit windows -->
      <path d="M38 60 C38 63, 42 63, 42 60 L42 57 L38 57 Z" fill="#0ea5e9" opacity="0.8"/>
      <!-- Windows row -->
      <line x1="38.5" y1="20" x2="38.5" y2="54" stroke="#0ea5e9" stroke-width="0.6" opacity="0.5" stroke-dasharray="1.5 1.5"/>
      <line x1="41.5" y1="20" x2="41.5" y2="54" stroke="#0ea5e9" stroke-width="0.6" opacity="0.5" stroke-dasharray="1.5 1.5"/>
    </svg>`,
  },
  {
    id: 'b737',
    label: 'B737',
    category: 'aircraft',
    width: 44,
    height: 44,
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="68" rx="20" ry="3.5" fill="#000" opacity="0.3"/>
      <path d="M37 14 C37 10, 43 10, 43 14 L43 60 C43 64, 37 64, 37 60 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="0.5"/>
      <path d="M38 16 L38 58" stroke="#fff" stroke-width="1" opacity="0.4"/>
      <path d="M40 34 L10 41 L10 44 L40 38 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.5"/>
      <path d="M40 34 L70 41 L70 44 L40 38 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.5"/>
      <path d="M40 12 L28 15 L28 17 L40 14 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.3"/>
      <path d="M40 12 L52 15 L52 17 L40 14 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.3"/>
      <path d="M39 7 L37 14 L43 14 L41 7 Z" fill="#22c55e" stroke="#16a34a" stroke-width="0.4"/>
      <rect x="19" y="38" width="5" height="9" rx="2" fill="#64748b" stroke="#475569" stroke-width="0.4"/>
      <rect x="56" y="38" width="5" height="9" rx="2" fill="#64748b" stroke="#475569" stroke-width="0.4"/>
      <ellipse cx="21.5" cy="47" rx="2" ry="1" fill="#facc15" opacity="0.6"/>
      <ellipse cx="58.5" cy="47" rx="2" ry="1" fill="#facc15" opacity="0.6"/>
      <path d="M38 58 C38 61, 42 61, 42 58 L42 55 L38 55 Z" fill="#0ea5e9" opacity="0.8"/>
      <line x1="38.5" y1="22" x2="38.5" y2="52" stroke="#0ea5e9" stroke-width="0.6" opacity="0.5" stroke-dasharray="1.5 1.5"/>
      <line x1="41.5" y1="22" x2="41.5" y2="52" stroke="#0ea5e9" stroke-width="0.6" opacity="0.5" stroke-dasharray="1.5 1.5"/>
    </svg>`,
  },
  {
    id: 'a330',
    label: 'A330',
    category: 'aircraft',
    width: 56,
    height: 56,
    svg: `<svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="48" cy="84" rx="28" ry="5" fill="#000" opacity="0.25"/>
      <!-- Fuselage - wider body -->
      <path d="M44 10 C44 5, 52 5, 52 10 L52 78 C52 82, 44 82, 44 78 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="0.5"/>
      <path d="M45.5 12 L45.5 76" stroke="#fff" stroke-width="1.2" opacity="0.35"/>
      <!-- Wings - longer span -->
      <path d="M48 42 L4 52 L4 56 L48 48 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.5"/>
      <path d="M48 42 L92 52 L92 56 L48 48 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.5"/>
      <path d="M4 52 L2 50 L2 54 L4 56 Z" fill="#94a3b8"/>
      <path d="M92 52 L94 50 L94 54 L92 56 Z" fill="#94a3b8"/>
      <!-- H-stab -->
      <path d="M48 12 L32 17 L32 19 L48 15 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.3"/>
      <path d="M48 12 L64 17 L64 19 L48 15 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.3"/>
      <!-- V-stab -->
      <path d="M47 4 L44 12 L52 12 L49 4 Z" fill="#ef4444" stroke="#dc2626" stroke-width="0.4"/>
      <!-- Engines - twin widebody -->
      <rect x="20" y="48" width="6" height="12" rx="3" fill="#64748b" stroke="#475569" stroke-width="0.4"/>
      <rect x="70" y="48" width="6" height="12" rx="3" fill="#64748b" stroke="#475569" stroke-width="0.4"/>
      <ellipse cx="23" cy="60" rx="2.5" ry="1.2" fill="#facc15" opacity="0.6"/>
      <ellipse cx="73" cy="60" rx="2.5" ry="1.2" fill="#facc15" opacity="0.6"/>
      <!-- Cockpit -->
      <path d="M45 76 C45 80, 51 80, 51 76 L51 72 L45 72 Z" fill="#0ea5e9" opacity="0.8"/>
      <!-- Windows -->
      <line x1="45.5" y1="24" x2="45.5" y2="68" stroke="#0ea5e9" stroke-width="0.6" opacity="0.5" stroke-dasharray="1.5 2"/>
      <line x1="50.5" y1="24" x2="50.5" y2="68" stroke="#0ea5e9" stroke-width="0.6" opacity="0.5" stroke-dasharray="1.5 2"/>
    </svg>`,
  },
  {
    id: 'b777',
    label: 'B777',
    category: 'aircraft',
    width: 60,
    height: 60,
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="88" rx="30" ry="5" fill="#000" opacity="0.25"/>
      <path d="M46 8 C46 3, 54 3, 54 8 L54 82 C54 86, 46 86, 46 82 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="0.5"/>
      <path d="M47.5 10 L47.5 80" stroke="#fff" stroke-width="1.2" opacity="0.35"/>
      <!-- Massive wingspan -->
      <path d="M50 44 L2 56 L2 60 L50 50 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.5"/>
      <path d="M50 44 L98 56 L98 60 L50 50 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.5"/>
      <!-- Raked wingtips -->
      <path d="M2 56 L0 53 L0 58 L2 60 Z" fill="#94a3b8"/>
      <path d="M98 56 L100 53 L100 58 L98 60 Z" fill="#94a3b8"/>
      <path d="M50 10 L34 16 L34 18 L50 13 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.3"/>
      <path d="M50 10 L66 16 L66 18 L50 13 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.3"/>
      <path d="M49 3 L46 10 L54 10 L51 3 Z" fill="#1e40af" stroke="#1d4ed8" stroke-width="0.4"/>
      <!-- Large GE90 engines -->
      <rect x="18" y="50" width="7" height="14" rx="3.5" fill="#64748b" stroke="#475569" stroke-width="0.4"/>
      <rect x="75" y="50" width="7" height="14" rx="3.5" fill="#64748b" stroke="#475569" stroke-width="0.4"/>
      <ellipse cx="21.5" cy="64" rx="3" ry="1.4" fill="#facc15" opacity="0.6"/>
      <ellipse cx="78.5" cy="64" rx="3" ry="1.4" fill="#facc15" opacity="0.6"/>
      <path d="M47 80 C47 84, 53 84, 53 80 L53 76 L47 76 Z" fill="#0ea5e9" opacity="0.8"/>
      <line x1="47.5" y1="22" x2="47.5" y2="72" stroke="#0ea5e9" stroke-width="0.6" opacity="0.5" stroke-dasharray="1.5 2"/>
      <line x1="52.5" y1="22" x2="52.5" y2="72" stroke="#0ea5e9" stroke-width="0.6" opacity="0.5" stroke-dasharray="1.5 2"/>
    </svg>`,
  },

  // ─── INFRASTRUCTURE ─────────────────────────────────────
  {
    id: 'jet-bridge',
    label: 'Jet Bridge',
    category: 'infrastructure',
    width: 50,
    height: 16,
    svg: `<svg viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <rect x="4" y="24" width="112" height="6" rx="2" fill="#000" opacity="0.2"/>
      <!-- Bridge body -->
      <rect x="4" y="6" width="100" height="16" rx="2" fill="#475569" stroke="#64748b" stroke-width="0.8"/>
      <!-- Segments -->
      <line x1="30" y1="6" x2="30" y2="22" stroke="#334155" stroke-width="1"/>
      <line x1="56" y1="6" x2="56" y2="22" stroke="#334155" stroke-width="1"/>
      <line x1="82" y1="6" x2="82" y2="22" stroke="#334155" stroke-width="1"/>
      <!-- Glass panels -->
      <rect x="8" y="9" width="18" height="5" rx="1" fill="#0ea5e9" opacity="0.3"/>
      <rect x="34" y="9" width="18" height="5" rx="1" fill="#0ea5e9" opacity="0.3"/>
      <rect x="60" y="9" width="18" height="5" rx="1" fill="#0ea5e9" opacity="0.3"/>
      <!-- Top highlight -->
      <line x1="6" y1="7" x2="102" y2="7" stroke="#94a3b8" stroke-width="0.5" opacity="0.5"/>
      <!-- Rotunda (aircraft end) -->
      <circle cx="108" cy="14" r="10" fill="#475569" stroke="#64748b" stroke-width="0.8"/>
      <circle cx="108" cy="14" r="5" fill="#0ea5e9" opacity="0.25"/>
      <!-- Terminal end -->
      <rect x="0" y="4" width="8" height="20" rx="1" fill="#334155" stroke="#64748b" stroke-width="0.6"/>
    </svg>`,
  },
  {
    id: 'terminal-block',
    label: 'Terminal',
    category: 'infrastructure',
    width: 80,
    height: 32,
    svg: `<svg viewBox="0 0 200 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <rect x="6" y="50" width="188" height="10" rx="3" fill="#000" opacity="0.2"/>
      <!-- Main building -->
      <rect x="4" y="12" width="192" height="40" rx="3" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <!-- Roof -->
      <rect x="4" y="8" width="192" height="8" rx="2" fill="#334155" stroke="#475569" stroke-width="0.5"/>
      <!-- Glass curtain wall -->
      <rect x="10" y="18" width="180" height="14" rx="1" fill="#0ea5e9" opacity="0.15"/>
      <!-- Window columns -->
      ${Array.from({length: 18}, (_, i) => `<rect x="${14 + i * 10}" y="18" width="1" height="14" fill="#334155" opacity="0.6"/>`).join('')}
      <!-- Ground floor -->
      <rect x="10" y="36" width="180" height="12" rx="1" fill="#0f172a"/>
      <!-- Gate doors -->
      ${Array.from({length: 6}, (_, i) => `<rect x="${22 + i * 30}" y="38" width="12" height="8" rx="1" fill="#334155" stroke="#475569" stroke-width="0.4"/>`).join('')}
      <!-- Top highlight -->
      <line x1="8" y1="9" x2="192" y2="9" stroke="#64748b" stroke-width="0.5" opacity="0.5"/>
    </svg>`,
  },
  {
    id: 'stand-marking',
    label: 'Stand Area',
    category: 'infrastructure',
    width: 40,
    height: 50,
    svg: `<svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Stand box outline -->
      <rect x="4" y="4" width="52" height="72" rx="2" fill="none" stroke="#facc15" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.7"/>
      <!-- Center line -->
      <line x1="30" y1="4" x2="30" y2="76" stroke="#facc15" stroke-width="1" stroke-dasharray="6 4" opacity="0.5"/>
      <!-- Nose wheel guide -->
      <circle cx="30" cy="60" r="4" fill="none" stroke="#facc15" stroke-width="1" opacity="0.6"/>
      <line x1="26" y1="60" x2="34" y2="60" stroke="#facc15" stroke-width="0.8" opacity="0.6"/>
      <line x1="30" y1="56" x2="30" y2="64" stroke="#facc15" stroke-width="0.8" opacity="0.6"/>
      <!-- Lead-in line -->
      <path d="M30 76 L30 80" stroke="#facc15" stroke-width="1.5" opacity="0.8"/>
      <!-- Wing span markers -->
      <line x1="4" y1="34" x2="12" y2="34" stroke="#facc15" stroke-width="1" opacity="0.5"/>
      <line x1="48" y1="34" x2="56" y2="34" stroke="#facc15" stroke-width="1" opacity="0.5"/>
    </svg>`,
  },
  {
    id: 'taxiway-line',
    label: 'Taxiway Line',
    category: 'infrastructure',
    width: 60,
    height: 8,
    svg: `<svg viewBox="0 0 160 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Taxiway centerline -->
      <line x1="0" y1="8" x2="160" y2="8" stroke="#facc15" stroke-width="3" stroke-dasharray="10 6" opacity="0.8"/>
      <!-- Edge lines -->
      <line x1="0" y1="2" x2="160" y2="2" stroke="#facc15" stroke-width="1" opacity="0.3"/>
      <line x1="0" y1="14" x2="160" y2="14" stroke="#facc15" stroke-width="1" opacity="0.3"/>
    </svg>`,
  },

  // ─── GSE VEHICLES ───────────────────────────────────────
  {
    id: 'pushback',
    label: 'Pushback Tug',
    category: 'vehicle',
    width: 28,
    height: 28,
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <ellipse cx="24" cy="42" rx="14" ry="3" fill="#000" opacity="0.25"/>
      <!-- Body -->
      <rect x="10" y="8" width="28" height="30" rx="4" fill="#d97706" stroke="#b45309" stroke-width="0.8"/>
      <!-- Cab -->
      <rect x="14" y="12" width="20" height="10" rx="2" fill="#1e293b" stroke="#334155" stroke-width="0.5"/>
      <!-- Windshield -->
      <rect x="16" y="14" width="16" height="6" rx="1" fill="#0ea5e9" opacity="0.4"/>
      <!-- Chassis/push bar -->
      <rect x="18" y="38" width="12" height="4" rx="1" fill="#92400e"/>
      <!-- Wheels -->
      <rect x="11" y="32" width="6" height="8" rx="2" fill="#1c1917" stroke="#44403c" stroke-width="0.5"/>
      <rect x="31" y="32" width="6" height="8" rx="2" fill="#1c1917" stroke="#44403c" stroke-width="0.5"/>
      <!-- Warning light -->
      <circle cx="24" cy="10" r="2" fill="#facc15" opacity="0.9"/>
      <circle cx="24" cy="10" r="4" fill="#facc15" opacity="0.15"/>
    </svg>`,
  },
  {
    id: 'fuel-truck',
    label: 'Fuel Truck',
    category: 'vehicle',
    width: 30,
    height: 22,
    svg: `<svg viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <ellipse cx="32" cy="37" rx="26" ry="3" fill="#000" opacity="0.2"/>
      <!-- Tank body -->
      <rect x="4" y="8" width="40" height="22" rx="10" fill="#dc2626" stroke="#b91c1c" stroke-width="0.8"/>
      <rect x="6" y="10" width="36" height="8" rx="4" fill="#ef4444" opacity="0.6"/>
      <!-- Cab -->
      <rect x="44" y="10" width="16" height="18" rx="3" fill="#1e293b" stroke="#334155" stroke-width="0.5"/>
      <rect x="47" y="13" width="10" height="6" rx="1" fill="#0ea5e9" opacity="0.4"/>
      <!-- Wheels -->
      <circle cx="14" cy="32" r="4" fill="#1c1917" stroke="#44403c" stroke-width="0.6"/>
      <circle cx="28" cy="32" r="4" fill="#1c1917" stroke="#44403c" stroke-width="0.6"/>
      <circle cx="52" cy="32" r="4" fill="#1c1917" stroke="#44403c" stroke-width="0.6"/>
      <!-- FUEL text -->
      <text x="24" y="23" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold" opacity="0.7">FUEL</text>
      <!-- Hose reel -->
      <circle cx="8" cy="20" r="3" fill="#991b1b" stroke="#7f1d1d" stroke-width="0.5"/>
    </svg>`,
  },
  {
    id: 'baggage-cart',
    label: 'Baggage Cart',
    category: 'vehicle',
    width: 26,
    height: 20,
    svg: `<svg viewBox="0 0 56 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <ellipse cx="28" cy="33" rx="22" ry="2.5" fill="#000" opacity="0.2"/>
      <!-- Cart body -->
      <rect x="4" y="8" width="24" height="18" rx="2" fill="#7c3aed" stroke="#6d28d9" stroke-width="0.7"/>
      <!-- Baggage items -->
      <rect x="7" y="10" width="8" height="6" rx="1" fill="#5b21b6" stroke="#7c3aed" stroke-width="0.3"/>
      <rect x="17" y="10" width="8" height="6" rx="1" fill="#5b21b6" stroke="#7c3aed" stroke-width="0.3"/>
      <rect x="10" y="17" width="14" height="5" rx="1" fill="#5b21b6" stroke="#7c3aed" stroke-width="0.3"/>
      <!-- Tractor -->
      <rect x="30" y="10" width="18" height="16" rx="3" fill="#d97706" stroke="#b45309" stroke-width="0.6"/>
      <rect x="33" y="13" width="12" height="5" rx="1" fill="#0ea5e9" opacity="0.35"/>
      <!-- Hitch -->
      <rect x="27" y="16" width="5" height="3" rx="1" fill="#92400e"/>
      <!-- Wheels -->
      <circle cx="12" cy="28" r="3" fill="#1c1917" stroke="#44403c" stroke-width="0.5"/>
      <circle cx="40" cy="28" r="3" fill="#1c1917" stroke="#44403c" stroke-width="0.5"/>
    </svg>`,
  },
  {
    id: 'catering-truck',
    label: 'Catering Truck',
    category: 'vehicle',
    width: 28,
    height: 26,
    svg: `<svg viewBox="0 0 52 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <ellipse cx="26" cy="44" rx="20" ry="3" fill="#000" opacity="0.2"/>
      <!-- Box body -->
      <rect x="6" y="4" width="28" height="28" rx="2" fill="#f0f9ff" stroke="#94a3b8" stroke-width="0.8"/>
      <!-- Side panel lines -->
      <line x1="6" y1="12" x2="34" y2="12" stroke="#cbd5e1" stroke-width="0.5"/>
      <line x1="6" y1="20" x2="34" y2="20" stroke="#cbd5e1" stroke-width="0.5"/>
      <!-- Logo area -->
      <rect x="10" y="6" width="20" height="4" rx="1" fill="#3b82f6" opacity="0.3"/>
      <!-- Scissor lift -->
      <path d="M12 32 L28 38 M28 32 L12 38" stroke="#64748b" stroke-width="1.5"/>
      <!-- Cab -->
      <rect x="34" y="14" width="14" height="18" rx="3" fill="#1e293b" stroke="#334155" stroke-width="0.5"/>
      <rect x="37" y="17" width="8" height="5" rx="1" fill="#0ea5e9" opacity="0.4"/>
      <!-- Platform -->
      <rect x="4" y="30" width="32" height="4" rx="1" fill="#64748b" stroke="#475569" stroke-width="0.5"/>
      <!-- Wheels -->
      <circle cx="14" cy="40" r="3" fill="#1c1917" stroke="#44403c" stroke-width="0.5"/>
      <circle cx="40" cy="36" r="3" fill="#1c1917" stroke="#44403c" stroke-width="0.5"/>
    </svg>`,
  },
  {
    id: 'gpu',
    label: 'GPU',
    category: 'vehicle',
    width: 22,
    height: 18,
    svg: `<svg viewBox="0 0 44 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <ellipse cx="22" cy="33" rx="16" ry="2.5" fill="#000" opacity="0.2"/>
      <!-- Main unit -->
      <rect x="4" y="6" width="36" height="22" rx="3" fill="#065f46" stroke="#047857" stroke-width="0.8"/>
      <!-- Panels -->
      <rect x="8" y="9" width="14" height="8" rx="1" fill="#064e3b" stroke="#047857" stroke-width="0.3"/>
      <rect x="8" y="19" width="14" height="6" rx="1" fill="#064e3b" stroke="#047857" stroke-width="0.3"/>
      <!-- Exhaust vents -->
      ${Array.from({length: 4}, (_, i) => `<rect x="26" y="${9 + i * 4}" width="10" height="2" rx="0.5" fill="#047857" opacity="0.6"/>`).join('')}
      <!-- Cable -->
      <path d="M22 28 C22 34, 30 34, 36 30" stroke="#facc15" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <!-- Power indicator -->
      <circle cx="10" cy="11" r="1.5" fill="#22c55e" opacity="0.9"/>
      <circle cx="10" cy="11" r="3" fill="#22c55e" opacity="0.15"/>
      <!-- Wheels -->
      <circle cx="10" cy="30" r="2.5" fill="#1c1917" stroke="#44403c" stroke-width="0.4"/>
      <circle cx="34" cy="30" r="2.5" fill="#1c1917" stroke="#44403c" stroke-width="0.4"/>
    </svg>`,
  },
];
