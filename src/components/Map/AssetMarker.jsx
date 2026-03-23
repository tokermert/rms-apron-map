import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Trash2, RotateCw, Maximize2 } from 'lucide-react';

export default function AssetMarker({ asset, isSelected, onSelect, onUpdateHeading, onUpdateScale, onRemove }) {
  const scale = asset.scale || 1;
  const scaledW = Math.round(asset.width * scale);
  const scaledH = Math.round(asset.height * scale);

  const icon = L.divIcon({
    className: 'asset-marker',
    html: `<div class="asset-marker-inner" style="transform: rotate(${asset.heading}deg); width: ${scaledW}px; height: ${scaledH}px;">${asset.svg}</div>`,
    iconSize: [scaledW, scaledH],
    iconAnchor: [scaledW / 2, scaledH / 2],
  });

  const sliderStyle = {
    width: '100%',
    accentColor: '#00ffff',
    cursor: 'pointer',
    height: '4px',
  };

  return (
    <Marker
      position={[asset.latlng.lat, asset.latlng.lng]}
      icon={icon}
      draggable={true}
      eventHandlers={{
        click: () => onSelect(asset.id),
      }}
    >
      <Popup className="rotation-popup" offset={[0, -10]}>
        <div style={{ minWidth: '200px' }}>
          <div style={{
            fontWeight: 600, marginBottom: '10px', color: '#00ffff', fontSize: '13px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            {asset.label}
            <span style={{ fontSize: '10px', color: '#475569', fontWeight: 400 }}>
              {scaledW}x{scaledH}px
            </span>
          </div>

          {/* Heading control */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <RotateCw size={12} color="#00ffff" />
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Heading</span>
              <span style={{ fontSize: '11px', color: '#00ffff', marginLeft: 'auto', fontWeight: 600 }}>{asset.heading}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={asset.heading}
              onChange={(e) => onUpdateHeading(asset.id, parseInt(e.target.value))}
              style={sliderStyle}
            />
          </div>

          {/* Scale control */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Maximize2 size={12} color="#facc15" />
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Scale</span>
              <span style={{ fontSize: '11px', color: '#facc15', marginLeft: 'auto', fontWeight: 600 }}>{scale.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="8"
              step="0.1"
              value={scale}
              onChange={(e) => onUpdateScale(asset.id, parseFloat(e.target.value))}
              style={{ ...sliderStyle, accentColor: '#facc15' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
              <span style={{ fontSize: '9px', color: '#475569' }}>0.3x</span>
              <span style={{ fontSize: '9px', color: '#475569' }}>8x</span>
            </div>
          </div>

          {/* Remove button */}
          <button
            onClick={() => onRemove(asset.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 68, 68, 0.2)',
              border: '1px solid rgba(255, 68, 68, 0.4)',
              color: '#ff4444',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <Trash2 size={12} /> Remove
          </button>
        </div>
      </Popup>
    </Marker>
  );
}
