import { useReducer, useCallback } from 'react';

const initialState = {
  assets: [],
  selectedAssetId: null,
};

function assetReducer(state, action) {
  switch (action.type) {
    case 'ADD_ASSET':
      return {
        ...state,
        assets: [...state.assets, action.payload],
      };
    case 'REMOVE_ASSET':
      return {
        ...state,
        assets: state.assets.filter((a) => a.id !== action.payload),
        selectedAssetId: state.selectedAssetId === action.payload ? null : state.selectedAssetId,
      };
    case 'UPDATE_HEADING':
      return {
        ...state,
        assets: state.assets.map((a) =>
          a.id === action.payload.id ? { ...a, heading: action.payload.heading } : a
        ),
      };
    case 'UPDATE_SCALE':
      return {
        ...state,
        assets: state.assets.map((a) =>
          a.id === action.payload.id ? { ...a, scale: action.payload.scale } : a
        ),
      };
    case 'SELECT_ASSET':
      return { ...state, selectedAssetId: action.payload };
    case 'DESELECT':
      return { ...state, selectedAssetId: null };
    default:
      return state;
  }
}

export function useMapAssets() {
  const [state, dispatch] = useReducer(assetReducer, initialState);

  const addAsset = useCallback((asset) => {
    dispatch({ type: 'ADD_ASSET', payload: { ...asset, scale: asset.scale || 1 } });
  }, []);

  const removeAsset = useCallback((id) => {
    dispatch({ type: 'REMOVE_ASSET', payload: id });
  }, []);

  const updateHeading = useCallback((id, heading) => {
    dispatch({ type: 'UPDATE_HEADING', payload: { id, heading } });
  }, []);

  const updateScale = useCallback((id, scale) => {
    dispatch({ type: 'UPDATE_SCALE', payload: { id, scale } });
  }, []);

  const selectAsset = useCallback((id) => {
    dispatch({ type: 'SELECT_ASSET', payload: id });
  }, []);

  const deselectAsset = useCallback(() => {
    dispatch({ type: 'DESELECT' });
  }, []);

  return {
    assets: state.assets,
    selectedAssetId: state.selectedAssetId,
    addAsset,
    removeAsset,
    updateHeading,
    updateScale,
    selectAsset,
    deselectAsset,
  };
}
