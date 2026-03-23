import { useReducer, useCallback } from 'react';

/*
 * Manages custom runway and taxiway polylines drawn by the user.
 * These overlay on top of (or replace) OSM-derived aeroways.
 *
 * Each feature is a polyline with:
 *   - id, name, type ('runway' | 'taxiway')
 *   - coordinates: array of {lat, lng}
 *   - color, width, opacity
 */

const DEFAULT_STYLES = {
  runway: { color: '#4a9eff', width: 8, opacity: 0.85 },
  taxiway: { color: '#facc15', width: 4, opacity: 0.7 },
};

function getInitialState() {
  try {
    const saved = localStorage.getItem('rms-layout');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.routes && data.routes.length > 0) {
        return { features: data.routes, selectedFeatureId: null, drawMode: null, drawingPoints: [] };
      }
    }
  } catch (e) { /* ignore */ }
  return { features: [], selectedFeatureId: null, drawMode: null, drawingPoints: [] };
}

const initialState = getInitialState();

function reducer(state, action) {
  switch (action.type) {
    case 'START_DRAW':
      return { ...state, drawMode: action.featureType, drawingPoints: [], selectedFeatureId: null };

    case 'ADD_DRAW_POINT':
      return { ...state, drawingPoints: [...state.drawingPoints, { lat: action.lat, lng: action.lng }] };

    case 'UNDO_DRAW_POINT':
      return { ...state, drawingPoints: state.drawingPoints.slice(0, -1) };

    case 'FINISH_DRAW': {
      if (state.drawingPoints.length < 2) return { ...state, drawMode: null, drawingPoints: [] };
      const id = `${state.drawMode}-${Date.now()}`;
      const defaults = DEFAULT_STYLES[state.drawMode];
      const feature = {
        id,
        name: state.drawMode === 'runway' ? `RWY ${state.features.filter((f) => f.type === 'runway').length + 1}` : `TWY ${String.fromCharCode(65 + state.features.filter((f) => f.type === 'taxiway').length)}`,
        type: state.drawMode,
        coordinates: [...state.drawingPoints],
        color: defaults.color,
        width: defaults.width,
        opacity: defaults.opacity,
      };
      return {
        ...state,
        features: [...state.features, feature],
        drawMode: null,
        drawingPoints: [],
        selectedFeatureId: id,
      };
    }

    case 'CANCEL_DRAW':
      return { ...state, drawMode: null, drawingPoints: [] };

    case 'SELECT_FEATURE':
      return { ...state, selectedFeatureId: action.id, drawMode: null, drawingPoints: [] };

    case 'DESELECT_FEATURE':
      return { ...state, selectedFeatureId: null };

    case 'UPDATE_FEATURE':
      return {
        ...state,
        features: state.features.map((f) =>
          f.id === action.id ? { ...f, ...action.updates } : f
        ),
      };

    case 'MOVE_VERTEX':
      return {
        ...state,
        features: state.features.map((f) => {
          if (f.id !== action.id) return f;
          const coords = [...f.coordinates];
          coords[action.vertexIndex] = { lat: action.lat, lng: action.lng };
          return { ...f, coordinates: coords };
        }),
      };

    case 'ADD_VERTEX': {
      return {
        ...state,
        features: state.features.map((f) => {
          if (f.id !== action.id) return f;
          const coords = [...f.coordinates];
          coords.splice(action.afterIndex + 1, 0, { lat: action.lat, lng: action.lng });
          return { ...f, coordinates: coords };
        }),
      };
    }

    case 'REMOVE_VERTEX': {
      return {
        ...state,
        features: state.features.map((f) => {
          if (f.id !== action.id || f.coordinates.length <= 2) return f;
          const coords = f.coordinates.filter((_, i) => i !== action.vertexIndex);
          return { ...f, coordinates: coords };
        }),
      };
    }

    case 'DELETE_FEATURE':
      return {
        ...state,
        features: state.features.filter((f) => f.id !== action.id),
        selectedFeatureId: state.selectedFeatureId === action.id ? null : state.selectedFeatureId,
      };

    case 'MOVE_FEATURE': {
      return {
        ...state,
        features: state.features.map((f) => {
          if (f.id !== action.id) return f;
          return {
            ...f,
            coordinates: f.coordinates.map((c) => ({
              lat: c.lat + action.dLat,
              lng: c.lng + action.dLng,
            })),
          };
        }),
      };
    }

    default:
      return state;
  }
}

export function useRunwayTaxiwayEditor() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startDraw = useCallback((featureType) => dispatch({ type: 'START_DRAW', featureType }), []);
  const addDrawPoint = useCallback((lat, lng) => dispatch({ type: 'ADD_DRAW_POINT', lat, lng }), []);
  const undoDrawPoint = useCallback(() => dispatch({ type: 'UNDO_DRAW_POINT' }), []);
  const finishDraw = useCallback(() => dispatch({ type: 'FINISH_DRAW' }), []);
  const cancelDraw = useCallback(() => dispatch({ type: 'CANCEL_DRAW' }), []);

  const selectFeature = useCallback((id) => dispatch({ type: 'SELECT_FEATURE', id }), []);
  const deselectFeature = useCallback(() => dispatch({ type: 'DESELECT_FEATURE' }), []);
  const updateFeature = useCallback((id, updates) => dispatch({ type: 'UPDATE_FEATURE', id, updates }), []);
  const moveVertex = useCallback((id, vertexIndex, lat, lng) => dispatch({ type: 'MOVE_VERTEX', id, vertexIndex, lat, lng }), []);
  const addVertex = useCallback((id, afterIndex, lat, lng) => dispatch({ type: 'ADD_VERTEX', id, afterIndex, lat, lng }), []);
  const removeVertex = useCallback((id, vertexIndex) => dispatch({ type: 'REMOVE_VERTEX', id, vertexIndex }), []);
  const deleteFeature = useCallback((id) => dispatch({ type: 'DELETE_FEATURE', id }), []);
  const moveFeature = useCallback((id, dLat, dLng) => dispatch({ type: 'MOVE_FEATURE', id, dLat, dLng }), []);

  const selectedFeature = state.features.find((f) => f.id === state.selectedFeatureId) || null;

  return {
    features: state.features,
    selectedFeatureId: state.selectedFeatureId,
    selectedFeature,
    drawMode: state.drawMode,
    drawingPoints: state.drawingPoints,
    startDraw, addDrawPoint, undoDrawPoint, finishDraw, cancelDraw,
    selectFeature, deselectFeature, updateFeature,
    moveVertex, addVertex, removeVertex,
    deleteFeature, moveFeature,
  };
}
