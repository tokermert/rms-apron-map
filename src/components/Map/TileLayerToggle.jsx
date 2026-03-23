import { TileLayer, useMap } from 'react-leaflet';
import { useEffect } from 'react';

export const TILE_PROVIDERS = {
  dark: {
    label: 'CARTO Dark',
    group: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxNativeZoom: 20,
    maxZoom: 22,
  },
  darkNolabels: {
    label: 'CARTO Dark (No Labels)',
    group: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxNativeZoom: 20,
    maxZoom: 22,
  },
  stadiaSmooth: {
    label: 'Stadia Smooth Dark',
    group: 'Dark',
    url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    maxNativeZoom: 20,
    maxZoom: 22,
  },
  satellite: {
    label: 'Esri Satellite',
    group: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
    maxNativeZoom: 19,
    maxZoom: 22,
  },
  googleSat: {
    label: 'Google Satellite',
    group: 'Satellite',
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attribution: '&copy; Google',
    maxNativeZoom: 21,
    maxZoom: 22,
  },
  googleHybrid: {
    label: 'Google Hybrid',
    group: 'Satellite',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google',
    maxNativeZoom: 21,
    maxZoom: 22,
  },
  osm: {
    label: 'OpenStreetMap',
    group: 'Streets',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxNativeZoom: 19,
    maxZoom: 22,
  },
  cartoLight: {
    label: 'CARTO Light',
    group: 'Streets',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxNativeZoom: 20,
    maxZoom: 22,
  },
};

function BrighterRoadsFilter({ active, mode }) {
  const map = useMap();

  useEffect(() => {
    const tilePane = map.getPane('tilePane');
    if (!tilePane) return;

    const isDark = TILE_PROVIDERS[mode]?.group === 'Dark';
    if (active && isDark) {
      tilePane.style.filter = 'brightness(1.6) contrast(1.1)';
    } else {
      tilePane.style.filter = '';
    }

    return () => {
      tilePane.style.filter = '';
    };
  }, [map, active, mode]);

  return null;
}

export default function TileLayerToggle({ mode, brighterRoads }) {
  const tile = TILE_PROVIDERS[mode] || TILE_PROVIDERS.dark;
  return (
    <>
      <TileLayer
        key={mode}
        url={tile.url}
        attribution={tile.attribution}
        maxZoom={tile.maxZoom}
        maxNativeZoom={tile.maxNativeZoom}
      />
      <BrighterRoadsFilter active={brighterRoads} mode={mode} />
    </>
  );
}
