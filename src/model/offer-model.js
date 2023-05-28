import { createMockOffers } from '../mock/mock-data.js';

export default class OfferModel {
  #offers = createMockOffers();

  get offers() {
    return this.#offers;
  }

  /* getOffersByType(tripPoint) { // перенесла эту функциональность во вью, иначе не получается выполнять перерисовку без передачи во вью модели
    const offersByType = this.#offers.find((offer) => offer.type === tripPoint.type);
    return offersByType.offers;
  }*/
}
