import { useReducer, useCallback } from 'react';
import { DEFAULT_STATUS_CONFIG } from '../data/esenboğaStands';

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_COLOR':
      return {
        ...state,
        [action.status]: { ...state[action.status], color: action.color },
      };
    case 'UPDATE_LABEL':
      return {
        ...state,
        [action.status]: { ...state[action.status], label: action.label },
      };
    case 'ADD_STATUS':
      return {
        ...state,
        [action.status]: { label: action.label || action.status, color: action.color || '#888888' },
      };
    case 'REMOVE_STATUS': {
      const next = { ...state };
      delete next[action.status];
      return next;
    }
    case 'RESET':
      return { ...DEFAULT_STATUS_CONFIG };
    default:
      return state;
  }
}

function getInitialStatusConfig() {
  try {
    const saved = localStorage.getItem('rms-layout');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.statusConfig && Object.keys(data.statusConfig).length > 0) {
        return data.statusConfig;
      }
    }
  } catch (e) { /* ignore */ }
  return { ...DEFAULT_STATUS_CONFIG };
}

export function useStatusConfig() {
  const [statusConfig, dispatch] = useReducer(reducer, getInitialStatusConfig());

  const updateColor = useCallback((status, color) => dispatch({ type: 'UPDATE_COLOR', status, color }), []);
  const updateLabel = useCallback((status, label) => dispatch({ type: 'UPDATE_LABEL', status, label }), []);
  const addStatus = useCallback((status, label, color) => dispatch({ type: 'ADD_STATUS', status, label, color }), []);
  const removeStatus = useCallback((status) => dispatch({ type: 'REMOVE_STATUS', status }), []);
  const resetConfig = useCallback(() => dispatch({ type: 'RESET' }), []);

  // Derived maps for backward compatibility
  const statusColors = Object.fromEntries(Object.entries(statusConfig).map(([k, v]) => [k, v.color]));
  const statusLabels = Object.fromEntries(Object.entries(statusConfig).map(([k, v]) => [k, v.label]));

  return {
    statusConfig,
    statusColors,
    statusLabels,
    updateColor,
    updateLabel,
    addStatus,
    removeStatus,
    resetConfig,
  };
}
