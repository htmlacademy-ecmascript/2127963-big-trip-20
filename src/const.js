const POINT_TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant'
];

const SortType = {
  DAY: 'sort-day',
  PRICE: 'sort-price',
  TIME: 'sort-time',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

export { POINT_TYPES, SortType, FilterType };
