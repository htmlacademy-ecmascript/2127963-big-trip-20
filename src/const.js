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

const DEFAULT_POINT = {
  //id: '',
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: 'flight',
};

/*const DEFAULT_OFFERS = [
  {
    type: '',
    offers: [
      {
        id: '',
        title: '',
        price: 0
      }
    ]
  }
];

const DEFAULT_DESTINATIONS = [
  {
    id: null,
    name: null,
    description: null,
    pictures: []
  }
];*/

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

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'UPDATE_POINT',
  DELETE_POINT: 'UPDATE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export { POINT_TYPES, SortType, FilterType, UserAction, UpdateType, DEFAULT_POINT/*, DEFAULT_OFFERS, DEFAULT_DESTINATIONS*/ };
