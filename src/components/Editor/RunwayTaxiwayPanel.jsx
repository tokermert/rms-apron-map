import { useState } from 'react';

export default function RunwayTaxiwayPanel({
  features, selectedFeature, drawMode,
  onStartDraw, onFinishDraw, onCancelDraw, onUndoDrawPoint, drawingPoints,
  onSelectFeature, onDeselectFeature, onUpdateFeature, onDeleteFeature,
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'runway' | 'taxiway'

  const filtered = filter === 'all' ? features : features.filter((f) => f.type === filter);
  const runwayCount = features.filter((f) => f.type === 'runway').length;
  const taxiwayCount = features.filter((f) => f.type === 'taxiway').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {drawMode ? (
        <DrawingState
          drawMode={drawMode}
          drawingPoints={drawingPoints}
          onFinish={onFinishDraw}
          onCancel={onCancelDraw}
          onUndo={onUndoDrawPoint}
        />
      ) : selectedFeature ? (
        <FeatureDetail
          feature={selectedFeature}
          onDeselect={onDeselectFeature}
          onUpdate={onUpdateFeature}
          onDelete={onDeleteFeature}
        />
      ) : (
        <>
          {/* Draw buttons */}
          <div style={{ padding: '12px 14px 8px', display: 'flex', gap: 8 }}>
            <button onClick={() => onStartDraw('runway')} style={{ ...drawBtnStyle, borderColor: 'rgba(74, 158, 255, 0.3)', background: 'rgba(74, 158, 255, 0.06)', color: '#4a9eff' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(74, 158, 255, 0.14)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(74, 158, 255, 0.06)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
              Runway
            </button>
            <button onClick={() => onStartDraw('taxiway')} style={{ ...drawBtnStyle, borderColor: 'rgba(250, 204, 21, 0.3)', background: 'rgba(250, 204, 21, 0.06)', color: '#facc15' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(250, 204, 21, 0.14)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(250, 204, 21, 0.06)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
              Taxiway
            </button>
          </div>

          {/* Filter chips */}
          <div style={{ padding: '4px 14px 8px', display: 'flex', gap: 6 }}>
            {[
              { key: 'all', label: `All (${features.length})` },
              { key: 'runway', label: `Runways (${runwayCount})` },
              { key: 'taxiway', label: `Taxiways (${taxiwayCount})` },
            ].map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                style={{
                  padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                  border: filter === f.key ? '1px solid rgba(192, 132, 252, 0.3)' : '1px solid rgba(255,255,255,0.06)',
                  background: filter === f.key ? 'rgba(192, 132, 252, 0.1)' : 'transparent',
                  color: filter === f.key ? '#c084fc' : '#64748b',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >{f.label}</button>
            ))}
          </div>

          {/* Feature list */}
          <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
            {filtered.length === 0 && (
              <div style={{ padding: '16px', fontSize: 11, color: '#475569', fontStyle: 'italic', textAlign: 'center' }}>
                No {filter === 'all' ? 'features' : filter + 's'} yet.<br />Click a button above to draw one.
              </div>
            )}
            {filtered.map((f) => (
              <button key={f.id} onClick={() => onSelectFeature(f.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                  background: 'transparent', cursor: 'pointer', textAlign: 'left',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{
                  width: 24, height: 4, borderRadius: 2, flexShrink: 0,
                  background: f.color, opacity: f.opacity,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{f.name}</div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>
                    {f.type === 'runway' ? '✈ Runway' : '↗ Taxiway'} • {f.coordinates.length} pts • {f.width}px
                  </div>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            ))}
          </div>

          <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: 10, color: '#475569', fontWeight: 500 }}>
            {features.length} feature{features.length !== 1 ? 's' : ''}
          </div>
        </>
      )}
    </div>
  );
}

function DrawingState({ drawMode, drawingPoints, onFinish, onCancel, onUndo }) {
  const typeColor = drawMode === 'runway' ? '#4a9eff' : '#facc15';
  return (
    <div style={{ padding: '16px 14px', flex: 1 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: typeColor, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Drawing {drawMode}
      </div>

      <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>
          <strong style={{ color: '#e2e8f0' }}>Click on map</strong> to add points.<br />
          Minimum 2 points required.
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: typeColor, marginTop: 8 }}>
          {drawingPoints.length} point{drawingPoints.length !== 1 ? 's' : ''} placed
        </div>
      </div>

      {/* Point list */}
      {drawingPoints.length > 0 && (
        <div style={{ marginBottom: 14, maxHeight: 120, overflowY: 'auto', scrollbarWidth: 'thin' }}>
          {drawingPoints.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 10, color: '#64748b' }}>
              <span style={{ width: 16, height: 16, borderRadius: '50%', background: typeColor, color: '#000', fontSize: 8, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
              {p.lat.toFixed(5)}, {p.lng.toFixed(5)}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onUndo} disabled={drawingPoints.length === 0}
          style={{ ...actionBtnStyle, flex: 1, opacity: drawingPoints.length === 0 ? 0.3 : 1 }}>
          ↩ Undo
        </button>
        <button onClick={onFinish} disabled={drawingPoints.length < 2}
          style={{ ...actionBtnStyle, flex: 1, background: `${typeColor}15`, borderColor: `${typeColor}40`, color: typeColor, opacity: drawingPoints.length < 2 ? 0.3 : 1 }}>
          ✓ Finish
        </button>
      </div>
      <button onClick={onCancel} style={{ ...actionBtnStyle, width: '100%', marginTop: 8, background: 'rgba(239, 68, 68, 0.06)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
        ✕ Cancel
      </button>
    </div>
  );
}

function FeatureDetail({ feature, onDeselect, onUpdate, onDelete }) {
  const [name, setName] = useState(feature.name);
  const typeColor = feature.type === 'runway' ? '#4a9eff' : '#facc15';

  return (
    <div style={{ padding: '14px 16px', flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
      <button onClick={onDeselect} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'none', color: '#94a3b8', fontSize: 11, fontWeight: 500, cursor: 'pointer', padding: 0, marginBottom: 14 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        All Features
      </button>

      {/* Type badge */}
      <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: typeColor, background: `${typeColor}15`, border: `1px solid ${typeColor}30`, marginBottom: 14 }}>
        {feature.type === 'runway' ? '✈ Runway' : '↗ Taxiway'}
      </div>

      {/* Name */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Name / Designation</label>
        <input type="text" value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => { if (name.trim()) onUpdate(feature.id, { name: name.trim() }); }}
          onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) { onUpdate(feature.id, { name: name.trim() }); e.target.blur(); } }}
          style={inputStyle} placeholder="e.g. RWY 03L/21R or TWY A" />
      </div>

      {/* Color */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Color</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="color" value={feature.color}
            onChange={(e) => onUpdate(feature.id, { color: e.target.value })}
            style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', background: 'transparent', padding: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', fontFamily: 'monospace' }}>{feature.color}</span>
        </div>
      </div>

      {/* Width */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Width ({feature.width}px)</label>
        <input type="range" min={1} max={20} step={0.5} value={feature.width}
          onChange={(e) => onUpdate(feature.id, { width: Number(e.target.value) })}
          style={{ width: '100%', accentColor: typeColor }} />
      </div>

      {/* Opacity */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Opacity ({Math.round(feature.opacity * 100)}%)</label>
        <input type="range" min={0.1} max={1} step={0.05} value={feature.opacity}
          onChange={(e) => onUpdate(feature.id, { opacity: Number(e.target.value) })}
          style={{ width: '100%', accentColor: typeColor }} />
      </div>

      {/* Vertices */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Vertices ({feature.coordinates.length})</label>
        <div style={{ maxHeight: 100, overflowY: 'auto', scrollbarWidth: 'thin', background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '6px 8px' }}>
          {feature.coordinates.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0', fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>
              <span style={{ width: 14, height: 14, borderRadius: '50%', background: typeColor, color: '#000', fontSize: 7, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
              {c.lat.toFixed(5)}, {c.lng.toFixed(5)}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: '#475569', marginTop: 6, fontStyle: 'italic' }}>
          Drag vertex handles on map to reposition
        </div>
      </div>

      {/* Delete */}
      <button onClick={() => { onDelete(feature.id); onDeselect(); }}
        style={{ ...actionBtnStyle, width: '100%', background: 'rgba(239, 68, 68, 0.06)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
        Delete Feature
      </button>
    </div>
  );
}

const drawBtnStyle = {
  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  padding: '9px 0', borderRadius: 10, border: '1px solid', fontSize: 11, fontWeight: 700,
  letterSpacing: '0.04em', cursor: 'pointer', transition: 'background 0.15s',
};
const actionBtnStyle = {
  padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(168, 85, 247, 0.2)',
  background: 'rgba(168, 85, 247, 0.06)', color: '#c084fc', fontSize: 11,
  fontWeight: 600, cursor: 'pointer',
};
const labelStyle = { display: 'block', fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 };
const inputStyle = {
  width: '100%', padding: '8px 10px', borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
  fontSize: 12, fontWeight: 600, color: '#e2e8f0', outline: 'none', boxSizing: 'border-box',
};
