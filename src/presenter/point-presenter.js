import EditPointFormView from '../view/edit-point-form-view.js';
import EventView from '../view/event-view.js';
import { render, replace } from '../framework/render.js';

export default class PointPresenter {
  #eventListContainer = null;
  #pointEditComponent = null;
  #eventComponent = null;

  #tripPoint = null;
  #tripOffers = null;
  #tripDestination = null;


  constructor({eventListContainer}) {
    this.#eventListContainer = eventListContainer;
  }

  init(tripPoint, tripOffers, tripDestination) {
    this.#tripPoint = tripPoint;
    this.#tripOffers = tripOffers;
    this.#tripDestination = tripDestination;


    this.#eventComponent = new EventView({
      tripPoint: this.#tripPoint,
      tripOffers: this.#tripOffers,
      tripDestination: this.#tripDestination,
      onEditClick: () => {
        this.#replacePointByForm();
      }
    });

    this.#pointEditComponent = new EditPointFormView({
      tripPoint: this.#tripPoint,
      tripOffers: this.#tripOffers,
      tripDestination: this.#tripDestination,
      onFormSubmit: () => {
        this.#replaceFormByPoint();
      },
      onEditClick: () => {
        this.#replaceFormByPoint();
      }
    });

    render(this.#eventComponent, this.#eventListContainer);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormByPoint();
    }
  };

  #replacePointByForm() {
    replace(this.#pointEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormByPoint() {
    replace(this.#eventComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }
}
