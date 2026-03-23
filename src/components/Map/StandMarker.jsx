import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useCallback, useRef, useMemo } from 'react';
import { STATUS_COLORS, STATUS_LABELS } from '../../data/esenboğaStands';

const AIRCRAFT_SVG = {
  A320: `<svg viewBox="0 0 64 64" fill="none"><rect x="28" y="8" width="8" height="48" rx="4" fill="currentColor" opacity="0.9"/><rect x="6" y="26" width="52" height="6" rx="2" fill="currentColor" opacity="0.7"/><rect x="22" y="4" width="20" height="5" rx="2" fill="currentColor" opacity="0.6"/><rect x="14" y="28" width="4" height="8" rx="1" fill="#facc15" opacity="0.8"/><rect x="46" y="28" width="4" height="8" rx="1" fill="#facc15" opacity="0.8"/></svg>`,
  B737: `<svg viewBox="0 0 64 64" fill="none"><rect x="28" y="10" width="8" height="44" rx="4" fill="currentColor" opacity="0.9"/><rect x="8" y="28" width="48" height="5" rx="2" fill="currentColor" opacity="0.7"/><rect x="24" y="6" width="16" height="5" rx="2" fill="currentColor" opacity="0.6"/><rect x="16" y="30" width="4" height="7" rx="1" fill="#facc15" opacity="0.8"/><rect x="44" y="30" width="4" height="7" rx="1" fill="#facc15" opacity="0.8"/></svg>`,
  A330F: `<svg viewBox="0 0 64 64" fill="none"><rect x="26" y="6" width="12" height="52" rx="6" fill="currentColor" opacity="0.9"/><rect x="4" y="24" width="56" height="7" rx="3" fill="currentColor" opacity="0.7"/><rect x="20" y="2" width="24" height="6" rx="3" fill="currentColor" opacity="0.6"/><rect x="12" y="26" width="5" height="10" rx="1" fill="#facc15" opacity="0.8"/><rect x="47" y="26" width="5" height="10" rx="1" fill="#facc15" opacity="0.8"/></svg>`,
};

function createStandIcon(stand, flight, isSelected) {
  const status = flight ? flight.status : 'empty';
  const color = STATUS_COLORS[status];
  const size = flight ? 38 : 22;
  const selBorder = isSelected ? `; box-shadow: 0 0 0 2px #ff00ff, 0 0 12px #ff00ff80` : '';

  if (!flight) {
    return L.divIcon({
      className: '',
      html: `<div style="
        width: ${size}px; height: ${size}px;
        border: 1.5px dashed ${isSelected ? '#ff00ff' : color};
        border-radius: 4px;
        display: flex; align-items: center; justify-content: center;
        font-size: 9px; font-weight: 700; color: ${isSelected ? '#ff00ff' : color};
        background: rgba(10,10,20,0.6);
        letter-spacing: 0.5px;
        ${isSelected ? 'box-shadow: 0 0 10px #ff00ff80;' : ''}
        cursor: grab;
      ">${stand.label}</div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }

  const svgType = flight.aircraftType.startsWith('A33') ? 'A330F' :
    flight.aircraftType === 'B737' ? 'B737' : 'A320';
  const svg = AIRCRAFT_SVG[svgType].replace(/currentColor/g, color);

  return L.divIcon({
    className: '',
    html: `<div style="position: relative; width: ${size}px; height: ${size}px; cursor: grab;">
      <div style="
        transform: rotate(${stand.heading}deg);
        width: ${size}px; height: ${size}px;
        filter: drop-shadow(0 0 6px ${color}80);
        transition: all 0.3s ease;
        ${isSelected ? `outline: 2px solid #ff00ff; outline-offset: 3px; border-radius: 4px;` : ''}
      ">${svg}</div>
      <div style="
        position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
        background: ${isSelected ? '#ff00ff22' : `${color}22`};
        border: 1px solid ${isSelected ? '#ff00ff66' : `${color}66`};
        color: ${isSelected ? '#ff00ff' : color}; font-size: 8px; font-weight: 800;
        padding: 1px 5px; border-radius: 3px; white-space: nowrap;
        letter-spacing: 0.5px;
        text-shadow: 0 0 8px ${isSelected ? '#ff00ff' : color};
      ">${stand.label}</div>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function ProgressBar({ progress, color }) {
  return (
    <div style={{
      width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)',
      borderRadius: '3px', overflow: 'hidden', marginTop: '6px',
    }}>
      <div style={{
        width: `${progress}%`, height: '100%',
        background: `linear-gradient(90deg, ${color}88, ${color})`,
        borderRadius: '3px', transition: 'width 0.5s ease',
        boxShadow: `0 0 8px ${color}60`,
      }} />
    </div>
  );
}

export default function StandMarker({
  stand,
  flight,
  isSelected,
  onSelect,
  onMove,
  draggable = true,
}) {
  const status = flight ? flight.status : 'empty';
  const color = STATUS_COLORS[status];
  const markerRef = useRef(null);

  const icon = useMemo(
    () => createStandIcon(stand, flight, isSelected),
    [stand, flight, isSelected]
  );

  const eventHandlers = useMemo(
    () => ({
      click(e) {
        if (onSelect) {
          L.DomEvent.stopPropagation(e);
          onSelect(stand.id);
        }
      },
      dragend(e) {
        const marker = e.target;
        const pos = marker.getLatLng();
        if (onMove) {
          onMove(stand.id, pos.lat, pos.lng);
        }
      },
    }),
    [stand.id, onSelect, onMove]
  );

  return (
    <Marker
      ref={markerRef}
      position={[stand.lat, stand.lng]}
      icon={icon}
      draggable={draggable}
      eventHandlers={eventHandlers}
    >
      <Popup className="rotation-popup" offset={[0, -20]} maxWidth={260}>
        <div style={{ minWidth: '220px', fontFamily: 'Inter, system-ui, sans-serif' }}>
          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '10px', paddingBottom: '8px',
            borderBottom: `1px solid ${color}33`,
          }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
                Stand {stand.label}
              </div>
              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                {stand.apron} • {stand.type === 'contact' ? 'Contact' : stand.type === 'remote' ? 'Remote' : 'Cargo'}
              </div>
            </div>
            <div style={{
              padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
              background: `${color}20`, color: color, border: `1px solid ${color}40`,
              textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>
              {STATUS_LABELS[status]}
            </div>
          </div>

          {flight ? (
            <>
              {/* Flight Info */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px',
              }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '6px 8px' }}>
                  <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '2px' }}>FLIGHT</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{flight.callsign}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '6px 8px' }}>
                  <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '2px' }}>AIRCRAFT</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{flight.aircraftType}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '6px 8px' }}>
                  <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '2px' }}>REGISTRATION</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>{flight.registration}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '6px 8px' }}>
                  <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '2px' }}>AIRLINE</div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>{flight.airline}</div>
                </div>
              </div>

              {/* Route */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '8px',
                marginBottom: '10px',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>FROM</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#00ffcc' }}>{flight.origin}</div>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>ETA {flight.eta}</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    height: '1px', background: 'linear-gradient(90deg, #00ffcc44, #00ffcc, #00ffcc44)',
                    margin: '0 4px', position: 'relative',
                  }}>
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                      fontSize: '10px', color: '#00ffcc',
                    }}>✈</div>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>TO</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#00ffcc' }}>{flight.destination}</div>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>ETD {flight.etd}</div>
                </div>
              </div>

              {/* Turnaround Progress */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>TURNAROUND</span>
                  <span style={{ fontSize: '10px', color: color, fontWeight: 700 }}>{flight.progress}%</span>
                </div>
                <ProgressBar progress={flight.progress} color={color} />
                <div style={{
                  display: 'flex', justifyContent: 'space-between', marginTop: '4px',
                  fontSize: '9px', color: '#475569',
                }}>
                  <span>{flight.turnaround} min total</span>
                  <span>{Math.round(flight.turnaround * (100 - flight.progress) / 100)} min remaining</span>
                </div>
              </div>
            </>
          ) : (
            <div style={{
              textAlign: 'center', padding: '16px 0', color: '#475569', fontSize: '12px',
            }}>
              No aircraft assigned
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
