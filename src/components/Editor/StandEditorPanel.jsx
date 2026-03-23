import { useState, useEffect } from 'react';

const APRON_OPTIONS = ['Main Apron', 'East Apron', 'Cargo Apron'];
const TYPE_OPTIONS = ['contact', 'remote', 'cargo'];

export default function StandEditorPanel({
  stands, selectedStand, addMode, onToggleAddMode, onSelectStand, onUpdateStand, onDeleteStand, onDeselectStand,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredStands = searchQuery
    ? stands.filter((s) => s.label.toLowerCase().includes(searchQuery.toLowerCase()) || s.apron.toLowerCase().includes(searchQuery.toLowerCase()))
    : stands;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Add button */}
      <div style={{ padding: '12px 14px 8px' }}>
        <button onClick={onToggleAddMode} style={{
          width: '100%', padding: '9px 0', borderRadius: 10,
          border: addMode ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
          background: addMode ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.04)',
          color: addMode ? '#c084fc' : '#94a3b8', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s',
        }}>
          {addMode ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          )}
          {addMode ? 'Cancel' : 'Add Stand'}
        </button>
      </div>

      {selectedStand ? (
        <StandDetail stand={selectedStand} onUpdate={onUpdateStand} onDelete={onDeleteStand} onDeselect={onDeselectStand} />
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '4px 12px 6px' }}>
            <input type="text" placeholder="Search stands..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.06)', background: 'rgba(255, 255, 255, 0.03)', color: '#e2e8f0', fontSize: 11, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
            {filteredStands.map((stand) => (
              <button key={stand.id} onClick={() => onSelectStand(stand.id)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.03)', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: stand.type === 'contact' ? '#00ffff' : stand.type === 'cargo' ? '#facc15' : '#a855f7', opacity: 0.7, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{stand.label}</div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>{stand.apron} • {stand.type}</div>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: 10, color: '#475569', fontWeight: 500 }}>
        {stands.length} stands
      </div>
    </div>
  );
}

function StandDetail({ stand, onUpdate, onDelete, onDeselect }) {
  const [label, setLabel] = useState(stand.label);
  const [apron, setApron] = useState(stand.apron);
  const [type, setType] = useState(stand.type);
  const [heading, setHeading] = useState(stand.heading);
  const [leadInLength, setLeadInLength] = useState(stand.leadInLength || 80);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => { setLabel(stand.label); setApron(stand.apron); setType(stand.type); setHeading(stand.heading); setLeadInLength(stand.leadInLength || 80); setConfirmDelete(false); }, [stand.id]);

  // Live update heading & leadInLength so map reflects instantly
  const handleHeadingChange = (val) => { setHeading(val); onUpdate(stand.id, { heading: Number(val) }); };
  const handleLeadInChange = (val) => { setLeadInLength(val); onUpdate(stand.id, { leadInLength: Number(val) }); };

  const handleSave = () => onUpdate(stand.id, { label, apron, type, heading: Number(heading), leadInLength: Number(leadInLength) });
  const hasChanges = label !== stand.label || apron !== stand.apron || type !== stand.type;

  return (
    <div style={{ padding: '14px 16px', flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
      <button onClick={onDeselect} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'none', color: '#94a3b8', fontSize: 11, fontWeight: 500, cursor: 'pointer', padding: 0, marginBottom: 14 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        All Stands
      </button>
      <div style={{ marginBottom: 14 }}><label style={labelStyle}>Stand Name</label><input type="text" value={label} onChange={(e) => setLabel(e.target.value)} style={inputStyle} /></div>
      <div style={{ marginBottom: 14 }}><label style={labelStyle}>Apron</label><select value={apron} onChange={(e) => setApron(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>{APRON_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}</select></div>
      <div style={{ marginBottom: 14 }}><label style={labelStyle}>Type</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {TYPE_OPTIONS.map((t) => (
            <button key={t} onClick={() => setType(t)} style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: type === t ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)', background: type === t ? 'rgba(168, 85, 247, 0.12)' : 'rgba(255, 255, 255, 0.03)', color: type === t ? '#c084fc' : '#64748b', fontSize: 11, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Heading ({heading}°)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="range" min={0} max={360} value={heading} onChange={(e) => handleHeadingChange(Number(e.target.value))} style={{ flex: 1, accentColor: '#c084fc' }} />
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid rgba(192, 132, 252, 0.4)', background: 'rgba(192, 132, 252, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" style={{ transform: `rotate(${heading}deg)` }}>
              <line x1="7" y1="7" x2="7" y2="1" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />
              <circle cx="7" cy="7" r="2" fill="#c084fc" opacity="0.5" />
            </svg>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Lead-in Line ({leadInLength}m)</label>
        <input type="range" min={20} max={300} value={leadInLength} onChange={(e) => handleLeadInChange(Number(e.target.value))} style={{ width: '100%', accentColor: '#c084fc' }} />
        <div style={{ fontSize: 10, color: '#475569', marginTop: 2, fontStyle: 'italic' }}>Guidance line length from stand</div>
      </div>

      <div style={{ marginBottom: 16 }}><label style={labelStyle}>Coordinates</label><div style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>{stand.lat.toFixed(6)}, {stand.lng.toFixed(6)}</div></div>
      {hasChanges && <button onClick={handleSave} style={{ width: '100%', padding: '10px 0', borderRadius: 10, border: 'none', background: '#c084fc', color: '#0f0520', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginBottom: 10 }}>Save Changes</button>}
      {!confirmDelete ? (
        <button onClick={() => setConfirmDelete(true)} style={{ width: '100%', padding: '9px 0', borderRadius: 10, border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.06)', color: '#f87171', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Delete Stand</button>
      ) : (
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => { onDelete(stand.id); onDeselect(); }} style={{ flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Confirm Delete</button>
          <button onClick={() => setConfirmDelete(false)} style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.04)', color: '#94a3b8', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
        </div>
      )}
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 };
const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.04)', color: '#e2e8f0', fontSize: 13, fontWeight: 600, outline: 'none', boxSizing: 'border-box' };
