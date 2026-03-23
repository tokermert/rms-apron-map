import { useReducer, useCallback } from 'react';
import { apronDefinitions } from '../data/esenboğaStands';

function getInitialState() {
  try {
    const saved = localStorage.getItem('rms-layout');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.aprons && data.aprons.length > 0) {
        return { aprons: data.aprons, selectedApronId: null, draggingVertex: null };
      }
    }
  } catch (e) { /* ignore */ }
  return {
    aprons: apronDefinitions.map((a) => ({ ...a, strokeWidth: 2, strokeOpacity: 0.6, fillOpacity: 0.08 })),
    selectedApronId: null,
    draggingVertex: null,
  };
}

const initialState = getInitialState();

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_APRON':
      return { ...state, selectedApronId: action.id };

    case 'DESELECT_APRON':
      return { ...state, selectedApronId: null };

    case 'UPDATE_VERTEX': {
      return {
        ...state,
        aprons: state.aprons.map((a) =>
          a.id === action.apronId
            ? {
                ...a,
                coordinates: a.coordinates.map((c, i) =>
                  i === action.vertexIndex ? [action.lat, action.lng] : c
                ),
              }
            : a
        ),
      };
    }

    case 'UPDATE_APRON_STYLE':
      return {
        ...state,
        aprons: state.aprons.map((a) =>
          a.id === action.id ? { ...a, ...action.updates } : a
        ),
      };

    case 'MOVE_APRON': {
      return {
        ...state,
        aprons: state.aprons.map((a) =>
          a.id === action.id
            ? {
                ...a,
                coordinates: a.coordinates.map(([lat, lng]) => [
                  lat + action.dLat,
                  lng + action.dLng,
                ]),
              }
            : a
        ),
      };
    }

    case 'START_DRAG':
      return { ...state, draggingVertex: { apronId: action.apronId, vertexIndex: action.vertexIndex } };

    case 'END_DRAG':
      return { ...state, draggingVertex: null };

    default:
      return state;
  }
}

export function useApronEditor() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const selectApron = useCallback((id) => dispatch({ type: 'SELECT_APRON', id }), []);
  const deselectApron = useCallback(() => dispatch({ type: 'DESELECT_APRON' }), []);
  const updateVertex = useCallback((apronId, vertexIndex, lat, lng) =>
    dispatch({ type: 'UPDATE_VERTEX', apronId, vertexIndex, lat, lng }), []);
  const updateApronStyle = useCallback((id, updates) =>
    dispatch({ type: 'UPDATE_APRON_STYLE', id, updates }), []);
  const moveApron = useCallback((id, dLat, dLng) =>
    dispatch({ type: 'MOVE_APRON', id, dLat, dLng }), []);
  const startDrag = useCallback((apronId, vertexIndex) =>
    dispatch({ type: 'START_DRAG', apronId, vertexIndex }), []);
  const endDrag = useCallback(() => dispatch({ type: 'END_DRAG' }), []);

  const selectedApron = state.aprons.find((a) => a.id === state.selectedApronId) || null;

  return {
    aprons: state.aprons,
    selectedApronId: state.selectedApronId,
    selectedApron,
    draggingVertex: state.draggingVertex,
    selectApron,
    deselectApron,
    updateVertex,
    updateApronStyle,
    moveApron,
    startDrag,
    endDrag,
  };
}
