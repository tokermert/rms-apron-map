import { useCallback } from 'react';

export function useGeoJsonExport() {
  const exportGeoJson = useCallback((map, assets) => {
    const features = [];

    // Collect Geoman drawn layers
    if (map && map.pm) {
      const layers = map.pm.getGeomanLayers();
      layers.forEach((layer) => {
        if (layer.toGeoJSON) {
          const feature = layer.toGeoJSON();
          if (layer.options?.className) {
            feature.properties = {
              ...feature.properties,
              neonClass: layer.options.className,
            };
          }
          features.push(feature);
        }
      });
    }

    // Collect dropped asset markers
    assets.forEach((asset) => {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [asset.latlng.lng, asset.latlng.lat],
        },
        properties: {
          type: asset.category,
          model: asset.definitionId,
          label: asset.label,
          heading: asset.heading,
        },
      });
    });

    const geoJson = {
      type: 'FeatureCollection',
      features,
      metadata: {
        exportedAt: new Date().toISOString(),
        center: [40.1281, 32.995],
        project: 'RMS Digital Twin',
      },
    };

    return geoJson;
  }, []);

  return { exportGeoJson };
}
