const POINT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
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
