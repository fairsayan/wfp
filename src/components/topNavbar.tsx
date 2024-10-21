import { Menu } from 'lucide-react';
import africanCountries from '@/mocks/africanCountries.json';
import { useMemo } from 'react';

export interface TopNavbarComponentProps {
  toggleSidebar: () => void;
  countrySelected: string;
}

const TopNavbarComponent: React.FC<TopNavbarComponentProps> = ({
  toggleSidebar,
  countrySelected,
}) => {
  const countryName = useMemo(() => {
    if (!countrySelected) return null;

    for (const country of africanCountries) {
      if (country.iso_a3 !== countrySelected) continue;
      return country.name;
    }
    console.warn(`"${countrySelected}" not found`);
    return null;
  }, [countrySelected]);

  const title = countryName
    ? countryName + ' | Food Security Monitor in Africa'
    : 'Food Security Monitor in Africa';

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="rounded-full p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      </div>
    </header>
  );
};

export default TopNavbarComponent;
