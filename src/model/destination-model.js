import { createMockDestinations } from '../mock/mock-data.js';

export default class DestinationModel {
  destinations = createMockDestinations();

  getDestinations () {
    return this.destinations;
  }
}
