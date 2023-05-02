import { createMockOffers } from '../mock/mock-data.js';

export default class OfferModel {
  offers = createMockOffers();

  getOffers() {
    return this.offers;
  }
}
