import { useRef, useCallback, useMemo } from 'react';
import { MapContainer, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import TileLayerToggle, { TILE_PROVIDERS } from './TileLayerToggle';
import GeomanController from './GeomanController';
import AssetMarker from './AssetMarker';
import AirportMask from './AirportMask';
import ApronOverlay from './ApronOverlay';
import StandMarker from './StandMarker';
import CoordPicker from './CoordPicker';
import StandPlacer from './StandPlacer';
import { apronDefinitions, mockFlightData } from '../../data/esenboğaStands';

const ESENBOGA_CENTER = [40.1258, 32.9990];
const DEFAULT_ZOOM = 16;

export default function MapView({
  tileMode,
  airportFocus,
  brighterRoads,
  assets,
  selectedAssetId,
  onAssetDrop,
  onSelectAsset,
  onUpdateHeading,
  onUpdateScale,
  onRemoveAsset,
  onLayerCreate,
  onLayerEdit,
  onLayerRemove,
  onLayerSelect,
  mapRef,
  // Stand editor props
  stands,
  selectedStandId,
  onSelectStand,
  onMoveStand,
  addMode,
  onAddStand,
}) {
  const containerRef = useRef(null);

  // Build a map of standId -> flight
  const flightByStand = useMemo(() => {
    const map = {};
    mockFlightData.forEach((f) => {
      map[f.standId] = f;
    });
    return map;
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const data = e.dataTransfer.getData('application/json');
      if (!data || !mapRef.current) return;

      const assetDef = JSON.parse(data);
      const map = mapRef.current;
      const rect = containerRef.current.getBoundingClientRect();
      const point = L.point(e.clientX - rect.left, e.clientY - rect.top);
      const latlng = map.containerPointToLatLng(point);

      onAssetDrop({
        id: `${assetDef.id}-${Date.now()}`,
        definitionId: assetDef.id,
        label: assetDef.label,
        category: assetDef.category,
        svg: assetDef.svg,
        width: assetDef.width,
        height: assetDef.height,
        latlng: { lat: latlng.lat, lng: latlng.lng },
        heading: 0,
      });
    },
    [onAssetDrop, mapRef]
  );

  return (
    <div
      ref={containerRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        width: '100%', height: '100%',
        cursor: addMode ? 'crosshair' : undefined,
      }}
    >
      <MapContainer
        center={ESENBOGA_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        style={{ width: '100%', height: '100%', background: '#0a0a0f' }}
        ref={mapRef}
      >
        <TileLayerToggle mode={tileMode} brighterRoads={brighterRoads} />
        <AirportMask visible={airportFocus && TILE_PROVIDERS[tileMode]?.group === 'Dark'} />
        <ZoomControl position="bottomright" />

        {/* Apron polygons */}
        {apronDefinitions.map((apron) => (
          <ApronOverlay key={apron.id} apron={apron} />
        ))}

        {/* Stand markers — now from dynamic state */}
        {stands.map((stand) => (
          <StandMarker
            key={stand.id}
            stand={stand}
            flight={flightByStand[stand.id] || null}
            isSelected={selectedStandId === stand.id}
            onSelect={onSelectStand}
            onMove={onMoveStand}
            draggable={true}
          />
        ))}

        {/* Stand placer for add mode */}
        <StandPlacer active={addMode} onPlace={onAddStand} />

        <CoordPicker />
        <GeomanController
          onLayerCreate={onLayerCreate}
          onLayerEdit={onLayerEdit}
          onLayerRemove={onLayerRemove}
          onLayerSelect={onLayerSelect}
        />
        {assets.map((asset) => (
          <AssetMarker
            key={asset.id}
            asset={asset}
            isSelected={selectedAssetId === asset.id}
            onSelect={onSelectAsset}
            onUpdateHeading={onUpdateHeading}
            onUpdateScale={onUpdateScale}
            onRemove={onRemoveAsset}
          />
        ))}
      </MapContainer>
    </div>
  );
}
