export const SADC_COUNTRIES = [
  { code: 'US', name: 'United States', currency: 'USD', currencySymbol: '$', timezone: 'America/New_York' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', currencySymbol: 'R', timezone: 'Africa/Johannesburg' },
  { code: 'BW', name: 'Botswana', currency: 'BWP', currencySymbol: 'P', timezone: 'Africa/Gaborone' },
  { code: 'SZ', name: 'Eswatini', currency: 'SZL', currencySymbol: 'E', timezone: 'Africa/Mbabane' },
  { code: 'LS', name: 'Lesotho', currency: 'LSL', currencySymbol: 'L', timezone: 'Africa/Maseru' },
  { code: 'NA', name: 'Namibia', currency: 'NAD', currencySymbol: '$', timezone: 'Africa/Windhoek' },
  { code: 'ZM', name: 'Zambia', currency: 'ZMW', currencySymbol: 'ZK', timezone: 'Africa/Lusaka' },
  { code: 'ZW', name: 'Zimbabwe', currency: 'ZWL', currencySymbol: '$', timezone: 'Africa/Harare' },
  { code: 'MZ', name: 'Mozambique', currency: 'MZN', currencySymbol: 'MT', timezone: 'Africa/Maputo' },
  { code: 'MW', name: 'Malawi', currency: 'MWK', currencySymbol: 'MK', timezone: 'Africa/Blantyre' },
  { code: 'AO', name: 'Angola', currency: 'AOA', currencySymbol: 'Kz', timezone: 'Africa/Luanda' },
  { code: 'TZ', name: 'Tanzania', currency: 'TZS', currencySymbol: 'TSh', timezone: 'Africa/Dar_es_Salaam' },
  { code: 'MU', name: 'Mauritius', currency: 'MUR', currencySymbol: '₨', timezone: 'Indian/Mauritius' },
];

export const getCountryByCode = (code: string) => {
  return SADC_COUNTRIES.find(c => c.code === code) || SADC_COUNTRIES[0];
};

export const getCurrencySymbol = (currencyCode: string) => {
  const country = SADC_COUNTRIES.find(c => c.currency === currencyCode);
  return country?.currencySymbol || '$';
};

export const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatNumber = (num: number) => {
  return num.toLocaleString('en-US');
};