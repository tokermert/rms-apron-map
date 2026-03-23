import { useReducer, useCallback } from 'react';

function getInitialState() {
  try {
    const saved = localStorage.getItem('rms-layout');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.buildings && data.buildings.length > 0) {
        return { buildings: data.buildings, selectedBuildingId: null, drawMode: false, drawingPoints: [], draggingVertex: null };
      }
    }
  } catch (e) { /* ignore */ }
  return {
    buildings: [],
    selectedBuildingId: null,
    drawMode: false,
    drawingPoints: [],
    draggingVertex: null,
  };
}

const initialState = getInitialState();

let nextId = Date.now();

function reducer(state, action) {
  switch (action.type) {
    case 'START_DRAW':
      return { ...state, drawMode: true, drawingPoints: [], selectedBuildingId: null };

    case 'ADD_DRAW_POINT':
      return { ...state, drawingPoints: [...state.drawingPoints, { lat: action.lat, lng: action.lng }] };

    case 'UNDO_DRAW_POINT':
      return { ...state, drawingPoints: state.drawingPoints.slice(0, -1) };

    case 'FINISH_DRAW': {
      if (state.drawingPoints.length < 3) return { ...state, drawMode: false, drawingPoints: [] };
      const id = `bldg-${nextId++}`;
      const newBuilding = {
        id,
        name: action.name || `Building ${state.buildings.length + 1}`,
        coordinates: state.drawingPoints.map((p) => [p.lat, p.lng]),
        height: 20,
        color: '#1a3a5c',
        roofColor: '#2a4a6c',
        opacity: 0.85,
        baseHeight: 0,
      };
      return {
        ...state,
        buildings: [...state.buildings, newBuilding],
        drawMode: false,
        drawingPoints: [],
        selectedBuildingId: id,
      };
    }

    case 'CANCEL_DRAW':
      return { ...state, drawMode: false, drawingPoints: [] };

    case 'SELECT_BUILDING':
      return { ...state, selectedBuildingId: action.id };

    case 'DESELECT_BUILDING':
      return { ...state, selectedBuildingId: null };

    case 'UPDATE_BUILDING':
      return {
        ...state,
        buildings: state.buildings.map((b) =>
          b.id === action.id ? { ...b, ...action.updates } : b
        ),
      };

    case 'UPDATE_VERTEX':
      return {
        ...state,
        buildings: state.buildings.map((b) =>
          b.id === action.buildingId
            ? {
                ...b,
                coordinates: b.coordinates.map((c, i) =>
                  i === action.vertexIndex ? [action.lat, action.lng] : c
                ),
              }
            : b
        ),
      };

    case 'MOVE_BUILDING':
      return {
        ...state,
        buildings: state.buildings.map((b) =>
          b.id === action.id
            ? {
                ...b,
                coordinates: b.coordinates.map(([lat, lng]) => [
                  lat + action.dLat,
                  lng + action.dLng,
                ]),
              }
            : b
        ),
      };

    case 'DELETE_BUILDING':
      return {
        ...state,
        buildings: state.buildings.filter((b) => b.id !== action.id),
        selectedBuildingId: state.selectedBuildingId === action.id ? null : state.selectedBuildingId,
      };

    case 'START_DRAG':
      return { ...state, draggingVertex: { buildingId: action.buildingId, vertexIndex: action.vertexIndex } };

    case 'END_DRAG':
      return { ...state, draggingVertex: null };

    default:
      return state;
  }
}

export function useBuildingEditor() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startDraw = useCallback(() => dispatch({ type: 'START_DRAW' }), []);
  const addDrawPoint = useCallback((lat, lng) => dispatch({ type: 'ADD_DRAW_POINT', lat, lng }), []);
  const undoDrawPoint = useCallback(() => dispatch({ type: 'UNDO_DRAW_POINT' }), []);
  const finishDraw = useCallback((name) => dispatch({ type: 'FINISH_DRAW', name }), []);
  const cancelDraw = useCallback(() => dispatch({ type: 'CANCEL_DRAW' }), []);

  const selectBuilding = useCallback((id) => dispatch({ type: 'SELECT_BUILDING', id }), []);
  const deselectBuilding = useCallback(() => dispatch({ type: 'DESELECT_BUILDING' }), []);
  const updateBuilding = useCallback((id, updates) => dispatch({ type: 'UPDATE_BUILDING', id, updates }), []);
  const updateVertex = useCallback((buildingId, vertexIndex, lat, lng) =>
    dispatch({ type: 'UPDATE_VERTEX', buildingId, vertexIndex, lat, lng }), []);
  const moveBuilding = useCallback((id, dLat, dLng) =>
    dispatch({ type: 'MOVE_BUILDING', id, dLat, dLng }), []);
  const deleteBuilding = useCallback((id) => dispatch({ type: 'DELETE_BUILDING', id }), []);
  const startDrag = useCallback((buildingId, vertexIndex) =>
    dispatch({ type: 'START_DRAG', buildingId, vertexIndex }), []);
  const endDrag = useCallback(() => dispatch({ type: 'END_DRAG' }), []);

  const selectedBuilding = state.buildings.find((b) => b.id === state.selectedBuildingId) || null;

  return {
    buildings: state.buildings,
    selectedBuildingId: state.selectedBuildingId,
    selectedBuilding,
    drawMode: state.drawMode,
    drawingPoints: state.drawingPoints,
    draggingVertex: state.draggingVertex,
    startDraw,
    addDrawPoint,
    undoDrawPoint,
    finishDraw,
    cancelDraw,
    selectBuilding,
    deselectBuilding,
    updateBuilding,
    updateVertex,
    moveBuilding,
    deleteBuilding,
    startDrag,
    endDrag,
  };
}
