'use client';

import africaGeoJson from '@/mocks/africa.json';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import { Feature } from '@/types';
import { Hazard } from '@/models/Hazard';

export interface MapComponentProps {
  onCountryClicked: (featureProperties: Feature['properties']) => void;
  countrySelected: string;
  hazards: Hazard[];
}

const MapComponent: React.FC<MapComponentProps> = ({
  onCountryClicked,
  countrySelected,
  hazards,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!countrySelected || !mapRef.current) return;
    for (const feature of africaGeoJson.features) {
      if (feature.properties.iso_a3 !== countrySelected) continue;
      // @ts-expect-error: not all feature type have bounds (like marks), but all country features we are managing have getBounds
      const bounds = L.geoJSON(feature).getBounds();
      mapRef.current.fitBounds(bounds);
      return;
    }

    console.warn(`"${countrySelected}" not found`);
  });

  useEffect(() => {
    if (!mapRef.current) return;

    if (markersRef.current) {
      markersRef.current.clearLayers();
    }

    markersRef.current = L.layerGroup().addTo(mapRef.current);

    hazards.forEach((hazard) => {
      const marker = L.marker([hazard.latitude, hazard.longitude]).bindPopup(
        `<b>${hazard.name}</b><br>Type: ${hazard.type}<br>Severity: ${hazard.severity}`
      );
      marker.addTo(markersRef.current!);
    });
  }, [hazards]);

  const onEachCountry = (feature: Feature, layer: any) => {
    layer.on({
      click: () => {
        const countryBounds = layer.getBounds();
        if (mapRef.current) mapRef.current.fitBounds(countryBounds);
        onCountryClicked(feature.properties);
      },
    });
  };

  return (
    <MapContainer
      ref={mapRef as any}
      style={{ height: '100vh', width: '100%' }}
      center={[0, 20]}
      zoom={3}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON
        // @ts-expect-error: some features have null geometry
        data={africaGeoJson}
        onEachFeature={onEachCountry}
      />
    </MapContainer>
  );
};

export default MapComponent;
