import { createMockDestinations } from '../mock/mock-data.js';

export default class DestinationModel {
  #destinations = createMockDestinations();

  get destinations () {
    return this.#destinations;
  }

  getSelectedDestination (tripPoint) {
    return this.#destinations.find((destination) => destination.id === tripPoint.destination);
  }
}
