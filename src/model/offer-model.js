import { createMockOffers } from '../mock/mock-data.js';

export default class OfferModel {
  #offers = createMockOffers();

  get offers() {
    return this.#offers;
  }
}
