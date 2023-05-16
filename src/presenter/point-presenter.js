import EditPointFormView from '../view/edit-point-form-view.js';
import EventView from '../view/event-view.js';
import { render, replace, remove } from '../framework/render.js';

export default class PointPresenter {
  #eventListContainer = null;
  #eventEditComponent = null;
  #eventComponent = null;
  #handleDataChange = null;

  #tripPoint = null;
  #tripOffers = null;
  #tripDestination = null;


  constructor({eventListContainer, onDataChange}) {
    this.#eventListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
  }

  init(tripPoint, tripOffers, tripDestination) {
    this.#tripPoint = tripPoint;
    this.#tripOffers = tripOffers;
    this.#tripDestination = tripDestination;

    const previousEventComponent = this.#eventComponent;
    const previousEventEditComponent = this.#eventEditComponent;


    this.#eventComponent = new EventView({
      tripPoint: this.#tripPoint,
      tripOffers: this.#tripOffers,
      tripDestination: this.#tripDestination,
      onEditClick: () => {
        this.#replacePointByForm();
      },
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#eventEditComponent = new EditPointFormView({
      tripPoint: this.#tripPoint,
      tripOffers: this.#tripOffers,
      tripDestination: this.#tripDestination,
      onFormSubmit: this.#handleFormSubmit,
      onEditClick: () => {
        this.#replaceFormByPoint();
      }
    });

    if (previousEventComponent === null || previousEventEditComponent === null) {
      render(this.#eventComponent, this.#eventListContainer);
      return;
    }

    if (this.#eventListContainer.contains(previousEventComponent.element)) {
      replace(this.#eventComponent, previousEventComponent);
    }

    if (this.#eventListContainer.contains(previousEventEditComponent.element)) {
      replace(this.#eventEditComponent, previousEventEditComponent);
    }

    remove(previousEventComponent);
    remove(previousEventEditComponent);
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#tripPoint, isFavorite: !this.#tripPoint.isFavorite});
  };

  #handleFormSubmit = (tripPoint) => {
    this.#handleDataChange(tripPoint);
    this.#replaceFormByPoint();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormByPoint();
    }
  };

  #replacePointByForm() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormByPoint() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }
}
