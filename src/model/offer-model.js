import { createMockOffers } from '../mock/mock-data.js';

export default class OfferModel {
  offers = createMockOffers();

  getOffers() {
    return this.offers;
  }

  getOffersByType (tripPoint) {
    const offersByType = this.offers.find((offer) => offer.type === tripPoint.type);
    return offersByType.offers;
  }
}
