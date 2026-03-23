export default function EditModeToggle({ editMode, onToggle }) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-[900] flex items-center rounded-full overflow-hidden border"
      style={{
        top: 56,
        background: 'rgba(10, 10, 20, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderColor: editMode ? 'rgba(168, 85, 247, 0.3)' : 'rgba(0, 255, 255, 0.12)',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        boxShadow: editMode
          ? '0 0 24px rgba(168, 85, 247, 0.08), 0 4px 16px rgba(0, 0, 0, 0.3)'
          : '0 4px 16px rgba(0, 0, 0, 0.3)',
      }}
    >
      <button
        onClick={() => onToggle(false)}
        className="cursor-pointer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '9px 18px',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          background: !editMode ? 'rgba(0, 255, 255, 0.08)' : 'transparent',
          color: !editMode ? '#00ffff' : '#475569',
          border: 'none',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
          transition: 'background 0.2s, color 0.2s',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        View
      </button>
      <button
        onClick={() => onToggle(true)}
        className="cursor-pointer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '9px 18px',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          background: editMode ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
          color: editMode ? '#c084fc' : '#475569',
          border: 'none',
          transition: 'background 0.2s, color 0.2s',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Edit
      </button>
    </div>
  );
}
