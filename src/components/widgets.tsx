import IpcWidgetComponent from './ipcWidget';
import FcsWidgetComponent from './fcsWidget';
import { Hazard } from '@/models/Hazard';

export interface WidgetsComponentProps {
  countrySelected: string;
  hazards: Hazard[];
}

const WidgetsComponent: React.FC<WidgetsComponentProps> = ({
  countrySelected,
  hazards,
}) => {
  return (
    <div className="space-y-4">
      <IpcWidgetComponent countrySelected={countrySelected} />
      <FcsWidgetComponent countrySelected={countrySelected} hazards={hazards} />
    </div>
  );
};

export default WidgetsComponent;
