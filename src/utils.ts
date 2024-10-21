import L from 'leaflet';
import leafletPip from 'leaflet-pip';
import { Hazard } from './models/Hazard';
import { Feature } from './types';

export function isInCountry(hazard: Hazard, country: Feature) {
  const hazardLatLng = L.latLng(hazard.latitude, hazard.longitude);
  const geoJsonLayer = L.geoJSON(country);
  const results = leafletPip.pointInLayer(hazardLatLng, geoJsonLayer);

  return results.length > 0;
}
