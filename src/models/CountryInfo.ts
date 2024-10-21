export interface CountryInfo {
  country: {
    id: number;
    name: string;
    iso3: string;
    iso2: string;
  };
  population: {
    number: number;
    year: string;
    source: string;
  };
  chronic_hunger: string | null;
  malnutrition: string | null;
  income_group: {
    level: string;
  };
}
