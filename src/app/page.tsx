'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import TopNavbarComponent from '../components/topNavbar';
import SidebarComponent from '../components/sidebar';
import WidgetsComponent from '../components/widgets';
import { Feature } from '@/types';
import { Hazard } from '@/models/Hazard';
import africaGeoJson from '@/mocks/africa.json';

const MapComponent = dynamic(
  () => import('../components/map').then((mod) => mod.default),
  {
    // This prevents server-side rendering of BrowserComponent
    ssr: false,
  }
);

const Home: React.FC = () => {
  const isFetchingHazards = useRef(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [countrySelected, setCountrySelected] = useState('');
  const onCountryClickedOnMap = (featureProperties: Feature['properties']) => {
    setCountrySelected(featureProperties.iso_a3);
  };

  const onCountrySelectedFromMenu = (isoCode: string) => {
    setCountrySelected(isoCode);
  };

  const fetchData = async () => {
    isFetchingHazards.current = true;
    const { isInCountry } = await import('../utils');

    try {
      const response = await fetch(
        'https://api.hungermapdata.org/v1/climate/hazards'
      );
      if (response.status !== 200) {
        console.error(response.body);
        throw new Error('response status ' + response.status);
      }
      const result = await response.json();
      const newHazards: Hazard[] = [];
      for (const hazard of result.body.hazards) {
        const latitude = parseFloat(hazard.latitude);
        const longitude = parseFloat(hazard.longitude);
        const newHazard = {
          ...hazard,
          latitude,
          longitude,
        };

        for (const feature of africaGeoJson.features) {
          if (isInCountry(newHazard, feature as Feature)) {
            newHazards.push(newHazard);
            break;
          }
        }
      }
      setHazards(newHazards);
    } catch (e) {
      console.error(e);
    } finally {
      isFetchingHazards.current = false;
    }
  };

  useEffect(() => {
    if (!isFetchingHazards.current && hazards.length === 0) fetchData();
  }, []);

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <TopNavbarComponent
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        countrySelected={countrySelected}
      />
      <div className="flex flex-1 overflow-hidden">
        <SidebarComponent
          sidebarOpen={sidebarOpen}
          countrySelected={countrySelected}
          onCountryClicked={onCountrySelectedFromMenu}
        />

        <main className="flex-1 overflow-auto p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="col-span-2 bg-white rounded-lg shadow-md overflow-hidden h-[600px]">
              <MapComponent
                onCountryClicked={onCountryClickedOnMap}
                countrySelected={countrySelected}
                hazards={hazards}
              />
            </div>
            <WidgetsComponent
              countrySelected={countrySelected}
              hazards={hazards}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
