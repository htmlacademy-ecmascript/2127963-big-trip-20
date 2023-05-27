import { createMockOffers } from '../mock/mock-data.js';

export default class OfferModel {
  #offers = createMockOffers();

  get offers() {
    return this.#offers;
  }

  getOffersByType(tripPoint) {
    const offersByType = this.#offers.find((offer) => offer.type === tripPoint.type);
    return offersByType.offers;
  }

  getCheckedOffers(tripPoint) {
    return this.getOffersByType(tripPoint).filter((offer) => tripPoint.offers.includes(offer.id));
  }
}
