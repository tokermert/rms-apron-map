import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';

const NEON_CLASSES = ['neon-polygon-cyan', 'neon-polygon-yellow', 'neon-polygon-magenta', 'neon-polygon-green'];
let classIndex = 0;

function getNextNeonClass() {
  const cls = NEON_CLASSES[classIndex % NEON_CLASSES.length];
  classIndex++;
  return cls;
}

export function useGeoman({ onLayerCreate, onLayerEdit, onLayerRemove, onLayerSelect }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !map.pm) return;

    map.pm.addControls({
      position: 'topleft',
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: true,
      drawCircle: false,
      drawText: false,
      cutPolygon: false,
      rotateMode: false,
    });

    map.pm.setPathOptions({
      color: '#00ffff',
      fillColor: '#00ffff',
      fillOpacity: 0.1,
      weight: 2,
    });

    const handleCreate = (e) => {
      const layer = e.layer;
      const neonClass = getNextNeonClass();

      if (layer._path) {
        layer._path.classList.add(neonClass);
      }
      layer.options.className = neonClass;

      const shapeType = e.shape;
      const geoJSON = layer.toGeoJSON();
      geoJSON.properties = {
        type: shapeType === 'Rectangle' ? 'stand' : shapeType === 'Line' ? 'line' : 'apron',
        neonClass,
        createdAt: Date.now(),
      };

      layer.on('click', () => {
        onLayerSelect?.(layer);
      });

      layer.on('pm:edit', () => {
        onLayerEdit?.(layer);
      });

      onLayerCreate?.(layer, geoJSON);
    };

    const handleRemove = (e) => {
      onLayerRemove?.(e.layer);
    };

    map.on('pm:create', handleCreate);
    map.on('pm:remove', handleRemove);

    return () => {
      map.off('pm:create', handleCreate);
      map.off('pm:remove', handleRemove);
      try {
        map.pm.removeControls();
      } catch (_) {
        // ignore cleanup errors
      }
    };
  }, [map]);

  return map;
}
