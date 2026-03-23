import { useState, useRef } from 'react';

export default function OverlayEditorPanel({
  overlays, selectedOverlay, onAddOverlay, onRemoveOverlay, onSelectOverlay,
  onDeselectOverlay, onUpdateOpacity, onToggleVisibility, onUpdateName,
}) {
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onAddOverlay(e.target.result, file.name.replace(/\.[^.]+$/, ''));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {selectedOverlay ? (
        <OverlayDetail
          overlay={selectedOverlay}
          onDeselect={onDeselectOverlay}
          onUpdateOpacity={onUpdateOpacity}
          onToggleVisibility={onToggleVisibility}
          onUpdateName={onUpdateName}
          onRemove={onRemoveOverlay}
        />
      ) : (
        <>
          {/* Upload area */}
          <div
            onClick={() => fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            style={{
              margin: '12px 14px', padding: '20px 14px', borderRadius: 12,
              border: `2px dashed ${dragOver ? '#c084fc' : 'rgba(255, 255, 255, 0.1)'}`,
              background: dragOver ? 'rgba(168, 85, 247, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 6, opacity: 0.5 }}>🗺️</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#c084fc', marginBottom: 4 }}>
              Upload Reference Chart
            </div>
            <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.4 }}>
              Jeppesen chart, satellite screenshot,<br />or airport diagram (PNG/JPG)
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={(e) => { handleFile(e.target.files[0]); e.target.value = ''; }} />
          </div>

          {/* Overlay list */}
          <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
            {overlays.length === 0 && (
              <div style={{ padding: '12px 16px', fontSize: 10, color: '#475569', fontStyle: 'italic' }}>
                No overlays yet. Upload an image to get started.
              </div>
            )}
            {overlays.map((ov) => (
              <button key={ov.id} onClick={() => onSelectOverlay(ov.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                  background: 'transparent', cursor: 'pointer', textAlign: 'left',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Thumbnail */}
                <div style={{
                  width: 32, height: 24, borderRadius: 4, overflow: 'hidden', flexShrink: 0,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <img src={ov.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ov.name}
                  </div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>
                    Opacity {Math.round(ov.opacity * 100)}% • {ov.visible ? 'Visible' : 'Hidden'}
                  </div>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            ))}
          </div>
        </>
      )}

      <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: 10, color: '#475569', fontWeight: 500 }}>
        {overlays.length} overlay{overlays.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

function OverlayDetail({ overlay, onDeselect, onUpdateOpacity, onToggleVisibility, onUpdateName, onRemove }) {
  const [name, setName] = useState(overlay.name);

  return (
    <div style={{ padding: '14px 16px', flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
      <button onClick={onDeselect} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'none', color: '#94a3b8', fontSize: 11, fontWeight: 500, cursor: 'pointer', padding: 0, marginBottom: 14 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        All Overlays
      </button>

      {/* Thumbnail */}
      <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', marginBottom: 14 }}>
        <img src={overlay.imageUrl} alt="" style={{ width: '100%', maxHeight: 120, objectFit: 'cover' }} />
      </div>

      {/* Name */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Name</label>
        <input type="text" value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => { if (name.trim()) onUpdateName(overlay.id, name.trim()); }}
          onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) { onUpdateName(overlay.id, name.trim()); e.target.blur(); } }}
          style={inputStyle} />
      </div>

      {/* Opacity */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Opacity ({Math.round(overlay.opacity * 100)}%)</label>
        <input type="range" min={0} max={1} step={0.05} value={overlay.opacity}
          onChange={(e) => onUpdateOpacity(overlay.id, Number(e.target.value))}
          style={{ width: '100%', accentColor: '#c084fc' }} />
      </div>

      {/* Hint */}
      <div style={{ padding: '10px 12px', background: 'rgba(168, 85, 247, 0.06)', border: '1px solid rgba(168, 85, 247, 0.15)', borderRadius: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 11, color: '#c084fc', fontWeight: 500, lineHeight: 1.4 }}>
          Drag 4 corner handles to align the image with the map. Use center ✦ to move the whole overlay.
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onToggleVisibility(overlay.id)}
          style={{ ...btnStyle, flex: 1 }}>
          {overlay.visible ? '👁 Hide' : '👁‍🗨 Show'}
        </button>
        <button onClick={() => { onRemove(overlay.id); onDeselect(); }}
          style={{ ...btnStyle, background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
          Delete
        </button>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 };
const inputStyle = {
  width: '100%', padding: '8px 10px', borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
  fontSize: 12, fontWeight: 600, color: '#e2e8f0', outline: 'none', boxSizing: 'border-box',
};
const btnStyle = {
  padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(168, 85, 247, 0.2)',
  background: 'rgba(168, 85, 247, 0.08)', color: '#c084fc', fontSize: 11,
  fontWeight: 600, cursor: 'pointer',
};
