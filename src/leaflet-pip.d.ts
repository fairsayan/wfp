declare module 'leaflet-pip' {
  import * as L from 'leaflet';

  // Definizione della funzione pointInLayer
  export function pointInLayer(
    latlng: L.LatLng,
    layer: L.Layer,
    first?: boolean
  ): L.Layer[];
}
