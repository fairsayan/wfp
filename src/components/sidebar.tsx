import africanCountries from '@/mocks/africanCountries.json';

export interface SidebarComponentProps {
  sidebarOpen: boolean;
  countrySelected: string;
  onCountryClicked: (isoCode: string) => void;
}

const SidebarComponent: React.FC<SidebarComponentProps> = ({
  sidebarOpen,
  onCountryClicked,
  countrySelected,
}) => {
  const handleCountryClick = (country: { name: string; iso_a3: string }) => {
    onCountryClicked(country.iso_a3);
  };

  return (
    <aside
      className={`w-64 h-full overflow-y-auto flex-shrink-0 border-r bg-white transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full hidden'
      }`}
    >
      <div className="p-4 space-y-4">
        <div className="relative">
          <div className="w-full">
            <ul className="divide-y divide-gray-200">
              {africanCountries.map(
                (country: { name: string; iso_a3: string }) => (
                  <li
                    key={country.iso_a3}
                    onClick={() => handleCountryClick(country)}
                    className={`py-2 px-4 cursor-pointer ${
                      countrySelected === country.iso_a3
                        ? 'bg-blue-500 text-white font-semibold'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {country.name}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarComponent;
