import { useReducer, useCallback, useEffect } from 'react';
import { standDefinitions } from '../data/esenboğaStands';

function getInitialState() {
  try {
    const saved = localStorage.getItem('rms-layout');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.stands && data.stands.length > 0) {
        return { stands: data.stands, selectedStandId: null, addMode: false };
      }
    }
  } catch (e) { /* ignore */ }
  return {
    stands: standDefinitions.map((s) => ({ ...s })),
    selectedStandId: null,
    addMode: false,
  };
}

const initialState = getInitialState();

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_STAND':
      return { ...state, selectedStandId: action.id, addMode: false };

    case 'DESELECT_STAND':
      return { ...state, selectedStandId: null };

    case 'MOVE_STAND':
      return {
        ...state,
        stands: state.stands.map((s) =>
          s.id === action.id ? { ...s, lat: action.lat, lng: action.lng } : s
        ),
      };

    case 'UPDATE_STAND':
      return {
        ...state,
        stands: state.stands.map((s) =>
          s.id === action.id ? { ...s, ...action.updates } : s
        ),
      };

    case 'ADD_STAND': {
      const newStand = {
        id: `S${Date.now()}`,
        label: action.label || `N${state.stands.length + 1}`,
        apron: 'Main Apron',
        lat: action.lat,
        lng: action.lng,
        heading: 180,
        type: 'remote',
      };
      return {
        ...state,
        stands: [...state.stands, newStand],
        selectedStandId: newStand.id,
        addMode: false,
      };
    }

    case 'DELETE_STAND':
      return {
        ...state,
        stands: state.stands.filter((s) => s.id !== action.id),
        selectedStandId:
          state.selectedStandId === action.id ? null : state.selectedStandId,
      };

    case 'TOGGLE_ADD_MODE':
      return { ...state, addMode: !state.addMode, selectedStandId: null };

    case 'EXIT_ADD_MODE':
      return { ...state, addMode: false };

    default:
      return state;
  }
}

export function useStandEditor() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const selectStand = useCallback((id) => dispatch({ type: 'SELECT_STAND', id }), []);
  const deselectStand = useCallback(() => dispatch({ type: 'DESELECT_STAND' }), []);
  const moveStand = useCallback((id, lat, lng) => dispatch({ type: 'MOVE_STAND', id, lat, lng }), []);
  const updateStand = useCallback((id, updates) => dispatch({ type: 'UPDATE_STAND', id, updates }), []);
  const addStand = useCallback((lat, lng, label) => dispatch({ type: 'ADD_STAND', lat, lng, label }), []);
  const deleteStand = useCallback((id) => dispatch({ type: 'DELETE_STAND', id }), []);
  const toggleAddMode = useCallback(() => dispatch({ type: 'TOGGLE_ADD_MODE' }), []);
  const exitAddMode = useCallback(() => dispatch({ type: 'EXIT_ADD_MODE' }), []);

  const selectedStand = state.stands.find((s) => s.id === state.selectedStandId) || null;

  return {
    stands: state.stands,
    selectedStandId: state.selectedStandId,
    selectedStand,
    addMode: state.addMode,
    selectStand,
    deselectStand,
    moveStand,
    updateStand,
    addStand,
    deleteStand,
    toggleAddMode,
    exitAddMode,
  };
}
