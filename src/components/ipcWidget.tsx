import ipc from '@/mocks/ipc.json';
import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface IpcWidgetComponentProps {
  countrySelected: string;
}

const IpcWidgetComponent: React.FC<IpcWidgetComponentProps> = ({
  countrySelected,
}) => {
  const data = useMemo(() => {
    if (!countrySelected) return null;

    for (const countryIpc of ipc) {
      if (countryIpc.iso3 !== countrySelected) continue;
      const data = [] as { name: string; value: number }[];
      data.push({ name: 'Phase 3', value: countryIpc.phase_3_number });
      if (countryIpc.phase_3_plus_number)
        data.push({ name: 'Phase 3+', value: countryIpc.phase_3_plus_number });
      data.push({ name: 'Phase 4', value: countryIpc.phase_4_number });
      if (countryIpc.phase_4_plus_number)
        data.push({ name: 'Phase 4+', value: countryIpc.phase_4_plus_number });
      data.push({ name: 'Phase 5', value: countryIpc.phase_5_number });
      return data;
    }
    console.warn(`"${countrySelected}" not found`);
    return null;
  }, [countrySelected]);

  if (!data && countrySelected) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">
        Integrated Food Security Phase Classification
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        {data ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        ) : (
          <div>
            {countrySelected ? 'no data available' : 'please select a Country'}
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default IpcWidgetComponent;
