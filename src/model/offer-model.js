import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class OfferModel extends Observable {
  #offers = [];

  #pointsApiService = null;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      this.#offers = await this.#pointsApiService.offers;

    } catch(err) {
      this.#offers = [];
      this._notify(UpdateType.ERROR);
      throw new Error('Server unavailable');
    } finally {

      this._notify(UpdateType.OFFERS);
      this._notify(UpdateType.INIT);
    }
  }

}
