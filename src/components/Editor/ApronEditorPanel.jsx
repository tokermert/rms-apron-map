import { useState, useEffect } from 'react';

export default function ApronEditorPanel({
  aprons, selectedApron, onSelectApron, onDeselectApron, onUpdateStyle,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {selectedApron ? (
        <ApronDetail apron={selectedApron} onUpdate={onUpdateStyle} onDeselect={onDeselectApron} />
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
          <div style={{ padding: '12px 14px 6px', fontSize: 10, color: '#64748b', fontWeight: 500 }}>
            Select an apron to edit its shape and stroke
          </div>
          {aprons.map((apron) => (
            <button key={apron.id} onClick={() => onSelectApron(apron.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.03)', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, border: `2px solid ${apron.color}`, opacity: 0.8, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{apron.label}</div>
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>{apron.coordinates.length} vertices • stroke {apron.strokeWidth}px</div>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          ))}
        </div>
      )}

      <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: 10, color: '#475569', fontWeight: 500 }}>
        {aprons.length} aprons
      </div>
    </div>
  );
}

function ApronDetail({ apron, onUpdate, onDeselect }) {
  const [strokeWidth, setStrokeWidth] = useState(apron.strokeWidth || 2);
  const [strokeOpacity, setStrokeOpacity] = useState(apron.strokeOpacity || 0.6);
  const [fillOpacity, setFillOpacity] = useState(apron.fillOpacity || 0.08);

  useEffect(() => {
    setStrokeWidth(apron.strokeWidth || 2);
    setStrokeOpacity(apron.strokeOpacity || 0.6);
    setFillOpacity(apron.fillOpacity || 0.08);
  }, [apron.id]);

  const handleChange = (key, val) => {
    if (key === 'strokeWidth') setStrokeWidth(val);
    if (key === 'strokeOpacity') setStrokeOpacity(val);
    if (key === 'fillOpacity') setFillOpacity(val);
    onUpdate(apron.id, { [key]: val });
  };

  return (
    <div style={{ padding: '14px 16px', flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
      <button onClick={onDeselect} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'none', color: '#94a3b8', fontSize: 11, fontWeight: 500, cursor: 'pointer', padding: 0, marginBottom: 14 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        All Aprons
      </button>

      {/* Apron Name + Color */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 20, height: 20, borderRadius: 4, border: `2.5px solid ${apron.color}`, background: apron.color + '20' }} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>{apron.label}</div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>{apron.coordinates.length} corner points</div>
        </div>
      </div>

      {/* Drag hint */}
      <div style={{ padding: '10px 12px', background: 'rgba(168, 85, 247, 0.06)', border: '1px solid rgba(168, 85, 247, 0.15)', borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid #c084fc', background: 'rgba(168, 85, 247, 0.3)', flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: '#c084fc', fontWeight: 500, lineHeight: 1.3 }}>
          Drag corners to reshape • Drag center ✦ to move entire apron
        </span>
      </div>

      {/* Stroke Width */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Stroke Width ({strokeWidth}px)</label>
        <input type="range" min={0.5} max={8} step={0.5} value={strokeWidth}
          onChange={(e) => handleChange('strokeWidth', Number(e.target.value))}
          style={{ width: '100%', accentColor: apron.color }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#475569', marginTop: 2 }}>
          <span>0.5</span><span>8</span>
        </div>
      </div>

      {/* Stroke Opacity */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Border Opacity ({Math.round(strokeOpacity * 100)}%)</label>
        <input type="range" min={0} max={1} step={0.05} value={strokeOpacity}
          onChange={(e) => handleChange('strokeOpacity', Number(e.target.value))}
          style={{ width: '100%', accentColor: apron.color }} />
      </div>

      {/* Fill Opacity */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Fill Opacity ({Math.round(fillOpacity * 100)}%)</label>
        <input type="range" min={0} max={0.5} step={0.01} value={fillOpacity}
          onChange={(e) => handleChange('fillOpacity', Number(e.target.value))}
          style={{ width: '100%', accentColor: apron.color }} />
      </div>

      {/* Vertex list */}
      <div style={{ marginBottom: 8 }}>
        <label style={labelStyle}>Vertices</label>
        {apron.coordinates.map(([lat, lng], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: apron.color, opacity: 0.6, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
              {lat.toFixed(5)}, {lng.toFixed(5)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 };
