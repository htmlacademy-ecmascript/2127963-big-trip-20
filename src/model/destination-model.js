import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class DestinationModel extends Observable {

  #destinations = [];
  #pointsApiService = null;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get destinations () {
    return this.#destinations;
  }

  async init() {
    try {
      this.#destinations = await this.#pointsApiService.destinations;

    } catch(err) {
      this.#destinations = [];
    } finally {

      this._notify(UpdateType.DESTINATIONS);
      this._notify(UpdateType.INIT);
    }
  }

}
