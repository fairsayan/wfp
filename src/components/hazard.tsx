import { Hazard } from '@/models/Hazard';

export interface HazardComponentProps {
  hazard: Hazard;
}

const severityColors = (severity: string) => {
  switch (severity.toUpperCase()) {
    case 'WARNING':
      return 'text-red-600';
    case 'WATCH':
      return 'text-orange-500';
    case 'ADVISORY':
      return 'text-yellow-500';
    case 'INFORMATION':
      return 'text-blue-400';
    default:
      return 'text-gray-500';
  }
};

const HazardComponent: React.FC<HazardComponentProps> = ({ hazard }) => {
  return (
    <div className="max-w-md p-4 shadow-sm rounded-lg text-xs mb-4 bg-white">
      <h2 className="text-base font-bold mb-1">{hazard.name}</h2>
      <p className={`font-semibold ${severityColors(hazard.severity)}`}>
        Severity: {hazard.severity}
      </p>
      <p className="text-gray-600">Type: {hazard.type}</p>

      {/* Footer Section with Dates aligned to the bottom-right */}
      <div className="mt-4 flex justify-end">
        <div className="text-right text-gray-400">
          <p>Created: {new Date(hazard.created).toLocaleDateString()}</p>
          <p>Last Update: {new Date(hazard.lastUpdate).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default HazardComponent;
