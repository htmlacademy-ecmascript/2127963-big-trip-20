import { getRandomMockPoint } from '../mock/mock-data.js';
//import { createMockOffers } from '../mock/mock-data.js';

const POINTS_NUMBER = 3;

export default class PointModel {
  points = Array.from({length: POINTS_NUMBER}, getRandomMockPoint);

  getPoints() {
    return this.points;
  }

  //offers = createMockOffers();


  /*getAvailableOffers() {
    const offersByType = this.offers.find((offer) => offer.type === this.points[0].type);
    const availableOffers = offersByType.offers;

    return availableOffers;
  }*/
  /* getOffersByType() {
    const offersByType = this.offers.find((offer) => offer.type === this.points[0].type);


    return offersByType;
  }*/
}
