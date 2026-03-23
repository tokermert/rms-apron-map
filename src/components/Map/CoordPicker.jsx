import { useMapEvents } from 'react-leaflet';
import { useState } from 'react';

export default function CoordPicker() {
  const [coords, setCoords] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setCoords({ lat: lat.toFixed(6), lng: lng.toFixed(6) });
      console.log(`[COORD] ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    },
    mousemove(e) {
      const display = document.getElementById('coord-display');
      if (display) {
        display.textContent = `${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
      }
    },
  });

  if (!coords) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '120px',
        right: '10px',
        zIndex: 9999,
        background: 'rgba(10,10,20,0.95)',
        color: '#00ffcc',
        padding: '8px 14px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        border: '1px solid rgba(0,255,200,0.3)',
        pointerEvents: 'none',
      }}
    >
      Last click: {coords.lat}, {coords.lng}
    </div>
  );
}
