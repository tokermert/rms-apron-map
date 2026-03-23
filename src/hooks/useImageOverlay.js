import { useReducer, useCallback } from 'react';

const initialState = {
  overlays: [],
  selectedOverlayId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_OVERLAY': {
      const id = `overlay-${Date.now()}`;
      return {
        ...state,
        overlays: [...state.overlays, {
          id,
          name: action.name || 'Reference Chart',
          imageUrl: action.imageUrl,
          // Default bounds — placed around airport center, user drags corners to fit
          bounds: action.bounds || {
            topLeft: [action.center[1] + 0.004, action.center[0] - 0.005],     // [lat, lng]
            topRight: [action.center[1] + 0.004, action.center[0] + 0.005],
            bottomRight: [action.center[1] - 0.004, action.center[0] + 0.005],
            bottomLeft: [action.center[1] - 0.004, action.center[0] - 0.005],
          },
          opacity: 0.5,
          visible: true,
        }],
        selectedOverlayId: id,
      };
    }
    case 'REMOVE_OVERLAY':
      return {
        ...state,
        overlays: state.overlays.filter((o) => o.id !== action.id),
        selectedOverlayId: state.selectedOverlayId === action.id ? null : state.selectedOverlayId,
      };
    case 'SELECT_OVERLAY':
      return { ...state, selectedOverlayId: action.id };
    case 'DESELECT_OVERLAY':
      return { ...state, selectedOverlayId: null };
    case 'UPDATE_OPACITY':
      return {
        ...state,
        overlays: state.overlays.map((o) =>
          o.id === action.id ? { ...o, opacity: action.opacity } : o
        ),
      };
    case 'TOGGLE_VISIBILITY':
      return {
        ...state,
        overlays: state.overlays.map((o) =>
          o.id === action.id ? { ...o, visible: !o.visible } : o
        ),
      };
    case 'UPDATE_CORNER': {
      return {
        ...state,
        overlays: state.overlays.map((o) => {
          if (o.id !== action.id) return o;
          const bounds = { ...o.bounds };
          bounds[action.corner] = [action.lat, action.lng];
          return { ...o, bounds };
        }),
      };
    }
    case 'MOVE_OVERLAY': {
      return {
        ...state,
        overlays: state.overlays.map((o) => {
          if (o.id !== action.id) return o;
          const bounds = {
            topLeft: [o.bounds.topLeft[0] + action.dLat, o.bounds.topLeft[1] + action.dLng],
            topRight: [o.bounds.topRight[0] + action.dLat, o.bounds.topRight[1] + action.dLng],
            bottomRight: [o.bounds.bottomRight[0] + action.dLat, o.bounds.bottomRight[1] + action.dLng],
            bottomLeft: [o.bounds.bottomLeft[0] + action.dLat, o.bounds.bottomLeft[1] + action.dLng],
          };
          return { ...o, bounds };
        }),
      };
    }
    case 'UPDATE_NAME':
      return {
        ...state,
        overlays: state.overlays.map((o) =>
          o.id === action.id ? { ...o, name: action.name } : o
        ),
      };
    default:
      return state;
  }
}

export function useImageOverlay() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addOverlay = useCallback((imageUrl, name, center) => {
    dispatch({ type: 'ADD_OVERLAY', imageUrl, name, center });
  }, []);

  const removeOverlay = useCallback((id) => dispatch({ type: 'REMOVE_OVERLAY', id }), []);
  const selectOverlay = useCallback((id) => dispatch({ type: 'SELECT_OVERLAY', id }), []);
  const deselectOverlay = useCallback(() => dispatch({ type: 'DESELECT_OVERLAY' }), []);
  const updateOpacity = useCallback((id, opacity) => dispatch({ type: 'UPDATE_OPACITY', id, opacity }), []);
  const toggleVisibility = useCallback((id) => dispatch({ type: 'TOGGLE_VISIBILITY', id }), []);
  const updateCorner = useCallback((id, corner, lat, lng) => dispatch({ type: 'UPDATE_CORNER', id, corner, lat, lng }), []);
  const moveOverlay = useCallback((id, dLat, dLng) => dispatch({ type: 'MOVE_OVERLAY', id, dLat, dLng }), []);
  const updateName = useCallback((id, name) => dispatch({ type: 'UPDATE_NAME', id, name }), []);

  return {
    overlays: state.overlays,
    selectedOverlayId: state.selectedOverlayId,
    selectedOverlay: state.overlays.find((o) => o.id === state.selectedOverlayId) || null,
    addOverlay, removeOverlay, selectOverlay, deselectOverlay,
    updateOpacity, toggleVisibility, updateCorner, moveOverlay, updateName,
  };
}
