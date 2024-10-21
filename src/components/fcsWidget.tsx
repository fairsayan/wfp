import { useEffect, useState } from 'react';
import { FcsInfo } from '@/models/FcsInfo';
import { Hazard } from '@/models/Hazard';
import { Feature } from '@/types';
import africaGeoJson from '@/mocks/africa.json';
import HazardComponent from './hazard';

export interface FcsWidgetComponentProps {
  countrySelected: string;
  hazards: Hazard[];
}

const FcsWidgetComponent: React.FC<FcsWidgetComponentProps> = ({
  countrySelected,
  hazards,
}) => {
  const [data, setData] = useState(null as FcsInfo | null);
  const [isFetching, setFetching] = useState(false);
  const [countryHazards, setCountryHazards] = useState<Hazard[]>([]);

  const fetchData = async () => {
    setFetching(true);
    try {
      const response = await fetch(
        `https://api.hungermapdata.org/v1/foodsecurity/country/${countrySelected}`
      );
      if (response.status !== 200) {
        console.error(response.body);
        throw new Error('response status ' + response.status);
      }
      const result = await response.json();
      const newData: FcsInfo = {
        fcs: result.body.metrics.fcs,
      };
      if (result.body.metrics.rcsi) newData.rcsi = result.body.metrics.rcsi;
      if (result.body.metrics.healthAccess)
        newData.healthAccess = result.body.metrics.healthAccess;
      if (result.body.metrics.marketAccess)
        newData.rcsi = result.body.metrics.marketAccess;

      setData(newData);
    } catch (e) {
      console.error(e);
      setData(null);
    } finally {
      setFetching(false);
    }
  };

  const updateCountryHazards = async () => {
    if (!countrySelected || hazards.length === 0) {
      setCountryHazards([]);
      return;
    }

    const newCountryHazards = [] as Hazard[];
    const { isInCountry } = await import('../utils');

    for (const feature of africaGeoJson.features) {
      if (feature.properties.iso_a3 !== countrySelected) continue;
      for (const hazard of hazards)
        if (isInCountry(hazard, feature as Feature))
          newCountryHazards.push(hazard);

      setCountryHazards(
        newCountryHazards.sort((a, b) => {
          return b.created < a.created ? -1 : 1;
        })
      );
      return;
    }

    console.warn(`"${countrySelected}" not found`);
  };

  useEffect(() => {
    if (!isFetching && countrySelected) fetchData();
  }, [countrySelected]);

  useEffect(() => {
    updateCountryHazards();
  }, [hazards, countrySelected]);

  if (!countrySelected) return null;

  if (isFetching)
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Key Statistics</h2>
        <p className="mb-2">Loading...</p>
      </div>
    );

  const hazardsElements = countryHazards.map((hazard) => (
    <HazardComponent key={hazard.name} hazard={hazard} />
  ));

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Key Statistics</h2>
      {data ? (
        <>
          <p className="mb-2">
            Food Consumption Score: {data.fcs.people} (
            {Math.floor(data.fcs.prevalence * 100)}%)
          </p>
          {data.rcsi && (
            <p className="mb-2">
              Reduced Coping Strategy Index: {data.rcsi.people} (
              {Math.floor(data.rcsi.prevalence * 100)}%)
            </p>
          )}
          {data.healthAccess && (
            <p className="mb-2">
              Health Access: {data.healthAccess.people} (
              {Math.floor(data.healthAccess.prevalence * 100)}%)
            </p>
          )}
          {data.marketAccess && (
            <p className="mb-2">
              Market Access: {data.marketAccess.people} (
              {Math.floor(data.marketAccess.prevalence * 100)}%)
            </p>
          )}
        </>
      ) : (
        <p>No Food Consumption Data</p>
      )}
      {countryHazards.length > 0 && (
        <>
          <br />
          <h2 className="text-lg font-semibold mb-4">Hazards</h2>
          {hazardsElements}
        </>
      )}
    </div>
  );
};

export default FcsWidgetComponent;
