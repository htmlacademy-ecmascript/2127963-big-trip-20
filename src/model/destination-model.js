import { createMockDestinations } from '../mock/mock-data.js';

export default class DestinationModel {
  destinations = createMockDestinations();

  getDestinations () {
    return this.destinations;
  }

  getSelectedDestination (tripPoint) {
    const selectedDestination = this.destinations.find((destination) => destination.id === tripPoint.destination);
    return selectedDestination;
  }
}
