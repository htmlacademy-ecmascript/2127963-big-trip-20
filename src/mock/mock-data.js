import { getRandomInteger, getRandomArrayElement } from '../utils/utils.js';
import { POINT_TYPES } from '../const.js';
import {nanoid} from 'nanoid';

const PRICE_MIN = 200;
const PRICE_MAX = 1000;
const PHOTO_ID_MIN = 1;
const PHOTO_ID_MAX = 100;
const MOCK_POINTS_NUMBER = 7;
const OFFERS_BY_TYPE_MIN = 0;
const OFFERS_BY_TYPE_MAX = 3;

const DESTINATIONS = [
  'Rome',
  'Lisbon',
  'Berlin',
  'Helsinki',
  'Belgrade',
  'Munich',
  'London',
];

const OFFERS = [
  'Switch to comfort',
  'Add luggage',
  'Add meal',
  'Choose seats',
  'Travel by train',
];

const DESCRIPTIONS = [
  'is a lovely place',
  'is one the most picturesque places in the world',
  'is one of the natural wonders of the world',
  'is a lovely place',
  'is one the most picturesque places in the world',
  'is one of the natural wonders of the world',
  'is a lovely place',
];

const DATES = [
  {
    dateFrom: '2023-07-10T22:35:56',
    dateTo: '2023-07-11T11:22:12',
  },
  {
    dateFrom: '2023-08-08T22:45:56',
    dateTo: '2023-08-11T11:27:13',
  },
  {
    dateFrom: '2023-07-29T11:55:56',
    dateTo: '2023-07-29T13:02:13',
  },
  {
    dateFrom: '2023-07-05T20:55:52',
    dateTo: '2023-07-11T11:22:13',
  },
  {
    dateFrom: '2023-03-12T10:25:57',
    dateTo: '2023-03-14T11:22:13',
  },
  {
    dateFrom: '2023-07-10T10:25:57',
    dateTo: '2023-07-13T11:22:13',
  },
  {
    dateFrom: '2023-07-11T10:25:57',
    dateTo: '2023-07-12T11:22:13',
  },

];

const generatedMockOffers = [];
OFFERS.forEach((offer, i) => {
  const generatedOffer = {
    id: `${i + 1}`,
    title: offer,
    price: getRandomInteger(PRICE_MIN, PRICE_MAX)
  };
  generatedMockOffers.push(generatedOffer);
});

const generateAvailableMockOffers = () => {
  const availableOffers = [];
  const availableOffersNumber = getRandomInteger(OFFERS_BY_TYPE_MIN, OFFERS_BY_TYPE_MAX);

  while (availableOffers.length < availableOffersNumber) {
    const availableOffer = getRandomArrayElement(generatedMockOffers);
    if (!availableOffers.includes(availableOffer)) {
      availableOffers.push(availableOffer);
    }
  }
  return availableOffers;
};

const createMockOffers = () => {
  const mockOffers = [];
  POINT_TYPES.forEach((pointType) => {
    const mockOffer = {
      type: pointType,
      offers: generateAvailableMockOffers()
    };
    mockOffers.push(mockOffer);
  });

  return mockOffers;
};

const createMockDestinations = () => {
  const mockDestinations = [];
  DESTINATIONS.forEach((destination, i) => {
    const mockDestination = {
      id: `${i + 1}`,
      name: destination,
      description: `${destination} ${DESCRIPTIONS[i]}`,
      pictures: [
        {
          src: `https://loremflickr.com/248/152?random=${getRandomInteger(PHOTO_ID_MIN, PHOTO_ID_MAX)}`,
          description: `View of ${destination}.`
        }
      ]
    };
    mockDestinations.push(mockDestination);
  });
  return mockDestinations;

};

const createMockOfferIds = () => {
  const mockOfferIds = [];
  const offerIdsNumber = getRandomInteger(OFFERS_BY_TYPE_MIN, OFFERS_BY_TYPE_MAX);

  while (mockOfferIds.length < offerIdsNumber) {
    const mockOfferId = getRandomInteger(1, OFFERS.length);
    if (!mockOfferIds.includes(String(mockOfferId))) {
      mockOfferIds.push(String(mockOfferId));
    }
  }
  return mockOfferIds;
};

const createMockPoints = () => {
  const mockPoints = [];
  for (let i = 0; i < MOCK_POINTS_NUMBER; i++) {
    const mockPoint = {
      id: nanoid(),
      basePrice: getRandomInteger(PRICE_MIN, PRICE_MAX),
      dateFrom: DATES[i].dateFrom,
      dateTo: DATES[i].dateTo,
      destination: `${i + 1}`,
      isFavorite: getRandomArrayElement([true, false]),
      offers: createMockOfferIds(),
      type: getRandomArrayElement(POINT_TYPES)
    };
    mockPoints.push(mockPoint);
  }
  return mockPoints;

};

const getRandomMockPoint = () => getRandomArrayElement(createMockPoints());

export { createMockOffers, createMockDestinations, getRandomMockPoint };
