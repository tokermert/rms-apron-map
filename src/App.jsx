import { useState, useCallback, useEffect } from 'react';
import MapViewGL from './components/Map/MapViewGL';
import BottomPanel from './components/Dashboard/BottomPanel';
import EditModeToggle from './components/Toolbar/EditModeToggle';
import StandEditorPanel from './components/Editor/StandEditorPanel';
import ApronEditorPanel from './components/Editor/ApronEditorPanel';
import StatusEditorPanel from './components/Editor/StatusEditorPanel';
import OverlayEditorPanel from './components/Editor/OverlayEditorPanel';
import RunwayTaxiwayPanel from './components/Editor/RunwayTaxiwayPanel';
import BuildingEditorPanel from './components/Editor/BuildingEditorPanel';
import { useStandEditor } from './hooks/useStandEditor';
import { useApronEditor } from './hooks/useApronEditor';
import { useStatusConfig } from './hooks/useStatusConfig';
import { useImageOverlay } from './hooks/useImageOverlay';
import { useRunwayTaxiwayEditor } from './hooks/useRunwayTaxiwayEditor';
import { useBuildingEditor } from './hooks/useBuildingEditor';
import { AIRPORT_PRESETS } from './data/airportConfigs';

const STYLE_OPTIONS = [
  { key: 'dark', label: 'Dark 3D' },
  { key: 'satellite', label: 'Satellite' },
  { key: 'googleHybrid', label: 'Google HD' },
  { key: 'esriSat', label: 'ESRI Sat' },
  { key: 'osmRaster', label: 'OSM' },
  { key: 'positron', label: 'Light' },
  { key: 'voyager', label: 'Voyager' },
];

function loadSaved(key, fallback) {
  try {
    const saved = localStorage.getItem('rms-layout');
    if (saved) { const d = JSON.parse(saved); if (d[key] !== undefined) return d[key]; }
  } catch (e) { /* ignore */ }
  return fallback;
}

export default function App() {
  const [tileMode, setTileMode] = useState(() => loadSaved('tileMode', 'dark'));
  const [editMode, setEditMode] = useState(false);
  const [editTab, setEditTab] = useState('stands');
  const [labelOverrides, setLabelOverrides] = useState(() => loadSaved('labelOverrides', {}));
  const [activeAirport, setActiveAirport] = useState(() => loadSaved('activeAirport', 'LTAC'));
  const [saveFlash, setSaveFlash] = useState(false);
  const [hideCityLayers, setHideCityLayers] = useState(true);

  const {
    stands, selectedStandId, selectedStand, addMode,
    selectStand, deselectStand, moveStand, updateStand, addStand, deleteStand, toggleAddMode, exitAddMode,
  } = useStandEditor();

  const {
    aprons, selectedApronId, selectedApron, draggingVertex,
    selectApron, deselectApron, updateVertex, updateApronStyle, moveApron, startDrag, endDrag,
  } = useApronEditor();

  const {
    statusConfig, statusColors, statusLabels,
    updateColor: updateStatusColor, updateLabel: updateStatusLabel,
    addStatus, removeStatus, resetConfig: resetStatusConfig,
  } = useStatusConfig();

  const {
    overlays, selectedOverlayId, selectedOverlay,
    addOverlay, removeOverlay, selectOverlay, deselectOverlay,
    updateOpacity, toggleVisibility, updateCorner, moveOverlay, updateName,
  } = useImageOverlay();

  const {
    features: rwyTwyFeatures, selectedFeatureId: rwyTwySelectedId, selectedFeature: rwyTwySelectedFeature,
    drawMode: rwyTwyDrawMode, drawingPoints: rwyTwyDrawingPoints,
    startDraw: rwyTwyStartDraw, addDrawPoint: rwyTwyAddDrawPoint,
    undoDrawPoint: rwyTwyUndoDrawPoint, finishDraw: rwyTwyFinishDraw, cancelDraw: rwyTwyCancelDraw,
    selectFeature: rwyTwySelectFeature, deselectFeature: rwyTwyDeselectFeature,
    updateFeature: rwyTwyUpdateFeature, moveVertex: rwyTwyMoveVertex,
    deleteFeature: rwyTwyDeleteFeature,
  } = useRunwayTaxiwayEditor();

  const {
    buildings, selectedBuildingId, selectedBuilding,
    drawMode: buildingDrawMode, drawingPoints: buildingDrawingPoints, draggingVertex: buildingDraggingVertex,
    startDraw: buildingStartDraw, addDrawPoint: buildingAddDrawPoint, undoDrawPoint: buildingUndoDrawPoint,
    finishDraw: buildingFinishDraw, cancelDraw: buildingCancelDraw,
    selectBuilding, deselectBuilding, updateBuilding, updateVertex: updateBuildingVertex,
    moveBuilding, deleteBuilding, startDrag: buildingStartDrag, endDrag: buildingEndDrag,
  } = useBuildingEditor();

  const airportConfig = AIRPORT_PRESETS[activeAirport];

  const handleAddOverlay = useCallback((imageUrl, name) => {
    const center = [airportConfig.center.longitude, airportConfig.center.latitude];
    addOverlay(imageUrl, name, center);
  }, [addOverlay, airportConfig]);

  const handleLabelOverride = useCallback((featureKey, data) => {
    setLabelOverrides((prev) => {
      if (data === null) { const next = { ...prev }; delete next[featureKey]; return next; }
      return { ...prev, [featureKey]: data };
    });
  }, []);

  const handleMapClickAdd = useCallback((lat, lng) => addStand(lat, lng), [addStand]);
  const handleStandSelect = useCallback((id) => { if (id) selectStand(id); else deselectStand(); }, [selectStand, deselectStand]);
  const handleApronSelect = useCallback((id) => { if (id) selectApron(id); else deselectApron(); }, [selectApron, deselectApron]);
  const handleBuildingSelect = useCallback((id) => { if (id) { selectBuilding(id); setEditTab('buildings'); } else deselectBuilding(); }, [selectBuilding, deselectBuilding]);

  const buildLayout = useCallback(() => ({
    version: '1.0',
    savedAt: new Date().toISOString(),
    tileMode,
    activeAirport,
    stands: stands.map(({ id, label, apron, lat, lng, heading, type, hasBridge, bridgeAngle, leadInLength }) => ({ id, label, apron, lat, lng, heading, type, hasBridge, bridgeAngle, leadInLength })),
    aprons: aprons.map(({ id, label, color, coordinates, strokeWidth, strokeOpacity, fillOpacity }) => ({ id, label, color, coordinates, strokeWidth, strokeOpacity, fillOpacity })),
    routes: rwyTwyFeatures.map(({ id, name, type, coordinates, color, width, opacity }) => ({ id, name, type, coordinates, color, width, opacity })),
    buildings: buildings.map(({ id, name, coordinates, height, color, roofColor, opacity, baseHeight }) => ({ id, name, coordinates, height, color, roofColor, opacity, baseHeight })),
    statusConfig,
    labelOverrides,
  }), [stands, aprons, rwyTwyFeatures, buildings, statusConfig, labelOverrides, tileMode, activeAirport]);

  const handleSave = useCallback(() => {
    const layout = buildLayout();
    localStorage.setItem('rms-layout', JSON.stringify(layout));
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1500);
  }, [buildLayout]);

  const handleExportLayout = useCallback(() => {
    const layout = buildLayout();
    const blob = new Blob([JSON.stringify(layout, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rms-layout-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [buildLayout]);

  const handleEditModeToggle = useCallback((val) => {
    setEditMode(val);
    if (!val) { deselectStand(); exitAddMode(); deselectApron(); rwyTwyCancelDraw(); rwyTwyDeselectFeature(); buildingCancelDraw(); deselectBuilding(); }
  }, [deselectStand, exitAddMode, deselectApron, rwyTwyCancelDraw, rwyTwyDeselectFeature, buildingCancelDraw, deselectBuilding]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <MapViewGL
        tileMode={tileMode}
        stands={stands}
        editMode={editMode}
        statusColors={statusColors}
        statusLabels={statusLabels}
        labelOverrides={labelOverrides}
        onLabelOverride={handleLabelOverride}
        addMode={addMode}
        onMapClickAdd={handleMapClickAdd}
        onStandSelect={handleStandSelect}
        selectedStandId={selectedStandId}
        aprons={aprons}
        selectedApronId={selectedApronId}
        onApronSelect={handleApronSelect}
        onStandMove={moveStand}
        onApronVertexDrag={updateVertex}
        onApronMove={moveApron}
        draggingVertex={draggingVertex}
        onDragStart={startDrag}
        onDragEnd={endDrag}
        overlays={overlays}
        selectedOverlayId={selectedOverlayId}
        onOverlayCornerDrag={updateCorner}
        onOverlayMove={moveOverlay}
        airportConfig={airportConfig}
        hideCityLayers={hideCityLayers}
        rwyTwyFeatures={rwyTwyFeatures}
        rwyTwyDrawMode={rwyTwyDrawMode}
        rwyTwyDrawingPoints={rwyTwyDrawingPoints}
        rwyTwySelectedId={rwyTwySelectedId}
        onRwyTwyAddPoint={rwyTwyAddDrawPoint}
        onRwyTwyVertexDrag={rwyTwyMoveVertex}
        buildings={buildings}
        selectedBuildingId={selectedBuildingId}
        buildingDrawMode={buildingDrawMode}
        buildingDrawingPoints={buildingDrawingPoints}
        buildingDraggingVertex={buildingDraggingVertex}
        onBuildingAddPoint={buildingAddDrawPoint}
        onBuildingVertexDrag={updateBuildingVertex}
        onBuildingMove={moveBuilding}
        onBuildingSelect={handleBuildingSelect}
        onBuildingDragStart={buildingStartDrag}
        onBuildingDragEnd={buildingEndDrag}
      />

      {/* Style Switcher */}
      <div className="absolute z-[900] flex flex-col rounded-2xl overflow-hidden border"
        style={{ top: 14, right: 14, background: 'rgba(10, 10, 20, 0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderColor: 'rgba(255, 255, 255, 0.06)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)' }}>
        {STYLE_OPTIONS.map((opt, i) => {
          const isActive = tileMode === opt.key;
          return (
            <button key={opt.key} onClick={() => setTileMode(opt.key)} className="cursor-pointer text-left"
              style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 18px', fontSize: 12, fontWeight: 600, letterSpacing: '0.02em', background: isActive ? 'rgba(0, 255, 255, 0.08)' : 'transparent', color: isActive ? '#00ffff' : '#64748b', border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background 0.2s, color 0.2s', minWidth: 110 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: isActive ? '#00ffff' : 'rgba(100, 116, 139, 0.25)', boxShadow: isActive ? '0 0 8px rgba(0, 255, 255, 0.5)' : 'none', transition: 'background 0.2s, box-shadow 0.2s' }} />
              {opt.label}
            </button>
          );
        })}
        {/* Hide city layers toggle */}
        <button onClick={() => setHideCityLayers(!hideCityLayers)} className="cursor-pointer text-left"
          style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 18px', fontSize: 11, fontWeight: 600, letterSpacing: '0.02em', background: hideCityLayers ? 'rgba(168, 85, 247, 0.08)' : 'transparent', color: hideCityLayers ? '#c084fc' : '#475569', border: 'none', transition: 'background 0.2s, color 0.2s' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: hideCityLayers ? '#c084fc' : 'rgba(100, 116, 139, 0.25)', transition: 'background 0.2s' }} />
          {hideCityLayers ? 'Show City' : 'Hide City'}
        </button>
      </div>

      {/* Bottom Dashboard — View mode only */}
      {!editMode && <BottomPanel />}

      {/* Title Badge + Airport Selector */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[900] select-none"
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 20px', borderRadius: 50, background: 'rgba(10, 10, 20, 0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(0, 255, 255, 0.12)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)' }}>
        <div className="animate-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ffff', boxShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#00ffff' }}>RMS Digital Twin</span>
        <span style={{ fontSize: 10, color: '#334155', margin: '0 2px' }}>•</span>
        <select
          value={activeAirport}
          onChange={(e) => setActiveAirport(e.target.value)}
          style={{
            background: 'transparent', border: 'none', color: '#00ffff',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', outline: 'none',
            appearance: 'none', WebkitAppearance: 'none', padding: '0 12px 0 0',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 5 5-5' fill='none' stroke='%2300ffff' stroke-width='1.5'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat', backgroundPosition: 'right center',
          }}
        >
          {Object.values(AIRPORT_PRESETS).map((ap) => (
            <option key={ap.icao} value={ap.icao} style={{ background: '#0a0a14', color: '#e2e8f0' }}>
              {ap.iata} — {ap.city}
            </option>
          ))}
        </select>
      </div>

      {/* View / Edit Toggle */}
      <EditModeToggle editMode={editMode} onToggle={handleEditModeToggle} />

      {/* Edit Mode: Tab Switcher + Panels */}
      {editMode && (
        <div className="absolute z-[900]" style={{ top: 14, left: 14, width: 320, maxHeight: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', background: 'rgba(10, 10, 20, 0.94)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(168, 85, 247, 0.15)', borderRadius: 16, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)', overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, padding: '6px 8px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
            {[{ key: 'stands', label: 'Stands' }, { key: 'aprons', label: 'Aprons' }, { key: 'buildings', label: 'Build' }, { key: 'routes', label: 'Routes' }, { key: 'status', label: 'Status' }, { key: 'overlay', label: 'Overlay' }].map((tab) => (
              <button key={tab.key} onClick={() => { setEditTab(tab.key); deselectStand(); deselectApron(); }}
                style={{ padding: '6px 10px', fontSize: 9, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', border: 'none', borderRadius: 8, whiteSpace: 'nowrap', background: editTab === tab.key ? 'rgba(168, 85, 247, 0.15)' : 'transparent', color: editTab === tab.key ? '#c084fc' : '#64748b', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel Content */}
          {editTab === 'stands' && (
            <StandEditorPanel
              stands={stands} selectedStand={selectedStand} addMode={addMode}
              onToggleAddMode={toggleAddMode} onSelectStand={selectStand}
              onUpdateStand={updateStand} onDeleteStand={deleteStand} onDeselectStand={deselectStand}
            />
          )}
          {editTab === 'aprons' && (
            <ApronEditorPanel
              aprons={aprons} selectedApron={selectedApron}
              onSelectApron={selectApron} onDeselectApron={deselectApron}
              onUpdateStyle={updateApronStyle}
            />
          )}
          {editTab === 'buildings' && (
            <BuildingEditorPanel
              buildings={buildings}
              selectedBuilding={selectedBuilding}
              drawMode={buildingDrawMode}
              drawingPoints={buildingDrawingPoints}
              onStartDraw={buildingStartDraw}
              onFinishDraw={buildingFinishDraw}
              onCancelDraw={buildingCancelDraw}
              onUndoDraw={buildingUndoDrawPoint}
              onSelectBuilding={selectBuilding}
              onDeselectBuilding={deselectBuilding}
              onUpdateBuilding={updateBuilding}
              onDeleteBuilding={deleteBuilding}
            />
          )}
          {editTab === 'routes' && (
            <RunwayTaxiwayPanel
              features={rwyTwyFeatures}
              selectedFeature={rwyTwySelectedFeature}
              drawMode={rwyTwyDrawMode}
              drawingPoints={rwyTwyDrawingPoints}
              onStartDraw={rwyTwyStartDraw}
              onFinishDraw={rwyTwyFinishDraw}
              onCancelDraw={rwyTwyCancelDraw}
              onUndoDrawPoint={rwyTwyUndoDrawPoint}
              onSelectFeature={rwyTwySelectFeature}
              onDeselectFeature={rwyTwyDeselectFeature}
              onUpdateFeature={rwyTwyUpdateFeature}
              onDeleteFeature={rwyTwyDeleteFeature}
            />
          )}
          {editTab === 'status' && (
            <StatusEditorPanel
              statusConfig={statusConfig}
              onUpdateColor={updateStatusColor}
              onUpdateLabel={updateStatusLabel}
              onAddStatus={addStatus}
              onRemoveStatus={removeStatus}
              onReset={resetStatusConfig}
            />
          )}
          {editTab === 'overlay' && (
            <OverlayEditorPanel
              overlays={overlays}
              selectedOverlay={selectedOverlay}
              onAddOverlay={handleAddOverlay}
              onRemoveOverlay={removeOverlay}
              onSelectOverlay={selectOverlay}
              onDeselectOverlay={deselectOverlay}
              onUpdateOpacity={updateOpacity}
              onToggleVisibility={toggleVisibility}
              onUpdateName={updateName}
            />
          )}

          {/* Save + Export Layout */}
          <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button onClick={handleSave}
              style={{ width: '100%', padding: '10px 0', borderRadius: 10, border: saveFlash ? '1px solid rgba(0, 255, 136, 0.5)' : '1px solid rgba(0, 255, 136, 0.25)', background: saveFlash ? 'rgba(0, 255, 136, 0.18)' : 'rgba(0, 255, 136, 0.08)', color: '#00ff88', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 255, 136, 0.18)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = saveFlash ? 'rgba(0, 255, 136, 0.18)' : 'rgba(0, 255, 136, 0.08)'; }}
            >
              {saveFlash ? '✓ Saved!' : '💾 Save Layout'}
            </button>
            <button onClick={handleExportLayout}
              style={{ width: '100%', padding: '8px 0', borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.03)', color: '#64748b', fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; }}
            >
              ⬇ Export JSON
            </button>
          </div>
        </div>
      )}

      {/* Add mode hint */}
      {editMode && addMode && (
        <div className="absolute left-1/2 -translate-x-1/2 z-[900] select-none pointer-events-none"
          style={{ bottom: 24, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 50, background: 'rgba(10, 10, 20, 0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(168, 85, 247, 0.3)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }}>
          <div className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#c084fc', boxShadow: '0 0 6px rgba(192, 132, 252, 0.5)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#c084fc' }}>Click on map to place a new stand</span>
        </div>
      )}

      {/* Building draw mode hint */}
      {editMode && buildingDrawMode && (
        <div className="absolute left-1/2 -translate-x-1/2 z-[900] select-none pointer-events-none"
          style={{ bottom: 24, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 50, background: 'rgba(10, 10, 20, 0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(74, 158, 255, 0.3)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }}>
          <div className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#4a9eff', boxShadow: '0 0 6px rgba(74, 158, 255, 0.5)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#4a9eff' }}>
            Click to place building corners • {buildingDrawingPoints.length} pts
          </span>
        </div>
      )}

      {/* Draw mode hint */}
      {editMode && rwyTwyDrawMode && (
        <div className="absolute left-1/2 -translate-x-1/2 z-[900] select-none pointer-events-none"
          style={{ bottom: 24, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 50, background: 'rgba(10, 10, 20, 0.9)', backdropFilter: 'blur(16px)', border: `1px solid ${rwyTwyDrawMode === 'runway' ? 'rgba(74, 158, 255, 0.3)' : 'rgba(250, 204, 21, 0.3)'}`, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }}>
          <div className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: rwyTwyDrawMode === 'runway' ? '#4a9eff' : '#facc15' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: rwyTwyDrawMode === 'runway' ? '#4a9eff' : '#facc15' }}>
            Click on map to draw {rwyTwyDrawMode} • {rwyTwyDrawingPoints.length} pts
          </span>
        </div>
      )}
    </div>
  );
}
