import { useState, useRef, useEffect } from 'react';
import { Satellite, Moon, Download, Layers, Focus, Sun, Map, ChevronDown } from 'lucide-react';
import { TILE_PROVIDERS } from '../Map/TileLayerToggle';

function ToolbarButton({ active, onClick, icon: Icon, label, activeColor = '#00ffff' }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold
                 border transition-all duration-200 hover:scale-105 cursor-pointer"
      style={{
        background: active ? `${activeColor}15` : 'rgba(10, 10, 20, 0.9)',
        backdropFilter: 'blur(12px)',
        borderColor: active ? `${activeColor}66` : 'rgba(255, 255, 255, 0.1)',
        color: active ? activeColor : '#64748b',
        boxShadow: active ? `0 0 15px ${activeColor}20` : 'none',
      }}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

const GROUP_COLORS = {
  Dark: '#00ffff',
  Satellite: '#facc15',
  Streets: '#00ff88',
};

function TileSelector({ tileMode, onSelectTile }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = TILE_PROVIDERS[tileMode] || TILE_PROVIDERS.dark;
  const groupColor = GROUP_COLORS[current.group] || '#00ffff';

  // Group the providers
  const groups = {};
  Object.entries(TILE_PROVIDERS).forEach(([key, val]) => {
    if (!groups[val.group]) groups[val.group] = [];
    groups[val.group].push({ key, ...val });
  });

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold
                   border transition-all duration-200 hover:scale-105 cursor-pointer w-full"
        style={{
          background: 'rgba(10, 10, 20, 0.9)',
          backdropFilter: 'blur(12px)',
          borderColor: `${groupColor}40`,
          color: groupColor,
          boxShadow: `0 0 12px ${groupColor}15`,
        }}
      >
        {current.group === 'Satellite' ? <Satellite size={14} /> :
         current.group === 'Dark' ? <Moon size={14} /> :
         <Map size={14} />}
        <span style={{ flex: 1, textAlign: 'left' }}>{current.label}</span>
        <ChevronDown size={12} style={{
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
        }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: '4px',
          width: '210px',
          background: 'rgba(10, 10, 20, 0.96)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 255, 255, 0.2)',
          borderRadius: '8px',
          overflow: 'hidden',
          zIndex: 9999,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}>
          {Object.entries(groups).map(([groupName, items]) => (
            <div key={groupName}>
              <div style={{
                padding: '6px 10px 3px',
                fontSize: '9px', fontWeight: 700,
                color: GROUP_COLORS[groupName] || '#64748b',
                textTransform: 'uppercase', letterSpacing: '1.5px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>
                {groupName}
              </div>
              {items.map((item) => {
                const isActive = tileMode === item.key;
                const color = GROUP_COLORS[groupName] || '#00ffff';
                return (
                  <button
                    key={item.key}
                    onClick={() => { onSelectTile(item.key); setOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      width: '100%', padding: '7px 10px',
                      background: isActive ? `${color}12` : 'transparent',
                      border: 'none', cursor: 'pointer',
                      borderLeft: isActive ? `2px solid ${color}` : '2px solid transparent',
                      color: isActive ? color : '#94a3b8',
                      fontSize: '11px', fontWeight: isActive ? 700 : 500,
                      textAlign: 'left',
                      transition: 'all 0.1s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.target.style.background = 'rgba(255,255,255,0.04)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.target.style.background = 'transparent';
                    }}
                  >
                    <div style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: isActive ? color : 'rgba(255,255,255,0.15)',
                    }} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MapToolbar({
  tileMode,
  onSelectTile,
  airportFocus,
  onToggleAirportFocus,
  brighterRoads,
  onToggleBrighterRoads,
  onFinalize,
  layerCount,
  assetCount,
}) {
  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2" style={{ width: '190px' }}>
      {/* Tile Selector */}
      <TileSelector tileMode={tileMode} onSelectTile={onSelectTile} />

      {/* Airport Focus */}
      <ToolbarButton
        active={airportFocus}
        onClick={onToggleAirportFocus}
        icon={Focus}
        label="Airport Focus"
        activeColor="#00ffff"
      />

      {/* Brighter Roads */}
      <ToolbarButton
        active={brighterRoads}
        onClick={onToggleBrighterRoads}
        icon={Sun}
        label="Bright Roads"
        activeColor="#facc15"
      />

      {/* Stats */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs border"
        style={{
          background: 'rgba(10, 10, 20, 0.9)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          color: '#64748b',
        }}
      >
        <Layers size={12} className="text-cyan-500/60" />
        <span>{layerCount} shapes</span>
        <span className="text-white/10">|</span>
        <span>{assetCount} assets</span>
      </div>

      {/* Finalize / Export */}
      <button
        onClick={onFinalize}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold
                   border transition-all duration-200 hover:scale-105 cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.15), rgba(0, 255, 136, 0.15))',
          borderColor: 'rgba(0, 255, 200, 0.4)',
          color: '#00ffcc',
          boxShadow: '0 0 20px rgba(0, 255, 200, 0.1)',
        }}
      >
        <Download size={14} />
        Finalize GeoJSON
      </button>
    </div>
  );
}
