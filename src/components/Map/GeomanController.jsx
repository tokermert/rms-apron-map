import { useGeoman } from '../../hooks/useGeoman';

export default function GeomanController({ onLayerCreate, onLayerEdit, onLayerRemove, onLayerSelect }) {
  useGeoman({ onLayerCreate, onLayerEdit, onLayerRemove, onLayerSelect });
  return null;
}
