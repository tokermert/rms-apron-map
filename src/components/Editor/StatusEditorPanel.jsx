import { useState } from 'react';

export default function StatusEditorPanel({
  statusConfig, onUpdateColor, onUpdateLabel, onAddStatus, onRemoveStatus, onReset,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newColor, setNewColor] = useState('#888888');

  const entries = Object.entries(statusConfig);

  const handleAdd = () => {
    const key = newKey.trim().toLowerCase().replace(/\s+/g, '_');
    if (!key || statusConfig[key]) return;
    onAddStatus(key, newLabel.trim() || key, newColor);
    setNewKey('');
    setNewLabel('');
    setNewColor('#888888');
    setShowAddForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ padding: '12px 14px 6px', fontSize: 10, color: '#64748b', fontWeight: 500 }}>
        Customize status colors and labels for stand visualization
      </div>

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', padding: '4px 0' }}>
        {entries.map(([key, { label, color }]) => (
          <StatusRow
            key={key}
            statusKey={key}
            label={label}
            color={color}
            isProtected={key === 'empty'}
            onColorChange={(c) => onUpdateColor(key, c)}
            onLabelChange={(l) => onUpdateLabel(key, l)}
            onRemove={() => onRemoveStatus(key)}
          />
        ))}
      </div>

      {/* Add new status */}
      {showAddForm ? (
        <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <input
            type="text"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Status key (e.g. taxi)"
            style={inputStyle}
          />
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Display label (e.g. Taxiing)"
            style={{ ...inputStyle, marginTop: 6 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              style={{ width: 32, height: 28, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
            />
            <button onClick={handleAdd} disabled={!newKey.trim()} style={{ ...btnStyle, flex: 1, opacity: newKey.trim() ? 1 : 0.4 }}>Add Status</button>
            <button onClick={() => setShowAddForm(false)} style={{ ...btnStyle, background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '8px 14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', gap: 8 }}>
          <button onClick={() => setShowAddForm(true)} style={{ ...btnStyle, flex: 1 }}>
            + Add Status
          </button>
          <button onClick={onReset} title="Reset to defaults"
            style={{ ...btnStyle, width: 34, background: 'rgba(255,255,255,0.04)', color: '#64748b', border: '1px solid rgba(255,255,255,0.06)', fontSize: 13 }}>
            ↺
          </button>
        </div>
      )}

      <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: 10, color: '#475569', fontWeight: 500 }}>
        {entries.length} statuses
      </div>
    </div>
  );
}

function StatusRow({ statusKey, label, color, isProtected, onColorChange, onLabelChange, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(label);

  const handleLabelSave = () => {
    if (editLabel.trim() && editLabel.trim() !== label) {
      onLabelChange(editLabel.trim());
    }
    setEditing(false);
  };

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      {/* Color picker */}
      <div style={{ position: 'relative', width: 22, height: 22, flexShrink: 0 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          background: color, border: '2px solid rgba(255,255,255,0.15)',
          boxShadow: `0 0 8px ${color}40`,
        }} />
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            opacity: 0, cursor: 'pointer', border: 'none',
          }}
        />
      </div>

      {/* Label — click to edit */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {editing ? (
          <input
            type="text"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onBlur={handleLabelSave}
            onKeyDown={(e) => { if (e.key === 'Enter') handleLabelSave(); if (e.key === 'Escape') setEditing(false); }}
            autoFocus
            style={{
              width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6, padding: '3px 8px', fontSize: 12, fontWeight: 600, color: '#e2e8f0', outline: 'none',
            }}
          />
        ) : (
          <div onClick={() => { setEditLabel(label); setEditing(true); }} style={{ cursor: 'text' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', lineHeight: 1.2 }}>{label}</div>
            <div style={{ fontSize: 9, color: '#475569', fontFamily: 'monospace', marginTop: 1 }}>{statusKey}</div>
          </div>
        )}
      </div>

      {/* Color hex display */}
      <span style={{ fontSize: 9, color: '#475569', fontFamily: 'monospace', flexShrink: 0 }}>{color}</span>

      {/* Delete button */}
      {!isProtected && (
        <button onClick={onRemove} title="Remove status"
          style={{ width: 20, height: 20, border: 'none', background: 'none', color: '#475569', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; }}
        >
          ×
        </button>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '7px 10px', borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
  fontSize: 12, color: '#e2e8f0', outline: 'none', boxSizing: 'border-box',
};

const btnStyle = {
  padding: '7px 12px', borderRadius: 8, border: '1px solid rgba(168, 85, 247, 0.2)',
  background: 'rgba(168, 85, 247, 0.08)', color: '#c084fc', fontSize: 11,
  fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s',
};
