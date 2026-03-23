import { useState, useEffect } from 'react';

export default function BuildingEditorPanel({
  buildings, selectedBuilding, drawMode, drawingPoints,
  onStartDraw, onFinishDraw, onCancelDraw, onUndoDraw,
  onSelectBuilding, onDeselectBuilding,
  onUpdateBuilding, onDeleteBuilding,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {selectedBuilding ? (
        <BuildingDetail
          building={selectedBuilding}
          onUpdate={onUpdateBuilding}
          onDeselect={onDeselectBuilding}
          onDelete={onDeleteBuilding}
        />
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
          {/* Draw Controls */}
          <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            {!drawMode ? (
              <button onClick={onStartDraw}
                style={{
                  width: '100%', padding: '10px 0', borderRadius: 10,
                  border: '1px solid rgba(74, 158, 255, 0.3)',
                  background: 'rgba(74, 158, 255, 0.08)',
                  color: '#4a9eff', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'background 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(74, 158, 255, 0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(74, 158, 255, 0.08)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Draw Building
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: 10, color: '#4a9eff', fontWeight: 600, marginBottom: 4 }}>
                  Drawing: {drawingPoints.length} points placed
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => onFinishDraw()}
                    disabled={drawingPoints.length < 3}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 8,
                      border: '1px solid rgba(0, 255, 136, 0.3)',
                      background: drawingPoints.length >= 3 ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255,255,255,0.02)',
                      color: drawingPoints.length >= 3 ? '#00ff88' : '#475569',
                      fontSize: 10, fontWeight: 700, cursor: drawingPoints.length >= 3 ? 'pointer' : 'default',
                    }}
                  >
                    ✓ Finish
                  </button>
                  <button onClick={onUndoDraw}
                    disabled={drawingPoints.length === 0}
                    style={{
                      padding: '8px 12px', borderRadius: 8,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.03)',
                      color: drawingPoints.length > 0 ? '#94a3b8' : '#334155',
                      fontSize: 10, fontWeight: 600, cursor: drawingPoints.length > 0 ? 'pointer' : 'default',
                    }}
                  >
                    ↩
                  </button>
                  <button onClick={onCancelDraw}
                    style={{
                      padding: '8px 12px', borderRadius: 8,
                      border: '1px solid rgba(255, 68, 68, 0.2)',
                      background: 'rgba(255, 68, 68, 0.05)',
                      color: '#ff4444', fontSize: 10, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Info hint */}
          {!drawMode && buildings.length === 0 && (
            <div style={{ padding: '16px 14px', fontSize: 10, color: '#475569', lineHeight: 1.5, fontWeight: 500 }}>
              Draw terminal buildings on the map. Click points to create the building polygon, then adjust height to extrude to 3D.
            </div>
          )}

          {/* Building List */}
          {buildings.map((building) => (
            <button key={building.id} onClick={() => onSelectBuilding(building.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', border: 'none',
                borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                background: 'transparent', cursor: 'pointer', textAlign: 'left',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{
                width: 14, height: 14, borderRadius: 3,
                background: building.color + '60',
                border: `2px solid ${building.color}`,
                flexShrink: 0,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{building.name}</div>
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>
                  {building.coordinates.length} pts • {building.height}m height
                </div>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ))}
        </div>
      )}

      <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: 10, color: '#475569', fontWeight: 500 }}>
        {buildings.length} building{buildings.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

function BuildingDetail({ building, onUpdate, onDeselect, onDelete }) {
  const [name, setName] = useState(building.name);
  const [height, setHeight] = useState(building.height);
  const [baseHeight, setBaseHeight] = useState(building.baseHeight || 0);
  const [color, setColor] = useState(building.color);
  const [roofColor, setRoofColor] = useState(building.roofColor || building.color);
  const [opacity, setOpacity] = useState(building.opacity);

  useEffect(() => {
    setName(building.name);
    setHeight(building.height);
    setBaseHeight(building.baseHeight || 0);
    setColor(building.color);
    setRoofColor(building.roofColor || building.color);
    setOpacity(building.opacity);
  }, [building.id]);

  const handleChange = (key, val) => {
    if (key === 'name') setName(val);
    if (key === 'height') setHeight(val);
    if (key === 'baseHeight') setBaseHeight(val);
    if (key === 'color') setColor(val);
    if (key === 'roofColor') setRoofColor(val);
    if (key === 'opacity') setOpacity(val);
    onUpdate(building.id, { [key]: val });
  };

  return (
    <div style={{ padding: '14px 16px', flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
      {/* Back button */}
      <button onClick={onDeselect} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'none', color: '#94a3b8', fontSize: 11, fontWeight: 500, cursor: 'pointer', padding: 0, marginBottom: 14 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        All Buildings
      </button>

      {/* Building Name */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Name</label>
        <input type="text" value={name}
          onChange={(e) => handleChange('name', e.target.value)}
          style={{
            width: '100%', padding: '8px 10px', borderRadius: 8, boxSizing: 'border-box',
            border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
            color: '#e2e8f0', fontSize: 13, fontWeight: 600, outline: 'none',
          }}
        />
      </div>

      {/* Drag hint */}
      <div style={{ padding: '10px 12px', background: 'rgba(74, 158, 255, 0.06)', border: '1px solid rgba(74, 158, 255, 0.15)', borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid #4a9eff', background: 'rgba(74, 158, 255, 0.3)', flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: '#4a9eff', fontWeight: 500, lineHeight: 1.3 }}>
          Drag corners to reshape • Drag center to move
        </span>
      </div>

      {/* Height */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Height ({height}m)</label>
        <input type="range" min={2} max={100} step={1} value={height}
          onChange={(e) => handleChange('height', Number(e.target.value))}
          style={{ width: '100%', accentColor: '#4a9eff' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#475569', marginTop: 2 }}>
          <span>2m</span><span>100m</span>
        </div>
      </div>

      {/* Base Height */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Base Height ({baseHeight}m)</label>
        <input type="range" min={0} max={50} step={1} value={baseHeight}
          onChange={(e) => handleChange('baseHeight', Number(e.target.value))}
          style={{ width: '100%', accentColor: '#4a9eff' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#475569', marginTop: 2 }}>
          <span>0m</span><span>50m</span>
        </div>
      </div>

      {/* Wall Color */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Wall Color</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="color" value={color}
            onChange={(e) => handleChange('color', e.target.value)}
            style={{ width: 32, height: 32, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'none' }}
          />
          <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>{color}</span>
        </div>
      </div>

      {/* Roof Color */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Roof Color</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="color" value={roofColor}
            onChange={(e) => handleChange('roofColor', e.target.value)}
            style={{ width: 32, height: 32, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'none' }}
          />
          <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>{roofColor}</span>
        </div>
      </div>

      {/* Opacity */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Opacity ({Math.round(opacity * 100)}%)</label>
        <input type="range" min={0.1} max={1} step={0.05} value={opacity}
          onChange={(e) => handleChange('opacity', Number(e.target.value))}
          style={{ width: '100%', accentColor: '#4a9eff' }} />
      </div>

      {/* Vertex list */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Vertices</label>
        {building.coordinates.map(([lat, lng], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4a9eff', opacity: 0.6, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
              {lat.toFixed(5)}, {lng.toFixed(5)}
            </span>
          </div>
        ))}
      </div>

      {/* Delete */}
      <button onClick={() => { onDelete(building.id); onDeselect(); }}
        style={{
          width: '100%', padding: '10px 0', borderRadius: 10,
          border: '1px solid rgba(255, 68, 68, 0.25)',
          background: 'rgba(255, 68, 68, 0.06)',
          color: '#ff4444', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          cursor: 'pointer', transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 68, 68, 0.15)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 68, 68, 0.06)'; }}
      >
        Delete Building
      </button>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 };
