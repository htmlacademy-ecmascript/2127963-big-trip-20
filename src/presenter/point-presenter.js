import EditPointFormView from '../view/edit-point-form-view.js';
import EventView from '../view/event-view.js';
import { render, replace, remove } from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
import {areDatesEqual} from '../utils/point.js';

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
      onDeleteClick: this.#handleDeleteClick,
      onEditCloseClick: this.#hadleEditCloseClick
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

  #hadleEditCloseClick = () => {
    this.#eventEditComponent.reset(this.#tripPoint);
    this.#replaceFormByPoint();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#tripPoint, isFavorite: !this.#tripPoint.isFavorite}
    );
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate =
    !areDatesEqual(this.#tripPoint.dateFrom, update.dateFrom);

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this.#replaceFormByPoint();
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
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
