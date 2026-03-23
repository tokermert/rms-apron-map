import { useMapEvents } from 'react-leaflet';

export default function StandPlacer({ active, onPlace }) {
  useMapEvents({
    click(e) {
      if (!active) return;
      const { lat, lng } = e.latlng;
      onPlace(lat, lng);
    },
  });

  return null;
}
