import { Polygon, Tooltip } from 'react-leaflet';

export default function ApronOverlay({ apron }) {
  return (
    <Polygon
      positions={apron.coordinates}
      pathOptions={{
        color: apron.color,
        weight: 1.5,
        opacity: 0.5,
        fillColor: apron.color,
        fillOpacity: 0.06,
        dashArray: '6, 4',
        className: `neon-polygon-${apron.color === '#00ffff' ? 'cyan' : apron.color === '#00ff88' ? 'green' : 'yellow'}`,
      }}
    >
      <Tooltip
        permanent
        direction="center"
        className="apron-label"
        offset={[0, 0]}
      >
        <span style={{
          color: apron.color,
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          textShadow: `0 0 10px ${apron.color}80`,
          background: 'transparent',
        }}>
          {apron.label}
        </span>
      </Tooltip>
    </Polygon>
  );
}
