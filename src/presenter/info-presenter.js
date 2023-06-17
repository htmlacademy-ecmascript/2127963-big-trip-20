import InfoView from '../view/info-view.js';
import { render, RenderPosition, replace, remove} from '../framework/render.js';

export default class InfoPresenter {
  #infoContainer = null;
  #infoComponent = null;
  #points = null;
  #destinations = null;
  #offers = null;

  constructor ({infoContainer}) {
    this.#infoContainer = infoContainer;
  }

  init(points, destinations, offers) {

    const previousInfoComponent = this.#infoComponent;

    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;

    this.#infoComponent = new InfoView ({
      points: this.#points,
      destinations: this.#destinations,
      offers: this.#offers
    });

    if (previousInfoComponent === null) {
      render(this.#infoComponent, this.#infoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#infoComponent, previousInfoComponent);

    remove(previousInfoComponent);

  }
}


