import EditPointFormView from '../view/edit-point-form-view.js';
import EventView from '../view/event-view.js';
import { render, replace, remove } from '../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #eventListContainer = null;
  #eventEditComponent = null;
  #eventComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #tripPoint = null;
  #tripOffers = null;
  #tripDestinations = null;
  #mode = Mode.DEFAULT;


  constructor({eventListContainer, tripOffers, tripDestinations, onDataChange, onModeChange}) {
    this.#eventListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#tripOffers = tripOffers;
    this.#tripDestinations = tripDestinations;
  }

  init(tripPoint) {
    this.#tripPoint = tripPoint;


    const previousEventComponent = this.#eventComponent;
    const previousEventEditComponent = this.#eventEditComponent;


    this.#eventComponent = new EventView({
      tripPoint: this.#tripPoint,
      tripOffers: this.#tripOffers,
      tripDestinations: this.#tripDestinations,
      onEditClick: () => {
        this.#replacePointByForm();
      },
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#eventEditComponent = new EditPointFormView({
      tripPoint: this.#tripPoint,
      tripOffers: this.#tripOffers,
      tripDestinations: this.#tripDestinations,
      onFormSubmit: this.#handleFormSubmit,
      onEditClick: () => {
        this.#replaceFormByPoint();
      }
    });

    if (previousEventComponent === null || previousEventEditComponent === null) {
      render(this.#eventComponent, this.#eventListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, previousEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventEditComponent, previousEventEditComponent);
    }

    remove(previousEventComponent);
    remove(previousEventEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#eventEditComponent.reset(this.#tripPoint);
      this.#replaceFormByPoint();
    }
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
      this.#eventEditComponent.reset(this.#tripPoint);
      this.#replaceFormByPoint();
    }
  };

  #replacePointByForm() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormByPoint() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }
}