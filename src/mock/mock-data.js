import { getRandomInteger, getRandomArrayElement } from '../utils';
import { POINT_TYPES } from '../const.js';

const PRICE_MIN = 500;
const PRICE_MAX = 10000;
const PHOTO_ID_MIN = 1;
const PHOTO_ID_MAX = 100;
const MOCK_POINTS_NUMBER = 10;
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
  'Add champagne',
  'Add books',
  'Add breakfast',
  'Add wine & cheese',
  'Business class',
  'Useful advice'
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
/*const createMockOffers = () => {
  const mockOffers = [];
  OFFERS.forEach((offer, i) => {
    const mockOffer = {
      type: getRandomArrayElement(POINT_TYPES),
      offers: [
        {
          id: `${i + 1}`,
          title: offer,
          price: getRandomInteger(PRICE_MIN, PRICE_MAX)
        }
      ]
    };
    mockOffers.push(mockOffer);
  });

  return mockOffers;
};*/

//const getRandomMockOffer = () => getRandomArrayElement(createMockOffers());

const createMockDestinations = () => {
  const mockDestinations = [];
  DESTINATIONS.forEach((destination, i) => {
    const mockDestination = {
      id: `${i}`,
      name: destination,
      description: `${destination} ${DESCRIPTIONS[i]}`,
      pictures: [
        {
          srс: `https://loremflickr.com/248/152?random=${getRandomInteger(PHOTO_ID_MIN, PHOTO_ID_MAX)}`,
          description: `View of ${destination}.`
        }
      ]
    };
    mockDestinations.push(mockDestination);
  });
  return mockDestinations;

};

//const getRandomMockDestination = () => getRandomArrayElement(createMockDestinations());

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
      basePrice: getRandomInteger(PRICE_MIN, PRICE_MAX),
      dateFrom: '2019-07-10T22:55:56.845Z',
      dateTo: '2019-07-11T11:22:13.375Z',
      destination: getRandomArrayElement(DESTINATIONS),
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
